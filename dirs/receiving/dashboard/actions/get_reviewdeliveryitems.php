<?php
require_once "../../../../config/connection.php";

$DeliveryNumber = $_POST['DeliveryNumber'];

try {

    $conn->beginTransaction();
    // $stmt = $conn->prepare("EXEC dbo.DeliveryComplete_Details ?");
    $stmt = $conn->prepare("EXEC dbo.DeliveryComplete_Details ?");
    $stmt->execute([$DeliveryNumber]);
    $get_header = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt->nextRowset();

    $delivery_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $conn->commit();

    if ($get_header) {
        $response = array(
            "isSuccess" => "success",
            "Header" => $get_header,
            // "Orders" => $delivery_items
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
