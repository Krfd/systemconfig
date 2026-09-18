<?php

function errorHandler($errno, $errstr, $errfile, $errline)
{
    date_default_timezone_set('Asia/Manila');
    $logMessage = "[" . date("Y-m-d H:i:s") . "] Error: [$errno] $errstr in $errfile on line $errline" . PHP_EOL;
    file_put_contents('./error_log.txt', $logMessage, FILE_APPEND);
}
set_error_handler("errorHandler");

$servername = "192.168.101.68";
$db = "IAP_InfraHub";
$username = "sa";
$password = "SB1Admin";

try {
    $conn = new PDO("sqlsrv:server=$servername;database=$db;TrustServerCertificate=true", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    die("Connection failed: " . $e->getMessage());
}

$password = password_hash("Password", PASSWORD_DEFAULT);
$date = date('Y-m-d H:i:s');
$admins = [
    ['username' => 'Daryl', 'password' => $password, 'position' => 'Technical Support Supverisor'],
    ['username' => 'Roy', 'password' => $password, 'position' => 'Technical Support Supervisor'],
];

$adminLists = $conn->prepare("INSERT INTO SysAccount (Username, Password, JobPosition) 
VALUES(:Username, :Password, :JobPosition)");
foreach ($admins as $admin) {
    $adminLists->bindParam(":Username", $admin['username']);
    $adminLists->bindParam(":Password", $admin['password']);
    $adminLists->bindParam(":JobPosition", $admin['position']);
    $adminLists->execute();

    echo "user has been inserted";
}
