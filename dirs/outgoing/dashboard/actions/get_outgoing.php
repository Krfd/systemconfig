<?php
require_once "../../../../config/connection.php";

session_start();
header('Content-Type: application/json');
$Userid       = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

  $fetch_ongoing = $conn->prepare("EXEC dbo.[OUTGOING] ?");
  $fetch_ongoing->execute([$Userid]);
  $get_ongoing = $fetch_ongoing->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_ongoing
  );
  echo json_encode($response);
} catch (PDOException $e) {
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
  );
  echo json_encode($response);
}
