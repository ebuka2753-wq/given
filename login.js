
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
const form = document.getElementById("loginForm");
const message = document.getElementById("message");

// SHOW / HIDE PASSWORD
toggle.addEventListener("click", function() {
  if (password.type === "password") {
    password.type = "text";
    toggle.textContent = "Hide";
  } else {
    password.type = "password";
    toggle.textContent = "Show";
  }
});

// LOGIN DEMONSTRATION
form.addEventListener("submit", function(event) {
  event.preventDefault();

  message.style.display = "block";

  message.textContent =
    "Login authentication is not connected yet. " +
    "Connect a secure authentication provider before using real accounts.";
});

// FORGOT PASSWORD
document.getElementById("forgotPassword")
  .addEventListener("click", function(event) {
    event.preventDefault();

    message.style.display = "block";
    message.textContent =
      "Password recovery will be available when secure account authentication is configured.";
  });
