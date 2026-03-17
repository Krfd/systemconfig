<?php
require_once "../../../../config/connection.php";
session_start();
$Userid = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $upd_branchwhs = $conn->prepare("EXEC dbo.[UPDATE_OITW] ?");
    $upd_branchwhs->execute([$Userid]);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
    );

    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
