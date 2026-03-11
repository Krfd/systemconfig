<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryDashboard()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">LOADING BASKET</h3>
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="deliveryBasketTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary">Picklist No.</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Quantity</th>
                    <th class="text-secondary"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>