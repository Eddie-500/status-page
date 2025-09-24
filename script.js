async function loadData() {
  const res = await fetch("data.json");
  const data = await res.json();

  // Status
  document.getElementById("lastUpdate").textContent =
    "Last update: " + data.status.lastUpdate;

  const statusSection = document.getElementById("status");
  statusSection.innerHTML = `
    <div class="status-box ${data.status.overall === "operational" ? "operational" : "down"}">
      <strong>${data.status.message}</strong>
    </div>
    <h2>Services</h2>
    ${data.status.services.map(s =>
      `<div class="status-box ${s.status}">
        ${s.name} - ${s.uptime} - ${s.status}
      </div>`).join("")}
  `;

  // Maintenance
  const maintSection = document.getElementById("maintenance");
  maintSection.innerHTML = data.maintenance.length > 0
    ? data.maintenance.map(m => `
      <div class="status-box maintenance">
        <strong>${m.date}</strong> - ${m.info}
      </div>`).join("")
    : "<p>No scheduled maintenance.</p>";

  // Incidents
  const incSection = document.getElementById("incidents");
  incSection.innerHTML = data.incidents.length > 0
    ? data.incidents.map((inc, i) => `
      <div class="incident">
        <h3>${inc.date} - ${inc.title}</h3>
        <p>Status: <span class="${inc.status}">${inc.status}</span></p>
        <div class="more" onclick="toggleUpdates(${i})">More info</div>
        <div class="incident-updates" id="updates-${i}">
          ${inc.updates.map(u => `<p><b>${u.time}</b> - ${u.text}</p>`).join("")}
        </div>
      </div>`).join("")
    : "<p>No incidents reported.</p>";
}

// Toggle updates
function toggleUpdates(id) {
  const el = document.getElementById("updates-" + id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

// Tabs
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

loadData();

