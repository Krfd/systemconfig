$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
  // $(".checkbox").hide();
});

function loadDashboard() {
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);
    loadIncoming();
  });
  cancelPicklist();
}

var incomingTable;

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
          // 🚫 Skip duplicate rows
          if (existingSeries.has(item.SeriesNum)) {
            return;
          }

          existingSeries.add(item.SeriesNum);

          const isDisabled =
            item.PicklistNumber && item.PicklistNumber.trim() !== ""
              ? "disabled"
              : "";

          console.log(
            `SERIES NUM: ${item.SeriesNum} | PICKLIST NUM: ${item.PicklistNumber}`,
          );

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.SeriesNum}" data-rownum="${item.SeriesNum}" 
            class="form-check-input checkbox align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,
            item.SeriesNum || "",
            item.SRN || "",
            item.RequestType || "",
            item.Branch || "",
            item.RequestStatus || "",
            item.DocDate || "",
            item.PicklistNumber || "",
          ]);
        });

        const minRows = 8;
        while (rows.length < minRows) {
          rows.push(["", "", "", "", "", "", "", ""]);
        }

        if ($.fn.DataTable.isDataTable("#incomingTableDisplay")) {
          $("#incomingTableDisplay").DataTable().clear().destroy();
        }

        $("#incomingTableDisplay").DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center", orderable: false },
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
          autoWidth: false,
          // order: [[1, "desc"]],
          language: {
            emptyTable: "", // 🔥 removes "No data available in table"
          },
          rowCallback: function (row, data) {
            $("td:not(:first-child)", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
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
                  <td style="background:#FFFBDF"></td>
                  <td style="background:#FFFBDF"></td>
                  <td style="background:#FFFBDF"></td>
                  <td style="background:#FFFBDF"></td>
                  <td style="background:#FFFBDF"></td>
                  <td style="background:#FFFBDF"></td>
                  <td style="background:#FFFBDF"></td>
                </tr>
              `);

              // Set row height
              $("td", $emptyRow).css({
                height: "40px",
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

  // Are we currently in selection mode?
  const selectionMode =
    $("#incomingTableDisplay tbody .checkbox:visible").length > 0;

  // Collect checked IDs
  const checkedIds = [];
  $("#incomingTableDisplay tbody .checkbox:checked").each(function () {
    checkedIds.push($(this).data("rownum"));
  });

  // ==========================
  // ENTER SELECTION MODE
  // ==========================
  if (!selectionMode) {
    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim(); // SRN column
      const picklistNo = row.find("td:eq(7)").text().trim(); // Picklist No column
      const checkbox = row.find(".checkbox");

      if (srnText.startsWith("SRN")) {
        checkbox.show();

        // If Picklist No. already exists → disable checkbox
        if (picklistNo !== "") {
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

  // ==========================
  // VALIDATE SELECTION
  // ==========================

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
  openIncoming(RowNum);
});

function openIncoming(RowNum) {
  $("#pageLoader").removeClass("d-none");
  $.post("dirs/incoming/dashboard/form.php", function (data) {
    $("#main-content").html(data);

    $.ajax({
      url: "dirs/incoming/dashboard/actions/get_openincoming.php",
      type: "POST",
      data: { RowNum: RowNum },
      dataType: "json",
      success: function (response) {
        // console.log(`RESPONSE: ${JSON.stringify(response.Data)}`);
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

var basketTable;

// PICK LIST BASKET
function picklistBasket() {
  if ($.fn.DataTable.isDataTable("#basketTable")) {
    $("#basketTable").DataTable().clear().destroy();
  }
  $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
    $("#main-content").html(data);
    loadBasket();
  });
}

function loadIncomingDashboard() {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

$(document).on("click", ".open-picklist", function (e) {
  e.preventDefault();
  let $row = $(this).closest("tr");
  let picklistNum = $row.attr("data-picklist-num");
  picklistNumber = picklistNum;
  openPicklist(picklistNum);
});

$(document).on("click", ".open-picklisted", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let RowNum = picklistedRow.attr("data-rownum");

  openPicklistedForm(RowNum);
});

// OPEN PICKLIST
function openPicklist(picklistNum) {
  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    { picklistNum: picklistNum },
    function (data) {
      $("#main-content").html(data);

      $.ajax({
        url: "dirs/incoming/dashboard/actions/get_incomingbreakdown.php",
        type: "POST",
        dataType: "json",
        data: { picklistNum: picklistNum },
        success: function (response) {
          $("#picklistNumDisplay").text(picklistNum);
          let rows = [];
          if (response.isSuccess === "success") {
            let sortedData = response.Data.sort(
              (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
            );

            sortedData.forEach((item) => {
              rows.push([
                item.BaseNum_SRN || "",
                item.DocDate || "",
                item.ReqBranch || "",
                // item.PickedQty || "",
                '<div class="dropdown dropstart">' +
                  '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                  '<i class="bi bi-three-dots"></i></button>' +
                  `<ul class="dropdown-menu">
                    <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                    <li><a class="dropdown-item print-picklisted" href="#">Print</a></li>
                  </ul>
                </div>`,
              ]);
            });

            $("#picklistItemTable").DataTable().clear().destroy();
            $("#picklistItemTable").DataTable({
              data: rows,
              columns: [
                { title: "SRN", className: "text-center open-picklisted" },
                { title: "Date", className: "text-center ps-5" },
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
  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    { picklistNum: picklistNumber },
    function (data) {
      openPicklist(picklistNumber);
    },
  );
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

// PICK LIST ITEMS
function loadBasketContent() {
  $.post("dirs/incoming/dashboard/picklistBasket.php", {}, function (data) {
    $("#main-content").html(data);
    loadBasket();
  });
}

// ALREADY HAS A PICKLIST NUMBER
function openPicklistedForm(RowNum) {
  $("#pageLoader").removeClass("d-none");
  $.post(
    "dirs/incoming/dashboard/picklistedForm.php",
    { RowNum: RowNum },
    function (data) {
      $("#main-content").html(data);

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

    $.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
      return this.api()
        .column(col, { order: "index" })
        .nodes()
        .map(function (td) {
          if ($(td).text().trim() === "") return Infinity;
          return $(td).text();
        });
    };

    $.ajax({
      url: "dirs/incoming/dashboard/actions/picklisteditems.php",
      type: "POST",
      dataType: "json",
      success: function (response) {
        // ✅ Safety fallback
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
                  <li><a class="dropdown-item open-picklist" href="#">Open</a></li>
                  <li><a class="dropdown-item" href="#">Print</a></li>
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
              { title: "Picklist No.", className: "text-center open-picklist" },
              { title: "Date", className: "text-start" },
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

              // Add hover effect to empty rows too
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

$(document).on("click", ".print-picklisted", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let RowNum = picklistedRow.attr("data-rownum");

  printSrnPicklist(RowNum);
});

// PRINT PICKLIST ITEMS
function printPicklist() {
  Swal.fire({
    icon: "question",
    title: "Are you sure to print this picklist?",
    text: "This will set the picklist into receiving process",
    showConfirmButton: true,
    confirmButtonText: "Yes, print picklist",
    showCancelButton: true,
    cancelButtonText: "Back",
  });
}

// PRINT INDIVIDUAL SRN IN PICKLIST
function printSrnPicklist(RowNum) {
  console.log("Printing picklist for SRN RowNum: " + RowNum);
  Swal.fire({
    icon: "question",
    title: "Print this Request?",
    showConfirmButton: true,
    confirmButtonText: "Yes, print",
    showCancelButton: true,
    cancelButtonText: "Back",
  });
}
