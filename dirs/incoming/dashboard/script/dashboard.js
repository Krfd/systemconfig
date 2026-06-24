$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $("#incoming_content").html(spinner);
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);

    $("#incomingTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadIncoming(() => {
      $("#incomingTableDisplay").DataTable({
        pageLength: 50,
        order: [0, "desc"],
      });
    });
  });
  cancelPicklist();
}

$.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
  return this.api()
    .column(col, { order: "index" })
    .nodes()
    .map(function (td) {
      if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
      return $(td).text();
    });
};

function loadIncoming() {
  $.ajax({
    url: "dirs/incoming/dashboard/actions/get_incoming.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let existingSeries = new Set();
      let index = 1;
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          if (existingSeries.has(item.SR_Number)) {
            return;
          }

          existingSeries.add(item.SR_Number);

          let status = item.RequestStatus
            ? item.RequestStatus.toUpperCase()
            : "";

          if (status === "CANCELLED" || status === "REJECTED") {
            return;
          }

          let statusClass = "";

          if (status === "NEW" || status === "IN TRANSIT") {
            statusClass = "bg-primary";
          } else if (status === "PARTIAL") {
            statusClass = "bg-warning";
          } else if (status === "RECEIVED") {
            status = "DELIVERED";
            statusClass = "bg-success";
          } else if (status === "TERMINATED") {
            statusClass = "bg-secondary";
          } else if (status === "PROCESSING") {
            statusClass = "bg-info";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          if (existingSeries.has(item.RowNum)) {
            return;
          }

          existingSeries.add(item.RowNum);

          const isDisabled =
            item.PKList_Number && item.PKList_Number.trim() !== ""
              ? "disabled"
              : "";

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.RowNum}" data-srnumber="${item.SR_Number}" data-docentry="${item.DocEntry}" data-docstatus="${item.DocStatus}"
            class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,
            index++,
            item.SR_Number || "",
            item.BranchDestination || "",
            statusBadge,
            // item.EncodeDate || "",
            item.EncodeDate
              ? new Date(item.EncodeDate)
                  .toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })
                  .replace(/\//g, "-")
              : "",
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#incomingTableDisplay")) {
          $("#incomingTableDisplay").DataTable().clear().destroy();
          $("#incomingTableDisplay tbody").empty();
        }

        $("#incomingTableDisplay").DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
            { title: "#" },
            { title: "SRN" },
            { title: "Requesting Branch" },
            { title: "Status" },
            { title: "Date", className: "text-start" },
          ],
          pageLength: 25,
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          language: {
            emptyTable: "",
          },
          rowCallback: function (row, data, index) {
            $("td:not(:first-child)", row).css({
              // background: "#FFFBDF",
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(1)", row).addClass("text-start ps-3");
            $("td:eq(2)", row).addClass("text-primary");
            $("td:eq(6)", row).addClass("text-start");

            // Hover effect
            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                // $(this).css("background", "#FFFBDF");
                $(this).css("background", "#fcf7d4");
              },
            );
          },
          drawCallback: function () {
            let tableBody = $("#incomingTableDisplay tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                <tr class="empty-row">
                  <td></td>
                  <td colspan="5" style="background:#fcf7d4"></td>
                </tr>
              `);
              $($emptyRow).css({
                // background: "#FFFBDF",
                background: "#fcf7d4",
                height: "40px",
                "min-height": "40px",
              });
              $emptyRow.hover(
                function () {
                  $("td:not(:first-child)", this).css("background", "#FFF4C2");
                },
                function () {
                  // $("td:not(:first-child)", this).css("background", "#FFFBDF");
                  $("td:not(:first-child)", this).css("background", "#fcf7d4");
                },
              );
              tableBody.append($emptyRow);
            }
          },
        });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading incoming data: ", error);
    },
  });
}

function toggleCheckboxes() {
  const createPicklistBtn = document.getElementById("createPicklistBtn");
  const checkAllBtn = document.getElementById("checkAllBtn");
  const DocEntries = [];
  const SRNumbers = [];

  const selectionMode =
    $("#incomingTableDisplay tbody .checkbox:visible").length > 0;
  $("#incomingTableDisplay tbody .checkbox:checked").each(function () {
    DocEntries.push($(this).data("docentry"));
    SRNumbers.push($(this).data("srnumber"));
  });

  if (!selectionMode) {
    let availableRows = 0;

    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim();
      const picklistNo = row.find("td:eq(7)").text().trim();
      const statusText = row.find("td:eq(4)").text().trim().toUpperCase();

      if (
        srnText.startsWith("SRN")
        // && picklistNo === ""
        // && statusText === "NEW"
      ) {
        availableRows++;
      }
    });

    if (availableRows === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Available Request(s)",
        text: "All request(s) are currently unavailable.",
        confirmButtonText: "OKAY",
      });
      return;
    }

    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim();
      const picklistNo = row.find("td:eq(7)").text().trim();
      const statusText = row.find("td:eq(4)").text().trim().toUpperCase();
      const checkbox = row.find(".checkbox");

      const docStatus = checkbox.data("docstatus") || "";
      const restrictedStatuses = [
        "CANCELLED",
        "TERMINATED",
        "REJECTED",
        "PROCESSING",
        "IN TRANSIT",
      ];

      if (srnText.startsWith("SRN")) {
        checkbox.show();

        if (
          !srnText.startsWith("SRN") ||
          docStatus == "COMPLETE"
          // picklistNo !== "" ||
          // restrictedStatuses.includes(statusText)
          //  || statusText !== "NEW"
        ) {
          checkbox.prop("disabled", true);
        } else {
          checkbox.prop("disabled", false);
        }
      } else {
        checkbox.hide();
      }
    });

    createPicklistBtn.textContent = "Preview";
    createPicklistBtn.type = "button";
    checkAllBtn.classList.remove("d-none");

    return;
  }

  if (selectionMode) {
    if (DocEntries.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Please select at least one item to create a picklist",
        confirmButtonText: "OKAY",
      });
      $("#incomingTableDisplay tbody .checkbox").hide().prop("checked", false);
      createPicklistBtn.textContent = "Create Picklist";
      createPicklistBtn.type = "button";
      checkAllBtn.classList.add("d-none");
      return;
    }
  }

  // Swal.fire({
  //   icon: "question",
  //   title: "Create picklist on this item(s)?",
  //   confirmButtonText: "Add",
  //   showCancelButton: true,
  //   cancelButtonText: "Back",
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     $.ajax({
  //       url: "dirs/incoming/dashboard/actions/save_createpicklist.php",
  //       type: "POST",
  //       data: {
  //         DocEntry: DocEntries,
  //       },
  //       dataType: "json",
  //       success: function (response) {
  //         if (response.status === "success") {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Picklist has been created",
  //             confirmButtonText: "OKAY",
  //           });
  //           $("#incomingTableDisplay tbody .checkbox")
  //             .hide()
  //             .prop("checked", false);
  //           createPicklistBtn.textContent = "Create Picklist";
  //           loadIncoming();
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: response.message,
  //             confirmButtonText: "OKAY",
  //             confirmButtonColor: "#d33",
  //           });
  //         }
  //       },
  //       error: function (xhr) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Server Error",
  //           text: "Something went wrong while processing the request.",
  //         });
  //       },
  //     });
  //   }
  // });

  Swal.fire({
    icon: "question",
    title: "Are you sure to add the following item(s)?",
    confirmButtonText: "Add",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      $("#incoming_content").html(spinner);
      $.post("dirs/incoming/dashboard/preview.php", function (data) {
        $("#main-content").hide().html(data).fadeIn(200);
        $("#previewTableDisplay tbody").html(`
            <tr>
              <td colspan="100%" class="text-center">${spinner}</td>
            </tr>
          `);
        // console.log(`UPDATED PREVIEW`)
        loadPreview(SRNumbers);
      });
    }
  });
}

function loadPreview(SRNumbers) {
  // $("#previewTableDisplay tbody").html(`
  //   <tr>
  //     <td colspan="100%" class="text-center">${spinner}</td>
  //   </tr>
  // `);
  // $.post("dirs/incoming/dashboard/preview.php", function (data) {
  //   $("#main-content").hide().html(data).fadeIn(200);

  $.ajax({
    url: "dirs/incoming/dashboard/actions/get_sr_items.php",
    type: "POST",
    data: {
      SR_Number: SRNumbers,
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let previewData = response.Data;
        let row = "";
        $("#previewTableDisplay").data("srnumbers", SRNumbers);
        let previewBody = $("#previewTableDisplay tbody");

        // const isDisabled = "";

        // <td class="ps-5" style="width: 80px; max-width: 80px">
        //           <input type="checkbox" name="checkbox" id="${item.DocEntry}" data-docentry="${item.DocEntry}"
        //           class="form-check-input align-self-center mx-auto checkbox border border-primary" ${isDisabled}>
        //         </td>

        previewData.forEach((item, index) => {
          if (item.PickedStatus === "Y") {
            return;
          }

          row += `
                <tr style="cursor: pointer" data-docentry="${item.DocEntry}" data-picklisted="${item.PickedStatus}">
                  <td class="ps-5" style="width: 80px; max-width: 80px">
                    <input type="checkbox" name="checkbox" id="${item.DocEntry}" data-docentry="${item.DocEntry}"
                    class="form-check-input align-self-center mx-auto checkbox border border-primary">
                  </td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${index + 1}</td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemName}</td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemCategory}</td>
                  <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${item.Request_Qty}</td>
                </tr>
              `;
        });

        previewBody.html(row);

        let tableCount = previewBody;
        let currentRows = tableCount.find("tr").length;

        for (let i = currentRows; i < 8; i++) {
          let empty = $(`
              <tr class="empty-row" style="height: 50px">
                <td style="width: 80px; max-width: 80px;"></td>
                <td style="background: #f7f7f7"></td>
                <td style="background: #f7f7f7"></td>
                <td style="background: #f7f7f7"></td>
                <td style="background: #f7f7f7"></td>
                <td style="background: #f7f7f7"></td>
              </tr>
            `);
          previewBody.append(empty);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: response.message,
          confirmButtonText: "OKAY",
          confirmButtonColor: "#d33",
        });
      }
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong while processing the request.",
      });
    },
  });
  // });
}

