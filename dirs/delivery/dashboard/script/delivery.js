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
    deliveryNum = del_num;

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
  deliveryNum = del_num;

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

// TRIGGER SERIAL
$(document).on("dblclick", "#deliveryTable tbody tr", {}, function (e) {
  let brand = $(this).find("td:nth-child(1)").text().trim();
  let model = $(this).find("td:nth-child(2)").text().trim();
  let quantity = parseInt($(this).find("td:nth-child(4)").text().trim());
  let value = brand + " - " + model;

  let DeliveryNum = "DR10003";

  let count = 0;
  $("#serialTable tbody td").each(function () {
    if (count < quantity) {
      $(this).text(value); // overwrite or fill
      // CALL THE API FOR SERIAL
      // $("#main-content").html(spinner);
      serialData(DeliveryNum);
      count++;
    } else {
      $(this).text("");
    }
  });
});

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  let model = $(this).find("td:nth-child(2)").text().trim();
  let qty = $(this).find("td:nth-child(3)").text().trim();
  $("#assignBranchModal #model").val(model);
  $("#assignBranchModal #qty").val(qty);
  $("#assignBranchModal").modal("show");
});

function serialData(DeliveryNum) {
  $.post(
    "dirs/delivery/dashboard/actions/get_review_deliveries.php",
    { DeliveryNum: DeliveryNum },
    function (data) {
      let res = "";
      try {
        res = JSON.parse(data);
      } catch (err) {
        console.error("Error fetching serial: ", err);
      }
    },
  );
}

// function serialDeliveryInput() {
//   const serialCell = document.querySelector(
//     "#delivery-serial-table tbody td[contenteditable='true']",
//   );
//   serialCell.addEventListener("keydown", function (e) {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevents creating a new line
//       const serialValue = this.innerText.trim();

//       if (serialValue) {
//         $.ajax({
//           url: "dirs/delivery/dashboard/actions/get_find_product_serial.php",
//           type: "POST",
//           data: { Serial: serialValue },
//           dataType: "json",
//           success: function (response) {
//             if (response.isSuccess === "success") {
//               console.log(`SERIAN INPUT: ${serialValue}`);
//               console.log(`RESPONSE: ${JSON.stringify(response.Data)}`);

//               // ITEM DETAILS TO BE IMPORTED IN DELIVERY SERIAL TABLE
//             }
//           },
//         });
//       }
//     }
//   });
// }

