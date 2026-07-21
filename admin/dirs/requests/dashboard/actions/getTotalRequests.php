<?php 
require_once __DIR__ . "/../../../../../config/connection.php";

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("EXEC dbo.Get_TotalRequests");
    $stmt->execute();
    $total = $stmt->fetch(PDO::FETCH_ASSOC);
   
    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Data" => $total,
    );

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}

?>