<?php
// Include your database connection code here
ini_set('display_errors', 1);
error_reporting(E_ALL);

include("../../config/conn.php");

$sql = "SELECT DISTINCT ownership AS proposals, COUNT(id) AS total FROM form WHERE cancelled = 0 GROUP BY ownership";
$result = $conn->query($sql);

$data = array();
foreach ($result as $row) {
    $data[] = $row;
}

echo json_encode($data);

$conn = null;
