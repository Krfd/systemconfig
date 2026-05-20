<?php
require_once "../../../../config/connection.php";
session_start();

$Userid = $_SESSION['Uid'];

try {
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
