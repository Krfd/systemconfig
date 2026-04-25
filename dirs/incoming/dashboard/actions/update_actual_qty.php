<?php
require_once "../../../../config/connection.php";
session_start();

$User       = $_SESSION['Uid'];
$ItemNumber = $_POST['ItemNumber'] ?? [];
$ActualQty  = $_POST['ActualQty'] ?? [];
$ExecutedBy = $_POST['ExecutedBy'] ?? "";
$SR_Number  = isset($_POST['SR_Number']) ? (array)$_POST['SR_Number'] : [];

try {
    $conn->beginTransaction();

    $upd_picklistcollection = $conn->prepare("EXEC dbo.[Apply_Actual_Quantity] ?, ?, ?, ?");
    foreach ($ItemNumber as $i => $item) {
        $qty = $ActualQty[$i] ?? 0;
        $upd_picklistcollection->execute([$User, $item, $qty, $ExecutedBy]);
    }

    $upd_stockrequestStatus = $conn->prepare("EXEC dbo.[Update_Status_RequestingBranch] ?");
    foreach ($SR_Number as $requestnumber) {
        $upd_stockrequestStatus->execute([$requestnumber]);
    }

    $conn->commit();
    echo json_encode([
        "status" => "success",
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
