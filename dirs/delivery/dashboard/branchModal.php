<div class="modal fade" tabindex="-1" id="assignBranchModal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fw-bold text-secondary">Select Branch to deliver</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="branchDeliveryUnit" method="POST">
                    <div class="d-flex fw-bold ms-auto align-items-center fs-4">
                        <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                        <div class="p-2 text-warning" id="deliveryQty">0</div>
                    </div>
                    <input type="hidden" id="serial">
                    <input type="hidden" id="brand">
                    <div class="table-responsive">
                        <table class="table table-hover datatables" id="branchToDeliverModal">
                            <thead class="sticky-top">
                                <tr>
                                    <th class="text-secondary">Branch</th>
                                    <th class="text-secondary">Model</th>
                                    <th class="text-secondary">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="background:#FFF7BC;">VIAC</td>
                                    <td style="background:#FFF7BC;">AH-X15BEF</td>
                                    <td style="background:#FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
                                </tr>
                                <tr>
                                    <td style="background:#FFF7BC;">GALLERIA</td>
                                    <td style="background:#FFF7BC;">AH-X15BEF</td>
                                    <td style="background:#FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
                                </tr>
                                <tr>
                                    <td style="background:#FFF7BC;">PLAZA</td>
                                    <td style="background:#FFF7BC;">AH-X15BEF</td>
                                    <td style="background:#FFF7BC; outline: none" contenteditable="true" class="border border-3 border-warning"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-3 float-end">
                        <button class="btn btn-primary" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>