<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];
$DocEntries = $_POST['docEntries'] ?? [];

try {

    // $DocEntries = $_POST['docEntries'] ?? [];

if (!is_array($DocEntries) || empty($DocEntries)) {
    throw new Exception('No items received.');
}

$conn->beginTransaction();

foreach ($DocEntries as $DocEntry) {

    /* 1. Validate */
    $validate_itemrecord = $conn->prepare("
        SELECT COUNT(Item_id)
        FROM Pick_List_Item_Collection 
        WHERE ItemRowNum = ?
    ");
    $validate_itemrecord->execute([$DocEntry]);

    if ($validate_itemrecord->fetchColumn() > 0) {
        throw new Exception("Item $DocEntry already added.");
    }

    /* 2. Generate Picklist Number (only once ideally — see note below) */
    $fetch_picklistnum = $conn->prepare("EXEC dbo.[PickList_Num_Generator] ?");
    $fetch_picklistnum->execute([$User]);
    $picklistnumber = $fetch_picklistnum->fetch(PDO::FETCH_ASSOC);
    $PicklistNumber = $picklistnumber['PicklistNumber'];

    /* 3. Fetch items */
    $fetch_items = $conn->prepare("EXEC dbo.[Review_StockRequest_Items] ?");
    $fetch_items->execute([$DocEntry]);

    $items = $fetch_items->fetchAll(PDO::FETCH_ASSOC);

    /* 4. Insert */
    $ins_picklist_items = $conn->prepare("EXEC dbo.[Collect_StockRequest_Items] ?,?,?,?,?,?,?,?,?,?");

    foreach ($items as $row) {
        $ins_picklist_items->execute([
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

        $SR_Number = $row['SR_Number'];
    }

    /* 5. Update status */
    $Status = 'Processing';
    $upd_stockrequestmother = $conn->prepare("
        UPDATE Stock_Transfer_Header_1 
        SET RequestStatus = ? 
        WHERE SR_Number = ?
    ");
    $upd_stockrequestmother->execute([$Status, $SR_Number]);

    /* 6. Create Pick List Header */
    $ins_student = $conn->prepare("EXEC dbo.[CreatePickList_Header] ? ,?");
    $ins_student->execute([$User,$PicklistNumber]);
}

$conn->commit();
echo json_encode(["isSuccess" => "success"]);

} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
?>