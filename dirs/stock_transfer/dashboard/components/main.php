<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Stock Transfer</h3>
        </div>
        <button class="btn btn-primary" type="button" onclick="newStockTransfer()">New</button>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="outgoingTable">
            <thead>
                <tr>
                    <th class="text-secondary">#</th>
                    <th class="text-secondary">STR No.</th>
                    <th class="text-secondary">Document Date</th>
                    <th class="text-secondary">Destination</th>
                    <th class="text-secondary">Delivery Date</th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px; min-height:30px; cursor: pointer" onclick="openTransfer1()">
                    <td class="text-secondary" style="background: #FFFBDF">3</td>
                    <td class="text-secondary" style="background: #FFFBDF">STR-10001</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF">SHOWREPOWH</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px; cursor: pointer" onclick="openTransfer2()">
                    <td class="text-secondary" style="background: #FFFBDF">2</td>
                    <td class="text-secondary" style="background: #FFFBDF">STR-10002</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF">SHOWREPOWH</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px; cursor: pointer" onclick="openTransfer3()">
                    <td class="text-secondary" style="background: #FFFBDF">1</td>
                    <td class="text-secondary" style="background: #FFFBDF">STR-10003</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
                    <td class="text-secondary" style="background: #FFFBDF">SHOWREPOWH</td>
                    <td class="text-secondary" style="background: #FFFBDF">01/31/2026</td>
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