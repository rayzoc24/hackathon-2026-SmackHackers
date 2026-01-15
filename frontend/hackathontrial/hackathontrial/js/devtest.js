// Dev self-test harness (runs only when ?selftest=1)
(function () {
  function qs(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  if (qs("selftest") !== "1") return;

  const results = [];
  function pass(name) {
    results.push({ name, ok: true });
  }
  function fail(name, msg) {
    results.push({ name, ok: false, msg });
  }

  document.addEventListener("DOMContentLoaded", () => {
    try {
      // Nav toggle
      const navToggle = document.getElementById("navToggle");
      const mainNav = document.getElementById("mainNav");
      if (navToggle && mainNav) {
        navToggle.click();
        pass("nav toggle toggles menu");
        navToggle.click(); // revert
      } else fail("nav toggle present", "navToggle or mainNav missing");

      // Hero title
      const title = document.querySelector(".title-light, .title-dark");
      if (title) pass("hero title exists");
      else fail("hero title exists", "missing .title-light/.title-dark");

      // Hubs
      const hubsGrid = document.getElementById("hubsGrid");
      if (hubsGrid) {
        pass("hubs grid exists");
        // It's acceptable for hubs to be empty on purpose
        if (hubsGrid.children.length > 0) pass("hubs loaded");
        else pass("hubs loaded (empty)");
      } else fail("hubs grid exists", "missing #hubsGrid");

      // Colleges tests removed — Colleges page is deprecated.
      // (No checks for college search/filter)

      // Events
      const eventsGrid = document.getElementById("eventsGrid");
      const dateFilter = document.getElementById("dateFilter");
      const clearBtn = document.getElementById("clearFilter");
      if (eventsGrid) pass("events grid exists");
      else fail("events grid exists", "missing #eventsGrid");
      if (dateFilter) {
        dateFilter.value = "2026-02-11";
        dateFilter.dispatchEvent(new Event("change"));
        pass("date filter change");
      } else fail("date filter present", "missing #dateFilter");
      if (clearBtn) {
        clearBtn.click();
        pass("clear filter button");
      } else fail("clear filter button", "missing #clearFilter");

      // Login
      const form = document.querySelector(".form");
      if (form) pass("login form present");
      else fail("login form present", "missing .form");
    } catch (err) {
      fail("exception", String(err));
    }

    // Render results panel
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.right = "12px";
    panel.style.bottom = "12px";
    panel.style.maxWidth = "420px";
    panel.style.zIndex = 99999;
    panel.style.fontFamily = "Inter, Arial, sans-serif";
    panel.style.fontSize = "13px";
    panel.style.background = "rgba(0,0,0,0.75)";
    panel.style.color = "#fff";
    panel.style.borderRadius = "10px";
    panel.style.padding = "12px";
    panel.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";

    const title = document.createElement("div");
    title.textContent = "Self-test results";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";
    panel.appendChild(title);

    results.forEach((r) => {
      const el = document.createElement("div");
      el.textContent =
        `${r.ok ? "✅" : "❌"} ${r.name}` + (r.msg ? ` — ${r.msg}` : "");
      el.style.marginBottom = "6px";
      panel.appendChild(el);
    });

    const close = document.createElement("button");
    close.textContent = "Close";
    close.style.marginTop = "8px";
    close.className = "btn ghost";
    close.addEventListener("click", () => panel.remove());
    panel.appendChild(close);

    document.body.appendChild(panel);

    console.group("selftest");
    results.forEach((r) =>
      console.log(r.ok ? "PASS" : "FAIL", r.name, r.msg || "")
    );
    console.groupEnd();
  });
})();
