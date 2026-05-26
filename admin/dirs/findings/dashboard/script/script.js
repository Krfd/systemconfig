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
  $("#dashboard_content").html(spinner);
  $.post("dirs/findings/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#findingsTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadFindings(() => {
      $("#findingsTableDisplay").DataTable({
        pageLength: 50,
        order: [0, "desc"],
      });
    });
  });
}

$.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
  return this.api()
    .column(col, { order: "index" })
    .nodes()
    .map(function (td) {
      if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
      return $(td).text();
    });
};

function loadFindings() {
  $.ajax({
    url: "dirs/findings/dashboard/actions/get_findings.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let items = response.Data;

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {

        items.forEach((item) => {
          let reference = item.reference;
          let branch = item.branch;
          let serial = item.itemSerial;
          let toDeliver = item.toDeliver;
          let intransitQty = item.itemQty;
          let diff = item.diff;
          let status = item.status;
          let transaction = item.trans;
          let driver = item.driver;
          let truckCategory = item.truckCategory;
          let truckPlate = item.truckPlate;
          let encodeDate = item.docDate;
          encodeDate.toLocaleString();

          let status = item.RequestStatus
            ? item.RequestStatus.toUpperCase()
            : "";
          let statusClass = "";

          if (status === "LACKING" || status === "EXCEEDING") {
            statusClass = "bg-danger";
          } else {
            statusClass = "bg-warning";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          rows.push([
            index++,
            reference,
            branch,
            serial,
            toDeliver,
            intransitQty,
            diff,
            statusBadge,
            transaction,
            driver,
            truckCategory,
            truckPlate,
            encodeDate,

            // '<div class="dropdown">' +
            //   '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
            //   '<i class="bi bi-three-dots"></i></button>' +
            //   '<ul class="dropdown-menu">' +
            //   '<li><a class="dropdown-item open-item" href="#">Open</a></li>' +
            //   (item.RequestStatus?.toUpperCase() === "NEW"
            //     ? '<li><a class="dropdown-item cancel-outgoing" data-srn="' +
            //       item.SR_Number +
            //       '" href="#">Cancel</a></li>'
            //     : "") +
            //   (item.RequestStatus?.toUpperCase() === "PARTIAL"
            //     ? '<li><a class="dropdown-item terminate-item" data-srn="' +
            //       item.SR_Number +
            //       '" href="#">Terminate</a></li>'
            //     : "") +
            //   '<li><a class="dropdown-item print-pdf" href="#" target="_blank" data-srn="' +
            //   item.SR_Number +
            //   '">Print</a></li>' +
            //   "</ul></div>",
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", "", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#findingsTableDisplay")) {
        $("#findingsTableDisplay").DataTable().clear().destroy();
        $("#findingsTableDisplay tbody").empty();
      }

      $("#findingsTableDisplay").DataTable({
        data: rows,
        columns: [
          { title: "#"},
          { title: "Ref. #", className: "text-center" },
          { title: "Branch" },
          { title: "Serial" },
          { title: "To Deliver" },
          { title: "Qty" },
          { title: "Diff.", className: "text-start" },
          { title: "Status", className: "text-center" },
          { title: "Transaction" },
          { title: "Driver" },
          { title: "Truck Category" },
          { title: "Truck Plate" },
          { title: "Timestamp" },
        ],
        pageLength: 8,
        paging: true,
        searching: true,
        info: true,
        processing: false,
        autoWidth: false,
        order: [[0, "desc"]],
        language: {
          emptyTable: "",
        },
        rowCallback: function (row, data, index) {
          $("td", row).css({
            background: "#FFFBDF",
            padding: "3px",
            height: "40px",
            "min-height": "40px",
            cursor: "pointer",
          });
          // let docEntry = data[0];
          // $(row).attr("data-docentry", docEntry);
          // $("td:eq(0)", row).css("text-align", "center");
          // $("td:eq(1)", row).addClass("text-primary");
          // $("td:eq(5)", row).css("text-align", "start");

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
          let tableBody = $("#findingsTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let emptyRow = $(`
              <tr class="empty-row">
                <td colspan="13" style="background: #FFFBDF">&nbsp;</td>
              </tr>
            `);
            emptyRow.css({
              background: "#FFFBDF",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            emptyRow.hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#FFFBDF");
              },
            );
            tableBody.append(emptyRow);
          }
        },
      });
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
}