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
                <tr style="height: 30px; min-height:30px">
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
                </tr>
                <tr style="height: 30px; min-height:30px">
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
<div id="delivery_content"></div>
<script src="dirs/delivery/dashboard/script/delivery.js"></script>