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

    // let Uid = $("#Uid").val();   // make sure this exists
    let SRN = $("#srnForm").val();

    $.ajax({
        url: "dirs/outgoing/form/actions/get_prepitem.php", // your API file
        type: "POST",
        data: {
            // Uid: Uid,
            SRN: SRN
        },
        dataType: "json",
        success: function (response) {
            let tbody = $("#outgoingTable tbody");
            tbody.empty(); // remove yellow placeholder row
            if (response.isSuccess === "success" && response.Data.length > 0) {
                $.each(response.Data, function (index, item) {

                    let row = `
                        <tr class="item-row">
                            <td style="background: #FFFBDF">${item.DisplayRowNumber}</td>
                            <td class="item-brand" style="background: #FFFBDF">${item.ItemBrand}</td>
                            <td class="item-model" style="background: #FFFBDF">${item.ItemName}</td>
                            <td class="item-category" style="background: #FFFBDF">${item.ItemGroup}</td>
                            <td class="item-quantity" style="background: #FFFBDF">${item.Quantity}</td>
                            <td class="t-action" style="background: #FFFBDF">
                              <button class="btn btn-sm btn-danger">
                                <i class="bi bi-dash"></i>
                              </button>
                            </td>
                        </tr>
                    `;

                    // <td>${index + 1}</td>
                    // <td class="item-number d-none">${item.ItemNumber}</td>

                    tbody.append(row);
                });

            } else {
                // If no data, show empty yellow row again
                tbody.html(`
                    <tr style="height:50px; min-height:50px">
                        <td style="background:#FFFBDF" colspan="5">Loading...</td>
                    </tr>
                `);

                // <td style="background:#FFFBDF"></td>
                //         <td style="background:#FFFBDF"></td>
                //         <td style="background:#FFFBDF"></td>
                //         <td style="background:#FFFBDF"></td>
                //         <td style="background:#FFFBDF"></td>
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
