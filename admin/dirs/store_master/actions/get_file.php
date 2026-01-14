<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['Uid'])) {
    echo json_encode(["isSuccess" => "failed", "message" => "Unauthorized"]);
    exit;
}

$User = $_SESSION['Uid'];

if (empty($_POST['draft_file'])) {
    echo json_encode(["isSuccess" => "error", "message" => "Draft file required"]);
    exit;
}

$draftFile = basename($_POST['draft_file']);
$draftDir  = realpath(__DIR__ . "/../drafts/user_" . $User);
$draftPath = realpath($draftDir . "/" . $draftFile);

if (!$draftPath || strpos($draftPath, $draftDir) !== 0) {
    echo json_encode(["isSuccess" => "error", "message" => "Invalid draft path"]);
    exit;
}

if (!file_exists($draftPath)) {
    echo json_encode(["isSuccess" => "error", "message" => "Draft not found"]);
    exit;
}

$data = json_decode(file_get_contents($draftPath), true);

echo json_encode([
    "isSuccess" => "success",
    "Data"      => $data
]);
?>