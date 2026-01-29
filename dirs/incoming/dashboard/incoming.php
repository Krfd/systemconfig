<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Incoming</h3>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-primary btn-sm" type="button" onclick="toggleCheckboxes()" id="createPicklistBtn">Create Picklist</button>
            <button class="btn btn-primary" type="button" onclick="picklistBasket()">
                <i class="bi bi-cart"></i>
            </button>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="outgoingTable">
            <thead>
                <tr>
                    <th class="text-secondary"></th>
                    <th class="text-secondary">#</th>
                    <th class="text-secondary">SRN</th>
                    <th class="text-secondary">Stock Origin</th>
                    <th class="text-secondary">Requested by</th>
                    <th class="text-secondary">Status</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF;" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer;"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF;" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer;"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer"></i>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF" class="p-0">
                        <i class="bi bi-three-dots text-secondary ms-3" style="cursor: pointer"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<div id="incoming_content"></div>
<script src="dirs/incoming/dashboard/script/dashboard.js"></script>