function togglePreview() {
  const previewPicklistBtn = document.getElementById("previewPicklistBtn");
  const selectAllBtn = document.getElementById("selectAllBtn");
  const entries = [];

  const selection =
    $("#previewTableDisplay tbody .checkbox:visible").length > 0;
  $("#previewTableDisplay tbody .checkbox:checked").each(function () {
    entries.push($(this).data("docentry"));
  });

  if (!selection) {
    let availableItems = 0;

    $("#previewTableDisplay tbody tr").each(function () {
      const row = $(this);

      if (!row.hasClass("empty-row")) {
        availableItems++;
      }
    });

    if (availableItems === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Available Item(s)",
        text: "All Item(s) are currently unavailable.",
        confirmButtonText: "OKAY",
      });
      return;
    }

    $("#previewTableDisplay tbody tr").each(function () {
      const row = $(this);
      const checkbox = row.find(".checkbox");
      // const picklistedStatus = row.data("picklisted");

      if (checkbox) {
        // if (picklistedStatus === "Y") {
        //   checkbox.prop("disabled", true);
        // } else {
        //   checkbox.prop("disabled", false);
        // }
        checkbox.show();
      } else {
        checkbox.hide();
      }
    });

    previewPicklistBtn.textContent = "Add to Picklist";
    previewPicklistBtn.type = "button";
    selectAllBtn.classList.remove("d-none");

    return;
  }

  if (selection) {
    if (entries.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Please select at least one item to create a picklist",
        confirmButtonText: "OKAY",
      });
      $("#previewTableDisplay tbody .checkbox").hide().prop("checked", false);
      previewPicklistBtn.textContent = "Create Picklist";
      previewPicklistBtn.type = "button";
      selectAllBtn.classList.add("d-none");
      return;
    }
  }

  // const DocEntry = $(this).data("doc-entry");
  // console.log(`DOC ENTRY: ${DocEntry}`);
  // console.log(``);
  Swal.fire({
    icon: "question",
    title: "Create picklist on the following item(s)?",
    confirmButtonText: "Create",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Executed By",
        input: "text",
        inputPlaceholder: "Enter your name",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return "Executed By is required!";
          }
        },
      }).then((userInput) => {
        if (!userInput.isConfirmed) return;

        let executedBy = userInput.value;

        // const groupByCategory = response.isConfirmed;
        const groupByCategory = false;

        const openPrint = (DocEntry) => {
          window.open(
            `pdf/requests.php?DocEntry=${DocEntry}` +
              `&executedBy=${encodeURIComponent(executedBy)}` +
              `&groupByCategory=${groupByCategory ? 1 : 0}`,
            "_blank",
          );
        };

        $.ajax({
          url: "dirs/incoming/dashboard/actions/save_create_item_picklist.php",
          type: "POST",
          data: {
            docEntries: entries,
          },
          dataType: "json",
          success: function (response) {
            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Picklist has been created",
                confirmButtonText: "OKAY",
              });

              openPrint(response.DocEntry);

              const SRNumbers = $("#previewTableDisplay").data("srnumbers");

              // ORIGINAL
              $("#previewTableDisplay tbody .checkbox")
                .hide()
                .prop("checked", false);
              previewPicklistBtn.textContent = "Create Picklist";
              loadBasketContent();
            } else {
              Swal.fire({
                icon: "error",
                title: response.message,
                confirmButtonText: "OKAY",
                confirmButtonColor: "#d33",
              });
            }
          },
          error: function (xhr) {
            Swal.fire({
              icon: "error",
              title: "Server error",
              text: "Something went wrong while processing the picklist.",
            });
          },
        });
      });
    }
  });
}

function checkAll() {
  const checkboxes = $("#incomingTableDisplay tbody .checkbox:visible").not(
    ":disabled",
  );

  if (checkboxes.length === 0) return;

  // const allChecked = checkboxes.length === checkboxes.filter(":checked").length;
  const checkedBoxes = checkboxes.filter(":checked");
  const allChecked = checkboxes.length === checkedBoxes.length;

  if (allChecked) {
    checkboxes.prop("checked", false);
    $("#checkAllBtn").text("Select All");
  } else {
    // ORIGINAL
    // checkboxes.prop("checked", true);
    // $("#checkAllBtn").text("Deselect All");

    // Select only up to 5 unchecked checkboxes
    const remainingSlots = 5 - checkedBoxes.length;

    if (remainingSlots <= 0) {
      // alert("You can only select up to 5 rows.");
      Swal.fire({
        icon: "warning",
        title: "You can only select up to 5 rows",
        confirmButtonText: "OKAY",
      });
      return;
    }

    checkboxes.not(":checked").slice(0, remainingSlots).prop("checked", true);

    // Update button text
    const totalChecked = checkboxes.filter(":checked").length;

    $("#checkAllBtn").text(
      totalChecked === checkboxes.length ? "Deselect All" : "Select All",
    );
  }
}

