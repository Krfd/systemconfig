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
    $("#basketTableDashboard").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
    loadDeliveryBasket(
      "#basketTableDashboard",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
    );
    $("#loadDeliveryBtn").prop("disabled", true);
  });
}

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

$("#newBrand").on("change", function () {
  $("#newModel").html('<option value="">Select Model</option>');
  $("#newCategory").val("");
  $("#itemcode").val("");
  loadImperialModel();
});

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

$("#newModel").on("change", function () {
  const selected = $(this).find(":selected");
  $("#newCategory").val(selected.data("category") || "");
  $("#itemcode").val(selected.data("itemcode") || "");
});

// DASHBOARD TO LOADING BASKET
$(document).on(
  "dblclick",
  "#basketTableDashboard tbody .open-picklist",
  function (e) {
    e.preventDefault();
    let $row = $(this).closest("tr");
    let PickLst_Num = $row.attr("data-picklist");
    // let del_num = $row.attr("data-delivery-num");
    deliveryPicklistNum = PickLst_Num;
    // deliveryNum = del_num;

    $("#main-content").html(spinner);
    setTimeout(function () {
      loadDeliveryItems(PickLst_Num);
    }, 200);
  },
);

// PICKLIST BASKET DROPDOWN TO PICKLIST ITEMS
$(document).on("click", ".dropdown .open-picklisted", function (e) {
  let Picklist = $(this).closest("tr").attr("data-picklist");

  deliveryPicklistNum = Picklist;

  $("#main-content").html(spinner);
  setTimeout(function () {
    loadDeliveryItems(Picklist);
  }, 200);
});

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  let serial = $(this).data("serial");
  let itemCode = $(this).data("itemcode");
  let lbNum = $(this).data("lbnum");
  let brand = $(this).find("td:nth-child(1)").text().trim();
  let model = $(this).find("td:nth-child(2)").text().trim();
  let category = $(this).find("td:nth-child(3)").text().trim();
  let qty = $(this).find("td:nth-child(4)").text().trim();

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
  loadPicklistBranches(lbNum, model, category, function (length) {
    console.log(`BRANCHES LENGTH: ${length}`);
    if (length > 1) {
      $("#assignBranchModal").modal("show");
    } else {
      console.log("Single branch");
    }
  });
});

// $(document).on("click", "#summaryTable tbody tr", function (e) {
//   e.preventDefault();
//   let serial = $(this).data("serial");

//   if (!serial) {
//     return;
//   }

//   let $serialCell = $("#delivery-serial-table tbody td").first();
//   let formattedSerial;

//   if (Array.isArray(serial)) {
//     formattedSerial = serial.join("<br>");
//   } else if (typeof serial === "string") {
//     formattedSerial = serial.split(",").join("<br>");
//   } else {
//     formattedSerial = serial;
//   }

//   $serialCell.html(formattedSerial);
// });

// BRANCH ASSIGNMENT
$(document).on("click", ".datatables .dropdown .assign-branch", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let basketRow = $(this).closest("tr");
  let picklist = $(this).data("picklist");
  let branches = $(this).data("branches");

  $("#main-content").html(spinner);
  setTimeout(function () {
    assignBranch(picklist, branches);
  }, 200);
});

// EDIT ASSIGNMENT
$(document).on("click", ".edit-branch", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let picklist = $(this).data("picklist");
  let branches = $(this).data("branches");

  $("#main-content").html(spinner);

  setTimeout(function () {
    editAssignBranch(picklist, branches);
  }, 200);
});

function loadDeliveryBasketContent() {
  if ($.fn.DataTable.isDataTable("#basketTableDashboard")) {
    $("#basketTableDashboard").DataTable().clear().destroy();
  }
  let tableId = "#basketTableDashboard";
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/basket/dashboard/basket.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      loadDeliveryBasket(
        "#basketTableDashboard",
        "dirs/incoming/dashboard/actions/picklisteditems.php",
      );
      $("#loadDeliveryBtn").prop("disabled", true);
    });
  }, 200);
}

$(document).on("shown.bs.tab", 'button[data-bs-toggle="tab"]', function () {
  const target = this.id;

  if (target === "unassigned-tab") {
    loadDeliveryBasket(
      "#basketTableDashboard",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
    );
    $("#loadDeliveryBtn").prop("disabled", true);
  } else if (target === "assigned-tab") {
    loadDeliveryBasket(
      "#basketTableAssigned",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
    );
    $("#loadDeliveryBtn").prop("disabled", false);
  }
});

// OPEN SRN FROM LOADING ITEMS
function loadDeliveryBasket(tableId, url) {
  $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    success: function (response) {
      if (
        !response ||
        response.isSuccess !== "success" ||
        !Array.isArray(response.Data)
      ) {
        response = { isSuccess: "success", Data: [] };
      }

      let sortedData = response.Data.sort(
        (a, b) => Number(b.DocEntry || 0) - Number(a.DocEntry || 0),
      );

      let rows = [];
      let grouped = {};

      sortedData.forEach((item) => {
        if (!item.Actual_Item_Qty) return;

        let key = item.PKList_Number;

        if (!grouped[key]) {
          grouped[key] = {
            DocEntry: item.DocEntry,
            PKList_Number: item.PKList_Number,
            PickListStatus: item.PickListStatus,
            RequestItemQty: item.RequestItemQty,
            Req_Branch: new Set(),
            items: [],
          };
        }

        if (item.Req_Branch) {
          grouped[key].Req_Branch.add(item.Req_Branch);
        }

        grouped[key].items.push(item);
      });

      if (response.isSuccess === "success") {
        Object.values(grouped).forEach((item) => {
          let branches = Array.from(item.Req_Branch).join(", ");

          const isDisabledAttr =
            item.PickListStatus !== "PROCESSING" ? "disabled" : "";

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.DocEntry}" data-docentry="${item.DocEntry}" data-docstatus="${item.PickListStatus}" ${isDisabledAttr}
            class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer">`,
            item.PKList_Number || "",
            item.RequestItemQty || "",
            (() => {
              let status = item.PickListStatus || "";

              if (status === "NEW" || status === "PROCESSING") status = "UNASSIGNED";
              // if (status === "PROCESSING") status = "ASSIGNED";

              let badgeClass = "primary";

              if (status === "UNASSIGNED") badgeClass = "warning";
              else if (status === "ASSIGNED") badgeClass = "primary";

              return `<span class="badge bg-${badgeClass}">${status}</span>`;
            })(),
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  ${
                    item.PickListStatus !== "IT"
                    // item.PickListStatus !== "NEW"
                      ? `
                    <li>
                      <a class="dropdown-item ${
                        // item.PickListStatus === "PROCESSING"
                        item.PickListStatus === "ASSIGNED"
                          ? "edit-branch"
                          : "assign-branch"
                      }"
                        href="#"
                        data-picklist="${item.PKList_Number}"
                        data-lbNum="${item.DocEntry}"
                        data-branches="${branches}">
                        ${
                          // item.PickListStatus === "PROCESSING"
                          item.PickListStatus === "ASSIGNED"
                            ? "Edit Assignment"
                            : "Set Assignment"
                        }
                      </a>
                    </li>
                  `
                      : ""
                  }
                </ul>
              </div>`,
          ]);
          // END OF NEWLY ADDED LOOP
          // });
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable(tableId)) {
          $(tableId).DataTable().clear().destroy();
        }

        $(tableId).DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
            { title: "Picklist No." },
            { title: "Quantity", className: "text-start ps-5" },
            {
              title: "Status",
              className: "ps-3",
            },
            { title: "", orderable: false },
          ],
          createdRow: function (row, data, dataIndex) {
            let originalItem = Object.values(grouped)[dataIndex];
            if (originalItem) {
              let branches = Array.from(originalItem.Req_Branch).join(", ");
              $(row)
                .attr("data-rownum", originalItem.DocEntry)
                .attr("data-picklist", originalItem.PKList_Number)
                .attr("data-branches", branches);
            }
          },
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          order: [[0, "desc"]],
          rowCallback: function (row, data) {
            $("td:not(:first-child)", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(1)", row).addClass("text-primary ps-2");
            $("td:eq(1)", row).css("text-align", "start");
            $("td:eq(2)", row).css("text-align", "start ps-2");
            $("td:eq(3)", row).css("text-align", "start ps-2");

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
            let tableBody = $(tableId + " tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                  <tr class="empty-row">
                    <td>&nbsp;</td>
                    <td colspan="4" style="background: #FFFBDF">&nbsp;</td>
                  </tr>
                `);

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

            const selectionMode =
              $("#basketTableAssigned").data("selectionMode") || false;

            // Target dropdown buttons
            $(tableId + " tbody tr").each(function () {
              const dropdownBtn = $(this).find(
                "button[data-bs-toggle='dropdown']",
              );

              if (selectionMode) {
                dropdownBtn.prop("disabled", true).addClass("disabled");
              } else {
                dropdownBtn.prop("disabled", false).removeClass("disabled");
              }
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
  // });
}

$(document).on("click", "#deliveryItemsTable tbody .open-srn", function (e) {
  e.preventDefault();

  let picklistedRow = $(this).closest("tr");
  let SRN = picklistedRow.attr("data-srn-num");
  let RowNum = "";
  let DeliveryNum = picklistedRow.attr("data-delivery-num");
  let PicklistNumber = picklistedRow.attr("data-picklist");

  $("#main-content").html(spinner);
  setTimeout(function () {
    openDeliveryForm(DeliveryNum, PicklistNumber, RowNum, SRN);
  }, 200);
});

function toggleDelivery() {
  const loadDeliveryBtn = document.getElementById("loadDeliveryBtn");
  const selectAllBtn = document.getElementById("selectAllBtn");

  // ✅ Reliable state tracking (instead of :visible)
  let selectionMode = $("#basketTableAssigned").data("selectionMode") || false;
  let batchContainer = [];
  // =========================
  // ✅ FIRST CLICK (SHOW CHECKBOXES)
  // =========================
  if (!selectionMode) {
    let availableRows = 0;

    $("#basketTableAssigned tbody tr").each(function () {
      const row = $(this);

      if (row.hasClass("empty-row")) return;

      const statusText = row.find("td:eq(3) span").text().trim().toUpperCase();

      if (statusText === "ASSIGNED") {
        availableRows++;
      }
    });

    if (availableRows === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Available Request(s)",
        confirmButtonText: "OKAY",
      });
      selectAllBtn.classList.add("d-none");
      return;
    }

    $("#basketTableAssigned tbody tr").each(function () {
      const row = $(this);

      // ✅ FIXED index
      const statusText = row.find("td:eq(3) span").text().trim().toUpperCase();

      // const checkbox = row.find(".checkbox");
      const checkbox = row.find("input[type='checkbox']");

      if (statusText === "ASSIGNED" || statusText === "NEW") {
        checkbox.css("display", "inline-block");

        // if (batchNum && batchNum !== "null" && batchNum !== "") {
        // checkbox.prop("disabled", true);
        checkbox.prop("disabled", false);
        // console.log(`CHECKBOX ENABLED`);
        // checkbox.attr("title", "Already has batch delivery number");
        // }
        // else {
        //   // checkbox.prop("disabled", false);
        //   checkbox.prop("disabled", true);
        //   // console.log(`CHECKBOX DISABLED`);
        // }
      } else {
        checkbox.hide();
      }
    });

    selectAllBtn.classList.remove("d-none");

    // ✅ Update UI
    loadDeliveryBtn.textContent = "Add Items";

    $("#basketTableAssigned").data("selectionMode", true);
    return;
  }

  function updateDropdownState() {
    const selectionMode =
      $("#basketTableAssigned").data("selectionMode") || false;

    $("#basketTableAssigned")
      .find("button[data-bs-toggle='dropdown']")
      .prop("disabled", selectionMode)
      .toggleClass("disabled", selectionMode);
  }

  // =========================
  // ✅ SECOND CLICK (GET SELECTED)
  // =========================
  const PickListNum = [];

  $("#basketTableAssigned tbody .checkbox:checked").each(function () {
    const row = $(this).closest("tr");

    const picklist = row.attr("data-picklist");

    if (picklist) {
      PickListNum.push(picklist);
    }
  });

  if (PickListNum.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Please select at least one item",
      confirmButtonText: "OKAY",
    });

    // reset UI
    $("#basketTableAssigned tbody .checkbox").hide().prop("checked", false);

    loadDeliveryBtn.textContent = "Load Items";
    $("#basketTableAssigned").data("selectionMode", false);

    return;
  }

  // =========================
  // ✅ CONFIRM ACTION
  // =========================
  Swal.fire({
    icon: "question",
    title: "Add selected item(s) to loading basket?",
    confirmButtonText: "Add",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(`PICK LIST COLLECTION: ${PickListNum}`);
      $.ajax({
        url: "dirs/basket/dashboard/actions/save_loading_basket_items.php",
        type: "POST",
        data: { PicklistNumber: PickListNum },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            $("#basketTableAssigned").data("selectionMode", false);
            loadDeliveryBtn.textContent = "Load Items";
            Swal.fire({
              icon: "success",
              title: "Items has been added to loading basket",
              showConfirmButton: true,
              confirmButtonText: "OKAY",
            }).then(() => {
              loadDeliveryBasket(
                "#basketTableAssigned",
                "dirs/incoming/dashboard/actions/picklisteditems.php",
              );
            });
          } else {
            Swal.fire({
              icon: "error",
              title: response.Message,
            });
          }
        },
      });
      $("#selectAllBtn").addClass("d-none");
    }
  });
}

