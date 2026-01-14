<?php
  require_once "../../../../config/connection.php";
  require_once "../../../../config/functions.php";

  session_start();

  if (!isset($_SESSION['Uid'])) {
      header('Location: ../../../../login.php');
      exit();
  }

  $User = $_SESSION['Uid'];


try {
  $conn->beginTransaction();

    // Branch Code Series numbering
    $ftch_bcode = $conn->prepare("
      SELECT B_Code
      FROM branchinfo
      ORDER BY Bid DESC 
    ");
    $ftch_bcode->execute();
    $get_branch = $ftch_bcode->fetch(PDO::FETCH_ASSOC);

    // Branch Code Acronym
    $ftch_acronym = $conn->prepare("
        SELECT DISTINCT UPPER(LEFT(B_Code, LENGTH(B_Code) - 3)) AS Acronym
        FROM branchinfo
        WHERE B_Code IS NOT NULL
        ORDER BY Acronym ASC
    ");
    $ftch_acronym->execute();
    $get_acronym = $ftch_acronym->fetchAll(PDO::FETCH_COLUMN);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_branch,
    "Acronyms"  => $get_acronym
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

