<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadReturn()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">New Request</h3>
        </div>
    </div>
    <div id="form-content"></div>
</div>
<script src="dirs/incoming/form/script/form.js"></script>
<?php
include("modal.php");
?>