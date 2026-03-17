<?php
  require_once "../../../../config/connection.php";
  session_start();

  $Userid = $_SESSION['Uid'];
  $Itemcode = null;
  $Serial = $_POST['Serial'];

try {
  $conn->beginTransaction();

    $fetch_itemserial = $conn->prepare("EXEC dbo.[Search_Product_Serial] ?, ?, ?");
    $fetch_itemserial->execute([ $Userid, $Itemcode,  $Serial]);
    $get_item = $fetch_itemserial->fetch(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_item
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


