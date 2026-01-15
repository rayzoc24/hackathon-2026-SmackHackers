// Common utilities for navigation and helpers

function updateNavigation() {
  const userInfo = localStorage.getItem("userInfo");
  const mainNav = document.getElementById("mainNav");
  const navLinks = mainNav ? mainNav.querySelectorAll("a") : [];
  
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === "login.html") {
      if (userInfo) {
        link.setAttribute("href", "profile.html");
        link.textContent = "Profile";
      } else {
        link.setAttribute("href", "login.html");
        link.textContent = "Login";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  }

  // Update navigation based on login status
  updateNavigation();

  // Listen for changes to localStorage (e.g., from other tabs)
  window.addEventListener("storage", (event) => {
    if (event.key === "userInfo") {
      updateNavigation();
    }
  });

  // Load dev self-test harness when ?selftest=1
  if (qs("selftest") === "1") {
    const s = document.createElement("script");
    s.src = "js/devtest.js";
    document.body.appendChild(s);
  }
});

function qs(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Format ISO date (YYYY-MM-DD) into a compact readable form: 'Tue, Feb 10'
function formatDateISO(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00"); // ensure treated as local date
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// small helper to create element with classes
function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}
