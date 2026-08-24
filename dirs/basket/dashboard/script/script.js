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
  $("#basket_content").html(spinner);
  $.post("dirs/basket/dashboard/components/main.php", {}, function (data) {
    $("#basket_content").hide().html(data).fadeIn(200);
    $("#basketTableDashboard tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadDeliveryBasket(
      "#basketTableDashboard",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
      "UNASSIGNED",
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
    // setTimeout(function () {
    loadDeliveryItems(PickLst_Num);
    // }, 200);
  },
);

// PICKLIST BASKET DROPDOWN TO PICKLIST ITEMS
$(document).on("click", ".dropdown .open-picklisted", function (e) {
  // ORIGINAL
  let Picklist = $(this).closest("tr").attr("data-picklist");
  deliveryPicklistNum = Picklist;
  $("#basket_content").html(spinner);
  loadDeliveryItems(Picklist);

  // e.preventDefault();
  // const picklist = $(this).data("picklist");
  // deliveryPicklistNum = picklist;
  // $("#basket_content").html(spinner);
  // loadDeliveryItems(picklist);
});

// BRANCH ASSIGNMENT
$(document).on("click", ".datatables .dropdown .assign-branch", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let basketRow = $(this).closest("tr");
  let picklist = $(this).data("picklist");
  let branches = $(this).data("branches");

  $("#main-content").html(spinner);
  // setTimeout(function () {
  $.post("dirs/basket/dashboard/branchAssignment.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    let summaryTable = $("#summaryTable tbody");
    summaryTable.html(`
      <tr>
        <td colspan="6" class="text-center align-middle" style="height:300px;">
            <div style="height:300px; display:flex; align-items:center; justify-content:center;">
              ${spinner}
            </div>
        </td>
      </tr>
    `);
    assignBranch(picklist, branches);
    // }, 200);
  });
});

// EDIT ASSIGNMENT
$(document).on("click", ".edit-branch", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let picklist = $(this).data("picklist");
  let branches = $(this).data("branches");

  $("#main-content").html(spinner);
  $.post("dirs/basket/dashboard/editAssignment.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    // setTimeout(function () {
    let summaryTable = $("#editSummaryTable tbody");
    summaryTable.html(`
      <tr>
        <td colspan="6" class="text-center align-middle" style="height:300px;">
            <div style="height:300px; display:flex; align-items:center; justify-content:center;">
              ${spinner}
            </div>
        </td>
      </tr>
    `);
    editAssignBranch(picklist, branches);
    // }, 200);
  });
});

function loadDeliveryBasketContent() {
  if ($.fn.DataTable.isDataTable("#basketTableDashboard")) {
    $("#basketTableDashboard").DataTable().clear().destroy();
  }
  $("#basket_content").html(spinner);
  $.post("dirs/basket/dashboard/basket.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $("#basketTableDashboard tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadDeliveryBasket(
      "#basketTableDashboard",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
      "UNASSIGNED",
    );
    $("#loadDeliveryBtn").prop("disabled", true);
  });
}

$(document).on("shown.bs.tab", 'button[data-bs-toggle="tab"]', function () {
  const target = this.id;

  if (target === "unassigned-tab") {
    $("#basketTableDashboard tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadDeliveryBasket(
      "#basketTableDashboard",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
      "UNASSIGNED",
    );
    $("#loadDeliveryBtn").prop("disabled", true);
  } else if (target === "assigned-tab") {
    $("#basketTableAssigned tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    loadDeliveryBasket(
      "#basketTableAssigned",
      "dirs/incoming/dashboard/actions/picklisteditems.php",
      "ASSIGNED",
    );
    $("#loadDeliveryBtn").prop("disabled", false);
  }
});

