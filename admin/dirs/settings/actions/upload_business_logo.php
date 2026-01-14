<?php
require_once "../../../../config/connection.php";
session_start();

if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];

try {
    if (!isset($_FILES['Photo']) || $_FILES['Photo']['error'] !== 0) {
        exit("No file uploaded or upload error");
    }

    // Validate file
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($_FILES['Photo']['type'], $allowed)) {
        exit("Invalid image type");
    }

    if ($_FILES['Photo']['size'] > 2097152) {
        exit("Image too large (max 2MB)");
    }

    $conn->beginTransaction();

    $rawImage = file_get_contents($_FILES['Photo']['tmp_name']);
    $base64Image = base64_encode($rawImage);

    $stmt = $conn->prepare("CALL UPLOAD_BUSINESS_LOGO (?, ?)");
    $stmt->execute([$base64Image, $User]);
    $stmt->closeCursor();

    $conn->commit();
    echo "success";

} catch (PDOException $e) {
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}
?>