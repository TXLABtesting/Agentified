/* =============================================================================
   Agentic Transformation Dashboard — Mock Data
   -----------------------------------------------------------------------------
   HR department data is authored from the live "Agentifying HR — Strategic
   Blueprint" (13 core agents + 10 recommended value-add agents). The remaining
   departments use realistic mock data, structured identically so that real
   data can be dropped in later without touching the UI layer.

   Scales used across the dashboard:
     complexity  : Low | Medium | High | Very High      (score 1..4)
     impact      : Low | Medium | High
     feasibility : Low | Medium | High
     status      : Ready | Needs Review | In Progress
     priority    : Quick Win | Strategic | Complex | Future Phase
   ========================================================================== */

const COMPLEXITY_SCORE = { "Low": 1, "Medium": 2, "High": 3, "Very High": 4 };

/* -- HR: Tier A — Employee-facing -------------------------------------------- */
const HR_AGENTS = [
  /* -- Tier A — Employee-facing -------------------------------------------- */
  {
    id: "hr-01",
    name: "HR Virtual Assistant",
    kind: "core",
    tier: "Tier A · Employee-facing",
    purpose: "First line of response for employee HR questions and a guided front-end to every self-service.",
    responsibilities: "Answer policy, entitlement and eligibility questions; walk employees through ESS actions (leave, letters, claims, updates); triage and log Employee Relations inquiries; route complaints, grievances and special cases to a human with a clean summary.",
    process: "Employee Relations (Inquiries, Special-Cases triage); the guidance layer over all 15 ESS services; HR Letter selection.",
    inputs: ["HR policy knowledge base", "Leave & allowance rules", "FAQ corpus", "Employee's scoped Oracle data", "Inbound message"],
    systems: ["MOCA App", "WhatsApp", "HR Services email", "Emanasa", "Hotline transcription", "Oracle (read-only)"],
    outputs: ["Answered query", "Logged ticket", "Guided action", "Structured escalation summary"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High for guidance · Low for record changes",
    risks: "Low — information only; any record change stays human-gated. Depends on a curated bilingual knowledge base.",
    nextAction: "Approve for Phase 1 build. Commission the curated bilingual (AR/EN) FAQ & policy corpus — the highest-leverage asset to prepare.",
    subAgents: [
      { name: "Policy & Eligibility Q&A", desc: "Answers policy, entitlement and eligibility questions from the knowledge base.", complexity: "Medium", type: "Conversational", deps: "Policy KB", status: "Ready" },
      { name: "Self-Service Guide", desc: "Walks employees step-by-step through the 15 ESS actions.", complexity: "Low", type: "Conversational", deps: "Oracle (read)", status: "Ready" },
      { name: "Inquiry Triage & Logging", desc: "Classifies, logs and routes Employee Relations inquiries across channels.", complexity: "Medium", type: "Orchestration", deps: "Multi-channel intake", status: "In Progress" },
      { name: "Escalation Summariser", desc: "Packages complaints and sensitive cases with context for a human owner.", complexity: "Medium", type: "Drafting", deps: "Agent context", status: "Ready" }
    ]
  },
  {
    id: "hr-02",
    name: "HR Letters & Certificates Agent",
    kind: "core",
    tier: "Tier A · Employee-facing",
    purpose: "Closes the gap on letters that cannot be auto-generated, so employees are not waiting 1–2 days on manual drafting.",
    responsibilities: "For auto-generated letters, confirm and guide; for the validated branch (To-Whom-It-May-Concern and Salary Transfer), assemble a correct, populated draft for HR review and signature; answer letter-status questions.",
    process: "ESS: HR Letter Request (validated branch).",
    inputs: ["Letter templates", "Employee Oracle data", "Request type"],
    systems: ["Oracle", "MOCA App", "Email"],
    outputs: ["Signature-ready letter draft", "Status updates to the employee"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Strategic", autonomy: "Medium — drafts; a human signs",
    risks: "Low. HR reviews and signs every validated-branch letter; the agent never issues a signed letter on its own.",
    nextAction: "Schedule for Phase 2 once Document Intelligence is mature. Confirm the TWMIC & Salary-Transfer template library.",
    subAgents: [
      { name: "Template Populator", desc: "Fills the correct template with validated employee data.", complexity: "Low", type: "Drafting", deps: "Template library", status: "Ready" },
      { name: "Letter Status Tracker", desc: "Answers status questions and notifies the employee on issuance.", complexity: "Low", type: "Monitoring", deps: "Oracle", status: "Ready" }
    ]
  },

  /* -- Tier B — Document & Compliance -------------------------------------- */
  {
    id: "hr-03",
    name: "Document Intelligence & Validation Agent",
    kind: "core",
    tier: "Tier B · Document & Compliance",
    purpose: "Reads, classifies and validates every document candidates and employees submit — the single most reused capability in the ecosystem.",
    responsibilities: "OCR and extract fields; check completeness, validity, expiry and name/number match for medical/birth/Hajj certificates, EID/passport/visa, IBAN & bank letters, expense receipts, school invoices and dependent documents; flag exceptions with reasons.",
    process: "Onboarding document verification; Leave doc validation; Bank Account Change; Education & Air-Ticket claims; Dependent Acknowledgement; Personal Info Update.",
    inputs: ["Uploaded documents", "Oracle reference data", "ICP data", "Per-document-type rules"],
    systems: ["Oracle", "MOCA App uploads", "ICP", "SharePoint"],
    outputs: ["Validation verdict (valid / invalid / needs-info)", "Extracted fields", "Exception report"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Medium — recommends; a human confirms",
    risks: "Medium — touches many money-and-status flows, but only ever recommends; a human approves the action.",
    nextAction: "Approve as the shared Phase 1 validation muscle. Gather a document sample corpus per type for tuning.",
    subAgents: [
      { name: "OCR & Field Extractor", desc: "Reads and extracts structured fields from any uploaded document.", complexity: "Medium", type: "Validation", deps: "Document corpus", status: "Ready" },
      { name: "Identity Cross-Check", desc: "Matches name/number against ICP and Oracle reference data.", complexity: "Medium", type: "Validation", deps: "ICP", status: "Ready" },
      { name: "Validity & Expiry Checker", desc: "Verifies completeness, validity and expiry against per-type rules.", complexity: "Medium", type: "Validation", deps: "Rule set", status: "Ready" },
      { name: "Exception Reporter", desc: "Flags failed checks with plain-language reasons for HR.", complexity: "Low", type: "Reporting", deps: "—", status: "Ready" }
    ]
  },
  {
    id: "hr-04",
    name: "Compliance & Document-Expiry Monitoring Agent",
    kind: "core",
    tier: "Tier B · Document & Compliance",
    purpose: "Keeps employee and dependent data current and surfaces compliance risk before it blocks a transaction or breaches an obligation.",
    responsibilities: "Monitor the ICP sync queue; track EID/passport/visa expiry; ingest the FAHR ILOE report; watch Dependent-Acknowledgement and Relative-Declaration validity; run supplier conflict-of-interest checks; proactively nudge employees to renew.",
    process: "HR-SS: ICP Data Verification; ILOE monitoring; Dependent Ack / Relative Declaration cycles; Supplier-Registration Attestation; claim-prerequisite readiness.",
    inputs: ["ICP API data", "Oracle records", "FAHR ILOE report", "Dependents list", "Ex-employee list"],
    systems: ["Oracle", "ICP", "FAHR (report ingest)", "SharePoint"],
    outputs: ["Expiry/risk alerts", "Renewal nudges", "ICP review-queue summary", "Supplier go/no-go draft"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High for monitoring · Low for ICP commits",
    risks: "Low — alerts and drafts; HR Operations commits. Depends on a stable ICP integration.",
    nextAction: "Approve for Phase 1. Agree expiry thresholds and nudge cadence with HR Operations.",
    subAgents: [
      { name: "Expiry Watcher", desc: "Tracks EID/passport/visa expiry and nudges before it blocks work.", complexity: "Low", type: "Monitoring", deps: "ICP, Oracle", status: "Ready" },
      { name: "ICP Sync Monitor", desc: "Pre-digests the ICP sync queue into a review-ready summary.", complexity: "Medium", type: "Monitoring", deps: "ICP API", status: "Ready" },
      { name: "Conflict-of-Interest Checker", desc: "Runs supplier checks against dependents, ex-employees and live data.", complexity: "Medium", type: "Validation", deps: "Multiple lists", status: "Needs Review" }
    ]
  },

  /* -- Tier C — Workflow Orchestration ------------------------------------- */
  {
    id: "hr-05",
    name: "Onboarding Orchestration Agent",
    kind: "core",
    tier: "Tier C · Workflow Orchestration",
    purpose: "Drives the end-to-end new-joiner journey across Talent, Onboarding, IT, Payroll, Nextcare and GPSSA so nothing stalls between handoffs.",
    responsibilities: "Coordinate the 16-step flow; chase candidate documents; assemble and pre-fill the Oracle profile for HR review; trigger and track security clearance; sequence IT account creation, insurance and pension enrollment and the first-day pack; watch the 18th-of-month payroll cut-off.",
    process: "All Onboarding sub-processes — Security Clearance, core Onboarding, First-Day Documents, ILOE, GPSSA.",
    inputs: ["Signed offer", "Assessment results", "Candidate documents", "Security result", "Onboarding policy rules"],
    systems: ["Oracle", "Email", "SharePoint", "IT/AD", "Nextcare", "GPSSA portal", "Security provider"],
    outputs: ["Live onboarding status tracker", "Pre-filled profile draft", "Stakeholder notifications", "Exception flags"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Strategic", autonomy: "Medium — orchestrates and drafts; humans approve the gates",
    risks: "Medium — real cross-system complexity, but the underlying Oracle workflows already exist; the agent coordinates rather than re-implements.",
    nextAction: "Refine cross-system integration scope (IT/AD, Nextcare, GPSSA) and confirm the single HR-Director approval gate before Phase 2 sign-off.",
    subAgents: [
      { name: "Document Chaser", desc: "Requests and chases candidate documents to a deadline.", complexity: "Medium", type: "Orchestration", deps: "Email", status: "In Progress" },
      { name: "Profile Pre-Filler", desc: "Assembles a pre-filled Oracle profile for one-click HR-Director approval.", complexity: "High", type: "Drafting", deps: "Oracle, Agent 3", status: "Needs Review" },
      { name: "Clearance Tracker", desc: "Triggers and follows up the security clearance until complete.", complexity: "Medium", type: "Orchestration", deps: "Security provider", status: "In Progress" },
      { name: "Payroll Cut-off Sentinel", desc: "Watches the 18th-of-month cut-off and flags first-salary risk.", complexity: "Medium", type: "Monitoring", deps: "Oracle", status: "In Progress" }
    ]
  },
  {
    id: "hr-06",
    name: "Offboarding & Clearance Orchestration Agent",
    kind: "core",
    tier: "Tier C · Workflow Orchestration",
    purpose: "Drives a clean, fast, leak-free exit and a complete archive.",
    responsibilities: "Sequence the offboarding notification; open and route Station Clearance (Line Manager first, then IT, Admin, Finance and HR in parallel); chase departments; escalate blockers as settlement recoveries; coordinate insurance cancellation, GPSSA exit, experience letter, decrees and the final EOS archive.",
    process: "EOS Offboarding Notification, Station Clearance, Post-Departure Cleanup; supports Final Settlement.",
    inputs: ["Approved resignation/termination", "Clearance form", "Asset list"],
    systems: ["Oracle", "Email", "SharePoint", "Nextcare", "GPSSA"],
    outputs: ["Clearance status tracker", "Blocker/recovery log", "Post-departure cleanup checklist"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Complex", autonomy: "Medium — orchestrates and chases; humans clear and approve",
    risks: "Medium — money-touching at the recovery boundary; sequence behind a mature governance layer.",
    nextAction: "Define the blocker-to-recovery rules with Finance, then schedule for Phase 3 behind the governance layer.",
    subAgents: [
      { name: "Clearance Router", desc: "Opens and routes parallel department clearance and chases each.", complexity: "High", type: "Orchestration", deps: "Multi-dept", status: "In Progress" },
      { name: "Blocker-to-Recovery Escalator", desc: "Turns unreturned assets and advances into settlement recoveries.", complexity: "High", type: "Orchestration", deps: "Finance", status: "Needs Review" },
      { name: "Cleanup & Archive Checklist", desc: "Tracks insurance, pension exit, letters and archive to completion.", complexity: "Medium", type: "Orchestration", deps: "Nextcare, GPSSA", status: "In Progress" }
    ]
  },

  /* -- Tier D — Drafting & Decisions --------------------------------------- */
  {
    id: "hr-07",
    name: "Decree & Decision Drafting Agent",
    kind: "core",
    tier: "Tier D · Drafting & Decisions",
    purpose: "Cuts the 1–3 day drafting burden on the decree-heavy HR-SS processes while keeping every legal decision in human hands.",
    responsibilities: "Draft Change-Pay, Termination, Administrative-Violation, Secondment/Acting/Delegation and Administrative/Ministerial decisions from the correct template with case data populated; assemble the routing package; on approval, file the PDF in Oracle Memo & Decrees and SharePoint.",
    process: "HR-SS Change Pay, Termination, Administrative Violations, Secondment/Acting/Delegation, Administrative & Ministerial Decisions.",
    inputs: ["Decree templates", "Case data", "Approval-authority matrix"],
    systems: ["Oracle (Memo & Decrees)", "SharePoint", "Email"],
    outputs: ["Decree draft", "Routing package", "Filed record"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Low–Medium — drafts only; mandatory human review and approval",
    risks: "High — legally sensitive. HR reviews every draft; Entity Head / Minister / HR Director approve and sign. The agent never approves.",
    nextAction: "Hold for Phase 3 behind a proven human-in-the-loop layer. Assemble the decree template library and authority matrix.",
    subAgents: [
      { name: "Decree Drafter", desc: "Populates the correct decree template from case data.", complexity: "High", type: "Drafting", deps: "Template library", status: "Needs Review" },
      { name: "Routing Package Builder", desc: "Assembles the routing package for the right authority.", complexity: "Medium", type: "Orchestration", deps: "Authority matrix", status: "Needs Review" },
      { name: "Decree Filer", desc: "Files the approved PDF in Oracle Memo & Decrees and SharePoint.", complexity: "Low", type: "Orchestration", deps: "Oracle, SharePoint", status: "In Progress" }
    ]
  },

  /* -- Tier E — Payroll & Entitlements ------------------------------------- */
  {
    id: "hr-08",
    name: "Payroll Validation & Reconciliation Agent",
    kind: "core",
    tier: "Tier E · Payroll & Entitlements",
    purpose: "Automates the heavy first-version payroll validation that today takes HR Payroll and Finance several hours each cycle.",
    responsibilities: "Run the full check-suite on the first payroll version — month-over-month variance, new-joiner pro-ration, terminated-employee exclusion, retro correctness, bank-account validity, time-bound allowance accuracy, pension variance — and produce a ranked exception report with suggested corrections.",
    process: "Monthly Payroll Run (validation); Monthly Payroll Adjustment; Separate Salary Payroll.",
    inputs: ["First-version payroll register", "Prior-month register", "Oracle changes log"],
    systems: ["Oracle", "SharePoint"],
    outputs: ["Exception-ranked validation report", "Suggested corrections"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Medium — analyses and recommends; humans correct and approve",
    risks: "High — operates on the live pay run. HR Payroll + Finance review, correct and approve; the agent never finalises pay.",
    nextAction: "Sequence last (Phase 3). Codify the validation check-suite and secure Finance alignment before build.",
    subAgents: [
      { name: "Variance Analyser", desc: "Computes month-over-month variance and flags anomalies.", complexity: "High", type: "Validation", deps: "Registers", status: "Needs Review" },
      { name: "Pro-ration & Retro Checker", desc: "Validates new-joiner pro-ration, exclusions and retro correctness.", complexity: "High", type: "Validation", deps: "Oracle log", status: "Needs Review" },
      { name: "Exception Ranker", desc: "Ranks exceptions and suggests corrections for joint review.", complexity: "Medium", type: "Reporting", deps: "—", status: "In Progress" }
    ]
  },
  {
    id: "hr-09",
    name: "Entitlements & Settlement Calculation Agent",
    kind: "core",
    tier: "Tier E · Payroll & Entitlements",
    purpose: "Independently verifies, explains and documents the complex allowance and end-of-service math.",
    responsibilities: "Re-compute per-diem, housing, car, education and air-ticket entitlements and EOS final settlements using documented formulas; reconcile against Oracle; produce a plain-language breakdown an employee or auditor can follow; flag recoveries and additional payments.",
    process: "PPP Per-Diem, One-off Housing/Car, Salary Recoveries; EOS Final Settlement and allowance recalculation.",
    inputs: ["Oracle calculation", "Grade, dates, rates", "Policy formulas"],
    systems: ["Oracle"],
    outputs: ["Verified calculation", "Breakdown statement", "Variance/recovery flags"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Medium — verifies and explains; humans approve",
    risks: "High — financially sensitive. Payroll confirms; HR and Finance Directors approve settlements.",
    nextAction: "Codify the entitlement and gratuity formulas as a verified rule set. Hold for Phase 3.",
    subAgents: [
      { name: "Entitlement Recalculator", desc: "Re-derives per-diem, housing, car, education and air-ticket math.", complexity: "High", type: "Validation", deps: "Policy formulas", status: "Needs Review" },
      { name: "Settlement Verifier", desc: "Re-computes EOS final settlement and reconciles against Oracle.", complexity: "High", type: "Validation", deps: "Oracle", status: "Needs Review" },
      { name: "Plain-Language Explainer", desc: "Produces an audit-followable breakdown statement.", complexity: "Medium", type: "Drafting", deps: "—", status: "In Progress" }
    ]
  },
  {
    id: "hr-10",
    name: "Off-Cycle Payment Coordination Agent",
    kind: "core",
    tier: "Tier E · Payroll & Entitlements",
    purpose: "Runs the connective tissue of the weekly off-cycle payment backbone so claims flow cleanly to the batch.",
    responsibilities: "Maintain the Notification Excel audit log; group approved payments by entity; check 17th-cut-off eligibility; reconcile the Oracle queue against the log; prepare the batch dataset; confirm SMS and payslip issuance; flag any mismatch before the run.",
    process: "PPP Common Backbone; coordination of Air-Ticket, Education, Encashment, Bonus, Overtime, Per-Diem, Expense and One-off payments.",
    inputs: ["Oracle off-cycle queue", "Approved payments", "Cut-off rule"],
    systems: ["Oracle", "SharePoint / Excel"],
    outputs: ["Reconciled batch dataset", "Audit-log entries", "Exception flags"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Medium — prepares and reconciles; humans execute payment",
    risks: "Medium — prepares the batch only; Payroll runs the batch and the bank file. Releasing funds is always a human action.",
    nextAction: "Schedule for Phase 2. Replace the hand-kept Notification Excel with a reconciled, audit-logged dataset.",
    subAgents: [
      { name: "Notification Log Keeper", desc: "Maintains the off-cycle audit log automatically.", complexity: "Low", type: "Orchestration", deps: "Excel/SharePoint", status: "In Progress" },
      { name: "Cut-off Eligibility Checker", desc: "Checks 17th-cut-off eligibility and groups by entity.", complexity: "Medium", type: "Validation", deps: "Oracle queue", status: "In Progress" },
      { name: "Batch Reconciler", desc: "Reconciles the Oracle queue against the log and flags mismatches.", complexity: "Medium", type: "Validation", deps: "Oracle", status: "Ready" }
    ]
  },

  /* -- Tier F — Insight & Oversight ---------------------------------------- */
  {
    id: "hr-11",
    name: "HR Analytics & Reporting Agent",
    kind: "core",
    tier: "Tier F · Insight & Oversight",
    purpose: "Turns the Oracle and SharePoint data already being produced into on-demand insight and recurring dashboards in natural language.",
    responsibilities: "Produce headcount, attendance, leave-balance and leave-liability, payroll variance, turnover, probation and EOS-pipeline, and allowance-spend views; answer ad-hoc questions in plain language; run scheduled reports; flag anomalies.",
    process: "Cross-cutting — Probation dashboard, attendance, payroll variance, EOS pipeline, encashment liability.",
    inputs: ["Oracle data", "Attendance data", "Payroll registers", "SharePoint archives"],
    systems: ["Oracle (read)", "SharePoint (read)", "BI layer"],
    outputs: ["Dashboards", "Reports", "Natural-language answers", "Anomaly flags"],
    complexity: "Low", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High — read-only and reporting",
    risks: "Low — read-only. Proves the programme's value early and cheaply.",
    nextAction: "Approve for Phase 1. Agree the core metrics and recurring reports leadership wants.",
    subAgents: [
      { name: "Dashboard Builder", desc: "Produces headcount, attendance, leave-liability and pipeline views.", complexity: "Low", type: "Reporting", deps: "BI layer", status: "Ready" },
      { name: "Natural-Language Query", desc: "Answers ad-hoc questions in plain language from live data.", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "Ready" },
      { name: "Anomaly Flagger", desc: "Detects and surfaces anomalies in the data.", complexity: "Medium", type: "Monitoring", deps: "—", status: "In Progress" }
    ]
  },
  {
    id: "hr-12",
    name: "Approvals & Follow-up Agent",
    kind: "core",
    tier: "Tier F · Insight & Oversight",
    purpose: "Makes the approval layer — the single biggest source of elapsed time across every process — transparent and fast, without ever making the decision.",
    responsibilities: "Detect when an approval is due and push a decision-ready notification to the approver on MOCA Smart or email with a summary, validated documents and a recommendation; answer follow-up questions in-thread; capture the decision and write it back to Oracle; track all pending approvals; nudge on SLA breach; surface bottlenecks.",
    process: "Every approval-bearing step across all seven domains (leave matrix chains, Change Pay, Termination, EOS, Expense, OT, Per-Diem, Recoveries, Clearance).",
    inputs: ["Oracle approval queues", "Leave Approval Matrix", "SLA targets"],
    systems: ["Oracle", "MOCA App", "Email"],
    outputs: ["Decision-ready notifications", "Answered approver questions", "Captured decisions", "SLA & bottleneck reports"],
    complexity: "Low", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High for follow-up; never approves",
    risks: "Low — routes, briefs and nudges; the approver always decides.",
    nextAction: "Approve for Phase 1. Define SLA targets and read access to the approval queues.",
    subAgents: [
      { name: "Decision-Ready Notifier", desc: "Pushes a briefed approval to the approver where they are.", complexity: "Low", type: "Orchestration", deps: "MOCA, Email", status: "Ready" },
      { name: "In-Thread Q&A", desc: "Answers approver follow-up questions from the data.", complexity: "Medium", type: "Conversational", deps: "Oracle", status: "Ready" },
      { name: "SLA & Bottleneck Tracker", desc: "Tracks pending approvals, nudges on breach and surfaces ageing items.", complexity: "Low", type: "Monitoring", deps: "SLA targets", status: "Ready" }
    ]
  },

  /* -- Tier G — Leave & Attendance ----------------------------------------- */
  {
    id: "hr-13",
    name: "Leave & Attendance Assistant",
    kind: "core",
    tier: "Tier G · Leave & Attendance",
    purpose: "One capable agent for leave end to end — guiding the request, resolving the right approval chain, and handling the remote-work and document-heavy types — for both employees and HR.",
    responsibilities: "Guide selection across the ~20 leave types and run balance, eligibility and prerequisite checks; resolve and explain the exact approval chain from the matrix, including up-to-six-level entity-specific chains, FYI recipients and special rules; handle the Remote-Work variants and the document-heavy types (Maternity, Sick, Hajj, Escort, Examination, Scholarship, Sabbatical) by validating required documents with Document Intelligence and routing each correctly; assist HR with leave-on-behalf.",
    process: "All ESS/HR-SS leave types (Employee + OTS matrices), Permission, Remote Work and special/document-heavy leave.",
    inputs: ["Leave Approval Matrix (multi-level, entity overrides, FYI, special rules)", "Oracle balances", "Per-type document and eligibility rules"],
    systems: ["Oracle", "MOCA App", "SharePoint"],
    outputs: ["Guided, eligibility-checked request", "Full chain resolved", "Documents validated and routed"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Medium — guides, resolves the chain, validates and routes; humans approve",
    risks: "Low — the named matrix approvers decide; HR validates documents.",
    nextAction: "Digitise the full Leave Approval Matrix (multi-level, entity overrides, FYI, special rules) as a machine-readable rule set, then progress to Phase 2 build.",
    subAgents: [
      { name: "Leave-Type Selector", desc: "Guides selection across ~20 types and checks balance and eligibility.", complexity: "Medium", type: "Conversational", deps: "Oracle balances", status: "In Progress" },
      { name: "Approval-Chain Resolver", desc: "Resolves and explains the exact multi-level chain, FYI and special rules.", complexity: "High", type: "Orchestration", deps: "Leave Matrix", status: "In Progress" },
      { name: "Remote-Work & Special-Leave Handler", desc: "Handles remote-work variants and document-heavy leave with validation.", complexity: "Medium", type: "Validation", deps: "Agent 3", status: "In Progress" },
      { name: "Leave-on-Behalf Drafter", desc: "Assists HR with leave-on-behalf entries.", complexity: "Low", type: "Drafting", deps: "Oracle", status: "Ready" }
    ]
  },
  {
    id: "hr-14",
    name: "Attendance, Justification & Violations Agent",
    kind: "core",
    tier: "Tier G · Leave & Attendance",
    purpose: "Runs the attendance-justification and violations cycle that today consumes HR Operations, from first notice to year-end resolution.",
    responsibilities: "Open the attendance-violations sheet (year-to-date, employees and outsourced); email each employee their violations with a justify-in-Oracle call to action; send weekly reminders to those still unjustified; identify repeat or old unresolved cases and escalate to the HR Director; at year-end, feed the leave carry-over, run the offset against balance / free days, and surface no-balance cases for the HR-Director decision; coordinate outsourced cases through the agencies.",
    process: "ESS Attendance Justification; HR-SS Attendance Violations Management and Outsource (via Agency).",
    inputs: ["Auto-exported attendance / violations data", "Leave balances and free days", "Agency map"],
    systems: ["Oracle", "MOCA App", "Email"],
    outputs: ["Justification drives", "Weekly reminders", "Escalation packs", "Year-end offsets", "Agency coordination"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "High for notifying, reminding and offsetting; the HR Director decides penalties",
    risks: "Low — opens, notifies, reminds, offsets and escalates; the HR Director decides escalations and penalties.",
    nextAction: "Confirm the auto-export of violations data and the agency map, then schedule for Phase 2.",
    subAgents: [
      { name: "Violations Sheet Opener", desc: "Opens the year-to-date violations sheet for employees and outsourced staff.", complexity: "Medium", type: "Orchestration", deps: "Oracle", status: "In Progress" },
      { name: "Justification Notifier", desc: "Emails violations with a justify-in-Oracle CTA and weekly reminders.", complexity: "Low", type: "Conversational", deps: "Email", status: "In Progress" },
      { name: "Repeat-Case Escalator", desc: "Identifies repeat / old unresolved cases and escalates to the HR Director.", complexity: "Medium", type: "Monitoring", deps: "—", status: "Needs Review" },
      { name: "Year-End Offset Runner", desc: "Feeds carry-over, offsets against balance/free days, surfaces no-balance cases.", complexity: "Medium", type: "Validation", deps: "Oracle", status: "In Progress" }
    ]
  },

  /* -- Tier H — Performance Management -------------------------------------- */
  {
    id: "hr-15",
    name: "Performance Cycle & Review Agent",
    kind: "core",
    tier: "Tier H · Performance Management",
    purpose: "Runs the whole performance cycle — setup, initiation, the mid-year and annual rounds, and consolidation — so reviews happen on time and produce a clean, calibration-ready picture.",
    responsibilities: "Build the cycle population with eligibility rules (exclude probationers; apply permanency cut-offs); run test and official initiation with system emails and announcements; produce completion reports and chase pending employees and managers; drive the mid-year self-update and the annual self-rating and manager scoring with return loops; route Sector-Head and HR confirmation; consolidate ratings and flag outliers for calibration; support the Executive-Director review sessions and retain their reports.",
    process: "Performance Management — cycle setup, initiation, monitoring, Mid-Year, Annual, Executive Director Reviews, consolidation and calibration.",
    inputs: ["Performance calendar", "Population/permanency data", "Objectives and ratings", "Review templates"],
    systems: ["Oracle", "Performance system", "MOCA App", "Email"],
    outputs: ["On-time cycles", "Live completion dashboards", "Consolidated ratings", "Calibration flags", "Retained ED reports"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Needs Review", priority: "Strategic", autonomy: "High for running and consolidating; no rating or calibration decision",
    risks: "Low — runs the cycle and consolidates; managers and reviewers score, HR and leadership calibrate and confirm. The agent never rates.",
    nextAction: "Confirm the performance calendar and eligibility/permanency rules with HR, then schedule for Phase 2.",
    subAgents: [
      { name: "Cycle Population Builder", desc: "Builds the cycle population applying eligibility and permanency rules.", complexity: "Medium", type: "Validation", deps: "Oracle", status: "Needs Review" },
      { name: "Round Driver & Chaser", desc: "Runs mid-year and annual rounds with return loops and chases pending.", complexity: "Medium", type: "Orchestration", deps: "Performance system", status: "In Progress" },
      { name: "Rating Consolidator", desc: "Consolidates ratings and flags outliers for calibration.", complexity: "Medium", type: "Reporting", deps: "—", status: "Needs Review" }
    ]
  },
  {
    id: "hr-16",
    name: "Objective-Setting & SMART-Quality Agent",
    kind: "core",
    tier: "Tier H · Performance Management",
    purpose: "Helps every employee set good objectives and gets them approved cleanly — turning a slow, quality-variable step into a fast, guided one.",
    responsibilities: "Guide employees to enter objectives within the rules (minimum 4, maximum 10; total weight 100%; each 5%–30%) and the required competencies (core for all; leadership competencies for Grade 4.1+ and acting heads); run an on-the-spot SMART-framework and job-relevance quality check and suggest improvements; manage the return-for-adjustment loop; route Line-Manager → Sector-Head → HR confirmation and lock.",
    process: "Performance Management — Objective Setting (and the late-joiner goal-setting that occurs at annual review).",
    inputs: ["Objective and competency rules", "Grade data", "Employee's role profile"],
    systems: ["Oracle", "Performance system", "MOCA App"],
    outputs: ["Well-formed, rule-compliant objectives", "Quality feedback", "Clean approval-to-lock flow"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "High for guidance, quality-check and routing; humans approve",
    risks: "Low — guides, quality-checks and routes; Line Manager, Sector Head and HR approve.",
    nextAction: "Codify the objective and competency rules; build alongside the Performance Cycle agent in Phase 2.",
    subAgents: [
      { name: "Objective Rule Guide", desc: "Guides entry within rules (4–10 objectives, weights 100%, 5–30%) and competencies.", complexity: "Medium", type: "Conversational", deps: "Performance system", status: "In Progress" },
      { name: "SMART Quality Checker", desc: "Runs an on-the-spot SMART and job-relevance check and suggests improvements.", complexity: "Medium", type: "Validation", deps: "—", status: "In Progress" },
      { name: "Approval Router", desc: "Routes Line-Manager → Sector-Head → HR confirmation and lock.", complexity: "Low", type: "Orchestration", deps: "Oracle", status: "Ready" }
    ]
  },

  /* -- Tier I — Contract & Mobility ---------------------------------------- */
  {
    id: "hr-17",
    name: "Contract Renewal Agent",
    kind: "core",
    tier: "Tier I · Contract & Mobility",
    purpose: "Makes sure no contract lapses unnoticed and each renewal or non-renewal — permanent or outsourced — is handled correctly and on time.",
    responsibilities: "For permanent staff, extract the year-end expiring list by entity, share each Sector Head's sheet with the 2-year performance, track confirmations, and handle renewal/non-renewal (with the 3-month notice and the auto-extend-if-unconfirmed rule); for outsourced staff, act on the automatic 90/60-day notifications, coordinate with each entity's responsible person and the agency, and on non-renewal instruct the agency to notify the employee one month before expiry.",
    process: "HR-SS Contract Renewal — Permanent and Outsource.",
    inputs: ["Contract end-dates", "2-year performance", "Entity/Sector-Head and entity/agency maps", "Notice and auto-extend rules"],
    systems: ["Oracle", "Email", "SharePoint"],
    outputs: ["Sorted expiry sheets", "Routed confirmations", "Timely renewals and notices", "Agency coordination", "Safety-net auto-extension"],
    complexity: "Low", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Medium — extracts, routes and tracks; humans decide and notify",
    risks: "Low — extracts, routes, tracks and applies timing rules; Sector Heads decide and HR holds the sensitive conversations.",
    nextAction: "Confirm the notice and auto-extend rules and the entity/agency maps, then schedule for Phase 2.",
    subAgents: [
      { name: "Expiry List Extractor", desc: "Extracts the year-end expiring list by entity (permanent + outsourced).", complexity: "Low", type: "Reporting", deps: "Oracle", status: "In Progress" },
      { name: "Sector-Head Router", desc: "Shares each Sector Head's sheet with 2-year performance and tracks confirmations.", complexity: "Low", type: "Orchestration", deps: "Email", status: "In Progress" },
      { name: "Notice & Auto-Extend Timer", desc: "Applies 3-month notice, 90/60-day OTS notifications and the auto-extend rule.", complexity: "Medium", type: "Monitoring", deps: "—", status: "Needs Review" }
    ]
  },
  {
    id: "hr-18",
    name: "Staff Mobility & Assignments Agent",
    kind: "core",
    tier: "Tier I · Contract & Mobility",
    purpose: "Prepares and orchestrates the internal and cross-entity assignment changes — acting, secondment, delegation, loaning and borrowing — so each is budgeted, decreed, approved and time-bound correctly.",
    responsibilities: "For paid acting, prepare the budget study for Sector-Head confirmation then draft the Entity-Head decree; for non-paid acting, secondment and delegation, draft from standard templates; for loaning, confirm salary/benefit coverage and obtain Sector-Head approval and the Entity-Head decree; for borrowing, send the official letter to the source entity, capture its confirming decree and prepare the requester's; apply and track period/extension rules (acting up to 1 year + 6 months), store decrees in Oracle Memo & Decrees, and reverse arrangements cleanly on completion.",
    process: "HR-SS Acting (Paid & Non-Paid), Secondment, Delegation, Loaning, Borrowing.",
    inputs: ["The request", "Budget data", "Salary-coverage terms", "Decree templates", "Period/extension rules", "Approval matrix"],
    systems: ["Oracle (Memo & Decrees)", "Email", "SharePoint"],
    outputs: ["Budget studies", "Drafted decrees", "Official letters", "Routed approvals", "Period tracking and clean closure"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Medium — studies, drafts and orchestrates; humans decide and sign",
    risks: "Medium — decree- and budget-bearing. Sector Heads and Entity Heads approve and sign; entities confirm.",
    nextAction: "Assemble the assignment decree templates and period/extension rules, then schedule for Phase 2.",
    subAgents: [
      { name: "Budget-Study & Decree Drafter", desc: "Prepares the budget study and drafts acting/secondment/delegation decrees.", complexity: "Medium", type: "Drafting", deps: "Templates", status: "In Progress" },
      { name: "Loan/Borrow Coordinator", desc: "Confirms salary coverage and exchanges official letters and decrees across entities.", complexity: "Medium", type: "Orchestration", deps: "Email", status: "In Progress" },
      { name: "Period & Reversal Tracker", desc: "Tracks acting/extension limits and reverses arrangements cleanly on completion.", complexity: "Medium", type: "Monitoring", deps: "Oracle", status: "In Progress" }
    ]
  },

  /* -- Recommended value-add agents (Enhance phase) ------------------------ */
  {
    id: "hr-va-a",
    name: "Onboarding Concierge",
    kind: "value-add",
    tier: "Value-add · New-Joiner Experience",
    purpose: "A personal companion for every new hire from offer acceptance through the first 90 days, so joining feels guided and human rather than bureaucratic.",
    responsibilities: "Welcome the joiner and answer questions in plain language; walk them through first-day logistics, systems and benefits; introduce key people and resources; check in proactively at day 1, week 1 and days 30/60/90; surface anything outstanding.",
    process: "Wraps the Onboarding domain and probation period (complements the Onboarding Orchestration Agent).",
    inputs: ["Onboarding status", "Joiner profile", "Policy & FAQ KB", "First-day pack"],
    systems: ["MOCA App", "Email", "Oracle (read)", "SharePoint"],
    outputs: ["Guided onboarding journey", "Proactive check-ins", "A smoother first 90 days"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "High for guidance; no record changes",
    risks: "Low — companions and informs; makes no record changes.",
    nextAction: "Layer on in the Enhance phase once the Onboarding Orchestration Agent is live.",
    subAgents: [
      { name: "Welcome & Q&A", desc: "Welcomes the joiner and answers questions in plain language.", complexity: "Low", type: "Conversational", deps: "Policy KB", status: "In Progress" },
      { name: "Milestone Check-in", desc: "Proactively checks in at day 1, week 1 and days 30/60/90.", complexity: "Medium", type: "Monitoring", deps: "Onboarding status", status: "In Progress" }
    ]
  },
  {
    id: "hr-va-b",
    name: "Wellbeing & Leave-Balance Nudge",
    kind: "value-add",
    tier: "Value-add · Wellbeing",
    purpose: "Looks after work-life balance by spotting patterns that suggest someone needs a break, nudging gently before they become a problem.",
    responsibilities: "Watch for high accrued-but-unused leave, long stretches without leave, sustained overtime and upcoming entitlement expiry; nudge the employee — and where appropriate the manager — to plan leave; promote balanced workloads.",
    process: "Cross-cuts Leave, Attendance and Payroll (overtime) data.",
    inputs: ["Leave balances and history", "Attendance and overtime data", "Entitlement-expiry rules"],
    systems: ["Oracle (read)", "MOCA App"],
    outputs: ["Timely supportive nudges", "More balanced leave usage", "Reduced leave liability"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "High for monitoring and nudging; no decisions",
    risks: "Low — surfaces and suggests; managers and HR own any sensitive follow-up.",
    nextAction: "Enhance phase. Confirm nudge tone and escalation routing with HR.",
    subAgents: [
      { name: "Pattern Watcher", desc: "Spots unused leave, long stretches without leave and sustained overtime.", complexity: "Low", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" },
      { name: "Gentle Nudger", desc: "Sends supportive, well-timed nudges to employee and manager.", complexity: "Low", type: "Conversational", deps: "MOCA App", status: "In Progress" }
    ]
  },
  {
    id: "hr-va-c",
    name: "Knowledge-Capture & Policy-Simplifier",
    kind: "value-add",
    tier: "Value-add · Knowledge",
    purpose: "Keeps institutional HR knowledge current and makes policy easy to understand, so the rest of the ecosystem stays accurate and self-improving.",
    responsibilities: "Capture answers HR gives to edge-case questions and fold them into the knowledge base; flag policy gaps, ambiguities and contradictions; rewrite dense policy into clear bilingual plain language; keep the Virtual Assistant's source of truth fresh.",
    process: "Cross-cutting — feeds the Virtual Assistant and every guidance surface.",
    inputs: ["HR responses", "Policy / knowledge base", "Employee questions"],
    systems: ["SharePoint", "Knowledge base", "MOCA App", "Email"],
    outputs: ["Improving knowledge base", "Plain-language policy explanations", "Gap/contradiction log"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Future Phase", autonomy: "Medium — proposes; HR approves",
    risks: "Low — proposes entries and clarifications; HR approves new knowledge-base entries.",
    nextAction: "Strong early Enhance candidate — keeps the Virtual Assistant accurate. Scope alongside Phase 1.",
    subAgents: [
      { name: "Knowledge Capturer", desc: "Folds new HR answers back into the knowledge base.", complexity: "Medium", type: "Drafting", deps: "Knowledge base", status: "Needs Review" },
      { name: "Policy Simplifier", desc: "Rewrites dense policy into clear bilingual plain language.", complexity: "Medium", type: "Drafting", deps: "Policy KB", status: "In Progress" },
      { name: "Gap & Contradiction Flagger", desc: "Flags policy gaps, ambiguities and contradictions for HR.", complexity: "Medium", type: "Monitoring", deps: "—", status: "Needs Review" }
    ]
  },
  {
    id: "hr-va-d",
    name: "Manager Companion",
    kind: "value-add",
    tier: "Value-add · Manager Support",
    purpose: "A companion for line managers so they can handle people responsibilities quickly and well, without leaning on HR for every step.",
    responsibilities: "Show each manager their pending approvals and what each is about; flag team leave-coverage conflicts; remind them of probation reviews due; explain how to do a given HR task; recommend the next best action; answer HR questions.",
    process: "Cross-cutting — sits over Approvals, Leave, Probation and manager-facing HR-SS actions.",
    inputs: ["Oracle team data", "Approval queues", "Probation milestones", "Leave Matrix", "Policy KB"],
    systems: ["Oracle (read)", "MOCA App", "Email"],
    outputs: ["A clear manager view", "Timely reminders", "Next-best-action prompts", "Answered questions"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "High for guidance; managers make all decisions",
    risks: "Low — guides and prepares; managers decide and approve.",
    nextAction: "Strong early Enhance candidate — fund early to lift manager self-sufficiency.",
    subAgents: [
      { name: "Manager Dashboard", desc: "Shows pending approvals, coverage conflicts and probation reminders.", complexity: "Medium", type: "Reporting", deps: "Oracle (read)", status: "In Progress" },
      { name: "Next-Best-Action Coach", desc: "Explains how to do a task and recommends the next action.", complexity: "Medium", type: "Conversational", deps: "Policy KB", status: "In Progress" }
    ]
  },
  {
    id: "hr-va-e",
    name: "Leadership Briefing & Decision-Support",
    kind: "value-add",
    tier: "Value-add · Leadership",
    purpose: "An executive's window into the workforce — proactive briefings, strategic insight and clean decisions — so leaders spend time deciding, not digging for data.",
    responsibilities: "Deliver a proactive (weekly and on-demand) leadership briefing covering workforce health, headcount and cost, attrition and leave-liability trends, the probation and EOS pipeline, compliance posture, and decisions awaiting them; answer strategic questions; run what-if/scenario views; present the leadership decision queue.",
    process: "Cross-cutting — a strategic layer over Analytics, Approvals, Compliance and the whole landscape.",
    inputs: ["Oracle data", "Payroll registers", "Analytics layer", "Approval queues", "Agent-performance metrics"],
    systems: ["Oracle (read)", "BI / analytics layer", "MOCA App", "Email"],
    outputs: ["Proactive executive briefings", "Strategic dashboards", "Scenario views", "Leadership decision queue"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Needs Review", priority: "Future Phase", autonomy: "High for insight and briefing; leaders make all decisions",
    risks: "Low — briefs, models and surfaces; never makes a strategic or people decision.",
    nextAction: "Strong early Enhance candidate — directly serves H.E. and senior leadership. Confirm the briefing scope and cadence.",
    subAgents: [
      { name: "Executive Briefer", desc: "Delivers proactive weekly and on-demand leadership briefings.", complexity: "Medium", type: "Reporting", deps: "Analytics layer", status: "Needs Review" },
      { name: "Scenario Modeller", desc: "Runs simple what-if / scenario views for policy decisions.", complexity: "High", type: "Reporting", deps: "Oracle data", status: "In Progress" },
      { name: "Decision Queue Presenter", desc: "Presents the leadership decision queue with a clear summary.", complexity: "Medium", type: "Orchestration", deps: "Approval queues", status: "Needs Review" }
    ]
  },
  {
    id: "hr-va-f",
    name: "Audit-Readiness & Remediation",
    kind: "value-add",
    tier: "Value-add · Audit Readiness",
    purpose: "Gets HR audit-ready ahead of the audit team — fixing the clear issues and flagging the rest before the audit team checks.",
    responsibilities: "Continuously check data, transactions, approvals and documents against the audit checklist; identify findings the audit team would raise; auto-correct clear, rule-deterministic issues within scope and write the fix back; package judgmental items as a prioritised remediation list; produce a pre-audit readiness report and track every issue to closure.",
    process: "Cross-cutting — readiness across all seven domains, ahead of each audit cycle.",
    inputs: ["Audit criteria / checklist", "Oracle records", "Transaction and approval logs", "Document archive", "Compliance rules"],
    systems: ["Oracle (read + scoped write to fix)", "SharePoint", "ICP (validate)"],
    outputs: ["Pre-audit readiness report", "Auto-corrected clean-up", "Prioritised remediation list", "Issue-to-closure tracking"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Needs Review", priority: "Future Phase", autonomy: "Acts on clear rule-deterministic fixes (logged, reversible); stages judgmental items",
    risks: "Medium — holds scoped write access. Every fix is logged and reversible; the audit team is never overridden.",
    nextAction: "Bring forward in the Enhance phase so the organisation stays audit-ready as the core agents go live.",
    subAgents: [
      { name: "Checklist Checker", desc: "Continuously checks records against the audit criteria.", complexity: "Medium", type: "Validation", deps: "Audit checklist", status: "Needs Review" },
      { name: "Clear-Case Remediator", desc: "Auto-corrects clear, rule-deterministic issues within scope.", complexity: "High", type: "Orchestration", deps: "Scoped write", status: "Needs Review" },
      { name: "Readiness Reporter", desc: "Produces the pre-audit readiness report and tracks issues to closure.", complexity: "Medium", type: "Reporting", deps: "—", status: "In Progress" }
    ]
  },
  {
    id: "hr-va-g",
    name: "Policy, Decree & Memo Author",
    kind: "value-add",
    tier: "Value-add · Policy / Legal",
    purpose: "A drafting partner for the documents HR authors at the organisational level — policies, memos and decrees — cross-checked against org rules, precedent and external regulations.",
    responsibilities: "Draft and update HR policies, circulars, memos and standard decrees from intent and precedent; cross-check each draft three ways — against existing policies, past decrees/memos, and applicable external regulations — flagging gaps, conflicts and outdated clauses; suggest compliant wording; keep an alignment log.",
    process: "Organisational policy and memo authoring; complements the case-level Decree & Decision Drafting Agent.",
    inputs: ["Drafting intent", "Existing policies", "Archive of past decrees and memos", "Template library", "External regulations"],
    systems: ["SharePoint", "Knowledge base", "Email", "MOCA App", "External regulation sources"],
    outputs: ["Policy / memo / decree drafts", "Three-way alignment & gap report", "Suggested wording", "Alignment log"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Medium — drafts and checks; humans review and issue",
    risks: "Medium — cross-checking against precedent and external law is genuinely harder. HR, Legal and leadership review, decide and issue.",
    nextAction: "Enhance phase. Assemble the policy archive and external-regulation sources for the three-way cross-check.",
    subAgents: [
      { name: "Policy Drafter", desc: "Drafts and updates policies, memos and standard decrees.", complexity: "High", type: "Drafting", deps: "Template library", status: "In Progress" },
      { name: "Three-Way Aligner", desc: "Cross-checks drafts against org policy, precedent and external law.", complexity: "High", type: "Validation", deps: "Regulation sources", status: "Needs Review" }
    ]
  },
  {
    id: "hr-va-h",
    name: "Bilingual Call-Centre (Voice)",
    kind: "value-add",
    tier: "Value-add · Employee Support",
    purpose: "Answers the HR hotline in fluent Arabic and English, handling calls end to end and following up afterwards — so no one waits in a queue.",
    responsibilities: "Answer inbound calls in Arabic or English, detecting and switching language seamlessly; understand the request by voice; answer policy, entitlement, status and how-to questions; guide self-service; log every call; place outbound follow-up calls and callbacks; escalate sensitive cases to a human with a full summary.",
    process: "Employee Relations (phone / hotline); the voice front-end to the ESS guidance layer — complements the HR Virtual Assistant.",
    inputs: ["Policy & FAQ knowledge base", "Caller's scoped Oracle context", "Leave & allowance rules", "Call-routing rules"],
    systems: ["Telephony / hotline system", "Oracle (read)", "MOCA App", "Email", "Bilingual speech (AR & EN)"],
    outputs: ["Answered and logged calls", "Completed follow-ups and callbacks", "Structured escalation summaries", "Call analytics"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "High for answering and follow-up; record changes stay human-gated",
    risks: "Medium — bilingual voice is harder to build. Humans own complaints, grievances and sensitive cases.",
    nextAction: "Enhance phase for the hotline. Build on the Virtual Assistant's knowledge base; add bilingual speech.",
    subAgents: [
      { name: "Bilingual Voice Handler", desc: "Answers calls in AR/EN, detecting and switching language.", complexity: "High", type: "Conversational", deps: "Speech, Policy KB", status: "In Progress" },
      { name: "Outbound Follow-up Caller", desc: "Places reminder and status callbacks; logs every call.", complexity: "Medium", type: "Orchestration", deps: "Telephony", status: "In Progress" },
      { name: "Voice Escalation Router", desc: "Escalates sensitive cases to a human with a full summary.", complexity: "Medium", type: "Orchestration", deps: "—", status: "Needs Review" }
    ]
  }
];

/* -- HR agent-to-agent collaboration ("speaks to") ------------------------ */
const HR_TALKS = {
  "hr-01": ["hr-12", "hr-13", "hr-02"],        // Virtual Assistant -> Approvals, Leave, Letters
  "hr-02": ["hr-03"],                            // Letters -> Document Intelligence
  "hr-05": ["hr-03", "hr-04", "hr-12"],         // Onboarding -> Doc Intel, Compliance, Approvals
  "hr-06": ["hr-09", "hr-03", "hr-12"],         // Offboarding -> Settlement, Doc Intel, Approvals
  "hr-07": ["hr-12"],                            // Decree Drafting -> Approvals
  "hr-08": ["hr-10", "hr-12"],                  // Payroll Validation -> Off-cycle, Approvals
  "hr-09": ["hr-08", "hr-12"],                  // Settlement -> Payroll, Approvals
  "hr-10": ["hr-12"],                            // Off-cycle -> Approvals
  "hr-13": ["hr-03", "hr-12"],                  // Leave -> Doc Intel, Approvals
  "hr-14": ["hr-12"],                            // Attendance/Violations -> Approvals
  "hr-15": ["hr-16", "hr-12"],                  // Performance Cycle -> Objectives, Approvals
  "hr-16": ["hr-15"],                            // Objectives -> Performance Cycle
  "hr-17": ["hr-15", "hr-12"],                  // Contract Renewal -> Performance, Approvals
  "hr-18": ["hr-07", "hr-12"],                  // Staff Mobility -> Decree Drafting, Approvals
  "hr-va-a": ["hr-05"],                          // Onboarding Concierge -> Onboarding
  "hr-va-c": ["hr-01"],                          // Knowledge-Capture -> Virtual Assistant
  "hr-va-d": ["hr-12", "hr-13"],               // Manager Companion -> Approvals, Leave
  "hr-va-e": ["hr-11", "hr-12", "hr-04"],      // Leadership Briefing -> Analytics, Approvals, Compliance
  "hr-va-f": ["hr-04"],                          // Audit-Readiness -> Compliance
  "hr-va-g": ["hr-07"],                          // Policy/Decree Author -> Decree Drafting
  "hr-va-h": ["hr-01"]                           // Call-Centre -> Virtual Assistant
};
HR_AGENTS.forEach((a) => { if (HR_TALKS[a.id]) a.talksTo = HR_TALKS[a.id]; });

/* -- Other departments: realistic mock data ------------------------------- */
const PROCUREMENT_AGENTS = [
  {
    id: "pr-01", name: "Procurement Request Orchestrator", kind: "core", tier: "Source-to-Contract",
    purpose: "Coordinates purchase requests from intake to approved purchase order across requesting departments, budget owners and vendors.",
    responsibilities: "Capture and validate purchase requests; check budget availability; route through the approval chain; convert approved requests into purchase orders; chase pending steps.",
    process: "Purchase Request, Budget Check, PR-to-PO conversion.",
    inputs: ["Purchase request", "Budget data", "Catalogue", "Approval matrix"],
    systems: ["ERP", "Budget system", "Email"],
    outputs: ["Validated PR", "Routed approvals", "Purchase order"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Strategic", autonomy: "Medium — orchestrates and drafts; humans approve",
    risks: "Medium — touches budget commitments; approvals stay human.",
    nextAction: "Confirm budget-system integration and approval matrix before build.",
    subAgents: [
      { name: "Budget Checker", desc: "Verifies budget availability before routing.", complexity: "Medium", type: "Validation", deps: "Budget system", status: "Needs Review" },
      { name: "PR-to-PO Converter", desc: "Converts approved requests into purchase orders.", complexity: "Medium", type: "Orchestration", deps: "ERP", status: "In Progress" },
      { name: "Approval Chaser", desc: "Chases pending approvals through the chain.", complexity: "Low", type: "Monitoring", deps: "Email", status: "Ready" }
    ]
  },
  {
    id: "pr-02", name: "Vendor Onboarding & Compliance Agent", kind: "core", tier: "Vendor Management",
    purpose: "Validates and onboards new vendors and keeps registration, licences and compliance current.",
    responsibilities: "Verify trade licence, VAT and bank details; run sanctions and conflict checks; track licence expiry; maintain the vendor master.",
    process: "Vendor Registration, Compliance Re-check.",
    inputs: ["Vendor documents", "Sanctions lists", "Trade-licence registry"],
    systems: ["ERP", "Vendor portal", "External registries"],
    outputs: ["Verified vendor record", "Compliance verdict", "Expiry alerts"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Medium — verifies; a human approves onboarding",
    risks: "Low — recommends; procurement approves vendor activation.",
    nextAction: "Approve as a quick win; connect external trade-licence and sanctions sources.",
    subAgents: [
      { name: "Licence & VAT Validator", desc: "Verifies trade licence, VAT and bank details.", complexity: "Medium", type: "Validation", deps: "Registries", status: "Ready" },
      { name: "Sanctions Screener", desc: "Runs sanctions and conflict-of-interest checks.", complexity: "Medium", type: "Validation", deps: "Sanctions lists", status: "Ready" },
      { name: "Expiry Monitor", desc: "Tracks licence and document expiry and nudges renewal.", complexity: "Low", type: "Monitoring", deps: "Vendor portal", status: "Ready" }
    ]
  },
  {
    id: "pr-03", name: "Tender & Bid Evaluation Assistant", kind: "core", tier: "Sourcing",
    purpose: "Supports fair, fast and well-documented evaluation of tenders and bids.",
    responsibilities: "Compile bids; check completeness against the RFP; build a normalised comparison; draft an evaluation summary for the committee; never scores subjectively.",
    process: "Tender Publication, Bid Receipt, Technical & Commercial Evaluation.",
    inputs: ["RFP", "Submitted bids", "Evaluation criteria"],
    systems: ["e-Tendering portal", "ERP"],
    outputs: ["Bid comparison matrix", "Completeness report", "Evaluation summary draft"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Complex", autonomy: "Low — prepares; the committee decides",
    risks: "Medium — evaluation must stay with the committee; agent only prepares and compares.",
    nextAction: "Pilot on low-value tenders with strict committee oversight.",
    subAgents: [
      { name: "Completeness Checker", desc: "Checks each bid against RFP requirements.", complexity: "Medium", type: "Validation", deps: "RFP", status: "In Progress" },
      { name: "Comparison Builder", desc: "Builds a normalised technical/commercial comparison.", complexity: "High", type: "Reporting", deps: "Bids", status: "In Progress" }
    ]
  },
  {
    id: "pr-04", name: "Contract Lifecycle Monitor", kind: "core", tier: "Contract Management",
    purpose: "Tracks contracts through their lifecycle and surfaces renewals, obligations and milestones before they lapse.",
    responsibilities: "Track contract dates, milestones and SLAs; alert on upcoming renewals and expiry; flag unmet obligations; maintain the contract register.",
    process: "Contract Award, Renewal, Obligation Tracking.",
    inputs: ["Contract register", "Milestone schedule", "SLA terms"],
    systems: ["CLM system", "ERP", "Email"],
    outputs: ["Renewal alerts", "Obligation flags", "Contract dashboard"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High for monitoring; no record changes",
    risks: "Low — alerts only.",
    nextAction: "Approve as a quick win once the contract register is digitised.",
    subAgents: [
      { name: "Renewal Sentinel", desc: "Alerts on upcoming renewals and expiry.", complexity: "Low", type: "Monitoring", deps: "CLM", status: "Ready" },
      { name: "Obligation Tracker", desc: "Flags unmet milestones and SLA obligations.", complexity: "Medium", type: "Monitoring", deps: "SLA terms", status: "Ready" }
    ]
  },
  {
    id: "pr-05", name: "Spend Analytics & Savings Agent", kind: "value-add", tier: "Insight",
    purpose: "Turns procurement data into spend visibility, savings opportunities and category insight.",
    responsibilities: "Analyse spend by category and vendor; detect maverick spend and duplication; surface consolidation and savings opportunities; answer ad-hoc questions.",
    process: "Cross-cutting — spend analysis and reporting.",
    inputs: ["PO and invoice data", "Category taxonomy"],
    systems: ["ERP", "BI layer"],
    outputs: ["Spend dashboards", "Savings opportunities", "Anomaly flags"],
    complexity: "Low", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High — read-only and reporting",
    risks: "Low — read-only.",
    nextAction: "Approve as a quick win; agree the core spend metrics.",
    subAgents: [
      { name: "Spend Categoriser", desc: "Classifies spend by category and vendor.", complexity: "Low", type: "Reporting", deps: "BI layer", status: "Ready" },
      { name: "Savings Finder", desc: "Surfaces consolidation and savings opportunities.", complexity: "Medium", type: "Reporting", deps: "—", status: "In Progress" }
    ]
  }
];

const FINANCE_AGENTS = [
  {
    id: "fi-01", name: "Invoice Processing & Matching Agent", kind: "core", tier: "Accounts Payable",
    purpose: "Automates invoice intake, three-way matching and exception handling for accounts payable.",
    responsibilities: "Extract invoice data; match against PO and goods receipt; flag mismatches; route clean invoices for payment scheduling; never releases payment.",
    process: "Invoice Receipt, Three-Way Match, Payment Scheduling.",
    inputs: ["Invoice", "Purchase order", "Goods receipt"],
    systems: ["ERP", "AP system"],
    outputs: ["Matched invoice", "Exception report", "Payment-ready batch"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Medium — matches and recommends; humans release payment",
    risks: "Medium — prepares the batch; releasing funds is always human.",
    nextAction: "Approve as a quick win; segregate preparation from payment release.",
    subAgents: [
      { name: "Invoice Extractor", desc: "Reads and extracts invoice fields via OCR.", complexity: "Medium", type: "Validation", deps: "AP system", status: "Ready" },
      { name: "Three-Way Matcher", desc: "Matches invoice against PO and goods receipt.", complexity: "Medium", type: "Validation", deps: "ERP", status: "Ready" },
      { name: "Exception Router", desc: "Flags mismatches and routes them for review.", complexity: "Low", type: "Orchestration", deps: "—", status: "Ready" }
    ]
  },
  {
    id: "fi-02", name: "Budget Monitoring & Variance Agent", kind: "core", tier: "Financial Planning",
    purpose: "Continuously tracks budget consumption and explains variance before overruns occur.",
    responsibilities: "Track actuals vs budget by cost centre; flag overruns and unusual variance; produce period reports; answer budget questions.",
    process: "Budget Tracking, Variance Analysis, Period Reporting.",
    inputs: ["Budget", "Actuals", "Commitments"],
    systems: ["ERP", "BI layer"],
    outputs: ["Variance reports", "Overrun alerts", "Budget dashboards"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High — read-only and reporting",
    risks: "Low — read-only.",
    nextAction: "Approve as a quick win; agree variance thresholds.",
    subAgents: [
      { name: "Actuals-vs-Budget Tracker", desc: "Tracks consumption by cost centre.", complexity: "Medium", type: "Monitoring", deps: "ERP", status: "Ready" },
      { name: "Overrun Alerter", desc: "Flags overruns and unusual variance.", complexity: "Low", type: "Monitoring", deps: "Thresholds", status: "Ready" }
    ]
  },
  {
    id: "fi-03", name: "Financial Reporting & Close Assistant", kind: "core", tier: "Reporting & Close",
    purpose: "Accelerates the period-end close and the production of standard financial reports.",
    responsibilities: "Run close checklists; reconcile sub-ledgers; draft standard statements; flag unreconciled items; never finalises the ledger.",
    process: "Month-End Close, Reconciliation, Statement Drafting.",
    inputs: ["Trial balance", "Sub-ledgers", "Close checklist"],
    systems: ["ERP", "Reporting tool"],
    outputs: ["Reconciliation status", "Draft statements", "Exception list"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Medium — prepares; Finance approves the close",
    risks: "High — close integrity must stay human-controlled.",
    nextAction: "Sequence behind a governed close process; pilot on reconciliation first.",
    subAgents: [
      { name: "Reconciler", desc: "Reconciles sub-ledgers and flags unmatched items.", complexity: "High", type: "Validation", deps: "ERP", status: "Needs Review" },
      { name: "Statement Drafter", desc: "Drafts standard financial statements.", complexity: "Medium", type: "Drafting", deps: "Trial balance", status: "In Progress" }
    ]
  },
  {
    id: "fi-04", name: "Treasury & Cash-Flow Forecast Agent", kind: "value-add", tier: "Treasury",
    purpose: "Gives Finance a forward view of cash position and liquidity needs.",
    responsibilities: "Forecast cash inflows and outflows; flag liquidity risks; model scenarios; surface idle balances.",
    process: "Cash-Flow Forecasting, Liquidity Monitoring.",
    inputs: ["Bank balances", "Receivables/payables schedule"],
    systems: ["ERP", "Banking feeds", "BI layer"],
    outputs: ["Cash-flow forecast", "Liquidity alerts", "Scenario views"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "High for forecasting; treasury decides",
    risks: "Medium — forecasting accuracy depends on clean data feeds.",
    nextAction: "Enhance phase; secure stable banking feeds first.",
    subAgents: [
      { name: "Flow Forecaster", desc: "Forecasts inflows and outflows.", complexity: "High", type: "Reporting", deps: "Banking feeds", status: "In Progress" },
      { name: "Liquidity Watcher", desc: "Flags liquidity risk and idle balances.", complexity: "Medium", type: "Monitoring", deps: "—", status: "In Progress" }
    ]
  },
  {
    id: "fi-05", name: "Expense Audit & Fraud-Signal Agent", kind: "value-add", tier: "Controls",
    purpose: "Continuously screens expenses for policy breaches and fraud signals before payment.",
    responsibilities: "Check expense claims against policy; detect duplicates and outliers; flag fraud signals; package findings for review.",
    process: "Expense Claim Review, Anomaly Detection.",
    inputs: ["Expense claims", "Policy rules", "Historical patterns"],
    systems: ["ERP", "Expense system"],
    outputs: ["Policy-breach flags", "Fraud-signal report", "Audit trail"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "High for screening; humans adjudicate",
    risks: "Low — flags only; humans adjudicate findings.",
    nextAction: "Strong Enhance candidate; codify expense policy as rules.",
    subAgents: [
      { name: "Policy Screener", desc: "Checks claims against expense policy.", complexity: "Medium", type: "Validation", deps: "Policy rules", status: "In Progress" },
      { name: "Anomaly Detector", desc: "Detects duplicates, outliers and fraud signals.", complexity: "Medium", type: "Monitoring", deps: "Patterns", status: "Needs Review" }
    ]
  }
];

const IT_AGENTS = [
  {
    id: "it-01", name: "IT Service Desk Assistant", kind: "core", tier: "Service Management",
    purpose: "First-line response for IT support requests, with guided resolution and clean routing for complex tickets.",
    responsibilities: "Answer common IT questions; guide self-service resets and how-tos; triage and route tickets; auto-resolve known issues within scope.",
    process: "Incident Intake, Triage, Self-Service Resolution.",
    inputs: ["Knowledge base", "Ticket", "Asset/user data"],
    systems: ["ITSM platform", "Identity system"],
    outputs: ["Resolved tickets", "Routed escalations", "Self-service guidance"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High for guidance; scoped auto-resolution",
    risks: "Low — known fixes only; complex issues routed to engineers.",
    nextAction: "Approve as a quick win; curate the IT knowledge base.",
    subAgents: [
      { name: "Ticket Triager", desc: "Classifies and routes incoming tickets.", complexity: "Medium", type: "Orchestration", deps: "ITSM", status: "Ready" },
      { name: "Self-Service Resolver", desc: "Guides resets and resolves known issues.", complexity: "Low", type: "Conversational", deps: "Knowledge base", status: "Ready" }
    ]
  },
  {
    id: "it-02", name: "Access & Identity Provisioning Agent", kind: "core", tier: "Identity & Access",
    purpose: "Coordinates joiner/mover/leaver access provisioning against role-based entitlements.",
    responsibilities: "Provision and de-provision accounts per role; enforce least privilege; coordinate with onboarding/offboarding; flag orphaned accounts.",
    process: "Joiner/Mover/Leaver Access, Entitlement Review.",
    inputs: ["Role-based entitlement matrix", "HR triggers", "Directory data"],
    systems: ["Identity system", "Directory", "ITSM"],
    outputs: ["Provisioned access", "De-provisioning actions", "Orphaned-account flags"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Strategic", autonomy: "Medium — prepares; security approves privileged grants",
    risks: "Medium — access is security-sensitive; privileged grants stay human-approved.",
    nextAction: "Define the role-based entitlement matrix and segregation-of-duties rules.",
    subAgents: [
      { name: "Joiner/Leaver Provisioner", desc: "Provisions and de-provisions access on HR triggers.", complexity: "High", type: "Orchestration", deps: "Identity system", status: "Needs Review" },
      { name: "Orphan Account Auditor", desc: "Flags orphaned and over-privileged accounts.", complexity: "Medium", type: "Monitoring", deps: "Directory", status: "In Progress" }
    ]
  },
  {
    id: "it-03", name: "Security Threat-Monitoring Agent", kind: "core", tier: "Cyber Security",
    purpose: "Continuously monitors security telemetry and surfaces prioritised threats for the SOC.",
    responsibilities: "Correlate alerts; suppress noise; prioritise true incidents; draft incident summaries; never auto-remediates production without approval.",
    process: "Alert Triage, Incident Prioritisation.",
    inputs: ["SIEM telemetry", "Threat intel", "Asset inventory"],
    systems: ["SIEM", "SOAR", "Ticketing"],
    outputs: ["Prioritised incidents", "Incident summaries", "Suppression of false positives"],
    complexity: "Very High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Medium — triages and recommends; SOC decides response",
    risks: "High — security-critical; response actions stay human-approved.",
    nextAction: "Pilot in detection-only mode alongside the SOC before any automated response.",
    subAgents: [
      { name: "Alert Correlator", desc: "Correlates telemetry and suppresses noise.", complexity: "High", type: "Monitoring", deps: "SIEM", status: "Needs Review" },
      { name: "Incident Prioritiser", desc: "Ranks true incidents and drafts summaries.", complexity: "High", type: "Reporting", deps: "Threat intel", status: "In Progress" }
    ]
  },
  {
    id: "it-04", name: "Asset & Licence Management Agent", kind: "core", tier: "Asset Management",
    purpose: "Keeps the hardware and software asset and licence inventory accurate and optimised.",
    responsibilities: "Track assets and licences; reconcile usage; flag expiry and under/over-licensing; surface reclaim opportunities.",
    process: "Asset Tracking, Licence Reconciliation.",
    inputs: ["Asset inventory", "Licence entitlements", "Usage telemetry"],
    systems: ["CMDB", "SAM tool"],
    outputs: ["Reconciled inventory", "Expiry alerts", "Reclaim opportunities"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High — read-only and reporting",
    risks: "Low — reporting only.",
    nextAction: "Approve as a quick win.",
    subAgents: [
      { name: "Licence Reconciler", desc: "Reconciles licence usage against entitlements.", complexity: "Low", type: "Validation", deps: "SAM tool", status: "Ready" },
      { name: "Reclaim Finder", desc: "Surfaces unused licences and reclaim opportunities.", complexity: "Low", type: "Reporting", deps: "—", status: "Ready" }
    ]
  },
  {
    id: "it-05", name: "Change & Release Coordination Agent", kind: "value-add", tier: "Change Management",
    purpose: "Coordinates change requests and releases with risk-aware scheduling and clear approvals.",
    responsibilities: "Capture change requests; assess risk and conflicts; schedule change windows; assemble CAB packages; track post-release verification.",
    process: "Change Request, CAB, Release Scheduling.",
    inputs: ["Change requests", "Maintenance windows", "Dependency map"],
    systems: ["ITSM", "Release pipeline"],
    outputs: ["Risk-assessed schedule", "CAB package", "Post-release status"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Medium — prepares; CAB approves",
    risks: "Low — prepares and schedules; CAB approves changes.",
    nextAction: "Enhance phase once core IT agents are live.",
    subAgents: [
      { name: "Risk & Conflict Assessor", desc: "Assesses change risk and scheduling conflicts.", complexity: "Medium", type: "Validation", deps: "Dependency map", status: "In Progress" },
      { name: "CAB Packager", desc: "Assembles the change-advisory-board package.", complexity: "Low", type: "Drafting", deps: "ITSM", status: "In Progress" }
    ]
  }
];

const LEGAL_AGENTS = [
  {
    id: "lg-01", name: "Contract Review & Clause Agent", kind: "core", tier: "Contracts",
    purpose: "Accelerates contract review by checking clauses against the approved playbook and flagging risks.",
    responsibilities: "Compare clauses against the standard playbook; flag non-standard and risky terms; suggest fallback language; summarise for the lawyer; never approves a contract.",
    process: "Contract Intake, Clause Review, Risk Flagging.",
    inputs: ["Draft contract", "Clause playbook", "Risk rules"],
    systems: ["CLM system", "Document store"],
    outputs: ["Clause-risk report", "Suggested fallbacks", "Review summary"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Strategic", autonomy: "Low — recommends; a lawyer decides",
    risks: "Medium — legal judgment stays with the lawyer; agent only reviews and suggests.",
    nextAction: "Codify the clause playbook; pilot on standard contract types.",
    subAgents: [
      { name: "Playbook Comparator", desc: "Compares clauses against the approved playbook.", complexity: "High", type: "Validation", deps: "Playbook", status: "Needs Review" },
      { name: "Fallback Suggester", desc: "Suggests fallback language for non-standard terms.", complexity: "Medium", type: "Drafting", deps: "Risk rules", status: "In Progress" }
    ]
  },
  {
    id: "lg-02", name: "Regulatory Compliance Tracker", kind: "core", tier: "Compliance",
    purpose: "Monitors regulatory changes and maps obligations to owners across the organisation.",
    responsibilities: "Track new and amended regulations; assess applicability; map obligations to owners; flag deadlines; maintain the compliance register.",
    process: "Regulatory Watch, Obligation Mapping.",
    inputs: ["Regulatory sources", "Obligation register", "Org mapping"],
    systems: ["GRC platform", "External legal feeds"],
    outputs: ["Change alerts", "Obligation mapping", "Deadline flags"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "High for monitoring; humans confirm applicability",
    risks: "Medium — applicability judgments confirmed by Legal.",
    nextAction: "Connect external legal feeds and the obligation register.",
    subAgents: [
      { name: "Regulatory Watcher", desc: "Tracks new and amended regulations.", complexity: "Medium", type: "Monitoring", deps: "Legal feeds", status: "In Progress" },
      { name: "Obligation Mapper", desc: "Maps obligations to owners and deadlines.", complexity: "Medium", type: "Orchestration", deps: "Org mapping", status: "In Progress" }
    ]
  },
  {
    id: "lg-03", name: "Legal Research & Memo Assistant", kind: "core", tier: "Advisory",
    purpose: "Speeds legal research and the drafting of memos grounded in internal precedent and external law.",
    responsibilities: "Search precedent and regulations; summarise relevant authority; draft memos with citations; flag gaps; never gives final legal opinion.",
    process: "Legal Research, Memo Drafting.",
    inputs: ["Research question", "Precedent archive", "Regulation library"],
    systems: ["Knowledge base", "Legal databases"],
    outputs: ["Research summary", "Cited memo draft", "Authority list"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Complex", autonomy: "Low — drafts; the lawyer owns the opinion",
    risks: "Medium — output must be verified; the lawyer owns the final opinion.",
    nextAction: "Pilot with mandatory citation verification by counsel.",
    subAgents: [
      { name: "Precedent Searcher", desc: "Searches precedent and relevant authority.", complexity: "High", type: "Validation", deps: "Legal databases", status: "In Progress" },
      { name: "Memo Drafter", desc: "Drafts cited memos and flags gaps.", complexity: "Medium", type: "Drafting", deps: "Precedent archive", status: "In Progress" }
    ]
  },
  {
    id: "lg-04", name: "Case & Matter Tracking Agent", kind: "value-add", tier: "Matter Management",
    purpose: "Keeps legal matters, deadlines and obligations visible and on track.",
    responsibilities: "Track matters and deadlines; chase pending actions; surface ageing matters; produce status views for leadership.",
    process: "Matter Intake, Deadline Tracking.",
    inputs: ["Matter register", "Deadlines", "Action items"],
    systems: ["Matter-management system"],
    outputs: ["Matter dashboard", "Deadline alerts", "Ageing flags"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Future Phase", autonomy: "High for tracking; lawyers own the work",
    risks: "Low — tracking and reminders only.",
    nextAction: "Enhance phase; light-touch quick win for visibility.",
    subAgents: [
      { name: "Deadline Tracker", desc: "Tracks matter deadlines and chases actions.", complexity: "Low", type: "Monitoring", deps: "Matter system", status: "Ready" },
      { name: "Status Reporter", desc: "Produces matter status views for leadership.", complexity: "Low", type: "Reporting", deps: "—", status: "Ready" }
    ]
  }
];

const ADMIN_AGENTS = [
  {
    id: "ad-01", name: "Facilities & Maintenance Request Agent", kind: "core", tier: "Facilities",
    purpose: "Handles facilities and maintenance requests from intake to closure with clear routing and follow-up.",
    responsibilities: "Capture and classify requests; route to the right team; track resolution; chase ageing tickets; confirm closure.",
    process: "Request Intake, Routing, Resolution Tracking.",
    inputs: ["Service request", "Facilities catalogue", "Team assignments"],
    systems: ["Facilities system", "Email"],
    outputs: ["Routed requests", "Resolution tracking", "Closure confirmation"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High for routing and tracking",
    risks: "Low — routes and tracks.",
    nextAction: "Approve as a quick win.",
    subAgents: [
      { name: "Request Classifier", desc: "Classifies and routes facilities requests.", complexity: "Low", type: "Orchestration", deps: "Catalogue", status: "Ready" },
      { name: "Resolution Chaser", desc: "Tracks and chases ageing tickets to closure.", complexity: "Low", type: "Monitoring", deps: "—", status: "Ready" }
    ]
  },
  {
    id: "ad-02", name: "Fleet & Travel Coordination Agent", kind: "core", tier: "Travel & Fleet",
    purpose: "Coordinates vehicle bookings, travel requests and related approvals.",
    responsibilities: "Manage vehicle and travel bookings; check policy and budget; route approvals; reconcile usage; handle changes.",
    process: "Travel Request, Vehicle Booking, Approval Routing.",
    inputs: ["Travel/booking request", "Travel policy", "Availability"],
    systems: ["Booking system", "ERP"],
    outputs: ["Confirmed bookings", "Routed approvals", "Usage reconciliation"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Medium — coordinates; approvers decide",
    risks: "Low — coordinates and reconciles; approvers decide.",
    nextAction: "Confirm booking-system integration and travel policy.",
    subAgents: [
      { name: "Booking Coordinator", desc: "Manages vehicle and travel bookings.", complexity: "Medium", type: "Orchestration", deps: "Booking system", status: "In Progress" },
      { name: "Policy & Budget Checker", desc: "Checks requests against policy and budget.", complexity: "Low", type: "Validation", deps: "Travel policy", status: "Ready" }
    ]
  },
  {
    id: "ad-03", name: "Correspondence & Records Agent", kind: "core", tier: "Records Management",
    purpose: "Classifies, routes and archives incoming and outgoing correspondence and records.",
    responsibilities: "Classify correspondence; extract key fields; route to owners; track responses; archive to retention rules.",
    process: "Mail Intake, Classification, Routing, Archiving.",
    inputs: ["Correspondence", "Classification taxonomy", "Retention rules"],
    systems: ["DMS", "Email"],
    outputs: ["Classified records", "Routed items", "Compliant archive"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Medium — classifies and routes; humans handle exceptions",
    risks: "Low — classifies and routes; sensitive items escalated.",
    nextAction: "Approve as a quick win; confirm the retention taxonomy.",
    subAgents: [
      { name: "Correspondence Classifier", desc: "Classifies and extracts key fields.", complexity: "Medium", type: "Validation", deps: "Taxonomy", status: "Ready" },
      { name: "Retention Archiver", desc: "Archives records per retention rules.", complexity: "Low", type: "Orchestration", deps: "DMS", status: "Ready" }
    ]
  },
  {
    id: "ad-04", name: "Events & Meeting Logistics Agent", kind: "value-add", tier: "Events",
    purpose: "Coordinates the logistics behind meetings and events end to end.",
    responsibilities: "Schedule rooms and resources; coordinate catering and AV; send invitations and reminders; track RSVPs; handle changes.",
    process: "Event Planning, Logistics Coordination.",
    inputs: ["Event request", "Resource availability", "Attendee list"],
    systems: ["Calendar", "Booking system"],
    outputs: ["Confirmed logistics", "Invitations and reminders", "RSVP tracking"],
    complexity: "Low", impact: "Low", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "High for coordination",
    risks: "Low — coordination only.",
    nextAction: "Enhance phase.",
    subAgents: [
      { name: "Resource Scheduler", desc: "Schedules rooms, AV and catering.", complexity: "Low", type: "Orchestration", deps: "Booking system", status: "In Progress" },
      { name: "RSVP Tracker", desc: "Sends invitations and tracks RSVPs.", complexity: "Low", type: "Monitoring", deps: "Calendar", status: "In Progress" }
    ]
  }
];

const STRATEGY_AGENTS = [
  {
    id: "st-01", name: "KPI & Performance Monitoring Agent", kind: "core", tier: "Performance",
    purpose: "Tracks strategic KPIs across the organisation and surfaces performance against targets.",
    responsibilities: "Collect KPI actuals; compare against targets; flag at-risk indicators; produce performance dashboards; answer questions in plain language.",
    process: "KPI Collection, Target Tracking, Performance Reporting.",
    inputs: ["KPI definitions", "Actuals from departments", "Targets"],
    systems: ["Performance system", "BI layer"],
    outputs: ["Performance dashboards", "At-risk flags", "Plain-language answers"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High — read-only and reporting",
    risks: "Low — read-only.",
    nextAction: "Approve as a quick win; standardise KPI definitions.",
    subAgents: [
      { name: "KPI Collector", desc: "Collects and validates KPI actuals from departments.", complexity: "Medium", type: "Validation", deps: "Performance system", status: "Ready" },
      { name: "Performance Reporter", desc: "Produces dashboards and flags at-risk KPIs.", complexity: "Low", type: "Reporting", deps: "BI layer", status: "Ready" }
    ]
  },
  {
    id: "st-02", name: "Strategic Initiative Tracker", kind: "core", tier: "Portfolio",
    purpose: "Keeps the portfolio of strategic initiatives visible, on track and well-governed.",
    responsibilities: "Track initiative milestones, risks and dependencies; chase updates; flag slippage; produce a portfolio view for leadership.",
    process: "Initiative Tracking, Milestone Monitoring.",
    inputs: ["Initiative register", "Milestones", "Risk log"],
    systems: ["PMO tool", "BI layer"],
    outputs: ["Portfolio dashboard", "Slippage flags", "Risk summary"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "High for tracking; owners act",
    risks: "Low — tracks and surfaces; owners act.",
    nextAction: "Digitise the initiative register and milestone data.",
    subAgents: [
      { name: "Milestone Monitor", desc: "Tracks milestones and flags slippage.", complexity: "Medium", type: "Monitoring", deps: "PMO tool", status: "In Progress" },
      { name: "Portfolio Reporter", desc: "Produces the portfolio view for leadership.", complexity: "Low", type: "Reporting", deps: "BI layer", status: "Ready" }
    ]
  },
  {
    id: "st-03", name: "Foresight & Benchmarking Agent", kind: "value-add", tier: "Insight",
    purpose: "Brings external benchmarks and foresight signals into strategic planning.",
    responsibilities: "Gather benchmarks and trend signals; compare against internal performance; surface opportunities and risks; brief planners.",
    process: "Benchmarking, Trend Scanning.",
    inputs: ["External benchmarks", "Trend sources", "Internal metrics"],
    systems: ["External data sources", "BI layer"],
    outputs: ["Benchmark comparisons", "Foresight briefs", "Opportunity flags"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Future Phase", autonomy: "High for insight; planners decide",
    risks: "Medium — external data quality must be governed.",
    nextAction: "Enhance phase; vet external data sources.",
    subAgents: [
      { name: "Benchmark Gatherer", desc: "Gathers external benchmarks and trend signals.", complexity: "High", type: "Reporting", deps: "External sources", status: "Needs Review" },
      { name: "Foresight Briefer", desc: "Surfaces opportunities and risks for planners.", complexity: "Medium", type: "Reporting", deps: "—", status: "In Progress" }
    ]
  }
];

const COMMS_AGENTS = [
  {
    id: "cm-01", name: "Media Monitoring & Sentiment Agent", kind: "core", tier: "Media",
    purpose: "Monitors media and social channels for mentions and sentiment, surfacing what needs attention.",
    responsibilities: "Track mentions across channels; analyse sentiment; flag emerging issues; produce daily briefs; alert on crises.",
    process: "Media Scanning, Sentiment Analysis, Issue Flagging.",
    inputs: ["Media feeds", "Social channels", "Keyword list"],
    systems: ["Media-monitoring tool", "BI layer"],
    outputs: ["Daily media brief", "Sentiment dashboard", "Crisis alerts"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "High — monitoring and reporting",
    risks: "Low — monitors and alerts; comms team responds.",
    nextAction: "Approve as a quick win; connect media feeds.",
    subAgents: [
      { name: "Mention Tracker", desc: "Tracks mentions across media and social channels.", complexity: "Medium", type: "Monitoring", deps: "Media feeds", status: "Ready" },
      { name: "Sentiment Analyser", desc: "Analyses sentiment and flags emerging issues.", complexity: "Medium", type: "Reporting", deps: "BI layer", status: "Ready" }
    ]
  },
  {
    id: "cm-02", name: "Content Drafting & Translation Agent", kind: "core", tier: "Content",
    purpose: "Drafts and translates communications content in Arabic and English, on-brand and review-ready.",
    responsibilities: "Draft press releases, posts and statements from briefs; translate AR/EN; enforce brand and tone; prepare for human sign-off; never publishes.",
    process: "Content Briefing, Drafting, Bilingual Translation.",
    inputs: ["Content brief", "Brand guidelines", "Approved messaging"],
    systems: ["CMS", "Translation tools"],
    outputs: ["On-brand drafts", "AR/EN translations", "Review-ready content"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Medium — drafts; comms approves and publishes",
    risks: "Low — drafts only; a human reviews and publishes.",
    nextAction: "Codify brand and tone guidelines; pilot on routine content.",
    subAgents: [
      { name: "Content Drafter", desc: "Drafts on-brand content from briefs.", complexity: "Medium", type: "Drafting", deps: "Brand guidelines", status: "In Progress" },
      { name: "AR/EN Translator", desc: "Translates content bilingually and enforces tone.", complexity: "Medium", type: "Drafting", deps: "Translation tools", status: "In Progress" }
    ]
  },
  {
    id: "cm-03", name: "Campaign Planning & Scheduling Agent", kind: "core", tier: "Campaigns",
    purpose: "Coordinates campaign calendars, channel scheduling and approvals.",
    responsibilities: "Build campaign calendars; schedule across channels; route approvals; track performance; flag conflicts.",
    process: "Campaign Planning, Channel Scheduling.",
    inputs: ["Campaign plan", "Channel calendar", "Approval matrix"],
    systems: ["Marketing platform", "CMS"],
    outputs: ["Campaign calendar", "Scheduled posts", "Performance tracking"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Strategic", autonomy: "Medium — schedules; comms approves",
    risks: "Low — schedules and tracks; publishing approved by humans.",
    nextAction: "Confirm channel integrations and the approval matrix.",
    subAgents: [
      { name: "Calendar Builder", desc: "Builds the campaign calendar and flags conflicts.", complexity: "Low", type: "Orchestration", deps: "Channel calendar", status: "Ready" },
      { name: "Channel Scheduler", desc: "Schedules content across channels.", complexity: "Medium", type: "Orchestration", deps: "Marketing platform", status: "In Progress" }
    ]
  },
  {
    id: "cm-04", name: "Internal Communications Assistant", kind: "value-add", tier: "Internal Comms",
    purpose: "Helps craft and target internal communications and measures reach and resonance.",
    responsibilities: "Draft internal announcements; segment audiences; schedule sends; measure open and read rates; gather feedback.",
    process: "Internal Announcement, Audience Targeting.",
    inputs: ["Announcement brief", "Audience segments"],
    systems: ["Intranet", "Email platform"],
    outputs: ["Targeted announcements", "Reach metrics", "Feedback summary"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Medium — drafts and schedules; comms approves",
    risks: "Low — drafts and measures; humans approve sends.",
    nextAction: "Enhance phase.",
    subAgents: [
      { name: "Announcement Drafter", desc: "Drafts and targets internal announcements.", complexity: "Low", type: "Drafting", deps: "Audience segments", status: "In Progress" },
      { name: "Reach Measurer", desc: "Measures open/read rates and gathers feedback.", complexity: "Low", type: "Reporting", deps: "Email platform", status: "In Progress" }
    ]
  }
];

/* -- Departments ---------------------------------------------------------- */
const DEPARTMENTS = [
  {
    id: "hr", name: "Human Resources", short: "HR", nameAr: "الموارد البشرية",
    description: "Agentifying the full HR landscape — 7 operating domains and 84 sub-processes across a 9-entity government operating model, now including Performance Management, Contract Renewal and Staff Mobility. 18 core agents (nine tiers) plus 8 recommended value-add agents wrap the human-judgment layer on top of Oracle HCM.",
    owner: "Total Experience Team — Corporate Support Services",
    focal: "Aisha Al Mansoori · Director, HR Transformation",
    lastUpdated: "2026-06-22",
    agents: HR_AGENTS
  },
  {
    id: "procurement", name: "Procurement", short: "Procurement", nameAr: "المشتريات",
    description: "Source-to-contract and vendor-management agents that speed purchasing, keep vendors compliant and surface spend savings — with all award and payment decisions kept human.",
    owner: "Corporate Support Services — Procurement",
    focal: "Mohammed Al Hashimi · Head of Procurement",
    lastUpdated: "2026-06-18",
    agents: PROCUREMENT_AGENTS
  },
  {
    id: "finance", name: "Finance", short: "Finance", nameAr: "المالية",
    description: "Accounts-payable, budget, close and treasury agents that compress manual reconciliation and reporting — every payment release and ledger close stays under human control.",
    owner: "Corporate Support Services — Finance",
    focal: "Fatima Al Zaabi · Director of Finance",
    lastUpdated: "2026-06-20",
    agents: FINANCE_AGENTS
  },
  {
    id: "it", name: "Information Technology", short: "IT", nameAr: "تقنية المعلومات",
    description: "Service-desk, identity, security and asset agents that lift IT responsiveness and control — privileged access and incident response remain human-approved.",
    owner: "Digital & Technology",
    focal: "Khalid Al Suwaidi · Chief Information Officer",
    lastUpdated: "2026-06-19",
    agents: IT_AGENTS
  },
  {
    id: "legal", name: "Legal", short: "Legal", nameAr: "الشؤون القانونية",
    description: "Contract-review, compliance and research agents that accelerate legal work while every opinion and approval stays with counsel.",
    owner: "Legal Affairs",
    focal: "Noura Al Kaabi · Legal Counsel",
    lastUpdated: "2026-06-15",
    agents: LEGAL_AGENTS
  },
  {
    id: "admin", name: "Admin Services", short: "Admin", nameAr: "الخدمات الإدارية",
    description: "Facilities, fleet, records and events agents that streamline day-to-day corporate services and keep nothing waiting.",
    owner: "Corporate Support Services — Administration",
    focal: "Saeed Al Nuaimi · Head of Admin Services",
    lastUpdated: "2026-06-17",
    agents: ADMIN_AGENTS
  },
  {
    id: "strategy", name: "Strategy", short: "Strategy", nameAr: "الاستراتيجية",
    description: "Performance, portfolio and foresight agents that give leadership a live, evidence-based view of strategy execution.",
    owner: "Strategy & Performance Management",
    focal: "Hessa Al Falasi · Director, Strategy & Performance",
    lastUpdated: "2026-06-16",
    agents: STRATEGY_AGENTS
  },
  {
    id: "comms", name: "Communications", short: "Comms", nameAr: "الاتصال الحكومي",
    description: "Media-monitoring, bilingual content, campaign and internal-comms agents that strengthen government communication — with publishing always human-approved.",
    owner: "Government Communication",
    focal: "Omar Al Marri · Director of Communications",
    lastUpdated: "2026-06-14",
    agents: COMMS_AGENTS
  }
];

/* Expose globally for the app layer */
window.DASHBOARD_DATA = { departments: DEPARTMENTS, complexityScore: COMPLEXITY_SCORE };
