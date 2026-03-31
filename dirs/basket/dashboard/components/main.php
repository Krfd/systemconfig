<!-- <div class="container-fluid px-4"> -->
<div class="d-flex justify-content-between align-items-start">
    <div class="d-flex justify-content-start align-items-start gap-3">
        <h3 class="fw-bold text-primary">Branch Assignment</h3>
    </div>
    <div class="d-flex gap-1">
        <button class="btn btn-primary" type="button" onclick="toggleDelivery()" id="loadDeliveryBtn">
            Load Items
        </button>
        <button class="btn btn-primary" type="button" onclick="newDelivery()" id="createDeliveryBtn">
            <i class="bi bi-cart-check"></i>
        </button>
    </div>
</div>
<div class="table-responsive-md">
    <table class="table datatables table-hover" id="basketTableDashboard">
        <thead class="sticky-top">
            <tr>
                <th></th>
                <th class="text-secondary">Picklist No.</th>
                <th class="text-secondary">Date Created</th>
                <th class="text-secondary">Date Modified</th>
                <th class="text-secondary">Quantity</th>
                <th class="text-secondary">Status</th>
                <th class="text-secondary"></th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<!-- </div> -->