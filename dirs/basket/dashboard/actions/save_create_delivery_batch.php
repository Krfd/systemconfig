<?php
require_once "../../../../config/connection.php";
session_start();

$User         = $_SESSION['Uid'];
$PickListNum  = $_POST['PickListNum'] ?? [];
$LoadingB_Num = $_POST['LoadingB_Num'] ?? [];

try {

    $conn->beginTransaction();

    $fetch_bacthnumber = $conn->prepare("EXEC dbo.[Per_Branch_BatchNumber] ?");
    $fetch_bacthnumber->execute([$User]);
    $get_batnumber = $fetch_bacthnumber->fetch(PDO::FETCH_ASSOC);

    $BatchNum = $get_batnumber['BatchNumber'];

    $ins_DeliveryBasket = $conn->prepare("EXEC dbo.[Collect_Delivery_LoadingBasket] ?,?,?,?");

    foreach ($PickListNum as $i => $val) {
        $ins_DeliveryBasket->execute([
            $User,
            $BatchNum,
            $PickListNum[$i],
            $LoadingB_Num[$i]
        ]);
    }

    $conn->commit();
    echo json_encode([
        "isSuccess" => "success",
        "message" => "Batch delivery has been saved successfully.",
        "BatchNum" => $BatchNum
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo json_encode([
        "isSuccess" => "error",
        "message" => $e->getMessage()
    ]);
}
