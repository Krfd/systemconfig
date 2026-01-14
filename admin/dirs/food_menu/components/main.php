<form id="frm-add-menu">
	<div class="card shadow-sm bg-secondary-subtle" style="min-height: 80vh;">
		<div class="card-body">
			<div class="row g-2">

				<!-- Image of Menu -->
				<div class="col-md-4">
					<div class="image-preview-wrapper mb-3" 
					     style="max-width: 100%; max-height: 100%; border: 2px dashed #28a745; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px;">
					    <img src="../assets/image/icon/favicon.png" id="img-preview" class="img-preview" alt="Image Preview" style="max-width: 100%; max-height: 100%;" onclick="uploadImage()">
					</div>
					<div class="text-center">
					  <small>Click to upload image</small>
					</div>
					<input type="file" name="menu-img" id="menu-img" class="d-none" accept="image/*">
				</div>



				<!-- Menu Details Information -->
				<!-- Menu Details Information -->
				<div class="col-md-4">
				    <div class="mb-4">
				        <h6 class="fw-semibold mb-0">Menu Information</h6>
				    </div>

				    <!-- ================= MENU INFORMATION ================= -->
				    <div class="row g-3 mb-4">
				    	<div class="col-md-6">
				    	    <label class="form-label">Serving Type</label>
				    	    <select name="serving_type" id="serving_type" class="form-select border-success" required>
				    	        <option disabled selected>Select Serving</option>
				    	        <option value="Solo Meal">Solo</option>
				    	        <option value="Combo Meal">Combo</option>
				    	    </select>
				    	</div>
				        <div class="col-md-6">
				            <label class="form-label">Category</label>
				            <select name="category" id="category" class="form-select border-success" required>
				                <option disabled selected>Select category</option>
				                <option value="Coffee">Coffee</option>
				                <option value="Dessert">Dessert</option>
				                <option value="Snack">Snack</option>
				                <option value="Beverage">Beverage</option>
				            </select>
				        </div>

				    </div>

				    <div class="mb-3">
				        <label class="form-label">Menu Name</label>
				        <input type="text" name="menu_name" id="menu_name" class="form-control border-success" required>
				    </div>
				    <div class="mb-3">
				        <label class="form-label">Menu Code</label>
				        <input type="text" name="menu_code" id="menu_code" class="form-control" readonly>
				    </div>

				    <div class="row g-3 mb-4">
				        <div class="col-md-6">
				            <label class="form-label">Preparation Time (mins)</label>
				            <input type="number" id="prep_time" name="prep_time" class="form-control border-success" min="1" step="1" placeholder="e.g., 10">
				        </div>

				        <div class="col-md-6">
				            <label class="form-label">Serving Size</label>
				            <input type="text" id="serving_size" name="serving_size" class="form-control border-success" placeholder="e.g., 1 cup, 200g">
				        </div>
				    </div>

				    <div class="row g-3 mb-4">
				        <div class="col-md-6">
				            <label class="form-label">Calories (kcal)</label>
				            <input type="number" name="calories" id="calories" class="form-control border-success" min="0" step="1" placeholder="Optional">
				        </div>

				        <div class="col-md-6">
				            <label class="form-label">Tags / Notes</label>
				            <input type="text" name="tags" id="tags" class="form-control border-success" placeholder="e.g., Vegan, Spicy">
				        </div>
				    </div>

				    <!-- ================= PRICING ================= -->
				    <h6 class="fw-semibold mb-2">Pricing</h6>
				    <div class="row g-3 mb-4">
				        <div class="col-md-6">
				            <label class="form-label">Price</label>
				            <input type="text" step="0.01" name="price" class="form-control border-success" pattern="^\d+(\.\d{1,2})?$" required>
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
				            <textarea name="description" id="description" class="form-control border-success" rows="3" placeholder="Optional menu description" maxlength="200"></textarea>
				            <small>100 max characters.</small>
				        </div>
				    </div>
				</div>






				<!-- Combo Meals Details Information -->
				<div class="col-md-4">
					<div class="mb-4">
					    <h6 class="fw-semibold mb-0">Combo Additional</h6>
					</div>
					<div class="justify-content-end d-flex mb-2">
						<button class="btn btn-success" type="button" disabled id="btn-addcombo" onclick="addCombo()">Add Combo</button>
					</div>
					<div class="text-center" id="empty-message">
						<h4 class="text-muted">Not Available</h4>
					</div>

					<div class="card shadow-sm d-none" id="combo-meal-display">
						<div class="card-body  overflow-auto" style="max-height: 70vh;">
							
							<div id="combo-meal-container"></div>
						</div>

					</div>


				</div>

			</div>


		</div>
		<div class="card-footer">
			<button type="submit" class="btn btn-success px-4">Save</button>
			<button type="button" class="btn btn-primary px-4" id="btn-draft" onclick="saveDraft()">Save Draft</button>
			<button type="reset" class="btn btn-danger px-4" id="btn-clear" onclick="loadFoodMenus()">Clear</button>
		</div>
	</div>
