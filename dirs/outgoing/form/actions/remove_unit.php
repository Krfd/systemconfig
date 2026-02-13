<?php
require_once("../../../../config/connection.php");
session_start();

$UserId = $_SESSION['Uid'];
$ItemNum = $_POST['ItemNum'];

try {
    $conn->beginTransaction();

    $removeUnit = $conn->prepare("EXEC dbo.[REDUCE_PREP_QTY] ?, ?");
    $removeUnit->execute([$UserId, $ItemNum]);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Data" => "ok"
    );

    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollBack();
    $response = array(
        "isSuccess" => "Failed",
        "Data" => "<b>Error, Please contact System Developer. <br></b>" . $e->getMessage()
    );
}
