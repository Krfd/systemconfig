<?php
require_once "../../../../config/connection.php";
session_start();

$User          = $_SESSION['Uid'];
$BatchNum      = $_POST['BatchNum'];
$ItemCode      = $_POST['ItemCode'];
$TruckCategory = $_POST['TruckCategory'] ?? '';
$TruckPlate    = $_POST['TruckPlate'] ?? '';
$Driver        = $_POST['Driver'] ?? '';
$Remarks       = $_POST['Remarks'] ?? '';

$DeliveryQty  = $_POST['Quantity'] ?? [];

// $logData = [
//     "User"          => $User,
//     "BatchNum"      => $BatchNum,
//     "TruckCategory" => $TruckCategory,
//     "TruckPlate"    => $TruckPlate,
//     "Driver"        => $Driver,
//     "Remarks"       => $Remarks,
//     "ItemCode"       => $ItemCode,
//     "Quantity"   => $DeliveryQty,
// ];

// file_put_contents(
//     "loadingbasket_log.txt",
//     "[" . date("Y-m-d H:i:s") . "] " . print_r($logData, true) . PHP_EOL,
//     FILE_APPEND
// );

try {

    $conn->beginTransaction();

    $stmtHeader = $conn->prepare("EXEC dbo.[Update_LoadingBasket] ?,?,?,?,?,?");
    $stmtHeader->execute([
        $User,
        $BatchNum,
        $TruckCategory,
        $TruckPlate,
        $Driver,
        $Remarks
    ]);

    $stmtItems = $conn->prepare("EXEC dbo.[Update_LoadingBasket_Items] ?,?,?,?");

    foreach ($ItemCode as $key => $item) {
        $itemCode = $item;
        $qty    = $DeliveryQty[$key] ?? 0;
        $stmtItems->execute([$User, $BatchNum, $itemCode, $qty]);
    }

    $conn->commit();
    echo json_encode([
        "isSuccess" => "success",
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
