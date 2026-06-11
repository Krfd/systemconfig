<div class="d-flex justify-content-between align-items-start">
    <div class="d-flex justify-content-start align-items-start gap-3">
        <h3 class="fw-bold text-primary">Branch Assignment</h3>
    </div>
    <div class="d-flex gap-1">
        <button class="btn btn-success d-none" type="button" onclick="selectAll()" id="selectAllBtn">
            Select All
        </button>
        <button class="btn btn-primary" type="button" onclick="toggleDelivery()" id="loadDeliveryBtn">
            Load Items
        </button>
    </div>
</div>
<ul class="nav nav-tabs nav-tabs-bordered d-flex mt-5" id="borderedTabJustified" role="tablist">
    <li class="nav-item flex-fill" role="presentation">
        <button class="nav-link w-100 active" id="unassigned-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-all" type="button" role="tab" aria-controls="all" aria-selected="true">Unassigned</button>
    </li>
    <li class="nav-item flex-fill" role="presentation">
        <button class="nav-link w-100" id="assigned-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-assigned" type="button" role="tab" aria-controls="assigned" aria-selected="false">Assigned</button>
    </li>
</ul>
<div class="tab-content pt-2" id="borderedTabJustifiedContent">
    <div class="tab-pane fade show active" id="bordered-justified-all" role="tabpanel" aria-labelledby="all-tab">
        <div class="table-responsive-md">
            <table class="table datatables table-hover" id="basketTableDashboard">
                <thead class="sticky-top">
                    <tr>
                        <th></th>
                        <th class="text-secondary">Picklist No.</th>
                        <th class="text-secondary">Quantity</th>
                        <th class="text-secondary">Status</th>
                        <th class="text-secondary"></th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    <div class="tab-pane fade" id="bordered-justified-assigned" role="tabpanel" aria-labelledby="assigned-tab">
        <div class="table-responsive-md">
            <table class="table datatables table-hover" id="basketTableAssigned">
                <thead class="sticky-top">
                    <tr>
                        <th></th>
                        <th class="text-secondary">Picklist No.</th>
                        <th class="text-secondary">Quantity</th>
                        <th class="text-secondary">Status</th>
                        <th class="text-secondary"></th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>