<div class="modal fade" tabindex="-1" id="user-form" data-bs-backdrop="static" data-bs-keyboard="false">
    <form id="add-user-form" method="POST">    
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title text-secondary">New User</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-input mb-2">
                    <label for="newUsername" id="newUsernameLabel" class="form-label text-dark-emphasis"><small>Username:</small></label>
                    <input type="text" id="newUsername" class="form-control form-control-sm" style="background: #FFFBDF;" required>
                </div>
                <div class="form-input mb-2">
                    <label for="newFullname" class="form-label text-dark-emphasis"><small>Fullname:</small></label>
                    <input type="text" id="newFullname" class="form-control form-control-sm" style="background: #FFFBDF;" required>
                </div>
                <div class="form-input mb-2">
                    <label for="newRole" class="form-label text-dark-emphasis"><small>Role:</small></label>
                    <input type="text" name="newRole" id="newRole" class="form-control" style="background: #FFFBDF;" required>
                </div>
                <div class="form-input mb-2">
                    <label for="newPosition" class="form-label text-dark-emphasis"><small>Position:</small></label>
                    <input type="text" name="newPosition" id="newPosition" class="form-control" readonly required>
                </div>
                <div class="form-input mb-2">
                    <label for="newBranch" class="form-label text-dark-emphasis"><small>Branch:</small></label>
                    <select name="newBranch" id="newBranch" class="form-select form-select-sm" style="background: #FFFBDF; appearance: auto" required>
                        <option value="" selected>-- Choose Branch --</option>                    
                    </select>
                </div>
                <div class="form-input mb-2">
                    <label for="newBranchCode" class="form-label text-dark-emphasis"><small>Branch Code:</small></label>
                    <input type="text" name="newBranchCode" id="newBranchCode" class="form-control" readonly>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" type="submit" id="addUserBtn">Add</button>
                    <button class="btn btn-danger" type="reset">Clear</button>
                </div>
            </div>
        </div>
    </form>
</div>
