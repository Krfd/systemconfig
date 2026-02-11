<?php
  require_once "../../../../config/connection.php";
  session_start();

  // $Userid     = $_POST['Uid'];
  $Userid     = $_SESSION['Uid'];
// Append user ID to file
  $SRN     = $_POST['SRN'];

try {
  $conn->beginTransaction();

    $fetch_prepitem = $conn->prepare("EXEC dbo.[DISPLAY_PREPARED_ITMS] ? ,?");
    $fetch_prepitem->execute([ $Userid, $SRN]);
    $get_items = $fetch_prepitem->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_items
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