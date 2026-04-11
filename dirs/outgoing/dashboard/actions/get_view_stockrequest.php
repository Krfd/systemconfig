<?php
require_once "../../../../config/connection.php";
session_start();


$User     = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $fetch_stockrequest_own = $conn->prepare("EXEC dbo.[View_Own_StockRequest] ?");
    $fetch_stockrequest_own->execute([$User]);
    $get_ownrequest = $fetch_stockrequest_own->fetch(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_ownrequest
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
