<?php
require_once "../../../../config/connection.php";
session_start();

$Userid 		=	$_SESSION['Uid'];
$Brand 			=	$_POST['Brand'];
$Model 			=	$_POST['Model'];
$ItemNumber 	=	$_POST['ItemNumber'];
$Category 		=	$_POST['Category'];
$SRN 			=	$_POST['SRN'];
$Quantity 		=	$_POST['Quantity'];

try {

	$conn->beginTransaction();

	$ins_preorder = $conn->prepare("EXEC dbo.[STS_ITEMPREP] ?,?,?,?,?,?,?");
	$ins_preorder->execute([$Userid, $Brand, $Model, $ItemNumber, $Category, $SRN, $Quantity]);

	$conn->commit();
	echo "OK";
} catch (PDOException $e) {
	$conn->rollback();
	echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
