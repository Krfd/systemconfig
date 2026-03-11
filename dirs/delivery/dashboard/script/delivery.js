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
  $.post("dirs/delivery/dashboard/components/main.php", {}, function (data) {
    $("#delivery_content").html(data);
    loadDelivery();
    $("#deliveryTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
  });
  // cancelPicklist();
}

// DELIVERY DASHBOARD
function loadDelivery() {
  $.ajax({
    url: "dirs/delivery/dashboard/actions/get_deliveries.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let existingSeries = new Set();
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.Delivery_Num || 0) - Number(a.Delivery_Num || 0),
        );

        sortedData.forEach((item) => {
          let status = item.Status ? item.Status.toUpperCase() : "";
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

          if (existingSeries.has(item.Delivery_Num)) {
            return;
          }

          existingSeries.add(item.Delivery_Num);

          rows.push([
            item.RowNumOrder || "",
            item.Delivery_Num || "",
            item.PickList_Num || "",
            statusBadge,
            item.Delivery_Date || "",
          ]);
        });

        // let minRows = 8;
        // if (rows.length < minRows) {
        //   rows.push(["", "", "", "", "", "", "", ""]);
        // }

        if ($.fn.DataTable.isDataTable("#deliveryTableDisplay")) {
          $("#deliveryTableDisplay").DataTable().clear().destroy();
          $("#deliveryTableDisplay tbody").empty();
        }

        $("#deliveryTableDisplay").DataTable({
          data: rows,
          columns: [
            { title: "#", className: "text-center" },
            { title: "DR No." },
            { title: "Picklist No." },
            { title: "Status" },
            { title: "Delivery Date" },
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
            $("td", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });

            $("td:eq(0)", row).addClass("text-center");
            $("td:eq(1)", row).addClass("text-primary");
            $("td:eq(5)", row).addClass("text-start");

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
            let tableBody = $("#deliveryTableDisplay tbody");

            tableBody.find(".empty-row").remove();
            tableBody.find("td.dataTables_empty").closest("tr").remove();

            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="5" style="background:#FFFBDF"></td>
                </tr>
              `);

              $($emptyRow).css({
                background: "#FFFBDF",
                height: "40px",
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

function loadDeliveryDashboard() {
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
    });
  }, 200);
}

$(document).on(
  "click",
  "#deliveryBasketTable tbody .open-picklist",
  function (e) {
    e.preventDefault();
    let $row = $(this).closest("tr");
    // let DeliveryNum = $row.attr("data-delivery-num");
    // let RowNumber = $row.attr("data-rownum");
    let PickLst_Num = $row.attr("data-picklist");
    // DeliveryNum = deliveryNum;
    // RowNumber = rowNumber;
    $("#main-content").html(spinner);
    setTimeout(function () {
      // openPicklist(picklistNumber);
      // openDeliveryRequest(DeliveryNum, RowNumber);
      loadDeliveryItems(PickLst_Num);
    }, 200);
  },
);

// function openPicklist(picklistNumber) {
//   $.post(
//     "dirs/delivery/dashboard/loadDeliveryItems.php",
//     { picklistNumber: picklistNumber },
//     function (data) {
//       $("#main-content").hide().html(data).fadeIn(200);
//     },
//   );
// }

function loadDeliveryBasketContent() {
  $("#main-content").html(spinner);
  setTimeout(function () {
    loadDeliveryBasket();
  }, 200);
}

// DELIVERY BASKET
function loadDeliveryBasket() {
  $.post("dirs/delivery/dashboard/loadDeliveryBasket.php", {}, function (data) {
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
      url: "dirs/delivery/dashboard/actions/get_deliveries.php",
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
            (a, b) => Number(b.RowNumOrder || 0) - Number(a.RowNumOrder || 0),
          );

          sortedData.forEach((item) => {
            rows.push([
              item.PickList_Num || "",
              item.DocDate || "",
              item.ItemCount || "",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklist" href="#">Open</a></li>
                  <li><a class="dropdown-item remove-picklist" href="#">Remove</a></li>
                  <li><a class="dropdown-item create-dr" href="#" data-picklist="${item.PickList_Num}">Create DR</a></li>
                </ul>
              </div>`,
            ]);
          });

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", ""]);
            }
          }

          if ($.fn.DataTable.isDataTable("#deliveryBasketTable")) {
            $("#deliveryBasketTable").DataTable().clear().destroy();
          }

          $("#deliveryBasketTable").DataTable({
            data: rows,
            columns: [
              {
                title: "Picklist No.",
                className: "text-start open-picklist ps-2",
              },
              { title: "Date", className: "text-start ps-2" },
              { title: "Quantity", className: "text-start ps-2" },
              { title: "", orderable: false },
            ],
            createdRow: function (row, data, dataIndex) {
              let originalItem = sortedData[dataIndex];

              if (originalItem) {
                $(row)
                  .attr("data-rownum", originalItem.RowNumOrder)
                  .attr("data-delivery-num", originalItem.Delivery_Num)
                  .attr("data-picklist", originalItem.PickList_Num);
                // .addClass("picklist-row");
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
              $("td:eq(0)", row).addClass("text-primary ps-2");
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
              let tableBody = $("#deliveryBasketTable tbody");
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
  });
}

$(document).on("dblclick", "#deliveryItemsTable tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let Picklist = $(this).find("td:nth-child(0)").text().trim();

  $("#main-content").html(spinner);
  setTimeout(function () {
    // openDeliveryPicklist(Picklist);

    let DeliveryNum = $row.attr("data-delivery-num");
    let RowNumber = $row.attr("data-rownum");
    openDeliveryRequest(DeliveryNum, RowNumber);
  }, 200);
});

