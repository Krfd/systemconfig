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
    $("#receiving_content").html(data);
    loadReceiving();
  });
}

function returnReceiving() {
  $.post("dirs/receiving/dashboard/received.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

$(document).on("dblclick", "#receivingTable tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let rcvdNumber = $(this).data("rcvdnumber");
  openReceivedForm(rcvdNumber);
});

function loadReceiving() {
  $.ajax({
    url: "dirs/receiving/dashboard/actions/get_received.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let data = response.Data;
      let rows = [];
      let counter = 1;
      if (response.isSuccess === "success") {
        data.forEach(function (item) {
          const date = new Date(item.ArrivalDate);
          const arrivalDate = date.toISOString().split("T")[0];
          const timestamp = new Date().toLocaleString();

          const formattedTimestamp =
            `${String(new Date(arrivalDate).getMonth() + 1).padStart(2, "0")}-` +
            `${String(new Date(arrivalDate).getDate()).padStart(2, "0")}-` +
            `${String(new Date(arrivalDate).getFullYear()).slice(-2)} ` +
            `${new Date(timestamp).toLocaleTimeString()}`;

          rows.push([
            counter++,
            item.ReceivedNumber,
            formattedTimestamp,
            item.OriginBranch,
            (() => {
              let status = item.ReceivedStatus;
              let bgClass = "";
              if (status === "RECEIVED") {
                bgClass = "bg-success";
              } else if (status === "PARTIAL") {
                bgClass = "bg-warning";
              } else if (status === "TERMINATED") {
                bgClass = "bg-secondary";
              }
              return `<span class="badge ${bgClass}">${status}</span>`;
            })(),
          ]);
        });

        if (rows.length < 8) {
          for (let i = rows.length; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#receivingTable")) {
          $("#receivingTable").DataTable().clear().destroy();
        }

        $("#receivingTable").DataTable({
          data: rows,
          columns: [
            { title: "#", className: "text-center" },
            { title: "RR No." },
            { title: "Arrival Date", className: "text-start ps-3" },
            { title: "Stock Origin", className: "ps-3" },
            {
              title: "Status",
              className: "ps-3",
            },
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
            // let receivedNumber = data[0];
            let receivedNumber = null;

            if (
              data &&
              Array.isArray(data) &&
              data.length > 0 &&
              data[0] !== null &&
              data[0] !== undefined &&
              data[0] !== ""
            ) {
              receivedNumber = data[1];
            }
            // console.log(`RECEIVED NUMBER: ${receivedNumber}`);
            $(row).data("rcvdnumber", receivedNumber);
            $("td:eq(1)", row).addClass("text-primary ps-2");

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
            let tableBody = $("#receivingTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let emptyRow = $(`
                    <tr class="empty-row">
                      <td colspan="5" style="background: #FFFBDF">&nbsp;</td>
                    </tr>
                  `);

              emptyRow.css({
                background: "#FFFBDF",
                height: "40px",
                "min-height": "40px",
              });

              emptyRow.hover(function () {
                $(this).css("background", "#FFFBDF");
              });

              tableBody.append(emptyRow);
            }
          },
        });
      }
      //  else {
      //   console.error(response.Data);
      // }
    },
    error: function (xhr, status, error) {
      console.error("Error loading receiving data: ", error);
    },
  });
}

function receivingForm() {
  $("#main-content").html(spinner);
  (setTimeout(function () {
    $.post("dirs/receiving/dashboard/receivingForm.php", {}, function (data) {
      $("#main-content").html(data);

      userDetails();
      toggleReceivingButtons(false);
      fetchOrderDetails();
      // receiveItem();
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

function formatDateMMDDYY(dateString) {
  const date = new Date(dateString);

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  return `${mm}-${dd}-${yy}`;
}

function openReceivedForm(rcvdNumber) {
  $("#main-content").html(spinner);
  $.post("dirs/receiving/dashboard/receivedForm.php", function (data) {
    $("#main-content").html(data);
    $.ajax({
      url: "dirs/receiving/dashboard/actions/get_receivedForm.php",
      type: "POST",
      data: { rcvdNumber: rcvdNumber },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let header = response.Header;
          let items = response.Items;
          let rowCount = response.Items.length;
          let totalQty = 0;

          $("#rcvdNumber").text(rcvdNumber);
          $("#drNoRecForm").val(header.ReferenceNumber);
          $("#refNoRecForm").val(items[0].ReferenceNumber);
          $("#stockReqNoRecForm").val(items[0].SRNumber);
          $("#originRecForm").val(header.OriginBranch);
          $("#origRecForm").val(header.OriginWhscode);

          const docDate = header.SysTimeStamp
            ? formatDateMMDDYY(header.SysTimeStamp)
            : "";
          $("#docDateRecForm").val(docDate);
          const postDate = header.PostingDate
            ? formatDateMMDDYY(header.PostingDate)
            : "";

          $("#postDate").val(postDate);
          // console.log(`DATES FORMATTED`);

          // const docDate = header.SysTimeStamp
          //   ? new Date(header.SysTimeStamp)
          //       .toLocaleDateString("en-US", {
          //         month: "2-digit",
          //         day: "2-digit",
          //         year: "2-digit",
          //       })
          //       .replace(/\//g, "-")
          //   : "";

          // $("#docDateRecForm").val(docDate);
          // const postDate = header.PostingDate
          //   ? new Date(header.PostingDate)
          //       .toLocaleDateString("en-US", {
          //         month: "2-digit",
          //         day: "2-digit",
          //         year: "2-digit",
          //       })
          //       .replace(/\//g, "-")
          //   : "";

          // $("#postDate").val(postDate);
          $("#statusRecForm").val(header.ReceivedStatus);

          $("#receiveByRecForm").val(header.ReceivedBy);
          $("#driverRecForm").val(header.Driver);
          $("#truckCat").val(header.TruckCategory);
          $("#plateRecForm").val(header.TruckPlate);
          $("#remarksRecForm").val(header.Remarks);

          let rows = "";
          items.forEach(function (item, index) {
            let qty = parseFloat(item.Recvd_ItemQty) || 0;
            totalQty += qty;

            // console.log(`ITEM TYPE: ${item.ItemType}`);
            let itemType = item.ItemType;
            if (itemType === "S") {
              itemType = '<span class="badge bg-success">Serialize</span>';
            } else {
              itemType = '<span class="badge bg-danger">Non-serialize</span>';
            }

            rows += `
              <tr>
                <td style="background:#FFFBDF" class="text-center">${index + 1}</td>
                <td style="background:#FFFBDF">${item.ItemBrand}</td>
                <td style="background:#FFFBDF">${item.ItemModel}</td>
                <td style="background:#FFFBDF">${item.ItemCategory}</td>
                <td style="background:#FFFBDF">${Number(item.Recvd_ItemQty).toFixed(0)}</td>
                <td style="background:#FFFBDF">${itemType}</td>
              </tr>
            `;
          });

          $("#totalReceivingQty").text(totalQty);
          $("#receiving-form-table tbody").html(rows);

          if (rowCount < 8) {
            let emptyRows = 8 - rowCount;

            for (let i = 0; i < emptyRows; i++) {
              let emptyRow = `
              <tr class="item-row empty-row" style="height: 50px; min-height: 50px;">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
              </tr>
              `;
              $("#receiving-form-table tbody").append(emptyRow);
            }
            $("#totalReceivingQty").text(totalQty);
          }
        } else {
          console.warn(`NO DATA FOR THIS RECEIVING FORM`);
        }
      },
      error: function (xhr) {
        console.error(xhr.responseText);
      },
    });
  });
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

function userDetails() {
  $.ajax({
    url: "dirs/receiving/dashboard/actions/get_userDetails.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.isSuccess) {
        $("#receiveByRecForm").val(response.Data.Fullname);
      }
    },
  });
}

function fetchOrderDetails() {
  $(".search-order-field").on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      let value = $(this).val().trim();
      let field = $(this).data("field");

      if (!field) {
        toggleReceivingButtons(false);
        Swal.fire({
          icon: "warning",
          title: "Please enter DR No.",
        });
        return;
      }
      toggleReceivingButtons(false);

      $.ajax({
        url: "dirs/receiving/dashboard/actions/get_reviewdeliveryitems.php",
        type: "POST",
        data: {
          searchType: field,
          searchValue: value,
        },
        dataType: "json",
        beforeSend: function () {
          $("#submitRecBtn").prop("disabled", true);
          $("#receivingLoader").removeClass("d-none");
        },
        success: function (response) {
          let header = response.Header;
          let items = response.Items;
          // console.log(`RESPONSE : ${JSON.stringify(header)}`);
          // console.log(``);
          // console.log(`ITEMS : ${JSON.stringify(items)}`);

          if (response.Header?.Status === "failed") {
            Swal.fire({
              icon: "error",
              title: "Error fetching delivery details.",
            });
            return;
          }

          if (response.isSuccess === "success") {
            if (field !== "deliveryNumber") {
              $("#drNoRecForm").val(header.DeliveryNumber);
            }
            // $("#originRecForm").val(header.OriginBranch);
            $("#originRecForm").val(items[0].OriginBranch);
            if (field === "deliveryNumber") {
              // $("#refNoRecForm").val(header.ReferenceNumber);
              $("#refNoRecForm").val(items[0].ReferenceNumber);
              $("#stockReqNoRecForm").val(items[0].SR_Number);
            } else {
              $("#refNoRecForm").val(items[0].ReferenceNumber);
              $("#stockReqNoRecForm").val(items[0].SR_Number);
            }

            $("#docDateRecForm").val(
              header.DeliveryDate ? formatDateMMDDYY(header.DeliveryDate) : "",
            );
            $("#statusRecForm").val(header.DocStatus);

            $("#driverRecForm").val(header.Driver || "");
            $("#truckCat").val(header.TruckCategory || "");
            $("#plateRecForm").val(header.TruckPlate || "");
            $("#remarksRecForm").val(header.Remarks || "");
            toggleReceivingButtons(true);
          } else {
            toggleReceivingButtons(false);

            let errorMessage = "Invalid input";

            if (field === "deliveryNumber") {
              errorMessage = "Invalid delivery number";
            } else if (field === "referenceNumber") {
              errorMessage = "Invalid reference number";
            } else if (field === "stockReqNumber") {
              errorMessage = "Invalid stock request number";
            }

            Swal.fire({
              icon: "error",
              title: response.message || errorMessage,
            });
            return;
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Error fetching DR data.",
          });
        },
        complete: function () {
          $("#submitRecBtn").prop("disabled", false);
          $("#receivingLoader").addClass("d-none");
        },
      });
      return false;
    }
  });
}

function toggleReceivingButtons(enabled) {
  $("#addSerialModalBtn").prop("disabled", !enabled);
  $("#addDeliveryModalBtn").prop("disabled", !enabled);
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
      let serialRow = [];

      $("#receiving-form-table tbody").empty();
      $("#receiving-serial-table tbody").empty();

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

      for (let j = 0; j < 5; j++) {
        serialRow = `
          <tr style="height: 40px">
            <td style="background: #FFFBDF"></td>
            <td style="background: #FFFBDF"></td>
            <td style="background: #FFFBDF"></td>
          </tr>
        `;
        $("#receiving-serial-table tbody").append(serialRow);
      }

      $("#receivingQty").text("0");
    }
  });
}

function formattedDate() {
  const today = new Date();
  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  // const formattedDate = `${yyyy}-${mm}-${dd}`;
  const formattedDate = `${mm}-${dd}-${yy}`;

  // document.getElementById("docDateRecForm").value = formattedDate;
  document.getElementById("postDate").value = formattedDate;
  console.log(`RECEIVING FORMATTED DATE : ${formattedDate}`);
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
  $(document).on("submit", "#frm-add-delivery", function (e) {
    e.preventDefault();

    let Brand = $("#newBrand").val();
    let Model = $("#newModel").val();
    let Category = $("#newCategory").val();
    let Quantity = parseInt($("#newQuantity").val()) || 1;

    if (Brand && Model) {
      $.ajax({
        url: "dirs/receiving/dashboard/actions/get_nonserialize.php",
        type: "POST",
        data: {
          brand: Brand,
          model: Model,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;
            let rows = [];
            let existingTotal = parseInt($("#receivingQty").text()) || 0;
            let totalQty = existingTotal;
            let receivingBody = $("#receiving-form-table tbody");

            if (!items || items.length === 0) {
              e.stopPropagation();
              e.stopImmediatePropagation();
              Swal.fire({
                icon: "error",
                title: "No item(s) found",
                text: "No record for this item",
                confirmButtonText: "OKAY",
                allowEnterKey: true,
                allowEscapeKey: false,
              });
              return false;
            }

            // console.log(`RECEIVING ITEMS : ${JSON.stringify(items)}`);

            // SECOND VALIDATION HERE (UTILIZE ITEM CODE HERE)
            // $.ajax({
            //   url : "",
            //   type: "POST",
            //   data: {
            //     ItemCode : item.Itemcode
            //   }
            // })

            items.forEach((item) => {
              if (!item.Itemcode) return;
              // if (!receivingGroupedItems[item.Itemcode]) {
              //   receivingGroupedItems[item.Itemcode] = {
              //     ...item,
              //     qty: 0,
              //   };
              // }

              console.log(`ITEM CODE : ${item.Itemcode}`);
              console.log(``);

              // Object.values(receivingGroupedItems).forEach(function (item) {
              let brand = item.ItemBrand;
              let model = item.ItemName;
              let category = item.ItemCategory;
              let itemCode = item.Itemcode;

              if (!brand || !model || !category || !itemCode) {
                console.warn("Skipped item due to null/empty value:", item);
                return;
              }

              let existingRow = receivingBody.find(
                `tr[data-itemcode="${itemCode}"]`,
              );

              if (existingRow.length) {
                let currentQty =
                  parseInt(existingRow.find("td:nth-child(4)").text()) || 0;
                existingRow.find("td:nth-child(5)").text(currentQty + Quantity);
                existingRow.attr("data-itemcode", itemCode);
              } else {
                let counter =
                  receivingBody.find("tr[data-itemcode]").length + 1;

                rows += `
                    <tr data-itemcode="${itemCode}" style="height: 40px; min-height: 40px; cursor: pointer">
                      <td class="align-middle ps-3 text-center" style="background:#FFFBDF">${counter}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${brand}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${model}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${category}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${Quantity}</td>
                    </tr>`;
              }

              totalQty += Quantity;

              let emptyRow = receivingBody
                .find("tr")
                .filter(function () {
                  return (
                    !$(this).attr("data-itemcode") &&
                    $(this).text().trim() === ""
                  );
                })
                .first();
              if (emptyRow.length) {
                emptyRow.replaceWith(rows);
              } else {
                receivingBody.prepend(rows);
              }

              renumberRows();

              if ($.fn.DataTable.isDataTable("#receiving-form-table")) {
                $("#receiving-form-table").DataTable().destroy();
              }

              // $("#newItemCode").val("");
              $("#newQuantity").val("");
              $("#newBrand").val("");
              $("#newModel").val("");
              $("#newCategory").val("").prop("disabled", true);
              $("#addDeliveryModal").modal("hide");
              // });
              $("#receivingQty").text(totalQty);
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
  });
}

// FOR RECEIVING ITEM
function serialDeliveryInput() {
  $(document).on("submit", "#serial-delivery", function (e) {
    e.preventDefault();

    // DISABLE ADD BUTTON
    const serializeBtn = $("#serializeBtn");
    serializeBtn.prop("disabled", true);

    const serialInput = $("#newSerial");
    const DeliveryNumber = $("#drNoRecForm").val();
    const Serial = serialInput.val().trim();
    let lines = Serial.split(/\r?\n/)
      .map((s) => s.replace(/[\u200B\s]+/g, "").trim())
      .filter(Boolean);
    let latestInput = lines[lines.length - 1] || "";
    let ItemCode = "";
    if (Serial) {
      $.ajax({
        url: "dirs/receiving/dashboard/actions/get_receivingitems.php",
        type: "POST",
        data: {
          ItemSerial: Serial,
          DeliveryNumber,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;
            let rows = [];
            let existingTotal = parseInt($("#receivingQty").text()) || 0;
            let totalQty = existingTotal;
            let receivingBody = $("#receiving-form-table tbody");

            const scanId = Date.now();

            items.forEach((item) => {
              if (!item.ItemCode) return;
              if (!receivingGroupedItems[item.ItemCode]) {
                receivingGroupedItems[item.ItemCode] = {
                  ...item,
                  qty: 0,
                };
              }

              receivingGroupedItems[item.ItemCode]._scanId = scanId;

              Object.values(receivingGroupedItems).forEach(function (item) {
                let brand = item.ItemBrand;
                let model = item.ItemName;
                let category = item.ItemCategory;
                let itemCode = item.ItemCode;
                let itemRowNum = item.ItemRowNum;
                let itemDeliveryQty = item.Deliver_Qty;
                let qty = 1;

                if (item._scanId !== scanId) {
                  return;
                }

                console.log(`RECEIVING ITEM: ${JSON.stringify(item)}`);

                if (!brand || !model || !category || !itemCode) {
                  console.warn("Skipped item due to null/empty value:", item);
                  return;
                }
                totalQty += qty;
                let existingRow = receivingBody.find(
                  `tr[data-itemcode="${itemCode}"]`,
                );

                const serial = item.ItemSerial || Serial;

                const tableElement = document.querySelector(
                  "#receiving-serial-table",
                );

                const serialExisted = Array.from(
                  tableElement.querySelectorAll("tbody tr td"),
                ).some((td) => td.textContent.trim() === serial);

                if (!serialExisted) {
                  let serialRow = `
                      <tr style="height: 40px; min-height: 40px; cursor: pointer">
                          <td class="align-middle ps-3" style="background: #FFFBDF">${model}</td>
                          <td class="align-middle ps-3" style="background: #FFFBDF">${itemCode}</td>
                          <td class="align-middle ps-3" style="background: #FFFBDF">${serial}</td>
                      </tr>
                  `;

                  let receivingSerialTable = $("#receiving-serial-table tbody");

                  // find first empty preset row
                  // let emptyRow = receivingSerialTable.find("tr").filter(function () {
                  //     return $(this).find("td").eq(0).text().trim() === "";
                  // }).first();
                  let emptyRow = receivingSerialTable
                    .find("tr")
                    .filter(function () {
                      return $(this).text().trim() === "";
                    })
                    .first();

                  // replace empty row one by one
                  if (emptyRow.length) {
                    emptyRow.replaceWith(serialRow);
                  } else {
                    // no empty rows left
                    receivingSerialTable.prepend(serialRow);
                  }
                }

                if (existingRow.length) {
                  let currentQty =
                    parseInt(existingRow.find("td:nth-child(5)").text()) || 0;
                  existingRow.find("td:nth-child(5)").text(currentQty + 1);
                  existingRow.attr("data-itemcode", itemCode);
                } else {
                  let counter =
                    receivingBody.find("tr[data-itemcode]").length + 1;
                  let newRow = `
                    <tr data-itemcode="${itemCode}" data-rownum="${itemRowNum}" data-serialbased="true" style="height: 40px; min-height: 40px; cursor: pointer">
                      <td class="align-middle ps-3 text-center" style="background: #FFFBDF">${counter}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${brand}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${model}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${category}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF">${qty}</td>
                    </tr>
                  `;

                  // receivingBody.prepend(newRow);
                  // renumberRows();

                  let emptyRow = receivingBody
                    .find("tr")
                    .filter(function () {
                      return (
                        !$(this).attr("data-itemcode") &&
                        $(this).text().trim() === ""
                      );
                    })
                    .first();

                  if (emptyRow.length) {
                    emptyRow.replaceWith(newRow);
                  } else {
                    receivingBody.prepend(newRow);
                  }

                  renumberRows();
                }

                if ($.fn.DataTable.isDataTable("#receiving-form-table")) {
                  $("#receiving-form-table").DataTable().destroy();
                }

                let exists = false;
                $("#receiving-form-table tbody tr").each(function () {
                  let code = $(this).data("itemcode");
                  if (code == itemCode) {
                    exists = true;
                    return false; // break loop
                  }
                });
              });
            });
            $("#serializeBtn").prop("disabled", false);
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
            $("#serializeBtn").prop("disabled", false);
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
          });
          $("#serializeBtn").prop("disabled", false);
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
  $(document)
    .off("submit", "#receivingForm")
    .on("submit", "#receivingForm", function (e) {
      e.preventDefault();

      let formData = {
        DeliveryNumber: $("#drNoRecForm").val(),
        Branchorigin: $('input[name="originRecForm"]').val(),
        BranchWhscode: $('input[name="origRecForm"]').val(),
        ReceivingDate: $("#docDateRecForm").val(),
        PostingDate: $("#postDate").val(),
        Driver: $("#driverRecForm").val(),
        TruckCategory: $("#truckCat").val(),
        TruckPlate: $("#plateRecForm").val(),
        Remarks: $("#remarksRecForm").val(),
        ReceivedQty: $("#receivingQty").text(),
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
          // totalQty: parseInt(row.find("td:eq(5)").text().trim()) || 0,
          serialBased: row.data("serialbased") || false,
          InTransitRowNum: row.data("rownum"),
        };

        formData.items.push(item);
      });

      // VALIDATION
      if (formData.items.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No items found",
          text: "Please add at least one item before submitting.",
        });
        return;
      }

      Swal.fire({
        title: "Submit Receiving?",
        text: "Please confirm before submitting the receiving form.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (!result.isConfirmed) return;
        $.ajax({
          url: "dirs/receiving/dashboard/actions/save_createreceiving.php",
          type: "POST",
          data: {
            receivingData: JSON.stringify(formData),
          },
          dataType: "json",
          beforeSend: function () {
            $("#submitRecBtn")
              .prop("disabled", true)
              .html(
                `<span class="spinner-border spinner-border-sm"></span> Processing`,
              );
          },
          success: function (response) {
            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Items has been received",
              });
              // OPEN PDF
              window.open(
                `pdf/receiving.php?batch=${formData.DeliveryNumber}`,
                "_blank",
              );

              Swal.fire({
                icon: "success",
                title: "Items has been received",
                // text: `Receiving #: ${response.ReceivingNumber || ""}`,
              });
              // .then(() => {
              //   loadDashboard();
              // });
              loadReceiving();
            } else {
              Swal.fire({
                icon: "error",
                title: response.message || "Submission failed",
              });
            }
          },
          error: function () {
            Swal.fire({
              icon: "error",
              title: "Something went wrong",
            });
          },
          complete: function () {
            $("#submitRecBtn").prop("disabled", false).html("Received");
          },
        });
      });
    });
}