// CREATE DELIVERY
function createDr(createDeliveryNumber, picklistDr) {
  $.post("dirs/delivery/dashboard/createDr.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    // serialDeliveryInput();

    // $.ajax({
    //   url: "dirs/delivery/dashboard/actions/update_branch_warehouse.php",
    //   type: "POST",
    //   dataType: "json",
    //   success: function (data) {
    //     console.log(`DATA: ${JSON.stringify(data.isSuccess)}`);
    //   },
    // });

    $.ajax({
      url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
      type: "POST",
      data: { DeliveryNum: createDeliveryNumber },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let rowCount = response.DevItems.length;
          // let rowCount = 0;
          let totalQty = 0;
          let header = response.Data;
          let items = response.DevItems;

          console.log(`PICKLIST: ${picklistDr}`);

          $("#drno").val(createDeliveryNumber);
          $("#pcklstno").val(picklistDr);
          $("#docdate").val(header.DocumentDate);
          $("#origin").val(header.BDestination);
          $("#whcode").val(header.BWhsDestination);
          // $("#branchName").val(header.BOrigin);
          // $("#branchWhCode").val(header.BWhsOrigin);
          $("#status").val("NEW");
          $("#prepby").val(header.PreparedBy);

          let rows = [];
          let row = "";

          items.forEach(function (item, index) {
            let quantity = parseFloat(item.Quantity) || 0;
            totalQty += quantity;
            rows += `
                  <tr style="height: 40px; min-height: 40px;">
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
                  </tr>`;

            row += `
            <tr style="height: 40px; min-height: 40px;">
                    <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px; cursor: pointer">${item.Brand}</td>
                    <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px; cursor: pointer">${item.Model}</td>
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px" contenteditable="true">${item.Quantity}</td>
                  </tr>`;
          });

          // SERIAL DELIVERY INPUT

          $("#summaryQty").text(totalQty);
          $("#deliveryTable tbody").html(rows);
          $("#summaryTable tbody").html(row);
          if (rowCount < 8) {
            let emptyRowsNeeded = 8 - rowCount;
            for (let i = 0; i < emptyRowsNeeded; i++) {
              let emptyRow = `
                <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                </tr>`;
              $("#deliveryTable tbody").append(emptyRow);
            }

            let emptyRows = 8 - rowCount;
            for (let j = 0; j < emptyRows; j++) {
              let emptyRow = `
                <tr class="item-row empty-row" style="height: 40px; min-height: 40px">
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                  <td style="background: #FFFBDF"></td>
                </tr>
              `;
              $("#summaryTable tbody").append(emptyRow);
            }
          }

          // NEW DELIVERY TOGGLER
          const toggler = document.getElementById("serialToggler");
          const knob = document.querySelector(".switch-knob");
          const manual = document.querySelector(".switch-track .manual");
          const scan = document.querySelector(".switch-track .scan");
          const editableCells = document.querySelectorAll(
            "td[contenteditable='true']",
          );

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

              editableCells.forEach((cell) => {
                cell.setAttribute("contenteditable", "true");
                cell.addEventListener("keydown", preventTyping);
              });
            } else {
              toggler.dataset.value = "Manual";
              knob.style.width = "60px";
              knob.style.transform = "translateX(0px)";
              manual.classList.add("text-white");
              scan.style.opacity = "0";
              scan.style.pointerEvents = "none";
              manual.style.opacity = "1";
              manual.style.pointerEvents = "auto";

              editableCells.forEach((cell) => {
                cell.setAttribute("contenteditable", "true");
                cell.removeEventListener("keydown", preventTyping);
              });
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
          // ----------------------------------------------------------

          const commitBtn = document.getElementById("deliveryBtn");
          const summaryEditables = document.querySelectorAll(
            "#summaryTable tbody tr td[contenteditable='true']",
          );

          function validateDeliveryForm() {
            let isValid = true;

            const serialCell = $("#delivery-serial-table tbody td")
              .text()
              .trim();
            if (serialCell === "") isValid = false;

            const deliveryRows = $("#deliveryTable tbody tr");
            let hasData = false;

            deliveryRows.each(function () {
              const cells = $(this).find("td").text().trim();
              if (cells !== "") {
                hasData = true;
              }
            });

            if (!hasData) isValid = false;

            // INPUTS
            if ($("#prepby").val().trim() === "") isValid = false;
            if ($("#plate").val().trim() === "") isValid = false;
            if ($("#driver").val().trim() === "") isValid = false;

            // ENABLE / DISABLE BUTTON
            commitBtn.disabled = !isValid;
          }

          $(document).on(
            "input",
            "#delivery-serial-table td, #deliveryTable td, #prepby, #plate, #driver",
            function () {
              validateDeliveryForm();
            },
          );

          let isCommitted = false;

          commitBtn.addEventListener("click", function () {
            if (isCommitted) {
              return;
            }

            Swal.fire({
              title: "Commit Delivery?",
              text: "Please confirm before proceeding.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Commit",
              cancelButtonText: "Cancel",
            }).then((result) => {
              if (result.isConfirmed) {
                isCommitted = true;
                $("#serialToggler").prop("disabled", true);
                summaryEditables.forEach((cell) => {
                  cell.setAttribute("contenteditable", "true");
                });
                $("#delivery-serial-table tbody tr td").each(function () {
                  this.setAttribute("contenteditable", "false");
                });
                $("#prepby").attr("disabled");
                $("#plate").attr("disabled");
                $("#driver").attr("disabled");
                $("#remarks").attr("disabled");

                const createDrBtn = document.getElementById("createDrBtn");
                createDrBtn.disabled = true;

                // store the original total quantity
                let originalQty = parseInt($("#summaryQty").text().trim()) || 0;

                function updateSummaryQty() {
                  let enteredTotal = 0;

                  // sum all qty-cell values
                  $("#summaryTable tbody .qty-cell").each(function () {
                    let val = parseInt(
                      $(this).text().trim().replace(/\D/g, ""),
                    );
                    if (!isNaN(val)) {
                      enteredTotal += val;
                    }
                  });

                  console.log(`ENTERED TOTAL: ${enteredTotal}`);

                  let remaining = originalQty - enteredTotal;
                  if (remaining < 0) remaining = 0;
                  $("#summaryQty").text(remaining);
                  console.log(`REMAINING: ${remaining}`);

                  createDrBtn.disabled = remaining !== 0;
                }

                $(document).on(
                  "input keyup",
                  "#summaryTable tbody .qty-cell",
                  function () {
                    updateSummaryQty();
                  },
                );
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

          // run on load
          adjustTotalWidth();

          // update on window resize
          window.addEventListener("resize", adjustTotalWidth);
        }
      },
    });
  });
}

// LOAD DELIVERY BASKET
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
              item.DateModified || "03/17/2026",
              item.ItemCount || "",
              item.Status || "Partial",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  <li><a class="dropdown-item remove-picklist" href="#" data-picklist="${item.PickList_Num}" data-rownum="${item.RowNumOrder}">Remove</a></li>
                  <li><a class="dropdown-item create-dr" href="#" data-picklist="${item.PickList_Num}">Create DR</a></li>
                </ul>
              </div>`,
            ]);
          });

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", "", "", ""]);
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

// REMOVE PICKLIST
$(document).on("click", ".remove-picklist", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let picklist_num = $(this).data("picklist");
  let rowNum = $(this).data("rownum");
  removePicklist(picklist_num, rowNum);
});

// REMOVE PICKLIST FROM LOADING BASKET
function removePicklist(picklistNum, rowNum) {
  if (!picklistNum) {
    Swal.fire({
      icon: "error",
      title: "Missing Picklist Number",
      text: "Make sure that the Picklist exists!",
      confirmButtonText: "OKAY",
    });
    return;
  }

  console.log(`PICKLIST NUMBER: ${picklistNum}`);
  console.log(`ROW NUMBER: ${rowNum}`);

  Swal.fire({
    icon: "question",
    // title: "Remove this picklist?",
    title: "Remove picklist " + picklistNum + "?",
    text: "This action cannot be change.",
    showCancelButton: true,
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/delivery/dashboard/actions/update_remove_pklist.php",
        // { picklist },
        { Itm_RowNum: rowNum },
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
  let RowNum = "";
  let DeliveryNum = picklistedRow.attr("data-delivery-num");
  let PicklistNumber = picklistedRow.attr("data-picklist");

  $("#main-content").html(spinner);
  setTimeout(function () {
    openDeliveryForm(DeliveryNum, PicklistNumber, RowNum, SRN);
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

// LOAD DELIVERY ITEMS
function loadDeliveryItems(PickLst_Num, del_num) {
  $.post("dirs/delivery/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);

    deliveryPicklistNum = PickLst_Num;
    deliveryNum = del_num;

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
              rows.push(["", "", "", "", ""]);
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

  let SRN = $(this).data("srn-num");
  let PickLst_Num = $(this).data("picklist");
  let DeliveryNum = $(this).data("delivery-num");
  let RowNum = "";

  $("#main-content").html(spinner);
  setTimeout(function () {
    openDeliveryForm(DeliveryNum, PickLst_Num, RowNum, SRN);
  }, 200);
});

// DELIVERY DASHBOARD - FORM
function openForm(DeliveryNum, PicklistNumber, RowNumber) {
  $.post("dirs/delivery/dashboard/form.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $.ajax({
      url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
      type: "POST",
      data: { DeliveryNum: DeliveryNum },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let rowCount = response.DevItems.length;
          let totalQty = 0;
          let header = response.Data;
          let items = response.DevItems;

          $("#drno").val(DeliveryNum);
          $("#pcklstno").val(PicklistNumber);
          $("#docdate").val(header.DocumentDate);
          $("#origin").val(header.BDestination);
          $("#whcode").val(header.BWhsDestination);

          // $("#branchName").val(header.BOrigin);
          // $("#branchWhCode").val(header.BWhsOrigin);
          $("#status").val(header.Delivery_Status);
          $("#prepby").val(header.PreparedBy) || "N/A";
          $("#plate").val(header.PlateNumber) || "N/A";
          $("#driver").val(header.Delivery_Personnel) || "N/A";
          $("#remarks").val(header.Remarks) || "N/A";
          let rows = "";
          items.forEach(function (item, index) {
            let quantity = parseFloat(item.Quantity) || 0;
            totalQty += quantity;
            rows += `
              <tr style="height: 40px; min-height: 40px; cursor: pointer">
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

// OPEN DELIVERY FORM FROM DELIVERY ITEMS
function openDeliveryForm(DeliveryNum, PicklistNumber, RowNum, SRN) {
  $.post("dirs/delivery/dashboard/deliveryForm.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    $.ajax({
      url: "dirs/incoming/dashboard/actions/get_openincoming.php",
      // url: "dirs/delivery/dashboard/actions/get_review_deliveries.php",
      type: "POST",
      data: { RowNum: RowNum },
      // data: { DeliveryNum: DeliveryNum },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          $("#deliverySRN").text(SRN);
          let rowCount = response.Items.length;
          // let rowCount = response.DevItems.length;
          let totalQty = 0;
          let header = response.Data;
          let items = response.Items;
          // let items = response.DevItems;

          console.log(`ROW NUMBER: ${RowNum}`);
          console.log(`DATA: ${JSON.stringify(header)}`);
          console.log(`ITEMS: ${JSON.stringify(items)}`);

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

          // $("#drno").val(DeliveryNum);
          // $("#pcklstno").val(PicklistNumber);
          // $("#docdate").val(header.DocumentDate);
          // $("#origin").val(header.BDestination);
          // $("#whcode").val(header.BWhsDestination);
          // $("#branchName").val(header.BOrigin);
          // $("#branchWhCode").val(header.BWhsOrigin);
          // $("#status").val(header.Delivery_Status);
          // $("#prepby").val(header.PreparedBy) || "N/A";
          // $("#plate").val(header.PlateNumber) || "N/A";
          // $("#driver").val(header.Delivery_Personnel) || "N/A";
          // $("#remarks").val(header.Remarks) || "N/A";
          // let rows = "";
          // items.forEach(function (item, index) {
          //   let quantity = parseFloat(item.Quantity) || 0;
          //   totalQty += quantity;
          //   rows += `
          //     <tr style="height: 40px; min-height: 40px; cursor: pointer">
          //       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Brand}</td>
          //       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Model}</td>
          //       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Category}</td>
          //       <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${item.Quantity}</td>
          //     </tr>
          //   `;
          // });
          // $("#totalQuantity").text(totalQty);
          // $("#deliveryTable tbody").html(rows);
          // if (rowCount < 8) {
          //   let emptyRowsNeeded = 8 - rowCount;
          //   for (let i = 0; i < emptyRowsNeeded; i++) {
          //     let emptyRow = `
          //       <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
          //         <td style="background: #FFFBDF"></td>
          //         <td style="background: #FFFBDF"></td>
          //         <td style="background: #FFFBDF"></td>
          //         <td style="background: #FFFBDF"></td>
          //       </tr>
          //     `;
          //     $("#deliveryTable tbody").append(emptyRow);
          //   }
          //   $("#totalQuantity").text(totalQty);
          // }
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load items.",
      });
    },
  });
}
