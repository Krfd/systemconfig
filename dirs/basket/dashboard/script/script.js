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
    loadDeliveryBasket("all", "#basketTableDashboard");
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

$(document).on("dblclick", "#summaryTable tbody tr", function (e) {
  let serial = $(this).data("serial");
  let itemCode = $(this).data("itemcode");
  // let deliveryNumber = $(this).data("deliverynum");
  let lbNum = $(this).data("lbnum");
  let picklistNumber = $(this).data("picklist");
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

  loadPicklistBranches(
    // deliveryNumber,
    lbNum,
    picklistNumber,
    model,
    category,
    function (length) {
      if (length > 1) {
        $("#assignBranchModal").modal("show");
      } else {
        console.log("Single branch");
      }
    },
  );
});

$(document).on("click", "#summaryTable tbody tr", function (e) {
  e.preventDefault();
  let serial = $(this).data("serial");

  if (!serial) {
    return;
  }

  let $serialCell = $("#delivery-serial-table tbody td").first();
  let formattedSerial;

  if (Array.isArray(serial)) {
    formattedSerial = serial.join("<br>");
  } else if (typeof serial === "string") {
    formattedSerial = serial.split(",").join("<br>");
  } else {
    formattedSerial = serial;
  }

  $serialCell.html(formattedSerial);
});

// BRANCH ASSIGNMENT
$(document).on(
  "click",
  // "#basketTableDashboard .dropdown .assign-branch",
  ".datatables .dropdown .assign-branch",
  function (e) {
    e.preventDefault();
    e.stopPropagation();

    let basketRow = $(this).closest("tr");
    let lbNum = basketRow.attr("data-lbNum");
    let PicklistNum = basketRow.attr("data-picklist");
    // let RowNum = deliveryBasketRow.attr("data-rowNum");

    $("#main-content").html(spinner);
    setTimeout(function () {
      assignBranch(lbNum, PicklistNum);
      // createDeliveryForm(DeliveryNum, PicklistNum, RowNum);
    }, 200);
  },
);

$(document).on(
  "click",
  "#loadingBasketTable .dropdown .create-dr",
  function (e) {
    e.preventDefault();
    e.stopPropagation();

    let deliveryBasketRow = $(this).closest("tr");
    let DeliveryNum = deliveryBasketRow.attr("data-dr");
    let PicklistNum = deliveryBasketRow.attr("data-picklist");
    let RowNum = deliveryBasketRow.attr("data-rowNum");

    $("#main-content").html(spinner);
    setTimeout(function () {
      // createDeliveryForm(DeliveryNum, PicklistNum, RowNum);
      createDr();
    }, 200);
  },
);

function loadDeliveryBasketContent() {
  if ($.fn.DataTable.isDataTable("#basketTableDashboard")) {
    $("#basketTableDashboard").DataTable().clear().destroy();
  }
  let tableId = "#basketTableDashboard";
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/basket/dashboard/basket.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      loadDeliveryBasket("all", tableId);
    });
  }, 200);
}

$(document).on("shown.bs.tab", 'button[data-bs-toggle="tab"]', function () {
  const target = $(this).attr("id");

  if (target === "all-tab") {
    loadDeliveryBasket("all", "#basketTableDashboard");
  } else if (target === "unassigned-tab") {
    loadDeliveryBasket("unassigned", "#basketTableUnassigned");
  } else if (target === "assigned-tab") {
    loadDeliveryBasket("assigned", "#basketTableAssigned");
  }
});

