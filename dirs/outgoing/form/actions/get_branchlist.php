<?php
  require_once "../../../../config/connection.php";


try {
  $conn->beginTransaction();

    $fetch_branchlist = $conn->prepare("EXEC dbo.[IAP_BRANCHLIST]");
    $fetch_branchlist->execute();
    $get_branches = $fetch_branchlist->fetchAll(PDO::FETCH_ASSOC);

  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_branches
  );
  echo json_encode($response);

}catch (PDOException $e){
  $conn->rollback();
  $response = array(
    "isSuccess" => 'Failed',
    "Data" => "<b>Error. Please Contact System Developer. <br/></b>".$e->getMessage()
  );
  echo json_encode($response);
}
?>