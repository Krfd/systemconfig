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
      ordersReceived();
      formattedDate();
      loadImperialBrands();
      addNonSerialize();
      serialDeliveryInput();

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

        function preventTyping(e) {
          const allowedKeys = [
            "Enter",
            "Tab",
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
          ];

          if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
          }
        }

        function updateKnob() {
          scan.style.transition = "opacity 0.3s ease";
          manual.style.transition = "opacity 0.3s ease";

          if (toggler.checked) {
            // SCAN MODE
            toggler.dataset.value = "Scan";

            knob.style.width = "55px";
            knob.style.transform = "translateX(8px)";

            scan.style.opacity = "1";
            manual.style.opacity = "0";

            scan.style.pointerEvents = "auto";
            manual.style.pointerEvents = "none";

            // console.log("SCAN");

            serialInput.value = "";
            serialInput.focus();

            // Prevent manual typing
            serialInput.addEventListener("keydown", preventTyping);
          } else {
            // MANUAL MODE
            toggler.dataset.value = "Manual";

            knob.style.width = "60px";
            knob.style.transform = "translateX(0px)";

            manual.style.opacity = "1";
            scan.style.opacity = "0";

            manual.style.pointerEvents = "auto";
            scan.style.pointerEvents = "none";

            // console.log("MANUAL");

            serialInput.value = "";
            serialInput.focus();

            // Allow manual typing
            serialInput.removeEventListener("keydown", preventTyping);
          }
        }

        updateKnob();

        toggler.addEventListener("change", updateKnob);
      }

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
        const summaryTable = document.getElementById("receiving-form-table");
        const totalRow = document.getElementById("totalRowOutside");

        if (summaryTable && totalRow) {
          totalRow.style.width = summaryTable.offsetWidth + "px";
        }
      }

      toggler();
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

  // addBtn.addEventListener("click", function () {
  //   if (allowNonserialize) {
  //     newItemModal.show();
  //     return;
  //   }

  //   Swal.fire({
  //     title: "Enter non-serialize items?",
  //     text: "Please confirm before proceeding.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Allow",
  //     cancelButtonText: "Cancel",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       allowNonserialize = true;
  //       newItemModal.show();
  //     }
  //   });
  // });
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

      $("#receiving-form-table tbody").empty();

      for (let i = 0; i < 8; i++) {
        row = `
          <tr>
          <td style="background: #FFFBDF; height: 50px;"></td>
          <td style="background: #FFFBDF; height: 50px;"></td>
          <td style="background: #FFFBDF; height: 50px;"></td>
          <td style="background: #FFFBDF; height: 50px;"></td>
          <td style="background: #FFFBDF; height: 50px;"></td>
          <td style="background: #FFFBDF; height: 50px;"></td>
          <td style="background: #FFFBDF; height: 50px;"></td>
        </tr>
        `;

        $("#receiving-form-table tbody").append(row);
      }
    }
  });
}

function formattedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  document.getElementById("docDateRecForm").value = formattedDate;
  document.getElementById("postDate").value = formattedDate;
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

      // let rows = [];
      // //       let existingTotal = parseInt($("#summaryQty").text()) || 0;
      // //       let totalQty = existingTotal;
      // let $receivingTbody = $("#receiving-form-table tbody");

      // let counter =
      //   $receivingTbody.find("tr").filter(function () {
      //     // check if row has meaningful content (not empty)
      //     return (
      //       $(this)
      //         .find("td")
      //         .filter(function () {
      //           return $(this).text().trim() !== "";
      //         }).length > 0
      //     );
      //   }).length + 1;

      // rows += `
      //   <tr style="height: 40px; min-height: 40px; cursor: pointer">
      //     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${counter}</td>
      //     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Brand}</td>
      //     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Model}</td>
      //     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Category}</td>
      //     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${Quantity}</td>
      //     <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px" contenteditable="true" class="item-qty-received editable-cell" onfocus="this.style.outline='none'; this.style.boxShadow='none';" oninput="validateNumber(this)"></td>
      //   </tr>`;

      // let $rows = $receivingTbody.find("tr");

      // // filter non-empty rows
      // let $nonEmptyRows = $rows.filter(function () {
      //   return (
      //     $(this)
      //       .find("td")
      //       .filter(function () {
      //         return $(this).text().trim() !== "";
      //       }).length > 0
      //   );
      // });

      // // insert after last non-empty row
      // if ($nonEmptyRows.length > 0) {
      //   $nonEmptyRows.last().after(rows);
      // } else {
      //   // fallback if somehow all rows are empty
      //   $receivingTbody.prepend(rows);
      // }

      // // $("#newItemCode").val("");
      // $("#newQuantity").val("");
      // $("#newBrand").val("");
      // $("#newModel").val("");
      // $("#newCategory").val("").prop("disabled", true);
      // $("#addDeliveryModal").modal("hide");
    });
}

