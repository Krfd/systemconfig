<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$PickListNumber   = $_POST['PickListNumber']?? [];

try {
    $conn->beginTransaction();

    $upd_items = $conn->prepare("EXEC dbo.[AssignedSingleBranch_Status ] ?,?");
    $upd_items->execute([$User,$PickListNumber]);

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>
    