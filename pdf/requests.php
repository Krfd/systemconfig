<?php

ob_start();
error_reporting(0);
@ini_set('display_errors', 0);
require_once "../config/connection.php";
require_once "../assets/plugins/fpdf/fpdf.php";
session_start();

if (!isset($_GET['DocEntry']) || empty($_SESSION['Uid'])) {
    Header("Location: dirs/outgoing/dashboard/outgoing.php");
    return;
}

$DocEntry = $_GET['DocEntry'];
$executedBy = $_GET['executedBy'] ?? '';
$Uid = $_SESSION['Uid'];

try {

    $picklistData = $conn->prepare("EXEC dbo.[PDF_Picklist_Items] ?, ?");
    $picklistData->execute([$Uid, $DocEntry]);

    $picklistHeader = $picklistData->fetch(PDO::FETCH_OBJ);

    $picklistData->nextRowset();
    $branchData =  $picklistData->fetchAll(PDO::FETCH_OBJ);

    $picklistData->nextRowset();
    $picklistItems = $picklistData->fetchAll(PDO::FETCH_OBJ);

    $branchName = $picklistHeader->Req_Branch ?? "N/A";
    $picklistNum = $picklistHeader->PKList_Number ?? "N/A";
    $docDate = isset($picklistHeader->DocDate)
        ? date("m/d/y", strtotime($picklistHeader->DocDate))
        : "N/A";
    $timestamp = date("m/d/y h:i A", strtotime($picklistHeader->DocDate));
    $executedby = $executedBy ?? "N/A";
    $printedby = $picklistHeader->PickedBy ?? "N/A";
    $itemData = $picklistItems;

    $textColor = [50, 50, 50];

    class PDF extends FPDF
    {

        function Header()
        {
            $this->Image('../assets/image/logo/iap_icon.png', 10, 10, 30);
            $this->SetFont('Arial', 'B', 20);
            $pageWidth = $this->GetPageWidth();
            $this->SetX(10);
            $this->Cell($pageWidth - 10, 20, 'PICKLIST SUMMARY', 0, 1, 'C');

            $this->Ln(10);
        }

        function Footer()
        {
            // $this->Image('../assets/image/footer/footer.jpg', 10, 270, 190);
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

        foreach ($headers as $text => $width) {
            $pdf->Cell($width, 6, $text, 1, 0, 'C');
        }

        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);

        $lineHeight = 5;
        $counter = 1;

        /* ---------- TABLE ROWS ---------- */
        foreach ($itemData as $row) {

            // Step 1: calculate max lines
            $brandLines = $pdf->NbLines($headers['Brand'], $row->Req_ItemBrand);
            $modelLines = $pdf->NbLines($headers['Model'], $row->Req_ItemName);
            $categoryLines = $pdf->NbLines($headers['Category'], $row->Req_ItemCategory);
            $qtyLines = $pdf->NbLines($headers['Quantity'], number_format($row->Req_Item_Qty ?? 0, 0));
            $actualLines = $pdf->NbLines($headers['Actual Qty'], $row->Actual_Item_Qty !== null ? number_format($row->Actual_Item_Qty, 0) : '');

            $maxLines = max($brandLines, $modelLines, $categoryLines, $qtyLines, $actualLines, 1);
            $rowHeight = $lineHeight * $maxLines;

            $x = $pdf->GetX();
            $y = $pdf->GetY();

            // Step 2: draw cells with border first
            $pdf->Rect($x, $y, $headers['#'], $rowHeight); // Column #
            $pdf->Rect($x + $headers['#'], $y, $headers['Brand'], $rowHeight);
            $pdf->Rect($x + $headers['#'] + $headers['Brand'], $y, $headers['Model'], $rowHeight);
            $pdf->Rect($x + $headers['#'] + $headers['Brand'] + $headers['Model'], $y, $headers['Category'], $rowHeight);
            $pdf->Rect($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'], $y, $headers['Quantity'], $rowHeight);
            $pdf->Rect($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'] + $headers['Quantity'], $y, $headers['Actual Qty'], $rowHeight);

            // Step 3: print text inside each cell using MultiCell but with ln=0 so Y doesn’t move
            $pdf->SetXY($x, $y);
            $pdf->MultiCell($headers['#'], $lineHeight, $counter, 0, 'C', false);
            $pdf->SetXY($x + $headers['#'], $y);
            $pdf->MultiCell($headers['Brand'], $lineHeight, $row->Req_ItemBrand, 0);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'], $y);
            $pdf->MultiCell($headers['Model'], $lineHeight, $row->Req_ItemName, 0);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'], $y);
            $pdf->MultiCell($headers['Category'], $lineHeight, $row->Req_ItemCategory, 0);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'], $y);
            $pdf->MultiCell($headers['Quantity'], $lineHeight, number_format($row->Req_Item_Qty ?? 0, 0), 0, 'C');
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'] + $headers['Quantity'], $y);
            $pdf->MultiCell($headers['Actual Qty'], $lineHeight, $row->Actual_Item_Qty !== null ? number_format($row->Actual_Item_Qty, 0) : '', 0, 'C');

            // Step 4: move Y by full row height
            $pdf->SetY($y + $rowHeight);

            $counter++;
        }
    }

    function bottomLeftDetails($pdf, $executedby, $picklistItems, $printedby, $timestamp, $textColor)
    {
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->Ln(5); // gap after table

        $leftX = 10;
        $rightX = 160; // adjust depending on your page width

        $startY = $pdf->GetY();

        /** ---------------- LEFT COLUMN ---------------- **/
        $pdf->SetXY($leftX, $startY);

        // Requesting Branch
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(0, 5, 'Requesting Branch', 0, 1);

        $pdf->SetX($leftX);
        $pdf->SetFont('Arial', '', 9);
        $lines = [];

        foreach ($picklistItems as $item) {
            $branch = $item->Req_Branch ?? '';
            $srn = $item->SR_Number ?? '';

            if ($branch || $srn) {
                $lines[] = "{$branch} - {$srn}";
            }
        }
        $lines = array_unique($lines);

        $pdf->SetFont('Arial', '', 9);
        foreach ($lines as $line) {
            $pdf->SetX($leftX);
            $pdf->Cell(80, 5, $line, 0, 1);
        }

        $pdf->Ln(2);

        // Printed By
        $pdf->SetX($leftX);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(0, 5, 'Printed by', 0, 1);

        $pdf->SetX($leftX);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, $printedby, 0, 1);

        $pdf->SetX($leftX);
        $pdf->Cell(0, 5, $timestamp, 0, 1);


        /** ---------------- RIGHT COLUMN ---------------- **/
        $pdf->SetXY($rightX, $startY);

        // Executed By
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(60, 5, 'Executed by', 0, 1);

        $pdf->SetX($rightX);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(60, 5, $executedby, 0, 1);

        $pdf->Ln(3);
    }

    headerDetails($pdf, $picklistNum, $docDate);
    renderItemsTable($pdf, $picklistNum, $itemData, $textColor);
    bottomLeftDetails($pdf, $executedby, $picklistItems, $printedby, $timestamp, $textColor);
    ob_end_clean();
    $pdf->Output('I', $picklistNum . '.pdf');
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
}
