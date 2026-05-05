<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $fetch_loadingbasket = $conn->prepare("EXEC dbo.[DisplayDelivery_LoadingBasket] ?");
    $fetch_loadingbasket->execute([$User]);
    $get_readydelivery = $fetch_loadingbasket->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_readydelivery
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
