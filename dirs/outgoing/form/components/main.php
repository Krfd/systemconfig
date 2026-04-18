<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="frm-request-sts">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-4">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="srnForm" class="form-label text-dark-emphasis col-3"><small>SRN:</small></label>
                                    <input type="text" name="srnForm" id="srnForm" class="form-control form-control-sm col" style="background: #f2f2f2" readonly required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="typeForm" class="form-label text-dark-emphasis col-3"><small>Type of Request:</small></label>
                                    <select name="typeForm" id="typeForm" class="form-select form-select-sm col" style="background: #FFFBDF" required>
                                        <option value="" selected></option>
                                        <option value="STS">STS</option>
                                        <option value="Buffing">BUFFING</option>
                                    </select>
                                </div>
                                <div class="input-group col p-0 d-flex gap-1">
                                    <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                        <label for="desForm" class="form-label text-dark-emphasis col-5"><small>Destination:</small></label>
                                        <input type="text" name="desForm" id="desForm" class="form-control form-control-sm col ms-3" style="background: #f2f2f2;" required readonly>
                                    </div>
                                    <div class="col p-0 d-flex align-items-baseline">
                                        <label for="desCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                        <select name="desCodeForm" id="desCodeForm" class="form-select form-select-sm col" style="background: #FFFBDF;" required>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                    <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                        <label for="user-origin" class="form-label text-dark-emphasis col-5"><small>Origin:</small></label>
                                        <select name="user-origin" id="user-origin" class="form-control form-control-sm col ms-3" style="background: #FFFBDF">
                                        </select>
                                    </div>
                                    <div class="col p-0 d-flex align-items-baseline">
                                        <label for="originCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                        <select name="originCodeForm" id="originCodeForm" class="form-select form-select-sm col" style="background: #FFFBDF" required>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1 col-2">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                    <input type="date" name="date" id="formattedDate" class="form-control form-control-sm col" style="background: #FFFBDF" value="<?php echo date('Y-m-d'); ?>">
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="statusForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                    <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm col" value="NEW" style="background: #f2f2f2" readonly required>
                                </div>
                            </div>
                        </div>
                        <div class="float-end my-3">
                            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addRequestUnit"><i class="bi bi-plus"></i> Add</button>
                            <button type="button" class="btn btn-sm btn-danger" onclick="clearTable()">Clear</button>
                        </div>
                        <div class="table-responsive overflow-auto" style="max-height: 450px">
                            <table class="table table-hover" id="outgoingTable">
                                <thead class="sticky-top">
                                    <tr>
                                        <th class="text-secondary">#</th>
                                        <th class="text-secondary">Brand</th>
                                        <th class="text-secondary">Model</th>
                                        <th class="text-secondary">Category</th>
                                        <th class="text-secondary text-center">Quantity</th>
                                        <th class="text-secondary">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                        <div id="totalRowOutside" class="d-flex border-top fw-bold"
                            style="background:#FFF7BC;">
                            <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                            <div class="p-2" style="width:120px;" id="totalQuantity">0</div>
                        </div>
                        <div class="d-flex justify-content-between align-items-end mt-3">
                            <div class="d-flex flex-column gap-1 col-4">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="purposeForm" class="form-label text-dark-emphasis col-4"><small>Purpose of Request:</small></label>
                                    <!-- <input type="text" name="purposeForm" id="purposeForm" class="form-control form-control-sm col" style="background: #FFFBDF" required> -->
                                    <select name="purposeForm" id="purposeForm" class="form-select form-select-sm col" style="background: #FFFBDF" required>
                                        <option value="" selected></option>
                                        <option value="Stock Refill">Stock Refill</option>
                                        <option value="Customer's Order">Customer's Order</option>
                                    </select>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="reqByForm" class="form-label text-dark-emphasis col-4"><small>Requested by:</small></label>
                                    <input type="text" name="reqByForm" id="reqByForm" class="form-control form-control-sm col" style="background: #f2f2f2" readonly required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="remarksForm" class="form-label text-dark-emphasis col-4"><small>Remarks:</small></label>
                                    <textarea name="remarksForm" id="remarksForm" class="form-control form-control-sm col" rows="3" style="background: #FFFBDF; height: auto" maxlength="100"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary" id="submitFormBtn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>

<script>
    $("#desForm").on("change", function() {
        loadDestinationWhscodes();
    });

    /*Form submit stock request*/
    $("#frm-request-sts").on("submit", function(e) {
        e.preventDefault();

        var RequestType = $("#typeForm").val();
        var PurposeRequest = $("#purposeForm").val();
        var OBranch = $("#user-origin").val();
        var OWhscode = $("#originCodeForm").val();
        var DWhscode = $("#desCodeForm").val();
        var Remarks = $("#remarksForm").val();

        // 🔹 Collect items
        var Itemnumber = [];
        $("td[name='temp-itemnum[]']").each(function() {
            Itemnumber.push($(this).text().trim());
        });

        // 🔹 Validation
        if (Itemnumber.length === 0) {
            // alert("No items selected.");
            Swal.fire({
                icon: "error",
                title: "No Items has been added"
            })
            return;
        }

        if (!RequestType || !OWhscode || !DWhscode) {
            // alert("Please fill required fields.");
            Swal.fire({
                icon: "error",
                title: "Please fill all the required fields"
            })
            return;
        }

        // 🔹 Disable submit (prevent double click)
        var btn = $(this).find("button[type='submit']");
        btn.prop("disabled", true);

        $.post("dirs/outgoing/form/actions/save_stockrequest.php", {
            RequestType: RequestType,
            PurposeRequest: PurposeRequest,
            OBranch: OBranch,
            OWhscode: OWhscode,
            DWhscode: DWhscode,
            Remarks: Remarks,
            ItemNum: Itemnumber
        }, function(data) {

            var response = JSON.parse(data)

            if (response.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Request submitted successfully!",
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.SRNumber + ' has been created',
                    text: data.message,
                });
            }
            // 🔹 Re-enable button
            btn.prop("disabled", false);
        });

    });
</script>