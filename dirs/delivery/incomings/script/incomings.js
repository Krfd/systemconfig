$(document).ready(function () {
  loadDashboard();
});

function loadDashboard() {
  $.post("dirs/delivery/incomings/components/main.php", {}, function (data) {
    $("#to_deliver_content").html(data);
  });
}

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
