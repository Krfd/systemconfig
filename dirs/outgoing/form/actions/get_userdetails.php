<?php
require_once "../../../../config/connection.php";
session_start();
$User     = $_SESSION['Uid'];
try {
    $conn->beginTransaction();

    $fetch_user = $conn->prepare("EXEC dbo.[Session_Account] ?");
    $fetch_user->execute([$User]);
    $get_userdeatils = $fetch_user->fetch(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_userdeatils
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
