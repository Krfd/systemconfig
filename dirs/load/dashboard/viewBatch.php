<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadingBasket()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary" id="batchNumDisplay"></h3>
            </div>
        </div>
    </div>
    <div class="card shadow-sm mt-3">
        <div class="card-body">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="d-flex justify-content-between col">
                            <div class="d-flex align-items-baseline gap-3 col-3">
                                <label for="batch" class="form-label text-dark-emphasis col-3"><small>Batch No:</small></label>
                                <input type="text" name="batch" id="batch" class="form-control form-control-sm col" style="background: #F7F7F7" readonly>
                            </div>
                            <div class="d-flex flex-column gap-1 col-2">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                    <input type="date" name="date" id="formattedDate" class="form-control form-control-sm col" style="background: #F7F7F7" readonly>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="statusForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                    <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm col" style="background: #F7F7F7" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive-md mt-3">
                            <table class="table table-hover datatables" id="batchItemTable">
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
                                </tbody>
                            </table>
                        </div>
                        <div id="totalRowOutside" class="d-flex border-top fw-bold"
                            style="background:#FFFBDF;">
                            <div class="p-2 flex-grow-1 text-end">
                                Total Quantity:
                            </div>
                            <div class="p-2" style="width:120px;" id="batchTotal">
                                0
                            </div>
                        </div>
                        <div class="d-flex justify-content-start align-items-end mt-5 gap-1">
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="prepby" class="form-label text-dark-emphasis col-4"><small>Prepared by:</small></label>
                                    <input type="text" name="prepby" id="prepby" class="form-control form-control-sm col" style="background: #F2F2F2" readonly>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="driver" class="form-label text-dark-emphasis col-4"><small>Driver:</small></label>
                                    <input type="text" name="driver" id="driver" class="form-control form-control-sm col" style="background: #F2F2F2" required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="truckCat" class="form-label text-dark-emphasis col-4">
                                        <small>Truck Category:</small>
                                    </label>
                                    <input class="form-control form-control-sm col" id="truckCat" style="background: #F2F2F2">
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="plate" class="form-label text-dark-emphasis col-4">
                                        <small>Truck Plate No:</small>
                                    </label>
                                    <input class="form-control form-control-sm col" id="plate" style="background: #F2F2F2">
                                </div>
                            </div>
                            <div class="col-2 mb-auto">
                                <label for="remarks" class="form-label text-dark-emphasis"><small>Remarks:</small></label>
                                <textarea name="remarks" id="remarks" class="form-control form-control-sm" rows="3" style="background: #F2F2F2; height: auto; resize: horizontal"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>