$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
  $(".checkbox").hide();
});

function loadDashboard() {
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);
  });
  cancelPicklist();
  loadIncoming();
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
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          const isDisabled =
            item.PickListNumber && item.PickListNumber.trim() !== ""
              ? "disabled"
              : "";

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.RowNum}" data-rownum="${item.RowNum}" 
            class="form-check-input checkbox align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,
            item.RowNum || "",
            item.BaseNum_SRN || "",
            item.RequestType || "",
            item.Orgin_Dstnation || "",
            item.RequestStatus || "",
            item.DocDate || "",
            item.PickListNumber || "",
          ]);
        });

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

          paging: true,
          searching: true,
          info: true,
          autoWidth: false,
          order: [[1, "desc"]],

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

              // Hover effect (exclude first column)
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

function handleAddToPicklist() {
  alert("Items added to picklist!");
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

      if (srnText.startsWith("SRN")) {
        row.find(".checkbox").show(); // Show valid rows
      } else {
        row.find(".checkbox").hide(); // Hide invalid rows
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
  $.post(
    "dirs/incoming/dashboard/form.php",
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
  )
  .fail(function () {
    $("#pageLoader").addClass("d-none");
  });
}

var basketTable;

// PICK LIST BASKET
function picklistBasket() {
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

// function loadReturn() {
//   $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
//     $("#main-content").html(data);
//   });
// }

$(document).on("click", ".open-picklist", function (e) {
  e.preventDefault();

  let table = $("#basketTable").DataTable();
  let rowData = table.row($(this).closest("tr")).data();

  // let picklistNum = $(this).attr("data-picklist-num");
  // let rownum = $(this).attr("data-rownum");

  let picklistNum = rowData[0]; 
  let rownum = table.row($(this).closest("tr")).index();

  console.log(`PICKLIST NUM: ${picklistNum}`)
  console.log(`ROWNUM: ${rownum}`)

  openPicklist(picklistNum, rownum);
});

function openPicklist(picklistNum, rownum) {

  $("#picklistNumDisplay").text(picklistNum)

  $.post(
    "dirs/incoming/dashboard/picklistItem.php",
    // { picklistNum, rownum },
    function (data) {
      $("#main-content").html(data);

       $.ajax({
        url: "dirs/incoming/dashboard/actions/get_incomingbreakdown.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
          let rows = [];
          if (response.isSuccess === "success") {
            let sortedData = response.Data.sort(
              (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
            );

            sortedData.forEach((item) => {
              rows.push([
                item.BaseNum_SRN || "",
                item.DocDate || "",
                item.Prep_Branch || "",
                item.PickedQty || "",
                '<div class="dropdown dropstart">' +
                  '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                  '<i class="bi bi-three-dots"></i></button>' +
                  `<ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="openPicklistedIncoming(${item.RowNum})">Open</a></li>
                    <li><a class="dropdown-item" href="#">Print</a></li>
                  </ul>
                </div>`,
              ]);
            });

            $("#picklistItemTable").DataTable().clear().destroy();
            $("#picklistItemTable").DataTable({
              data: rows,
              columns: [
                { title: "SRN", className: "text-center" },
                { title: "Date", className: "text-start" },
                { title: "Requesting Branch" },
                { title: "Quantity" },
                { title: "", orderable: false },
              ],
              createdRow: function (row, data, dataIndex) {
              let originalItem = sortedData[dataIndex];

              console.log(originalItem);

              $(row)
                .attr("data-rownum", originalItem.RowNumOrder)
                .attr("data-picklist-num", originalItem.BaseNum_SRN)
                // .addClass("picklist-row");
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
                let tableBody = $("#picklistItemTable tbody");
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
    },
  );
}

function cancelPicklist() {
  $(document).on("click", ".cancel-picklist", function () {
    const picklistId = $(this).data("picklist");

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel Picklist " + picklistId,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      // cancelButtonColor: "#3085d6",
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

// function openPicklistedIncoming(RowNum) {
//   $.post("dirs/incoming/form/form.php", { RowNum: RowNum }, function (data) {
//     $("#main-content").html(data);
//   });
// }

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
                  <li><a class="dropdown-item" href="#" onclick="openPicklistedIncoming(${item.RowNum})">Open</a></li>
                  <li><a class="dropdown-item" href="#">Print</a></li>
                </ul>
              </div>`,
            ]);
          });

          $("#basketTable").DataTable().clear().destroy();
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

              $(row)
              .attr("data-rownum", originalItem.RowNumOrder)
              .attr("data-picklist-num", originalItem.PickLst_Num)
              // .attr("data-srn", originalItem.BaseNum_SRN)
              .addClass("picklist-row");
              // console.log(`PICKLIST NUM: ${originalItem.PickLst_Num}`)
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
  })
}