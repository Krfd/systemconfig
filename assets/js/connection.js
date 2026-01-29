const freezeOverlay = document.getElementById("freezeOverlay");

// Check if the user is online or offline
function checkConnection() {
  if (!navigator.onLine) {
    // Show the freeze overlay if offline
    freezeOverlay.style.display = "flex";
  } else {
    // Hide the freeze overlay if online
    freezeOverlay.style.display = "none";
  }
}

// Event listeners for online/offline status
window.addEventListener("online", checkConnection);
window.addEventListener("offline", checkConnection);

// Initial connection check
checkConnection();
