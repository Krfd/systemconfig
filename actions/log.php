<?php
session_start();
require_once "../config/connection.php";
header('Content-Type: application/json');

try {
    $User = $_SESSION['Uid'];
    $activity = $_POST['Activity'] ?? 'UNKNOWN';
    $reference = $_POST['Reference'] ?? 'UNKNOWN';

    if (!isset($_SESSION['Uid'])) {
        echo json_encode([
            "status" => "error",
            "message" => "SESSION UID MISSING"
        ]);
        exit;
    }

    $stmt = $conn->prepare("EXEC dbo.[Activity_Logs] ?, ?, ?");
    $stmt->execute([$User, $activity, $reference]);

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
