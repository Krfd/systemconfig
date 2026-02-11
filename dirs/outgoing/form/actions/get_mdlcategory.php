<?php
  require_once "../../../../config/connection.php";
  $Brand = $_POST['Brand'];

try {
  $conn->beginTransaction();

    $fetch_brands = $conn->prepare("EXEC dbo.[IAP_MODELS] ?");
    $fetch_brands->execute([$Brand]);
    $get_brand = $fetch_brands->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_brand
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