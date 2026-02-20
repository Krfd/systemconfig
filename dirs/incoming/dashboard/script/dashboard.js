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
  loadIncoming();
}

function loadIncoming(search = "") {
  // console.log("Incoming Data")
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    data: {
      Search: search,
      CurrentPage: 1,
      PageSize: 10,
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rows = "";
        let rowCount = response.Data.length;

        response.Data.forEach(function (unit) {
          rows += `
          <tr>
            <td style="height: 40px" class="d-flex justify-content-center">
              <input type="checkbox" name="checkbox" id="checkbox_${unit.RowNum}" data-rownum="${unit.RowNum}" class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer;">
            </td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RowNum}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.BaseNum_SRN}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RequestType}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.Orgin_Dstnation}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RequestStatus}</td>
            <td class="align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.DocDate}</td>
            <td style="background: #FFFBDF"></td>
          </tr>`;
        });
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
            `;
            $("#incomingTableDisplay tbody").append(emptyRow);
          }
        }
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading incoming data: ", error);
    },
  });
}

function handleAddToPicklist() {
  alert("Items added to picklist!");
}

function toggleCheckboxes() {
  const createPicklistBtn = document.getElementById("createPicklistBtn");

  // Are we currently in selection mode?
  const selectionMode =
    $("#incomingTableDisplay tbody .checkbox:visible").length > 0;

  // Collect checked IDs
  const checkedIds = [];
  $("#incomingTableDisplay tbody .checkbox:checked").each(function () {
    // checkedIds.push(this.id);
    checkedIds.push($(this).data("rownum"));
  });
  console.log(`ID's: ${checkedIds}`);

  // ==========================
  // ENTER SELECTION MODE
  // ==========================
  if (!selectionMode) {
    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim(); // SRN column

      console.log(`SRN TEXT : ${srnText}`);

      if (srnText.startsWith("SRN")) {
        row.find(".checkbox").show(); // Show valid rows
      } else {
        row.find(".checkbox").hide(); // Hide invalid rows
      }
    });

    createPicklistBtn.textContent = "Add to Picklist";
    createPicklistBtn.type = "button";

    return;
  }

  // ==========================
  // VALIDATE SELECTION
  // ==========================

  Swal.fire({
    icon: "question",
    title: "Generate picklist number and add the following items?",
    text: "This action cannot be change",
    confirmButtonText: "Create",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "dirs/incoming/dashboard/actions/save_createpicklist.php",
        type: "POST",
        data: { RowNumber: checkedIds },
        dataType: "json",
        success: function (response) {
          if (response.status === "success") {
            Swal.fire({
              icon: "success",
              // title: "Successfully created a picklist!",
              title: response.message,
              confirmButtonText: "OKAY",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              confirmButtonText: "OKAY",
              confirmButtonColor: "#d33",
            });
          }

          console.log("Hello world!");

          if (checkedIds.length === 0) {
            Swal.fire({
              icon: "warning",
              title: "Please select at least one item to create a picklist",
              confirmButtonText: "OKAY",
            });
            $("#incomingTableDisplay tbody .checkbox")
              .hide()
              .prop("checked", false);
            createPicklistBtn.textContent = "Create Picklist";
            createPicklistBtn.type = "button";
            return;
          }
        },
        error: function (xhr) {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Something went wrong while processing the request.",
          });
        },
      });
    }
  });

  // OPTIONAL: Exit selection mode after submit
  $("#incomingTableDisplay tbody .checkbox").hide().prop("checked", false);

  createPicklistBtn.textContent = "Create Picklist";
}

function picklistBasket() {
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

$(document).on("dblclick", "#incomingTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let RowNum = $(this).find("td:nth-child(2)").text().trim();
  openIncoming(RowNum);
});

// REPLACE THIS WITH DOUBLE CLICK EVENT LISTENER
function openIncoming(RowNum) {
  $.post("dirs/incoming/form/form.php", { RowNum: RowNum }, function (data) {
    $("#main-content").html(data);
  });
}
