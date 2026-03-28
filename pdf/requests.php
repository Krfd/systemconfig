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

    $branchName = $picklistItems[0]->ReqBranch ?? "N/A";
    $picklistNum = $picklistHeader->PickLst_Num ?? "N/A";
    $docDate = isset($picklistHeader->DocDate)
        ? date("m/d/y", strtotime($picklistHeader->DocDate))
        : "N/A";
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
            $this->Image('../assets/image/footer/footer.jpg', 10, 270, 190);
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

        function NbLines($w, $txt)
        {
            $cw = &$this->CurrentFont['cw'];

            if ($w == 0)
                $w = $this->w - $this->rMargin - $this->x;

            $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;

            $s = str_replace("\r", '', $txt);
            $nb = strlen($s);

            if ($nb > 0 && $s[$nb - 1] == "\n")
                $nb--;

            $sep = -1;
            $i = 0;
            $j = 0;
            $l = 0;
            $nl = 1;

            while ($i < $nb) {
                $c = $s[$i];

                if ($c == "\n") {
                    $i++;
                    $sep = -1;
                    $j = $i;
                    $l = 0;
                    $nl++;
                    continue;
                }

                if ($c == ' ')
                    $sep = $i;

                $l += $cw[$c];

                if ($l > $wmax) {
                    if ($sep == -1) {
                        if ($i == $j)
                            $i++;
                    } else
                        $i = $sep + 1;

                    $sep = -1;
                    $j = $i;
                    $l = 0;
                    $nl++;
                } else
                    $i++;
            }

            return $nl;
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
        $pdf->Cell($labelWidth, 5, 'Date ', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell(0, 5, $docDate, 0, 1);
        $pdf->Ln(1);
    }

    function renderItemsTable($pdf, $picklistNum, $itemData, $textColor)
    {
        /* ---------- TITLE ---------- */

        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->Ln(3);
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->Cell(0, 12, 'PICKLIST SUMMARY', 0, 1, 'C');
        $pdf->Ln(3);

        $pdf->SetFont('Arial', 'B', 9);

        /* ---------- FIXED HEADERS ---------- */

        $headers = [
            '#' => 10,
            'Brand' => 30,
            'Model' => 80,
            'Category' => 30,
            'Quantity' => 15,
            'Actual Qty' => 20
        ];

        /* ---------- TABLE HEADER ---------- */

        // $pdf->SetFillColor(255, 255, 0);
        foreach ($headers as $text => $width) {
            // $pdf->Cell($width, 6, $text, 1, 0, 'C', true);
            $pdf->Cell($width, 6, $text, 1, 0, 'C');
        }

        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);

        $lineHeight = 5;
        $counter = 1;

        /* ---------- TABLE ROWS ---------- */

        foreach ($itemData as $row) {

            $brandLines = $pdf->NbLines($headers['Brand'], $row->Brand);
            $modelLines = $pdf->NbLines($headers['Model'], $row->Model);
            $categoryLines = $pdf->NbLines($headers['Category'], $row->Category);

            $maxLines = max($brandLines, $modelLines, $categoryLines, 1);
            $rowHeight = $lineHeight * $maxLines;

            $x = $pdf->GetX();
            $y = $pdf->GetY();

            /* ---------- COLUMN # ---------- */

            $pdf->MultiCell($headers['#'], $rowHeight, $counter, 1, 'C');
            $pdf->SetXY($x + $headers['#'], $y);

            /* ---------- BRAND ---------- */

            $pdf->MultiCell($headers['Brand'], $rowHeight, $row->Brand, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'], $y);

            /* ---------- MODEL ---------- */

            $pdf->MultiCell($headers['Model'], $rowHeight, $row->Model, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'], $y);

            /* ---------- CATEGORY ---------- */

            $pdf->MultiCell($headers['Category'], $lineHeight, $row->Category, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'], $y);

            /* ---------- QUANTITY ---------- */

            $pdf->MultiCell($headers['Quantity'], $rowHeight, $row->Quantity, 1, 'C');
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'] + $headers['Quantity'], $y);

            /* ---------- ACTUAL QTY ---------- */

            $pdf->MultiCell($headers['Actual Qty'], $rowHeight, '', 1, 'C');

            $counter++;
        }
    }

    function bottomLeftDetails($pdf, $executedby, $printedby, $branchName, $textColor)
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
        $pdf->Cell(0, 5, $branchName, 0, 1);

        $pdf->Ln(3);
    }

    headerDetails($pdf, $picklistNum, $docDate);
    renderItemsTable($pdf, $picklistNum, $itemData, $textColor);
    bottomLeftDetails($pdf, $executedby, $printedby, $branchName, $textColor);

    ob_end_clean();
    $pdf->Output('I', $picklist . '.pdf');
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
}
