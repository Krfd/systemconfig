$(document).ready(function () {
  loadDashboard();
});

$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $("#form-content").html(spinner);
  $.post("dirs/outgoing/form/components/main.php", {}, function (data) {
    $("#form-content").html(data);
    $("#outgoingTable tbody").html(`
      <tr>
        <td colspan="6" class="text-center align-middle" style="height: 300px">
          <div style="height: 300px; display:flex; align-items:center; justify-content:center;">
            ${spinner}
          </div>
        </td>
      </tr>
    `);
    loadImperialBrands();
    get_SRN();
    loadIAPBranches();
    loadItems();
    get_userinfo();
  });
}

function loadReturn() {
  $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// STOCK REQUEST NUMBER GENERATOR
function get_SRN() {
  $.post(
    "dirs/outgoing/form/actions/get_srngenerator.php",
    {},
    function (data) {
      let response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        $("#srnForm").val(response.SRNNumber);
        $("#desForm").val(response.BranchName);
        loadDestinationWhscodes(response.BranchName);
      } else {
        alert(response.message || "Error occurred");
      }
    },
  );
}

/*Whscode of branch Destination*/
function loadDestinationWhscodes(BranchName) {
  $.post(
    "dirs/dashboard/actions/get_destinationwhscode.php",
    {},
    function (data) {
      BranchName: BranchName;
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const branches = response.Data;
        $("#desCodeForm").html(response.Data.WhsCode);
        branches.forEach((warehousecode) => {
          $("#desCodeForm").append(
            $("<option>", {
              value: warehousecode.WhsCode,
              text: warehousecode.WhsCode,
            }),
            console.log(`WarehouseCode : ${warehousecode.WhsCode}`)
          );
        });
      } else {
        alert($.trim(response.Data));
      }
    },
  );
}

/*IAP All Branch list*/
function loadIAPBranches() {
  $.post("dirs/outgoing/form/actions/get_branchlist.php", {}, function (data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const branches = response.Data;
      $("#user-origin").html(response.Data.Branch);
      branches.forEach((branch) => {
        $("#user-origin").append(
          $("<option>", {
            value: branch.Branch,
            text: branch.Branch,
          }),
        );
      });
    } else {
      alert($.trim(response.Data));
    }
  });
}

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

