<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryBasketContent()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Create Delivery</h3>
        </div>
    </div>
    <div class="card shadow-sm mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="frm-request-sts">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="drNo" class="form-label text-dark-emphasis col-3"><small>Delivery Number:</small></label>
                                        <input type="text" name="drNo" id="drNo" class="form-control form-control-sm col" style="background: #f2f2f2" readonly required>
                                    </div>
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="desForm" class="form-label text-dark-emphasis col-5"><small>Destination:</small></label>
                                            <select name="desForm" id="desForm" class="form-select form-select-sm col ms-3" style="background: #FFFBDF">
                                            </select>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline">
                                            <label for="desCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <select name="desCodeForm" id="desCodeForm" class="form-select form-select-sm col" style="background: #FFFBDF;" readonly required>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="user-origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" name="user-origin" id="user-origin" class="form-control form-control-sm col ms-3" style="background: #f2f2f2;" required readonly>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline">
                                            <label for="originCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <select name="originCodeForm" id="originCodeForm" class="form-select form-select-sm col" style="background: #f2f2f2" required>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-2">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="date" class="form-label text-dark-emphasis col-4"><small>Delivery Date:</small></label>
                                        <input type="date" name="date" id="deldate" class="form-control form-control-sm col" style="background: #FFFBDF" required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                        <input type="date" name="date" id="formattedDate" class="form-control form-control-sm col" style="background: #FFFBDF" required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="statusForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm col" style="background: #f2f2f2" readonly required>
                                    </div>
                                </div>
                            </div>
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
                            <div class="table-responsive overflow-auto mt-3" style="max-height: 450px">
                                <table class="table table-hover" id="outgoingTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary text-center">Quantity</th>
                                            <th class="text-secondary">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border-top fw-bold"
                                style="background:#FFF7BC;">
                                <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                                <div class="p-2" style="width:120px;" id="totalQuantity">0</div>
                            </div>
                            <div class="d-flex align-items-end justify-content-between mt-5">
                                <div class="d-flex justify-content-start gap-1 col-7">
                                    <div class="d-flex flex-column col-5">
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for="prepby" class="form-label text-dark-emphasis col-4"><small>Prepared by:</small></label>
                                            <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #f2f2f2" readonly>
                                        </div>
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for="plate" class="form-label text-dark-emphasis col-4"><small>Truck Plate No:</small></label>
                                            <input type="text" name="plate" id="plate" class="form-control form-control-sm col" style="background: #FFFBDF">
                                        </div>
                                        <div class="d-flex align-items-baseline gap-3">
                                            <label for="driver" class="form-label text-dark-emphasis col-4"><small>Driver:</small></label>
                                            <input type="text" name="driver" id="driver" class="form-control form-control-sm col" style="background: #FFFBDF">
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                        <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto; resize: horizontal"></textarea>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary" id="submitFormBtn">Submit</button>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>
<script>
    $("#desForm").on("change", function() {
        loadDestinationWhscodes();
    });
</script>