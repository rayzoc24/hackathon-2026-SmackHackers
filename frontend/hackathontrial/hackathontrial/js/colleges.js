// Render colleges/communities with detailed information
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("collegesGrid");
  if (!grid || !window.APP) return;

  const colleges = APP.data.colleges || [];

  if (!colleges || colleges.length === 0) {
    grid.innerHTML = '<p class="muted">No colleges available.</p>';
    return;
  }

  // Sort colleges with APSIT first
  const apsit = colleges.find((c) => c.id === "apsit");
  const others = colleges.filter((c) => c.id !== "apsit");

  const sortedColleges = apsit ? [apsit, ...others] : colleges;

  sortedColleges.forEach((college, index) => {
    const card = document.createElement("div");
    card.className = "college-card";
    if (index === 0) card.classList.add("featured"); // APSIT as featured
    
    const hubs = APP.data.hubs || [];
    const hubObj = hubs.find((h) => h.id === college.hub);
    const hubName = hubObj ? hubObj.name : "General";

    card.innerHTML = `
      <div class="college-header">
        <img src="${college.img}" alt="${college.name}" class="college-icon">
        <div class="college-info">
          <h3>${college.name}</h3>
          <p class="shortname">${college.shortName || college.name}</p>
        </div>
      </div>
      <div class="college-details">
        <p class="description">${college.description}</p>
        <div class="college-meta">
          <div class="meta-item">
            <span class="label">Location:</span>
            <span class="value">${college.location}</span>
          </div>
          <div class="meta-item">
            <span class="label">Founded:</span>
            <span class="value">${college.founded}</span>
          </div>
          <div class="meta-item">
            <span class="label">Students:</span>
            <span class="value">${college.studentCount}</span>
          </div>
          <div class="meta-item">
            <span class="label">Focus Area:</span>
            <span class="value">${hubName}</span>
          </div>
        </div>
      </div>
      <a href="${college.website}" target="_blank" rel="noopener" class="btn btn-visit">Visit Website</a>
    `;

    grid.appendChild(card);
  });
});
