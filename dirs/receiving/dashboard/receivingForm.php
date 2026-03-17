<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDashboard()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Receiving Item</h3>
        </div>
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
                                        <label for="rrNoRecForm" class="form-label text-dark-emphasis col-3"><small>RR No:</small></label>
                                        <input type="text" name="rrNoRecForm" id="rrNoRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" disabled readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="srnRecForm" class="form-label text-dark-emphasis col-3"><small>SRN:</small></label>
                                        <input type="text" name="srnRecForm" id="srnRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" disabled readonly>
                                    </div>
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="originRecForm" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" name="originRecForm" class="form-control form-control-sm ms-3" value="PLAZA" style="background: #FFFFF2" disabled readonly required>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline gap-1">
                                            <label for="origCodeRecForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" name="origRecForm" class="form-control form-control-sm" value="PLZA" style="background: #FFFFF2" readonly disabled required>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="desRecForm" class="form-label text-dark-emphasis col-5"><small>Destination:</small></label>
                                            <input type="text" name="desRecForm" class="form-control form-control-sm ms-3" value="VIAC" style="background: #FFFFF2" readonly disabled required>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline">
                                            <label for="desCodeRecForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" name="originCodeRecForm" class="form-control form-control-sm" value="VIAC" style="background: #FFFFF2" readonly disabled required>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="drNoRecForm" class="form-label text-dark-emphasis col-4"><small>DR No:</small></label>
                                        <input type="text" name="drNoRecForm" id="drNoRecForm" class="form-control form-control-sm col" style="background: #FFFBDF">
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="docDateRecForm" class="form-label text-dark-emphasis col-4"><small>Document Date:</small></label>
                                        <input type="text" name="docDateRecForm" id="docDateRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" disabled readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="statusRecForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="statusRecForm" id="statusRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" disabled readonly>
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
                                            <span class="switch-text text-center text-white manual">Manual</span>
                                            <span class="switch-text text-start text-white scan">Scan</span>
                                        </div>
                                        <div class="switch-knob shadow"></div>
                                    </label>
                                </div>
                                <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addDeliveryModal"><i class="bi bi-plus"></i> Add</button>
                            </div>
                            <div class="table-responsive mt-5 d-flex gap-1 overflow-auto" style="max-height: 450px">
                                <table class="table table-hover col-2" id="receiving-serial-table">
                                    <thead>
                                        <tr>
                                            <th class="text-secondary" colspan="2">Serial No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowspan="9" colspan="2" style="background: #FFFDBF"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="table table-hover col" id="receiving-form-table">
                                    <thead>
                                        <tr>
                                            <th class="text-secondary">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                            <th class="text-secondary">Quantity Received</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px">
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
                            <div class="d-flex justify-content-between align-items-end mt-3">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="receiveByRecForm" class="form-label text-dark-emphasis col-4"><small>Received by:</small></label>
                                        <input type="text" name="receiveByRecForm" id="receiveByRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" readonly disabled required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for=" plateRecForm" class="form-label text-dark-emphasis col-4"><small>Truck Plate No:</small></label>
                                        <input type="text" name="plateRecForm" id="plateRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" readonly disabled required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for=" driverRecForm" class="form-label text-dark-emphasis col-4"><small>Driver:</small></label>
                                        <input type="text" name="driverRecForm" id="driverRecForm" class="form-control form-control-sm col" style="background: #FFFFF2" readonly disabled required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for=" remarksRecForm" class="form-label text-dark-emphasis col-4"><small>Remarks:</small></label>
                                        <textarea name="remarksRecForm" id="remarksRecForm" class="form-control form-control-sm col" rows="3" style="background: #FFFFF2; height: auto;" disabled readonly></textarea>
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" class="btn btn-primary" id="submitRecBtn">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>