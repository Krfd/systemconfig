<?php
require_once("../../../../config/connection.php");
session_start();

$UserId = $_SESSION['Uid'];
$SRN = $_POST['SRN'];

try {
    $conn->beginTransaction();

    $clearTable = $conn->prepare("EXEC dbo.[ClearReqFormTable] ?, ?");
    $clearTable->execute([$UserId, $SRN]);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => "ok",
    );



    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollBack();
    $response = array(
        "isSuccess" => "Failed",
        "Data" => "<b>Erro, Please contact System Developer.<br></b>" . $e->getMessage()
    );
}