function loadDeliveryBasket(filter = "all", tableId) {
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_basket.php",
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
        let filteredData = response.Data;
        if (filter === "unassigned") {
          filteredData = response.Data.filter(
            (item) =>
              !item.PickList_Num ||
              item.PickList_Num.trim() === "" ||
              item.Status === "NEW",
          );
        } else if (filter === "assigned") {
          filteredData = response.Data.filter(
            (item) =>
              item.PickList_Num &&
              item.PickList_Num.trim() !== "" &&
              item.Status === "ASSIGNED",
          );
        }
        let sortedData = filteredData.sort(
          (a, b) => Number(b.RowNumOrder || 0) - Number(a.RowNumOrder || 0),
        );
        sortedData.forEach((item) => {
          const isDisabled =
            item.BatchNum !== null &&
            item.BatchNum !== undefined &&
            item.BatchNum !== ""
              ? "disabled"
              : "";

          rows.push([
            `<input type="checkbox" name="checkbox" id="${item.RowNumOrder}" data-rownum="${item.RowNumOrder}" 
              class="form-check-input checkbox align-self-center mx-auto checkbox border border-primary" style="cursor: pointer" ${isDisabled}>`,
            item.PickList_Num || "",
            item.DocDate || "",
            item.DateModified || "",
            item.ItemCount || "",
            item.Status,
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
                  ${
                    item.Status !== "IN TRANSIT"
                      ? `<li><a class="dropdown-item assign-branch" href="#" data-picklist="${item.PickList_Num}" data-lbNum="${item.LoadingB_Num}">Branch Assignment</a></li>`
                      : ""
                  }
                </ul>
              </div>`,
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable(tableId)) {
          $(tableId).DataTable().clear().destroy();
        }

        $(tableId).DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
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
                .attr("data-picklist", originalItem.PickList_Num)
                .attr("data-lbNum", originalItem.LoadingB_Num)
                .attr("data-batchnum", originalItem.BatchNum);
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
            // let tableBody = $("#basketTableDashboard tbody");
            let tableBody = $(tableId + " tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                  <tr class="empty-row">
                    <td>&nbsp;</td>
                    <td colspan="6" style="background: #FFFBDF">&nbsp;</td>
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

function toggleDelivery() {
  const loadDeliveryBtn = document.getElementById("loadDeliveryBtn");
  const PickListNum = [];
  const LoadingB_Num = [];

  const selectionMode =
    $("#basketTableDashboard tbody .checkbox:visible").length > 0;

  $("#basketTableDashboard tbody .checkbox:checked").each(function () {
    const row = $(this).closest("tr");

    const picklist = row.attr("data-picklist");
    const lbNum = row.attr("data-lbNum");

    if (picklist && lbNum) {
      PickListNum.push(picklist);
      LoadingB_Num.push(lbNum);
    }
  });

  console.log("PickListNum:", PickListNum);
  console.log("LoadingB_Num:", LoadingB_Num);

  // ✅ FIRST CLICK (SHOW CHECKBOXES)
  if (!selectionMode) {
    let availableRows = 0;

    $("#basketTableDashboard tbody tr").each(function () {
      const row = $(this);
      const statusText = row.find("td:eq(5)").text().trim().toUpperCase();
      const batchNum = row.attr("data-batchnum");

      const hasBatch = batchNum && batchNum !== "null" && batchNum !== "";

      if (statusText === "ASSIGNED" && !hasBatch) {
        availableRows++;
      }
    });

    if (availableRows === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Available Request(s)",
        confirmButtonText: "OKAY",
      });
      return;
    }

    $("#basketTableDashboard tbody tr").each(function () {
      const row = $(this);
      const statusText = row.find("td:eq(5)").text().trim().toUpperCase();
      const checkbox = row.find(".checkbox");

      const batchNum = row.attr("data-batchnum"); // ✅ get batch number

      const restrictedStatuses = ["UNASSIGNED", "IN TRANSIT"];

      if (statusText === "ASSIGNED") {
        checkbox.show();

        // ✅ Disable if has batch number
        if (batchNum && batchNum !== "null" && batchNum !== "") {
          checkbox.prop("disabled", true);
          checkbox.attr("title", "Already has batch delivery number");
        } else if (restrictedStatuses.includes(statusText)) {
          checkbox.prop("disabled", true);
        } else {
          checkbox.prop("disabled", false);
        }

        loadDeliveryBtn.textContent = "Add Items";
        loadDeliveryBtn.type = "button";
      } else {
        checkbox.hide();
      }
    });

    return;
  }

  // ✅ SECOND CLICK (PROCESS SELECTION)
  if (PickListNum.length == 0) {
    Swal.fire({
      icon: "warning",
      title: "Please select at least one item to create a picklist",
      confirmButtonText: "OKAY",
    });

    $("#basketTableDashboard tbody .checkbox").hide().prop("checked", false);

    loadDeliveryBtn.textContent = "Load Items";
    loadDeliveryBtn.type = "button";
    return;
  }

  Swal.fire({
    icon: "question",
    title: "Add the following item(s) to delivery basket?",
    confirmButtonText: "Add",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "dirs/basket/dashboard/actions/save_create_delivery_batch.php",
        type: "POST",
        data: { PickListNum: PickListNum, LoadingB_Num: LoadingB_Num },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            Swal.fire({
              icon: "success",
              title: response.message,
              confirmButtonText: "OKAY",
            });

            $("#basketTableDashboard tbody .checkbox")
              .hide()
              .prop("checked", false);

            loadDeliveryBtn.textContent = "Create DR";
          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              confirmButtonText: "OKAY",
              confirmButtonColor: "#d33",
            });
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Something went wrong while processing the request.",
          });
        },
      });
    }
  });
}

function serialDeliveryInput(lbNum, PicklistDr, previousSerials) {
  $("#serial-delivery").on("submit", function (e) {
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
              loadPicklistBranches(
                // DeliveryNumber,
                lbNum,
                PicklistDr,
                model,
                category,
                function (length, branchName) {
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
    serialInput.val(""); // clear after submit
    serialInput.focus();
  });
}

function validateBranchAssignment() {
  let totalInput = 0;

  $("#branchAssignmentTable tbody td[contenteditable='true']").each(
    function () {
      let val = parseInt($(this).text().trim()) || 0;
      totalInput += val;
    },
  );

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
    "#branchAssignmentTable td[contenteditable='true']",
    function (e) {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    },
  );

  // PREVENT EMPTY
  $(document).on(
    "blur",
    "#branchAssignmentTable td[contenteditable='true']",
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

  $("#branchAssignmentTable tbody tr").each(function () {
    let branch = $(this).find("td:nth-child(1)").text().trim();
    let model = $(this).find("td:nth-child(2)").text().trim();
    let category = $(this).find("td:nth-child(3)").text().trim();
    let qty = $(this).find("td:nth-child(4)").text().trim();

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

      $("#delivery-serial-table tbody").empty();
      // $("#deliveryTable tbody").empty();
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
          <td style="background: #FFFBDF; height: 40px;"></td>
        </tr>
        `;

        // $("#deliveryTable tbody").append(row);
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

function loadPicklistBranches(
  // deliveryNumber,
  lbNum,
  picklistNumber,
  model,
  category,
  callback,
) {
  $.ajax({
    url: "dirs/basket/dashboard/actions/get_product_distribution_setup.php",
    type: "POST",
    data: {
      // DRNumber: deliveryNumber,
      lbNum: lbNum,
      PicklistNum: picklistNumber,
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
              <td style="background: #FFF7BC">${branch.ReqBranch}</td>
              <td style="background: #FFF7BC">${model}</td>
              <td style="background: #FFF7BC">${category}</td>
              <td style="background: #FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
            </tr>
          `;

            tbody.append(row);
          });
        }
        // console.log(`BRANCHES LENGTH: ${length}`);
        if (callback) callback(length, branches[0].ReqBranch);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
}

// function addNonSerialize(ItemSerial, DrNumber, picklistDr) {
function addNonSerialize(ItemSerial, lbNum, picklistDr) {
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
                picklistDr,
                model,
                category,
                function (length, branchName) {
                  if (length > 1) {
                    // console.log(`ASSIGNED: ${length}`);
                    rows += `
                        <tr style="height: 40px; min-height: 40px;">
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
                        <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px;">
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
                        <tr style="height: 40px; min-height: 40px;">
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
                          <tr data-itemcode="${itemCode}" data-lbnum="${lbNum}" data-picklist="${picklistDr}" style="height: 40px; min-height: 40px;">
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
                              <tr data-itemcode="${itemCode}" style="padding: 3px; height: 40px; min-height: 40px">
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

// function assignBranch(createDeliveryNumber, picklistDr, previousSerials = []) {
function assignBranch(lbNum, picklistDr, previousSerials = []) {
  $.post("dirs/basket/dashboard/branchAssignment.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    loadImperialBrands();
    // serialDeliveryInput(createDeliveryNumber, picklistDr, previousSerials);
    serialDeliveryInput(lbNum, picklistDr, previousSerials);
    loadIAPBranchlist();
    summaryData();

    $(document)
      .off("input", "#branchAssignmentTable td[contenteditable='true']")
      .on(
        "input",
        "#branchAssignmentTable td[contenteditable='true']",
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
      url: "dirs/basket/dashboard/actions/get_review_basket.php",
      type: "POST",
      data: { lbNum: lbNum },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let header = response.Data;

          $("#lbnum").val(lbNum);
          $("#pcklstno").val(picklistDr);
          $("#docdate").val(header.DocDate);
          $("#origin").val(header.BDestination);
          $("#whcode").val(header.BWhsDestination);
          $("#status").val(header.Delivery_Status || "NEW");
          $("#prepby").val(header.PreparedBy);

          // MANUAL OR SCAN
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

          // addNonSerialize("", createDeliveryNumber, picklistDr);
          addNonSerialize("", lbNum, picklistDr);
          //   }
          // });

          function adjustTotalWidth() {
            const summaryTable = document.getElementById("summaryTable");
            const totalRow = document.getElementById("totalRowOutside");

            if (summaryTable && totalRow) {
              totalRow.style.width = summaryTable.offsetWidth + "px";
            }
          }

          toggler();
          adjustTotalWidth();
          window.addEventListener("resize", adjustTotalWidth);
          submitBranchAssignment();
        }
      },
    });
  });
}

// SUBMIT DELIVERY
function submitBranchAssignment() {
  // FORM SUBMISSION
  let commitBtn = document.getElementById("branchAssignmentBtn");

  commitBtn.addEventListener("click", function (e) {
    e.preventDefault();

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

        formData.append("LoadingB_Num", $("#lbnum").val());
        formData.append("PickListNum", $("#pcklstno").val());
        formData.append("Branch", $("#origin").val());
        formData.append("OrginWhscode", $("#whcode").val());
        formData.append("Remarks", $("#remarks").val());

        // SERIALIZED
        items.forEach((item, i) => {
          formData.append(`Serial[${i}]`, item.serial);
          formData.append(`BranchFor[${i}]`, item.branch);
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

        // ================= DEBUG =================
        console.log("Serialized:", items);
        console.log("Non-Serialized:", nonSerializeItems);

        $.ajax({
          url: "dirs/basket/dashboard/actions/save_branch_assignment.php",
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

          // console.log(`DELIVERY BASKET DATA: ${JSON.stringify(sortedData)}`);

          // sortedData.forEach((item, index) => {
          //   let counter = index + 1;
          //   rows.push([
          //     "DR1000" + counter, // picklist no
          //     item.BatchNum || "", // delivery branch
          //     response.picklistCount || "", // date assigned or modified
          //     item.BatchStatus || "", // dropdown or action
          //     '<div class="dropdown dropstart">' +
          //       '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
          //       '<i class="bi bi-three-dots"></i></button>' +
          //       `<ul class="dropdown-menu">
          //         <li><a class="dropdown-item open-picklisted" href="#">Open</a></li>
          //         <li><a class="dropdown-item print-picklist" href="#" data-delivery="${item.PickList_Num}">Print</a></li>
          //         <li><a class="dropdown-item create-dr" href="#" data-batch="${item.PickList_Num}">Create DR</a></li>
          //       </ul>
          //     </div>`,
          //   ]);
          // });
          console.log(`BASKET DATA: ${JSON.stringify(basketData)}`)

          basketData.forEach((item, index) => {
            rows.push([
              item.PickList_Num, // picklist no
              item.BranchPrep || "", // delivery branch
              item.DocDate || "", // date assigned or modified
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
              // rows.push(["", "", "", "", ""]);
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
                $(row)
                  // .attr("data-rownum", originalItem.RowNumOrder)
                  .attr("data-delivery-num", originalItem.BatchNum)
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
function loadDeliveryItems(PickLst_Num, del_num) {
  $.post("dirs/basket/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);

    console.log(`DELIVERY BASKET BREAKDOWN`)

    deliveryPicklistNum = PickLst_Num;
    deliveryNum = del_num;

    $.ajax({
      url: "dirs/basket/dashboard/actions/get_loading_breakdown.php",
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
  document.getElementById("deldate").value = `${yyyy}-${mm}-${dd}`;
}

function createDr() {
  $("#main-content").html(spinner);
  $.post("dirs/basket/dashboard/deliveryForm.php", function (data) {
    $("#main-content").hide().html(data).fadeIn(200);
    get_userinfo();
    loadIAPBranchlist();
    deliveryDate()
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

// ORIGINAL
// $(document).on("change", "#desForm", function () {
//   const selectedBranch = $(this).val();
//   loadDestinationWhscodes(selectedBranch);
//   console.log(`SELECTED BRANCH: ${selectedBranch}`);
// });

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
    // console.warn("Blocked invalid Branch:", Branch);
    return;
  }

  // console.log("VALID CALL:", Branch);

  $.post(
    "dirs/basket/dashboard/actions/get_destinationwhscode.php",
    {
      Branch: Branch,
    },
    function (data) {
      // console.log(`BRANCH: ${Branch}`);
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
