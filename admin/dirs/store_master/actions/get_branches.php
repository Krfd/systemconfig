<?php
  require_once "../../../../config/connection.php";

  session_start();

  if (!isset($_SESSION['Uid'])) {
      header('Location: ../../../../login.php');
      exit();
  }


try {
  $conn->beginTransaction();

    $fetch_brnches = $conn->prepare("
      SELECT DISTINCT Province AS Branch
      FROM branchinfo 
      ORDER BY Province
    ");
    $fetch_brnches->execute();
    $get_branches = $fetch_brnches->fetchAll(PDO::FETCH_ASSOC);

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

