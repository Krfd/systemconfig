<?php
require_once "../../../../config/connection.php";
session_start();

$rawData = $_POST['receivingData'] ?? '';

if (empty($rawData)) {
    echo json_encode([
        "isSuccess" => "Failed",
        "message" => "No receiving data found."
    ]);
    exit;
}

$data = json_decode($rawData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "isSuccess" => "Failed",
        "message" => "Invalid JSON data."
    ]);
    exit;
}

$User = $_SESSION['Uid'] ?? null;

/* =========================================================
       POST VALUES
    ========================================================= */
$DeliveryNumber     = $data['DeliveryNumber'] ?? '';
$Deliverydate       = $data['ReceivingDate'] ?? '';
$PostingDate        = $data['PostingDate'] ?? '';
$Driver             = $data['Driver'] ?? '';
$TruckCategory      = $data['TruckCategory'] ?? '';
$TruckPlate         = $data['TruckPlate'] ?? '';
$Remarks            = $data['Remarks'] ?? '';
$Branchorigin       = $data['Branchorigin'] ?? '';
$BranchWhscode      = $data['BranchWhscode'] ?? '';

$ReceivedQty        = $data['ReceivedQty'] ?? 0;
$items              = $data['items'] ?? [];

foreach ($items as $item) {
    $itemCode = $item['itemCode'];
    $inTransitRowNum = $item['InTransitRowNum'];
    $qty = $item['qty'];
}

try {

    $conn->beginTransaction();

    $stmtBatch = $conn->prepare("EXEC dbo.ReceivingBat_Number ?");

    $stmtBatch->execute([$User]);
    $result = $stmtBatch->fetch(PDO::FETCH_ASSOC);
    $BatchNumberReceived = $result['BatchNumberReceived'];

    $headerExists = false;

    foreach ($items as $item) {
        $validate = $conn->prepare("EXEC Draft_Validation ?,?,?,?,?,?");

        $rownum = $item['InTransitRowNum'] ?? null;
        $qty = $item['qty'] ?? 0;

        if (empty($rownum)) {
            continue;
        }

        $validate->execute([
            $User,
            $BatchNumberReceived,
            $DeliveryNumber,
            $qty,
            $rownum,
            $item['serial'] ?? null
        ]);

        $validationResult = $validate->fetch(PDO::FETCH_ASSOC);

        if (!empty($validationResult['IsValid'])) {
            $headerExists = true;
        }
    }

    /* =========================================================
           GENERATE RECEIVING BATCH NUMBER
        ========================================================= */
    $stmtBatch = $conn->prepare("EXEC dbo.ReceivingBat_Number ?");

    $stmtBatch->execute([$User]);
    $result = $stmtBatch->fetch(PDO::FETCH_ASSOC);
    $BatchNumberReceived = $result['BatchNumberReceived'];

    /* =========================================================
           GENERATE UNIQUE RECEIVED CODE
        ========================================================= */
    function generateAppCode($length = 12)
    {
        return substr(
            str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            0,
            $length
        );
    }

    function generateUniqueAppCode($conn, $length = 12)
    {
        do {
            $ReceivedCode = generateAppCode($length);

            $stmt = $conn->prepare("EXEC dbo.Generate_Unique_Appcode ?");
            $stmt->execute([$ReceivedCode]);
        } while ($stmt->fetch());
        return $ReceivedCode;
    }

    $ReceivedCode = generateUniqueAppCode($conn);

    if (!$headerExists) {
    /* =========================================================
           INSERT RECEIVING HEADER
        ========================================================= */
        $stmtHeader = $conn->prepare("EXEC dbo.Draft_Receiving_Header
                    ?,?,?,?,?,?,?,?,?,?,?,?");
        $stmtHeader->execute([
            $User,
            $DeliveryNumber,
            $BatchNumberReceived,
            $ReceivedCode,
            $Deliverydate,
            $PostingDate,
            $Driver,
            $TruckCategory,
            $TruckPlate,
            $Remarks,
            $Branchorigin,
            $BranchWhscode
        ]);
        
    /* =========================================================
        COLLECT RECEIVING ITEMS
    ========================================================= */
        $stmtCollect = $conn->prepare("EXEC dbo.Draft_Receiving_Orders ?, ?, ?, ?, ?, ?");

        foreach ($items as $item) {
            $rownum = $item['InTransitRowNum'] ?? null;
            $qty = $item['qty'] ?? 0;

            if (empty($rownum)) {
                continue;
            }

            $stmtCollect->execute([
                $User,
                $BatchNumberReceived,
                $DeliveryNumber,
                $qty,
                $rownum,
                $item['serial'] ?? null
            ]);
        }
    }

    $conn->commit();

    echo json_encode([
        "isSuccess" => 'success',
        "message" => "Draft saved successfully."
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo json_encode([
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    ]);
}
