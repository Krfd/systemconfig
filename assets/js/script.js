$(document).ready(function () {
  window.setInterval(function () {
    $("#clock").html(moment().format("MMM D, YYYY h:mm:ss A"));
    $("#clockvalue").val(moment().format("h:mm:ss A"));
  }, 1000);

  $("#main-menu")
    .find("li.nav-item")
    .find("a.nav-link[name='menu'].active")
    .click();
});

$("#main-menu")
  .find("li.nav-item")
  .find("a.nav-link[name='menu']")
  .on("click", function () {
    $("#main-menu")
      .find("li.nav-item")
      .find("a.nav-link[name='menu']")
      .removeClass("active");

    var $a = $(this);
    var menucode = $a.attr("menucode");

    let $file = "";
    let $maintitle = "";
    let $mainbreadcrumb = "";

    switch (menucode) {
      case "outgoing":
        $maintitle = "";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Outgoing</li>`;
        $file = "dirs/outgoing/dashboard/outgoing.php";
        break;
      case "incoming":
        $maintitle = "";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Incoming</li>`;
        $file = "dirs/incoming/dashboard/incoming.php";
        break;
      case "basket":
        $maintitle = "";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Branch Assignment</li>`;
        $file = "dirs/basket/dashboard/basket.php";
        break;
      case "delivery":
        $maintitle = "";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Delivery</li>`;
        $file = "dirs/delivery/dashboard/delivery.php";
        break;
      case "receiving":
        $maintitle = "";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Receiving</li>`;
        $file = "dirs/receiving/dashboard/received.php";
        break;
      case "monitoring":
        $maintitle = "";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Monitoring</li>`;
        $file = "dirs/monitoring/dashboard/monitoring.php";
        break;
      case "stocktransfer":
        // $maintitle = "Stock Transfer";
        $mainbreadcrumb = `<li class="breadcrumb-item active">Stock Transfer</li>`;
        $file = "dirs/stock_transfer/dashboard/dashboard.php";
        break;
      // case "settings":
      //   $maintitle = "Account Settings";
      //   $mainbreadcrumb = `<li class="breadcrumb-item active">Settings</li>`;
      //   $file = "dirs/settings/settings.php";
      //   break;
      default:
        return;
    }

    var spinner = `
    <div class="d-flex flex-column justify-content-center align-items-center" style="height: 60vh;">
      <img src="assets/image/logo/iap_icon.png" alt="Loading..."
           style="width: 80px; height: 80px; object-fit: contain; opacity: 0.8;">
      <p class="mt-3 mb-2 text-secondary fw-semibold">Loading...</p>
      <div class="spinner-border text-danger" role="status" style="width: 2rem; height: 2rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;

    $("#main-content").html(spinner);
    $("#main-breadcrumb").html(spinner);

    $.post($file, function (data) {
      setTimeout(function () {
        $("#main-title").hide().html($maintitle).fadeIn(200);
        $("#main-breadcrumb").hide().html($mainbreadcrumb).fadeIn(200);
        $("#main-content").hide().html(data).fadeIn(200);
        $a.addClass("active");
      }, 200);
    });
  });

document.getElementById("current-year").textContent = ` © ${moment().format(
  "YYYY",
)}`;
// function loadsettings() {
//   $.post("dirs/settings/settings.php", {}, function (data) {
//     $("#main-content").html(data);
//   });
// }

var tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]',
);
var tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);

function logout() {
  $.post("actions/save_logs_logout.php", {}, function (res) {
    if ($.trim(res) == "OK") {
      console.log(`LOGOUT HAS BEEN LOGGED`);
    }
  });
  $.post("actions/logout.php", {}, function (data) {
    if ($.trim(data) == "OK") {
      window.location.assign("index.php");
    }
  });
}

/*Security*/

/*disable the inspect*/
/*  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
    }

    // Ctrl + U
    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
    }

    // Ctrl + Shift + C or J (dev tools)
    if (e.ctrlKey && e.shiftKey && ['c', 'j'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  });

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  })*/

/*Theme preference user*/
var username = $("#session-user").val();
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

$(document).ready(function () {
  const userTheme = $("#theme-pref").val();
  const userKey = "theme_" + username; // 👈 unique per user
  const savedTheme = getCookie(userKey) || userTheme || "Light";

  if (savedTheme === "Dark") {
    $("body").addClass("dark-mode");
    $("#theme-mode").prop("checked", true);
  } else {
    $("body").removeClass("dark-mode");
    $("#theme-mode").prop("checked", false);
  }

  $("#theme-mode").on("change", function () {
    const newTheme = $(this).is(":checked") ? "Dark" : "Light";
    $("body").toggleClass("dark-mode", newTheme === "Dark");
    setCookie(userKey, newTheme, 7);
  });
});

/*Function load theme preference*/
function loadTheme() {
  var Theme = $("#theme-mode").is(":checked") ? "Dark" : "Light";
  $.post(
    "actions/update_theme.php",
    {
      Theme: Theme,
    },
    function (data) {
      if (jQuery.trim(data) === "success") {
        console.log("Theme changed");
      } else {
        console.log(data);
      }
    },
  );
}

function checkAccess() {
  $.post("actions/get_accntaccess.php", {}, function (data) {
    let response = JSON.parse(data);

    if ($.trim(response.isSuccess) === "success") {
      // Convert Access to a number (0, 1, 2)
      let access = Number(response.Data.Access);

      if (access === 1) {
        // Blocked account
        $("#mdl-prompt-block").modal("show");
      }
    } else {
      alert($.trim(response.Data));
    }
  });
}

/*Function to trigger account setup for new Password*/
function setupAccount() {
  $.post("actions/get_accntaccess.php", {}, function (data) {
    let response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      let setup = response.Data.AccntSetup;
      if (setup === "N") {
        $("#modal-reset-pasword").modal("show");
      }
    } else {
      alert($.trim(response.Data));
    }
  });
}
