// Render events for a selected college (via ?college=) and allow date filtering
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("eventsGrid");
  const title = document.getElementById("eventsTitle");
  const dateFilter = document.getElementById("dateFilter");
  const clearBtn = document.getElementById("clearFilter");
  if (!grid || !window.APP) return;
  function computeEmbedUrl(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname === "/watch") {
          const vid = u.searchParams.get("v");
          if (vid) return `https://www.youtube.com/embed/${vid}`;
        }
        if (u.pathname.startsWith("/results")) {
          const q = u.searchParams.get("search_query") || "";
          return (
            "https://www.youtube.com/embed?listType=search&list=" +
            encodeURIComponent(q)
          );
        }
        if (u.pathname === "/playlist") {
          const list = u.searchParams.get("list") || "";
          return (
            "https://www.youtube.com/embed?listType=playlist&list=" +
            encodeURIComponent(list)
          );
        }
      }
    } catch (e) {}
    return url;
  }
  const college = qs("college");
  const hubParam = qs("hub");
  let events = APP.data.events || [];
  // If college specified, filter by college first
  if (college) {
    events = events.filter((e) => e.college === college);
    if (title) title.textContent = `Events — ${college}`;
  } else if (hubParam) {
    // find all colleges belonging to the hub and filter events by those colleges
    const colleges = APP.data.colleges || [];
    const hubs = APP.data.hubs || [];
    const hubObj = hubs.find((h) => h.id === hubParam);

    // If the hub has a configured video, show a clickable tile that opens YouTube
    if (hubObj && hubObj.video) {
      if (title) title.textContent = `Videos — ${hubObj.name}`;
      const controlsEl = document.querySelector(".controls");
      if (controlsEl) controlsEl.style.display = "none";

      function getYouTubeId(url) {
        try {
          const u = new URL(url);
          if (u.hostname === "youtu.be") return u.pathname.slice(1);
          if (u.hostname.includes("youtube.com"))
            return u.searchParams.get("v");
        } catch (e) {}
        const m = url.match(/[?&]v=([^&#]+)/);
        return m ? m[1] : null;
      }

      const vid = getYouTubeId(hubObj.video);
      const thumb = vid
        ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
        : "js/icons/event.svg";

      grid.innerHTML = `
        <div class="hub-video" style="max-width:1100px;margin:0 auto;padding:8px;">
          <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div>
              <h2 style="margin:0">${hubObj.name}</h2>
              <p class="muted" style="margin:4px 0 0 0">${hubObj.desc || ""}</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <a id="openOnYT" class="btn" href="${
                hubObj.video
              }" target="_blank" rel="noopener">Open on YouTube</a>
              <a href="hubs.html" class="btn ghost">Back</a>
            </div>
          </div>

          <div class="video-tiles" style="display:flex;flex-direction:column;gap:16px;">
            <a class="video-tile card clickable" href="${
              hubObj.video
            }" target="_blank" rel="noopener" aria-label="Open ${
        hubObj.name
      } video on YouTube" style="text-decoration:none;color:inherit;display:flex;gap:12px;border-radius:8px;overflow:hidden;border:1px solid rgba(37,99,235,0.08);align-items:stretch;min-height:160px;">
              <div style="padding:16px;background:#f8fbff;flex:1;">
                <h3 style="margin:0 0 6px 0;color:#111;">${hubObj.name} — ${
        hubObj.videoLabel || "Tutorial"
      }</h3>
                <p style="margin:0;font-size:13px;color:#374151;">Click to open the full tutorial on YouTube.</p>
              </div>
              <div style="flex:0 0 220px;max-width:220px;height:100%;overflow:hidden;">
                <img src="${thumb}" alt="${
        hubObj.name
      } thumbnail" style="width:100%;height:100%;object-fit:cover;display:block;">
              </div>
            </a>
          </div>
        </div>
      `;

      // Make the tile keyboard-accessible (Enter/Space)
      const tile = grid.querySelector(".video-tile");
      if (tile) {
        tile.setAttribute("tabindex", "0");
        tile.addEventListener("keyup", (e) => {
          if (e.key === "Enter" || e.key === " ") tile.click();
        });
      }

      return; // don't render events
    }

    const included = new Set(
      colleges.filter((c) => c.hub === hubParam).map((c) => c.name)
    );
    events = events.filter((e) => included.has(e.college));
    if (title)
      title.textContent = `Events — ${hubObj ? hubObj.name : hubParam}`;
  }

  function render(list) {
    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = '<p class="muted">No events found.</p>';
      return;
    }
    // sort by date then time
    list.sort((a, b) =>
      a.date > b.date ? 1 : a.date < b.date ? -1 : a.time > b.time ? 1 : -1
    );
    list.forEach((ev) => {
      const item = document.createElement("div");
      item.className = "event";
      item.innerHTML = `
        <div class="meta">
          <div class="date">${formatDateISO(ev.date)}</div>
          <div class="time">${ev.time}</div>
        </div>
        <div class="content">
          <h3>${ev.title}</h3>
          <p class="muted">${ev.college} · ${ev.location}</p>
          <p class="text-sm">${ev.desc}</p>
        </div>
      `;
      grid.appendChild(item);
    });
  }

  render(events);

  if (dateFilter) {
    dateFilter.addEventListener("change", () => {
      const v = dateFilter.value; // YYYY-MM-DD
      if (!v) return render(events);
      const filtered = events.filter((e) => e.date === v);
      render(filtered);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      dateFilter.value = "";
      render(events);
    });
  }
});
