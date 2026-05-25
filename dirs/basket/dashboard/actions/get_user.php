<?php 
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

try {
    
    $conn->beginTransaction();


    $stmt = $conn->prepare("SELECT Fullname FROM UserAccounts WHERE Uid = ?");
    $stmt->execute([$User]);
    $get_header = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $get_header
    );

    echo json_encode($response);

} catch(PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();

    $response = array(
        "isSuccess" => "failed",
        "Data" => "<b>Error. Please Contact System Developer.</b><br>" . $e->getMessage()
    );

    echo json_encode($response);
}

?>