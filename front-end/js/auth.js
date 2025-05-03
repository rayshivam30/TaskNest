// js/auth.js
const API_BASE = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const homepage = document.getElementById("home-page");

  if (homepage){
    homepage.addEventListener("click", async (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    })
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";
      } else {
        alert(data.detail || "Login failed");
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert("Signup successful. Please login.");
        window.location.href = "login.html";
      } else {
        const data = await res.json();
        alert(data.detail || "Signup failed");
      }
    });
  }
});
