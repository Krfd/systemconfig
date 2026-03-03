<?php
require_once "../../../../config/connection.php";
session_start();
$Userid = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $truncate_table = $conn->prepare("EXEC dbo.[RESET_TABLES_DEV] ?");
    $truncate_table->execute([$Userid]);

    $conn->commit();
    echo json_encode([
        "isSuccess" => "success"
    ]);
    exit;
} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
