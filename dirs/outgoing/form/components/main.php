<div class="card shadow-sm" style="height: 75vh;" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="request">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="form-floating">
                                    <input type="text" name="stsNo" id="stsNo" placeholder="STS No." class="form-control" style="background: #FFFBDF" required>
                                    <label for="stsNo" class="form-label">SRN</label>
                                </div>
                                <div class="form-floating">
                                    <input type="date" name="date" id="date" placeholder="Date" class="form-control" style="background: #FFFBDF" required>
                                    <label for="date" class="form-label">Date</label>
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
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="input-group">
                                    <div class="form-floating">
                                        <select name="branchName" id="branchName" class="form-select" style="background: #FFFBDF" required>
                                            <option value="showroom" selected>SHOWROOM</option>
                                            <option value="galleria">GALLERIA</option>
                                            <option value="plaza">PLAZA</option>
                                            <option value="viac">VIAC</option>
                                        </select>
                                    </div>
                                    <div class="form-floating">
                                        <select name="branchWhCode" id="branchWhCode" class="form-select" style="background: #FFFBDF" required>
                                            <option value="showwh" selected>SHOWWH</option>
                                            <option value="gallwh">GALLWH</option>
                                            <option value="plzawh">PLZAWH</option>
                                            <option value="viacwh">VIACWH</option>
                                        </select>
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
                            </div>
                        </div>
                        <div class="float-end">
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUnit">Add</button>
                            <button type="button" class="btn btn-danger clearTable" data-bs-toggle="modal">Clear</button>
                        </div>
                        <div class="table-responsive mt-5">
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
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                        <td style="background: #FFFBDF"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
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
                    </form>
                </div>
        </section>
    </div>
</div>