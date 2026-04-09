<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$DocEntry = $_POST['DocEntry'];
$Action = $_POST['Action']; /*To API script value only Terminate or Cancelled*/

try {
    $conn->beginTransaction();

    $upd_stockrequest = $conn->prepare("EXEC dbo.[StockRequest_Actions] ?,?,?");
    $upd_stockrequest->execute([$User, $DocEntry, $Action]);

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>
