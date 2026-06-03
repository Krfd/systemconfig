<?php 
// require_once "../../../../config/connection.php";
require_once __DIR__ . "/../../../../../config/connection.php";

try {

    $conn->beginTransaction();

    $stmt = $conn->prepare("EXEC dbo.Get_Requests");
    $stmt->execute();
    $header = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // $stmt->nextRowset();
    // $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        // "Header" => $requests,
        "Data" => $header
    );

    echo json_encode($response);
    // if ($conn) {
    //     echo "Connected";
    // } else {
    //     echo "Not Connected";
    // }
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}

?>