// FOR RECEIVING ITEM
function serialDeliveryInput() {
  $(document).on("submit", "#serial-delivery", function (e) {
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
        url: "dirs/receiving/dashboard/actions/get_testscanning.php",
        type: "POST",
        data: {
          ItemSerial: Serial,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;
            let rows = [];
            let existingTotal = parseInt($("#receivingQty").text()) || 0;
            let totalQty = existingTotal;
            let receivingBody = $("#receiving-form-table tbody");
            const groupedItems = {};
            items.forEach((item) => {
              if (!item.Itemcode) return;
              if (!groupedItems[item.Itemcode]) {
                groupedItems[item.Itemcode] = {
                  ...item,
                  qty: 0,
                };
              }
            });
            Object.values(groupedItems).forEach(function (item) {
              let brand = item.ItemBrand;
              let model = item.ItemName;
              let category = item.ItemCategory;
              let itemCode = item.Itemcode;
              let qty = 1;

              if (!brand || !model || !category || !itemCode) {
                console.warn("Skipped item due to null/empty value:", item);
                return;
              }
              totalQty += qty;
              let existingRow = receivingBody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );

              if (existingRow.length) {
                let currentQty =
                  parseInt(existingRow.find("td:nth-child(5)").text()) || 0;
                existingRow.find("td:nth-child(5)").text(currentQty + 1);
                existingRow.attr("data-itemcode", itemCode);
              } else {
                let counter =
                  receivingBody.find("tr[data-itemcode]").length + 1;
                let newRow = `
                    <tr data-itemcode="${itemCode}" data-serialbased="true" style="height: 40px; min-height: 40px; cursor: pointer">
                      <td class="align-middle ps-3 text-center" style="background: #FFFBDF">${counter}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${brand}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${model}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${category}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${qty}</td>
                    </tr>
                  `;

                // <td class="align-middle ps-3" style="background: #FFFBDF" contenteditable="true"></td>

                // let emptyRow = receivingBody.find("tr.empty-row");
                let emptyRow = receivingBody
                  .find("tr:not([data-itemcode])")
                  .first();
                if (emptyRow.length) {
                  emptyRow.replaceWith(newRow);
                } else {
                  // receivingBody.append(newRow);
                  receivingBody.prepend(newRow);
                }
                renumberRows();
              }

              if ($.fn.DataTable.isDataTable("#receiving-form-table")) {
                $("#receiving-form-table").DataTable().clear().destroy();
              }

              let exists = false;
              $("#receiving-form-table tbody tr").each(function () {
                let code = $(this).data("itemcode");
                if (code == itemCode) {
                  exists = true;
                  return false; // break loop
                }
              });

              // }
            });

            // $("#receiving-form-table tbody").html(rows);
            $("#receivingQty").text(totalQty);
          } else if (response.isSuccess === "Failed") {
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
      });
    }
    serialInput.val("");
    serialInput.focus();
  });
}

function renumberRows() {
  $("#receiving-form-table tbody tr[data-itemcode]").each(function (index) {
    $(this)
      .find("td:first")
      .text(index + 1);
  });
}

function submitReceiving() {
  console.log(`ITEMS HAS BEEN RECEIVED`);

  $(document).on("submit", "#receivingForm", function (e) {
    e.preventDefault();

    let formData = {
      drNo: $("#drNoRecForm").val(),
      origin: $('input[name="originRecForm"]').val(),
      whCode: $('input[name="origRecForm"]').val(),
      docDate: $("#docDateRecForm").val(),
      postDate: $("#postDate").val(),
      status: $("#statusRecForm").val(),
      receivedBy: $("#receiveByRecForm").val(),
      driver: $("#driverRecForm").val(),
      truckCategory: $("#truckCat").val(),
      plateNo: $("#plateRecForm").val(),
      remarks: $("#remarksRecForm").val(),
      totalQty: $("#receivingQty").text(),
      items: [],
    };

    // GET TABLE ROWS
    $("#receiving-form-table tbody tr[data-itemcode]").each(function () {
      let row = $(this);

      let item = {
        itemCode: row.data("itemcode"),
        brand: row.find("td:eq(1)").text().trim(),
        model: row.find("td:eq(2)").text().trim(),
        category: row.find("td:eq(3)").text().trim(),
        qty: parseInt(row.find("td:eq(4)").text().trim()) || 0,
        // qtyReceived: parseInt(row.find("td:eq(5)").text().trim()) || 0,
        serialBased: row.data("serialbased") || false,
      };

      formData.items.push(item);
    });

    // VALIDATION
    if (formData.items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No items found",
      });
      return;
    }

    console.log(formData);

    // $.ajax({
    //   url: "dirs/receiving/dashboard/actions/submit_receiving.php",
    //   type: "POST",
    //   data: {
    //     receivingData: JSON.stringify(formData),
    //   },
    //   dataType: "json",
    //   beforeSend: function () {
    //     $("#submitRecBtn")
    //       .prop("disabled", true)
    //       .html(
    //         `<span class="spinner-border spinner-border-sm"></span> Processing`,
    //       );
    //   },
    //   success: function (response) {
    //     if (response.isSuccess === "success") {
    //       Swal.fire({
    //         icon: "success",
    //         title: "Receiving submitted successfully",
    //       });

    //       $("#receivingForm")[0].reset();

    //       // OPTIONAL: CLEAR TABLE
    //       clearTable();
    //     } else {
    //       Swal.fire({
    //         icon: "error",
    //         title: response.message || "Submission failed",
    //       });
    //     }
    //   },
    //   error: function () {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Something went wrong",
    //     });
    //   },
    //   complete: function () {
    //     $("#submitRecBtn").prop("disabled", false).html("Received");
    //   },
    // });
  });
}
