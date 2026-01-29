<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 40px" type="button" onclick="loadReturn()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">LOADING BASKET</h3>
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="outgoingTable">
            <thead>
                <tr>
                    <th class="text-secondary">Picklist No.</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Quantity</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px; min-height:30px">
                    <td class="text-primary" style="cursor: pointer" onclick="picklistItem1()">PL10001</td>
                    <td class="text-secondary">01/29/2026</td>
                    <td class="text-secondary">10</td>
                    <td class="d-flex gap-1">
                        <button type="button" class="btn btn-primary btn-sm" onclick="picklistItem1()">
                            <i class="bi bi-box-arrow-in-up-right"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm">
                            <i class="bi bi-dash"></i>
                        </button>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td class="text-primary" style="cursor: pointer" onclick="picklistItem2()">PL10002</td>
                    <td class="text-secondary">01/29/2026</td>
                    <td class="text-secondary">6</td>
                    <td class="d-flex gap-1">
                        <button type="button" class="btn btn-primary btn-sm" onclick="picklistItem2()">
                            <i class="bi bi-box-arrow-in-up-right"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm">
                            <i class="bi bi-dash"></i>
                        </button>
                    </td>
                </tr>
                <tr style="height: 30px; min-height:30px">
                    <td class="text-primary" style="cursor: pointer" onclick="picklistItem3()">PL10003</td>
                    <td class="text-secondary">01/29/2026</td>
                    <td class="text-secondary">20</td>
                    <td class="d-flex gap-1">
                        <button type="button" class="btn btn-primary btn-sm" onclick="picklistItem3()">
                            <i class="bi bi-box-arrow-in-up-right"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm">
                            <i class="bi bi-dash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<div id="loadingbasket_content"></div>
<script src="dirs/delivery/loadingbasket/script/loadingbasket.js"></script>