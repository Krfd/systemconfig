<?php
  require_once "../../../../config/connection.php";
  session_start();

  $User     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

    $fetch_stockrequest_list = $conn->prepare("EXEC dbo.[Monitor_StockRequest_List] ?");
    $fetch_stockrequest_list->execute([ $User]);
    $get_stockrequest = $fetch_stockrequest_list->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_stockrequest
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