<div class="modal fade" tabindex="-1" id="addStockTransferUnit">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fw-bold text-secondary">New Item</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="newStockTransferUnit" method="POST">
                    <div class="d-flex flex-column gap-3">
                        <div class="form-floating">
                            <input type="text" name="newSerial" id="newSerial" class="form-control" style="background: #FFFBDF" placeholder="Serial No." required>
                            <label for="newSerial" class="form-label">Serial No.</label>
                        </div>
                        <div class="form-floating">
                            <input type="text" name="newModel" id="newModel" class="form-control" style="background: #FFFBDF" placeholder="Model" required>
                            <label for="newModel" class="form-label">Model</label>
                        </div>
                        <div class="form-floating">
                            <input type="text" name="newQuantity" id="newQuantity" class="form-control" style="background: #FFFBDF" placeholder="Quantity" required>
                            <label for="newQuantity" class="form-label">Quantity</label>
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