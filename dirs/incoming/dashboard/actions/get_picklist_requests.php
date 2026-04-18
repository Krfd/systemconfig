<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];
$PKList_Number = $_POST['PKList_Number'];

try {
    $conn->beginTransaction();

    $fetch_stockrequest = $conn->prepare("
      EXEC dbo.[PickListBreakdown_RequestItems] ?,?
    ");
    $fetch_stockrequest->execute([$User, $PKList_Number]);
    $get_items = $fetch_stockrequest->fetchAll(PDO::FETCH_ASSOC);

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
