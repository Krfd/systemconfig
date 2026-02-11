<?php
	require_once "../config/connection.php";
	require_once "../config/functions.php";

	$Username 	=	$_POST['Username'];
	$Role 		=	$_POST['Role'];
	$Password   =	hash_password($_POST['Password']);
	
	try{

		$conn->beginTransaction();

		$ins_account = $conn->prepare("INSERT INTO accounts
			(Username, Role, Password
				)VALUES(?,?,?)");
		$ins_account->execute([$Username,$Role, $Password]);
		
		$conn->commit();
		echo "OK";

	}catch(PDOException $e){
		$conn->rollback();
		echo "<b>Warning. Please Contact System Developer.<br/></b>".$e->getMessage();
	}


?>
 