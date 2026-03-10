$(document).ready(function () {
  loadloadingbasket();
});

function loadloadingbasket() {
  $.post("dirs/delivery/loadingbasket/loadingbasket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming1() {
  $.post("dirs/delivery/incomings/incoming1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming2() {
  $.post("dirs/delivery/incomings/incoming2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming4() {
  $.post("dirs/delivery/incomings/incoming4.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming5() {
  $.post("dirs/delivery/incomings/incoming5.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming6() {
  $.post("dirs/delivery/incomings/incoming6.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
