<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Outgoing</h3>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-danger" type="button" onclick="clearTables()">Reset</button>
            <button class="btn btn-primary" type="button" onclick="newRequest()">New</button>
        </div>
    </div>
    <div id="dashboard_content"></div>
</div>
<script src="dirs/outgoing/dashboard/script/dashboard.js"></script>