<?php
require_once "../../../../config/connection.php";
require_once "../../../../config/functions.php";

session_start();

if (!isset($_SESSION['Uid'])) {
    header('Location: ../../../../login.php');
    exit();
}

$User = $_SESSION['Uid'];
/*Generating Longitude and Latitude upon value of City and Province*/


$Bcode        = $_POST['Bcode'] ?? null;
$Bsize        = $_POST['Bsize'];
$Outlettype   = $_POST['Outlettype'];
$OwnerType    = $_POST['OwnerType'];
$Franchisee   = $_POST['Franchisee'] ?? null;
$FranchiseDate= $_POST['FranchiseDate'];
$FAgreement   = $_POST['FAgreement'] ?? null;
$Royalty      = $_POST['Royalty'] ?? null;
$Marketing    = $_POST['Marketing'] ?? null;
$BAdress      = $_POST['BAdress'];
$Region       = $_POST['Region'];
$Province     = $_POST['Province'];
$City         = $_POST['City'];
$Zipcode      = $_POST['Zipcode'];
$Email        = $_POST['Email'];
$Phonenumber  = $_POST['Phonenumber'];
$Opening      = $_POST['Opening'];
$POS          = $_POST['POS'];
$Bstatus      = $_POST['Bstatus'];
$DraftFile    = $_POST['DraftFile'] ?? null;

$geo = getLatLong($City, $Province);
if (!$geo) {
    throw new Exception("Unable to determine location");
}

$lat  = $geo['lat'];
$long = $geo['long'];




try {
    $conn->beginTransaction();

    /* ================= VALIDATE BRANCH ================= */
    $val_branch = $conn->prepare("SELECT 1 FROM branchinfo WHERE Address = ? LIMIT 1");
    $val_branch->execute([$BAdress]);

    if ($val_branch->fetch()) {
        throw new Exception('This branch already exists.');
    }

    /* ================= VALIDATE FRANCHISE (ONLY IF FRANCHISE) ================= */
    if ($OwnerType === 'FRANCHISE') {
        $val_franchise = $conn->prepare("SELECT 1 FROM Franchise WHERE AgreementNo = ? OR Franchisee = ? LIMIT 1");
        $val_franchise->execute([$FAgreement, $Franchisee]);

        if ($val_franchise->fetch()) {
            throw new Exception('This franchisee or agreement already exists.');
        }
    }

    /* ================= INSERT BRANCH ================= */
    $ins_branch = $conn->prepare("CALL ADD_BRANCH (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $ins_branch->execute([
        $Bcode, $Bsize, $Outlettype, $OwnerType,
        $BAdress, $Region, $Province, $City, $Zipcode,
        $Email, $Phonenumber, $Opening, $POS, $Bstatus, $User, $long, $lat
    ]);

    /* ================= INSERT FRANCHISE (CONDITIONAL) ================= */
    if ($OwnerType === 'FRANCHISE') {
        $ins_franchise = $conn->prepare("CALL ADD_FRANCHISE (?,?,?,?,?,?,?)");
        $ins_franchise->execute([
            $Franchisee, $FAgreement, $FranchiseDate,
            $Royalty, $Marketing, $User, $Bcode
        ]);
    }

    $conn->commit();

    /* ================= DELETE DRAFT FILE (IF EXISTS) ================= */
    if ($DraftFile) {
        $draftDir  = realpath(__DIR__ . "/../drafts/user_" . $User);
        $draftPath = $draftDir ? realpath($draftDir . "/" . basename($DraftFile)) : false;

        if ($draftPath && file_exists($draftPath) && strpos($draftPath, $draftDir) === 0) {
            @unlink($draftPath); // suppress warning if delete fails
        }
    }

    echo "OK";    

} catch (PDOException $e) {
    $conn->rollback();
    echo "<b>Warning. Please Contact System Developer.<br/></b>" . $e->getMessage();
} catch (Exception $e) {
    $conn->rollback();
    echo "<b>Error:</b> " . $e->getMessage();
}
?>
