$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadReturn() {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function picklistItem1() {
  $.post("dirs/incoming/picklistitems/picklistitem1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function picklistItem2() {
  $.post("dirs/incoming/picklistitems/picklistitem2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function picklistItem3() {
  $.post("dirs/incoming/picklistitems/picklistitem3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
