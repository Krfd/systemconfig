<div class="container-fluid px-4 overall-progress">
    <div class="d-flex justify-content-start align-items-center gap-3">
        <button class="btn btn-primary rounded-5" style="height: 45px" type="button" onclick="receivingForm()">
            <i class="bi bi-arrow-left"></i>
        </button>
        <h3 class="fw-bold text-primary">Drafts</h3>
    </div>
    <div class="table-responsive mt-3">
        <table class="table datatables table-hover border border-secondary-subtle overall-progress" id="draftsTable">
            <thead class="sticky-top">
                <tr>
                    <th class="text-secondary text-center">#</th>
                    <th class="text-secondary">Reference No.</th>
                    <th class="text-secondary">Stock Origin</th>
                    <th class="text-secondary">Destination</th>
                    <th class="text-secondary">Last Modified</th>
                    <th class="text-secondary"></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>