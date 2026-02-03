<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="request">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="form-floating">
                                    <input type="text" name="srn" id="srn" placeholder="SRN" class="form-control" style="background: #FFFBDF" required>
                                    <label for="srn" class="form-label">SRN</label>
                                </div>

                                <div class="form-floating">
                                    <select name="typeOfReq" id="typeOfReq" class="form-select" style="background: #FFFBDF" required>
                                        <option value="" selected></option>
                                        <option value="STS">STS</option>
                                        <option value="Buffing">BUFFING</option>
                                    </select>
                                    <label for="typeOfReq">Type of Request</label>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <div class="input-group">
                                    <div class="form-floating">
                                        <select name="branchName" id="branchName" class="form-select" style="background: #FFFBDF;" required>
                                            <option value="showroom" selected>SHOWROOM</option>
                                            <option value="galleria">GALLERIA</option>
                                            <option value="plaza">PLAZA</option>
                                            <option value="viac">VIAC</option>
                                        </select>
                                        <label for="branchName" class="form-label">Destination</label>
                                    </div>
                                    <div class="form-floating">
                                        <select name="branchWhCode" id="branchWhCode" class="form-select" style="background: #FFFBDF" required>
                                            <option value="showwh" selected>SHOWWH</option>
                                            <option value="gallwh">GALLWH</option>
                                            <option value="plzawh">PLZAWH</option>
                                            <option value="viacwh">VIACWH</option>
                                        </select>
                                        <label for="branchWhCode" class="form-label">WHCode</label>
                                    </div>
                                </div>
                                <div class="input-group">
                                    <div class="form-floating">
                                        <select name="origin" id="origin" class="form-select" style="background: #FFFBDF" required>
                                            <option value="" selected></option>
                                            <option value="showroom">SHOWROOM</option>
                                            <option value="galleria">GALLERIA</option>
                                            <option value="plaza">PLAZA</option>
                                            <option value="viac">VIAC</option>
                                        </select>
                                        <label for="origin">Origin</label>
                                    </div>
                                    <div class="form-floating">
                                        <select name="whcode" id="whcode" class="form-select" style="background: #FFFBDF" required>
                                            <option value="" selected></option>
                                            <option value="SHOWWH">SHOWWH</option>
                                            <option value="GALLWH">GALLWH</option>
                                            <option value="PLZAWH">PLZAWH</option>
                                            <option value="VIACWH">VIACWH</option>
                                        </select>
                                        <label for="whcode" class="form-label">WHCode</label>
                                    </div>
                                </div>
                                <div class="form-floating">
                                    <input type="date" name="date" id="date" placeholder="Date" class="form-control" style="background: #FFFBDF" required>
                                    <label for="date" class="form-label">Date</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="status" id="status" placeholder="Status" class="form-control" value="NEW" style="background: #FFFBDF" readonly required>
                                    <label for="status" class="form-label">Status</label>
                                </div>
                            </div>
                        </div>
                        <div class="float-end my-3">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRequestUnit">Add</button>
                            <button type="reset" class="btn btn-danger clearTable">Clear</button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover" id="outgoingTable">
                                <thead>
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
                                <div class="form-floating">
                                    <input type="text" name="type" id="type" class="form-control" style="background: #FFFBDF" placeholder="Purpose of Request" required>
                                    <label for="type" class="form-label">Purpose of Request</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="reqBy" id="reqBy" class="form-control" style="background: #FFFBDF" placeholder="Requested by" readonly required>
                                    <label for="reqBy" class="form-label">Requested by</label>
                                </div>
                                <div class="form-floating">
                                    <textarea name="remarks" id="remarks" class="form-control" rows="3" style="background: #FFFBDF; height: auto" placeholder="Remarks"></textarea>
                                    <label for="remarks" class="form-label">Remarks</label>
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