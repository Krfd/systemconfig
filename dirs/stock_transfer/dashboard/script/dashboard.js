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
  $.post(
    "dirs/stock_transfer/dashboard/components/main.php",
    {},
    function (data) {
      $("#stock_transfer_content").html(data);
    },
  );
}

function newStockTransfer() {
  $.post("dirs/stock_transfer/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openTransfer1() {
  $.post(
    "dirs/stock_transfer/transferred/transferred1.php",
    {},
    function (data) {
      $("#main-content").html(data);
    },
  );
}

function openTransfer2() {
  $.post(
    "dirs/stock_transfer/transferred/transferred2.php",
    {},
    function (data) {
      $("#main-content").html(data);
    },
  );
}

function openTransfer3() {
  $.post(
    "dirs/stock_transfer/transferred/transferred3.php",
    {},
    function (data) {
      $("#main-content").html(data);
    },
  );
}
