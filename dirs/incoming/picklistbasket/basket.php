<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadReturn()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">PICKLIST BASKET</h3>
            </div>
        </div>
    </div>
    <div id="basket_content"></div>
</div>
<?php
include("modal.php")
?>
<script src="dirs/incoming/picklistbasket/script/basket.js"></script>