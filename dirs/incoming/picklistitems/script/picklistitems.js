$(document).ready(function () {
  loadDashboard();
  if (typeof CURRENT_ROWNUM !== "undefined" && CURRENT_ROWNUM !== "") {
    loadIncomingSrnPicklist(CURRENT_ROWNUM);
  }
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

function loadBasketContent() {
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function loadDashboard() {
  $.post(
    "dirs/incoming/picklistitems/components/main.php",
    {},
    function (data) {
      $("#item_content").html(data);
    },
  );
}

function loadIncomingSrnPicklist(RowNum) {
  $.ajax({
    url: "dirs/incoming/form/actions/get_openincoming.php",
    type: "POST",
    data: { RowNum: RowNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
      }
    },
  });
}