function loadDeliveryBasket(tableId, url, statusFilter = null) {
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

      if (statusFilter) {
        sortedData = sortedData.filter((item) => {
          const status = item.PickListStatus;

          // console.log(
          //   `PICK LIST: ${item.PKList_Number} - FILTERING STATUS: ${status} - BRANCH: ${item.Req_Branch}`,
          // );

          if (statusFilter === "UNASSIGNED") {
            // return status === "NEW" || status === "PROCESSING";
            return status === "PROCESSING";
          }

          if (statusFilter === "ASSIGNED") {
            // return status === "ASSIGNED";
            return status !== "NEW" && status !== "PROCESSING";
          }

          return true;
        });
      }

      let rows = [];
      let grouped = {};

      sortedData.forEach((item) => {
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

          const hasInvalidQty = item.items.some((row) => {
            const qty = row.Actual_Item_Qty;

            return (
              qty === null || qty === undefined || String(qty).trim() === ""
            );
          });

          if (hasInvalidQty) {
            return;
          }

          const isDisabledAttr =
            item.PickListStatus !== "PROCESSING" ? "disabled" : "";

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.DocEntry}" data-docentry="${item.DocEntry}" data-docstatus="${item.PickListStatus}" ${isDisabledAttr}
            class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer">`,
            item.PKList_Number || "",
            item.RequestItemQty || "",
            (() => {
              let status = item.PickListStatus || "";

              if (status === "NEW" || status === "PROCESSING")
                status = "UNASSIGNED";

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
                    <li>
                      <a class="dropdown-item ${
                        item.PickListStatus === "ASSIGNED"
                          ? "edit-branch"
                          : "assign-branch"
                      }"
                        href="#"
                        data-picklist="${item.PKList_Number}"
                        data-lbNum="${item.DocEntry}"
                        data-branches="${branches}">
                        ${
                          item.PickListStatus === "ASSIGNED"
                            ? "Edit Assignment"
                            : "Set Assignment"
                        }
                      </a>
                    </li>
                </ul>
              </div>`,
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        destroyAllTooltips();

        if ($.fn.DataTable.isDataTable(tableId)) {
          $(tableId).DataTable().clear().destroy();
        }

        $(tableId).DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
            { title: "Picklist No." },
            { title: "Quantity", className: "text-center" },
            {
              title: "Status",
              className: "ps-3",
            },
            { title: "", orderable: false },
          ],
          createdRow: function (row, data, dataIndex) {
            let originalItem = Object.values(grouped)[dataIndex];
            if (originalItem) {
              // Group items by branch
              const branchQuantities = {};

              originalItem.items.forEach((item) => {
                const branch = item.Req_Branch || "No Branch";
                const qty = Number(item.RequestItemQty) || 0;

                if (!branchQuantities[branch]) {
                  branchQuantities[branch] = 0;
                }

                branchQuantities[branch] += qty;
              });

              // Convert to:
              // STA. BARBARA: 4
              // SHOWROOM: 8
              const branchList = Object.entries(branchQuantities).map(
                ([branch, quantity]) => {
                  return `${branch}: ${quantity}`;
                },
              );

              const branches = Object.keys(branchQuantities).join(", ");

              console.log(
                `UNASSIGNED PICK LIST: ${originalItem.PKList_Number} STATUS: ${originalItem.PickListStatus} - BRANCHES: ${branches}`,
              );

              $(row)
                .attr("data-rownum", originalItem.DocEntry)
                .attr("data-picklist", originalItem.PKList_Number)
                .attr("data-branches", branches)
                .attr(
                  "data-bs-title",
                  `<div class="text-start">
                    Branches:<br>
                    ${branchList.join("<br>") || "No Branch"}
                  </div>`,
                );
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
              background: "#fcf7d4",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $("td:eq(1)", row).addClass("text-primary text-center");
            // $("td:eq(1)", row).css("text-align", "start");
            $("td:eq(2)", row).css("text-align", "start");
            $("td:eq(3)", row).css("text-align", "start");

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
            let tableBody = $(tableId + " tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                  <tr class="empty-row">
                    <td>&nbsp;</td>
                    <td colspan="4" style="background: #fcf7d4">&nbsp;</td>
                  </tr>
                `);

              $emptyRow.css({
                background: "#fcf7d4",
                height: "40px",
                "min-height": "40px",
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

            const selectionMode =
              $("#basketTableAssigned").data("selectionMode") || false;

            $(tableId + " tbody tr").each(function () {
              const existingTooltip = bootstrap.Tooltip.getInstance(this);
              if (existingTooltip) {
                existingTooltip.dispose();
              }

              new bootstrap.Tooltip(this, {
                placement: "right",
                trigger: "hover",
                container: "body",
                html: true,
              });
            });

            $(tableId + " tbody")
              .off("show.bs.dropdown hide.bs.dropdown click.dropdownAction")
              .on("show.bs.dropdown", ".dropdown", function () {
                const row = $(this).closest("tr")[0];

                const tooltipInstance = bootstrap.Tooltip.getInstance(row);
                if (tooltipInstance) {
                  tooltipInstance.dispose();
                }
                document
                  .querySelectorAll(".tooltip")
                  .forEach((el) => el.remove());
              })
              .on("hide.bs.dropdown", ".dropdown", function () {
                const row = $(this).closest("tr")[0];
                const instance = bootstrap.Tooltip.getInstance(row);

                if (instance) {
                  instance.dispose();
                }
              })
              .on("click.dropdownAction", ".dropdown-item", function () {
                const row = $(this).closest("tr")[0];

                const tooltipInstance = bootstrap.Tooltip.getInstance(row);

                if (tooltipInstance) {
                  tooltipInstance.dispose();
                }

                document
                  .querySelectorAll(".tooltip")
                  .forEach((el) => el.remove());
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

function destroyAllTooltips() {
  // document.querySelectorAll('[data-bs-title]')
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    const instance = bootstrap.Tooltip.getInstance(el);

    if (instance) {
      instance.hide();
      instance.dispose(); // completely remove tooltip
    }
  });

  // remove any orphaned tooltip elements
  document.querySelectorAll(".tooltip").forEach((tooltip) => {
    tooltip.remove();
  });
}

$(document).on("click", ".open-picklisted", function () {
  // document.querySelectorAll('[data-bs-title]')
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    const instance = bootstrap.Tooltip.getInstance(el);

    if (instance) {
      instance.dispose();
    }
  });
  document.querySelectorAll(".tooltip").forEach((el) => el.remove());
});

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

      const checkbox = row.find("input[type='checkbox']");

      if (statusText === "ASSIGNED" || statusText === "NEW") {
        checkbox.css("display", "inline-block");
        checkbox.prop("disabled", false);
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

  Swal.fire({
    icon: "question",
    title: "Add selected pickist(s) to loading basket?",
    confirmButtonText: "Add",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      $("#main-content").html(spinner);
      setTimeout(function () {
        loadToBasket(PickListNum);
      }, 200);
    }
  });
}

function selectAll() {
  const checkboxes = $("#basketTableAssigned tbody .checkbox:visible").not(
    ":disabled",
  );

  if (checkboxes.length === 0) return;

  // Check if all valid checkboxes are already checked
  // const allChecked = checkboxes.length === checkboxes.filter(":checked").length;
  const checkedBoxes = checkboxes.filter(":checked");
  const allChecked = checkboxes.length === checkedBoxes.length;

  if (allChecked) {
    // Uncheck all
    checkboxes.prop("checked", false);
    $("#selectAllBtn").text("Select All");
  } else {
    // ORIGINAL
    // checkboxes.prop("checked", true);
    // $("#selectAllBtn").text("Deselect All");

    // Select only up to 5 unchecked checkboxes
    const remainingSlots = 5 - checkedBoxes.length;

    if (remainingSlots <= 0) {
      Swal.fire({
        icon: "warning",
        title: "You can only select up to 5 rows",
        confirmButtonText: "OKAY",
      });
      return;
    }

    checkboxes.not(":checked").slice(0, remainingSlots).prop("checked", true);

    // Update button text
    const totalChecked = checkboxes.filter(":checked").length;

    $("#selectAllBtn").text(
      totalChecked === checkboxes.length ? "Deselect All" : "Select All",
    );
  }
}

// Optional: Prevent manual checking beyond 5
$(document).on("change", "#basketTableAssigned tbody .checkbox", function () {
  const checkedCount = $("#basketTableAssigned tbody .checkbox:checked").length;

  if (checkedCount > 5) {
    this.checked = false;
    Swal.fire({
      icon: "warning",
      title: "You can only select up to 5 rows",
      confirmButtonText: "OKAY",
    });
  }
});

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
      let serialRow = [];

      $("#summaryTable tbody").empty();
      $("#basket-serial-table tbody").empty();

      for (let i = 0; i < 8; i++) {
        row = `
          <tr>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
        </tr>
        `;

        $("#summaryTable tbody").append(row);
      }

      for (let j = 0; j < 5; j++) {
        serialRow = `
          <tr>
            <td style="background: #fcf7d4; height: 40px"></td>
            <td style="background: #fcf7d4; height: 40px"></td>
            <td style="background: #fcf7d4; height: 40px"></td>
          </tr>
        `;

        $("#basket-serial-table tbody").append(serialRow);
      }
    }
  });
}

