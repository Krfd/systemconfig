// $(document).ready(function () {
//   loadDashboard();
// });

$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

// function loadDashboard() {
//   $.post("dirs/delivery/dashboard/components/main.php", {}, function (data) {
//     $("#delivery_content").html(data);
//   });
// }

function loadingBasket() {
  $.post("dirs/delivery/loadingbasket/loadingbasket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openDR1() {
  $.post("dirs/delivery/deliveries/delivery1.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function openDR2() {
  $.post("dirs/delivery/deliveries/delivery2.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function openDR3() {
  $.post("dirs/delivery/deliveries/delivery3.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
function openDR4() {
  $.post("dirs/delivery/deliveries/delivery4.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
