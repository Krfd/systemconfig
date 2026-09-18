<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Servers</h3>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#newServerModal">New</button>
        </div>
    </div>
    <div id="dashboard_content"></div>
</div>
<?php include("modal.php") ?>
<script src="assets/js/load.js"></script>
<script src="dirs/dashboard/dashboard/script/dashboard.js"></script>
<!-- <script src="dirs/dashboard/dashboard/script/counter.js"></script> -->