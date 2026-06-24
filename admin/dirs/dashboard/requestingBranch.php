<div class="container">
    <div class="d-flex gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="returnDashboard()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-between align-items-start w-100">
            <div class="d-flex flex-column">
                <h2 class="fw-bold"><span id="branchName"></span> <span class="text-muted">| 2,458</span></h2>
                <div>
                    <p class="fw-semibold">vs. previous month <span class="text-muted">| 1,202</span> May 30, 2026</p>
                </div>
            </div>
            <button class="btn btn-sm btn-success"><i class="bi bi-upload"></i> Export CSV</button>
        </div>
    </div>
    <div class="table-responsive mt-3 overflow-auto overall-progress">
        <table class="table table-hover col border border-secondary-subtle" id="branchDetailsTableDisplay">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary text-center">#</th>
                    <th class="text-secondary">SRN</th>
                    <th class="text-secondary">Stock Origin</th>
                    <th class="text-secondary">Requesting Branch</th>
                    <th class="text-secondary">Status</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Action</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>