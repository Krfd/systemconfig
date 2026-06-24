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
    $("#deliveryTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadDelivery();
    // $("#deliveryTableDisplay").DataTable({
    //   pageLength: 50,
    //   order: [0, "desc"],
    // });
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

function returnDelivery() {
  $("#delivery_content").html(spinner);
  $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $("#deliveryTableDisplay tbody").html(`
        <tr>
          <td colspan="100%" class="text-center">${spinner}</td>
        </tr>
      `);
  });
}

$(document).on("click", ".print-dr", function () {
  let branches = $(this).data("branches");

  let branchArray = JSON.parse(
    decodeURIComponent($(this).attr("data-branches")),
  );
  let batchNumber = $(this).attr("data-batch");

  window.open(
    `pdf/delivery.php?batch=${batchNumber}&branches=${encodeURIComponent(JSON.stringify(branchArray))}`,
    "_blank",
  );
});

// DELIVERY DASHBOARD
function loadDelivery() {
  $.ajax({
    url: "dirs/delivery/dashboard/actions/get_displayintransit.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let header = response.Header;
      let info = response.Info;
      let index = 1;

      if (response.isSuccess === "success") {
        let grouped = {};
        let batchInfo = {};

        info.forEach(function (data) {
          let batch = data.BatchBasket_Num;

          if (!grouped[batch]) {
            grouped[batch] = {
              picklists: new Set(),
              branches: new Set(),
            };
          }

          grouped[batch].picklists.add(data.PKList_Number);
          grouped[batch].branches.add(data.RequestingBranch);
        });

        Object.keys(grouped).forEach(function (batch) {
          let picklists = [...grouped[batch].picklists].join(", ");
          let branches = [...grouped[batch].branches].join(", ");

          batchInfo[batch] = {
            picklists: [...grouped[batch].picklists],
            branches: [...grouped[batch].branches],
          };
        });

        header.forEach((item) => {
          let branches = batchInfo[item.BatchNumber]?.branches || [];

          let status = item.DocStatus ? item.DocStatus.toUpperCase() : "";
          let statusClass = "";

          if (status === "NEW" || status === "IN TRANSIT") {
            statusClass = "bg-primary";
          } else if (
            status === "CANCEL" ||
            status === "CANCELLED" ||
            status === "PARTIAL"
          ) {
            statusClass = "bg-warning";
          } else if (status === "DELIVERED") {
            statusClass = "bg-success";
          } else if (status === "TERMINATED") {
            statusClass = "bg-secondary";
          } else if (status === "REJECTED") {
            statusClass = "bg-danger";
          } else if (status === "PROCESSING") {
            statusClass = "bg-info";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          let dropdownItems = `
            <li>
              <a class="dropdown-item open-batch" href="#" data-batch="${item.BatchNumber}" data-delivery-num="${item.DeliveryNumber}">
                Open
              </a>
            </li>
          `;

          if (status !== "TERMINATED") {
            dropdownItems += `
              <li>
                <a class="dropdown-item print-dr" href="#"
                  data-batch="${item.BatchNumber}"
                  data-branches="${encodeURIComponent(JSON.stringify(branches))}">
                  Print DR
                </a>
              </li>
            `;
          }

          rows.push([
            index++,
            item.DeliveryNumber || "",
            item.Driver,
            item.TruckCategory,
            item.TruckPlate,
            item.DeliveryDate
              ? new Date(item.DeliveryDate)
                  .toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })
                  .replace(/\//g, "-")
              : "",
            statusBadge,
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                    ${dropdownItems}
                  </ul>` +
              "</div>",
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", "", "", ""]);
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
            { title: "Driver" },
            { title: "Truck" },
            { title: "Plate No.", className: "ps-3" },
            { title: "Delivery Date", className: "text-start ps-3" },
            { title: "Status" },
            { title: "Action", className: "text-center" },
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
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });

            $("td:eq(0)", row).addClass("text-center");
            $("td:eq(1)", row).addClass("text-primary");
            $("td:eq(3)", row).addClass("text-start ps-3");
            $("td:eq(4)", row).addClass("ps-3");

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
            let tableBody = $("#deliveryTableDisplay tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="8" style="background:#fcf7d4"></td>
                </tr>
              `);

              $($emptyRow).css({
                background: "#fcf7d4",
                height: "40px",
                cursor: "pointer",
              });

              $emptyRow.hover(
                function () {
                  $("td:not(:first-child)", this).css("background", "#FFF4C2");
                },
                function () {
                  $("td:not(:first-child)", this).css("background", "#fcf7d4");
                },
              );

              tableBody.append($emptyRow);
            }
          },
        });
      } else {
        console.error(response.Orders);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading incoming data: ", error);
    },
  });
}

