<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 40px" type="button" onclick="returnToDashboard()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Received</h3>
        </div>
    </div>
    <div class="card shadow-sm" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="request">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="form-floating">
                                        <input type="text" name="drno" id="drno" placeholder="DR No." class="form-control" style="background: #FFFBDF" value="DR-10001" readonly>
                                        <label for="drno" class="form-label">DR No.</label>
                                    </div>
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select name="origin" id="origin" class="form-select" style="background: #FFFBDF" readonly>
                                                <option value="showroom" selected>SHOWROOM</option>
                                            </select>
                                            <label for="origin">Origin</label>
                                        </div>
                                        <div class="form-floating">
                                            <select name="whcode" id="whcode" class="form-select" style="background: #FFFBDF" readonly>
                                                <option value="SHOWWH" selected>SHOWWH</option>
                                            </select>
                                            <label for="whcode" class="form-label">WHCode</label>
                                        </div>
                                    </div>
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select name="branchName" id="branchName" class="form-select" style="background: #FFFBDF;" readonly>
                                                <option value="plaza" selected>PLAZA</option>
                                            </select>
                                            <label for="branchName" class="form-label">Destination</label>
                                        </div>
                                        <div class="form-floating">
                                            <select name="branchWhCode" id="branchWhCode" class="form-select" style="background: #FFFBDF" readonly>
                                                <option value="plzawh" selected>PLZAWH</option>
                                            </select>
                                            <label for="branchWhCode" class="form-label">WHCode</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1">
                                    <div class="form-floating">
                                        <input type="text" name="deldate" id="deldate" placeholder="Delivery Date" class="form-control" style="background: #FFFBDF" value="01/30/2026" readonly>
                                        <label for="deldate" class="form-label">Delivery Date</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="text" name="docdate" id="docdate" placeholder="Document Date" class="form-control" style="background: #FFFBDF" value="01/30/2026" readonly>
                                        <label for="docdate" class="form-label">Document Date</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="text" name="status" id="status" placeholder="Status" class="form-control" style="background: #FFFBDF" value="IN TRANSIT" readonly>
                                        <label for="status" class="form-label">Status</label>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive mt-5 d-flex gap-1">
                                <table class="table table-hover col-2" id="serialTable">
                                    <thead>
                                        <tr>
                                            <th class="text-secondary" colspan="2">Serial No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-secondary" colspan="2" rowspan="9" style="background: #FFFDBF"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="table table-hover col" id="deliveryTable">
                                    <thead>
                                        <tr>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Destination</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PLAZA</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE ACCESSORIES</td>
                                            <td class="text-secondary" style="background: #FFFBDF">5</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">SAM166-GALAXY A16 5G 4+128GB GOLD</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PLAZA</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE</td>
                                            <td class="text-secondary" style="background: #FFFBDF">5</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG 25W POWER ADAPTER</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PLAZA</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE ACCESSORIES</td>
                                            <td class="text-secondary" style="background: #FFFBDF">30</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PLAZA</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE ACCESSORIES</td>
                                            <td class="text-secondary" style="background: #FFFBDF">10</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-start align-items-start mt-5 gap-1">
                                <div class="d-flex flex-column gap-1">
                                    <div class="form-floating">
                                        <input type="text" name="prepby" id="prepby" class="form-control" style="background: #FFFBDF" placeholder="Prepared by" value="Vjay Endoma" readonly>
                                        <label for="prepby" class="form-label">Prepared by</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="text" name="plate" id="plate" class="form-control" style="background: #FFFBDF" placeholder="Truck Plate No." value="KGH-345" readonly>
                                        <label for="plate" class="form-label">Truck Plate No.</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="text" name="driver" id="driver" class="form-control" style="background: #FFFBDF" placeholder="Driver" value="Roger Amaguin" readonly>
                                        <label for="driver" class="form-label">Driver</label>
                                    </div>
                                </div>
                                <div class="form-floating">
                                    <textarea name="remarks" id="remarks" class="form-control" rows="7" style="background: #FFFBDF; height: auto; resize: horizontal" placeholder="Remarks" readonly>
                                        Please transfer the following units, ASAP.
                                    </textarea>
                                    <label for="remarks" class="form-label">Remarks</label>
                                </div>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>
<script src="dirs/receiving/received/script/received.js"></script>