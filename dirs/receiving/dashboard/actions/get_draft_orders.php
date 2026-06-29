<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;
$reference = $_POST['reference'] ?? "";

try {
    $conn->beginTransaction();

    $get_draft_orders = $conn->prepare("EXEC dbo.[Get_Drafts_Orders] ?, ?");
    $get_draft_orders->execute([$User, $reference]);

    $get_items = $get_draft_orders->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Items" => $get_items
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
