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

var incomingTable;

$.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
  return this.api()
    .column(col, { order: "index" })
    .nodes()
    .map(function (td) {
      if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
      return $(td).text();
    });
};

function loadIncoming() {
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      // if (response.isSuccess === "success") {
      //   let rows = "";
      //   let rowCount = response.Data.length;

      //   response.Data.forEach(function (unit) {
      //     rows += `
      //     <tr>
      //       <td style="height: 40px" class="d-flex justify-content-center">
      //         <input type="checkbox" name="checkbox" id="checkbox_${unit.RowNum}" data-rownum="${unit.RowNum}" class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer;">
      //       </td>
      //       <td class="ps-2 align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RowNum}</td>
      //       <td class="ps-2 align-middle text-primary" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.BaseNum_SRN}</td>
      //       <td class="ps-2 align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RequestType}</td>
      //       <td class="ps-2 align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.Orgin_Dstnation}</td>
      //       <td class="ps-2 align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.RequestStatus}</td>
      //       <td class="ps-2 align-middle" style="background: #FFFBDF; cursor: pointer; padding: 3px" data-rownum="${unit.RowNum}">${unit.DocDate}</td>
      //       <td style="background: #FFFBDF"></td>
      //     </tr>`;
      //   });
      //   $("#incomingTableDisplay tbody").html(rows);

      //   if (rowCount < 8) {
      //     let emptyRowsNeeded = 8 - rowCount;

      //     for (let i = 0; i < emptyRowsNeeded; i++) {
      //       let emptyRow = `
      //         <tr class="item-row empty-row" style="height: 40px; min-height: 40px">
      //           <td></td>
      //           <td style="background: #FFFBDF"></td>
      //           <td style="background: #FFFBDF"></td>
      //           <td style="background: #FFFBDF"></td>
      //           <td style="background: #FFFBDF"></td>
      //           <td style="background: #FFFBDF"></td>
      //           <td style="background: #FFFBDF"></td>
      //           <td style="background: #FFFBDF"></td>
      //         </tr>
      //       `;
      //       $("#incomingTableDisplay tbody").append(emptyRow);
      //     }
      //   }
      // } else {
      //   console.error(response.Data);
      // }

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          rows.push([
            item.RowNum !== undefined ? item.RowNum.toString() : "",
            item.BaseNum_SRN || "",
            item.Brnch_Dstnation || "",
            item.BrnchOrgn_Bcode || "",
            item.RequestStatus || "",
            item.DocDate || "N/A",
            '<div class="dropdown">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              '<ul class="dropdown-menu">' +
              '<li><a class="dropdown-item open-item" href="#">Open</a></li>' +
              (item.RequestStatus?.toUpperCase() === "NEW"
                ? '<li><a class="dropdown-item cancel-outgoing" data-srn="' +
                  item.BaseNum_SRN +
                  '" href="#">Cancel</a></li>'
                : "") +
              (item.RequestStatus && item.RequestStatus.toUpperCase() !== "NEW"
                ? '<li><a class="dropdown-item" href="#">Terminate</a></li>'
                : "") +
              '<li><a class="dropdown-item" href="#">Print</a></li>' +
              "</ul></div>",
          ]);
        });
      }

      $("#incomingTableDisplay").DataTable().clear().destroy();

      $("#incomingTableDisplay").DataTable({
        data: rows,
        columns: [
          { title: "#", className: "text-center" },
          { title: "SRN" },
          { title: "Stock Origin" },
          { title: "Requested by" },
          { title: "Status" },
          { title: "Date", className: "text-start" },
          { title: "Actions", orderable: false },
        ],
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
          $("td:eq(0)", row).css("text-align", "center");
          $("td:eq(1)", row).addClass("text-primary");
          $("td:eq(5)", row).css("text-align", "start");

          // Add hover effect to empty rows too
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
          let tableBody = $("#incomingTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row" style="background: #FFFBDF">
                <td colspan="7" style="background: #FFFBDF">&nbsp;</td>
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
  // console.log(`ID's: ${checkedIds}`);

  // ==========================
  // ENTER SELECTION MODE
  // ==========================
  if (!selectionMode) {
    $("#incomingTableDisplay tbody tr").each(function () {
      const row = $(this);
      const srnText = row.find("td:eq(2)").text().trim(); // SRN column

      // console.log(`SRN TEXT : ${srnText}`);

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

  if (checkedIds.length == 0) {
    Swal.fire({
      icon: "warning",
      title: "Please select at least one item to create a picklist",
      confirmButtonText: "OKAY",
    });
    $("#incomingTableDisplay tbody .checkbox").hide().prop("checked", false);
    createPicklistBtn.textContent = "Create Picklist";
    createPicklistBtn.type = "button";
    return;
  }

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
              title: response.message,
              confirmButtonText: "OKAY",
            });
            // if (checkedIds.length === 0) {
            //   $("#incomingTableDisplay tbody .checkbox")
            //     .hide()
            //     .prop("checked", false);
            //   createPicklistBtn.textContent = "Create Picklist";
            //   createPicklistBtn.type = "button";
            //   return;
            // }
            $("#incomingTableDisplay tbody .checkbox")
              .hide()
              .prop("checked", false);
            createPicklistBtn.textContent = "Create Picklist";
          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              confirmButtonText: "OKAY",
              confirmButtonColor: "#d33",
            });
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
  // $("#incomingTableDisplay tbody .checkbox").hide().prop("checked", false);

  // createPicklistBtn.textContent = "Create Picklist";
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
