<?php

require_once "../../../../config/connection.php";

try {
    $stmt = $conn->prepare("EXEC [Request_Analytics]");
    $stmt->execute();

    $daily = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $daily
    );

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}