<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>iShift</title>
  <link rel="stylesheet" href="assets/plugins/fontawesome-free/css/all.min.css">
  <link rel="stylesheet" type="text/css" href="assets/plugins/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <link rel="stylesheet" href="assets/plugins/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="assets/plugins/bootstrap-icons/font/bootstrap-icons.css">
  <link rel="stylesheet" href="assets/plugins/toastr/toastr.min.css">
  <link rel="stylesheet" href="assets/plugins/sweetalert2/sweetalert2.min.css">
  <link rel="stylesheet" href="assets/plugins/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="assets/plugins/summernote/summernote-lite.min.css">
  <link rel="stylesheet" type="text/css" href="assets/css/login.css">
  <link rel="stylesheet" href="assets/plugins/datepicker/jquery-ui.structure.min.css">
  <link rel="icon" href="assets/image/logo/iap_icon.png">
  <!-- <style>
    .lock-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .lock-box {
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      width: 300px;
    }

    .lock-box input {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
    }

    .lock-box button {
      margin-top: 10px;
      width: 100%;
      padding: 10px;
    }

    .error {
      color: red;
      margin-top: 10px;
    }
  </style> -->
</head>

<body>
  <!-- RE-AUTHENTICATE USER -->
  <!-- <div id="lockOverlay" class="lock-overlay">
    <div class="lock-box">
      <h2>Session Locked</h2>
      <p>Please login again to continue</p>
      <input type="text" id="usernameInput" class="form-control form-control-sm" placeholder="Username" />
      <input type="password" id="passwordInput" class="form-control form-control-sm" placeholder="Password" />
      <button type="button" onclick="unlockScreen()" class="btn btn-primary btn-sm">Login</button>
      <p id="errorMsg" class="error"></p>
    </div>
  </div> -->


  <form id="frm-login">
    <div class="container d-flex justify-content-center align-items-center" style="height: 90vh;">
      <div class="login-card p-4 shadow bg-white">
        <div class="d-flex justify-content-center">
          <img src="assets/image/logo/iap_icon.png" alt="iShift" style="height: 100px; width: 150px;">
        </div>
        <div class="text-center my-2">
          <h4>iShift</h4>
        </div>
        <div class="form-floating mb-3">
          <input type="text" name="user-username" id="user-username" class="form-control rounded-3" placeholder="Username" required autocomplete="off">
          <label for="user-username">Username</label>
        </div>
        <div class="form-floating mb-2">
          <input type="password" name="user-password" id="user-password" class="form-control rounded-3" placeholder="Password" required autocomplete="off">
          <label for="user-password">Password</label>
        </div>
        <div class="form-check d-flex justify-content-end mb-3">
          <input class="form-check-input" type="checkbox" id="toggle-show-password" onclick="togglePassword()">
          <label class="form-check-label text-muted ms-2" for="toggle-show-password">
            Show Password
          </label>
        </div>
        <div class="d-grid mb-4">
          <button class="btn btn-primary btn-lg rounded-3 text-white" type="submit">
            Log In
          </button>
        </div>
      </div>
    </div>
  </form>

  <script src="assets/js/jquery.min.js"></script>
  <script src="assets/plugins/sweetalert2/sweetalert2.min.js"></script>
  <script src="assets/plugins/bootstrap/dist/js/bootstrap.min.js"></script>
  <script src="assets/plugins/toastr/toastr.min.js"></script>
  <script src="assets/plugins/chart.js/Chart.min.js"></script>
  <script src="assets/plugins/moment/moment.min.js"></script>
  <script src="assets/plugins/daterangepicker/daterangepicker.js"></script>
  <script src="assets/plugins/daterangepicker/daterangepicker.js"></script>
  <script src="assets/plugins/summernote/summernote-lite.min.js"></script>
  <script src="assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
  <script src="assets/plugins/elevatezoom-plus-master/src/jquery.ez-plus.js"></script>
  <script src="assets/plugins/datepicker/jquery-ui.min.js"></script>
  <script src="assets/js/global-scripts.js"></script>
  <!-- <script src="assets/js/relogin.js"></script> -->
</body>

</html>
<script>
  function togglePassword() {
    const passwordField = document.getElementById('user-password');
    const checkbox = document.getElementById('toggle-show-password');
    passwordField.type = checkbox.checked ? 'text' : 'password';
  }

  $("#frm-login").on("submit", function(event) {
    event.preventDefault();

    var $frm = $(this);
    var Username = $frm.find("#user-username").val();
    var Password = $frm.find("#user-password").val();

    $.post("actions/login.php", {
      Username: Username,
      Password: Password
    }, function(data) {

      var response = JSON.parse(data);
      if (response.isSuccess === "OK") {
        var sysRole = response.Data.SysRole;
        if (sysRole === "cashier") {
          window.location.assign("index.php");
        } else if (sysRole === "Admin") {
          window.location.assign("admin/index.php");
        } else {
          window.location.assign("index.php");
        }
      } else if (response.isSuccess === "Failed") {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: response.Message,
          confirmButtonText: "OKAY"
        })
      } else {
        console.log("Login failed:", response.Message);
      }
    });
  });
</script>