<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="receivingForm">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-2">
                                <div>
                                    <label for="rrNoRec" class="form-label text-dark-emphasis"><small>RR No:</small></label>
                                    <input type="text" name="rrNoRec" id="rrNoRec" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="srnRec" class="form-label text-dark-emphasis"><small>SRN:</small></label>
                                    <input type="text" name="srnRec" id="srnRec" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div class="d-flex flex-column gap-1">
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="originRec" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                            <select name="originRec" id="originRec" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="" selected></option>
                                                <option value="showroom">SHOWROOM</option>
                                                <option value="galleria">GALLERIA</option>
                                                <option value="plaza">PLAZA</option>
                                                <option value="viac">VIAC</option>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="origCodeRec" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="origCodeRec" id="origCodeRec" class="form-select form-select-sm" style="background: #FFFBDF" required>
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
                                            <label for="desRec" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                            <select name="desRec" id="desRec" class="form-select form-select-sm" style="background: #FFFBDF;" required>
                                                <option value="showroom" selected>SHOWROOM</option>
                                                <option value="galleria">GALLERIA</option>
                                                <option value="plaza">PLAZA</option>
                                                <option value="viac">VIAC</option>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="desCodeRec" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="desCodeRec" id="desCodeRec" class="form-select form-select-sm" style="background: #FFFBDF" required>
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
                                    <label for="drNoRec" class="form-label text-dark-emphasis"><small>DR No:</small></label>
                                    <input type="text" name="drNoRec" id="drNoRec" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="docDateRec" class="form-label text-dark-emphasis"><small>Document Date:</small></label>
                                    <input type="date" name="docDateRec" id="docDateRec" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="statusRec" class="form-label text-dark-emphasis"><small>Status:</small></label>
                                    <input type="text" name="statusRec" id="statusRec" class="form-control form-control-sm" style="background: #FFFBDF" required>
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
                                    <label for="receiveByRec" class="form-label text-dark-emphasis"><small>Received by:</small></label>
                                    <input type="text" name="receiveByRec" id="receiveByRec" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="plateRec" class="form-label text-dark-emphasis"><small>Truck Plate No:</small></label>
                                    <input type="text" name="plateRec" id="plateRec" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                                </div>
                                <div>
                                    <label for="driverRec" class="form-label text-dark-emphasis"><small>Driver:</small></label>
                                    <input type="text" name="driverRec" id="driverRec" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                                </div>
                                <div>
                                    <label for="remarksRec" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarksRec" id="remarksRec" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto;"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>