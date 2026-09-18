$(document).ready(function () {
  loadDashboard();
});

document.addEventListener("DOMContentLoaded", () => {
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

  console.log(`COUNTER START`)
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
  // $("#dashboard_content").html(spinner);
  $.post("dirs/dashboard/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    // $("#outgoingTableDisplay tbody").html(`
    //   <tr>
    //     <td colspan="100%" class="text-center">${spinner}</td>
    //   </tr>
    // `);

    loadOutgoing(() => {
      $("#outgoingTableDisplay").DataTable({
        pageLength: 50,
        order: [0, "asc"],
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
  
function loadOutgoing() {
  $.ajax({
    url: "dirs/dashboard/dashboard/actions/get_system_units.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];

      let data = JSON.stringify(response)

      // console.log(`DATA: ${data}`)

      // if (response.isSuccess === "success" && Array.isArray(response.Data)) {
      //   let sortedData = response.Data.sort(
      //     (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
      //   );

      //   sortedData.forEach((item, index) => {

      //     let status = item.RequestStatus
      //       ? item.RequestStatus.toUpperCase()
      //       : "";
      //     let statusClass = "";

      //     if (status === "NEW") {
      //       statusClass = "bg-primary";
      //     } else if (
      //       status === "CANCEL" ||
      //       status === "CANCELLED" ||
      //       status === "PARTIAL"
      //     ) {
      //       statusClass = "bg-warning";
      //     } else if (status === "RECEIVED") {
      //       statusClass = "bg-success";
      //     } else if (status === "PARTIAL") {
      //       statusClass = "bg-warning";
      //     } else if (status === "IN TRANSIT") {
      //       statusClass = "bg-primary";
      //     } else if (status === "TERMINATED") {
      //       statusClass = "bg-secondary";
      //     } else if (status === "REJECTED") {
      //       statusClass = "bg-danger";
      //     } else if (status === "PROCESSING") {
      //       statusClass = "bg-info";
      //     }

      //     let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

      //     rows.push([
      //       item.DocEntry,
      //       index + 1,
      //       item.SR_Number || "",
      //       item.BranchOrigin || "",
      //       item.BranchDestination || "",
      //       statusBadge,
      //       item.EncodeDate
      //         ? new Date(item.EncodeDate).toLocaleDateString("en-US", {
      //             month: "2-digit",
      //             day: "2-digit",
      //             year: "numeric",
      //           })
      //         : "",

      //       '<div class="dropdown">' +
      //         '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
      //         '<i class="bi bi-three-dots"></i></button>' +
      //         '<ul class="dropdown-menu">' +
      //         '<li><a class="dropdown-item open-item" href="#">Open</a></li>' +
      //         (item.RequestStatus?.toUpperCase() === "NEW"
      //           ? '<li><a class="dropdown-item" data-srn="' +
      //             item.SR_Number +
      //             '" data-entry="' +
      //             item.DocEntry +
      //             '" href="#">Cancel</a></li>'
      //           : "") +
      //         (item.RequestStatus?.toUpperCase() === "PARTIAL"
      //           ? '<li><a class="dropdown-item terminate-item" data-srn="' +
      //             item.SR_Number +
      //             '" data-entry="' +
      //             item.DocEntry +
      //             '" href="#">Terminate</a></li>'
      //           : "") +
      //         '<li><a class="dropdown-item print-pdf" href="#" target="_blank" data-srn="' +
      //         item.SR_Number +
      //         '">Print</a></li>' +
      //         '<li><a class="dropdown-item" href="#collaborators" role="button" data-bs-toggle="offcanvas" aria-controls="offcanvasScrolling">Collaborators</a></li>' +
      //         "</ul></div>",
      //     ]);
      //   });
      // }

      // if (rows.length === 0) {
      //   for (let i = 0; i < 8; i++) {
      //     rows.push(["", "", "", "", "", "", "", ""]);
      //   }
      // }

      // if ($.fn.DataTable.isDataTable("#outgoingTableDisplay")) {
      //   $("#outgoingTableDisplay").DataTable().clear().destroy();
      //   $("#outgoingTableDisplay tbody").empty();
      // }

      // $("#outgoingTableDisplay").DataTable({
      //   data: rows,
      //   columns: [
      //     { title: "DocEntry", visible: false },
      //     { title: "#", className: "text-center" },
      //     { title: "SRN" },
      //     { title: "Stock Origin" },
      //     { title: "Requested by" },
      //     { title: "Status" },
      //     { title: "Date", className: "text-start" },
      //     { title: "Actions", orderable: false },
      //   ],
      //   pageLength: 8,
      //   paging: true,
      //   searching: true,
      //   info: true,
      //   processing: false,
      //   autoWidth: false,
      //   language: {
      //     emptyTable: "",
      //   },
      //   rowCallback: function (row, data, index) {
      //     $("td", row).css({
      //       background: "#fcf7d4",
      //       padding: "3px",
      //       height: "40px",
      //       "min-height": "40px",
      //       cursor: "pointer",
      //     });
      //     let docEntry = data[0];
      //     $(row).attr("data-docentry", docEntry);
      //     $("td:eq(0)", row).css("text-align", "center");
      //     $("td:eq(1)", row).addClass("text-primary");
      //     $("td:eq(5)", row).css("text-align", "start");

      //     $(row).hover(
      //       function () {
      //         $(this).css("background", "#FFF4C2");
      //       },
      //       function () {
      //         $(this).css("background", "#fcf7d4");
      //       },
      //     );
      //   },
      //   drawCallback: function () {
      //     let tableBody = $("#outgoingTableDisplay tbody");
      //     let currentRows = tableBody.find("tr").length;

      //     for (let i = currentRows; i < 8; i++) {
      //       let $emptyRow = $(`
      //         <tr class="empty-row">
      //           <td colspan="8" style="background: #fcf7d4">&nbsp;</td>
      //         </tr>
      //       `);
      //       $emptyRow.css({
      //         background: "#fcf7d4",
      //         height: "40px",
      //         "min-height": "40px",
      //         cursor: "pointer",
      //       });
      //       $emptyRow.hover(
      //         function () {
      //           $(this).css("background", "#FFF4C2");
      //         },
      //         function () {
      //           $(this).css("background", "#fcf7d4");
      //         },
      //       );
      //       tableBody.append($emptyRow);
      //     }
      //   },
      // });
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
}

function returnOutgoing() {
  $.post("dirs/dashboard/dashboard/dashboard.php", {}, function (data) {
    $("#main-content").html(data);
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