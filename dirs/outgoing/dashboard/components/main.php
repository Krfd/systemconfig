<div class="table-responsive overflow-auto" style="max-height: 450px">
    <table class="table datatables table-hover" id="outgoingTableDisplay">
        <thead class="sticky-top">
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
            <!-- <tr style="height: 30px; min-height:30px; cursor: pointer">
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
                </tr> -->
            <tr style="height: 50px; min-height: 50px">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
            </tr>
            <tr style="height: 50px; min-height:50px">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
            </tr>
            <tr style="height: 50px; min-height:50px">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
            </tr>
            <tr style="height: 50px; min-height:50px">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
            </tr>
            <tr style="height: 50px; min-height:50px">
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
    <div class="d-flex justify-content-end align-items-end mt-3 gap-1">
        <button class="btn btn-sm btn-outline-secondary" onclick="changePage(-1)">Previous</button>
        <ul class="pagination mb-0" id="pagination"></ul>
        <button class="btn btn-sm btn-outline-secondary" onclick="changePage(1)">Next</button>
    </div>
</div>