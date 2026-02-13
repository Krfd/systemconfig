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
    loadDestinationWhscodes();
    get_SRN();
    formattedDate();
    removeItem()
  });
}

function loadReturn() {
  $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

/*Function generate stock request number*/
function get_SRN(){
    $.post("dirs/outgoing/form/actions/get_srn_generator.php", {}, function(data){
        response = JSON.parse(data);
        if ($.trim(response.isSuccess) == "success") {
            let srn = response.Data.SRNNumber;
            let newSRN;
            if (!srn || srn === "") {
                newSRN = "SRN-00000001";
            } else {
                let num = parseInt(srn.replace(/\D/g,''), 10) + 1;
                newSRN = "SRN-" + String(num).padStart(8,'0');
            }
            $("#srnForm").val(newSRN);
            loadItems()
        } else {
            alert($.trim(response.Data));
        }
    });
}

/*load Imperial Brands*/
function loadImperialBrands() {
  $.post("dirs/outgoing/form/actions/get_iapbrands.php", {}, function(data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const brand = response.Data;
      $("#newBrand").html('<option selected value="">--Choose Brand--</option>');
      brand.forEach(brand => {
        $("#newBrand").append(
          $("<option>", {
            value: brand.Brand,
            text: brand.Brand
          })
        );
      });
    } else {
      alert($.trim(response.Data));
    }
  });
}

/*Load User Branch Information*/
function get_userinfo(){
    $.post("dirs/outgoing/form/actions/get_userinfo.php",{
    },function(data){
        response = JSON.parse(data);
        if(jQuery.trim(response.isSuccess) == "success"){
            $("#user-origin").val(response.Data.Branch);
            $("#Status").val(response.Data.Bcode);
            $("#reqByForm").val(response.Data.Fullname);
            loadOriginWhscodes(response.Data.Branch);
        }else{
            alert(jQuery.trim(response.Data));
        }
    });
}

/*Function Origin Whscode*/
function loadOriginWhscodes(Branch) {
  $.post("dirs/outgoing/form/actions/get_originwhscode.php", {
    Branch:Branch
  }, function(data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const whscode = response.Data;
      $("#originCodeForm").html('<option selected value="">--</option>');
      whscode.forEach(whscode => {
        $("#originCodeForm").append(
          $("<option>", {
            value: whscode.WhsCode,
            text: whscode.WhsCode,
            title: whscode.WhsName
          })
        );
      });
    } else {
      alert($.trim(response.Data));
    }
  });
}

/*Function Imperial Appliance Plaza Branch List*/
async function loadIAPBranchlist() {
  $.post("dirs/outgoing/form/actions/get_branchlist.php", {}, function(data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const iapbranch = response.Data;
      $("#desForm").html('<option selected value="">BRANCH</option>');
      iapbranch.forEach(iapbranch => {
        $("#desForm").append(
          $("<option>", {
            value: iapbranch.Branch,
            text: iapbranch.Branch
          })
        );
      });
    } else {
      alert($.trim(response.Data));
    }
  });
}

/*Function Distination Whscode*/
async function loadDestinationWhscodes() {
  var Branch = $("#desForm").val();
  $.post("dirs/outgoing/form/actions/get_originwhscode.php", {
    Branch:Branch
  }, function(data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const whscode = response.Data;
      $("#desCodeForm").html('<option selected value="">--</option>');
      whscode.forEach(whscode => {
        $("#desCodeForm").append(
          $("<option>", {
            value: whscode.WhsCode,
            text: whscode.WhsCode,
            title: whscode.WhsName
          })
        );
      });
    } else {
      alert($.trim(response.Data));
    }
  });
}

/*Function for reselecting brand to find another model*/
$("#newBrand").on("change", function () {
  $("#newModel").html('<option value="">Select Model</option>');
  $("#newCategory").val('');
  $("#itemcode").val('');
  loadImperialModel();
});

