<?php
require_once "../config/connection.php";
session_start();
$Admin = $_SESSION['Uid'];
session_destroy();
echo "OK";
?>

