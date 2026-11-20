const STORAGE_KEY = "grc-workshop-state-v1";
const ACTIVITY2_PASSWORD = "MISSAFASTAct2";
const HIPAA_SOURCE_URL = "https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html";

const controls = [
  { id: "data-inventory", category: "Administrative", name: "ePHI inventory and risk analysis", risk: "Crestview may not understand where ePHI exists or which threats are most serious.", evidence: "Risk analysis, system inventory, and risk register", addresses: ["Risk analysis and management"], priority: "mandatory", hipaaRef: "§164.308(a)(1)(ii)(A)-(B) — Security Management Process" },
  { id: "rbac", category: "Technical", name: "Role-based EHR access control", risk: "Users may receive more ePHI access than their jobs require.", evidence: "Role matrix and EHR access report", addresses: ["Information access management"], priority: "mandatory", hipaaRef: "§164.308(a)(4) — Information Access Management; §164.312(a) — Access Control" },
  { id: "admin-mfa", category: "Technical", name: "MFA for EHR administrators and privileged users", risk: "Stolen credentials could expose or alter patient records.", evidence: "Authentication policy and MFA configuration export", addresses: ["Person/entity authentication", "Information access management"], priority: "mandatory", hipaaRef: "§164.312(d) — Person or Entity Authentication" },
  { id: "access-reviews", category: "Administrative", name: "Quarterly EHR access reviews", risk: "Unnecessary or outdated access may remain active.", evidence: "Signed access-review records", addresses: ["Information access management"], priority: "high", hipaaRef: "§164.308(a)(4) — Information Access Management" },
  { id: "termination", category: "Administrative", name: "Employee termination and role-change checklist", risk: "A former employee may retain access to the EHR.", evidence: "Completed checklist and disabled-account report", addresses: ["Information access management"], priority: "mandatory", hipaaRef: "§164.308(a)(3) — Workforce Security; §164.308(a)(4) — Information Access Management" },
  { id: "encryption", category: "Technical", name: "Secure email and encryption for transmitted ePHI", risk: "Patient information sent by email could be exposed to unauthorized recipients.", evidence: "Email encryption policy and configuration report", addresses: ["Transmission security"], priority: "mandatory", hipaaRef: "§164.312(e) — Transmission Security" },
  { id: "logging", category: "Technical", name: "EHR audit controls and centralized logging", risk: "Crestview may not detect or investigate improper access to patient records.", evidence: "EHR audit logs, review records, and retention settings", addresses: ["Audit controls"], priority: "mandatory", hipaaRef: "§164.312(b) — Audit Controls" },
  { id: "incident-response", category: "Administrative", name: "Security incident response and documentation plan", risk: "Security incidents may not be contained, mitigated, or documented consistently.", evidence: "Approved plan, incident records, and tabletop exercise", addresses: [], priority: "high", hipaaRef: "§164.308(a)(6) — Security Incident Procedures" },
  { id: "vulnerability", category: "Technical", name: "Vulnerability scanning and patch tracking", risk: "The outdated patient system may continue exposing ePHI to known attacks.", evidence: "Vulnerability report, patch SLA, and remediation tickets", addresses: [], priority: "high", hipaaRef: "§164.308(a)(1)(ii)(B) — Risk Management" },
  { id: "vendor-risk", category: "Administrative", name: "Business associate and vendor-risk assessment process", risk: "Cloud, billing, and scheduling vendors may introduce unmanaged ePHI risk.", evidence: "Vendor assessment, security review, and business associate agreement", addresses: [], priority: "high", hipaaRef: "§164.308(b) and §164.314(a) — Business Associate Contracts" },
  { id: "awareness", category: "Administrative", name: "Security awareness and HIPAA training", risk: "Workforce members may mishandle ePHI or bypass secure communication practices.", evidence: "Training completion report and policy acknowledgment", addresses: [], priority: "high", hipaaRef: "§164.308(a)(5) — Security Awareness and Training" },
  { id: "backups", category: "Administrative", name: "Backup and EHR restoration testing", risk: "Crestview may be unable to restore ePHI or continue care after disruption.", evidence: "Restoration test record and contingency plan", addresses: [], priority: "high", hipaaRef: "§164.308(a)(7) — Contingency Plan" },
  { id: "facility-access", category: "Physical", name: "Clinic facility access badges and visitor logs", risk: "Unauthorized people could enter areas containing systems that access ePHI.", evidence: "Badge access report and visitor log", addresses: [], priority: "deferred", hipaaRef: "§164.310(a) — Facility Access Controls" },
  { id: "workstation-security", category: "Physical", name: "Workstation privacy screens and secure workstation policy", risk: "Patient information could be viewed from an unattended or exposed workstation.", evidence: "Workstation policy and inspection checklist", addresses: [], priority: "deferred", hipaaRef: "§164.310(b)-(c) — Workstation Use and Security" },
  { id: "device-media", category: "Physical", name: "Device and media controls", risk: "Devices or media containing ePHI could be removed, reused, or discarded without appropriate protection.", evidence: "Media inventory, disposal record, and reuse procedure", addresses: [], priority: "deferred", hipaaRef: "§164.310(d) — Device and Media Controls" },
  { id: "security-official", category: "Administrative", name: "Assigned security responsibility", risk: "No accountable leader may own the Security Rule program or remediation decisions.", evidence: "Security official designation and responsibility matrix", addresses: [], priority: "deferred", hipaaRef: "§164.308(a)(2) — Assigned Security Responsibility" },
  { id: "periodic-evaluation", category: "Administrative", name: "Periodic security evaluation", risk: "Crestview may not detect when safeguards become ineffective as systems and risks change.", evidence: "Technical and non-technical evaluation report", addresses: [], priority: "deferred", hipaaRef: "§164.308(a)(8) — Evaluation" },
  { id: "secure-development", category: "Technical", name: "Secure software-development review", risk: "Application changes may introduce defects or weaknesses.", evidence: "Code-review checklist and release approval", addresses: [], priority: "deferred", hipaaRef: "No direct mapping to the five selected focus areas" }
];

