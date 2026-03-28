<?php
require_once "../../../../config/connection.php";
session_start();

$User 		=	$_SESSION['Uid'];
$ItemNum	=	$_POST['ItemNum'];

try {

	$conn->beginTransaction();

	$add_qty = $conn->prepare("EXEC dbo.[ADD_PREP_QTY] ?, ?");
	$add_qty->execute([$User, $ItemNum]);

	$conn->commit();
	$response = array(
		"isSuccess" => "success",
		"Data" => "ok"
	);

	echo json_encode($response);
} catch (PDOException $e) {
	$conn->rollback();
	errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
	echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
