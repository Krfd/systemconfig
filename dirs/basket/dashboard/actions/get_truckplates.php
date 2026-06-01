<?php
require_once "../../../../config/connection.php";

$category = $_POST['category'];

try {
    $conn->beginTransaction();

    $fetch_truckplates = $conn->prepare("EXEC dbo.Get_Plates ?");
    $fetch_truckplates->execute([$category]);
    $categories = $fetch_truckplates->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Plates" => $categories,
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
