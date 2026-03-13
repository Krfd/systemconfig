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
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.SeriesNum || 0) - Number(a.SeriesNum || 0),
        );

        sortedData.forEach((item) => {
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

          if (existingSeries.has(item.SeriesNum)) {
            return;
          }

          existingSeries.add(item.SeriesNum);

          const isDisabled =
            item.PicklistNumber && item.PicklistNumber.trim() !== ""
              ? "disabled"
              : "";

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.SeriesNum}" data-rownum="${item.SeriesNum}" 
            class="form-check-input checkbox align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,
            item.SeriesNum || "",
            item.SRN || "",
            item.RequestType || "",
            item.Branch || "",
            statusBadge,
            item.DocDate || "",
            item.PicklistNumber || "",
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", "", "", ""]);
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
            { title: "Type of Request" },
            { title: "Requesting Branch" },
            { title: "Status" },
            { title: "Date" },
            { title: "Picklist No." },
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
          rowCallback: function (row, data) {
            $("td:not(:first-child)", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(1)", row).addClass("text-center");
            $("td:eq(2)", row).addClass("text-primary");
            $("td:eq(6)", row).addClass("text-start");

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
                  <td colspan="7" style="background:#FFFBDF"></td>
                </tr>
              `);
              $($emptyRow).css({
                background: "#FFFBDF",
                height: "40px",
                "min-height": "40px",
                cursor: "pointer",
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

  const selectionMode =
    $("#incomingTableDisplay tbody .checkbox:visible").length > 0;

  const checkedIds = [];
  $("#incomingTableDisplay tbody .checkbox:checked").each(function () {
    checkedIds.push($(this).data("rownum"));
  });

  if (!selectionMode) {
    let availableRows = 0;

    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim();
      const picklistNo = row.find("td:eq(7)").text().trim();
      const statusText = row.find("td:eq(5)").text().trim().toUpperCase();

      if (
        srnText.startsWith("SRN") &&
        picklistNo === "" &&
        statusText === "NEW"
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
      const srnText = row.find("td:eq(2)").text().trim(); // SRN column
      const picklistNo = row.find("td:eq(7)").text().trim(); // Picklist No column
      const statusText = row.find("td:eq(5)").text().trim().toUpperCase();
      const checkbox = row.find(".checkbox");

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
          picklistNo !== "" ||
          restrictedStatuses.includes(statusText) ||
          statusText !== "NEW"
        ) {
          checkbox.prop("disabled", true);
        } else {
          checkbox.prop("disabled", false);
        }
      } else {
        checkbox.hide();
      }
    });

    createPicklistBtn.textContent = "Add to Picklist";
    createPicklistBtn.type = "button";

    return;
  }

  if (checkedIds.length == 0) {
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

  Swal.fire({
    icon: "question",
    title: "Generate picklist number and add the following items?",
    text: "This action cannot be change",
    confirmButtonText: "Create",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "dirs/incoming/dashboard/actions/save_createpicklist.php",
        type: "POST",
        data: { RowNumber: checkedIds },
        dataType: "json",
        success: function (response) {
          if (response.status === "success") {
            Swal.fire({
              icon: "success",
              title: response.message,
              confirmButtonText: "OKAY",
            });
            $("#incomingTableDisplay tbody .checkbox")
              .hide()
              .prop("checked", false);
            createPicklistBtn.textContent = "Create Picklist";
            loadIncoming();
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
    }
  });
}

$(document).on("dblclick", "#incomingTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let RowNum = $(this).find("td:nth-child(2)").text().trim();
  $("#main-content").html(spinner);
  setTimeout(function () {
    openIncoming(RowNum);
  }, 200);
});

function openIncoming(RowNum) {
  $("#pageLoader").removeClass("d-none");
  $.post("dirs/incoming/dashboard/form.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    $.ajax({
      url: "dirs/incoming/dashboard/actions/get_openincoming.php",
      type: "POST",
      data: { RowNum: RowNum },
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

          selectedValue("#typeOfReq", header.RequestType);
          selectedValue("#destination", header.Destination);
          selectedValue("#branchWhCode", header.DestinationWhs);
          selectedValue("#origin", header.Origin);
          selectedValue("#whcode", header.OriginWhs);

          // ================= HEADER =================
          $("#srn").val(header.BaseNum_SRN);
          $("#date").val(header.DocDate);
          $("#status").val(header.RequestStatus);
          $("#purpose").val(header.RequestPurpose);
          $("#reqBy").val(header.PrepBy);
          $("#remarks").val(header.Remarks);

          // ================= ITEMS =================
          let rows = "";

          items.forEach(function (item, index) {
            let quantity = parseFloat(item.Quantity) || 0;
            totalQty += quantity;
            rows += `
                <tr style="height: 40px; min-height: 40px">
                  <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${index + 1}</td>
                  <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
                  <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
                  <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
                  <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
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

$(document).on("dblclick", "#basketTable tbody .open-picklist", function (e) {
  e.preventDefault();
  let $row = $(this).closest("tr");
  let picklistNum = $row.attr("data-picklist-num");
  $("#main-content").html(spinner);
  setTimeout(function () {
    openPicklist(picklistNum);
  }, 200);
});

$(document).on("click", ".dropdown .open-picklist-items", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let picklistNum = picklistedRow.attr("data-picklist-num");

  picklistNumRef = picklistNum;

  console.log(`OPENING PICKLIST ITEMS`);
  $("#main-content").html(spinner);
  setTimeout(function () {
    openPicklist(picklistNum);
  }, 200);
});

$(document).on("click", ".dropdown .open-picklisted", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let RowNum = picklistedRow.attr("data-rownum");

  $("#main-content").html(spinner);
  setTimeout(function () {
    openPicklistedForm(RowNum);
  }, 200);
});

function openPicklist(picklistNum) {
  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    { picklistNum: picklistNum },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);

      $.ajax({
        url: "dirs/incoming/dashboard/actions/get_incomingbreakdown.php",
        type: "POST",
        dataType: "json",
        data: { picklistNum: picklistNum },
        success: function (response) {
          $("#picklistNumDisplay").text(picklistNum);
          let rows = [];
          let existingSeries = new Set();
          if (response.isSuccess === "success") {
            let sortedData = response.Data.sort(
              (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
            );

            sortedData.forEach((item) => {
              if (existingSeries.has(item.BaseNum_SRN)) {
                return;
              }

              existingSeries.add(item.BaseNum_SRN);

              rows.push([
                item.BaseNum_SRN || "",
                item.DocDate || "",
                item.ReqBranch || "",
                // item.PickedQty || "",
                '<div class="dropdown dropstart" data-bs-auto-close="outside">' +
                  '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                  '<i class="bi bi-three-dots"></i></button>' +
                  `<ul class="dropdown-menu">
                    <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                    <li>
                      <a class="dropdown-item print-picklist" 
                        href="#"
                        data-srn="${item.BaseNum_SRN}"
                        data-picklist="${picklistNum}">
                        Print
                      </a>
                    </li>
                  </ul>
                </div>`,
              ]);
            });
            $("#picklistItemTable").DataTable().clear().destroy();
            $("#picklistItemTable").DataTable({
              data: rows,
              columns: [
                { title: "SRN", className: "text-start open-picklisted ps-5" },
                { title: "Date", className: "text-start ps-5" },
                { title: "Requesting Branch", className: "text-start ps-5" },
                // { title: "Quantity" },
                { title: "", orderable: false },
              ],
              createdRow: function (row, data, dataIndex) {
                let originalItem = sortedData[dataIndex];

                $(row)
                  .attr("data-srn", originalItem.BaseNum_SRN)
                  .attr("data-rownum", originalItem.RowNum)
                  .addClass("picklist-row");
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
                  cursor: "pointer",
                });
                $("td:eq(0)", row).addClass("text-primary");
                $("td:eq(2)", row).css("text-align", "start");

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
                let tableBody = $("#picklistItemTable tbody");
                let currentRows = tableBody.find("tr").length;

                for (let i = currentRows; i < 8; i++) {
                  let $emptyRow = $(`
                  <tr class="empty-row" style="background: #FFFBDF">
                    <td colspan="4" style="background: #FFFBDF">&nbsp;</td>
                  </tr>
                `);
                  $emptyRow.css({
                    background: "#FFFBDF",
                    height: "40px",
                    "min-height": "40px",
                    cursor: "pointer",
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

                // Attach click for Print buttons dynamically
                $(".print-picklist")
                  .off("click")
                  .on("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation(); // prevent dropdown or row click from interfering

                    const srn = $(this).data("srn");
                    const picklist = $(this).data("picklist");

                    // console.log(`SRN: ${srn} : PICKLIST: ${picklist}`);

                    // Swal.fire({
                    //   title: "Print this Picklist?",
                    //   icon: "question",
                    //   showCancelButton: true,
                    //   confirmButtonText: "Print",
                    //   confirmButtonColor: "#0d6efd",
                    //   cancelButtonText: "Cancel",
                    // }).then((result) => {
                    //   if (result.isConfirmed) {
                    window.open(
                      `pdf/req.php?srn=${srn}&picklist=${picklist}`,
                      "_blank",
                    );
                    //   }
                    // });
                  });
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
  console.log(`RETURNING BACK TO PICKLIST ITEMS`);
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
function openPicklistedForm(RowNum) {
  console.log(`OPENING PICKLISTED FORM`);
  $("#pageLoader").removeClass("d-none");
  $.post(
    "dirs/incoming/dashboard/picklistedForm.php",
    { RowNum: RowNum },
    function (data) {
      $("#main-content").hide().html(data).fadeIn(200);

      $.ajax({
        url: "dirs/incoming/dashboard/actions/get_openincoming.php",
        type: "POST",
        data: { RowNum: RowNum },
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

            selectedValue("#typeOfReq", header.RequestType);
            selectedValue("#destination", header.Destination);
            selectedValue("#branchWhCode", header.DestinationWhs);
            selectedValue("#origin", header.Origin);
            selectedValue("#whcode", header.OriginWhs);

            // ================= HEADER =================
            $("#srn").val(header.BaseNum_SRN);
            $("#date").val(header.DocDate);
            $("#status").val(header.RequestStatus);
            $("#purpose").val(header.RequestPurpose);
            $("#reqBy").val(header.PrepBy);
            $("#remarks").val(header.Remarks);

            // ================= ITEMS =================
            let rows = "";

            items.forEach(function (item, index) {
              let quantity = parseFloat(item.Quantity) || 0;
              totalQty += quantity;
              rows += `
                      <tr style="height: 40px; min-height: 40px">
                        <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${index + 1}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
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
            (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
          );

          sortedData.forEach((item) => {
            rows.push([
              item.PickLst_Num || "",
              item.DocDate || "",
              item.PickedQty || "",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklist-items" href="#">Open</a></li>
                  <li>
                      <a class="dropdown-item print-picklist" 
                        href="#"
                        data-picklist="${item.PickLst_Num}">
                        Print
                      </a>
                    </li>
                </ul>
              </div>`,
            ]);
          });

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
                  .attr("data-rownum", originalItem.RowNum)
                  .attr("data-picklist-num", originalItem.PickLst_Num)
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
                cursor: "pointer",
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
                </tr>
              `);
                $emptyRow.css({
                  background: "#FFFBDF",
                  height: "40px",
                  "min-height": "40px",
                  cursor: "pointer",
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

              // $("#basketTable").on("click", ".print-picklist", function (e) {
              //   e.preventDefault();
              //   e.stopPropagation(); // prevent dropdown or row click from interfering

              //   // const srn = $(this).data("srn");
              //   const PKlistNum = $(this).data("picklist");

              //   Swal.fire({
              //     title: "Print this Picklist?",
              //     icon: "question",
              //     showCancelButton: true,
              //     confirmButtonText: "Print",
              //     confirmButtonColor: "#0d6efd",
              //     cancelButtonText: "Cancel",
              //   }).then((result) => {
              //     if (result.isConfirmed) {
              //       $.post(
              //         "dirs/incoming/dashboard/actions/save_print_delivery.php",
              //         { PKlistNum: PKlistNum },
              //         function () {
              //           window.open(
              //             `pdf/requests.php?picklist=${PKlistNum}`,
              //             "_blank",
              //           );
              //         },
              //       );
              //     }
              //   });
              // });
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
  });
}

// PRINT PICKLIST
$("#basketTable").on("click", ".print-picklist", function (e) {
  e.preventDefault();
  e.stopPropagation(); // prevent dropdown or row click from interfering

  // const srn = $(this).data("srn");
  const PKlistNum = $(this).data("picklist");

  Swal.fire({
    title: "Print this Picklist?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Print",
    confirmButtonColor: "#0d6efd",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/incoming/dashboard/actions/save_print_delivery.php",
        { PKlistNum: PKlistNum },
        function () {
          window.open(`pdf/requests.php?picklist=${PKlistNum}`, "_blank");
        },
      );
    }
  });
});
