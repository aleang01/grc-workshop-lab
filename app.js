const STORAGE_KEY = "grc-workshop-state-v1";

const controls = [
  { id: "data-inventory", category: "Identify", name: "Data inventory and classification", risk: "Sensitive student data may be unknown or unmanaged.", evidence: "Approved data register and classification policy", addresses: ["Data inventory and classification"], priority: "mandatory" },
  { id: "rbac", category: "Protect", name: "Role-based access control", risk: "Users may receive more access than their jobs require.", evidence: "Role matrix and identity-platform access report", addresses: ["Role-based access", "Evidence of operating controls"], priority: "mandatory" },
  { id: "admin-mfa", category: "Protect", name: "MFA for administrators", risk: "Stolen passwords could lead to administrative compromise.", evidence: "MFA policy and configuration export", addresses: ["Role-based access", "Suspicious activity", "Evidence of operating controls"], priority: "mandatory" },
  { id: "access-reviews", category: "Protect", name: "Quarterly access reviews", risk: "Unnecessary or outdated access may remain active.", evidence: "Signed access-review records", addresses: ["Role-based access", "Access removal", "Evidence of operating controls"], priority: "high" },
  { id: "termination", category: "Protect", name: "Employee termination checklist", risk: "Former personnel may retain access after leaving.", evidence: "Completed checklist and disabled-account report", addresses: ["Access removal", "Evidence of operating controls"], priority: "mandatory" },
  { id: "encryption", category: "Protect", name: "Encryption at rest and in transit", risk: "Exposed data could be read or intercepted.", evidence: "Cloud encryption configuration report", addresses: ["Data protection", "Evidence of operating controls"], priority: "mandatory" },
  { id: "logging", category: "Detect", name: "Centralized security logging", risk: "Suspicious activity may not be detected or investigated.", evidence: "Sample logs and retention settings", addresses: ["Suspicious activity", "Incident reporting", "Evidence of operating controls"], priority: "mandatory" },
  { id: "incident-response", category: "Respond", name: "Incident-response plan", risk: "Incidents may be handled inconsistently or reported late.", evidence: "Approved plan and tabletop exercise record", addresses: ["Incident reporting", "Evidence of operating controls"], priority: "mandatory" },
  { id: "vulnerability", category: "Identify / Protect", name: "Vulnerability scanning and patch tracking", risk: "Critical vulnerabilities may remain unresolved.", evidence: "Vulnerability report and remediation tickets", addresses: ["Vulnerability remediation", "Evidence of operating controls"], priority: "mandatory" },
  { id: "vendor-risk", category: "Govern", name: "Vendor-risk assessment process", risk: "Third parties may introduce unmanaged risk.", evidence: "Completed assessment and contract clauses", addresses: ["Third-party assessment", "Evidence of operating controls"], priority: "mandatory" },
  { id: "awareness", category: "Protect", name: "Security awareness training", risk: "Employees may fall for phishing or mishandle data.", evidence: "Training completion report and phishing results", addresses: ["Suspicious activity"], priority: "high" },
  { id: "backups", category: "Recover", name: "Backup and restoration testing", risk: "NLS may be unable to recover from data loss or ransomware.", evidence: "Restoration test record and recovery procedure", addresses: [], priority: "deferred" }
];

const requirements = [
  "Data inventory and classification", "Role-based access", "Access removal", "Data protection",
  "Suspicious activity", "Vulnerability remediation", "Third-party assessment", "Incident reporting", "Evidence of operating controls"
];

const defaultState = {
  teamName: "",
  currentView: "welcome",
  activity1: { selectedControls: [], completed: false, score: 0, coverage: 0 },
  report: { executiveSummary: "", topRisks: "", tradeoffs: "", successMeasures: "" }
};

