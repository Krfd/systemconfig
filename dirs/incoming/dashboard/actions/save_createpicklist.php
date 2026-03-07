<?php
require_once "../../../../config/connection.php";
session_start();
header('Content-Type: application/json');

$Userid    = $_SESSION['Uid'];
$RowNumber = $_POST['RowNumber'];

if (!is_array($RowNumber)) {
    $RowNumber = [$RowNumber];
}

try {

    $conn->beginTransaction();

    /* ---------------------------
       Generate Picklist Number
    --------------------------- */
    $pklist_gen = $conn->prepare("EXEC dbo.[PKLIST_GENERATOR] ?");
    $pklist_gen->execute([$Userid]);
    $pklist_row = $pklist_gen->fetch(PDO::FETCH_ASSOC);
    $PKNumber   = $pklist_row['PicklistNumber'];

    /* ---------------------------
       Prepare placeholders
    --------------------------- */
    $placeholders = implode(',', array_fill(0, count($RowNumber), '?'));

    /* ---------------------------
       Check if SRN already used
    --------------------------- */
    $check_sql = "
        SELECT r.BaseNum_SRN
        FROM SRN_REQUEST r
        JOIN PKLIST_BREAKDOWN b 
            ON b.BaseNum_SRN = r.BaseNum_SRN
        WHERE r.RowNum IN ($placeholders)
    ";

    $check = $conn->prepare($check_sql);
    $check->execute($RowNumber);

    if ($check->fetch()) {

        $conn->rollBack();

        echo json_encode([
            "status" => "error",
            "message" => "Some stock requests have already been added to a picklist."
        ]);
        exit;
    }

    /* ---------------------------
       Fetch SRN rows
    --------------------------- */
    $srn_sql = "
        SELECT BaseNum_SRN, Orgin_Dstnation
        FROM SRN_REQUEST
        WHERE RowNum IN ($placeholders)
    ";

    $pklist_srn = $conn->prepare($srn_sql);
    $pklist_srn->execute($RowNumber);
    $srn_rows = $pklist_srn->fetchAll(PDO::FETCH_ASSOC);

    /* ---------------------------
       Insert Picklist Children
    --------------------------- */
    $pklist_child_sp = $conn->prepare("EXEC dbo.[PKLIST_CHILD] ?, ?, ?, ?");

    foreach ($srn_rows as $row) {

        $SRN          = $row['BaseNum_SRN'];
        $BDestination = $row['Orgin_Dstnation'];

        $pklist_child_sp->execute([
            $PKNumber,
            $BDestination,
            $Userid,
            $SRN
        ]);
    }

    /* ---------------------------
       Insert Picklist Parent
    --------------------------- */
    $pklist_parent = $conn->prepare("EXEC dbo.[PKLIST_PARENT] ?, ?");
    $pklist_parent->execute([$PKNumber, $Userid]);

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Picklist created successfully.",
        "pkNumber" => $PKNumber
    ]);
} catch (PDOException $e) {

    if ($conn->inTransaction()) {
        $conn->rollback();
    }
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
