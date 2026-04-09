<?php
  require_once "../../../../config/connection.php";
  session_start();

  $User     = $_SESSION['Uid'];
  $PicklistNumber = $_POST['PicklistNumber'];

try {
  $conn->beginTransaction();

    $fetch_picklistbreakdown = $conn->prepare("EXEC dbo.[PickList_Breakdown_StockRequest] ?, ?");
    $fetch_picklistbreakdown->execute([ $User, $PicklistNumber ]);
    $get_picklists = $fetch_picklistbreakdown->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_picklists
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