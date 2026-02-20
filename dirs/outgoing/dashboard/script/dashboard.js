$(document).ready(function () {
  loadDashboard();
  // searchData();
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

let outgoingTable = $("#outgoingTableDisplay").DataTable({
  paging: true,
  searching: true,
  info: true,
  destroy: true,
});

function loadDashboard() {
  $.post("dirs/outgoing/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);
    loadOutgoing();
    $("#outgoingTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
  });
}

function newRequest() {
  $.post("dirs/outgoing/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadOutgoing() {
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rows = "";
        let rowCount = response.Data.length;

        outgoingTable.clear();

        response.Data.forEach(function (item) {
          rows += `
            <tr style="height: 40px; min-height: 40px; cursor: pointer">
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" data-rownum="${item.RowNum}">${item.RowNum}</td>
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" data-rownum="${item.RowNum}">${item.BaseNum_SRN}</td>
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" data-rownum="${item.RowNum}">${item.Orgin_Dstnation}</td>
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" data-rownum="${item.RowNum}">${item.PrepBy}</td>
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" data-rownum="${item.RowNum}">${item.RequestStatus}</td>
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" data-rownum="${item.RowNum}">${item.DocDate}</td>
              <td class="align-middle" style="background: #FFFBDF; padding: 3px" class="dropdown">
                <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item open-item" href="#">Open</a></li>
                  ${
                    item.RequestStatus?.toUpperCase() === "NEW"
                      ? `<li><a class="dropdown-item cancel-outgoing" data-srn="${item.BaseNum_SRN}" href="#">Cancel</a></li>`
                      : ``
                  }
                  ${
                    item.RequestStatus !== "NEW"
                      ? `<li><a class="dropdown-item" href="#">Terminate</a></li>`
                      : ``
                  }
                  <li><a class="dropdown-item" href="#">Print</a></li>
                </ul>
              </td>
            </tr>`;
        });
        $("#outgoingTableDisplay tbody").html(rows);

        outgoingTable.clear();

        response.Data.forEach(function (item) {
          outgoingTable.row.add([
            item.RowNum,
            item.BaseNum_SRN,
            item.Orgin_Dstnation,
            item.PrepBy,
            item.RequestStatus,
            item.DocDate,
            `<div class="dropdown">
              <button class="btn" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item open-item" href="#">Open</a></li>
                <li><a class="dropdown-item" href="#">Print</a></li>
                ${
                  item.RequestStatus?.toUpperCase() === "NEW"
                    ? `<li><a class="dropdown-item cancel-outgoing" data-srn="${item.BaseNum_SRN}" href="#">Cancel</a></li>`
                    : ``
                }
                ${
                  item.RequestStatus !== "NEW"
                    ? `<li><a class="dropdown-item" href="#">Terminate</a></li>`
                    : ``
                }
              </ul>
            </div>`,
          ]);
        });

        outgoingTable.draw();

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
              <tr class="item-row empty-row" style="height: 40px; min-height: 40px">
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
                <td style="background: #FFFBDF; padding: 0"></td>
              </tr>`;
            $("#outgoingTableDisplay tbody").append(emptyRow);
          }
        }
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error);
    },
  });
}

$(document).on("dblclick", "#outgoingTableDisplay tbody tr", function (e) {
  if ($(e.target).closest(".dropdown").length) return;
  let RowNum = $(this).find("td:first").text().trim();
  openOutgoingForm(RowNum);
});

$(document).on("click", ".open-item", function (e) {
  e.preventDefault(); // prevent # jump
  e.stopPropagation(); // stop row click behavior

  let RowNum = $(this).closest("tr").find("td:first").text().trim();

  openOutgoingForm(RowNum);
});

function openOutgoingForm(rowNum) {
  $.post(
    "dirs/outgoing/requests/components/main.php",
    { RowNum: rowNum }, // send RowNum to view
    function (html) {
      $("#main-content").html(html);
    },
  );
}

$(document).on("click", ".cancel-outgoing", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let RowNumber = $(this).data("srn");
  let rowElement = $(this).closest("tr");

  cancelOutgoingForm(RowNumber, rowElement);
});

function cancelOutgoingForm(RowNumber, rowElement) {
  if (!RowNumber) {
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
      // CANCEL THE SRN VIA API
    }
  });
}
