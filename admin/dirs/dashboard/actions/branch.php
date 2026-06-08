<?php

require_once __DIR__ . "/../../../../config/connection.php";

try {
    // $stmt = $conn->prepare("EXEC [Get_Branch_Details]");
    // $stmt->execute();

    // $branchDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $response = array(
    //     "isSuccess" => "success",
    //     "Data" => $branchDetails
    // );

    // echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
