// Profile page - display user info and learning progress
document.addEventListener("DOMContentLoaded", function () {
  const profileInfo = document.getElementById("profileInfo");
  const completedCount = document.getElementById("completedCount");
  const progressPercent = document.getElementById("progressPercent");
  const completedLectures = document.getElementById("completedLectures");
  const logoutBtn = document.getElementById("logoutBtn");

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!userInfo) {
    // Redirect to login if not logged in
    window.location.href = "login.html";
    return;
  }

  // Display user profile info
  if (profileInfo) {
    profileInfo.innerHTML = `
      <div class="profile-avatar">
        <img src="${userInfo.picture || 'js/icons/logo.svg'}" alt="${userInfo.name}" />
      </div>
      <div class="profile-details">
        <h1>${userInfo.name || 'Student'}</h1>
        <p class="muted">${userInfo.email || ''}</p>
      </div>
    `;
  }

  // Get completed lectures
  const completedLecturesData = JSON.parse(localStorage.getItem("completedLectures") || "{}");
  const completedKeys = Object.keys(completedLecturesData);

  // Calculate total lectures
  const hubs = APP.data.hubs || [];
  let totalLectures = 0;
  hubs.forEach((hub) => {
    if (hub.lectures) {
      totalLectures += hub.lectures.length;
    }
  });

  // Display stats
  if (completedCount) {
    completedCount.textContent = completedKeys.length;
  }

  if (progressPercent) {
    const percent = totalLectures > 0 ? Math.round((completedKeys.length / totalLectures) * 100) : 0;
    progressPercent.textContent = `${percent}%`;
  }

  // Display completed lectures
  if (completedLectures) {
    if (completedKeys.length === 0) {
      completedLectures.innerHTML = '<p class="muted">No lectures completed yet. Start learning!</p>';
    } else {
      completedLectures.innerHTML = '';
      
      completedKeys.forEach((lectureKey) => {
        // Parse lecture key: lecture-{hubId}-{lectureId}
        const parts = lectureKey.split('-');
        if (parts.length >= 3) {
          const hubId = parts[1];
          const lectureId = parts.slice(2).join('-');
          
          const hub = hubs.find((h) => h.id === hubId);
          if (hub && hub.lectures) {
            const lecture = hub.lectures.find((l) => l.id === lectureId);
            if (lecture) {
              const item = document.createElement("div");
              item.className = "completed-item";
              item.innerHTML = `
                <div class="completed-check">✓</div>
                <div class="completed-info">
                  <h4>${lecture.title}</h4>
                  <p class="muted">${hub.name}</p>
                </div>
                <a href="${lecture.url}" target="_blank" rel="noopener" class="btn ghost btn-sm">Watch Again</a>
              `;
              completedLectures.appendChild(item);
            }
          }
        }
      });
    }
  }

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userInfo");
      window.location.href = "login.html";
    });
  }
});
