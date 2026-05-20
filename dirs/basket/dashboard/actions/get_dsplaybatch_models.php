<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
// $BatchNumber = $_POST['BatchNumber']; // REPLACED WITH PICKLIST
$Picklists = isset($_POST['Picklists']) ? $_POST['Picklists'] : [];
$ItemCode = $_POST['ItemCode'];

try {

    $placeholders = implode(',', array_fill(0, count($Picklists), '?'));

    $conn->beginTransaction();
    // $stmt = $conn->prepare("EXEC dbo.LoadingBasketItemsFor_SetupDelivery ?, ?, ?");
    // $stmt->execute([$User, $BatchNumber, $ItemCode]);
    $stmt = $conn->prepare("SELECT PKList_Number, Item_id, Req_ItemCode, Req_ItemName, Req_ItemBrand, Req_ItemCategory, Actual_Item_Qty FROM Pick_List_Item_Collection
    WHERE PKList_Number IN ($placeholders) AND Req_ItemCode = ?");
    $params = array_merge($Picklists, [$ItemCode]);
    $stmt->execute($params);
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
