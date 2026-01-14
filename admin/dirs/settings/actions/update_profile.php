<?php
require_once "../../../../config/connection.php";
require_once "../../../../config/functions.php";

session_start();
if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];


$Fullname       = sanitize($_POST['Fullname']);
$Position       = sanitize($_POST['Position']);
$Address        = sanitize($_POST['Address']);
$Contactnumber  = sanitize($_POST['Contactnumber']);
$Email          = sanitize($_POST['Email']);
$Fbpage         = sanitize($_POST['Fbpage']);
$Website        = sanitize($_POST['Website']);
$Viber          = sanitize($_POST['Viber']);
$Birthday       = sanitize($_POST['Birthday']);

try {
    $conn->beginTransaction();

    $upd_profile = $conn->prepare("
        UPDATE Profile SET 
            Fullname=?,
            Position=?,
            ContactNumber=?,
            Email = ?,
            Fb = ?,
            Website = ?,
            Viber = ?,
            HomeAddrss=?,
            Birthday=?  WHERE Userid = ?");
    $upd_profile->execute([
        $Fullname,$Position,$Contactnumber,$Email,$Fbpage, $Website, $Viber, $Address, $Birthday, $User]);

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>
    