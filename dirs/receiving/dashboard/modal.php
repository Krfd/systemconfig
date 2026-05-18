  <!-- NON SERIALIZE -->
  <form id="frm-add-delivery" method="POST">
      <div class="modal fade" tabindex="-1" id="addDeliveryModal" data-bs-backdrop="static" data-bs-keyboard="false">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h4 class="modal-title text-secondary">New Item</h4>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div class="form-input mb-2">
                          <label for="newBrand" id="newBrandLabel" class="form-label text-dark-emphasis"><small>Brand:</small></label>
                          <select name="newBrand" id="newBrand" class="form-select form-select-sm" style="background: #FFFBDF" required>
                              <option selected value="">--Choose Brand--</option>
                          </select>
                      </div>
                      <div class="form-input mb-2">
                          <label for="newModel" class="form-label text-dark-emphasis"><small>Model:</small></label>
                          <select name="newModel" id="newModel" class="form-select form-select-sm" style="background: #FFFBDF" required>
                              <option selected value="">--Choose Model--</option>
                          </select>
                      </div>
                      <div class="form-input mb-2">
                          <label for="newCategory" class="form-label text-dark-emphasis"><small>Category:</small></label>
                          <input type="text" name="newCategory" id="newCategory" class="form-control" readonly>
                      </div>
                      <div class="form-input">
                          <label for="newQuantity" class="form-label text-dark-emphasis"><small>Quantity:</small></label>
                          <input type="number" name="newQuantity" id="newQuantity" class="form-control" style="background: #FFFBDF" min="1" inputmode="numeric"
                              pattern="[1-9][0-9]*"
                              required>
                      </div>
                      <div class="modal-footer">
                          <button class="btn btn-success" type="submit" id="nonSerializeBtn">Add</button>
                          <button class="btn btn-danger" type="reset">Clear</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </form>

  <!-- SERIALIZE -->
  <div class="modal fade" tabindex="-1" id="addSerialModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
              <form id="serial-delivery" method="POST">
                  <div class="modal-header">
                      <h4 class="modal-title text-secondary">Enter Serial</h4>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div class="form-input">
                          <label for="newSerial" class="form-label text-dark-emphasis"><small>Serial:</small></label>
                          <input type="text" name="newSerial" id="newSerial" class="form-control" style="background: #FFFBDF" inputmode="numeric"
                              required>
                      </div>
                      <div class="modal-footer">
                          <button class="btn btn-success" type="submit" id="nonSerializeBtn">Add</button>
                          <button class="btn btn-danger" type="reset">Clear</button>
                      </div>
                  </div>
              </form>
          </div>
      </div>
  </div>