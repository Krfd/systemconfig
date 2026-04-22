<?php
require_once "../../../../config/connection.php";
require_once "../../../../config/functions.php";
session_start();

$User =   $_SESSION['Uid'];

$Username =  $_POST['Username'];
$Password =  hash_password($_POST['Password']);
$UserRole  =  $_POST['UserRole'];
$Fullname  =  $_POST['Fullname'];
$User_Position =  $_POST['User_Position'];
$Branch  =  $_POST['Branch'];


try {

    $conn->beginTransaction();

    $usercode = $conn->prepare("EXEC dbo.[User_Generator_code]");
    $usercode->execute();
    $usercode_row = $usercode->fetchAll(PDO::FETCH_ASSOC);
    $UserCode   = $usercode_row['UserCode'];


    $ins_useraccount = $conn->prepare("EXEC dbo.[Create_System_Account] ?,?,?,?,?,?,?,?");
    $ins_useraccount->execute([$User, $Username, $Password, $UserRole, $Fullname, $User_Position, $Branch, $UserCode]);

    $conn->commit();
    echo "OK";
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
