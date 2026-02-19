$(document).ready(function () {
  loadDashboard()
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadBasket() {
  // console.log("Should be in picklist basket")
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadDashboard() {
  $.post("dirs/incoming/picklistitems/components/main.php", {}, function(data) {
    $("#item_content").html(data)
  })
}