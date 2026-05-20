 <!-- FOR NEW ITEM -->
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

 <!-- SUMMARY -->
 <!-- <div class="modal fade" tabindex="-1" id="deliverySummary">
     <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content">
             <div class="modal-header">
                 <h4 class="modal-title text-secondary">Delivery Summary</h4>
                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
                 <div class="table-responsive-md">
                     <table class="table datatables" id="summaryDeliveryTable">
                         <thead class="sticky-top">
                             <tr>
                                 <th class="text-secondary">#</th>
                                 <th class="text-secondary">Branch</th>
                                 <th class="text-secondary">Serial</th>
                                 <th class="text-secondary">Brand</th>
                                 <th class="text-secondary">Model</th>
                                 <th class="text-secondary">Category</th>
                                 <th class="text-secondary">Quantity</th>
                                 <th class="text-secondary d-none">Item Code</th>
                             </tr>
                         </thead>
                         <tbody>
                         </tbody>
                     </table>
                 </div>
             </div>
         </div>
     </div>
 </div> -->

 <!-- NON-SERTIALIZE TABLE -->
 <div class="modal fade" tabindex="-1" id="nonSerializeSummary">
     <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content">
             <div class="modal-header">
                 <h4 class="modal-title text-secondary">NonSerialize Summary</h4>
                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
                 <div class="table-responsive-md">
                     <table class="table datatables" id="summaryNonserializeTable">
                         <thead class="sticky-top">
                             <tr>
                                 <th class="text-secondary">#</th>
                                 <th class="text-secondary">Branch</th>
                                 <th class="text-secondary">Brand</th>
                                 <th class="text-secondary">Model</th>
                                 <th class="text-secondary">Category</th>
                                 <th class="text-secondary">Quantity</th>
                                 <th class="text-secondary d-none">Item Code</th>
                             </tr>
                         </thead>
                         <tbody>
                         </tbody>
                     </table>
                 </div>
             </div>
         </div>
     </div>
 </div>

 <!-- FOR NEW ITEM -->

 <div class="modal fade" tabindex="-1" id="addSerialModal" data-bs-backdrop="static" data-bs-keyboard="false">
     <div class="modal-dialog modal-lg modal-dialog-centered">
         <div class="modal-content">
             <div class="modal-header">
                 <h4 class="modal-title text-secondary">Enter Serial</h4>
                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
                 <form id="serial-delivery" method="POST">
                     <div class="d-flex align-items-baseline">
                         <div class="form-input col-8">
                             <label for="newSerial" class="form-label text-dark-emphasis"><small>Serial:</small></label>
                             <input type="text" name="newSerial" id="newSerial" class="form-control" style="background: #FFFBDF" inputmode="numeric"
                                 required>
                         </div>
                         <!-- <div class="modal-footer col"> -->
                         <div class="col d-flex align-self-end ms-2 gap-2">
                             <button class="btn btn-success" type="submit" id="serializeBtn">Add</button>
                             <button class="btn btn-danger" type="reset">Clear</button>
                         </div>
                     </div>
                 </form>
             </div>
             <div class="container p-3">
                 <div class="card">
                     <div class="card-body">
                         <div class="table-responsive overflow-auto" style="max-height: 300px">
                             <table class="table datatable table-borderless" id="basket-serial-table">
                                 <thead>
                                     <tr>
                                         <th>Model</th>
                                         <th>Item Code</th>
                                         <th>Serial</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <!-- <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr>
                                     <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr>
                                     <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr>
                                     <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr>
                                     <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr>
                                     <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr>
                                     <tr>
                                         <td>iPHONE 14 128GB STARLIGHT</td>
                                         <td>APL-IP14-128GBSLIGHT</td>
                                         <td>44529</td>
                                     </tr> -->
                                 </tbody>
                             </table>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     </div>
 </div>