/*load Imperial Model and category*/
async function loadImperialModel() {
  var Brand = $("#newBrand").val();
  $("#newModel").html('<option value="">Loading...</option>');
  $("#newCategory").val('');
  $("#itemcode").val('');
  if (!Brand) {
    $("#newModel").html('<option value="">--Choose Model--</option>');
    return;
  }
  $.post("dirs/outgoing/form/actions/get_mdlcategory.php", {
    Brand: Brand
  }, function (data) {
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
          '<option value="" disabled selected>No Model Available</option>'
        );
        $("#newCategory").val('No Category Available');
        $("#itemcode").val('');

        return;
      }
      $("#newModel").html('<option value="">--Choose Model--</option>');
      rows.forEach(row => {
        $("#newModel").append(
          $("<option>", {
            value: row.ItemModel,
            text: row.ItemModel,
            "data-category": row.ItemCategory,
            "data-itemcode": row.ItemCode
          })
        );
      });
    } else {
      $("#newModel").html(
        '<option value="" disabled selected>No Model Available</option>'
      );
      $("#newCategory").val('No Category Available');
      $("#itemcode").val('');
    }
  });
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
            SRN: SRN
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
              let totalQty = 0
              $.each(response.Data, function (index, item) {

                    let quantity = parseFloat(item.Quantity) || 0;  // ensure number
                    totalQty += quantity;

                    let row = `<tr class="item-row">
                            <td style="background: #FFFBDF">${item.DisplayRowNumber}</td>
                            <td class="item-brand" style="background: #FFFBDF">${item.ItemBrand}</td>
                            <td class="item-model" style="background: #FFFBDF">${item.ItemName}</td>
                            <td class="item-category" style="background: #FFFBDF">${item.ItemGroup}</td>
                            <td class="item-quantity" style="background: #FFFBDF">${item.Quantity}</td>
                            <td class="t-action" style="background: #FFFBDF">
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
                        <tr class="item-row empty-row">
                            <td style="background: #FFFBDF">&nbsp;</td>
                            <td style="background: #FFFBDF"></td>
                            <td style="background: #FFFBDF"></td>
                            <td style="background: #FFFBDF"></td>
                            <td style="background: #FFFBDF"></td>
                            <td style="background: #FFFBDF"></td>
                        </tr>
                    `;
                    tbody.append(emptyRow);
                }
                    $("#totalQuantity").text(totalQty);
              }
            } else {
                // If no data, show empty yellow row again
                tbody.html(`
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                        <td style="background:#FFFBDF"></td>
                    </tr>
                    <tr style="height:50px; min-height:50px">
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
                text: "Failed to load items."
            });
        }
    });
}

function removeItem() {
  console.log("Remove item initialized")
  $(document).on("click" , ".remove-item-button", function () {
    const ItemNum = $(this).attr("id");
    const button = $(this);
    console.log("Remove button was clicked!")
    removeItemAPI(ItemNum, button);
  })

  loadItems();
}

function removeItemAPI(ItemNum, button) {
  console.log(`ITEM NUM: ${ItemNum}`)
  $.ajax({
    url: "dirs/outgoing/form/actions/remove_unit.php",
    type: "POST",
    data: {ItemNum: ItemNum},
    dataType: "json",
    success: function(response) {
      if(response.isSuccess === "success") {
        loadItems();
        console.log("Item Removed")
      } else {
        console.error(`Failed to remove item`)
      }
    },
    error: function () {
      alert("Request failed.")
    }
  })
}

function formattedDate() {
  const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

document.getElementById("formattedDate").value = `${yyyy}-${mm}-${dd}`;
}

function clearTable() {
    let SRN = document.getElementById("srnForm").value

    Swal.fire({
      icon: "warning",
      text: "Are your sure to clear this table?",
      confirmButtonText: "Clear",
      showCancelButton: true,
      cancelButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`SRN VALUE: ${SRN}`)
        $.post("dirs/outgoing/form/actions/clear_formTable.php", {
          SRN: SRN
        }, function (data) {
          let res;
          try{ 
            res = JSON.parse(data)

            console.log(res)

              if (res.Data === "ok") {
                Swal.fire({
                  icon: "success",
                  title: "Table has been cleared",
                  confirmButtonText: "OKAY"
                })
                loadItems();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Something went wrong!",
                  text: "Please contact the developer",
                  confirmButtonText: "OKAY"
                })
              }
          } catch(e) {
            console.error("");
            return;
          }
        }
      )

      }
    })
  // })
}