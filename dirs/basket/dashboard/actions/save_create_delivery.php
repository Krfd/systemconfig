<?php
require_once "../../../../config/connection.php";
session_start();

/* Create DR */

$User = $_SESSION['Uid'];

$PKList_Number = $_POST['PKList_Number'] ?? [];
$DocEntry      = $_POST['DocEntry'] ?? [];

$Driver        = $_POST['Driver'] ?? null;
$TruckCategory = $_POST['TruckCategory'] ?? null;
$TruckPlate    = $_POST['TruckPlate'] ?? null;
$Remarks       = $_POST['Remarks'] ?? null;

try {

    $conn->beginTransaction();

    /* 🔹 Generate Loading Basket Number */
    $stmtBatch = $conn->prepare("EXEC dbo.[BatchNumber_Auto_Generate] ?");
    $stmtBatch->execute([$User]);
    $batchRow = $stmtBatch->fetch(PDO::FETCH_ASSOC);

    $BatchNumber = $batchRow['BatchNumber'];

    /* 🔹 Prepare reusable statements */
    $stmtPickItems = $conn->prepare("EXEC dbo.[PickListItems_To_LoadingBasketItems] ?");
    $stmtInsertItems = $conn->prepare("
        EXEC dbo.[Insert_LoadingBItems] ?,?,?,?,?,?,?,?,?,?,?,?,?
    ");
    $stmtPicklistRecord = $conn->prepare("
        EXEC dbo.[PicklistBasket_Record] ?,?,?,?
    ");

    /* 🔹 Loop DocEntry */
    foreach ($DocEntry as $doc) {

        $stmtPickItems->execute([$doc]);

        while ($items = $stmtPickItems->fetch(PDO::FETCH_ASSOC)) {

            $PKL_Number        = $items['PKList_Number'];
            $SR_Number         = $items['SR_Number'];
            $Req_Branch        = $items['Req_Branch'];
            $Req_Whscode       = $items['Req_Whscode'];
            $Req_ItemCode      = $items['Req_ItemCode'];
            $Req_ItemName      = $items['Req_ItemName'];
            $Req_ItemBrand     = $items['Req_ItemBrand'];
            $Req_ItemCategory  = $items['Req_ItemCategory'];
            $Req_Item_Qty      = $items['Req_Item_Qty'];
            $Actual_Item_Qty   = $items['Actual_Item_Qty'];

            /* 🔹 Insert Loading Basket Items */
            $stmtInsertItems->execute([
                $User,
                $BatchNumber,
                $PKL_Number,
                $SR_Number,
                $Req_Branch,
                $Req_Whscode,
                $Req_ItemCode,
                $Req_ItemName,
                $Req_ItemBrand,
                $Req_ItemCategory,
                $Req_Item_Qty,
                $Actual_Item_Qty,
                $DocEntry // ✅ (added missing param if needed)
            ]);

            /* 🔹 Insert Picklist Record */
            $stmtPicklistRecord->execute([
                $User,
                $BatchNumber,
                $PKL_Number,
                $Req_Branch
            ]);
        }
    }

    /* 🔹 Insert Loading Basket Header */
    $stmtHeader = $conn->prepare("
        EXEC dbo.[Create_LoadingBasket_Header] ?,?,?,?,?,?
    ");
    $stmtHeader->execute([
        $User,
        $BatchNumber,
        $Driver,
        $TruckCategory,
        $TruckPlate,
        $Remarks
    ]);

    $conn->commit();
    echo "OK";
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
