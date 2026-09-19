$(document).ready(function () {
  loadDashboard();
});

function counter() {
  // Function to animate the counter for each element
  function animateCounter(counterElement) {
    let count = 0;
    const target = parseInt(counterElement.textContent) || count; // Set target to current textContent or default to 100

    // Increase the count over time
    const interval = setInterval(() => {
      if (count < target) {
        count++;
        counterElement.textContent = count; // Update the counter's text
      } else {
        clearInterval(interval);
      }
    }, 50); // You can adjust the speed by changing this value
  }

  // Set up the Intersection Observer
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counterElement = entry.target; // Get the element that is in view
          animateCounter(counterElement); // Trigger animation for that specific element
          observer.unobserve(counterElement); // Stop observing once the counter is triggered
        }
      });
    },
    {
      threshold: 0.5, // The counter will trigger when 50% of the section is in view
    }
  );

  // Get all elements with class "counter" (or any other common class you assign)
  const counterElements = document.querySelectorAll(".counter");

  // Start observing each counter element
  counterElements.forEach((counterElement) => {
    observer.observe(counterElement); // Start observing each element
  });
}

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
  $.post("dirs/dashboard/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#outgoingTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadOutgoing(() => {
      $("#outgoingTableDisplay").DataTable({
        pageLength: 50,
        order: [0, "asc"],
      });
    });
    updateUnit();
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
  
function loadOutgoing() {
  $.ajax({
    url: "dirs/dashboard/dashboard/actions/get_system_units.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];

      // let data = JSON.stringify(response)

      // console.log(`DATA: ${data}`)

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {
        let sortedData = response.Data

        sortedData.forEach((item, index) => {

          let status = item.Server_Status
            ? item.Server_Status.toUpperCase()
            : "";
          let statusClass = "";

          if (status === "ONLINE") {
            statusClass = "bg-success";
          } else {
            statusClass = "bg-danger";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          rows.push([
            index + 1,
            item.Branch || "",
            item.SysUnit_IpAddress || "",
            item.SysUnit_Name || "",
            statusBadge,
            item.DocDate
              ? new Date(item.DocDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })
              : "",

            '<div class="dropdown">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              '<ul class="dropdown-menu">' +
              '<li><a class="dropdown-item update-item" data-id="' + item.SysU_id + '" data-unit="' + item.SysUnit_Name + '" data-address="' + item.SysUnit_IpAddress + '" data-branch="' + item.Branch + '" data-bs-toggle="modal" data-bs-target="#updateServerModal" href="#">Update</a></li>' +
              (item.Server_Status?.toUpperCase() === "ONLINE"
                ? '<li><a class="dropdown-item deactivate-item" data-id="' + item.SysU_id + '" href="#">Deactivate</a></li>'
                : "") +
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
          { title: "#", className: "text-center align-middle" },
          { title: "BRANCH", className: "align-middle" },
          { title: "IP ADDRESS", className: "align-middle" },
          { title: "PC NAME", className: "align-middle" },
          { title: "STATUS", className: "align-middle" },
          { title: "MODIFIED", className: "text-start align-middle" },
          { title: "ACTION",  className: "align-middle", orderable: false },
        ],
        pageLength: 8,
        paging: true,
        searching: true,
        info: true,
        processing: false,
        autoWidth: false,
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
          let unitId = data[0];
          let pcName = data[1];
          let address = data[2];
          let branch = data[3];
          $(row).attr("data-id", unitId);
          $(row).attr("data-unit", pcName);
          $(row).attr("data-address", address);
          $(row).attr("data-branch", branch);
          $("td:eq(0)", row).css("text-align", "center");
          $("td:eq(1)", row).addClass("text-primary");
          $("td:eq(5)", row).css("text-align", "start");

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
          let tableBody = $("#outgoingTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
                <td colspan="8" style="background: #fcf7d4">&nbsp;</td>
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
      counter()
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
}

$("#add-unit-server").on("submit", function (e) {
  e.preventDefault();

  let unitName = $("#unitName").val();
  let unitAddress = $("#unitAddress").val();
  let branch = $("#branch").val();

  $.post(
    "dirs/dashboard/dashboard/actions/addServerUnit.php",
    {
      unitName: unitName,
      unitAddress: unitAddress,
      branch: branch,
    },
    function (data) {
      let response = JSON.parse(data);

      if (response.isSuccess === "success") {
        Swal.fire({
          icon: "success",
          title: "Serer has been saved",
          showConfirmButton: true,
          confirmButtonText: "OK",
        }).then(() => {
          loadDashboard();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          confirmButtonText: "OKAY",
        });
      }
    },
  );
});

// UPDATE
$("#updateServerModal").on("show.bs.modal", function (event) {
  const button = $(event.relatedTarget);

  const unitId = button.data("id");
  const pcName = button.data("unit");
  const ipAddress = button.data("address");
  const branch = button.data("branch");

  originalUnitName = pcName || "";
  originalUnitAddress = ipAddress || "";

  $("#unitServerId").val(unitId);
  $("#updateUnitName").val(pcName);
  $("#updateUnitAddress").val(ipAddress);
  $("#updateBranch").val(branch);

  $("#updateServerBtn").prop("disabled", true);
});

// $(document).on("click", ".update-item", function (e) {
//   e.preventDefault();
//   e.stopPropagation();

//   const unitId = $(this).data("id");
//   const pcName = $(this).data("unit");
//   const ipAddress = $(this).data("address");
//   const branch = $(this).data("branch");
//   $("#unitServerId").val(unitId);
//   $("#updateUnitName").val(pcName);
//   $("#updateUnitAddress").val(ipAddress);
//   $("#updateBranch").val(branch);

//   console.log(`UNIT ID: ${unitId}`)
//   console.log(`PC NAME: ${pcName}`)
//   console.log(`IP ADDRESS: ${ipAddress}`)
//   console.log(`BRANCH: ${branch}`)
// });

$("#updateUnitName, #updateUnitAddress").on("input", function () {
  const currentUnitName = $("#updateUnitName").val();
  const currentUnitAddress = $("#updateUnitAddress").val();

  const hasChanged =
    currentUnitName !== originalUnitName ||
    currentUnitAddress !== originalUnitAddress;

  $("#updateServerBtn").prop("disabled", !hasChanged);
});


function updateUnit() {
  $("#update-unit-server").on("submit", function (e) {
    e.preventDefault();

    let unitId = $("#unitServerId").val();
    let unitName = $("#updateUnitName").val();
    let unitAddress = $("#updateUnitAddress").val();
    let branch = $("#updateBranch").val();

    $.post(
      "dirs/dashboard/dashboard/actions/updateUnit.php",
      {
        unitId: unitId,
        unitName: unitName,
        unitAddress: unitAddress,
        branch: branch,
      },
      function (data) {
        let response = JSON.parse(data);

        if (response.isSuccess === "success") {
          Swal.fire({
            icon: "success",
            title: "Server has been updated",
            showConfirmButton: true,
            confirmButtonText: "OK",
          }).then(() => {
            $("#updateServerModal").modal("hide");
            loadDashboard();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Unit was not updated",
            text: response.Data
          });
        }
      },
    );
  });
}