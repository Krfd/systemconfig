<div class="container-fluid gap-5 d-flex justify-content-between align-items-start">
    <div class="card shadow-sm rounded-2 col">
        <div class="card-body">
            <h3 class="text-start fw-bold">Top Requesting Branch</h3>
            <ul class="list-group list-group-flush" id="topRequestorsList">
            </ul>
        </div>
    </div>
    <div class="col">
         <div class="d-flex flex-column gap-3">
                <div class="row gap-3">
                    <div class="col p-3 bg-primary">
                        <span class="fw-bold">Overall Requests</span>
                        <div class="d-flex justify-content-end">
                            <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-light text-center" style="min-width: 60px"><span class="fw-semibold counter-section" id="overall"></span></div>
                        </div>
                    </div>
                    <div class="col p-3 bg-success">
                        <span class="fw-bold">Delivered</span>    
                        <div class="d-flex justify-content-end">
                            <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-light text-center" style="min-width: 60px"><span class="fw-semibold counter-section" id="delivered"></span></div>
                        </div>
                    </div>
                </div>
            <div class="row gap-3">
                <div class="col p-3 bg-info">
                    <span class="fw-bold">Processing</span>
                    <div class="d-flex justify-content-end">
                        <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-light text-center" style="min-width: 60px"><span class="fw-semibold counter-section" id="processing"></span></div>
                    </div>
                </div>
                <div class="col p-3 bg-danger">
                    <span class="fw-bold">Rejected</span>
                    <div class="d-flex justify-content-end">
                        <div class="rounded-5 text-white shadow p-3 w-auto ms-auto ms-auto bg-light text-center" style="min-width: 60px"><span class="fw-semibold counter-section" id="rejected"></span></div>
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