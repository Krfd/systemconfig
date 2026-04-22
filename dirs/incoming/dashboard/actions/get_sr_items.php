<?php
require_once "../../../../config/connection.php";

$SR_Number = $_POST['SR_Number'] ?? [];

try {
    $conn->beginTransaction();

    if (!is_array($SR_Number)) {
        $SR_Number = [$SR_Number];
    }

    $all_items = [];
    foreach ($SR_Number as $sr) {
        $fetch_stockrequestitems = $conn->prepare("EXEC dbo.[ReviewStockRequests_Items] ?");
        $fetch_stockrequestitems->execute([$sr]);
        $items = $fetch_stockrequestitems->fetchAll(PDO::FETCH_ASSOC);
        $all_items = array_merge($all_items, $items);
    }

    $conn->commit();

    echo json_encode([
        "isSuccess" => "success",
        "Data" => $all_items
    ]);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollBack();
    echo json_encode([
        "isSuccess" => "Failed",
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    ]);
}
