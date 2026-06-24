<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryBasketContent()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary" id="picklistDeliveryDisplay"></h3>
            </div>
        </div>
    </div>
    <div class="table-responsive overall-progress">
        <table class="table table-hover border border-secondary-subtle" id="deliveryItemsTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary">Brand</th>
                    <th class="text-secondary">Model</th>
                    <th class="text-secondary">Category</th>
                    <th class="text-secondary">Quantity</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>