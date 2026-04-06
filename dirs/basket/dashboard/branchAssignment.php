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
            <h3 class="fw-bold text-primary">New Delivery</h3>
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
                                    <input type="hidden" name="batchnum" id="batchnum" class="form-control form-control-sm col" style="background: #FFFBDF" readonly>
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
                            <!-- SERIAL TOGGLER -->
                            <div class="d-flex justify-content-end align-items-baseline gap-3 mt-5">
                                <div class="d-flex align-items-center gap-2">
                                    <label class="mb-0 text-secondary">Serial:</label>
                                    <label class="modern-switch shadow-sm rounded-5">
                                        <input type="checkbox" id="serialToggler" class="p-1">
                                        <div class="switch-track px-3 d-flex justify-content-center gap-4">
                                            <span class="switch-text text-start text-white scan">Scan</span>
                                            <span class="switch-text text-center text-white manual">Manual</span>
                                        </div>
                                        <div class="switch-knob shadow"></div>
                                    </label>
                                </div>
                                <div class="d-flex gap-1">
                                    <button type="button" class="btn btn-sm btn-primary" id="addSerialModalBtn" data-bs-toggle="modal" data-bs-target="#addSerialModal"><i class="bi bi-plus"></i> Insert</button>
                                    <button type="button" class="btn btn-sm btn-primary" id="addDeliveryModalBtn"><i class="bi bi-plus"></i> Add</button>
                                    <button type="button" class="btn btn-sm btn-danger" id="clearDeliveryTableBtn" onclick="clearTable()">Clear</button>
                                    <button type="button" class="btn btn-sm btn-info" id="deliverySummaryBtn" data-bs-toggle="modal" data-bs-target="#deliverySummary">Delivery</button>
                                    <button type="button" class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#nonSerializeSummary">NonSerialize</button>
                                </div>
                            </div>
                            <div class="table-responsive d-flex gap-1 overflow-auto mt-3" style="max-height: 450px">
                                <!--SERIAL TABLE  -->
                                <table class="table table-hover col-2" id="delivery-serial-table">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary" colspan="2" style="overflow-x: hidden; white-space: nowrap;  outline: none; scrollbar-width: none; -ms-overflow-style: none;"
                                                onfocus="this.style.outline='none';"
                                                oninput="this.scrollLeft = this.scrollWidth">Serial No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowspan="9" colspan="2" style="background: #FFFDBF" style="white-space: pre-wrap;"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- SUMMARY TABLE -->
                                <table class="table table-hover col" id="summaryTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                            <th class="text-secondary">Allocated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border-top fw-bold justify-content-end w-100" style="background: #FFFBDF">
                                <div class=" p-2 text-end">Total Quantity:</div>
                                <div class="p-2" style="width:120px;" id="summaryQty">0</div>
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
                                            <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #f2f2f2" required>
                                        </div>
                                    </div>
                                </div>
                                <button class="clearfix btn btn-primary float-end" type="submit" id="deliveryBtn">Commit</button>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>
<?php
include("deliveryModal.php");
include("branchModal.php");
?>