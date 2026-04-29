<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? '';

try {
    $conn->beginTransaction();

    $stmtSRN = $conn->prepare("EXEC dbo.[StockReq_Num_Generator] ?");
    $stmtSRN->execute([$User]);
    $srnData = $stmtSRN->fetch(PDO::FETCH_ASSOC);

    $stmtSRN->nextRowset();
    $branchData = $stmtSRN->fetch(PDO::FETCH_ASSOC);
    $branch = $branchData['BranchName'] ?? '';

    $conn->commit();
    echo json_encode([
        "isSuccess"  => "success",
        "SRNNumber"  => $srnData['SRNNumber'] ?? '',
        "BranchName" => $branch
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo json_encode([
        "isSuccess" => "failed",
        "message"   => "Error. Please contact System Developer.",
        "error"     => $e->getMessage()
    ]);
}
