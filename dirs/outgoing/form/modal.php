<div class="modal fade" tabindex="-1" id="addRequestUnit">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fw-bold text-secondary">New Item</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="newUnit" method="POST">
                    <div class="d-flex flex-column gap-3">
                        <div>
                            <label for="newBrand" class="form-label text-dark-emphasis"><small>Brand:</small></label>
                            <input type="text" name="newBrand" id="newBrand" class="form-control form-control-sm" style="background: #FFFBDF" required>
                        </div>
                        <div>
                            <label for="newModel" class="form-label text-dark-emphasis"><small>Model:</small></label>
                            <input type="text" name="newModel" id="newModel" class="form-control form-control-sm" style="background: #FFFBDF" required>
                        </div>
                        <div>
                            <label for="newCategory" class="form-label text-dark-emphasis"><small>Category:</small></label>
                            <input type="text" name="newCategory" id="newCategory" class="form-control form-control-sm" style="background: #FFFBDF" required>
                        </div>
                        <div>
                            <label for="newQuantity" class="form-label text-dark-emphasis"><small>Quantity:</small></label>
                            <input type="text" name="newQuantity" id="newQuantity" class="form-control form-control-sm" style="background: #FFFBDF" required>
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