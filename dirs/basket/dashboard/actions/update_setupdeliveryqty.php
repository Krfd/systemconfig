<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;

$PickListNumber   = $_POST['PickListNumber'] ?? [];
$DeliveryQty      = $_POST['DeliveryQty'] ?? [];
$RequestingBranch = $_POST['RequestingBranch'] ?? [];
$ItemId           = $_POST['ItemId'] ?? [];
$Remarks          = $_POST['Remarks'] ?? [];

try {
    $conn->beginTransaction();

    $upd_delivery = $conn->prepare("EXEC dbo.[ApplyDistribution_Order] ?,?,?,?,?,?");

    foreach ($ItemId as $key => $item_id) {

        $pickList = $PickListNumber[$key] ?? null;
        $qty      = $DeliveryQty[$key] ?? null;
        $RqBranch = $RequestingBranch[$key] ?? null;
        $remark   = is_array($Remarks) ? ($Remarks[$key] ?? null) : $Remarks;

        if (!$item_id || !$qty) {
            continue;
        }

        $upd_delivery->execute([
            $User,
            $pickList,
            $RqBranch,
            $qty,
            $item_id,
            $remark
        ]);
    }

    // ✅ HEADER UPDATE MOVED OUTSIDE LOOP (IMPORTANT FIX)
    $upd_header = $conn->prepare("
        UPDATE Pick_List_Header_1 
        SET PickListStatus = 'PROCESSING', Remarks = ?
        WHERE PKList_Number = ?
    ");

    $upd_header->execute([
        is_array($Remarks) ? ($Remarks[0] ?? null) : $Remarks,
        $PickListNumber ?? null
    ]);

    $conn->commit();

    echo json_encode([
        "isSuccess" => "success"
    ]);
} catch (Exception $e) {

    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo "Error: " . $e->getMessage();
}
