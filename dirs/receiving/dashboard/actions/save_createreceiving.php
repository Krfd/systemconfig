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

    /* =========================================================
           INSERT RECEIVING HEADER
        ========================================================= */
    $stmtHeader = $conn->prepare("EXEC dbo.ReceivingDelivered_items
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
    $stmtCollect = $conn->prepare("EXEC dbo.ReceivingItems_orders ?, ?, ?, ?, ?, ?");

    /* =========================================================
       GET DESIRED QTY
    ========================================================= */
    $qtyValidation = $conn->prepare("EXEC dbo.ReceivingQtyValidation ?, ?, ?");

    /* =========================================================
       INSERT SHORTAGE
    ========================================================= */
    $findings = $conn->prepare("EXEC dbo.ReceivingFindings ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?");

    foreach ($items as $item) {
        $rownum = $item['InTransitRowNum'] ?? null;
        $qty = $item['qty'] ?? 0;

        if (empty($rownum)) {
            continue;
        }

        $qtyValidation->execute([
            $User,
            $DeliveryNumber,
            $rownum
        ]);
        $validationData = $qtyValidation->fetch(PDO::FETCH_ASSOC);

        $desiredQty = $validationData['Deliver_Qty'] ?? 0;

        if ($qty < $desiredQty) {
            $difference = $desiredQty - $qty;
            $findings->execute([
                $User,
                $ReceivedCode,
                $DeliveryNumber,
                $qty,
                $difference,
                'Lacking qty received : ' .  $difference,
                'LACKING',
                'DELIVERED',
                $Driver,
                $TruckCategory,
                $TruckPlate,
                $rownum
            ]);
        } elseif ($qty > $desiredQty) {
            $difference = $qty - $desiredQty;
            $findings->execute([
                $User,
                $ReceivedCode,
                $DeliveryNumber,
                $qty,
                $difference,
                'Excess qty received : ' .  $difference,
                'EXCESS',
                'DELIVERED',
                $Driver,
                $TruckCategory,
                $TruckPlate,
                $rownum
            ]);
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

    $qtyValidation = $conn->prepare("EXEC QtyValidation ?,?,?,?,?");
    foreach ($items as $item) {
        $rownum = $item['InTransitRowNum'] ?? null;
        $qtyValidation->execute([
            $User,
            $rownum,
            $BatchNumberReceived,
            $DeliveryNumber,
            $item['serial'] ?? null
        ]);

        $result = $qtyValidation->fetch(PDO::FETCH_ASSOC);

        file_put_contents(
            "debug_result.txt",
            print_r($result, true) . PHP_EOL,
            FILE_APPEND
        );

        $qtyValidation->closeCursor();
    }


    $updateDeliveryStatus = $conn->prepare("EXEC Get_SRN ?");
    $updateDeliveryStatus->execute([$DeliveryNumber]);

    $getSRN = $updateDeliveryStatus->fetchAll(PDO::FETCH_ASSOC);

    $updateDeliveryStatus = $conn->prepare("EXEC Update_Delivery_Status ?,?");

    foreach ($getSRN as $srn) {
        $updateDeliveryStatus->execute([$srn['SR_Number'], $DeliveryNumber]);
    }

    $conn->commit();

    echo json_encode([
        "isSuccess" => 'success',
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo json_encode([
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    ]);
}
