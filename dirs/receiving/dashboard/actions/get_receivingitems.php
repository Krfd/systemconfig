<?php
require_once "../../../../config/connection.php";

$ItemSerial     = $_POST['ItemSerial'];
$DeliveryNumber = $_POST['DeliveryNumber'];
$response    = array();

try {
    $conn->beginTransaction();

    $fetch_items = $conn->prepare("EXEC dbo.[Receiving_Serial] ?,?");
    $fetch_items->execute([$ItemSerial, $DeliveryNumber]);
    $get_items = $fetch_items->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    if (!empty($get_items)) {
        $response = array(
            "isSuccess" => 'success',
            "Data" => $get_items
        );
    } else {
        $response = array(
            "isSuccess" => 'empty',
            "Data" => 'No matching records found.'
        );
    }
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
