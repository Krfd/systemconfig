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
  $.post("dirs/load/dashboard/components/main.php", {}, function (data) {
    $("#basket_content").html(data);
    $("#loadingBasketTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
    loadBasket();
  });
}

// FOR BREAKDOWN
$(document).on("click", ".dropdown .open-batch", function (e) {
  e.preventDefault();

  let batch = $(this).data("batch");

  $("#main-content").html(spinner);
  setTimeout(function () {
    viewBatch(batch);
  }, 200);
});

// FOR DELIVERY
$(document).on("click", ".dropdown .create-dr", function (e) {
  // let batch = $(this).closest("tr").attr("data-batch");
  e.preventDefault();

  let batch = $(this).data("batch");

  $("#main-content").html(spinner);
  setTimeout(function () {
    createDr(batch);
  }, 200);
});

function loadingBasket() {
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/load/dashboard/load.php", {}, function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      loadBasket();
    });
  }, 200);
}

$(document).on("click", ".print-dr", function () {
  let branches = $(this).data("branches");

  let branchArray = JSON.parse(
    decodeURIComponent($(this).attr("data-branches")),
  );
  let batchNumber = $(this).attr("data-batch");

  console.log(`BATCH: ${batchNumber}`);
  console.log("BRANCH ARRAY:", branchArray);

  window.open(
    `pdf/delivery.php?batch=${batchNumber}&branches=${encodeURIComponent(JSON.stringify(branchArray))}`,
    "_blank",
  );
});

