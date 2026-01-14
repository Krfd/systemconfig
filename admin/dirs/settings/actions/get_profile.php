<?php
  require_once "../../../../config/connection.php";
  session_start();
  

  if (!isset($_SESSION['Uid'])) {
      header('Location: ../../../../login.php');
      exit();
  }
  $User     = $_SESSION['Uid'];


try {
  $conn->beginTransaction();

    $profile = $conn->prepare("
      SELECT Fullname, Position, ContactNumber, Email, Fb, Viber, HomeAddrss, Birthday, BgImage, Website
      FROM Profile 
      WHERE Userid = ?
    ");
    $profile->execute([ $User ]);
    $get_bank = $profile->fetch(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_bank
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

