<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$PickListNumber     = $_POST['PickListNumber'];

try {
    $conn->beginTransaction();

    $fetch_items = $conn->prepare("EXEC dbo.[PickListItems_WithActualQty] ?, ?");
    $fetch_items->execute([$User,  $PickListNumber]);
    $get_fetchitems = $fetch_items->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_fetchitems
    );
    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
