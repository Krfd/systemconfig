<?php

require_once __DIR__ . "/../../../../config/connection.php";

try {
    $stmt = $conn->prepare("EXEC [Get_Stats]");
    $stmt->execute();

    $overall = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->nextRowset();
    $delivered = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->nextRowset();
    $processing = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->nextRowset();
    $rejected = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "overall" => $overall,
        "delivered" => $delivered,
        "processing" => $processing,
        "rejected" => $rejected,
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