// function openDeliveryPicklist(Picklist) {
//   console.log(`picklist: ${Picklist}`);
//   $("#pageloader").removeClass("d-none");
//   $.post("dirs/delivery/dashboard/form.php", function (data) {
//     $("#main-content").hide().html(data).fadeIn(200);

//     $.ajax({
//       url: "dirs/delivery/dashboard/actions/get_openincoming.php",
//       type: "POST",
//       data: { Picklist: Picklist },
//       dataType: "json",
//       success: function (response) {
//         if (response.isSuccess === "success") {
//           let rowCount = response.Items.length;
//           let totalQty = 0;

//           let header = response.Data;
//           let items = response.Items;

//           function selectedValue(selector, value) {
//             $(selector)
//               .empty()
//               .append(`<option value="${value}">${value}</option>`);
//           }

//           selectedValue("#typeOfReq", header.RequestType);
//           selectedValue("#destination", header.Destination);
//           selectedValue("#branchWhCode", header.DestinationWhs);
//           selectedValue("#origin", header.Origin);
//           selectedValue("#whcode", header.OriginWhs);

//           // ================= HEADER =================
//           $("#srn").val(header.BaseNum_SRN);
//           $("#date").val(header.DocDate);
//           $("#status").val(header.RequestStatus);
//           $("#purpose").val(header.RequestPurpose);
//           $("#reqBy").val(header.PrepBy);
//           $("#remarks").val(header.Remarks);

//           // ================= ITEMS =================
//           let rows = "";

//           items.forEach(function (item, index) {
//             let quantity = parseFloat(item.Quantity) || 0;
//             totalQty += quantity;
//             rows += `
//                 <tr style="height: 40px; min-height: 40px">
//                   <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${index + 1}</td>
//                   <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
//                   <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
//                   <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
//                   <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
//                 </tr>
//               `;
//           });

//           $("#totalIncomingQty").text(totalQty);
//           $("#openIncomingTable tbody").html(rows);

//           if (rowCount < 8) {
//             let emptyRowsNeeded = 8 - rowCount;

//             for (let i = 0; i < emptyRowsNeeded; i++) {
//               let emptyRow = `
//                   <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
//                     <td style="background: #FFFBDF"></td>
//                     <td style="background: #FFFBDF"></td>
//                     <td style="background: #FFFBDF"></td>
//                     <td style="background: #FFFBDF"></td>
//                     <td style="background: #FFFBDF"></td>
//                   </tr>
//               `;
//               $("#openIncomingTable tbody").append(emptyRow);
//             }
//             $("#totalIncomingQty").text(totalQty);
//           }
//         } else {
//           alert(response.Data);
//         }
//         $("#pageLoader").addClass("d-none");
//       },
//       error: function (xhr) {
//         console.error(xhr.responseText);
//         $("#pageLoader").addClass("d-none");
//       },
//     });
//   }).fail(function () {
//     $("#pageLoader").addClass("d-none");
//   });
// }

