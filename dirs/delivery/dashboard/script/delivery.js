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

$.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
  return this.api()
    .column(col, { order: "index" })
    .nodes()
    .map(function (td) {
      if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
      return $(td).text();
    });
};

// DASHBOARD - FORM
$(document).on("dblclick", "#deliveryTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;

  let RowNumber = $(this).find("td:nth-child(1)").text().trim();
  let DeliveryNum = $(this).find("td:nth-child(2)").text().trim();
  let PicklistNumber = $(this).find("td:nth-child(3)").text().trim();

  $("#main-content").html(spinner);
  setTimeout(function () {
    openForm(DeliveryNum, PicklistNumber, RowNumber);
  }, 200);
});

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

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", "", ""]);
          }
        }

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

// LOADING BASKET TO LOADING ITEMS
$(document).on(
  "dblclick",
  "#deliveryBasketTable tbody .open-picklist",
  function (e) {
    e.preventDefault();
    let $row = $(this).closest("tr");
    let PickLst_Num = $row.attr("data-picklist");
    let del_num = $row.attr("data-delivery-num");
    deliveryPicklistNum = PickLst_Num;
    deliveryNUm = del_num;
    $("#main-content").html(spinner);
    setTimeout(function () {
      loadDeliveryItems(PickLst_Num, del_num);
    }, 200);
  },
);

// PICKLIST BASKET DROPDOWN TO PICKLIST ITEMS
$(document).on("click", ".dropdown .open-picklisted", function (e) {
  let Picklist = $(this).closest("tr").attr("data-picklist");
  let del_num = $(this).closest("tr").attr("data-delivery-num");

  deliveryPicklistNum = Picklist;
  deliveryNUm = del_num;

  $("#main-content").html(spinner);
  setTimeout(function () {
    loadDeliveryItems(Picklist, del_num);
  }, 200);
});

// CREATE DR FOR PICKLIST
$(document).on("click", ".dropdown .create-dr", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let deliveryBasketRow = $(this).closest("tr");
  let createDeliveryNumber = deliveryBasketRow.attr("data-delivery-num");
  let picklistDr = deliveryBasketRow.attr("data-picklist");

  $("#main-content").html(spinner);
  setTimeout(function () {
    createDr(createDeliveryNumber, picklistDr);
  }, 200);
});

// CREATE DELIVERY
function createDr(createDeliveryNumber, picklistDr) {
  console.log(`CREATE DR PICKLIST : ${picklistDr}`);
  $.post("dirs/delivery/dashboard/createDr.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    // let rowCount = response.Items.length;
    // let totalQty = 0;
    // let header = response.Data;
    // let items = response.Items;

    // console.log(`DELIVERY FORM DATA: ${JSON.stringify(response.Data)}`);

    $("#drno").val(createDeliveryNumber);
    $("#pcklstno").val(picklistDr);
    // $("#docdate").val(header.DocDate);
    // $("#origin").val(header.Destination);
    // $("#whcode").val(header.DestinationWhs);
    // $("#branchName").val(header.Destination);
    // $("#branchWhCode").val(header.DestinationWhs);
    $("#status").val("NEW");
    // $("#prepby").val(header.PrepBy);
    // $("#plate").val("N/A");
    // $("#driver").val("N/A");
    // $("#remarks").val(header.Remarks) || "N/A";
    // let rows = "";
    // items.forEach(function (item, index) {
    //   let quantity = parseFloat(item.Quantity) || 0;
    //   totalQty += quantity;
    //   rows += `
    //           <tr style="height: 40px; min-height: 40px">
    //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
    //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
    //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
    //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
    //           </tr>
    //         `;
    // });
    // $("#totalQuantity").text(totalQty);
    // $("#deliveryTable tbody").html(rows);
    // if (rowCount < 8) {
    //   let emptyRowsNeeded = 8 - rowCount;
    //   for (let i = 0; i < emptyRowsNeeded; i++) {
    //     let emptyRow = `
    //             <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
    //               <td style="background: #FFFBDF"></td>
    //               <td style="background: #FFFBDF"></td>
    //               <td style="background: #FFFBDF"></td>
    //               <td style="background: #FFFBDF"></td>
    //             </tr>
    //           `;
    //     $("#deliveryTable tbody").append(emptyRow);
    //   }
    //   $("#totalQuantity").text(totalQty);
    // }
  });
}

function loadDeliveryBasketContent() {
  if ($.fn.DataTable.isDataTable("#deliveryBasketTable")) {
    $("#deliveryBasketTable").DataTable().clear().destroy();
  }
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post(
      "dirs/delivery/dashboard/loadDeliveryBasket.php",
      {},
      function (data) {
        $("#main-content").hide().html(data).fadeIn(200);
        loadDeliveryBasket();
      },
    );
  }, 200);
}

