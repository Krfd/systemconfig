<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['Uid'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$User = $_SESSION['Uid'];

/* ===== Collect POST ===== */
$Category    = $_POST['Category'] ?? '';
$Menu        = $_POST['Menu'] ?? '';
$MenuCode    = $_POST['MenuCode'] ?? '';
$PrepTime    = $_POST['PrepTime'] ?? '';
$Serving     = $_POST['Serving'] ?? '';
$Calories    = $_POST['Calories'] ?? '';
$Notes       = $_POST['Notes'] ?? '';
$Price       = $_POST['Price'] ?? '';
$Status      = $_POST['Status'] ?? '';
$Dinein      = $_POST['Dinein'] ?? 0;
$Takeout     = $_POST['Takeout'] ?? 0;
$Delivery    = $_POST['Delivery'] ?? 0;
$Description = $_POST['Description'] ?? '';

/* ===== Image (Base64 for JSON) ===== */
$MenuImage = null;
if (isset($_FILES['menu-img']) && $_FILES['menu-img']['error'] === 0) {
    $MenuImage = [
        "name" => $_FILES['menu-img']['name'],
        "type" => $_FILES['menu-img']['type'],
        "size" => $_FILES['menu-img']['size'],
        "data" => base64_encode(
            file_get_contents($_FILES['menu-img']['tmp_name'])
        )
    ];
}

/* ===== Draft Structure ===== */
$draftID = uniqid("menu_draft_", true);

$draftData = [
    "draft_id"    => $draftID,
    "type"        => "menu",
    "user_id"     => $User,
    "created_at"  => date("Y-m-d H:i:s"),
    "menu" => [
        "category"    => $Category,
        "name"        => $Menu,
        "code"        => $MenuCode,
        "prep_time"   => $PrepTime,
        "serving"     => $Serving,
        "calories"    => $Calories,
        "notes"       => $Notes,
        "price"       => $Price,
        "status"      => $Status,
        "dine_in"     => $Dinein,
        "takeout"     => $Takeout,
        "delivery"    => $Delivery,
        "description" => $Description,
        "image"       => $MenuImage
    ]
];

/* ===== Save JSON ===== */
$baseDir = __DIR__ . "/../drafts/user_" . $User;
if (!is_dir($baseDir)) {
    mkdir($baseDir, 0777, true);
}

$filename = "menu_draft_" . $draftID . ".json";
file_put_contents(
    $baseDir . "/" . $filename,
    json_encode($draftData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
);

/* ===== Response ===== */
echo json_encode([
    "isSuccess" => true,
    "draft_id"  => $draftID,
    "file"      => $filename
]);
