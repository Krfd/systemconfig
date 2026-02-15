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
  $.post("dirs/outgoing/dashboard/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);
    loadOutgoing();
  });
}

function test() {
  $.post("dirs/outgoing/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openOutgoing1() {
  $.post("dirs/outgoing/requests/request1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openOutgoing2() {
  $.post("dirs/outgoing/requests/request2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openOutgoing3() {
  $.post("dirs/outgoing/requests/request3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadOutgoing() {

  // let searchInput = document.getElementById("searchInput")
  // let search = searchInput.value;
  // let currentPage = 1;
  // let pageSize = 50;

  $.ajax({
    url: "dirs/outgoing/dashboard/actions/get_outgoing.php",
    type: "POST",
    data: {
      Search: "", 
      CurrentPage: 1,
      PageSize: 10
    },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rows = '';

        response.Data.forEach(function (item) {
          rows += `
            <tr style="height: 50px; min-height: 50px">
              <td style="background: #FFFBDF">${item.RowNum}</td>
              <td style="background: #FFFBDF">${item.BaseNum_SRN}</td>
              <td style="background: #FFFBDF">${item.Orgin_Dstnation}</td>
              <td style="background: #FFFBDF">${item.PrepBy}</td>
              <td style="background: #FFFBDF">${item.RequestStatus}</td>
              <td style="background: #FFFBDF">${item.DocDate}</td>
              <td style="background: #FFFBDF" class="dropdown">
                <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Open</a></li>
                  <li><a class="dropdown-item" href="#">Print</a></li>
                  <li><a class="dropdown-item" href="#">Cancel</a></li>
                  <li><a class="dropdown-item" href="#">Terminate</a></li>
                </ul>
              </td>
            </tr>
          `
          console.log(`Request Status: ${item.RequestStatus}`)
        })
        $("#outgoingTableDisplay tbody").html(rows);
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading outgoing data: ", error)
    }
  })
}
