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
                <td class="text-primary" onclick="openIncoming()" style="cursor: pointer">SRN10001</td>
                <td class="text-secondary">01/29/2026</td>
                <td class="text-secondary">PLAZA</td>
                <td class="text-secondary">50</td>
                <td class="d-flex gap-1">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openIncoming()">
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