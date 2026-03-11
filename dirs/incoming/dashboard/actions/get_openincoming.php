<?php
require_once "../../../../config/connection.php";

session_start();

// $Userid = $_SESSION['Uid'];
$RowNum = $_POST['RowNum'] ?? $_GET['RowNum'] ?? null;;

try {

    $stmt = $conn->prepare("EXEC dbo.[OPENINCOMING_REQUEST] ?");
    $stmt->execute([$RowNum]);
    $header = $stmt->fetch(PDO::FETCH_ASSOC);

    /*For SRN ITEMS*/
    $stmt->nextRowset();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "isSuccess" => "success",
        "Data" => $header,
        "Items" => $items
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "isSuccess" => "Failed",
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    ]);
}
