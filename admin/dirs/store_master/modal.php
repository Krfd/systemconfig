<form id="frm-add-branch">
  <div class="modal fade" id="mdl-add-branch" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header bg-secondary-subtle">
          <h5 class="modal-title" id="mdl-title">Create New Branch</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <!-- ================= BASIC INFORMATION ================= -->
          <h6 class="fw-semibold mb-2">Basic Information</h6>
          <div class="row g-3 mb-4">

            <div class="col-lg-3">
              <label class="form-label">Branch Code</label>
              <input type="text" name="branchcode" id="branchcode" class="form-control" readonly>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Branch Acronym</label>
              <input type="text" name="branchacronym" id="branchacronym" class="form-control text-uppercase border-success" list="branchAcronymList" required>
              <datalist id="branchAcronymList"></datalist>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Branch Size</label>
              <select class="form-select border-success" name="branchtype" id="branchtype" required>
                <option disabled selected>Select size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Outlet Type</label>
              <select class="form-select border-success" name="outlettype" id="outlettype" required>
                <option disabled selected>Select outlet</option>
                <option value="OWNED">Owned Store</option>
                <option value="LEASED">Leased Store</option>
                <option value="MALL_KIOSK">Mall Kiosk</option>
                <option value="CART">Cart</option>
                <option value="POPUP">Pop-up Store</option>
                <option value="WAREHOUSE">Warehouse</option>
              </select>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Ownership Type</label>
              <select class="form-select border-success" name="ownership_type" id="ownership_type" required>
                <option disabled selected>Select ownership</option>
                <option value="COMPANY">Company-Owned</option>
                <option value="FRANCHISE">Franchise-Owned</option>
              </select>
            </div>

          </div>

          <!-- ================= FRANCHISE DETAILS ================= -->
          <div id="franchise-section" class="border rounded p-3 mb-4 d-none">
            <h6 class="fw-semibold mb-3">Franchise Details</h6>

            <div class="row g-3">
              <div class="col-lg-4">
                <label class="form-label">Franchisee Name</label>
                <input type="text" name="franchisee_name" id="franchisee_name" class="form-control border-success">
              </div>

              <div class="col-lg-4">
                <label class="form-label">Agreement No.</label>
                <input type="text" name="franchise_agreement_no" id="franchise_agreement_no" class="form-control border-success">
              </div>

              <div class="col-lg-4">
                <label class="form-label">Franchise Start Date</label>
                <input type="date" name="franchise_start_date" id="franchise_start_date" class="form-control border-success">
              </div>

              <div class="col-lg-3">
                <label class="form-label">Royalty Rate (%)</label>
                <input type="number" step="0.01" name="royalty_rate" id="royalty_rate" class="form-control border-success">
              </div>

              <div class="col-lg-3">
                <label class="form-label">Marketing Fee (%)</label>
                <input type="number" step="0.01" name="marketing_fee" id="marketing_fee" class="form-control border-success">
              </div>
            </div>
          </div>

          <!-- ================= LOCATION ================= -->
          <h6 class="fw-semibold mb-2">Location Details</h6>
          <div class="row g-3 mb-4">

            <div class="col-lg-12">
              <label class="form-label">Complete Address</label>
              <input type="text" name="address" id="address" class="form-control border-success" required>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Region</label>
              <input type="text" name="region" id="region" class="form-control border-success" required>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Province</label>
              <input type="text" name="province" id="province" class="form-control border-success" required>
            </div>

            <div class="col-lg-3">
              <label class="form-label">City</label>
              <input type="text" name="city" id="city" class="form-control border-success" required>
            </div>

            <div class="col-lg-3">
              <label class="form-label">Zip Code</label>
              <input type="text" name="zipcode" id="zipcode"
                     maxlength="4" pattern="[0-9]{4}" class="form-control border-success" required>
            </div>

          </div>

          <!-- ================= CONTACT ================= -->
          <h6 class="fw-semibold mb-2">Contact Information</h6>
          <div class="row g-3 mb-4">

            <div class="col-lg-6">
              <label class="form-label">Email</label>
              <input type="email" name="email" id="email" class="form-control border-success" required>
            </div>

            <div class="col-lg-6">
              <label class="form-label">Phone Number</label>
              <input type="text" name="phonenumber" id="phonenumber" maxlength="11" pattern="[0-9]{11}" class="form-control border-success" required>
            </div>

          </div>

          <!-- ================= OPERATIONS ================= -->
          <h6 class="fw-semibold mb-2">Operations</h6>
          <div class="row g-3">

            <div class="col-lg-4">
              <label class="form-label">Opening Date</label>
              <input type="date" name="openingdate" id="openingdate" class="form-control border-success" required>
            </div>

            <div class="col-lg-4">
              <label class="form-label">POS Enabled</label>
              <select class="form-select border-success" name="pos_enabled" id="pos_enabled">
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div class="col-lg-4">
              <label class="form-label">Branch Status</label>
              <select class="form-select border-success" name="status" id="status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

        </div>

        <!-- FOOTER ACTION BUTTONS-->
        <div class="modal-footer">
          <button type="submit" class="btn btn-success px-4">Save</button>
          <button type="reset" class="btn btn-danger px-4" id="btn-clear">Clear</button>
          <button type="button" class="btn btn-primary px-4" id="btn-draft" onclick="saveDraft()">Save Draft</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="loadCancel()">Cancel</button>
        </div>

      </div>
    </div>
  </div>
