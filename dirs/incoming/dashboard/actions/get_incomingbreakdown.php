<?php
require_once "../../../../config/connection.php";
session_start();
$Userid = $_SESSION['Uid'];
$PKNumber = $_POST['PKNumber'];

try {
    $conn->beginTransaction();

    $fetch_srnbreackdown = $conn->prepare("EXEC dbo.[PKLIST_SRNBREAKDOWN] ?, ?");
    $fetch_srnbreackdown->execute([$Userid, $PKNumber]);

    $get_srnbreakdown = $fetch_srnbreackdown->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Data" => $get_srnbreakdown
    );
    echo json_encode($response);
} catch (PDOException $e) {
    $conn->rollBack();
    // echo "Error: " . $e->getMessage();
    $response = array(
        "isSuccess" => "Failed",
        "Data" => "<b>Error. Please Contact System Developer. <br></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
