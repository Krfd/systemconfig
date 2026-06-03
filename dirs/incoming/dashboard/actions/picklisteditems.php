<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

  $fetch_picklistbasket = $conn->prepare("EXEC dbo.[Monitor_PickListed] ?");
  $fetch_picklistbasket->execute([$User]);
  $get_basket = $fetch_picklistbasket->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_basket
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
