<?php
require_once "../../../../config/connection.php";
session_start();

$Userid 		=	$_SESSION['Uid'];
$Brand 			=	$_POST['Brand'];
$Model 			=	$_POST['Model'];
$ItemNumber 	=	$_POST['ItemNumber'];
$Category 		=	$_POST['Category'];
$Quantity 		=	$_POST['Quantity'];

try {

	$conn->beginTransaction();

	$ins_preorder = $conn->prepare("EXEC dbo.[Create_Stock_Temp_Request] ?,?,?,?,?,?");
	$ins_preorder->execute([$Userid,$ItemNumber,$Model,$Brand,$Category,$Quantity]);

	$conn->commit();
	echo "OK";
} catch (PDOException $e) {
	$conn->rollback();
	echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
