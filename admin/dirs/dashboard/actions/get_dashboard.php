<?php
require_once __DIR__ . "/../../../../config/connection.php";

try {
    $stmt = $conn->prepare("EXEC Get_Requests");
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $requests
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
