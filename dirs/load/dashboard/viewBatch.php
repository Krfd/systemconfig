<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-baseline gap-3">
            <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadingBasket()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>
                <h3 class="fw-bold text-primary" id="batchNumDisplay"></h3>
            </div>
        </div>
    </div>
    <div class="table-responsive-md mt-3">
        <table class="table table-hover datatables" id="batchItemTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary">#</th>
                    <th class="text-secondary">Brand</th>
                    <th class="text-secondary">Model</th>
                    <th class="text-secondary">Category</th>
                    <th class="text-secondary">Quantity</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <div id="totalRowOutside" class="d-flex border-top fw-bold"
        style="background:#FFFBDF;">
        <div class="p-2 flex-grow-1 text-end">
            Total Quantity:
        </div>
        <div class="p-2" style="width:120px;" id="batchTotal">
            0
        </div>
    </div>
</div>