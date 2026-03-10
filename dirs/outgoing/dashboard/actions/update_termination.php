<?php
require_once "../../../../config/connection.php";
session_start();

$Userid   = $_SESSION['Uid'];
$SRN      = $_POST['SRN'];

try {
    $conn->beginTransaction();

    // Validation if already terminated
    $validation = $conn->prepare("SELECT TOP 1 * FROM SRN_REQUEST WITH (NOLOCK) WHERE BaseNum_SRN = ? AND RequestStatus = 'CANCELLED'");
    $validation->execute([$SRN]);

    if ($validation->rowCount() > 0) {
        exit('This request has already been terminated.');
    }

    $upd_terminate = $conn->prepare("EXEC dbo.[TERMINATE_SRNREQUEST] ?, ?");
    $upd_terminate->execute([$Userid, $SRN]);

    $conn->commit();
    echo json_encode([
        "isSuccess" => "success"
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "isSuccess" => "error",
        "message" => $e->getMessage()
    ]);
    exit;
}
