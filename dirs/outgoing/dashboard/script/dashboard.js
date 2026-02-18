$(document).ready(function () {
  loadDashboard();
  searchData();
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
  $.post("dirs/outgoing/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);
    loadOutgoing();
    $("#outgoingTableDisplay").DataTable({
      "pageLength" : 50,
      order : [
        0, "desc"
      ]
    })
  });
}

function test() {
  $.post("dirs/outgoing/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function searchData() {
  let typingTimer;
  let delay = 300;

  $("#searchInput").on("input", function() {

    clearTimeout(typingTimer);
    let searchValue = $(this).val();

    typingTimer = setTimeout(() => {
      loadOutgoing(searchValue)
    }, delay);
  })
}

function loadOutgoing(search = "") {
  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    data: {
      Search: search, 
      CurrentPage: 1,
      PageSize: 10
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rows = '';
        let rowCount = response.Data.length;
        // console.log(`ROW COUNTER: ${rowCount}`)

        response.Data.forEach(function (item) {
          rows += `
            <tr style="height: 50px; min-height: 50px; cursor: pointer">
              <td style="background: #FFFBDF" data-rownum="${item.RowNum}">${item.RowNum}</td>
              <td style="background: #FFFBDF" data-rownum="${item.RowNum}">${item.BaseNum_SRN}</td>
              <td style="background: #FFFBDF" data-rownum="${item.RowNum}">${item.Orgin_Dstnation}</td>
              <td style="background: #FFFBDF" data-rownum="${item.RowNum}">${item.PrepBy}</td>
              <td style="background: #FFFBDF" data-rownum="${item.RowNum}">${item.RequestStatus}</td>
              <td style="background: #FFFBDF" data-rownum="${item.RowNum}">${item.DocDate}</td>
              <td style="background: #FFFBDF" class="dropdown">
                <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item open-item" href="#">Open</a></li>
                  <li><a class="dropdown-item" href="#">Print</a></li>
                  ${item.RequestStatus?.toUpperCase() === "NEW" 
                  ? `<li><a class="dropdown-item cancel-outgoing" data-srn="${item.BaseNum_SRN}" href="#">Cancel</a></li>` 
                  : ``}
                  ${item.RequestStatus !== "NEW" 
                  ? `<li><a class="dropdown-item" href="#">Terminate</a></li>` 
                  : ``}
                </ul>
              </td>
            </tr>`
        })
        $("#outgoingTableDisplay tbody").html(rows);

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
              <tr class="item-row empty-row" style="height: 50px; min-height: 50px">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
              </tr>`
            $("#outgoingTableDisplay tbody").append(emptyRow);
          }
        }
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error)
    }
  })
}

$(document).on("dblclick", "#outgoingTableDisplay tbody tr", function (e) {
  // Prevent dropdown button from triggering
  if ($(e.target).closest(".dropdown").length) return;
  // let RowNum = $(this).data("rownum");
  let RowNum = $(this).find("td:first").text().trim();
  openOutgoingForm(RowNum);
});

$(document).on("click", ".open-item", function (e) {
  e.preventDefault();        // prevent # jump
  e.stopPropagation();       // stop row click behavior

  let RowNum = $(this)
    .closest("tr")
    .find("td:first")
    .text()
    .trim();

  openOutgoingForm(RowNum);
});

function openOutgoingForm(rowNum) {
  $.post(
    "dirs/outgoing/requests/components/main.php",
    { RowNum: rowNum },  // send RowNum to view
    function (html) {
      $("#main-content").html(html);
    }
  );
}

// FOR PICKLIST TABLE MODAL
function picklistTableModal() {
  
}

// $(document).on("click", ".cancel-outgoing", function(e) {

//   e.preventDefault();       
//   e.stopPropagation();

//   let RowNumber = $(this).find("td:first").text().trim();
//   cancelOutgoingForm(RowNumber)
// })

$(document).on("click", ".cancel-outgoing", function(e) {

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
      confirmButtonText: "OKAY"
    })
    return;
  }

  Swal.fire({
      icon: "question",
      title: "Cancel this request?",
      text: "This action cannot be change.",
      confirmButtonText: "Yes, Cancel",
      showCancelButton: true,
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        // CANCEL THE SRN VIA API
      }
    })
}

