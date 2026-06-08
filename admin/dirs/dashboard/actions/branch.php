<?php
// Include your database connection code here
ini_set('display_errors', 1);
error_reporting(E_ALL);
// Database connection parameters

include("../../config/conn.php");

$sql = "SELECT DISTINCT status, COUNT(status) AS count FROM form WHERE cancelled = 0 AND MONTH(created) = MONTH(created) GROUP BY status";
$result = $conn->query($sql);

$data = array();
foreach ($result as $row) {
    $data[] = $row;
}

echo json_encode($data);

$conn = null;
