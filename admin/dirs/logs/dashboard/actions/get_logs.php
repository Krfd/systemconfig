<?php

require_once "../../../../config/connection.php";

try {
    $conn->beginTransaction();

    $logs = $conn->prepare("EXEC dbo.[Get_Logs]");
    $logs->execute();

    $get_logs = $logs->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    if ($get_logs) {
        $response = array(
            "isSuccess" => "success",
            "Data" => $get_logs
        )
    }

    echo json_encode($response);
} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}