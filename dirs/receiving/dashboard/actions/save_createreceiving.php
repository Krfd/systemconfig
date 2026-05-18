<?php
require_once "../../../../config/connection.php";
session_start();

$data = json_decode($_POST['receivingData'], true);

/* =========================================================
       SESSION
    ========================================================= */
$User = $_SESSION['Uid'] ?? null;

/* =========================================================
       POST VALUES
    ========================================================= */
$ReferenceNumber    = $data['ReferenceNumber'] ?? '';
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

$itemsLog = "";

foreach ($items as $index => $item) {

    $itemCode = $item['itemCode'] ?? '';
    $inTransitRowNum = $item['InTransitRowNum'] ?? '';
    $qty = $item['qty'] ?? 0;

    $itemsLog .= "
        Item #" . ($index + 1) . "
        --------------------------------
        ItemCode         : {$itemCode}
        InTransitRowNum  : {$inTransitRowNum}
        Qty              : {$qty}

        ";
}

$logData = "
ReferenceNumber : {$ReferenceNumber}
Deliverydate    : {$Deliverydate}
PostingDate     : {$PostingDate}
Driver          : {$Driver}
TruckCategory   : {$TruckCategory}
TruckPlate      : {$TruckPlate}
Remarks         : {$Remarks}
Branchorigin    : {$Branchorigin}
BranchWhscode   : {$BranchWhscode}

Items :
{$itemsLog}

======================================================
";

$filePath = "receiving_log.txt";
file_put_contents($filePath, $logData, FILE_APPEND);

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
            $stmt = $conn->prepare("
                    SELECT TOP 1 1
                    FROM ReceivedOrder_H
                    WHERE ReceivedCode = ?
                ");

            $stmt->execute([$ReceivedCode]);
        } while ($stmt->fetch());
        return $ReceivedCode;
    }

    $ReceivedCode = generateUniqueAppCode($conn);

    /* =========================================================
           COLLECT RECEIVING ITEMS
        ========================================================= */
    $stmtCollect = $conn->prepare("EXEC dbo.ReceivingItems_orders ?,?,?,?");

    foreach ($items as $item) {
        $rownum = $item['InTransitRowNum'] ?? null;
        $qty = $item['qty'] ?? 0;

        if (empty($rownum)) {
            continue;
        }

        $stmtCollect->execute([
            $User,
            $BatchNumberReceived,
            $qty,
            $rownum
        ]);
    }

    /* =========================================================
           INSERT RECEIVING HEADER
        ========================================================= */
    $stmtHeader = $conn->prepare("
            EXEC dbo.ReceivingDelivered_items
                ?,?,?,?,?,?,?,?,?,?,?,?
        ");
    $stmtHeader->execute([
        $User,
        $ReferenceNumber,
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
           COMMIT
        ========================================================= */
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
