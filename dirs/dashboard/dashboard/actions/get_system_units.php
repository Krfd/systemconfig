<?php
require_once "../../../../config/connection.php";
session_start();

try {
  $conn->beginTransaction();

  $systemUnits = $conn->prepare("EXEC dbo.[GetSystemUnits]");
  $systemUnits->execute();
  $get_systemUnits = $systemUnits->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_systemUnits
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
