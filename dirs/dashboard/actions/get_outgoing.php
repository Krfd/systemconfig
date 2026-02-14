<?php
  require_once "../../../../config/connection.php";

  session_start();
  $Userid       = $_SESSION['Uid'];
  $Search       = $_POST['Search'];
  $CurrentPage  = $_POST['CurrentPage' ?? 1];
  $PageSize     = $_POST['PageSize' ?? 100];


try {
  $conn->beginTransaction();

    $fetch_ongoing = $conn->prepare("EXEC dbo.[OUTGOING] ?,?,?,?");
    $fetch_ongoing->execute([ $Userid, $Search, $CurrentPage, $PageSize]);
    $get_ongoing = $fetch_ongoing->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_ongoing
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