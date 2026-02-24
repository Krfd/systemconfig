<?php
// $RowNum = $_POST['rownum'] ?? '';
// $PicklistNum = $_POST['picklistNum'] ?? '';
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
    <div class="table-responsive">
        <table class="table datatables table-hover" id="picklistItemTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary">SRN</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Requesting Branch</th>
                    <th class="text-secondary">Quantity</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 40px; min-height: 40px">
                    <td class="text-primary ps-2 align-middle" onclick="" style="cursor: pointer; background: #FFFBDF; padding: 3px">SRN10001</td>
                    <td class="text-secondary ps-2 align-middle" style="background: #FFFBDF; padding: 3px">01/29/2026</td>
                    <td class="text-secondary ps-2 align-middle" style="background: #FFFBDF; padding: 3px">PLAZA</td>
                    <td class="text-secondary ps-2 align-middle" style="background: #FFFBDF; padding: 3px">50</td>
                    <td class="d-flex gap-1 dropdown dropstart align-middle" style="background: #FFFBDF; padding: 3px">
                        <button type="button" class="btn btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item" onclick="">Open</a></li>
                            <li><a href="#" class="dropdown-item">Print</a></li>
                        </ul>
                    </td>
                </tr>
                <tr style="height: 40px; min-height: 40px">
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                </tr>
                <tr style="height: 40px; min-height: 40px">
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                </tr>
                <tr style="height: 40px; min-height: 40px">
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                    <td style="background: #FFFBDF; padding: 0"></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<script>
    // const CURRENT_ROWNUM = "<?php echo $RowNum ?? ''; ?>"
    // const PICKLIST_NUM = "<?php echo $PicklistNum ?? ""; ?>"
</script>
<!-- <script src="dirs/incoming/picklistitems/script/picklistitems.js"></script> -->