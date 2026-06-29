<div id="receivingLoader" class="d-none position-fixed top-0 start-0 w-100 h-100 z-3" style="background: rgba(255, 255, 255, 0.75);">
    <div class="w-100 h-100 d-flex justify-content-center align-items-center">
        <div class="text-center">
            <div class="spinner-border text-warning" role="status"></div>
            <div class="mt-2 fw-semibold">
                Loading delivery details...
            </div>
        </div>
    </div>
</div>
<div class="container-fluid px-4" id="receiving-page">
    <div class="d-flex justify-content-between align-items-baseline gap-3">
        <div class="d-flex justify-content-start gap-3 align-items-center">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="returnReceiving()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h3 class="fw-bold text-primary">Receiving</h3>
        </div>
        <button type="button" class="btn btn-primary" onclick="drafts()">Drafts</button>
    </div>
    <div class="card shadow-sm mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="receivingForm">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="drNoRecForm" class="form-label text-dark-emphasis col-3"><small>DR No:</small></label>
                                        <input type="text" name="drNoRecForm" id="drNoRecForm" class="form-control form-control-sm col search-order-field" data-field="deliveryNumber" style="background: #f7f7f7" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="refNoRecForm" class="form-label text-dark-emphasis col-3"><small>Stock Delivery No:</small></label>
                                        <input type="text" name="refNoRecForm" id="refNoRecForm" class="form-control form-control-sm col search-order-field" data-field="referenceNumber" style="background: #fcf7d4" oninput="this.value = this.value.toUpperCase()">
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="stockReqNoRecForm" class="form-label text-dark-emphasis col-3"><small>Stock Request No:</small></label>
                                        <input type="text" name="stockReqNoRecForm" id="stockReqNoRecForm" class="form-control form-control-sm col search-order-field" data-field="stockReqNumber" style="background: #f7f7f7" readonly>
                                    </div>
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="originRecForm" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" name="originRecForm" class="form-control form-control-sm ms-3" value="NEWSC1" style="background: #f7f7f7" readonly required>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline gap-1">
                                            <label for="origCodeRecForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" name="origRecForm" class="form-control form-control-sm" value="NEWWHS" style="background: #f7f7f7" readonly required>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="docDateRecForm" class="form-label text-dark-emphasis col-4"><small>Document Date:</small></label>
                                        <input type="text" name="docDateRecForm" id="docDateRecForm" class="form-control form-control-sm col" style="background: #f7f7f7" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="postDate" class="form-label text-dark-emphasis col-4"><small>Receiving Date:</small></label>
                                        <input type="text" name="postDate" id="postDate" class="form-control form-control-sm col" style="background: #f7f7f7" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="statusRecForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="statusRecForm" id="statusRecForm" class="form-control form-control-sm col" style="background: #f7f7f7" readonly>
                                    </div>
                                </div>
                            </div>
                            <!-- SERIAL AND ADD BUTTON -->
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
                                    <!-- <i class="bi bi-plus"></i> -->
                                    <button type="button" class="btn btn-sm btn-primary" id="addSerialModalBtn" data-bs-toggle="modal" data-bs-target="#addSerialModal" title="Serial"><i class="bi bi-upc d-block d-md-none"></i>Serialize</button>
                                    <button type="button" class="btn btn-sm btn-primary" id="addDeliveryModalBtn" title="No Serial"><del><i class="bi bi-upc d-block d-md-none"></i></del>Nonserialized</button>
                                    <button type="button" class="btn btn-sm btn-danger" id="clearDeliveryTableBtn" onclick="clearTable()">Clear</button>
                                </div>
                            </div>
                            <div class="table-responsive mt-5 d-flex gap-1 overflow-auto overall-progress" style="max-height: 450px">
                                <table class="table table-hover col border border-secondary-subtle mb-0" id="receiving-form-table">
                                    <thead>
                                        <tr>
                                            <th class="text-secondary text-center">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary text-center">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                            <td style="background: #fcf7d4"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border border-secondary-subtle fw-bold"
                                style="background: #faf0aa">
                                <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                                <div class="p-2" style="width:120px;" id="receivingQty">0</div>
                            </div>
                            <div class="d-flex justify-content-between align-items-end mt-5">
                                <div class="d-flex justify-content-start align-items-start gap-1 col-7">
                                    <div class="d-flex flex-column gap-1">
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for="receiveByRecForm" class="form-label text-dark-emphasis col-5"><small>Received by:</small></label>
                                            <input type="text" name="receiveByRecForm" id="receiveByRecForm" class="form-control form-control-sm col" style="background: #f7f7f7" value="<?php echo isset($user['Username']) ? $user['Username'] : '' ?>" readonly required>
                                        </div>
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for=" driverRecForm" class="form-label text-dark-emphasis col-5"><small>Driver:</small></label>
                                            <input type="text" name="driverRecForm" id="driverRecForm" class="form-control form-control-sm col" style="background: #f7f7f7" readonly required>
                                        </div>
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for="truckCat" class="form-label text-dark-emphasis col-5"><small>Truck Category:</small></label>
                                            <input type="text" name="truckCat" id="truckCat" class="form-control form-control-sm col" style="background: #f7f7f7" readonly required>
                                        </div>
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for=" plateRecForm" class="form-label text-dark-emphasis col-5"><small>Truck Plate No:</small></label>
                                            <input type="text" name="plateRecForm" id="plateRecForm" class="form-control form-control-sm col" style="background: #f7f7f7" readonly required>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <label for=" remarksRecForm" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                        <textarea name="remarksRecForm" id="remarksRecForm" class="form-control form-control-sm col" rows="5" style="background: #f7f7f7; height: auto;" readonly></textarea>
                                    </div>
                                </div>
                                <div class="d-flex gap-1">
                                    <button type="button" class="btn btn-primary" id="submitDraftRecBtn">Save as Draft</button>
                                    <button type="submit" class="btn btn-primary" id="submitRecBtn">Submit</button>
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
include("modal.php");
?>