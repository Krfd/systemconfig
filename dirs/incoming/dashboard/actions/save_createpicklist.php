<?php
require_once "../../../../config/connection.php";
session_start();

$User     = $_SESSION['Uid'];
$DocEntry = $_POST['DocEntry'] ?? [];

try {
    $conn->beginTransaction();

    // 🔹 1. Generate Picklist Number
    $stmtSRN = $conn->prepare("EXEC dbo.[PickList_Num_Generator] ?");
    $stmtSRN->execute([$User]);
    $srnData = $stmtSRN->fetch(PDO::FETCH_ASSOC);

    $PicklistNumber = $srnData['PicklistNumber'] ?? null;

    // 🔹 Track inserted SR to avoid duplicates
    $processedSR = [];

    // 🔹 2. Loop selected DocEntry
    foreach ($DocEntry as $doc_id) {

        // 🔹 Fetch items per DocEntry
        $stmtItems = $conn->prepare("EXEC dbo.[StockReq_H_Picklist] ?");
        $stmtItems->execute([$doc_id]);

        while ($row = $stmtItems->fetch(PDO::FETCH_ASSOC)) {

            $SR_Number                 = $row['SR_Number'];
            $ItemCode                  = $row['ItemCode'];
            $ItemName                  = $row['ItemName'];
            $ItemBrand                 = $row['ItemBrand'];
            $ItemCategory              = $row['ItemCategory'];
            $Request_Qty               = $row['Request_Qty'];
            $BranchOrigin              = $row['BranchOrigin'];
            $BranchOrigin_Whscode      = $row['BranchOrigin_Whscode'];
            $BranchDestination         = $row['BranchDestination'];
            $BranchDestination_Whscode = $row['BranchDestination_Whscode'];

            // 🔹 Insert Picklist Items
            $stmtInsertItem = $conn->prepare("EXEC dbo.[Pick_List_Item_Collection] ?,?,?,?,?,?,?,?,?,?,?");
            $stmtInsertItem->execute([
                $PicklistNumber,
                $SR_Number,
                $ItemCode,
                $ItemName,
                $ItemBrand,
                $ItemCategory,
                $Request_Qty,
                $BranchOrigin,
                $BranchOrigin_Whscode,
                $BranchDestination,
                $BranchDestination_Whscode
            ]);

            // 🔹 Insert SR record ONLY ONCE per SR
            if (!in_array($SR_Number, $processedSR)) {

                $stmtsrn_record = $conn->prepare("EXEC dbo.[Collect_SRNumber_Picklist] ?,?,?");
                $stmtsrn_record->execute([
                    $PicklistNumber,
                    $BranchOrigin,
                    $SR_Number
                ]);

                $processedSR[] = $SR_Number;
            }
        }
    }

    // 🔹 3. Insert Picklist Header
    $stmtHeader = $conn->prepare("EXEC dbo.[Create_PickList_Header] ?,?");
    $stmtHeader->execute([$User, $PicklistNumber]);

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "PicklistNumber" => $PicklistNumber
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "status" => "error",
        "message" => "Warning. Please contact system developer.",
        "error" => $e->getMessage()
    ]);
}
