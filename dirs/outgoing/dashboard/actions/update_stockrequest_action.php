<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$DocEntry = $_POST['DocEntry'];
$srn = $_POST['SRN'];
$Action = $_POST['Action'];

try {
    $conn->beginTransaction();

    $upd_stockrequest = $conn->prepare("EXEC dbo.[StockRequest_Actions] ?,?,?, ?");
    $upd_stockrequest->execute([$User, $DocEntry, $srn, $Action]);

    $conn->commit();
    $response = array(
        "isSuccess" => 'success',
    );
    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
