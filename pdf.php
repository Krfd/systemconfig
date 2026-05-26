<?php

ob_start();
error_reporting(0);
@ini_set('display_errors', 0);
require_once "config/connection.php";
require_once "assets/plugins/fpdf/fpdf.php";

if (!isset($_GET['srn'])) {
    Header("Location: dirs/outgoing/dashboard/outgoing.php");
    return;
}
try {
    $srn = $_GET['srn'];
    $grouped = isset($_GET['grouped']) && $_GET['grouped'] == 1;

    $stmt = $conn->prepare("SELECT * FROM Stock_Transfer_Header_1 WHERE SR_Number = ?");
    $stmt->execute([$srn]);

    $item = $conn->prepare("SELECT * FROM Stock_Transfer_Items_3 WHERE SR_Number = ?");
    $item->execute([$srn]);

    $srnData = $stmt->fetch(PDO::FETCH_OBJ);
    $itemData = $item->fetchAll(PDO::FETCH_OBJ);

    $status = $srnData->RequestStatus;
    $date = isset($srnData->RequestDate)
        ? date("m/d/y", strtotime($srnData->RequestDate))
        : "N/A";
    $origin = $itemData[0]->BranchOrigin;
    $purpose = $srnData->PurposeRequest;
    $requestedBy = $srnData->RequestedBy;
    $remarks = empty($srnData->Remarks) ? "N/A" : $srnData->Remarks;
    $datetimeStr = $date . ' ' . $srnData->RequestTime;
    $timestamp = date("m/d/y h:i A", strtotime($datetimeStr));
    $textColor = [50, 50, 50];

    class PDF extends FPDF
    {
        public $categoryTitle = '';
        function Header()
        {
            // $this->Image('assets/image/logo/iap_icon.png', 10, 10, 30);
            $this->Image('assets/image/logo/iap_icon.png', 10, 10, 20);
            // $this->SetFont('Arial', 'B', 20);
            $this->SetFont('Arial', 'B', 32);
            $this->SetTextColor(64, 64, 64);
            $pageWidth = $this->GetPageWidth();
            // $this->SetX(10);
            $this->SetX(12);
            // $this->Cell($pageWidth - 10, 20, 'STOCK REQUEST', 0, 0, 'C');
            $this->Cell($pageWidth - 15, 20, 'STOCK REQUEST', 0, 0, 'C');
            $this->Ln(25);
        }

        function Footer()
        {
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
    // $pdf->AddPage();

    function headerDetails($pdf, $srn, $status, $date, $origin, $category = '')
    {
        global $textColor;

        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);

        $labelWidth = 15;
        $colonWidth = 3;
        $valueWidth = 60;

        // total width of right block
        $rightBlockWidth = $labelWidth + $colonWidth + $valueWidth;

        $pdf->SetFont('Arial', 'B', 9);

        /* ---------- ROW 1 ---------- */
        // SRN (left)
        $pdf->Cell($labelWidth, 5, 'SRN', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell($valueWidth, 5, $srn, 0, 0);

        // Move to RIGHT EDGE
        $pdf->SetX($pdf->GetPageWidth() - $rightBlockWidth + 30);

        // Status (right)
        $pdf->Cell($labelWidth, 5, 'Status', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell($valueWidth, 5, $status, 0, 1);

        $pdf->SetFont('Arial', '', 9);

        /* ---------- ROW 2 ---------- */
        // Origin (left)
        $pdf->Cell($labelWidth, 5, 'Origin', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell($valueWidth, 5, $origin, 0, 0);

        // Move to RIGHT EDGE again
        $pdf->SetX($pdf->GetPageWidth() - $rightBlockWidth + 30);

        // Date (right)
        $pdf->Cell($labelWidth, 5, 'Date', 0, 0);
        $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
        $pdf->Cell($valueWidth, 5, $date, 0, 1);

        /* ---------- ROW 3 (CATEGORY) ---------- */
        if (!empty($category)) {
            $pdf->SetFont('Arial', 'B', 9);
            $pdf->Cell($labelWidth, 5, 'Category', 0, 0);
            $pdf->Cell($colonWidth, 5, ':', 0, 0, 'C');
            $pdf->Cell($valueWidth, 5, $category, 0, 1);
        }

        $pdf->Ln(3);
    }

    /* ---------- BOTTOM LEFT FUNCTION ---------- */

    function bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $timestamp, $textColor)
    {
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->Ln(5); // 5mm gap after table
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

        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, $timestamp, 0, 1);
    }

    function renderItemsTable($pdf, $itemData, $textColor, $grouped)
    {
        /* ---------- TITLE ---------- */
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->Ln(3);

        $pdf->SetFont('Arial', 'B', 9);

        /* ---------- SWAPPED HEADERS ---------- */
        $headers = [
            '#' => 10,
            'Category' => 40,
            'Model' => 80,
            'Brand' => 35,
            'Quantity' => 20
        ];

        // Header row
        foreach ($headers as $text => $width) {
            $pdf->Cell($width, 6, $text, 1, 0, 'C');
        }
        $pdf->Ln();

        $pdf->SetFont('Arial', '', 9);

        $lineHeight = 5;
        $i = 1;
        $totalQty = 0;

        foreach ($itemData as $row) {

            $qty = (int) $row->Request_Qty;
            $totalQty += $qty;

            // Calculate lines for wrapping
            $categoryLines = $pdf->NbLines($headers['Category'], $row->ItemCategory);
            $modelLines    = $pdf->NbLines($headers['Model'], $row->ItemName);
            $brandLines    = $pdf->NbLines($headers['Brand'], $row->ItemBrand);

            $maxLines = max($categoryLines, $modelLines, $brandLines, 1);
            $rowHeight = $lineHeight * $maxLines;

            $x = $pdf->GetX();
            $y = $pdf->GetY();

            /* ---------- # ---------- */
            $pdf->MultiCell($headers['#'], $rowHeight, $i, 1, 'C');
            $pdf->SetXY($x + $headers['#'], $y);

            /* ---------- CATEGORY (swapped in) ---------- */
            $pdf->MultiCell($headers['Category'], $rowHeight, $row->ItemCategory, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Category'], $y);

            /* ---------- MODEL ---------- */
            $modelText = $row->ItemName;

            if ($pdf->GetStringWidth($modelText) > $headers['Model']) {
                $pdf->SetFont('Arial', '', 8);
            } else {
                $pdf->SetFont('Arial', '', 9);
            }

            $pdf->Cell($headers['Model'], $rowHeight, $modelText, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Category'] + $headers['Model'], $y);

            /* ---------- BRAND (swapped in) ---------- */
            $pdf->SetFont('Arial', '', 9); // reset font just in case
            $pdf->MultiCell($headers['Brand'], $rowHeight, $row->ItemBrand, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Category'] + $headers['Model'] + $headers['Brand'], $y);

            /* ---------- QUANTITY ---------- */
            $pdf->MultiCell($headers['Quantity'], $rowHeight, $qty, 1, 'C');

            $i++;
        }

        /* ---------- TOTAL QUANTITY ---------- */
        $pdf->SetFont('Arial', 'B', 9);

        $labelWidth = $headers['#'] + $headers['Category'] + $headers['Model'] + $headers['Brand'];

        $pdf->Cell($labelWidth, 6, 'Total Quantity', 1, 0, 'C');
        $pdf->Cell($headers['Quantity'], 6, $totalQty, 1, 1, 'C');
    }

    $groupedItems = [];

    foreach ($itemData as $row) {
        $category = $row->ItemCategory ?? 'Uncategorized';
        $groupedItems[$category][] = $row;
    }

    // CATEGORIZED ITEM
    if ($grouped) {
        foreach ($groupedItems as $category => $items) {
            $pdf->categoryTitle = $category;
            $pdf->AddPage();

            headerDetails($pdf, $srn, $status, $date, $origin, $category);

            $pdf->Ln(2);

            // PASS CORRECT VARIABLE HERE
            renderItemsTable($pdf, $items, $textColor, false);
            bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $timestamp, $textColor);
        }
    }

    // NON-CATEGORIZED ITEM
    else {
        $pdf->categoryTitle = '';
        $pdf->AddPage();
        headerDetails($pdf, $srn, $status, $date, $origin, '');
        renderItemsTable($pdf, $itemData, $textColor, $grouped);
        bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $timestamp, $textColor);
    }
    /* ---------- OUTPUT ---------- */

    ob_end_clean();
    $pdf->Output('I', $srn . '.pdf');
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo "Connection failed: " . $e->getMessage();
}