const hipaaDefinitions = {
  "data-inventory": "Assess potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI, then implement measures to reduce those risks to a reasonable and appropriate level.",
  "rbac": "Use technical policies and procedures so electronic systems containing ePHI allow access only to authorized persons or software programs.",
  "admin-mfa": "Use procedures to verify that a person or entity seeking access to ePHI is the one claimed.",
  "access-reviews": "Authorize access to ePHI when it is appropriate for the user’s role and responsibilities, consistent with the minimum-necessary principle.",
  "termination": "Apply workforce-security policies that address authorization, supervision, and access for workforce members who work with ePHI.",
  "encryption": "Use technical security measures to guard against unauthorized access to ePHI transmitted over an electronic communications network.",
  "logging": "Use hardware, software, or procedural mechanisms to record and examine activity in systems that contain or use ePHI.",
  "incident-response": "Implement procedures to identify and respond to suspected or known security incidents, mitigate harmful effects, and document incidents and outcomes.",
  "vulnerability": "Implement security measures sufficient to reduce identified risks and vulnerabilities to a reasonable and appropriate level.",
  "vendor-risk": "Use written business associate arrangements that require appropriate safeguards for ePHI and address security incidents and subcontractors.",
  "awareness": "Implement a security-awareness and training program for members of the workforce, including management.",
  "backups": "Establish and implement procedures for responding to emergencies, including backup, restoration, and continuation of critical business processes.",
  "facility-access": "Implement policies and procedures to limit physical access to electronic information systems and facilities while allowing authorized access.",
  "workstation-security": "Specify proper workstation use and implement physical safeguards for workstations that access ePHI.",
  "device-media": "Govern the receipt, removal, movement, reuse, and final disposition of hardware and electronic media containing ePHI.",
  "security-official": "Designate a security official responsible for developing and implementing the policies and procedures required by the Security Rule.",
  "periodic-evaluation": "Perform periodic technical and non-technical assessments of how well policies and procedures meet Security Rule requirements.",
  "secure-development": "This activity does not have a direct mapping to one of the five selected focus areas; teams may justify it as a broader engineering safeguard."
};

