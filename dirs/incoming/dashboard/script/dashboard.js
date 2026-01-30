$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });

  $(".checkbox").hide();
});

function loadDashboard() {
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);
  });
}

function toggleCheckboxes() {
  const createPicklistBtn = document.getElementById("createPicklistBtn");
  const areCheckboxesVisible = $(".checkbox").is(":visible");

  $(".checkbox").toggle();

  if (areCheckboxesVisible) {
    $(".checkbox").prop("checked", false);
    createPicklistBtn.textContent = "Create Picklist";
  } else {
    createPicklistBtn.textContent = "Add to Picklist";
  }
}

function picklistBasket() {
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming() {
  $.post("dirs/incoming/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
