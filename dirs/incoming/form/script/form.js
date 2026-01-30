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
  $.post("dirs/incoming/form/components/main.php", {}, function (data) {
    $("#form-content").html(data);
  });
}

function loadReturn() {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

window.addEventListener("DOMContentLoaded", function () {
  // Get today's date
  const today = new Date();

  // Format the date as yyyy-mm-dd (which is what the date input expects)
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = today.getDate().toString().padStart(2, "0"); // Add leading zero if needed

  // Combine into the format yyyy-mm-dd
  const formattedDate = `${year}-${month}-${day}`;

  // Set the input value to today's date
  document.getElementById("date").value = formattedDate;
});
