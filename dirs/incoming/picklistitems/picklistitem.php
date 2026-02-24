<?php
$RowNum = $_POST['rownum'] ?? '';
$PicklistNum = $_POST['picklistNum'] ?? '';
?>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadBasketContent()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">PL10003</h3>
            </div>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-primary" type="button">
                <i class="bi bi-printer"></i>
            </button>
        </div>
    </div>
    <div id="item_content"></div>
</div>
<script>
    const CURRENT_ROWNUM = "<?php echo $RowNum ?? ''; ?>"
    const PICKLIST_NUM = "<?php echo $PicklistNum ?? ""; ?>"
</script>
<script src="dirs/incoming/picklistitems/script/picklistitems.js"></script>