// Optional: Prevent manual checking beyond 5
$(document).on("change", "#incomingTableDisplay tbody .checkbox", function () {
  const checkedCount = $(
    "#incomingTableDisplay tbody .checkbox:checked",
  ).length;

  if (checkedCount > 5) {
    this.checked = false;
    Swal.fire({
      icon: "warning",
      title: "You can only select up to 5 rows",
      confirmButtonText: "OKAY",
    });
  }
});

function selectAll() {
  const checkboxes = $("#previewTableDisplay tbody .checkbox:visible").not(
    ":disabled",
  );

  if (checkboxes.length === 0) return;

  // Check if all valid checkboxes are already checked
  const allChecked = checkboxes.length === checkboxes.filter(":checked").length;

  if (allChecked) {
    // Uncheck all
    checkboxes.prop("checked", false);
    $("#selectAllBtn").text("Select All");
  } else {
    // Check all valid ones
    checkboxes.prop("checked", true);
    $("#selectAllBtn").text("Deselect All");
  }
}

$(document).on("dblclick", "#incomingTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  if ($("#incomingTableDisplay tbody .checkbox:visible").length > 0) return;
  if ($(this).hasClass("empty-row")) return;
  let DocEntry = $(this).find(".checkbox").data("docentry");
  $("#main-content").html(spinner);
  setTimeout(function () {
    openIncoming(DocEntry);
  }, 200);
});

function openIncoming(DocEntry) {
  $("#pageLoader").removeClass("d-none");
  $.post("dirs/incoming/dashboard/form.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    $.ajax({
      url: "dirs/incoming/dashboard/actions/get_openincoming.php",
      type: "POST",
      data: { DocEntry: DocEntry },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let rowCount = response.Items.length;
          let totalQty = 0;

          let header = response.Header;
          let items = response.Items;

          function selectedValue(selector, value) {
            $(selector)
              .empty()
              .append(`<option value="${value}">${value}</option>`);
          }

          // selectedValue("#typeOfReq", header.TypeRequest);
          selectedValue("#destination", header.BranchDestination);
          selectedValue("#branchWhCode", header.BranchDestination_Whscode);
          selectedValue("#origin", header.BranchOrigin);
          selectedValue("#whcode", header.BranchOrigin_Whscode);

          const date = new Date(header.EncodeDate);

          const formattedDate =
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0") +
            "-" +
            String(date.getFullYear()).slice(-2);

          // ================= HEADER =================
          $("#srn").val(header.SR_Number);
          $("#date").val(formattedDate);
          $("#status").val(header.RequestStatus);
          $("#purpose").val(header.PurposeRequest);
          $("#reqBy").val(header.RequestedBy);
          $("#remarks").val(header.Remarks);

          // ================= ITEMS =================
          let rows = "";

          items.forEach(function (item, index) {
            let quantity = parseFloat(item.Request_Qty) || 0;
            totalQty += quantity;
            rows += `
                <tr style="height: 40px; min-height: 40px; cursor: pointer">
                  <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${index + 1}</td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemName}</td>
                  <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemCategory}</td>
                  <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${item.Request_Qty}</td>
                </tr>
              `;
          });

          $("#totalIncomingQty").text(totalQty);
          $("#openIncomingTable tbody").html(rows);

          if (rowCount < 8) {
            let emptyRowsNeeded = 8 - rowCount;

            for (let i = 0; i < emptyRowsNeeded; i++) {
              let emptyRow = `
                  <tr class="item-row empty-row" style="height: 50px; min-height: 50px;">
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                  </tr>
              `;
              $("#openIncomingTable tbody").append(emptyRow);
            }
            $("#totalIncomingQty").text(totalQty);
          }
        } else {
          alert(response.Data);
        }
        $("#pageLoader").addClass("d-none");
      },
      error: function (xhr) {
        console.error(xhr.responseText);
        $("#pageLoader").addClass("d-none");
      },
    });
  }).fail(function () {
    $("#pageLoader").addClass("d-none");
  });
}

function picklistBasket() {
  $("#incoming_content").html(spinner);
  $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
    $("#main-content").html(data);
    // if ($.fn.DataTable.isDataTable("#basketTable")) {
    //   $("#basketTable").DataTable().clear().destroy();
    // }
    // $("#main-content").html(spinner);

    $("#basketTable tbody").html(`
        <tr>
          <td colspan="100%" class="text-center">${spinner}</td>
        </tr>
      `);

    // console.log(`SHOULD LOAD SPINNER HERE`)

    // setTimeout(function () {
    //   $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
    //     $("#main-content").hide().html(data).fadeIn(200);
    // loadBasket();
    //   });
    // // }, 200);

    loadBasket(() => {
      $("#basketTable").DataTable({
        pageLength: 50,
        order: [0, "asc"],
      });
    }, 200);
  });
}

function loadIncomingDashboard() {
  $("#incoming_content").html(spinner);
  // setTimeout(function () {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $("#basketTableDashboard tbody").html(`
        <tr>
          <td colspan="100%" class="text-center">${spinner}</td>
        </tr>
      `);
  });
  // }, 200);
}

// PICKLIST BASKET TO PICKLIST ITEMS
$(document).on("dblclick", "#basketTable tbody .open-picklist", function (e) {
  e.preventDefault();

  let row = this;

  const tooltipInstance = bootstrap.Tooltip.getInstance(row);
  if (tooltipInstance) {
    tooltipInstance.hide();
  }

  let $row = $(this).closest("tr");
  let picklistNum = $row.attr("data-picklist-num");

  // $("#main-content").html(spinner);
  $("#incoming_content").html(spinner);

  // setTimeout(function () {
  $("#picklistItemTable tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
  // console.log(`OPENING PICKLIST`)
  openPicklist(picklistNum);

  //  $.post(
  //   "dirs/incoming/dashboard/picklistItem.php",
  //   { picklistNum: picklistNumRef },
  //   function (data) {
  //     $("#main-content").html(data);

  //     $("#picklistItemTable tbody").html(`
  //       <tr>
  //         <td colspan="100%" class="text-center">${spinner}</td>
  //       </tr>
  //     `);
  // }, 200);
});

$(document).on("click", ".dropdown .open-picklist-items", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = picklistedRow.attr("data-picklist-num");

  picklistNumRef = picklistNum;

  $("#incoming_content").html(spinner);
  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    { picklistNum: picklistNum },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      $("#picklistItemTable tbody").html(`
        <tr>
          <td colspan="100%" class="text-center">${spinner}</td>
        </tr>
      `);
      // console.log(`OPENING PICKLIST`)
      openPicklist(picklistNum);
    },
  );
});

// ENTER ACTUAL QUANTITY
$(document).on("click", ".dropdown .enter-actual-qty", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = picklistedRow.attr("data-picklist-num");
  let rowNum = picklistedRow.attr("data-rownum");

  picklistNumRef = picklistNum;

  $("#main-content").html(spinner);
  // $.post(
  //   "dirs/incoming/dashboard/encodeQty.php",
  //   { picklistNum: picklistNum },
  //   function (data) {
  //     $("#incoming_content").hide().html(data).fadeIn(200);
  //     $("#encodeQtyTable tbody").html(`
  //       <tr>
  //         <td colspan="100%" class="text-center">${spinner}</td>
  //       </tr>
  //     `);
  // formattedDate();
  encodeQty(picklistNum, rowNum);
  // })
});

