<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="openincoming">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-2">
                                <div>
                                    <label for="srn" class="form-label text-dark-emphasis"><small>SRN:</small></label>
                                    <input type="text" name="srn" id="srn" value="SRNGALL0001" class="form-control form-control-sm" style="background: #FFFBDF" disabled required readonly>
                                </div>
                                <div>
                                    <label for="typeOfReq" class="form-label text-dark-emphasis"><small>Type of Request:</small></label>
                                    <select name="typeOfReq" id="typeOfReq" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                        <option value="STS">STS</option>
                                    </select>
                                </div>
                                <div class="input-group col p-0">
                                    <div class="col p-0">
                                        <label for="destination" class="form-label text-dark-emphasis"><small>Destination:</small></label>
                                        <select name="destination" id="destination" class="form-select form-select-sm" placeholder="Destination" style="background: #FFFBDF" required disabled readonly>
                                            <option value="galleria">GALLERIA</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <label for="branchWhCode" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                        <select name="branchWhCode" id="branchWhCode" class="form-select form-select-sm" placeholder="WHCode" style="background: #FFFBDF" required disabled readonly>
                                            <option value="gallwh">GALLWH</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group col p-0">
                                    <div class="col p-0">
                                        <label for="origin" class="form-label text-dark-emphasis"><small>Origin:</small></label>
                                        <select name="origin" id="origin" class="form-select form-select-sm" style="background: #FFFBDF" required disabled readonly>
                                            <option value="showroom">SHOWROOM</option>
                                        </select>
                                    </div>
                                    <div class="col p-0">
                                        <label for="whcode" class="form-label text-dark-emphasis"><small>WHS Code:</small></label>
                                        <select name="whcode" id="whcode" class="form-select form-select-sm" placeholder="WHCode" style="background: #FFFBDF" required disabled readonly>
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
                        <div class="table-responsive overflow-auto" style="max-height: 450px">
                            <table class="table datatables table-hover" id="openIncomingTable">
                                <thead class="sticky-top">
                                    <tr>
                                        <th class="text-secondary">#</th>
                                        <th class="text-secondary">Brand</th>
                                        <th class="text-secondary">Model</th>
                                        <th class="text-secondary">Category</th>
                                        <th class="text-secondary">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;">1</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE ACCESSORIES</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">5</td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;">2</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAM166-GALAXY A16 5G 4+128GB GOLD</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">5</td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;">3</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG 25W POWER ADAPTER</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE ACCESSORIES</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">30</td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;">4</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">SAMSUNG</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">PHONE ACCESSORIES</td>
                                        <td class="text-secondary" style="background: #FFFBDF;">10</td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                    <tr style="height: 40px; min-height: 40px">
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                        <td class="text-secondary" style="background: #FFFBDF;"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="totalRowOutside" class="d-flex border-top fw-bold"
                            style="background:#FFF7BC;">
                            <div class="p-2 flex-grow-1 text-end">
                                Total Quantity:
                            </div>
                            <div class="p-2" style="width:120px;" id="totalIncomingQty">
                                0
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-end mt-3">
                            <div class="d-flex flex-column gap-1 col-4">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="type" class="form-label text-dark-emphasis col-4"><small>Purpose of Request:</small></label>
                                    <input type="text" name="type" id="type" class="form-control form-control-sm col" style="background: #FFFBDF" value="Transfer" disabled required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="reqBy" class="form-label text-dark-emphasis col-4"><small>Requested by:</small></label>
                                    <input type="text" name="reqBy" id="reqBy" class="form-control form-control-sm col" style="background: #FFFBDF" value="Carmelo Arroyo" disabled readonly required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="remarks" class="form-label text-dark-emphasis col-4"><small>Remarks:</small></label>
                                    <textarea name="remarks" id="remarks" class="form-control form-control-sm col" rows="3" style="background: #FFFBDF; height: auto" disabled>Please transfer the following unit, ASAP.</textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>