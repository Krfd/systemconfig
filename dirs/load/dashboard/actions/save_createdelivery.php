<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$BatchNumbers = $_POST['BatchNumber'];

try {

    $conn->beginTransaction();

    /*
    | STEP 1 : AUTO GENERATE REFERENCE NUMBER
    */

    $stmt = $conn->prepare("EXEC dbo.ReferenceNumber_AutoGenerate ?");
    $stmt->execute([$User]);

    $get_refnumber = $stmt->fetch(PDO::FETCH_ASSOC);

    $ReferenceNumber = $get_refnumber['ReferenceNumber'];

    /*
    | STEP 2 : GET LOADING BASKET HEADER
    | Use first batch only to retrieve header information
    */

    $FirstBatch = $BatchNumbers[0];

    $fetch_loadingbasketmother = $conn->prepare("
        EXEC dbo.GetLoadingBaskt_Info ?, ?
    ");

    $fetch_loadingbasketmother->execute([
        $User,
        $FirstBatch
    ]);

    $get_bheader = $fetch_loadingbasketmother->fetch(PDO::FETCH_ASSOC);

    $DeliveryDate  = $get_bheader['DeliveryDate'];
    $TruckCategory = $get_bheader['TruckCategory'];
    $TruckPlate    = $get_bheader['TruckPlate'];
    $Driver        = $get_bheader['Driver'];
    $Remarks       = $get_bheader['Remarks'];
    $BranchSet     = $get_bheader['BranchSet'];



    /*
    | STEP 3 : PROCESS EVERY BATCH NUMBER
    */

    foreach ($BatchNumbers as $BatchNumber) {

        /*
        | STEP 3.1 : GET ALL ITEMS FROM LOADING BASKET
        */

        $fetch_lborder_items = $conn->prepare("
            EXEC dbo.GetLoadingBaskt_Items ?, ?
        ");

        $fetch_lborder_items->execute([
            $User,
            $BatchNumber
        ]);

        $get_items = $fetch_lborder_items->fetchAll(PDO::FETCH_ASSOC);
        /*
        | STEP 3.2 : INSERT HEADER
        | Insert only once per requesting branch
        */

        if (!empty($get_items)) {

            $RequestingBranch = $get_items[0]['RequestingBranch'];

            $ins_intransit_header = $conn->prepare("
                EXEC dbo.Create_InTransitHeader ?,?,?,?,?,?,?,?,?
            ");

            $ins_intransit_header->execute([
                $User,
                $BatchNumber,
                $ReferenceNumber,
                $DeliveryDate,
                $TruckCategory,
                $TruckPlate,
                $Driver,
                $Remarks,
                $RequestingBranch
            ]);
        }


        /*
        | STEP 3.3 : INSERT ORDER ITEMS
        */

        foreach ($get_items as $row) {
            /*
            | UNIQUE CODE GENERATOR
            */

            $UniqueCode = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 12));

            /*
            | INSERT ORDER ITEMS
            */

            $ins_intransit_orders = $conn->prepare("
                EXEC dbo.Create_InTransit_orders
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            ");

            $ins_intransit_orders->execute([

                $User,
                $ReferenceNumber,
                $UniqueCode,

                $row['SR_Number'],
                $row['PKList_Number'],
                $row['BatchBasket_Num'],
                $row['RequestingBranch'],

                $row['ItemRowNum'],
                $row['ItemCode'],
                $row['ItemSerial'],
                $row['ItemName'],
                $row['ItemCategory'],
                $row['ItemBrand'],
                $row['ItemType'],

                $row['RequestQty'],
                $row['RequestQty'],
                $row['Actual_Item_Qty'],
                $row['Deliver_Qty']

            ]);
        }
    }

    $conn->commit();

    echo "OK";

} catch (PDOException $e) {

    $conn->rollback();

    echo "<b>Warning. Please Contact System Developer.</b><br>";
    echo $e->getMessage();
}
?>