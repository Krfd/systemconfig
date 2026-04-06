<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$lbNum = $_POST['lbNum'];

try {
    $conn->beginTransaction();

    $review_lodingbasket = $conn->prepare("EXEC dbo.[Review_LoadingBasket] ?, ?");
    $review_lodingbasket->execute([$User, $lbNum]);

    // First result set (Delivery header)
    $get_reviewDev = $review_lodingbasket->fetch(PDO::FETCH_ASSOC);

    // Move to second result set (Delivery items)
    $review_lodingbasket->nextRowset();
    $get_items = $review_lodingbasket->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_reviewDev,
        "DevItems" => $get_items
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    );

    echo json_encode($response);
}