const requirements = [
  "Risk analysis and management", "Information access management", "Audit controls",
  "Person/entity authentication", "Transmission security"
];

const frameworks = [
  { id: "hipaa", name: "HIPAA Security Rule", type: "Regulatory standard", description: "A set of national standards for protecting certain individually identifiable health information maintained or transmitted electronically.", correct: true },
  { id: "nist-csf", name: "NIST Cybersecurity Framework", type: "Risk framework", description: "A framework for managing cybersecurity risk through functions such as identifying, protecting, detecting, responding, and recovering.", correct: false },
  { id: "nist-800-53", name: "NIST SP 800-53", type: "Control catalog", description: "A catalog of security and privacy controls used to support risk-management and information-system security programs.", correct: false },
  { id: "cis-controls", name: "CIS Critical Security Controls", type: "Security framework", description: "A prioritized set of safeguards and implementation activities for improving an organization’s cybersecurity posture.", correct: false },
  { id: "iso-27001", name: "ISO/IEC 27001", type: "Management system standard", description: "A standard for establishing, implementing, maintaining, and continually improving an information security management system.", correct: false },
  { id: "pci-dss", name: "PCI DSS", type: "Payment security standard", description: "A standard of technical and operational requirements for organizations that store, process, or transmit payment-card data.", correct: false },
  { id: "soc-2", name: "SOC 2", type: "Assurance reporting framework", description: "A framework for evaluating and reporting on service-organization controls related to trust service criteria.", correct: false }
];

const implementationOptions = [
  { id: "data-inventory", name: "ePHI inventory and HIPAA risk analysis workshop", type: "Procedure", cost: 5000, weeks: 3, addresses: ["Risk analysis and management"], evidence: "Risk analysis and risk register" },
  { id: "admin-mfa", name: "MFA for EHR administrators and privileged users", type: "Configuration", cost: 6000, weeks: 1, addresses: ["Person/entity authentication", "Information access management"], evidence: "MFA configuration export" },
  { id: "rbac-redesign", name: "EHR role-based access redesign", type: "Procedure / configuration", cost: 8000, weeks: 3, addresses: ["Information access management"], evidence: "Approved role matrix" },
  { id: "access-process", name: "Manual termination and quarterly access reviews", type: "Procedure", cost: 4000, weeks: 2, addresses: ["Information access management"], evidence: "Signed review and termination records" },
  { id: "termination-automation", name: "Automated HR termination integration", type: "Tool / process", cost: 10000, weeks: 4, addresses: ["Information access management"], evidence: "HR-to-identity workflow report" },
  { id: "encryption-review", name: "EHR and secure-email transmission review", type: "Configuration", cost: 5000, weeks: 2, addresses: ["Transmission security"], evidence: "Email and EHR encryption report" },
  { id: "central-logging", name: "EHR audit logging using existing cloud tools", type: "Tool / configuration", cost: 15000, weeks: 5, addresses: ["Audit controls"], evidence: "Log samples and retention settings" },
  { id: "managed-siem", name: "Managed SIEM service", type: "Tool", cost: 32000, weeks: 6, addresses: ["Audit controls"], evidence: "SIEM dashboards and alert records" },
  { id: "vulnerability-dashboard", name: "Vulnerability scanner and patch dashboard", type: "Tool", cost: 12000, weeks: 4, addresses: [], evidence: "Vulnerability report and tickets" },
  { id: "incident-plan", name: "Security incident-response plan and tabletop exercise", type: "Procedure", cost: 6000, weeks: 3, addresses: [], evidence: "Approved plan and exercise record" },
  { id: "vendor-process", name: "Business associate and vendor-risk review process", type: "Procedure", cost: 6000, weeks: 3, addresses: [], evidence: "Vendor assessment and contract clauses" },
  { id: "awareness-training", name: "Security awareness and HIPAA training", type: "Service", cost: 8000, weeks: 3, addresses: [], evidence: "Completion and policy acknowledgment reports" },
  { id: "backup-test", name: "EHR backup restoration test and contingency procedure", type: "Procedure", cost: 8000, weeks: 2, addresses: [], evidence: "Restoration test record" },
  { id: "secure-development", name: "Secure software-development review", type: "Procedure", cost: 9000, weeks: 5, addresses: [], evidence: "Code-review checklist" },
  { id: "readiness-assessment", name: "External HIPAA Security Rule readiness assessment", type: "Service", cost: 18000, weeks: 4, addresses: ["Risk analysis and management"], evidence: "Readiness assessment report" }
];

