<?php

ob_start();
error_reporting(0);
@ini_set('display_errors', 0);
require_once "../config/connection.php";
require_once "../assets/plugins/fpdf/fpdf.php";

if (!isset($_GET['srn']) || !isset($_GET['picklist'])) {
    Header("Location: dirs/outgoing/dashboard/outgoing.php");
    return;
}

$srn = $_GET['srn'];
$picklist = $_GET['picklist'];

$stmt = $conn->prepare("SELECT * FROM SRN_REQUEST WHERE BaseNum_SRN = ?");
$stmt->execute([$srn]);

$item = $conn->prepare("SELECT RowNum, ItemBrand, ItemName, ItemGroup, Quantity FROM SRN_ITM WHERE BaseNum_SRN = ?");
$item->execute([$srn]);

$srnData = $stmt->fetch(PDO::FETCH_OBJ);
$itemData = $item->fetchAll(PDO::FETCH_OBJ);

$status = $srnData->RequestStatus;
$date = date("F d, Y", strtotime($srnData->DocDate));
$origin = $srnData->Orgin_Dstnation;
$purpose = $srnData->RequestPurpose;
$requestedBy = $srnData->PrepBy;
$remarks = $srnData->Remarks;
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

function headerDetails($pdf, $picklist, $srn, $status, $date, $origin)
{
    global $textColor;
    $labelWidth = 15;
    $colonWidth = 3;
    $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);

    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell($labelWidth, 5, 'PICKLIST ', 0, 0);
    $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
    $pdf->Cell(0, 5, $picklist, 0, 1);
    $pdf->SetFont('Arial', '', 9);
    $pdf->Cell($labelWidth, 5, 'SRN ', 0, 0);
    $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
    $pdf->Cell(0, 5, $srn, 0, 1);
    $pdf->Cell($labelWidth, 5, 'Status: ', 0, 0);
    $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
    $pdf->Cell(0, 5, $status, 0, 1);
    $pdf->Cell($labelWidth, 5, 'Date ', 0, 0);
    $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
    $pdf->Cell(0, 5, $date, 0, 1);
    $pdf->Cell($labelWidth, 5, 'Origin ', 0, 0);
    $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
    $pdf->Cell(0, 5, $origin, 0, 1);

    $pdf->Ln(1);
}

/* ---------- BOTTOM LEFT FUNCTION ---------- */

function bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $textColor)
{
    $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
    $pdf->SetY(-100);
    $pdf->SetX(10);

    // Purpose
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell(0, 5, 'Purpose of Request', 0, 1);

    $pdf->SetFont('Arial', '', 9);
    $pdf->Cell(0, 5, $purpose, 0, 1);

    $pdf->Ln(3);

    // Requested By
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell(0, 5, 'Requested by', 0, 1);

    $pdf->SetFont('Arial', '', 9);
    $pdf->Cell(0, 5, $requestedBy, 0, 1);

    $pdf->Ln(3);

    // Remarks
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell(0, 5, 'Remarks', 0, 1);

    $pdf->SetFont('Arial', '', 9);
    $pdf->Cell(0, 5, $remarks, 0, 1);
}

function renderItemsTable($pdf, $itemData, $textColor)
{
    /* ---------- TITLE ---------- */

    $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
    $pdf->Ln(3);
    $pdf->SetFont('Arial', 'B', 20);
    $pdf->Cell(0, 12, 'REQUEST', 0, 1, 'C');
    $pdf->Ln(3);

    $pdf->SetFont('Arial', 'B', 9);

    $headers = [
        '#' => 10,
        'Brand' => 60,
        'Model' => 60,
        'Category' => 40,
        'Quantity' => 20
    ];

    $pdf->SetFont('Arial', 'B', 9);
    $pdf->SetFillColor(255, 255, 0);
    foreach ($headers as $text => $width) {
        if ($text === '#') {
            $pdf->Cell($width, 5, $text, 1, 0, 'C', true);
        } else {
            $pdf->Cell($width, 5, $text, 1, 0, '', true);
        }
    }
    $pdf->Ln();
    $pdf->SetFont('Arial', '', 9);

    $i = 1;

    foreach ($itemData as $row) {
        $pdf->Cell($headers['#'], 5, $i, 1, 0, 'C');

        $brandWidth = max($headers['Brand'], $pdf->GetStringWidth($row->ItemBrand) + 4);
        $modelWidth = max($headers['Model'], $pdf->GetStringWidth($row->ItemName) + 4);
        $categoryWidth = max($headers['Category'], $pdf->GetStringWidth($row->ItemGroup) + 4);
        $quantityWidth = max($headers['Quantity'], $pdf->GetStringWidth($row->Quantity) + 4);

        $pdf->Cell($brandWidth, 5, $row->ItemBrand, 1, 0);
        $pdf->Cell($modelWidth, 5, $row->ItemName, 1, 0);
        $pdf->Cell($categoryWidth, 5, $row->ItemGroup, 1, 0);
        $pdf->Cell($quantityWidth, 5, $row->Quantity, 1, 1, 'C');

        $i++;
    }
}

/* ---------- HEADER ---------- */

headerDetails($pdf, $picklist, $srn, $status, $date, $origin);
renderItemsTable($pdf, $itemData, $textColor);
bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $textColor);

/* ---------- OUTPUT ---------- */

ob_end_clean();
$pdf->Output('I', 'Hello.pdf');
