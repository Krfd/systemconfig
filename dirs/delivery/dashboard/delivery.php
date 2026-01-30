<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Delivery</h3>
        </div>
        <button class="btn btn-primary" type="button" onclick="loadingBasket()">
            <i class="bi bi-truck"></i>
        </button>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="outgoingTable">
            <thead>
                <tr>
                    <th class="text-secondary">#</th>
                    <th class="text-secondary">DR No.</th>
                    <th class="text-secondary">Destination</th>
                    <th class="text-secondary">Picklist No.</th>
                    <th class="text-secondary">Status</th>
                    <th class="text-secondary">Delivery Date</th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px; min-height:30px" onclick="openDR1()">
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">4</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">DR-10001</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PLAZA</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PL10001</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">IN TRANSIT</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">01/17/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px" onclick="openDR2()">
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">3</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">DR-10002</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PLAZA</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PL10003</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">COMPLETED</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">01/17/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px" onclick="openDR3()">
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">2</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">DR-10003</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PLAZA</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PL10003</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PARTIAL</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">01/18/2026</td>
                </tr>
                <tr style="height: 30px; min-height:30px" onclick="openDR4()">
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">1</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">DR-10004</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PLAZA</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">PL10003</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">TERMINATED</td>
                    <td class="text-secondary" style="background: #FFFBDF; cursor: pointer">01/18/2026</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<div id="delivery_content"></div>
<script src="dirs/delivery/dashboard/script/delivery.js"></script>