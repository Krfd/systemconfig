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
  $.post("dirs/requests/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#requestsTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadRequests(() => {
      $("#requestsTableDisplay").DataTable({
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

function loadRequests() {
  $.ajax({
    url: "dirs/requests/dashboard/actions/get_requests.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let rows = [];
      // let header = response.Header;
      let items = response.Data;

      let index = 1;

      // if (response.isSuccess === "success" && Array.isArray(response.Data)) {
      if (response.isSuccess === "success" && Array.isArray(response.Data)) {

        items.forEach((item) => {

          let srn = item.SR_Number;
          let origin = item.BranchOrigin;
          let destination = item.BranchOrigin;
          // let status = item.docStatus;
          let driver = item.driver || "N/A";
          let truckCategory = item.TruckCategory || "N/A";
          let truckPlate = item.TruckPlate || "N/A";
          let reqDate = formatDate(item.EncodeDate);
          let recDate = formatDate(item.RecDate);
          
          let status = item.RequestStatus
            ? item.RequestStatus.toUpperCase()
            : "";
          let statusClass = "";

          if (status === "NEW" || status === "IN TRANSIT") {
            statusClass = "bg-primary";
          } else if (status === "PARTIAL") {
            statusClass = "bg-warning";
          } else if (status === "PROCESSING") {
            statusClass = "bg-info";    
          } else if (status === "CANCELLED") {
            statusClass = "bg-secondary";
          } else if (status === "DELIVERED" || status === "RECEIVED") {
            statusClass = "bg-success";
          } 

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          rows.push([
            index++,
            srn,
            origin,
            destination,
            statusBadge,
            driver,
            truckCategory,
            truckPlate,
            reqDate,
            recDate,
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#requestsTableDisplay")) {
        $("#requestsTableDisplay").DataTable().clear().destroy();
        $("#requestsTableDisplay tbody").empty();
      }

      $("#requestsTableDisplay").DataTable({
        data: rows,
        columns: [
          // { title: "#", visible: false },
          { title: "#", className: "text-center" },
          { title: "SRN", className: "text-center" },
          { title: "Stock Origin" },
          { title: "Requesting Branch" },
          { title: "Status" },
          { title: "Driver" },
          { title: "Truck Category", className: "text-start" },
          { title: "Truck Plate", className: "text-start" },
          { title: "Date Requested", className: "text-start" },
          { title: "Date Received", className: "text-start" },
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
        //   let docEntry = data[0];
        //   $(row).attr("data-docentry", docEntry);
        //   $("td:eq(0)", row).css("text-align", "center");
        //   $("td:eq(1)", row).addClass("text-primary");
        //   $("td:eq(5)", row).css("text-align", "start");

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
          let tableBody = $("#requestsTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
                <td colspan="10" style="background: #FFFBDF">&nbsp;</td>
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

function formatDate(dateStr) {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}-${day}-${year}`;
}