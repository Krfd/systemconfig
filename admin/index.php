<?php
session_start();
require_once "../config/connection.php";
require_once "../config/functions.php";

if (!isset($_SESSION['Uid'])) {
    header('Location: ../login.php');
    exit();
}
$User = $_SESSION['Uid'];

try {
    $ua = $conn->prepare("CALL SESSION_USER (?)");
    $ua->execute([$User]);
    $user = $ua->fetch(PDO::FETCH_ASSOC);

    if ($user['SysRole'] !== 'Admin') {
        $_SESSION = [];
        session_destroy();
        header("Location: ../login.php");
        exit();
    }



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
  <title>Bo's Café</title>
  <link rel="stylesheet" href="../assets/plugins/fontawesome-free/css/all.min.css">
  <link rel="stylesheet" type="text/css" href="../assets/plugins/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/adminlte.min.css">
  <link rel="stylesheet" href="../assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
  <link rel="stylesheet" href="../assets/plugins/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="../assets/plugins/bootstrap-icons/font/bootstrap-icons.css">
  <link rel="stylesheet" href="../assets/plugins/datatables/datatables.min.css">
  <link rel="stylesheet" href="../assets/css/datatables.min.css">
  <link rel="stylesheet" href="../assets/plugins/toastr/toastr.min.css">
  <link rel="stylesheet" href="../assets/plugins/sweetalert2/sweetalert2.min.css">
  <link rel="stylesheet" href="../assets/plugins/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="../assets/plugins/summernote/summernote-lite.min.css">
  <link rel="stylesheet" href="../assets/plugins/leaflet/leaflet.css">
  <link rel="stylesheet" href="../assets/plugins/datepicker/jquery-ui.structure.min.css">
  <link rel="stylesheet" href="../node_modules/uikit/dist/css/uikit.min.css">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="icon" href="../assets/image/icon/favicon.png">

</head>
<body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper">
        <nav class="main-header navbar navbar-expand">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="bi bi-list"></i></a>
                </li>
                <li class="nav-item">
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
        <aside class="main-sidebar sidebar-dark-secondary elevation-5">
            <p class="text-center brand-link">
                <a href="index.php" style="text-decoration: none; color: inherit;">
                    <img src="../assets/image/icon/favicon.png" alt="Bo's Café Logo" id="profile-image"style="width: 100px; height: 100px; object-fit: cover;">
                    <br>
                    <small>Bo's Café</small>
                </a>
                <br>
                <span class="badge text-sm bg-secondary" id="system-type"><?php echo $user['SysRole'];  ?></span>
            </p>
            <div class="sidebar">
                <nav id="main-menu" class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false" >
                        <li class="nav-item">
                            <p class="text-muted">Menus</p>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="dashboard" data-bs-toggle="tooltip" data-bs-title="Dashboard" data-bs-placement="right">
                                <i class="nav-icon bi bi-grid"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                       
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="leave">
                                <i class="nav-icon bi bi-reply"></i>
                                <p>Leave</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="holiday">
                                <i class="nav-icon bi bi-cash"></i>
                                <p>Payroll</p>
                            </a>
                        </li>
                        <li class="nav-item">
                             <a href="#" class="nav-link active" name="menu" menucode="setupmenu">
                                 <i class="nav-icon bi-journal-text"></i>
                                 <p>Menu Setup</p>
                             </a>
                        </li> 
                        <li class="nav-item">
                             <a href="#" class="nav-link" name="menu" menucode="store">
                                 <i class="nav-icon bi bi-building"></i>
                                 <p>Store Setup</p>
                             </a>
                         </li> 
                        <hr>
                        <li class="nav-item">
                            <a href="#" class="nav-link" name="menu" menucode="settings">
                                <i class="nav-icon bi bi-gear"></i>
                                <p>Settings</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" onclick="logout()">
                                <i class="nav-icon bi bi-box-arrow-right text-danger"></i>
                                <p>Logout</p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    </div>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h4 class="m-0 text-secondary" id="main-title"></h4>
            </div>
          </div>
        </div>
      </div>
      <section class="content">
        <div class="container-fluid" id="main-content"></div>
      </section>
    </div>
    <footer class="main-footer">
        <small>Bo's Café. All rights reserved. Developed by: Reil P. Padilla</small>
        <span id="current-year"></span>
        <div class="float-right d-none d-sm-inline-block">
        </div>
    </footer>
</div>


<script src="../assets/js/jquery.min.js"></script>
<script src="../assets/plugins/sweetalert2/sweetalert2.min.js"></script>
<script src="../assets/plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/plugins/toastr/toastr.min.js"></script>
<script src="../assets/plugins/chart.js/Chart.min.js"></script>
<script src="../assets/plugins/moment/moment.min.js"></script>
<script src="../assets/plugins/daterangepicker/daterangepicker.js"></script>
<script src="../assets/plugins/datatables/datatables.min.js"></script>
<script src="../assets/plugins/daterangepicker/daterangepicker.js"></script>
<script src="../assets/plugins/summernote/summernote-lite.min.js"></script>
<script src="../assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<script src="../assets/plugins/elevatezoom-plus-master/src/jquery.ez-plus.js"></script>
<script src="../assets/plugins/leaflet/leaflet.js"></script>
<script src="../assets/js/adminlte.js"></script>
<script src="../assets/js/global-scripts.js"></script>
<script src="../assets/js/datatables.min.js"></script>
<script src="../assets/plugins/datepicker/jquery-ui.min.js"></script>
<script src="../node_modules/uikit/dist/js/uikit.min.js"></script>
<script src="../node_modules/xlsx/dist/xlsx.full.min.js"></script>
<script src="script/script.js"></script>
<?php include '../modal.php';?>
</body>
</html>

