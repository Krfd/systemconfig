<?php
$RowNum = $_POST['RowNum'] ?? '';
?>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadReturn()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Incoming</h3>
        </div>
    </div>
    <div id="form-content" class="overflow-auto" style="max-height: 75vh"></div>
</div>
<script>
    const CURRENT_ROWNUM = "<?php echo $RowNum ?? ''; ?>"
</script>
<?php
include("modal.php");
?>
<script src="dirs/incoming/form/script/form.js"></script>