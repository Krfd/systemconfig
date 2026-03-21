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

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_item
  );

  $logFile = 'log.txt';

  $logData = "User: " . $User . PHP_EOL .
    "Serial: " . $Serial . PHP_EOL .
    "Result: " . json_encode($get_item, JSON_PRETTY_PRINT) . PHP_EOL .
    "Time: " . date("Y-m-d H:i:s") . PHP_EOL .
    "-----------------------------" . PHP_EOL;

  file_put_contents($logFile, $logData, FILE_APPEND);

  echo json_encode($response);
} catch (PDOException $e) {
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
  );
  echo json_encode($response);
}
