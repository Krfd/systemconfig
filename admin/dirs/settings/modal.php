<form id="frm-update-profile">
  <div class="modal fade" id="modal-update-profile" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">About Me</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-input mb-2">
            <label for="fullname">Fullname :</label>
            <input type="text" name="fullname" id="fullname" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="position">Position :</label>
            <input type="text" name="position" id="position" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="address">Address :</label>
            <input type="text" name="address" id="address" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="contactnumber">Contact number :</label>
            <input type="text" name="contactnumber" placeholder="09*********" id="contactnumber" class="form-control" pattern="09\d{9}" title="Contact number must start with 09 and be 11 digits" maxlength="11" required>
          </div>
          <div class="form-input mb-2">
            <label for="email">Email :</label>
            <input type="email" name="email" id="email" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="fbpage">Facebook Page :</label>
            <input type="text" name="fbpage" id="fbpage" class="form-control">
          </div>
          <div class="form-input mb-2">
            <label for="website">Website :</label>
            <input type="text" name="website" id="website" placeholder="www." class="form-control" pattern="www\..*" title="Website must start with www." required>
          </div>
          <div class="form-input mb-2">
            <label for="viber">Viber :</label>
            <input type="text" name="viber" id="viber" class="form-control">
          </div>
          <div class="form-input mb-2">
            <label for="birthday">Birthday :</label>
            <input type="date" name="birthday" id="birthday" class="form-control" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Save</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</form>




<!-- MODAL CHANGE USER PASSWORD -->
<form id="frm-update-password">
  <div class="modal fade" id="mdl-upd-password" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="mdl-upd-passwordLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h5 class="modal-title" id="mdl-upd-passwordLabel">Security Update</h5>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-2">
            <input type="password" name="newpassword" id="newpassword" class="form-control rounded-3" placeholder="Password" required autocomplete="off">
            <label for="newpassword">New Password</label>
          </div>
          <div class="form-floating mb-4">
            <input type="password" name="confirmpassword" id="confirmpassword" class="form-control rounded-3" placeholder="Password" required autocomplete="off">
            <label for="confirmpassword">Confirm Password</label>
            <small id="error-msg" class="text-danger d-none">Password doesn't match.</small>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3 ml-4">
            <label class="form-check-label" for="toggle-show-password">Show Password</label>
            <input class="form-check-input" type="checkbox" id="toggle-show-password" onclick="togglePassword()">
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Save</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</form>


<!-- MODAL UPDATE BUSINESS -->
<form id="frm-update-business">
  <div class="modal fade" id="modal-update-business" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Business Information</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-input mb-2">
            <label for="bname">Business name :</label>
            <input type="text" name="bname" id="bname" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-type">Business type :</label>
            <input type="text" name="b-type" id="b-type" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-industry">Industry :</label>
            <input type="text" name="b-industry" id="b-industry" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-est">Established :</label>
            <input type="date" name="b-est" id="b-est" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-owner">Owner :</label>
            <input type="text" name="b-owner" id="b-owner" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-address">Business address :</label>
            <input type="text" name="b-address" id="b-address" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-tin">Business TIN :</label>
            <input type="text" name="b-tin" id="b-tin" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-permit">Business permit :</label>
            <input type="text" name="b-permit" id="b-permit" class="form-control" required>
          </div>
          <div class="form-input mb-2">
            <label for="b-services">Services :</label>
            <textarea class="form-control form-floating" name="b-services" id="b-services" maxlength="100"></textarea>
            <small>100 max characters.</small>
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Save</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</form>


<!-- MODAL CHANGE BUSINESS BACKGROUND -->
<form id="frm-upload-bg-business">
  <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-business-bg" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h4 class="modal-title">Change Background Photo</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <input type="file" accept="image/jpeg, image/jpg, image/png" name="upload_b_photo" id="upload_b_photo" class="d-none" onchange="handleFileUpload(this)">
          <img id="business-bg-preview" src="#" alt="Upload photo" class="img-fluid w-100" style="max-height: 100%; object-fit: contain; display: none;" />
          <div id="business-file-caption" class="mt-2 text-truncate"></div>
        </div>
        <div class="modal-footer d-flex justify-content-between w-100">
          <div>
            <button type="button" class="btn btn-secondary" onclick="uploadBusinessBG()">
              <i class="bi bi-paperclip"></i> Attach
            </button>
          </div>
          <div>
            <button type="submit" class="btn btn-success">Upload</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

<script>

  function uploadBusinessBG() {
    $('#upload_b_photo').click();
  }

  function handleFileUpload(input) {
    var img = $('#business-bg-preview');
    var caption = $('#business-file-caption'); 

    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        img.attr('src', e.target.result)
           .addClass('border border-secondary')
           .show();
        
        if (caption.length) {
          caption.text(input.files[0].name);
        }
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      img.attr('src', '#')
         .removeClass('border border-secondary')
         .hide();
      if (caption.length) {
        caption.text('');
      }
    }
  }
</script>



<!-- MODAL CHANGE BUSINESS LOGO -->
<form id="frm-upload-logo-business">
  <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-business-logo" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary-subtle">
          <h4 class="modal-title">Change Background Photo</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <input type="file" accept="image/jpeg, image/jpg, image/png" name="upload_logo_photo" id="upload_logo_photo" class="d-none" onchange="handleFileUploadlogo(this)">
          <img id="business-logo-preview" src="#" alt="Upload photo" class="img-fluid w-100" style="max-height: 100%; object-fit: contain; display: none;" />
          <div id="businesslogo-file-caption" class="mt-2 text-truncate"></div>
        </div>
        <div class="modal-footer d-flex justify-content-between w-100">
          <div>
            <button type="button" class="btn btn-secondary" onclick="uploadBusinesslogo()">
              <i class="bi bi-paperclip"></i> Attach
            </button>
          </div>
          <div>
            <button type="submit" class="btn btn-success">Upload</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

<script>

  function uploadBusinesslogo() {
    $('#upload_logo_photo').click();
  }

  function handleFileUploadlogo(input) {
    var img = $('#business-logo-preview');
    var caption = $('#businesslogo-file-caption'); 

    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        img.attr('src', e.target.result)
           .addClass('border border-secondary')
           .show();
        
        if (caption.length) {
          caption.text(input.files[0].name);
        }
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      img.attr('src', '#')
         .removeClass('border border-secondary')
         .hide();
      if (caption.length) {
        caption.text('');
      }
    }
  }
</script>


