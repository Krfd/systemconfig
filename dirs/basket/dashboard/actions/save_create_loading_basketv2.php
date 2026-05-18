<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;
$Item_Id            = $_POST['Item_Id'] ?? [];
$ItemSerial         = $_POST['ItemSerial'] ?? [];
$PickListnumber     = $_POST['PickListnumber'] ?? [];
$ItemQty            = $_POST['ItemQty'] ?? [];

try {
    $conn->beginTransaction();

    $stmtBatch = $conn->prepare("
        EXEC dbo.BatchNumber_Auto_Generate ?
    ");

    $stmtBatch->execute([$User]);

    $result = $stmtBatch->fetch(PDO::FETCH_ASSOC);

    if (!$result || empty($result['BatchNumber'])) {
        throw new Exception("Failed to generate batch number.");
    }

    $BatchNumber = $result['BatchNumber'];
    $stmtCollect = $conn->prepare("EXEC dbo.CreatePicklist_V2 ?,?,?,?,?,?");

    foreach ($Item_Id as $key => $itmid) {
        if (empty($itmid)) {
            continue;
        }
        $serial     = $ItemSerial[$key] ?? null;
        $picklist   = $PickListnumber[$key] ?? null;
        $qty   = $ItemQty[$key] ?? null;

        $stmtCollect->execute([
            $User,
            $itmid,
            $BatchNumber,
            $picklist,
            $serial,
            $qty
        ]);
    }

    $stmtHeader = $conn->prepare("
        EXEC dbo.CreateLoadingBasket_headerV2 ?, ?
    ");

    $stmtHeader->execute([
        $User,
        $BatchNumber
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
?>