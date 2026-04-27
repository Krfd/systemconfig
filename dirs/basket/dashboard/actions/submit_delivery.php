<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

$PickListNumber  = $_POST['picklist'];
$TruckCategory   = $_POST['truckCat'];
$TruckPlate      = $_POST['plate'];
$Driver          = $_POST['driver'];
$Remarks         = $_POST['remarks'];

$items = json_decode($_POST['items'], true) ?? [];

try {

    $conn->beginTransaction();

    // Generate Batch code
    $fetch_batchcode = $conn->prepare("EXEC dbo.[BatchNumber_Auto_Generate] ?");
    $fetch_batchcode->execute([$User]);
    $get_batcode = $fetch_batchcode->fetch(PDO::FETCH_ASSOC);
    $BatchNumber = $get_batcode['BatchNumber'];

    // Generate Delivery code
    $fetch_devnumber = $conn->prepare("EXEC dbo.[DeliveryNumber_Auto_Generate] ?");
    $fetch_devnumber->execute([$User]);
    $get_devnumber = $fetch_devnumber->fetch(PDO::FETCH_ASSOC);
    $DRNumber = $get_devnumber['DRNumber'];

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

    // foreach ($items as $item) {
    //     if (!isset($item['itemIds']) || !is_array($item['itemIds'])) {
    //         continue; // skip invalid data
    //     }

    //     foreach ($item['itemIds'] as $itemId) {
    //         $ins_items = $conn->prepare("EXEC dbo.[Collect_loadingitems] ?,?,?");
    //         $ins_items->execute([$User, $BatchNumber, $itemId]);
    //     }

    //     $logFile = 'debug_items_log.txt';

    //     file_put_contents($logFile, "==== NEW REQUEST ====\n", FILE_APPEND);
    //     file_put_contents($logFile, print_r($items, true) . "\n", FILE_APPEND);
    // }

    $logFile = "debug_items_log.txt";

    foreach ($items as $index => $item) {

        if (!isset($item['itemIds']) || !is_array($item['itemIds'])) {
            file_put_contents($logFile, "Item {$index} has invalid itemIds\n", FILE_APPEND);
            continue;
        }

        file_put_contents($logFile, "Item {$index} IDs: " . implode(',', $item['itemIds']) . "\n", FILE_APPEND);

        foreach ($item['itemIds'] as $itemId) {

            file_put_contents($logFile, "Processing itemId: {$itemId}\n", FILE_APPEND);

            $ins_items = $conn->prepare("EXEC dbo.[Collect_loadingitems] ?,?,?");
            $ins_items->execute([$User, $BatchNumber, $itemId]);
        }
    }

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "message" => "Delivery has been created successfully",
    );
    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
