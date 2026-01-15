// Render events for a selected college (via ?college=) and allow date filtering
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("eventsGrid");
  const title = document.getElementById("eventsTitle");
  const dateFilter = document.getElementById("dateFilter");
  const collegeFilter = document.getElementById("collegeFilter");
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

    // If the hub has lectures, show them with completion buttons
    if (hubObj && hubObj.lectures && hubObj.lectures.length > 0) {
      if (title) title.textContent = `Lectures — ${hubObj.name}`;
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

      grid.innerHTML = `
        <div class="hub-lectures" style="max-width:1100px;margin:0 auto;padding:8px;">
          <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px;">
            <div>
              <h2 style="margin:0">${hubObj.name}</h2>
              <p class="muted" style="margin:4px 0 0 0">${hubObj.desc || ""}</p>
            </div>
            <a href="hubs.html" class="btn ghost">Back</a>
          </div>

          <div class="lecture-list" id="lectureList"></div>
        </div>
      `;

      const lectureList = grid.querySelector("#lectureList");
      const completedLectures = JSON.parse(localStorage.getItem("completedLectures") || "{}");

      hubObj.lectures.forEach((lecture) => {
        const lectureId = `lecture-${hubObj.id}-${lecture.id}`;
        const isCompleted = completedLectures[lectureId];
        const vid = getYouTubeId(lecture.url);
        const thumb = vid
          ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
          : "js/icons/event.svg";

        const lectureWrapper = document.createElement("div");
        lectureWrapper.className = "lecture-item";

        const lectureCard = document.createElement("a");
        lectureCard.href = lecture.url;
        lectureCard.target = "_blank";
        lectureCard.rel = "noopener";
        lectureCard.className = "lecture-card";
        lectureCard.innerHTML = `
          <img src="${thumb}" alt="${lecture.title} thumbnail" class="lecture-thumbnail">
          <div class="lecture-info">
            <h3>${lecture.title}</h3>
            <p class="muted" style="margin:4px 0 0 0;">Click to watch on YouTube</p>
          </div>
        `;

        const completeBtn = document.createElement("button");
        completeBtn.className = "btn-complete";
        completeBtn.textContent = isCompleted ? "✓ Completed" : "Mark Done";
        if (isCompleted) completeBtn.classList.add("completed");

        completeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const completedLectures = JSON.parse(localStorage.getItem("completedLectures") || "{}");

          if (completedLectures[lectureId]) {
            delete completedLectures[lectureId];
            completeBtn.textContent = "Mark Done";
            completeBtn.classList.remove("completed");
          } else {
            completedLectures[lectureId] = true;
            completeBtn.textContent = "✓ Completed";
            completeBtn.classList.add("completed");
          }

          localStorage.setItem("completedLectures", JSON.stringify(completedLectures));
        });

        lectureWrapper.appendChild(lectureCard);
        lectureWrapper.appendChild(completeBtn);
        lectureList.appendChild(lectureWrapper);
      });

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

  // Populate college filter dropdown
  if (collegeFilter) {
    const colleges = APP.data.colleges || [];
    colleges.forEach((col) => {
      const option = document.createElement("option");
      option.value = col.name;
      option.textContent = col.name;
      collegeFilter.appendChild(option);
    });

    // Add college filter event listener
    collegeFilter.addEventListener("change", () => {
      applyFilters();
    });
  }

  function applyFilters() {
    let filtered = events;

    // Filter by college
    const selectedCollege = collegeFilter ? collegeFilter.value : "";
    if (selectedCollege) {
      filtered = filtered.filter(
        (e) => e.college === selectedCollege || e.college === "All Colleges"
      );
    }

    // Filter by date
    const selectedDate = dateFilter ? dateFilter.value : "";
    if (selectedDate) {
      filtered = filtered.filter((e) => e.date === selectedDate);
    }

    render(filtered);
  }

  if (dateFilter) {
    dateFilter.addEventListener("change", () => {
      applyFilters();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (dateFilter) dateFilter.value = "";
      if (collegeFilter) collegeFilter.value = "";
      render(events);
    });
  }
});
