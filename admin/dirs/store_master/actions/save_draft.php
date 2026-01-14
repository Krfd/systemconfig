<?php
    require_once "../../../../config/connection.php";
    require_once "../../../../config/functions.php";

    session_start();

    if (!isset($_SESSION['Uid'])) {
        header('Location: ../../../../login.php');
        exit();
    }

    $User = $_SESSION['Uid'];

    /* ===== Collect POST safely ===== */
    $Bacronym       = $_POST['Bacronym'] ?? '';
    $Bsize          = $_POST['Bsize'] ?? null;
    $Outlettype     = $_POST['Outlettype'] ?? null;
    $OwnerType      = $_POST['OwnerType'] ?? null;
    $Franchisee     = $_POST['Franchisee'] ?? null;
    $FranchiseDate  = $_POST['FranchiseDate'] ?? null;
    $FAgreement     = $_POST['FAgreement'] ?? null;
    $Royalty        = $_POST['Royalty'] ?? null;
    $Marketing      = $_POST['Marketing'] ?? null;
    $BAdress        = $_POST['BAdress'] ?? null;
    $Region         = $_POST['Region'] ?? null;
    $Province       = $_POST['Province'] ?? null;
    $City           = $_POST['City'] ?? null;
    $Zipcode        = $_POST['Zipcode'] ?? null;
    $Email          = $_POST['Email'] ?? null;
    $Phonenumber    = $_POST['Phonenumber'] ?? null;
    $Opening        = $_POST['Opening'] ?? null;
    $POS            = $_POST['POS'] ?? null;
    $Bstatus        = $_POST['Bstatus'] ?? null;

    /* ===== Timestamp ===== */
    date_default_timezone_set('Asia/Manila');
    $timestamp = date("Y-m-d H:i:s");
    $filenameTime = date("Y-m-d_H-i-s");

    /* ===== Generate Draft ID ===== */
    $draftID = uniqid("draft_", true); // unique ID, can also use random_bytes() or a UUID lib

    /* ===== Draft Data ===== */
    $draftData = [
        "draft_id"    => $draftID,
        "draft_title" => "Draft_" . strtoupper($Bacronym),
        "user_id"     => $User,
        "created_at"  => $timestamp,
        "branch" => [
            "Bacronym"      => strtoupper($Bacronym),
            "Bsize"         => $Bsize,
            "Outlettype"    => $Outlettype,
            "OwnerType"     => $OwnerType,
            "Franchisee"    => $Franchisee,
            "FranchiseDate" => $FranchiseDate,
            "FAgreement"    => $FAgreement,
            "Royalty"       => $Royalty,
            "Marketing"     => $Marketing,
            "Address" => [
                "BAdress"  => $BAdress,
                "Region"   => $Region,
                "Province" => $Province,
                "City"     => $City,
                "Zipcode"  => $Zipcode
            ],
            "Contact" => [
                "Email"       => $Email,
                "Phonenumber" => $Phonenumber
            ],
            "Opening" => $Opening,
            "POS"     => $POS,
            "Status"  => $Bstatus
        ]
    ];

    /* ===== Draft Folder per User ===== */
    $baseDir = "../drafts";
    $userDir = $baseDir . "/user_" . $User;
    if (!is_dir($userDir)) mkdir($userDir, 0777, true);

    /* ===== Draft Filename ===== */
    $safeAcronym = preg_replace('/[^A-Z0-9_-]/', '', strtoupper($Bacronym ?: "UNKNOWN"));
    $filename = "Draft_{$safeAcronym}_{$draftID}.json"; // include ID in filename
    $filePath = $userDir . "/" . $filename;

    /* ===== Save JSON ===== */
    file_put_contents($filePath, json_encode($draftData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    echo json_encode([
        "isSuccess" => "success",
        "file" => $filename,
        "draft_id" => $draftID
    ]);
?>