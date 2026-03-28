<?php
require_once "../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

try {

	$conn->beginTransaction();

	$ins_logs = $conn->prepare("EXEC dbo.[Login_Record_Log] ?");
	$ins_logs->execute([$User]);

	$conn->commit();
	echo "OK";
} catch (PDOException $e) {
	$conn->rollback();
	echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
