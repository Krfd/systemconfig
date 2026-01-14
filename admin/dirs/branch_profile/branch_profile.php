<input type="text" id="branch-id">
<button type="button" class="btn btn-success" onclick="findbranch()">find</button>

<div class="row g-2">
    <!-- Branch Location Map -->
    <div class="col-md-6">
        <div class="card shadow-sm" style="min-height: 80vh;">
            <div class="card-body">
                <div id="map" style="height: 800px; width: 100%;"></div>
            </div>
        </div>
    </div>


    <!-- Branch Information Details -->
    <div class="col-md-6">
        <!-- Branch Details Card -->
        <div class="card shadow-sm mb-3" style="min-height: 40vh;">
            <div class="card-header bg-secondary-subtle">
                <h5 class="card-title mb-0" id="branch-name">Branch-Nasipit</h5>
            </div>
            <div class="card-body">
                <!-- Branch Info Rows -->
                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Branch Code:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-code" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Branch Type:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-type" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Status:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-status" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Address:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-address" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Province:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-province" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Email:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-email" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Contact:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-phnumber" readonly>
                    </div>
                </div>

                <div class="row mb-0">
                    <label class="col-sm-4 col-form-label">Opening Date:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-opening" readonly>
                    </div>
                </div>
            </div>
        </div>

        <!-- Franchisee Details Card -->
        <div class="card shadow-sm" style="min-height: 30vh;">
            <div class="card-header bg-secondary-subtle">
                <h5 class="card-title mb-0" id="branch-franchisee">Franchisee</h5>
            </div>
            <div class="card-body">
                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Owner:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-owner" readonly>
                    </div>
                </div>

                <div class="row mb-2">
                    <label class="col-sm-4 col-form-label">Franchise:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-franchise" readonly>
                    </div>
                </div>

                <div class="row mb-0">
                    <label class="col-sm-4 col-form-label">Franchise Date:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control-plaintext" id="branch-fdate" readonly>
                    </div>
                </div>
            </div>
        </div>
    </div>






</div>


<script>
    
    var map = L.map('map').setView([12.8797, 121.7740], 6); // Philippines center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Initialize marker at default PH center
    var marker = L.marker([12.8797, 121.7740], { draggable: true })
        .addTo(map)
        .bindPopup("Branch Location");

    // Update inputs when marker is dragged
    marker.on('dragend', function(e) {
        var pos = e.target.getLatLng();
        $("#latitude").val(pos.lat.toFixed(7));
        $("#longitude").val(pos.lng.toFixed(7));
    });

    // Search and update map & marker
    function findbranch() {
        var Bid = $("#branch-id").val();
        $.post("dirs/branch_profile/actions/get_location.php", { Bid: Bid }, function(data) {
            var response = JSON.parse(data);

            if (jQuery.trim(response.isSuccess) == "success") {
                var lat = parseFloat(response.Data.Latitude);
                var lng = parseFloat(response.Data.Longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    // Update inputs
                    $("#latitude").val(lat);
                    $("#longitude").val(lng);

                    // Move map to branch
                    map.setView([lat, lng], 15);

                    // Create dynamic popup using BID
                    var locationName = "Bo's Café #" + Bid;

                    // Move marker to branch and update popup
                    marker.setLatLng([lat, lng])
                          .bindPopup(locationName)
                          .openPopup();
                } else {
                    alert("Invalid coordinates received.");
                }
            } else {
                alert(jQuery.trim(response.Data));
            }
        });
    }

</script>