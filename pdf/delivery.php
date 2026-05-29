<?php

ob_start();
error_reporting(0);
@ini_set('display_errors', 0);
require_once "../config/connection.php";
require_once "../assets/plugins/fpdf/fpdf.php";
require_once "../vendor/autoload.php";
session_start();

use Picqer\Barcode\BarcodeGeneratorPNG;

$User = $_SESSION['Uid'];

$batch = $_GET['batch'] ?? '';
$branches = [];

if (!empty($_GET['branches'])) {
    $raw = explode(',', $_GET['branches']);

    foreach ($raw as $b) {
        $b = trim($b);

        $b = trim($b, "[]\"'");

        if ($b !== '') {
            $branches[] = $b;
        }
    }
}

$stmt = $conn->prepare("EXEC dbo.[Print_Delivery_Items] ?, ?");
$stmt->execute([$User, $batch]);
$header = $stmt->fetchAll(PDO::FETCH_ASSOC);
$stmt->nextRowset();
$itemData = $stmt->fetchAll(PDO::FETCH_ASSOC);

$firstRow = $header[0] ?? [];
$deliveryDate  = isset($firstRow['DeliveryDate']) ? date('M d, Y', strtotime($firstRow['DocDate'])) : "N/A";

$driver   = $firstRow['Driver'] ?? '';
$truckCat = $firstRow['TruckCategory'] ?? '';
$plate    = $firstRow['TruckPlate'] ?? '';

$prepby   = $firstRow['ModifyBy'] ?? '';
$remarks  = $firstRow['Remarks'] ?? 'N/A';
$origin   = $firstRow['BranchSet'] ?? "N/A";
$status   = $firstRow['DocStatus'] ?? "N/A";
$docDate  = isset($firstRow['DocDate']) ? date('M d, Y', strtotime($firstRow['DocDate'])) : "N/A";
class PDF extends FPDF
{

    public $branch;
    public $series;

    function setData($branch, $series)
    {
        $this->branch = $branch;
        $this->series = $series;
    }

    // function Header()
    // {
    //     $logoX = 10;
    //     $logoY = 10;
    //     $logoW = 20;

    //     $this->Image('../assets/image/logo/iap_icon.png', $logoX, $logoY, $logoW);

    //     $this->SetFont('Arial', 'B', 30);
    //     $this->SetTextColor(64, 64, 64);

    //     $pageWidth = $this->GetPageWidth();

    //     $title = $this->series ?? '';

    //     // true center of page
    //     $textWidth = $this->GetStringWidth($title);
    //     $centerX = ($pageWidth - $textWidth) / 2;

    //     // logo constraint (left safe area)
    //     $minX = $logoX + $logoW + 5;

    //     if ($centerX < $minX) {
    //         $centerX = $minX;
    //     }

    //     // 🔥 balance shift so it doesn't look "pushed right"
    //     $shift = $centerX - $minX;
    //     $centerX = $centerX - ($shift / 2);

    //     $this->SetXY($centerX, 10);
    //     $this->Cell($textWidth, 10, $title, 0, 0, 'C');
    // }


    function Header()
    {
        $logoX = 10;
        $logoY = 10;
        $logoW = 20;

        $this->Image('../assets/image/logo/iap_icon.png', $logoX, $logoY, $logoW);

        $pageWidth = $this->GetPageWidth();

        $mainTitle = 'Stock Delivery';

        $refTitle = !empty($this->series)
            ? 'Ref No: ' . $this->series
            : '';

        $minX = $logoX + $logoW + 5;

        // ===== MAIN TITLE =====
        $this->SetFont('Arial', 'B', 22);
        $this->SetTextColor(64, 64, 64);

        $mainTextWidth = $this->GetStringWidth($mainTitle);
        $mainCenterX = ($pageWidth - $mainTextWidth) / 5;

        if ($mainCenterX < $minX) {
            $mainCenterX = $minX;
        }

        // ===== REF TITLE =====
        $this->SetFont('Arial', 'B', 12);

        $refTextWidth = $this->GetStringWidth($refTitle);
        $refCenterX = ($pageWidth - $refTextWidth) / 2;

        if ($refCenterX < $minX) {
            $refCenterX = $minX;
        }

        // ===== Vertical positioning =====
        $mainTextY = 10;
        $refTextY = 18;

        // Draw main title
        $this->SetFont('Arial', 'B', 22);
        $this->SetXY($mainCenterX, $mainTextY);
        $this->Cell($mainTextWidth, 8, $mainTitle, 0, 0, 'C');

        // Draw ref no
        $this->SetFont('Arial', 'B', 12);
        $this->SetXY($refCenterX, $refTextY);
        $this->Cell($refTextWidth, 6, $refTitle, 0, 0, 'C');
    }