function clearLoadingTable() {
  Swal.fire({
    icon: "question",
    title: "Are you sure to clear this table?",
    confirmButtonText: "Clear",
    showCancelButton: true,
    cancelButtonColor: "#d33",
  }).then((res) => {
    if (res.isConfirmed) {
      let row = [];

      $("#loadBasketTable tbody").empty();

      for (let i = 0; i < 8; i++) {
        row = `
          <tr>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
          <td style="background: #fcf7d4; height: 40px;"></td>
        </tr>
        `;

        $("#loadBasketTable tbody").append(row);
        $("#loadingQty").text("0");
      }
    }
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
        parseInt($cell.closest("tr").find("td:eq(4)").text()) || 0;
      let currentVal = parseInt(val) || 0;

      let exceeded = currentVal > actualQty;
      $cell.css("border", exceeded ? "2px solid #dc3545" : ""); // reset border if valid
      if (exceeded) hasError = true;

      let remaining = currentVal < actualQty;
      $cell.css("border", remaining ? "2px solid #dc3545" : ""); // reset border if valid
      if (remaining) hasError = true;
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
    });

    editableCells.each(function () {
      let val = $(this).text().trim();

      // reset first
      $(this).css("border", "").removeAttr("data-error");

      // EMPTY → warning state
      if (val === "") {
        $(this).css("border", "2px solid #ffc107");
        return;
      }
    });

    if (sum !== actualQty) {
      editableCells.each(function () {
        let val = $(this).text().trim();

        if (val !== "") {
          $(this).css("border", "2px solid #dc3545").attr("data-error", "true");
        }
      });
    } else {
      editableCells.each(function () {
        let val = $(this).text().trim();

        if (val !== "") {
          $(this).css("border", "").removeAttr("data-error");
        }
      });
    }

    totalAssigned += sum;
  });

  $("#branchTotalsContainer .branch-total").each(function () {
    let branch = $(this).data("branch");
    $(this).text(branchTotals[branch] || 0);
  });

  let balance = totalActual - totalAssigned;
  // $("#balanceQty").text(balance >= 0 ? balance : 0);
  $("#balanceQty").text(balance);
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
  // $.post("dirs/basket/dashboard/branchAssignment.php", {}, function (data) {
  //   $("#main-content").hide().html(data).fadeIn(200);
  // summaryTable.html(`
  //   <tr>
  //     <td colspan="6" class="text-center align-middle" style="height:300px;">
  //         <div style="height:300px; display:flex; align-items:center; justify-content:center;">
  //           ${spinner}
  //         </div>
  //     </td>
  //   </tr>
  // `);
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
              <th class="text-secondary text-center">Actual Quantity</th>
          `;

        branches.forEach((branch) => {
          headerRow += `<th class="text-secondary text-center">${branch}</th>`;
        });

        headerRow += `</tr>`;

        $("#summaryTable thead").html(headerRow);

        const date = new Date(header.DocDate);

        const formattedDate =
          String(date.getMonth() + 1).padStart(2, "0") +
          "/" +
          String(date.getDate()).padStart(2, "0") +
          "/" +
          // String(date.getFullYear()).slice(-2);
          date.getFullYear();

        $("#pcklstno").val(header.PKList_Number);
        // $("#docdate").val(header.DocDate.substring(0, 10));
        $("#docdate").val(formattedDate);
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
                <td class="align-middle ps-3 text-center" style="background: ##F7F7F7">${Math.trunc(Number(unit.Actual_Item_Qty))}</td>
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

            let val = editableBranches.length === 1 && isEditable ? rawVal : "";

            row += `
                <td class="align-middle ps-3 text-center" data-branch="${branch}"
                    ${isEditable ? 'contenteditable="true"' : ""}
                    style="background: ${isEditable ? "#fcf7d4" : "#F7F7F7"}; cursor: ${isEditable ? "text" : "default"}; outline: none;"
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
          .on("input", "#summaryTable td[contenteditable='true']", function () {
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
          });

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
  // });
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

          const date = new Date(header.DocDate);

          const formattedDate =
            String(date.getMonth() + 1).padStart(2, "0") +
            "/" +
            String(date.getDate()).padStart(2, "0") +
            "/" +
            date.getFullYear();

          $("#pcklstno").val(header.PKList_Number);
          $("#docdate").val(formattedDate);
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
                    style="background: ${isEditable ? "#fcf7d4" : "#F7F7F7"}; cursor: ${isEditable ? "text" : "default"}; outline: none;"
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
  $(document)
    .off("click", "#branchAssignmentBtn")
    .on("click", "#branchAssignmentBtn", function (e) {
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
            text: "Entered values does not match the actual quantity.",
          });
          return;
        }
      }

      let commitButton = $("#branchAssignmentBtn");

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

          // let commitButton = $(this).find("button[type='submit'].commit-btn");
          // let commitButton = $("#branchAssignmentBtn");
          commitButton
            .prop("disabled", true)
            .html(
              `<span class="spinner-border spinner-border-sm"></span> Saving`,
            );

          let hasUnassigned = false;

          $("#summaryTable tbody tr.item-row").each(function () {
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

          if (hasUnassigned) {
            Swal.fire({
              icon: "error",
              title: "Unassigned Items Found",
              text: "Please assign all items before submitting.",
            });
            commitButton.prop("disabled", false).html("Commit");
            return;
          }

          // if (items.length === 0 && nonSerializeItems.length === 0) {
          if (items.length === 0) {
            Swal.fire({
              icon: "error",
              title: "No items on summary",
              text: "No item(s) found on the summary",
            });
            commitButton.prop("disabled", false).html("Commit");
            return;
          }

          let formData = new FormData();

          // formData.append("BatchNum", $("#lbnum").val());
          formData.append("PickListNumber", $("#pcklstno").val());
          formData.append("Branch", $("#origin").val());
          formData.append("OrginWhscode", $("#whcode").val());
          formData.append("Remarks", $("#remarks").val());

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
                commitButton.prop("disabled", false).html(`Commit`);
                Swal.fire({
                  icon: "success",
                  title: "Items has been assigned",
                }).then(() => {
                  loadDeliveryBasketContent();
                });
              } else {
                commitButton.disabled = false;
                commitButton.innerHTML = "Commit";
                Swal.fire({
                  icon: "error",
                  title: "Failed",
                  text: response.message || "Error submitting data",
                });
              }
            },
            error: function (xhr) {
              commitButton.disabled = false;
              commitButton.innerHTML = "Commit";
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
  // let commitBtn = document.getElementById("editBranchAssignmentBtn");

  // commitBtn.addEventListener("click", function (e) {
  //   e.preventDefault();
  $(document)
    .off("click", "#editBranchAssignmentBtn")
    .on("click", "#editBranchAssignmentBtn", function (e) {
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

          // console.log(`ITEMS TO SUBMIT : ${JSON.stringify(items)}`);

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

          let commitBtn = $("#editBranchAssignmentBtn");

          commitBtn
            .prop("disabled", true)
            .html(
              `<span class="spinner-border spinner-border-sm"></span> Saving`,
            );

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
                commitBtn.disabled = false;
                commitBtn.innerHTML = "Save";
                Swal.fire({
                  icon: "error",
                  title: "Failed",
                  text: response.message || "Error submitting data",
                });
              }
            },
            error: function (xhr) {
              commitBtn.disabled = false;
              commitBtn.innerHTML = "Save";
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
                background: "#fcf7d4",
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
                  $(this).css("background", "#fcf7d4");
                },
              );
            },
            drawCallback: function () {
              let tableBody = $("#loadingBasketTable tbody");
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

// LOAD DELIVERY ITEMS
function loadDeliveryItems(PickLst_Num) {
  $.post("dirs/basket/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);
    $("#deliveryItemsTable tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);
    $.ajax({
      // url: "dirs/basket/dashboard/actions/get_loading_breakdown.php",
      url: "dirs/incoming/dashboard/actions/get_picklist_items.php",
      type: "POST",
      data: { PicklistNumber: PickLst_Num },
      dataType: "json",
      _success: function (response) {
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
                ToDeliver_Qty: item.ToDeliver_Qty || 0,
              };
            }

            grouped[key].Quantity += Math.trunc(
              // grouped[key].Actual_Quantity += Math.trunc(
              // Number(item.Actual_Quantity) || 0,
              Number(item.Quantity) || 0,
            );
          });

          Object.values(grouped).forEach((item) => {
            rows.push([
              item.Brand,
              item.Model,
              item.Category,
              item.ToDeliver_Qty ? item.ToDeliver_Qty : item.Quantity,
            ]);
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
                background: "#fcf7d4",
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
                  $(this).css("background", "#fcf7d4");
                },
              );
            },
            drawCallback: function () {
              let tableBody = $("#deliveryItemsTable tbody");
              let currentRows = tableBody.find("tr").length;

              for (let i = currentRows; i < 8; i++) {
                let $emptyRow = $(`
                  <tr class="empty-row">
                    <td colspan="4" style="background: #fcf7d4">&nbsp;</td>
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
      get success() {
        return this._success;
      },
      set success(value) {
        this._success = value;
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

  // Disable previous dates for ETA only
  document.getElementById("eta").min = todayStr;
}

// function getBatchItems(batchContainer) {
//   $.ajax({
//     url: "dirs/basket/dashboard/actions/get_batchitems.php",
//     type: "POST",
//     data: { BatchNumber: batchContainer },
//     dataType: "json",
//     success: function (response) {
//       let items = response.Data;
//       let deliveryTable = $("#deliveryFormTable tbody");
//       let totalQty = 0;
//       let counter = 0;

//       if (response.isSuccess === "success") {
//         let groupedItems = {};

//         items.forEach((item) => {
//           let code = item.ItemCode;

//           if (!groupedItems[code]) {
//             groupedItems[code] = {
//               ...item,
//               Deliver_Qty: parseInt(item.Deliver_Qty) || 0,
//             };
//           } else {
//             groupedItems[code].Deliver_Qty += parseInt(item.Deliver_Qty) || 0;
//           }
//         });

//         // items.forEach((item) => {
//         Object.values(groupedItems).forEach((item) => {
//           console.log(`ITEM: ${JSON.stringify(item)}`);

//           counter += 1;

//           totalQty += item.Deliver_Qty;

//           let row = `
//             <tr class="item-row" style="height: 40px; min-height:40px; cursor: pointer;" data-itemCode="${item.ItemCode}">
//               <td class="align-middle ps-3" style="background: #FFFBDF;">${counter}</td>
//               <td class="align-middle ps-3 item-brand" style="background: #FFFBDF;">${item.ItemBrand}</td>
//               <td class="align-middle ps-3 item-model" style="background: #FFFBDF;">${item.Model}</td>
//               <td class="d-none item-code">${item.ItemCode}</td>
//               <td class="align-middle ps-3 item-category" style="background: #FFFBDF;">${item.ItemCategory}</td>
//               <td class="align-middle ps-3 text-center item-quantity" style="background: #FFFBDF;">${item.Deliver_Qty}</td>
//               <td class="align-middle ps-3" style="background: #FFFBDF;"></td>
//             </tr>
//           `;

//           deliveryTable.append(row);
//         });

//         $("#delTotalQuantity").text(totalQty);

//         for (let j = items.length; j <= 8; j++) {
//           let emptyRow = $(`
//               <tr class="empty-row">
//                 <td colspan="6" style="background: #FFFBDF"></td>
//               </tr>`);

//           $(emptyRow).css({
//             background: "#FFFBDF",
//             height: "40px",
//           });

//           emptyRow.hover(
//             function () {
//               $("td:not(:first-child)", this).css("background", "#FFF4C2");
//             },
//             function () {
//               $("td:not(:first-child)", this).css("background", "#FFFBDF");
//             },
//           );

//           deliveryTable.append(emptyRow);
//         }
//       }
//     },
//   });
// }

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
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_truckcategories.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        const categories = response.Categories;

        $("#truckCat")
          .empty()
          .append('<option value="">Select Category</option>');
        categories.forEach((cat) => {
          $("#truckCat").append(
            $("<option>", {
              value: cat.category,
              text: cat.category,
            }),
          );
        });
      }
    },
  });
}

