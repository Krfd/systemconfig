<div class="card shadow-sm" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="frm-request-sts">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-4">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="srnForm" class="form-label text-dark-emphasis col-2"><small>SRN:</small></label>
                                    <input type="text" name="srnForm" id="srnForm" class="form-control form-control-sm col" style="background: #F7F7F7" readonly required>
                                </div>
                                <div class="input-group col p-0 d-flex gap-1">
                                    <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                        <label for="desForm" class="form-label text-dark-emphasis col-4"><small>Destination:</small></label>
                                        <input type="text" name="desForm" id="desForm" class="form-control form-control-sm col" style="background: #F7F7F7;" required readonly>
                                    </div>
                                    <div class="col p-0 d-flex align-items-baseline">
                                        <label for="desCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                        <select name="desCodeForm" id="desCodeForm" class="form-select form-select-sm col" style="background: #fcf7d4; appearance: auto;" required>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group col p-0 d-flex align-items-baseline gap-1">
                                    <div class="col p-0 d-flex align-items-baseline gap-1 col-7">
                                        <label for="user-origin" class="form-label text-dark-emphasis col-4"><small>Origin:</small></label>
                                        <select name="user-origin" id="user-origin" class="form-control form-control-sm col" style="background: #fcf7d4; appearance: auto">
                                            <option value="NEWSC1" selected>NEWSC1</option>
                                        </select>
                                    </div>
                                    <div class="col p-0 d-flex align-items-baseline">
                                        <label for="originCodeForm" class="form-label text-dark-emphasis col-5"><small>WHCode:</small></label>
                                        <select name="originCodeForm" id="originCodeForm" class="form-select form-select-sm col" style="background: #fcf7d4; appearance: auto" required>
                                            <option value="NEWWHS" selected>NEWWHS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1 col-2">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                    <input type="date" name="date" id="formattedDate" class="form-control form-control-sm col" style="background: #F7F7F7" readonly value="<?php echo date('Y-m-d'); ?>" required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="statusForm" class="form-label text-dark-emphasis col-4"><small>Status:</small></label>
                                    <input type="text" name="statusForm" id="statusForm" class="form-control form-control-sm col" value="NEW" style="background: #F7F7F7" readonly required>
                                </div>
                            </div>
                        </div>
                        <div class="float-end my-3">
                            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addRequestUnit"> Add</button>
                            <button type="button" class="btn btn-sm btn-danger" onclick="clearTable()">Clear</button>
                        </div>
                        <div class="table-responsive overall-progress border border-secondary-subtle" style="max-height: 450px;">
                            <table class="table table-hover mb-0 w-100" id="outgoingTable">
                                <thead class="sticky-top">
                                    <tr>
                                        <th class="text-secondary text-center">#</th>
                                        <th class="text-secondary text-center">Brand</th>
                                        <th class="text-secondary ps-5">Model</th>
                                        <th class="text-secondary text-start ps-5">Category</th>
                                        <th class="text-secondary text-center">Quantity</th>
                                        <th class="text-secondary text-end ps-0 pe-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                                        <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                    </tr>
                                    <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                                        <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                    </tr>
                                    <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                                        <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                    </tr>
                                    <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                                        <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                    </tr>
                                    <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                                        <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                    </tr>
                                    <tr class="item-row empty-row" style="height: 40px; max-height: 40px">
                                        <td style="background: #fcf7d4; padding: 0">&nbsp;</td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                        <td style="background: #fcf7d4; padding: 0"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="totalRowOutside" class="d-flex border border-secondary fw-bold"
                            style="background:#faf0aa;">
                            <div class="p-2 flex-grow-1 text-end">Total Quantity:</div>
                            <div class="p-2" style="width:120px;" id="totalQuantity">0</div>
                        </div>
                        <div class="d-flex justify-content-between align-items-end mt-3">
                            <div class="d-flex flex-column gap-1 col-4">
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="purposeForm" class="form-label text-dark-emphasis col-4"><small>Purpose of Request:</small></label>
                                    <select name="purposeForm" id="purposeForm" class="form-select form-select-sm col" style="background: #fcf7d4; appearance: auto" required>
                                        <option value="" selected>Select purpose</option>
                                        <option value="Stock Refill">Stock Refill</option>
                                        <option value="Customer's Order">Customer's Order</option>
                                    </select>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="reqByForm" class="form-label text-dark-emphasis col-4"><small>Requested by:</small></label>
                                    <input type="text" name="reqByForm" id="reqByForm" class="form-control form-control-sm col" style="background: #F7F7F7" readonly required>
                                </div>
                                <div class="d-flex align-items-baseline gap-3">
                                    <label for="remarksForm" class="form-label text-dark-emphasis col-4"><small>Remarks:</small></label>
                                    <textarea name="remarksForm" id="remarksForm" class="form-control form-control-sm col" rows="3" style="background: #fcf7d4; height: auto" maxlength="100"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary" id="submitFormBtn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
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

        // var RequestType = $("#typeForm").val();
        var PurposeRequest = $("#purposeForm").val();
        var OBranch = $("#user-origin").val();
        var OWhscode = $("#originCodeForm").val();
        var DWhscode = $("#desCodeForm").val();
        var Remarks = $("#remarksForm").val();

        let submitBtn = $(this).find("#submitFormBtn")
        submitBtn.prop("disabled", true).html(`<span class="spinner-border spinner-border-sm"></span> Processing`)

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

        // if (!RequestType || !OWhscode || !DWhscode) {
        if (!OWhscode || !DWhscode) {
            Swal.fire({
                icon: "error",
                title: "Please fill all the required fields"
            })
            return;
        }

        // var btn = $(this).find("button[type='submit']");
        // btn.prop("disabled", true);

        $.post("dirs/outgoing/form/actions/save_stockrequest.php", {
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
                    text: "Request submitted successfully",
                    showConfirmButton: true,
                    confirmButtonText: "OKAY"
                }).then(() => {
                    $.post("./actions/log.php", {
                        Activity: "REQUESTED",
                        Reference: response.SRNumber
                    }, function(res) {
                        console.log(`RESPONSE: ${res}`)
                        // location.reload();
                    })
                    location.reload();
                    // submitBtn.prop("disabled", false).html("submit")
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.SRNumber + ' has been created',
                    text: data.message,
                });
            }
            // btn.prop("disabled", false);
            submitBtn.prop("disabled", false).html("Submit")
        });

    });
</script>