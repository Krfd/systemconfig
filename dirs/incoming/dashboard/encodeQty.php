<div id="pageLoader"
    class="position-fixed top-0 start-0 w-100 vh-100 d-none 
            justify-content-center align-items-center bg-white"
    style="z-index: 1055;">
    <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <div class="mt-2">Loading...</div>
    </div>
</div>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadBasketContent()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Encode Actual Quantity</h3>
        </div>
    </div>
    <div class="card shadow-sm mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="encodeqty">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="pklist" class="form-label text-dark-emphasis col-3"><small>PICKLIST:</small></label>
                                        <input type="text" name="pklist" id="pklist" class="form-control form-control-sm col" style="background: #f2f2f2" disabled required readonly>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-2">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                        <input type="date" name="date" id="date" class="form-control form-control-sm col" style="background: #f2f2f2" required disabled readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive overflow-auto mt-5" style="max-height: 450px">
                                <table class="table datatables" id="encodeQtyTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary">Quantity</th>
                                            <th class="text-secondary">Actual Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">1</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">APPLE</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">iPhone 16 128GB PINK</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">PHONE</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">3</td>
                                            <td class="align-middle ps-3 text-secondary editable-cell"
                                                style="background:#FFFBDF; padding: 3px;"
                                                contenteditable="true"
                                                onfocus="this.style.outline='none'; this.style.boxShadow='none';" oninput="validateNumber(this)">
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">2</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">SAMSUNG</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">GALAXY J7</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">PHONE</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">2</td>
                                            <td class="align-middle ps-3 text-secondary editable-cell"
                                                style="background:#FFFBDF; padding: 3px;"
                                                contenteditable="true"
                                                onfocus="this.style.outline='none'; this.style.boxShadow='none';" oninput="validateNumber(this)">
                                        </tr>
                                        <tr style="height: 40px; min-height: 40px">
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">3</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">APPLE</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">iPhone 15 128GB BLACK</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">PHONE</td>
                                            <td class="align-middle ps-3 text-secondary" style="background:#FFFBDF; padding: 3px">4</td>
                                            <td class="align-middle ps-3 text-secondary editable-cell"
                                                style="background:#FFFBDF; padding: 3px;"
                                                contenteditable="true"
                                                onfocus="this.style.outline='none'; this.style.boxShadow='none';" oninput="validateNumber(this)">
                                        </tr>
                                        <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                            <td style="background: #FFFBDF"></td>
                                        </tr>
                                        <tr class="item-row empty-row" style="height: 40px; min-height: 40px;">
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
                            <!-- <div id="totalRowOutside" class="d-flex border-top fw-bold"
                                style="background:#FFFBDF;">
                                <div class="p-2 flex-grow-1 text-end">
                                    Total Quantity:
                                </div>
                                <div class="p-2" style="width:120px;" id="totalEncodedQty">0</div>
                            </div> -->
                            <button class="btn btn-primary d-block ms-auto mt-5" type="submit">Save</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>