$(document).on("change", "#truckCat", function () {
  $("#newModel").html('<option value="">Select Plate Number</option>');
  loadTruckPlates();
});

async function loadTruckPlates() {
  let truckCategory = $("#truckCat").val();
  // console.log("Category sent:", truckCategory);
  $("#plate").html('<option value="">Loading...</option>');

  if (!truckCategory) {
    $("#plate").html('<option value="">Select Category first</option>');
    return;
  }

  $.ajax({
    url: "dirs/basket/dashboard/actions/get_truckplates.php",
    type: "POST",
    dataType: "json",
    data: {
      category: truckCategory,
    },
    success: function (response) {
      if (response.isSuccess === "success") {
        const plates = response.Plates;

        try {
          $("#plate")
            .empty()
            .append('<option value="">Select Plate Number</option>');
          plates.forEach((plate) => {
            $("#plate").append(
              $("<option>", {
                value: plate.plate,
                text: plate.plate,
              }),
            );
          });
        } catch (e) {
          console.error("Failed to parse truck plates response:", e);
        }
      }
    },
    error: function (xhr) {
      console.log("AJAX ERROR");
      console.log(xhr.responseText);
    },
  });
}

// ORIGINAL
function createDr() {
  $("#main-content").html(spinner);
  $.post("dirs/basket/dashboard/createDr.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    get_userinfo();
    deliveryDate();
    // getBatchItems(batchContainer);
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

function loadToBasket(Picklists) {
  $.post("dirs/basket/dashboard/loadToBasket.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    $.ajax({
      url: "dirs/basket/dashboard/actions/get_user.php",
      type: "POST",
      dataType: "json",
      success: function (user) {
        let pickedBy = user.Data.Fullname;
        $("#prepby").val(pickedBy);
      },
    });

    getDeliveryDetails();
    deliveryDate();
    serialDeliveryInput(Picklists);
    loadImperialBrands();
    addNonSerialize(Picklists);
    submitLoadingBasket(Picklists);
    initializeEmptySerialRows();

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

    // $("#batch").val(batch);
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    $("#docdate").val(formattedDate);

    let loadingTable = $("#loadBasketTable tbody");
    let rows = loadingTable.length;

    for (i = 0; i < 8; i++) {
      let emptyRow = $(`
        <tr style="height: 40px">
          <td class="ps-3" style="background: #fcf7d4"></td>
          <td class="ps-3" style="background: #fcf7d4"></td>
          <td class="ps-3" style="background: #fcf7d4"></td>
          <td class="ps-3" style="background: #fcf7d4"></td>
          <td class="ps-3" style="background: #fcf7d4"></td>
        </tr>
      `);
      loadingTable.append(emptyRow);
    }
  });
}

