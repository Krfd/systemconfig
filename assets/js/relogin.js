let timeout;
const idleLimit = 5 * 60 * 1000; // 10 minutes
// const idleLimit = 5 * 1000; // 5 seconds

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(lockScreen, idleLimit);
}

function lockScreen() {
  localStorage.setItem("isLocked", "true");
  document.getElementById("lockOverlay").style.display = "flex";
}

async function unlockScreen() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const errorMsg = document.getElementById("errorMsg");

  // ✅ Validation for empty fields
  if (!username || !password) {
    Swal.fire({
      icon: "error",
      title: "Please enter a valid input",
      confirmButtonText: "Try again",
    });
    return;
  }

            console.log(`New Username: ${username}`)
            console.log(`New Password: ${password}`)

  try {
                $.post("actions/relogin.php", {
                    Username: username,
                    Password: password
                }, function(data) {
                    var response = JSON.parse(data);
                    if (response.isSuccess === "OK") {
                        localStorage.clear();

                        document.getElementById("lockOverlay").style.display = "none";
                        localStorage.setItem("isLocked", "false");
                        Swal.fire({
                            icon: "success",
                            title: "Authenticated successfully",
                            text: "Please wait...",
                            timer: 2000, // 2 seconds
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.assign("index.php");
                        })
                    } else if (response.isSuccess === "Failed") {
                        Swal.fire({
                            icon: "error",
                            title: "Login failed",
                            text: response.Message,
                            confirmButtonText: "OKAY"
                        })
                    } else {
                        console.log("Login failed:", response.Message);
                    }
                });
            } catch (err) {
                errorMsg.textContent = "Server error. Try again.";
            }
}

window.onload = function () {
  if (localStorage.getItem("isLocked") === "true") {
    document.getElementById("lockOverlay").style.display = "flex";
  }
  resetTimer();
};

// Track activity
["mousemove", "keydown", "click", "touchstart"].forEach((event) => {
  document.addEventListener(event, resetTimer);
});

// Start timer initially
resetTimer();