function loadBasket() {
  $.ajax({
    url: "dirs/load/dashboard/actions/get_loadingbasketdisplay.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let data = response.Data;
      let info = response.Info;
      let rows = [];
      let rowNum = 1;

      if (response.isSuccess === "success") {
        let grouped = {};
        let batchInfo = {};

        info.forEach(function (data, index) {
          let batch = data.BatchBasket_Num;

          if (!grouped[batch]) {
            grouped[batch] = {
              picklists: new Set(),
              branches: new Set(),
            };
          }

          // Avoid duplicates automatically
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

        data.forEach(function (item, index) {
          let branches = batchInfo[item.BatchNumber]?.branches || [];
          const isDisabled = item.DocStatus === "IN TRANSIT" ? "disabled" : "";

          const date = new Date(item.DocDate);
          const formatted = date.toISOString().split("T")[0];

          // console.log(`BRANCHES : ${branches}`);
          console.log(`BASKET ITEM : ${JSON.stringify(item)}`)

          rows.push([
            rowNum++,
            item.BatchNumber,
            (() => {
              let status = item.DocStatus || "";
              let badgeClass = "primary";

              if (status === "IN TRANSIT") badgeClass = "primary";
              else if (status === "PREPARING") badgeClass = "danger";
              else if (status === "DELIVERED") badgeClass = "success";

              return `<span class="badge bg-${badgeClass}" >${status}</span>`;
            })(),
            formatted,
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
                    <li><a class="dropdown-item open-batch" href="#" data-batch="${item.BatchNumber}">Open</a></li>
                    <li><a class="dropdown-item print-dr" href="#" data-batch="${item.BatchNumber}" data-branches="${encodeURIComponent(JSON.stringify(branches))}">Print DR</a></li>
                  </ul>` +
              "</div>",
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#loadingBasketTableDisplay")) {
          $("#loadingBasketTableDisplay").DataTable().clear().destroy();
        }

        $("#loadingBasketTableDisplay").DataTable({
          data: rows,
          columns: [
            { title: "#", className: "text-center" },
            { title: "Batch No.", className: "text-start ps-5" },
            { title: "Status", className: "ps-3" },
            { title: "Date", className: "text-start ps-3" },
            { title: "Action" },
          ],
          createdRow: function (row, data) {
            let batchNumber = data[1];
            let picklists = batchInfo[batchNumber]?.picklists || [];
            let branches = batchInfo[batchNumber]?.branches || [];
            $(row).attr("data-batch", batchNumber);
            $(row).attr(
              "data-bs-title",
              `<div class="text-start">Picklists: <br>${picklists.join("<br>")} <br><br>Branches: <br>${branches.join("<br>")}</div>`,
            );
          },
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          // order: [[0, "desc"]],
          rowCallback: function (row, data) {
            $("td", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });

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
            let tableBody = $("#loadingBasketTableDisplay tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                  <tr class="empty-row">
                    <td colspan="5" style="background: #FFFBDF">&nbsp;</td>
                  </tr>
                `);

              $emptyRow.css({
                background: "#FFFBDF",
                height: "40px",
                "min-height:": "40px",
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

            const selectionMode =
              $("#loadingBasketTableDisplay").data("selectionMode") || false;
            $("#loadingBasketTableDisplay tbody tr").each(function () {
              const dropdownBtn = $(this).find(
                "button[data-bs-toggle='dropdown']",
              );

              if (selectionMode) {
                dropdownBtn.prop("disabled", true).addClass("disabled");
              } else {
                dropdownBtn.prop("disabled", false).removeClass("disabled");
              }

              new bootstrap.Tooltip(this, {
                placement: "right",
                trigger: "hover",
                container: "body",
                html: true,
              });
            });
          },
        });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading basket data: ", error);
    },
  });
}

function getBatchItems(batch, tableSelector) {
  $.ajax({
    url: "dirs/load/dashboard/actions/get_reviewdelivery.php",
    type: "POST",
    data: { BatchNumber: batch },
    dataType: "json",
    success: function (response) {
      let header = response.Header;
      let items = response.Items;
      let totalQty = 0;
      let counter = 0;
      let batchTable = $(`${tableSelector} tbody`);
      batchTable.empty();

      if (response.isSuccess === "success") {
        // USER DETAILS
        $("#batch").val(batch);
        $("#user-origin").val(header.BranchSet);
        $("#prepby").val(header.PickedBy);

        let groupedItems = {};

        items.forEach((item) => {
          let model = item.Model;
          let pk = item.PKList_Number;
          let qty = parseInt(item.Deliver_Qty) || 0;

          // GROUP BY MODEL
          if (!groupedItems[model]) {
            groupedItems[model] = {
              ...item,
              Deliver_Qty: 0,
              PKList_Numbers: [],
              processedPKs: {},
            };
          }

          // ADD PK ONLY ONCE
          if (!groupedItems[model].PKList_Numbers.includes(pk)) {
            groupedItems[model].PKList_Numbers.push(pk);
          }

          // ADD QTY ONLY ONCE PER PK
          // prevents duplicated API rows from inflating qty
          if (!groupedItems[model].processedPKs[pk]) {
            groupedItems[model].Deliver_Qty += qty;
            groupedItems[model].processedPKs[pk] = true;
          }
        });

        Object.values(groupedItems).forEach((item) => {
          // console.log(`DELIVERY QTY : ${item.Deliver_Qty}`);
          // console.log(``);
          counter += 1;

          totalQty += item.Deliver_Qty;

          let row = `
            <tr 
              class="item-row"
              style="height: 40px; min-height: 40px; cursor: pointer"
              data-pklist='${JSON.stringify(item.PKList_Numbers)}'
              data-itemid="${item.ItemRowNum}"
              >
              <td class="align-middle ps-3" style="background: #FFFBDF">
                ${counter}
              </td>

              <td class="align-middle ps-3 text-primary" style="background: #FFFBDF">
                ${item.Brand}
              </td>

              <td class="align-middle ps-3" style="background: #FFFBDF">
                ${item.Model}
              </td>

              <td class="align-middle ps-3" style="background: #FFFBDF">
                ${item.Category}
              </td>

              <td class="align-middle ps-3" style="background: #FFFBDF">
                ${item.Deliver_Qty}
              </td>
            </tr>
          `;

          batchTable.append(row);
        });

        // TOTAL
        $("#batchTotal").text(totalQty);

        for (let i = Object.keys(groupedItems).length; i < 8; i++) {
          let emptyRow = $(`
            <tr class="empty-row">
              <td colspan="5" style="background: #FFFBDF"></td>
            </tr>
          `);

          $(emptyRow).css({
            background: "#FFFBDF",
            height: "50px",
          });

          batchTable.append(emptyRow);
        }
      } else {
        console.log(`NO FETCHED DATA FOR BATCH : ${batch}`);
      }
    },
  });
}

function createDr(batch) {
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/load/dashboard/createDr.php", function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      getBatchItems(batch, "#deliveryFormTable");
      getDeliveryDetails();
      deliveryDate();
      submitDr();
    });
  }, 200);
}

