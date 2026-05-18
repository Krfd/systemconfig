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
    <div class="card shadow-sm mt-5">
        <div class="card-body">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="d-flex justify-content-between col">
                            <div class="d-flex align-items-baseline gap-3">
                                <label for="batch" class="form-label text-dark-emphasis col-3"><small>Batch No:</small></label>
                                <input type="text" name="batch" id="batch" class="form-control form-control-sm col" style="background: #F7F7F7" readonly>
                            </div>
                            <div class="d-flex flex-column gap-1 col-2">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                    <input type="date" name="date" id="formattedDate" class="form-control form-control-sm col" style="background: #FFFBDF" value="<?php echo date('Y-m-d'); ?>">
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="statusForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                    <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm col" value="NEW" style="background: #F7F7F7" readonly required>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>