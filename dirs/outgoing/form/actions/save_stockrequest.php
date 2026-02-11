<?php
require_once "../../../../config/connection.php";
session_start();

$Userid          = $_SESSION['Uid'];
$SRN             = $_POST['SRN'];
$TypeofRequest   = $_POST['TypeofRequest'];
$Destination     = $_POST['Destination'];
$Destiwhscode    = $_POST['Destiwhscode'];
$Origin          = $_POST['Origin'];
$Originwhscode   = $_POST['Originwhscode'];
$DocDate         = $_POST['DocDate'];
$DocStatus       = $_POST['DocStatus'];
$ReqPurpose      = $_POST['ReqPurpose'] ?? '';
$ReqBy           = $_POST['ReqBy'];
$Remarks         = $_POST['Remarks'] ?? '';
$items           = $_POST['items'];

try {
    $conn->beginTransaction();

    // 1️⃣ Insert SRN Request
    $ins_stsrequest = $conn->prepare("EXEC dbo.[SRN_SAVEREQUEST] ?,?,?,?,?,?,?,?,?,?,?");
    $ins_stsrequest->execute([
        $Userid,
        $SRN,
        $TypeofRequest,	
        $Destination,
        $Destiwhscode,
        $Origin,
        $Originwhscode,
        $DocDate,
        $DocStatus,
        $ReqPurpose,
        $Remarks
    ]);

    // 2️⃣ Insert each item
    $ins_item = $conn->prepare("EXEC dbo.[SRN_ITEMSUBMIT] ?,?,?,?,?,?,?");
    foreach ($items as $item) {
        $ins_item->execute([
            $SRN,
            $item['brand'],      // ItemBrand
            $item['name'],       // Model
            $item['itemnumber'], // Item number / ItemName
            $item['group'],      // ItemGroup / Category
            $item['qty'],        // Quantity
            $Userid
        ]);
    }

    $conn->commit();
    echo "OK";

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollback();
    }
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
?>