</form>



<script>
$(document).ready(function () {
  $('#ownership_type').on('change', function () {
    loadFranchise();
  });

  function loadFranchise() {
    const ownershipType = $('#ownership_type').val();
    const $franchiseSection = $('#franchise-section');

    if (ownershipType === 'FRANCHISE') {
      // Show section
      $franchiseSection.removeClass('d-none');

      // Make fields required
      $franchiseSection.find('input').prop('required', true);

    } else {
      // Hide section
      $franchiseSection.addClass('d-none');

      // Remove required + clear values
      $franchiseSection.find('input')
        .prop('required', false)
        .val('');
    }
  }

});
</script>






<!-- Offcanvas drafts -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="mdl-drafts" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header bg-secondary-subtle">
    <h5 class="offcanvas-title" id="offcanvasRightLabel">Drafts</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <ul class="list-group" id="draft-list"></ul>
  </div>
</div>


<!-- Modal show Branch Profile -->
<div class="modal fade" id="mdl-branch-profile" data-bs-backdrop="static" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">

        <div class="card shadow-sm">
          <div class="card-body">
            <div id="map" style="height: 80vh; width: 100%;"></div>
          </div>
        </div>

        <div class="card shadow-sm mt-2">
          <div class="card-body">
            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Branch Code:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-code" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Branch Size:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-type" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Status:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-status" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Address:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-address" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Province:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-province" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Email:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-email" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Contact:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-phnumber" readonly>
                </div>
            </div>

            <div class="row mb-0">
                <label class="col-sm-2 col-form-label">Opening Date:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control-plaintext" id="branch-opening" readonly>
                </div>
            </div>

            <div class="row mb-2">
                <label class="col-sm-2 col-form-label">Franchisee/ Owner:</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control-plaintext" id="branch-franchise" readonly>
                </div>
            </div>

            <div class="row mb-0">
                <label class="col-sm-2 col-form-label">Franchise Date:</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control-plaintext" id="branch-fdate" readonly>
                </div>
            </div>

          </div>
        </div>



      </div>
      <div class="modal-footer">
          <!-- Action button testing for edit branch details -->
          <button class="btn btn-primary" type="button" onclick="loadEdit()">Edit</button>
          <button class="btn btn-primary" type="button">Edit Franchisee</button>        
        
      </div>
    </div>
  </div>
</div>

