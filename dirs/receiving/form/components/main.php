<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="receivingForm">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-2">
                                <div>
                                    <label for="rrNoRecForm" class="form-label text-dark-emphasis"><small>RR No:</small></label>
                                    <input type="text" name="rrNoRecForm" id="rrNoRecForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="srnRecForm" class="form-label text-dark-emphasis"><small>SRN:</small></label>
                                    <input type="text" name="srnRecForm" id="srnRecForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div class="d-flex flex-column gap-1">
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="originRecForm" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                            <select name="originRecForm" id="originRecForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="" selected></option>
                                                <option value="showroom">SHOWROOM</option>
                                                <option value="galleria">GALLERIA</option>
                                                <option value="plaza">PLAZA</option>
                                                <option value="viac">VIAC</option>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="origCodeRecForm" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="origCodeRecForm" id="origCodeRecForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="" selected></option>
                                                <option value="SHOWWH">SHOWWH</option>
                                                <option value="GALLWH">GALLWH</option>
                                                <option value="PLZAWH">PLZAWH</option>
                                                <option value="VIACWH">VIACWH</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="desRecForm" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                            <select name="desRecForm" id="desRecForm" class="form-select form-select-sm" style="background: #FFFBDF;" required>
                                                <option value="showroom" selected>SHOWROOM</option>
                                                <option value="galleria">GALLERIA</option>
                                                <option value="plaza">PLAZA</option>
                                                <option value="viac">VIAC</option>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="desCodeRecForm" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="desCodeRecForm" id="desCodeRecForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="showwh" selected>SHOWWH</option>
                                                <option value="gallwh">GALLWH</option>
                                                <option value="plzawh">PLZAWH</option>
                                                <option value="viacwh">VIACWH</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <div>
                                    <label for="drNoRecForm" class="form-label text-dark-emphasis"><small>DR No:</small></label>
                                    <input type="text" name="drNoRecForm" id="drNoRecForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="docDateRecForm" class="form-label text-dark-emphasis"><small>Document Date:</small></label>
                                    <input type="date" name="docDateRecForm" id="docDateRecForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="statusRecForm" class="form-label text-dark-emphasis"><small>Status:</small></label>
                                    <input type="text" name="statusRecForm" id="statusRecForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                            </div>
                        </div>
                        <div class="float-end d-flex gap-3">
                            <div class="d-inline-flex align-items-center">
                                <label class="text-secondary fw-medium">Serial:</label>
                                <div class=" custom-switch">
                                    <input type="checkbox" id="switchSerial">
                                    <label for="switchSerial">
                                        <span class="left text-success">Manual</span>
                                        <span class="right text-primary">Scan</span>
                                    </label>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addReceivingUnit">Add</button>
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
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
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
                        <div class="d-flex justify-content-between align-items-end mt-5">
                            <div class="d-flex flex-column gap-1">
                                <div>
                                    <label for="receiveByRecForm" class="form-label text-dark-emphasis"><small>Received by:</small></label>
                                    <input type="text" name="receiveByRecForm" id="receiveByRecForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="plateRecForm" class="form-label text-dark-emphasis"><small>Truck Plate No:</small></label>
                                    <input type="text" name="plateRecForm" id="plateRecForm" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                                </div>
                                <div>
                                    <label for="driverRecForm" class="form-label text-dark-emphasis"><small>Driver:</small></label>
                                    <input type="text" name="driverRecForm" id="driverRecForm" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                                </div>
                                <div>
                                    <label for="remarksRecForm" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarksRecForm" id="remarksRecForm" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto;"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary" id="submitRecFormBtn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>