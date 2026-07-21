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

function totalRequests () {
  $.ajax({
    url: "dirs/requests/dashboard/actions/getTotalRequests.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        $("#totalRequests").text(response.Data.TotalRequests || "20");
      } else {
        console.log(`Something went wrong`)
      }
    } 
  })
}

function loadDashboard() {
  totalRequests()
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

function returnOutgoing() {
  $.post("dirs/requests/dashboard/requests.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadRequests() {
  $.ajax({
    url: "dirs/requests/dashboard/actions/get_requests.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let items = response.Data;
      let details = response.DriverDetails;

      let rowCount = 1;

      let detailMap = {};

      details.forEach((detail) => {
        detailMap[detail.BatchNumber] = detail;
      });

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {
        items.forEach((item, index) => {
          let detail = detailMap[item.BatchNumber] || {};

          let srn = item.SR_Number;
          let origin = item.BranchOrigin;
          let destination = item.BranchOrigin;
          // let status = item.docStatus;
          let driver = detail.Driver || "N/A";
          let truckCategory = detail.TruckCategory || "N/A";
          let truckPlate = detail.TruckPlate || "N/A";
          let reqDate = formatDate(item.EncodeDate).replace(/-/g, "/");
          let recDate = formatDate(item.RecDate).replace(/-/g, "/");

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
            statusClass = "bg-warning";
          } else if (status === "DELIVERED" || status === "RECEIVED") {
            statusClass = "bg-success";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          rows.push([
            rowCount++,
            srn,
            origin,
            destination,
            statusBadge,
            driver,
            truckCategory,
            truckPlate,
            reqDate,
            recDate,
            '<div class="dropdown">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              '<ul class="dropdown-menu">' +
              '<li><a class="dropdown-item open-item" href="#">Open</a></li>' +
              '<li><a class="dropdown-item cancel-outgoing" data-srn="' +
              item.SR_Number +
              '" data-entry="' +
              item.DocEntry +
              '" href="#">Cancel</a></li>' +
              '<li><a class="dropdown-item print-pdf" href="#" target="_blank" data-srn="' +
              item.SR_Number +
              '">Print</a></li>' +
              '<li><a class="dropdown-item terminate-item" data-srn="' +
              item.SR_Number +
              '" data-entry="' +
              item.DocEntry +
              '" href="#">Terminate</a></li>' +
              "</ul></div>",
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#requestsTableDisplay")) {
        $("#requestsTableDisplay").DataTable().clear().destroy();
        $("#requestsTableDisplay tbody").empty();
      }

      $("#requestsTableDisplay").DataTable({
        data: rows,
        columns: [
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
          { title: "Action", className: "text-start" },
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
          if ($(row).hasClass("empty-row")) {
            return;
          }
          $("td", row).css({
            background: "#fcf7d4",
            padding: "3px",
            height: "40px",
            "min-height": "40px",
            cursor: "pointer",
          });
          let docEntry = data[0];
          $(row).attr("data-docentry", docEntry);
          $("td:eq(0)", row).css("text-align", "center");
          $("td:eq(1)", row).addClass("text-primary");
          $("td:eq(5)", row).css("text-align", "start");

          // Add hover effect to empty rows too
          $(row).hover(
            function () {
              $(this).css("background", "#FFF4C2");
            },
            function () {
              $(this).css("background", "#fcf7d4");
            },
          );
        },
        drawCallback: function () {
          let tableBody = $("#requestsTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
                <td colspan="11" style="background: #fcf7d4">&nbsp;</td>
              </tr>
            `);
            $emptyRow.css({
              background: "#fcf7d4",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            $emptyRow.hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#fcf7d4");
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

$(document).on("dblclick", "#requestsTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let docEntry = $(this).data("docentry");
  openForm(docEntry);
});

function openForm(DocEntry) {
  $("#main-content").html(spinner);
  setTimeout(function () {
    openRequest(DocEntry);
  }, 200);
}

// TRIGGER TO OPEN A REQUEST
$(document).on("click", ".open-item", function (e) {
  e.preventDefault(); // prevent # jump
  e.stopPropagation(); // stop row click behavior

  let docEntry = $(this).closest("tr").data("docentry");
  openForm(docEntry);
});

function openRequest(DocEntry) {
  $("#main-content").html(spinner);
  $.post("../dirs/outgoing/dashboard/request.php", function (data) {
    $("#main-content").html(data);

    $.ajax({
      url: "../dirs/outgoing/dashboard/actions/get_openrequest.php",
      type: "POST",
      data: { DocEntry: DocEntry },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let rowCount = response.Items.length;
          let totalQty = 0;

          let header = response.Header;
          let items = response.Items;

          $("#srn-title").text(header.SR_Number);

          $("#srn").val(header.SR_Number);
          $("#destination").val(header.BranchDestination);
          $("#branchWhCode").val(header.BranchDestination_Whscode);
          $("#origin").val(header.BranchOrigin);
          $("#whcode").val(header.BranchOrigin_Whscode);

          $("#date").val(header.EncodeDate);
          $("#status").val(header.RequestStatus);
          $("#purpose").val(header.PurposeRequest);
          $("#reqBy").val(header.RequestedBy);
          $("#remarks").val(header.Remarks);

          let rows = "";
          items.forEach(function (item, index) {
            let quantity = parseFloat(item.Request_Qty) || 0;
            totalQty += quantity;
            rows += `
            <tr>
              <td style="background:#fcf7d4">${index + 1}</td>
              <td style="background:#fcf7d4">${item.ItemBrand}</td>
              <td style="background:#fcf7d4">${item.ItemName}</td>
              <td style="background:#fcf7d4">${item.ItemCategory}</td>
              <td style="background:#fcf7d4">${item.Request_Qty}</td>
            </tr>
            `;
          });

          $("#totalReqQuantity").text(totalQty);
          $("#openIncomingTable tbody").html(rows);

          if (rowCount < 8) {
            let emptyRows = 8 - rowCount;

            for (let i = 0; i < emptyRows; i++) {
              let emptyRow = `
              <tr class="item-row empty-row" style="height: 50px; min-height: 50px;">
                <td style="background: #fcf7d4"></td>
                <td style="background: #fcf7d4"></td>
                <td style="background: #fcf7d4"></td>
                <td style="background: #fcf7d4"></td>
                <td style="background: #fcf7d4"></td>
              </tr>
              `;
              $("#openIncomingTable tbody").append(emptyRow);
            }
            $("#totalQuantity").text(totalQty);
          }
        } else {
          console.warn(`NO DATA FROM ROWNUM`);
        }
      },
      error: function (xhr) {
        console.error(xhr.responseText);
      },
    });
  });
}
