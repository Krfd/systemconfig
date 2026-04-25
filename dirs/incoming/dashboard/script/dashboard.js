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
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);
    loadIncoming();
    $("#incomingTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
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
          // console.log(`SRN ITEM: ${JSON.stringify(item)}`)

          let status = item.RequestStatus
            ? item.RequestStatus.toUpperCase()
            : "";
          let statusClass = "";

          if (status === "NEW") {
            statusClass = "bg-primary";
          } else if (status === "CANCEL" || status === "CANCELLED") {
            statusClass = "bg-warning";
          } else if (status === "TERMINATED") {
            statusClass = "bg-secondary";
          } else if (status === "REJECTED") {
            statusClass = "bg-danger";
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
            // item.RowNum || "",
            index++,
            item.SR_Number || "",
            item.BranchDestination || "",
            statusBadge,
            item.EncodeDate || "",
            // item.DocStatus || "",
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
            // { title: "Type of Request" },
            { title: "Requesting Branch" },
            { title: "Status" },
            { title: "Date", className: "text-start" },
            // { title: "Picklist No." },
            // { title: "DocStatus", visible: false }
          ],
          pageLength: 50,
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
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            // $("td:eq(1)", row).addClass("text-center");
            $("td:eq(1)", row).addClass("text-start ps-3");
            $("td:eq(2)", row).addClass("text-primary");
            $("td:eq(6)", row).addClass("text-start");
            // row.setAttribute("data-completed", data[6])

            // console.log(`INCOMING DATA STATUS : ${sortedData[index].DocStatus}`)

            // Hover effect
            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#FFFBDF");
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
                  <td colspan="5" style="background:#FFFBDF"></td>
                </tr>
              `);
              $($emptyRow).css({
                background: "#FFFBDF",
                height: "40px",
                "min-height": "40px",
              });
              $emptyRow.hover(
                function () {
                  $("td:not(:first-child)", this).css("background", "#FFF4C2");
                },
                function () {
                  $("td:not(:first-child)", this).css("background", "#FFFBDF");
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

    // console.log(`AVAILABLE ROWS: ${availableRows}`)

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

      const docStatus = checkbox.data("docstatus") || ""
      // console.log(`ROW DOC STATUS : ${docStatus}`)
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
          !srnText.startsWith('SRN') || docStatus == "COMPLETE"
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

    // createPicklistBtn.textContent = "Add to Picklist";
    createPicklistBtn.textContent = "Preview";
    createPicklistBtn.type = "button";

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
      // $.ajax({
      //   url: "dirs/incoming/dashboard/actions/save_createpicklist.php",
      //   type: "POST",
      //   data: {
      //     DocEntry: DocEntries,
      //   },
      //   dataType: "json",
      //   success: function (response) {
      //     if (response.status === "success") {
      //       Swal.fire({
      //         icon: "success",
      //         title: "Picklist has been created",
      //         confirmButtonText: "OKAY",
      //       });
      //       $("#incomingTableDisplay tbody .checkbox")
      //         .hide()
      //         .prop("checked", false);
      //       createPicklistBtn.textContent = "Create Picklist";
      //       loadIncoming();
      //     } else {
      //       Swal.fire({
      //         icon: "error",
      //         title: response.message,
      //         confirmButtonText: "OKAY",
      //         confirmButtonColor: "#d33",
      //       });
      //     }
      //   },
      //   error: function (xhr) {
      //     Swal.fire({
      //       icon: "error",
      //       title: "Server Error",
      //       text: "Something went wrong while processing the request.",
      //     });
      //   },
      // });

      loadPreview(SRNumbers);
    }
  });
}

function loadPreview(SRNumbers) {
  $("main-content").html(spinner);
  $.post("dirs/incoming/dashboard/preview.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

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
          let previewBody = $("#previewTableDisplay tbody");

          const isDisabled = "";

          previewData.forEach((item, index) => {
            // console.log(`PREVIEW ITEM: ${JSON.stringify(item)}`)
            row += `
                <tr style="cursor: pointer" data-docentry="${item.DocEntry}" data-picklisted="${item.PickedStatus}">
                  <td class="ps-5" style="width: 80px; max-width: 80px">
                    <input type="checkbox" name="checkbox" id="${item.DocEntry}" data-docentry="${item.DocEntry}"
                    class="form-check-input align-self-center mx-auto checkbox border border-primary" ${isDisabled}>    
                  </td>
                  <td class="align-middle ps-3" style="background: #f7f7f7">${index + 1}</td>
                  <td class="align-middle ps-3" style="background: #f7f7f7">${item.ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #f7f7f7">${item.ItemName}</td>
                  <td class="align-middle ps-3" style="background: #f7f7f7">${item.ItemCategory}</td>
                  <td class="align-middle ps-3" style="background: #f7f7f7">${item.Request_Qty}</td>
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
  });
}

