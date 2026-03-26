<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];
$Brand    = $_POST['Brand'];
$Model    = $_POST['Model'];

try {
  $conn->beginTransaction();

  $fetch_invItem = $conn->prepare("EXEC dbo.[Branch_Inv_Itm] ?,?,?");
  $fetch_invItem->execute([$User, $Brand, $Model]);
  $get_item = $fetch_invItem->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_item
  );
  echo json_encode($response);
} catch (PDOException $e) {
  errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
  );
  echo json_encode($response);
}
