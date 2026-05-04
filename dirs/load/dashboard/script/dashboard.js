$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $.post("dirs/load/dashboard/components/main.php", {}, function (data) {
    $("#basket_content").html(data);
    $("#loadingBasketTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
  });
}
