<?php
require_once "../../../../config/connection.php";
session_start();
$User   = $_SESSION['Uid'];
$Itm_RowNum = $_POST['Itm_RowNum'];

try {
    $conn->beginTransaction();

    $upd_removepklist = $conn->prepare("EXEC dbo.[Remove_Picklist_Delivery] ? ,?");
    $upd_removepklist->execute([$User, $Itm_RowNum]);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "message" => "Picklist has been removed"
    );

    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
