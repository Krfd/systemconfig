<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

try {
    $conn->beginTransaction();

    $get_user = $conn->prepare("EXEC dbo.[Get_UserDetails] ?");
    $get_user->execute([$User]);
    $get_details = $get_user->fetch(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Data" => $get_details
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
