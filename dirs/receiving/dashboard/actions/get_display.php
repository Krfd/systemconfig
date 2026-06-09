<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$refNum = $_POST['refNum'];
$ItemCode = $_POST['ItemCode'];

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("EXEC dbo.[Get_Nonserialize_Display] ?, ?, ?");
    $stmt->execute([
        $User,
        $refNum,
        $ItemCode
    ]);

    $get_nonserialize = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $get_nonserialize
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
