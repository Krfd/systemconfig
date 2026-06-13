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

    $logLines = [];

    $referenceMap = [];

    $groupedItems = [];

    // foreach ($Item_Id as $key => $itmid) {
    //     if (empty($itmid)) {
    //         continue;
    //     }

    //     $serial     = $ItemSerial[$key] ?? null;
    //     $picklist   = $PickListnumber[$key] ?? null;
    //     // $qty   = $ItemQty[$key] ?? null;
    //     $qty = (float)($ItemQty[$key] ?? 0);

    //     $branch = getBranch($conn, $itmid, $picklist);
    //     if ($branch === '') {
    //         throw new Exception("Branch not found for Item ID {$itmid} and Picklist {$picklist}");
    //     }

    //     // FOR LOGS
    //     if (!isset($groupedItems[$itmid])) {
    //         $groupedItems[$itmid] = [
    //             'ItemId' => $itmid,
    //             'TotalQty' => 0,
    //             'Branch' => $branch,
    //             'Picklists' => [],
    //             'Serials' => []
    //         ];
    //     }

    //     $groupedItems[$itmid]['TotalQty'] += $qty;

    //     if (!empty($picklist)) {
    //         $groupedItems[$itmid]['Picklists'][] = $picklist;
    //     }

    //     if (!empty($serial)) {
    //         $groupedItems[$itmid]['Serials'][] = $serial;
    //     }

    //     if (!isset($referenceMap[$branch])) {
    //         $referenceMap[$branch] = generateReference();
    //     }

    //     $referenceNumber = $referenceMap[$branch];

    //     $stmtCollect->execute([
    //         $User,
    //         $itmid,
    //         $referenceNumber,
    //         $BatchNumber,
    //         $picklist,
    //         $serial,
    //         $qty
    //         // $groupedItems[$itmid]['TotalQty']
    //     ]);
    // }

    foreach ($Item_Id as $key => $itmid) {

        if (empty($itmid)) {
            continue;
        }

        $serial   = $ItemSerial[$key] ?? null;
        $picklist = $PickListnumber[$key] ?? null;
        $qty      = (float)($ItemQty[$key] ?? 0);

        $branch = getBranch($conn, $itmid, $picklist);

        if ($branch === '') {
            throw new Exception(
                "Branch not found for Item ID {$itmid} and Picklist {$picklist}"
            );
        }

        if (!isset($groupedItems[$itmid])) {

            $groupedItems[$itmid] = [
                'ItemId'    => $itmid,
                'TotalQty'  => 0,
                'Branch'    => $branch,
                'Picklists' => [],
                'Serials'   => []
            ];
        }

        $groupedItems[$itmid]['TotalQty'] += $qty;

        if (!empty($picklist)) {
            $groupedItems[$itmid]['Picklists'][] = $picklist;
        }

        if (!empty($serial)) {
            $groupedItems[$itmid]['Serials'][] = $serial;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | EXECUTE STORED PROCEDURE ONCE PER GROUPED ITEM
    |--------------------------------------------------------------------------
    */

    foreach ($groupedItems as $item) {

        $branch = $item['Branch'];

        if (!isset($referenceMap[$branch])) {
            $referenceMap[$branch] = generateReference();
        }

        $referenceNumber = $referenceMap[$branch];

        $stmtCollect->execute([
            $User,
            $item['ItemId'],
            $referenceNumber,
            $BatchNumber,
            $item['Picklists'][0] ?? null,
            $item['Serials'][0] ?? null,
            $item['TotalQty']
        ]);
    }

    $logLines[] = "\n=== GROUPED ITEM SUMMARY ===";

    foreach ($groupedItems as $item) {

        $uniquePicklists = array_unique($item['Picklists']);
        $uniqueSerials   = array_unique($item['Serials']);

        $logLines[] =
            "Item ID: {$item['ItemId']} | " .
            "Total Qty: {$item['TotalQty']} | " .
            "Branch: {$item['Branch']} | " .
            "Picklists: " . implode(', ', $uniquePicklists) . " | " .
            "Serials: " . implode(', ', $uniqueSerials);
    }

    $fileName = "picklist_log_" . date('Ymd_His') . ".txt";
    $filePath = $fileName;
    file_put_contents($filePath, implode(PHP_EOL, $logLines));

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
