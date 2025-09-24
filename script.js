async function loadData() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();

    // --- Status ---
    const statusSection = document.getElementById("status"); // ✅ ahora sí definido
    document.getElementById("lastUpdate").textContent =
      "Last update: " + data.status.lastUpdate;

    statusSection.innerHTML = `
      <div class="status-box">
        <strong>
          ${data.status.state === "operational" ? "✅ <span class='status-online'>All systems operational</span>" : ""}
          ${data.status.state === "updating" ? "<span class='loading'></span> 🟠 <span class='status-updating'>Updating</span>" : ""}
          ${data.status.state === "down" ? "❌ <span class='status-down'>Service offline</span>" : ""}
        </strong>
      </div>
      <h2>Services</h2>
      ${data.status.services.map(s => `
        <div class="status-box">
          ${s.name} - ${s.uptime} - 
          ${s.status === "operational" ? "✅ <span class='status-online'>Online</span>" : ""}
          ${s.status === "updating" ? "<span class='loading'></span> 🟠 <span class='status-updating'>Updating</span>" : ""}
          ${s.status === "down" ? "❌ <span class='status-down'>Offline</span>" : ""}
        </div>`).join("")}
    `;

    // --- Maintenance ---
    const maintenanceSection = document.getElementById("maintenance");
    if (data.maintenance.length === 0) {
      maintenanceSection.innerHTML = "<p>No scheduled maintenance.</p>";
    } else {
      maintenanceSection.innerHTML = data.maintenance.map(m => `
        <div class="status-box">
          <strong>${m.title}</strong><br>
          ${m.date} - ${m.description}
        </div>`).join("");
    }

    // --- Incidents ---
    const incidentsSection = document.getElementById("incidents");
    if (data.incidents.length === 0) {
      incidentsSection.innerHTML = "<p>No incidents reported.</p>";
    } else {
      incidentsSection.innerHTML = data.incidents.map(i => `
        <div class="status-box">
          <strong>${i.title}</strong><br>
          ${i.date} - ${i.description}
        </div>`).join("");
    }

  } catch (err) {
    console.error("Error loading data.json:", err);
  }
}

// --- Tabs ---
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    // quitar active de todos
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    // activar el clicado
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Run
loadData();
