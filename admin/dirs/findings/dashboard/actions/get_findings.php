<?php 
require_once "../../../../config/connection.php";
session_start();

try {
    $stmt = $conn->prepare("EXEC Get_Findings");
    $stmt->execute();
    $findings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $findings
    );

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}

?>