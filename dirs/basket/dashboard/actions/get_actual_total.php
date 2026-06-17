<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$Picklists = isset($_POST['Picklists']) ? $_POST['Picklists'] : [];
$ItemCode = $_POST['ItemCode'];

try {

    $picklistString = implode(',', $Picklists);

    $stmt = $conn->prepare("EXEC dbo.[GET_ACTUAL_TOTAL] ?, ?, ?");
    $stmt->execute([
        $User,
        $picklistString,
        $ItemCode
    ]);

    $get_header = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => "success",
        "Data" => $get_header
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
