<?php
require_once "../../../../config/connection.php";
require_once "../../../../config/functions.php";

session_start();
if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];
$ConfirmPassword  = hash_password($_POST['ConfirmPassword']);

try {
    $conn->beginTransaction();

    $upd_profile = $conn->prepare("
        UPDATE User SET 
            Password =? WHERE Uid = ?");
    $upd_profile->execute([
        $ConfirmPassword, $User]);

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>
    