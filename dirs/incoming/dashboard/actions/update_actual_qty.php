<?php
require_once "../../../../config/connection.php";
session_start();

$User       = $_SESSION['Uid'];
$ItemNumber = $_POST['ItemNumber'] ?? [];
$ActualQty  = $_POST['ActualQty'] ?? [];
$ExecutedBy = $_POST['ExecutedBy'] ?? [];
$SR_Number  = isset($_POST['SR_Number']) ? (array)$_POST['SR_Number'] : [];

// // Prepare data as readable text
// $data  = "User: " . $User . PHP_EOL;
// $data .= "Item Numbers: " . implode(', ', $ItemNumber) . PHP_EOL;
// $data .= "Actual Quantities: " . implode(', ', $ActualQty) . PHP_EOL;
// $data .= "Executed By: " . implode(', ', $ExecutedBy) . PHP_EOL;
// $data .= "SR Numbers: " . implode(', ', $SR_Number) . PHP_EOL;
// $data .= "--------------------------" . PHP_EOL;

// // Save to file
// $file = 'data.txt';

// // Append data to file
// file_put_contents($file, $data, FILE_APPEND);

try {
    $conn->beginTransaction();

    $upd_picklistcollection = $conn->prepare("EXEC dbo.[Apply_Actual_Quantity] ?, ?, ?, ?");
    foreach ($ItemNumber as $i => $item) {
        $qty = $ActualQty[$i] ?? 0;
        $upd_picklistcollection->execute([$User, $item, $qty, $ExecutedBy]);
    }

    $upd_stockrequestStatus = $conn->prepare("EXEC dbo.[Update_Status_RequestingBranch] ?");
    foreach ($SR_Number as $requestnumber) {
        $upd_stockrequestStatus->execute([$requestnumber]);
    }

    $conn->commit();
    echo json_encode([
        "status" => "success",
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
}
