<?php
require_once "../../../../config/connection.php";
session_start();

$Uid     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

  $fetch_incoming = $conn->prepare("EXEC dbo.[INCOMING_REQ] ?");
  $fetch_incoming->execute([$Uid]);
  $get_incomingrequest = $fetch_incoming->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_incomingrequest
  );
  echo json_encode($response);
} catch (PDOException $e) {
  $conn->rollback();
  errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
  );
  echo json_encode($response);
}
