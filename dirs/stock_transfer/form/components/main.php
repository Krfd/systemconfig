<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="request">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-2">
                                <div class="d-flex flex-column gap-1">
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="originStockForm" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                            <select name="originStockForm" id="originStockForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="showroom" selected>SHOWROOM</option>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="originCodeStockForm" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="originCodeStockForm" id="originCodeStockForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="SHOWRW" selected>SHOWRW</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0">
                                        <div class="col p-0">
                                            <label for="desStockForm" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                            <select name="desStockForm" id="desStockForm" class="form-select form-select-sm" style="background: #FFFBDF;" required>
                                                <option value="" selected></option>
                                                <option value="showroom">SHOWROOM</option>
                                                <option value="galleria">GALLERIA</option>
                                                <option value="plaza">PLAZA</option>
                                                <option value="viac">VIAC</option>
                                            </select>
                                        </div>
                                        <div class="col p-0">
                                            <label for="desCodeStockForm" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="desCodeStockForm" id="desCodeStockForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                                <option value="" selected></option>
                                                <option value="showwh">SHOWWH</option>
                                                <option value="gallwh">GALLWH</option>
                                                <option value="plzawh">PLZAWH</option>
                                                <option value="viacwh">VIACWH</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="serviceCenterStockForm" class="form-label text-dark-emphasis"><small>Service Center:</small></label>
                                        <input type="text" name="serviceCenterStockForm" id="serviceCenterStockForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                    </div>
                                    <div>
                                        <label for="appcodeStockForm" class="form-label text-dark-emphasis"><small>Approval Code:</small></label>
                                        <input type="text" name="appcodeStockForm" id="appcodeStockForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <div>
                                    <label for="strNoStockForm" class="form-label text-dark-emphasis"><small>STR No:</small></label>
                                    <input type="text" name="strNoStockForm" id="strNoStockForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="dateStockForm" class="form-label text-dark-emphasis"><small>Date:</small></label>
                                    <input type="date" name="dateStockForm" id="dateStockForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="statusStockForm" class="form-label text-dark-emphasis"><small>Status:</small></label>
                                    <input type="text" name="statusStockForm" id="statusStockForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
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
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStockFormTransferUnit">Add</button>
                        </div>
                        <div class="table-responsive mt-5 d-flex gap-1 overflow-auto" style="height: 450px">
                            <table class="table table-hover col-2" id="stockForm-transfer-serial-table">
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
                            <table class="table table-hover col" id="stockForm-transfer-form-table">
                                <thead>
                                    <tr>
                                        <th class="text-secondary">#</th>
                                        <th class="text-secondary">Brand</th>
                                        <th class="text-secondary">Model</th>
                                        <th class="text-secondary">Category</th>
                                        <th class="text-secondary">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="height: 30px; min-height: 30px">
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
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
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
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
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
                                    </tr>
                                    <tr style="height: 30px; min-height: 30px">
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
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-between align-items-end mt-5">
                            <div class="d-flex flex-column gap-1">
                                <div>
                                    <label for="remarksStockForm" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarksStockForm" id="remarksStockForm" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto"></textarea>
                                </div>
                                <div>
                                    <label for="prepByStockForm" class="form-label text-dark-emphasis"><small>Prepared by:</small></label>
                                    <input type="text" name="prepByStockForm" id="prepByStockForm" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary" id="submitStockFormBtn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>