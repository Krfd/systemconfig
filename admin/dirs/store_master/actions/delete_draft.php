<?php
require_once "../../../../config/connection.php";
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['Uid'])) {
    echo json_encode([
        "isSuccess" => "failed",
        "message"   => "Unauthorized"
    ]);
    exit;
}

$User = $_SESSION['Uid'];

$response = [
    "isSuccess" => "error",
    "message"   => "Unknown error"
];

// 1. Validate input
if (empty($_POST['draft_file'])) {
    $response['message'] = "Draft file not specified.";
    echo json_encode($response);
    exit;
}

// 2. Sanitize filename
$draftFile = basename($_POST['draft_file']);

// 3. User draft directory
$draftDir = realpath(__DIR__ . "/../drafts/user_" . $User);

if (!$draftDir) {
    $response['message'] = "Draft directory not found.";
    echo json_encode($response);
    exit;
}

// 4. Resolve full path
$draftPath = realpath($draftDir . "/" . $draftFile);

// 5. Validate path ownership
if (!$draftPath || strpos($draftPath, $draftDir) !== 0) {
    $response['message'] = "Invalid draft path.";
    echo json_encode($response);
    exit;
}

// 6. Check existence
if (!file_exists($draftPath)) {
    $response['message'] = "Draft not found.";
    echo json_encode($response);
    exit;
}

// 7. Delete
if (unlink($draftPath)) {
    echo json_encode([
        "isSuccess" => "success",
        "message"   => "Draft deleted successfully."
    ]);
} else {
    echo json_encode([
        "isSuccess" => "error",
        "message"   => "Failed to delete draft."
    ]);
}
?>