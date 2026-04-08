<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryBasketContent()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div class="d-flex justify-content-start align-items-start gap-3">
                <h3 class="fw-bold text-primary">Delivery Basket</h3>
            </div>
        </div>
    </div>
    <div class="table-responsive-md mt-2">
        <table class="table datatables table-hover" id="loadingBasketTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary">Picklist No.</th>
                    <th class="text-secondary">Delivery Branch</th>
                    <th class="text-secondary">Date Assigned</th>
                    <th class="text-secondary"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>