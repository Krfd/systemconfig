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
    $("#receiving_content").html(data);
  });
}

function openRec1() {
  $.post("dirs/receiving/received/received1.php", {}, function (data) {
    $("#received_content").html(data);
  });
}
function openRec2() {
  $.post("dirs/receiving/received/received2.php", {}, function (data) {
    $("#received_content").html(data);
  });
}
function openRec3() {
  $.post("dirs/receiving/received/received3.php", {}, function (data) {
    $("#received_content").html(data);
  });
}