// EDIT ACTUAL QUANTITY
$(document).on("click", ".dropdown .edit-actual-qty", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = picklistedRow.attr("data-picklist-num");
  let rowNum = picklistedRow.attr("data-rownum");

  picklistNumRef = picklistNum;

  $("#main-content").html(spinner);
  setTimeout(function () {
    $("#editEncodedQtyTable tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    editEncodedQty(picklistNum, rowNum);
  }, 200);
});

// CREATE DR
$(document).on("click", ".dropdown .single-dr", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = $(this).data("picklist");
  let srn = $(this).data("sr-number");

  $("#main-content").html(spinner);
  setTimeout(function () {
    // createDr(picklistNum, srn);
  }, 200);
});

function openPicklist(picklistNum) {
  $.ajax({
    url: "dirs/incoming/dashboard/actions/get_picklist_items.php",
    type: "POST",
    dataType: "json",
    data: { PicklistNumber: picklistNum },
    success: function (response) {
      $("#picklistNumDisplay").text(picklistNum);
      let rows = [];
      let index = 1;
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          // console.log(`ITEM : ${JSON.stringify(item)}`);
          rows.push([
            index++,
            item.Brand || "",
            item.Model || "",
            item.Category || "",
            item.Quantity ? Math.floor(Number(item.Quantity)) : "",
            // item.Actual_Quantity
            //   ? Math.floor(Number(item.Actual_Quantity))
            //   : "",
            item.Actual_Item_Qty
              ? Math.floor(Number(item.Actual_Item_Qty))
              : "",
          ]);
        });
        // $("#picklistItemTable").DataTable().clear().destroy();
        if ($.fn.DataTable.isDataTable("#picklistItemTable")) {
          $("#picklistItemTable").DataTable().clear().destroy();
        }
        $("#picklistItemTable").DataTable({
          data: rows,
          columns: [
            { title: "#", className: "text-start ps-5" },
            { title: "Brand", className: "text-start ps-5" },
            { title: "Model", className: "text-start ps-5" },
            { title: "Category", className: "text-start ps-5" },
            { title: "Quantity", className: "text-center" },
            { title: "Actual Qty", className: "text-center" },
          ],
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          rowCallback: function (row, data) {
            const isEmpty = !data[0];
            $("td", row).css({
              // background: "#F7F7F7",
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: isEmpty ? "default" : "pointer",
            });
            $("td:eq(2)", row).css("text-align", "start");
            $("td:eq(4)", row).css("text-align", "center");
            $("td:eq(5)", row).css("text-align", "center");
          },
          drawCallback: function () {
            let tableBody = $("#picklistItemTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              // let $emptyRow = $(`
              //   <tr class="empty-row" style="background: #f7f7f7">
              //     <td colspan="5" style="background: #f7f7f7">&nbsp;</td>
              //   </tr>
              // `);
              let $emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="6" style="background: #fcf7d4">&nbsp;</td>
                </tr>
              `);
              $emptyRow.css({
                // background: "#f7f7f7",
                background: "#fcf7d4",
                height: "40px",
                "min-height": "40px",
              });
              tableBody.append($emptyRow);
            }
          },
        });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
}

// DISPLAY PICKLIST
function loadPicklistItems() {
  $("#incoming_content").html(spinner);

  // $("#picklistItemTable tbody").html(`
  //   <tr>
  //     <td colspan="100%" class="text-center">${spinner}</td>
  //   </tr>
  // `);

  // console.log(`OPENING PICKLIST`)

  // setTimeout(function () {

  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    { picklistNum: picklistNumRef },
    function (data) {
      $("#main-content").html(data);
      $("#picklistItemTable tbody").html(`
          <tr>
            <td colspan="100%" class="text-center">${spinner}</td>
          </tr>
        `);
      openPicklist(picklistNumRef);
    },
  );
  // }, 200);
}

// CANCEL PICKLIST
function cancelPicklist() {
  $(document).on("click", ".cancel-picklist", function () {
    const picklistId = $(this).data("picklist");

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel Picklist " + picklistId,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Back",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Cancelled!",
          "Picklist " + picklistId + " has been cancelled.",
          "success",
        );

        $(this).closest("tr").remove();
      }
    });
  });
}

// PICKLIST ITEMS
function loadBasketContent() {
  // $("#main-content").html(spinner);
  $("#incoming_content").html(spinner);
  // setTimeout(function () {
  $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $("#basketTable tbody").html(`
        <tr>
          <td colspan="100%" class="text-center">${spinner}</td>
        </tr>
      `);
    loadBasket();
  });
  // }, 200);
}

// ALREADY HAS A PICKLIST NUMBER
function openPicklistedForm(SR_Number) {
  $.post(
    "dirs/incoming/dashboard/picklistedForm.php",
    { SR_Number: SR_Number },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);

      $.ajax({
        url: "dirs/incoming/dashboard/actions/get_stock_request_breakdown.php",
        type: "POST",
        data: { SR_Number: SR_Number },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let rowCount = response.Items.length;
            let totalQty = 0;

            let header = response.Data;
            let items = response.Items;

            function selectedValue(selector, value) {
              $(selector)
                .empty()
                .append(`<option value="${value}">${value}</option>`);
            }

            selectedValue("#destination", header.Req_Branch);
            selectedValue("#branchWhCode", header.Req_Whscode);
            selectedValue("#origin", header.BranchSetup);
            selectedValue("#whcode", header.BranchOrigin_Whscode);

            // ================= HEADER =================
            $("#srn").val(header.SR_Number);
            $("#date").val(header.DocDate);
            $("#status").val(header.RequestStatus);
            $("#purpose").val(header.PurposeRequest);
            $("#reqBy").val(header.RequestedBy);
            $("#remarks").val(header.Remarks);

            // ================= ITEMS =================
            let rows = "";

            items.forEach(function (item, index) {
              let quantity = Math.trunc(Number(item.Req_Item_Qty) || 0);
              totalQty += quantity;
              rows += `
                      <tr style="height: 40px; min-height: 40px">
                        <td class="align-middle ps-3" style="background:#FFFBDF">${index + 1}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF">${item.Req_ItemBrand}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF">${item.Req_ItemName}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF">${item.Req_ItemCategory}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF">${Math.trunc(Number(item.Req_Item_Qty))}</td>
                      </tr>
                    `;
            });

            $("#totalIncomingQty").text(totalQty);
            $("#openIncomingTable tbody").html(rows);

            if (rowCount < 8) {
              let emptyRowsNeeded = 8 - rowCount;

              for (let i = 0; i < emptyRowsNeeded; i++) {
                let emptyRow = `
                        <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                          <td style="background: #FFFBDF"></td>
                          <td style="background: #FFFBDF"></td>
                          <td style="background: #FFFBDF"></td>
                          <td style="background: #FFFBDF"></td>
                          <td style="background: #FFFBDF"></td>
                        </tr>
                      `;
                $("#openIncomingTable tbody").append(emptyRow);
              }
              $("#totalIncomingQty").text(totalQty);
            }
          } else {
            alert(response.Data);
          }
        },
        error: function (xhr) {
          console.error(xhr.responseText);
        },
      });
    },
  );
}