function selectAll() {
  const checkboxes = $("#basketTableAssigned tbody .checkbox:visible").not(
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

// function serialDeliveryInput(
//   lbNum,
//   PicklistDr,
//   previousSerials,
//   allowedItemCodes,
// ) {
//   $("#serial-delivery").on("submit", function (e) {
//     e.preventDefault();
//     console.log(`SERIAL INPUT ALLOWED ITEMCODES: ${allowedItemCodes}`);
//     const serialInput = $("#newSerial");
//     const Serial = serialInput.val().trim();
//     let lines = Serial.split(/\r?\n/)
//       .map((s) => s.replace(/[\u200B\s]+/g, "").trim())
//       .filter(Boolean);
//     let latestInput = lines[lines.length - 1] || "";
//     let ItemCode = "";
//     if (Serial) {
//       $.ajax({
//         url: "dirs/basket/dashboard/actions/get_branch_stock_serial.php",
//         type: "POST",
//         data: {
//           ItemSerial: latestInput,
//           lbNum: lbNum,
//           ItemCode: ItemCode,
//         },
//         dataType: "json",
//         success: function (response) {
//           if (response.isSuccess === "success") {
//             let items = response.Data;
//             let rows = [];
//             let existingTotal = parseInt($("#summaryQty").text()) || 0;
//             let totalQty = existingTotal;
//             let $summaryTbody = $("#summaryTable tbody");
//             let $summaryDeliveryTbody = $("#summaryDeliveryTable tbody");

//             const groupedItems = {};

//             items.forEach((item) => {
//               if (!item.ItemCode) return;

//               if (!groupedItems[item.ItemCode]) {
//                 groupedItems[item.ItemCode] = {
//                   ...item,
//                   qty: 0,
//                 };
//               }

//               groupedItems[item.ItemCode].qty += 1;
//             });

//             Object.values(groupedItems).forEach(function (item) {
//               let brand = item.Brand;
//               let model = item.Model;
//               let category = item.Category;
//               let itemCode = item.ItemCode;
//               let qty = item.qty;

//               // if (!allowedItemCodes.includes(itemCode)) {
//               //   Swal.fire({
//               //     icon: "error",
//               //     title: "Invalid Item",
//               //     text: "This item does not belong to the selected loading basket.",
//               //   });
//               //   return;
//               // }

//               if (!brand || !model || !category || !itemCode) {
//                 console.warn("Skipped item due to null/empty value:", item);
//                 return;
//               }
//               totalQty += qty;

//               let $existingRow = $summaryTbody.find(
//                 `tr[data-itemcode="${itemCode}"]`,
//               );
//               let $existingSummaryQty = $summaryDeliveryTbody.find(
//                 `tr[data-itemcode="${itemCode}"]`,
//               );
//               console.log(`SERIALIZE BATCH NUMBER: ${lbNum}`);
//               loadPicklistBranches(
//                 lbNum,
//                 model,
//                 category,
//                 function (length, branchName) {
//                   console.log(`BRANCH NAMES : ${branchName}`);
//                   if (length > 1) {
//                     console.log(`BRANCHES LENGTH: ${length}`);
//                     rows += `
//                         <tr style="height: 40px; min-height: 40px;" data-serial="${latestInput}">
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
//                         </tr>`;
//                     if ($existingRow.length) {
//                       let currentQty =
//                         parseInt($existingRow.find("td:nth-child(4)").text()) ||
//                         0;
//                       $existingRow.find("td:nth-child(4)").text(currentQty + 1);

//                       // ✅ Update data attributes if needed
//                       $existingRow.attr("data-serial", latestInput);
//                       $existingRow.attr("data-itemcode", itemCode);
//                     } else {
//                       // ✅ CREATE NEW ROW
//                       let newRow = `
//                         <tr data-itemcode="${itemCode}" data-serialbased="true" data-serial="${latestInput}" data-lbnum="${lbNum}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
//                           <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
//                           <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
//                           <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
//                             <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">Unassigned</span>
//                           </td>
//                         </tr>
//                       `;
//                       let $emptyRow = $summaryTbody
//                         .find("tr.empty-row")
//                         .first();
//                       if ($emptyRow.length) {
//                         $emptyRow.replaceWith(newRow);
//                       } else {
//                         $summaryTbody.append(newRow);
//                       }
//                     }
//                   } else {
//                     rows += `
//                         <tr style="height: 40px; min-height: 40px;">
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
//                         </tr>`;
//                     if ($existingRow.length) {
//                       let currentQty =
//                         parseInt($existingRow.find("td:nth-child(4)").text()) ||
//                         0;
//                       $existingRow.find("td:nth-child(4)").text(currentQty + 1);
//                       $existingSummaryQty
//                         .find("td:nth-child(7)")
//                         .text(currentQty + 1);

//                       // $existingRow.find("td:nth-child(5)").html(`
//                       //     <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">
//                       //         Assigned
//                       //     </span>
//                       // `);

//                       // ✅ Update data attributes if needed
//                       $existingRow.attr("data-serial", latestInput);
//                       $existingRow.attr("data-itemcode", itemCode);
//                     } else {
//                       // ✅ CREATE NEW ROW
//                       let newRow = `
//                           <tr data-itemcode="${itemCode}" data-serial="${latestInput}" data-lbnum="${lbNum}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
//                             <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
//                             <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
//                             <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
//                             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
//                             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
//                               <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
//                             </td>
//                           </tr>
//                         `;
//                       // Replace first empty row if exists
//                       let $emptyRow = $summaryTbody
//                         .find("tr.empty-row")
//                         .first();
//                       if ($emptyRow.length) {
//                         $emptyRow.replaceWith(newRow);
//                       } else {
//                         $summaryTbody.append(newRow);
//                       }
//                       let rowCount = $("#summaryDeliveryTable tbody tr").filter(
//                         function () {
//                           return (
//                             $(this).find("td:nth-child(2)").text().trim() !== ""
//                           );
//                         },
//                       ).length;
//                       if ($.fn.DataTable.isDataTable("#summaryDeliveryTable")) {
//                         $("#summaryDeliveryTable")
//                           .DataTable()
//                           .clear()
//                           .destroy();
//                       }
//                       let exists = false;
//                       $("#summaryDeliveryTable tbody tr").each(function () {
//                         let code = $(this).data("itemcode");
//                         if (code == itemCode) {
//                           exists = true;
//                           return false; // break loop
//                         }
//                       });
//                       // OR SIMPLY DISABLE THE SAVE BUTTON
//                       if (exists) {
//                         Swal.fire({
//                           icon: "error",
//                           title: "Item already assigned to the branch",
//                           confirmButtonText: "OKAY",
//                         });
//                         return;
//                       }
//                       $("#summaryTable tbody tr").each(function () {
//                         let branch = $(this)
//                           .find("td:nth-child(1)")
//                           .text()
//                           .trim();
//                         let model = $(this)
//                           .find("td:nth-child(2)")
//                           .text()
//                           .trim();
//                         let qty = $(this).find("td:nth-child(4)").text().trim();
//                         if (!qty || qty === "0") return;
//                         rowCount++;
//                         let $emptyRow = $(
//                           "#summaryDeliveryTable tbody tr.empty-row",
//                         ).first();

//                         let newRow = $(`
//                               <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px">
//                                 <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
//                                 <td style="background:#FFFBDF" class="text-primary">${Serial}</td>
//                                 <td style="background:#FFFBDF">${branchName}</td>
//                                 <td style="background:#FFFBDF">${brand}</td>
//                                 <td style="background:#FFFBDF" class="text-start">${model}</td>
//                                 <td style="background:#FFFBDF" class="text-start">${category}</td>
//                                 <td style="background:#FFFBDF" class="text-center">${qty}</td>
//                                 <td style="background:#FFFBDF" class="d-none">${itemCode}</td>
//                               </tr>
//                             `);
//                         if ($emptyRow.length) {
//                           $emptyRow.replaceWith(newRow);
//                         } else {
//                           $("#summaryDeliveryTable tbody").append(newRow);
//                         }
//                         newRow.hover(
//                           function () {
//                             $(this).css("background", "#FFF4C2");
//                           },
//                           function () {
//                             $(this).css("background", "#FFFBDF");
//                           },
//                         );
//                       });
//                     }
//                   }
//                   $("#summaryQty").text(totalQty);
//                 },
//               );
//             });
//           } else if (response.isSuccess === "empty") {
//             Swal.fire({
//               icon: "error",
//               title: "Unavailable stock for this model",
//               confirmButtonText: "OKAY",
//             });
//           } else {
//             Swal.fire({
//               icon: "error",
//               title: response.Data,
//               confirmButtonText: "OKAY",
//             });
//           }
//         },
//         error: function () {
//           Swal.fire({
//             icon: "error",
//             title: "Something went wrong",
//           });
//         },
//         // complete: function () {
//         //   $("#nonSerializeBtn").prop("disabled", false);
//         // },
//       });
//     }
//     serialInput.val("");
//     serialInput.focus();
//   });
// }

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

  $("#branchAssignmentTable tbody tr").each(function () {
    let branch = $(this).find("td:nth-child(1)").text().trim();
    let model = $(this).find("td:nth-child(2)").text().trim();
    let category = $(this).find("td:nth-child(3)").text().trim();
    let qty = $(this).find("td:nth-child(4)").text().trim();

    console.log(`BRANCH: ${branch}`);

    if (!qty || qty === "0") return;

    rowCount++;
    serialRowCount++;

    // Check if the row already exists for this branch + itemCode
    let $existingRow = $("#summaryDeliveryTable tbody tr").filter(function () {
      return (
        $(this).data("itemcode") == itemCode && $(this).data("branch") == branch
      );
    });

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

      $("#summaryTable tbody").empty();

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

        $("#summaryTable tbody").append(row);
      }
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
  $("#branchAssignmentTable tbody")
    .find("td[contenteditable='true']")
    .each(function () {
      $(this).text("");
    });
}

function loadPicklistBranches(lbNum, model, category, callback) {
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_product_distribution_setup.php",
    type: "POST",
    data: {
      lbNum: lbNum,
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let branches = response.Data;

        let tbody = $("#branchAssignmentTable tbody");
        tbody.empty();

        let length = branches.length;

        if (branches.length > 1) {
          branches.forEach((branch) => {
            let row = `
            <tr>
              <td style="background: #FFF7BC">${branch.RequestingBranch}</td>
              <td style="background: #FFF7BC">${model}</td>
              <td style="background: #FFF7BC">${category}</td>
              <td style="background: #FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
            </tr>
          `;

            tbody.append(row);
          });
        }
        if (callback) callback(length, branches[0].RequestingBranch);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
}

// function addNonSerialize(ItemSerial, lbNum, picklistDr, allowedItemCodes) {
//   console.log(`NONSERIALIZE ALLOWED ITEM CODES: ${allowedItemCodes}`);
//   $("#frm-add-delivery")
//     .off("submit")
//     .on("submit", function (e) {
//       e.preventDefault();

//       let Brand = $("#newBrand").val();
//       let Model = $("#newModel").val();
//       let quantity = parseInt($("#newQuantity").val()) || 1;

//       $.ajax({
//         url: "dirs/basket/dashboard/actions/get_nonserialized_item.php",
//         type: "POST",
//         data: {
//           Brand: Brand,
//           Model: Model,
//         },
//         dataType: "json",
//         success: function (response) {
//           if (response.isSuccess === "success") {
//             // let items = response.Data[0];
//             let items = response.Data;

//             if (response.Data.length === 0) {
//               Swal.fire({
//                 icon: "error",
//                 title: "Unavailable stock(s) for this model",
//                 text: "Please try other item",
//                 confirmButtonText: "OKAY",
//               });
//               return;
//             }

//             let rows = [];
//             let existingTotal = parseInt($("#summaryQty").text()) || 0;
//             let totalQty = existingTotal;
//             let $summaryTbody = $("#summaryTable tbody");
//             let $summaryDeliveryTbody = $("#summaryDeliveryTable tbody");

//             const groupedItems = {};

//             items.forEach((item) => {
//               if (!item.ItemCode) return;
//               if (!groupedItems[item.ItemCode]) {
//                 groupedItems[item.ItemCode] = {
//                   ...item,
//                   qty: 0,
//                 };
//               }

//               groupedItems[item.ItemCode].qty += 1;
//             });

//             Object.values(groupedItems).forEach(function (item) {
//               let brand = item.Brand;
//               let model = item.Model;
//               let category = item.Category;
//               let itemCode = item.ItemCode;
//               // let qty = item.qty;

//               // if (!allowedItemCodes.includes(itemCode)) {
//               //   Swal.fire({
//               //     icon: "error",
//               //     title: "Invalid Item",
//               //     text: "This item does not belong to this picklist.",
//               //   });
//               //   return;
//               // }

//               if (!brand || !model || !category || !itemCode) {
//                 console.warn("Skipped item due to null/empty value:", item);
//                 return;
//               }
//               // totalQty += qty;
//               totalQty += quantity;

//               let $existingRow = $summaryTbody.find(
//                 `tr[data-itemcode="${itemCode}"]`,
//               );
//               let $existingSummaryQty = $summaryDeliveryTbody.find(
//                 `tr[data-itemcode="${itemCode}"]`,
//               );
//               loadPicklistBranches(
//                 lbNum,
//                 model,
//                 category,
//                 function (length, branchName) {
//                   if (length > 1) {
//                     rows += `
//                         <tr style="height: 40px; min-height: 40px; cursor: pointer">
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
//                         </tr>`;
//                     if ($existingRow.length) {
//                       let currentQty =
//                         parseInt($existingRow.find("td:nth-child(4)").text()) ||
//                         0;
//                       $existingRow
//                         .find("td:nth-child(4)")
//                         .text(currentQty + quantity);

//                       $existingRow.find("td:nth-child(5)").html(`
//                           <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
//                       `);

//                       $existingRow.attr("data-itemcode", itemCode);
//                     } else {
//                       let newRow = `
//                         <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
//                           <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
//                           <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
//                           <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
//                           <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
//                             <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">Unassigned</span>
//                           </td>
//                         </tr>
//                       `;
//                       let $emptyRow = $summaryTbody
//                         .find("tr.empty-row")
//                         .first();
//                       if ($emptyRow.length) {
//                         $emptyRow.replaceWith(newRow);
//                       } else {
//                         $summaryTbody.append(newRow);
//                       }
//                     }
//                   } else {
//                     rows += `
//                     <tr style="height: 40px; min-height: 40px; cursor: pointer">
//                       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
//                       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
//                       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
//                       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
//                     </tr>`;
//                     if ($existingRow.length) {
//                       let currentQty =
//                         parseInt($existingRow.find("td:nth-child(4)").text()) ||
//                         0;
//                       $existingRow
//                         .find("td:nth-child(4)")
//                         .text(currentQty + quantity);
//                       $existingSummaryQty
//                         .find("td:nth-child(7)")
//                         .text(currentQty + quantity);

//                       $existingRow.find("td:nth-child(5)").html(`
//                       <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">
//                           Assigned
//                       </span>
//                   `);
//                       $existingRow.attr("data-itemcode", itemCode);
//                     } else {
//                       let newRow = `
//                       <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
//                         <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
//                         <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
//                         <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
//                         <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
//                           <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
//                         </td>
//                       </tr>
//                     `;
//                       // Replace first empty row if exists
//                       let $emptyRow = $summaryTbody
//                         .find("tr.empty-row")
//                         .first();
//                       if ($emptyRow.length) {
//                         $emptyRow.replaceWith(newRow);
//                       } else {
//                         $summaryTbody.append(newRow);
//                       }
//                       let rowCount = $("#summaryDeliveryTable tbody tr").filter(
//                         function () {
//                           return (
//                             $(this).find("td:nth-child(2)").text().trim() !== ""
//                           );
//                         },
//                       ).length;
//                       if ($.fn.DataTable.isDataTable("#summaryDeliveryTable")) {
//                         $("#summaryDeliveryTable")
//                           .DataTable()
//                           .clear()
//                           .destroy();
//                       }
//                       let exists = false;
//                       $("#summaryDeliveryTable tbody tr").each(function () {
//                         let code = $(this).data("itemcode");
//                         if (code == itemCode) {
//                           exists = true;
//                           return false; // break loop
//                         }
//                       });
//                       // OR SIMPLY DISABLE THE SAVE BUTTON
//                       if (exists) {
//                         Swal.fire({
//                           icon: "error",
//                           title: "Item already assigned to the branch",
//                           confirmButtonText: "OKAY",
//                         });
//                         return;
//                       }
//                       $("#summaryTable tbody tr").each(function () {
//                         let branch = $(this)
//                           .find("td:nth-child(1)")
//                           .text()
//                           .trim();
//                         let model = $(this)
//                           .find("td:nth-child(2)")
//                           .text()
//                           .trim();
//                         let quantity = $(this)
//                           .find("td:nth-child(4)")
//                           .text()
//                           .trim();
//                         if (!quantity || quantity === "0") return;
//                         rowCount++;
//                         let $emptyRow = $(
//                           "#summaryDeliveryTable tbody tr.empty-row",
//                         ).first();

//                         let newRow = $(`
//                           <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px; cursor: pointer">
//                             <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
//                             <td style="background:#FFFBDF" class="text-primary"></td>
//                             <td style="background:#FFFBDF">${branchName}</td>
//                             <td style="background:#FFFBDF">${brand}</td>
//                             <td style="background:#FFFBDF" class="text-start">${model}</td>
//                             <td style="background:#FFFBDF" class="text-start">${category}</td>
//                             <td style="background:#FFFBDF" class="text-center">${quantity}</td>
//                             <td style="background:#FFFBDF" class="d-none">${itemCode}</td>
//                           </tr>
//                         `);
//                         if ($emptyRow.length) {
//                           $emptyRow.replaceWith(newRow);
//                         } else {
//                           $("#summaryDeliveryTable tbody").append(newRow);
//                         }
//                         newRow.hover(
//                           function () {
//                             $(this).css("background", "#FFF4C2");
//                           },
//                           function () {
//                             $(this).css("background", "#FFFBDF");
//                           },
//                         );
//                       });
//                     }
//                   }
//                   $("#summaryQty").text(totalQty);
//                 },
//               );
//             });

//             // $("#newItemCode").val("");
//             $("#newQuantity").val("");
//             $("#newBrand").val("");
//             $("#newModel").val("");
//             $("#newCategory").val("").prop("disabled", true);
//             $("#addDeliveryModal").modal("hide");
//             $("#summaryQty").text(existingTotal + quantity);
//           } else {
//             Swal.fire({
//               icon: "error",
//               title: response.isSuccess,
//             });
//           }
//         },
//       });
//     });
// }

function restrictInput() {
  $(document).on(
    "input",
    "#summaryTable td[contenteditable='true']",
    function () {
      let el = this;

      // Get current cursor position
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      let cursorPos = range.startOffset;

      let value = $(el).text();

      // Keep only numbers
      value = value.replace(/[^0-9]/g, "");

      // Limit to 3 digits
      value = value.substring(0, 3);

      $(el).text(value);

      // Restore cursor position (adjust if needed)
      let newPos = Math.min(cursorPos, value.length);

      let newRange = document.createRange();
      newRange.setStart(el.childNodes[0] || el, newPos);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);
    },
  );

  // Handle paste
  $(document).on(
    "paste",
    "#summaryTable td[contenteditable='true']",
    function (e) {
      e.preventDefault();

      let text = (e.originalEvent || e).clipboardData.getData("text");

      text = text.replace(/[^0-9]/g, "").substring(0, 3);

      document.execCommand("insertText", false, text);
    },
  );
}

function validateSummaryTable() {
  let hasError = false;
  let hasEmpty = false;

  $(
    "#summaryTable td[contenteditable='true'], #editSummaryTable td[contenteditable='true']",
  ).each(function () {
    let $cell = $(this);
    let val = $cell.text().trim();

    // Reset border for every cell first
    $cell.css("border", "");

    // EMPTY check
    if (val === "") {
      $cell.css("border", "2px solid #ffc107"); // warning
      hasEmpty = true;
      return; // skip exceeded check
    }

    if ($cell.attr("data-error") === "true") {
      let actualQty =
        parseInt($cell.closest("tr").find("td:eq(3)").text()) || 0;
      let currentVal = parseInt(val) || 0;

      let exceeded = currentVal > actualQty;
      $cell.css("border", exceeded ? "2px solid #dc3545" : ""); // reset border if valid
      if (exceeded) hasError = true;
    }
  });

  return {
    hasError,
    hasEmpty,
    isValid: !hasError && !hasEmpty,
  };
}

function updateRowAndBalance(activeCell, selector = "#summaryTable") {
  let branchTotals = {};
  let totalAssigned = 0;
  let totalActual = 0;

  let table = $(selector);

  // init branch totals
  $("#branchTotalsContainer .branch-total").each(function () {
    let branch = $(this).data("branch");
    branchTotals[branch] = 0;
  });

  table.find("tbody tr").each(function () {
    let row = $(this);

    if (row.hasClass("empty-row")) return;

    let actualQty = parseInt(row.find("td:eq(4)").text()) || 0;
    totalActual += actualQty;

    let editableCells = row.find("td[contenteditable='true']");

    let sum = 0;

    editableCells.each(function () {
      let val = parseInt($(this).text()) || 0;
      let branch = $(this).data("branch");

      if (!branch) return;

      branchTotals[branch] += val;
      sum += val;
      // totalAssigned += val;
    });

    if (sum > actualQty) {
      if (activeCell && row[0].contains(activeCell)) {
        $(activeCell)
          .css("border", "2px solid #dc3545")
          .attr("data-error", "true");
      } else {
        $(activeCell).css("border", "").removeAttr("data-error");
      }
    } else if (sum < actualQty) {
      if (activeCell && row[0].contains(activeCell)) {
        if (!$(activeCell).attr("data-error")) {
          $(activeCell).css("border", "2px solid #ffc107");
        } else {
          $(activeCell).css("border", "").removeAttr("data-error");
        }
      }
    } else {
      editableCells.each(function () {
        if (!$(this).attr("data-error")) {
          $(this).css("border", "");
        }
      });
    }
    totalAssigned += sum;
  });

  // ==============================
  // ✅ Render branch totals
  // ==============================
  $("#branchTotalsContainer .branch-total").each(function () {
    let branch = $(this).data("branch");
    $(this).text(branchTotals[branch] || 0);
  });

  // ==============================
  // ✅ Balance (actual - assigned)
  // ==============================
  let balance = totalActual - totalAssigned;
  $("#balanceQty").text(balance >= 0 ? balance : 0);
}

$(document).on(
  "keydown",
  "#summaryTable td[contenteditable='true'], #editSummaryTable td[contenteditable='true']",
  function (e) {
    let cell = $(this);
    let row = cell.closest("tr");
    let colIndex = cell.index();

    let target;

    switch (e.key) {
      case "ArrowRight":
        target = cell.nextAll("[contenteditable='true']").first();
        break;

      case "ArrowLeft":
        target = cell.prevAll("[contenteditable='true']").first();
        break;

      case "ArrowDown":
        target = row.next().find("td").eq(colIndex);
        break;

      case "ArrowUp":
        target = row.prev().find("td").eq(colIndex);
        break;

      default:
        return;
    }

    if (target && target.length && target.attr("contenteditable") === "true") {
      e.preventDefault();

      target.focus();

      // Move cursor to end
      let range = document.createRange();
      let sel = window.getSelection();
      range.selectNodeContents(target[0]);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  },
);

function assignBranch(picklist, branchees) {
  $.post("dirs/basket/dashboard/branchAssignment.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    restrictInput();
    submitBranchAssignment("#summaryTable");

    $.ajax({
      url: "dirs/basket/dashboard/actions/get_loadingbasket.php",
      type: "POST",
      data: { picklist: picklist },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let header = response.Header;
          let items = response.Orders;
          let summaryTable = $("#summaryTable tbody");
          let totalQty = 0;
          let rows = [];
          let branches = [
            ...new Set(items.map((item) => item.Req_Branch).filter(Boolean)),
          ];
          let headerRow = `
            <tr>
              <th class="d-none"></th>
              <th class="text-secondary">Brand</th>
              <th class="text-secondary">Model</th>
              <th class="text-secondary">Category</th>
              <th class="text-secondary">Actual Quantity</th>
          `;

          branches.forEach((branch) => {
            headerRow += `<th class="text-secondary text-center">${branch}</th>`;
          });

          headerRow += `</tr>`;

          $("#summaryTable thead").html(headerRow);

          $("#pcklstno").val(header.PKList_Number);
          $("#docdate").val(header.DocDate.substring(0, 10));
          $("#origin").val(header.Picked_Branch || "");
          $("#status").val(header.PickListStatus);
          $("#prepby").val(header.CollectedBy);

          let groupedItems = {};

          items.forEach(function (unit) {
            let key = unit.Req_ItemName;

            if (!groupedItems[key]) {
              groupedItems[key] = {
                Item_ids: [],
                ItemBrand: unit.Req_ItemBrand,
                ItemName: unit.Req_ItemName,
                ItemCategory: unit.Req_ItemCategory,
                Actual_Item_Qty: unit.Actual_Item_Qty || 0,
                Branches: {},
              };
            }

            let qty = Math.trunc(Number(unit.Actual_Item_Qty || 0));
            groupedItems[key].Item_ids.push(unit.Item_id);
            groupedItems[key].Actual_Item_Qty += qty;
            let branchName = unit.Req_Branch;
            if (branchName) {
              if (!groupedItems[key].Branches[branchName]) {
                groupedItems[key].Branches[branchName] = 0;
              }
              groupedItems[key].Branches[branchName] += qty;
            }
          });

          let mergedItems = Object.values(groupedItems);

          let totalsContainer = $("#branchTotalsContainer");
          totalsContainer.empty();

          branches.forEach((branch, index) => {
            totalsContainer.append(`
                  <div class="d-flex">
                    <div class="p-2 text-end">${branch}:</div>
                    <div class="p-2 branch-total" 
                        style="width:120px;" 
                        data-branch="${branch}">0</div>
                  </div>
                `);
          });

          mergedItems.forEach(function (unit, index) {
            let qty = Math.trunc(Number(unit.Actual_Item_Qty || 0));
            totalQty += qty;

            let row = `
              <tr class="item-row" style="height: 40px; min-height: 40px; cursor: pointer">
                <td class="d-none item-ids">${unit.Item_ids.join(",")}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${unit.ItemBrand}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${unit.ItemName}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${unit.ItemCategory}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${Math.trunc(Number(unit.Actual_Item_Qty))}</td>
              `;

            // Count editable branches for this row
            let editableBranches = [];

            branches.forEach((branch) => {
              let val = unit.Branches?.[branch] ?? 0;
              if (val > 0) {
                editableBranches.push(branch);
              }
            });

            // If only one editable branch → assign full qty
            if (editableBranches.length === 1) {
              let onlyBranch = editableBranches[0];
              unit.Branches[onlyBranch] = Math.trunc(
                Number(unit.Actual_Item_Qty || 0),
              );
            }

            branches.forEach((branch) => {
              let rawVal = unit.Branches?.[branch] ?? 0;
              let isEditable = rawVal > 0;

              let val =
                editableBranches.length === 1 && isEditable ? rawVal : "";

              row += `
                <td class="align-middle ps-3 text-center" data-branch="${branch}"
                    ${isEditable ? 'contenteditable="true"' : ""}
                    style="background: ${isEditable ? "#FFFBDF" : "#F7F7F7"}; cursor: ${isEditable ? "text" : "default"}; outline: none;"
                    onfocus="this.style.border='1px solid #ffc107'; this.style.outline='none';">
                    ${val}
                </td>
              `;
            });

            row += `</tr>`;
            rows += row;
          });

          $(document)
            .off("input", "#summaryTable td[contenteditable='true']")
            .on(
              "input",
              "#summaryTable td[contenteditable='true']",
              function () {
                let el = this;

                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let cursorPos = range.startOffset;

                let value = $(el).text();

                value = value.replace(/[^0-9]/g, "");
                value = value.substring(0, 3);

                $(el).text(value);

                let newPos = Math.min(cursorPos, value.length);

                let newRange = document.createRange();
                newRange.setStart(el.childNodes[0] || el, newPos);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);

                updateRowAndBalance(el, "#summaryTable");
              },
            );

          $("#summaryQty").text(totalQty);
          $("#balanceQty").text(totalQty);
          summaryTable.html(rows);
          updateRowAndBalance(null, "#summaryTable");

          let rowCount = mergedItems.length;
          if (rowCount < 8) {
            let emptyRow = 8 - rowCount;

            for (let i = 0; i < emptyRow; i++) {
              let emptyCells = `
                <td style="background: #F7F7F7" class="d-none"></td>
                <td style="background: #F7F7F7"></td>
                <td style="background: #F7F7F7"></td>
                <td style="background: #F7F7F7"></td>
                <td style="background: #F7F7F7"></td>
              `;

              // ✅ add dynamic branch columns
              branches.forEach(() => {
                emptyCells += `<td style="background: #F7F7F7"></td>`;
              });

              let empty = `
                <tr class="item-row empty-row" style="height: 50px; min-height: 50px">
                  ${emptyCells}
                </tr>
              `;
              summaryTable.append(empty);
            }
            $("#summaryQty").text(totalQty);
          }
        }
      },
    });
  });
}

