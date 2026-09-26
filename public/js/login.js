const form = document.getElementById("loginForm");
const errorBox = document.getElementById("errorBox");

// If already logged in, skip straight to dashboard
fetch("/api/session")
  .then((r) => r.json())
  .then((data) => {
    if (data.loggedIn) window.location.href = "/dashboard.html";
  });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.remove("show");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.error || "Login failed.";
      errorBox.classList.add("show");
      return;
    }

    window.location.href = "/dashboard.html";
  } catch (err) {
    errorBox.textContent = "Could not reach the server. Please try again.";
    errorBox.classList.add("show");
  }
});
