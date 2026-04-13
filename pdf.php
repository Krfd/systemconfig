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

        function Header()
        {
            // $this->Image('assets/image/header/header.png', 5, 10, 190);
            $this->Image('assets/image/logo/iap_icon.png', 10, 10, 30);
            $this->SetFont('Arial', 'B', 20);
            $pageWidth = $this->GetPageWidth();
            $this->SetX(10);
            $this->Cell($pageWidth - 10, 20, 'STOCK REQUEST', 0, 1, 'C');

            $this->Ln(10);
        }

        function Footer()
        {
            // $this->Image('assets/image/footer/footer.jpg', 10, 270, 190);
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

    function headerDetails($pdf, $srn, $status, $date, $origin)
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

        $pdf->Ln(3);
    }

    /* ---------- BOTTOM LEFT FUNCTION ---------- */

    function bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $timestamp, $textColor)
    {
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        // $pdf->SetY(-100);
        // $pdf->SetX(10);
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

        // $pdf->SetFont('Arial', '', 9);
        // $pdf->Cell(0, 5, 'Timestamp', 0, 1);

        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, $timestamp, 0, 1);
    }

    function renderItemsTable($pdf, $itemData, $textColor)
    {
        /* ---------- TITLE ---------- */
        $pdf->SetTextColor($textColor[0], $textColor[1], $textColor[2]);
        $pdf->Ln(3);

        $pdf->SetFont('Arial', 'B', 9);
        $headers = [
            '#' => 10,
            'Brand' => 35,
            'Model' => 80,
            'Category' => 40,
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
            $totalQty += $row->Request_Qty;

            // Calculate lines for each column
            $brandLines = $pdf->NbLines($headers['Brand'], $row->ItemBrand);
            $modelLines = $pdf->NbLines($headers['Model'], $row->ItemName);
            $categoryLines = $pdf->NbLines($headers['Category'], $row->ItemCategory);

            $maxLines = max($brandLines, $modelLines, $categoryLines, 1);
            $rowHeight = $lineHeight * $maxLines;

            $x = $pdf->GetX();
            $y = $pdf->GetY();

            /* ---------- COLUMN # ---------- */
            $pdf->MultiCell($headers['#'], $rowHeight, $i, 1, 'C');
            $pdf->SetXY($x + $headers['#'], $y);

            /* ---------- BRAND ---------- */
            $pdf->MultiCell($headers['Brand'], $rowHeight, $row->ItemBrand, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'], $y);

            /* ---------- MODEL ---------- */
            $modelText = $row->ItemName;

            // Shrink font if too wide
            if ($pdf->GetStringWidth($modelText) > $headers['Model']) {
                $pdf->SetFont('Arial', '', 8); // shrink font
            } else {
                $pdf->SetFont('Arial', '', 9); // normal font
            }

            // Output as a single line cell (no MultiCell)
            $pdf->Cell($headers['Model'], $rowHeight, $modelText, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'], $y);

            /* ---------- CATEGORY ---------- */
            $pdf->MultiCell($headers['Category'], $rowHeight, $row->ItemCategory, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'], $y);

            /* ---------- QUANTITY ---------- */
            $pdf->MultiCell($headers['Quantity'], $rowHeight, $row->Request_Qty, 1, 'C');

            $i++;
        }

        // ---------- TOTAL QUANTITY ----------
        $pdf->SetFont('Arial', 'B', 9);
        $labelWidth = $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'];
        $pdf->Cell($labelWidth, 6, 'Total Quantity', 1, 0, 'C');
        $pdf->Cell($headers['Quantity'], 6, $totalQty, 1, 1, 'C');
    }

    /* ---------- HEADER ---------- */

    headerDetails($pdf, $srn, $status, $date, $origin);
    renderItemsTable($pdf, $itemData, $textColor);
    bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $timestamp, $textColor);

    /* ---------- OUTPUT ---------- */

    ob_end_clean();
    $pdf->Output('I', 'Hello.pdf');
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo "Connection failed: " . $e->getMessage();
}
