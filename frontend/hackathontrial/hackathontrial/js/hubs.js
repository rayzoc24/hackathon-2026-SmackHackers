// Render hubs as clickable cards and link to events filtered by hub
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("hubsGrid");
  if (!container || !window.APP) return;
  const hubs = APP.data.hubs || [];
  // Render hub cards from APP.data.hubs. If there are no hubs, show a small fallback message.
  if (!hubs || hubs.length === 0) {
    container.innerHTML = '<p class="muted">No hubs available.</p>';
    return;
  }
  hubs.forEach((h) => {
    const a = document.createElement("a");
    a.href = `events.html?hub=${encodeURIComponent(h.id)}`;
    a.className = "card small clickable";
    a.setAttribute("aria-label", `Open ${h.name} hub`);
    a.dataset.hub = h.id;
    a.innerHTML = `
      <img src="${h.icon}" alt="${h.name}">
      <div>
        <h3>${h.name}</h3>
        <p class="muted text-sm">${h.desc}</p>
      </div>
    `;
    container.appendChild(a);
  });
});
