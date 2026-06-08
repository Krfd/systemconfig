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
  $.post("dirs/logs/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#logsTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadLogs(() => {
      $("#logsTableDisplay").DataTable({
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

function loadLogs() {
  $.ajax({
    url: "dirs/logs/dashboard/actions/get_logs.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let items = response.Data;

      let index = 1;

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {
        items.forEach((item) => {
          let reference = item.Reference;
          let branch = item.Branch;
          let userCode = item.UserCode;
          let name = item.Name;
          let role = item.Role;
          let position = item.Position;
          let LogTime = item.logTime;
          let action = item.Action;

          let formattedDate = new Date(LogTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });

           let positionClass = "";

          if (position === "Audit") {
            positionClass = "bg-warning"
          } else if (position === "Administrator") {
            positionClass = "bg-secondary"
          } else if (position === "PDG") {
            positionClass = "bg-danger"
          } else if (position === "Warehouseman") {
            positionClass = "bg-primary"
          } else {
            positionClass = "bg-success"
          }

          let positionBadge = `<span class="badge ${positionClass}">${position}</span>`

          let actionClass = ""

          if (action === "REQUESTED") {
            actionClass = "bg-info"
          } else if (action === "DELIVERED") {
            actionClass = "bg-success"
          } else if (action === "") {
            
          }

          let actionBadge = `<span class="badge ${actionClass}">${action}</span>`

          rows.push([
            index++,
            reference,
            branch,
            userCode,
            name,
            role,
            positionBadge,
            // LogTime,
            formattedDate,
            actionBadge
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#logsTableDisplay")) {
        $("#logsTableDisplay").DataTable().clear().destroy();
        $("#logsTableDisplay tbody").empty();
      }

      $("#logsTableDisplay").DataTable({
        data: rows,
        columns: [
          { title: "#", className: "text-center" },
          { title: "Reference", className: "text-center" },
          { title: "Branch", className: "text-center" },
          { title: "User Code" },
          { title: "Name" },
          { title: "Role" },
          { title: "Position" },
          { title: "Log Time" },
          { title: "Action" },
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
          let tableBody = $("#logsTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
                <td colspan="9" style="background: #FFFBDF">&nbsp;</td>
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