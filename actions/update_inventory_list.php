<?php
require_once "../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    // 1. Get user branch and region
    $stmtUser = $conn->prepare("EXEC dbo.[SESSIONUSER] ?");
    $stmtUser->execute([$User]);

    // Fetch result
    $user_info = $stmtUser->fetch(PDO::FETCH_ASSOC);
    $Branch = $user_info['Branch'] ?? null;
    $Region = ' ';

    // 2. Update item stocks
    $stmtUpdStocks = $conn->prepare("EXEC dbo.[UPDATE_OITW] ?");
    $stmtUpdStocks->execute([$User]);

    // 3. Update Inventory 1
    $stmtUpdInv1 = $conn->prepare("EXEC dbo.[UPDATE_INV1] ?, ?");
    $stmtUpdInv1->execute([$Branch, $Region]);

    // 4. Update Inventory 2
    $stmtUpdInv2 = $conn->prepare("EXEC dbo.[UPDATE_INV2] ?, ?");
    $stmtUpdInv2->execute([$Branch, $Region]);

    // 5. Update Product Item Codes
    $stmtUpdProduct = $conn->prepare("EXEC dbo.[UPDATE_POR1] ?, ?");
    $stmtUpdProduct->execute([$Branch, $Region]);

    // 6. Update Item Serial Numbers
    $stmtUpdSerial = $conn->prepare("EXEC dbo.[UPDATE_SRI1] ?, ?");
    $stmtUpdSerial->execute([$Branch, $Region]);

    // Commit Transaction
    $conn->commit();

    echo json_encode([
        "status" => "success"
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