function togglePreview() {
  const previewPicklistBtn = document.getElementById("previewPicklistBtn");
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
        // if (hasPicklist === "") {
        availableItems++;
        // }
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
      const picklistedStatus = row.data("picklisted")

      if (checkbox) {

        if (picklistedStatus === "Y") {
          checkbox.prop("disabled", true);
        } else {
          checkbox.prop("disabled", false);
        }
        checkbox.show();
      } else {
        checkbox.hide();
      }
    });

    previewPicklistBtn.textContent = "Add to Picklist";
    previewPicklistBtn.type = "button";

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
      return;
    }
  }

  // Swal.fire({
  //   icon: "question",
  //   title: "Are you sure to add the following item(s)?",
  //   confirmButtonText: "Add",
  //   showCancelButton: false,
  //   cancelButtonText: "Back",
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     // CREATE PICK LIST HERE
  //     // $.ajax({
  //     //   url: "dirs/incoming/dashboard/actions/save_createpicklist.php",
  //     //   type: "POST",
  //     //   data: {
  //     //     DocEntry: DocEntries,
  //     //   },
  //     //   dataType: "json",
  //     //   success: function (response) {
  //     //     if (response.status === "success") {
  //     //       Swal.fire({
  //     //         icon: "success",
  //     //         title: "Picklist has been created",
  //     //         confirmButtonText: "OKAY",
  //     //       });
  //     //       $("#incomingTableDisplay tbody .checkbox")
  //     //         .hide()
  //     //         .prop("checked", false);
  //     //       createPicklistBtn.textContent = "Create Picklist";
  //     //       loadIncoming();
  //     //     } else {
  //     //       Swal.fire({
  //     //         icon: "error",
  //     //         title: response.message,
  //     //         confirmButtonText: "OKAY",
  //     //         confirmButtonColor: "#d33",
  //     //       });
  //     //     }
  //     //   },
  //     //   error: function (xhr) {
  //     //     Swal.fire({
  //     //       icon: "error",
  //     //       title: "Server Error",
  //     //       text: "Something went wrong while processing the request.",
  //     //     });
  //     //   },
  //     // });
  //   }
  // });

  // console.log(`ENTRIES: ${entries}`);

  Swal.fire({
    icon: "question",
    title: "Create picklist on the following item(s)?",
    confirmButtonText: "Create",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
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

            $("#previewTableDisplay tbody .checkbox")
              .hide()
              .prop("checked", false);
            previewPicklistBtn.textContent = "Create Picklist"
              // loadPreview();
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
    }
  });
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

          // ================= HEADER =================
          $("#srn").val(header.SR_Number);
          $("#date").val(header.EncodeDate);
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
                <tr style="height: 40px; min-height: 40px">
                  <td class="align-middle ps-3" style="background:#F7F7F7; padding: 3px">${index + 1}</td>
                  <td class="align-middle ps-3" style="background:#F7F7F7; padding: 3px">${item.ItemBrand}</td>
                  <td class="align-middle ps-3" style="background:#F7F7F7; padding: 3px">${item.ItemName}</td>
                  <td class="align-middle ps-3" style="background:#F7F7F7; padding: 3px">${item.ItemCategory}</td>
                  <td class="align-middle ps-3" style="background:#F7F7F7; padding: 3px">${item.Request_Qty}</td>
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
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
                    <td style="background: #F7F7F7"></td>
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

// PICK LIST BASKET
function picklistBasket() {
  if ($.fn.DataTable.isDataTable("#basketTable")) {
    $("#basketTable").DataTable().clear().destroy();
  }
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      loadBasket();
    });
  }, 200);
}

function loadIncomingDashboard() {
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
    });
  }, 200);
}

// PICKLIST BASKET TO PICKLIST ITEMS
$(document).on("dblclick", "#basketTable tbody .open-picklist", function (e) {
  e.preventDefault();
  if (!$(this).find(".open-picklist").length) return;
  let $row = $(this).closest("tr");
  let picklistNum = $row.attr("data-picklist-num");
  // let docEntry = $row.attr("data-doc-entry");
  $("#main-content").html(spinner);
  setTimeout(function () {
    openPicklist(picklistNum);
  }, 200);
});

