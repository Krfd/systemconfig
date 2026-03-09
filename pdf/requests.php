<?php

ob_start();
error_reporting(0);
@ini_set('display_errors', 0);
require_once "../config/connection.php";
require_once "../assets/plugins/fpdf/fpdf.php";
session_start();

if (!isset($_GET['picklist']) || empty($_SESSION['Uid'])) {
    Header("Location: dirs/outgoing/dashboard/outgoing.php");
    return;
}

$picklist = $_GET['picklist'];
$Uid = $_SESSION['Uid'];

try {
    $picklistData = $conn->prepare("EXEC dbo.[PRINT_PDF_PICK_LIST] ?, ?");
    $picklistData->execute([$Uid, $picklist]);

    $picklistHeader = $picklistData->fetch(PDO::FETCH_OBJ);
    $picklistData->nextRowset();
    $picklistItems = $picklistData->fetchAll(PDO::FETCH_OBJ);
    $picklistData->nextRowset();
    $branchData =  $picklistData->fetchAll(PDO::FETCH_OBJ);
    $branchName = $branchData[0]->ReqBranch ?? "N/A";
    $picklistNum = $picklistHeader->PickLst_Num ?? "N/A";
    $docDate = $picklistHeader->DocDate ?? "N/A";
    $executedby = $picklistHeader->Executedby ?? "N/A";
    $printedby = $picklistHeader->Executedby ?? "N/A";
    $itemData = $picklistItems;

    $textColor = [50, 50, 50];

    class PDF extends FPDF
    {

        function Header()
        {
            $this->Image('../assets/image/header/header.png', 5, 10, 190);
            $this->Ln(35);
        }

        function Footer()
        {
            $this->Image('../assets/image/footer/alphamin.png', 5, 260, 180);
            $this->SetTextColor($GLOBALS['textColor'][0], $GLOBALS['textColor'][1], $GLOBALS['textColor'][2]);
            $this->SetY(-15);
            $this->SetFont('Arial', '', 8);
            $this->SetTextColor(120, 120, 120);

            $this->Cell(
                0,
                10,
                'Page ' . $this->PageNo() . ' of {nb}',
                0,
                0,
                'C'
            );
        }
    }

    $pdf = new PDF();
    $pdf->AliasNbPages();
    $pdf->AddPage();

    function headerDetails($pdf, $picklistNum, $docDate)
    {
        global $textColor;
        $labelWidth = 15;
        $colonWidth = 3;
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell($labelWidth, 5, 'PICKLIST ', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell(0, 5, $picklistNum, 0, 1);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell($labelWidth, 5, 'Date: ', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell(0, 5, $docDate, 0, 1);
        $pdf->Cell($labelWidth, 5, 'To: ', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell(0, 5, 'Requesting Branch', 0, 1);
        $pdf->Ln(1);
    }

    function renderItemsTable($pdf, $picklistNum, $itemData, $textColor)
    {
        /* ---------- TITLE ---------- */

        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->Ln(3);
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->Cell(0, 12, 'PICKLIST ' . $picklistNum, 0, 1, 'C');
        $pdf->Ln(3);

        $pdf->SetFont('Arial', 'B', 9);

        // Header to data mapping
        $columns = [
            'Branch' => 'ReqBranch',
            'Brand' => 'Brand',
            'Model' => 'Model',
            'Category' => 'Category',
            'Quantity' => 'Quantity',
            'Actual Quantity' => null
        ];

        $widths = [];

        /* ---------- CALCULATE MAX WIDTH ---------- */

        foreach ($columns as $header => $field) {

            // Start with header width
            $maxWidth = $pdf->GetStringWidth($header) + 6;

            if ($field !== null) {
                foreach ($itemData as $row) {
                    $value = $row->$field ?? '';
                    $maxWidth = max($maxWidth, $pdf->GetStringWidth($value) + 6);
                }
            }

            $widths[$header] = $maxWidth;
        }

        /* ---------- TABLE HEADER ---------- */

        $pdf->SetFillColor(255, 255, 0);

        foreach ($widths as $header => $width) {
            $pdf->Cell($width, 6, $header, 1, 0, 'C', true);
        }

        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);

        /* ---------- TABLE ROWS ---------- */

        foreach ($itemData as $row) {

            foreach ($columns as $header => $field) {

                $value = $field ? ($row->$field ?? '') : '';

                $align = ($header == 'Quantity' || $header == 'Actual Quantity') ? 'C' : 'L';

                $pdf->Cell($widths[$header], 5, $value, 1, 0, $align);
            }

            $pdf->Ln();
        }
    }

    function bottomLeftDetails($pdf, $executedby, $printedby, $textColor)
    {
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->SetY(-100);
        $pdf->SetX(10);

        // Purpose
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(0, 5, 'Executed by', 0, 1);

        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, $executedby, 0, 1);

        $pdf->Ln(3);

        // Requested By
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(0, 5, 'Printed by', 0, 1);

        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, $printedby, 0, 1);

        $pdf->Ln(3);
    }

    headerDetails($pdf, $picklistNum, $docDate);
    renderItemsTable($pdf, $picklistNum, $itemData, $textColor);
    bottomLeftDetails($pdf, $executedby, $printedby, $textColor);

    ob_end_clean();
    $pdf->Output('I', $picklist . '.pdf');
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
}
