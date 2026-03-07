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
  $.post("dirs/outgoing/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);
    loadOutgoing();
    $("#outgoingTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
  });
}

function newRequest() {
  $.post("dirs/outgoing/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

var outgoingTable;

$.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
  return this.api()
    .column(col, { order: "index" })
    .nodes()
    .map(function (td) {
      if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
      return $(td).text();
    });
};

function loadOutgoing() {
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];

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
              '<li><a class="dropdown-item" href="pdf.php?srn=' +
              item.BaseNum_SRN +
              '" target="_blank">Print</a></li>' +
              "</ul></div>",
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#outgoingTableDisplay")) {
        $("#outgoingTableDisplay").DataTable().clear().destroy();
        $("#outgoingTableDisplay tbody").empty();
      }

      $("#outgoingTableDisplay").DataTable({
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
        language: {
          emptyTable: "", // 🔥 removes "No data available in table"
        },
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
          let tableBody = $("#outgoingTableDisplay tbody");
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
      console.error("Error loading outgoing data: ", error);
    },
  });
}

$(document).on("dblclick", "#outgoingTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let RowNum = $(this).find("td:first").text().trim();
  openOutgoingForm(RowNum);
});

$(document).on("click", ".open-item", function (e) {
  e.preventDefault(); // prevent # jump
  e.stopPropagation(); // stop row click behavior

  let RowNum = $(this).closest("tr").find("td:first").text().trim();

  openOutgoingForm(RowNum);
});

function openOutgoingForm(rowNum) {
  $.post(
    "dirs/outgoing/requests/components/main.php",
    { RowNum: rowNum }, // send RowNum to view
    function (html) {
      $("#main-content").html(html);
    },
  );
}

$(document).on("click", ".cancel-outgoing", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let SRN = $(this).data("srn");
  // let rowElement = $(this).closest("tr");

  // console.log(`CANCEL - RowNumber: ${RowNumber}`);

  // cancelOutgoingForm(RowNumber, rowElement);
  cancelOutgoingForm(SRN);
});

// function cancelOutgoingForm(RowNumber, rowElement) {
function cancelOutgoingForm(SRN) {
  if (!SRN) {
    Swal.fire({
      icon: "error",
      title: "Missing SRN",
      text: "Make sure that the SRN exists!",
      confirmButtonText: "OKAY",
    });
    return;
  }

  console.log(`SRN TYPE: ${typeof SRN}, SRN VALUE: ${SRN}`);

  Swal.fire({
    icon: "question",
    title: "Cancel this request?",
    text: "This action cannot be change.",
    confirmButtonText: "Yes, Cancel",
    showCancelButton: true,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/outgoing/dashboard/actions/update_cancellation.php",
        {
          SRN: SRN,
        },
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Request cancelled",
                confirmButtonText: "OKAY",
              }).then(() => {
                location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to cancel request",
                text:
                  res.message ||
                  "An error occurred while canceling the request.",
                confirmButtonText: "OKAY",
              });
            }
          } catch (e) {
            console.error("Error parsing response: ", e);
          }
        },
      );
    }
  });
}

// TRUNCATE TABLES
function clearTables() {
  Swal.fire({
    icon: "question",
    title: "Truncate tables?",
    showConfirmButton: true,
    confirmButtonText: "Yes, Clear",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Tables has been reset");

      $.post(
        "dirs/outgoing/dashboard/actions/update_truncatetable.php",
        {},
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Tables has been reset",
              }).then(() => {
                location.reload();
              });
            }
          } catch (e) {
            console.error("Error parsing response: ", e);
          }
        },
      );
    }
  });
}
