<?php
require_once "../../../../config/connection.php";
session_start();

$User = $_SESSION['Uid'];
$PickListNum = $_POST['PickListNum'] ?? [];

try {
    $conn->beginTransaction();

    $lfetch_batnumber = $conn->prepare("EXEC dbo.[LoadingBasket_Number] ?");
    $lfetch_batnumber->execute([$User]);
    $deliveryRow = $lfetch_batnumber->fetch(PDO::FETCH_ASSOC);
    $BatchNumber = $deliveryRow['BatchNumber'];

    $ins_loadingbasketmother = $conn->prepare("EXEC dbo.[LoadingBasket_Delivery_M] ?, ?");
    $ins_loadingbasketmother->execute([$User, $BatchNumber]);

    $ins_loadingbasket_child = $conn->prepare("EXEC dbo.[LoadingBasket_PKlist_Delivery] ?, ?");
    foreach ($PickListNum as $picklist) {
        $ins_loadingbasket_child->execute([$picklist, $BatchNumber]);
    }

    $conn->commit();
    echo "OK";

} catch (PDOException $e) {
    $conn->rollBack();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
} catch (Exception $e) {
    $conn->rollBack();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
}
?>