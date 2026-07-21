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
  $("#receiving_content").html(spinner);
  $.post("dirs/receiving/dashboard/components/main.php", {}, function (data) {
    $("#receiving_content").hide().html(data).fadeIn(200);
    $("#receivingTable tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadReceiving();
  });
}

// function loadDashboard() {
//   $("#receiving_content").html(spinner);

//   $.post("dirs/receiving/dashboard/components/main.php", {}, function (data) {
//     $("#receiving_content")
//       .hide()
//       .html(data)
//       .fadeIn(200, function () {
//         requestAnimationFrame(() => {
//           TableManager.loadReceiving();
//         });

//         // $("#receiving_content").html(data);
//         //
//         // requestAnimationFrame(() => {
//         //   requestAnimationFrame(() => {
//         //     TableManager.loadReceiving();
//         //   });
//         // });

//         $("#received-tab")
//           .off("shown.bs.tab")
//           .on("shown.bs.tab", function () {
//             setTimeout(() => {
//               if ($.fn.DataTable.isDataTable("#receivingTable")) {
//                 $("#receivingTable").DataTable().columns.adjust().draw();
//               }
//             }, 100);
//           });

//         $("#drafts-tab")
//           .off("shown.bs.tab")
//           .on("shown.bs.tab", function () {
//             setTimeout(() => {
//               if ($.fn.DataTable.isDataTable("#draftsTable")) {
//                 $("#draftsTable").DataTable().columns.adjust().draw();
//               }
//             }, 100);
//           });
//       });
//   });
// }

function returnReceiving() {
  $("#receiving_content").html(spinner);
  $.post("dirs/receiving/dashboard/received.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
  });
}

$(document).on("dblclick", "#receivingTable tbody tr", function (e) {
  let rcvdNumber = $(this).data("rcvdnumber");

  if (!rcvdNumber) {
    return;
  }

  openReceivedForm(rcvdNumber);
});

// window.TableManager =
//   window.TableManager ||
//   (function () {
//     const loadedTables = {};

//     function loadTable({
//       tableId,
//       url,
//       transform,
//       columns,
//       rowCallback,
//       drawCallback,
//     }) {
//       // if (!$(tableId).length) {
//       //   console.warn("Table not found:", tableId);
//       //   return;
//       // }
//       if ($.fn.DataTable.isDataTable(tableId)) {
//         console.warn("Already initialized:", tableId);
//         return;
//       }
//       $.ajax({
//         url,
//         type: "POST",
//         dataType: "json",

//         success(response) {
//           if (
//             !response ||
//             response.isSuccess !== "success" ||
//             !Array.isArray(response.Data)
//           ) {
//             response = { isSuccess: "success", Data: [] };
//           }

//           const rows = transform(response.Data);

//           // destroy if exists
//           // if ($.fn.DataTable.isDataTable(tableId)) {
//           //   $(tableId).DataTable().clear().destroy();
//           // }

//           // if (!$(tableId).length) {
//           //   console.warn("Table not found:", tableId);
//           //   return;
//           // }

//           // $(tableId).find("tbody").empty();

//           $(tableId).DataTable({
//             data: rows,
//             columns,
//             rowCallback,
//             drawCallback,
//             paging: true,
//             searching: true,
//             info: true,
//             autoWidth: false,
//             processing: false,
//           });

//           // const $table = $(tableId);

//           // // console.log(`TABLE ID: ${tableId}`);

//           // if (!$table.closest("body").length) {
//           //   console.warn("Table not attached to DOM yet");
//           //   return;
//           // }

//           // const dt = $table.DataTable({
//           //   data: rows,
//           //   columns,
//           //   rowCallback,
//           //   drawCallback,
//           //   paging: true,
//           //   searching: true,
//           //   info: true,
//           //   autoWidth: false,
//           //   destroy: true,
//           // });

//           // setTimeout(() => {
//           //   dt.columns.adjust().draw();
//           // }, 100);

//           // console.log(`UPDATED RECEIVING`);

//           if (tableId === "#receivingTable") {
//             loadedTables.receiving = true;
//           }

//           if (tableId === "#draftsTable") {
//             loadedTables.drafts = true;
//           }
//         },

//         error(err) {
//           console.error("Table load error:", err);
//         },
//       });
//       // loadedTables.receiving = true;
//     }

//     return {
//       loadReceiving() {
//         // if (loadedTables.receiving) return;

//         loadTable({
//           tableId: "#receivingTable",
//           url: "dirs/receiving/dashboard/actions/get_received.php",
//           transform(data) {
//             console.log(`RECEIVED DATA: ${JSON.stringify(data)}`);

//             return data.map((item, i) => {
//               const date = new Date(item.ArrivalDate);

//               const formattedTimestamp =
//                 `${String(date.getMonth() + 1).padStart(2, "0")}-` +
//                 `${String(date.getDate()).padStart(2, "0")}-` +
//                 `${String(date.getFullYear()).slice(-2)} ` +
//                 `${new Date().toLocaleTimeString()}`;

//               return [
//                 i + 1,
//                 item.ReceivedNumber,
//                 formattedTimestamp,
//                 item.OriginBranch,
//                 `<span class="badge bg-${
//                   item.ReceivedStatus === "RECEIVED"
//                     ? "success"
//                     : item.ReceivedStatus === "PARTIAL"
//                       ? "warning"
//                       : "secondary"
//                 }">${item.ReceivedStatus}</span>`,
//               ];
//             });
//           },

//           columns: [
//             { title: "#", className: "text-center" },
//             { title: "RR No." },
//             { title: "Arrival Date" },
//             { title: "Stock Origin" },
//             { title: "Status" },
//           ],
//         });

