<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Incoming</h3>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-primary btn-sm" type="button" onclick="toggleCheckboxes()" id="createPicklistBtn">Create Picklist</button>
            <button class="btn btn-primary" type="button" onclick="picklistBasket()">
                <i class="bi bi-cart"></i>
            </button>
        </div>
    </div>
    <div id="incoming_content"></div>
</div>
<script src="assets/js/load.js"></script>
<script src="dirs/incoming/dashboard/script/dashboard.js"></script>