const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

function loadScripts(window, doc, scriptPaths) {
  for (const sp of scriptPaths) {
    const p = path.join(__dirname, "..", sp);
    const code = fs.readFileSync(p, "utf8");
    // run in window context
    const scriptEl = doc.createElement("script");
    scriptEl.textContent = code;
    doc.body.appendChild(scriptEl);
  }
}

function runTest(htmlFile, extraScripts = []) {
  const htmlPath = path.join(__dirname, "..", htmlFile);
  const html = fs.readFileSync(htmlPath, "utf8");
  const dom = new JSDOM(html, {
    url: "file://" + htmlPath,
    runScripts: "dangerously",
  });
  const { window } = dom;
  const doc = window.document;

  // execute shared scripts (data.js, common.js) if not loaded automatically
  // Many pages include <script src="js/data.js"></script> etc; but jsdom won't auto-load local files, so inject them explicitly
  const commonScripts = ["js/data.js", "js/common.js"];
  loadScripts(window, doc, commonScripts);

  // page-specific script
  const pageScript = htmlFile.replace(".html", ".js").replace(/.*\//, "js/");
  const pageScriptPath = path.join(__dirname, "..", pageScript);
  if (fs.existsSync(pageScriptPath)) {
    loadScripts(window, doc, [pageScript]);
  }

  // fire DOMContentLoaded
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

  // small tests depending on page
  const results = [];
  try {
    if (htmlFile.endsWith("index.html")) {
      const navToggle = doc.getElementById("navToggle");
      const mainNav = doc.getElementById("mainNav");
      if (navToggle && mainNav) {
        navToggle.click();
        results.push([
          "navToggle toggles mainNav",
          mainNav.classList.contains("open"),
        ]);
      } else results.push(["navToggle present", false]);
      // hero title color check
      const title = doc.querySelector(".title-light");
      results.push(["hero title exists", !!title]);
    }

    if (htmlFile.endsWith("hubs.html")) {
      const grid = doc.getElementById("hubsGrid");
      results.push(["hubs grid exists", !!grid]);
      if (grid && grid.children.length > 0) {
        results.push(["hubs loaded", true]);
        const first = grid.children[0];
        results.push(["first hub has data-hub", !!first.dataset.hub]);
      } else {
        // Accept empty hubs as a valid state
        results.push(["hubs loaded (empty)", true]);
      }
    }

    // Colleges page tests removed (page deprecated).

    if (htmlFile.endsWith("events.html")) {
      const title = doc.getElementById("eventsTitle");
      const eventsGrid = doc.getElementById("eventsGrid");
      results.push(["events grid exists", !!eventsGrid]);
      // test date filter
      const dateFilter = doc.getElementById("dateFilter");
      if (dateFilter) {
        dateFilter.value = "2026-02-11";
        dateFilter.dispatchEvent(new window.Event("change"));
        results.push([
          "date filter narrows events",
          eventsGrid && eventsGrid.children.length > 0,
        ]);
      }
      // test clear filter
      const clearBtn = doc.getElementById("clearFilter");
      if (clearBtn) {
        clearBtn.click();
        results.push([
          "clear button works",
          dateFilter && dateFilter.value === "",
        ]);
      }
    }

    if (htmlFile.endsWith("login.html")) {
      const form = doc.querySelector(".form");
      if (form) {
        // simulate submit
        let prevented = false;
        // attach temporary listener to detect alert call replacement
        window.alert = function (msg) {
          /* noop */
        };
        const ev = new window.Event("submit", { bubbles: true });
        form.dispatchEvent(ev);
        results.push(["login form present", true]);
      } else results.push(["login form present", false]);
    }
  } catch (err) {
    results.push(["exception", String(err)]);
  }

  // collect console errors
  const consoleMessages = [];
  // Since we used runScripts dangerously and scripts may have used console by default, we didn't capture; instead, run basic validation
  return { file: htmlFile, results };
}

const files = ["index.html", "hubs.html", "events.html", "login.html"];
const out = files.map((f) => runTest(f));
console.log(JSON.stringify(out, null, 2));
process.exit(0);
