<?php
require_once "../../../../config/connection.php";

$DocEntry = $_POST['DocEntry'];  

try {
    $conn->beginTransaction();
    $stmt = $conn->prepare("EXEC dbo.View_StockRequest_Details ?");
    $stmt->execute([$DocEntry]);
    $header = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $stmt->nextRowset();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $conn->commit();

    // Prepare response
    $response = [
        "isSuccess" => 'success',
        "Header" => $header,
        "Items" => $items
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    $conn->rollback();
    $response = [
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    ];
    echo json_encode($response);
}
?>