<?php
  require_once "../../../../config/connection.php";

  session_start();

  if (!isset($_SESSION['Uid'])) {
      header('Location: ../../../../login.php');
      exit();
  }

  $User = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

    $fetch_branches = $conn->prepare("
      SELECT 
      Latitude, Longitude, Province, Bid
      FROM branchinfo 
      WHERE Userid = ?
      AND Latitude IS NOT NULL
      AND Longitude IS NOT NULL
    ");
    $fetch_branches->execute([ $User ]);
    $get_branches = $fetch_branches->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_branches
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

