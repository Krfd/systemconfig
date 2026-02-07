<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadloadingbasket()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary">LOADING ITEM PL10002</h3>
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table datatables table-hover" id="outgoingTable">
            <thead>
                <tr>
                    <th class="text-secondary">SRN</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Requesting Branch</th>
                    <th class="text-secondary">Quantity</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr style="height: 30px; min-height:30px">
                    <td class="text-primary" style="cursor: pointer" onclick="openIncoming2()">SRNVIAC0001</td>
                    <td class="text-secondary">01/29/2026</td>
                    <td class="text-secondary">PLAZA</td>
                    <td class="text-secondary">50</td>
                    <td class="d-flex gap-1">
                        <button type="button" class="btn btn-primary btn-sm" onclick="openIncoming2()">
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
<div id="item_content"></div>
<script src="dirs/delivery/loadingitems/script/loadloadingitems.js"></script>