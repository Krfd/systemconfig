<?php
require_once "../../../../config/connection.php";
require_once "../../../../config/functions.php";

session_start();
if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];

$MenuType    = $_POST['MenuType'];
$Category    = $_POST['Category'];
$Menu        = $_POST['Menu'];
$MenuCode    = $_POST['MenuCode'];
$PrepTime    = $_POST['PrepTime'];
$Serving     = $_POST['Serving'];
$Calories    = $_POST['Calories'];
$Notes       = $_POST['Notes'];
$Price       = $_POST['Price'];
$Status      = $_POST['Status'];
$Dinein      = $_POST['Dinein'];
$Takeout     = $_POST['Takeout'];
$Delivery    = $_POST['Delivery'];
$Description = $_POST['Description'];


// Handle uploaded file for BLOB
$MenuImage = null;
if(isset($_FILES['menu-img']) && $_FILES['menu-img']['error'] == 0){
    $MenuImage = file_get_contents($_FILES['menu-img']['tmp_name']); // read file content as binary
}

try {
    $conn->beginTransaction();

    // Make sure your stored procedure CREATE_MENU accepts MEDIUMBLOB for image
   $ins_menu = $conn->prepare("CALL CREATE_MENU (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
   $ins_menu->bindParam(1, $MenuType);
   $ins_menu->bindParam(2, $MenuImage, PDO::PARAM_LOB);
   $ins_menu->bindParam(3, $Category);
   $ins_menu->bindParam(4, $Menu);
   $ins_menu->bindParam(5, $MenuCode);
   $ins_menu->bindParam(6, $PrepTime);
   $ins_menu->bindParam(7, $Serving);
   $ins_menu->bindParam(8, $Calories);
   $ins_menu->bindParam(9, $Notes);
   $ins_menu->bindParam(10, $Price);
   $ins_menu->bindParam(11, $Status);
   $ins_menu->bindParam(12, $Dinein);
   $ins_menu->bindParam(13, $Takeout);
   $ins_menu->bindParam(14, $Delivery);
   $ins_menu->bindParam(15, $Description);
   $ins_menu->bindParam(16, $User);
   $ins_menu->execute();


   // Only insert combo items if MenuType is 'Combo Meal'
    if($MenuType === 'Combo Meal' && !empty($_POST['combo_items']) && is_array($_POST['combo_items'])){
        $comboItems = $_POST['combo_items'];
        $comboQty   = $_POST['combo_quantity'] ?? [];

        $ins_combo = $conn->prepare("INSERT INTO food_bundle (Menu_code, Cmbo_Meal, Quantity) VALUES (?,?,?)");

        foreach($comboItems as $index => $meal){
            $qty = isset($comboQty[$index]) ? $comboQty[$index] : 1;
            $ins_combo->execute([$MenuCode, $meal, $qty]);
        }
    }





    $conn->commit();
    echo "OK";

} catch(PDOException $e){
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>".$e->getMessage();
}
?>
