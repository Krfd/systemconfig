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
    $("#loadingbasket_content").html(data);
  });
}

function loadReturn() {
  $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function picklistItem1() {
  $.post("dirs/delivery/loadingitems/loadingitem1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function picklistItem2() {
  $.post("dirs/delivery/loadingitems/loadingitem2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function picklistItem3() {
  $.post("dirs/delivery/loadingitems/loadingitem3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
