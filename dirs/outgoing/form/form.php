<div class="container-fluid px-4 overall-progress">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadReturn()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">New Request</h3>
        </div>
    </div>
    <div id="form-content" class="overflow-auto mt-2 overall-progress" style="height: 75vh"></div>
</div>
<script src="assets/js/load.js"></script>
<script src="dirs/outgoing/form/script/form.js"></script>
<?php include("modal.php"); ?>