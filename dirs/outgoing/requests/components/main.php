<?php
$RowNum = $_POST['RowNum'] ?? '';
?>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="returnOutgoing()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Outgoing Request</h3>
        </div>
    </div>
    <div class="card shadow-sm" id="dashboard-display" style="height: 75vh">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="openincoming">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-2">
                                    <div>
                                        <label for="srn" class="form-label text-dark-emphasis"><small>SRN:</small></label>
                                        <input type="text" name="srn" id="srn" class="form-control" style="background: #FFFBDF" disabled required readonly>
                                    </div>
                                    <div>
                                        <label for="typeOfReq" class="form-label text-dark-emphasis"><small>Type of Request:</small></label>
                                        <select name="typeOfReq" id="typeOfReq" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                        </select>
                                    </div>
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="destination" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                            <select name="destination" id="destination" class="form-select form-select-sm" placeholder="Destination" style="background: #FFFBDF" required disabled readonly>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="branchWhCode" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="branchWhCode" id="branchWhCode" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="origin" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                            <select name="origin" id="origin" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="whcode" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="whcode" id="whcode" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1">
                                    <div>
                                        <label for="date" class="form-label text-dark-emphasis"><small>Date:</small></label>
                                        <input type="text" name="date" id="date" class="form-control form-control-sm" style="background: #FFFBDF" required disabled readonly>
                                    </div>
                                    <div>
                                        <label for="status" class="form-label text-dark-emphasis"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" class="form-control form-control-sm" style="background: #FFFBDF" required disabled readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive mt-5 overflow-auto" style="max-height: 450px">
                                <table class="table datatables table-hover" id="openIncomingTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- SRN DATA HERE... -->
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border-top fw-bold"
                                style="background:#FFF7BC;">
                                <div class="p-2 flex-grow-1 text-end">
                                    Total Quantity:
                                </div>
                                <div class="p-2" style="width:120px;" id="totalReqQuantity">
                                    0
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-end mt-5">
                                <div class="d-flex flex-column gap-1">
                                    <div>
                                        <label for="type" class="form-label text-dark-emphasis"><small>Purpose of Request:</small></label>
                                        <input type="text" name="purpose" id="purpose" class="form-control form-control-sm" style="background: #FFFBDF" disabled required>
                                    </div>
                                    <div>
                                        <label for="reqBy" class="form-label text-dark-emphasis"><small>Requested by:</small></label>
                                        <input type="text" name="reqBy" id="reqBy" class="form-control form-control-sm" style="background: #FFFBDF" disabled readonly required>
                                    </div>
                                    <div>
                                        <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                        <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto" disabled></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>
<script>
    const CURRENT_ROWNUM = "<?php echo $RowNum ?? ''; ?>";
</script>
<?php
include("../modal.php");
?>
<script src="dirs/outgoing/requests/script/request.js"></script>