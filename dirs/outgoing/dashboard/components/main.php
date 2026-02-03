<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Outgoing</h3>
        </div>
        <button class="btn btn-primary" type="button" onclick="test()">New</button>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="outgoingTable">
            <thead>
                <tr>
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
                <tr style="height: 30px; min-height:30px; cursor: pointer">
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing1()">1</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing1()">SRNSHOW0001</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing1()">NEWSWH</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing1()">Vjay Endoma</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing1()">NEW</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing1()">01/10/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF" class="dropdown">
                        <button class="btn" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots text-secondary"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item">Open</a></li>
                            <li><a href="#" class="dropdown-item">Print</a></li>
                            <li><a href="#" class="dropdown-item">Cancel</a></li>
                            <li><a href="#" class="dropdown-item">Terminate</a></li>
                        </ul>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px; cursor: pointer">
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing2()">2</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing2()">SRNSHOW0002</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing2()">VIACWH</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing2()">Vjay Endoma</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing2()">IN TRANSIT</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing2()">01/10/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF" class="dropdown">
                        <button class="btn" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots text-secondary"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item">Open</a></li>
                            <li><a href="#" class="dropdown-item">Print</a></li>
                            <li><a href="#" class="dropdown-item">Cancel</a></li>
                            <li><a href="#" class="dropdown-item">Terminate</a></li>
                        </ul>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px; cursor: pointer">
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing3()">3</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing3()">SRNSHOW0003</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing3()">VIACWH</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing3()">Vjay Endoma</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing3()">ON PROCESS</td>
                    <td class="text-secondary" style="background: #FFFBDF" onclick="openOutgoing3()">01/10/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF" class="dropdown">
                        <button class="btn" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots text-secondary"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item">Open</a></li>
                            <li><a href="#" class="dropdown-item">Print</a></li>
                            <li><a href="#" class="dropdown-item">Cancel</a></li>
                            <li><a href="#" class="dropdown-item">Terminate</a></li>
                        </ul>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                    <td style="background: #FFFBDF"></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>