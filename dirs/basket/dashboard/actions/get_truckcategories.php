<?php
require_once "../../../../config/connection.php";

try {
    $conn->beginTransaction();

    $fetch_truckcategories = $conn->prepare("EXEC dbo.Get_Categories");
    $fetch_truckcategories->execute();
    $categories = $fetch_truckcategories->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();

    $response = array(
        "isSuccess" => 'success',
        "Categories" => $categories,
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
