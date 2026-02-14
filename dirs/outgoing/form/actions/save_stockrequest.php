<?php
require_once "../../../../config/connection.php";
session_start();

$Userid          = $_SESSION['Uid'];
$SRN             = $_POST['srnForm'];
$TypeofRequest   = $_POST['typeForm'];
$Destination     = $_POST['desForm'];
$Destiwhscode    = $_POST['desCodeForm'];
$Origin          = $_POST['user-origin'];
$Originwhscode   = $_POST['originCodeForm'];
$DocDate         = $_POST['date'];
$DocStatus       = $_POST['statusForm'];
$items           = json_decode($_POST['items'], true);
$ReqPurpose      = $_POST['purposeForm'] ?? '';
$ReqBy           = $_POST['reqByForm'];
$Remarks         = $_POST['remarksForm'] ?? '';

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
        $Remarks,
        $ReqBy
    ]);

    // 2️⃣ Insert each item
    $ins_item = $conn->prepare("EXEC dbo.[SRN_ITEMSUBMIT] ?,?,?,?,?,?,?");
    foreach ($items as $item) {
        $ins_item->execute([
            $SRN,
            $item['brand'],      // ItemBrand
            $item['code'],       // Model
            $item['model'], // Item number / ItemName
            $item['category'],      // ItemGroup / Category
            $item['quantity'],        // Quantity
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
