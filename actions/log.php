<?php
session_start();
require_once "../config/connection.php";
header('Content-Type: application/json');

try {
    $User = $_SESSION['Uid'];
    $activity = $_POST['Activity'] ?? 'UNKNOWN';

    $log = "User: {$User} | Activity: {$activity} | Time: " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents("debug_log.txt", $log, FILE_APPEND);

    if (!isset($_SESSION['Uid'])) {
        echo json_encode([
            "status" => "error",
            "message" => "SESSION UID MISSING"
        ]);
        exit;
    }

    $stmt = $conn->prepare("EXEC dbo.[Activity_Logs] ?, ?");
    $stmt->execute([$User, $activity]);

    echo json_encode([
        "status" => "success",
        "user" => $User,
        "activity" => $activity
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
}
