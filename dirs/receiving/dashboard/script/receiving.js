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
  $.post("dirs/receiving/dashboard/components/main.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function receivingForm() {
  $("#main-content").html(spinner);
  (setTimeout(function () {
    $.post("dirs/receiving/dashboard/receivingForm.php", {}, function (data) {
      $("#main-content").html(data);

      receiveItem();
      toggler();
      ordersReceived();
      formattedDate();
      loadImperialBrands();
      addNonSerialize();

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

      function adjustTotalWidth() {
        const summaryTable = document.getElementById("summaryTable");
        const totalRow = document.getElementById("totalRowOutside");

        if (summaryTable && totalRow) {
          totalRow.style.width = summaryTable.offsetWidth + "px";
        }
      }

      toggler();
      serialDeliveryInput();
      addNonSerialize();
      adjustTotalWidth();
      window.addEventListener("resize", adjustTotalWidth);
      submitReceiving();
    });
  }),
    200);
}

function validateNumber(el) {
  let value = $(el).text().trim();

  // Remove red border if user starts typing
  if (value !== "") {
    $(el).removeClass("border border-danger");
  }

  // Optional: allow only numbers
  if (!/^\d*$/.test(value)) {
    $(el).text(value.replace(/\D/g, ""));

    // Move cursor to end
    let range = document.createRange();
    let sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function receiveItem() {
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
}

$(document).on("input blur keyup", ".item-qty-received", function () {
  let val = $(this)
    .text()
    .replace(/\u00A0/g, "")
    .trim();

  if (val !== "") {
    $(this).css("border", "");
  }
});

function ordersReceived() {
  $("#receivingForm").on("submit", function (e) {
    e.preventDefault();

    let items = [];
    let hasError = false;

    $("#receiving-form-table tbody tr.item-row")
      .not(".empty-row")
      .each(function () {
        let brand = $(this).find(".item-brand").text().trim();
        let model = $(this).find(".item-model").text().trim();
        let code = $(this).find(".item-code").text().trim();
        let category = $(this).find(".item-category").text().trim();
        let quantity = $(this).find(".item-quantity").text().trim();

        let qtyCell = $(this).find(".item-qty-received");

        let receivedQty = $(this)
          .find(".item-qty-received")
          .text()
          .replace(/\u00A0/g, "")
          .replace(/<br>/g, "")
          .replace(/[\n\r]/g, "")
          .trim();

        qtyCell.css("border", "");

        if (receivedQty === "") {
          hasError = true;
        }

        $(".editable-cell").each(function () {
          let value = $(this).text().trim();

          if (value === "") {
            isValid = false;
            $(this).addClass("border border-danger");
          } else {
            $(this).removeClass("border border-danger");
          }
        });

        items.push({
          brand,
          model,
          code,
          category,
          quantity,
          receivedQty,
        });
      });

    // ❗ AFTER LOOP (only once)
    if (hasError) {
      Swal.fire({
        icon: "warning",
        title: "Missing Quantity",
        text: `All rows must have a received quantity.`,
      });
      return;
    }

    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Items on the table",
        text: "Please try again.",
      });
      return;
    }

    let formData = new FormData(document.getElementById("receivingForm"));
    formData.append("items", JSON.stringify(items));

    let formObject = Object.fromEntries(formData.entries());
    formObject.items = items;

    console.log(formObject);

    Swal.fire({
      icon: "question",
      title: "Are you sure to receive the following item(s)?",
      showConfirmButton: true,
      confirmButtonText: "Receive",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((response) => {
      if (response.isConfirmed) {
        $.ajax({
          url: "dirs/receiving/dashboard/actions/items_received.php",
          type: "POST",
          data: JSON.stringify(formObject),
          processData: false,
          contentType: "application/json",
          dataType: "json",
          success: function (response) {
            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Items has been received",
              }).then(() => {
                loadDashboard();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: response.isSuccess,
                text: response.message,
              });
            }
          },
        });
      }
    });
  });
}

function formattedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  document.getElementById("docDateRecForm").value = formattedDate;
}

function openRec1() {
  $.post("dirs/receiving/received/received1.php", {}, function (data) {
    $("#main-content").html(data);
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

// function addNonSerialize(ItemSerial, lbNum, picklistDr) {
function addNonSerialize() {
  $("#frm-add-delivery")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      let Brand = $("#newBrand").val();
      let Model = $("#newModel").val();
      let Category = $("#newCategory").val();
      let Quantity = parseInt($("#newQuantity").val()) || 1;

      console.log(
        `BRAND: ${Brand} - MODEL: ${Model} - CATEGORY - ${Category} - QUANTITY: ${Quantity}`,
      );

      // $.ajax({
      //   url: "dirs/basket/dashboard/actions/get_nonserialized_item.php",
      //   type: "POST",
      //   data: {
      //     Brand: Brand,
      //     Model: Model,
      //   },
      //   dataType: "json",
      //   success: function (response) {
      //     if (response.isSuccess === "success") {
      //       let items = response.Data;

      //       if (response.Data.length === 0) {
      //         Swal.fire({
      //           icon: "error",
      //           title: "Unavailable stock(s) for this model",
      //           text: "Please try other item",
      //           confirmButtonText: "OKAY",
      //         });
      //         return;
      //       }

      let rows = [];
      //       let existingTotal = parseInt($("#summaryQty").text()) || 0;
      //       let totalQty = existingTotal;
      let $receivingTbody = $("#receiving-form-table tbody");

      let counter =
        $receivingTbody.find("tr").filter(function () {
          // check if row has meaningful content (not empty)
          return (
            $(this)
              .find("td")
              .filter(function () {
                return $(this).text().trim() !== "";
              }).length > 0
          );
        }).length + 1;

      //       let $summaryDeliveryTbody = $("#summaryDeliveryTable tbody");

      //       const groupedItems = {};

      //       items.forEach((item) => {
      //         if (!item.ItemCode) return;

      //         if (!groupedItems[item.ItemCode]) {
      //           groupedItems[item.ItemCode] = {
      //             ...item,
      //             qty: 0,
      //           };
      //         }

      //         groupedItems[item.ItemCode].qty += 1;
      //       });

      //       Object.values(groupedItems).forEach(function (item) {
      //         let brand = item.Brand;
      //         let model = item.Model;
      //         let category = item.Category;
      //         let itemCode = item.ItemCode;
      //         // let qty = item.qty;
      //         if (!brand || !model || !category || !itemCode) {
      //           console.warn("Skipped item due to null/empty value:", item);
      //           return;
      //         }
      //         // totalQty += qty;
      //         totalQty += quantity;

      // let $existingRow = $summaryTbody.find(`tr[data-itemcode="${itemCode}"]`);
      //         let $existingSummaryQty = $summaryDeliveryTbody.find(
      //           `tr[data-itemcode="${itemCode}"]`,
      //         );
      //         // loadPicklistBranches(
      //         //   lbNum,
      //         //   picklistDr,
      //         //   model,
      //         //   category,
      //         //   function (length, branchName) {
      //         //     if (length > 1) {
      //         //       rows += `
      //         //           <tr style="height: 40px; min-height: 40px; cursor: pointer">
      //         //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
      //         //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
      //         //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
      //         //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
      //         //           </tr>`;
      //         //       if ($existingRow.length) {
      //         //         let currentQty =
      //         //           parseInt($existingRow.find("td:nth-child(4)").text()) ||
      //         //           0;
      //         //         $existingRow
      //         //           .find("td:nth-child(4)")
      //         //           .text(currentQty + quantity);

      //         //         $existingRow.find("td:nth-child(5)").html(`
      //         //             <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
      //         //         `);

      //         //         $existingRow.attr("data-itemcode", itemCode);
      //         //       } else {
      //         //         let newRow = `
      //         //           <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
      //         //             <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
      //         //             <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
      //         //             <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
      //         //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
      //         //             <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
      //         //               <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">Unassigned</span>
      //         //             </td>
      //         //           </tr>
      //         //         `;
      //         //         let $emptyRow = $summaryTbody
      //         //           .find("tr.empty-row")
      //         //           .first();
      //         //         if ($emptyRow.length) {
      //         //           $emptyRow.replaceWith(newRow);
      //         //         } else {
      //         //           $summaryTbody.append(newRow);
      //         //         }
      //         //       }
      //         //     } else {

      // rows += `
      //                   <tr style="height: 40px; min-height: 40px; cursor: pointer">
      //                     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
      //                     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
      //                     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
      //                     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
      //                   </tr>`;
      rows += `
        <tr style="height: 40px; min-height: 40px; cursor: pointer">
          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${counter}</td>
          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Brand}</td>
          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Model}</td>
          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Category}</td>
          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Quantity}</td>
          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px" contenteditable="true" class="item-qty-received editable-cell" onfocus="this.style.outline='none'; this.style.boxShadow='none';" oninput="validateNumber(this)"></td>
        </tr>`;
      // if ($existingRow.length) {
      //   let currentQty =
      //     parseInt($existingRow.find("td:nth-child(4)").text()) || 0;
      //   $existingRow.find("td:nth-child(4)").text(currentQty + quantity);
      //   $existingSummaryQty.find("td:nth-child(7)").text(currentQty + quantity);

      //   $existingRow.find("td:nth-child(5)").html(`
      //                     <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">
      //                         Assigned
      //                     </span>
      //                 `);
      //   $existingRow.attr("data-itemcode", itemCode);
      // } else {
      //   let newRow = `
      //                     <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
      //                       <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
      //                       <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
      //                       <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
      //                       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
      //                       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
      //                         <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
      //                       </td>
      //                     </tr>
      //                   `;
      // Replace first empty row if exists
      // let $emptyRow = $summaryTbody.find("tr.empty-row").first();
      // if ($emptyRow.length) {
      //   $emptyRow.replaceWith(newRow);
      // } else {
      //   $summaryTbody.append(newRow);
      // }
      // let rowCount = $("#receiving-form-table tbody tr").filter(function () {
      //   return $(this).find("td:nth-child(2)").text().trim() !== "";
      // }).length;
      // if ($.fn.DataTable.isDataTable("#receiving-form-table")) {
      //   $("#receiving-form-table").DataTable().clear().destroy();
      // }
      // let exists = false;
      // $("#receiving-form-table tbody tr").each(function () {
      //   let code = $(this).data("itemcode");
      //   if (code == itemCode) {
      //     exists = true;
      //     return false; // break loop
      //   }
      // });
      // // OR SIMPLY DISABLE THE SAVE BUTTON
      // if (exists) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Item already assigned to the branch",
      //     confirmButtonText: "OKAY",
      //   });
      //   return;
      // }
      // $("#summaryTable tbody tr").each(function () {
      //   let branch = $(this).find("td:nth-child(1)").text().trim();
      //   let model = $(this).find("td:nth-child(2)").text().trim();
      //   let quantity = $(this).find("td:nth-child(4)").text().trim();
      //   if (!quantity || quantity === "0") return;
      //   rowCount++;
      //   let $emptyRow = $(
      //     "#receiving-form-table tbody tr.empty-row",
      //   ).first();

      //   let newRow = $(`
      //               <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px; cursor: pointer">
      //                 <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
      //                 <td style="background:#FFFBDF" class="text-primary"></td>
      //                 <td style="background:#FFFBDF">${branchName}</td>
      //                 <td style="background:#FFFBDF">${brand}</td>
      //                 <td style="background:#FFFBDF" class="text-start">${model}</td>
      //                 <td style="background:#FFFBDF" class="text-start">${category}</td>
      //                 <td style="background:#FFFBDF" class="text-center">${quantity}</td>
      //                 <td style="background:#FFFBDF" class="d-none">${itemCode}</td>
      //               </tr>
      //             `);
      //   if ($emptyRow.length) {
      //     $emptyRow.replaceWith(newRow);
      //   } else {
      // $("#receiving-form-table tbody").append(rows);
      // $receivingTbody.append(rows);

      let $rows = $receivingTbody.find("tr");

      // filter non-empty rows
      let $nonEmptyRows = $rows.filter(function () {
        return (
          $(this)
            .find("td")
            .filter(function () {
              return $(this).text().trim() !== "";
            }).length > 0
        );
      });

      // insert after last non-empty row
      if ($nonEmptyRows.length > 0) {
        $nonEmptyRows.last().after(rows);
      } else {
        // fallback if somehow all rows are empty
        $receivingTbody.prepend(rows);
      }
      //   }
      //   newRow.hover(
      //     function () {
      //       $(this).css("background", "#FFF4C2");
      //     },
      //     function () {
      //       $(this).css("background", "#FFFBDF");
      //     },
      //   );
      // });
      // }
      //         //     }
      //         //     $("#summaryQty").text(totalQty);
      //         //   },
      //         // );
      //       });

      // $("#newItemCode").val("");
      $("#newQuantity").val("");
      $("#newBrand").val("");
      $("#newModel").val("");
      $("#newCategory").val("").prop("disabled", true);
      $("#addDeliveryModal").modal("hide");
      //       $("#summaryQty").text(existingTotal + quantity);
      //     } else {
      //       Swal.fire({
      //         icon: "error",
      //         title: response.isSuccess,
      //       });
      //     }
      //   },
      // });
    });
}

// FOR RECEIVING ITEM
function serialDeliveryInput(
  lbNum,
  PicklistDr,
  previousSerials,
  allowedItemCodes,
) {
  $("#serial-delivery").on("submit", function (e) {
    e.preventDefault();
    console.log(`SERIAL INPUT ALLOWED ITEMCODES: ${allowedItemCodes}`);
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
          lbNum: lbNum,
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
            let $summaryDeliveryTbody = $("#summaryDeliveryTable tbody");

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

              // if (!allowedItemCodes.includes(itemCode)) {
              //   Swal.fire({
              //     icon: "error",
              //     title: "Invalid Item",
              //     text: "This item does not belong to the selected loading basket.",
              //   });
              //   return;
              // }

              if (!brand || !model || !category || !itemCode) {
                console.warn("Skipped item due to null/empty value:", item);
                return;
              }
              totalQty += qty;

              let $existingRow = $summaryTbody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );
              let $existingSummaryQty = $summaryDeliveryTbody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );
              console.log(`SERIALIZE BATCH NUMBER: ${lbNum}`);
              loadPicklistBranches(
                lbNum,
                model,
                category,
                function (length, branchName) {
                  console.log(`BRANCH NAMES : ${branchName}`);
                  if (length > 1) {
                    console.log(`BRANCHES LENGTH: ${length}`);
                    rows += `
                        <tr style="height: 40px; min-height: 40px;" data-serial="${latestInput}">
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
                        </tr>`;
                    if ($existingRow.length) {
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow.find("td:nth-child(4)").text(currentQty + 1);

                      // ✅ Update data attributes if needed
                      $existingRow.attr("data-serial", latestInput);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      // ✅ CREATE NEW ROW
                      let newRow = `
                        <tr data-itemcode="${itemCode}" data-serialbased="true" data-serial="${latestInput}" data-lbnum="${lbNum}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
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
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow.find("td:nth-child(4)").text(currentQty + 1);
                      $existingSummaryQty
                        .find("td:nth-child(7)")
                        .text(currentQty + 1);

                      // $existingRow.find("td:nth-child(5)").html(`
                      //     <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">
                      //         Assigned
                      //     </span>
                      // `);

                      // ✅ Update data attributes if needed
                      $existingRow.attr("data-serial", latestInput);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      // ✅ CREATE NEW ROW
                      let newRow = `
                          <tr data-itemcode="${itemCode}" data-serial="${latestInput}" data-lbnum="${lbNum}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                            <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                            <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                            <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
                            <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
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
                        let qty = $(this).find("td:nth-child(4)").text().trim();
                        if (!qty || qty === "0") return;
                        rowCount++;
                        let $emptyRow = $(
                          "#summaryDeliveryTable tbody tr.empty-row",
                        ).first();

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
          });
        },
        // complete: function () {
        //   $("#nonSerializeBtn").prop("disabled", false);
        // },
      });
    }
    serialInput.val("");
    serialInput.focus();
  });
}

function addNonSerialize(ItemSerial, lbNum, picklistDr, allowedItemCodes) {
  console.log(`NONSERIALIZE ALLOWED ITEM CODES: ${allowedItemCodes}`);
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
            // let items = response.Data[0];
            let items = response.Data;

            if (response.Data.length === 0) {
              Swal.fire({
                icon: "error",
                title: "Unavailable stock(s) for this model",
                text: "Please try other item",
                confirmButtonText: "OKAY",
              });
              return;
            }

            let rows = [];
            let existingTotal = parseInt($("#summaryQty").text()) || 0;
            let totalQty = existingTotal;
            let $summaryTbody = $("#summaryTable tbody");
            let $summaryDeliveryTbody = $("#summaryDeliveryTable tbody");

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
              // let qty = item.qty;

              // if (!allowedItemCodes.includes(itemCode)) {
              //   Swal.fire({
              //     icon: "error",
              //     title: "Invalid Item",
              //     text: "This item does not belong to this picklist.",
              //   });
              //   return;
              // }

              if (!brand || !model || !category || !itemCode) {
                console.warn("Skipped item due to null/empty value:", item);
                return;
              }
              // totalQty += qty;
              totalQty += quantity;

              let $existingRow = $summaryTbody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );
              let $existingSummaryQty = $summaryDeliveryTbody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );
              loadPicklistBranches(
                lbNum,
                model,
                category,
                function (length, branchName) {
                  if (length > 1) {
                    rows += `
                        <tr style="height: 40px; min-height: 40px; cursor: pointer">
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
                        </tr>`;
                    if ($existingRow.length) {
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow
                        .find("td:nth-child(4)")
                        .text(currentQty + quantity);

                      $existingRow.find("td:nth-child(5)").html(`
                          <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
                      `);

                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      let newRow = `
                        <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                          <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
                          <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
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
                    <tr style="height: 40px; min-height: 40px; cursor: pointer">
                      <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
                    </tr>`;
                    if ($existingRow.length) {
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow
                        .find("td:nth-child(4)")
                        .text(currentQty + quantity);
                      $existingSummaryQty
                        .find("td:nth-child(7)")
                        .text(currentQty + quantity);

                      $existingRow.find("td:nth-child(5)").html(`
                      <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">
                          Assigned
                      </span>
                  `);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      let newRow = `
                      <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                        <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                        <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                        <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${category}</td>
                        <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${quantity}</td>
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
                        let quantity = $(this)
                          .find("td:nth-child(4)")
                          .text()
                          .trim();
                        if (!quantity || quantity === "0") return;
                        rowCount++;
                        let $emptyRow = $(
                          "#summaryDeliveryTable tbody tr.empty-row",
                        ).first();

                        let newRow = $(`
                          <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px; cursor: pointer">
                            <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
                            <td style="background:#FFFBDF" class="text-primary"></td>
                            <td style="background:#FFFBDF">${branchName}</td>
                            <td style="background:#FFFBDF">${brand}</td>
                            <td style="background:#FFFBDF" class="text-start">${model}</td>
                            <td style="background:#FFFBDF" class="text-start">${category}</td>
                            <td style="background:#FFFBDF" class="text-center">${quantity}</td>
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

function submitReceiving() {
  console.log(`RECEIVING FORM SUBMITTED`)
}
