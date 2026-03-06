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
  $.post("dirs/delivery/dashboard/components/main.php", {}, function (data) {
    $("#delivery_content").html(data);
  });
}

function loadDeliveryBasket() {
  $.post("dirs/delivery/loadingbasket/loadingbasket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openDR1() {
  $.post("dirs/delivery/deliveries/delivery1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// FROM LOADING BASKET
function loadReturn() {
  $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function picklistItem1() {
  $.post("dirs/delivery/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// DELIVERY FORM
function loadDeliveryForm() {
  $.post("dirs/delivery/dashboard/deliveryForm.php", {}, function (data) {
    $("#delivery_content").html(data);
  });
}
