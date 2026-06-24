<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="returnOutgoing()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary"><span id="srn-title"></span> Request</h3>
        </div>
    </div>
    <div class="card shadow-sm mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="srn" class="form-label text-dark-emphasis col-3"><small>SRN:</small></label>
                                        <input type="text" name="srn" id="srn" class="form-control form-control-sm col" style="background: #f7f7f7" disabled required readonly>
                                    </div>
                                    <div class="input-group col p-0 d-flex gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="destination" class="form-label text-dark-emphasis col-5"><small>Destination:</small></label>
                                            <input type="text" name="destination" id="destination" class="form-control form-control-sm col ms-3" style="background: #f7f7f7" readonly>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline col">
                                            <label for="branchWhCode" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" name="branchWhCode" id="branchWhCode" class="form-control form-control-sm col" style="background: #f7f7f7" readonly>
                                        </div>
                                    </div>
                                    <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                        <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                            <label for="origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                            <input type="text" name="origin" id="origin" class="form-control form-control-sm col ms-3" style="background: #f7f7f7" readonly>
                                        </div>
                                        <div class="col p-0 d-flex align-items-baseline">
                                            <label for="whcode" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                            <input type="text" name="whcode" id="whcode" class="form-control form-control-sm col" style="background: #f7f7f7" readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-2">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                        <input type="text" name="date" id="date" class="form-control form-control-sm col" style="background: #f7f7f7" required disabled readonly>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="status" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                        <input type="text" name="status" id="status" class="form-control form-control-sm col" style="background: #f7f7f7" required disabled readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive mt-5 overflow-auto overall-progress" style="max-height: 450px">
                                <table class="table table-hover border border-secondary-subtle" id="openIncomingTable">
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
                                style="background:#faf0aa">
                                <div class="p-2 flex-grow-1 text-end">
                                    Total Quantity:
                                </div>
                                <div class="p-2" style="width:120px;" id="totalReqQuantity">
                                    0
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-end mt-5">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="type" class="form-label text-dark-emphasis col-4"><small>Purpose of Request:</small></label>
                                        <input type="text" name="purpose" id="purpose" class="form-control form-control-sm col" style="background: #f7f7f7" disabled required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="reqBy" class="form-label text-dark-emphasis col-4"><small>Requested by:</small></label>
                                        <input type="text" name="reqBy" id="reqBy" class="form-control form-control-sm col" style="background: #f7f7f7" disabled readonly required>
                                    </div>
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="remarks" class="form-label text-dark-emphasis col-4"><small>Remarks:</small></label>
                                        <textarea name="remarks" id="remarks" class="form-control form-control-sm col" rows="3" style="background: #f7f7f7; height: auto" disabled></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>