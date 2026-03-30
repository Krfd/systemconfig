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
    "dirs/delivery/dashboard/actions/get_iapbrands.php",
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
    "dirs/delivery/dashboard/actions/get_mdlcategory.php",
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
      url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
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
    e.preventDefault(); // Prevents creating a new line
    const serialInput = $("#newSerial");
    const Serial = serialInput.val().trim();
    // Normalize innerText
    let lines = Serial.split(/\r?\n/)
      .map((s) => s.replace(/[\u200B\s]+/g, "").trim()) // remove zero-width + whitespace
      .filter(Boolean); // remove empty lines
    let latestInput = lines[lines.length - 1] || "";
    let ItemCode = "";
    if (Serial) {
      $.ajax({
        url: "dirs/delivery/dashboard/actions/get_branch_stock_serial.php",
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

            // items.forEach(function (item, index) {
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
              // totalQty += 1;
              totalQty += qty;
              // Check if row already exists
              // let $existingRow = $summaryTbody.find(
              //   `tr[data-itemcode="${itemCode}"][data-branch="${branch}"]`,
              // );
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
      });
    }
    serialInput.val(""); // clear after submit
    serialInput.focus();
    // }
  });
}
