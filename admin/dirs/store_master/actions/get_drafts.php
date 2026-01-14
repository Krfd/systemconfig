<?php
require_once "../../../../config/connection.php";
session_start();

if (!isset($_SESSION['Uid'])) {
    echo json_encode(["isSuccess" => "failed", "Data" => "Unauthorized"]);
    exit();
}

$User = $_SESSION['Uid'];
$draftDir = "../drafts/user_" . $User;

$drafts = [];

if (is_dir($draftDir)) {
    foreach (glob($draftDir . "/*.json") as $file) {
        $content = json_decode(file_get_contents($file), true);

        $drafts[] = [
            "file"     => basename($file),
            "title"    => $content['draft_title'] ?? 'Untitled Draft',
            "datetime" => $content['created_at'] ?? ''
        ];
    }
}

echo json_encode([
    "isSuccess" => "success",
    "Data" => $drafts
]);
?>