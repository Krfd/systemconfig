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
                    <th class="text-secondary">Type of Request</th>
                    <th class="text-secondary">Requesting Branch</th>
                    <th class="text-secondary">Status</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Picklist No.</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="height: 50px" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">1</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">SRNGALL0001</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">STS</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">GALLERIA</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">NEW</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">01/10/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">2</td>
                    <td class="text-secondary" style=" background: #FFFBDF; cursor: pointer" onclick="openIncoming()">SRNVIAC0001</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">STS</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">VIAC</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">NEW</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">01/10/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">3</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">SRNPLZA0001</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">STS</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">PLAZA</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">NEW</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">01/10/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer" onclick="openIncoming()">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF">
                    </td>
                </tr>
                <tr style="height: 50px;">
                    <td style="height: inherit" class="d-flex justify-content-center">
                        <input type="checkbox" name="checkbox" id="checkbox" class="form-check-input align-self-center mx-auto checkbox border border-primary">
                    </td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>