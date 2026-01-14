<form id="frm-add-menu">
  <div class="modal fade" id="mdl-create-menu" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h5 class="modal-title" id="mdl-title">Create New Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-2">
            <div class="col-md-6">
              <!-- Image Preview -->
              <div class="image-preview-wrapper mb-3" 
                   style="max-width: 100%; max-height: 100%; border: 2px dashed #28a745; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px;">
                  <img src="../assets/image/icon/favicon.png" id="img-preview" class="img-preview" alt="Image Preview" style="max-width: 100%; max-height: 100%;" onclick="uploadImage()">
              </div>
              <div class="text-center">
                <small>Click to upload image</small>
              </div>
              <!-- Hidden file input -->
              <input type="file" name="menu-img" id="menu-img" class="d-none" accept="image/*">

           

            </div>


            <!-- Fill up Form -->
            <div class="col-md-6">
              <div class="card shadow-sm">
                <div class="card-header">
                  <h6 class="fw-semibold mb-0">Menu Information</h6>
                </div>
                <div class="card-body">

                  <!-- ================= MENU INFORMATION ================= -->
                  <div class="row g-3 mb-4">
                    <div class="col-md-6">
                      <label class="form-label">Category</label>
                      <select name="category" id="category" class="form-select border-success" required>
                        <option disabled selected>Select category</option>
                        <option value="Coffee">Coffee</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Snack">Snack</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Combo Meal">Combo Meal</option>
                      </select>
                    </div>


                    <div class="col-md-6">
                      <label class="form-label">Menu name</label>
                      <input type="text" name="menu_name" class="form-control border-success" required>
                    </div>
                  </div>
                    <div class="mb-3">
                      <label class="form-label">Menu code</label>
                      <input type="text" name="menu_code" id="menu_code" class="form-control" readonly>
                    </div>

                  <!-- ================= PRICING ================= -->
                  <h6 class="fw-semibold mb-2">Pricing</h6>
                  <div class="row g-3 mb-4">
                    <div class="col-md-6">
                      <label class="form-label">Price</label>
                      <input type="text" step="0.01" name="price" class="form-control border-success" pattern="^\d+(\.\d{1,2})?$"  required>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Status</label>
                      <select name="status" class="form-select border-success" id="status">
                        <option value="Active">Available</option>
                        <option value="Inactive">Unavailable</option>
                      </select>
                    </div>
                  </div>

                  <!-- ================= AVAILABILITY ================= -->
                  <h6 class="fw-semibold mb-2">Availability</h6>
                  <div class="row g-3 mb-4">
                    <div class="col-lg-3 form-check mt-4">
                      <input class="form-check-input" type="checkbox" name="dine_in" id="dine_in" checked value="1">
                      <label class="form-check-label" for="dine_in">Dine-In</label>
                    </div>

                    <div class="col-lg-3 form-check mt-4">
                      <input class="form-check-input" type="checkbox" name="take_out" id="take_out" checked value="1">
                      <label class="form-check-label" for="take_out">Take-Out</label>
                    </div>

                    <div class="col-lg-3 form-check mt-4">
                      <input class="form-check-input" type="checkbox" name="delivery" id="delivery" value="1">
                      <label class="form-check-label" for="delivery">Delivery</label>
                    </div>
                  </div>

                  <!-- ================= DESCRIPTION ================= -->
                  <h6 class="fw-semibold mb-2">Description</h6>
                  <div class="row g-3 mb-0">
                    <div class="col-lg-12">
                      <textarea name="description" id="description" class="form-control border-success" rows="3" placeholder="Optional menu description" maxlength="50"></textarea>
                    </div>
                  </div>

                </div>
              </div>
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


<!-- Modal for Bundle Items -->

  <div class="modal fade" id="mdl-add-bundle" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h5 class="modal-title" id="mdl-title">Create New Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          
        </div>

      </div>
    </div>
  </div>

</form>




 <script>
  $(document).ready(function() {
      $("#category").change(function() {
          var Category = $(this).val();

          if (Category === 'Combo Meal') {
              $("#modal-create-menu").modal('hide');
              $("#mdl-add-bundle").modal('show');
          } else {
              $("#mdl-add-bundle").modal('hide');
              $("#modal-create-menu").modal('show');
          }
      });
  });

 function uploadImage() {
     $('#menu-img').click();
 }

 $('#menu-img').on('change', function () {

     var file = this.files[0];
     if (!file) return;

     // Validate image
     if (!file.type.match('image.*')) {
          Swal.fire({
                icon: "error",
                title: "Invalid",
                text: "Please select image file.",
                timer: 2000,
                showConfirmButton: false
            });
         $(this).val('');
         return;
     }
     var reader = new FileReader();
     reader.onload = function (e) {
         $('#img-preview').attr('src', e.target.result);
     };
     reader.readAsDataURL(file);
 });
 </script>
