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

    $.post("dirs/dashboard/actions/get_dashboard.php", {}, function () {

      

    })



    // GET DATA FOR DASHBOARD

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