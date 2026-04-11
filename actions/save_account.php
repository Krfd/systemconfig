<?php
require_once "../config/connection.php";

$Username     = $_POST['Username'];
$Password     = $_POST['Password'];
$Role         = $_POST['Role'];
$hashedPassword = password_hash($Password, PASSWORD_DEFAULT);

try {

	$conn->beginTransaction();

	$ins_acc_online = $conn->prepare("INSERT INTO UserAccounts (Username, Password, UserRole)
        VALUES(?,?,?)");
	$ins_acc_online->execute([$Username, $hashedPassword, $Role]);

	$conn->commit();
	echo "OK";
} catch (PDOException $e) {
	$conn->rollback();
	echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
