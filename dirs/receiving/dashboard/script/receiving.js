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
  $.post("dirs/receiving/dashboard/components/main.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function receivingForm() {
  $("#main-content").html(spinner);
  (setTimeout(function () {
    $.post("dirs/receiving/dashboard/receivingForm.php", {}, function (data) {
      $("#main-content").html(data);
    });
  }),
    200);
}

function openRec1() {
  $.post("dirs/receiving/received/received1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openRec2() {
  $.post("dirs/receiving/received/received2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openRec3() {
  $.post("dirs/receiving/received/received3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadReceivingDashboard() {}
