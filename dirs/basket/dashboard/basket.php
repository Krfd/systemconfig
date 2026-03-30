<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Loading Basket</h3>
        </div>
        <!-- <button class="btn btn-primary" type="button" onclick="loadDeliveryBasket()"> -->
        <button class="btn btn-primary" type="button" onclick="toggleDelivery()" id="createDeliveryBtn">
            Create Delivery
        </button>
    </div>
    <div id="basket_content"></div>
</div>
<?php
include("deliveryModal.php");
include("branchModal.php");
?>
<script src="assets/js/load.js"></script>
<script src="dirs/basket/dashboard/script/script.js"></script>