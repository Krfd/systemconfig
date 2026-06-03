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
  $.post("dirs/users/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#usersTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadUsers(() => {
      $("#usersTableDisplay").DataTable({
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

function loadUsers() {
  $.ajax({
    url: "dirs/users/dashboard/actions/get_users.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let rows = [];
      // let header = response.Header;
      let items = response.Data;

      let index = 1;

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {

        // console.log(`USERS : ${JSON.stringify(items)}`)
        items.forEach((item) => {

          let userCode = item.UserCode;
          let branch = item.Branch;
          let branchCode = item.BranchCode;
          let username = item.Username;
          let fullname = item.Fullname;
          let role = item.UserRole;
          let position = item.User_Position;
  
          rows.push([
            index++,
            userCode,
            branch,
            branchCode,
            // username,
            fullname,
            role,
            position,
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#usersTableDisplay")) {
        $("#usersTableDisplay").DataTable().clear().destroy();
        $("#usersTableDisplay tbody").empty();
      }

      $("#usersTableDisplay").DataTable({
        data: rows,
        columns: [
          { title: "#", className: "text-center" },
          { title: "UserCode", className: "text-center" },
          { title: "Branch", className: "text-center" },
          { title: "Branch Code" },
          { title: "User" },
          { title: "Role" },
          { title: "Position" },
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
          let tableBody = $("#usersTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
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