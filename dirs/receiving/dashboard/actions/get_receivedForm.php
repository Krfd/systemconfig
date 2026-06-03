<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;
$RcvdNumber = $_POST['rcvdNumber'];

try {
    $conn->beginTransaction();

    $get_receivedForm = $conn->prepare("EXEC dbo.[Received_Form] ?, ?");
    $get_receivedForm->execute([$User, $RcvdNumber]);
    $get_receivedHeader = $get_receivedForm->fetch(PDO::FETCH_ASSOC);
    $get_receivedForm->nextRowset();
    $get_receivedItems = $get_receivedForm->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Header" => $get_receivedHeader,
        "Items" => $get_receivedItems
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
