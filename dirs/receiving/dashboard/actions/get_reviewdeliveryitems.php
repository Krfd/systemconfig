<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
// $DeliveryNumber = $_POST['DeliveryNumber'];
$searchType = $_POST['searchType'];
$searchValue = $_POST['searchValue'];

try {

    $conn->beginTransaction();
    // $stmt = $conn->prepare("EXEC dbo.DeliveryComplete_Details ?, ?");
    $stmt = $conn->prepare("EXEC dbo.[Get_Delivery_Details] ?, ?, ?");
    // $stmt->execute([$User, $DeliveryNumber]);
    $stmt->execute([$User, $searchType, $searchValue]);
    $get_header = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->nextRowset();
    $delivery_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $conn->commit();

    if ($get_header) {
        $response = array(
            "isSuccess" => "success",
            "Header" => $get_header,
            "Items" => $delivery_items
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
