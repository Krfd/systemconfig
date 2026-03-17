<div class="modal fade" tabindex="-1" id="assignBranchModal">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fw-bold text-secondary">Select Branch to deliver</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="newReceivingUnit" method="POST">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <label for="serial" class="form-label text-dark-emphasis"><small>Serial No:</small></label>
                            <input type="text" name="serial" id="serial" class="form-control form-control-sm" style="background: #FFFBDF" required>
                        </div>
                        <div>
                            <label for="branch" class="form-label text-dark-emphasis"><small>Branch:</small></label>
                            <!-- <input type="text" name="branch" id="branch" class="form-control form-control-sm selected-model" style="background: #FFFBDF" required> -->
                            <select name="branch" id="branch" class="form-select form-select-sm" style="background: #FFFBDF" required>
                                <option value="" selected>Select Branch</option>
                                <option value="GALLERIA">GALLERIA</option>
                                <option value="PLAZA">PLAZA</option>
                                <option value="VIAC">VIAC</option>
                            </select>
                        </div>
                        <div>
                            <label for="model" class="form-label text-dark-emphasis"><small>Model:</small></label>
                            <input type="text" name="model" id="model" class="form-control form-control-sm selected-model" style="background: #FFFBDF" readonly required>
                        </div>
                        <div>
                            <label for="qty" class="form-label text-dark-emphasis"><small>Quantity:</small></label>
                            <input type="number" name="qty" id="qty" class="form-control form-control-sm" style="background: #FFFBDF" readonly required>
                        </div>
                    </div>
                    <div class="mt-3 float-end">
                        <button class="btn btn-primary" type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>