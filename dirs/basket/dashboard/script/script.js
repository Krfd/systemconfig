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
  $.post("dirs/basket/dashboard/components/main.php", {}, function (data) {
    $("#basket_content").html(data);
    // loadDeliveryBasketContent();
    // $("#deliveryTableDisplay").DataTable({
    //   pageLength: 50,
    //   order: [0, "desc"],
    // });
    loadDeliveryBasket();
  });
}

/*load Imperial Brands*/
function loadImperialBrands() {
  $.post(
    "dirs/basket/dashboard/actions/get_iapbrands.php",
    {},
    function (data) {
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const brand = response.Data;
        $("#newBrand").html(
          '<option selected value="">--Choose Brand--</option>',
        );
        brand.forEach((brand) => {
          $("#newBrand").append(
            $("<option>", {
              value: brand.Brand,
              text: brand.Brand,
            }),
          );
        });
      } else {
        console.log(response.Data);
      }
    },
  );
}

/*Function for reselecting brand to find another model*/
$("#newBrand").on("change", function () {
  $("#newModel").html('<option value="">Select Model</option>');
  $("#newCategory").val("");
  $("#itemcode").val("");
  loadImperialModel();
});

/*load Imperial Model and category*/
async function loadImperialModel() {
  var Brand = $("#newBrand").val();
  $("#newModel").html('<option value="">Loading...</option>');
  $("#newCategory").val("");
  $("#itemcode").val("");
  if (!Brand) {
    $("#newModel").html('<option value="">--Choose Model--</option>');
    return;
  }
  $.post(
    "dirs/basket/dashboard/actions/get_mdlcategory.php",
    {
      Brand: Brand,
    },
    function (data) {
      let response;
      try {
        response = JSON.parse(data);
      } catch (e) {
        console.error("Invalid JSON:", data);
        return;
      }
      if ($.trim(response.isSuccess) === "success") {
        const rows = response.Data;
        if (!rows || rows.length === 0) {
          $("#newModel").html(
            '<option value="" disabled selected>No Model Available</option>',
          );
          $("#newCategory").val("No Category Available");
          $("#itemcode").val("");

          return;
        }
        $("#newModel").html('<option value="">--Choose Model--</option>');
        rows.forEach((row) => {
          $("#newModel").append(
            $("<option>", {
              value: row.ItemModel,
              text: row.ItemModel,
              "data-category": row.ItemCategory,
              "data-itemcode": row.ItemCode,
            }),
          );
        });
      } else {
        $("#newModel").html(
          '<option value="" disabled selected>No Model Available</option>',
        );
        $("#newCategory").val("No Category Available");
        $("#itemcode").val("");
      }
    },
  );
}








// // PICKLIST BASKET TO PICKLIST ITEMS
// $(document).on("dblclick", "#basketTable tbody .open-picklist", function (e) {
//   e.preventDefault();
//   if (!$(this).find(".open-picklist").length) return;
//   let $row = $(this).closest("tr");
//   let picklistNum = $row.attr("data-picklist-num");
//   $("#main-content").html(spinner);
//   setTimeout(function () {
//     openPicklist(picklistNum);
//   }, 200);
// });

// // PICKLIST ITEMS TO INDIVIDUAL SRN
// $(document).on("dblclick", "#picklistItemTable tbody tr", function (e) {
//   e.preventDefault();
//   if ($(this).hasClass("empty-row")) return;
//   console.log(``);
//   let RowNum = $(this).data("rownum");
//   $("#main-content").html(spinner);
//   setTimeout(function () {
//     openPicklistedForm(RowNum);
//   }, 200);
// });

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  let serial = $(this).data("serial");
  let itemCode = $(this).data("itemcode");
  let deliveryNumber = $(this).data("deliverynum");
  let picklistNumber = $(this).data("picklist");
  let brand = $(this).find("td:nth-child(1)").text().trim();
  let model = $(this).find("td:nth-child(2)").text().trim();
  let category = $(this).find("td:nth-child(3)").text().trim();
  let qty = $(this).find("td:nth-child(4)").text().trim();

  // console.log(`PICKLIST NUMBER: ${picklistNumber}`);

  // ✅ Prevent modal if row is empty
  if (!brand && !model && !qty) {
    return;
  }

  // OPTIONAL (stronger check): ignore placeholder rows
  if ($(this).hasClass("empty-row")) {
    return;
  }

  $("#assignBranchModal #serial").val(serial);
  $("#assignBranchModal #brand").val(brand);
  $("#assignBranchModal #model").val(model);
  $("#assignBranchModal #itemCode").val(itemCode);
  $("#assignBranchModal #deliveryQty").text(qty);

  loadPicklistBranches(
    deliveryNumber,
    picklistNumber,
    model,
    category,
    function (length) {
      if (length > 1) {
        $("#assignBranchModal").modal("show");
      }
      //  else {
      //   console.log("Single branch");
      // }
    },
  );
});

$(document).on("click", "#summaryTable tbody tr", function (e) {
  e.preventDefault();
  let serial = $(this).data("serial");
  console.log(`SERIAL : ${serial}`);

  let $serialCell = $("#delivery-serial-table tbody td").first();
  let formattedSerial = serial.split(",").join("<br>");
  $serialCell.html(formattedSerial);
});

