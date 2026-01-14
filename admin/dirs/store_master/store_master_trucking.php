<div class="card" style="height: 80vh;">
  <div class="card-body p-0">
    <div id="test-map" style="height: 100%; width: 100%;"></div>
  </div>
</div>

<script>
    var map = L.map('test-map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const branches = [
        { name: "Iloilo City Branch", lat: 10.7202, lng: 122.5621 },
        { name: "Buenavista, Agusan del Norte Branch", lat: 9.1289, lng: 125.5883 }
    ];

    var truckIcon = L.icon({
        iconUrl: '../assets/image/icon/box-truck.png', // path to your truck image
        iconSize: [40, 40],               // size of the icon
        iconAnchor: [20, 20],             // point of the icon which will correspond to marker's location
        popupAnchor: [0, -20]             // point from which the popup should open relative to the iconAnchor
    });

    // 2️⃣ Add markers with the truck icon
    var markers = branches.map(branch => {
        return L.marker([branch.lat, branch.lng], { icon: truckIcon })
                .addTo(map)
                .bindPopup(branch.name);
    });

    // 3️⃣ Draw dashed line route
    L.polyline(
        branches.map(b => [b.lat, b.lng]), 
        { color: 'red', weight: 3, dashArray: '10,10', opacity: 0.8 }
    ).addTo(map);

    // Fit bounds
    map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));
</script>


