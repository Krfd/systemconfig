<?php
require_once "../../../../config/connection.php";
session_start();


$Userid       = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $fetch_picklisted = $conn->prepare("EXEC dbo.[PKLISTED_REQUESTS], ?");
    $fetch_picklisted->execute([$Userid]);
    $get_picklist = $fetch_picklisted->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_picklist
    );
    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