async function loadIAPBranchlist() {
  $.post("dirs/outgoing/form/actions/get_branchlist.php", {}, function (data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const iapbranch = response.Data;
      $("#branch").html('<option selected value="">Select Branch</option>');
      iapbranch.forEach((iapbranch) => {
        $("#branch").append(
          $("<option>", {
            value: iapbranch.Branch,
            text: iapbranch.Branch,
          }),
        );
      });
      if (iapbranch.length > 0) {
        $("#branch").val(iapbranch[0].Branch);
      }
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


// CREATE DR FOR PICKLIST
$(document).on("click", ".dropdown .assign-branch", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let deliveryBasketRow = $(this).closest("tr");
  let createDeliveryNumber = deliveryBasketRow.attr("data-delivery-num");
  let picklistDr = deliveryBasketRow.attr("data-picklist");

  $("#main-content").html(spinner);
  setTimeout(function () {
    assignBranch(createDeliveryNumber, picklistDr);
  }, 200);
});

// DELIVERY BASKET
function loadDeliveryBasket() {
  $.post("dirs/basket/dashboard/components/main.php", {}, function (data) {
    $("#basket_content").html(data);

    $.ajax({
      url: "dirs/basket/dashboard/actions/get_deliveries.php",
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
            const isDisabled =
              item.PicklistNumber && item.PicklistNumber.trim() !== ""
                ? "disabled"
                : "";

            rows.push([
              `<input type="checkbox" name="checkbox" id="${item.SeriesNum}" data-rownum="${item.SeriesNum}" 
              class="form-check-input checkbox align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,
              item.PickList_Num || "",
              item.DocDate || "",
              item.DateModified || "",
              item.ItemCount || "",
              item.Status,
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  ${
                    item.Status !== "IN TRANSIT"
                      ? `<li><a class="dropdown-item assign-branch" href="#" data-picklist="${item.PickList_Num}">Branch Assignment</a></li>`
                      : ""
                  }
                </ul>
              </div>`,
            ]);
          });

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", "", "", "", ""]);
            }
          }

          if ($.fn.DataTable.isDataTable("#basketTableDashboard")) {
            $("#basketTableDashboard").DataTable().clear().destroy();
          }

          $("#basketTableDashboard").DataTable({
            data: rows,
            columns: [
              { title: "", className: "text-center" },
              {
                title: "Picklist No.",
                className: "text-start open-picklist ps-5",
              },
              { title: "Date Created", className: "text-start ps-2" },
              { title: "Date Modified", className: "text-start ps-2" },
              { title: "Quantity", className: "text-start ps-2" },
              {
                title: "Status",
                className: "text-start ps-2",
                render: function (data, type, row) {
                  return `<span class="badge bg-primary">${data}</span>`;
                },
              },
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
              $("td:eq(1)", row).addClass("text-primary ps-2");
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
              let tableBody = $("#basketTableDashboard tbody");
              let currentRows = tableBody.find("tr").length;

              for (let i = currentRows; i < 8; i++) {
                let $emptyRow = $(`
                <tr class="empty-row" style="background: #FFFBDF">
                  <td colspan="7" style="background: #FFFBDF">&nbsp;</td>
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

function toggleDelivery() {
  const createDeliveryBtn = document.getElementById("createDeliveryBtn");
  const checkedIds = [];

  const selectionMode =
    $("#basketTableDashboard tbody .checkbox:visible").length > 0;
  $("#basketTableDashboard tbody .checkbox:checked").each(function () {
    checkedIds.push($(this).data("rownum"));
    console.log(`Checked RowNum: ${$(this).data("rownum")}`);
  });

  if (!selectionMode) {
    let availableRows = 0;

    $("#basketTableDashboard tbody tr").each(function () {
      const row = $(this);
      // const srnText = row.find("td:eq(2)").text().trim();
      // const picklistNo = row.find("td:eq(7)").text().trim();
      const statusText = row.find("td:eq(5)").text().trim().toUpperCase();

      if (statusText === "Unassigned") {
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

    $("#basketTableDashboard tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim();
      const picklistNo = row.find("td:eq(7)").text().trim();
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

    createDeliveryBtn.textContent = "Add to Picklist";
    createDeliveryBtn.type = "button";

    return;
  }

  if (checkedIds.length == 0) {
    Swal.fire({
      icon: "warning",
      title: "Please select at least one item to create a picklist",
      confirmButtonText: "OKAY",
    });
    $("#basketTableDashboard tbody .checkbox").hide().prop("checked", false);
    createDeliveryBtn.textContent = "Create Picklist";
    createDeliveryBtn.type = "button";
    return;
  }

  Swal.fire({
    icon: "question",
    title: "Create picklist on this item(s)?",
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
            $("#basketTableDashboard tbody .checkbox")
              .hide()
              .prop("checked", false);
            createDeliveryBtn.textContent = "Create Picklist";
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

// function openPicklist(picklistNum) {
//   $.post(
//     "dirs/incoming/dashboard/picklistItem.php",
//     { picklistNum: picklistNum },
//     function (data) {
//       $("#main-content").hide().html(data).fadeIn(200);

//       $.ajax({
//         url: "dirs/incoming/dashboard/actions/get_incomingbreakdown.php",
//         type: "POST",
//         dataType: "json",
//         data: { picklistNum: picklistNum },
//         success: function (response) {
//           $("#picklistNumDisplay").text(picklistNum);
//           let rows = [];
//           let existingSeries = new Set();
//           if (response.isSuccess === "success") {
//             let sortedData = response.Data.sort(
//               (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
//             );

//             sortedData.forEach((item) => {
//               if (existingSeries.has(item.BaseNum_SRN)) {
//                 return;
//               }

//               existingSeries.add(item.BaseNum_SRN);

//               rows.push([
//                 item.BaseNum_SRN || "",
//                 item.DocDate || "",
//                 item.ReqBranch || "",
//               ]);
//             });
//             $("#picklistItemTable").DataTable().clear().destroy();
//             $("#picklistItemTable").DataTable({
//               data: rows,
//               columns: [
//                 { title: "SRN", className: "text-start open-picklisted ps-5" },
//                 { title: "Date", className: "text-start ps-5" },
//                 { title: "Requesting Branch", className: "text-start ps-5" },
//               ],
//               createdRow: function (row, data, dataIndex) {
//                 let originalItem = sortedData[dataIndex];

//                 $(row)
//                   .attr("data-srn", originalItem.BaseNum_SRN)
//                   .attr("data-rownum", originalItem.RowNum)
//                   .addClass("picklist-row");
//               },
//               paging: true,
//               searching: true,
//               info: true,
//               processing: false,
//               autoWidth: false,
//               order: [[0, "desc"]],
//               rowCallback: function (row, data) {
//                 $("td", row).css({
//                   background: "#FFFBDF",
//                   padding: "3px",
//                   height: "40px",
//                   "min-height": "40px",
//                 });
//                 $("td:eq(0)", row).addClass("text-primary");
//                 $("td:eq(2)", row).css("text-align", "start");

//                 $(row).hover(
//                   function () {
//                     $(this).css("background", "#FFF4C2");
//                   },
//                   function () {
//                     $(this).css("background", "#FFFBDF");
//                   },
//                 );
//               },
//               drawCallback: function () {
//                 let tableBody = $("#picklistItemTable tbody");
//                 let currentRows = tableBody.find("tr").length;

//                 for (let i = currentRows; i < 8; i++) {
//                   let $emptyRow = $(`
//                   <tr class="empty-row" style="background: #FFFBDF">
//                     <td colspan="3" style="background: #FFFBDF">&nbsp;</td>
//                   </tr>
//                 `);
//                   $emptyRow.css({
//                     background: "#FFFBDF",
//                     height: "40px",
//                     "min-height": "40px",
//                     cursor: "pointer",
//                   });
//                   $emptyRow.hover(
//                     function () {
//                       $(this).css("background", "#FFF4C2");
//                     },
//                     function () {
//                       $(this).css("background", "#FFFBDF");
//                     },
//                   );
//                   tableBody.append($emptyRow);
//                 }
//               },
//             });
//           } else {
//             console.error(response.Data);
//           }
//         },
//         error: function (xhr, status, error) {
//           console.error("Error loading outgoing data: ", error);
//         },
//       });
//     },
//   );
// }

// DISPLAY PICKLIST
// function loadPicklistItems() {
//   $("#main-content").html(spinner);
//   setTimeout(function () {
//     $.post(
//       "dirs/incoming/dashboard/picklistItem.php",
//       { picklistNum: picklistNumRef },
//       function (data) {
//         openPicklist(picklistNumRef);
//       },
//     );
//   }, 200);
// }

// // CANCEL PICKLIST
// function cancelPicklist() {
//   $(document).on("click", ".cancel-picklist", function () {
//     const picklistId = $(this).data("picklist");

//     Swal.fire({
//       title: "Are you sure?",
//       text: "You are about to cancel Picklist " + picklistId,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonText: "Back",
//       confirmButtonText: "Yes, cancel it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire(
//           "Cancelled!",
//           "Picklist " + picklistId + " has been cancelled.",
//           "success",
//         );

//         $(this).closest("tr").remove();
//       }
//     });
//   });
// }

// // ALREADY HAS A PICKLIST NUMBER
// function openPicklistedForm(RowNum) {
//   $("#pageLoader").removeClass("d-none");
//   $.post(
//     "dirs/incoming/dashboard/picklistedForm.php",
//     { RowNum: RowNum },
//     function (data) {
//       $("#main-content").hide().html(data).fadeIn(200);

//       $.ajax({
//         url: "dirs/incoming/dashboard/actions/get_openincoming.php",
//         type: "POST",
//         data: { RowNum: RowNum },
//         dataType: "json",
//         success: function (response) {
//           if (response.isSuccess === "success") {
//             let rowCount = response.Items.length;
//             let totalQty = 0;

//             let header = response.Data;
//             let items = response.Items;

//             function selectedValue(selector, value) {
//               $(selector)
//                 .empty()
//                 .append(`<option value="${value}">${value}</option>`);
//             }

//             selectedValue("#typeOfReq", header.RequestType);
//             selectedValue("#destination", header.Destination);
//             selectedValue("#branchWhCode", header.DestinationWhs);
//             selectedValue("#origin", header.Origin);
//             selectedValue("#whcode", header.OriginWhs);

//             // ================= HEADER =================
//             $("#srn").val(header.BaseNum_SRN);
//             $("#date").val(header.DocDate);
//             $("#status").val(header.RequestStatus);
//             $("#purpose").val(header.RequestPurpose);
//             $("#reqBy").val(header.PrepBy);
//             $("#remarks").val(header.Remarks);

//             // ================= ITEMS =================
//             let rows = "";

//             items.forEach(function (item, index) {
//               let quantity = parseFloat(item.Quantity) || 0;
//               totalQty += quantity;
//               rows += `
//                       <tr style="height: 40px; min-height: 40px">
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${index + 1}</td>
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
//                       </tr>
//                     `;
//             });

//             $("#totalIncomingQty").text(totalQty);
//             $("#openIncomingTable tbody").html(rows);

//             if (rowCount < 8) {
//               let emptyRowsNeeded = 8 - rowCount;

//               for (let i = 0; i < emptyRowsNeeded; i++) {
//                 let emptyRow = `
//                         <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
//                           <td style="background: #FFFBDF"></td>
//                           <td style="background: #FFFBDF"></td>
//                           <td style="background: #FFFBDF"></td>
//                           <td style="background: #FFFBDF"></td>
//                           <td style="background: #FFFBDF"></td>
//                         </tr>
//                       `;
//                 $("#openIncomingTable tbody").append(emptyRow);
//               }
//               $("#totalIncomingQty").text(totalQty);
//             }
//           } else {
//             alert(response.Data);
//           }
//           $("#pageLoader").addClass("d-none");
//         },
//         error: function (xhr) {
//           console.error(xhr.responseText);
//           $("#pageLoader").addClass("d-none");
//         },
//       });
//     },
//   ).fail(function () {
//     $("#pageLoader").addClass("d-none");
//   });
// }

function serialDeliveryInput(DeliveryNumber, PicklistDr, previousSerials) {
  $("#serial-delivery").on("submit", function (e) {
    e.preventDefault(); 
    const serialInput = $("#newSerial");
    const Serial = serialInput.val().trim();
    let lines = Serial.split(/\r?\n/)
      .map((s) => s.replace(/[\u200B\s]+/g, "").trim()) 
      .filter(Boolean); 
    let latestInput = lines[lines.length - 1] || "";
    let ItemCode = "";
    if (Serial) {
      $.ajax({
        url: "dirs/basket/dashboard/actions/get_branch_stock_serial.php",
        type: "POST",
        data: {
          ItemSerial: latestInput,
          DrNumber: DeliveryNumber,
          ItemCode: ItemCode,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;
            let rows = [];
            let existingTotal = parseInt($("#summaryQty").text()) || 0;
            let totalQty = existingTotal;
            let $summaryTbody = $("#summaryTable tbody");

            const groupedItems = {};

            items.forEach((item) => {
              if (!item.ItemCode) return;

              if (!groupedItems[item.ItemCode]) {
                groupedItems[item.ItemCode] = {
                  ...item,
                  qty: 0,
                };
              }

              groupedItems[item.ItemCode].qty += 1;
            });

            Object.values(groupedItems).forEach(function (item) {
              let brand = item.Brand;
              let model = item.Model;
              let category = item.Category;
              let itemCode = item.ItemCode;
              let qty = item.qty;
              // 🚫 Skip if any required value is null/empty
              if (!brand || !model || !category || !itemCode) {
                console.warn("Skipped item due to null/empty value:", item);
                return; // skip this iteration
              }
              totalQty += qty;
         
              let $existingRow = $summaryTbody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );
              loadPicklistBranches(
                DeliveryNumber,
                PicklistDr,
                model,
                category,
                function (length, branchName) {
                  if (length > 1) {
                    rows += `
                        <tr style="height: 40px; min-height: 40px;" data-serial="${latestInput}">
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
                        </tr>`;
                    if ($existingRow.length) {
                      // ✅ Update quantity
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow.find("td:nth-child(4)").text(currentQty + 1);

                      // ✅ Update badge to Unassigned automatically
                      $existingRow.find("td:nth-child(5)").html(`
                          <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">
                              Unassigned
                          </span>
                      `);

                      // ✅ Update data attributes if needed
                      $existingRow.attr("data-serial", latestInput);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      // ✅ CREATE NEW ROW
                      let newRow = `
                        <tr data-itemcode="${itemCode}" data-serialbased="true" data-serial="${latestInput}" data-deliverynum="${DeliveryNumber}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">1</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
                            <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">Unassigned</span>
                          </td>
                        </tr>
                      `;
                      let $emptyRow = $summaryTbody
                        .find("tr.empty-row")
                        .first();
                      if ($emptyRow.length) {
                        $emptyRow.replaceWith(newRow);
                      } else {
                        $summaryTbody.append(newRow);
                      }
                    }
                  } else {
                    rows += `
                        <tr style="height: 40px; min-height: 40px;">
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
                        </tr>`;
                    if ($existingRow.length) {
                      // ✅ Update quantity
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow.find("td:nth-child(4)").text(currentQty + 1);

                      // ✅ Update badge to Unassigned automatically
                      $existingRow.find("td:nth-child(5)").html(`
                          <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">
                              Unassigned
                          </span>
                      `);

                      // ✅ Update data attributes if needed
                      $existingRow.attr("data-serial", latestInput);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      // ✅ CREATE NEW ROW
                      let newRow = `
                          <tr data-itemcode="${itemCode}" data-serial="${latestInput}" data-deliverynum="${DeliveryNumber}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                            <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                            <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                            <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
                            <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">1</td>
                            <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
                              <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
                            </td>
                          </tr>
                        `;
                      // Replace first empty row if exists
                      let $emptyRow = $summaryTbody
                        .find("tr.empty-row")
                        .first();
                      if ($emptyRow.length) {
                        $emptyRow.replaceWith(newRow);
                      } else {
                        $summaryTbody.append(newRow);
                      }
                      let rowCount = $("#summaryDeliveryTable tbody tr").filter(
                        function () {
                          return (
                            $(this).find("td:nth-child(2)").text().trim() !== ""
                          );
                        },
                      ).length;
                      if ($.fn.DataTable.isDataTable("#summaryDeliveryTable")) {
                        $("#summaryDeliveryTable")
                          .DataTable()
                          .clear()
                          .destroy();
                      }
                      let exists = false;
                      $("#summaryDeliveryTable tbody tr").each(function () {
                        let code = $(this).data("itemcode");
                        if (code == itemCode) {
                          exists = true;
                          return false; // break loop
                        }
                      });
                      // OR SIMPLY DISABLE THE SAVE BUTTON
                      if (exists) {
                        Swal.fire({
                          icon: "error",
                          title: "Item already assigned to the branch",
                          text: "",
                          confirmButtonText: "OKAY",
                        });
                        return;
                      }
                      $("#summaryTable tbody tr").each(function () {
                        let branch = $(this)
                          .find("td:nth-child(1)")
                          .text()
                          .trim();
                        let model = $(this)
                          .find("td:nth-child(2)")
                          .text()
                          .trim();
                        let qty = $(this).find("td:nth-child(3)").text().trim();
                        if (!qty || qty === "0") return;
                        rowCount++;
                        let $emptyRow = $(
                          "#summaryDeliveryTable tbody tr.empty-row",
                        ).first();
                        console.log(
                          `CATEGORY FOR SUMMARYDELIVERYTABLE: ${category}`,
                        );
                        let newRow = $(`
                              <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px">
                                <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
                                <td style="background:#FFFBDF" class="text-primary">${Serial}</td>
                                <td style="background:#FFFBDF">${branchName}</td>
                                <td style="background:#FFFBDF">${brand}</td>
                                <td style="background:#FFFBDF" class="text-start">${model}</td>
                                <td style="background:#FFFBDF" class="text-start">${category}</td>
                                <td style="background:#FFFBDF" class="text-center">${qty}</td>
                                <td style="background:#FFFBDF" class="d-none">${itemCode}</td>
                              </tr>
                            `);
                        if ($emptyRow.length) {
                          $emptyRow.replaceWith(newRow);
                        } else {
                          $("#summaryDeliveryTable tbody").append(newRow);
                        }
                        newRow.hover(
                          function () {
                            $(this).css("background", "#FFF4C2");
                          },
                          function () {
                            $(this).css("background", "#FFFBDF");
                          },
                        );
                      });
                    }
                  }
                  $("#summaryQty").text(totalQty);
                },
              );
            });
          } else if (response.isSuccess === "empty") {
            Swal.fire({
              icon: "error",
              title: "Unavailable stock for this model",
              confirmButtonText: "OKAY",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: response.Data,
              confirmButtonText: "OKAY",
            });
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
          })
        },
         complete: function () {
          // Re-enable button + hide spinner
          // document.getElementById("nonSerializeeBtn").prop("disabled", false);
          $("#nonSerializeBtn").prop("disabled", false);
          // spinner.addClass("d-none");
          // $("#main-content").html(spinner)
          // text.text("Add");
  }
      });
    }
    serialInput.val(""); // clear after submit
    serialInput.focus();
    // }
  });
}

function validateBranchAssignment() {
  let totalInput = 0;

  $("#branchToDeliverModal tbody td[contenteditable='true']").each(function () {
    let val = parseInt($(this).text().trim()) || 0;
    totalInput += val;
  });

  let requiredQty = parseInt($("#deliveryQty").text()) || 0;

  let $qtyDisplay = $("#deliveryQty");

  $qtyDisplay.removeClass("text-primary text-warning text-danger");

  if (totalInput === requiredQty) {
    $qtyDisplay.addClass("text-primary");
  } else if (totalInput < requiredQty) {
    $qtyDisplay.addClass("text-warning");
  } else {
    $qtyDisplay.addClass("text-danger");
  }

  // FORCE NUMERIC INPUT
  $(document).on(
    "keypress",
    "#branchToDeliverModal td[contenteditable='true']",
    function (e) {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    },
  );

  // PREVENT EMPTY
  $(document).on(
    "blur",
    "#branchToDeliverModal td[contenteditable='true']",
    function () {
      if ($(this).text().trim() === "") {
        $(this).text("0");
      }
    },
  );

  return { totalInput, requiredQty };
}

// SUMMARY
function branchDelivery() {
  let Serial = $("#assignBranchModal #serial").val();
  let brand = $("#assignBranchModal #brand").val();
  let itemCode = $("#assignBranchModal #itemCode").val();

  let rowCount = $("#summaryDeliveryTable tbody tr").filter(function () {
    return $(this).find("td:nth-child(2)").text().trim() !== "";
  }).length;

  let serialRowCount = $("#nonSerializeSummary tbody tr").filter(function () {
    return $(this).find("td:nth-child(1)").text().trim() !== "";
  }).length;

  if ($.fn.DataTable.isDataTable("#summaryDeliveryTable")) {
    $("#summaryDeliveryTable").DataTable().clear().destroy();
  }

  if ($.fn.DataTable.isDataTable("#nonSerializeSummary")) {
    $("#nonSerializeSummary").DataTable().clear().destroy();
  }

  $("#branchToDeliverModal tbody tr").each(function () {
    let branch = $(this).find("td:nth-child(1)").text().trim();
    let model = $(this).find("td:nth-child(2)").text().trim();
    let category = $(this).find("td:nth-child(3)").text().trim();
    let qty = $(this).find("td:nth-child(4)").text().trim();

    if (!qty || qty === "0") return;

    rowCount++;
    serialRowCount++;

    // Check if the row already exists for this branch + itemCode
    let $existingRow = $("#summaryDeliveryTable tbody tr").filter(function () {
      return (
        $(this).data("itemcode") == itemCode && $(this).data("branch") == branch
      );
    });

    // let $emptyRow = $("#summaryDeliveryTable tbody tr.empty-row").first();
    // let $emptySerialRow = $("#nonSerializeSummary tbody tr.empty-row").first();

    let newRow = $(`
      <tr data-itemcode="${itemCode}" data-branch="${branch}" style="padding: 3px; height: 40px; min-height: 40px">
        <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
        <td style="background:#FFFBDF" class="text-primary">${Serial}</td>
        <td style="background:#FFFBDF">${branch}</td>
        <td style="background:#FFFBDF">${brand}</td>
        <td style="background:#FFFBDF" class="text-start">${model}</td>
        <td style="background:#FFFBDF" class="text-start">${category}</td>
        <td style="background:#FFFBDF" class="text-center">${qty}</td>
        <td style="background:#FFFBDF" class="d-none">${itemCode}</td>
      </tr>
    `);

    let noSerialRow =
      $(`<tr data-itemcode="${itemCode}" data-branch="${branch}" style="padding: 3px; height: 40px; min-height: 40px">
      <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
      <td style="background:#FFFBDF">${branch}</td>
      <td style="background:#FFFBDF">${brand}</td>
      <td style="background:#FFFBDF" class="text-start">${model}</td>
      <td style="background:#FFFBDF" class="text-start">${category}</td>
      <td style="background:#FFFBDF" class="text-center">${qty}</td>
      <td style="background:#FFFBDF" class="d-none">${itemCode}</td>
      </tr>
    `);

    if ($existingRow.length) {
      // Replace the existing row
      $existingRow.replaceWith(newRow);
    } else {
      // Append new row if none exists
      let $emptyRow = $("#summaryDeliveryTable tbody tr.empty-row").first();
      if ($emptyRow.length) {
        $emptyRow.replaceWith(newRow);
      } else {
        $("#summaryDeliveryTable tbody").append(newRow);
      }
    }

    // Handle non-serial rows
    if (!Serial || Serial.trim() === "") {
      let $emptySerialRow = $(
        "#nonSerializeSummary tbody tr.empty-row",
      ).first();
      if ($emptySerialRow.length) {
        $emptySerialRow.replaceWith(noSerialRow);
      } else {
        $("#nonSerializeSummary tbody").append(noSerialRow);
      }
    }

    // Recount all rows in summaryDeliveryTable to ensure correct numbering
    $("#summaryDeliveryTable tbody tr").each(function (index) {
      $(this)
        .find("td:first")
        .text(index + 1);
    });

    // Recount all rows in nonSerializeSummary as well
    $("#nonSerializeSummary tbody tr").each(function (index) {
      $(this)
        .find("td:first")
        .text(index + 1);
    });

    newRow.hover(
      function () {
        $(this).css("background", "#FFF4C2");
      },
      function () {
        $(this).css("background", "#FFFBDF");
      },
    );

    noSerialRow.hover(
      function () {
        $(this).css("background", "#FFF4C2");
      },
      function () {
        $(this).css("background", "#FFFBDF");
      },
    );
  });

  // Optional reset
  $("#assignBranchModal").modal("hide");
  resetBranchQuantities();
}

// CLEAR THE TABLE
function clearTable() {
  Swal.fire({
    icon: "question",
    title: "Are you sure to clear this form?",
    confirmButtonText: "Clear",
    showCancelButton: true,
    cancelButtonColor: "#d33",
  }).then((res) => {
    if (res.isConfirmed) {
      let row = [];

      $("#delivery-serial-table tbody").empty();
      // $("#deliveryTable tbody").empty();
      $("#summaryTable tbody").empty();
      $("#summaryDeliveryTable tbody").empty();

      for (let i = 0; i < 8; i++) {
        row = `
          <tr>
          <td style="background: #FFFBDF; height: 40px;"></td>
          <td style="background: #FFFBDF; height: 40px;"></td>
          <td style="background: #FFFBDF; height: 40px;"></td>
          <td style="background: #FFFBDF; height: 40px;"></td>
          <td style="background: #FFFBDF; height: 40px;"></td>
          <td style="background: #FFFBDF; height: 40px;"></td>
          <td style="background: #FFFBDF; height: 40px;"></td>
        </tr>
        `;

        // $("#deliveryTable tbody").append(row);
        $("#summaryTable tbody").append(row);
        $("#summaryDeliveryTable tbody").append(row);
      }

      let serialRow = `<tr>
          <td rowspan="9" colspan="2" style="background: #FFFBDF" contenteditable="true" style="white-space: pre-wrap;">
          </td>
        </tr>`;

      $("#delivery-serial-table tbody").append(serialRow);
    }
  });
}

function summaryData() {
  let rows = [];

  if (rows.length === 0) {
    for (let i = 0; i < 8; i++) {
      rows.push(["", "", "", "", "", "", "", ""]);
    }
  }

  summaryTable = $("#summaryDeliveryTable").DataTable({
    data: rows,
    columns: [
      { title: "#" },
      { title: "Serial" },
      { title: "Branch" },
      { title: "Brand" },
      { title: "Model" },
      { title: "Category" },
      { title: "Quantity" },
      { title: "Item Code" },
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
      });

      $("td:eq(0)", row).addClass("text-center");
      $("td:eq(1)", row).addClass("text-primary");
      $("td:eq(4)", row).addClass("text-start");
      $("td:eq(6)", row).addClass("text-center");
      $("td:eq(7)", row).addClass("d-none");

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
      let tableBody = $("#summaryDeliveryTable tbody");
      let currentRows = tableBody.find("tr").length;

      for (let i = currentRows; i < 8; i++) {
        let emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="7" style="background:#FFFBDF"></td>
                </tr>
              `);

        $(emptyRow).css({
          background: "#FFFBDF",
          height: "40px",
        });

        emptyRow.hover(
          function () {
            $("td:not(:first-child)", this).css("background", "#FFF4C2");
          },
          function () {
            $("td:not(:first-child)", this).css("background", "#FFFBDF");
          },
        );

        tableBody.append(emptyRow);
      }
    },
  });
}

function resetBranchQuantities() {
  $("#branchToDeliverModal tbody")
    .find("td[contenteditable='true']")
    .each(function () {
      $(this).text("");
    });
}

function loadPicklistBranches(
  deliveryNumber,
  picklistNumber,
  model,
  category,
  callback,
) {
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_product_distribution_setup.php",
    type: "POST",
    data: {
      DRNumber: deliveryNumber,
      PicklistNum: picklistNumber,
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let branches = response.Data;

        let tbody = $("#branchToDeliverModal tbody");
        tbody.empty();

        let length = branches.length;

        if (branches.length > 1) {
          branches.forEach((branch) => {
            let row = `
            <tr>
              <td style="background: #FFF7BC">${branch.ReqBranch}</td>
              <td style="background: #FFF7BC">${model}</td>
              <td style="background: #FFF7BC">${category}</td>
              <td style="background: #FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
            </tr>
          `;

            tbody.append(row);
          });
        }
        // console.log(`BRANCHES LENGTH ${branches.length}`);
        if (callback) callback(length, branches[0].ReqBranch);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
}

function addNonSerialize(ItemSerial, DrNumber, picklistDr) {
  $("#frm-add-delivery")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      let Brand = $("#newBrand").val();
      let Model = $("#newModel").val();
      let quantity = parseInt($("#newQuantity").val()) || 1;

      $.ajax({
        url: "dirs/basket/dashboard/actions/get_nonserialized_item.php",
        type: "POST",
        data: {
          Brand: Brand,
          Model: Model,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let item = response.Data[0];

            if (response.Data.length === 0) {
              Swal.fire({
                icon: "error",
                title: "Unavailable stock(s) for this model",
                text: "Please try other item",
                confirmButtonText: "OKAY",
              });
              return;
            }

            let existingTotal = parseInt($("#summaryQty").text()) || 0;
            let $summaryTbody = $("#summaryTable tbody");

            // ----------- SUMMARY TABLE ----------
            // let $existingRow = $summaryTbody.find(
            //   `tr[data-itemcode="${item.ItemCode}"][data-branch="${branch}"]`,
            // );
            let $existingRow = $summaryTbody.find(
              `tr[data-itemcode="${item.ItemCode}"]`,
            );
            if ($existingRow.length) {
              let currentQty =
                parseInt($existingRow.find("td:nth-child(3)").text()) || 0;
              $existingRow.find("td:nth-child(3)").text(currentQty + quantity);
            } else {
              let summaryRow = `
            <tr data-itemcode="${item.ItemCode}" data-deliverynum="${DrNumber}" data-picklist="${picklistDr}" style="height: 40px; cursor: pointer">
              <td style="background:#FFFBDF">${item.Brand}</td>
              <td style="background:#FFFBDF">${item.Model}</td>
              <td style="background:#FFFBDF">${item.Category}</td>
              <td style="background:#FFFBDF" class="ms-3">${quantity}</td>
              <td style="background:#FFFBDF">
                <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">Unassigned</span>
              </td>
            </tr>
            `;

              let $emptySummaryRow = $summaryTbody.find("tr.empty-row").first();
              if ($emptySummaryRow.length) {
                $emptySummaryRow.replaceWith(summaryRow);
              } else {
                $summaryTbody.append(summaryRow);
              }
            }

            // $("#newItemCode").val("");
            $("#newQuantity").val("");
            $("#newBrand").val("");
            $("#newModel").val("");
            $("#newCategory").val("").prop("disabled", true);
            $("#addDeliveryModal").modal("hide");
            $("#summaryQty").text(existingTotal + quantity);
          } else {
            Swal.fire({
              icon: "error",
              title: response.isSuccess,
            });
          }
        },
      });
    });
}

// BRANCH ASSIGNMENT
function submitBranchDelivery() {
  $("#branchDeliveryUnit").on("submit", function (e) {
    e.preventDefault();

    let { totalInput, requiredQty } = validateBranchAssignment();

    if (totalInput > requiredQty) {
      Swal.fire({
        icon: "error",
        title: "Exceeded Quantity",
        text: "Allocated quantity exceeds the required delivery quantity.",
        confirmButtonText: "OKAY",
      });
      return;
    }

    if (totalInput < requiredQty) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Allocation",
        text: "Allocated quantity is less than the required delivery quantity.",
      });
      return;
    }

    // ✅ GET IDENTIFIER
    let itemCode = $("#assignBranchModal #itemCode").val();

    // ✅ FIND MATCHING ROW IN SUMMARY TABLE
    let $row = $(`#summaryTable tbody tr[data-itemcode="${itemCode}"]`);

    // ✅ UPDATE BADGE
    $row
      .find(".badge")
      .removeClass("bg-warning")
      .addClass("bg-success text-light")
      .text("Assigned");

    Swal.fire({
      icon: "success",
      title: "Valid Allocation",
      text: "All quantities match the required delivery quantity.",
      confirmButtonText: "Proceed",
    }).then(() => {
      branchDelivery();
      $("#assignBranchModal").modal("hide");
    });
  });
}

// BRANCH ASSIGNMENT
function submitBranchDelivery() {
  $("#branchDeliveryUnit").on("submit", function (e) {
    e.preventDefault();

    let { totalInput, requiredQty } = validateBranchAssignment();

    if (totalInput > requiredQty) {
      Swal.fire({
        icon: "error",
        title: "Exceeded Quantity",
        text: "Allocated quantity exceeds the required delivery quantity.",
        confirmButtonText: "OKAY",
      });
      return;
    }

    if (totalInput < requiredQty) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Allocation",
        text: "Allocated quantity is less than the required delivery quantity.",
      });
      return;
    }

    // ✅ GET IDENTIFIER
    let itemCode = $("#assignBranchModal #itemCode").val();

    // ✅ FIND MATCHING ROW IN SUMMARY TABLE
    let $row = $(`#summaryTable tbody tr[data-itemcode="${itemCode}"]`);

    // ✅ UPDATE BADGE
    $row
      .find(".badge")
      .removeClass("bg-warning")
      .addClass("bg-success text-light")
      .text("Assigned");

    Swal.fire({
      icon: "success",
      title: "Valid Allocation",
      text: "All quantities match the required delivery quantity.",
      confirmButtonText: "Proceed",
    }).then(() => {
      branchDelivery();
      $("#assignBranchModal").modal("hide");
    });
  });
}

function assignBranch(createDeliveryNumber, picklistDr, previousSerials = []) {
  $.post("dirs/basket/dashboard/branchAssignment.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    loadImperialBrands();
    serialDeliveryInput(createDeliveryNumber, picklistDr, previousSerials);
    loadIAPBranchlist();
    summaryData();

    $(document)
      .off("input", "#branchToDeliverModal td[contenteditable='true']")
      .on(
        "input",
        "#branchToDeliverModal td[contenteditable='true']",
        function () {
          validateBranchAssignment();
        },
      );

    submitBranchDelivery();

    $("#newBrand").on("change", function () {
      $("#newModel").html('<option value="">Select Model</option>');
      $("#newCategory").val("");
      $("#itemcode").val("");
      loadImperialModel();
    });

    $("#newModel").on("change", function () {
      const selected = $(this).find(":selected");
      $("#newCategory").val(selected.data("category") || "");
      $("#itemcode").val(selected.data("itemcode") || "");
    });

    $.ajax({
      url: "dirs/basket/dashboard/actions/get_review_deliveries.php",
      type: "POST",
      data: { DeliveryNum: createDeliveryNumber },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let header = response.Data;

          $("#drno").val(createDeliveryNumber);
          // $("#srn").val(header.BaseNum_SRN);
          $("#pcklstno").val(picklistDr);
          $("#docdate").val(header.DocumentDate);
          $("#origin").val(header.BDestination);
          $("#whcode").val(header.BWhsDestination);
          $("#status").val(header.Delivery_Status || "NEW");
          $("#prepby").val(header.PreparedBy);

          // MANUAL OR SCAN
          function toggler() {
            const toggler = document.getElementById("serialToggler");
            const knob = document.querySelector(".switch-knob");
            const manual = document.querySelector(".switch-track .manual");
            const scan = document.querySelector(".switch-track .scan");
            const serialInput = document.getElementById("newSerial");

            function updateKnob() {
              scan.style.transition = "opacity 0.3s ease";
              manual.style.transition = "opacity 0.3s ease";

              if (toggler.checked) {
                toggler.dataset.value = "Scan";
                knob.style.width = "55px";
                knob.style.transform = "translateX(8px)";
                scan.classList.add("text-white");
                manual.style.opacity = "0";
                manual.style.pointerEvents = "none";
                scan.style.opacity = "1";
                scan.style.pointerEvents = "auto";

                serialInput.removeEventListener("keydown", preventTyping);
              } else {
                toggler.dataset.value = "Manual";
                knob.style.width = "60px";
                knob.style.transform = "translateX(0px)";
                manual.classList.add("text-white");
                scan.style.opacity = "0";
                scan.style.pointerEvents = "none";
                manual.style.opacity = "1";
                manual.style.pointerEvents = "auto";

                serialInput.removeEventListener("keydown", preventTyping);
              }
            }

            function preventTyping(e) {
              const allowedKeys = ["Enter", "Tab"]; // allow scanner's "Enter" or tab navigation
              if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }

            updateKnob();

            toggler.addEventListener("change", updateKnob);
          }

          // FOR NON-SERIALIZE ITEMS
          const addBtn = document.getElementById("addDeliveryModalBtn");
          const newItemModal = new bootstrap.Modal(
            document.getElementById("addDeliveryModal"),
          );

          let allowNonserialize = false;

          addBtn.addEventListener("click", function () {
            if (allowNonserialize) {
              newItemModal.show();
              return;
            }

            Swal.fire({
              title: "Enter non-serialize items?",
              text: "Please confirm before proceeding.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Allow",
              cancelButtonText: "Cancel",
            }).then((result) => {
              if (result.isConfirmed) {
                allowNonserialize = true;
                newItemModal.show();
              }
            });
          });

          // addNonSerialize("", createDeliveryNumber, itemCode, picklistDr);
          addNonSerialize("", createDeliveryNumber, picklistDr);
          //   }
          // });

          function adjustTotalWidth() {
            const summaryTable = document.getElementById("summaryTable");
            const totalRow = document.getElementById("totalRowOutside");

            if (summaryTable && totalRow) {
              totalRow.style.width = summaryTable.offsetWidth + "px";
            }
          }

          toggler();
          adjustTotalWidth();
          window.addEventListener("resize", adjustTotalWidth);
          submitDelivery();
        }
      },
    });
  });
}

