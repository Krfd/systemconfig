<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 40px" type="button" onclick="returnStockTransferDashboard()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Stock Transfer</h3>
        </div>
    </div>
    <div id="stock_transfer_form_content"></div>
</div>
<script src="dirs/stock_transfer/form/script/form.js"></script>
<?php
include("modal.php");
?>