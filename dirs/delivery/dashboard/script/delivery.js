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

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  let serial = $(this).data("serial");
  let itemCode = $(this).data("itemcode");
  let deliveryNumber = $(this).data("deliverynum");
  let picklistNumber = $(this).data("picklist");
  let brand = $(this).find("td:nth-child(1)").text().trim();
  let model = $(this).find("td:nth-child(2)").text().trim();
  let qty = $(this).find("td:nth-child(3)").text().trim();

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

  loadPicklistBranches(deliveryNumber, picklistNumber, model);

  $("#assignBranchModal").modal("show");
});

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
      Swal.fire({
        icon: "error",
        title: "Server under restoring",
        text: "Please come back later",
        showConfirmButton: true,
        confirmButtonText: "OKAY",
        allowOutsideClick: false,
      }).then(() => {
        $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
          $("#main-content").html(data);
        });
      });
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
        $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
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
function serialDeliveryInput(DeliveryNumber, PicklistDr) {
  const serialCell = document.querySelector(
    "#delivery-serial-table tbody td[contenteditable='true']",
  );

  serialCell.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents creating a new line

      const Serial = this.innerText.trim();

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
              let qty = 1;

              let existingTotal = parseInt($("#summaryQty").text()) || 0;
              let totalQty = existingTotal;

              let $summaryTbody = $("#summaryTable tbody");

              items.forEach(function (item, index) {
                let brand = item.Brand;
                let model = item.Model;
                let category = item.Category;
                let itemCode = item.ItemCode;

                // 🚫 Skip if any required value is null/empty
                if (!brand || !model || !category || !itemCode) {
                  console.warn("Skipped item due to null/empty value:", item);
                  return; // skip this iteration
                }
                totalQty += 1;

                // Check if row already exists
                let $existingRow = $summaryTbody.find(
                  `tr[data-itemcode="${itemCode}"]`,
                );

                rows += `
                  <tr style="height: 40px; min-height: 40px;">
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${brand}</td>
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${model}</td>
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${category}</td>
                    <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">${qty}</td>
                  </tr>`;

                if ($existingRow.length) {
                  // ✅ UPDATE EXISTING ROW
                  let currentQty =
                    parseInt($existingRow.find("td:nth-child(3)").text()) || 0;

                  $existingRow.find("td:nth-child(3)").text(currentQty + 1);

                  $existingRow.attr("data-serial", latestInput);
                  $existingRow.attr("data-itemcode", itemCode);
                } else {
                  // ✅ CREATE NEW ROW
                  let newRow = `
                    <tr data-itemcode="${itemCode}" data-serial="${latestInput}" data-deliverynum="${DeliveryNumber}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                      <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${brand}</td>
                      <td class="align-middle ps-3 summary-row" style="background:#FFFBDF; padding: 3px;">${model}</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">1</td>
                      <td class="align-middle ps-3" style="background:#FFFBDF; padding: 3px">
                        <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">Unassigned</span>
                      </td>
                    </tr>
                  `;

                  // Replace first empty row if exists
                  let $emptyRow = $summaryTbody.find("tr.empty-row").first();

                  if ($emptyRow.length) {
                    $emptyRow.replaceWith(newRow);
                  } else {
                    $summaryTbody.append(newRow);
                  }
                }
              });

              let $emptyDeliveryRow = $(
                "#deliveryTable tbody tr.empty-row",
              ).first();

              if ($emptyDeliveryRow.length) {
                $emptyDeliveryRow.replaceWith(rows);
              } else {
                $("#deliveryTable tbody").append(rows);
              }

              $("#summaryQty").text(totalQty);
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

  if ($.fn.DataTable.isDataTable("#summaryDeliveryTable")) {
    $("#summaryDeliveryTable").DataTable().clear().destroy();
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

  $("#branchToDeliverModal tbody tr").each(function () {
    let branch = $(this).find("td:nth-child(1)").text().trim();
    let model = $(this).find("td:nth-child(2)").text().trim();
    let qty = $(this).find("td:nth-child(3)").text().trim();

    if (!qty || qty === "0") return;

    rowCount++;

    let $emptyRow = $("#summaryDeliveryTable tbody tr.empty-row").first();

    let newRow = $(`
      <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px">
        <td style="background:#FFFBDF" class="text-center">${rowCount}</td>
        <td style="background:#FFFBDF" class="text-primary">${Serial}</td>
        <td style="background:#FFFBDF">${branch}</td>
        <td style="background:#FFFBDF">${brand}</td>
        <td style="background:#FFFBDF" class="text-start">${model}</td>
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
    }
  });
}

function summaryData() {
  let rows = [];

  if (rows.length === 0) {
    for (let i = 0; i < 8; i++) {
      rows.push(["", "", "", "", "", "", ""]);
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

function loadPicklistBranches(deliveryNumber, picklistNumber, model) {
  $.ajax({
    url: "dirs/delivery/dashboard/actions/get_product_distribution_setup.php",
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

        branches.forEach((branch) => {
          let row = `
            <tr>
              <td style="background: #FFF7BC">${branch.ReqBranch}</td>
              <td style="background: #FFF7BC">${model}</td>
              <td style="background: #FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
            </tr>
          `;

          tbody.append(row);
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
}

// NEW ITEM FOR NON-SERIALIZE
function addNonSerialize(ItemSerial, DrNumber, itemCode, picklistDr) {
  $("#frm-add-delivery")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      let quantity = parseInt($("#newQuantity").val()) || 1;

      if (!itemCode) {
        Swal.fire({
          icon: "error",
          title: "Enter the item code",
        });
        return;
      }

      $.ajax({
        url: "dirs/delivery/dashboard/actions/get_branch_stock_serial.php",
        type: "POST",
        data: {
          ItemSerial: ItemSerial,
          DrNumber: DrNumber,
          ItemCode: itemCode,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let item = response.Data[0];

            let existingTotal = parseInt($("#summaryQty").text()) || 0;
            // let totalQty = existingTotal + quantity;

            // Populate brand, model, category
            $("#newBrand").val(item.Brand);
            $("#newModel").val(item.Model);
            $("#newCategory").val(item.Category);

            let $deliveryTbody = $("#deliveryTable tbody");
            let $summaryTbody = $("#summaryTable tbody");

            // ----------- DELIVERY TABLE ----------
            let deliveryRow = `
          <tr style="height: 40px; min-height: 40px;">
            <td style="background:#FFFBDF">${item.Brand}</td>
            <td style="background:#FFFBDF">${item.Model}</td>
            <td style="background:#FFFBDF">${item.Category}</td>
            <td style="background:#FFFBDF">${quantity}</td>
          </tr>
        `;
            let $emptyDeliveryRow = $deliveryTbody.find("tr.empty-row").first();
            if ($emptyDeliveryRow.length) {
              $emptyDeliveryRow.replaceWith(deliveryRow);
            } else {
              $deliveryTbody.append(deliveryRow);
            }

            // ----------- SUMMARY TABLE ----------
            let $existingRow = $summaryTbody.find(
              `tr[data-itemcode="${itemCode}"]`,
            );
            if ($existingRow.length) {
              let currentQty =
                parseInt($existingRow.find("td:nth-child(3)").text()) || 0;
              $existingRow.find("td:nth-child(3)").text(currentQty + quantity);
            } else {
              let summaryRow = `
            <tr data-itemcode="${itemCode}" data-deliverynum="${DrNumber}" data-picklist="${picklistDr}" style="height: 40px; cursor: pointer">
              <td style="background:#FFFBDF">${item.Brand}</td>
              <td style="background:#FFFBDF">${item.Model}</td>
              <td style="background:#FFFBDF">${quantity}</td>
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

            $("#newItemCode").val("");
            $("#newQuantity").val("");
            $("#newBrand").val("").prop("disabled", true);
            $("#newModel").val("").prop("disabled", true);
            $("#newCategory").val("").prop("disabled", true);
            $("#addDeliveryModal").modal("hide");
            $("#summaryQty").text(existingTotal + quantity);
          } else if (response.isSuccess === "empty") {
            Swal.fire({
              icon: "error",
              title: "Unavailable stock for this model",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: response.Data,
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

// CREATE DELIVERY
function createDr(createDeliveryNumber, picklistDr) {
  $.post("dirs/delivery/dashboard/createDr.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    loadImperialBrands();
    serialDeliveryInput(createDeliveryNumber, picklistDr);
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
          $("#pcklstno").val(picklistDr);
          $("#docdate").val(header.DocumentDate);
          $("#origin").val(header.BDestination);
          $("#whcode").val(header.BWhsDestination);
          $("#status").val("NEW");
          $("#prepby").val(header.PreparedBy);

          // MANUAL OR SCAN
          function toggler() {
            const toggler = document.getElementById("serialToggler");
            const knob = document.querySelector(".switch-knob");
            const manual = document.querySelector(".switch-track .manual");
            const scan = document.querySelector(".switch-track .scan");
            const editableCells = document.querySelectorAll(
              "#delivery-serial-table td[contenteditable='true']",
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

          $("#newItemCode").on("keydown", function (e) {
            if (e.key === "Enter") {
              e.preventDefault();

              let itemCode = $(this).val().trim();
              if (!itemCode) return;

              let ItemSerial = "";
              let DrNumber = createDeliveryNumber;

              $.ajax({
                url: "dirs/delivery/dashboard/actions/get_branch_stock_serial.php",
                type: "POST",
                data: { ItemSerial, DrNumber, ItemCode: itemCode },
                dataType: "json",
                success: function (response) {
                  if (response.isSuccess === "success") {
                    let item = response.Data[0];

                    let newBrand = document.getElementById("newBrand");
                    let newModel = document.getElementById("newModel");
                    let newCategory = document.getElementById("newCategory");

                    newBrand.value = item.Brand;
                    newModel.value = item.Model;
                    newCategory.value = item.Category;

                    $("#newQuantity").focus();
                  } else if (response.isSuccess === "empty") {
                    Swal.fire({
                      icon: "error",
                      title: "Unavailable stock for this model",
                    });
                  } else {
                    Swal.fire({ icon: "error", title: response.Data });
                  }
                },
              });

              addNonSerialize("", createDeliveryNumber, itemCode, picklistDr);
            }
          });

          function adjustTotalWidth() {
            const summaryTable = document.getElementById("summaryTable");
            const totalRow = document.getElementById("totalRowOutside");

            if (summaryTable && totalRow) {
              totalRow.style.width = summaryTable.offsetWidth + "px";
            }
          }

          toggler();
          // run on load
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

    let plateInput = document.getElementById("plate");
    let driverInput = document.getElementById("driver");
    let deliveryDate = document.getElementById("deldate");

    // CHECK PLATE
    if (plateInput.value.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Missing Plate Number",
        text: "Enter the truck plate number.",
      }).then(() => {
        plateInput.focus();
      });
      return;
    }

    // CHECK DRIVER
    if (driverInput.value.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Missing Driver",
        text: "Enter the driver's name.",
      }).then(() => {
        driverInput.focus();
      });
      return;
    }

    // CHECK DELIVERY DATE
    if (deliveryDate.value.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Missing Delivery Date",
        text: "Enter a delivery date",
      }).then(() => {
        deliveryDate.focus();
      });
      return;
    }

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

        let hasUnassigned = false;

        $("#summaryDeliveryTable tbody tr").each(function () {
          let badgeText = $(this).find(".badge").text().trim().toLowerCase();
          let serial = $(this).find("td:nth-child(2)").text().trim();
          let branch = $(this).find("td:nth-child(3)").text().trim();
          let brand = $(this).find("td:nth-child(4)").text().trim();
          let model = $(this).find("td:nth-child(5)").text().trim();
          let quantity = $(this).find("td:nth-child(6)").text().trim();
          let itemCode = $(this).find("td:nth-child(7)").text().trim();

          if (badgeText === "unassigned") {
            hasUnassigned = true;
            return false; // break loop
          }

          if (serial !== "" && brand !== "") {
            items.push({
              serial: serial,
              branch: branch,
              brand: brand,
              model: model,
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

        // 🚫 No items check
        if (items.length === 0) {
          Swal.fire({
            icon: "error",
            title: "No items on summary",
            text: "No item(s) found on the summary",
          });
          return;
        }

        let formData = new FormData(document.getElementById("delivery"));
        formData.append("items", JSON.stringify(items));

        console.log(items);

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
      }
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
    url: "dirs/delivery/dashboard/actions/get_prepitem.php",
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
