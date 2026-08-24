<style>
    .counter-box {
        transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .counter-box:hover {

        /* transform: scale(1.12); */
        transform: scale(1.05);
    }
</style>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Dashboard</h3>
        </div>
    </div>
    <div id="dashboard_content"></div>
</div>
<script src="../assets/js/load.js"></script>
<script src="dirs/dashboard/script/scripts.js"></script>