<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadIncomingDashboard()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">PICKLIST BASKET</h3>
            </div>
        </div>
    </div>
    <div class="table-responsive-md">
        <table class="table datatables table-hover" id="basketTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary text-start">Picklist No.</th>
                    <th class="text-secondary text-start">Date</th>
                    <th class="text-secondary text-start">Quantity</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>