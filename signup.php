<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Bo's Café</title>
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
	<link rel="icon" href="assets/image/icon/favicon.png">
</head>

<body>

	<form id="frm-login">
		<div class="container d-flex justify-content-center align-items-center" style="height: 90vh;">
			<div class="login-card p-4 shadow bg-white">
				<div class="d-flex justify-content-center">
					<img src="assets/image/logo/logo.png" alt="Bo's Café Logo" style="border-radius: 50%; height: 150px; width: 150px;">
				</div>
				<div class="text-center mb-2">
					<h4>Bo's Café</h4>
				</div>
				<div class="form-floating mb-3">
					<input type="text" name="user-username" id="user-username" class="form-control rounded-3" placeholder="Username" required autocomplete="off">
					<label for="user-username">Username</label>
				</div>
				<div class="form-floating mb-3">
					<input type="text" name="user-role" id="user-role" class="form-control rounded-3" placeholder="Username" required autocomplete="off">
					<label for="user-role">Role</label>
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
				<div class="text-center">
					<small>Developed by: Reil P. Padilla</small>
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
</body>

</html>


<script>
	function togglePassword() {
		const passwordField = document.getElementById('user-password');
		const checkbox = document.getElementById('toggle-show-password');
		passwordField.type = checkbox.checked ? 'text' : 'password';
	}

	function contactSoftDev() {
		$("#mdl-forgot-password").modal("show")
	}


	$("#frm-login").on("submit", function(event) {
		event.preventDefault();

		var Username = $("#user-username").val();
		var Password = $("#user-password").val();
		var Role = $("#user-role").val();

		$.post(
			"actions/save_account.php", {
				Username: Username,
				Password: Password,
				Role: Role
			},
			function(data) { // ✅ comma was missing before this
				if ($.trim(data) === "OK") {
					alert("Ticket Sent!");
				} else {
					alert("Error: " + data);
				}
			}
		);
	});
</script>