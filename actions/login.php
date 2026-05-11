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
        $_SESSION['Role'] = $user['UserRole'];

        if ($_SESSION['Role'] === "Admin") {
            echo json_encode([
                "isSuccess" => "OK",
                "Data" => $user,
                "Role" => $_SESSION['Role'],
            ]);
        } else if ($_SESSION['Role'] === "Administrator") {
            echo json_encode([
                "isSuccess" => "OK",
                "Data" => $user,
                "Role" => $_SESSION['Role'],
            ]);
        }
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
