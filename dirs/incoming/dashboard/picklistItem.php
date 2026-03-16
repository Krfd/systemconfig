<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadBasketContent()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary" id="picklistNumDisplay"></h3>
            </div>
        </div>
    </div>
    <div class="table-responsive overflow-auto ">
        <table class="table table-hover datatables" id="picklistItemTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary">SRN</th>
                    <th class="text-secondary">Date</th>
                    <th class="text-secondary">Requesting Branch</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>