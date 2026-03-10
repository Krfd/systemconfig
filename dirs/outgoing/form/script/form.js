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

/*Function load main form display*/
function loadDashboard() {
  $.post("dirs/outgoing/form/components/main.php", {}, function (data) {
    $("#form-content").html(data);
    loadImperialBrands();
    get_userinfo();
    loadIAPBranchlist();
    get_SRN();
    formattedDate();
    removeItem();
    numberInput();
    submitReq();
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
      // console.log(`SRN NUMBER RESPONSE: ${response.Data.SRNNumber}`);
      if ($.trim(response.isSuccess) == "success") {
        let srn = response.Data.SRNNumber;
        let branchCode = response.Data.BranchCode || "GEN";
        let newSRN;
        let num;
        if (!srn || srn === "") {
          num = 1;
        } else {
          num = parseInt(srn.replace(/\D/g, ""), 10) + 1;
        }
        newSRN = "SRN-" + branchCode + "-" + String(num).padStart(8, "0");
        $("#srnForm").val(newSRN);
        loadItems();
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
    },
  );
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
      // alert($.trim(response.Data));
      console.log(response.Data);
    }
  });
}

/*Load User Branch Information*/
function get_userinfo() {
  $.post("dirs/outgoing/form/actions/get_userinfo.php", {}, function (data) {
    response = JSON.parse(data);
    if (jQuery.trim(response.isSuccess) == "success") {
      // $("#user-origin").val(response.Data.Branch);
      $("#desForm").val(response.Data.Branch);
      $("#Status").val(response.Data.Bcode);
      $("#reqByForm").val(response.Data.Fullname);
      loadDestinationWhscodes(response.Data.Branch);
    } else {
      // alert(jQuery.trim(response.Data));
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
        $("#desCodeForm").html('<option selected value="">--</option>');
        whscode.forEach((whscode) => {
          $("#desCodeForm").append(
            $("<option>", {
              value: whscode.WhsCode,
              text: whscode.WhsCode,
              title: whscode.WhsName,
            }),
          );
        });
      } else {
        // alert($.trim(response.Data));
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

/*Function Imperial Appliance Plaza Branch List*/
async function loadIAPBranchlist() {
  $.post("dirs/outgoing/form/actions/get_branchlist.php", {}, function (data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const iapbranch = response.Data;
      $("#user-origin").html('<option selected value="">BRANCH</option>');
      iapbranch.forEach((iapbranch) => {
        $("#user-origin").append(
          $("<option>", {
            value: iapbranch.Branch,
            text: iapbranch.Branch,
          }),
        );
      });
      if (iapbranch.length > 0) {
        $("#user-origin").val(iapbranch[0].Branch);
        loadOriginWhscodes(iapbranch[0].Branch);
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
      const response = JSON.parse(data);
      if ($.trim(response.isSuccess) === "success") {
        const whscode = response.Data;
        $("#originCodeForm").html('<option selected value="">--</option>');
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
        // alert($.trim(response.Data));
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
  let SRN = $("#srnForm").val();

  $.ajax({
    url: "dirs/outgoing/form/actions/get_prepitem.php", // your API file
    type: "POST",
    data: {
      SRN: SRN,
    },
    dataType: "json",
    beforeSend: function () {
      let tbody = $("#outgoingTable tbody");

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
      let tbody = $("#outgoingTable tbody");
      tbody.empty(); // remove yellow placeholder row
      if (response.isSuccess === "success" && response.Data.length > 0) {
        let rowCount = response.Data.length;
        let totalQty = 0;
        $.each(response.Data, function (index, item) {
          let quantity = parseFloat(item.Quantity) || 0; // ensure number
          totalQty += quantity;

          let row = `<tr class="item-row">
                        <td class="ps-2 align-middle" style="background: #FFFBDF; padding: 3px">${item.DisplayRowNumber}</td>
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
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load items.",
      });
    },
  });
}

function removeItem() {
  $(document).off("click", ".remove-item-button");
  $(document).on("click", ".remove-item-button", function () {
    const ItemNum = $(this).attr("id");
    removeItemAPI(ItemNum);
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

function formattedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  document.getElementById("formattedDate").value = `${yyyy}-${mm}-${dd}`;
}

function clearTable() {
  let SRN = document.getElementById("srnForm").value;

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
        {
          SRN: SRN,
        },
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

function submitReq() {
  $("#frm-request-sts").on("submit", function (e) {
    e.preventDefault();
    let items = [];
    $("#outgoingTable tbody tr.item-row")
      .not(".empty-row")
      .each(function () {
        let brand = $(this).find(".item-brand").text().trim();
        let model = $(this).find(".item-model").text().trim();
        let code = $(this).find(".item-code").text().trim();
        let category = $(this).find(".item-category").text().trim();
        let quantity = $(this).find(".item-quantity").text().trim();

        // Only push if row is not empty
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

    // ❗ Prevent submit if no real items
    if (items.length === 0) {
      e.preventDefault();
      Swal.fire({
        icon: "warning",
        title: "No Items",
        text: "Please add at least one item before submitting.",
      });
      return;
    }

    let formData = new FormData(document.getElementById("frm-request-sts"));
    formData.append("items", JSON.stringify(items));

    $.ajax({
      url: "dirs/outgoing/form/actions/save_stockrequest.php",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Request submitted successfully!",
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message || "Something went wrong",
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Server Error",
        });
      },
    });

    // Remove old hidden input if exists
    $("#tableData").remove();

    // Append hidden JSON field
    $("<input>")
      .attr("type", "hidden")
      .attr("name", "tableData")
      .attr("id", "tableData")
      .val(JSON.stringify(items))
      .appendTo("#frm-request-sts");
  });
}
