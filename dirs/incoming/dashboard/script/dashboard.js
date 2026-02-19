$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
  $(".checkbox").hide();
  // console.log(`CHECKBOXES ARE HIDDEN`)
});

function loadDashboard() {
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);
  });
  loadIncoming()
}

function loadIncoming(search = "") {
  // console.log("Incoming Data")
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    data: {
      Search: search,
      CurrentPage: 1,
      PageSize: 10
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rows = '';
        let rowCount = response.Data.length;

        response.Data.forEach(function(unit) {

          rows += `
          <tr>
            <td style="height: 40px" class="d-flex justify-content-center">
              <input type="checkbox" name="checkbox" id="checkbox_${unit.RowNum}" class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer;">
            </td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RowNum}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.BaseNum_SRN}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RequestType}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.Orgin_Dstnation}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RequestStatus}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.DocDate}</td>
            <td style="background: #FFFBDF"></td>
          </tr>`
        })
        $("#incomingTableDisplay tbody").html(rows);

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
              <tr class="item-row empty-row" style="height: 40px; min-height: 40px">
                <td></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
              </tr>
            `
            $("#incomingTableDisplay tbody").append(emptyRow);
          }
        }
      } else {
        console.error(response.Data);
      }
    },
    error: function(xhr, status, error) {
      console.error("Error loading incoming data: " , error)
    }
  })
}

function handleAddToPicklist() {
  alert("Items added to picklist!");
}

function toggleCheckboxes() {
  const createPicklistBtn = document.getElementById("createPicklistBtn");

  // Are we currently in selection mode?
  const selectionMode = $("#incomingTableDisplay tbody .checkbox:visible").length > 0;

  // Collect checked IDs
  const checkedIds = [];
  $("#incomingTableDisplay tbody .checkbox:checked").each(function () {
    checkedIds.push(this.id);
  });

  // ==========================
  // ENTER SELECTION MODE
  // ==========================
  if (!selectionMode) {

    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim(); // SRN column

      if (srnText.startsWith("SRN")) {
        row.find(".checkbox").show();   // Show valid rows
      } else {
        row.find(".checkbox").hide();   // Hide invalid rows
      }
    });

    createPicklistBtn.textContent = "Add to Picklist";
    createPicklistBtn.type = "button";

    return; // Stop here (wait for user to select items)
  }

  // ==========================
  // VALIDATE SELECTION
  // ==========================
  if (checkedIds.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Please select at least one item to create a picklist",
      confirmButtonText: "OKAY"
    })
    $("#incomingTableDisplay tbody .checkbox")
    .hide()
    .prop("checked", false);
    createPicklistBtn.textContent = "Create Picklist"
    createPicklistBtn.type = "button"
    return; // Keep checkboxes visible
  }

  // ==========================
  // SUBMIT PICKLIST
  // ==========================
  const params = {
    selectedIds: checkedIds,
    action: "create"
  };

  // $.post("dirs/incoming/picklistbasket/basket.php", params, function (data) {
  //   $("#main-content").html(data);
  // });
  Swal.fire({
    icon: "question",
    title: "Add this item(s) to picklist #?",
    text: "This action cannot be change",
    confirmButtonText: "Save",
    showCancelButton: true,
    cancelButtonText: "Back"
  }).then((result) => {
    if (result.isConfirmed) {
      
    }
  })

  // OPTIONAL: Exit selection mode after submit
  $("#incomingTableDisplay tbody .checkbox").hide().prop("checked", false);

  createPicklistBtn.textContent = "Create Picklist";
}

function picklistBasket() {
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

$(document).on("dblclick", "#incomingTableDisplay tbody tr" , function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let RowNum = $(this).find("td:nth-child(2)").text().trim();
  openIncoming(RowNum)
})

// REPLACE THIS WITH DOUBLE CLICK EVENT LISTENER
function openIncoming(RowNum) {
  $.post("dirs/incoming/form/form.php", {RowNum: RowNum}, function (data) {
    $("#main-content").html(data);
  });
}
