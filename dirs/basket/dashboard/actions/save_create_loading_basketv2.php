<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;
$Item_Id            = $_POST['Item_Id'] ?? [];
$ItemSerial         = $_POST['ItemSerial'] ?? [];
$PickListnumber     = $_POST['PickListnumber'] ?? [];
$ItemQty            = $_POST['ItemQty'] ?? [];
$DeliveryDate       = $_POST['DeliveryDate'] ?? '';
$PrepBy             = $_POST['PrepBy'] ?? '';
$Driver             = $_POST['Driver'] ?? '';
$TruckCat           = $_POST['TruckCat'] ?? '';
$Plate              = $_POST['Plate'] ?? '';
$Remarks            = $_POST['Remarks'] ?? '';

try {
    $conn->beginTransaction();

    $stmtBatch = $conn->prepare("EXEC dbo.BatchNumber_Auto_Generate ?");
    $stmtBatch->execute([$User]);
    $result = $stmtBatch->fetch(PDO::FETCH_ASSOC);

    function generateReference($length = 6) {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $reference = '';

        for ($i = 0; $i < $length; $i++) {
            $reference .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $reference;
    }

    $fetch_drnumber = $conn->prepare("EXEC dbo.[DeliveryNumber_Auto_Generate] ?");
    $fetch_drnumber->execute([$User]);
    $get_inclsioncode = $fetch_drnumber->fetch(PDO::FETCH_ASSOC);
    $DRNumber = $get_inclsioncode['DRNumber'];

    if (!$result || empty($result['BatchNumber'])) {
        throw new Exception("Failed to generate batch number.");
    }

    $BatchNumber = $result['BatchNumber'];
    $stmtCollect = $conn->prepare("EXEC dbo.CreatePicklist_V2 ?,?,?,?,?,?,?");

    foreach ($Item_Id as $key => $itmid) {
        if (empty($itmid)) {
            continue;
        }

        $referenceNumber = generateReference();

        $serial     = $ItemSerial[$key] ?? null;
        $picklist   = $PickListnumber[$key] ?? null;
        $qty   = $ItemQty[$key] ?? null;

        $stmtCollect->execute([
            $User,
            $itmid,
            $referenceNumber,
            $BatchNumber,
            $picklist,
            $serial,
            $qty
        ]);
    }

    $stmtHeader = $conn->prepare("EXEC dbo.CreateLoadingBasket_headerV2 ?, ?, ?, ?, ?, ?, ?, ?, ?");

    $stmtHeader->execute([
        $User,
        $BatchNumber,
        $DRNumber,
        $DeliveryDate,
        $PrepBy,
        $Driver,
        $TruckCat,
        $Plate,
        $Remarks
    ]);

    $conn->commit();

    echo json_encode([
        "isSuccess" => "success"
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.</b><br>";
    echo $e->getMessage();
}