//         loadedTables.receiving = true;
//       },

//       loadDrafts() {
//         if (loadedTables.drafts) return;

//         loadTable({
//           tableId: "#draftsTable",
//           url: "dirs/receiving/dashboard/actions/get_drafts.php",

//           transform(data) {
//             console.log(`RAW: ${JSON.stringify(data)}`);
//             // return data.map((item, i) => [
//             //   i + 1,
//             //   item.ReferenceNumber,
//             //   item.StockOrigin,
//             //   item.ReceivedBranch,
//             //   `<div class="dropdown">
//             //     <button class="btn btn-sm btn-light"
//             //             data-bs-toggle="dropdown">
//             //         <i class="bi bi-three-dots"></i>
//             //     </button>

//             //     <ul class="dropdown-menu">
//             //         <li>
//             //             <a class="dropdown-item open-draft"
//             //                 data-ref="${item.ReferenceNumber}">
//             //                 Open
//             //             </a>
//             //         </li>
//             //     </ul>
//             //   </div>`,
//             // ]);

//             const rows = data.map((item, i) => [
//               i + 1,
//               item.ReferenceNumber,
//               item.OriginBranch,
//               item.ReceivedBranch,
//               `<div class="dropdown">
//                 <button class="btn btn-sm btn-light"
//                         data-bs-toggle="dropdown">
//                     <i class="bi bi-three-dots"></i>
//                 </button>

//                 <ul class="dropdown-menu">
//                     <li>
//                         <a class="dropdown-item open-draft"
//                             data-ref="${item.ReferenceNumber}">
//                             Open
//                         </a>
//                     </li>
//                 </ul>
//               </div>`,
//             ]);

//             console.log("ROWS", rows);

//             return rows;
//           },

//           columns: [
//             // { title: "#", className: "text-center" },
//             { title: "#" },
//             { title: "Reference No." },
//             { title: "Stock Origin" },
//             { title: "Destination" },
//             { title: "" },
//           ],
//         });

//         // loadedTables.drafts = true;
//       },

//       // reload(tableName) {
//       //   loadedTables[tableName] = false;

//       //   if (tableName === "receiving") this.loadReceivingTable();
//       //   if (tableName === "drafts") this.loadDraftsTable();
//       // },
//       reload(tableName) {
//         loadedTables[tableName] = false;

//         if (tableName === "receiving") this.loadReceiving();

//         if (tableName === "drafts") this.loadDrafts();
//       },
//     };
//   })();

// $.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
//   return this.api()
//     .column(col, { order: "index" })
//     .nodes()
//     .map(function (td) {
//       if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
//       return $(td).text();
//     });
// };

