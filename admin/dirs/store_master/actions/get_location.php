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
      SELECT
      t1.Latitude,
      t1.Longitude,
      t1.Bid,
      t1.Province,
      t1.B_Code,
      t1.B_Type,
      t1.Status,
      t1.Address,
      t1.Region,
      t1.City,
      t1.Zipcode,
      t1.Email,
      t1.Phonenumber,
      t1.OpenedDate,
      t2.Franchisee,
      t2.FranchiseDate
      FROM branchinfo t1
      LEFT JOIN franchise t2 ON t1.B_Code = t2.B_Code
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

