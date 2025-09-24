async function loadData() {
  const res = await fetch("data.json");
  const data = await res.json();

  // Status
  const statusSection = document.getElementById("status"); // ✅ Aquí declaramos la variable
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
