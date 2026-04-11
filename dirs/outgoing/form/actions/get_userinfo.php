<?php
require_once "../../../../config/connection.php";
session_start();

$Userid = $_SESSION['Uid'];


try {
  $conn->beginTransaction();

  $fetch_userinfo = $conn->prepare("SELECT Branch, BranchCode, Fullname FROM UserAccounts WHERE Uid = ?");
  $fetch_userinfo->execute([$Userid]);
  $get_user = $fetch_userinfo->fetch(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_user
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
