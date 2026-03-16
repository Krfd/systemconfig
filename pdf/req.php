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

try {
    $srn = $_GET['srn'];
    $picklist = $_GET['picklist'];

    $stmt = $conn->prepare("SELECT * FROM SRN_REQUEST WHERE BaseNum_SRN = ?");
    $stmt->execute([$srn]);

    $item = $conn->prepare("SELECT RowNum, ItemBrand, ItemName, ItemGroup, Quantity FROM SRN_ITM WHERE BaseNum_SRN = ?");
    $item->execute([$srn]);

    $srnData = $stmt->fetch(PDO::FETCH_OBJ);
    $itemData = $item->fetchAll(PDO::FETCH_OBJ);

    $status = $srnData->RequestStatus;
    // $date = date("F d, Y", strtotime($srnData->DocDate));
    $date = isset($srnData->DocDate)
        ? date("m/d/y", strtotime($srnData->DocDate))
        : "N/A";
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
            'Brand' => 35,
            'Model' => 80,
            'Category' => 40,
            'Quantity' => 20
        ];

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetFillColor(255, 255, 0);
        foreach ($headers as $text => $width) {
            $pdf->Cell($width, 5, $text, 1, 0, 'C', true);
        }
        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);

        $lineHeight = 5;
        $i = 1;
        $totalQty = 0;

        foreach ($itemData as $row) {
            $totalQty += $row->Quantity;

            $brandLines = $pdf->NbLines($headers['Brand'], $row->ItemBrand);
            $modelLines = $pdf->NbLines($headers['Model'], $row->ItemName);
            $categoryLines = $pdf->NbLines($headers['Category'], $row->ItemGroup);

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
            $pdf->MultiCell($headers['Category'], $rowHeight, $row->ItemGroup, 1);
            $pdf->SetXY($x + $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'], $y);

            /* ---------- QUANTITY ---------- */
            $pdf->MultiCell($headers['Quantity'], $rowHeight, $row->Quantity, 1, 'C');

            $i++;
        }

        $pdf->SetFont('Arial', 'B', 9);

        // ---------- TOTAL QUANTITY ----------
        $pdf->SetFont('Arial', 'B', 9);
        $labelWidth = $headers['#'] + $headers['Brand'] + $headers['Model'] + $headers['Category'];
        $pdf->Cell($labelWidth, 6, 'Total Quantity', 1, 0, 'R');
        $pdf->Cell($headers['Quantity'], 6, $totalQty, 1, 1, 'C');
    }

    /* ---------- HEADER ---------- */

    headerDetails($pdf, $picklist, $srn, $status, $date, $origin);
    renderItemsTable($pdf, $itemData, $textColor);
    bottomLeftDetails($pdf, $purpose, $requestedBy, $remarks, $textColor);

    /* ---------- OUTPUT ---------- */

    ob_end_clean();
    $pdf->Output('I', 'Hello.pdf');
} catch (PDOException $e) {
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    echo "Connection failed: " . $e->getMessage();
}
