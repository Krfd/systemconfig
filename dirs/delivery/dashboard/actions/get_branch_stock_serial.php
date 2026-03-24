<?php
require_once "../../../../config/connection.php";
session_start();


$User       = $_SESSION['Uid'] ?? '';
$DrNumber   = $_POST['DrNumber'] ?? '';
$ItemSerial = $_POST['ItemSerial'] ?? '';
$ItemCode   = $_POST['ItemCode'] ?? '';

try {

    /* ==============================
       USER BRANCH
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[SESSIONUSER] ?");
    $stmt->execute([$User]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);


    $Branch = $userData['Branch'];

    /* ==============================
       BRANCH CONNECTION
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[Branch_Connection_DB] ?");
    $stmt->execute([$Branch]);
    $connData = $stmt->fetch(PDO::FETCH_ASSOC);

    $Branch_DB  = $connData['Branch_DB'];
    $IP_Address = $connData['IP_Address'];

    /* ==============================
       FIND ITEM (SERIAL / ITEMCODE)
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[SEARCH_INVENTORYSERIAL_REIL] ?, ?, ?, ?, ?");
    $stmt->execute([$IP_Address, $Branch_DB, $ItemCode, $ItemSerial, $Branch]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (
        !$item ||
        empty($item['ItemCode']) ||
        empty($item['ItemBrand']) ||
        empty($item['ItemName']) ||
        empty($item['ItemGrpName'])
    ) {
        echo json_encode([
            "isSuccess" => "empty",
            "message"   => "Item doesn't exist."
        ]);
        exit;
    }

    /* ==============================
       VALIDATE DELIVERY ITEM (TOP 1)
    ============================== */
    $stmt = $conn->prepare("EXEC dbo.[VALIDATION_ITM_DELIVERY] ?, ?, ?");
    $stmt->execute([$Branch, $DrNumber, $item['ItemCode']]);
    $validation = $stmt->fetch(PDO::FETCH_ASSOC);


    /* ==============================
       SUCCESS RESPONSE
    ============================== */
    echo json_encode([
        "isSuccess" => "success",
        "Data" => [[
            "Brand"    => $item['ItemBrand'],
            "ItemCode" => $item['ItemCode'],
            "Model"    => $item['ItemName'],
            "Category" => $item['ItemGrpName']
        ]]
    ]);
    exit;
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "isSuccess" => "failed",
        "message"   => "System Error: " . $e->getMessage()
    ]);
    exit;
}
