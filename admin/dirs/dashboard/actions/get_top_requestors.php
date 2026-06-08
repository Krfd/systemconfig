<?php

require_once "../../../../config/connection.php";

try {
    $stmt = $conn->prepare("EXEC [GEt_TopRequestors]");
    $stmt->execute();

    $branches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $branches
    );

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}