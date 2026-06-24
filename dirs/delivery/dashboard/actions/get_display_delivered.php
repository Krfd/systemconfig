<?php
require_once "../../../../config/connection.php";
session_start();

$User           = $_SESSION['Uid'];
$DeliveryNumber = $_POST['DeliverNum'];

try {
    $conn->beginTransaction();

    $delivered = $conn->prepare("EXEC dbo.[DisplayDelivered] ?, ?");
    $delivered->execute([$User, $DeliveryNumber]);
    $get_delivered_header = $delivered->fetch(PDO::FETCH_ASSOC);
    $delivered->nextRowset();
    $get_delivered_items = $delivered->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Header" => $get_delivered_header,
        "Items" => $get_delivered_items,
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
