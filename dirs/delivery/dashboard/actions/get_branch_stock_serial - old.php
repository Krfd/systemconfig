<?php
require_once "../../../../config/connection.php";
session_start();
$User     = $_SESSION['Uid'];
$Serial = trim($_POST['Serial']);

try {
  $conn->beginTransaction();

  $find_item_serial = $conn->prepare("EXEC dbo.[SEARCH_Serial_Delivery] ?, ?");
  $find_item_serial->execute([$User, $Serial]);
  $get_item = $find_item_serial->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  if (empty($get_item)) {
    $response = array(
      "isSuccess" => 'empty',
      "Data" => []
    );
  } else {
    $response = array(
      "isSuccess" => 'success',
      "Data" => $get_item
    );
  }

  echo json_encode($response);
  exit;
} catch (PDOException $e) {
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
  );
  echo json_encode($response);
}
