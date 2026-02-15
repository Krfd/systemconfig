<form id="frm-add-order" method="POST">
    <div class="modal fade" tabindex="-1" id="addRequestUnit">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-secondary">New Item</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-input mb-2">
                        <label for="newBrand" class="form-label text-dark-emphasis"><small>Brand:</small></label>
                        <select class="form-select" id="newBrand" style="background: #FFFBDF" required>
                            <option selected value="">--Choose Brand--</option>
                        </select>
                    </div>
                    <div class="form-input mb-2">
                        <label for="newModel" class="form-label text-dark-emphasis"><small>Model:</small></label>
                        <select class="form-select" id="newModel" style="background: #FFFBDF" required>
                            <option selected value="">--Choose Model--</option>
                        </select>
                    </div>
                    <div class="form-input mb-2">
                        <label for="newCategory" class="form-label text-dark-emphasis"><small>Category:</small></label>
                        <input type="text" name="newCategory" id="newCategory" class="form-control" style="background: #FFFBDF" readonly>
                    </div>
                    <div class="form-input">
                        <label for="newQuantity" class="form-label text-dark-emphasis"><small>Quantity:</small></label>
                        <input type="number" name="newQuantity" id="newQuantity" class="form-control" style="background: #FFFBDF" min="1" inputmode="numeric"
                            pattern="[1-9][0-9]*"
                            required>
                    </div>
                    <input type="hidden" name="itemcode" id="itemcode"><!-- Selected Item code -->
                    <div class="modal-footer">
                        <button class="btn btn-success" type="submit">Add</button>
                        <button class="btn btn-danger" type="reset">Clear</button>
                    </div>
                </div>
            </div>
        </div>
</form>

<script>
    /*Function submit item prepared request*/
    $("#frm-add-order").submit(function(event) {
        event.preventDefault();
        var Brand = $("#newBrand").val();
        var Model = $("#newModel").val();
        var ItemNumber = $("#itemcode").val();
        var Category = $("#newCategory").val();
        var SRN = $("#srnForm").val();
        var Quantity = $("#newQuantity").val();
        $.post("dirs/outgoing/form/actions/save_orderitm.php", {
            Brand: Brand,
            Model: Model,
            ItemNumber: ItemNumber,
            Category: Category,
            SRN: SRN,
            Quantity: Quantity,

        }, function(data) {
            if ($.trim(data) == "OK") {
                $("#frm-add-order")[0].reset();
                $("#addRequestUnit").modal('hide');
                loadItems();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data,
                    timer: 2000
                });
            }
        });
    });
</script>