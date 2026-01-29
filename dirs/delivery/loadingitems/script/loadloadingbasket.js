$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadloadingbasket() {
  $.post("dirs/delivery/loadingbasket/loadingbasket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
