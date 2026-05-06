<?php
require_once "../../../../config/connection.php";
session_start();

$User        = $_SESSION['Uid'] ?? null;
$BatchNumber = $_POST['BatchNumber'] ?? null;

try {
    $conn->beginTransaction();

    $fetch_deliveryitems = $conn->prepare("EXEC dbo.[DisplayBatchDelivery_items] ?, ?");
    $fetch_deliveryitems->execute([$User, $BatchNumber]);
    $get_items = $fetch_deliveryitems->fetchAll(PDO::FETCH_ASSOC);

    $fetch_deliveryitems->nextRowset();
    $get_header = $fetch_deliveryitems->fetch(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = [
        "isSuccess" => "success",
        "Items"     => $get_items,
        "Header"    => $get_header
    ];
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = [
        "isSuccess" => "Failed",
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    ];
}

echo json_encode($response);
