<?php
require_once "../../../../config/connection.php";
session_start();

register_shutdown_function(function () use ($conn) {

    $error = error_get_last();

    if (!$error) {
        return;
    }

    if (
        // $error['type'] === E_ERROR &&
        isset($error['message']) &&
        str_contains($error['message'], 'Maximum execution time')
    ) {

        if ($conn && $conn->inTransaction()) {
            $conn->rollBack();
        }

        echo json_encode([
            'isSuccess' => false,
            'errorType' => 'timeout',
            'message' => 'Request timed out after 120 seconds.'
        ]);
    }
});

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

    $stmtCollect = $conn->prepare("EXEC dbo.CreatePicklist_V2 ?,?,?,?,?,?,?,?");
    $stmtSupply = $conn->prepare("INSERT INTO Loading_Basket_Item_Total  (
        batch,
        Item_id,
        TotalLoadedQty,
        OriginalLoadedQty
    )
    VALUES (?, ?, ?, ?)
    ");

    $inTransitItems = $conn->prepare("EXEC InsertInTransit_Items ?, ?, ?, ?, ?");

    $referenceMap = [];
    $groupedItems = [];
    $updatedRecords = [];
    // $executedOnce = false;

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
    }

    foreach ($groupedItems as $item) {
        $stmtSupply->execute([
            $BatchNumber,
            $item['ItemId'],
            $item['TotalQty'],
            $item['TotalQty']
        ]);
    }

    foreach ($Item_Id as $key => $itmid) {
        if (empty($itmid)) {
            continue;
        }

        $serial     = $ItemSerial[$key] ?? null;
        $picklist   = $PickListnumber[$key] ?? null;
        $qty   = $ItemQty[$key] ?? null;

        // $branch = getBranch($conn, $itmid, $picklist);
        $branch = trim(getBranch($conn, $itmid, $picklist));
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

        $getToDeliverCollection = $conn->prepare("SELECT ToDeliver_Qty
            FROM Pick_List_Item_Collection
            WHERE ItemRowNum = ? AND PKList_Number = ? AND Req_Branch = ?
        ");
        $getToDeliverCollection->execute([$itmid, $picklist, $branch]);

        $collectionQty = (float)$getToDeliverCollection->fetchColumn();

        $allocatedQty = $collectionQty;

        if (!isset($groupedItems[$itmid])) {
            $groupedItems[$itmid] = [
                'ItemId' => $itmid,
                'TotalQty' => 0,
                'Branch' => $branch,
                'Picklists' => [],
                'Serials' => []
            ];
        }

        if (!isset($groupedItems[$itmid])) {
            $groupedItems[$itmid] = [
                'ItemId' => $itmid,
                'TotalQty' => 0,
                'Branch' => $branch,
                'Picklists' => [],
                'Serials' => []
            ];
        }

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

        $totalQty = $groupedItems[$itmid]['TotalQty'];

        $recordKey = trim($itmid) . '|' . trim($picklist) . '|' . trim($branch);

        if (isset($updatedRecords[$recordKey])) {
            continue;
        }

        $updatedRecords[$recordKey] = true;

        $stmtCollect->execute([
            $User,
            $itmid,
            $referenceNumber,
            $BatchNumber,
            $picklist,
            $serial,
            $allocatedQty,
            $totalQty
        ]);
    }

    $remainingQtyMap = [];

    foreach ($groupedItems as $itemId => $itemData) {
        $remainingQtyMap[$itemId] = $itemData['TotalQty'];
    }

    $processedItemCodes = [];

    foreach ($Item_Id as $key => $itmid) {

        if (empty($itmid)) {
            continue;
        }

        // Get ItemCode from collection
        $getItemCode = $conn->prepare("SELECT TOP 1 Req_ItemCode
            FROM Pick_List_Item_Collection
            WHERE ItemRowNum = ?
        ");

        $getItemCode->execute([
            $itmid
        ]);

        $itemCode = $getItemCode->fetchColumn();

        if (empty($itemCode)) {
            continue;
        }


        // Process same ItemCode once only
        if (isset($processedItemCodes[$itemCode])) {
            continue;
        }

        $processedItemCodes[$itemCode] = true;


        // Get total loaded qty from collection
        $getLoaded = $conn->prepare("SELECT TOP 1 
            TotalLoadedQty
            FROM Pick_List_Item_Collection
            WHERE Batch = ?
            AND Req_ItemCode = ?
            ORDER BY ItemRowNum
        ");

        $getLoaded->execute([
            $BatchNumber,
            $itemCode
        ]);

        $remainingLoaded = (float)$getLoaded->fetchColumn();


        // Get all rows for this batch + item code
        $getCollectionRows = $conn->prepare("SELECT 
                ItemRowNum,
                PKList_Number,
                ToDeliver_Qty
            FROM Pick_List_Item_Collection
            WHERE Batch = ?
            AND Req_ItemCode = ?
            ORDER BY ItemRowNum
        ");

        $getCollectionRows->execute([
            $BatchNumber,
            $itemCode
        ]);

        $rows = $getCollectionRows->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $row) {
            $toDeliver = (float)$row['ToDeliver_Qty'];

            if ($remainingLoaded >= $toDeliver) {

                $remainingLoaded -= $toDeliver;

                $column = 'TotalLoadedQty';
                $value  = $remainingLoaded;
            } else {

                $column = 'ToDeliver_Qty';
                $value  = $remainingLoaded;

                $remainingLoaded = 0;
            }

            $update = $conn->prepare("UPDATE Pick_List_Item_Collection
                SET {$column} = ?
                WHERE ItemRowNum = ?
                AND PKList_Number = ?
            ");

            $update->execute([
                $value,
                $row['ItemRowNum'],
                $row['PKList_Number']
            ]);
        }
    }

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
    // } catch (Exception $e) {
} catch (Throwable $e) {
    errorHandler(
        E_WARNING,
        $e->getMessage(),
        $e->getFile(),
        $e->getLine()
    );

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        'isSuccess' => false,
        'errorType' => 'server',
        'message' => $e->getMessage()
    ]);
}
