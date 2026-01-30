$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loaditem1() {
  $.post("dirs/delivery/loadingitems/loadingitem1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loaditem2() {
  $.post("dirs/delivery/loadingitems/loadingitem2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loaditem4() {
  $.post("dirs/delivery/loadingitems/loadingitem3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function loaditem5() {
  $.post("dirs/delivery/loadingitems/loadingitem3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function loaditem6() {
  $.post("dirs/delivery/loadingitems/loadingitem3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
