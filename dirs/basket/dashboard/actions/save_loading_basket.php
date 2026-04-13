<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$PickListNum = $_POST['PickListNum'] ?? [];



try {
    $conn->beginTransaction();

    // Get Batch Number
    $stmt = $conn->prepare("EXEC dbo.[LoadingBasket_Number] ?");
    $stmt->execute([$User]);
    $deliveryRow = $stmt->fetch(PDO::FETCH_ASSOC);
    $BatchNumber = $deliveryRow['BatchNumber'];

    // Insert Header
    $stmt = $conn->prepare("EXEC dbo.[LoadingBasket_Delivery_M] ?, ?");
    $stmt->execute([$User, $BatchNumber]);

    // Prepare reusable statements
    $ins_child = $conn->prepare("EXEC dbo.[LoadingBasket_PKlist_Delivery] ?, ?");
    $get_items = $conn->prepare("EXEC dbo.[LoadingBasket_Collection_items] ?, ?");
    $ins_items = $conn->prepare("EXEC dbo.[Delivery_Items_Batch] ?,?,?,?,?,?,?,?,?,?,?,?");

    foreach ($PickListNum as $picklist) {

        // Insert child
        $ins_child->execute([$picklist, $BatchNumber]);

        // Get items per picklist
        $get_items->execute([$User, $picklist]);

        while ($row = $get_items->fetch(PDO::FETCH_ASSOC)) {

            $ins_items->execute([
                $User,
                $BatchNumber,
                $picklist,
                $row['SR_Number'],
                $row['ItemSerial'],
                $row['Req_Branch'],
                $row['Req_Whscode'],
                $row['Req_ItemCode'],
                $row['Req_ItemName'],
                $row['Req_ItemBrand'],
                $row['Req_ItemCategory'],
                $row['Actual_Item_Qty']
            ]);
        }
    }

    $conn->commit();
    echo "OK";
} catch (Exception $e) {
    $conn->rollBack();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
