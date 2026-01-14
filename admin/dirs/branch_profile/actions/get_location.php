<?php
  require_once "../../../../config/connection.php";

  session_start();

  if (!isset($_SESSION['Uid'])) {
      header('Location: ../../../../login.php');
      exit();
  }

  $User = $_SESSION['Uid'];


  $Bid     = $_POST['Bid'];

try {
  $conn->beginTransaction();

    $fetch_loc = $conn->prepare("
      SELECT Latitude, Longitude, Bid
      FROM branchinfo 
      WHERE Bid = ?
    ");
    $fetch_loc->execute([ $Bid ]);
    $get_location = $fetch_loc->fetch(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_location
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

