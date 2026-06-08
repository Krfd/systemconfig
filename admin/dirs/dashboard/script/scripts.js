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

$(document).on("click", "#topRequestorsList a", function (e) {
  e.preventDefault();

  const branch = $(this).data("branch");

  loadBranchDetails(branch);
});

function returnDashboard() {
  $.post("dirs/dashboard/dashboard.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadDashboard() {
  $("#dashboard_content").html(spinner);
  $.post("dirs/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    // $("#outgoingTableDisplay tbody").html(`
    //   <tr>
    //     <td colspan="100%" class="text-center">${spinner}</td>
    //   </tr>
    // `);

    // loadOutgoing(() => {
    //   $("#outgoingTableDisplay").DataTable({
    //     pageLength: 50,
    //     order: [0, "desc"],
    //   });
    // });

    // TOP REQUESTORS
    $.ajax({
      url: "dirs/dashboard/actions/get_top_requestors.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success" && Array.isArray(response.Data)) {
          let html = "";

          response.Data.forEach((item) => {
            html += `
              <a href="#" data-branch="${item.Branch}" class="icon-link icon-link-hover fw-bold text-decoration-none list-group-item d-flex align-items-center">
                ${item.Branch}
                <i class="bi bi-arrow-right align-self-start ms-1"></i>
                <span class="text-end ms-auto badge text-bg-primary rounded-pill">
                  ${item.TotalRequests}
                </span>
              </a>
            `;
          });

          $("#topRequestorsList").html(html);
        } else {
          $("#topRequestorsList").html(`
            <li class="list-group-item text-muted">No data available</li>
          `);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error loading top requestors:", error);
      },
    });

    // STATS
    $.ajax({
      url: "dirs/dashboard/actions/stats.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          $("#overall").text(`${response.overall.overall || 0}`);
          $("#delivered").text(`${response.delivered.delivered || 0}`);
          $("#processing").text(`${response.processing.processing || 0}`);
          $("#rejected").text(`${response.rejected.rejected || 0}`);
        }
      },
    });

    // STATS
    $.ajax({
      url: "dirs/dashboard/actions/get_recent_activities.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let html = "";

          response.Data.forEach((item) => {
            // format time (e.g. "June 6, 2026")
            let formattedTime = new Date(item.RequestDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            // ${item.Action}

            html += `
              <li class="list-group-item">
                ${item.RequestedBy} <span class="fw-bold">requested</span> <span class="badge bg-success">${Math.trunc(item.ItemTotal_Qty)}</span> items
                <span class="text-muted small float-end">${formattedTime}</span>
              </li>
            `;
          });

          $("#activityList").html(html);
        } else {
          $("#activityList").html(`
            <li class="list-group-item text-muted">No recent activities</li>
          `);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error loading activities:", error);
      },
    });

    $.post("dirs/dashboard/actions/get_dashboard.php", {}, function () {
      // $.ajax({
      //   url: "dirs/dashboard/actions/stats.php",
      //   type: "GET",
      //   dataType: "json",
      //   success: function (response) {
      //     if (response.isSuccess === "success") {
      //       console.log(`SHOULD DISPLAY STATS`)
      //     }
      //   }
      // })
    });

    // GET DATA FOR DASHBOARD
  });
}

