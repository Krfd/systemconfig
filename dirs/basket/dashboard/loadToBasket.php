<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryBasketContent()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Loading Basket Form</h3>
        </div>
    </div>
    <div class="card shadow-sm overflow-auto mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="loadingBasketForm">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" id="origin" class="form-control form-control-sm col ms-3" style="background: #f2f2f2" value="NEWSC1" readonly>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline col" hidden>
                                            <label for="whcode" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" id="whcode" class="form-control form-control-sm col" style="background: #f2f2f2" value="NEWWHS" readonly>
                                        </div>
                                    </div>
                                    <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                        <label for="eta" class="form-label text-dark-emphasis col-5"><small>Expected Arrival:</small></label>
                                        <input type="date" id="eta" class="form-control form-control-sm col ms-3" style="background: #fcf7d4" required>
                                    </div>
                                    <!-- <div class="p-0 d-flex align-items-baseline gap-1 col">
                                        <label for="status" class="form-label text-dark-emphasis col-3"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" class="form-control form-control-sm col ms-2" style="background: #f2f2f2" value="ASSIGNED" readonly>
                                    </div> -->
                                </div>
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="docdate" class="form-label text-dark-emphasis col-4"><small>Document Date:</small></label>
                                        <input type="date" name="docdate" id="docdate" class="form-control form-control-sm col" style="background: #f2f2f2" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="deldate" class="form-label text-dark-emphasis col-4"><small>Delivery Date:</small></label>
                                        <input type="date" name="deldate" id="deldate" class="form-control form-control-sm col" style="background: #fcf7d4" required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="status" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" class="form-control form-control-sm col" style="background: #f2f2f2" value="ASSIGNED" readonly>
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
                                    <button type="button" class="btn btn-sm btn-danger" onclick="clearLoadingTable()">Clear</button>
                                </div>
                            </div>
                            <div class="table-responsive d-flex gap-1 overall-progress overflow-auto mt-3 border border-secondary-subtle" style="max-height: 450px">
                                <table class="table table-hover col mb-0" id="loadBasketTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary text-center">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border border-secondary-subtle fw-bold justify-content-end w-100" 
                            style="background: #faf0aa">
                                <!-- <div class="d-flex">
                                    <div class="d-flex">
                                        <div class="p-2 text-end">Balance:</div>
                                        <div class="p-2" style="width:120px;" id="balanceQty">0</div>
                                    </div>
                                </div> -->
                                <div class="d-flex">
                                    <div class=" p-2 text-end">Total Quantity:</div>
                                    <div class="p-2" style="width:120px;" id="loadingQty">0</div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-start align-items-end mt-5 gap-1">
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="prepby" class="form-label text-dark-emphasis col-4"><small>Prepared by:</small></label>
                                        <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #F2F2F2" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="driver" class="form-label text-dark-emphasis col-4"><small>Driver:</small></label>
                                        <input type="text" name="driver" id="driver" class="form-control form-control-sm col" style="background: #fcf7d4" required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="truckCat" class="form-label text-dark-emphasis col-4">
                                            <small>Truck Category:</small>
                                        </label>
                                        <select name="truckCat" id="truckCat" class="form-select form-select-sm col" style="background: #fcf7d4; appearance: auto" required>
                                        </select>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="plate" class="form-label text-dark-emphasis col-4">
                                            <small>Truck Plate No:</small>
                                        </label>
                                        <select name="plate" id="plate" class="form-select form-select-sm col" style="background: #fcf7d4; appearance: auto" required>
                                            <option value="">Select Category first</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-2 mb-auto">
                                    <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="3" style="background: #fcf7d4; height: auto; resize: horizontal"></textarea>
                                </div>
                                <div class="ms-auto">
                                    <button class="btn btn-primary float-end commit-btn" type="submit" id="loadingBasketBtn">Load</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
<?php
include("deliveryModal.php");
?>