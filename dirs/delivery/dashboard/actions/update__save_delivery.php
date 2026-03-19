<?php
require_once "../../../../config/connection.php";
session_start();

$User   = $_SESSION['Uid'];
$DRNUmber = $_POST['DRNUmber'];
$RowNum = $_POST['RowNum'];
$DeliveryDate = $_POST['DeliveryDate'];
$DocumentDate = $_POST['DocumentDate'];
$PlateNumber = $_POST['PlateNumber'];
$Driver = $_POST['Driver'];
$Remarks = $_POST['Remarks'];

try {
    $conn->beginTransaction();

    $upd_final_setup = $conn->prepare("EXEC dbo.[Set_Final_delivery] ?,?,?,?,?,?,?,?");
    $upd_final_setup->execute([$User, $DRNUmber, $RowNum, $DeliveryDate, $DocumentDate, $PlateNumber, $Driver, $Remarks]);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "message" => "Sent for delivery"
    );

    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollBack();

    $response = array(
        "isSuccess" => "error",
        "message" => $e->getMessage(),
    );

    echo json_encode($response);
}
