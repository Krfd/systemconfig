<?php
require_once "../../../../config/connection.php";

$Docentry = $_POST['DocEntry'];
$ExecutedBy = $_POST['ExecutedBy'];

try {
    $conn->beginTransaction();

    $upd_picklistrecord = $conn->prepare("UPDATE Pick_List_Header_1 SET CollectedBy = ? WHERE DocEntry=?");
    $upd_picklistrecord->execute([$ExecutedBy, $Docentry]);

    $conn->commit();
    $response = array(
        "status" => "success",
    );
    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