// PICKLIST ITEMS TO INDIVIDUAL SRN
$(document).on("dblclick", "#picklistItemTable tbody tr", function (e) {
  e.preventDefault();
  if ($(this).hasClass("empty-row")) return;
  // let DocEntry = $(this).data("docentry");
  let SR_Number = $(this).data("srn");
  $("#main-content").html(spinner);
  setTimeout(function () {
    openPicklistedForm(SR_Number);
  }, 200);
});

$(document).on("click", ".dropdown .open-picklist-items", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = picklistedRow.attr("data-picklist-num");
  // let docEntry = picklistedRow.attr("data-doc-entry");

  picklistNumRef = picklistNum;

  $("#main-content").html(spinner);
  setTimeout(function () {
    openPicklist(picklistNum);
  }, 200);
});

// ENTER ACTUAL QUANTITY
$(document).on("click", ".dropdown .enter-actual-qty", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = picklistedRow.attr("data-picklist-num");
  let rowNum = picklistedRow.attr("data-rownum");

  picklistNumRef = picklistNum;

  $("#main-content").html(spinner);
  setTimeout(function () {
    encodeQty(picklistNum, rowNum);
  }, 200);
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
    editEncodedQty(picklistNum, rowNum);
  }, 200);
});

function openPicklist(picklistNum) {
  // console.log(`OPENING PICKLIST: ${picklistNum}`);
  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    { picklistNum: picklistNum },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);

      $.ajax({
        // url: "dirs/incoming/dashboard/actions/get_incomingbreakdown.php",
        // url: "dirs/incoming/dashboard/actions/get_picklist_requests.php",
        url: "dirs/incoming/dashboard/actions/get_picklist_items.php",
        type: "POST",
        dataType: "json",
        data: { PicklistNumber: picklistNum },
        success: function (response) {
          $("#picklistNumDisplay").text(picklistNum);
          let rows = [];
          let index = 1;
          // let existingSeries = new Set();
          if (response.isSuccess === "success") {
            let sortedData = response.Data.sort(
              (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
            );

            sortedData.forEach((item) => {
              console.log(`picklist item: ${JSON.stringify(item)}`)
              // if (existingSeries.has(item.SR_Number)) {
              //   return;
              // }

              // existingSeries.add(item.SR_Number);

              rows.push([
                index++,
                item.Brand || "",
                item.Model || "",
                item.Category || "",
                // item.Quantity || "",
                item.Quantity ? Math.floor(Number(item.Quantity)) : "",
              ]);
            });
            $("#picklistItemTable").DataTable().clear().destroy();
            $("#picklistItemTable").DataTable({
              data: rows,
              columns: [
                { title: "#", className: "text-start ps-5" },
                { title: "Brand", className: "text-start ps-5" },
                { title: "Model", className: "text-start ps-5" },
                { title: "Category", className: "text-start ps-5" },
                { title: "Quantity", className: "text-start ps-5" },
              ],
              // createdRow: function (row, data, dataIndex) {
              // createdRow: function (row, data) {
              //   // let originalItem = sortedData[dataIndex];

              //   $(row)
              //     .attr("data-srn", data.SR_Number)
              //     .attr("data-docentry", data.DocEntry)
              //     .addClass("picklist-row");
              // },
              paging: true,
              searching: true,
              info: true,
              processing: false,
              autoWidth: false,
              // order: [[0, "desc"]],
              rowCallback: function (row, data) {
                const isEmpty = !data[0];
                $("td", row).css({
                  background: "#F7F7F7",
                  padding: "3px",
                  height: "40px",
                  "min-height": "40px",
                  cursor: isEmpty ? "default" : "pointer",
                });
                $("td:eq(2)", row).css("text-align", "start");
              },
              drawCallback: function () {
                let tableBody = $("#picklistItemTable tbody");
                let currentRows = tableBody.find("tr").length;

                for (let i = currentRows; i < 8; i++) {
                  let $emptyRow = $(`
                  <tr class="empty-row" style="background: #f7f7f7">
                    <td colspan="5" style="background: #f7f7f7">&nbsp;</td>
                  </tr>
                `);
                  $emptyRow.css({
                    background: "#f7f7f7",
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
    },
  );
}

// DISPLAY PICKLIST
function loadPicklistItems() {
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post(
      "dirs/incoming/dashboard/picklistItem.php",
      { picklistNum: picklistNumRef },
      function (data) {
        openPicklist(picklistNumRef);
      },
    );
  }, 200);
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
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      loadBasket();
    });
  }, 200);
}

// ALREADY HAS A PICKLIST NUMBER
function openPicklistedForm(SR_Number) {
  $("#pageLoader").removeClass("d-none");
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

            // selectedValue("#typeOfReq", header.TypeRequest);
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
                        <td class="align-middle ps-3" style="background:#F2F2F2; padding: 3px">${index + 1}</td>
                        <td class="align-middle ps-3" style="background:#F2F2F2; padding: 3px">${item.Req_ItemBrand}</td>
                        <td class="align-middle ps-3" style="background:#F2F2F2; padding: 3px">${item.Req_ItemName}</td>
                        <td class="align-middle ps-3" style="background:#F2F2F2; padding: 3px">${item.Req_ItemCategory}</td>
                        <td class="align-middle ps-3" style="background:#F2F2F2; padding: 3px">${Math.trunc(Number(item.Req_Item_Qty) || 0)}</td>
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
                          <td style="background: #F2F2F2"></td>
                          <td style="background: #F2F2F2"></td>
                          <td style="background: #F2F2F2"></td>
                          <td style="background: #F2F2F2"></td>
                          <td style="background: #F2F2F2"></td>
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
    },
  ).fail(function () {
    $("#pageLoader").addClass("d-none");
  });
}

