<?php
  require_once "../../../../config/connection.php";
  session_start();

  $Branch = $_POST['Branch'];


try {
  $conn->beginTransaction();

    $fetch_branchwhscode = $conn->prepare("EXEC dbo.[IAP_WHSCODE_TYPE] ?");
    $fetch_branchwhscode->execute([$Branch]);
    $get_whscode = $fetch_branchwhscode->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_whscode
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