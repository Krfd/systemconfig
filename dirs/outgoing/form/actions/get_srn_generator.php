<?php
  require_once "../../../../config/connection.php";
  session_start();

  $Userid     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

    $stmtUser  = $conn->prepare("EXEC dbo.[SESSIONUSER] ?");
    $stmtUser ->execute([ $Userid]);
    $userData = $stmtUser ->fetch(PDO::FETCH_ASSOC);

    $Branch = $userData['Branch'];

    $stmtSRN  = $conn->prepare("EXEC dbo.[SRN_GENERATOR] ?");
    $stmtSRN ->execute([ $Branch]);
    $srnData  = $stmtSRN ->fetch(PDO::FETCH_ASSOC);


  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $srnData 
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