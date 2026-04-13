<?php
require_once "../../../../config/connection.php";
session_start();


$User   = $_SESSION['Uid'];
$ItemNum = $_POST['ItemNum'];

try {
    $conn->beginTransaction();

    $upd_reduceqty = $conn->prepare("EXEC dbo.[Reduce_temprequest_qty] ? ,?");
    $upd_reduceqty->execute([$User, $ItemNum]);

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>
    