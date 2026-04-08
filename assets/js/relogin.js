let timeout;
// const idleLimit = 5 * 60 * 1000; // 5 minutes
const idleLimit = 5 * 1000; // 5 minutes

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(lockScreen, idleLimit);
}

function lockScreen() {
  localStorage.setItem("isLocked", "true");
  document.getElementById("lockOverlay").style.display = "flex";
}

async function unlockScreen() {
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    const response = await fetch("/actions/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Save new session/token
      localStorage.setItem("authToken", data.token);
      localStorage.removeItem("isLocked");

      document.getElementById("lockOverlay").style.display = "none";
      resetTimer();
    } else {
      errorMsg.textContent = "Invalid username or password";
    }
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
