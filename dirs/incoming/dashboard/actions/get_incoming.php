<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

  $fetch_incoming = $conn->prepare("EXEC dbo.[Monitor_Incoming_StockRequest_List] ?");
  $fetch_incoming->execute([$User]);
  $get_incomingrequest = $fetch_incoming->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_incomingrequest
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
