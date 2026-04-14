<?php
require_once "../../../../config/connection.php";

try {
    $conn->beginTransaction();

    $fetch_truckrecord = $conn->prepare("
      SELECT 
        Truck_id, 
        TruckName, 
        TruckModel,
        TruckCategory,
        EngineNumber,
        PlateNumber,
        TruckSize
      FROM Truck_Record WITH (NOLOCK)
      ORDER BY Truck_id DESC
    ");
    $fetch_truckrecord->execute();
    $get_trucks = $fetch_truckrecord->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_trucks
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
