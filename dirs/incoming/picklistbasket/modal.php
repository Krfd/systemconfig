<div class="modal fade" tabindex="-1" id="generatePicklistTable">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fw-bold text-secondary">Generate Picklist Number</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form method="POST" id="generatePicklistNumForm">
                    <div class="d-flex align-items-center gap-1">
                        <label for="newPicklistNum" class="form-label col">Picklist Number: </label>
                        <input type="text" class="form-control col-8" name="newPicklistNum" id="newPicklistNum" readonly required>
                    </div>
                    <button type="submit" class="btn btn-primary float-end mt-3">Generate</button>
                </form>
            </div>
        </div>
    </div>
</div>