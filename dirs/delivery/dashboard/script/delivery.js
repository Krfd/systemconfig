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
// $(document).on("dblclick", "#deliveryTable tbody tr", {}, function (e) {
//   let brand = $(this).find("td:nth-child(1)").text().trim();
//   let model = $(this).find("td:nth-child(2)").text().trim();
//   let quantity = parseInt($(this).find("td:nth-child(4)").text().trim());
//   let value = brand + " - " + model;

//   let DeliveryNum = "DR10003";

//   let count = 0;
//   $("#serialTable tbody td").each(function () {
//     if (count < quantity) {
//       $(this).text(value); // overwrite or fill
//       // CALL THE API FOR SERIAL
//       $("#main-content").html(spinner);
//       serialData(DeliveryNum);
//       count++;
//     } else {
//       $(this).text("");
//     }
//   });
// });

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  if ($(e.target).closest("[contenteditable='true']").length) {
    return;
  }

  let brand = $(this).find("td:nth-child(1)").text().trim();
  let model = $(this).find("td:nth-child(2)").text().trim();
  let qty = $(this).find("td:nth-child(3)").text().trim();
  $("#assignBranchModal #brand").val(brand);
  $("#assignBranchModal #model").val(model);
  $("#assignBranchModal #qty").val(qty);
  $("#assignBranchModal").modal("show");
  // console.log(`ASSIGNING VALUES IN SUMMARY MODAL TABLE`);
});

// function serialData(DeliveryNum) {
//   $.post(
//     "dirs/delivery/dashboard/actions/get_review_deliveries.php",
//     { DeliveryNum: DeliveryNum },
//     function (data) {
//       let res = "";
//       try {
//         res = JSON.parse(data);
//       } catch (err) {
//         console.error("Error fetching serial: ", err);
//       }
//     },
//   );
// }

/*load Imperial Brands*/
function loadImperialBrands() {
  $.post("dirs/outgoing/form/actions/get_iapbrands.php", {}, function (data) {
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
  });
}

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
        $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
          $("#main-content").html(data);
        });
      });
    }
  });
}

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
    "dirs/outgoing/form/actions/get_mdlcategory.php",
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