const MAX_BUDGET = 70000;
const MAX_WEEKS = 13;

const defaultState = {
  teamName: "",
  currentView: "welcome",
  frameworks: { selected: [], checked: false, score: 0 },
  activity1: { selectedControls: [], completed: false, score: 0, coverage: 0, feedbackShown: false, revisionCount: 0 },
  activity2: { selectedOptions: [], completed: false, unlocked: false },
  report: { executiveSummary: "", topRisks: "", tradeoffs: "", successMeasures: "", implementationRecommendation: "", budgetRationale: "", implementationEvidence: "", residualRiskNotes: "" }
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...defaultState,
      ...saved,
      frameworks: { ...defaultState.frameworks, ...(saved.frameworks || {}) },
      activity1: { ...defaultState.activity1, ...(saved.activity1 || {}) },
      activity2: { ...defaultState.activity2, ...(saved.activity2 || {}) },
      report: { ...defaultState.report, ...(saved.report || {}) }
    };
  } catch {
    return {
      ...defaultState,
      frameworks: { ...defaultState.frameworks },
      activity1: { ...defaultState.activity1 },
      activity2: { ...defaultState.activity2 },
      report: { ...defaultState.report }
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showView(viewId) {
  if (viewId === "activity1" && (!state.frameworks.checked || state.frameworks.score < 1)) {
    viewId = "frameworks";
  }
  if ((viewId === "activity2" || viewId === "activity2Complete") && !state.activity2.unlocked) {
    document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === "activity1Complete"));
    state.currentView = "activity1Complete";
    saveState();
    updateProgress("activity1Complete");
    document.getElementById("activity2Password").focus();
    return;
  }
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === viewId));
  state.currentView = viewId;
  saveState();
  updateProgress(viewId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(viewId) {
  const steps = { welcome: ["Getting started", 5], briefing: ["Scenario briefing", 25], frameworks: ["Activity 1 · Frameworks", 40], activity1: ["Activity 1 · Controls", 55], activity1Complete: ["Activity 1 complete", 65], activity2: ["Activity 2 of 2", 80], activity2Complete: ["Workshop complete", 100] };
  const [label, width] = steps[viewId] || steps.welcome;
  document.getElementById("progressLabel").textContent = label;
  document.getElementById("progressBar").style.width = `${width}%`;
}

function renderFrameworks() {
  const grid = document.getElementById("frameworkGrid");
  grid.innerHTML = frameworks.map(framework => {
    const selected = state.frameworks.selected.includes(framework.id);
    return `<article class="framework-card ${selected ? "selected" : ""}">
      <input type="checkbox" id="framework-${framework.id}" data-framework-id="${framework.id}" ${selected ? "checked" : ""} />
      <label for="framework-${framework.id}">${framework.name}</label>
      <span class="control-meta">${framework.type}</span>
      <p>${framework.description}</p>
    </article>`;
  }).join("");
  grid.querySelectorAll("input").forEach(input => input.addEventListener("change", event => {
    const selected = new Set(state.frameworks.selected);
    event.target.checked ? selected.add(event.target.dataset.frameworkId) : selected.delete(event.target.dataset.frameworkId);
    state.frameworks.selected = [...selected];
    saveState();
    renderFrameworks();
  }));
}

function submitFrameworks() {
  const selected = new Set(state.frameworks.selected);
  const isCorrect = selected.size === 1 && selected.has("hipaa");
  const correctCount = isCorrect ? 1 : 0;
  const incorrectCount = isCorrect ? 0 : 1;
  state.frameworks.checked = true;
  state.frameworks.score = Math.max(0, correctCount - incorrectCount);
  saveState();
  const feedback = document.getElementById("frameworkFeedback");
  const identifiedHipaa = selected.has("hipaa");
  feedback.className = `framework-feedback ${isCorrect ? "good" : "review"}`;
  feedback.innerHTML = isCorrect
    ? `<strong>Correct.</strong><span>HIPAA is the primary requirement for this healthcare scenario. Supporting frameworks may help organize the work later, but HIPAA is the answer to this question.</span>`
    : `<strong>Please reconsider your selection.</strong><span>Return to the Crestview scenario briefing and focus on what kind of organization Crestview is, what information it stores, and which requirement specifically governs electronic protected health information. Select HIPAA alone before continuing.</span>`;
  feedback.hidden = false;
  document.getElementById("continueFromFrameworks").hidden = !isCorrect;
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
      <p class="hipaa-map"><strong>HIPAA mapping:</strong> ${control.hipaaRef} · <a href="${HIPAA_SOURCE_URL}" target="_blank" rel="noopener">HHS source</a></p>
      <button class="info-button" type="button" data-hipaa-control="${control.id}">View definition</button>
    </article>`;
  }).join("");
  grid.querySelectorAll("input").forEach(input => input.addEventListener("change", handleControlChange));
  grid.querySelectorAll("[data-hipaa-control]").forEach(button => button.addEventListener("click", () => openHipaaDetails(button.dataset.hipaaControl)));
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
  state.activity1.feedbackShown = true;
  state.activity1.revisionCount += 1;
  state.activity1.completed = true;
  saveState();
  renderSummary();
  showView("activity1Complete");
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString("en-US")}`;
}

function getPlanTotals() {
  const selected = implementationOptions.filter(option => state.activity2.selectedOptions.includes(option.id));
  return { selected, cost: selected.reduce((total, option) => total + option.cost, 0), weeks: selected.reduce((total, option) => Math.max(total, option.weeks), 0) };
}

function renderImplementationOptions() {
  const grid = document.getElementById("implementationGrid");
  const selectedRequirements = new Set(
    controls
      .filter(control => state.activity1.selectedControls.includes(control.id))
      .flatMap(control => control.addresses)
  );
  grid.innerHTML = implementationOptions.map(option => {
    const selected = state.activity2.selectedOptions.includes(option.id);
    const supportsSelection = option.addresses.some(address => selectedRequirements.has(address));
    return `<article class="implementation-card ${selected ? "selected" : ""} ${supportsSelection ? "supports-selection" : ""}">
      <input type="checkbox" id="option-${option.id}" data-option-id="${option.id}" ${selected ? "checked" : ""} />
      <label for="option-${option.id}">${option.name}</label>
      <span class="control-meta">${option.type} · ${option.weeks} weeks</span>
      <strong class="option-cost">${formatCurrency(option.cost)}</strong>
      <span class="support-badge">${supportsSelection ? "Supports your Activity 1 selection" : "Not directly linked to selected controls"}</span>
      <p>Addresses: ${option.addresses.length ? option.addresses.join(", ") : "additional resilience / maturity"}</p>
      <p><strong>Evidence:</strong> ${option.evidence}</p>
    </article>`;
  }).join("");
  grid.querySelectorAll("input").forEach(input => input.addEventListener("change", handleImplementationChange));
  updateBudgetSummary();
}

function handleImplementationChange(event) {
  const id = event.target.dataset.optionId;
  const selected = new Set(state.activity2.selectedOptions);
  event.target.checked ? selected.add(id) : selected.delete(id);
  state.activity2.selectedOptions = [...selected];
  saveState();
  renderImplementationOptions();
}

function updateBudgetSummary() {
  const { selected, cost, weeks } = getPlanTotals();
  const remaining = MAX_BUDGET - cost;
  document.getElementById("budgetUsed").textContent = formatCurrency(cost);
  document.getElementById("budgetRemaining").textContent = formatCurrency(remaining);
  document.getElementById("timelineStatus").textContent = `${weeks} / ${MAX_WEEKS} weeks`;
  document.getElementById("implementationCount").textContent = `${selected.length} option${selected.length === 1 ? "" : "s"} selected`;
  const alert = document.getElementById("budgetAlert");
  alert.className = "budget-alert";
  if (cost > MAX_BUDGET || weeks > MAX_WEEKS) {
    alert.classList.add("danger");
    alert.textContent = cost > MAX_BUDGET ? `Over budget by ${formatCurrency(cost - MAX_BUDGET)}. Reduce or replace an option.` : `Over the 90-day limit by ${weeks - MAX_WEEKS} week${weeks - MAX_WEEKS === 1 ? "" : "s"}.`;
  } else if (selected.length) {
    alert.classList.add("good");
    alert.textContent = `Plan is currently feasible with ${formatCurrency(remaining)} remaining.`;
  } else {
    alert.textContent = "Select implementation options to build your plan.";
  }
  document.getElementById("submitActivity2").disabled = !selected.length || cost > MAX_BUDGET || weeks > MAX_WEEKS;
}

function renderActivity1Focus() {
  const selected = controls.filter(control => state.activity1.selectedControls.includes(control.id));
  document.getElementById("activity1Focus").innerHTML = selected.length
    ? selected.map(control => `<div class="summary-item good"><strong>${control.name}</strong><span>${control.priority} priority</span></div>`).join("")
    : `<div class="summary-item gap">No Activity 1 controls found. Return and submit Activity 1 first.</div>`;
}

function submitActivity2() {
  state.activity2.completed = true;
  saveState();
  renderPlanSummary();
  showView("activity2Complete");
}

function renderPlanSummary() {
  const { selected, cost, weeks } = getPlanTotals();
  document.getElementById("finalPlanCost").textContent = formatCurrency(cost);
  document.getElementById("finalPlanTime").textContent = `${weeks} week${weeks === 1 ? "" : "s"}`;
  document.getElementById("finalPlanCount").textContent = selected.length;
  document.getElementById("finalPlanSummary").innerHTML = selected.map(option => `<div class="summary-item good"><strong>${option.name}</strong><span>${formatCurrency(option.cost)} · ${option.weeks} weeks · evidence: ${option.evidence}</span></div>`).join("");
  const covered = new Set(selected.flatMap(option => option.addresses));
  const residual = requirements.filter(requirement => !covered.has(requirement));
  document.getElementById("residualRisks").innerHTML = residual.length
    ? residual.map(requirement => `<div class="summary-item gap"><strong>${requirement}</strong><span>Explain the residual risk and why this was deferred.</span></div>`).join("")
    : `<div class="summary-item good"><strong>All listed requirements have an implementation action</strong><span>Explain ownership and how the evidence will be reviewed.</span></div>`;
}

function renderSummary() {
  const selected = controls.filter(control => state.activity1.selectedControls.includes(control.id));
  const addressed = new Set(selected.flatMap(control => control.addresses));
  const uncovered = requirements.filter(requirement => !addressed.has(requirement));
  const reviewLabel = state.activity1.coverage >= 80
    ? "Strong coverage"
    : state.activity1.coverage >= 60
      ? "Promising, review needed"
      : "Needs more coverage";
  document.getElementById("coverageScore").textContent = reviewLabel;
  document.getElementById("summaryControlCount").textContent = selected.length;
  document.getElementById("selectedBadge").textContent = selected.length;
  document.getElementById("activityStatus").textContent = state.activity1.completed
    ? (state.activity1.coverage >= 70 ? "Ready to report" : "Report with caveats")
    : "Revision required";
  document.getElementById("selectedControlSummary").innerHTML = selected.length
    ? selected.map(control => `<div class="summary-item good"><strong>${control.name}</strong><span>${control.priority} priority · ${control.risk}</span></div>`).join("")
    : `<div class="summary-item gap">No controls selected.</div>`;
  const hints = [
    ["Risk perspective", "Check whether your selection explains how Crestview identifies and manages threats to ePHI."],
    ["Access perspective", "Review who should be allowed to use the EHR, how access is limited by role, and what happens when a role changes."],
    ["Accountability perspective", "Ask how access to patient records is recorded, reviewed, and connected to a named user."],
    ["Identity perspective", "Consider how a person proves they are the authorized user before entering the EHR."],
    ["Communication perspective", "Consider how patient information is protected while it is sent electronically, especially by email."]
  ];
  document.getElementById("uncoveredRequirements").innerHTML = uncovered.length
    ? hints.slice(0, Math.max(2, Math.min(hints.length, uncovered.length + 1))).map(([title, hint]) => `<div class="summary-item gap"><strong>${title}</strong><span>${hint}</span></div>`).join("")
    : `<div class="summary-item good"><strong>Your selection covers the five focus areas</strong><span>Now check for unnecessary controls and strengthen each control-to-risk explanation.</span></div>`;
  ["executiveSummary", "topRisks", "tradeoffs", "successMeasures"].forEach(field => {
    const input = document.getElementById(field);
    input.value = state.report[field] || "";
    input.addEventListener("input", () => { state.report[field] = input.value; saveState(); });
  });
}

function openHipaaDetails(controlId) {
  const control = controls.find(item => item.id === controlId);
  if (!control) return;
  document.getElementById("hipaaDetailsTitle").textContent = control.name;
  document.getElementById("hipaaDetailsReference").textContent = control.hipaaRef;
  document.getElementById("hipaaDetailsDefinition").textContent = hipaaDefinitions[controlId] || "No additional definition is available for this control.";
  document.getElementById("hipaaDetailsModal").hidden = false;
  document.getElementById("hipaaDetailsClose").focus();
}

function closeHipaaDetails() {
  document.getElementById("hipaaDetailsModal").hidden = true;
}

function unlockActivity2(event) {
  event.preventDefault();
  const password = document.getElementById("activity2Password").value;
  if (password !== ACTIVITY2_PASSWORD) {
    document.getElementById("passwordError").textContent = "That access code is not correct.";
    return;
  }
  state.activity2.unlocked = true;
  saveState();
  document.getElementById("passwordError").textContent = "";
  showView("activity2");
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
document.getElementById("submitFrameworks").addEventListener("click", submitFrameworks);
document.getElementById("submitActivity1").addEventListener("click", submitActivity1);
document.getElementById("resetButton").addEventListener("click", resetProgress);
document.getElementById("submitActivity2").addEventListener("click", submitActivity2);
document.getElementById("printReport").addEventListener("click", () => window.print());
document.getElementById("printCurrentReport").addEventListener("click", () => window.print());
document.getElementById("finishWorkshop").addEventListener("click", () => {
  document.getElementById("completionModal").hidden = false;
  document.getElementById("completionClose").focus();
});
document.getElementById("completionClose").addEventListener("click", () => {
  document.getElementById("completionModal").hidden = true;
});
document.getElementById("passwordForm").addEventListener("submit", unlockActivity2);
document.getElementById("hipaaDetailsClose").addEventListener("click", closeHipaaDetails);
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showView(button.dataset.go)));

if (state.teamName) document.getElementById("teamName").value = state.teamName;
renderFrameworks();
if (state.frameworks.checked) submitFrameworks();
renderControls();
if (state.activity1.completed) renderSummary();
renderActivity1Focus();
renderImplementationOptions();
if (state.activity2.completed) renderPlanSummary();
showView(state.currentView || "welcome");
