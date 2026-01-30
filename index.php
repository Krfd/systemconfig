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
    $ua = $conn->prepare("EXEC SESSIONUSER @mUserid = ?");
    $ua->execute([$User]);
    $user = $ua->fetch(PDO::FETCH_ASSOC);

    /*  if ($user['Role'] !== 'Admin') {
        $_SESSION = [];
        session_destroy();
        header("Location: login.php");
        exit();
    }*/
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
    <link rel="stylesheet" href="assets/plugins/datatables/datatables.min.css">
    <link rel="stylesheet" href="assets/css/datatables.min.css">
    <link rel="stylesheet" href="assets/plugins/toastr/toastr.min.css">
    <link rel="stylesheet" href="assets/plugins/sweetalert2/sweetalert2.min.css">
    <link rel="stylesheet" href="assets/plugins/daterangepicker/daterangepicker.css">
    <link rel="stylesheet" href="assets/plugins/summernote/summernote-lite.min.css">
    <link rel="stylesheet" href="assets/plugins/datepicker/jquery-ui.structure.min.css">
    <link rel="stylesheet" href="node_modules/uikit/dist/css/uikit.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="assets/image/logo/logo.png">

    <style>
        .checkbox {
            display: none;
        }
    </style>
</head>

<body class="hold-transition sidebar-mini layout-fixed">
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
                    <img src="assets/image/logo/logo.png" alt="iServe Admin" id="profile-image" style="width: 100px; height: 100px; object-fit: cover;">
                    <br>
                </a>
                <small>Karlalooo</small>
                <br>
                <span class="badge text-sm bg-primary" id="system-type">Warehouseman</span>
            </p>
            <div class="sidebar">
                <nav id="main-menu" class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <!-- <li class="nav-item">
                            <p class="text-muted">Menus</p>
                        </li> -->
                        <!-- <li class="nav-item">
                            <a href="#" class="nav-link active" name="menu" menucode="dashboard" data-bs-toggle="tooltip" data-bs-title="Dashboard" data-bs-placement="right">
                                <i class="nav-icon bi bi-grid"></i>
                                <p>Dashboard</p>
                            </a>
                        </li> -->
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
                            <a href="#" class="nav-link" name="menu" menucode="delivery">
                                <i class="nav-icon bi bi-truck"></i>
                                <p>Delivery</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="receiving">
                                <i class="nav-icon bi bi-box"></i>
                                <p>Receiving</p>
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
                        <!-- <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="settings" data-bs-toggle="tooltip" data-bs-title="Settings" data-bs-placement="right">
                                <i class="nav-icon bi bi-gear"></i>
                                <p>Settings</p>
                            </a>
                        </li> -->
                        <hr>
                        <li class="nav-item">
                            <a href="#" class="nav-link" onclick="logout()">
                                <i class="nav-icon bi bi-box-arrow-right text-danger"></i>
                                <p>Logout</p>
                            </a>
                        </li>
                        <!-- <li class="nav-item d-flex align-items-center ms-3 mt-2">
                            <div class="form-check m-0 ml-1">
                                <input class="form-check-input" type="checkbox" id="theme-mode" onclick="loadTheme()">
                                <label class="form-check-label text-white ms-2" for="theme-mode" id="theme-label">Theme</label>
                            </div>
                        </li> -->
                    </ul>
                </nav>
            </div>
            <input type="hidden" value="<?php echo $user['Theme']; ?>" id="theme-pref">
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

    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/plugins/sweetalert2/sweetalert2.min.js"></script>
    <script src="assets/plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/plugins/toastr/toastr.min.js"></script>
    <script src="assets/plugins/chart.js/Chart.min.js"></script>
    <script src="assets/plugins/moment/moment.min.js"></script>
    <script src="assets/plugins/daterangepicker/daterangepicker.js"></script>
    <script src="assets/plugins/datatables/datatables.min.js"></script>
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
    <?php include 'modal.php'; ?>
    <script>
        $(document).ready(function() {
            $("#outgoingTable").DataTable({
                "pageLength": 50,
                order: [
                    [0, "desc"]
                ]
            });
        })
    </script>
</body>

</html>