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

function recentlyAdded() {
  $.ajax({
    url: "dirs/users/dashboard/actions/get_recentlyAdded.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let html = "";

        response.Data.forEach(function(user) {
          html += `
            <li class="list-group-item d-flex align-items-center justify-content-between">
              <div class="fw-bold">
                ${user.Fullname}
                <small class="text-muted">
                  — ${user.User_Position} • ${user.Branch}
                </small>
              </div>
              <div class="text-end">
                <small class="text-end text-muted">${user.DocDate ?? "07/20/2026"}</small>
              </div>
            </li>
          `
        })

        $("#recentlyAddedList").html(html);

      } else {
        $("#recentlyAddedList").html(`
          <li class="list-group-item text-muted">
            No recently added users.
          </li>
        `);
      }
    },
    error: function(xhr, status, error) {
      console.error(error);
      $("#recentlyAddedList").html(`
        <li class="list-group-item text-danger">
          Failed to load recently added users.
        </li>
      `);
    }
  })
}

function loadDashboard() {
  $("#dashboard_content").html(spinner);
  $.post("dirs/users/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#usersTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    recentlyAdded();

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
      let items = response.Data;
      let totals = response.Total;

      let index = 1;

      $("#positionCards").html(spinner);

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {
        let totals = response.Total;
        let html = "";

        const positionColors = {
          PDG: "danger",
          Warehouseman: "primary",
          Audit: "warning",
          "Software Developer": "success",
        };

        const buttonClasses = {
          danger: "bg-danger-subtle text-danger border-danger-subtle",
          primary: "bg-primary-subtle text-primary border-primary-subtle",
          warning: "bg-warning-subtle text-warning border-warning-subtle",
          success: "bg-success-subtle text-success border-success-subtle",
          secondary:
            "bg-secondary-subtle text-secondary border-secondary-subtle",
        };

        totals.forEach((item) => {
          let color = positionColors[item.User_Position] || "secondary";

          let btnClass = buttonClasses[color] || buttonClasses.secondary;

          html += `
                <div class="col-md-3">
                    <div class="card shadow-sm rounded-2 h-auto p-3">
                        <div class="d-flex align-items-center gap-1">
                            <h3 class="fw-bold text-dark-emphasis">${item.User_Position}</h3>
                        </div>
                        <div class="d-flex gap-3 mb-5">
                            <div class="rounded-5 shadow fw-semibold p-3 bg-${color} text-center text-white display-6"
                                  style="min-width:90px">
                                ${item.TotalUsers}
                            </div>
                            <div>
                                <small class="text-muted">
                                    | Total Users
                                </small>
                                <br>
                                <button class="btn btn-sm mt-3 ${btnClass} w-auto ms-auto" 
                                  data-bs-toggle="modal"
                                  data-bs-target="#user-form"
                                  type="button"
                                  data-position="${item.User_Position}">
                                    + Add member
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        $("#user-form").on("show.bs.modal", function (event) {
          const button = $(event.relatedTarget); // the clicked button
          const position = button.data("position");

          $("#newPosition").val(position);
        });

        $("#positionCards").html(html);

        items.forEach((item) => {
          let userId = item.Uid;
          let userCode = item.UserCode;
          let branch = item.Branch;
          let branchCode = item.BranchCode;
          let username = item.Username;
          let fullname = item.Fullname;
          let role = item.UserRole;
          let position = item.User_Position;

          let roleClass = "";

          if (position === "Audit") {
            positionBadge = "bg-warning";
          } else if (position === "Administrator") {
            positionBadge = "bg-secondary";
          } else if (position === "PDG") {
            positionBadge = "bg-danger";
          } else if (position === "Warehouseman") {
            positionBadge = "bg-primary";
          } else {
            positionBadge = "bg-success";
          }

          let roleBadge = `<span class="badge ${positionBadge}">${position}</span>`;

          rows.push([
            userId,
            index++,
            userCode,
            branch,
            branchCode,
            fullname,
            role,
            roleBadge,
            `<div class="dropdown dropstart">
              <button class="btn btn-sm" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item view" data-id="${userId}" data-user="${fullname}" href="#">View Profile</a></li>
                <li><a class="dropdown-item disable" data-id="${userId}" data-user="${fullname}" href="#">Disable</a></li>
                <li><a class="dropdown-item reset" data-id="${userId}" data-user="${fullname}" href="#">Reset Password</a></li>
              </ul>
            </div>
            `,
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#usersTableDisplay")) {
        $("#usersTableDisplay").DataTable().clear().destroy();
        $("#usersTableDisplay tbody").empty();
      }

      $("#usersTableDisplay").DataTable({
        data: rows,
        columns: [
          { visible: false },
          { title: "#", className: "text-center" },
          { title: "UserCode", className: "text-center" },
          { title: "Branch", className: "text-center" },
          { title: "Branch Code" },
          { title: "User" },
          { title: "Role" },
          { title: "Position" },
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
            background: "#fcf7d4",
            padding: "3px",
            height: "40px",
            "min-height": "40px",
            cursor: "pointer",
          });

          let userId = data[0];
          let username = data[5];

          $(row).attr("data-id", userId);
          $(row).attr("data-user", username);
          // $(row).addClass("reset");
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
          let tableBody = $("#usersTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
                <td colspan="9" style="background: #fcf7d4">&nbsp;</td>
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

function viewProfile() {
  alert("Viewing Profile")
}

$(document).on("click", ".view", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let id = $(this).data("id");
  let user = $(this).data("user");

  viewProfile();
});

$(document).on("click", ".disable", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let id = $(this).data("id");
  let user = $(this).data("user");

  Swal.fire({
    title: "Disable this user?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Disable",
    cancelButtonColor: "#dc3545",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "dirs/users/dashboard/actions/disable_user.php",
        data: { id: id },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            Swal.fire({
              icon: "success",
              title: "User has been disabled",
              confirmButtonText: "OK"
            }).then(() => {
              loadUsers();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Something went wrong!",
            });
          }
        },
      });
    }
  });
});

$(document).on("click", ".reset", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let id = $(this).data("id");
  let user = $(this).data("user");

  Swal.fire({
    title: "Are you sure?",
    text: "Reset " + user + "'s Password?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Confirm",
    cancelButtonColor: "#dc3545",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "dirs/users/dashboard/actions/reset_user_password.php",
        data: { id: id },
        dataType: "json",
        success: function (response) {
          if (response.isSuccess === "success") {
            Swal.fire({
              icon: "success",
              title: "Password has been reset",
              confirmButtonText: "OK"
            }).then(() => {
              loadUsers();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Something went wrong!",
            });
          }
        },
      });
    }
  });
});