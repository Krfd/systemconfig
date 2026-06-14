<?php
session_start();
require_once "config/connection.php";
require_once "config/functions.php";

if (!isset($_SESSION['Uid'])) {
    header('Location: login.php');
    exit();
}
$User = $_SESSION['Uid'];

try {
    $ua = $conn->prepare("EXEC dbo.[Session_Account] ?");
    $ua->execute([$User]);
    $user = $ua->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "<b>Database Error:</b> " . htmlspecialchars($e->getMessage());
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>iShift</title>
    <link rel="stylesheet" href="assets/plugins/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="assets/plugins/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/adminlte.min.css">
    <link rel="stylesheet" href="assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
    <link rel="stylesheet" href="assets/plugins/daterangepicker/daterangepicker.css">
    <link rel="stylesheet" href="assets/plugins/bootstrap-icons/font/bootstrap-icons.css">
    <!-- <link rel="stylesheet" href="assets/plugins/datatables/datatables.min.css"> -->
    <link rel="stylesheet" href="assets/plugins/datatabless/dataTables.css">
    <link rel="stylesheet" href="assets/css/datatables.min.css">
    <link rel="stylesheet" href="assets/plugins/toastr/toastr.min.css">
    <link rel="stylesheet" href="assets/plugins/sweetalert2/sweetalert2.min.css">
    <link rel="stylesheet" href="assets/plugins/daterangepicker/daterangepicker.css">
    <link rel="stylesheet" href="assets/plugins/summernote/summernote-lite.min.css">
    <link rel="stylesheet" href="assets/plugins/datepicker/jquery-ui.structure.min.css">
    <!-- <link rel="stylesheet" href="node_modules/uikit/dist/css/uikit.min.css"> -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/custom.css">
    <link rel="icon" href="assets/image/logo/iap_icon.png">
</head>

<body class="hold-transition sidebar-mini layout-fixed overall-progress">
    <div class="wrapper">
        <nav class="main-header navbar navbar-expand bg-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
                <li class="nav-item text-info">
                    <a href="#" class="nav-link text-center">
                        <i class="bi bi-clock ml-4"></i>
                        <strong class="ml-2">
                            <span id="clock"></span>
                            <input type="hidden" id="clockvalue">
                        </strong>
                    </a>
                </li>
            </ul>
        </nav>
        <aside class="main-sidebar bg-primary-subtle elevation-5">
            <p class="text-center brand-link">
                <a href="index.php" style="text-decoration: none; color: inherit;">
                    <img src="assets/image/logo/iap_icon.png" alt="iShift Admin" id="profile-image" style="width: 100px; height: 65px; object-fit: cover;">
                    <br>
                </a>
                <small><?php echo isset($user['Username']) ? $user['Username'] : 'Bonjing!'; ?></small>
                <br>
                <span class="badge text-sm bg-primary" id="system-type"><?php echo (isset($user['UserRole']) ? $user['UserRole'] : '') . ' - ' . (isset($user['Branch']) ? $user['Branch'] : '') ?></span>
            </p>
            <div class="sidebar">
                <nav id="main-menu" class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item">
                            <a href="#" class="nav-link active" name="menu" menucode="outgoing">
                                <i class="nav-icon bi bi-box-arrow-in-left"></i>
                                <p>Outgoing</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="incoming">
                                <i class="nav-icon bi bi-box-arrow-in-right"></i>
                                <p>Incoming</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="basket">
                                <i class="bi bi-card-checklist"></i>
                                <p>Branch Assignment</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="load">
                                <i class="nav-icon bi bi-cart"></i>
                                <p>Loading Basket</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="delivery">
                                <i class="nav-icon bi bi-truck"></i>
                                <p>Stock Delivery</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="receiving">
                                <i class="nav-icon bi bi-box"></i>
                                <p>Stock Receiving</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="monitoring">
                                <i class="nav-icon bi bi-tv"></i>
                                <p>Monitoring</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="stocktransfer">
                                <i class="nav-icon bi bi-boxes"></i>
                                <p>Stock Transfer</p>
                            </a>
                        </li>
                        <hr>
                        <li class="nav-item">
                            <a href="#" class="nav-link" onclick="logout()">
                                <i class="nav-icon bi bi-box-arrow-right text-danger"></i>
                                <p>Logout</p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <input type="hidden" value="<?php echo $user['Username']; ?>" id="session-user">
        </aside>
    </div>
    <div class="content-wrapper">
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0 text-bold" id="main-title" style="color: #4A6CC3"></h1>
                    </div>
                </div>
            </div>
        </div>
        <section class="content">
            <div class="container-fluid" id="main-content"></div>
        </section>
    </div>
    <footer class="main-footer">
        <small>Imperial Appliance Plaza. All rights reserved.</small>
        <span id="current-year"></span>
        <div class="float-right d-none d-sm-inline-block">
        </div>
    </footer>
    </div>
    <!-- RELOGIN -->
    <div id="lockOverlay" class="lock-overlay">
        <div class="lock-box">
            <h2>Session Locked</h2>
            <p>Please login again to continue</p>
            <form id="relogin-frm" method="POST">
                <input type="text" id="newUsername" class="form-control" placeholder="Username" />
                <input type="password" id="newPassword" class="form-control" placeholder="Password" />
                <div class="col form-check d-flex justify-content-start mt-2 ms-1">
                    <input class="form-check-input" type="checkbox" id="toggle-show-password" onclick="togglePassword()">
                    <label class="form-check-label text-muted ms-2" for="toggle-show-password">
                        Show Password
                    </label>
                </div>
                <button type="submit" onclick="unlockScreen()" class="btn btn-primary btn-sm">Login</button>
                <p id="errorMsg" class="error"></p>
            </form>
        </div>
    </div>

    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/plugins/sweetalert2/sweetalert2.min.js"></script>
    <script src="assets/plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/plugins/toastr/toastr.min.js"></script>
    <script src="assets/plugins/chart.js/Chart.min.js"></script>
    <script src="assets/plugins/moment/moment.min.js"></script>
    <script src="assets/plugins/daterangepicker/daterangepicker.js"></script>
    <script src="assets/plugins/datatables/datatables.min.js"></script>
    <script src="assets/plugins/datatabless/dataTables.js"></script>
    <script src="assets/plugins/daterangepicker/daterangepicker.js"></script>
    <script src="assets/plugins/summernote/summernote-lite.min.js"></script>
    <script src="assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
    <script src="assets/plugins/elevatezoom-plus-master/src/jquery.ez-plus.js"></script>
    <script src="assets/js/adminlte.js"></script>
    <script src="assets/js/global-scripts.js"></script>
    <script src="assets/js/datatables.min.js"></script>
    <script src="assets/plugins/datepicker/jquery-ui.min.js"></script>
    <script src="node_modules/uikit/dist/js/uikit.min.js"></script>
    <script src="node_modules/xlsx/dist/xlsx.full.min.js"></script>
    <script src="assets/js/script.js"></script>
    <script src="assets/js/relogin.js"></script>
    <?php include 'modal.php'; ?>
    <script>
        $(document).ready(function() {
            $("#outgoingTable").DataTable({
                "pageLength": 50,
                order: [
                    [0, "desc"]
                ]
            });
            let picklistNumber = null;
            let picklistNumRef;
            let deliveryPicklistNum;
            let deliveryNum;
            let summaryTable;
            let srNumberMap = [];
            let statusColors = {
                Processing: "#FFDD57",
                Approved: "#81C784",
                Rejected: "#FF8A80",
            };
        })

        let groupedItems = {};
        let receivingGroupedItems = {}

        function togglePassword() {
            const passwordField = document.getElementById('newPassword');
            const checkbox = document.getElementById('toggle-show-password');
            passwordField.type = checkbox.checked ? 'text' : 'password';
        }
    </script>
</body>

</html>