function serialDeliveryInput(Picklists) {
  $(document).off("submit", "#serial-delivery");
  $(document).on("submit", "#serial-delivery", function (e) {
    e.preventDefault();

    // DISABLE ADD BUTTON
    const serializeBtn = $("#serializeBtn");
    serializeBtn.prop("disabled", true);

    const serialInput = $("#newSerial");
    const Serial = serialInput.val().trim();
    let lines = Serial.split(/\r?\n/)
      .map((s) => s.replace(/[\u200B\s]+/g, "").trim())
      .filter(Boolean);
    let latestInput = lines[lines.length - 1] || "";
    let ItemCode = "";
    if (Serial) {
      $.ajax({
        url: "dirs/basket/dashboard/actions/get_testscanning.php",
        type: "POST",
        data: {
          ItemSerial: Serial,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;
            let rows = [];
            let existingTotal = parseInt($("#loadingQty").text()) || 0;
            let totalQty = existingTotal;
            let loadingTableBody = $("#loadBasketTable tbody");
            let basketSerialTable = $("#basket-serial-table tbody");

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

            items.forEach((item, index) => {
              if (!item.Itemcode) return;

              if (!groupedItems[item.Itemcode]) {
                groupedItems[item.Itemcode] = {
                  ...item,
                  qty: 0,
                  Item_id: null,
                  picklist: null,
                  loadedQty: 0,
                  items: [],
                };
              }

              groupedItems[item.Itemcode]._scanId = scanId;

              $.ajax({
                url: "dirs/basket/dashboard/actions/get_actual_total.php",
                type: "POST",
                data: {
                  Picklists: Picklists,
                  ItemCode: item.Itemcode,
                },
                dataType: "json",
                success: function (res) {
                  if (res.isSuccess !== "success") {
                    return;
                  }

                  let totalActualPerModel =
                    parseInt(res.Data?.[0]?.Total_Actual_Item_Qty) || 0;

                  // console.log(`TOTAL ACTUAL  : ${totalActualPerModel}`);

                  $.ajax({
                    url: "dirs/basket/dashboard/actions/get_dsplaybatch_models.php",
                    type: "POST",
                    data: { Picklists: Picklists, ItemCode: item.Itemcode },
                    dataType: "json",
                    success: function (response) {
                      let data = response.Data;
                      if (
                        response.isSuccess === "success" &&
                        data &&
                        data.length > 0
                      ) {
                        Object.values(groupedItems).forEach(function (item) {
                          let brand = item.ItemBrand;
                          let model = item.ItemName;
                          let category = item.ItemCategory;
                          let itemCode = item.Itemcode;
                          let qty = 1;
                          let reqQty = parseInt(data[0].Req_Item_Qty) || 0;

                          // let itemId = data.map((row) => row.Item_id);
                          // groupedItems[itemCode].Item_id = itemId;
                          // let picklist = data?.[0]?.PKList_Number ?? null;

                          let itemMappings = data.map((row) => ({
                            item_id: row.Item_id,
                            picklist: row.PKList_Number,
                          }));

                          groupedItems[itemCode].itemMappings = itemMappings;

                          if (!groupedItems[itemCode].items) {
                            groupedItems[itemCode].items = [];
                          }

                          groupedItems[itemCode].items.push({
                            item_id: data.map((row) => row.Item_id),
                            picklist: data.map((row) => row.PKList_Number),
                            serial: item.ItemSerial,
                          });

                          if (!brand || !model || !category || !itemCode) {
                            console.warn(
                              "Skipped item due to null/empty value:",
                              item,
                            );
                            return;
                          }

                          if (item._scanId !== scanId) {
                            return;
                          }

                          const modelKey = item.ItemName.trim().toUpperCase();
                          const serialKey = latestInput.trim().toUpperCase();

                          const rowKey = `${modelKey}|${serialKey}`;
                          const itemKey = modelKey;

                          let existingRow = loadingTableBody.find(
                            `tr[data-rowkey="${rowKey}"]`,
                          );

                          let existingItem = loadingTableBody.find(
                            `tr[data-itemkey="${itemKey}"]`,
                          );

                          // DUPLICATE SERIAL
                          const duplicateSerial = loadingTableBody
                            .find("tr[data-serials]")
                            .toArray()
                            .some((row) => {
                              const serials = (
                                $(row).attr("data-serials") || ""
                              )
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

                          let currentLoaded =
                            groupedItems[itemCode].loadedQty || 0;

                          if (currentLoaded >= totalActualPerModel) {
                            Swal.fire({
                              icon: "error",
                              title: "Limit reached",
                              text: `This item has already reached its maximum allowed quantity.`,
                            });
                            serializeBtn.prop("disabled", false);
                            return;
                          }

                          const serial = item.ItemSerial;

                          const tableElement = document.querySelector(
                            "#basket-serial-table",
                          );

                          const serialExisted = $(
                            "#basket-serial-table tbody tr td:nth-child(3)",
                          )
                            .toArray()
                            .some((td) => $(td).text().trim() === latestInput);

                          if (!serialExisted) {
                            let serialRow = `
                              <tr style="height: 40px; min-height: 40px; cursor: pointer">
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${itemCode}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${Serial}</td>
                              </tr>
                            `;

                            let serialTableBody = $(
                              "#basket-serial-table tbody",
                            );

                            // find first empty preset row
                            let emptyRow = serialTableBody
                              .find("tr")
                              .filter(function () {
                                return (
                                  $(this).find("td").eq(0).text().trim() === ""
                                );
                              })
                              .first();

                            // replace empty row one by one
                            if (emptyRow.length) {
                              emptyRow.replaceWith(serialRow);
                            } else {
                              // no empty rows left
                              serialTableBody.prepend(serialRow);
                            }
                          }

                          totalQty += qty;

                          if (existingItem.length) {
                            serializeBtn.prop("disabled", false);
                            groupedItems[itemCode].loadedQty += 1;

                            let qtyCell = existingItem.find("td:nth-child(5)");
                            let currentQty = parseInt(qtyCell.text()) || 0;

                            qtyCell.text(currentQty + 1);

                            // get existing serials
                            let existingSerials =
                              existingItem.attr("data-serials") || "";

                            // convert to array
                            let serialArray = existingSerials
                              ? existingSerials.split(",").map((s) => s.trim())
                              : [];

                            // use normalized scanned serial
                            if (!serialArray.includes(latestInput)) {
                              serialArray.push(latestInput);
                            }

                            // remove duplicates just in case
                            serialArray = [...new Set(serialArray)];

                            // update attribute
                            existingItem.attr(
                              "data-serials",
                              serialArray.join(","),
                            );

                            // update tooltip
                            existingItem.attr(
                              "data-bs-title",
                              "Requested: " +
                                totalActualPerModel +
                                "<br><br>Serial(s):<br>" +
                                serialArray.join("<br>"),
                            );

                            const tooltip = bootstrap.Tooltip.getInstance(
                              existingItem[0],
                            );

                            if (tooltip) {
                              tooltip.setContent({
                                ".tooltip-inner":
                                  "Requested: " +
                                  totalActualPerModel +
                                  "<br><br>Serial(s):<br>" +
                                  serialArray.join("<br>"),
                              });
                            }

                            return;
                          } else {
                            groupedItems[itemCode].loadedQty += 1;
                            let counter =
                              loadingTableBody.find("tr[data-itemcode]")
                                .length + 1;
                            let newRow = `<tr data-itemkey="${itemKey}" 
                                  data-rowkey="${rowKey}"
                                  data-itemmapping='${JSON.stringify(itemMappings)}'
                                  data-itemcode="${itemCode}" 
                                  data-actualqty="${totalActualPerModel}"
                                  data-serialbased="true" 
                                  data-model="${model}"
                                  data-serials="${item.ItemSerial}" 
                                  data-bs-toggle="tooltip" 
                                  data-bs-html="true" 
                                  data-bs-title="${"Serial(s): " + item.ItemSerial} <br>Requested: ${totalActualPerModel}" 
                                  style="height: 40px; min-height: 40px; cursor: pointer">
                                  <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${counter}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${brand}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${category}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${qty}</td>
                                </tr>`;

                            let emptyRow = loadingTableBody
                              .find("tr:not([data-itemcode])")
                              .first();
                            if (emptyRow.length) {
                              emptyRow.replaceWith(newRow);
                            } else {
                              loadingTableBody.prepend(newRow);
                            }
                            // renumberRows();

                            const tooltipTriggerList =
                              document.querySelectorAll(
                                '[data-bs-toggle="tooltip"]',
                              );

                            tooltipTriggerList.forEach((el) => {
                              bootstrap.Tooltip.getInstance(el)?.dispose();
                              new bootstrap.Tooltip(el);
                            });
                          }

                          if ($.fn.DataTable.isDataTable("#loadBasketTable")) {
                            $("#loadBasketTable").DataTable().destroy();
                          }

                          let exists = false;
                          $("#loadBasketTable tbody tr").each(function () {
                            let code = $(this).data("itemcode");
                            if (code == itemCode) {
                              exists = true;
                              return false; // break loop
                            }
                          });
                        });
                        $("#serializeBtn").prop("disabled", false);
                        $("#loadingQty").text(totalQty);
                      } else {
                        console.log(`ITEM NOT FOUND`);
                        Swal.fire({
                          icon: "error",
                          title: "Item does not belong to this batch",
                          showConfirmButton: true,
                          confirmButtonText: "OKAY",
                        });
                        $("#serializeBtn").prop("disabled", false);
                      }
                    },
                    error: function () {
                      Swal.fire({
                        icon: "warning",
                        title: "No item exists on your request",
                      }).then(() => {
                        console.log("No response found on this item");
                      });
                      $("#serializeBtn").prop("disabled", false);
                      return;
                    },
                  });
                },
              });
            });
          } else if (response.isSuccess === "Failed") {
            Swal.fire({
              icon: "error",
              title: "Unavailable stock for this model",
              confirmButtonText: "OKAY",
            });
            $("#serializeBtn").prop("disabled", false);
            return;
          } else {
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

// function renumberRows() {
//   $("#receiving-form-table tbody tr[data-itemcode]").each(function (index) {
//     $(this)
//       .find("td:first")
//       .text(index + 1);
//   });
// }

function addNonSerialize(Picklists) {
  $("#frm-add-delivery")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      let Brand = $("#newBrand").val();
      let Model = $("#newModel").val();
      let Category = $("#newCategory").val();
      let quantity = parseInt($("#newQuantity").val());

      $.ajax({
        // url: "dirs/basket/dashboard/actions/get_nonserialized_item.php",
        url: "dirs/basket/dashboard/actions/get_nonserialize.php",
        type: "POST",
        data: {
          Brand,
          Model,
          Category,
        },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            let items = response.Data;

            if (response.isSuccess === "no_nonserialized") {
              Swal.fire({
                icon: "warning",
                title: "Serialized Item",
                text: "This item is serialized and cannot be loaded through this process.",
              });
              return;
            }

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
            let existingTotal = parseInt($("#loadingQty").text()) || 0;
            let totalQty = existingTotal;
            let loadingTableBody = $("#loadBasketTable tbody");

            items.forEach((item) => {
              // if (!item.ItemCode) return;
              if (!item.Itemcode) return;

              // if (!groupedItems[item.ItemCode]) {
              if (!groupedItems[item.Itemcode]) {
                // groupedItems[item.ItemCode] = {
                groupedItems[item.Itemcode] = {
                  ...item,
                  Item_id: null,
                  picklist: null,
                  loadedQty: 0,
                  items: [],
                };
              }

              console.log({
                Picklists,
                ItemCode: item.Itemcode,
              });

              $.ajax({
                url: "dirs/basket/dashboard/actions/get_actual_total.php",
                type: "POST",
                data: {
                  Picklists: Picklists,
                  ItemCode: item.Itemcode,
                },
                dataType: "json",
                success: function (res) {
                  // console.log("ACTUAL TOTAL RAW RESPONSE:", res);
                  if (res.isSuccess !== "success") {
                    console.log("NOT SUCCESS:", res);
                    return;
                  }
                  // console.log("DATA:", res.Data);
                  // console.log(`RES : ${res}`);
                  console.log(
                    `NON-SERIALIZE RESPONDSE DATA: ${JSON.stringify(res.Data)}`,
                  );
                  let totalActualPerModel =
                    parseInt(res.Data?.[0]?.Total_Actual_Item_Qty) || 0;

                  // console.log(`TOTAL ACTUAL : ${totalActualPerModel}`);
                  $.ajax({
                    url: "dirs/basket/dashboard/actions/get_dsplaybatch_models.php",
                    type: "POST",
                    data: { Picklists: Picklists, ItemCode: item.Itemcode },
                    dataType: "json",
                    success: function (response) {
                      let data = response.Data;

                      if (response.isSuccess !== "success") {
                        return;
                      }

                      if (
                        response.isSuccess === "success" &&
                        data &&
                        data.length > 0
                      ) {
                        // Object.values(groupedItems).forEach(function (item) {
                        let brand = item.ItemBrand;
                        let model = item.ItemName;
                        let category = item.ItemCategory;
                        let itemCode = item.Itemcode;

                        let itemMappings = data.map((row) => ({
                          item_id: row.Item_id,
                          picklist: row.PKList_Number,
                        }));

                        groupedItems[itemCode].itemMappings = itemMappings;

                        let itemId = data[0]?.Item_id || null;
                        // let itemId = data.map((row) => row.Item_id);
                        groupedItems[itemCode].Item_id = itemId;

                        let picklist = data?.[0]?.PKList_Number ?? null;

                        groupedItems[itemCode].PKList_Number = picklist;
                        groupedItems[itemCode].picklist = picklist;

                        if (!brand || !model || !category || !itemCode) {
                          console.warn(
                            "Skipped item due to null/empty value:",
                            item,
                          );
                          return;
                        }

                        const rowKey = itemCode + "|" + item.ItemName;
                        const itemKey = itemCode + "|" + model;

                        let existingRow = loadingTableBody.find(
                          `tr[data-rowkey="${rowKey}"]`,
                        );

                        let existingItem = loadingTableBody.find(
                          `tr[data-itemkey="${itemKey}"]`,
                        );

                        totalQty += quantity;

                        // let currentLoaded = groupedItems[itemCode].loadedQty || 0
                        // if (currentLoaded >= totalActualPerModel) {
                        //   Swal.fire({
                        //     icon: "error",
                        //     title: "Limit reached",
                        //     text: "This item has already reached its maximum allowed quantity"
                        //   })
                        //   return
                        // }

                        let currentLoaded =
                          groupedItems[itemCode].loadedQty || 0;
                        let newTotal = currentLoaded + quantity;

                        if (newTotal > totalActualPerModel) {
                          Swal.fire({
                            icon: "error",
                            title: "Limit reached",
                            text: `This item has already reached its maximum allowed quantity.`,
                          });
                          return;
                        }

                        if (existingRow.length) {
                          groupedItems[itemCode].loadedQty += quantity;
                          // let currentQty =
                          //   parseInt(existingRow.find("td:nth-child(5)").text()) ||
                          //   0;

                          let qtyCell = existingRow.find("td:nth-child(5)");
                          let currentQty = parseInt(qtyCell.text()) || 0;

                          qtyCell.text(currentQty + quantity);

                          existingRow.attr("data-itemcode", itemCode);
                          existingRow.attr("data-itemid", itemId);

                          return;
                        } else {
                          console.log(`UPDATED NONSERIALIZE POSITIONING`);
                          groupedItems[itemCode].loadedQty += quantity;
                          let counter =
                            loadingTableBody.find("tr[data-itemcode]").length +
                            1;
                          let newRow = `
                                <tr
                                data-rowkey="${rowKey}" 
                                data-itemmapping='${JSON.stringify(itemMappings)}'
                                data-actualqty="${totalActualPerModel}"
                                data-itemid="${itemId}"
                                data-model="${model}"
                                data-picklist="${picklist}"
                                data-itemcode="${itemCode}" 
                                data-serialbased="false" 
                                data-bs-title="Requested: ${totalActualPerModel}"
                                style="height: 40px; min-height: 40px; cursor: pointer">
                                  <td class="align-middle ps-3 text-center" style="background: #fcf7d4">${counter}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${brand}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${model}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${category}</td>
                                  <td class="align-middle ps-3" style="background: #fcf7d4">${quantity}</td>
                                </tr>
                              `;

                          let emptyRow = loadingTableBody
                            .find("tr:not([data-itemcode])")
                            .first();
                          if (emptyRow.length) {
                            emptyRow.replaceWith(newRow);
                          } else {
                            loadingTableBody.prepend(newRow);
                          }
                          // renumberRows();

                          const tooltipTriggerList = document.querySelectorAll(
                            '[data-bs-toggle="tooltip"]',
                          );

                          tooltipTriggerList.forEach((el) => {
                            bootstrap.Tooltip.getInstance(el)?.dispose();
                            new bootstrap.Tooltip(el);
                          });
                        }

                        if ($.fn.DataTable.isDataTable("#loadBasketTable")) {
                          $("#loadBasketTable").DataTable().destroy();
                        }

                        let exists = false;
                        $("#loadBasketTable tbody tr").each(function () {
                          let code = $(this).data("itemcode");
                          if (code == itemCode) {
                            exists = true;
                            return false; // break loop
                          }
                        });
                        // });

                        $("#loadingQty").text(totalQty);

                        $("#newQuantity").val("");
                        $("#newBrand").val("");
                        $("#newModel").val("");
                        $("#newCategory").val("").prop("disabled", true);
                        $("#addDeliveryModal").modal("hide");
                        $("#loadingQty").text(existingTotal + quantity);
                      } else {
                        console.log(`ITEM NOT FOUND`);
                        Swal.fire({
                          icon: "error",
                          title: "Item does not belong to this batch",
                          showConfirmButton: true,
                          confirmButtonText: "OKAY",
                        });
                        return;
                      }
                    },
                    error: function () {
                      Swal.fire({
                        icon: "warning",
                        title: "No item exists on your request",
                      }).then(() => {
                        console.log("No response found on this item");
                      });
                      return;
                    },
                  });
                },
              });
            });
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

function initializeEmptySerialRows() {
  const tbody = $("#basket-serial-table tbody");

  if (tbody.children().length > 0) return;

  for (let i = 0; i < 5; i++) {
    tbody.append(`
      <tr class="empty-row" style="height: 40px; min-height: 40px;">
        <td class="align-middle ps-3 text-muted" style="background: #fcf7d4">&nbsp;</td>
        <td class="align-middle ps-3 text-muted" style="background: #fcf7d4">&nbsp;</td>
        <td class="align-middle ps-3 text-muted" style="background: #fcf7d4">&nbsp;</td>
      </tr>
    `);
  }
}

function submitLoadingBasket(Picklists) {
  $("#loadingBasketForm")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      const rowsWithItems = $("#loadBasketTable tbody tr").filter(function () {
        return $(this).attr("data-itemmapping");
      }).length;

      if (rowsWithItems === 0) {
        Swal.fire({
          icon: "warning",
          title: "No items found",
          text: "Please add item(s) to the loading basket first.",
        });
        return;
      }

      let hasError = false;

      $("#loadBasketTable tbody tr[data-itemmapping]").each(function () {
        let actualQty = parseInt($(this).attr("data-actualqty")) || 0;
        let loadedQty = parseInt($(this).find("td:nth-child(5)").text()) || 0;
        let model = $(this).data("model");

        console.log(
          `MODEL: ${model}, Actual Qty: ${actualQty}, Loaded Qty: ${loadedQty}`,
        );
        console.log(``);

        if (loadedQty !== actualQty) {
          hasError = true;

          Swal.fire({
            icon: "warning",
            title: "Incomplete Quantity",
            text: `${model}: Loaded ${loadedQty} of ${actualQty} required item(s).`,
          });

          return false;
        }
      });

      if (hasError) {
        return;
      }

      let Item_Id = [];
      let ItemQty = [];
      let ItemSerial = [];
      let PickListnumber = [];
      let Eta = $("#eta").val();
      let DeliveryDate = $("#deldate").val();
      let PrepBy = $("#prepby").val();
      let Driver = $("#driver").val();
      let TruckCat = $("#truckCat").val();
      let Plate = $("#plate").val();
      let Remarks = $("#remarks").val();

      $("#loadBasketTable tbody tr[data-itemmapping]").each(function (index) {
        let itemMappings = $(this).attr("data-itemmapping");

        let serialBased =
          $(this).data("serialbased") === true ||
          $(this).data("serialbased") === "true";

        let serials = $(this).attr("data-serials") || "";
        let qty = parseInt($(this).find("td:nth-child(5)").text()) || 0;

        if (!itemMappings) {
          return;
        }

        try {
          itemMappings = JSON.parse(itemMappings);
        } catch (e) {
          console.error("Invalid item mapping:", itemMappings);
          return;
        }

        serials = serials
          ? serials
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        itemMappings.forEach((mapping) => {
          const itemId = Number(mapping.item_id);
          const picklist = mapping.picklist;

          if (serialBased && serials.length > 0) {
            serials.forEach((serial) => {
              Item_Id.push(itemId);
              ItemSerial.push(serial);
              PickListnumber.push(picklist);
              ItemQty.push(1);
            });
          } else {
            Item_Id.push(itemId);
            ItemSerial.push(null);
            PickListnumber.push(picklist);
            ItemQty.push(qty);
          }
        });
      });

      let loadBtn = $(this).find("button[type='submit'].load-btn");

      Swal.fire({
        icon: "question",
        title: "Load the following item(s)?",
        confirmButtonText: "Load",
        showCancelButton: true,
        cancelButtonText: "Back",
      }).then((result) => {
        if (result.isConfirmed) {
          loadBtn
            .prop("disabled", true)
            .html(
              `<span class="spinner-border spinner-border-sm"></span> Loading`,
            );

          $.ajax({
            url: "dirs/basket/dashboard/actions/save_create_loading_basketv2.php",
            type: "POST",
            dataType: "json",
            data: {
              Eta,
              Item_Id,
              ItemSerial,
              PickListnumber,
              ItemQty,
              DeliveryDate,
              PrepBy,
              Driver,
              TruckCat,
              Plate,
              Remarks,
            },
            success: function (res) {
              if (res.isSuccess === "success") {
                Swal.fire({
                  icon: "success",
                  title: "Items has been saved to loading basket",
                });
                groupedItems = {};
                $("#loadBasketTable tbody").empty();
                $("#basket-serial-table tbody").empty();
                $("#loadingQty").text("0");
                loadDeliveryBasketContent();
              } else if (res.errorType === "timeout") {
                Swal.fire({
                  icon: "warning",
                  title: "Request Timeout",
                  text:
                    res.message || "The operation took too long to complete.",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Server error",
                  html: res,
                });
                loadBtn.prop("disabled", false).html("Load");
              }
            },
            error: function (xhr, status, error) {
              if (status === "timeout") {
                Swal.fire({
                  icon: "warning",
                  title: "Request Timeout",
                  text: "The server took too long to respond.",
                });
              } else if (
                xhr.responseJSON &&
                xhr.responseJSON.errorType === "server"
              ) {
                Swal.fire({
                  icon: "error",
                  title: "Server Error",
                  text: xhr.responseJSON.message,
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Unexpected Error",
                  html: xhr.responseText || error,
                });
              }
              loadBtn.prop("disabled", false).html("Load");
            },
            complete: function () {
              loadBtn.prop("disabled", false).html("Load");
            },
          });
        }
      });
      loadBtn.prop("disabled", false).html("Load");
    });
}
