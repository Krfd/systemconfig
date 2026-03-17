<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryItems(deliveryPicklistNum, deliveryNum)">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary" id="deliverySRN"></h3>
        </div>
    </div>
    <div class="card shadow-sm overflow-auto mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="delivery">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="drno" class="form-label text-dark-emphasis col-3"><small>DR No:</small></label>
                                        <input type="text" name="drno" id="drno" class="form-control form-control-sm col" style="background: #FFFBDF" value="DR-10001" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="pcklstno" class="form-label text-dark-emphasis col-3"><small>Picklist No:</small></label>
                                        <input type="text" name="pcklstno" id="pcklstno" class="form-control form-control-sm col" style="background: #FFFBDF" value="PL10001" readonly>
                                    </div>
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <select name="origin" id="origin" class="form-select form-select-sm col ms-3" style="background: #FFFBDF" readonly>
                                                <option value="showroom" selected>SHOWROOM</option>
                                            </select>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline col">
                                            <label for="whcode" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <select name="whcode" id="whcode" class="form-select form-select-sm col" style="background: #FFFBDF" readonly>
                                                <option value="SHOWWH" selected>SHOWWH</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="branchName" class="form-label text-dark-emphasis col-5"><small>Destination:</small></label>
                                            <select name="branchName" id="branchName" class="form-select form-select-sm col ms-3" style="background: #FFFBDF;" readonly>
                                                <option value="plaza" selected>PLAZA</option>
                                            </select>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline">
                                            <label for="branchWhCode" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <select name="branchWhCode" id="branchWhCode" class="form-select form-select-sm col" style="background: #FFFBDF" readonly>
                                                <option value="plzawh" selected>PLZAWH</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="deldate" class="form-label text-dark-emphasis col-4"><small>Delivery Date:</small></label>
                                        <input type="text" name="deldate" id="deldate" class="form-control form-control-sm col" style="background: #FFFBDF" value="01/30/2026" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="docdate" class="form-label text-dark-emphasis col-4"><small>Document Date:</small></label>
                                        <input type="text" name="docdate" id="docdate" class="form-control form-control-sm col" style="background: #FFFBDF" value="01/30/2026" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="status" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" class="form-control form-control-sm col" style="background: #FFFBDF" value="IN TRANSIT" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive mt-5 d-flex gap-1 overflow-auto" style="max-height: 450px">
                                <table class="table table-hover col-2" id="serialTable">
                                    <thead class="sticky-top">
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
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE ACCESSORIES</td>
                                            <td class="text-secondary" style="background: #FFFBDF">5</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">SAM166-GALAXY A16 5G 4+128GB GOLD</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE</td>
                                            <td class="text-secondary" style="background: #FFFBDF">5</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG 25W POWER ADAPTER</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE ACCESSORIES</td>
                                            <td class="text-secondary" style="background: #FFFBDF">30</td>
                                        </tr>
                                        <tr style="height: 30px; min-height: 30px; cursor: pointer">
                                            <td class="text-secondary" style="background: #FFFBDF">SAMSUNG</td>
                                            <td class="text-secondary" style="background: #FFFBDF">EF-DX211-GALAXY A+ KEYBOARD SLIM</td>
                                            <td class="text-secondary" style="background: #FFFBDF">PHONE ACCESSORIES</td>
                                            <td class="text-secondary" style="background: #FFFBDF">10</td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr style="height: 50px; min-height: 50px; cursor: pointer">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border-top fw-bold"
                                style="background:#FFF7BC;">
                                <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                                <div class="p-2" style="width:120px;" id="totalQuantity">0</div>
                            </div>
                            <div class="d-flex justify-content-start align-items-start mt-5 gap-1">
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="prepby" class="form-label text-dark-emphasis col-4"><small>Prepared by:</small></label>
                                        <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #FFFBDF" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="plate" class="form-label text-dark-emphasis col-4"><small>Truck Plate No:</small></label>
                                        <input type="text" name="plate" id="plate" class="form-control form-control-sm col" style="background: #FFFBDF" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="driver" class="form-label text-dark-emphasis col-4"><small>Driver:</small></label>
                                        <input type="text" name="driver" id="driver" class="form-control form-control-sm col" style="background: #FFFBDF" readonly>
                                    </div>
                                </div>
                                <div class="col-2">
                                    <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto; resize: horizontal" readonly>
                                        Please transfer the following units, ASAP.
                                    </textarea>
                                </div>
                            </div>
                        </form>
                    </div>
            </section>
        </div>
    </div>
</div>