// DELIVERY BASKET
function loadDeliveryBasket() {
  $.post("dirs/delivery/dashboard/loadDeliveryBasket.php", {}, function (data) {
    $("#main-content").html(data);

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
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  <li><a class="dropdown-item remove-picklist" href="#" data-picklist="${item.PickList_Num}">Remove</a></li>
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
                className: "text-start open-picklist ps-5",
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

// REMOVE PICKLIST
$(document).on("click", ".remove-picklist", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let picklist_num = $(this).data("picklist");
  console.log(`PICKLIST NUMBER: ${picklist_num}`);
  removePicklist(picklist_num);
});

// REMOVE PICKLIST FROM LOADING BASKET
function removePicklist(picklistNum) {
  if (!picklistNum) {
    Swal.fire({
      icon: "error",
      title: "Missing Picklist Number",
      text: "Make sure that the Picklist exists!",
      confirmButtonText: "OKAY",
    });
    return;
  }

  Swal.fire({
    icon: "question",
    title: "Remove this picklist?",
    text: "This action cannot be change.",
    showCancelButton: true,
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/delivery/dashboard/actions/update_remove_picklist.php",
        { picklist },
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Picklist has been removed",
                confirmButtonText: "OKAY",
              });
              // CALL LOADING BASKET HERE!
              loadDeliveryBasketContent();
            } else {
              Swla.fire({
                icon: "error",
                title: "Failed to remove picklist",
                text: res.message || "Something went wrong",
                confirmButtonText: "OKAY",
              });
            }
          } catch (err) {
            console.error(`Error parsing response: `, err);
          }
        },
      );
    }
  });
}

// OPEN SRN FROM LOADING ITEMS
$(document).on("click", "#deliveryItemsTable tbody .open-srn", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let SRN = picklistedRow.attr("data-srn-num");
  // let RowNum = picklistedRow.attr("data-rownum");
  let RowNum = "";
  let DeliveryNum = picklistedRow.attr("data-delivery-num");
  let PicklistNumber = picklistedRow.attr("data-picklist");

  console.log(`SRN: ${SRN}`);
  console.log(`RowNum: ${RowNum}`);

  $("#main-content").html(spinner);
  setTimeout(function () {
    openDeliveryForm(DeliveryNum, PicklistNumber, RowNum);
  }, 200);
});

// REMOVE SRN
$(document).on("click", "#deliveryItemsTable tbody .remove-srn", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let SRN = picklistedRow.attr("data-srn-num");
  removeSRN(SRN);
});

// REMOVE SRN FROM LOADING ITEMS
function removeSRN(SRN) {
  if (!SRN) {
    Swal.fire({
      icon: "error",
      title: "Missing SRN",
      text: "Make sure that the SRN exists!",
      confirmButtonText: "OKAY",
    });
    return;
  }

  Swal.fire({
    icon: "question",
    title: "Remove this request?",
    text: "This action cannot be change.",
    showCancelButton: true,
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/delivery/dashboard/actions/update_remove_srn.php",
        { picklist },
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Request has been removed",
                confirmButtonText: "OKAY",
              });
              // CALL LOADING BASKET HERE!
              loadDeliveryBasketContent();
            } else {
              Swla.fire({
                icon: "error",
                title: "Failed to remove request",
                text: res.message || "Something went wrong",
                confirmButtonText: "OKAY",
              });
            }
          } catch (err) {
            console.error(`Error parsing response: `, err);
          }
        },
      );
    }
  });
}

