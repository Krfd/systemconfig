<?php
require_once("../../../../config/connection.php");
session_start();

$UserId = $_SESSION['Uid'];
$SRN = $_POST['SRN'];

$data = "UserId: " . $UserId . PHP_EOL .
    "SRN: " . $SRN . PHP_EOL .
    "Date: " . date("Y-m-d H:i:s") . PHP_EOL .
    "------------------------" . PHP_EOL;

// Save to file (append mode)
file_put_contents("log.txt", $data, FILE_APPEND);

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
