<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$Delivery_Num = $_POST['Delivery_Num'];

try {
    $conn->beginTransaction();

    $review_delivery = $conn->prepare("EXEC dbo.[REVIEW_DELIVERY] ?, ?");
    $review_delivery->execute([$User, $Delivery_Num]);

    // First result set (Delivery header)
    $get_reviewDev = $review_delivery->fetch(PDO::FETCH_ASSOC);

    // Move to second result set (Delivery items)
    $review_delivery->nextRowset();
    $get_items = $review_delivery->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_reviewDev,
        "DevItems" => $get_items
    );

    echo json_encode($response);
} catch (PDOException $e) {

    $conn->rollback();

    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    );

    echo json_encode($response);
}
