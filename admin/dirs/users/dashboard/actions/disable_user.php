<?php
require_once __DIR__ . "/../../../../../config/connection.php";

$id = $_POST['id'];

try {
    $conn->beginTransaction();

    $reset = $conn->prepare("EXEC [Disable_User] ?");
    $reset->execute([$id]);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
    );

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}