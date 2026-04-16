<?php
require_once "../../../../config/connection.php";
session_start();

$User         = $_SESSION['Uid'];
$lbNum     = $_POST['lbNum'];

try {
  $conn->beginTransaction();

  $branch_distribution = $conn->prepare("EXEC dbo.[Product_Distribution_LoadingBasket] ?, ?");
  $branch_distribution->execute([$lbNum, $User]);

  $get_branch = $branch_distribution->fetchAll(PDO::FETCH_ASSOC);

  $unique = [];
  $seen = [];

  foreach ($get_branch as $row) {
    $key = $row['RequestingBranch'];

    if (!isset($seen[$key])) {
      $seen[$key] = true;
      $unique[] = $row;
    }
  }

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    // "Data" => $get_branch
    "Data" => $unique
  );
  echo json_encode($response);
  exit;
} catch (PDOException $e) {
  errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
  );
  echo json_encode($response);
}
