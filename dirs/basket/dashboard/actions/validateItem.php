<?php
require_once "../../../../config/connection.php";

$ItemCode     = $_POST['ItemCode'];
$Batch     = $_POST['Batch'];
$response    = array();

try {
    $conn->beginTransaction();

    // $fetch_items = $conn->prepare("EXEC dbo.[RR_Demo_Whs] ?");
    // $fetch_items->execute([$ItemCode]);
    // $get_items = $fetch_items->fetchAll(PDO::FETCH_ASSOC);

    $fetch_items = $conn->prepare("SELECT ItemCode FROM Loading_Basket_Picklist_items WHERE BatchBasket_Num = ? AND ItemCode = ?");
    $fetch_items->execute([$Batch, $ItemCode]);

    $get_items = $fetch_items->fetch(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_items
    );
    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
