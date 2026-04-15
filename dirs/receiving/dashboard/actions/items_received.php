<?php

require_once "../../../../config/connection.php";
session_start();

header('Content-Type: application/json');

try {

    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data) {
        echo json_encode([
            "isSuccess" => "failed",
            "message" => "Invalid JSON payload"
        ]);
        exit;
    }

    $items = $data['items'] ?? null;

    if (!$items || count($items) === 0) {
        echo json_encode([
            "isSuccess" => "failed",
            "message" => "No items received"
        ]);
        exit;
    }

    $logData = [
        "timestamp" => date("Y-m-d H:i:s"),
        "user" => $_SESSION['user_id'] ?? 'unknown',
        "payload" => $data
    ];

    file_put_contents(
        "received_items_log.txt",
        json_encode($logData, JSON_PRETTY_PRINT) . PHP_EOL . "----------------------" . PHP_EOL,
        FILE_APPEND
    );

    echo json_encode([
        "isSuccess" => "success",
        "message" => "Items saved successfully",
        "received_count" => count($items)
    ]);
} catch (Exception $e) {

    echo json_encode([
        "isSuccess" => "failed",
        "message" => $e->getMessage()
    ]);
}
