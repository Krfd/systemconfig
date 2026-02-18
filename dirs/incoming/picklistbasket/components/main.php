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
                <td class="text-primary picklist-num" style="cursor: pointer" data-picklist-num="PL10001">PL10001</td>
                <td class="text-secondary">01/29/2026</td>
                <td class="text-secondary">10</td>
                <td class="d-flex gap-1">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openPicklist()">
                        Open
                    </button>
                    <button type="button" class="btn btn-danger btn-sm cancel-picklist" data-picklist="PL10001">
                        Cancel
                    </button>
                </td>
            </tr>
            <tr style="height: 30px; min-height:30px">
                <td class="text-primary picklist-num" style="cursor: pointer" data-picklist-num="PL10002">PL10002</td>
                <td class="text-secondary">01/29/2026</td>
                <td class="text-secondary">6</td>
                <td class="d-flex gap-1">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openPicklist()">
                        Open
                    </button>
                    <button type="button" class="btn btn-danger btn-sm cancel-picklist" data-picklist="PL10002">
                        Cancel
                    </button>
                </td>
            </tr>
            <tr style="height: 30px; min-height:30px">
                <td class="text-primary picklist-num" style="cursor: pointer" data-picklist-num="PL10003">PL10003</td>
                <td class="text-secondary">01/29/2026</td>
                <td class="text-secondary">20</td>
                <td class="d-flex gap-1">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openPicklist()">
                        Open
                    </button>
                    <button type="button" class="btn btn-danger btn-sm cancel-picklist" data-picklist="PL10003">
                        Cancel
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>