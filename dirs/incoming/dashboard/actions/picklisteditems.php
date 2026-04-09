<?php
  require_once "../../../../config/connection.php";
  session_start();

  $User     = $_SESSION['Uid'];
  $PicklistNumber = $_POST['PicklistNumber'];

try {
  $conn->beginTransaction();

    $fetch_picklist_request = $conn->prepare("EXEC dbo.[PickList_Item_Collected] ?, ?");
    $fetch_picklist_request->execute([ $User, $PicklistNumber ]);
    $get_picklist = $fetch_picklist_request->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_picklist
  );
  echo json_encode($response);

}catch (PDOException $e){
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>".$e->getMessage()
  );
  echo json_encode($response);
}
?>