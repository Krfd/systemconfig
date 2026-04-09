<?php
  require_once "../../../../config/connection.php";
  session_start();

  $User  = $_SESSION['Uid'];

  $SR_Number = $_POST['SR_Number'] ?? '';
  $OriginBcode = $_POST['OriginBcode'] ?? '';
  $OriginWhscode = $_POST['OriginWhscode'] ?? '';
  $BranchDestination = $_POST['BranchDestination'] ?? '';
  $BranchDestination_Bcode = $_POST['BranchDestination_Bcode'] ?? '';
  $BranchDestination_Whscode = $_POST['BranchDestination_Whscode'] ?? '';

  $TypeRequest = $_POST['TypeRequest'] ?? '';
  $EncodeDate = $_POST['EncodeDate'] ?? '';
  $Remarks = $_POST['Remarks'] ?? '';
  $PurposeRequest = $_POST['PurposeRequest'] ?? '';


  $ItemCode       = $_POST['ItemCode'] ?? [];
  $ItemName       = $_POST['ItemName'] ?? [];
  $ItemBrand      = $_POST['ItemBrand'] ?? [];
  $ItemCategory   = $_POST['ItemCategory'] ?? [];
  $OrderQty       = $_POST['OrderQty'] ?? 0;
  
  try{

    $conn->beginTransaction();

  /*Stock Request Mother*/
    $ins_requestmother = $conn->prepare("EXEC dbo.[Create_StockRequest] ?,?,?,?,?,?,?,?,?");
    $ins_requestmother->execute([
      $User,
      $SR_Number,
      $TypeRequest, 
      $PurposeRequest,
      $EncodeDate, 
      $Remarks,
      $OriginWhscode, 
      $BranchDestination,
      $BranchDestination_Whscode]);

    /*Request Stock Transfer Items*/
    $ins_requestitems = $conn->prepare("EXEC dbo.[Create_StockTransfer_Items] ?,?,?,?,?,?");
    foreach ($srn_rows as $row) {
        $ins_requestitems->execute([
           $SR_Number,$ItemCode, $ItemName,$ItemBrand,$ItemCategory,$OrderQty
        ]);
    }


    /*Update total Qty stock transfer Items*/
    $upd_totalqty = $conn->prepare("EXEC dbo.[Update_TotalQty_Ordered] ?, ?");
    $upd_totalqty->execute([ $User, $SR_Number]);


    $conn->commit();
    echo "OK";

  }catch(PDOException $e){
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>".$e;getMessage();
  }
?>