// SERIAL QUERY
function serialDeliveryInput() {
  const serialCell = document.querySelector(
    "#delivery-serial-table tbody td[contenteditable='true']",
  );

  const serials = [];
  serialCell.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents creating a new line

      const serialValue = this.innerText.trim();

      if (serialValue) {
        // $.ajax({
        //   url: "dirs/delivery/dashboard/actions/get_find_product_serial.php",
        //   type: "POST",
        //   data: { Serial: serialValue },
        //   dataType: "json",
        //   success: function (response) {
        //     if (response.isSuccess === "success") {
        //       console.log(`SERIAN INPUT: ${serialValue}`);
        //       console.log(`RESPONSE: ${JSON.stringify(response.Data)}`);

        //       // ITEM DETAILS TO BE IMPORTED IN DELIVERY SERIAL TABLE
        //     }
        //   },
        // });

        const parts = serialValue.split(", ");
        let latestInput = parts[parts.length - 1].trim(); // remove spaces

        // If the last part is empty (because user typed a trailing comma), pick the second-to-last
        if (!latestInput && parts.length > 1) {
          latestInput = parts[parts.length - 2].trim();
        }

        console.log(`LATEST INPUT: ${latestInput}`);
        serials.push(latestInput);
        console.log(`SERIALS: ${serials}`);

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Get text before cursor
        const preRange = range.cloneRange();
        preRange.selectNodeContents(this);
        preRange.setEnd(range.endContainer, range.endOffset);
        const textBeforeCursor = preRange.toString();
        const currentLine = textBeforeCursor.split("\n").pop().trim();

        // Create line break
        const br = document.createElement("br");

        if (!currentLine) {
          // Empty line → just add <br> + empty text node
          const emptyText = document.createTextNode("\u200B"); // zero-width space
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          range.insertNode(emptyText);
          range.setStartAfter(emptyText);
          range.setEndAfter(emptyText);
        } else if (!currentLine.endsWith(",")) {
          // Line has text → add comma + <br> + empty text node
          const commaNode = document.createTextNode(",");
          range.insertNode(commaNode);

          range.setStartAfter(commaNode);
          range.setEndAfter(commaNode);

          const emptyText = document.createTextNode("\u200B");
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          range.insertNode(emptyText);
          range.setStartAfter(emptyText);
          range.setEndAfter(emptyText);
        } else {
          // Line already has comma → just <br> + empty text node
          const emptyText = document.createTextNode("\u200B");
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          range.insertNode(emptyText);
          range.setStartAfter(emptyText);
          range.setEndAfter(emptyText);
        }

        // Update selection to be after new line
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
}

// SUMMARY
function branchDelivery() {
  let Serial = $("#assignBranchModal #serial").val();
  let selectedBrand = $("#assignBranchModal #brand").val();
  let selectedModel = $("#assignBranchModal #model").val();
  let selectedBranch = $("#assignBranchModal #branch").val();
  let selectedQty = $("#assignBranchModal #qty").val();

  // ✅ Validate inputs FIRST
  if (!selectedBrand || !selectedModel || !selectedBranch || !selectedQty) {
    alert("Please fill in all fields before adding.");
    return;
  }

  // loop through summary table rows
  $("#summaryTable tbody tr").each(function () {
    let model = $(this).find("td:nth-child(2)").text().trim();

    let inserted = false;

    if (model === selectedModel) {
      $("#summaryDeliveryTable tbody tr").each(function (index) {
        let serialCell = $(this).find("td:nth-child(2)").text().trim();

        if (!serialCell) {
          let rowCount = index + 1;

          $(this).html(`
            <td style="background:#FFFBDF">${rowCount}</td>
            <td style="background:#FFFBDF" class="text-primary">${Serial}</td>
            <td style="background:#FFFBDF">${selectedBranch}</td>
            <td style="background:#FFFBDF">${selectedBrand}</td>
            <td style="background:#FFFBDF">${selectedModel}</td>
            <td style="background:#FFFBDF">${selectedQty}</td>
          `);

          inserted = true;
          return false; // stop loop
        }
      });

      // 🔥 if no empty row found → append at bottom
      if (!inserted) {
        let rowCount = $("#summaryDeliveryTable tbody tr").length + 1;

        $("#summaryDeliveryTable tbody").append(`
          <tr>
            <td>${rowCount}</td>
            <td>${Serial}</td>
            <td>${selectedBranch}</td>
            <td>${selectedBrand}</td>
            <td>${selectedModel}</td>
            <td>${selectedQty}</td>
          </tr>
        `);
      }

      console.log(
        `ADDED TO SUMMARY: ${Serial} | ${selectedBranch} | ${selectedBrand} | ${selectedModel} | ${selectedQty}`,
      );

      // Optional: reset modal inputs
      $("#assignBranchModal #serial").val("");
      $("#assignBranchModal #brand").val("");
      $("#assignBranchModal #model").val("");
      $("#assignBranchModal #branch").val("");
      $("#assignBranchModal #qty").val("");

      // Optional: close modal
      $("#assignBranchModal").modal("hide");

      return false;
    }
  });
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
      // $("#delivery")[0].reset();

      let row = [];

      $("#delivery-serial-table tbody").empty();
      $("#deliveryTable tbody").empty();
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
        </tr>
        `;

        $("#deliveryTable tbody").append(row);
        $("#summaryTable tbody").append(row);
        $("#summaryDeliveryTable tbody").append(row);
      }

      let serialRow = `<tr>
          <td rowspan="9" colspan="2" style="background: #FFFBDF" contenteditable="true" style="white-space: pre-wrap;">
          </td>
        </tr>`;

      $("#delivery-serial-table tbody").append(serialRow);

      console.log("Form and table cleared ✅");
    }
  });
}

function summaryData() {
  let rows = [];

  if (rows.length === 0) {
    for (let i = 0; i < 8; i++) {
      rows.push(["", "", "", "", "", ""]);
    }
  }

  if ($.fn.DataTable.isDataTable("#summaryDeliveryTable")) {
    $("#summaryDeliveryTable").DataTable().clear().destroy();
    $("#summaryDeliveryTable tbody").empty();
  }
  $("#deliveryBtn").prop("disabled", false);
  summaryTable = $("#summaryDeliveryTable").DataTable({
    data: rows,
    columns: [
      { title: "#" },
      { title: "Serial" },
      { title: "Branch" },
      { title: "Brand" },
      { title: "Model" },
      { title: "Quantity" },
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
        let $emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="6" style="background:#FFFBDF"></td>
                </tr>
              `);

        $($emptyRow).css({
          background: "#FFFBDF",
          height: "40px",
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
}
// CREATE DELIVERY
function createDr(createDeliveryNumber, picklistDr) {
  $.post("dirs/delivery/dashboard/createDr.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    loadImperialBrands();
    serialDeliveryInput();
    loadIAPBranchlist();
    summaryData();

    $("#branchDeliveryUnit").on("submit", function (e) {
      e.preventDefault();
      branchDelivery();

      $("#assignBranchModal").modal("hide");
      $("#branchDeliveryUnit")[0].reset(); // clear modal
    });

    /*Function for reselecting brand to find another model*/
    $("#newBrand").on("change", function () {
      $("#newModel").html('<option value="">Select Model</option>');
      $("#newCategory").val("");
      $("#itemcode").val("");
      loadImperialModel();
    });

    /*Script for selecting model and category*/
    $("#newModel").on("change", function () {
      const selected = $(this).find(":selected");
      $("#newCategory").val(selected.data("category") || "");
      $("#itemcode").val(selected.data("itemcode") || "");
    });

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
          let totalQty = 0;
          let header = response.Data;
          let items = response.DevItems;

          $("#drno").val(createDeliveryNumber);
          $("#pcklstno").val(picklistDr);
          $("#docdate").val(header.DocumentDate);
          $("#origin").val(header.BDestination);
          $("#whcode").val(header.BWhsDestination);
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

          // SWITCH DELIVERY TOGGLER
          function toggler() {
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
          }
          toggler();
          // ----------------------------------------------------------

          // const commitBtn = document.getElementById("deliveryBtn");
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

          // run on load
          adjustTotalWidth();
          window.addEventListener("resize", adjustTotalWidth);

          // FORM SUBMISSION
          let commitBtn = document.getElementById("deliveryBtn");

          commitBtn.addEventListener("click", function () {
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

                console.log(`SUBMIT DELIVERY`);

                let items = [];
                $("#summaryTable tbody tr")
                  .not(".empty-row")
                  .each(function () {
                    let serial = $(this).find(".item-serial").text().trim();
                    let branch = $(this).find(".item-branch").text().trim();
                    let brand = $(this).find(".item-brand").text().trim();
                    let model = $(this).find(".item-model").text().trim();
                    let quantity = $(this).find(".item-quantity").text().trim();

                    if (brand !== "") {
                      items.push({
                        serial: serial,
                        branch: branch,
                        brand: brand,
                        model: model,
                        quantity: quantity,
                      });
                    }
                  });

                if (items.length === 0) {
                  e.preventDefault();
                  Swal.fire({
                    icon: "error",
                    title: "No items on summary",
                    text: "No item(s) found on the summary",
                  });
                  return;
                }

                let formData = new FormData(
                  document.getElementById("delivery"),
                );
                formData.append("items", JSON.stringify(items));

                // $.ajax({
                //   url: "dirs/delivery/dashboard/actions/update_save_delivery.php",
                //   type: "POST",
                //   data: formData,
                //   processData: false,
                //   contentType: false,
                //   dataType: "json",
                //   success: function (response) {
                //     if (response.isSuccess === "success") {
                //       console.log(`RESPONSE: ${response.message}`);
                //     } else {
                //       console.error("Error submitting data");
                //     }
                //   },
                // });

                console.log(`FORM DATA: ${formData}`);
              }
            });
          });

          qtyCells();
        }
      },
    });
  });
}

function qtyCells() {
  const quantityCells = document.querySelectorAll(
    "#summaryTable td[contenteditable='true']",
  );

  quantityCells.forEach((cell) => {
    // Only allow number keys and control keys
    cell.addEventListener("keydown", function (e) {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
        "Enter",
      ];

      // Allow Ctrl/Cmd + C, V, X, A
      if (e.ctrlKey || e.metaKey) {
        if (["c", "v", "x", "a"].includes(e.key.toLowerCase())) return;
      }

      // Allow only digits and allowedKeys
      if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    });

    // Prevent pasting non-numeric content
    cell.addEventListener("paste", function (e) {
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      if (!/^\d+$/.test(paste.trim())) {
        e.preventDefault();
      }
    });

    // Optional: remove any non-numeric characters if user somehow typed them
    cell.addEventListener("input", function () {
      this.innerText = this.innerText.replace(/\D/g, "");
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load items.",
      });
    },
  });
}
