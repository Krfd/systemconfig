<?php
  require_once "../../../../config/connection.php";
  session_start();

  if (!isset($_SESSION['Uid'])) {
      header('Location: ../../../../login.php');
      exit();
  }
  $User     = $_SESSION['Uid'];

try {
  $conn->beginTransaction();

    $profile = $conn->prepare("
      SELECT Bus_id, BusinessName, BusinessType, Industry, DateEstablished, OwnerName, Mission, Vision, Business_Addrss, Business_tin, Business_permit, Services, BusinessLogo,BusinessBg
      FROM  BusinessProfile
      WHERE Userid = ?
    ");
    $profile->execute([ $User ]);
    $get_bprofile = $profile->fetch(PDO::FETCH_ASSOC);

    if ($get_bprofile) {
        if (!empty($get_bprofile['BusinessLogo'])) {
            $get_bprofile['BusinessLogo'] = base64_encode($get_bprofile['BusinessLogo']);
        }
        if (!empty($get_bprofile['BusinessBg'])) {
            $get_bprofile['BusinessBg'] = base64_encode($get_bprofile['BusinessBg']);
        }
    }


  $conn->commit();

  $response = array(
    "isSuccess" => 'success',
    "Data" => $get_bprofile
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

