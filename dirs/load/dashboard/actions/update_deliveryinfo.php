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


    $fetch_drnumber = $conn->prepare("EXEC dbo.[DeliveryNumber_Auto_Generate] ?");
    $fetch_drnumber->execute([$User]);
    $get_inclsioncode = $fetch_drnumber->fetch(PDO::FETCH_ASSOC);
    $DRNumber = $get_inclsioncode['DRNumber'];


    $stmtCollect = $conn->prepare("EXEC dbo.[ChainUpdateTables_Loadingbasket] ?,?");
    foreach ($pickListNumbers as $pickListNumber) {
        if (empty($pickListNumber)) continue;

        $stmtCollect->execute([
            $User,
            // $pickListNumber 
            $BatchNumber
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
        "BatchNumber" => $BatchNumber
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
