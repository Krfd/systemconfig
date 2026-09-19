<?php
require_once "../../../../config/connection.php";
session_start();

$id = $_SESSION['Uid'];
$unitId = $_POST['unitId'];
$unitName = $_POST['unitName'];
$unitAddress = $_POST['unitAddress'];
$branch = $_POST['branch'];

try {
  $conn->beginTransaction();

  $updateUnit = $conn->prepare("EXEC dbo.[UpdateServerUnit] ?, ?, ?, ?, ?");
  $updateUnit->execute([$id, $unitId, $unitName, $unitAddress, $branch]);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
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
