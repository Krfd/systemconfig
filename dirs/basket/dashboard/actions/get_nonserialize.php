<?php

require_once "../../../../config/connection.php";

$Brand = $_POST['Brand'];
$Model = $_POST['Model'];
$Category = $_POST['Category'];

try {
    $conn->beginTransaction();

    $fetch_items = $conn->prepare("EXEC Get_Nonserialize ?, ?");
    $fetch_items->execute([$Brand, $Model]);
    $get_items = $fetch_items->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    if (count($get_items) === 0) {
        echo json_encode([
            "isSuccess" => "no_nonserialized",
            "message" => "Selected item is serialized or unavailable.",
            "Data" => []
        ]);
        exit;
    }

    $response = array(
        "isSuccess" => 'success',
        "Data" => $get_items
    );
    echo json_encode($response);
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer. <br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
