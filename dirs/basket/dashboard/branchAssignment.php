<div id="pageLoader"
    class="position-fixed top-0 start-0 w-100 vh-100 d-none 
            justify-content-center align-items-center bg-white"
    style="z-index: 1055;">
    <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <div class="mt-2">Loading...</div>
    </div>
</div>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryBasketContent()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Branch Assignment</h3>
        </div>
    </div>
    <div class="card shadow-sm overflow-auto mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="delivery">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="pcklstno" class="form-label text-dark-emphasis col-3"><small>Picklist No:</small></label>
                                        <input type="text" name="pcklstno" id="pcklstno" class="form-control form-control-sm col" style="background: #f2f2f2" readonly>
                                    </div>
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" id="origin" class="form-control form-control-sm col ms-3" style="background: #f2f2f2" readonly>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline col" hidden>
                                            <label for="whcode" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" id="whcode" class="form-control form-control-sm col" style="background: #f2f2f2" readonly>
                                        </div>
                                    </div>
                                    <input type="hidden" name="lbnum" id="lbnum" class="form-control form-control-sm col" style="background: #FFFBDF" readonly>
                                </div>
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="docdate" class="form-label text-dark-emphasis col-4"><small>Document Date:</small></label>
                                        <input type="text" name="docdate" id="docdate" class="form-control form-control-sm col" style="background: #f2f2f2" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="status" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" class="form-control form-control-sm col" style="background: #f2f2f2" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive d-flex gap-1 overflow-auto mt-5" style="max-height: 450px">
                                <table class="table table-hover col" id="summaryTable">
                                    <thead class="sticky-top">
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside"
                                class="d-flex border-top fw-bold align-items-center w-100"
                                style="background: #f2f2f2">

                                <!-- ✅ LEFT SIDE (Balance) -->
                                <div class="d-flex">
                                    <div class="p-2 text-end">Balance:</div>
                                    <div class="p-2" style="width:120px;" id="balanceQty">0</div>
                                </div>

                                <!-- ✅ RIGHT SIDE (everything else) -->
                                <div class="d-flex ms-auto">

                                    <div class="d-flex">
                                        <div class="p-2 text-end">Total Quantity:</div>
                                        <div class="p-2" style="width:120px;" id="summaryQty">0</div>
                                    </div>

                                    <div class="d-flex">
                                        <div class="p-2 text-end">Total:</div>
                                        <div class="p-2" style="width:120px;" id="total1">0</div>
                                    </div>

                                    <div class="d-flex">
                                        <div class="p-2 text-end">Total:</div>
                                        <div class="p-2" style="width:120px;" id="total2">0</div>
                                    </div>

                                    <div class="d-flex">
                                        <div class="p-2 text-end">Total:</div>
                                        <div class="p-2" style="width:120px;" id="total3">0</div>
                                    </div>

                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-end mt-5">
                                <div class="d-flex justify-content-start align-items-end gap-1 col-3">
                                    <div class="d-flex flex-column gap-3">
                                        <div class="col">
                                            <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                            <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="4" style="background: #FFFBDF; height: auto; resize: horizontal" maxlength="100"></textarea>
                                        </div>
                                        <div class="d-flex align-items-baseline col">
                                            <label for="prepby" class="form-label text-dark-emphasis col-5"><small>Prepared by:</small></label>
                                            <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #f2f2f2" readonly required>
                                        </div>
                                    </div>
                                </div>
                                <button class="clearfix btn btn-primary float-end" type="submit" id="branchAssignmentBtn">Commit</button>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>