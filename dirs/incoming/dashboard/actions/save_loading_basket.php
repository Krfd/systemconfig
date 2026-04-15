<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$PickListNum = $_POST['PickListNum'] ?? [];
$PickListNum = is_array($PickListNum) ? $PickListNum : [$PickListNum];

try {
    $conn->beginTransaction();
    $stmt = $conn->prepare("EXEC dbo.[BatchNumber_Auto_Generate] ?");
    $stmt->execute([$User]);
    $deliveryRow = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    $BatchNumber = $deliveryRow['BatchNumber'];
    $ins_child = $conn->prepare(
        "EXEC dbo.[LoadingBasket_PKlist_Delivery] ?, ?"
    );

    $get_items = $conn->prepare(
        "EXEC dbo.[LoadingBasket_Collection_items] ?, ?"
    );

    $ins_items = $conn->prepare(
        "EXEC dbo.[Delivery_Items_Batch] ?,?,?,?,?,?,?,?,?,?,?"
    );

    foreach ($PickListNum as $picklist) {
        $ins_child->execute([$picklist, $BatchNumber]);
        $ins_child->closeCursor();
        $get_items->execute([$User, $picklist]);
        while ($row = $get_items->fetch(PDO::FETCH_ASSOC)) {
            $ins_items->execute([
                $User,
                $BatchNumber,
                $picklist,
                $row['SR_Number'],
                $row['Req_Branch'],
                $row['Req_Whscode'],
                $row['Req_ItemCode'],
                $row['Req_ItemName'],
                $row['Req_ItemBrand'],
                $row['Req_ItemCategory'],
                (int)$row['Actual_Item_Qty']
            ]);
            $ins_items->closeCursor();
        }

        $get_items->closeCursor();
    }

    $stmt = $conn->prepare(
        "EXEC dbo.[LoadingBasket_Header] ?, ?"
    );
    $stmt->execute([$User, $BatchNumber]);
    $stmt->closeCursor();

    $conn->commit();

    echo "OK";
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo "<b>Warning. Please Contact System Developer.</b><br>";
    echo htmlspecialchars($e->getMessage());
}
