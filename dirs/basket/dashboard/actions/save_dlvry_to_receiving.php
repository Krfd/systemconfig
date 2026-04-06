<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];

/* ===================== SINGLE VALUES ===================== */
$DeliveryNum   = $_POST['DeliveryNum'] ?? '';
$PickListNum   = $_POST['PickListNum'] ?? '';
$Remarks       = $_POST['Remarks'] ?? '';

/* Summary */
$SummaryBrand     = $_POST['SummaryBrand'] ?? [];
$SummaryModel     = $_POST['SummaryModel'] ?? [];
$SummaryCategory  = $_POST['SummaryCategory'] ?? [];
$SummaryItemCode  = $_POST['SummaryItemCode'] ?? [];
$SummarySerial    = $_POST['SummarySerial'] ?? [];
$SummaryAllocated = $_POST['SummaryAllocated'] ?? [];

/* ===================== ARRAY VALUES ===================== */
/* Serialized */
$Serial    = $_POST['Serial'] ?? [];
$Brand     = $_POST['Brand'] ?? [];
$Model     = $_POST['Model'] ?? [];
$ItemCode  = $_POST['ItemCode'] ?? [];
$Category  = $_POST['Category'] ?? [];
$Quantity  = $_POST['Quantity'] ?? [];

/* Non-Serialized */
$NonItemCode  = $_POST['NonSerializedItemCode'] ?? [];
$NonBrand     = $_POST['NonSerializedBrand'] ?? [];
$NonModel     = $_POST['NonSerializedModel'] ?? [];
$NonCategory  = $_POST['NonSerializedCategory'] ?? [];
$NonQuantity  = $_POST['NonQuantity'] ?? [];



try {
    $conn->beginTransaction();

    /* ===================== GENERATE RECEIVING NUMBER ===================== */
    $stmt = $conn->prepare("EXEC dbo.[Receiving_Number_Generator] ?");
    $stmt->execute([$User]);
    $Receiving_Number = $stmt->fetch(PDO::FETCH_ASSOC)['ReceivingNumber'];

    /* ===================== INSERT HEADER ===================== */
    $stmt = $conn->prepare("EXEC dbo.[Receiving_Mother] ?,?,?,?,?");
    $stmt->execute([
        $User,
        $DeliveryNum,
        $PickListNum,
        $Receiving_Number,
        $Remarks
    ]);

    /* ===================== FETCH ORIGIN ===================== */
    $stmt = $conn->prepare("EXEC dbo.[Fetch_Request_Details] ?,?");
    $stmt->execute([$User, $DeliveryNum]);
    $details = $stmt->fetchALL(PDO::FETCH_ASSOC);

    foreach ($details as $row) {
        $SRN          = $row['BaseNum_SRN'];
        $Branch       = $row['Orgin_Dstnation'];
        $Whscode      = $row['Origin_Whscode'];
        $BranchRcvd   = $row['Brnch_Dstnation'];
        $WhscodeRcvd  = $row['Dstnation_Whscode'];
    }

    /* ===================== SERIALIZED ITEMS ===================== */
    $stmtSerialized = $conn->prepare("EXEC dbo.[Receiving_IN_Serialized] ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?");

    foreach ($Serial as $i => $serialVal) {
        $stmtSerialized->execute([
            $User,
            $Branch,
            $Whscode,
            $BranchRcvd,
            $WhscodeRcvd,
            $DeliveryNum,
            $Receiving_Number,
            $SRN,
            $serialVal,
            $ItemCode[$i],
            $Model[$i],
            $Brand[$i],
            $Category[$i],
            $PickListNum,
            $Quantity[$i]
        ]);
    }

    /* ===================== NON-SERIALIZED ITEMS ===================== */
    $stmtNon = $conn->prepare("EXEC dbo.[Receiving_IN_NoNSerialized] ?,?,?,?,?,?,?,?,?,?,?,?,?");

    foreach ($NonItemCode as $i => $code) {
        $stmtNon->execute([
            $User,
            $Branch,
            $Whscode,
            $BranchRcvd,
            $WhscodeRcvd,
            $DeliveryNum,
            $Receiving_Number,
            $SRN,
            $code,
            $NonModel[$i],
            $NonBrand[$i],
            $NonCategory[$i],
            $NonQuantity[$i]
        ]);
    }

    /* ===================== SUMMARY ===================== */
    $stmtSummary = $conn->prepare("EXEC dbo.[Receiving_IN_Summary] ?,?,?,?,?,?,?,?,?");

    foreach ($SummaryItemCode as $i => $code) {
        $stmtSummary->execute([
            $User,
            $DeliveryNum,
            $Receiving_Number,
            $SummarySerial[$i] ?? null,
            $code,
            $SummaryModel[$i],
            $SummaryBrand[$i],
            $SummaryCategory[$i],
            $SummaryAllocated[$i]
        ]);
    }

    $conn->commit();

    echo json_encode([
        "isSuccess" => "success",
        "ReceivingNumber" => $Receiving_Number
    ]);
} catch (PDOException $e) {
    $conn->rollback();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "isSuccess" => "Failed",
        "message" => $e->getMessage()
    ]);
}
