<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $fetch_delivery = $conn->prepare("EXEC dbo.[Delivery_Loading_basket] ?");
    $fetch_delivery->execute([$User]);
    $get_deliveries = $fetch_delivery->fetchAll(PDO::FETCH_ASSOC);

    // $fetch_delivery->nextRowset();
    // $picklistCount = $fetch_delivery->fetch(PDO::FETCH_ASSOC)['picklistCount'];
    $fetch_delivery->nextRowset();
    $picklistCountRow = $fetch_delivery->fetch(PDO::FETCH_ASSOC);
    $picklistCount = $picklistCountRow['picklistCount'] ?? 0;

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_deliveries,
        "picklistCount" => $picklistCount
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
