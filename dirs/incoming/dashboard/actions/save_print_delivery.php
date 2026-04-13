<?php
require_once "../../../../config/connection.php";

$Docentry = $_POST['DocEntry'];
$ExecutedBy = $_POST['ExecutedBy'];

try {
    $conn->beginTransaction();

    $upd_picklistrecord = $conn->prepare("UPDATE Pick_List_Header_1 SET CollectedBy = ? WHERE DocEntry=?");
    $upd_picklistrecord->execute([$ExecutedBy, $Docentry]);

    $conn->commit();
    echo "success";
} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
