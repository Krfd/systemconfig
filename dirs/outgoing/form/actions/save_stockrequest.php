<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

// 🔹 Header Inputs
// $RequestType    = $_POST['RequestType'] ?? '';
$PurposeRequest = $_POST['PurposeRequest'] ?? '';
$OBranch        = $_POST['OBranch'] ?? '';
$OWhscode       = $_POST['OWhscode'] ?? '';
$DWhscode       = $_POST['DWhscode'] ?? '';
$Remarks        = $_POST['Remarks'] ?? '';

// 🔹 Items (optional)
$ItemNum = $_POST['ItemNum'] ?? [];

try {
    $conn->beginTransaction();

    // 🔹 1. Generate SR Number
    $stmtSRN = $conn->prepare("EXEC dbo.[StockReq_Num_Generator] ?");
    $stmtSRN->execute([$User]);
    $srnData = $stmtSRN->fetch(PDO::FETCH_ASSOC);

    $SRNumber = $srnData['SRNNumber'] ?? null;

    // 🔹 Loop each selected ItemNum
    foreach ($ItemNum as $itemNum) {

        // 🔹 Fetch item details based on ItemNum
        $stmtItems = $conn->prepare("EXEC dbo.[StockReq_Temp_Items] ?, ?");
        $stmtItems->execute([$User, $itemNum]);

        while ($row = $stmtItems->fetch(PDO::FETCH_ASSOC)) {

            $ItemCode     = $row['ItemCode'];
            $ItemName     = $row['ItemName'];
            $ItemBrand    = $row['ItemBrand'];
            $ItemCategory = $row['ItemCategory'];
            $Order_Qty    = $row['Order_Qty'];

            // 🔹 Insert each item
            $stmtInsertItem = $conn->prepare("EXEC dbo.[Insert_StockReq_Items] ?,?,?,?,?,?,?");
            $stmtInsertItem->execute([
                $User,
                $SRNumber,
                $ItemCode,
                $ItemName,
                $ItemBrand,
                $ItemCategory,
                $Order_Qty
            ]);
        }
    }


    // 🔹 2. Insert Header
    // $stmtHeader = $conn->prepare("EXEC dbo.[Create_StockRequest] ?,?,?,?,?,?,?,?");
    $stmtHeader = $conn->prepare("EXEC dbo.[Create_StockRequest] ?,?,?,?,?,?,?");
    $stmtHeader->execute([
        $User,
        $SRNumber,
        $PurposeRequest,
        $OBranch,
        $OWhscode,
        $Remarks,
        $DWhscode
    ]);

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "SRNumber" => $SRNumber,
        "message" => "Request has been submitted successfully!"
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "status" => "error",
        "message" => "Warning. Please contact system developer.",
        "error" => $e->getMessage()
    ]);
}