// DISPLAY BASKET
function loadBasket() {
  // remove every bootstrap tooltip currently alive
  document.querySelectorAll(".tooltip").forEach((el) => el.remove());

  document.querySelectorAll("#basketTable tbody tr").forEach((el) => {
    const instance = bootstrap.Tooltip.getInstance(el);
    if (instance) {
      instance.dispose();
    }
  });
  $.ajax({
    url: "dirs/incoming/dashboard/actions/picklisteditems.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      if (
        !response ||
        response.isSuccess !== "success" ||
        !Array.isArray(response.Data)
      ) {
        response = {
          isSuccess: "success",
          Data: [],
        };
      }
      let rows = [];
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.PKList_Number || 0) - Number(a.PKList_Number || 0),
        );

        const grouped = {};

        sortedData.forEach((item) => {
          const key = item.PKList_Number;

          if (!grouped[key]) {
            grouped[key] = {
              ...item,
              totalQty: 0,
              allHaveActualQty: true,
              SR_Numbers: new Set(),
            };
          }

          grouped[key].totalQty += Number(item.RequestItemQty || 0);

          if (item.SR_Number) {
            grouped[key].SR_Numbers.add(item.SR_Number);
          }

          if (item.Actual_Item_Qty == null) {
            grouped[key].allHaveActualQty = false;
          }
        });

        const groupedArray = Object.values(grouped).map((item) => ({
          ...item,
          SR_Numbers: Array.from(item.SR_Numbers),
        }));

        groupedArray.forEach((item) => {
          // console.log(`PICKLIST ITEM : ${JSON.stringify(item)}`);
          const isSingleSR = item.SR_Numbers.length === 1;
          const condition = item.allHaveActualQty && isSingleSR;
          // console.log(`SRN's : ${item.SR_Numbers}`);
          // console.log(``);
          const date = new Date(item.DocDate);
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const yy = String(date.getFullYear()).slice(-2);

          const formatted = `${mm}-${dd}-${yy}`;
          // const formatted = date.toISOString().split("T")[0];

          const printOption = item.allHaveActualQty
            ? `<li>
                  <a class="dropdown-item print-picklist" 
                    href="#"
                    data-picklist="${item.PKList_Number}" 
                    data-doc-entry="${item.DocEntry}">
                    Print
                  </a>
                </li>`
            : "";

          const actualQtyOption = item.allHaveActualQty
            ? item.PickListStatus === "PROCESSING"
              ? ""
              : `<li>
                  <a class="dropdown-item edit-actual-qty" href="#">
                    Edit Actual Quantity
                  </a>
                  </li>`
            : `<li>
                  <a class="dropdown-item enter-actual-qty" href="#">
                    Encode Quantity
                  </a>
                </li>`;

          const encoded = item.allHaveActualQty
            ? "<span class='badge bg-success'>Encoded</span>"
            : "<span class='badge bg-warning text-white'>Pending</span>";

          rows.push([
            item.PKList_Number || "",
            item.RequestItemQty || "",
            encoded,
            formatted || "",
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklist-items" href="#">Open</a></li>
                  <li>
                  <a class="dropdown-item print-picklist" 
                    href="#"
                    data-picklist="${item.PKList_Number}" 
                    data-doc-entry="${item.DocEntry}">
                    Print
                  </a>
                </li>
                  ${actualQtyOption}
                </ul>
              </div>`,
          ]);
        });

        // ${printOption}

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        destroyAllTooltips();

        if ($.fn.DataTable.isDataTable("#basketTable")) {
          $("#basketTable").DataTable().clear().destroy();
        }

        $("#basketTable").DataTable({
          data: rows,
          columns: [
            {
              title: "Picklist No.",
              className: "text-start open-picklist ps-5",
            },
            { title: "Quantity", className: "text-center" },
            { title: "Status" },
            { title: "Date", className: "text-start ps-5" },
            { title: "", orderable: false },
          ],
          createdRow: function (row, data, dataIndex) {
            let originalItem = groupedArray[dataIndex];

            if (originalItem) {
              $(row)
                .attr("data-rownum", originalItem.PKList_Number)
                .attr("data-picklist-num", originalItem.PKList_Number)
                .addClass("picklist-row")
                .addClass("picklist-row open-picklist")
                .attr(
                  "data-bs-title",
                  `<div class="text-start">SRN's:<br>${originalItem.SR_Numbers.join("\n") || "No Branch"}</div>`,
                );
            }
          },
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          // order: [[0, "desc"]],
          order: [[0, "asc"]],
          rowCallback: function (row, data) {
            const isEmptyRow = !data[0];

            $("td", row).css({
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
            });
            $("td:eq(0)", row).addClass("text-primary");
            $("td:eq(1)", row).css("text-align", "start");

            if (!isEmptyRow) {
              $(row).css("cursor", "pointer");
            } else {
              $(row).css("cursor", "default");
            }

            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                // $(this).css("background", "#FFFBDF");
                $(this).css("background", "#fcf7d4");
              },
            );
          },
          drawCallback: function () {
            let tableBody = $("#basketTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              // let $emptyRow = $(`
              // <tr class="empty-row" style="background: #FFFBDF">
              //   <td colspan="5" style="background: #FFFBDF">&nbsp;</td>
              // </tr>`);
              let $emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="5" style="background: #fcf7d4">&nbsp;</td>
                </tr>`);
              $emptyRow.css({
                // background: "#FFFBDF",
                background: "#fcf7d4",
                height: "40px",
                "min-height": "40px",
              });
              $emptyRow.hover(
                function () {
                  $(this).css("background", "#FFF4C2");
                },
                function () {
                  // $(this).css("background", "#FFFBDF");
                  $(this).css("background", "#fcf7d4");
                },
              );
              tableBody.append($emptyRow);
            }

            $("#basketTable tbody tr").each(function () {
              const existingTooltip = bootstrap.Tooltip.getInstance(this);
              if (existingTooltip) {
                existingTooltip.dispose();
              }

              new bootstrap.Tooltip(this, {
                placement: "right",
                trigger: "hover",
                container: "body",
                html: true,
              });
            });

            $("#basketTable tbody")
              .off("show.bs.dropdown hide.bs.dropdown click.dropdownAction")
              .on("show.bs.dropdown", ".dropdown", function () {
                const row = $(this).closest("tr")[0];

                const tooltipInstance = bootstrap.Tooltip.getInstance(row);

                if (tooltipInstance) {
                  tooltipInstance.dispose();
                }

                document
                  .querySelectorAll(".tooltip")
                  .forEach((el) => el.remove());
              })
              .on("hide.bs.dropdown", ".dropdown", function () {
                const row = $(this).closest("tr")[0];

                const instance = bootstrap.Tooltip.getInstance(row);

                if (instance) {
                  instance.dispose();
                }
              })
              .on("click.dropdownAction", ".dropdown-item", function () {
                const row = $(this).closest("tr")[0];

                const tooltipInstance = bootstrap.Tooltip.getInstance(row);

                if (tooltipInstance) {
                  tooltipInstance.dispose();
                }

                document
                  .querySelectorAll(".tooltip")
                  .forEach((el) => el.remove());
              });
          },
        });

        // FOR PRINTING PICKLIST
        $("#basketTable")
          .off("click", "#basketTable .print-picklist")
          .on("click", ".print-picklist", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const PKlistNum = $(this).data("picklist");
            const DocEntry = $(this).data("doc-entry");

            Swal.fire({
              title: "Print this Picklist?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Print",
              confirmButtonColor: "#0d6efd",
              cancelButtonText: "Cancel",
            }).then((result) => {
              if (result.isConfirmed) {
                // Swal.fire({
                //   title: "Executed By",
                //   input: "text",
                //   inputPlaceholder: "Enter your name",
                //   inputAttributes: {
                //     autocapitalize: "off",
                //   },
                //   showCancelButton: true,
                //   confirmButtonText: "Continue",
                //   cancelButtonText: "Cancel",
                //   inputValidator: (value) => {
                //     if (!value) {
                //       return "Executed By is required!";
                //     }
                //   },
                // }).then((userInput) => {
                //   if (!userInput.isConfirmed) return;

                // let executedBy = userInput.value;
                let executedBy = "";

                // PRINT ONLY
                // const groupByCategory = response.isConfirmed;
                const groupByCategory = false;

                const openPrint = () => {
                  window.open(
                    `pdf/requests.php?DocEntry=${DocEntry}` +
                      `&executedBy=${encodeURIComponent(executedBy)}` +
                      `&groupByCategory=${groupByCategory ? 1 : 0}`,
                    "_blank",
                  );
                };
                openPrint();
                // });
              }
            });
          });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
  // });
}

function destroyAllTooltips() {
  document.querySelectorAll("[data-bs-title]").forEach((el) => {
    const instance = bootstrap.Tooltip.getInstance(el);

    if (instance) {
      instance.hide();
      instance.dispose(); // completely remove tooltip
    }
  });

  // remove any orphaned tooltip elements
  document.querySelectorAll(".tooltip").forEach((tooltip) => {
    tooltip.remove();
  });
}

function formattedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  document.getElementById("date").value = `${yyyy}-${mm}-${dd}`;
}

// ARROW NAVIGATION
$(document).on("keydown", ".editable-cell", function (e) {
  const $currentCell = $(this);
  const $currentRow = $currentCell.closest("tr");
  const cellIndex = $currentCell.index();

  let $target;

  switch (e.key) {
    case "ArrowRight":
      $target = $currentCell.next(".editable-cell");
      break;

    case "ArrowLeft":
      $target = $currentCell.prev(".editable-cell");
      break;

    case "ArrowDown":
      $target = $currentRow.next("tr").find(".editable-cell").eq(0);
      break;

    case "ArrowUp":
      $target = $currentRow.prev("tr").find(".editable-cell").eq(0);
      break;

    default:
      return;
  }

  if ($target && $target.length) {
    e.preventDefault();

    $target.focus();

    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents($target[0]);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

function encodeQty(picklistNum) {
  $.post(
    "dirs/incoming/dashboard/encodeQty.php",
    { picklistNum: picklistNum },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      $("#encodeQtyTable tbody").html(`
        <tr>
          <td colspan="6" class="text-center align-middle" style="height:350px;">
            <div style="height:350px; display:flex; align-items:center; justify-content:center;">
              ${spinner}
            </div>
          </td>
        </tr>
      `);
      $("#pklist").val(picklistNum);

      $.ajax({
        url: "dirs/incoming/dashboard/actions/get_encodeitems.php",
        type: "POST",
        data: { PicklistNumber: picklistNum },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;

            let groupedItems = {};

            items.forEach((item) => {
              let key = item.Req_ItemName;
              let qty = Math.trunc(Number(item.Req_Item_Qty) || 0);

              if (!groupedItems[key]) {
                groupedItems[key] = {
                  Req_ItemBrand: item.Req_ItemBrand,
                  Req_ItemName: item.Req_ItemName,
                  Req_ItemCategory: item.Req_ItemCategory,
                  DocEntry: item.DocEntry,
                  totalQty: 0,
                  branches: new Set(),
                  rows: [],
                };
              }

              groupedItems[key].totalQty += qty;
              groupedItems[key].branches.add(item.Req_Branch);

              groupedItems[key].rows.push({
                Item_id: item.Item_id,
                SR_Number: item.SR_Number,
                Req_Branch: item.Req_Branch,
              });
            });

            let index = 0;

            srNumberMap = [
              ...new Set(response.Data.map((item) => item.Req_Branch)),
            ];
            formattedDate();
            let rows = "";
            let picklistEntry = "";

            let groupedArray = Object.values(groupedItems);

            Object.values(groupedItems).forEach((item) => {
              picklistEntry = item.DocEntry;
              index++;
              rows += `
                <tr class="item-row" style="height: 50px; min-height: 50px" data-rows='${JSON.stringify(item.rows)}'>
                  <td class="align-middle text-center" style="background: #F7F7F7;">${index}</td>
                  <td class="align-middle ps-3 d-none" style="background: #F7F7F7;">${picklistEntry}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemName}</td>
                  <td class="align-middle ps-3 text-start" style="background: #F7F7F7;">${item.Req_ItemCategory}</td>
                  <td class="align-middle text-center" style="background: #F7F7F7;">${item.totalQty}</td>
                  <td class="align-middle ps-3 editable-cell text-center" style="background: #fcf7d4" contenteditable="true" onfocus="handleFocus(this)" oninput="validateNumber(this)" onkeydown="preventEnter(event)" style="width: 100px; max-width: 100px"></td>
                </tr>
              `;
            });

            $("#encodeQtyTable tbody").html(rows);

            let rowCount = groupedArray.length;
            if (rowCount < 8) {
              let emptyRowsNeeded = 8 - rowCount;

              for (let i = 0; i < emptyRowsNeeded; i++) {
                let emptyRow = `
                  <tr class="empty-row" style="height: 50px; min-height: 50px;">
                    <td style="background: #F7F7F7" class="d-none"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #fcf7d4"></td>
                  </tr>
              `;
                $("#encodeQtyTable tbody").append(emptyRow);
              }
            }
            submitEncodedQty(picklistEntry, picklistNum, srNumberMap);
          } else {
            alert(response.Data);
          }
          $("#pageLoader").addClass("d-none");
        },
        error: function (xhr) {
          console.error(xhr.responseText);
          $("#pageLoader").addClass("d-none");
        },
      });
    },
  ).fail(function () {
    $("#pageLoader").addClass("d-none");
  });
}

function handleFocus(el) {
  el.style.outline = "none";
  el.style.boxShadow = "none";

  $(el).removeClass("border border-danger");
}

function preventEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
}

function validateNumber(el) {
  let value = $(el).text();

  // Keep only numbers
  value = value.replace(/\D/g, "");

  // Limit to max 3 digits
  if (value.length > 3) {
    value = value.substring(0, 3);
  }

  let numericValue = Number(value);

  // 🔥 Get max (Quantity column in same row)
  let maxQty = Number($(el).closest("tr").find("td:nth-child(5)").text());

  // Move cursor to end
  let range = document.createRange();
  let sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function submitEncodedQty(PicklistEntry, picklistNum, srnMap = null) {
  $(document)
    .off("submit", "#encodeqty, #editEncodedQty")
    .on("submit", "#encodeqty, #editEncodedQty", function (e) {
      e.preventDefault();

      let isValid = true;
      let hasEmpty = false;
      let hasExceeded = false;

      const form = this;

      $(this)
        .find(".editable-cell")
        .each(function () {
          let value = $(this).text().trim();
          let actual = Number(value);

          let maxQty = Number(
            $(this).closest("tr").find("td:nth-child(6)").text().trim(),
          );

          if (value === "") {
            hasEmpty = true;
            isValid = false;
            $(this).addClass("border border-danger");
          } else if (actual > maxQty) {
            hasExceeded = true;
            isValid = false;
            $(this).addClass("border border-danger");
          } else {
            $(this).removeClass("border border-danger");
          }
        });

      if (!isValid) {
        let message = "";

        if (hasEmpty && hasExceeded) {
          message =
            "Some fields are empty and some actual quantities exceed the allowed total quantity.";
        } else if (hasEmpty) {
          message = "Please fill in all Actual Quantity fields.";
        } else if (hasExceeded) {
          message =
            "Actual quantity must not be greater than its corresponding total quantity.";
        }

        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: message,
        });
        return;
      }

      Swal.fire({
        title: "Save actual quantity?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Save",
        confirmButtonColor: "#0d6efd",
        cancelButtonText: "Back",
      }).then((result) => {
        if (result.isConfirmed) {
          let encodedItems = [];

          let submitBtn = $(form).find("button[type='submit'].save-btn");
          submitBtn
            .prop("disabled", true)
            .html(
              `<span class="spinner-border spinner-border-sm"></span> Saving`,
            );

          let tableSelector =
            $(this).attr("id") === "editEncodedQty"
              ? "#editEncodedQtyTable"
              : "#encodeQtyTable";

          $(tableSelector + " tbody tr").each(function () {
            let cells = $(this).find("td");
            let actualQty = $(cells[6]).text().trim();

            let originalRows = $(this).data("rows");

            if (!originalRows || actualQty === "") return;

            originalRows.forEach((row) => {
              // console.log(`ITEM ID: ${row.Item_id}`);
              encodedItems.push({
                ItemNumber: row.Item_id,
                ActualQty: actualQty,
                SR_Number: row.SR_Number,
              });
            });
          });

          let executedBy = "";
          let formId = $(this).attr("id");
          let formData = new FormData(document.getElementById(formId));

          formData.append("ExecutedBy", executedBy);
          let srnIndex = 0;

          // PRINT WITH ACTUAL QUANTITY
          let PickListNum = picklistNum;

          formData.append("PickListNum", PickListNum);
          encodedItems.forEach((item) => {
            formData.append("ItemNumber[]", item.ItemNumber);
            formData.append("ActualQty[]", item.ActualQty);
            formData.append("SR_Number[]", item.SR_Number);
          });

          $.ajax({
            url: "dirs/incoming/dashboard/actions/update_actual_qty.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
              let res =
                typeof response === "string" ? JSON.parse(response) : response;

              if (res.status === "success") {
                const DocEntry = PicklistEntry;

                Swal.fire({
                  icon: "success",
                  title: "Actual quantity has been saved",
                });

                if (srnMap && srnMap.length === 1) {
                  addToBasket(PickListNum);
                }

                // const groupByCategory = false;
                // const openPrint = () => {
                //   window.open(
                //     `pdf/requests.php?DocEntry=${DocEntry}` +
                //       `&executedBy=${encodeURIComponent(executedBy)}` +
                //       `&groupByCategory=${groupByCategory ? 1 : 0}`,
                //     "_blank",
                //   );
                // };
                // openPrint();
                // Swal.close();

                // ORIGINAL
                // setTimeout(() => {
                //   loadBasketContent();
                // }, 300);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res.message,
                });
              }
            },
            error: function (xhr) {
              console.error(xhr.responseText);
              Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Please check console for details",
              });
            },
            complete: function () {
              setTimeout(() => {
                loadBasketContent();
              }, 300);
              // submitBtn.prop("disabled", false).html("Save");
            },
          });

          // submitBtn.prop("disabled", false);
        }
      });
    });
}

function addToBasket(PickListNum) {
  let items = [];
  $.ajax({
    // url: "dirs/incoming/dashboard/actions/save_loading_basket_items_solo.php",
    url: "dirs/incoming/dashboard/actions/update_solo_picklist.php",
    type: "POST",
    // data: { PickListNumber: picklist },
    data: { PickListNumber: PickListNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        console.log(`PICKLIST HAS BEEN ADDED TO LOADING BASKET`);
      } else {
        Swal.fire({
          icon: "error",
          title: response.Message,
        });
      }
    },
  });
}

// UPDATE ACTUAL QUANTITY
function editEncodedQty(picklistNum) {
  $.post(
    "dirs/incoming/dashboard/editEncodedQty.php",
    { picklistNum: picklistNum },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);

      $("#pklist").val(picklistNum);

      $.ajax({
        url: "dirs/incoming/dashboard/actions/get_encodeitems.php",
        type: "POST",
        data: { PicklistNumber: picklistNum },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;

            let groupedItems = {};

            items.forEach((item) => {
              let key = item.Req_ItemName;
              let qty = Math.trunc(Number(item.Req_Item_Qty) || 0);
              let actual_qty = Math.trunc(Number(item.Actual_Item_Qty) || 0);

              if (!groupedItems[key]) {
                groupedItems[key] = {
                  Req_ItemBrand: item.Req_ItemBrand,
                  Req_ItemName: item.Req_ItemName,
                  Req_ItemCategory: item.Req_ItemCategory,
                  DocEntry: item.DocEntry,
                  totalQty: 0,
                  branches: new Set(),
                  Actual_Item_Qty: actual_qty,
                  rows: [],
                };
              }

              groupedItems[key].totalQty += qty;
              groupedItems[key].Actual_Item_Qty = actual_qty;
              groupedItems[key].branches.add(item.Req_Branch);

              groupedItems[key].rows.push({
                Item_id: item.Item_id,
                SR_Number: item.SR_Number,
                Req_Branch: item.Req_Branch,
              });
            });

            let index = 0;

            srNumberMap = [
              ...new Set(response.Data.map((item) => item.Req_Branch)),
            ];
            formattedDate();
            let rows = "";
            let picklistEntry = "";

            let groupedArray = Object.values(groupedItems);

            Object.values(groupedItems).forEach((item) => {
              // console.log(`EDIT ENCODE QTY ITEM: ${JSON.stringify(item)}`);
              picklistEntry = item.DocEntry;
              index++;
              rows += `
                <tr style="height: 50px; min-height: 50px" data-rows='${JSON.stringify(item.rows)}'>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${index}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemName}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemCategory}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.totalQty}</td>
                  <td class="align-middle ps-3 editable-cell" style="background: #FFFBDF" contenteditable="true" onfocus="handleFocus(this)" oninput="validateNumber(this)" onkeydown="preventEnter(event)">${item.Actual_Item_Qty}</td>
                </tr>
              `;
            });

            $("#editEncodedQtyTable tbody").html(rows);

            let rowCount = groupedArray.length;
            if (rowCount < 8) {
              let emptyRowsNeeded = 8 - rowCount;

              for (let i = 0; i < emptyRowsNeeded; i++) {
                let emptyRow = `
                  <tr class="item-row empty-row" style="height: 50px; min-height: 50px;">
                    <td style="background: #F7F7F7" class="d-none"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #FFFBDF"></td>
                  </tr>
              `;
                $("#editEncodedQtyTable tbody").append(emptyRow);
              }
            }

            submitEncodedQty(picklistEntry, picklistNum, srNumberMap);
          } else {
            alert(response.Data);
          }
          $("#pageLoader").addClass("d-none");
        },
        error: function (xhr) {
          console.error(xhr.responseText);
          $("#pageLoader").addClass("d-none");
        },
      });
    },
  ).fail(function () {
    $("#pageLoader").addClass("d-none");
  });
}

// FOR CREATE DR
function get_userinfo() {
  $.post("dirs/basket/dashboard/actions/get_userinfo.php", {}, function (data) {
    response = JSON.parse(data);
    if (jQuery.trim(response.isSuccess) == "success") {
      $("#user-origin").val(response.Data.Branch);
      $("#prepby").val(response.Data.Fullname);
      // loadOriginWhscodes(response.Data.Branch);
    } else {
      Swal.fire({
        icon: "error",
        title: "Server under restoring",
        text: "Please come back later",
        showConfirmButton: true,
        confirmButtonText: "OKAY",
        allowOutsideClick: false,
      }).then(() => {
        $.post("dirs/basket/dashboard/basket.php", {}, function (data) {
          $("#main-content").html(data);
        });
      });
    }
  });
}

function deliveryDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // Set default values
  document.getElementById("docdate").value = todayStr;
  document.getElementById("deldate").value = todayStr;

  // Disable previous dates
  document.getElementById("docdate").min = todayStr;
  document.getElementById("deldate").min = todayStr;
}

function getDeliveryDetails() {
  const truckData = {
    "4 Wheeler": ["ABC-123", "DEF-456"],
    "6 Wheeler": ["GHI-789", "JKL-012"],
    "10 Wheeler": ["MNO-345", "PQR-678"],
  };

  document.getElementById("truckCat").addEventListener("change", function () {
    const plateSelect = document.getElementById("plate");
    const selectedCategory = this.value;

    // Clear existing options
    plateSelect.innerHTML = '<option value="">Select Plate</option>';

    if (truckData[selectedCategory]) {
      truckData[selectedCategory].forEach((plate) => {
        const option = document.createElement("option");
        option.value = plate;
        option.textContent = plate;
        plateSelect.appendChild(option);
      });
    }
  });
}

function getBatchItems(PicklistNumber) {
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_batchitems.php",
    type: "POST",
    data: { PickListNumber: PicklistNumber },
    dataType: "json",
    success: function (response) {
      let items = response.Data;
      let deliveryTable = $("#deliveryFormTable tbody");
      deliveryTable.empty();
      let totalQty = 0;
      let counter = 0;

      if (response.isSuccess === "success") {
        let groupedItems = {};

        items.forEach((item) => {
          let code = item.ItemCode;

          if (!groupedItems[code]) {
            groupedItems[code] = {
              ...item,
              ActualQty: parseInt(item.ActualQty) || 0,
              itemIds: [item.Item_id],
            };
          } else {
            groupedItems[code].ActualQty += parseInt(item.ActualQty) || 0;
            groupedItems[code].itemIds.push(item.Item_id);
          }
        });

        Object.values(groupedItems).forEach((item) => {
          let qty = Math.trunc(Number(item.ActualQty || 0));
          counter += 1;

          totalQty += qty;

          let row = $(`
            <tr class="item-row" style="height: 40px; min-height:40px; cursor: pointer;">
              <td class="align-middle ps-3" style="background: #FFFBDF;">${counter}</td>
              <td class="align-middle ps-3 item-brand" style="background: #FFFBDF;">${item.Brand}</td>
              <td class="align-middle ps-3 item-model" style="background: #FFFBDF;">${item.Model}</td>
              <td class="d-none item-code">${item.ItemCode}</td>
              <td class="align-middle ps-3 item-category" style="background: #FFFBDF;">${item.Category}</td>
              <td class="align-middle ps-3 text-center item-quantity" style="background: #FFFBDF;">${qty}</td>
            </tr>
          `);

          row.data("itemids", item.itemIds);
          deliveryTable.append(row);
        });

        $("#delTotalQuantity").text(totalQty);

        for (let j = items.length; j <= 7; j++) {
          let emptyRow = $(`
              <tr class="empty-row" style="height: 50px; min-height: 50px">
                <td colspan="5" style="background: #FFFBDF"></td>   
              </tr>`);

          $(emptyRow).css({
            background: "#FFFBDF",
            height: "50px",
          });

          emptyRow.hover(
            function () {
              $("td:not(:first-child)", this).css("background", "#FFF4C2");
            },
            function () {
              $("td:not(:first-child)", this).css("background", "#FFFBDF");
            },
          );

          deliveryTable.append(emptyRow);
        }
      }
    },
  });
}

function submitDelivery(srn) {
  $("#deliver").on("submit", function (e) {
    e.preventDefault();

    let items = [];
    $("#deliver tbody tr.item-row")
      .not(".empty-row")
      .each(function () {
        let itemIds = $(this).data("itemids") || [];

        try {
          if (!itemIds) {
            itemIds = [];
          } else if (typeof itemIds === "string") {
            itemIds = JSON.parse(itemIds);
          } else if (!Array.isArray(itemIds)) {
            itemIds = [];
          }
        } catch (err) {
          console.error("Invalid JSON in itemIds:", itemIds);
          itemIds = [];
        }

        let brand = $(this).find(".item-brand").text().trim();
        let model = $(this).find(".item-model").text().trim();
        let code = $(this).find(".item-code").text().trim();
        let category = $(this).find(".item-category").text().trim();
        let quantity = $(this).find(".item-quantity").text().trim();

        if (brand !== "") {
          items.push({
            itemIds,
            brand,
            code,
            model,
            category,
            quantity,
          });
        }
      });

    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Items on the table",
        text: "Please add at least one item before submitting.",
      });
      return;
    }

    let formData = new FormData(document.getElementById("deliver"));
    formData.append("items", JSON.stringify(items));
    formData.append("srn", srn);

    let formObject = Object.fromEntries(formData.entries());
    formObject.items = items;
    formObject.srn = srn;

    // 🔥 ASK FIRST BEFORE API CALL
    Swal.fire({
      title: "Printing option",
      text: "Do you want to print items by category?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, categorized",
      cancelButtonText: "Normal",
      allowOutsideClick: false,
    }).then((res) => {
      const categorized = res.isConfirmed;

      $.ajax({
        url: "dirs/basket/dashboard/actions/submit_delivery.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
          console.log(`RESPONSE: ${JSON.stringify(response)}`);

          if (response.isSuccess === "success") {
            Swal.fire({
              icon: "success",
              title: "Items has been transferred to IN TRANSIT",
            }).then(() => {
              window.open(
                `pdf/delivery.php?data=${encodeURIComponent(
                  JSON.stringify(formObject),
                )}&categorized=${categorized}`,
                "_blank",
              );

              $("#incoming_content").html(spinner);
              $.post(
                "dirs/incoming/dashboard/picklistBasket.php",
                {},
                function (data) {
                  $("#main-content").hide().html(data).fadeIn(200);

                  $("#basketTable tbody").html(`
                    <tr>
                      <td colspan="100%" class="text-center">${spinner}</td>
                    </tr>
                  `);
                  loadBasket();
                },
              );
            });
          }

          if (response.isSuccess === "error") {
            Swal.fire({
              icon: "error",
              title: response.message,
              confirmButtonText: "OKAY",
            }).then(() => {
              location.reload();
            });
          }
        },
      });
    });
  });
}

// PA UPDATE BRANCH CODE SA LIKOD
// async function loadOriginWhscodes(Branch) {
//   console.log(`BRANCH : ${Branch}`);
//   $.post(
//     "dirs/basket/dashboard/actions/get_destinationwhscode.php",
//     {
//       Branch: Branch,
//     },
//     function (data) {
//       const response = JSON.parse(data);
//       if ($.trim(response.isSuccess) === "success") {
//         const whscode = response.Data;
//         $("#originCodeForm").empty();
//         const selectedWH = whscode.find((w) => w.WhsCode.endsWith("WH"));
//         if (selectedWH) {
//           console.log(`SELECTED WH : ${selectedWH}`);
//           $("#originCodeForm").append(
//             $("<option>", {
//               value: selectedWH.WhsCode,
//               text: selectedWH.WhsCode,
//               title: selectedWH.WhsName,
//               selected: true,
//             }),
//           );
//         }
//         $("#originCodeForm").prop("disabled", true);
//       }
//     },
//   );
// }

function loadDeliveryBasketContent() {
  if ($.fn.DataTable.isDataTable("#basketTableDashboard")) {
    $("#basketTableDashboard").DataTable().clear().destroy();
  }
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      loadBasketContent();
    });
  }, 200);
}
