<?php
require_once "../../../../config/connection.php";
session_start();

$Userid = $_SESSION['Uid'] ?? null;

if (!$Userid) {
    echo json_encode([
        "isSuccess" => "Failed",
        "Data" => "Session expired. Please login again."
    ]);
    exit;
}

try {

    $conn->beginTransaction();
    $stmtUser = $conn->prepare("EXEC dbo.[SESSIONUSER] ?");
    $stmtUser->execute([$Userid]);
    $userData = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        throw new Exception("User session not found.");
    }

    $Branch = $userData['Branch'];
    $stmtSRN = $conn->prepare("EXEC dbo.[SRN_GENERATOR] ?");
    $stmtSRN->execute([$Branch]);

    $srnData = $stmtSRN->fetch(PDO::FETCH_ASSOC);
    $lastSRN = $srnData['SRNNumber'] ?? null;

    $stmtSRN->nextRowset();
    $branchData = $stmtSRN->fetch(PDO::FETCH_ASSOC);
    $branchCode = $branchData['BranchCode'] ?? null;

    $conn->commit();

    $response = [
        "isSuccess" => "success",
        "Data" => [
            "SRNNumber" => $lastSRN,
            "BranchCode" => $branchCode
        ]
    ];

    echo json_encode($response);

} catch (Throwable $e) {

    if ($conn->inTransaction()) {
        $conn->rollback();
    }

    echo json_encode([
        "isSuccess" => "Failed",
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    ]);
}
?>