function loadDeliveryItems(PickLst_Num, del_num) {
  $.post("dirs/delivery/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);

    $.ajax({
      url: "dirs/delivery/dashboard/actions/get_loading_breakdown.php",
      type: "POST",
      data: { PickLst_Num: PickLst_Num },
      dataType: "json",
      success: function (response) {
        $("#picklistDeliveryDisplay").text(PickLst_Num);
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
              { title: "SRN", className: "text-start ps-5 open-picklist" },
              { title: "Date", className: "text-start ps-2" },
              { title: "Requesting Branch", className: "text-start ps-2" },
              { title: "Quantity", className: "text-start ps-2" },
              { title: "", orderable: false },
            ],
            createdRow: function (row, data, dataIndex) {
              let originalItem = sortedData[dataIndex];

              if (originalItem) {
                $(row)
                  .attr("data-srn-num", originalItem.BaseNum_SRN)
                  .attr("data-picklist", PickLst_Num)
                  .attr("data-delivery-num", del_num);
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

$(document).on("dblclick", "#deliveryItemsTable tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let SRN = $(this).find("td:nth-child(1)").text().trim();

  console.log(`SRN : ${SRN}`);

  // $("#main-content").html(spinner);
  // setTimeout(function () {
  //   console.log(`LOADED DELIVERY ITEMS`);
  //   openDeliverySrn(SRN);
  // }, 200);
});

// LOAD DELIVERY ITEMS - SHOULD BE FROM DELIVERY DASHBOARD
function openForm(DeliveryNum, PicklistNumber, RowNumber) {
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
          let rowCount = response.Items.length;
          let totalQty = 0;
          let header = response.Data;
          let items = response.Items;

          $("#drno").val(DeliveryNum);
          $("#pcklstno").val(PicklistNumber);
          $("#docdate").val(header.DocDate);
          $("#origin").val(header.Destination);
          $("#whcode").val(header.DestinationWhs);
          $("#branchName").val(header.Origin);
          $("#branchWhCode").val(header.OriginWhs);
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

// INDIVIDUAL DELIVERY SRN
// function openDeliverySrn(SRN) {
//   $.post("dirs/delivery/dashboard/deliveryForm.php", function (data) {
//     console.log(`LOADED DELIVERY ITEMS`);
//     $("#main-content").hide().html(data).fadeIn(200);

//     $.ajax({
//       // url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
//       url: "dirs/delivery/dashboard/actions/get_openincoming.php",
//       type: "POST",
//       data: { SRN: SRN },
//       dataType: "json",
//       success: function (response) {
//         if (response.isSuccess === "success") {
//           let rowCount = "";
//           let totalQty = 0;
//         } else {
//         }
//       },
//     });
//   });
// }

// console.log(
//   `INDEX PICKLIST NUM: ${deliveryPicklistNum} - INDEX DELIVERY NUM: ${deliveryNum}`,
// );

// OPEN DELIVERY FORM FROM DELIVERY ITEMS
function openDeliveryForm(DeliveryNum, PicklistNumber, RowNum) {
  $.post("dirs/delivery/dashboard/deliveryForm.php", function (data) {
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

          console.log(`DELIVERY FORM DATA: ${JSON.stringify(response.Data)}`);

          $("#drno").val(DeliveryNum);
          $("#pcklstno").val(PicklistNumber);
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

function loadDeliveryUnits() {
  let SRN = $("#srnForm").val();

  $.ajax({
    // url: "dirs/outgoing/form/actions/get_prepitem.php", // your API file
    url: "dirs/delivery/dashboard/actions/get_prepitem.php", // your API file
    type: "POST",
    data: {
      SRN: SRN,
    },
    dataType: "json",
    beforeSend: function () {
      let tbody = $("#deliveryTable tbody");

      tbody.html(`
            <tr>
                <td colspan="6" class="text-center" style="background:#FFFBDF;">
                    <span class="spinner-border spinner-border-sm text-secondary me-2"></span>
                    Loading items...
                </td>
            </tr>
        `);
    },
    success: function (response) {
      let tbody = $("#deliveryTable tbody");
      tbody.empty(); // remove yellow placeholder row
      if (response.isSuccess === "success" && response.Data.length > 0) {
        let rowCount = response.Data.length;
        let totalQty = 0;
        $.each(response.Data, function (index, item) {
          let quantity = parseFloat(item.Quantity) || 0; // ensure number
          totalQty += quantity;

          // <td class="ps-2 align-middle" style="background: #FFFBDF; padding: 3px">${item.DisplayRowNumber}</td>

          let row = `<tr class="item-row">
                        
                        <td class="ps-2 align-middle item-brand" style="background: #FFFBDF; padding: 3px">${item.ItemBrand}</td>
                        <td class="ps-2 align-middle item-model" style="background: #FFFBDF; padding: 3px">${item.ItemName}</td>
                        <td class="ps-2 align-middle item-category" style="background: #FFFBDF; padding: 3px">${item.ItemGroup}</td>
                        <td class="ps-2 align-middle item-code" hidden>${item.ItemCode}</td>
                        <td class="ps-2 align-middle item-quantity" style="background: #FFFBDF; padding: 3px">${item.Quantity}</td>
                        <td class="ps-2 align-middle t-action" style="background: #FFFBDF; padding: 3px">
                          <button type="button" class="btn btn-sm btn-danger remove-item-button" id="${item.ItemNum}">
                            <i class="bi bi-dash"></i>
                          </button>
                        </td>
                      </tr>
                    `;

          tbody.append(row);
        });

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
              <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                <td style="background: #FFFBDF; padding: 0">&nbsp;</td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
              </tr>
            `;
            tbody.append(emptyRow);
          }
        }
        $("#totalQuantity").text(totalQty);
      } else {
        // If no data, show empty yellow row again
        tbody.html(`
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:40px; min-height:40px">
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                      <td style="background:#FFFBDF"></td>
                    </tr>
                `);
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load items.",
      });
    },
  });
}