/*Load User Branch Information*/
function get_userinfo() {
  $.post("dirs/outgoing/form/actions/get_userdetails.php", {}, function (data) {
    response = JSON.parse(data);
    if (jQuery.trim(response.isSuccess) == "success") {
      $("#desForm").val(response.Data.Branch);
      $("#Status").val(response.Data.Bcode);
      $("#reqByForm").val(response.Data.Fullname);
      loadDestinationWhscodes(response.Data.Branch);
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
  });
}

/*Function Origin Whscode*/
function loadDestinationWhscodes(Branch) {
  $.post(
    "dirs/outgoing/form/actions/get_destinationwhscode.php",
    {
      Branch: Branch,
    },
    function (data) {
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const whscode = response.Data;
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

$(document).on("change", "#user-origin", function () {
  const selectedBranch = $(this).val();
  loadOriginWhscodes(selectedBranch);
});

/*Function Distination Whscode*/
async function loadOriginWhscodes(Branch) {
  $.post(
    "dirs/outgoing/form/actions/get_destinationwhscode.php",
    {
      Branch: Branch,
    },
    function (data) {
      console.log(`ORIGIN WAREHOUSE CODE: ${JSON.stringify(data)}`)
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const whscode = response.Data;
        console.log(whscode[0].WhsCode);
        $("#originCodeForm").empty();
        whscode.forEach((whscode) => {
          $("#originCodeForm").append(
            $("<option>", {
              value: whscode.WhsCode,
              text: whscode.WhsCode,
              title: whscode.WhsName,
            }),
          );
        });
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

/*Function for reselecting brand to find another model*/
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

/*Script for selecting model and category*/
$("#newModel").on("change", function () {
  const selected = $(this).find(":selected");
  $("#newCategory").val(selected.data("category") || "");
  $("#itemcode").val(selected.data("itemcode") || "");
});

function loadItems() {
  // $("#form-content").html(spinner);
  $.ajax({
    url: "dirs/outgoing/form/actions/get_prepitem.php", 
    type: "POST",
    data: {},
    dataType: "json",
    // beforeSend: function () {
    //   let tbody = $("#outgoingTable tbody");
    //   tbody.html(`
    //         <tr>
    //             <td colspan="6" class="text-center" style="background:#FFFBDF;">
    //                 <span class="spinner-border spinner-border-sm text-secondary me-2"></span>
    //                 Loading items...
    //             </td>
    //         </tr>
    //     `);
    // },
    // beforeSend: function () {
    // $("#outgoingTable tbody").html(`
    //     <tr>
    //         <td colspan="6" style="height:240px; background:#FFFBDF;" class="text-center align-middle">
    //             <span class="spinner-border spinner-border-sm text-secondary me-2"></span>
    //             Loading items...
    //         </td>
    //     </tr>
    // `);
    // },

    success: function (response) {
      let tbody = $("#outgoingTable tbody");
      tbody.empty(); 

      if (response.isSuccess === "success" && response.Data.length > 0) {
        let rowCount = response.Data.length;
        let totalQty = 0;

        let existingItems = {};

        $.each(response.Data, function (index, item) {
          let quantity = parseFloat(item.Quantity) || 0;
          totalQty += quantity;

          if (existingItems[item.ItemCode]) {
            let $existingRow = existingItems[item.ItemCode];
            let oldQty =
              parseFloat($existingRow.find(".item-quantity").text()) || 0;
            let newQty = oldQty + quantity;
            $existingRow.find(".item-quantity").text(newQty);
          } else {
                let row = `<tr class="item-row" style="height: 40px; max-height: 40px">
                     <td class="ps-2 align-middle d-none" name="temp-itemnum[]">${item.ItemNum}</td>
                    <td class="ps-2 align-middle text-center" style="background: #fcf7d4;">${item.DisplayRowNumber}</td>
                    <td class="ps-2 align-middle text-center item-brand" style="background: #fcf7d4;">${item.ItemBrand}</td>
                    <td class="ps-5 align-middle item-model" style="background: #fcf7d4;">${item.ItemName}</td>
                    <td class="ps-5 align-middle text-start item-category" style="background: #fcf7d4;">${item.ItemGroup}</td>
                    <td class="ps-2 align-middle item-code" hidden>${item.ItemCode}</td>
                    <td class="ps-2 align-middle item-quantity text-center" style="background: #fcf7d4;">${item.Quantity}</td>
                    <td class="pe-4 text-end" style="background: #fcf7d4;">
                      <div class="d-flex gap-1 justify-content-end">
                        <button type="button" class="btn btn-sm btn-danger remove-item-button" onclick="reduceItemQty('${item.ItemNum}')">
                            <i class="bi bi-dash"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-primary add-item-button"  onclick="addItemQty('${item.ItemNum}')">
                            <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </td>
                </tr>`;

                

                // <td class="pe-4" style="background: #fcf7d4;">
                //       <div class="d-flex gap-1 justify-content-end">
                //         <button type="button" class="btn btn-sm border-danger bg-danger-subtle text-danger-emphasis remove-item-button" onclick="reduceItemQty('${item.ItemNum}')">
                //             <i class="bi bi-dash"></i>
                //         </button>
                //         <button type="button" class="btn btn-sm border-primary bg-primary-subtle text-primary-emphasis add-item-button"  onclick="addItemQty('${item.ItemNum}')">
                //             <i class="bi bi-plus"></i>
                //         </button>
                //       </div>
                //     </td>

            let $row = $(row);
            tbody.append($row);
            existingItems[item.ItemCode] = $row; 
          }
        });
        if (rowCount < 6) {
          let emptyRowsNeeded = 6 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
                  <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                    <td style="background: #fcf7d4">&nbsp;</td>
                    <td style="background: #fcf7d4"></td>
                    <td style="background: #fcf7d4"></td>
                    <td style="background: #fcf7d4"></td>
                    <td style="background: #fcf7d4"></td>
                    <td style="background: #fcf7d4"></td>
                  </tr>
                `;
            tbody.append(emptyRow);
          }
        }
        $("#totalQuantity").text(totalQty);
      } 
      else {
        for (let j = 0; j < 6; j++) {
          let emptyRow = `
            <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
              <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
              <td style="background: #fcf7d4; padding: 0"></td>
              <td style="background: #fcf7d4; padding: 0"></td>
              <td style="background: #fcf7d4; padding: 0"></td>
              <td style="background: #fcf7d4; padding: 0"></td>
              <td style="background: #fcf7d4; padding: 0"></td>
            </tr>
          `
          tbody.append(emptyRow);
        }
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load items.",
      });
    },
  });
}

/*Function reduce temporary item qty */
function reduceItemQty(ItemNum) {
  $.post(
    "dirs/outgoing/form/actions/remove_unit.php",
    {
      ItemNum: ItemNum,
    },
    function (data) {
      if (jQuery.trim(data) === "success") {
        loadItems();
      } else {
        alert(data);
      }
    },
  );
}

/*Function add temporary item qty */
function addItemQty(ItemNum) {
  $.post(
    "dirs/outgoing/form/actions/update_add_prepitem_qty.php",
    {
      ItemNum: ItemNum,
    },
    function (data) {
      if (jQuery.trim(data) === "success") {
        loadItems();
      } else {
        alert(data);
      }
    },
  );
}

function removeItem() {
  $(document).off("click", ".remove-item-button");
  $(document).on("click", ".remove-item-button", function () {
    const ItemNum = $(this).attr("id");
    removeItemAPI(ItemNum);
  });
  loadItems();
}
function addItem() {
  $(document).off("click", ".add-item-button");
  $(document).on("click", ".add-item-button", function () {
    const ItemNum = $(this).attr("id");
    addItemAPI(ItemNum);
    console.log(`ITEM SHOULD BE INCREMENTED`);
  });
  loadItems();
}

function removeItemAPI(ItemNum) {
  $.ajax({
    url: "dirs/outgoing/form/actions/remove_unit.php",
    type: "POST",
    data: { ItemNum: ItemNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        loadItems();
      } else {
        console.error(`Failed to remove item`);
      }
    },
    error: function () {
      alert("Request failed.");
    },
  });
}

function addItemAPI(ItemNum) {
  $.ajax({
    url: "dirs/outgoing/form/actions/update_add_prepitem_qty.php",
    type: "POST",
    data: { ItemNum: ItemNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        loadItems();
      } else {
        console.error(`Failed to add item`);
      }
    },
    error: function () {
      alert("Request failed.");
    },
  });
}

function formattedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  document.getElementById("formattedDate").value = `${yyyy}-${mm}-${dd}`;
}

function clearTable() {
  Swal.fire({
    icon: "warning",
    title: "Are your sure to clear this table?",
    confirmButtonText: "Clear",
    showCancelButton: true,
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/outgoing/form/actions/clear_formTable.php",
        {},
        function (data) {
          let res;
          try {
            res = JSON.parse(data);

            if (res.Data === "ok") {
              document.getElementById("totalQuantity").text = "0";
              Swal.fire({
                icon: "success",
                title: "Table has been cleared",
                confirmButtonText: "OKAY",
              });
              loadItems();
            } else {
              Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: "Please contact the developer",
                confirmButtonText: "OKAY",
              });
            }
          } catch (e) {
            console.error("");
            return;
          }
        },
      );
    }
  });
  // })
}

function numberInput() {
  document.getElementById("newQuantity").addEventListener("input", function () {
    // Remove anything that is not a digit
    this.value = this.value.replace(/[^0-9]/g, "");

    // Remove leading zeros
    this.value = this.value.replace(/^0+/, "");
  });
}
