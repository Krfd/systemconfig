<div class="container-fluid my-3">
    <div class="d-flex justify-content-between align-items-center gap-3">
        <div class="card shadow-sm col p-3">
            <h3 class="fw-semibold mt-2">
                <i class="bi bi-question-square-fill bg-danger-subtle border-danger rounded-5 py-2 px-3"></i> Total Missing
            </h3>
        </div>
        <div class="card shadow-sm col p-3">
            <h3 class="fw-semibold mt-2">
                <i class="bi bi-truck bg-primary-subtle border-primary rounded-5 py-2 px-3"></i> Total In Transit
            </h3>
        </div>       
        <div class="card shadow-sm col p-3">
            <h3 class="fw-semibold mt-2">
                <i class="bi bi-truck-front-fill bg-success-subtle border-success rounded-5 py-2 px-3"></i> Total Trucks
            </h3>
        </div>       
        <div class="card shadow-sm col p-3">
            <h3 class="fw-semibold mt-2">
                <i class="bi bi-info-square-fill bg-info-subtle border-info rounded-5 py-3 px-3"></i> Top Missing Transactions
            </h3>
        </div>       
    </div>
</div>
<div class="table-responsive-md mt-3">
    <table class="table table-hover datatables col" id="findingsTableDisplay">
        <thead class="sticky-top">
            <tr>
                <th class="text-secondary text-center">#</th>
                <th class="text-secondary">Ref. #</th>
                <th class="text-secondary">Branch</th>
                <th class="text-secondary">Serial</th>
                <th class="text-secondary">To Deliver</th>
                <th class="text-secondary">Qty</th>
                <th class="text-secondary">Diff.</th>
                <th class="text-secondary">Status</th>
                <th class="text-secondary">Transaction</th>
                <th class="text-secondary">Driver</th>
                <th class="text-secondary">Truck Category</th>
                <th class="text-secondary">Truck Plate</th>
                <th class="text-secondary">Timestamp</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>