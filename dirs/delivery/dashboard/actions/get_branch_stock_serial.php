<?php
require_once "../../../../config/connection.php";
session_start();

$User      = $_SESSION['Uid'];
$DrNUmber  = $_POST['DrNUmber'] ?? '';

$ItemSerial = $_POST['ItemSerial'] ?? '';
$ItemCode   = $_POST['ItemCode'] ?? '';

try {

    /* ==============================
       USER BRANCH
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[SESSIONUSER] ?");
    $stmt->execute([$User]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    $Branch = $userData['Branch'] ?? '';

    /* ==============================
       BRANCH CONNECTION
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[Branch_Connection_DB] ?");
    $stmt->execute([$User]);
    $connData = $stmt->fetch(PDO::FETCH_ASSOC);

    $Branch_DB  = $connData['Branch_DB'] ?? '';
    $IP_Address = $connData['IP_Address'] ?? '';

    /* ==============================
       FIND ITEM (SERIAL / ITEMCODE)
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[SEARCH_INVENTORYSERIAL_REIL] ?, ?, ?, ?, ?");
    $stmt->execute([$IP_Address, $Branch_DB, $ItemCode, $ItemSerial, $Branch]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        echo json_encode([
            "isSuccess" => "failed",
            "message"   => "Item not found."
        ]);
        exit;
    }

    $Brand    = $item['ItemBrand'];
    $ItemCode = $item['ItemCode'];
    $Model    = $item['ItemName'];
    $Category = $item['ItemGrpName'];

    /* ==============================
       VALIDATE DELIVERY ITEM
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[VALIDATION_ITM_DELIVERY] ?, ?, ?");
    $stmt->execute([$Branch, $DrNUmber, $ItemCode]);

    $count = $validation['Count'] ?? 0;

    if ($count > 0) {
        echo json_encode([
            "isSuccess" => "failed",
            "message"   => "Success."
        ]);
    } else {
        echo json_encode([
            "isSuccess" => "failed",
            "message"   => "Item doesn't exist."
        ]);
    }
    exit;
    /* ==============================
       SUCCESS RESPONSE
    ============================== */
    echo json_encode([
        "isSuccess" => "success",
        "Data" => [
            "Brand"    => $Brand,
            "ItemCode" => $ItemCode,
            "Model"    => $Model,
            "Category" => $Category
        ]
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "isSuccess" => "failed",
        "message"   => "System Error: " . $e->getMessage()
    ]);
}
?>