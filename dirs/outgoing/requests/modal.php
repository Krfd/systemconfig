<div class="modal fade" tabindex="-1" id="openPicklistTable">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <div>
                    <h2 class="modal-title fw-bold text-secondary">Picklists</h2>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="fw-semibold">Select picklist number to add:</p>
                <form id="newPicklistItem" method="POST">
                    <table class="table datatables table-striped table-borderless" id="picklistTable">
                        <thead>
                            <th class="text-secondary">Picklist No.</th>
                            <th class="text-secondary text-center">Quantity</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-primary" style="cursor: pointer">PL10001</td>
                                <td class="text-center">180</td>
                            </tr>
                            <tr>
                                <td class="text-primary" style="cursor: pointer">PL10002</td>
                                <td class="text-center">143</td>
                            </tr>
                            <tr>
                                <td class="text-primary" style="cursor: pointer">PL10003</td>
                                <td class="text-center">285</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="mt-3 float-end">
                        <button class="btn btn-primary" type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>