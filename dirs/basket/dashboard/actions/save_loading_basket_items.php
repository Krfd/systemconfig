<?php
require_once "../../../../config/connection.php";

session_start();

$User = $_SESSION['Uid'] ?? null;
$pickListNumbers = $_POST['PicklistNumber'] ?? [];

try {

    $conn->beginTransaction();

    $stmt = $conn->prepare("EXEC dbo.[BatchNumber_Auto_Generate] ?");
    $stmt->execute([$User]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $BatchNumber = $result['BatchNumber'];

    $stmtCollect = $conn->prepare("EXEC dbo.[CollectPicklist_toloadingbasket] ?,?,?");
    foreach ($pickListNumbers as $pickListNumber) {

        if (empty($pickListNumber)) continue;

        $stmtCollect->execute([
            $User,
            $pickListNumber,
            $BatchNumber
        ]);
    }

    $ins_laodingheader = $conn->prepare("EXEC dbo.[CreateLoadingBasket_Header] ?, ?");
    $ins_laodingheader->execute([$User, $BatchNumber]);


    $conn->commit();

    echo json_encode([
        "isSuccess" => "success",
        "BatchNumber" => $BatchNumber
    ]);
} catch (Exception $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    if ($conn->inTransaction()) {
        $conn->rollback();
    }

    echo json_encode([
        "isSuccess" => "error",
        "message" => $e->getMessage()
    ]);
}