let state = loadState();

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === viewId));
  state.currentView = viewId;
  saveState();
  updateProgress(viewId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(viewId) {
  const steps = { welcome: ["Getting started", 5], briefing: ["Scenario briefing", 25], activity1: ["Activity 1 of 2", 55], activity1Complete: ["Activity 1 complete", 65] };
  const [label, width] = steps[viewId] || steps.welcome;
  document.getElementById("progressLabel").textContent = label;
  document.getElementById("progressBar").style.width = `${width}%`;
}

function renderControls() {
  const grid = document.getElementById("controlGrid");
  grid.innerHTML = controls.map(control => {
    const selected = state.activity1.selectedControls.includes(control.id);
    return `<article class="control-card ${selected ? "selected" : ""}">
      <input type="checkbox" id="control-${control.id}" data-control-id="${control.id}" ${selected ? "checked" : ""} />
      <label for="control-${control.id}">${control.name}</label>
      <span class="control-meta">${control.category}</span>
      <p>${control.risk}</p>
      <p><strong>Evidence:</strong> ${control.evidence}</p>
    </article>`;
  }).join("");
  grid.querySelectorAll("input").forEach(input => input.addEventListener("change", handleControlChange));
  updateSelectionSummary();
}

function handleControlChange(event) {
  const id = event.target.dataset.controlId;
  const selected = new Set(state.activity1.selectedControls);
  event.target.checked ? selected.add(id) : selected.delete(id);
  state.activity1.selectedControls = [...selected];
  saveState();
  renderControls();
}

function updateSelectionSummary() {
  const count = state.activity1.selectedControls.length;
  document.getElementById("selectionCount").textContent = `${count} control${count === 1 ? "" : "s"} selected`;
  document.getElementById("submitActivity1").disabled = count < 1;
}

function enterWorkshop(event) {
  event.preventDefault();
  state.teamName = document.getElementById("teamName").value.trim();
  if (!state.teamName) return;
  saveState();
  showView("briefing");
}

function submitActivity1() {
  const selected = controls.filter(control => state.activity1.selectedControls.includes(control.id));
  const addressed = new Set(selected.flatMap(control => control.addresses));
  state.activity1.coverage = Math.round((addressed.size / requirements.length) * 100);
  state.activity1.score = Math.round(state.activity1.coverage * 0.4);
  state.activity1.completed = true;
  saveState();
  renderSummary();
  showView("activity1Complete");
}

function renderSummary() {
  const selected = controls.filter(control => state.activity1.selectedControls.includes(control.id));
  const addressed = new Set(selected.flatMap(control => control.addresses));
  const uncovered = requirements.filter(requirement => !addressed.has(requirement));
  document.getElementById("coverageScore").textContent = `${state.activity1.coverage}%`;
  document.getElementById("summaryControlCount").textContent = selected.length;
  document.getElementById("selectedBadge").textContent = selected.length;
  document.getElementById("activityStatus").textContent = state.activity1.coverage >= 70 ? "Strong foundation" : "Needs refinement";
  document.getElementById("selectedControlSummary").innerHTML = selected.length
    ? selected.map(control => `<div class="summary-item good"><strong>${control.name}</strong><span>${control.priority} priority · ${control.risk}</span></div>`).join("")
    : `<div class="summary-item gap">No controls selected.</div>`;
  document.getElementById("uncoveredRequirements").innerHTML = uncovered.length
    ? uncovered.map(requirement => `<div class="summary-item gap"><strong>${requirement}</strong><span>Add or justify a control that addresses this requirement.</span></div>`).join("")
    : `<div class="summary-item good"><strong>All nine requirements addressed</strong><span>Explain how the controls will operate and what evidence will be collected.</span></div>`;
  ["executiveSummary", "topRisks", "tradeoffs", "successMeasures"].forEach(field => {
    const input = document.getElementById(field);
    input.value = state.report[field] || "";
    input.addEventListener("input", () => { state.report[field] = input.value; saveState(); });
  });
}

function resetProgress() {
  if (!window.confirm("Reset all saved workshop progress?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = { ...defaultState };
  document.getElementById("teamName").value = "";
  renderControls();
  showView("welcome");
}

document.getElementById("teamForm").addEventListener("submit", enterWorkshop);
document.getElementById("submitActivity1").addEventListener("click", submitActivity1);
document.getElementById("resetButton").addEventListener("click", resetProgress);
document.getElementById("printReport").addEventListener("click", () => window.print());
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showView(button.dataset.go)));

if (state.teamName) document.getElementById("teamName").value = state.teamName;
renderControls();
if (state.activity1.completed) renderSummary();
showView(state.currentView || "welcome");
