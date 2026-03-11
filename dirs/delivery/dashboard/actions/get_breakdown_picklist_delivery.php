<?php
  require_once "../../../../config/connection.php";
  session_start();

  $User     		= $_SESSION['Uid'];
  $Delivery_Num     = $_POST['Delivery_Num'];


try {
  $conn->beginTransaction();

    $dr_picklistbasket = $conn->prepare("EXEC dbo.[LOADING_BASKET_DELIVERY] ?, ?");
    $dr_picklistbasket->execute([ $User, $Delivery_Num ]);
    $get_pklist = $dr_picklistbasket->fetch(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_pklist
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