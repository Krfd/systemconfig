<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

try {

    $conn->beginTransaction();

    $stmt = $conn->prepare("EXEC dbo.DisplayIntransit_items ?");
    $stmt->execute([$User]);
    $get_header = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->nextRowset();

    $basketData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Header" => $get_header,
        "Info" => $basketData,
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => "failed",
        "Data" => "<b>Error. Please Contact System Developer.</b><br>" . $e->getMessage()
    );

    echo json_encode($response);
}
