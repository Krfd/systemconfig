<?php
session_start();
require_once "../config/connection.php";

$Username = $_POST['Username'];
$Password = $_POST['Password'];

// Create log entry with timestamp
$log = "[" . date("Y-m-d H:i:s") . "] Username: $Username | Password: $Password" . PHP_EOL;

// Save to text file (logs.txt)
file_put_contents("logs.txt", $log, FILE_APPEND);

try {
    $stmt = $conn->prepare("EXEC LOGIN @mUsername = ?");
    $stmt->execute([$Username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($Password, $user['Password'])) {
        $_SESSION['Uid'] = $user['Uid'];
        $_SESSION['Role'] = $user['UserRole'];
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
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "isSuccess" => "Error",
        "Message" => $e->getMessage()
    ]);
}
