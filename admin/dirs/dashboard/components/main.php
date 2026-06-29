<div class="container-fluid gap-5 d-flex justify-content-between align-items-start">
    <div class="card shadow-sm rounded-2 col">
        <div class="card-body">
            <h3 class="text-start fw-bold text-dark-emphasis">Top Requesting Branch</h3>
            <ul class="list-group list-group-flush" id="topRequestorsList">
            </ul>
        </div>
    </div>
    <div class="col">
        <div class="d-flex flex-column gap-3">
            <div class="row gap-3">
                <div class="box col p-3 bg-primary-subtle shadow-sm border border-primary rounded-2"
                    style="cursor: pointer">
                    <h4 class="fw-bold text-dark-emphasis">Overall Requests</h4>
                    <div class="d-flex justify-content-end">
                        <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-primary text-center" style="min-width: 60px">
                            <span class="fw-semibold counter-section" id="overall"></span>
                        </div>
                    </div>
                </div>
                <div class="box col p-3 bg-success-subtle shadow-sm border border-success rounded-2"
                    style="cursor: pointer">
                    <h4 class="fw-bold text-dark-emphasis">Delivered</h4>
                    <div class="d-flex justify-content-end">
                        <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-success text-center" style="min-width: 60px">
                            <span class="fw-semibold counter-section" id="delivered"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row gap-3">
                <div class="box col p-3 bg-info-subtle shadow-sm border border-info rounded-2"
                    style="cursor: pointer">
                    <h4 class="fw-bold text-dark-emphasis">Processing</h4>
                    <div class="d-flex justify-content-end">
                        <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-info text-center counter-box" style="min-width: 60px">
                            <span class="fw-semibold counter-section" id="processing"></span>
                        </div>
                    </div>
                </div>
                <div class="box col p-3 bg-danger-subtle shadow-sm border border-danger rounded-2"
                    style="cursor: pointer">
                    <h4 class="fw-bold text-dark-emphasis">Rejected</h4>
                    <div class="d-flex justify-content-end">
                        <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-danger text-center" style="min-width: 60px">
                            <span class="fw-semibold counter-section" id="rejected"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col">
        <h3 class="fw-bold">Recent Activities</h3>
        <ul class="list-group list-group-flush bg-primary" id="activityList">
        </ul>
    </div>
</div>
<div class="container-fluid mt-3 mt-md-5 p-3">
    <div id="dailyRequests" style="height:400px;"></div>
</div>
<div class="container-fluid mt-3 mt-md-0 p-3 d-flex flex-column flex-md-row gap-3 justify-content-between">
    <div id="status" style="width: 100%; height: 400px;"></div>
    <div id="branch" style="width: 100%; height: 400px;"></div>
</div>
<!-- <div class="table-responsive-md">
    <table class="table table-hover datatables col" id="dashboardTableDisplay">
        <thead class="sticky-top">
            <tr>
                <th class="text-secondary text-center">#</th>
                <th class="text-secondary">SRN</th>
                <th class="text-secondary">Stock Origin</th>
                <th class="text-secondary">Requested by</th>
                <th class="text-secondary">Status</th>
                <th class="text-secondary text-start">Date</th>
                <th class="text-secondary">Action</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div> -->

<script src="dirs/dashboard/script/analytics.js"></script>