function loadBranchDetails(branch) {
  if (!branch) {
    return;
  }

  $("#main-content").html(spinner);
  $.post("dirs/dashboard/requestingBranch.php", {}, function (data) {
    $("#main-content").hide().html(data).fadeIn(200);

    $("#branchName").text(branch);

    $.ajax({
      url: "dirs/dashboard/actions/branchRequest.php",
      type: "POST",
      data: {
        branch: branch,
      },
      dataType: "json",
      success: function (response) {
        let items = response.Data;
        let routes = response.Route;
        let branchTable = $("#branchDetailsTableDisplay tbody");
        let rows = [];

        branchTable.empty();

        // console.log(`ROUTE : ${JSON.stringify(routes)}`);

        items.forEach((item, index) => {
          if (!item) return;
          let srn = item.SR_Number;
          let status = item.RequestStatus;
          let origin = routes.BranchOrigin;
          let reqBranch = routes.BranchDestination;
          let rows = [];

          if (status === "NEW") {
            statusClass = "bg-primary";
          } else if (status === "CANCEL" || status === "TERMINATE") {
            statusClass = "bg-warning";
          } else if (status === "PROCESSING") {
            statusClass = "bg-info";
          } else if (status === "REJECTED") {
            statusClass = "bg-danger";
          } else if (status === "DELIVERED" || status === "RECEIVED") {
            statusClass = "bg-success";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;
          const date = new Date(item.RequestDate);

          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0",
          )}-${String(date.getDate()).padStart(2, "0")}-${String(
            date.getFullYear(),
          ).slice(-2)}`;

          rows.push([
            index + 1,
            srn,
            origin,
            reqBranch,
            statusBadge,
            formattedDate,
          ]);

          // rows += `
          // let newRow = `
          //   <tr style="height: 40px; min-height: 40px; cursor: pointer">
          //     <td class="align-middle ps-3" style="background: #FFFBDF">${index + 1}</td>
          //     <td class="align-middle ps-3" style="background: #FFFBDF">${srn}</td>
          //     <td class="align-middle ps-3" style="background: #FFFBDF">${origin}</td>
          //     <td class="align-middle ps-3" style="background: #FFFBDF">${reqBranch}</td>
          //     <td class="align-middle ps-3" style="background: #FFFBDF">${statusBadge}</td>
          //     <td class="align-middle ps-3" style="background: #FFFBDF">${formattedDate}</td>
          //     <td class="align-middle ps-3" style="background: #FFFBDF">
          //       <div class="dropdown dropstart">
          //         <button class="btn btn-sm" type="button" data-bs-toggle="dropdown">
          //           <i class="bi bi-three-dots"></i>
          //         </button>
          //         <ul class="dropdown-menu">
          //           <li>
          //             <a class="dropdown-item open-srn" href="#">Open</a>
          //           </li>
          //           <li>
          //             <a class="dropdown-item print-srn" href="#">Print</a>
          //           </li>
          //         </ul>
          //       </div>
          //     </td>
          //   </tr>
          // `;

          // let emptyRow = branchTable
          //   .find("tr")
          //   .filter(function () {
          //     return $(this).find("td").eq(0).text().trim() === "";
          //   })
          //   .first();

          // if (emptyRow.length) {
          //   // emptyRow.replaceWith(rows);
          //   emptyRow.replaceWith(newRow);
          // } else {
          //   // branchTable.prepend(rows);
          //   branchTable.prepend(newRow);
          // }
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#branchDetailsTableDisplay")) {
          $("#branchDetailsTableDisplay").DataTable().destroy();
          $("#branchDetailsTableDisplay tbody").empty();
        }

        $("#branchDetailsTableDisplay").DataTable({
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
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });

            let userId = data[0];
            let username = data[5];

            $(row).attr("data-id", userId);
            $(row).attr("data-user", username);
            $(row).addClass("reset");
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
    });
  });
}

// $.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
//   return this.api()
//     .column(col, { order: "index" })
//     .nodes()
//     .map(function (td) {
//       if ($(td).text().trim() === "") return Infinity; // push empty rows to bottom
//       return $(td).text();
//     });
// };

// function loadOutgoing() {
//   $.ajax({
//     url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
//     type: "POST",
//     dataType: "json",
//     success: function (response) {
//       let rows = [];

//       if (response.isSuccess === "success" && Array.isArray(response.Data)) {
//         let sortedData = response.Data.sort(
//           (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
//         );

//         sortedData.forEach((item) => {
//           let status = item.RequestStatus
//             ? item.RequestStatus.toUpperCase()
//             : "";
//           let statusClass = "";

//           if (status === "NEW") {
//             statusClass = "bg-primary";
//           } else if (status === "CANCEL" || status === "CANCELLED") {
//             statusClass = "bg-warning";
//           } else if (status === "RECEIVED") {
//             statusClass = "bg-success";
//           } else if (status === "IN TRANSIT") {
//             statusClass = "bg-primary";
//           } else if (status === "TERMINATED") {
//             statusClass = "bg-secondary";
//           } else if (status === "REJECTED") {
//             statusClass = "bg-danger";
//           } else if (status === "PROCESSING") {
//             statusClass = "bg-info";
//           }

//           let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

//           rows.push([
//             item.DocEntry,
//             item.RowNum !== undefined ? item.RowNum.toString() : "",
//             item.SR_Number || "",
//             item.BranchOrigin || "",
//             item.BranchDestination || "",
//             statusBadge,
//             item.EncodeDate || "N/A",

//             '<div class="dropdown">' +
//               '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
//               '<i class="bi bi-three-dots"></i></button>' +
//               '<ul class="dropdown-menu">' +
//               '<li><a class="dropdown-item open-item" href="#">Open</a></li>' +
//               (item.RequestStatus?.toUpperCase() === "NEW"
//                 ? '<li><a class="dropdown-item cancel-outgoing" data-srn="' +
//                   item.SR_Number +
//                   '" href="#">Cancel</a></li>'
//                 : "") +
//               (item.RequestStatus?.toUpperCase() === "PARTIAL"
//                 ? '<li><a class="dropdown-item terminate-item" data-srn="' +
//                   item.SR_Number +
//                   '" href="#">Terminate</a></li>'
//                 : "") +
//               '<li><a class="dropdown-item print-pdf" href="#" target="_blank" data-srn="' +
//               item.SR_Number +
//               '">Print</a></li>' +
//               "</ul></div>",
//           ]);
//         });
//       }

//       if (rows.length === 0) {
//         for (let i = 0; i < 8; i++) {
//           rows.push(["", "", "", "", "", "", "", ""]);
//         }
//       }

//       if ($.fn.DataTable.isDataTable("#outgoingTableDisplay")) {
//         $("#outgoingTableDisplay").DataTable().clear().destroy();
//         $("#outgoingTableDisplay tbody").empty();
//       }

//       $("#outgoingTableDisplay").DataTable({
//         data: rows,
//         columns: [
//           { title: "DocEntry", visible: false },
//           { title: "#", className: "text-center" },
//           { title: "SRN" },
//           { title: "Stock Origin" },
//           { title: "Requested by" },
//           { title: "Status" },
//           { title: "Date", className: "text-start" },
//           { title: "Actions", orderable: false },
//         ],
//         pageLength: 8,
//         paging: true,
//         searching: true,
//         info: true,
//         processing: false,
//         autoWidth: false,
//         order: [[0, "desc"]],
//         language: {
//           emptyTable: "", // 🔥 removes "No data available in table"
//         },
//         // language: {
//         //   emptyTable: "No records found",
//         // },
//         rowCallback: function (row, data, index) {
//           $("td", row).css({
//             background: "#FFFBDF",
//             padding: "3px",
//             height: "40px",
//             "min-height": "40px",
//             cursor: "pointer",
//           });
//           let docEntry = data[0];
//           $(row).attr("data-docentry", docEntry);
//           $("td:eq(0)", row).css("text-align", "center");
//           $("td:eq(1)", row).addClass("text-primary");
//           $("td:eq(5)", row).css("text-align", "start");

//           // Add hover effect to empty rows too
//           $(row).hover(
//             function () {
//               $(this).css("background", "#FFF4C2");
//             },
//             function () {
//               $(this).css("background", "#FFFBDF");
//             },
//           );
//         },
//         drawCallback: function () {
//           let tableBody = $("#outgoingTableDisplay tbody");
//           let currentRows = tableBody.find("tr").length;

//           for (let i = currentRows; i < 8; i++) {
//             let $emptyRow = $(`
//               <tr class="empty-row">
//                 <td colspan="8" style="background: #FFFBDF">&nbsp;</td>
//               </tr>
//             `);
//             $emptyRow.css({
//               background: "#FFFBDF",
//               height: "40px",
//               "min-height": "40px",
//               cursor: "pointer",
//             });
//             $emptyRow.hover(
//               function () {
//                 $(this).css("background", "#FFF4C2");
//               },
//               function () {
//                 $(this).css("background", "#FFFBDF");
//               },
//             );
//             tableBody.append($emptyRow);
//           }
//         },
//       });
//     },
//     error: function (xhr, status, error) {
//       console.error("Error loading outgoing data: ", error);
//     },
//   });
// }