function viewBatch(batch) {
  $("#main-content").html(spinner);
  setTimeout(function () {
    $.post("dirs/load/dashboard/viewBatch.php", function (data) {
      $("#main-content").hide().html(data).fadeIn(200);
      $("#batchNumDisplay").text(batch);
      getBatchItems(batch, "#batchItemTable");
    });
  }, 200);
}

function getDeliveryDetails() {
  const truckData = {
    "4 Wheeler": ["ABC-123", "DEF-456"],
    "6 Wheeler": ["GHI-789", "JKL-012"],
    "10 Wheeler": ["MNO-345", "PQR-678"],
  };

  document.getElementById("truckCat").addEventListener("change", function () {
    const plateSelect = document.getElementById("plate");
    const selectedCategory = this.value;

    // Clear existing options
    plateSelect.innerHTML = '<option value="">Select Plate</option>';

    if (truckData[selectedCategory]) {
      truckData[selectedCategory].forEach((plate) => {
        const option = document.createElement("option");
        option.value = plate;
        option.textContent = plate;
        plateSelect.appendChild(option);
      });
    }
  });
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
}

function submitDr() {
  $(document).off("submit.deliver");

  $(document).on("submit.deliver", "#deliver", function (e) {
    e.preventDefault();

    Swal.fire({
      icon: "warning",
      title: "Submit items for delivery?",
      confirmButtonText: "Submit",
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: "Back",
    }).then((res) => {
      if (res.isConfirmed) {
        let allPKs = new Set();
        let itemIds = new Set();
        let formData = new FormData(this);

        // EXTRA FIELDS
        formData.append("BatchNumber", $("#batch").val());
        formData.append("DeliveryDate", $("#deldate").val());
        formData.append("Driver", $("#driver").val());
        formData.append("TruckType", $("#truckCat").val());
        formData.append("PlateNumber", $("#plate").val());
        formData.append("Remarks", $("#remarks").val());
        // COLLECT UNIQUE PICK LIST NUMBERS
        $("#deliveryFormTable .item-row").each(function () {
          let pkList = $(this).data("pklist") || [];

          // normalize to array
          if (!Array.isArray(pkList)) {
            pkList = [pkList];
          }

          // remove duplicates inside row
          let uniqueRowPKs = [...new Set(pkList)];

          // add to global unique set
          uniqueRowPKs.forEach((pk) => {
            if (pk && pk.trim() !== "") {
              allPKs.add(pk);
            }
          });

          let itemId = $(this).data("itemid");

          if (itemId) {
            itemIds.add(itemId);
          }
        });

        // FINAL UNIQUE ARRAY
        let uniquePKList = Array.from(allPKs);

        // APPEND AS PHP ARRAY
        uniquePKList.forEach((pk) => {
          formData.append("PickListNumber[]", pk);
        });

        Array.from(itemIds).forEach((id) => {
          formData.append("ItemRowNum[]", id);
        });

        $.ajax({
          url: "dirs/load/dashboard/actions/update_deliveryinfo.php",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          dataType: "json",
          success: function (response) {
            // console.log(`SUBMIT DELIVERY RESPONSE: ${response}`);

            if (response.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Processing items for delivery",
              }).then(() => {
                // console.log(`DELIVERY HAS BEEN CREATED: ${response}`);
                // loadBasket();
                loadingBasket();
              });
            } else {
              Swal.fire({
                icon: "error",
                // title: "Failed to submit delivery",
                text: response.message || "Unknown error",
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
