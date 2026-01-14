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
  $.post("dirs/outgoing/components/main.php", {}, function (data) {
    $("#dashboard_content").html(data);
  });
}

function test() {
  $.post("dirs/outgoing/request.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
