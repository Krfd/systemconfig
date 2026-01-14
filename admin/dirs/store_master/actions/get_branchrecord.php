<?php
require_once "../../../../config/connection.php";
session_start();

if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];
$CurrentPage = isset($_POST['CurrentPage']) ? (int)$_POST['CurrentPage'] : 1;
$PageSize = isset($_POST['PageSize']) ? (int)$_POST['PageSize'] : 20;
$Branch = $_POST['Branch'];
$Search = $_POST['Search'];

try {
    // Call stored procedure
    $stmt = $conn->prepare("CALL BRANCH_RECORD(?, ?, ?, ? ,?)");
    $stmt->execute([$User, $CurrentPage, $PageSize, $Branch, $Search]);

    $branches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        "isSuccess" => 'success',
        "Data" => $branches
    );

    echo json_encode($response);

} catch (PDOException $e) {
    $response = array(
        "isSuccess" => 'Failed',
        "Data" => "<b>Error. Please Contact System Developer.<br/></b>" . $e->getMessage()
    );
    echo json_encode($response);
}
?>
