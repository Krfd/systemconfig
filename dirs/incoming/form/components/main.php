<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="openincoming">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="form-floating">
                                    <input type="text" name="srn" id="srn" placeholder="SRN" value="SRNGALL0001" class="form-control" style="background: #FFFBDF" disabled required readonly>
                                    <label for="srn" class="form-label">SRN</label>
                                </div>
                                <div class="form-floating">
                                    <select name="typeOfReq" id="typeOfReq" class="form-select" style="background: #FFFBDF" required disabled readonly>
                                        <option value="STS">STS</option>
                                    </select>
                                    <label for="typeOfReq">Type of Request</label>
                                </div>
                                <div class="input-group">
                                    <div class="form-floating">
                                        <select name="destination" id="destination" class="form-select" placeholder="Destination" style="background: #FFFBDF" required disabled readonly>
                                            <option value="galleria">GALLERIA</option>
                                        </select>
                                        <label for="destination" class="form-label">Destination</label>
                                    </div>
                                    <div class="form-floating">
                                        <select name="branchWhCode" id="branchWhCode" class="form-select" placeholder="WHCode" style="background: #FFFBDF" required disabled readonly>
                                            <option value="gallwh">GALLWH</option>
                                        </select>
                                        <label for="branchWhCode" class="form-label">WHCode</label>
                                    </div>
                                </div>
                                <div class="input-group">
                                    <div class="form-floating">
                                        <select name="origin" id="origin" class="form-select" placeholder="Origin" style="background: #FFFBDF" required disabled readonly>
                                            <option value="showroom">SHOWROOM</option>
                                        </select>
                                        <label for="origin" class="form-label">Origin</label>
                                    </div>
                                    <div class="form-floating">
                                        <select name="whcode" id="whcode" class="form-select" placeholder="WHCode" style="background: #FFFBDF" required disabled readonly>
                                            <option value="showwh">SHOWWH</option>
                                        </select>
                                        <label for="whcode" class="form-label">WHCode</label>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <div class="form-floating">
                                    <input type="text" name="date" id="date" placeholder="Date" class="form-control" style="background: #FFFBDF" value="01/30/2026" required disabled readonly>
                                    <label for="date" class="form-label">Date</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="status" id="status" placeholder="Status" value="NEW" class="form-control" style="background: #FFFBDF" required disabled readonly>
                                    <label for="status" class="form-label">Status</label>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive mt-5">
                            <table class="table datatables table-hover" id="openIncomingTable">
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
                                    <tr>
                                        <td class="text-secondary" style="background: #FFFBDF;">1</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE ACCESSORIES</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">5</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary" style="background: #FFFBDF;">2</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAM166-GALAXY A16 5G 4+128GB GOLD</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">5</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary" style="background: #FFFBDF;">3</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG 25W POWER ADAPTER</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE ACCESSORIES</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">30</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary" style="background: #FFFBDF;">4</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE ACCESSORIES</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">10</td>
                                    </tr>
                                    <tr style="height: 50px;">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                    <tr style="height: 50px;">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                    <tr style="height: 50px;">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                    <tr style="height: 50px;">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-between align-items-end mt-5">
                            <div class="d-flex flex-column gap-1">
                                <div class="form-floating">
                                    <input type="text" name="type" id="type" class="form-control" style="background: #FFFBDF" placeholder="Purpose of Request" value="Transfer" disabled required>
                                    <label for="type" class="form-label">Purpose of Request</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="reqBy" id="reqBy" class="form-control" style="background: #FFFBDF" placeholder="Requested by" value="Carmelo Arroyo" disabled readonly required>
                                    <label for="reqBy" class="form-label">Requested by</label>
                                </div>
                                <div class="form-floating">
                                    <textarea name="remarks" id="remarks" class="form-control" rows="3" style="background: #FFFBDF; height: auto" placeholder="Remarks" disabled>Please transfer the following unit, ASAP.</textarea>
                                    <label for="remarks" class="form-label">Remarks</label>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#openPicklistTable">Add to Picklist</button>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>