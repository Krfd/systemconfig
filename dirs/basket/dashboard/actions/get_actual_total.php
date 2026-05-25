<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$Picklists = isset($_POST['Picklists']) ? $_POST['Picklists'] : [];
$ItemCode = $_POST['ItemCode'];

try {
    // $placeholders = implode(',', array_fill(0, count($Picklists), '?'));

    // $conn->beginTransaction();

    // $stmt = $conn->prepare("SELECT 
    //     Req_ItemCode,
    //     Req_ItemName,
    //     Req_ItemBrand,
    //     Req_ItemCategory,
    //     SUM(Actual_Item_Qty) AS Total_Actual_Item_Qty
    // FROM (
    //     SELECT DISTINCT
    //         PKList_Number,
    //         Req_ItemCode,
    //         Req_ItemName,
    //         Req_ItemBrand,
    //         Req_ItemCategory,
    //         Actual_Item_Qty
    //     FROM Pick_List_Item_Collection
    //     WHERE PKList_Number IN ($placeholders)
    //     AND Req_ItemCode = ?
    // ) AS deduped
    // GROUP BY 
    //     Req_ItemCode,
    //     Req_ItemName,
    //     Req_ItemBrand,
    //     Req_ItemCategory
    // ");
    // $params = array_merge($Picklists, [$ItemCode]);
    // $stmt->execute($params);
    // $get_header = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $picklistString = implode(',', $Picklists);

    $stmt = $conn->prepare("EXEC dbo.[GET_ACTUAL_TOTAL] ?, ?, ?");
    $stmt->execute([
        $User,
        $picklistString,
        $ItemCode
    ]);

    $get_header = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $response = array(
        "isSuccess" => "success",
        "Data" => $get_header
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();

    $response = array(
        "isSuccess" => "failed",
        "Data" => "<b>Error. Please Contact System Developer.</b><br>" . $e->getMessage()
    );

    echo json_encode($response);
}
