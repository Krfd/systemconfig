<?php

require_once __DIR__ .  "/../../../../config/connection.php";

try {
    $stmt = $conn->prepare("EXEC [GEt_Recent_Activities]");
    $stmt->execute();

    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $activities
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
