<div class="card shadow-sm" style="height: 75vh;" id="dashboard-display">
    <div class="card-body">
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <form method="POST" id="request">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="form-floating">
                                    <input type="text" name="stsNo" id="stsNo" placeholder="STS No." class="form-control" required>
                                    <label for="stsNo" class="form-label">STS No.</label>
                                </div>
                                <div class="form-floating">
                                    <input type="date" name="date" id="date" placeholder="Date" class="form-control" required>
                                    <label for="date" class="form-label">Date</label>
                                </div>
                                <div class="form-floating">
                                    <select name="typeOfReq" id="typeOfReq" class="form-select" required>
                                        <option value="" selected></option>
                                        <option value="STS">STS</option>
                                        <option value="Buffing">Buffing</option>
                                    </select>
                                    <label for="typeOfReq">Type of Request</label>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1 col-3">
                                <div class="form-floating">
                                    <input type="text" name="from" id="from" placeholder="From" class="form-control" required>
                                    <label for="from" class="form-label">From</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="to" id="to" placeholder="To" class="form-control" required>
                                    <label for="to" class="form-label">To</label>
                                </div>
                                <div class="form-floating">
                                    <input type="text" name="appNo" id="appNo" placeholder="Caravan Approval No." class="form-control" required>
                                    <label for="appNo" class="form-label">Caravan Approval No.</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
        </section>
    </div>
</div>