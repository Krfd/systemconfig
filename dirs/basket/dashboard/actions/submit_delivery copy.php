<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

$PickListNumber  = $_POST['picklist'];
$TruckCategory   = $_POST['truckCategory'];
$TruckPlate      = $_POST['plate'];
$Driver          = $_POST['driver'];
$Remarks         = $_POST['remarks'];

$items = json_decode($_POST['items'], true) ?? [];

try {

    $conn->beginTransaction();

    // Generate Batch code
    $fetch_batchcode = $conn->prepare("EXEC dbo.[BatchNumber_Auto_Generate]");
    $fetch_batchcode->execute();
    $get_batcode = $fetch_batchcode->fetch(PDO::FETCH_ASSOC);
    $BatchNumber = $get_batcode['BatchNumber'];

    // // Generate Delivery code
    // $fetch_devnumber = $conn->prepare("EXEC dbo.[BatchNumber_Auto_Generate]");
    // $fetch_devnumber->execute();
    // $get_devnumber = $fetch_devnumber->fetch(PDO::FETCH_ASSOC);
    // $DRNumber = $get_devnumber['DRNumber'];

    // Insert header
    $ins_loadingHeader = $conn->prepare("EXEC dbo.[CreateDelivery_Header] ?,?,?,?,?,?,?,?");
    $ins_loadingHeader->execute([
        $User,
        $BatchNumber,
        $DRNumber,
        $PickListNumber,
        $TruckCategory,
        $TruckPlate,
        $Driver,
        $Remarks
    ]);

    // Loop items
    foreach ($items as $item) {

        $ins_items = $conn->prepare("EXEC dbo.[Collect_loadingitems] ?,?,?");
        $ins_items->execute([$User, $BatchNumber, $item]);
    }

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "message" => "Delivery has been created successfully",
    );
    echo json_encode($response);
} catch (PDOException $e) {

    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
