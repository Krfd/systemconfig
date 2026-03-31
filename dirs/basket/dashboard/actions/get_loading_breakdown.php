<?php
require_once "../../../../config/connection.php";
session_start();

$User         = $_SESSION['Uid'];
$PickLst_Num       = $_POST['PickLst_Num'];

try {
  $conn->beginTransaction();

  $srn_breakdown = $conn->prepare("EXEC dbo.[LOADING_BREAKDOWN_SRN_ITEMS] ?, ?");
  $srn_breakdown->execute([$User, $PickLst_Num]);
  $get_srn = $srn_breakdown->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_srn
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
