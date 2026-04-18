<?php

ob_start();
error_reporting(0);
@ini_set('display_errors', 0);
require_once "../config/connection.php";
require_once "../assets/plugins/fpdf/fpdf.php";
session_start();

$data = json_decode($_GET['data'], true);
$itemData = $data['items'] ?? [];
$jsonData = json_encode($data, JSON_PRETTY_PRINT);
$file = "delivery_logs.txt";
file_put_contents($file, $jsonData . PHP_EOL, FILE_APPEND);
$docDate = date("y-m-d");
$driver = $data['driver'] ?? '';
$plate  = $data['plate'] ?? '';
$truckCat = $data['truckCat'] ?? '';
$prepby = $data['prepby'] ?? '';
$remarks = !empty(trim($data['remarks'] ?? ''))
    ? $data['remarks']
    : 'N/A';

class PDF extends FPDF
{

    public $branch;
    public $series;

    function setData($branch, $series)
    {
        $this->branch = $branch;
        $this->series = $series;
    }

    function Header()
    {
        $this->Image('../assets/image/logo/iap_icon.png', 10, 10, 30);
        $this->SetFont('Arial', 'B', 20);

        $title = "DR-" . str_pad($this->series, 5, "0", STR_PAD_LEFT);

        $this->Cell(0, 10, $title, 0, 1, 'C');
        $this->Ln(5);
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

$branches = ['VIAC', 'PLAZA', 'GALLERIA'];
$pdf = new PDF();
$pdf->AliasNbPages();
$series = 10001;

function headerDetails($pdf, $docDate, $branch)
{
    $pdf->SetFont('Arial', '', 9);

    $pageWidth = $pdf->GetPageWidth() - 20;

    $leftWidth = $pageWidth / 2;
    $rightWidth = $pageWidth / 2;

    $pdf->Cell($leftWidth, 6, 'Requesting Branch: ' . $branch, 0, 0, 'L');
    $pdf->Cell($rightWidth, 6, 'Delivery Date: ' . $docDate, 0, 1, 'R');

    $pdf->Ln(2);
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
        $modelRaw = $row['model'] ?? '';
        $brandRaw = $row['brand'] ?? '';
        $categoryRaw = $row['category'] ?? '';
        $quantity = (int)($row['quantity'] ?? 0);

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

        $brand = $row['brand'] ?? '';
        $model = $row['model'] ?? '';
        $category = $row['category'] ?? '';
        $quantity = $row['quantity'] ?? 0;
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
    $pdf->Ln(5);
    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(0, 6, 'Driver: ' . $driver, 0, 1, 'L');
    $pdf->Cell(0, 6, 'Truck Category: ' . $truckCat, 0, 1, 'L');
    $pdf->Cell(0, 6, 'Plate No: ' . $plate, 0, 1, 'L');
    $pdf->Cell(0, 6, 'Prepared By: ' . $prepby, 0, 1, 'L');
    $pdf->Cell(0, 6, 'Remarks: ' . $remarks, 0, 1, 'L');
}


try {
    foreach ($branches as $branch) {

        $pdf->setData($branch, $series++);
        $pdf->AddPage();
        $pdf->Ln(15);
        headerDetails($pdf, $docDate, $branch);
        renderItemsTable($pdf, $itemData);
        footerDetails($pdf, $driver, $truckCat, $plate, $prepby, $remarks);
    }
    $pdf->Output('I', 'delivery' . '.pdf');
} catch (PDOException $e) {
    $conn->rollBack();
    errorHandler(E_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
}
