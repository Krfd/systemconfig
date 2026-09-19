<div class="modal fade" id="newServerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Add Server</h5>
                <button class="btn btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form method="post" id="add-unit-server">
                    <div class="mt-3">
                        <label for="unitName">Unit Name:</label>
                        <input type="text" name="unitName" id="unitName" class="form-control" required>
                    </div>
                    <div class="mt-3">
                        <label for="unitAddress">Unit Address:</label>
                        <input type="text" name="unitAddress" id="unitAddress" class="form-control" required>
                    </div>
                    <div class="mt-3">
                        <label for="branch">Branch:</label>
                        <input type="text" name="branch" id="branch" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary d-block mx-auto mt-3">Save</button>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="updateServerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold">Update Server</h5>
                <button class="btn btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form method="post" id="update-unit-server">
                    <input type="hidden" name="unitServerId" id="unitServerId">
                    <div class="mt-3">
                        <label for="updateUnitName">Unit Name:</label>
                        <input type="text" name="updateUnitName" id="updateUnitName" class="form-control" required>
                    </div>
                    <div class="mt-3">
                        <label for="updateUnitAddress">Unit Address:</label>
                        <input type="text" name="updateUnitAddress" id="updateUnitAddress" class="form-control" required>
                    </div>
                    <div class="mt-3">
                        <label for="updateBranch">Branch:</label>
                        <input type="text" name="updateBranch" id="updateBranch" class="form-control" readonly required>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary d-block mx-auto mt-3" id="updateServerBtn" disabled>Save</button>
                </form>
            </div>
        </div>
    </div>
</div>