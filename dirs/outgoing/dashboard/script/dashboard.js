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
  $.post("dirs/outgoing/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);

    $("#outgoingTableDisplay tbody").html(`
      <tr>
        <td colspan="100%" class="text-center">${spinner}</td>
      </tr>
    `);

    loadOutgoing(() => {
      $("#outgoingTableDisplay").DataTable({
        pageLength: 50,
        order: [0, "desc"],
      });
    });
  });
}

function newRequest() {
  $("#main-content").html(spinner);
  $.post("dirs/outgoing/form/form.php", {}, function (data) {
    $("#main-content").html(data);
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

$(document).on("click", ".print-pdf", function (e) {
  e.preventDefault();

  let srn = $(this).data("srn");

  // Swal.fire({
  //   title: "Print Options",
  //   text: "Print categorized by item category?",
  //   icon: "question",
  //   showCancelButton: true,
  //   confirmButtonText: "Yes, categorize it",
  //   cancelButtonText: "No, print normally",
  //   allowOutsideClick: false,
  // }).then((result) => {
  let url = "pdf.php?srn=" + srn;

  // if (result.isConfirmed) {
  //   url += "&grouped=1";
  // }

  window.open(url, "_blank");
  // });
});

function loadOutgoing() {
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];

      if (response.isSuccess === "success" && Array.isArray(response.Data)) {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.RowNum || 0) - Number(a.RowNum || 0),
        );

        sortedData.forEach((item) => {
          let status = item.RequestStatus
            ? item.RequestStatus.toUpperCase()
            : "";
          let statusClass = "";

          if (status === "NEW") {
            statusClass = "bg-primary";
          } else if (status === "CANCEL" || status === "CANCELLED" || status === "PARTIAL") {
            statusClass = "bg-warning";
          } else if (status === "RECEIVED") {
            statusClass = "bg-success";
          } else if (status === "PARTIAL") {
            statusClass = "bg-warning";
          } else if (status === "IN TRANSIT") {
            statusClass = "bg-primary";
          } else if (status === "TERMINATED") {
            statusClass = "bg-secondary";
          } else if (status === "REJECTED") {
            statusClass = "bg-danger";
          } else if (status === "PROCESSING") {
            statusClass = "bg-info";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          rows.push([
            item.DocEntry,
            item.RowNum !== undefined ? item.RowNum.toString() : "",
            item.SR_Number || "",
            item.BranchOrigin || "",
            item.BranchDestination || "",
            statusBadge,
            // item.EncodeDate || "N/A",
            item.EncodeDate
              ? new Date(item.EncodeDate)
                  .toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })
                  .replace(/\//g, "-")
              : "",

            '<div class="dropdown">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              '<ul class="dropdown-menu">' +
              '<li><a class="dropdown-item open-item" href="#">Open</a></li>' +
              (item.RequestStatus?.toUpperCase() === "NEW"
                ? '<li><a class="dropdown-item cancel-outgoing" data-srn="' +
                  item.SR_Number +
                  '" href="#">Cancel</a></li>'
                : "") +
              (item.RequestStatus?.toUpperCase() === "PARTIAL"
                ? '<li><a class="dropdown-item terminate-item" data-srn="' +
                  item.SR_Number +
                  '" href="#">Terminate</a></li>'
                : "") +
              '<li><a class="dropdown-item print-pdf" href="#" target="_blank" data-srn="' +
              item.SR_Number +
              '">Print</a></li>' +
              "</ul></div>",
          ]);
        });
      }

      if (rows.length === 0) {
        for (let i = 0; i < 8; i++) {
          rows.push(["", "", "", "", "", "", "", ""]);
        }
      }

      if ($.fn.DataTable.isDataTable("#outgoingTableDisplay")) {
        $("#outgoingTableDisplay").DataTable().clear().destroy();
        $("#outgoingTableDisplay tbody").empty();
      }

      $("#outgoingTableDisplay").DataTable({
        data: rows,
        columns: [
          { title: "DocEntry", visible: false },
          { title: "#", className: "text-center" },
          { title: "SRN" },
          { title: "Stock Origin" },
          { title: "Requested by" },
          { title: "Status" },
          { title: "Date", className: "text-start" },
          { title: "Actions", orderable: false },
        ],
        pageLength: 8,
        paging: true,
        searching: true,
        info: true,
        processing: false,
        autoWidth: false,
        order: [[0, "desc"]],
        language: {
          emptyTable: "", // 🔥 removes "No data available in table"
        },
        // language: {
        //   emptyTable: "No records found",
        // },
        rowCallback: function (row, data, index) {
          $("td", row).css({
            background: "#FFFBDF",
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
              $(this).css("background", "#FFFBDF");
            },
          );
        },
        drawCallback: function () {
          let tableBody = $("#outgoingTableDisplay tbody");
          let currentRows = tableBody.find("tr").length;

          for (let i = currentRows; i < 8; i++) {
            let $emptyRow = $(`
              <tr class="empty-row">
                <td colspan="8" style="background: #FFFBDF">&nbsp;</td>
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

$(document).on("dblclick", "#outgoingTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let docEntry = $(this).data("docentry");
  openOutgoingForm(docEntry);
  // loadOutgoingDetails(docEntry);
});

// TRIGGER TO OPEN A REQUEST
$(document).on("click", ".open-item", function (e) {
  e.preventDefault(); // prevent # jump
  e.stopPropagation(); // stop row click behavior

  let docEntry = $(this).closest("tr").data("docentry");
  openOutgoingForm(docEntry);
  // loadOutgoingDetails(docEntry);
});

// TRIGGER TO TERMINATE A REQUEST
$(document).on("click", ".terminate-item", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let SRN = $(this).data("srn");
  terminateOutgoingForm(SRN);
});

function returnOutgoing() {
  $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
    $("#main-content").html(data);
  });
  window.location.reload();
}

function openOutgoingForm(DocEntry) {
  $("#main-content").html(spinner);
  setTimeout(function () {
    openRequest(DocEntry);
  }, 200);
}

function openRequest(DocEntry) {
  $("#main-content").html(spinner);
  $.post("dirs/outgoing/dashboard/request.php", function (data) {
    $("#main-content").html(data);

    $.ajax({
      url: "dirs/outgoing/dashboard/actions/get_openrequest.php",
      type: "POST",
      data: { DocEntry: DocEntry },
      dataType: "json",
      success: function (response) {
        if (response.isSuccess === "success") {
          let rowCount = response.Items.length;
          let totalQty = 0;

          let header = response.Header;
          let items = response.Items;

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
              <td style="background:#FFFBDF">${index + 1}</td>
              <td style="background:#FFFBDF">${item.ItemBrand}</td>
              <td style="background:#FFFBDF">${item.ItemName}</td>
              <td style="background:#FFFBDF">${item.ItemCategory}</td>
              <td style="background:#FFFBDF">${item.Request_Qty}</td>
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
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
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

$(document).on("click", ".cancel-outgoing", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let SRN = $(this).data("srn");
  cancelOutgoingForm(SRN);
});

function cancelOutgoingForm(SRN) {
  if (!SRN) {
    Swal.fire({
      icon: "error",
      title: "Missing SRN",
      text: "Make sure that the SRN exists!",
      confirmButtonText: "OKAY",
    });
    return;
  }

  Swal.fire({
    icon: "question",
    title: "Cancel this request?",
    text: "This action cannot be change.",
    confirmButtonText: "Yes, Cancel",
    showCancelButton: true,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/outgoing/dashboard/actions/update_stockrequest_action.php",
        {
          SRN: SRN,
        },
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Request has been cancelled",
                confirmButtonText: "OKAY",
              }).then(() => {
                location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to cancel request",
                text:
                  res.message ||
                  "An error occurred while canceling the request.",
                confirmButtonText: "OKAY",
              });
            }
          } catch (e) {
            console.error("Error parsing response: ", e);
          }
        },
      );
    }
  });
}

function terminateOutgoingForm(SRN) {
  if (!SRN) {
    Swal.fire({
      icon: "error",
      title: "Missing SRN",
      text: "Make sure that the SRN exists!",
      confirmButtonText: "OKAY",
    });
    return;
  }

  Swal.fire({
    icon: "question",
    title: "Are you sure to terminate this request?",
    text: "This action cannot be change.",
    confirmButtonText: "Terminate",
    confirmButtonColor: "#d33",
    showCancelButton: true,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        "dirs/outgoing/dashboard/actions/update_stockrequest_action.php",
        {
          SRN: SRN,
        },
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Request has been terminated",
                confirmButtonText: "OKAY",
              }).then(() => {
                location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to terminate request",
                text:
                  res.message ||
                  "An error occurred while canceling the request.",
                confirmButtonText: "OKAY",
              });
            }
          } catch (e) {
            console.error("Error parsing response: ", e);
          }
        },
      );
    }
  });
}

// TRUNCATE TABLES
function clearTables() {
  Swal.fire({
    icon: "question",
    title: "Truncate tables?",
    showConfirmButton: true,
    confirmButtonText: "Yes, Clear",
    showCancelButton: true,
    cancelButtonText: "Back",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Tables has been reset");

      $.post(
        "dirs/outgoing/dashboard/actions/update_truncatetable.php",
        {},
        function (data) {
          let res;
          try {
            res = JSON.parse(data);
            if (res.isSuccess === "success") {
              Swal.fire({
                icon: "success",
                title: "Tables has been reset",
              }).then(() => {
                location.reload();
              });
            }
          } catch (e) {
            console.error("Error parsing response: ", e);
          }
        },
      );
    }
  });
}
