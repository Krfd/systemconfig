<?php
require_once "../../../../config/connection.php";
session_start();

header('Content-Type: application/json');

$Userid    = $_SESSION['Uid'];
$PKlistNum = $_POST['PKlistNum'];

try {
    $conn->beginTransaction();

    $response = [];

    // Validate Pick List Number if Exist then Return
    $validatePicklist = $conn->prepare("EXEC dbo.[VALIDATE_PICKLIST_TO_Delivery] ? ,?");
    $validatePicklist->execute([$Userid, $PKlistNum]);
    if ($validatePicklist->fetchColumn() > 0) {
        $conn->rollBack();

        $response = [
            "status" => "error",
            "message" => "This picklist already exists"
        ];

        echo json_encode($response);
        exit;
    }

    /* -------------------------------------------------
       1. Generate Delivery Number
    ------------------------------------------------- */
    $stmtDeliveryNum = $conn->prepare("EXEC dbo.[DELIVERY_Num_GENERATOR] ?");
    $stmtDeliveryNum->execute([$Userid]);

    $deliveryRow = $stmtDeliveryNum->fetch(PDO::FETCH_ASSOC);

    if (!$deliveryRow) {
        throw new Exception("Unable to generate delivery number.");
    }

    $DeliveryNumber = $deliveryRow['DRNumber'];

    /* -------------------------------------------------
       2. Insert Delivery Mother Record
    ------------------------------------------------- */
    $stmtMother = $conn->prepare("EXEC dbo.[FOR_DELIVERY_MOTHER] ?, ?, ?");
    $stmtMother->execute([
        $DeliveryNumber,
        $PKlistNum,
        $Userid
    ]);

    /* -------------------------------------------------
       3. Fetch All SRN Numbers
    ------------------------------------------------- */
    $stmtSRN = $conn->prepare("EXEC dbo.[SRN_ITEMS_BREAKDOWN] ?, ?");
    $stmtSRN->execute([
        $Userid,
        $PKlistNum
    ]);

    $srnRows = $stmtSRN->fetchAll(PDO::FETCH_ASSOC);

    /* -------------------------------------------------
       4. Loop each SRN Number
    ------------------------------------------------- */
    foreach ($srnRows as $srn) {

        $SRN_Number = $srn['SRN_NUMBER'];

        /* ---------------------------------------------
           Fetch Items Per SRN
        --------------------------------------------- */
        $stmtItems = $conn->prepare("EXEC dbo.[GET_ITEMS_BREAKDOWN] ?");
        $stmtItems->execute([$SRN_Number]);

        $itemRows = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        /* ---------------------------------------------
           Loop Items
        --------------------------------------------- */
        foreach ($itemRows as $item) {

            $BaseNum_SRN = $item['BaseNum_SRN'];
            $Brand       = $item['Brand'];
            $Model       = $item['Model'];
            $ItemCode    = $item['ItemCode'];
            $Category    = $item['Category'];
            $Quantity    = $item['Quantity'];

            /* -----------------------------------------
               Insert Delivery Item
            ----------------------------------------- */
            $stmtInsertItem = $conn->prepare(
                "EXEC dbo.[DELIVERY_ITEMS_CREATE] ?, ?, ?, ?, ?, ?, ?"
            );

            $stmtInsertItem->execute([
                $BaseNum_SRN,
                $PKlistNum,
                $DeliveryNumber,
                $Brand,
                $Model,
                $Category,
                $Quantity
            ]);
        }
    }

    /* -------------------------------------------------
       Commit Transaction
    ------------------------------------------------- */
    $conn->commit();

    $response = [
        "status" => "success",
        "message" => $DeliveryNumber
    ];

    echo json_encode($response);
    exit;
} catch (Throwable $e) {

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    $response = [
        "status" => "error",
        "message" => $e->getMessage()
    ];

    echo json_encode($response);
}