function editAssignBranch(picklist, branchees) {
  $.post("dirs/basket/dashboard/editAssignment.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    restrictInput();
    saveBranchAssignment();

    $.ajax({
      url: "dirs/basket/dashboard/actions/get_loadingbasket.php",
      type: "POST",
      data: { picklist: picklist },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let header = response.Header;
          let items = response.Orders;
          let editSummaryTable = $("#editSummaryTable tbody");
          let totalQty = 0;
          let rows = [];
          let branches = [
            ...new Set(items.map((item) => item.Req_Branch).filter(Boolean)),
          ];
          let headerRow = `
            <tr>
              <th class="d-none"></th>
              <th class="text-secondary">Brand</th>
              <th class="text-secondary">Model</th>
              <th class="text-secondary">Category</th>
              <th class="text-secondary">Actual Quantity</th>
          `;

          branches.forEach((branch) => {
            headerRow += `<th class="text-secondary text-center">${branch}</th>`;
          });

          headerRow += `</tr>`;

          $("#editSummaryTable thead").html(headerRow);

          $("#pcklstno").val(header.PKList_Number);
          $("#docdate").val(header.DocDate.substring(0, 10));
          $("#origin").val(header.Picked_Branch || "");
          $("#status").val(header.PickListStatus);
          $("#prepby").val(header.CollectedBy);
          $("#remarks").val(header.Remarks);

          let groupedItems = {};

          items.forEach(function (unit) {
            let key = unit.Req_ItemName;

            if (!groupedItems[key]) {
              groupedItems[key] = {
                Item_ids: [],
                ItemBrand: unit.Req_ItemBrand,
                ItemName: unit.Req_ItemName,
                ItemCategory: unit.Req_ItemCategory,
                Actual_Item_Qty: unit.Actual_Item_Qty || 0,
                // Actual_Item_Qty: 0,
                Branches: {},
              };
            }

            let qty = Math.trunc(Number(unit.Actual_Item_Qty || 0));
            let deliverQty = Math.trunc(Number(unit.ToDeliver_Qty || 0));
            groupedItems[key].Item_ids.push(unit.Item_id);
            groupedItems[key].Actual_Item_Qty += qty;
            let branchName = unit.Req_Branch;
            if (branchName) {
              if (!groupedItems[key].Branches[branchName]) {
                groupedItems[key].Branches[branchName] = 0;
              }
              groupedItems[key].Branches[branchName] += deliverQty;
            }
          });

          let mergedItems = Object.values(groupedItems);

          let totalsContainer = $("#branchTotalsContainer");
          totalsContainer.empty();

          branches.forEach((branch, index) => {
            totalsContainer.append(`
                  <div class="d-flex">
                    <div class="p-2 text-end">${branch}:</div>
                    <div class="p-2 branch-total" 
                        style="width:120px;" 
                        data-branch="${branch}">0</div>
                  </div>
                `);
          });

          mergedItems.forEach(function (unit) {
            let branchSum = Object.values(unit.Branches).reduce(
              (a, b) => a + b,
              0,
            );

            let actual = Math.trunc(Number(unit.Actual_Item_Qty || 0));

            if (branchSum !== actual) {
              let diff = actual - branchSum;

              let firstBranch = Object.keys(unit.Branches)[0];

              if (firstBranch) {
                unit.Branches[firstBranch] += diff;
              }
            }
          });

          mergedItems.forEach(function (unit, index) {
            let qty = Math.trunc(Number(unit.Actual_Item_Qty || 0));
            totalQty += qty;

            let row = `
              <tr class="item-row" style="height: 40px; min-height: 40px; cursor: pointer">
                <td class="d-none item-ids">${unit.Item_ids.join(",")}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${unit.ItemBrand}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${unit.ItemName}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${unit.ItemCategory}</td>
                <td class="align-middle ps-3" style="background: ##F7F7F7">${Math.trunc(Number(unit.Actual_Item_Qty))}</td>
              `;

            // Count editable branches for this row
            let editableBranches = [];

            branches.forEach((branch) => {
              let val = unit.Branches?.[branch] ?? 0;
              if (val > 0) {
                editableBranches.push(branch);
              }
            });

            // If only one editable branch → assign full qty
            if (editableBranches.length === 1) {
              let onlyBranch = editableBranches[0];
              unit.Branches[onlyBranch] = Math.trunc(
                Number(unit.Actual_Item_Qty || 0),
              );
            }

            branches.forEach((branch) => {
              let rawVal = unit.Branches?.[branch] ?? 0;
              let isEditable = rawVal > 0;

              let val =
                editableBranches.length === 1 && isEditable ? rawVal : "";

              row += `
                <td class="align-middle ps-3 text-center" data-branch="${branch}"
                    ${isEditable ? 'contenteditable="true"' : ""}
                    style="background: ${isEditable ? "#FFFBDF" : "#F7F7F7"}; cursor: ${isEditable ? "text" : "default"}; outline: none;"
                    onfocus="this.style.border='1px solid #ffc107'; this.style.outline='none';">
                    ${rawVal > 0 ? rawVal : ""}
                </td>
              `;
            });

            row += `</tr>`;
            rows += row;
          });

          $(document)
            .off("input", "#editSummaryTable td[contenteditable='true']")
            .on(
              "input",
              "#editSummaryTable td[contenteditable='true']",
              function () {
                let el = this;

                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let cursorPos = range.startOffset;

                let value = $(el).text();

                value = value.replace(/[^0-9]/g, "");
                value = value.substring(0, 3);

                $(el).text(value);

                let newPos = Math.min(cursorPos, value.length);

                let newRange = document.createRange();
                newRange.setStart(el.childNodes[0] || el, newPos);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);

                updateRowAndBalance(el, "#editSummaryTable");
              },
            );

          $("#summaryQty").text(totalQty);
          $("#balanceQty").text(totalQty);
          editSummaryTable.html(rows);
          updateRowAndBalance(null, "#editSummaryTable");

          let rowCount = mergedItems.length;
          if (rowCount < 8) {
            let emptyRow = 8 - rowCount;

            for (let i = 0; i < emptyRow; i++) {
              let emptyCells = `
                <td style="background: #F7F7F7" class="d-none"></td>
                <td style="background: #F7F7F7"></td>
                <td style="background: #F7F7F7"></td>
                <td style="background: #F7F7F7"></td>
                <td style="background: #F7F7F7"></td>
              `;

              // ✅ add dynamic branch columns
              branches.forEach(() => {
                emptyCells += `<td style="background: #F7F7F7"></td>`;
              });

              let empty = `
                <tr class="item-row empty-row" style="height: 50px; min-height: 50px">
                  ${emptyCells}
                </tr>
              `;
              editSummaryTable.append(empty);
            }
            $("#summaryQty").text(totalQty);
          }
        }
      },
    });
  });
}

