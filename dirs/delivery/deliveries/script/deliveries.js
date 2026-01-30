$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function delivery() {
  $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
