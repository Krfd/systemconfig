<?php
require_once "../../../../config/connection.php";
session_start();

$User        = $_SESSION['Uid'];
$BatchNumber = $_POST['BatchNumber'] ?? null;

try {
    $conn->beginTransaction();

    $fetch_loadingbasket = $conn->prepare("EXEC dbo.[View_LoadingBasket] ?,?");
    $fetch_loadingbasket->execute([$User, $BatchNumber]);
    $header = $fetch_loadingbasket->fetch(PDO::FETCH_ASSOC);

    /* Items */
    $items = [];

    if ($fetch_loadingbasket->nextRowset()) {
        $items = $fetch_loadingbasket->fetchAll(PDO::FETCH_ASSOC);
    }

    $conn->commit();

    $response = array(
        "isSuccess" => "success",
        "Header"    => $header,
        "Items"     => $items
    );

    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => "Failed",
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    );

    echo json_encode($response);
}
