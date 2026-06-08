$(document).ready(function(){
   
    window.setInterval(function () {
        $('#clock').html(moment().format('MMM D, YYYY h:mm:ss A'));
        $('#clockvalue').val(moment().format('h:mm:ss A'));
    }, 1000);

     $("#main-menu")
    .find("li.nav-item")
    .find("a.nav-link[name='menu'].active")
    .click();

  })

$("#main-menu")
.find("li.nav-item")
.find("a.nav-link[name='menu']")
.on("click", function() {

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
    case "dashboard":
      // $maintitle = "Dashboard";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Dashboard</li>`;
      $file = "dirs/dashboard/dashboard.php";
      break;
    case "requests":
      // $maintitle = "Requests";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Requests</li>`;
      $file = "dirs/requests/dashboard/requests.php";
      break;
    case "users":
      // $maintitle = "Users";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Users</li>`;
      $file = "dirs/users/dashboard/users.php";
      break;
    case "findings":
      // $maintitle = "Findings";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Findings</li>`;
      $file = "dirs/findings/dashboard/findings.php";
      break;
    case "settings":
      // $maintitle = "Settings";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Settings</li>`;
      $file = "dirs/settings/dashboard/settings.php";
      break;
    case "profile":
      // $maintitle = "Profile";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Profile</li>`;
      $file = "dirs/profile/dashboard/profile.php";
      break;
    case "report":
      // $maintitle = "Logs";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Report</li>`;
      $file = "dirs/report/dashboard/report.php";
      break;
    case "logs":
      // $maintitle = "Logs";
      $maintitle = "";
      $mainbreadcrumb = `<li class="breadcrumb-item active">Logs</li>`;
      $file = "dirs/logs/dashboard/logs.php";
      break;
    default:
    return;
  }

  var spinner = `
    <div class="d-flex flex-column justify-content-center align-items-center" style="height: 60vh;">
      <img src="../assets/image/logo/logo.png" alt="Loading..." 
           style="width: 80px; height: 80px; object-fit: contain; opacity: 0.8;">
      <p class="mt-3 mb-2 text-secondary fw-semibold">Please wait. Loading...</p>
      <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;

  $("#main-content").html(spinner);
  $("#main-breadcrumb").html(spinner);

  $.post($file, function(data) {
    setTimeout(function() {
      $("#main-title").hide().html($maintitle).fadeIn(200);
      $("#main-breadcrumb").hide().html($mainbreadcrumb).fadeIn(200);
      $("#main-content").hide().html(data).fadeIn(200);
      $a.addClass("active");
    }, 200);
  });
});


/*Function logout Account*/
function logout() {
  $.post("../actions/logout.php", {}, function(data) {
      if ($.trim(data) == "OK") {
          window.location.assign("index.php");
      }
  });
}

// DASHBOARD COUNTER SECTION
document.addEventListener("DOMContentLoaded", () => {
  // Function to animate the counter for each element
  function animateCounter(counterElement) {
    let count = 0;
    const target = parseInt(counterElement.textContent) || count; // Set target to current textContent or default to 100

    // Increase the count over time
    const interval = setInterval(() => {
      if (count < target) {
        count++;
        counterElement.textContent = count; // Update the counter's text
      } else {
        clearInterval(interval);
      }
    }, 50); // You can adjust the speed by changing this value
  }

  // Set up the Intersection Observer
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counterElement = entry.target; // Get the element that is in view
          animateCounter(counterElement); // Trigger animation for that specific element
          observer.unobserve(counterElement); // Stop observing once the counter is triggered
        }
      });
    },
    {
      threshold: 0.5, // The counter will trigger when 50% of the section is in view
    }
  );

  // Get all elements with class "counter" (or any other common class you assign)
  const counterElements = document.querySelectorAll(".counter");

  // Start observing each counter element
  counterElements.forEach((counterElement) => {
    observer.observe(counterElement); // Start observing each element
  });
});
