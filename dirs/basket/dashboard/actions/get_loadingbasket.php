<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$PicklistNUmber = $_POST['picklist'];

try {

    $conn->beginTransaction();
    $stmt = $conn->prepare("EXEC dbo.ReviewPicklist_details ?, ?");
    $stmt->execute([$User, $PicklistNUmber]);
    $get_header = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt->nextRowset();

    $picklist_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Header" => $get_header,
        "Orders" => $picklist_items
    );

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
