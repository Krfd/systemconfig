<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex justify-content-start align-items-start gap-3">
            <h3 class="fw-bold text-primary">Outgoing</h3>
        </div>
        <div class="d-flex gap-1">
            <button class="btn btn-danger" type="button" onclick="clearTables()">Reset</button>
            <button class="btn btn-primary" type="button" onclick="newRequest()">New</button>
        </div>
    </div>
    <div id="dashboard_content"></div>
</div>

<div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="collaborators" id="offcanvasScrolling" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h3 class="offcanvas-title" id="offcanvasExampleLabel"><i class="bi bi-people-fill text-primary"></i> Collaborators</h3>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="d-flex flex-column gap-1">
        <div class="card shadow-sm p-2 bg-primary-subtle" style="width: 100%;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-3">
                    <img src="assets/image/logo/noimage.avif" alt="..." style="height: 100px; max-height: 100px; width: 100px; max-width: 100px; object-fit: cover; border-radius: 50%;">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">User: John Doe</li>
                        <li class="list-group-item">Branch: SHOWROOM</li>
                        <li class="list-group-item">Activity: Request</li>
                        <li class="list-group-item">Timestamp: 10:46 PM 07/03/2026</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="card shadow-sm p-2 bg-primary-subtle" style="width: 100%;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-3">
                    <img src="assets/image/logo/noimage.avif" alt="..." style="height: 100px; max-height: 100px; width: 100px; max-width: 100px; object-fit: cover; border-radius: 50%;">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">User: Jane Doe</li>
                        <li class="list-group-item">Branch: VIAC</li>
                        <li class="list-group-item">Activity: Picklisted</li>
                        <li class="list-group-item">Timestamp: 09:25 AM 07/04/2026</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
<script src="assets/js/load.js"></script>
<script src="dirs/outgoing/dashboard/script/dashboard.js"></script>