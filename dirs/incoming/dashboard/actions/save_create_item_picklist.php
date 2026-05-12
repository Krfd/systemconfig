<?php
require_once "../../../../config/connection.php";
session_start();

$User       = $_SESSION['Uid'];
$DocEntries = $_POST['docEntries'] ?? [];

try {

    if (!is_array($DocEntries) || empty($DocEntries)) {
        throw new Exception('No items received.');
    }

    $conn->beginTransaction();

    $checkDup = $conn->prepare("SELECT COUNT(*) 
        FROM Pick_List_Item_Collection 
        WHERE ItemRowNum = ?");

    foreach ($DocEntries as $DocEntry) {
        $checkDup->execute([$DocEntry]);

        if ($checkDup->fetchColumn() > 0) {
            throw new Exception("DocEntry $DocEntry already exists in PickList.");
        }
    }

    $stmt = $conn->prepare("EXEC dbo.[PickList_Num_Generator] ?");
    $stmt->execute([$User]);
    $PicklistNumber = $stmt->fetch(PDO::FETCH_ASSOC)['PicklistNumber'];

    if (!$PicklistNumber) {
        throw new Exception("Failed to generate PickList number.");
    }

    $insHeader = $conn->prepare("EXEC dbo.[CreatePickList_Header] ?,?");
    $insHeader->execute([$User, $PicklistNumber]);

    $result = $insHeader->fetch(PDO::FETCH_ASSOC);

    $docEntry = $result['DocEntry'];

    $fetchItems = $conn->prepare("EXEC dbo.[Review_StockRequest_Items] ?");

    $insertItem = $conn->prepare("EXEC dbo.[Collect_StockRequest_Items] ?,?,?,?,?,?,?,?,?,?");

    $updateStatus = $conn->prepare("UPDATE Stock_Transfer_Header_1 
        SET RequestStatus = 'Processing'
        WHERE SR_Number = ?");

    foreach ($DocEntries as $DocEntry) {

        $fetchItems->execute([$DocEntry]);
        $items = $fetchItems->fetchAll(PDO::FETCH_ASSOC);

        if (empty($items)) {
            throw new Exception("No items found for DocEntry $DocEntry.");
        }

        foreach ($items as $row) {

            $insertItem->execute([
                $User,
                $PicklistNumber,
                $row['SR_Number'],
                $row['DocEntry'],
                $row['BranchOrigin'],
                $row['ItemCode'],
                $row['ItemName'],
                $row['ItemBrand'],
                $row['ItemCategory'],
                $row['Request_Qty']
            ]);

            $updateStatus->execute([$row['SR_Number']]);
        }
    }

    $ins_countpicklist = $conn->prepare("EXEC dbo.[UpdatePicklist_Header] ?, ?");
    $ins_countpicklist->execute([$User, $PicklistNumber]);

    $conn->commit();

    echo json_encode([
        "isSuccess" => "success",
        "PickListNumber" => $PicklistNumber,
        "DocEntry" => $docEntry,
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo json_encode([
        "isSuccess" => "failed",
        "message" => $e->getMessage()
    ]);
}