function loadDeliveryDashboard() {
  $("#main-content").html(spinner);
  $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
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

/*Script for selecting model and category*/
$("#newModel").on("change", function () {
  const selected = $(this).find(":selected");
  $("#newCategory").val(selected.data("category") || "");
  $("#itemcode").val(selected.data("itemcode") || "");
});

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  let serial = $(this).data("serial");
  let itemCode = $(this).data("itemcode");
  let deliveryNumber = $(this).data("deliverynum");
  let picklistNumber = $(this).data("picklist");
  let brand = $(this).find("td:nth-child(1)").text().trim();
  let model = $(this).find("td:nth-child(2)").text().trim();
  let category = $(this).find("td:nth-child(3)").text().trim();
  let qty = $(this).find("td:nth-child(4)").text().trim();

  if (!brand && !model && !qty) {
    return;
  }

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
    },
  );
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
        $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
          $("#main-content").html(data);
        });
      });
    }
  });
}

function serialDeliveryInput(DeliveryNumber, PicklistDr, previousSerials) {
  $("#serial-delivery").on("submit", function (e) {
    e.preventDefault(); // Prevents creating a new line
    const serialInput = $("#newSerial");
    const Serial = serialInput.val().trim();
    let lines = Serial.split(/\r?\n/)
      .map((s) => s.replace(/[\u200B\s]+/g, "").trim())
      .filter(Boolean);
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

            Object.values(groupedItems).forEach(function (item) {
              let brand = item.Brand;
              let model = item.Model;
              let category = item.Category;
              let itemCode = item.ItemCode;
              let qty = item.qty;
              if (!brand || !model || !category || !itemCode) {
                console.warn("Skipped item due to null/empty value:", item);
                return;
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
                          <td class="align-middle ps-3" style="background:#fcf7d4; padding: 3px">${brand}</td>
                          <td class="align-middle ps-3" style="background:#fcf7d4; padding: 3px">${model}</td>
                          <td class="align-middle ps-3" style="background:#fcf7d4; padding: 3px">${category}</td>
                          <td class="align-middle ps-3" style="background:#fcf7d4; padding: 3px">${qty}</td>
                        </tr>`;
                    if ($existingRow.length) {
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow.find("td:nth-child(4)").text(currentQty + 1);

                      $existingRow.find("td:nth-child(5)").html(`
                          <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">
                              Unassigned
                          </span>
                      `);

                      $existingRow.attr("data-serial", latestInput);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      let newRow = `
                        <tr data-itemcode="${itemCode}" data-serialbased="true" data-serial="${latestInput}" data-deliverynum="${DeliveryNumber}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                          <td class="align-middle ps-3 summary-row" style="background: #fcf7d4">${brand}</td>
                          <td class="align-middle ps-3 summary-row" style="background: #fcf7d4">${model}</td>
                          <td class="align-middle ps-3 summary-row" style="background: #fcf7d4">${category}</td>
                          <td class="align-middle ps-3" style="background: #fcf7d4">1</td>
                          <td class="align-middle ps-3" style="background: #fcf7d4">
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
                          <td class="align-middle ps-3" style="background: #fcf7d4">${brand}</td>
                          <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                          <td class="align-middle ps-3" style="background: #fcf7d4">${category}</td>
                          <td class="align-middle ps-3" style="background: #fcf7d4">${qty}</td>
                        </tr>`;
                    if ($existingRow.length) {
                      let currentQty =
                        parseInt($existingRow.find("td:nth-child(4)").text()) ||
                        0;
                      $existingRow.find("td:nth-child(4)").text(currentQty + 1);

                      $existingRow.find("td:nth-child(5)").html(`
                          <span class="badge bg-warning rounded-5 d-inline-block p-1 text-light">
                              Unassigned
                          </span>
                      `);

                      $existingRow.attr("data-serial", latestInput);
                      $existingRow.attr("data-itemcode", itemCode);
                    } else {
                      let newRow = `
                          <tr data-itemcode="${itemCode}" data-serial="${latestInput}" data-deliverynum="${DeliveryNumber}" data-picklist="${PicklistDr}" style="height: 40px; min-height: 40px; cursor: pointer">
                            <td class="align-middle ps-3 summary-row" style="background: #fcf7d4">${brand}</td>
                            <td class="align-middle ps-3 summary-row" style="background: #fcf7d4">${model}</td>
                            <td class="align-middle ps-3 summary-row" style="background: #fcf7d4">${category}</td>
                            <td class="align-middle ps-3" style="background: #fcf7d4>1</td>
                            <td class="align-middle ps-3" style="background: #fcf7d4>
                              <span class="badge bg-success rounded-5 d-inline-block p-1 text-light">Assigned</span>
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
                          return false;
                        }
                      });
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
                                <td style="background: #fcf7d4" class="text-center">${rowCount}</td>
                                <td style="background: #fcf7d4" class="text-primary">${Serial}</td>
                                <td style="background: #fcf7d4">${branchName}</td>
                                <td style="background: #fcf7d4">${brand}</td>
                                <td style="background: #fcf7d4" class="text-start">${model}</td>
                                <td style="background: #fcf7d4" class="text-start">${category}</td>
                                <td style="background: #fcf7d4" class="text-center">${qty}</td>
                                <td style="background: #fcf7d4" class="d-none">${itemCode}</td>
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
                            $(this).css("background", "#fcf7d4");
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
    serialInput.val("");
    serialInput.focus();
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

    let $existingRow = $("#summaryDeliveryTable tbody tr").filter(function () {
      return (
        $(this).data("itemcode") == itemCode && $(this).data("branch") == branch
      );
    });

    let newRow = $(`
      <tr data-itemcode="${itemCode}" data-branch="${branch}" style="padding: 3px; height: 40px; min-height: 40px">
        <td style="background: #fcf7d4" class="text-center">${rowCount}</td>
        <td style="background: #fcf7d4" class="text-primary">${Serial}</td>
        <td style="background: #fcf7d4">${branch}</td>
        <td style="background: #fcf7d4">${brand}</td>
        <td style="background: #fcf7d4" class="text-start">${model}</td>
        <td style="background: #fcf7d4" class="text-start">${category}</td>
        <td style="background: #fcf7d4" class="text-center">${qty}</td>
        <td style="background: #fcf7d4" class="d-none">${itemCode}</td>
      </tr>
    `);

    let noSerialRow =
      $(`<tr data-itemcode="${itemCode}" data-branch="${branch}" style="padding: 3px; height: 40px; min-height: 40px">
      <td style="background: #fcf7d4" class="text-center">${rowCount}</td>
      <td style="background: #fcf7d4">${branch}</td>
      <td style="background: #fcf7d4">${brand}</td>
      <td style="background: #fcf7d4" class="text-start">${model}</td>
      <td style="background: #fcf7d4" class="text-start">${category}</td>
      <td style="background: #fcf7d4" class="text-center">${qty}</td>
      <td style="background: #fcf7d4" class="d-none">${itemCode}</td>
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
        $(this).css("background", "#fcf7d4");
      },
    );

    noSerialRow.hover(
      function () {
        $(this).css("background", "#FFF4C2");
      },
      function () {
        $(this).css("background", "#fcf7d4");
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
      $("#summaryTable tbody").empty();
      $("#summaryDeliveryTable tbody").empty();

      for (let i = 0; i < 8; i++) {
        row = `
          <tr style="height: 40px; min-height: 40px">
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
          <td style="background: #fcf7d4"></td>
        </tr>
        `;

        $("#summaryTable tbody").append(row);
        $("#summaryDeliveryTable tbody").append(row);
      }

      let serialRow = `<tr>
          <td rowspan="9" colspan="2" style="background: #fcf7d4" contenteditable="true" style="white-space: pre-wrap;">
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
        background: "#fcf7d4",
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
          $(this).css("background", "#fcf7d4");
        },
      );
    },
    drawCallback: function () {
      let tableBody = $("#summaryDeliveryTable tbody");
      let currentRows = tableBody.find("tr").length;

      for (let i = currentRows; i < 8; i++) {
        let emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="7" style="background: #fcf7d4"></td>
                </tr>
              `);

        $(emptyRow).css({
          background: "#fcf7d4",
          height: "40px",
        });

        emptyRow.hover(
          function () {
            $("td:not(:first-child)", this).css("background", "#FFF4C2");
          },
          function () {
            $("td:not(:first-child)", this).css("background", "#fcf7d4");
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

        let length = branches.length;

        if (branches.length > 1) {
          branches.forEach((branch) => {
            let row = `
            <tr>
              <td style="background: #fcf7d4">${branch.ReqBranch}</td>
              <td style="background: #fcf7d4">${model}</td>
              <td style="background: #fcf7d4">${category}</td>
              <td style="background: #fcf7d4; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
            </tr>
          `;

            tbody.append(row);
          });
        }
        if (callback) callback(length, branches[0].ReqBranch);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
}

// NEW ITEM FOR NON-SERIALIZE
function addNonSerialize(ItemSerial, DrNumber, picklistDr) {
  $("#frm-add-delivery")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      let Brand = $("#newBrand").val();
      let Model = $("#newModel").val();
      let quantity = parseInt($("#newQuantity").val()) || 1;

      $.ajax({
        url: "dirs/delivery/dashboard/actions/get_nonserialized_item.php",
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
              <td style="background: #fcf7d4">${item.Brand}</td>
              <td style="background: #fcf7d4">${item.Model}</td>
              <td style="background: #fcf7d4">${item.Category}</td>
              <td style="background: #fcf7d4" class="ms-3">${quantity}</td>
              <td style="background: #fcf7d4">
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

        // let formObject = Object.fromEntries(formData.entries())

        // PDF DATA
        let pdfData = {
          DeliveryNum: $("#drno").val(),
          PickListNum: $("#pcklstno").val(),
          Branch: $("#origin").val(),
          OriginWhscode: $("#whcode").val(),
          Remarks: $("#remarks").val(),
          SerializedItems: items,
          NonSerializedItems: nonSerializeItems,
        };

        // ================= DEBUG =================
        console.log("Serialized:", items);
        console.log("Non-Serialized:", nonSerializeItems);

        $.ajax({
          url: "dirs/delivery/dashboard/actions/save_dlvry_to_receiving.php",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
          success: function (response) {
            if (response.isSuccess === "success") {
              window.open(
                `pdf/delivery.php?data=${encodeURIComponent(JSON.stringify(pdfData))}`,
                "_blank",
              );
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

// LOAD DELIVERY BASKET
function loadDeliveryBasketContent() {
  if ($.fn.DataTable.isDataTable("#deliveryBasketTable")) {
    $("#deliveryBasketTable").DataTable().clear().destroy();
  }
  $("#main-content").html(spinner);
  $.post("dirs/delivery/dashboard/loadDeliveryBasket.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    loadDeliveryBasket();
  });
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
              item.DateModified || "",
              item.ItemCount || "",
              item.Status || "Partial",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  <li><a class="dropdown-item remove-picklist" href="#" data-picklist="${item.PickList_Num}" data-rownum="${item.RowNumOrder}">Remove</a></li>
                  <li><a class="dropdown-item create-dr" href="#" data-picklist="${item.PickList_Num}">Branch Assignment</a></li>
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
                background: "#fcf7d4",
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
                  $(this).css("background", "#fcf7d4");
                },
              );
            },
            drawCallback: function () {
              let tableBody = $("#deliveryBasketTable tbody");
              let currentRows = tableBody.find("tr").length;

              for (let i = currentRows; i < 8; i++) {
                let $emptyRow = $(`
                <tr class="empty-row">
                  <td colspan="6" style="background: #fcf7d4">&nbsp;</td>
                </tr>
              `);
                $emptyRow.css({
                  background: "#fcf7d4",
                  height: "40px",
                  "min-height": "40px",
                  cursor: "pointer",
                });
                $emptyRow.hover(
                  function () {
                    $(this).css("background", "#FFF4C2");
                  },
                  function () {
                    $(this).css("background", "#fcf7d4");
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
    title: "Remove picklist " + picklistNum + "?",
    text: "This action cannot be change.",
    showCancelButton: true,
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/delivery/dashboard/actions/update_remove_pklist.php",
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

$(document)
  .off("click", "#deliveryTableDisplay tbody .dropdown .open-batch")
  .on(
    "click",
    "#deliveryTableDisplay tbody .dropdown .open-batch",
    function (e) {
      e.preventDefault();

      let DeliveryNum = $(this).data("delivery-num");

      $("#main-content").html(spinner);
      $.post("dirs/delivery/dashboard/deliveryForm.php", function (data) {
        $("#main-content").hide().html(data).fadeIn(200);
        $("#deliveryTable tbody").html(`
          <tr>
            <td colspan="100%" class="text-center">${spinner}</td>
          </tr>
        `);
        openDeliveryForm(DeliveryNum);
      });
    },
  );

function openDeliveryForm(DeliveryNum) {
  $("#deliveryNumber").text(DeliveryNum);
  $.ajax({
    url: "dirs/delivery/dashboard/actions/get_display_delivered.php",
    type: "POST",
    data: { DeliverNum: DeliveryNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rowCount = response.Items.length;
        let totalQty = 0;
        let header = response.Header;
        let items = response.Items;
        let counter = 1;

        $("#drno").val(header.ReferenceNumber);
        $("#docdate").val(header.DocDate);
        $("#origin").val(header.OriginBranch);
        $("#whcode").val(header.OriginWhscode);
        $("#branchName").val(header.ReceivedBranch);
        $("#branchWhCode").val(header.ReceivedWhscode) || "";
        $("#deldate").val(
          new Date(header.SysTimeStamp)
            .toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            })
            .replace(/\//g, "-"),
        );

        $("#docdate").val(
          new Date(header.PostingDate)
            .toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            })
            .replace(/\//g, "-"),
        );
        $("#status").val(header.ReceivedStatus);
        $("#truckCat").val(header.TruckCategory);
        $("#plate").val(header.TruckPlate);
        $("#driver").val(header.Driver);
        $("#remarks").val(header.Remarks);

        items.forEach(function (item, index) {
          let key = `${item.ItemBrand}|${item.ItemModel}`;
          if (!groupedItems[key]) {
            groupedItems[key] = {
              ItemBrand: item.ItemBrand,
              ItemModel: item.ItemModel,
              ItemCategory: item.ItemCategory,
              ReceivedQty: 0,
              ItemCode: item.ItemCode,
            };
          }
          groupedItems[key].ReceivedQty += parseFloat(item.ReceivedQty) || 0;
        });

        let rows = "";

        Object.values(groupedItems).forEach(function (item) {
          totalQty += item.ReceivedQty;
          rows += `
            <tr style="height: 40px; min-height: 40px; cursor: pointer">
              <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${counter++}</td>
              <td class="align-middle ps-3 text-primary" style="background: #fcf7d4">${item.ItemBrand}</td>
              <td class="align-middle ps-1" style="background: #fcf7d4">${item.ItemModel}</td>
              <td class="align-middle ps-3" style="background: #fcf7d4">${item.ItemCategory}</td>
              <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${parseInt(item.ReceivedQty, 10)}</td>
            </tr>
          `;
        });
        $("#totalQuantity").text(totalQty);
        $("#deliveryTable tbody").html(rows);

        let deliveredTable = $("#deliveryTable tbody tr").length;
        if (deliveredTable < 8) {
          let emptyRowsNeeded = 8 - deliveredTable;
          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
                  <tr class="item-row empty-row" style="height: 50px; min-height: 50px;">
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                    <td style="background:  #fcf7d4"></td>
                  </tr>
              `;
            $("#deliveryTable tbody").append(emptyRow);
          }
        }
      } else {
        console.error(response.error);
      }
    },
    error: function (xhr, status, error) {
      console.error(xhr.responseText);
    },
  });
}
