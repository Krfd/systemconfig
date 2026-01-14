
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
    var BID = $("#branch-id").val();
    $.post("dirs/branch_profile/actions/get_location.php", { BID: BID }, function(data) {
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
                var locationName = "Bo's Café #" + BID;

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