// DISPLAY BASKET
function loadBasket() {
  $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
    $("#main-content").html(data);

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
            (a, b) =>
              Number(b.PKList_Number || 0) - Number(a.PKList_Number || 0),
          );

          const grouped = {};

          sortedData.forEach(item => {
            const key = item.PKList_Number;

            if (!grouped[key]) {
              grouped[key] = {
                ...item,
                totalQty: 0,
                allHaveActualQty: true
              };
            }

            grouped[key].totalQty += Number(item.RequestItemQty || 0);

            if (item.Actual_Item_Qty == null) {
              grouped[key].allHaveActualQty = false;
            }
          });

          // sortedData.forEach((item) => {
          Object.values(grouped).forEach((item) => {
            // console.log(`picklist item : ${JSON.stringify(item)}`)
            const date = new Date(item.DocDate);
            const formatted = date.toISOString().split("T")[0];

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
              ? `<li>
                    <a class="dropdown-item edit-actual-qty" href="#">
                      Edit Actual Quantity
                    </a>
                </li>`
              : `<li>
                    <a class="dropdown-item enter-actual-qty" href="#">
                      Encode Quantity
                    </a>
                </li>`;

            rows.push([
              item.PKList_Number || "",
              formatted || "",
              item.RequestItemQty || "",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklist-items" href="#">Open</a></li>
                  ${printOption}
                  ${actualQtyOption}
                </ul>
              </div>`,
            ]);
          });

          // <li><a class="dropdown-item enter-actual-qty" href="#">Encode Quantity</a></li>

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", ""]);
            }
          }

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
              { title: "Date", className: "text-start ps-5" },
              { title: "Quantity", className: "text-center" },
              { title: "", orderable: false },
            ],
            createdRow: function (row, data, dataIndex) {
              let originalItem = sortedData[dataIndex];

              if (originalItem) {
                $(row)
                  .attr("data-rownum", originalItem.PKList_Number)
                  .attr("data-picklist-num", originalItem.PKList_Number)
                  .addClass("picklist-row");
              }
            },
            paging: true,
            searching: true,
            info: true,
            processing: false,
            autoWidth: false,
            order: [[0, "desc"]],
            rowCallback: function (row, data) {
              $("td", row).css({
                background: "#FFFBDF",
                padding: "3px",
                height: "40px",
                "min-height": "40px",
              });
              $("td:eq(0)", row).addClass("text-primary");
              $("td:eq(1)", row).css("text-align", "start");

              $(row).hover(
                function () {
                  $(this).css("background", "#FFF4C2");
                },
                function () {
                  $(this).css("background", "#FFFBDF");
                },
              );
            },
            drawCallback: function () {
              let tableBody = $("#basketTable tbody");
              let currentRows = tableBody.find("tr").length;

              for (let i = currentRows; i < 8; i++) {
                let $emptyRow = $(`
                <tr class="empty-row" style="background: #FFFBDF">
                  <td colspan="5" style="background: #FFFBDF">&nbsp;</td>
                </tr>`);
                $emptyRow.css({
                  background: "#FFFBDF",
                  height: "40px",
                  "min-height": "40px",
                });
                $emptyRow.hover(
                  function () {
                    $(this).css("background", "#FFF4C2");
                  },
                  function () {
                    $(this).css("background", "#FFFBDF");
                  },
                );
                tableBody.append($emptyRow);
              }
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

                console.log(`PRINTING PICKLIST: ${PKlistNum}`)
                console.log(`PRINTING DOCENTRY: ${DocEntry}`)

                Swal.fire({
                  title: "Print this Picklist?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Print",
                  confirmButtonColor: "#0d6efd",
                  cancelButtonText: "Cancel",
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
                      inputValidator: (value) => {
                        if (!value) {
                          return "Executed By is required!";
                        }
                      },
                    }).then((userInput) => {
                      if (!userInput.isConfirmed) return;

                      let executedBy = userInput.value;

                      // 👉 PROCEED WITH ORIGINAL LOGIC
                      // PRINT ONLY

                      Swal.fire({
                        title: "Printing option",
                        text: "Do you want to print items by category?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Yes, categorized",
                        cancelButtonText: "Normal",
                        allowOutsideClick: false
                      }).then((response) => {
                        const groupByCategory = response.isConfirmed;

                        const openPrint = () => {
                            window.open(
                              `pdf/requests.php?DocEntry=${DocEntry}` +
                              `&executedBy=${encodeURIComponent(executedBy)}` +
                              `&groupByCategory=${groupByCategory ? 1 : 0}`,
                              "_blank"
                            );
                          };
                          openPrint();
                      })
                    });
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
      return; // allow normal typing
  }

  if ($target && $target.length) {
    e.preventDefault();

    $target.focus();

    // Move cursor to end of content
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents($target[0]);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

function encodeQty(picklistNum, rowNum) {
  $.post(
    "dirs/incoming/dashboard/encodeQty.php",
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
              // console.log(`ITEM : ${JSON.stringify(item)}`)
              let key = item.Req_ItemName;
              let qty = Math.trunc(Number(item.Req_Item_Qty) || 0);

              if (!groupedItems[key]) {
                groupedItems[key] = {
                  Req_ItemBrand: item.Req_ItemBrand,
                  Req_ItemName: item.Req_ItemName,
                  Req_ItemCategory: item.Req_ItemCategory,
                  DocEntry: item.DocEntry,
                  totalQty: 0,
                  rows: [], // 🔥 store original rows
                };
              }

              groupedItems[key].totalQty += qty;

              groupedItems[key].rows.push({
                Item_id: item.Item_id,
                SR_Number: item.SR_Number,
              });
            });

            let index = 0;
            let totalQty = 0;

            srNumberMap = response.Data.map((item) => item.SR_Number);
            formattedDate();
            let rows = "";
            let picklistEntry = "";

            let groupedArray = Object.values(groupedItems);

            Object.values(groupedItems).forEach((item) => {
              picklistEntry = item.DocEntry;
              index++;
              rows += `
                <tr style="height: 50px; min-height: 50px" data-rows='${JSON.stringify(item.rows)}'>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${index}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemName}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemCategory}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.totalQty}</td>
                  <td class="align-middle ps-3 editable-cell" style="background: #FFFBDF" contenteditable="true" onfocus="handleFocus(this)" oninput="validateNumber(this)"></td>
                </tr>
              `;
            });

            $("#totalEncodedQty").text(totalQty);
            $("#encodeQtyTable tbody").html(rows);

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
                $("#encodeQtyTable tbody").append(emptyRow);
              }
              $("#totalEncodedQty").text(totalQty);
            }

            submitEncodedQty(picklistEntry, picklistNum);
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
  // Remove outline styling
  el.style.outline = "none";
  el.style.boxShadow = "none";

  // Remove red border immediately on focus
  $(el).removeClass("border border-danger");
}

function validateNumber(el) {
  let value = $(el).text();

  // Keep only digits
  value = value.replace(/\D/g, "");

  // Limit to max 3 characters
  if (value.length > 3) {
    value = value.substring(0, 3);
  }

  // Update text only once
  $(el).text(value);

  // Always move cursor to end
  let range = document.createRange();
  let sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function submitEncodedQty(PicklistEntry, picklistNum, mode) {
  $("#encodeqty").off("submit", "#encodeqty").on("submit", "#encodeqty", function (e) {
    e.preventDefault();
    let isValid = true;

    $(".editable-cell").each(function () {
      let value = $(this).text().trim();

      // Check if empty
      if (value === "") {
        isValid = false;
        $(this).addClass("border border-danger"); // highlight
      } else {
        $(this).removeClass("border border-danger");
      }
    });

    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Please fill in all Actual quantity fields",
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
        // SAVE DATA
        let encodedItems = [];

        $("#encodeQtyTable tbody tr").each(function () {
          let cells = $(this).find("td");
          let actualQty = $(cells[5]).text().trim();

          let originalRows = $(this).data("rows");

          if (!originalRows || actualQty === "") return;

          // 🔥 distribute qty equally OR fully apply
          originalRows.forEach((row) => {
            encodedItems.push({
              ItemNumber: row.Item_id,
              ActualQty: actualQty,
              SR_Number: row.SR_Number,
            });
          });
        });

        Swal.fire({
          title: "Executed By",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          inputPlaceholder: "Enter your name",
          showCancelButton: true,
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          inputValidator: (value) => {
            if (!value) {
              return "Executed By is required!";
            }
          },
        }).then((userInput) => {
          if (!userInput.isConfirmed) return;

          // COUNT THE BRANCH FIRST BEFORE UPDATING
          // IF SINGLE BRANCH REDIRECT TO LOADING BASKET FOR DELIVERY

          let DocEntry = "";

          let executedBy = userInput.value;
          let formId = mode === "edit" ? "editEncodedQty" : "encodeqty";
          let formData = new FormData(document.getElementById(formId));
          // let formData = new FormData(document.getElementById("encodeqty"));

          formData.append("ExecutedBy", executedBy);
          let srnIndex = 0;

          encodedItems.forEach((item) => {
            formData.append("ItemNumber[]", item.ItemNumber);
            formData.append("ActualQty[]", item.ActualQty);
            formData.append("SR_Number[]", item.SR_Number);
          });

          // PRINT WITH ACTUAL QUANTITY
          let PickListNum = picklistNum;

          $.ajax({
            url: "dirs/incoming/dashboard/actions/update_actual_qty.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
              let res = typeof response === "string" ? JSON.parse(response) : response;

              const DocEntry = PicklistEntry;

              if (res.status === "success") {

                const DocEntry = PicklistEntry;

                Swal.fire({
                  title: "Printing option",
                  text: "Do you want to print items by category?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Yes, categorized",
                  cancelButtonText: "Normal",
                  allowOutsideClick: false,
                }).then((swalResult) => {

                  const groupByCategory = swalResult.isConfirmed; // ✅ correct place

                  console.log(`DOC ENTRY: ${DocEntry}`);
                  console.log(`EXECUTED BY: ${executedBy}`);
                  console.log(`GROUP BY CATEGORY: ${groupByCategory}`);

                  const openPrint = () => {
                    window.open(
                      `pdf/requests.php?DocEntry=${DocEntry}` +
                      `&executedBy=${encodeURIComponent(executedBy)}` +
                      `&groupByCategory=${groupByCategory ? 1 : 0}`,
                      "_blank"
                    );
                  };

                  openPrint();
                  loadBasketContent();
                });

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
          });
        });
      }
    });
  });
}

// UPDATE ACTUAL QUANTITY
function editEncodedQty(picklistNum, rowNum) {
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
                  Actual_Item_Qty: actual_qty,
                  rows: [], // 🔥 store original rows
                };
              }

              groupedItems[key].totalQty += qty;
              groupedItems[key].Actual_Item_Qty = actual_qty;

              groupedItems[key].rows.push({
                Item_id: item.Item_id,
                SR_Number: item.SR_Number,
              });
            });

            let index = 0;
            let totalQty = 0;

            srNumberMap = response.Data.map((item) => item.SR_Number);
            formattedDate();
            let rows = "";
            let picklistEntry = "";

            let groupedArray = Object.values(groupedItems);

            Object.values(groupedItems).forEach((item) => {
              picklistEntry = item.DocEntry;
              index++;
              rows += `
                <tr style="height: 50px; min-height: 50px" data-rows='${JSON.stringify(item.rows)}'>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${index}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemBrand}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemName}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.Req_ItemCategory}</td>
                  <td class="align-middle ps-3" style="background: #F7F7F7;">${item.totalQty}</td>
                  <td class="align-middle ps-3 editable-cell" style="background: #FFFBDF" contenteditable="true" onfocus="handleFocus(this)" oninput="validateNumber(this)">${item.Actual_Item_Qty}</td>
                </tr>
              `;
            });

            // $("#totalEncodedQty").text(totalQty);
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
              // $("#totalEncodedQty").text(totalQty);
            }

            submitEncodedQty(picklistEntry, picklistNum);
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