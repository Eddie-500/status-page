// --- Utilidades ---
// Escapa HTML básico y soporta **negritas** y links http(s)
function formatText(txt = "") {
  const escaped = String(txt)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const withLinks = withBold.replace(
    /(https?:\/\/[^\s)]+)(?![^<]*>)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );
  return withLinks;
}

// Badge/etiqueta visual del estado
function stateBadge(state = "") {
  const s = state.toLowerCase();
  if (["operational", "online", "resolved"].includes(s)) {
    return `✅ <span class="status-online">Online</span>`;
  }
  if (["updating", "maintenance", "degraded"].includes(s)) {
    return `<span class="loading"></span> 🟠 <span class="status-updating">Updating</span>`;
  }
  if (["down", "offline", "not resolved", "failed"].includes(s)) {
    return `❌ <span class="status-down">Offline</span>`;
  }
  return formatText(state);
}

// Carga robusta del JSON
async function fetchDataJson() {
  try {
    const r1 = await fetch("data.json", { cache: "no-store" });
    if (r1.ok) return r1.json();
    const r2 = await fetch("/data.json", { cache: "no-store" });
    if (r2.ok) return r2.json();
    throw new Error("No se pudo cargar data.json");
  } catch (e) {
    console.error("Error fetch data.json:", e);
    throw e;
  }
}

// Render principal
async function loadData() {
  try {
    const data = await fetchDataJson();

    // --- Header ---
    const lastUpdateEl = document.getElementById("lastUpdate");
    if (lastUpdateEl) {
      lastUpdateEl.textContent = "Last update: " + (data?.status?.lastUpdate || "—");
    }

    // --- STATUS ---
    const statusSection = document.getElementById("status");
    const state = (data?.status?.state || "").toString();
    const services = Array.isArray(data?.status?.services) ? data.status.services : [];

    const overallBox = `
      <div class="status-box">
        <strong>${stateBadge(state)}</strong>
      </div>
    `;

    const servicesHtml = services
      .map((s) => {
        const name = formatText(s?.name || "Service");
        const uptime = formatText(s?.uptime || "—");
        const st = stateBadge(s?.status || "");
        return `
          <div class="status-box">
            ${name} — ${uptime} — ${st}
          </div>
        `;
      })
      .join("");

    statusSection.innerHTML = `${overallBox}
      <h2>Services</h2>
      ${servicesHtml || "<p>No services listed.</p>"}
    `;

    // --- MAINTENANCE ---
    const maintenanceSection = document.getElementById("maintenance");
    const maint = Array.isArray(data?.maintenance) ? data.maintenance : [];

    maintenanceSection.innerHTML =
      maint.length === 0
        ? "<p>No scheduled maintenance.</p>"
        : maint
            .map((m) => {
              const date = formatText(m?.date || "—");
              const info = formatText(m?.info || "—");
              return `
                <div class="status-box">
                  <strong>Maintenance</strong><br>
                  ${date} — ${info}
                </div>
              `;
            })
            .join("");

    // --- INCIDENTS ---
    const incidentsSection = document.getElementById("incidents");
    const incidents = Array.isArray(data?.incidents) ? data.incidents : [];

    incidentsSection.innerHTML =
      incidents.length === 0
        ? "<p>No incidents reported.</p>"
        : incidents
            .map((i, idx) => {
              const title = formatText(i?.title || "Incident");
              const date = formatText(i?.date || "—");
              const st = stateBadge(i?.status || "");
              const updates = Array.isArray(i?.updates) ? i.updates : [];
              const updatesHtml = updates
                .map(
                  (u) =>
                    `<p><strong>${formatText(u?.time || "—")}</strong> — ${formatText(
                      u?.text || ""
                    )}</p>`
                )
                .join("");

              return `
                <div class="status-box">
                  <strong>${title}</strong><br>
                  ${date} — ${st}
                  <br>
                  <button class="details-btn" data-target="details-${idx}">See details</button>
                  <div id="details-${idx}" class="details" style="display:none; margin-top:8px;">
                    ${updatesHtml || "<em>No updates yet.</em>"}
                  </div>
                </div>
              `;
            })
            .join("");

    // Listeners para botones "See details"
    document.querySelectorAll(".details-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-target");
        const panel = document.getElementById(id);
        const isOpen = panel.style.display === "block";
        panel.style.display = isOpen ? "none" : "block";
        btn.textContent = isOpen ? "See details" : "Hide details";
      });
    });
  } catch (err) {
    console.error("Error loading data.json:", err);
    const statusSection = document.getElementById("status");
    if (statusSection) {
      statusSection.innerHTML =
        "<div class='status-box'><strong>Could not load data.json</strong></div>";
    }
  }
}

// Tabs
function setupTabs() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  loadData();
});
