<?php
require_once "../../../../config/connection.php";

$ItemSerial     = $_POST['ItemSerial'];
$response    = array();

try {
    $conn->beginTransaction();

    $fetch_items = $conn->prepare("EXEC dbo.[RR_Demo_Whs] ?");
    $fetch_items->execute([$ItemSerial]);
    $get_items = $fetch_items->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_items
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
