<?php
require_once "../../../../config/connection.php";
require_once "../../../../config/functions.php";

session_start();
if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];


$Businessname   = $_POST['Businessname'];
$Businesstype   = sanitize($_POST['Businesstype']);
$Industry       = sanitize($_POST['Industry']);
$Established    = sanitize($_POST['Established']);
$Owner          = sanitize($_POST['Owner']);
$BusinessAddress  = sanitize($_POST['BusinessAddress']);
$Businesstin      = sanitize($_POST['Businesstin']);
$Businesspermit   = sanitize($_POST['Businesspermit']);
$Services         = $_POST['Services'];

try {
    $conn->beginTransaction();

    $upd_profile = $conn->prepare("
        UPDATE BusinessProfile SET 
            BusinessName=?,
            BusinessType=?,
            Industry=?,
            DateEstablished = ?,
            OwnerName = ?,
            Business_Addrss = ?,
            Business_tin = ?,
            Business_permit=?,
            Services=?  WHERE Userid = ?");
    $upd_profile->execute([
        $Businessname,$Businesstype,$Industry,$Established,$Owner, $BusinessAddress, $Businesstin, $Businesspermit, $Services, $User]);

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>
    