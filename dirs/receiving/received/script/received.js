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
  $.post("dirs/receiving/dashboard/components/main.php", {}, function (data) {
    $("#received_content").html(data);
  });
}

function returnToDashboard() {
  $.post("dirs/receiving/dashboard/receiving.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
