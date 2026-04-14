<?php
require_once "../../../../config/connection.php";

$DocEntry = $_POST['DocEntry'];
try {
    $conn->beginTransaction();

    $fetch_picklist = $conn->prepare("
      SELECT DocEntry FROM Pick_List_Header_1 WITH (NOLOCK) WHERE DocEntry = ?
    ");
    $fetch_picklist->execute([$DocEntry]);
    $get_data = $fetch_picklist->fetch(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_data
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
