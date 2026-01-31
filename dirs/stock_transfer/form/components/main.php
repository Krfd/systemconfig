<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="request">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="d-flex flex-column gap-1">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select name="origin" id="origin" class="form-select" style="background: #FFFBDF" required>
                                                <option value="showroom" selected>SHOWROOM</option>
                                            </select>
                                            <label for="origin">Origin</label>
                                        </div>
                                        <div class="form-floating">
                                            <select name="whcode" id="whcode" class="form-select" style="background: #FFFBDF" required>
                                                <option value="SHOWRW" selected>SHOWRW</option>
                                            </select>
                                            <label for="whcode" class="form-label">WHCode</label>
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select name="branchName" id="branchName" class="form-select" style="background: #FFFBDF;" required>
                                                <option value="" selected></option>
                                                <option value="showroom">SHOWROOM</option>
                                                <option value="galleria">GALLERIA</option>
                                                <option value="plaza">PLAZA</option>
                                                <option value="viac">VIAC</option>
                                            </select>
                                            <label for="branchName" class="form-label">Destination</label>
                                        </div>
                                        <div class="form-floating">
                                            <select name="branchWhCode" id="branchWhCode" class="form-select" style="background: #FFFBDF" required>
                                                <option value="" selected></option>
                                                <option value="showwh">SHOWWH</option>
                                                <option value="gallwh">GALLWH</option>
                                                <option value="plzawh">PLZAWH</option>
                                                <option value="viacwh">VIACWH</option>
                                            </select>
                                            <label for="branchWhCode" class="form-label">WHCode</label>
                                        </div>
                                    </div>
                                    <div class="form-floating">
                                        <input type="text" name="center" id="center" placeholder="Service Center" class="form-control" style="background: #FFFBDF" required>
                                        <label for="center" class="form-label">Service Center</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="text" name="appcode" id="appcode" placeholder="Approval Code" class="form-control" style="background: #FFFBDF" required>
                                        <label for="appcode" class="form-label">Approval Code</label>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <div class="form-floating">
                                    <input type="text" name="strno" id="strno" placeholder="STR No." class="form-control" style="background: #FFFBDF" required>
                                    <label for="strno" class="form-label">STR No.</label>
                                </div>
                                <div class="form-floating">
                                    <input type="date" name="date" id="date" placeholder="Date" class="form-control" style="background: #FFFBDF" required>
                                    <label for="date" class="form-label">Date</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="status" id="status" placeholder="Status" class="form-control" style="background: #FFFBDF" required>
                                    <label for="status" class="form-label">Status</label>
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
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStockTransferUnit">Add</button>
                        </div>
                        <div class="table-responsive mt-5 d-flex gap-1">
                            <table class="table table-hover col-2" id="stock-transfer-serial-table">
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
                            <table class="table table-hover col" id="stock-transfer-form-table">
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
                                <div class="form-floating">
                                    <textarea name="remarks" id="remarks" class="form-control" rows="3" style="background: #FFFBDF; height: auto" placeholder="Remarks"></textarea>
                                    <label for="remarks" class="form-label">Remarks</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="prepby" id="prepby" class="form-control" style="background: #FFFBDF" placeholder="Prepared by" readonly required>
                                    <label for="prepby" class="form-label">Prepared by</label>
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