</form>

















<script>
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

/*Script for submit*/
$("#frm-add-menu").submit(function(event){
    event.preventDefault();

    var formData = new FormData();

    // Get text / select fields manually
    var MenuType   = $("#serving_type").val();
    var Category   = $("#category").val();
    var Menu       = $("#menu_name").val();
    var MenuCode   = $("#menu_code").val();
    var PrepTime   = $("#prep_time").val();
    var Serving    = $("#serving_size").val();
    var Calories   = $("#calories").val();
    var Notes      = $("#tags").val();
    var Price      = $("#price").val();
    var Status     = $("#status").val();
    var Dinein     = $("#dine_in").is(":checked") ? 1 : 0;
    var Takeout    = $("#take_out").is(":checked") ? 1 : 0;
    var Delivery   = $("#delivery").is(":checked") ? 1 : 0;
    var Description = $("#description").val();

    // Append all text/select values
    formData.append('MenuType', MenuType);
    formData.append('Category', Category);
    formData.append('Menu', Menu);
    formData.append('MenuCode', MenuCode);
    formData.append('PrepTime', PrepTime);
    formData.append('Serving', Serving);
    formData.append('Calories', Calories);
    formData.append('Notes', Notes);
    formData.append('Price', Price);
    formData.append('Status', Status);
    formData.append('Dinein', Dinein);
    formData.append('Takeout', Takeout);
    formData.append('Delivery', Delivery);
    formData.append('Description', Description);

    // Append file
    var fileInput = $("#menu-img")[0];
    if(fileInput.files.length > 0){
        formData.append('menu-img', fileInput.files[0]);
    }

    // ✅ Collect combo items dynamically
    $("select[name='combo_items[]']").each(function(index){
        var mealId = $(this).val();
        var qty = $("input[name='combo_quantity[]']").eq(index).val() || 1;
        formData.append('combo_items[]', mealId);
        formData.append('combo_quantity[]', qty);
    });

    // Send AJAX
    $.ajax({
        url: "dirs/food_menu/actions/save_menu.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            if($.trim(data) == "OK"){
            	loadFoodMenus();
                $("#frm-add-menu")[0].reset();
                $("#img-preview").attr("src", "../assets/image/icon/favicon.png");

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Successfully created.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        },
        error: function(err){
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An unexpected error occurred",
                showConfirmButton: true
            });
        }
    });
});



/*Function show button add combo meal if serving type is Solo*/
function loadCombo() {
    $('#serving_type').trigger('change');
}

$('#serving_type').on('change', function () {
    var selected = $(this).val();
    if (selected === "Combo Meal") {
        $("#btn-addcombo").prop('disabled', false);
        $("#empty-message").addClass('d-none');
        $("#combo-meal-display").removeClass('d-none');
    } else {
        $("#btn-addcombo").prop('disabled', true);
        $("#empty-message").removeClass('d-none');
        $("#combo-meal-display").addClass('d-none');
    }
});


/*Function add combo meal*/
function addCombo() {
    var comboHTML = `
    <div class="combo-item row g-3 mb-2 align-items-end">
        <div class="col-md-3">
            <button type="button" class="btn btn-outline-danger btn-remove-combo"><i class="bi bi-trash"></i> Remove</button>
        </div>
        <div class="col-md-6">
            <label class="form-label">Meal</label>
            <select name="combo_items[]" class="form-select border-success" required>
                <option disabled selected>Select Meal</option>
                <option value="Espresso">Espresso</option>
                <option value="Croissant">Croissant</option>
                <option value="Latte">Latte</option>
            </select>
        </div>
        <div class="col-md-3">
            <label class="form-label">Quantity</label>
            <input type="number" name="combo_quantity[]" class="form-control border-success" min="1" value="1" required>
        </div>
    </div>
    `;

    // Prepend the new combo row to the container
    $("#combo-meal-container").prepend(comboHTML);
}

// Remove combo item when clicking the remove button
$(document).on('click', '.btn-remove-combo', function() {
    $(this).closest('.combo-item').remove();
});



</script>
