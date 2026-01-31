<?php
session_start();
require_once "../config/connection.php";

$Username = $_POST['Username'];
$Password = $_POST['Password'];

try {
    $stmt = $conn->prepare("EXEC LOGIN @mUsername = ?");
    $stmt->execute([$Username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($Password, $user['Password'])) {
        $_SESSION['Uid'] = $user['Uid'];
        $_SESSION['Role'] = $user['Role'];
        echo json_encode([
            "isSuccess" => "OK",
            "Data" => $user
        ]);
    } else {
        echo json_encode([
            "isSuccess" => "Failed",
            "Message" => "Invalid username or password."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "isSuccess" => "Error",
        "Message" => $e->getMessage()
    ]);
}
