<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadDeliveryBasketContent()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Create Delivery</h3>
        </div>
    </div>
    <div class="card shadow-sm mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="deliver">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col">
                                            <label for="picklist" class="form-label text-secondary col-3">Picklist: </label>
                                            <input type="text" name="picklist" id="picklist" class="form-control form-control-sm col ms-3" style="background: #F7F7F7" readonly>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                        <div class="p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="user-origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" name="user-origin" id="user-origin" class="form-control form-control-sm col ms-3" style="background: #F7F7F7;" required readonly>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline">
                                            <label for="originCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <select name="originCodeForm" id="originCodeForm" class="form-select form-select-sm col" style="background: #F7F7F7" required>
                                                <option value="NEWS" selected>NEWS</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-baseline gap-3">
                                        <label for="docdate" class="form-label text-dark-emphasis col-4"><small>Document Date:</small></label>
                                        <input type="date" name="docdate" id="docdate" class="form-control form-control-sm col" style="background: #F7F7F7" readonly required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="deldate" class="form-label text-dark-emphasis col-4"><small>Delivery Date:</small></label>
                                        <input type="date" name="deldate" id="deldate" class="form-control form-control-sm col" style="background: #FFFBDF" required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="statusForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm col" style="background: #F7F7F7" value="NEW" readonly required>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive overflow-auto mt-3" style="max-height: 450px">
                                <table class="table table-hover datatables" id="deliveryFormTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary">#</th>
                                            <th class="text-secondary">Brand</th>
                                            <th class="text-secondary">Model</th>
                                            <th class="text-secondary d-none"></th>
                                            <th class="text-secondary">Category</th>
                                            <th class="text-secondary text-center">Quantity</th>
                                            <!-- <th class="text-secondary">Action</th> -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <div id="totalRowOutside" class="d-flex border-top fw-bold"
                                style="background:#FFF7BC;">
                                <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                                <div class="p-2" style="width:120px;" id="delTotalQuantity">0</div>
                            </div>
                            <div class="d-flex justify-content-start align-items-end mt-5 gap-1">
                                <div class="d-flex flex-column gap-1 col-3">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="prepby" class="form-label text-dark-emphasis col-4"><small>Prepared by:</small></label>
                                        <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #F2F2F2" readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="driver" class="form-label text-dark-emphasis col-4"><small>Driver:</small></label>
                                        <input type="text" name="driver" id="driver" class="form-control form-control-sm col" style="background: #FFFBDF" required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="truckCat" class="form-label text-dark-emphasis col-4">
                                            <small>Truck Category:</small>
                                        </label>
                                        <select name="truckCat" id="truckCat" class="form-select form-select-sm col" style="background: #FFFBDF" required>
                                            <option value="">Select Category</option>
                                            <option value="4 Wheeler">4 Wheeler</option>
                                            <option value="6 Wheeler">6 Wheeler</option>
                                            <option value="10 Wheeler">10 Wheeler</option>
                                        </select>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="plate" class="form-label text-dark-emphasis col-4">
                                            <small>Truck Plate No:</small>
                                        </label>
                                        <select name="plate" id="plate" class="form-select form-select-sm col" style="background: #FFFBDF" required>
                                            <option value="">Select Plate</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-2">
                                    <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                    <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="3" style="background: #FFFBDF; height: auto; resize: horizontal"></textarea>
                                </div>
                                <div class="ms-auto">
                                    <button class="clearfix btn btn-primary float-end" type="submit" id="deliveryBtn">Commit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
<script>
    $("#desForm").on("change", function() {
        loadDestinationWhscodes();
    });
</script>