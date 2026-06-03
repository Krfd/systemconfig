<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;

try {
    $conn->beginTransaction();

    $get_receiving = $conn->prepare("EXEC dbo.[Received] ?");
    $get_receiving->execute([$User]);

    $get_items = $get_receiving->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Data" => $get_items
    );
    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
