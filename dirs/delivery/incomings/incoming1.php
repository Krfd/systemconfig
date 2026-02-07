<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 40px" type="button" onclick="loaditem1()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Request</h3>
        </div>
    </div>
    <div class="card shadow-sm mt-3" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-2">
                                    <div>
                                        <label for="srn" class="form-label text-dark-emphasis"><small>SRN:</small></label>
                                        <input type="text" name="srn" id="srn" value="SRNGALL0001" class="form-control" style="background: #FFFBDF" disabled required readonly>
                                    </div>
                                    <div>
                                        <label for="typeOfReq" class="form-label text-dark-emphasis"><small>Type of Request:</small></label>
                                        <select name="typeOfReq" id="typeOfReq" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                            <option value="STS">STS</option>
                                        </select>
                                    </div>
                                    <div class="input-group w-100 bg-secondary">
                                        <div>
                                            <label for="destination" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                            <select name="destination" id="destination" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                                <option value="galleria">GALLERIA</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label for="branchWhCode" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="branchWhCode" id="branchWhCode" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                                <option value="gallwh">GALLWH</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="input-group w-100 bg-primary">
                                        <div>
                                            <label for="origin" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                            <select name="origin" id="origin" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                                <option value="showroom">SHOWROOM</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label for="whcode" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                            <select name="whcode" id="whcode" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                                <option value="showwh">SHOWWH</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1">
                                    <div>
                                        <label for="date" class="form-label text-dark-emphasis"><small>Date:</small></label>
                                        <input type="text" name="date" id="date" class="form-control form-control-sm" style="background: #FFFBDF" value="01/30/2026" required disabled readonly>
                                    </div>
                                    <div>
                                        <label for="status" class="form-label text-dark-emphasis"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" value="NEW" class="form-control form-control-sm" style="background: #FFFBDF" required disabled readonly>
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
                                    <div>
                                        <label for="type" class="form-label text-dark-emphasis"><small>Purpose of Request:</small></label>
                                        <input type="text" name="type" id="type" class="form-control" style="background: #FFFBDF" value="Transfer" disabled required>
                                    </div>
                                    <div>
                                        <label for="reqBy" class="form-label text-dark-emphasis"><small>Requested by:</small></label>
                                        <input type="text" name="reqBy" id="reqBy" class="form-control" style="background: #FFFBDF" value="Carmelo Arroyo" disabled readonly required>
                                    </div>
                                    <div>
                                        <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                        <textarea name="remarks" id="remarks" class="form-control" rows="3" style="background: #FFFBDF; height: auto" disabled>Please transfer the following unit, ASAP.</textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>
<script src="dirs/delivery/incomings/script/incomings.js"></script>