// function createDr(picklist) {
//   $.post("dirs/delivery/dashboard/deliveryForm.php", {}, function (data) {
//     $("#main-content").html(data);
//   });
// }

function loadDeliveryItems(PickLst_Num) {
  $.post("dirs/delivery/dashboard/loadDeliveryItems.php", {}, function (data) {
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
      url: "dirs/delivery/dashboard/actions/get_loading_breakdown.php",
      type: "POST",
      data: { PickLst_Num: PickLst_Num },
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
          console.log(
            `RESPONSE DATA FROM LOADING ITEMS: ${JSON.stringify(response.Data)}`,
          );
          let sortedData = response.Data.sort(
            (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
          );

          sortedData.forEach((item) => {
            rows.push([
              item.BaseNum_SRN || "",
              item.DocDate || "",
              item.ReqBranch || "",
              item.TotalQty || "",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-srn" href="#">Open</a></li>
                  <li><a class="dropdown-item remove-srn" href="#">Remove</a></li>
                </ul>
              </div>`,
            ]);
          });

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", ""]);
            }
          }

          if ($.fn.DataTable.isDataTable("#deliveryItemsTable")) {
            $("#deliveryItemsTable").DataTable().clear().destroy();
          }

          $("#deliveryItemsTable").DataTable({
            data: rows,
            columns: [
              { title: "SRN", className: "text-start ps-2 open-picklist" },
              { title: "Date", className: "text-start ps-2" },
              { title: "Requesting Branch", className: "text-start ps-2" },
              { title: "Quantity", className: "text-start ps-2" },
              { title: "", orderable: false },
            ],
            createdRow: function (row, data, dataIndex) {
              let originalItem = sortedData[dataIndex];

              if (originalItem) {
                $(row)
                  .attr("data-rownum", originalItem.RowNum)
                  .attr("data-picklist-num", originalItem.PickLst_Num)
                  .attr("data-delivery-num", originalItem.Delivery_Num);
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
              let tableBody = $("#deliveryItemsTable tbody");
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

// LOAD DELIVERY ITEMS
function openDeliveryRequest(DeliveryNum, RowNumber) {
  $.post("dirs/delivery/dashboard/form.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    $.ajax({
      // url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
      url: "dirs/incoming/dashboard/actions/get_openincoming.php",
      type: "POST",
      data: { RowNum: RowNumber },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          console.log(`HEADERS: ${JSON.stringify(response.Data)}`);
          console.log(`ITEMS: ${JSON.stringify(response.Items)}`);
          let rowCount = response.Items.length;
          let totalQty = 0;
          let header = response.Data;
          // let items = response.DevItems;
          let items = response.Items;

          $("#drno").val(DeliveryNum);
          $("#docdate").val(header.DocDate);
          $("#origin").val(header.Destination);
          $("#whcode").val(header.DestinationWhs);
          $("#branchName").val(header.Destination);
          $("#branchWhCode").val(header.DestinationWhs);
          $("#status").val(header.RequestStatus);
          $("#prepby").val(header.PrepBy);
          $("#plate").val("N/A");
          $("#driver").val("N/A");
          $("#remarks").val(header.Remarks) || "N/A";
          let rows = "";
          items.forEach(function (item, index) {
            let quantity = parseFloat(item.Quantity) || 0;
            totalQty += quantity;
            rows += `
              <tr style="height: 40px; min-height: 40px">
                <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
                <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
                <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
                <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
              </tr>
            `;
          });
          $("#totalQuantity").text(totalQty);
          $("#deliveryTable tbody").html(rows);
          if (rowCount < 8) {
            let emptyRowsNeeded = 8 - rowCount;
            for (let i = 0; i < emptyRowsNeeded; i++) {
              let emptyRow = `
                <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                </tr>
              `;
              $("#deliveryTable tbody").append(emptyRow);
            }
            $("#totalQuantity").text(totalQty);
          }
        }
      },
    });
  });
}
