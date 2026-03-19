<div class="modal fade" tabindex="-1" id="assignBranchModal">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fw-bold text-secondary">Select Branch to deliver</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="branchDeliveryUnit" method="POST">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <label for="serial" class="form-label text-dark-emphasis"><small>Serial No:</small></label>
                            <input type="text" name="serial" id="serial" class="form-control form-control-sm" style="background: #FFFBDF" required>
                        </div>
                        <div>
                            <label for="branch" class="form-label text-dark-emphasis"><small>Branch:</small></label>
                            <select name="branch" id="branch" class="form-select form-select-sm" style="background: #FFFBDF" required>
                            </select>
                        </div>
                        <div>
                            <label for="brand" class="form-label text-dark-emphasis"><small>Brand:</small></label>
                            <input type="text" name="brand" id="brand" class="form-control form-control-sm selected-brand" style="background: #FFFBDF" readonly required>
                        </div>
                        <div>
                            <label for="model" class="form-label text-dark-emphasis"><small>Model:</small></label>
                            <input type="text" name="model" id="model" class="form-control form-control-sm selected-model" style="background: #FFFBDF" readonly required>
                        </div>
                        <div>
                            <label for="qty" class="form-label text-dark-emphasis"><small>Quantity:</small></label>
                            <input type="number" name="qty" id="qty" class="form-control form-control-sm" style="background: #FFFBDF" required>
                        </div>
                    </div>
                    <div class="mt-3 float-end">
                        <button class="btn btn-primary" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>