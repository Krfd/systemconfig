<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];
$SR_Number = $_POST['SR_Number'];

try {

    $conn->beginTransaction();
    $stmt = $conn->prepare("EXEC dbo.ViewBreakdownStockRequest_Picklist ?,?");
    $stmt->execute([$User, $SR_Number]);
    $get_header = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->nextRowset();
    $get_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $conn->commit();

    echo json_encode([
        "isSuccess" => "success",
        "Data" => $get_header,
        "Items" => $get_items
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo json_encode([
        "isSuccess" => "failed",
        "Data" => $e->getMessage()
    ]);
}
