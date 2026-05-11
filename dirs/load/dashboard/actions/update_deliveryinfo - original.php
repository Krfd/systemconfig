<?php
require_once "../../../../config/connection.php";
session_start();

$User            = $_SESSION['Uid'] ?? null;
$pickListNumbers = $_POST['PickListNumber'] ?? [];
$BatchNumber     = $_POST['BatchNumber'] ?? null;
$DeliveryDate    = $_POST['DeliveryDate'] ?? null;
$Driver          = $_POST['Driver'] ?? null;
$TruckType       = $_POST['TruckType'] ?? null;
$PlateNumber     = $_POST['PlateNumber'] ?? null;
$Remarks         = $_POST['Remarks'] ?? '';

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("EXEC dbo.[DeliveryNumber_Auto_Generate] ?");
    $stmt->execute([$User]);
    $result   = $stmt->fetch(PDO::FETCH_ASSOC);
    $DRNumber = $result['DRNumber'] ?? null;

    if (!$DRNumber) {
        throw new Exception("Failed to generate DR Number.");
    }

    $stmtCollect = $conn->prepare("EXEC dbo.[ChainUpdateTables_Loadingbasket] ?,?");
    foreach ($pickListNumbers as $pickListNumber) {
        if (empty($pickListNumber)) continue;

        $stmtCollect->execute([
            $User,
            $pickListNumber
        ]);
    }

    $ins_loadingheader = $conn->prepare("EXEC dbo.[UpdateLoadingBasket_Delivery] ?,?,?,?,?,?,?,?");
    $ins_loadingheader->execute([
        $User,
        $BatchNumber,
        $DRNumber,
        $DeliveryDate,
        $Driver,
        $TruckType,
        $PlateNumber,
        $Remarks
    ]);

    $conn->commit();

    echo json_encode([
        "isSuccess"   => "success",
        "BatchNumber" => $BatchNumber,
        "DRNumber"    => $DRNumber
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    if ($conn->inTransaction()) {
        $conn->rollback();
    }
    echo json_encode([
        "isSuccess" => "error",
        "message"   => $e->getMessage()
    ]);
}
