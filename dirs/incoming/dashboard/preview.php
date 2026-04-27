<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadIncomingDashboard()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">PREVIEW BASKET</h3>
            </div>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-success d-none" type="button" onclick="selectAll()" id="selectAllBtn">Select All</button>
            <button class="btn btn-primary" type="button" onclick="togglePreview()" id="previewPicklistBtn">Create Picklist</button>
        </div>
    </div>
    <div class="table-responsive-md mt-3">
        <table class="table table-hover datatables" id="previewTableDisplay">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary"></th>
                    <th class="text-secondary">#</th>
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