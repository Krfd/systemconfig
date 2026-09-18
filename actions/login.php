<?php
session_start();
require_once "../config/connection.php";

$pcName = gethostname();
$pcAddress = gethostbyname(gethostname());
$Username = $_POST['Username'];
$Password = $_POST['Password'];

try {
    $stmt = $conn->prepare("EXEC AccountLogin ?, ?, ?, ?");
    $stmt->execute([$pcName, $pcAddress, $Username, $Password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($Password, $user['Password'])) {
        $_SESSION['Uid'] = $user['Sysid'];
        $_SESSION['Role'] = $user['Role'];

        if ($_SESSION['Role'] === "SA") {
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