    function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial', '', 8);
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

function headerDetails($pdf, $deliveryDate, $branch, $origin, $status, $docDate)
{
    $pdf->SetFont('Arial', '', 9);

    $pageWidth = $pdf->GetPageWidth() - 24;

    $leftWidth = $pageWidth / 2;
    $rightWidth = $pageWidth / 2;

    $pdf->Cell($leftWidth, 6, sprintf('%-19s %s', 'Requesting Branch: ', $branch), 0, 0, 'L');
    $pdf->Cell($rightWidth, 6, sprintf('%-15s %s', 'Status: ', $status), 0, 1, 'R');
    $pdf->Cell($leftWidth, 6, sprintf('%-24s %s', 'Origin Branch: ', $origin), 0, 0, 'L');
    $pdf->Cell($rightWidth, 6, sprintf('%-20s %s', 'Delivery Date: ', $deliveryDate), 0, 1, 'R');
    $pdf->SetX($pdf->GetPageWidth() - 55);
    $pdf->Cell(41, 6, sprintf('%-20s %s', 'Document Date: ', $docDate), 0, 1, 'R');

    $pdf->Ln(2);
}

$itemsByBranch = [];
$seriesByBranch = [];

foreach ($itemData as $row) {

    $branch = $row['RequestingBranch'] ?? $row['Branch'] ?? 'UNKNOWN';

    // group items per branch
    $itemsByBranch[$branch][] = $row;

    // assign reference number per branch (first occurrence wins)
    if (!isset($seriesByBranch[$branch])) {
        // $seriesByBranch[$branch] = $row['ReferenceNumber'] ?? '';

        $get_ref = $conn->prepare("EXEC Get_Branch_Reference ?, ?");
        $get_ref->execute([$batch, $branch]);

        $refResult = $get_ref->fetch(PDO::FETCH_ASSOC);
        if ($refResult && !empty($refResult['ReferenceNumber'])) {
            $seriesByBranch[$branch] = $refResult['ReferenceNumber'];
        }
    }
}

function renderItemsTable($pdf, $itemData)
{
    $pdf->Ln(3);
    $pdf->SetFont('Arial', 'B', 9);

    $headers = [
        '#' => 10,
        'Category' => 50,
        'Model' => 80,
        'Brand' => 30,
        'Quantity' => 15,
    ];

    foreach ($headers as $text => $width) {
        $pdf->Cell($width, 6, $text, 1, 0, 'C');
    }

    $pdf->Ln();

    $pdf->SetFont('Arial', '', 9);

    $lineHeight = 5;
    $counter = 1;
    $totalQty = 0;

    $groupedItems = [];

    foreach ($itemData as $row) {

        $modelRaw = $row['ItemName'] ?? '';
        $brandRaw = $row['ItemBrand'] ?? '';
        $categoryRaw = $row['ItemCategory'] ?? '';
        $quantity = (int)($row['AllocatedQty'] ?? 0);

        $key = $modelRaw . '|' . $brandRaw . '|' . $categoryRaw;

        if (!isset($groupedItems[$key])) {
            $groupedItems[$key] = [
                'model' => $modelRaw,
                'brand' => $brandRaw,
                'category' => $categoryRaw,
                'quantity' => 0
            ];
        }

        $groupedItems[$key]['quantity'] += $quantity;
    }

    foreach ($groupedItems  as $row) {

        $brand = $row['brand'];
        $model = $row['model'];
        $category = $row['category'];
        $quantity = $row['quantity'];
        $totalQty += (int)$quantity;

        $x = $pdf->GetX();
        $y = $pdf->GetY();

        $brandLines = $pdf->NbLines($headers['Brand'], $brand);
        $modelLines = $pdf->NbLines($headers['Model'], $model);
        $categoryLines = $pdf->NbLines($headers['Category'], $category);

        $maxLines = max($brandLines, $modelLines, $categoryLines, 1);
        $rowHeight = $lineHeight * $maxLines;

        // Column 1 (#)
        $pdf->Rect($x, $y, $headers['#'], $rowHeight);
        $pdf->SetXY($x, $y);
        $pdf->MultiCell($headers['#'], $lineHeight, $counter, 0, 'C');

        // Column 2 (Category)
        $pdf->SetXY($x + $headers['#'], $y);
        $pdf->Rect($x + $headers['#'], $y, $headers['Category'], $rowHeight);
        $pdf->MultiCell($headers['Category'], $lineHeight, $category, 0);

        // Column 3 (Model)
        $pdf->SetXY($x + $headers['#'] + $headers['Category'], $y);
        $pdf->Rect($x + $headers['#'] + $headers['Category'], $y, $headers['Model'], $rowHeight);
        $pdf->MultiCell($headers['Model'], $lineHeight, $model, 0);

        // Column 4 (Brand)
        $pdf->SetXY($x + $headers['#'] + $headers['Category'] + $headers['Model'], $y);
        $pdf->Rect($x + $headers['#'] + $headers['Category'] + $headers['Model'], $y, $headers['Brand'], $rowHeight);
        $pdf->MultiCell($headers['Brand'], $lineHeight, $brand, 0);

        // Column 5 (Quantity)
        $pdf->SetXY($x + array_sum($headers) - $headers['Quantity'], $y);
        $pdf->Rect($x + array_sum($headers) - $headers['Quantity'], $y, $headers['Quantity'], $rowHeight);
        $pdf->MultiCell($headers['Quantity'], $lineHeight, $quantity, 0, 'C');

        // FORCE MOVE TO NEXT ROW (IMPORTANT FIX)
        $pdf->SetXY($x, $y + $rowHeight);

        $counter++;
    }

    $pdf->Ln(2);
    $pdf->SetFont('Arial', 'B', 10);

    // Align total to the right side (same as Quantity column)
    $totalWidth = array_sum($headers) - $headers['Quantity'];

    $pdf->Cell($totalWidth, 6, 'Total Quantity:', 1, 0, 'R');
    $pdf->Cell($headers['Quantity'], 6, $totalQty, 1, 1, 'C');
}

function footerDetails($pdf, $driver, $truckCat, $plate, $prepby, $remarks)
{
    date_default_timezone_set('Asia/Manila');

    $pdf->Ln(5);
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->Cell(0, 6, 'Delivery Details:', 0, 1, 'L');

    $pdf->SetFont('Arial', '', 9);

    $leftIndent = 20;

    $labelWidth = 30;
    $valueWidth = 120;

    $pdf->SetX($leftIndent);
    $pdf->Cell($labelWidth, 6, 'Driver:', 0, 0, 'L');
    $pdf->Cell($valueWidth, 6, $driver, 0, 1, 'L');

    // TRUCK CATEGORY
    $pdf->SetX($leftIndent);
    $pdf->Cell($labelWidth, 6, 'Truck Category:', 0, 0, 'L');
    $pdf->Cell($valueWidth, 6, $truckCat, 0, 1, 'L');

    // PLATE NO
    $pdf->SetX($leftIndent);
    $pdf->Cell($labelWidth, 6, 'Plate No:', 0, 0, 'L');
    $pdf->Cell($valueWidth, 6, $plate, 0, 1, 'L');

    // PREPARED BY
    $pdf->SetX($leftIndent);
    $pdf->Cell($labelWidth, 6, 'Prepared By:', 0, 0, 'L');
    $pdf->Cell($valueWidth, 6, $prepby, 0, 1, 'L');

    // REMARKS
    $pdf->SetX($leftIndent);
    $pdf->Cell($labelWidth, 6, 'Remarks:', 0, 0, 'L');
    $pdf->Cell($valueWidth, 6, $remarks, 0, 1, 'L');

    $pdf->SetY(-15);

    // Disable auto page break temporarily
    $pdf->SetAutoPageBreak(false);

    // Position near bottom
    $pdf->SetY(-20);
    $pdf->SetFont('Arial', '', 8);

    $pdf->Cell(
        0,
        6,
        'Printed: ' . date('M d, Y h:i A'),
        0,
        1,
        'R'
    );

    // Restore auto page break
    $pdf->SetAutoPageBreak(true, 15);
}

try {
    $fileName = 'delivery.pdf';

    $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();

    $barcodeValue = $batch ?: 'NO_BATCH';

    $barcodeData = $generator->getBarcode(
        $barcodeValue,
        $generator::TYPE_CODE_128
    );

    // save to temp file
    $barcodeFile = sys_get_temp_dir() . "/barcode_" . session_id() . ".png";

    file_put_contents($barcodeFile, $barcodeData);
    foreach ($branches as $branch) {

        $branchItems = $itemsByBranch[$branch] ?? [];

        if (empty($branchItems)) {
            continue;
        }

        $series = $seriesByBranch[$branch] ?? '';

        $pdf->setData($branch, $series);
        $pdf->AddPage();
        $pdf->Ln(10);
        $pdf->Image($barcodeFile, 155, 10, 40, 15, 'PNG');
        headerDetails($pdf, $deliveryDate, $branch, $origin, $status, $docDate);
        renderItemsTable($pdf, $branchItems);
        footerDetails($pdf, $driver, $truckCat, $plate, $prepby, $remarks);
    }
    $pdf->Output('I', $fileName);
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
}
