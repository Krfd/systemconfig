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
  $.post("dirs/stock_transfer/form/components/main.php", {}, function (data) {
    $("#stock_transfer_form_content").html(data);
  });
}

function returnStockTransferDashboard() {
  $.post("dirs/stock_transfer/dashboard/dashboard.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
