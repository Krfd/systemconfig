<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Receiving</h3>
        </div>
        <button class="btn btn-primary" type="button" onclick="test()">New</button>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="receivingTable">
            <thead>
                <tr>
                    <th class="text-secondary">#</th>
                    <th class="text-secondary">RR No.</th>
                    <th class="text-secondary">Stock Origin</th>
                    <th class="text-secondary">Status</th>
                    <th class="text-secondary">Delivery Date</th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px; min-height:30px; cursor: pointer" onclick="openRec1()">
                    <td class="text-secondary" style="background: #FFFBDF">3</td>
                    <td class="text-secondary" style="background: #FFFBDF">REC-10001</td>
                    <td class="text-secondary" style="background: #FFFBDF">VIACWH</td>
                    <td class="text-secondary" style="background: #FFFBDF">TERMINATED</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px; cursor: pointer" onclick="openRec2()">
                    <td class="text-secondary" style="background: #FFFBDF">2</td>
                    <td class="text-secondary" style="background: #FFFBDF">REC-10002</td>
                    <td class="text-secondary" style="background: #FFFBDF">VIACWH</td>
                    <td class="text-secondary" style="background: #FFFBDF">PARTIAL</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/30/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px; cursor: pointer" onclick="openRec3()">
                    <td class="text-secondary" style="background: #FFFBDF">1</td>
                    <td class="text-secondary" style="background: #FFFBDF">REC-10003</td>
                    <td class="text-secondary" style="background: #FFFBDF">VIACWH</td>
                    <td class="text-secondary" style="background: #FFFBDF">COMPLETED</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/16/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px">
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
                </tr>
                <tr style="height: 30px; min-height:30px">
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
                </tr>
                <tr style="height: 30px; min-height:30px">
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