// ORIGINAL
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
            `${String(new Date(arrivalDate).getMonth() + 1).padStart(2, "0")}/` +
            `${String(new Date(arrivalDate).getDate()).padStart(2, "0")}/` +
            `${String(new Date(arrivalDate).getFullYear())} ` +
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

        // if (rows.length < 8) {
        if (rows.length === 0) {
          for (let i = rows.length; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#receivingTable")) {
          $("#receivingTable").DataTable().clear().destroy();
          $("#receivingTable tbody").empty();
        }

        // console.log(`UPDATED RECEIVING SCRIPT`)

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
            if ($(row).hasClass("empty-row")) return;
            $("td:not(.empty-row)", row).css({
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
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
            $(row).data("rcvdnumber", receivedNumber);
            $("td:eq(0)", row).addClass("text-center");
            $("td:eq(1)", row).addClass("text-primary ps-2");

            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#fcf7d4");
              },
            );
          },
          drawCallback: function () {
            let tableBody = $("#receivingTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="5" style="background: #fcf7d4">&nbsp;</td>
                </tr>
              `);

              emptyRow.css({
                background: "#fcf7d4",
                height: "40px",
                "min-height": "40px",
              });

              emptyRow.hover(function () {
                $(this).css("background", "#fcf7d4");
              });

              tableBody.append(emptyRow);
            }
          },
        });
        // console.log($("#receivingTable").DataTable().rows().count());
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading receiving data: ", error);
    },
  });
}

function receivingForm(reference = null) {
  // $("#main-content").html(spinner);
  $.post("dirs/receiving/dashboard/receivingForm.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    // $("#receiving-serial-table tbody").empty();
    // console.log(`SERIAL TABLE IS EMPTY`)
    userDetails();
    toggleReceivingButtons(false);
    // fetchOrderDetails();
    if (reference !== null) {
      fetchOrderDetails(reference);
    } else {
      fetchOrderDetails();
    }
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

          serialInput.value = "";
          serialInput.focus();

          serialInput.addEventListener("keydown", preventTyping);
        } else {
          toggler.dataset.value = "Manual";

          knob.style.width = "60px";
          knob.style.transform = "translateX(0px)";

          manual.style.opacity = "1";
          scan.style.opacity = "0";

          manual.style.pointerEvents = "auto";
          scan.style.pointerEvents = "none";

          serialInput.value = "";
          serialInput.focus();
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

    // // Load draft only when a reference is provided
    // if (reference !== null) {
    //   loadDraft(reference);
    // }
  });
}

function autoSaveDraft() {
  const formData = buildReceivingData();
  // console.log(`FORM DATA : ${JSON.stringify(formData)}`);

  let draftBtn = $("#submitDraftRecBtn");
  let submitBtn = $("#submitRecBtn");

  return $.ajax({
    url: "dirs/receiving/dashboard/actions/save_draft.php",
    type: "POST",
    data: {
      receivingData: JSON.stringify(formData),
    },
    dataType: "json",
    beforeSend: function () {
      draftBtn
        .prop("disabled", true)
        .html(
          `<span class="spinner-border spinner-border-sm"></span> Processing`,
        );
      submitBtn.prop("disabled", true);
    },
    success: function (response) {
      draftBtn.prop("disabled", false).html("Save as Draft");
      submitBtn.prop("disabled", false);

      // console.log(`DRAFT VALIDATION: ${response.message}`)
      if (response.isSuccess === "success") {
        Swal.fire({
          icon: "success",
          title: "Items has been saved as draft",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response.message || "Submission failed",
        });
      }
    },
    error: function () {
      draftBtn.prop("disabled", false).html("Save as Draft");
      submitBtn.prop("disabled", false);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    },
  });
}

function buildReceivingData() {
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

  $("#receiving-form-table tbody tr[data-itemcode]").each(function () {
    let row = $(this);

    let serials = (row.attr("data-serials") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (
      (row.data("serialbased") === true ||
        row.data("serialbased") === "true") &&
      serials.length > 0
    ) {
      serials.forEach((serial) => {
        formData.items.push({
          itemCode: row.data("itemcode"),
          brand: row.find("td:eq(1)").text().trim(),
          model: row.find("td:eq(2)").text().trim(),
          category: row.find("td:eq(3)").text().trim(),
          qty: 1,
          serialBased: true,
          InTransitRowNum: row.data("rownum"),
          serial: serial,
        });
      });
    } else {
      formData.items.push({
        itemCode: row.data("itemcode"),
        brand: row.find("td:eq(1)").text().trim(),
        model: row.find("td:eq(2)").text().trim(),
        category: row.find("td:eq(3)").text().trim(),
        qty: parseInt(row.find("td:eq(4)").text().trim()) || 0,
        serialBased: false,
        InTransitRowNum: row.data("rownum"),
        serial: null,
      });
    }
  });

  return formData;
}

function formatDateMMDDYY(dateString) {
  const date = new Date(dateString);

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}-${dd}-${yyyy}`;
}

function openReceivedForm(rcvdNumber) {
  $("#rcvdNumber").html(rcvdNumber);
  $("#main-content").html(spinner);
  receivingGroupedItems = {};
  $.post("dirs/receiving/dashboard/receivedForm.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $("#receiving-form-table tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    $.ajax({
      url: "dirs/receiving/dashboard/actions/get_receivedForm.php",
      type: "POST",
      data: { rcvdNumber: rcvdNumber },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let header = response.Header;
          let reference = response.Reference;
          let items = response.Items;
          let rowCount = response.Items.length;
          let totalQty = 0;
          let counter = 1;

          $("#rcvdNumber").text(rcvdNumber);
          $("#drNoRecForm").val(header.ReferenceNumber);
          $("#refNoRecForm").val(reference.ReferenceNumber);
          $("#stockReqNoRecForm").val(reference.SRNumber);
          $("#originRecForm").val(header.OriginBranch);
          $("#origRecForm").val(header.OriginWhscode);

          const docDate = header.SysTimeStamp
            ? formatDateMMDDYY(header.SysTimeStamp).replace(/-/g, "/")
            : "";

          $("#docDateRecForm").val(docDate);

          const postDate = header.PostingDate
            ? formatDateMMDDYY(header.PostingDate).replace(/-/g, "/")
            : "";

          $("#postDate").val(postDate);
          $("#statusRecForm").val(header.ReceivedStatus);

          $("#receiveByRecForm").val(header.ReceivedBy);
          $("#driverRecForm").val(header.Driver);
          $("#truckCat").val(header.TruckCategory);
          $("#plateRecForm").val(header.TruckPlate);
          $("#remarksRecForm").val(header.Remarks);

          items.forEach(function (item, index) {
            let key = `${item.ItemBrand}|${item.ItemModel}`;
            if (!receivingGroupedItems[key]) {
              receivingGroupedItems[key] = {
                ItemBrand: item.ItemBrand,
                ItemModel: item.ItemModel,
                ItemCategory: item.ItemCategory,
                ReceivedQty: 0,
                ItemCode: item.ItemCode,
                ItemType: item.ItemType,
              };
            }
            receivingGroupedItems[key].ReceivedQty +=
              parseFloat(item.Recvd_ItemQty) || 0;
          });

          let rows = "";

          Object.values(receivingGroupedItems).forEach(function (item, index) {
            totalQty += item.ReceivedQty;

            let itemType = item.ItemType;
            if (itemType === "S") {
              itemType = '<span class="badge bg-success">Serialize</span>';
            } else {
              itemType = '<span class="badge bg-danger">Non-serialize</span>';
            }

            console.log(`RECEIVED ITEM: ${JSON.stringify(item)}`)

            rows += `
              <tr>
                <td style="background: #fcf7d4" class="text-center">${index + 1}</td>
                <td style="background: #fcf7d4">${item.ItemBrand}</td>
                <td style="background: #fcf7d4">${item.ItemModel}</td>
                <td style="background: #fcf7d4">${item.ItemCategory}</td>
                <td style="background: #fcf7d4" class="text-center">${Number(item.ReceivedQty).toFixed(0)}</td>
                <td style="background: #fcf7d4">${itemType}</td>
              </tr>
            `;
          });
          $("#totalReceivingQty").text(totalQty);
          $("#receiving-form-table tbody").html(rows);

          let receivedTable = $("#receiving-form-table tbody tr").length;
          if (receivedTable < 8) {
            let emptyRows = 8 - receivedTable;
            for (let i = 0; i < emptyRows; i++) {
              let emptyRow = `
                <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                  <td style="background: #fcf7d4"></td>
                  <td style="background: #fcf7d4"></td>
                  <td style="background: #fcf7d4"></td>
                  <td style="background: #fcf7d4"></td>
                  <td style="background: #fcf7d4"></td>
                  <td style="background: #fcf7d4"></td>
                </tr>
              `;
              $("#receiving-form-table tbody").append(emptyRow);
            }
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
  if (value !== "") {
    $(el).removeClass("border border-danger");
  }

  if (!/^\d*$/.test(value)) {
    $(el).text(value.replace(/\D/g, ""));

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

function fetchOrderDetails(reference = null) {
  if (reference !== null) {
    getOrderDetails("referenceNumber", reference);
    getOrders(reference);
  }

  // $(".search-order-field").on("keydown", function (e) {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     let value = $(this).val().trim();
  //     let field = $(this).data("field");

  //     if (!field) {
  //       toggleReceivingButtons(false);
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Please enter DR No.",
  //       });
  //       return;
  //     }
  //     toggleReceivingButtons(false);

  //     $.ajax({
  //       url: "dirs/receiving/dashboard/actions/get_reviewdeliveryitems.php",
  //       type: "POST",
  //       data: {
  //         searchType: field,
  //         searchValue: value,
  //       },
  //       dataType: "json",
  //       beforeSend: function () {
  //         $("#submitRecBtn").prop("disabled", true);
  //         $("#receivingLoader").removeClass("d-none");
  //       },
  //       success: function (response) {
  //         let header = response.Header;
  //         let items = response.Items;
  //         currentOrder.requests = response.Requests;

  //         if (response.Header?.Status === "failed") {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Error fetching delivery details.",
  //           });
  //           return;
  //         }

  //         if (response.isSuccess === "success") {
  //           if (field !== "deliveryNumber") {
  //             $("#drNoRecForm").val(header.DeliveryNumber);
  //           }
  //           $("#originRecForm").val(items[0].OriginBranch);
  //           if (field === "deliveryNumber") {
  //             $("#refNoRecForm").val(items[0].ReferenceNumber);
  //             $("#stockReqNoRecForm").val(items[0].SR_Number);
  //           } else {
  //             $("#refNoRecForm").val(items[0].ReferenceNumber);
  //             $("#stockReqNoRecForm").val(items[0].SR_Number);
  //           }

  //           $("#docDateRecForm").val(
  //             header.DeliveryDate
  //               ? formatDateMMDDYY(header.DeliveryDate).replace(/-/g, "/")
  //               : "",
  //           );

  //           $("#statusRecForm").val(header.DocStatus);

  //           $("#driverRecForm").val(header.Driver || "");
  //           $("#truckCat").val(header.TruckCategory || "");
  //           $("#plateRecForm").val(header.TruckPlate || "");
  //           $("#remarksRecForm").val(header.Remarks || "");
  //           toggleReceivingButtons(true);
  //         } else {
  //           toggleReceivingButtons(false);

  //           let errorMessage = "";

  //           if (response.isSuccess === "received") {
  //             errorMessage = response.message;
  //           } else {
  //             errorMessage = "Invalid reference number";
  //           }

  //           Swal.fire({
  //             icon: "error",
  //             title: errorMessage,
  //           });
  //           return;
  //         }
  //       },
  //       error: function () {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error fetching DR data.",
  //         });
  //       },
  //       complete: function () {
  //         $("#submitRecBtn").prop("disabled", false);
  //         $("#receivingLoader").addClass("d-none");
  //       },
  //     });
  //     return false;
  //   }
  // });

  $(".search-order-field")
    .off("keydown.fetchOrder")
    .on("keydown.fetchOrder", function (e) {
      if (e.key !== "Enter") return;

      e.preventDefault();
      e.stopPropagation();

      const value = $(this).val().trim();
      const field = $(this).data("field");

      if (!field) {
        toggleReceivingButtons(false);

        Swal.fire({
          icon: "warning",
          title: "Please enter DR No.",
        });

        return;
      }

      getOrderDetails(field, value);
    });
}

function getOrderDetails(field, value) {
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
      currentOrder.requests = response.Requests;
      // console.log(`REQUESTED ITEMS : ${JSON.stringify(currentOrder.requests)}`);

      if (response.Header?.Status === "failed") {
        Swal.fire({
          icon: "error",
          title: "Error fetching delivery details.",
        });
        return;
      }

      if (response.isSuccess === "success") {
        $("#drNoRecForm").val(header.DeliveryNumber);
        $("#originRecForm").val(items[0].OriginBranch);
        $("#refNoRecForm").val(items[0].ReferenceNumber);
        $("#stockReqNoRecForm").val(items[0].SR_Number);

        $("#docDateRecForm").val(
          header.DeliveryDate
            ? formatDateMMDDYY(header.DeliveryDate).replace(/-/g, "/")
            : "",
        );

        $("#statusRecForm").val(header.DocStatus);
        $("#driverRecForm").val(header.Driver || "");
        $("#truckCat").val(header.TruckCategory || "");
        $("#plateRecForm").val(header.TruckPlate || "");
        $("#remarksRecForm").val(header.Remarks || "");

        toggleReceivingButtons(true);
      } else {
        toggleReceivingButtons(false);

        console.log(`RESPONSE: ${response.isSuccess}`);

        Swal.fire({
          icon: "error",
          title:
            response.isSuccess === "received"
              ? response.message
              : "Invalid reference number",
        });
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
}

function getOrders(reference) {
  $.ajax({
    url: "dirs/receiving/dashboard/actions/get_draft_orders.php",
    type: "POST",
    dataType: "json",
    data: {
      reference: reference,
    },
    success: function (response) {
      if (response.isSuccess !== "success") {
        console.log("No draft data fetched.");
        return;
      }
      const grouped = {};
      if (response.isSuccess === "success") {
        response.Items.forEach((item) => {
          const key = `${item.ItemBrand}|${item.ItemModel}`;

          if (!grouped[key]) {
            grouped[key] = {
              ItemBrand: item.ItemBrand,
              ItemModel: item.ItemModel,
              ItemCode: item.ItemCode,
              ItemCategory: item.ItemCategory,
              StckTransfr_RowNum: item.StckTransfr_RowNum,
              Recvd_ItemQty: 0,
              Serials: [],
            };
          }

          grouped[key].Recvd_ItemQty += parseFloat(item.Recvd_ItemQty);
          if (item.ItemSerial) {
            grouped[key].Serials.push(item.ItemSerial);
          }

          let serialRow = `
            <tr style="height: 40px; min-height: 40px; cursor: pointer">
                <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemModel}</td>
                <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemCode}</td>
                <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemSerial}</td>
            </tr>`;

          let receivingSerialTable = $("#receiving-serial-table tbody");

          let emptyRow = receivingSerialTable
            .find("tr")
            .filter(function () {
              return $(this).find("td").eq(0).text().trim() === "";
            })
            .first();

          if (emptyRow.length) {
            emptyRow.replaceWith(serialRow);
          } else {
            receivingSerialTable.prepend(serialRow);
          }
        });

        const items = Object.values(grouped);
        let totalQty = 0;

        let rows = "";

        let rowCount = items.length;
        items.forEach((item, index) => {
          totalQty += item.Recvd_ItemQty;

          let itemCode = item.ItemCode;
          let itemRowNum = item.StckTransfr_RowNum;

          const itemKey = item.ItemModel.trim().toUpperCase();
          const serials = [...new Set(item.Serials)];

          // console.log(`DRAFT ITEM SERIAL : ${item.Serials}`);

          rows += `
            <tr data-itemkey="${itemKey}"
              data-itemcode="${itemCode}"
              data-serialbased="true"
              data-rownum="${itemRowNum}"
              data-serials="${serials.join(",")}"
              data-bs-toggle="tooltip"
              data-bs-html="true"
              data-bs-title="Serials: <br>${serials.join("<br>")}"
              style="height:40px; min-height:40px;">
                <td class="text-center" style="background:#fcf7d4">${index + 1}</td>
                <td style="background:#fcf7d4">${item.ItemBrand}</td>
                <td style="background:#fcf7d4">${item.ItemModel}</td>
                <td style="background:#fcf7d4">${item.ItemCategory}</td>
                <td class="text-center" style="background:#fcf7d4">${item.Recvd_ItemQty.toFixed(0)}</td>
            </tr>`;
        });

        $("#receivingQty").text(totalQty.toFixed(0));
        $("#receiving-form-table tbody").html(rows);

        const tooltipTriggerList = document.querySelectorAll(
          '#receiving-form-table [data-bs-toggle="tooltip"]',
        );

        tooltipTriggerList.forEach((el) => {
          bootstrap.Tooltip.getInstance(el)?.dispose();
          new bootstrap.Tooltip(el);
        });

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
                  <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                  </tr>
              `;
            $("#receiving-form-table tbody").append(emptyRow);
          }
          $("#receivingQty").text(totalQty);
        }
      } else {
        console.log(response.isSuccess);
        console.log(response.Items);
        console.log(`NO DRAFT DATA HAS BEEN FETCHED`);
      }
    },
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
          <tr style="height: 40px; max-height: 40px">
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
        </tr>
        `;

        $("#receiving-form-table tbody").append(row);
      }

      for (let j = 0; j < 5; j++) {
        serialRow = `
          <tr style="height: 40px; max-height: 40px">
            <td style="background: #fcf7d4"></td>
            <td style="background: #fcf7d4"></td>
            <td style="background: #fcf7d4"></td>
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
  const yy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${mm}-${dd}-${yy}`;

  document.getElementById("postDate").value = formattedDate.replace(/-/g, "/");
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
        // console.log(response.Data);
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
  $(document).off("submit", "#frm-add-delivery");
  $(document).on("submit", "#frm-add-delivery", function (e) {
    e.preventDefault();

    console.log(
      `CURRENT REQUESTS INSIDE NON-SERIALIZED ITEMS`,
      JSON.stringify(currentOrder.requests),
    );

    let Brand = $("#newBrand").val();
    let Model = $("#newModel").val();
    let Category = $("#newCategory").val();
    let Quantity = parseInt($("#newQuantity").val()) || 1;
    let refNum = $("#refNoRecForm").val();

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

            // SECOND VALIDATION HERE (UTILIZE ITEM CODE HERE)
            $.ajax({
              url: "dirs/receiving/dashboard/actions/get_display.php",
              type: "POST",
              data: {
                refNum: refNum,
                ItemCode: items[0].Itemcode,
              },
              dataType: "json",
              success: function (response) {
                let data = response.Data;

                if (response.isSuccess !== "success") {
                  return;
                }

                if (response.isSuccess === "success" && data.length > 0) {
                  items.forEach((item) => {
                    if (!item.Itemcode) return;

                    let brand = item.ItemBrand;
                    let model = item.ItemName;
                    let category = item.ItemCategory;
                    let itemCode = item.Itemcode;
                    let itemRowNum = data[0].ItemRowNum;

                    // console.log(`RECEIVING ITEM : ${JSON.stringify(item)}`);

                    if (!brand || !model || !category || !itemCode) {
                      console.warn(
                        "Skipped item due to null/empty value:",
                        item,
                      );
                      return;
                    }

                    let existingRow = receivingBody.find(
                      `tr[data-itemcode="${itemCode}"]`,
                    );

                    if (existingRow.length) {
                      let currentQty =
                        parseInt(existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      existingRow
                        .find("td:nth-child(5)")
                        .text(currentQty + Quantity);
                      existingRow.attr("data-itemcode", itemCode);
                    } else {
                      let counter =
                        receivingBody.find("tr[data-itemcode]").length + 1;

                      rows += `
                  <tr data-itemcode="${itemCode}" data-rownum="${itemRowNum}" style="height: 40px; min-height: 40px; cursor: pointer">
                    <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${counter}</td>
                    <td class="align-middle ps-3" style="background: #fcf7d4">${brand}</td>
                    <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                    <td class="align-middle ps-3" style="background: #fcf7d4">${category}</td>
                    <td class="align-middle ps-3" style="background: #fcf7d4">${Quantity}</td>
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

                    $("#newQuantity").val("");
                    $("#newBrand").val("");
                    $("#newModel").val("");
                    $("#newCategory").val("").prop("disabled", true);
                    $("#addDeliveryModal").modal("hide");

                    $("#receivingQty").text(totalQty);
                  });
                }
              },
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

function serialDeliveryInput() {
  $(document).off("submit", "#serial-delivery");
  $(document).on("submit", "#serial-delivery", function (e) {
    e.preventDefault();

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

            // console.log(`RECEIVING ITEM: ${JSON.stringify(items)}`);

            if (!items || items.length === 0) {
              e.stopPropagation();
              e.stopImmediatePropagation();

              Swal.fire({
                icon: "error",
                title: "No item(s) found",
                text: "No record for this serial",
                confirmButtonText: "OKAY",
                allowEnterKey: true,
                allowEscapeKey: false,
              }).then(() => {
                serialInput.focus();
              });
              serializeBtn.prop("disabled", false);
              return false;
            }

            const scanId = Date.now();

            items.forEach((item) => {
              if (!item.ItemCode) return;

              if (!receivingGroupedItems[item.ItemCode]) {
                receivingGroupedItems[item.ItemCode] = {
                  ...item,
                  qty: 0,
                  picklist: null,
                  loadedQty: 0,
                  items: [],
                };
              }

              receivingGroupedItems[item.ItemCode]._scanId = scanId;

              Object.values(receivingGroupedItems).forEach(function (item) {
                let brand = item.ItemBrand;
                let model = item.ItemName;
                let category = item.ItemCategory;
                let itemCode = item.ItemCode;
                let itemRowNum = item.ItemRowNum;
                let qty = 1;

                let itemMappings = items.map((row) => ({
                  picklist: row.PKList_Number,
                }));

                receivingGroupedItems[itemCode].itemMappings = itemMappings;

                if (!receivingGroupedItems[itemCode].items) {
                  receivingGroupedItems[itemCode].items = [];
                }

                receivingGroupedItems[itemCode].items.push({
                  picklist: items.map((row) => row.PKList_Number),
                  serial: item.ItemSerial,
                });

                if (!brand || !model || !category || !itemCode) {
                  console.warn("Skipped item due to null/empty value:", item);
                  return;
                }

                if (item._scanId !== scanId) {
                  return;
                }

                // const rowKey = itemCode + "|" + latestInput;
                // const itemKey = itemCode + "|" + model;

                const modelKey = item.ItemName.trim().toUpperCase();
                const serialKey = latestInput.trim().toUpperCase();

                const rowKey = `${modelKey}|${serialKey}`;
                const itemKey = modelKey;

                let existingRow = receivingBody.find(
                  `tr[data-rowkey="${rowKey}"]`,
                );

                let existingItem = receivingBody.find(
                  `tr[data-itemkey="${itemKey}"]`,
                );

                // DUPLICATE SERIAL
                const duplicateSerial = receivingBody
                  .find("tr[data-serials]")
                  .toArray()
                  .some((row) => {
                    const serials = ($(row).attr("data-serials") || "")
                      .split(",")
                      .map((s) => s.trim().toUpperCase());

                    return serials.includes(serialKey);
                  });

                if (duplicateSerial) {
                  Swal.fire({
                    icon: "error",
                    title: "Serial number already scanned",
                  });

                  serializeBtn.prop("disabled", false);
                  return;
                }

                const serial = item.ItemSerial;

                const tableElement = document.querySelector(
                  "#receiving-serial-table",
                );

                const serialExisted = $(
                  "#receiving-serial-table tbody tr td:nth-child(3)",
                )
                  .toArray()
                  .some((td) => $(td).text().trim() === latestInput);

                if (!serialExisted) {
                  let serialRow = `
                    <tr style="height: 40px; min-height: 40px; cursor: pointer">
                        <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                        <td class="align-middle ps-3" style="background: #fcf7d4">${itemCode}</td>
                        <td class="align-middle ps-3" style="background: #fcf7d4">${Serial}</td>
                    </tr>`;

                  let receivingSerialTable = $("#receiving-serial-table tbody");

                  let emptyRow = receivingSerialTable
                    .find("tr")
                    .filter(function () {
                      return $(this).find("td").eq(0).text().trim() === "";
                    })
                    .first();

                  if (emptyRow.length) {
                    emptyRow.replaceWith(serialRow);
                  } else {
                    receivingSerialTable.prepend(serialRow);
                  }
                }

                totalQty += qty;

                if (existingItem.length) {
                  serializeBtn.prop("disabled", false);
                  let qtyCell = existingItem.find("td:nth-child(5)");
                  let currentQty = parseInt(qtyCell.text()) || 0;
                  qtyCell.text(currentQty + 1);

                  let existingSerials = existingItem.attr("data-serials") || "";

                  let serialArray = existingSerials
                    ? existingSerials.split(",").map((s) => s.trim())
                    : [];

                  if (!serialArray.includes(latestInput)) {
                    serialArray.push(latestInput);
                  }

                  serialArray = [...new Set(serialArray)];

                  existingItem.attr("data-serials", serialArray.join(","));

                  existingItem.attr(
                    "data-bs-title",
                    "Serials:<br>" + serialArray.join("<br>"),
                  );

                  const tooltip = bootstrap.Tooltip.getInstance(
                    existingItem[0],
                  );

                  if (tooltip) {
                    tooltip.setContent({
                      ".tooltip-inner":
                        "Serials:<br>" + serialArray.join("<br>"),
                    });
                  }
                  return;
                } else {
                  let counter =
                    receivingBody.find("tr[data-itemcode]").length + 1;
                  let newRow = `
                    <tr data-itemkey="${itemKey}" 
                    data-rowkey="${rowKey}" 
                    data-rownum="${itemRowNum}"
                    data-itemmapping='${JSON.stringify(itemMappings)}' 
                    data-itemcode="${itemCode}" 
                    data-serialbased="true" 
                    data-serials="${item.ItemSerial}"
                    data-bs-toggle="tooltip"
                    data-bs-html="true"
                    data-bs-title="${"Serials: " + item.ItemSerial}"
                    style="height: 40px; min-height: 40px; cursor: pointer">
                      <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${counter}</td>
                      <td class="align-middle ps-3" style="background: #fcf7d4">${brand}</td>
                      <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                      <td class="align-middle ps-3" style="background: #fcf7d4">${category}</td>
                      <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${qty}</td>
                    </tr>
                  `;
                  // console.log(`ITEM SERIAL: ${item.ItemSerial}`);

                  let emptyRow = receivingBody
                    .find("tr:not([data-itemcode])")
                    .first();
                  if (emptyRow.length) {
                    emptyRow.replaceWith(newRow);
                  } else {
                    receivingBody.prepend(newRow);
                  }

                  renumberRows();

                  const tooltipTriggerList = document.querySelectorAll(
                    '[data-bs-toggle="tooltip"]',
                  );

                  tooltipTriggerList.forEach((el) => {
                    bootstrap.Tooltip.getInstance(el)?.dispose();
                    new bootstrap.Tooltip(el);
                  });
                }

                if ($.fn.DataTable.isDataTable("#receiving-form-table")) {
                  $("#receiving-form-table").DataTable().destroy();
                }

                // console.log(`UPDATED SERIAL INPUT FUNCTION`);

                let exists = false;
                $("#receiving-form-table tbody tr").each(function () {
                  let code = $(this).data("itemcode");
                  if (code == itemCode) {
                    exists = true;
                    return false;
                  }
                });
              });
            });
            $("#serializeBtn").prop("disabled", false);
            $("#receivingQty").text(totalQty);
          } else if (response.isSuccess === "Failed") {
            Swal.fire({
              icon: "error",
              title: "Unavailable stock for this model",
              confirmButtonText: "OKAY",
            }).then(() => {
              console.log("No response found on this item");
            });
            $("#serializeBtn").prop("disabled", false);
            return;
          } else {
            console.log(`NO RESPONSE`);
            Swal.fire({
              icon: "error",
              title: response.Data,
              confirmButtonText: "OKAY",
            });
            $("#serializeBtn").prop("disabled", false);
            return;
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
          }).then(() => {
            console.log("No response found on this item");
          });
          $("#serializeBtn").prop("disabled", false);
          return;
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

      let formData = buildReceivingData();

      // VALIDATION 1
      if (!formData.items.length) {
        return Swal.fire({
          icon: "warning",
          title: "No items found",
        });
      }

      // VALIDATION 2
      if (!currentOrder.requests?.length) {
        return Swal.fire({
          icon: "warning",
          title: "No request data found",
          text: "Please search a valid delivery first.",
        });
      }

      const unmatchedItems = formData.items.filter((receivedItem) => {
        return !currentOrder.requests.some(
          (requestItem) =>
            requestItem.ItemName.trim().toUpperCase() ===
              receivedItem.model.trim().toUpperCase() &&
            requestItem.ItemBrand.trim().toUpperCase() ===
              receivedItem.brand.trim().toUpperCase(),
        );
      });

      // CHECK UNMATCHED ITEMS
      const uniqueUnmatched = Array.from(
        new Map(
          unmatchedItems.map((item) => {
            const key = `${item.brand.trim().toUpperCase()}-${item.model.trim().toUpperCase()}`;
            return [key, item];
          }),
        ).values(),
      );

      const submitAjax = () => {
        let receivingBtn = $("#submitRecBtn");
        let draftBtn = $("#submitDraftRecBtn");

        $.ajax({
          url: "dirs/receiving/dashboard/actions/save_createreceiving.php",
          type: "POST",
          data: {
            receivingData: JSON.stringify(formData),
          },
          dataType: "json",
          beforeSend: function () {
            receivingBtn
              .prop("disabled", true)
              .html(
                `<span class="spinner-border spinner-border-sm"></span> Processing`,
              );
            draftBtn.prop("disabled", true);
          },
          success: function (response) {
            receivingBtn.prop("disabled", false).html("Submit");
            draftBtn.prop("disabled", false);

            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Items have been received",
              }).then(() => {
                window.open(
                  `pdf/receiving.php?batch=${encodeURIComponent(formData.DeliveryNumber)}&receivingNumber=${encodeURIComponent(response.ReceivingNumber)}`,
                  "_blank",
                );
                receivingGroupedItems = {}
                returnReceiving();
              });

              // window.open(
              //   `pdf/receiving.php?batch=${formData.DeliveryNumber}`,
              //   "_blank",
              // );
            } else {
              Swal.fire({
                icon: "error",
                title: response.message || "Submission failed",
              });
            }
          },
          error: function () {
            receivingBtn.prop("disabled", false).html("Submit");
            draftBtn.prop("disabled", false);

            Swal.fire({
              icon: "error",
              title: "Something went wrong",
            });
          },
        });
      };

      // console.log(`REQUESTED ITEMS : ${JSON.stringify(currentOrder.requests)}`);

      // IF UNMATCHED ITEMS EXIST
      if (uniqueUnmatched.length > 0) {
        return Swal.fire({
          icon: "warning",
          title: "Some items are not in the request",
          html: `
            <p>The following item(s) do not exist in the selected request:</p>
            <ul style="text-align:left;">
              ${uniqueUnmatched
                .map((item) => `<li>${item.brand} - ${item.model}</li>`)
                .join("")}
            </ul>
            <p class="mt-2"><strong>Do you want to continue anyway?</strong></p>
          `,
          showCancelButton: true,
          confirmButtonText: "Yes, Continue",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) submitAjax();
        });
      }

      // NORMAL CONFIRMATION
      Swal.fire({
        title: "Submit Receiving?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) submitAjax();
      });
    });
}

$(document)
  .off("click", "#submitDraftRecBtn")
  .on("click", "#submitDraftRecBtn", async function () {
    let draftBtn = $("#submitDraftRecBtn");
    let submitBtn = $("#submitRecBtn");

    let formData = buildReceivingData();

    // VALIDATION 1
    if (!formData.items.length) {
      return Swal.fire({
        icon: "warning",
        title: "No items found",
      });
    }

    const result = await Swal.fire({
      title: "Save the following item(s) as draft?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    draftBtn
      .prop("disabled", true)
      .html(
        `<span class="spinner-border spinner-border-sm"></span> Processing`,
      );

    submitBtn.prop("disabled", true);

    try {
      await autoSaveDraft();
      // returnReceiving();
      // loadDrafts();
      drafts()
    } catch (err) {
      draftBtn.prop("disabled", false).html("Save as Draft");
      submitBtn.prop("disabled", false);
    }
  });

function drafts() {
  $("#receiving_content").html(spinner);
  $.post("dirs/receiving/dashboard/drafts.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $("#draftsTable tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadDrafts();
  });
}

$(document).on("click", ".dropdown .open-draft", function (e) {
  e.preventDefault();

  let reference = $(this).data("ref");

  $("#main-content").html(spinner);
  $("#receiving-serial-table tbody").empty();
  receivingForm(reference);
});

function loadDrafts() {
  $("#receiving-form-table tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
  $.ajax({
    url: "dirs/receiving/dashboard/actions/get_drafts.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let data = response.Data;
      let rows = [];
      let counter = 1;
      if (response.isSuccess === "success") {
        receivingGroupedItems = {};
        data.forEach(function (item) {
          const date = new Date(item.SysTimeStamp);
          const modified = date.toISOString().split("T")[0];
          const timestamp = new Date().toLocaleString();

          const formattedModified =
            `${String(new Date(modified).getMonth() + 1).padStart(2, "0")}/` +
            `${String(new Date(modified).getDate()).padStart(2, "0")}/` +
            `${String(new Date(modified).getFullYear())} ` +
            `${new Date(timestamp).toLocaleTimeString()}`;

          rows.push([
            counter++,
            item.ReferenceNumber,
            item.OriginBranch,
            item.ReceivedBranch,
            formattedModified,
            `<div class="dropdown">
                <button class="btn"
                        data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item open-draft"
                            data-ref="${item.ReferenceNumber}">
                            Edit
                        </a>
                    </li>
                </ul>
              </div>`,
          ]);
        });

        if (rows.length < 8) {
          for (let i = rows.length; i < 8; i++) {
            rows.push(["", "", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#draftsTable")) {
          $("#draftsTable").DataTable().clear().destroy();
        }

        $("#draftsTable").DataTable({
          data: rows,
          columns: [
            { title: "#", className: "text-center" },
            { title: "Reference No." },
            { title: "Stock Origin", className: "text-start ps-3" },
            { title: "Destination", className: "ps-3" },
            {
              title: "Last Modified",
              className: "ps-3",
            },
            { title: "" },
          ],
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          order: [[0, "desc"]],
          rowCallback: function (row, data) {
            $("td:not(.empty-row)", row).css({
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(0)", row).addClass("text-center");
            $("td:eq(1)", row).addClass("text-primary ps-2");

            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#fcf7d4");
              },
            );
          },
          drawCallback: function () {
            let tableBody = $("#draftsTable tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="5" style="background: #fcf7d4">&nbsp;</td>
                </tr>
              `);

              emptyRow.css({
                background: "#fcf7d4",
                height: "40px",
                "min-height": "40px",
              });

              emptyRow.hover(function () {
                $(this).css("background", "#fcf7d4");
              });

              tableBody.append(emptyRow);
            }
          },
        });
      }
    },
  });
}
