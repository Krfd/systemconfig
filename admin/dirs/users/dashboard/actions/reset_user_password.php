<?php
require_once __DIR__ . "/../../../../../config/connection.php";

$id = $_GET['id'];

try {
    $conn->beginTransaction();

    $newPassword = password_hash("Password", PASSWORD_DEFAULT);

    $reset = $conn->prepare("EXEC [Reset_User_Password] ?, ?");
    $reset->execute([$id, $newPassword]);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
    );

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}