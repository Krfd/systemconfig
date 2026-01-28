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
  $.post("dirs/outgoing/form/components/main.php", {}, function (data) {
    $("#form-content").html(data);
  });
}

function loadReturn() {
  $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

$(".clearTable").click(function (e) {
  e.preventDefault();

  Swal.fire({
    title: "Clear this table?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    confirmButtonColor: "#45eb45",
    cancelButtonText: "Back",
    cancelButtonColor: "#dc3545",
  }).then((result) => {
    if (result.isConfirmed) {
      $("#outgoingTable tbody").empty();

      Swal.fire({
        icon: "success",
        title: "Cleared!",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  });
});
