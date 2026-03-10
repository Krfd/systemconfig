<div class="table-responsive">
    <table class="table datatables table-hover" id="deliveryBasketTable">
        <thead class="sticky-top">
            <tr>
                <th class="text-secondary">Picklist No.</th>
                <th class="text-secondary">Date</th>
                <th class="text-secondary">Quantity</th>
                <th class="text-secondary"></th>
            </tr>
        </thead>
        <tbody>
            <tr style="height: 30px; min-height:30px">
                <td class="text-primary" style="cursor: pointer" onclick="picklistItem1()">PL10001</td>
                <td class="text-secondary">01/29/2026</td>
                <td class="text-secondary">50</td>
                <td class="dropdown">
                    <i class="bi bi-three-dots text-secondary" data-bs-toggle="dropdown" style="cursor: pointer"></i>
                    <ul class="dropdown-menu">
                        <li><a href="#" class="dropdown-item">OPEN</a></li>
                        <li><a href="#" class="dropdown-item">REMOVE</a></li>
                        <li><a href="#" class="dropdown-item">CREATE DR</a></li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>