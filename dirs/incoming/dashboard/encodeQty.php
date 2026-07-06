<div class="container-fluid px-4">
    <div class="d-flex justify-content-start align-items-baseline gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="loadBasketContent()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Encode Actual Quantity</h3>
        </div>
    </div>
    <div class="card shadow-sm mt-2" id="dashboard-display">
        <div class="card-body">
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <form method="POST" id="encodeqty">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex flex-column gap-1 col-4">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="pklist" class="form-label text-dark-emphasis col-3"><small>PICKLIST:</small></label>
                                        <input type="text" name="pklist" id="pklist" class="form-control form-control-sm col" style="background: #f2f2f2" disabled required readonly>
                                    </div>
                                </div>
                                <div class="d-flex flex-column gap-1 col-2">
                                    <div class="d-flex align-items-baseline gap-3">
                                        <label for="date" class="form-label text-dark-emphasis col-4"><small>Date:</small></label>
                                        <input type="date" name="date" id="date" class="form-control form-control-sm col" style="background: #f2f2f2" required disabled readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive-sm mt-5" style="max-height: 450px">
                                <table class="table border border-secondary-subtle overall-progress" id="encodeQtyTable">
                                    <thead class="sticky-top">
                                        <tr>
                                            <th class="text-secondary d-none"></th>
                                            <th class="text-secondary text-center">#</th>
                                            <th class="text-secondary" style="width: 300px; min-width: 300px">Brand</th>
                                            <th class="text-secondary" style="width: 300px; min-width: 300px">Model</th>
                                            <th class="text-secondary text-start">Category</th>
                                            <th class="text-secondary text-center">Quantity</th>
                                            <th class="text-secondary text-center">Actual Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <button class="btn btn-primary d-block ms-auto mt-5 save-btn" type="submit">Save</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>