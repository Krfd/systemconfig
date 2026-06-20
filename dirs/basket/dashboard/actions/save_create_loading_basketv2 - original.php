<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'] ?? null;
$Eta                = $_POST['Eta'] ?? [];
$Item_Id            = $_POST['Item_Id'] ?? [];
$ItemSerial         = $_POST['ItemSerial'] ?? [];
$PickListnumber     = $_POST['PickListnumber'] ?? [];
$ItemQty            = $_POST['ItemQty'] ?? [];
$DeliveryDate       = $_POST['DeliveryDate'] ?? '';
$PrepBy             = $_POST['PrepBy'] ?? '';
$Driver             = $_POST['Driver'] ?? '';
$TruckCat           = $_POST['TruckCat'] ?? '';
$Plate              = $_POST['Plate'] ?? '';
$Remarks            = $_POST['Remarks'] ?? '';

try {
    $conn->beginTransaction();

    $stmtBatch = $conn->prepare("EXEC dbo.BatchNumber_Auto_Generate ?");
    $stmtBatch->execute([$User]);
    $result = $stmtBatch->fetch(PDO::FETCH_ASSOC);

    function generateReference($length = 6)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $reference = '';

        for ($i = 0; $i < $length; $i++) {
            $reference .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $reference;
    }

    $fetch_drnumber = $conn->prepare("EXEC dbo.[DeliveryNumber_Auto_Generate] ?");
    $fetch_drnumber->execute([$User]);
    $get_inclsioncode = $fetch_drnumber->fetch(PDO::FETCH_ASSOC);
    $DRNumber = $get_inclsioncode['DRNumber'];

    if (!$result || empty($result['BatchNumber'])) {
        throw new Exception("Failed to generate batch number.");
    }

    function getBranch($conn, $itemId, $picklist)
    {
        $stmt = $conn->prepare("EXEC dbo.[Get_Branch] ?, ?");
        $stmt->execute([$itemId,  $picklist]);
        $branch = $stmt->fetchColumn();
        return trim((string)$branch);
    }

    $BatchNumber = $result['BatchNumber'];

    $stmtCollect = $conn->prepare("EXEC dbo.CreatePicklist_V2 ?,?,?,?,?,?,?");
    $stmtSupply = $conn->prepare("INSERT INTO Loading_Basket_Item_Total  (
        batch,
        Item_id,
        TotalLoadedQty,
        OriginalLoadedQty
    )
    VALUES (?, ?, ?, ?)
    ");

    $inTransitItems = $conn->prepare("EXEC InsertInTransit_Items ?, ?, ?, ?, ?");

    // $logLines = [];
    $referenceMap = [];
    $groupedItems = [];

    // $logLines[] = "=== GROUPED ITEM SUMMARY ===";
    // $logLines[] = "Generated: " . date('Y-m-d H:i:s');
    // $logLines[] = "";

    foreach ($Item_Id as $key => $itmid) {

        $qty   = $ItemQty[$key] ?? null;

        if (!isset($groupedItems[$itmid])) {
            $groupedItems[$itmid] = [
                'ItemId' => $itmid,
                'TotalQty' => 0,
                'Branch' => null,
                'Picklists' => [],
                'Serials' => []
            ];
        }
        $groupedItems[$itmid]['TotalQty'] += (float)$qty;

        // if (!empty($picklist)) {
        //     $groupedItems[$itmid]['Picklists'][] = $picklist;
        // }

        // if (!empty($serial)) {
        //     $groupedItems[$itmid]['Serials'][] = $serial;
        // }
    }

    foreach ($groupedItems as $item) {
        $stmtSupply->execute([
            $BatchNumber,
            $item['ItemId'],
            $item['TotalQty'],
            $item['TotalQty']
        ]);
    }

    // $updatedRecords = [];
    $loadedQtyMap = [];

    $getTotals = $conn->prepare("SELECT Item_id, TotalLoadedQty
    FROM Loading_Basket_Item_Total
    WHERE batch = ?");
    $getTotals->execute([$BatchNumber]);

    while ($row = $getTotals->fetch(PDO::FETCH_ASSOC)) {
        $loadedQtyMap[$row['Item_id']] = (float)$row['TotalLoadedQty'];
    }

    // $consumedQtyMap = [];
    foreach ($loadedQtyMap as $itemId => $qty) {
        $remainingQtyMap[$itemId] = $qty;
    }

    foreach ($Item_Id as $key => $itmid) {
        if (empty($itmid)) {
            continue;
        }

        $serial     = $ItemSerial[$key] ?? null;
        $picklist   = $PickListnumber[$key] ?? null;
        $qty   = $ItemQty[$key] ?? null;

        $branch = getBranch($conn, $itmid, $picklist);
        $groupedItems[$itmid]['Branch'] = $branch;
        if ($branch === '') {
            throw new Exception("Branch not found for Item ID {$itmid} and Picklist {$picklist}");
        }

        $inTransitItems->execute([
            $BatchNumber, 
            $picklist, 
            $serial, 
            $itmid,
            $qty
        ]);

        // $recordKey = $itmid . '|' . $picklist . '|' . $branch . "|" . $serial;

        // if (isset($updatedRecords[$recordKey])) {
        //     continue;
        // }

        // $updatedRecords[$recordKey] = true;

        // if (!isset($consumedQtyMap[$itmid])) {
        //     $consumedQtyMap[$itmid] = 0;
        // }

        // $totalAvailable = $loadedQtyMap[$itmid] ?? 0;
        // $remainingAvailable = $totalAvailable - $consumedQtyMap[$itmid];
        $remainingAvailable = $loadedQtyMap[$itmid];

        if ($remainingAvailable <= 0) {
            $logLines[] =
                "SKIPPED => " .
                "Item={$itmid} | " .
                "Serial={$serial} | " .
                "Remaining={$remainingAvailable}";
            continue;
        }

        $getToDeliverCollection = $conn->prepare("SELECT ToDeliver_Qty
            FROM Pick_List_Item_Collection
            WHERE ItemRowNum = ? AND PKList_Number = ? AND Req_Branch = ?
        ");
        $getToDeliverCollection->execute([$itmid, $picklist, $branch]);

        $collectionQty = (float)$getToDeliverCollection->fetchColumn();

        $allocatedQty = min($remainingAvailable, $collectionQty);

        // $consumedQtyMap[$itmid] += $allocatedQty;

        if (!isset($groupedItems[$itmid])) {
            $groupedItems[$itmid] = [
                'ItemId' => $itmid,
                'TotalQty' => 0,
                'Branch' => $branch,
                'Picklists' => [],
                'Serials' => []
            ];
        }

        $groupedItems[$itmid]['TotalQty'] += (float)$qty;

        if (!isset($groupedItems[$itmid])) {
            $groupedItems[$itmid] = [
                'ItemId' => $itmid,
                'TotalQty' => 0,
                'Branch' => $branch,
                'Picklists' => [],
                'Serials' => []
            ];
        }

        $groupedItems[$itmid]['TotalQty'] += (float)$qty;

        if (!empty($picklist)) {
            $groupedItems[$itmid]['Picklists'][] = $picklist;
        }

        if (!empty($serial)) {
            $groupedItems[$itmid]['Serials'][] = $serial;
        }

        if (!isset($referenceMap[$branch])) {
            $referenceMap[$branch] = generateReference();
        }

        $referenceNumber = $referenceMap[$branch];

        $getToDeliver = $conn->prepare("SELECT TotalLoadedQty 
        FROM Loading_Basket_Item_Total WHERE batch = ? AND Item_id = ?");
        $getToDeliver->execute([$BatchNumber, $itmid]);

        $totalLoadedQty = $getToDeliver->fetchColumn();

        $getToDeliverCollection = $conn->prepare("SELECT ToDeliver_Qty 
        FROM Pick_List_Item_Collection WHERE ItemRowNum = ? AND PKList_Number = ? AND Req_Branch = ?");
        $getToDeliverCollection->execute([$itmid, $picklist, $branch]);

        $collectionQty = $getToDeliverCollection->fetchColumn();

        // UPDATE COLLECTION WITH ALLOCATED QTY
        $updateCollection = $conn->prepare("UPDATE Pick_List_Item_Collection
            SET ToDeliver_Qty = ?
            WHERE ItemRowNum = ?
            AND PKList_Number = ?
            AND Req_Branch = ?
        ");

        $updateCollection->execute([
            $allocatedQty,
            $itmid,
            $picklist,
            $branch
        ]);

        // DECREASE BASKET REMAINING QTY
        $newRemainingQty = $totalLoadedQty - $allocatedQty;

        if ($newRemainingQty < 0) {
            $newRemainingQty = 0;
        }

        $updateTotalLoadedQty = $conn->prepare("UPDATE Loading_Basket_Item_Total
            SET TotalLoadedQty = ?
            WHERE batch = ?
            AND Item_id = ?
        ");

        $updateTotalLoadedQty->execute([
            $newRemainingQty,
            // $allocatedQty,
            $BatchNumber,
            $itmid
        ]);

        $loadedQtyMap[$itmid] = $newRemainingQty;

        // $logLines[] =
        //     "EXECUTE => Item={$itmid} | Serial={$serial} | Qty={$allocatedQty}";

        $stmtCollect->execute([
            $User,
            $itmid,
            $referenceNumber,
            $BatchNumber,
            $picklist,
            $serial,
            $allocatedQty
        ]);
    }

    // foreach ($groupedItems as $item) {

    //     $uniquePicklists = array_unique($item['Picklists']);
    //     $uniqueSerials   = array_unique($item['Serials']);

    //     $logLines[] = "Item ID    : {$item['ItemId']}";
    //     $logLines[] = "Total Qty  : {$item['TotalQty']}";
    //     $logLines[] = "Branch     : {$item['Branch']}";
    //     $logLines[] = "Picklists  : " . (!empty($uniquePicklists)
    //         ? implode(', ', $uniquePicklists)
    //         : 'NONE');

    //     $logLines[] = "Serials    : " . (!empty($uniqueSerials)
    //         ? implode(', ', $uniqueSerials)
    //         : 'NONE');

    //     $logLines[] = str_repeat("-", 60);
    // }

    // $fileName = "grouped_items_" . date('Ymd_His') . ".txt";

    // file_put_contents(
    //     $fileName,
    //     implode(PHP_EOL, $logLines)
    // );

    // $logLines[] = "\n=== GROUPED ITEM SUMMARY ===";

    // foreach ($groupedItems as $item) {

    //     $uniquePicklists = array_unique($item['Picklists']);
    //     $uniqueSerials   = array_unique($item['Serials']);

    //     $logLines[] =
    //         "Item ID: {$item['ItemId']} | " .
    //         "Total Qty: {$item['TotalQty']} | " .
    //         "Branch: {$item['Branch']} | " .
    //         "Picklists: " . implode(', ', $uniquePicklists) . " | " .
    //         "Serials: " . implode(', ', $uniqueSerials);
    // }

    // $fileName = "picklist_log_" . date('Ymd_His') . ".txt";
    // $filePath = $fileName;
    // file_put_contents($filePath, implode(PHP_EOL, $logLines));

    $stmtHeader = $conn->prepare("EXEC dbo.CreateLoadingBasket_headerV2 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?");

    $stmtHeader->execute([
        $User,
        $Eta,
        $BatchNumber,
        $DRNumber,
        $DeliveryDate,
        $PrepBy,
        $Driver,
        $TruckCat,
        $Plate,
        $Remarks
    ]);

    $conn->commit();

    echo json_encode([
        "isSuccess" => "success"
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.</b><br>";
    echo $e->getMessage();
}