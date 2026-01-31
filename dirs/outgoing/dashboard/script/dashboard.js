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
    $("#dashboard_content").html(data);
  });
}

function test() {
  $.post("dirs/outgoing/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openOutgoing1() {
  $.post("dirs/outgoing/requests/request1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openOutgoing2() {
  $.post("dirs/outgoing/requests/request2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openOutgoing3() {
  $.post("dirs/outgoing/requests/request3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
