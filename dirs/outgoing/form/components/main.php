<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="requestForm">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-2">
                                <div>
                                    <label for="srnForm" class="form-label text-dark-emphasis"><small>SRN:</small></label>
                                    <input type="text" name="srnForm" id="srnForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div>
                                    <label for="typeForm" class="form-label text-dark-emphasis"><small>Type of Request:</small></label>
                                    <select name="typeForm" id="typeForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                        <option value="" selected></option>
                                        <option value="STS">STS</option>
                                        <option value="Buffing">BUFFING</option>
                                    </select>
                                </div>
                                <div class="input-group col p-0">
                                    <div class="col p-0">
                                        <label for="desForm" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                        <select name="desForm" id="desForm" class="form-select form-select-sm" style="background: #FFFBDF;" required>
                                            <option value="showroom" selected>SHOWROOM</option>
                                            <option value="galleria">GALLERIA</option>
                                            <option value="plaza">PLAZA</option>
                                            <option value="viac">VIAC</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <label for="desCodeForm" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                        <select name="desCodeForm" id="desCodeForm" class="form-select form-select-sm" style="background: #FFFBDF;" required>
                                            <option value="showwh" selected>SHOWWH</option>
                                            <option value="gallwh">GALLWH</option>
                                            <option value="plzawh">PLZAWH</option>
                                            <option value="viacwh">VIACWH</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group col p-0">
                                    <div class="col p-0">
                                        <label for="originForm" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                        <select name="originForm" id="originForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                            <option value="" selected></option>
                                            <option value="showroom">SHOWROOM</option>
                                            <option value="galleria">GALLERIA</option>
                                            <option value="plaza">PLAZA</option>
                                            <option value="viac">VIAC</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <label for="originCodeForm" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                        <select name="originCodeForm" id="originCodeForm" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                            <option value="" selected></option>
                                            <option value="SHOWWH">SHOWWH</option>
                                            <option value="GALLWH">GALLWH</option>
                                            <option value="PLZAWH">PLZAWH</option>
                                            <option value="VIACWH">VIACWH</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <div class="gap-3">
                                    <label for="date" class="form-label text-dark-emphasis"><small>Date:</small></label>
                                    <input type="date" name="date" id="date" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div class="gap-3">
                                    <label for="statusForm" class="form-label text-dark-emphasis"><small>Status:</small></label>
                                    <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm" value="NEW" style="background: #FFFBDF" readonly required>
                                </div>
                            </div>
                        </div>
                        <div class="float-end my-3">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRequestUnit">Add</button>
                            <button type="reset" class="btn btn-danger clearTable">Clear</button>
                        </div>
                        <div class="table-responsive overflow-auto" style="max-height: 450px">
                            <table class="table table-hover" id="outgoingTable">
                                <thead class="sticky-top">
                                    <tr>
                                        <th class="text-secondary">#</th>
                                        <th class="text-secondary">Brand</th>
                                        <th class="text-secondary">Model</th>
                                        <th class="text-secondary">Category</th>
                                        <th class="text-secondary">Quantity</th>
                                        <th class="text-secondary">Action</th>
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
                        <div class="d-flex justify-content-between align-items-end mt-5">
                            <div class="d-flex flex-column gap-1">
                                <div class="gap-3">
                                    <label for="purposeForm" class="form-label text-dark-emphasis"><small>Purpose of Request:</small></label>
                                    <input type="text" name="purposeForm" id="purposeForm" class="form-control form-control-sm" style="background: #FFFBDF" required>
                                </div>
                                <div class="gap-3">
                                    <label for="reqByForm" class="form-label text-dark-emphasis"><small>Requested by:</small></label>
                                    <input type="text" name="reqByForm" id="reqByForm" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                                </div>
                                <div class="gap-3">
                                    <label for="remarksForm" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarksForm" id="remarksForm" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary" id="submitFormBtn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>