<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$searchType = $_POST['searchType'];
$searchValue = $_POST['searchValue'];

try {
    $conn->beginTransaction();
    // $stmt = $conn->prepare("EXEC dbo.DeliveryComplete_Details ?, ?");
    $stmt = $conn->prepare("EXEC dbo.[Get_Delivery_Details] ?, ?, ?");
    $stmt->execute([$User, $searchType, $searchValue]);
    $get_header = $stmt->fetch(PDO::FETCH_ASSOC);
    if (isset($get_header['Status']) && $get_header['Status'] === 'failed') {
        $response = array(
            "isSuccess" => "failed",
            "message" => $get_header['Message']
        );
        echo json_encode($response);
        exit;
    }

    if (isset($get_header['Status']) && $get_header['Status'] === 'received') {
        $response = array(
            "isSuccess" => "received",
            "message" => $get_header['Message']
        );
        echo json_encode($response);
        exit;
    }

    $stmt->nextRowset();
    $delivery_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->nextRowset();
    $requested_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $conn->commit();

    if ($get_header) {
        $response = array(
            "isSuccess" => "success",
            "Header" => $get_header,
            "Items" => $delivery_items,
            "Requests" => $requested_items
        );
    } else {
        $response = array(
            "isSuccess" => "failed",
        );
    }

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();

    $response = array(
        "isSuccess" => "failed",
        "Data" => "<b>Error. Please Contact System Developer.</b><br>" . $e->getMessage()
    );

    echo json_encode($response);
}