// SUBMIT DELIVERY
function submitDelivery() {
  // FORM SUBMISSION
  let commitBtn = document.getElementById("deliveryBtn");

  commitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    Swal.fire({
      icon: "warning",
      title: "Submit this for delivery?",
      text: "This action cannot be changed",
      confirmButtonText: "Submit",
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: "Back",
    }).then((res) => {
      if (res.isConfirmed) {
        // PROCEED FOR SUBMISSION
        let items = [];
        let nonSerializeItems = [];

        let hasUnassigned = false;

        $("#summaryDeliveryTable tbody tr").each(function () {
          let badgeText = $(this).find(".badge").text().trim().toLowerCase();
          let serial = $(this).find("td:nth-child(2)").text().trim();
          let branch = $(this).find("td:nth-child(3)").text().trim();
          let brand = $(this).find("td:nth-child(4)").text().trim();
          let model = $(this).find("td:nth-child(5)").text().trim();
          let category = $(this).find("td:nth-child(6)").text().trim();
          let quantity = $(this).find("td:nth-child(7)").text().trim();
          let itemCode = $(this).find("td:nth-child(8)").text().trim();

          if (badgeText === "unassigned") {
            hasUnassigned = true;
            return false;
          }

          if (brand !== "") {
            items.push({
              serial: serial,
              branch: branch,
              brand: brand,
              model: model,
              category: category,
              quantity: quantity,
              itemCode: itemCode,
            });
          }
        });

        $("#summaryNonserializeTable tbody tr").each(function () {
          let branch = $(this).find("td:nth-child(2)").text().trim();
          let brand = $(this).find("td:nth-child(3)").text().trim();
          let model = $(this).find("td:nth-child(4)").text().trim();
          let category = $(this).find("td:nth-child(5)").text().trim();
          let quantity = $(this).find("td:nth-child(6)").text().trim();
          let itemCode = $(this).find("td:nth-child(7)").text().trim();

          if (itemCode !== "" && brand !== "") {
            nonSerializeItems.push({
              branch: branch,
              brand: brand,
              model: model,
              category: category,
              quantity: quantity,
              itemCode: itemCode,
            });
          }
        });

        if (hasUnassigned) {
          Swal.fire({
            icon: "error",
            title: "Unassigned Items Found",
            text: "Please assign all items before submitting.",
          });
          return;
        }

        if (items.length === 0 && nonSerializeItems.length === 0) {
          Swal.fire({
            icon: "error",
            title: "No items on summary",
            text: "No item(s) found on the summary",
          });
          return;
        }

        let formData = new FormData();

        formData.append("DeliveryNum", $("#drno").val());
        formData.append("PickListNum", $("#pcklstno").val());
        formData.append("Branch", $("#origin").val());
        formData.append("OrginWhscode", $("#whcode").val());
        formData.append("Remarks", $("#remarks").val());

        // SERIALIZED
        items.forEach((item, i) => {
          formData.append(`Serial[${i}]`, item.serial);
          formData.append(`Brand[${i}]`, item.brand);
          formData.append(`Model[${i}]`, item.model);
          formData.append(`ItemCode[${i}]`, item.itemCode);
          formData.append(`Category[${i}]`, item.category); // add if needed
          formData.append(`Quantity[${i}]`, item.quantity);
        });

        // NON-SERIALIZED
        nonSerializeItems.forEach((item, i) => {
          formData.append(`NonSerializedItemCode[${i}]`, item.itemCode);
          formData.append(`NonSerializedBrand[${i}]`, item.brand);
          formData.append(`NonSerializedModel[${i}]`, item.model);
          formData.append(`NonSerializedCategory[${i}]`, item.category); // add if needed
          formData.append(`NonQuantity[${i}]`, item.quantity);
        });

        // ================= DEBUG =================
        console.log("Serialized:", items);
        console.log("Non-Serialized:", nonSerializeItems);

        $.ajax({
          url: "dirs/basket/dashboard/actions/save_dlvry_to_receiving.php",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
          success: function (response) {
            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: `Receiving #: ${response.ReceivingNumber}`,
              }).then(() => {
                loadDeliveryBasketContent();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed",
                text: response.message || "Error submitting data",
              });
            }
          },
          error: function (xhr) {
            console.error(xhr.responseText);
            Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "Something went wrong.",
            });
          },
        });
      }
    });
  });
}
