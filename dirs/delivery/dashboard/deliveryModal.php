 <form id="frm-add-delivery" method="POST">
     <div class="modal fade" tabindex="-1" id="addDeliveryModal">
         <div class="modal-dialog modal-dialog-centered">
             <div class="modal-content">
                 <div class="modal-header">
                     <h4 class="modal-title text-secondary">New Item</h4>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                     <div class="form-input mb-2">
                         <label for="newSerial" id="newSerialLabel" class="form-label text-dark-emphasis"><small>Serial:</small></label>
                         <input type="text" class="form-select form-select-sm" id="newSerial" style="background: #FFFBDF" required>
                     </div>
                     <div class="form-input mb-2">
                         <label for="newBrand" id="newBrandLabel" class="form-label text-dark-emphasis"><small>Brand:</small></label>
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
                     <input type="hidden" name="itemcode" id="itemcode">
                     <div class="modal-footer">
                         <button class="btn btn-success" type="submit">Add</button>
                         <button class="btn btn-danger" type="reset">Clear</button>
                     </div>
                 </div>
             </div>
         </div>
     </div>
 </form>

 <div class="modal fade" tabindex="-1" id="deliverySummary">
     <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content">
             <div class="modal-header">
                 <h4 class="modal-title text-secondary">Delivery Summary</h4>
                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
                 <div class="table-responsive-md">
                     <table class="table" id="summaryDeliveryTable">
                         <thead class="sticky-top">
                             <tr>
                                 <th class="text-secondary">#</th>
                                 <th class="text-secondary">Serial</th>
                                 <th class="text-secondary">Branch</th>
                                 <th class="text-secondary">Brand</th>
                                 <th class="text-secondary">Model</th>
                                 <th class="text-secondary">Quantity</th>
                             </tr>
                         </thead>
                         <tbody>
                             <tr>
                                 <td class="" style="background: #FFFBDF; height: 40px; max-height: 40px"></td>
                                 <td class="" style="background: #FFFBDF; height: 40px; max-height: 40px"></td>
                                 <td class="" style="background: #FFFBDF; height: 40px; max-height: 40px"></td>
                                 <td class="" style="background: #FFFBDF; height: 40px; max-height: 40px"></td>
                                 <td class="" style="background: #FFFBDF; height: 40px; max-height: 40px"></td>
                                 <td class="" style="background: #FFFBDF; height: 40px; max-height: 40px"></td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
             </div>
         </div>
     </div>
 </div>


 <script>
     /*Function submit item prepared request*/
     $("#frm-add-delivery").submit(function(event) {
         event.preventDefault();

         var Serial = $("#newSerial").val().trim();
         var Brand = $("#newBrand option:selected").text();
         var Model = $("#newModel option:selected").text();
         var Category = $("#newCategory").val();
         var Quantity = $("#newQuantity").val();

         /* SERIAL COLUMN */
         let serialCell = $("#delivery-serial-table tbody td[contenteditable='true']");

         let currentSerials = serialCell.html().trim();

         currentSerials = currentSerials.replace(/(<br>\s*)+$/, "");
         if (!currentSerials) {
             serialCell.html(Serial + ",<br>");
         } else {
             // Ensure last line ends with comma
             if (!currentSerials.endsWith(",")) {
                 currentSerials += ",";
             }

             // Append properly
             serialCell.html(currentSerials + "<br>" + Serial + ",<br>");
         }

         /* DELIVERY TABLE */
         let emptyRow = $("#deliveryTable tbody tr").filter(function() {
             return $(this).find("td:first").text().trim() === "";
         }).first();

         let summaryEmptyRow = $("#summaryTable tbody tr").filter(function() {
             return $(this).find("td:first").text().trim() === "";
         }).first();

         if (emptyRow.length) {

             // $(this).attr("data-branch", selectedBranch)

             emptyRow.find("td:eq(0)").text(Brand);
             emptyRow.find("td:eq(1)").text(Model);
             emptyRow.find("td:eq(2)").text(Category);

             summaryEmptyRow.find("td:eq(0)").text(Brand);
             summaryEmptyRow.find("td:eq(1)").text(Model);
             //  summaryEmptyRow.find("td:eq(2)").text(Category);
             summaryEmptyRow.find("td:eq(2)").text(Quantity);
         }

         /* reset modal */
         $("#frm-add-delivery")[0].reset();
         $("#addDeliveryModal").modal("hide");
     });
 </script>