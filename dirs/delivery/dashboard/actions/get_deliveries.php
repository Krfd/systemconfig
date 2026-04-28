<?php
  require_once "../../../../config/connection.php";
  session_start();

  $User     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

    $fetch_deliveryall = $conn->prepare("EXEC dbo.[DeliveryDisplay_Header] ?");
    $fetch_deliveryall->execute([ $User ]);
    $get_devliery = $fetch_deliveryall->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_devliery
  );
  echo json_encode($response);

}catch (PDOException $e){
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>".$e->getMessage()
  );
  echo json_encode($response);
}
?>