// SUBMIT BRANCH ASSIGNMENT
function submitBranchAssignment() {
  let commitBtn = document.getElementById("branchAssignmentBtn");

  commitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let validation = validateSummaryTable();

    if (!validation.isValid) {
      if (validation.hasEmpty) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Assignment",
          text: "All editable fields must have a value.",
        });
        return;
      }

      if (validation.hasError) {
        Swal.fire({
          icon: "error",
          title: "Invalid Quantity",
          text: "Some values exceed the allowed quantity.",
        });
        return;
      }
    }

    Swal.fire({
      icon: "warning",
      title: "Save branch assignment?",
      confirmButtonText: "Save",
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: "Back",
    }).then((res) => {
      if (res.isConfirmed) {
        // PROCEED FOR SUBMISSION
        let items = [];
        // let nonSerializeItems = [];

        let hasUnassigned = false;

        // $("#summaryDeliveryTable tbody tr").each(function () {
        //   let badgeText = $(this).find(".badge").text().trim().toLowerCase();
        //   let serial = $(this).find("td:nth-child(2)").text().trim();
        //   let branch = $(this).find("td:nth-child(3)").text().trim();
        //   let brand = $(this).find("td:nth-child(4)").text().trim();
        //   let model = $(this).find("td:nth-child(5)").text().trim();
        //   let category = $(this).find("td:nth-child(6)").text().trim();
        //   let quantity = $(this).find("td:nth-child(7)").text().trim();
        //   let itemCode = $(this).find("td:nth-child(8)").text().trim();

        //   if (badgeText === "unassigned") {
        //     hasUnassigned = true;
        //     return false;
        //   }

        //   if (brand !== "") {
        //     items.push({
        //       serial: serial,
        //       branch: branch,
        //       brand: brand,
        //       model: model,
        //       category: category,
        //       quantity: quantity,
        //       itemCode: itemCode,
        //     });
        //   }
        // });

        // $("#summaryNonserializeTable tbody tr").each(function () {
        //   let branch = $(this).find("td:nth-child(2)").text().trim();
        //   let brand = $(this).find("td:nth-child(3)").text().trim();
        //   let model = $(this).find("td:nth-child(4)").text().trim();
        //   let category = $(this).find("td:nth-child(5)").text().trim();
        //   let quantity = $(this).find("td:nth-child(6)").text().trim();
        //   let itemCode = $(this).find("td:nth-child(7)").text().trim();

        //   if (itemCode !== "" && brand !== "") {
        //     nonSerializeItems.push({
        //       branch: branch,
        //       brand: brand,
        //       model: model,
        //       category: category,
        //       quantity: quantity,
        //       itemCode: itemCode,
        //     });
        //   }
        // });

        // $("#summaryTable tbody tr").each(function () {
        $("#summaryTable tbody tr.item-row").each(function () {
          let tds = $(this).find("td");

          // let ids = tds.eq(".item-ids").text().split(",");
          // let branch = tds.eq("td:nth-child()").text().trim();
          // let brand = tds.eq("td:nth-child(3)").text().trim();
          // let model = tds.eq("td:nth-child(4)").text().trim();
          // let category = tds.eq("td:nth-child(5)").text().trim();
          // let quantity = tds.eq("td:nth-child(6)").text().trim();
          // // let itemCode = $(this).find("td:nth-child(7)").text().trim();

          let ids = tds.eq(0).text().split(",");
          // let branch = tds.eq(1).text().trim();
          let brand = tds.eq(1).text().trim();
          let model = tds.eq(2).text().trim();
          let category = tds.eq(3).text().trim();
          let quantity = tds.eq(4).text().trim();
          // let itemCode = $(this).find("td:nth-child(7)").text().trim();

          if (!brand) return;

          let branchData = [];

          tds.slice(5).each(function () {
            let branch = $(this).data("branch");
            let qty = $(this).text().trim() || 0;

            if (branch) {
              branchData.push({
                branch: branch,
                quantity: parseInt(qty) || 0,
              });
            }
          });

          // if (itemCode !== "" && brand !== "") {
          if (brand !== "") {
            items.push({
              // branch: branch,
              item_ids: ids,
              brand,
              model,
              category,
              quantity: parseInt(quantity) || 0,
              // itemCode: itemCode,
              branches: branchData,
            });
          }
        });

        // console.log(`ITEMS TO SUBMIT : ${JSON.stringify(items)}`);

        if (hasUnassigned) {
          Swal.fire({
            icon: "error",
            title: "Unassigned Items Found",
            text: "Please assign all items before submitting.",
          });
          return;
        }

        // if (items.length === 0 && nonSerializeItems.length === 0) {
        if (items.length === 0) {
          Swal.fire({
            icon: "error",
            title: "No items on summary",
            text: "No item(s) found on the summary",
          });
          return;
        }

        let formData = new FormData();

        // formData.append("BatchNum", $("#lbnum").val());
        formData.append("PickListNumber", $("#pcklstno").val());
        formData.append("Branch", $("#origin").val());
        formData.append("OrginWhscode", $("#whcode").val());
        formData.append("Remarks", $("#remarks").val());

        // SERIALIZED
        // items.forEach((item, i) => {
        //   // formData.append(`Serial[${i}]`, item.serial);
        //   // formData.append(`BranchFor[${i}]`, item.branch);
        //   formData.append(`Brand[${i}]`, item.brand);
        //   formData.append(`Model[${i}]`, item.model);
        //   // formData.append(`ItemCode[${i}]`, item.itemCode);
        //   formData.append(`Category[${i}]`, item.category); // add if needed
        //   formData.append(`Quantity[${i}]`, item.quantity);

        //   item.branches.forEach((b, j) => {
        //     formData.append(`Branch[${i}][${j}]`, b.branch);
        //     formData.append(`Qty[${i}][${j}]`, b.quantity);
        //   });
        // });

        formData.append("PickListNumber", $("#pcklstno").val());

        items.forEach((item, i) => {
          item.item_ids.forEach((id, k) => {
            item.branches.forEach((b, j) => {
              formData.append(`ItemId[]`, id);
              // formData.append(`PickListNumber[]`, $("#pcklstno").val()); // adjust if different
              formData.append(`RequestingBranch[]`, b.branch);
              formData.append(`DeliveryQty[]`, b.quantity);
              formData.append(`Remarks[]`, $("#remarks").val());
            });
          });
        });

        // ================= DEBUG =================

        $.ajax({
          // url: "dirs/basket/dashboard/actions/update_loadingbasket.php",
          url: "dirs/basket/dashboard/actions/update_setupdeliveryqty.php",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
          success: function (response) {
            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Items has been assigned",
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

// EDIT BRANCH ASSIGNMENT
function saveBranchAssignment() {
  let commitBtn = document.getElementById("branchAssignmentBtn");

  commitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let validation = validateSummaryTable();
    if (!validation.isValid) {
      if (validation.hasEmpty) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Assignment",
          text: "All editable fields must have a value.",
        });
        return;
      }

      if (validation.hasError) {
        Swal.fire({
          icon: "error",
          title: "Invalid Quantity",
          text: "Some values exceed the allowed quantity.",
        });
        return;
      }
    }

    Swal.fire({
      icon: "warning",
      title: "Save branch assignment?",
      confirmButtonText: "Save",
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: "Back",
    }).then((res) => {
      if (res.isConfirmed) {
        let items = [];

        let hasUnassigned = false;

        $("#editSummaryTable tbody tr.item-row").each(function () {
          let tds = $(this).find("td");

          let ids = tds.eq(0).text().split(",");
          let brand = tds.eq(1).text().trim();
          let model = tds.eq(2).text().trim();
          let category = tds.eq(3).text().trim();
          let quantity = tds.eq(4).text().trim();

          if (!brand) return;

          let branchData = [];

          tds.slice(5).each(function () {
            let branch = $(this).data("branch");
            let qty = $(this).text().trim() || 0;

            if (branch) {
              branchData.push({
                branch: branch,
                quantity: parseInt(qty) || 0,
              });
            }
          });

          if (brand !== "") {
            items.push({
              item_ids: ids,
              brand,
              model,
              category,
              quantity: parseInt(quantity) || 0,
              branches: branchData,
            });
          }
        });

        console.log(`ITEMS TO SUBMIT : ${JSON.stringify(items)}`);

        if (hasUnassigned) {
          Swal.fire({
            icon: "error",
            title: "Unassigned Items Found",
            text: "Please assign all items before submitting.",
          });
          return;
        }

        if (items.length === 0) {
          Swal.fire({
            icon: "error",
            title: "No items on summary",
            text: "No item(s) found on the summary",
          });
          return;
        }

        let formData = new FormData();

        formData.append("PickListNumber", $("#pcklstno").val());
        formData.append("Branch", $("#origin").val());
        formData.append("OrginWhscode", $("#whcode").val());
        formData.append("Remarks", $("#remarks").val());

        formData.append("PickListNumber", $("#pcklstno").val());

        items.forEach((item, i) => {
          item.item_ids.forEach((id, k) => {
            item.branches.forEach((b, j) => {
              formData.append(`ItemId[]`, id);
              formData.append(`RequestingBranch[]`, b.branch);
              formData.append(`DeliveryQty[]`, b.quantity);
              formData.append(`Remarks[]`, $("#remarks").val());
            });
          });
        });

        // ================= DEBUG =================

        $.ajax({
          url: "dirs/basket/dashboard/actions/update_setupdeliveryqty.php",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
          success: function (response) {
            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Items has been assigned",
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

function loadingItems() {
  $.post("dirs/basket/dashboard/loadingItems.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    $.ajax({
      url: "dirs/basket/dashboard/actions/get_delivery_basket.php",
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
          let basketData = response.Data;

          basketData.forEach((item, index) => {
            rows.push([
              item.PickList_Num,
              item.BranchPrep || "",
              item.DocDate || "",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  <li><a class="dropdown-item print-picklist" href="#" data-delivery="${item.PickList_Num}">Print</a></li>
                  <li><a class="dropdown-item create-dr" href="#" data-batch="${item.PickList_Num}">Create DR</a></li>
                </ul>
              </div>`,
            ]);
          });

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", ""]);
            }
          }

          if ($.fn.DataTable.isDataTable("#loadingBasketTable")) {
            $("#loadingBasketTable").DataTable().clear().destroy();
          }

          $("#loadingBasketTable").DataTable({
            data: rows,
            columns: [
              { title: "Picklist No." }, // Delivery No.
              { title: "Delivery Branch", className: "text-primary ps-2" }, // Batch Delivery No.
              { title: "Date Assigned", className: "text-start ps-2" }, // Picklist Qty
              { title: "", orderable: false },
            ],
            createdRow: function (row, data, dataIndex) {
              let originalItem = basketData[dataIndex];

              if (originalItem) {
                $(row).attr("data-picklist", originalItem.PickList_Num);
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
              $("td:eq(1)", row).css("text-secondary");
              $("td:eq(2)", row).css("text-secondary");
              $("td:eq(3)", row).css("text-secondary");

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
              let tableBody = $("#loadingBasketTable tbody");
              let currentRows = tableBody.find("tr").length;

              for (let i = currentRows; i < 8; i++) {
                let $emptyRow = $(`
              <tr class="empty-row" style="background: #FFFBDF">
                <td colspan="6" style="background: #FFFBDF">&nbsp;</td>
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
function loadDeliveryItems(PickLst_Num) {
  $.post("dirs/basket/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);

    // deliveryPicklistNum = PickLst_Num;

    $.ajax({
      // url: "dirs/basket/dashboard/actions/get_loading_breakdown.php",
      url: "dirs/incoming/dashboard/actions/get_picklist_items.php",
      type: "POST",
      data: { PicklistNumber: PickLst_Num },
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
          let grouped = {};

          response.Data.forEach((item) => {
            let key = item.Model;

            if (!grouped[key]) {
              grouped[key] = {
                Brand: item.Brand || "",
                Model: item.Model || "",
                Category: item.Category || "",
                Quantity: 0,
              };
            }

            grouped[key].Quantity += Math.trunc(
              // Number(item.Actual_Quantity) || 0,
              Number(item.Quantity) || 0,
            );
          });

          Object.values(grouped).forEach((item) => {
            rows.push([item.Brand, item.Model, item.Category, item.Quantity]);
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
              { title: "Brand", className: "text-start ps-5 open-picklist" },
              { title: "Model", className: "text-start ps-2" },
              { title: "Category", className: "text-start ps-2" },
              { title: "Quantity", className: "text-center ps-3" },
            ],
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

// // OPEN DELIVERY FORM FROM DELIVERY ITEMS
// function openDeliveryForm(DeliveryNum, PicklistNumber, RowNum, SRN) {
//   $.post("dirs/delivery/dashboard/deliveryForm.php", function (data) {
//     $("#main-content").hide().html(data).fadeIn(200);

//     console.log("opening delivery form")

//     $.ajax({
//       url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
//       type: "POST",
//       // data: { RowNum: RowNum },
//       data: { DeliveryNum: DeliveryNum },
//       dataType: "json",
//       success: function (response) {
//         if (response.isSuccess === "success") {
//           $("#deliverySRN").text(SRN);
//           let rowCount = response.Items.length;
//           // let rowCount = response.DevItems.length;
//           let totalQty = 0;
//           let header = response.Data;
//           let items = response.Items;
//           // let items = response.DevItems;

//           $("#drno").val(DeliveryNum);
//           $("#pcklstno").val(PicklistNumber);
//           $("#docdate").val(header.DocDate);
//           $("#origin").val(header.Destination);
//           $("#whcode").val(header.DestinationWhs);
//           $("#branchName").val(header.Destination);
//           $("#branchWhCode").val(header.DestinationWhs);
//           $("#status").val(header.RequestStatus);
//           $("#prepby").val(header.PrepBy);
//           $("#plate").val("N/A");
//           $("#driver").val("N/A");
//           $("#remarks").val(header.Remarks) || "N/A";
//           let rows = "";
//           items.forEach(function (item, index) {
//             let quantity = parseFloat(item.Quantity) || 0;
//             totalQty += quantity;
//             rows += `
//               <tr style="height: 40px; min-height: 40px">
//                 <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
//                 <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
//                 <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
//                 <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
//               </tr>
//             `;
//           });
//           $("#totalQuantity").text(totalQty);
//           // $("#deliveryTable tbody").html(rows);
//           // if (rowCount < 8) {
//           //   let emptyRowsNeeded = 8 - rowCount;
//           //   for (let i = 0; i < emptyRowsNeeded; i++) {
//           //     let emptyRow = `
//           //       <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
//           //         <td style="background: #FFFBDF"></td>
//           //         <td style="background: #FFFBDF"></td>
//           //         <td style="background: #FFFBDF"></td>
//           //         <td style="background: #FFFBDF"></td>
//           //       </tr>
//           //     `;
//           //     $("#deliveryTable tbody").append(emptyRow);
//           //   }
//           //   $("#totalQuantity").text(totalQty);
//           // }
//         }
//       },
//     });
//   });
// }

function formattedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  document.getElementById("formattedDate").value = `${yyyy}-${mm}-${dd}`;
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

function getBatchItems(batchContainer) {
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_batchitems.php",
    type: "POST",
    data: { BatchNumber: batchContainer },
    dataType: "json",
    success: function (response) {
      let items = response.Data;
      let deliveryTable = $("#deliveryFormTable tbody");
      let totalQty = 0;
      let counter = 0;

      if (response.isSuccess === "success") {
        let groupedItems = {};

        items.forEach((item) => {
          let code = item.ItemCode;

          if (!groupedItems[code]) {
            groupedItems[code] = {
              ...item,
              Deliver_Qty: parseInt(item.Deliver_Qty) || 0,
            };
          } else {
            groupedItems[code].Deliver_Qty += parseInt(item.Deliver_Qty) || 0;
          }
        });

        // items.forEach((item) => {
        Object.values(groupedItems).forEach((item) => {
          console.log(`ITEM: ${JSON.stringify(item)}`);

          counter += 1;

          totalQty += item.Deliver_Qty;

          let row = `
            <tr class="item-row" style="height: 40px; min-height:40px; cursor: pointer;" data-itemCode="${item.ItemCode}">
              <td class="align-middle ps-3" style="background: #FFFBDF;">${counter}</td>
              <td class="align-middle ps-3 item-brand" style="background: #FFFBDF;">${item.ItemBrand}</td>
              <td class="align-middle ps-3 item-model" style="background: #FFFBDF;">${item.Model}</td>
              <td class="d-none item-code">${item.ItemCode}</td>
              <td class="align-middle ps-3 item-category" style="background: #FFFBDF;">${item.ItemCategory}</td>
              <td class="align-middle ps-3 text-center item-quantity" style="background: #FFFBDF;">${item.Deliver_Qty}</td>
              <td class="align-middle ps-3" style="background: #FFFBDF;"></td>
            </tr>
          `;

          deliveryTable.append(row);
        });

        $("#delTotalQuantity").text(totalQty);

        for (let j = items.length; j <= 8; j++) {
          let emptyRow = $(`
              <tr class="empty-row">
                <td colspan="6" style="background: #FFFBDF"></td>   
              </tr>`);

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

          deliveryTable.append(emptyRow);
        }
      }
    },
  });
}

function submitDelivery() {
  $("#deliver").on("submit", function (e) {
    e.preventDefault();

    let items = [];
    $("#deliver tbody tr.item-row")
      .not(".empty-row")
      .each(function () {
        let brand = $(this).find(".item-brand").text().trim();
        let model = $(this).find(".item-model").text().trim();
        let code = $(this).find(".item-code").text().trim();
        let category = $(this).find(".item-category").text().trim();
        let quantity = $(this).find(".item-quantity").text().trim();

        if (brand !== "") {
          items.push({
            brand: brand,
            code: code,
            model: model,
            category: category,
            quantity: quantity,
          });
        }
      });

    if (items.length === 0) {
      e.preventDefault();
      Swal.fire({
        icon: "warning",
        title: "No Items on the table",
        text: "Please add at least one item before submitting.",
      });
      return;
    }

    let formData = new FormData(document.getElementById("deliver"));
    formData.append("items", JSON.stringify(items));

    // let formObject = {};

    // formData.forEach((value, key) => {
    //   formObject[key] = value;
    // });

    let formObject = Object.fromEntries(formData.entries());

    // convert items back into array BEFORE sending
    formObject.items = items;

    // DELIVERY ITEMS
    // $.ajax({
    //   url: "", // DELIVERY URL
    //   type: "POST",
    //   data: formData,
    //   processData: false,
    //   contentType: false,
    //   dataType: "json",
    //   success: function (response) {
    //     console.log(`RESPONSE: ${response}`);

    //     if (response.isSuccess === "success") {
    //       Swal.fire({
    //         icon: "success",
    //         title: "Items has been transferred to IN TRANSIT",
    //       }).then(() => {
    // window.open(
    //   `pdf/requests.php?batch=${batch}&branches=${encodeURIComponent(branches)}`,
    //   "_blank",
    // );
    // window.open(
    //   `pdf/delivery.php?data=${encodeURIComponent(JSON.stringify(formObject))}`,
    //   "_blank",
    // );
    //       });
    //     }

    //     if (response.isSuccess === "error") {
    //       Swal.fire({
    //         icon: "error",
    //         title: response.message,
    //         showConfirmButtonText: true,
    //         confirmButtonText: "OKAY",
    //       }).then(() => {
    //         location.reload();
    //       });
    //       return;
    //     }
    //   },
    // });

    window.open(
      `pdf/delivery.php?data=${encodeURIComponent(JSON.stringify(formObject))}`,
      "_blank",
    );
  });
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

// ORIGINAL
function createDr() {
  $("#main-content").html(spinner);
  $.post("dirs/basket/dashboard/createDr.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    get_userinfo();
    deliveryDate();
    getBatchItems(batchContainer);
    getDeliveryDetails();
    submitDelivery();

    const addBtn = document.getElementById("addDeliveryModalBtn");
    const newItemModal = new bootstrap.Modal(
      document.getElementById("addDeliveryModal"),
    );

    addBtn.addEventListener("click", function () {
      newItemModal.show();
    });
  });
}

function get_userinfo() {
  $.post("dirs/basket/dashboard/actions/get_userinfo.php", {}, function (data) {
    response = JSON.parse(data);
    if (jQuery.trim(response.isSuccess) == "success") {
      $("#user-origin").val(response.Data.Branch);
      $("#prepby").val(response.Data.Fullname);
      loadOriginWhscodes(response.Data.Branch);
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

async function loadIAPBranchlist() {
  $.post(
    "dirs/basket/dashboard/actions/get_branchlist.php",
    {},
    function (data) {
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const iapbranch = response.Data;
        iapbranch.forEach((iapbranch) => {
          $("#desForm").append(
            $("<option>", {
              value: iapbranch.Branch,
              text: iapbranch.Branch,
            }),
          );
        });
        if (iapbranch.length > 0 && iapbranch[0].Branch) {
          const firstBranch = iapbranch[0].Branch;
          $("#desForm").val(firstBranch);
          loadDestinationWhscodes(firstBranch);
        } else {
          console.warn("First branch is missing or invalid:", iapbranch[0]);
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
    },
  );
}

$(document)
  .off("change", "#desForm")
  .on("change", "#desForm", function () {
    const selectedBranch = $(this).val();

    if (!selectedBranch) return;

    loadDestinationWhscodes(selectedBranch);
  });

async function loadOriginWhscodes(Branch) {
  $.post(
    "dirs/basket/dashboard/actions/get_destinationwhscode.php",
    {
      Branch: Branch,
    },
    function (data) {
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const whscode = response.Data;
        $("#originCodeForm").empty();
        const selectedWH = whscode.find((w) => w.WhsCode.endsWith("WH"));
        if (selectedWH) {
          $("#originCodeForm").append(
            $("<option>", {
              value: selectedWH.WhsCode,
              text: selectedWH.WhsCode,
              title: selectedWH.WhsName,
              selected: true,
            }),
          );
        }
        $("#originCodeForm").prop("disabled", true);
      } else {
        console.log(response.Data);
        Swal.fire({
          icon: "error",
          title: "Server under restoring",
          text: "Please come back later",
          showConfirmButton: true,
          confirmButtonText: "OKAY",
          allowOutsideClick: false,
        }).then(() => {
          $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
            $("#main-content").html(data);
          });
        });
      }
    },
  );
}

function loadDestinationWhscodes(Branch) {
  if (!Branch || typeof Branch !== "string" || Branch.trim() === "") {
    return;
  }

  $.post(
    "dirs/basket/dashboard/actions/get_destinationwhscode.php",
    {
      Branch: Branch,
    },
    function (data) {
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const whscode = response.Data;
        $("#desCodeForm").empty();
        whscode.forEach((whscode) => {
          $("#desCodeForm").append(
            $("<option>", {
              value: whscode.WhsCode,
              text: whscode.WhsCode,
              title: whscode.WhsName,
              selected: whscode.WhsCode.endsWith("WH"),
            }),
          );
        });
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
    },
  );
}
