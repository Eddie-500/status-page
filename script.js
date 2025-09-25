async function loadData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    // Last update
    document.getElementById("lastUpdate").textContent = `Last update: ${data.status.lastUpdate}`;

    // Status Section
    const statusSection = document.getElementById("statusSection");
    statusSection.innerHTML = "";
    data.status.services.forEach(service => {
      let cardClass = "card-green";
      if (service.status === "updating") cardClass = "card-orange";
      if (service.status === "offline") cardClass = "card-red";

      statusSection.innerHTML += `
        <div class="card ${cardClass}">
          <h3 class="font-bold text-lg">${service.name}</h3>
          <p>Uptime: ${service.uptime}</p>
          <p>Status: ${service.status}</p>
        </div>
      `;
    });

    // Maintenance Section
    const maintenanceSection = document.getElementById("maintenanceSection");
    maintenanceSection.innerHTML = "";
    data.maintenance.forEach(item => {
      maintenanceSection.innerHTML += `
        <div class="card card-orange">
          <h3 class="font-bold text-lg">${item.date}</h3>
          <p>${item.info}</p>
        </div>
      `;
    });

    // Incidents Section
    const incidentsSection = document.getElementById("incidentsSection");
    incidentsSection.innerHTML = "";
    data.incidents.forEach(incident => {
      let cardClass = incident.status === "resolved" ? "card-green" : "card-red";

      incidentsSection.innerHTML += `
        <div class="card ${cardClass}">
          <h3 class="font-bold text-lg">${incident.title}</h3>
          <p>${incident.date} — ${incident.status}</p>
          <button class="details-btn mt-2 px-3 py-1 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500" onclick="toggleDetails(this)">Show details</button>
          <div class="details hidden mt-2 text-sm text-gray-200">
            ${incident.updates.map(update => `<p><strong>${update.time}</strong> — ${update.text}</p>`).join("")}
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error loading data.json:", error);
  }
}

function toggleDetails(button) {
  const details = button.nextElementSibling;
  if (details.classList.contains("hidden")) {
    details.classList.remove("hidden");
    button.textContent = "Hide details";
  } else {
    details.classList.add("hidden");
    button.textContent = "Show details";
  }
}

// Tabs
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(section => section.classList.add("hidden"));
    document.getElementById(btn.dataset.tab + "Section").classList.remove("hidden");
  });
});

loadData();
