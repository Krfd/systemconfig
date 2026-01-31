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
  $.post("dirs/monitoring/dashboard/components/main.php", {}, function (data) {
    $("#monitoring_content").html(data);
  });
}

function newMonitoring() {
  $.post("dirs/monitoring/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
