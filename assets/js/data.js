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

/* -- Departments from live blueprints ------------------------------------ */
const PROCUREMENT_AGENTS = [
  {
    id: "pr-a1", name: "Vendor Registration Validation Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Validate prospective-supplier self-registrations against authoritative government sources — not just the uploaded documents — and shepherd them to Chief approval, so the two-person Vendor Relations team stops doing manual cross-checks and conflict-of-interest emails.",
    responsibilities: "Reads the 4-page Oracle Prospective Supplier Registration and verifies it live against NER (the Ministry of Economy's National Economic Register) — company name, trade licence, activities, status and the owners/shareholders — and traces ownership where an owner is itself a company (who ultimately owns the owning companies); verifies owner identity and details via ICP (the federal identity authority); automatically screens owners/shareholders against the organisation's employee records (Oracle HR) to detect conflicts of interest; on a conflict, routes to Legal to prepare the required legal decree/declaration; checks TRN/VAT, document expiry and completeness; drafts the Chief approval form (overview, activities, certificates, ownership & COI findings, category recommendation); on Chief approval, completes registration and applies the category in Oracle.",
    process: "P2P 1.2.5.a (Vendor Registration), incl. 1.2.5.a.4 review, 1.2.5.a.6 COI check, 1.2.5.a.7 Legal — ~22–25 requests/month, SLA 1 day",
    inputs: ["Vendor-submitted Oracle registration + attachments", "NER company", "licence", "activity & ownership data", "ICP owner identity & details", "Oracle HR employee records"],
    systems: ["Oracle iSupplier/Supplier registration", "NER (Ministry of Economy)", "ICP (identity authority)", "Oracle HR", "Email", "Legal mailbox"],
    outputs: ["Source-verified registration", "beneficial-ownership trace", "automated COI result", "Legal decree/declaration request (if conflict)", "completed approval form", "registered & categorised vendor in Oracle"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on source verification, ownership tracing & COI screening; escalate confirmed conflicts to Legal and the category/approval to the Chief",
    risks: "Chief (Sector Head of CSS) approves; Legal prepares the decree/declaration and, with HR, decides confirmed conflict cases", nextAction: "",
    subAgents: [{ name: "Reads Oracle Prospective Supplier", desc: "Reads the 4-page Oracle Prospective Supplier Registration and verifies it live against NER (the Ministry of Economy's National E", complexity: "Medium", type: "Validation", deps: "Oracle iSupplier/Supplier registration", status: "In Progress" }, { name: "Verifies owner identity details ICP", desc: "verifies owner identity and details via ICP (the federal identity authority)", complexity: "Medium", type: "Validation", deps: "Oracle iSupplier/Supplier registration", status: "In Progress" }, { name: "Automatically screens owners/shareholders", desc: "automatically screens owners/shareholders against the organisation's employee records (Oracle HR) to detect conflicts of interes", complexity: "Medium", type: "Validation", deps: "Oracle iSupplier/Supplier registration", status: "In Progress" }]
  },
  {
    id: "pr-a2", name: "Work Confirmation Coordinator Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Make sure Work Confirmations (GRNs) are created and approved on time, removing the email chasing that today blocks invoicing and inflates accruals.",
    responsibilities: "Watches approved POs with delivery due/passed but no WC; nudges Vendor, PM or Asset Team to create the WC; validates WC quantity/amount against the PO line/milestone; packages penalty-waiver requests with the calculated penalty for the right approver; coordinates with Procurement to raise a WC on the vendor's behalf when none exists.",
    process: "P2P 1.4 (Work Confirmation) + 1.8.8–1.8.10 (missing-WC follow-up)",
    inputs: ["Approved PO/RO/CO data", "delivery dates", "milestone/pay-item schedule", "WC-pending report", "penalty calculation"],
    systems: ["Oracle Purchasing/iSupplier", "Email"],
    outputs: ["Created/approved WC", "penalty-waiver package", "coordination trail"],
    complexity: "Low", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on chasing & validation; escalate any penalty or waiver decision",
    risks: "PM / Respective Head / Sector Head approve WC; penalty waiver per threshold (Sector Head/Chief ≤100k, Entity Head >100k)", nextAction: "",
    subAgents: [{ name: "Watches approved POs delivery due/passed", desc: "Watches approved POs with delivery due/passed but no WC", complexity: "Low", type: "Monitoring", deps: "Oracle Purchasing/iSupplier", status: "In Progress" }, { name: "Nudges Vendor, PM Asset Team", desc: "nudges Vendor, PM or Asset Team to create the WC", complexity: "Low", type: "Monitoring", deps: "Oracle Purchasing/iSupplier", status: "In Progress" }, { name: "Validates WC quantity/amount PO", desc: "validates WC quantity/amount against the PO line/milestone", complexity: "Low", type: "Validation", deps: "Oracle Purchasing/iSupplier", status: "In Progress" }]
  },
  {
    id: "pr-a4", name: "Vendor Evaluation Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Close out the vendor evaluations Oracle auto-issues, and give the Chief a monthly vendor-performance picture without manual report building.",
    responsibilities: "Monitors evaluations Oracle issues once delivery date is reached and WC approved; chases PMs (email + Oracle reminder) to complete them; flags scores below 60% / negative feedback for inactivation review; compiles the monthly performance report (total/active/inactive/awarded vendors, contracts, payments, per category) for the Chief.",
    process: "P2P Vendor Evaluation 1.0–1.4",
    inputs: ["Approved WC + delivery date", "evaluation status", "Oracle vendor master", "master performance report"],
    systems: ["Oracle", "Email"],
    outputs: ["Completed evaluations", "inactivation flags", "monthly Chief performance report"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Act-and-notify on chasing & report generation; escalate inactivation decisions",
    risks: "PM completes evaluation; Procurement + Chief advise on inactivation", nextAction: "",
    subAgents: [{ name: "Monitors evaluations Oracle issues once", desc: "Monitors evaluations Oracle issues once delivery date is reached and WC approved", complexity: "Low", type: "Monitoring", deps: "Oracle", status: "Ready" }, { name: "Chases PMs (email + Oracle", desc: "chases PMs (email + Oracle reminder) to complete them", complexity: "Low", type: "Orchestration", deps: "Oracle", status: "Ready" }, { name: "Flags scores below / negative", desc: "flags scores below 60% / negative feedback for inactivation review", complexity: "Low", type: "Task", deps: "Oracle", status: "Ready" }]
  },
  {
    id: "pr-a6", name: "Travel Request & Quote Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Run the business-mission lifecycle glue — merging requests, validating completeness, gathering quotes, and coordinating HR/Finance — so the Travel Team coordinates by exception.",
    responsibilities: "Merges individual requests into a travel request; validates passports attached, dates and traveller/guest details; approaches agents and enters ≥3 quotes with a recommendation; routes trip and quote approvals; coordinates HR per-diem/leave creation and Finance payment dates; recalculates per-diem deltas on trip changes; prepares PO/RO line splits by cost category.",
    process: "Business Mission 2.1–2.11 (full travel lifecycle)",
    inputs: ["Traveller details", "passports", "mission dates/purpose", "agent quotes", "grade/per-diem policy", "PA balance"],
    systems: ["Oracle Business Mission & Purchasing", "Email"],
    outputs: ["Consolidated travel request", "≥3 quotes + recommendation", "per-diem/leave coordination", "PO/RO draft"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on merge/validation/quote entry; escalate quote selection & cost-add approvals",
    risks: "Sector/Entity Head trip approval; Chief & Budget Entity Head quote approval; HR per-diem validation", nextAction: "",
    subAgents: [{ name: "Merges individual requests travel request", desc: "Merges individual requests into a travel request", complexity: "Medium", type: "Task", deps: "Oracle Business Mission & Purchasing", status: "In Progress" }, { name: "Validates passports attached, dates", desc: "validates passports attached, dates and traveller/guest details", complexity: "Medium", type: "Validation", deps: "Oracle Business Mission & Purchasing", status: "In Progress" }, { name: "Approaches agents enters ≥3 quotes", desc: "approaches agents and enters ≥3 quotes with a recommendation", complexity: "Medium", type: "Task", deps: "Oracle Business Mission & Purchasing", status: "In Progress" }]
  },
  {
    id: "pr-a31", name: "Supplier Experience Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Be the supplier's single point of contact so vendors never have to learn or navigate the portal — the agent gives them the information they need, asks them for exactly what the organisation requires, handles the system work on their behalf, keeps them updated, and gathers their feedback.",
    responsibilities: "Interacts with the supplier directly (chat, email or voice via V12): gives them all the information they need; proactively asks them for exactly the documents, data, clarifications and quotes the organisation requires at each step, and chases whatever is missing; collects what they provide and enters or pre-fills it in Oracle on their behalf — registration, quotations, work confirmations, invoices and SOA responses; keeps them updated on status at every step; and captures their feedback. The supplier experiences a helpful assistant; the portal work happens behind the scenes.",
    process: "P2P 1.2.5.a (registration), 1.2.7–1.2.13 (RFQ/quote), 1.4 (vendor WC), 1.5 (invoice), 2.2–2.5 (SOA) — reframed so the supplier deals with the agent, not the system",
    inputs: ["Supplier contact & profile", "what the organisation requires at each step", "RFQ/PO/invoice data", "status", "feedback"],
    systems: ["Oracle iSupplier (operated on the supplier's behalf)", "Email/chat/voice (with V12)", "the concierge (V1)"],
    outputs: ["Complete", "correct submissions handled for the supplier", "proactive status updates", "requested documents gathered", "captured feedback", "fewer rejections"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on information, requests, status & on-behalf handling; the supplier confirms key submissions; escalate genuine exceptions",
    risks: "Vendor Relations / Buyer / AP step in only on genuine exceptions; the supplier confirms key submissions", nextAction: "",
    subAgents: [{ name: "Interacts supplier directly (chat, email", desc: "Interacts with the supplier directly (chat, email or voice via V12): gives them all the information they need", complexity: "Medium", type: "Task", deps: "Oracle iSupplier (operated on the supplier's behalf)", status: "In Progress" }, { name: "Proactively asks them exactly documents", desc: "proactively asks them for exactly the documents, data, clarifications and quotes the organisation requires at each step, and cha", complexity: "Medium", type: "Orchestration", deps: "Oracle iSupplier (operated on the supplier's behalf)", status: "In Progress" }, { name: "Collects what they provide enters", desc: "collects what they provide and enters or pre-fills it in Oracle on their behalf — registration, quotations, work confirmations,", complexity: "Medium", type: "Task", deps: "Oracle iSupplier (operated on the supplier's behalf)", status: "In Progress" }]
  },
  {
    id: "pr-a32", name: "Requisition & SOW Co-pilot (with cost estimation)", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Turn the offline, unguided pre-requisition step into guided AI authoring: help requesters and PMs write a complete Scope of Work / TOR and requisition, recommend specifications, and estimate cost from prior POs, contracts, quotes and proposals already in the system.",
    responsibilities: "Guides the PM through a complete SOW/TOR (objectives, deliverables, specifications, timeline, acceptance criteria) and drafts it from the stated business need; recommends category, UOM and specifications drawn from similar past requisitions; estimates a realistic cost/range from historical POs, contracts, awarded quotes and proposals in Oracle, and checks it against budget availability; pre-fills the requisition header (project, programme, SME, delivery and contract dates) ready for the requester to review and submit.",
    process: "P2P 1.1.0 (pre-requisition / SOW — today offline & unguided), 1.1.1–1.1.4 (requisition entry)",
    inputs: ["Business need", "historical POs/contracts/quotes/proposals", "category & price history", "budget availability", "COA"],
    systems: ["Oracle iProcurement (read history + draft)", "Word", "Email"],
    outputs: ["Drafted SOW/TOR", "recommended specs & category", "estimated cost/range", "pre-filled requisition"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on drafting, recommendation & estimation; the human reviews before submission",
    risks: "Requester/PM reviews & submits; the Budget Gate approves", nextAction: "",
    subAgents: [{ name: "Guides PM through complete SOW/TOR", desc: "Guides the PM through a complete SOW/TOR (objectives, deliverables, specifications, timeline, acceptance criteria) and drafts it", complexity: "Medium", type: "Drafting", deps: "Oracle iProcurement (read history + draft)", status: "In Progress" }, { name: "Recommends category, UOM specifications", desc: "recommends category, UOM and specifications drawn from similar past requisitions", complexity: "Medium", type: "Task", deps: "Oracle iProcurement (read history + draft)", status: "In Progress" }, { name: "Estimates realistic cost/range historical", desc: "estimates a realistic cost/range from historical POs, contracts, awarded quotes and proposals in Oracle, and checks it against b", complexity: "Medium", type: "Validation", deps: "Oracle iProcurement (read history + draft)", status: "In Progress" }]
  },
  {
    id: "pr-a8", name: "Sourcing, Bid Evaluation & Benchmarking Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Compile the RFQ/RFP, then evaluate and benchmark the proposals that come back — against each other, the cost estimate, previous bids and the market — so buyers spend their time on judgement, not on assembly or spreadsheet comparison.",
    responsibilities: "Monitors the requisition pool; assembles negotiation details (title, dates, supplier list, scoring criteria, T&Cs); enters surrogate quotations for offline suppliers; receives and normalises the submitted proposals into a like-for-like comparison matrix; benchmarks each proposal against the SOW cost estimate (A32), against previous/old bids for similar items, and against market price references — flagging outliers, padding and unrealistic lines; consolidates technical scores and merges them with the commercial evaluation; ranks suppliers; flags one-bid and cost-difference scenarios with the required justification; drafts the award recommendation for the approval workflow; and hands material commercial gaps to the Negotiation agent (V11).",
    process: "P2P 1.2 (RFQ/RFP), incl. 1.2.13 surrogate, 1.2.15–17 one-bid, 12.2.22–23 cost difference, 1.2.24 award",
    inputs: ["Approved PR lines", "supplier base", "submitted proposals/quotes", "the SOW cost estimate", "previous bids & awarded prices", "market price references"],
    systems: ["Oracle Sourcing/Negotiations", "historical bid/award data", "market price references", "Email"],
    outputs: ["Configured RFQ", "surrogate quotes", "a like-for-like proposal comparison & benchmark (vs estimate", "old bids & market)", "combined evaluation & ranking", "drafted award recommendation"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on assembly, proposal comparison & benchmarking; escalate all award and one-bid decisions",
    risks: "Scoring team scores; Procurement/Exec Director/Sector/Entity/Chief approve the award; PM justifies non-lowest", nextAction: "",
    subAgents: [{ name: "Monitors requisition pool", desc: "Monitors the requisition pool", complexity: "Medium", type: "Monitoring", deps: "Oracle Sourcing/Negotiations", status: "In Progress" }, { name: "Assembles negotiation details (title,", desc: "assembles negotiation details (title, dates, supplier list, scoring criteria, T&Cs)", complexity: "Medium", type: "Orchestration", deps: "Oracle Sourcing/Negotiations", status: "In Progress" }, { name: "Enters surrogate quotations offline", desc: "enters surrogate quotations for offline suppliers", complexity: "Medium", type: "Task", deps: "Oracle Sourcing/Negotiations", status: "In Progress" }]
  },
  {
    id: "pr-a9", name: "Contract Drafting & Signature Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Draft bilingual (AR/EN) contracts and amendments from approved data, prior contracts and templates, then drive the GovSign signature flow and keep Oracle in step — so Legal reviews a complete draft instead of starting from a blank page.",
    responsibilities: "Assembles the contract/amendment draft from the awarded PO/PA/CO data, the matching template and similar prior contracts; recommends clauses and flags missing or non-standard terms for Legal; prepares the bilingual (AR/EN) document; routes it to GovSign for vendor and authorised-signatory signature; tracks status; attaches the signed PDF to the Oracle PA/CO/amendment record; tracks LOA dispatch; registers BG/Performance Bond receipt for the monitor.",
    process: "P2P 1.3.1a (contract drafting & signature), 1.2.27 (LOA), 3 (amendment/variation)",
    inputs: ["Awarded PO/PA/CO data", "contract templates", "prior contracts & clauses", "GovSign status"],
    systems: ["GovSign (external)", "Oracle Purchasing", "Word→PDF", "Email"],
    outputs: ["Drafted bilingual contract/amendment", "clause recommendations", "signed PDF attached in Oracle", "LOA dispatched", "BG logged"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on drafting, routing, status tracking & attachment; escalate clause/legal judgement and signature",
    risks: "Legal reviews & approves the draft and any clause change; authorised signatory & vendor sign via GovSign", nextAction: "",
    subAgents: [{ name: "Assembles contract/amendment draft", desc: "Assembles the contract/amendment draft from the awarded PO/PA/CO data, the matching template and similar prior contracts", complexity: "Medium", type: "Validation", deps: "GovSign (external)", status: "In Progress" }, { name: "Recommends clauses flags missing", desc: "recommends clauses and flags missing or non-standard terms for Legal", complexity: "Medium", type: "Task", deps: "GovSign (external)", status: "In Progress" }, { name: "Prepares bilingual (AR/EN) document", desc: "prepares the bilingual (AR/EN) document", complexity: "Medium", type: "Drafting", deps: "GovSign (external)", status: "In Progress" }]
  },
  {
    id: "pr-a10", name: "Budget Gate (PR/PO Approval) Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Perform the Budget Team's finance review of PRs and POs — code validation and fund availability — and clear clean cases within delegated authority.",
    responsibilities: "On each PR/PO/CO/RO notification, reviews approval history and attached quotations, validates and (where needed) amends the GL code combination by requestor/department/expense nature, verifies budget availability against the approved annual budget; recommends approve/reject/reassign/request-info; auto-approves only fully compliant, in-budget, deterministic cases within delegated limits.",
    process: "Budgeting — PR/PO approval 1.1–1.8, 2.1–2.4",
    inputs: ["PR/PO data", "quotations", "code combination", "approved budget & availability", "COA"],
    systems: ["Oracle (Notifications", "iProcurement/Purchasing)"],
    outputs: ["Validated/amended code combination", "approve/reject recommendation or auto-approval (clean cases)"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Suggest first; earn Act-and-notify for clean in-budget cases only; always escalate overruns/amendments",
    risks: "Budget Team owns the decision; out-of-budget/non-standard cases escalate", nextAction: "",
    subAgents: [{ name: "Each PR/PO/CO/RO notification, reviews", desc: "On each PR/PO/CO/RO notification, reviews approval history and attached quotations, validates and (where needed) amends the GL c", complexity: "Medium", type: "Validation", deps: "Oracle (Notifications", status: "In Progress" }, { name: "Recommends", desc: "recommends approve/reject/reassign/request-info", complexity: "Medium", type: "Task", deps: "Oracle (Notifications", status: "In Progress" }, { name: "Auto-approves only fully compliant,", desc: "auto-approves only fully compliant, in-budget, deterministic cases within delegated limits.", complexity: "Medium", type: "Task", deps: "Oracle (Notifications", status: "In Progress" }]
  },
  {
    id: "pr-a29", name: "Bank Guarantee & Bond Monitor Agent", kind: "core", tier: "Tier 4 — Monitoring & Governance",
    purpose: "Replace the manual BG/Performance-Bond expiry tracker with an always-on monitor that never misses a renewal or release.",
    responsibilities: "Registers BG/Performance Bond details on receipt (amount, validity, issuing UAE bank); maintains the expiry tracker; alerts Finance ahead of expiry to renew or release; at contract end/closure, drafts the signed BG-release letter to the issuing bank for the authorised signatory.",
    process: "P2P 1.3.7 (BG/Bond verification), 4 (BG release)",
    inputs: ["Signed contract/PO", "BG/Bond document", "contract closure/completion trigger"],
    systems: ["Manual tracker→digital", "Email (signed letter)"],
    outputs: ["BG register & expiry tracker", "pre-expiry alerts", "drafted release letter"],
    complexity: "Low", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Act-and-notify on tracking & alerts; escalate verification & the signed release",
    risks: "Finance verifies authenticity; authorised signatory signs the release letter", nextAction: "",
    subAgents: [{ name: "Registers BG/Performance Bond details", desc: "Registers BG/Performance Bond details on receipt (amount, validity, issuing UAE bank)", complexity: "Low", type: "Validation", deps: "Manual tracker→digital", status: "Ready" }, { name: "Maintains expiry tracker", desc: "maintains the expiry tracker", complexity: "Low", type: "Monitoring", deps: "Manual tracker→digital", status: "Ready" }, { name: "Alerts Finance ahead expiry renew", desc: "alerts Finance ahead of expiry to renew or release", complexity: "Low", type: "Monitoring", deps: "Manual tracker→digital", status: "Ready" }]
  },
  {
    id: "pr-v1", name: "Vendor & Customer Experience Concierge", kind: "value-add", tier: "Value-add",
    purpose: "Give every vendor and customer one place to ask anything and receive proactive status, in Arabic or English, across registration, RFQ, PO, work confirmation, invoice, payment, BG and AR collection.",
    responsibilities: "Answers status and “what do I do next” questions on demand; pushes proactive updates (payment scheduled, invoice on hold and why, BG expiring, registration approved); routes genuine issues to the right team with full context; operates in Arabic and English.",
    process: "",
    inputs: ["Vendor/customer identity", "their transactions across Oracle", "payment & approval status", "BG tracker"],
    systems: ["Oracle (read)", "iSupplier/customer channels", "Email/portal", "chat"],
    outputs: ["Answered queries", "proactive status notifications", "well-routed issues", "a satisfaction signal"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on answering & proactive updates; escalate genuine issues — never alters records",
    risks: "AP/AR/vendor-relations handle escalated issues; the concierge never changes financial data", nextAction: "",
    subAgents: [{ name: "Answers status “what do I", desc: "Answers status and “what do I do next” questions on demand", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "In Progress" }, { name: "Pushes proactive updates (payment", desc: "pushes proactive updates (payment scheduled, invoice on hold and why, BG expiring, registration approved)", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Routes genuine issues right team", desc: "routes genuine issues to the right team with full context", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "pr-v5", name: "Feedback & Sentiment Agent", kind: "value-add", tier: "Value-add",
    purpose: "Continuously gather and analyse feedback and sentiment from both sides of every service and convert it into prioritised improvements.",
    responsibilities: "Collects lightweight feedback after key moments (onboarding, payment, approval); analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse; closes the loop with respondents.",
    process: "",
    inputs: ["Feedback responses", "interaction outcomes", "sentiment signals"],
    systems: ["Email/portal/survey", "the agent ecosystem", "dashboards"],
    outputs: ["A satisfaction pulse", "a prioritised improvement backlog", "closed-loop responses"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on collection & analysis; humans own the improvement decisions",
    risks: "Process owners act on the backlog; management reviews the pulse", nextAction: "",
    subAgents: [{ name: "Collects lightweight feedback after key", desc: "Collects lightweight feedback after key moments (onboarding, payment, approval)", complexity: "Medium", type: "Task", deps: "Email/portal/survey", status: "In Progress" }, { name: "Analyses sentiment themes", desc: "analyses sentiment and themes", complexity: "Medium", type: "Reporting", deps: "Email/portal/survey", status: "In Progress" }, { name: "Ranks improvement backlog", desc: "ranks an improvement backlog", complexity: "Medium", type: "Task", deps: "Email/portal/survey", status: "In Progress" }]
  },
  {
    id: "pr-v9", name: "Quality Assurance & Self-Audit Agent", kind: "value-add", tier: "Value-add",
    purpose: "Independently review completed work — human and agent — for correctness and completeness, and flag anything that needs fixing before it is relied on.",
    responsibilities: "Re-checks journals (balanced, valid combinations), invoice coding, reconciliation tie-outs, registrations and documents, and report-to-source consistency; compares against the rules and the authoritative source; flags errors, omissions and inconsistencies together with the fix; samples and reviews agent actions as part of governance.",
    process: "",
    inputs: ["Completed transactions/journals/reconciliations/reports", "the rules", "the source data", "agent action logs"],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine"],
    outputs: ["QA findings with the correction", "error-rate trends", "agent-action review"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on review & flagging; humans correct and approve",
    risks: "Reviewers/approvers decide on flagged items; the agent reviews and recommends, never overrides", nextAction: "",
    subAgents: [{ name: "Re-checks journals (balanced, valid", desc: "Re-checks journals (balanced, valid combinations), invoice coding, reconciliation tie-outs, registrations and documents, and rep", complexity: "Medium", type: "Validation", deps: "Oracle (read)", status: "In Progress" }, { name: "Compares rules authoritative source", desc: "compares against the rules and the authoritative source", complexity: "Medium", type: "Drafting", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags errors, omissions inconsistencies", desc: "flags errors, omissions and inconsistencies together with the fix", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "pr-v10", name: "Obligations & Deadlines Radar", kind: "value-add", tier: "Value-add",
    purpose: "Be the department's authoritative “what must be done and by when” radar, surfacing obligations proactively to the right people before they fall due.",
    responsibilities: "Maintains a consolidated obligations & compliance calendar (statutory, regulatory, close, contractual, SLA, recurring); tracks status and ownership; surfaces what's due, due soon and overdue; feeds the Next-Best-Action Coach and warns leads and management; never lets a required action go unflagged.",
    process: "",
    inputs: ["Statutory & regulatory deadlines", "the close calendar", "contract/BG dates", "SLAs", "recurring obligations", "status"],
    systems: ["Oracle (read)", "the agent ecosystem", "calendar", "Email"],
    outputs: ["A live obligations calendar", "due/overdue alerts", "ownership & status", "a feed to personal worklists"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on surfacing & tracking; the owner performs the action",
    risks: "Owners action the items; the radar surfaces and tracks — it does not perform the task", nextAction: "",
    subAgents: [{ name: "Maintains consolidated obligations &", desc: "Maintains a consolidated obligations & compliance calendar (statutory, regulatory, close, contractual, SLA, recurring)", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Tracks status ownership", desc: "tracks status and ownership", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Surfaces what's due, due soon", desc: "surfaces what's due, due soon and overdue", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "pr-v11", name: "Negotiation & Quote-Optimization Agent", kind: "value-add", tier: "Value-add",
    purpose: "Bring structured, data-driven negotiation to sourcing and travel — benchmark, strategise, counter-offer and close routine commercial gaps — while every binding commitment stays a human decision.",
    responsibilities: "Benchmarks quotes against prior POs, contracts and awarded prices and the SOW cost estimate (A32); identifies negotiation levers (price, payment terms, delivery, scope); drafts counter-offers and talking points using negotiation playbooks; conducts routine clarification and price exchanges with suppliers and travel agents — in writing or, through the Contact-Centre agent (V12), by phone in Arabic or English — within delegated limits; handles the surrogate-quote and one-bid context; recommends accept / push / re-tender; never commits beyond its authority.",
    process: "",
    inputs: ["Quotes/proposals", "historical prices", "the cost estimate", "scope", "payment & delivery terms", "delegated thresholds"],
    systems: ["Oracle Sourcing/Negotiations", "Email/chat", "travel-agent channels"],
    outputs: ["Benchmarked quotes", "negotiation strategy & counter-offers", "a recommended position", "savings achieved"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on benchmarking, strategy & routine counter-offers within limits; escalate binding terms, award and one-bid",
    risks: "Buyer / PM / travel team approve final terms; award and binding commitments stay human", nextAction: "",
    subAgents: [{ name: "Benchmarks quotes prior POs, contracts", desc: "Benchmarks quotes against prior POs, contracts and awarded prices and the SOW cost estimate (A32)", complexity: "Medium", type: "Task", deps: "Oracle Sourcing/Negotiations", status: "In Progress" }, { name: "Identifies negotiation levers (price,", desc: "identifies negotiation levers (price, payment terms, delivery, scope)", complexity: "Medium", type: "Task", deps: "Oracle Sourcing/Negotiations", status: "In Progress" }, { name: "Drafts counter-offers talking points using", desc: "drafts counter-offers and talking points using negotiation playbooks", complexity: "Medium", type: "Drafting", deps: "Oracle Sourcing/Negotiations", status: "In Progress" }]
  },
  {
    id: "pr-v12", name: "Conversational Contact-Centre Agent (voice & chat)", kind: "value-add", tier: "Value-add",
    purpose: "Provide a natural bilingual voice and chat channel so the department can call and be called — to answer, to follow up, and to negotiate routine terms — in real time, with seamless human handoff for anything sensitive or binding.",
    responsibilities: "Handles inbound voice/chat and places outbound calls in Arabic or English: invoice follow-up (status, missing/incorrect data, request a revised copy, payment timing) with A3; proposal and quote follow-up, clarification and surrogate-quote gathering with A8; AR collection reminders with A11; vendor-evaluation, work-confirmation and SOA follow-ups. Voices the Negotiation agent's (V11) benchmarked position and counter-offers, captures the vendor's reply, and closes routine gaps within delegated limits. Authenticates the caller; answers from the source systems via the concierge (V1); logs outcomes and call feedback; warm-transfers binding terms or anything sensitive to a human with full context; never commits beyond authority or shares restricted data.",
    process: "",
    inputs: ["Caller identity", "their transactions", "the negotiation position (from V11)", "scripts & policies", "the voice/chat channel"],
    systems: ["Telephony/chat platform (AR/EN)", "Oracle (read", "via V1)", "CRM/JIRA logs", "Email"],
    outputs: ["Handled & placed calls/chats in AR/EN", "invoice & proposal follow-up outcomes", "routine terms negotiated", "recordings & transcripts", "sentiment", "warm handoffs"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on answering, outbound follow-up & routine voice negotiation within limits; warm-transfer binding terms or anything sensitive to a human",
    risks: "Staff take warm transfers; sensitive or binding matters are human; the agent assists, negotiates within limits, and logs", nextAction: "",
    subAgents: [{ name: "Handles inbound voice/chat places outbound", desc: "Handles inbound voice/chat and places outbound calls in Arabic or English: invoice follow-up (status, missing/incorrect data, re", complexity: "Medium", type: "Task", deps: "Telephony/chat platform (AR/EN)", status: "In Progress" }, { name: "Proposal quote follow-up, clarification", desc: "proposal and quote follow-up, clarification and surrogate-quote gathering with A8", complexity: "Medium", type: "Task", deps: "Telephony/chat platform (AR/EN)", status: "In Progress" }, { name: "AR collection reminders A11", desc: "AR collection reminders with A11", complexity: "Medium", type: "Task", deps: "Telephony/chat platform (AR/EN)", status: "In Progress" }]
  }
];

const FINANCE_AGENTS = [
  {
    id: "fi-a3", name: "Invoice Intake & Matching Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Turn the email→JIRA→iSupplier invoice scramble into a clean, validated intake, and resolve the exceptions Oracle's three-way match throws.",
    responsibilities: "Captures invoices arriving by email, logs receipt date in the AP mailbox and JIRA, uploads to iSupplier; for PO invoices lets Oracle run the three-way match and works only the holds/exceptions; for non-PO/memo/utility invoices validates header data and requests the GL code combination from Budget; chases vendors for revised copies on exceptions; flags prepayments and credit notes for the accountant.",
    process: "P2P 1.5.1–1.5.5 (Invoicing), 1.7 (vendor invoice follow-up)",
    inputs: ["Vendor invoice (email/iSupplier)", "PO & receipt/WC", "JIRA ticket", "AP mailbox", "budget code combinations"],
    systems: ["Email", "JIRA AP portal", "Oracle Payables/iSupplier"],
    outputs: ["Logged & uploaded invoice", "matched/validated invoice or documented exception", "vendor follow-up"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Act-and-notify on intake, logging, matching & clean validation; escalate held/exception invoices",
    risks: "Payables Accountant validates exceptions; approver per invoice type", nextAction: "",
    subAgents: [{ name: "Captures invoices arriving email, logs", desc: "Captures invoices arriving by email, logs receipt date in the AP mailbox and JIRA, uploads to iSupplier", complexity: "Medium", type: "Task", deps: "Email", status: "Ready" }, { name: "PO invoices lets Oracle run", desc: "for PO invoices lets Oracle run the three-way match and works only the holds/exceptions", complexity: "Medium", type: "Validation", deps: "Email", status: "Ready" }, { name: "Non-PO/memo/utility invoices validates", desc: "for non-PO/memo/utility invoices validates header data and requests the GL code combination from Budget", complexity: "Medium", type: "Validation", deps: "Email", status: "Ready" }]
  },
  {
    id: "fi-a5", name: "Customer Onboarding & Billing Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Validate customer registrations and draft AR invoices from project/PM billing requests, leaving the AR accountant to review rather than key.",
    responsibilities: "Intakes customer registration requests, validates Trade Licence & TRN, drafts the Oracle customer/site/bill-to setup; intakes billing requests from the project office/PM (e.g. a project such as WGS, with contract/PO attached), drafts the receivables invoice (transaction type, dates, line, revenue amortisation rule, tax, attachments); routes to the MoCA Champion for approval.",
    process: "AR 5.1 (Customer Registration), 5.2 (Billing), 5.3 (Credit Memo)",
    inputs: ["Customer email + Trade Licence/TRN", "project billing-request email", "contract/PO", "pricing", "chart of accounts"],
    systems: ["Oracle Receivables", "Email"],
    outputs: ["Validated customer record", "drafted AR invoice/credit memo", "dispatch to customer"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Suggest → Act-and-notify on draft & validation; escalate approval and any pricing judgement",
    risks: "MoCA Champion approves invoice/credit memo (locks the record)", nextAction: "",
    subAgents: [{ name: "Intakes customer registration requests,", desc: "Intakes customer registration requests, validates Trade Licence & TRN, drafts the Oracle customer/site/bill-to setup", complexity: "Medium", type: "Validation", deps: "Oracle Receivables", status: "In Progress" }, { name: "Intakes billing requests project office/PM", desc: "intakes billing requests from the project office/PM (e.g. a project such as WGS, with contract/PO attached), drafts the receivab", complexity: "Medium", type: "Drafting", deps: "Oracle Receivables", status: "In Progress" }, { name: "Routes MoCA Champion approval", desc: "routes to the MoCA Champion for approval.", complexity: "Medium", type: "Orchestration", deps: "Oracle Receivables", status: "In Progress" }]
  },
  {
    id: "fi-a7", name: "Smart Enquiries & Project-Cost Agent", kind: "core", tier: "Tier 1 — Intake & Coordination",
    purpose: "Answer routine budget enquiries and assemble first-pass project cost evaluations, freeing the Budget Team for genuine analysis.",
    responsibilities: "Logs and triages inbound enquiries; drafts accurate responses from budget data, policies and history; routes cross-functional questions; for new projects, assembles scope/timeline/cost workings, checks budget availability against existing & forecast commitments, and drafts the cost-evaluation recommendation.",
    process: "Budgeting — Smart Enquiries 1–6; Project Cost Evaluation 1–6",
    inputs: ["Enquiry (email/portal)", "budget data", "policies", "historical records", "commitment reports"],
    systems: ["Email/SharePoint", "Excel", "Oracle (read)"],
    outputs: ["Logged enquiry + drafted validated response", "project cost evaluation & recommendation"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Act-and-notify on logging, triage and routine documented responses; escalate novel or policy-sensitive answers and project cost limits",
    risks: "Budget Team validates responses; management decides project cost limits", nextAction: "",
    subAgents: [{ name: "Logs triages inbound enquiries", desc: "Logs and triages inbound enquiries", complexity: "Medium", type: "Conversational", deps: "Email/SharePoint", status: "Ready" }, { name: "Drafts accurate responses budget data", desc: "drafts accurate responses from budget data, policies and history", complexity: "Medium", type: "Drafting", deps: "Email/SharePoint", status: "Ready" }, { name: "Routes cross-functional questions", desc: "routes cross-functional questions", complexity: "Medium", type: "Orchestration", deps: "Email/SharePoint", status: "Ready" }]
  },
  {
    id: "fi-a11", name: "AR Collections & Receipts Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Create and apply receipts from bank confirmations and run disciplined, aging-based collections follow-up.",
    responsibilities: "Creates standard receipts from bank statements/confirmation emails (receipt method→bank/entity), applies them to open invoices, handles unidentified/unapplied states and reversals on request; from the aging report, sends reminders and logs call feedback; shares SWIFT copies for paid-but-outstanding items.",
    process: "AR 5.4 (Receipts & application), 5.5 (Customer follow-up)",
    inputs: ["Bank statement/confirmation", "open invoices", "aging report", "customer contacts"],
    systems: ["Oracle Receivables", "Email/Phone log"],
    outputs: ["Created/applied receipts", "updated AR ledger", "reminder + call log", "follow-up trail"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on receipt creation/application for matched items & reminders; escalate reversals/disputes",
    risks: "AR Accountant reviews; reversals & disputed items confirmed by accountant", nextAction: "",
    subAgents: [{ name: "Creates standard receipts bank", desc: "Creates standard receipts from bank statements/confirmation emails (receipt method→bank/entity), applies them to open invoices,", complexity: "Medium", type: "Task", deps: "Oracle Receivables", status: "Needs Review" }, { name: "Aging report, sends reminders logs", desc: "from the aging report, sends reminders and logs call feedback", complexity: "Medium", type: "Reporting", deps: "Oracle Receivables", status: "Needs Review" }, { name: "Shares SWIFT copies paid-but-outstanding", desc: "shares SWIFT copies for paid-but-outstanding items.", complexity: "Medium", type: "Task", deps: "Oracle Receivables", status: "Needs Review" }]
  },
  {
    id: "fi-a12", name: "Payments Orchestration Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Assemble and shepherd payment batches with strict maker-checker discipline — without ever being the final disburser.",
    responsibilities: "Selects the correct project/entity bank account, assembles single/batch payments from approved invoices, supports the maker step, runs the encryption program and files output, lodges to the bank portal (or rides the H2H real-time interface once live), and tracks bank-mandate approvals; surfaces anomalies via the existing duplicate-check dashboard.",
    process: "P2P 1.6 (Payment process incl. encryption, upload, bank approvals)",
    inputs: ["Approved invoices", "project→bank mapping", "payment screen", "encryption program", "bank portal"],
    systems: ["Oracle Payments", "Bank Portal/H2H", "PowerBI duplicate-check"],
    outputs: ["Bank-selected payment batch", "encrypted file", "lodged payment request", "status tracking"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Suggest/assist only on batching & file prep; humans retain maker-checker & bank disbursement",
    risks: "Payables Manager is checker; bank-mandate approvers disburse — agent never finalises", nextAction: "",
    subAgents: [{ name: "Selects correct project/entity bank", desc: "Selects the correct project/entity bank account, assembles single/batch payments from approved invoices, supports the maker step", complexity: "Medium", type: "Monitoring", deps: "Oracle Payments", status: "In Progress" }, { name: "Surfaces anomalies existing", desc: "surfaces anomalies via the existing duplicate-check dashboard.", complexity: "Medium", type: "Validation", deps: "Oracle Payments", status: "In Progress" }]
  },
  {
    id: "fi-a13", name: "Fixed Assets Lifecycle Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Run the Oracle-FA judgement layer on top of the automated SPAN integration — mass-additions prep, reconciliation, and memo drafting.",
    responsibilities: "Reviews mass-addition lines, corrects category/type and sets queue to POST, verifies created assets; reconciles SPAN↔Oracle interface results and the FA register to TB/GL; tracks CIP build-up and capitalisation; drafts retirement and inter-entity transfer memos and reconciliations; supports physical count and the FA disclosure note.",
    process: "Fixed Assets 7.1–7.7 (additions, CIP, retirement, depreciation, transfer, count, reporting)",
    inputs: ["SPAN-interfaced mass additions", "PO/asset flags", "FA register", "TB/GL", "management memos"],
    systems: ["Oracle FA", "SPAN (via IT-managed API)", "Excel", "Web ADI"],
    outputs: ["Prepared/posted mass additions", "FA–TB reconciliation", "retirement/transfer memos", "FA disclosure"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on mass-addition prep & reconciliation; escalate retirements/transfers/disposals",
    risks: "FA Accountant posts; management approves retirement/transfer; committee does physical count", nextAction: "",
    subAgents: [{ name: "Reviews mass-addition lines, corrects", desc: "Reviews mass-addition lines, corrects category/type and sets queue to POST, verifies created assets", complexity: "Medium", type: "Validation", deps: "Oracle FA", status: "Needs Review" }, { name: "Reconciles SPAN↔Oracle interface results", desc: "reconciles SPAN↔Oracle interface results and the FA register to TB/GL", complexity: "Medium", type: "Validation", deps: "Oracle FA", status: "Needs Review" }, { name: "Tracks CIP build-up capitalisation", desc: "tracks CIP build-up and capitalisation", complexity: "Medium", type: "Monitoring", deps: "Oracle FA", status: "Needs Review" }]
  },
  {
    id: "fi-a14", name: "Payroll Processing & Reconciliation Agent", kind: "core", tier: "Tier 2 — Validation & Execution",
    purpose: "Validate and assemble the payroll run and its allowances, and reconcile the payroll sub-ledger to GL — leaving Finance Head to approve.",
    responsibilities: "Takes HR payroll data, applies deductions (pension, loans, absence) and variable inputs, calculates net pay and the current-vs-prior variance; computes policy-bound allowances (education, air ticket, car, housing, overtime, per-diem, leave salary) and end-of-service gratuity & GPSSA pension; validates iExpense claims against policy; drafts and posts payroll journals and reconciles sub-ledger to GL; supports period close.",
    process: "Payroll 2.1–2.13 (salaries, allowances, gratuity, pension, overtime, per-diem, claims, closing)",
    inputs: ["HR payroll & leave data", "deduction schedules", "attendance", "policy rates", "iExpense claims", "GL"],
    systems: ["Oracle HR/EBS GL", "Bank Portal", "Oracle iExpense", "Excel"],
    outputs: ["Validated payroll register & variance", "allowance/gratuity/pension calcs", "posted JEs & GL reconciliation"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on calculation, validation & reconciliation; escalate approvals & bank transfer",
    risks: "Finance Head approves payroll & variance; management approves allowances/gratuity; bank transfer per mandate", nextAction: "",
    subAgents: [{ name: "Takes HR payroll data, applies", desc: "Takes HR payroll data, applies deductions (pension, loans, absence) and variable inputs, calculates net pay and the current-vs-p", complexity: "Medium", type: "Task", deps: "Oracle HR/EBS GL", status: "Needs Review" }, { name: "Computes policy-bound allowances", desc: "computes policy-bound allowances (education, air ticket, car, housing, overtime, per-diem, leave salary) and end-of-service grat", complexity: "Medium", type: "Task", deps: "Oracle HR/EBS GL", status: "Needs Review" }, { name: "Validates iExpense claims policy", desc: "validates iExpense claims against policy", complexity: "Medium", type: "Validation", deps: "Oracle HR/EBS GL", status: "Needs Review" }]
  },
  {
    id: "fi-a15", name: "Accruals & Open-Contract Analyst Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Build period accruals and the open-contract picture from the Oracle reports the AP team consolidates by hand today.",
    responsibilities: "Extracts Commitment, Contract/PO, Line-Level and WC reports and consolidates them by contract/PO number; assesses each contract (billed vs remaining, WC status, WC>billed, non-PO SOA items); builds accrual entries and the per-entity accrual report; categorises open contracts (Finally Closed/Fully Paid/Under Process/Ongoing/Approved) and routes follow-ups to vendors, PMs, Procurement and IT; drafts the accrual memo for management.",
    process: "P2P 1.8 (accruals), 1.9 (open-contract analysis) — also reused by R2R 1.1.24",
    inputs: ["Commitment/Contract-PO/Line-Level/WC reports", "vendor SOAs", "invoice & payment status"],
    systems: ["Oracle (reports)", "Excel"],
    outputs: ["Consolidated analysis", "accrual entries & report", "open-contract categorisation", "follow-up actions", "draft memo"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on consolidation, categorisation & follow-up; escalate accrual posting & memo approval",
    risks: "Reviewer verifies entity allocation & codes; management approves the accrual memo", nextAction: "",
    subAgents: [{ name: "Extracts Commitment, Contract/PO,", desc: "Extracts Commitment, Contract/PO, Line-Level and WC reports and consolidates them by contract/PO number", complexity: "Medium", type: "Reporting", deps: "Oracle (reports)", status: "Needs Review" }, { name: "Assesses each contract (billed vs", desc: "assesses each contract (billed vs remaining, WC status, WC>billed, non-PO SOA items)", complexity: "Medium", type: "Task", deps: "Oracle (reports)", status: "Needs Review" }, { name: "Builds accrual entries per-entity accrual", desc: "builds accrual entries and the per-entity accrual report", complexity: "Medium", type: "Reporting", deps: "Oracle (reports)", status: "Needs Review" }]
  },
  {
    id: "fi-a16", name: "Vendor Reconciliation (SOA) Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Run the monthly vendor SOA cycle end-to-end except the human judgement on disputed items.",
    responsibilities: "Performs spend analysis and vendor categorisation (Critical/Strategic/Tactical/Adhoc/Inactive); sends monthly SOA request emails with the template; matches the returned SOA to Oracle by invoice/amount/date/PO; identifies differences and routes them (vendor for copies, Procurement for contracts, PM for WC); books straightforward items; replies to the vendor with the reconciled status.",
    process: "P2P 2 (Vendor Reconciliation 2.1–2.5)",
    inputs: ["GL trade-payable", "vendor master", "vendor SOA", "invoice/CO-PO reports", "SWIFT copies"],
    systems: ["Oracle Payables", "Email/Excel"],
    outputs: ["Vendor categorisation", "SOA requests", "reconciled line items", "resolved differences", "reconciled reply"],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on requests, matching & status reply; escalate disputed/unmatched items",
    risks: "AP Accountant resolves disputes; Procurement/PM support", nextAction: "",
    subAgents: [{ name: "Performs spend analysis vendor", desc: "Performs spend analysis and vendor categorisation (Critical/Strategic/Tactical/Adhoc/Inactive)", complexity: "Medium", type: "Reporting", deps: "Oracle Payables", status: "Needs Review" }, { name: "Sends monthly SOA request emails", desc: "sends monthly SOA request emails with the template", complexity: "Medium", type: "Task", deps: "Oracle Payables", status: "Needs Review" }, { name: "Matches returned SOA Oracle", desc: "matches the returned SOA to Oracle by invoice/amount/date/PO", complexity: "Medium", type: "Validation", deps: "Oracle Payables", status: "Needs Review" }]
  },
  {
    id: "fi-a17", name: "AR Reconciliation & Reporting Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Reconcile AR sub-ledger to GL and produce the suite of AR reports the team builds manually each period.",
    responsibilities: "Extracts GL/TB, runs completeness and account mapping, reconciles the AR control account to the sub-ledger, investigates variances and drafts adjustments; builds Collection, MOF, Non-MOF, Interest, Consolidated and Liquidity reports across ~11 entities by matching bank receipts to invoices.",
    process: "AR 5.6 (Reconciliation), 5.7 (Reporting)",
    inputs: ["GL dump/TB", "AR sub-ledger/aging", "bank statements", "interest rates", "entity list"],
    systems: ["Oracle Receivables", "Excel/Bank"],
    outputs: ["Reconciliation file & adjustments", "full AR report suite", "management submission pack"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on reconciliation & report build; escalate adjustment posting & sign-off",
    risks: "AR MoCA Champion reviews & approves; management receives the pack", nextAction: "",
    subAgents: [{ name: "Extracts GL/TB, runs completeness account", desc: "Extracts GL/TB, runs completeness and account mapping, reconciles the AR control account to the sub-ledger, investigates varianc", complexity: "Medium", type: "Validation", deps: "Oracle Receivables", status: "Needs Review" }, { name: "Builds Collection, MOF, Non-MOF, Interest", desc: "builds Collection, MOF, Non-MOF, Interest, Consolidated and Liquidity reports across ~11 entities by matching bank receipts to i", complexity: "Medium", type: "Validation", deps: "Oracle Receivables", status: "Needs Review" }]
  },
  {
    id: "fi-a18", name: "Bank Reconciliation Exceptions Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Work only what Oracle's AutoReconciliation cannot match — the residual unreconciled lines, charges and forex.",
    responsibilities: "After AutoReconciliation runs, identifies unreconciled lines, searches available AP/AR/Payroll/GL transactions and proposes matches; handles bank charges by drafting a miscellaneous AR receipt; routes forex gain/loss; performs the manual clearing bank transfers need; generates the bank reconciliation report. (Once H2H is live, statement import/auto-reconcile is fully system-driven and the agent focuses purely on exceptions.)",
    process: "CM (BRS) 6.1.9–6.1.18 (manual reconciliation, charges/forex, report)",
    inputs: ["Imported MT940 statement", "unreconciled lines", "system transactions", "tolerance rules"],
    systems: ["Oracle Cash Management"],
    outputs: ["Matched lines", "drafted misc receipts for charges", "forex routing", "reconciliation report"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on confident matches & charges; escalate ambiguous/forex/transfer items",
    risks: "CM User confirms non-standard matches; Oracle Support handles file-format errors", nextAction: "",
    subAgents: [{ name: "After AutoReconciliation runs, identifies", desc: "After AutoReconciliation runs, identifies unreconciled lines, searches available AP/AR/Payroll/GL transactions and proposes matc", complexity: "Medium", type: "Validation", deps: "Oracle Cash Management", status: "Needs Review" }, { name: "Handles bank charges drafting", desc: "handles bank charges by drafting a miscellaneous AR receipt", complexity: "Medium", type: "Drafting", deps: "Oracle Cash Management", status: "Needs Review" }, { name: "Routes forex gain/loss", desc: "routes forex gain/loss", complexity: "Medium", type: "Orchestration", deps: "Oracle Cash Management", status: "Needs Review" }]
  },
  {
    id: "fi-a19", name: "VAT Compliance Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Prepare the VAT return per entity — extract, classify, reconcile, draft the FTA working file — and manage the FTA cycle.",
    responsibilities: "Extracts AR/AP VAT registers and the GL trial balance; recalculates VAT (Net×5%), classifies standard/zero/exempt/reverse-charge and input VAT recoverability; reconciles sub-ledger to GL control accounts; maps figures to FTA return boxes and drafts the per-entity working file; watches filing deadlines; assembles the FTA post-submission sample pack (TRN/amount/description validation); archives and distributes the monthly VAT report.",
    process: "VAT 1.1–1.8 (extract→submit→archive→FTA review)",
    inputs: ["AP/AR VAT registers", "trial balance", "petty cash detail", "PO/GRN", "FTA boxes"],
    systems: ["Oracle EBS", "Excel", "FTA Portal"],
    outputs: ["Classified VAT data", "net-VAT reconciliation", "drafted FTA return", "sample pack", "monthly report"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on extract/classify/reconcile/draft; escalate FTA submission, payment & adjustments",
    risks: "Finance Head approves adjustments & the return; Tax User submits on FTA portal", nextAction: "",
    subAgents: [{ name: "Extracts AR/AP VAT registers GL", desc: "Extracts AR/AP VAT registers and the GL trial balance", complexity: "Medium", type: "Task", deps: "Oracle EBS", status: "Needs Review" }, { name: "Recalculates VAT (Net×5%), classifies", desc: "recalculates VAT (Net×5%), classifies standard/zero/exempt/reverse-charge and input VAT recoverability", complexity: "Medium", type: "Task", deps: "Oracle EBS", status: "Needs Review" }, { name: "Reconciles sub-ledger GL control accounts", desc: "reconciles sub-ledger to GL control accounts", complexity: "Medium", type: "Validation", deps: "Oracle EBS", status: "Needs Review" }]
  },
  {
    id: "fi-a20", name: "Budget Performance Reporting Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Replace the multi-hour monthly OPEX/CAPEX consolidation, cleansing and dashboarding with a validated draft.",
    responsibilities: "Extracts OPEX & CAPEX GL budget-consumption reports per entity, consolidates them, and applies the documented cleansing rules (fill Budget Org via prior-month VLOOKUP/COA, map encumbrance type by journal source and requisition description, reclassify MOCA-encumbrance lines); incorporates HR/IT inputs and manual adjustments; compiles the performance summary, confirms the approved budget is not exceeded, and refreshes the dashboard/PPT pack.",
    process: "Budgeting — Budget Performance Reports 1–9",
    inputs: ["OPEX/CAPEX extracts", "COA", "prior-month reports", "HR/IT data", "manual-adjustment checklist"],
    systems: ["Oracle GL", "Excel/PowerPoint"],
    outputs: ["Consolidated & cleansed data", "performance summary", "refreshed dashboard & reporting pack"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on extract/cleanse/consolidate; escalate judgemental classifications & the final pack",
    risks: "Budget Team validates cleansing & adjustments; management reviews the pack", nextAction: "",
    subAgents: [{ name: "Extracts OPEX & CAPEX GL", desc: "Extracts OPEX & CAPEX GL budget-consumption reports per entity, consolidates them, and applies the documented cleansing rules (f", complexity: "Medium", type: "Reporting", deps: "Oracle GL", status: "Needs Review" }, { name: "Incorporates HR/IT inputs manual", desc: "incorporates HR/IT inputs and manual adjustments", complexity: "Medium", type: "Task", deps: "Oracle GL", status: "Needs Review" }, { name: "Compiles performance summary, confirms", desc: "compiles the performance summary, confirms the approved budget is not exceeded, and refreshes the dashboard/PPT pack.", complexity: "Medium", type: "Reporting", deps: "Oracle GL", status: "Needs Review" }]
  },
  {
    id: "fi-a21", name: "Annual Budget Planning Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Coordinate the annual planning cycle and assemble the master budget against the MoF ceiling.",
    responsibilities: "Captures the MoF-approved ceiling; requests and integrates workforce, vacancy, IT, project and admin budgets; prepares YTD actuals and trend/seasonality analysis; incorporates Oracle commitment renewals; organises working sheets and dashboards; reconciles the consolidated budget to ceilings and strategic priorities; drafts the budget memo/pack; supports budget upload and transfer journals in Oracle.",
    process: "Budgeting — Annual Budget Planning 1–7; Budget Upload 1–4; Budget Transfer 1–3",
    inputs: ["MoF approval letters", "HR/IT/Admin/Sector submissions", "performance reports", "commitment reports"],
    systems: ["Email/Excel", "Oracle GL Budget module", "PowerPoint/Word"],
    outputs: ["Consolidated master budget", "reconciliation to ceiling", "budget memo/pack", "upload/transfer support"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on data collection, consolidation, reconciliation & drafting; escalate the budget memo and the approvals",
    risks: "Sector Heads justify; management approves the budget; Finance Management approves upload/transfer", nextAction: "",
    subAgents: [{ name: "Captures MoF-approved ceiling", desc: "Captures the MoF-approved ceiling", complexity: "Medium", type: "Task", deps: "Email/Excel", status: "In Progress" }, { name: "Requests integrates workforce, vacancy, IT", desc: "requests and integrates workforce, vacancy, IT, project and admin budgets", complexity: "Medium", type: "Task", deps: "Email/Excel", status: "In Progress" }, { name: "Prepares YTD actuals trend/seasonality", desc: "prepares YTD actuals and trend/seasonality analysis", complexity: "Medium", type: "Drafting", deps: "Email/Excel", status: "In Progress" }]
  },
  {
    id: "fi-a22", name: "Period-Close Orchestration Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Drive the month-end submodule close sequence and exception clean-up so the close runs on rails.",
    responsibilities: "Sequences AP/AR/FA/CM Create Accounting → Transfer to GL → Journal Import → Post; reviews exception/unposted reports and performs root-cause analysis (unbalanced, invalid combinations, suspended, period mismatch); tracks corrections; confirms the closing checklist; coordinates the AP/AR/GL period close; runs the updated trial balance.",
    process: "R2R 1.1.1–1.1.8, 1.1.38–1.1.41 (submodule & period close)",
    inputs: ["Subledger transactions", "exception reports", "closing checklist", "period status"],
    systems: ["Oracle EBS (subledgers + GL)"],
    outputs: ["Closed submodules", "exception resolutions", "completed checklist", "updated trial balance"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on sequencing, exception triage & checklist; escalate posting & period closure",
    risks: "Oracle/Finance team approves postings & period closure; corrections approved per matrix", nextAction: "",
    subAgents: [{ name: "Sequences AP/AR/FA/CM Create Accounting →", desc: "Sequences AP/AR/FA/CM Create Accounting → Transfer to GL → Journal Import → Post", complexity: "Medium", type: "Orchestration", deps: "Oracle EBS (subledgers + GL)", status: "In Progress" }, { name: "Reviews exception/unposted reports", desc: "reviews exception/unposted reports and performs root-cause analysis (unbalanced, invalid combinations, suspended, period mismatc", complexity: "Medium", type: "Validation", deps: "Oracle EBS (subledgers + GL)", status: "In Progress" }, { name: "Tracks corrections", desc: "tracks corrections", complexity: "Medium", type: "Monitoring", deps: "Oracle EBS (subledgers + GL)", status: "In Progress" }]
  },
  {
    id: "fi-a23", name: "Reconciliation & Account-Analysis Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Produce the ~20 closing account reconciliations and suspense analysis, with drafted adjusting entries.",
    responsibilities: "Runs Account Analysis/GL reports and reconciles each control account on its template (intercompany, bank, prepayments, accruals, deposits, petty cash, unearned revenue, fixed assets, leases, payables/receivables, provisions, etc.); rolls forward accruals and prepaids; ages suspense/clearing items and escalates >30 days; drafts adjustment and routine reclassification entries (IT cost allocation, bank charges/forex, intercompany, unearned revenue, interest receivable, etc.).",
    process: "R2R 1.1.24–1.1.32 (accruals, suspense, adjusting entries), 1.1.26–1.1.28 (account analysis)",
    inputs: ["GL reports per account", "subledger balances", "accrual/prepaid schedules", "suspense balances"],
    systems: ["Oracle GL", "Excel"],
    outputs: ["Per-account reconciliations", "suspense aging", "drafted adjusting & routine entries"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on reconciliation & drafting; escalate every posting for approval",
    risks: "Finance team approves adjusting/reclassification entries before posting", nextAction: "",
    subAgents: [{ name: "Runs Account Analysis/GL reports", desc: "Runs Account Analysis/GL reports and reconciles each control account on its template (intercompany, bank, prepayments, accruals,", complexity: "Medium", type: "Validation", deps: "Oracle GL", status: "In Progress" }, { name: "Rolls forward accruals prepaids", desc: "rolls forward accruals and prepaids", complexity: "Medium", type: "Task", deps: "Oracle GL", status: "In Progress" }, { name: "Ages suspense/clearing items escalates >30", desc: "ages suspense/clearing items and escalates >30 days", complexity: "Medium", type: "Orchestration", deps: "Oracle GL", status: "In Progress" }]
  },
  {
    id: "fi-a24", name: "Lease Accounting Agent (IPSAS 43)", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Maintain the lease population and the IPSAS 43 calculations and journals each close.",
    responsibilities: "Validates lease additions, modifications, renewals and terminations; calculates the ROU asset and lease liability on a present-value basis; computes straight-line ROU amortisation and effective-interest expense; drafts the lease journals (liability, interest, amortisation, additions, modifications, terminations) and reconciles the lease schedule.",
    process: "R2R 1.1.33–1.1.37 (lease review, ROU/liability, amortisation/interest, journals)",
    inputs: ["Lease contracts & schedules", "discount rates", "payment terms"],
    systems: ["Excel", "Oracle GL"],
    outputs: ["Validated lease population", "ROU/liability & amortisation/interest calcs", "drafted lease journals"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Suggest → Act-and-notify on calculations once rates are set; escalate rate/term judgement & posting",
    risks: "Finance team reviews & approves calculations and journals (judgement on rates/terms)", nextAction: "",
    subAgents: [{ name: "Validates lease additions, modifications,", desc: "Validates lease additions, modifications, renewals and terminations", complexity: "Medium", type: "Validation", deps: "Excel", status: "In Progress" }, { name: "Calculates ROU asset lease liability", desc: "calculates the ROU asset and lease liability on a present-value basis", complexity: "Medium", type: "Task", deps: "Excel", status: "In Progress" }, { name: "Computes straight-line ROU amortisation", desc: "computes straight-line ROU amortisation and effective-interest expense", complexity: "Medium", type: "Task", deps: "Excel", status: "In Progress" }]
  },
  {
    id: "fi-a25", name: "ECL Provision Agent (IPSAS 41)", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Compute the expected-credit-loss provision per entity under the IPSAS 41 simplified approach.",
    responsibilities: "Extracts AR aging (7 buckets) and enriches it (earned/unearned, risk rating, DSO); reconciles AR sub-ledger to GL before calculation; applies the provision-matrix loss rates per bucket, separating earned and unearned revenue; aggregates the provision per entity; drafts the ECL workbook and the provision journal; reconciles the allowance account and distributes the monthly ECL summary.",
    process: "R2R 1.3.1–1.3.6 (ECL process)",
    inputs: ["AR aging 7-buckets", "historical loss data", "risk ratings", "reconciled AR", "loss-rate matrix"],
    systems: ["Oracle Receivables/GL", "Excel"],
    outputs: ["Enriched aging", "ECL provision per entity", "drafted workbook & journal", "allowance reconciliation"],
    complexity: "High", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Suggest → Act-and-notify on the matrix maths once rates are approved; escalate rate setting & posting",
    risks: "Finance team approves loss rates & provision before posting", nextAction: "",
    subAgents: [{ name: "Extracts AR aging (7 buckets", desc: "Extracts AR aging (7 buckets) and enriches it (earned/unearned, risk rating, DSO)", complexity: "Medium", type: "Task", deps: "Oracle Receivables/GL", status: "In Progress" }, { name: "Reconciles AR sub-ledger GL before", desc: "reconciles AR sub-ledger to GL before calculation", complexity: "Medium", type: "Validation", deps: "Oracle Receivables/GL", status: "In Progress" }, { name: "Applies provision-matrix loss rates per", desc: "applies the provision-matrix loss rates per bucket, separating earned and unearned revenue", complexity: "Medium", type: "Task", deps: "Oracle Receivables/GL", status: "In Progress" }]
  },
  {
    id: "fi-a26", name: "Intercompany & Consolidation Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Match intercompany balances across entities and assemble the consolidation and elimination workbook.",
    responsibilities: "Extracts related-party and intercompany balances across all entities; reconciles to TB; matches IC receivables/payables and identifies differences; coordinates counterparty confirmations; drafts elimination, reclassification and consolidation-adjustment entries (incl. IFRS/IPSAS alignment); aggregates entity balances; validates the consolidated TB; drafts the consolidated financial statements and disclosure schedules.",
    process: "R2R 1.2 (related party), 1.6 (consolidation & elimination)",
    inputs: ["Entity TBs/FS/GL detail", "intercompany balances", "group COA & mapping", "counterparty confirmations"],
    systems: ["Oracle GL", "Excel/Word", "Email"],
    outputs: ["IC reconciliation", "drafted eliminations/reclasses/adjustments", "consolidation workbook", "draft consolidated FS"],
    complexity: "High", impact: "High", feasibility: "Low",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on matching & drafting; escalate every elimination/adjustment posting and the consolidated FS sign-off",
    risks: "Exec Director / Governance & Financial Control reviews & approves; entities confirm IC differences", nextAction: "",
    subAgents: [{ name: "Extracts related-party intercompany", desc: "Extracts related-party and intercompany balances across all entities", complexity: "Medium", type: "Task", deps: "Oracle GL", status: "In Progress" }, { name: "Reconciles TB", desc: "reconciles to TB", complexity: "Medium", type: "Validation", deps: "Oracle GL", status: "In Progress" }, { name: "Matches IC receivables/payables", desc: "matches IC receivables/payables and identifies differences", complexity: "Medium", type: "Validation", deps: "Oracle GL", status: "In Progress" }]
  },
  {
    id: "fi-a27", name: "Financial Reporting & Disclosure Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Assemble the management accounts and IPSAS financial statements from the closed ledger.",
    responsibilities: "Extracts the final TB and GL dump; classifies expenses (G&A, Project, Staff); builds the FS support workbook; drafts the primary statements (financial position, performance, changes in net assets, cash flow) and the IPSAS disclosure notes; prepares month-on-month/YTD variance analysis, charts and management commentary; cross-checks notes to balances; routes for review, sign-off and external-auditor issuance.",
    process: "R2R 1.4 (management accounts), 1.5 (financial statement preparation)",
    inputs: ["Final TB", "GL dump", "supporting schedules", "COA mapping", "IPSAS disclosure requirements"],
    systems: ["Oracle GL", "Excel/Word", "Email/DocuSign"],
    outputs: ["FS support workbook", "draft primary statements & disclosures", "management commentary", "variance pack"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on extract, classification, drafting & commentary; escalate every posting and the FS sign-off",
    risks: "Finance team reviews; Exec Director/Head of Entity/Minister approve; External Auditor issues", nextAction: "",
    subAgents: [{ name: "Extracts final TB GL dump", desc: "Extracts the final TB and GL dump", complexity: "Medium", type: "Task", deps: "Oracle GL", status: "In Progress" }, { name: "Classifies expenses (G&A, Project, Staff", desc: "classifies expenses (G&A, Project, Staff)", complexity: "Medium", type: "Task", deps: "Oracle GL", status: "In Progress" }, { name: "Builds FS support workbook", desc: "builds the FS support workbook", complexity: "Medium", type: "Task", deps: "Oracle GL", status: "In Progress" }]
  },
  {
    id: "fi-a33", name: "Finance Intelligence — Risk, Overlap & Prediction Agent", kind: "core", tier: "Tier 3 — Reconciliation, Reporting & Closing",
    purpose: "Turn finance from after-the-fact reporting into foresight — continuously detecting duplicates, overlaps and anomalies, identifying risk early, and producing predictions across budgets, cash, collections and vendors.",
    responsibilities: "Detects duplicate and near-duplicate invoices/payments (extending the existing duplicate-check dashboard), overlapping commitments and charges, and double-counted carry-forwards; flags GL anomalies and unusual postings; identifies risk early — budget-overrun, collection/credit, aged AP/AR and accrual, vendor-concentration/performance, and BG/contract-expiry risk; forecasts cash flow, collections, budget consumption and accruals; surfaces all of this as ranked, explained alerts with a recommended action routed to the right team.",
    process: "Cross-cutting — budget monitoring, AR collections/ECL, accruals & open contracts, payment duplicate-check, vendor evaluation, close analytics",
    inputs: ["GL/TB", "AP/AR/budget/commitment data", "payment files", "vendor master & performance", "historical trends"],
    systems: ["Oracle EBS (read)", "Excel/PowerBI", "the ecosystem's shared data"],
    outputs: ["Duplicate/overlap/anomaly alerts", "a live risk register", "and forecasts/predictive advisories with recommended actions"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "Needs Review", priority: "Complex", autonomy: "Act-and-notify on detection, alerting & forecasting; recommendations only — humans decide and post",
    risks: "Finance/Budget teams act on the alerts; the decision and any posting remain human", nextAction: "",
    subAgents: [{ name: "Detects duplicate near-duplicate", desc: "Detects duplicate and near-duplicate invoices/payments (extending the existing duplicate-check dashboard), overlapping commitmen", complexity: "Medium", type: "Validation", deps: "Oracle EBS (read)", status: "Needs Review" }, { name: "Flags GL anomalies unusual postings", desc: "flags GL anomalies and unusual postings", complexity: "Medium", type: "Task", deps: "Oracle EBS (read)", status: "Needs Review" }, { name: "Identifies risk early — budget-overrun", desc: "identifies risk early — budget-overrun, collection/credit, aged AP/AR and accrual, vendor-concentration/performance, and BG/cont", complexity: "Medium", type: "Monitoring", deps: "Oracle EBS (read)", status: "Needs Review" }]
  },
  {
    id: "fi-a28", name: "Budget Commitment Monitor Agent", kind: "core", tier: "Tier 4 — Monitoring & Governance",
    purpose: "Run the weekly commitment monitoring continuously and flag overruns before they happen.",
    responsibilities: "Reviews new PRs weekly against available approved budget per organisation/category; reclassifies PR→PO conversions from commitments to obligations; incorporates petty-cash, TPR (travel) and validated budget-transfer/MEMO funding lines; keeps the monitoring file current; flags potential overruns and escalates to Finance, then supports the Sector-Head discussion on remediation.",
    process: "Budgeting — Budget Commitment Monitoring 1–1.9",
    inputs: ["Weekly PR data", "PR→PO conversions", "petty-cash & TPR reports", "transfer/MEMO authorisations"],
    systems: ["Oracle (read)", "Excel", "Email"],
    outputs: ["Updated monitoring file", "PR→PO reclassification", "overrun flags & escalations"],
    complexity: "Low", impact: "High", feasibility: "High",
    status: "Ready", priority: "Quick Win", autonomy: "Act-and-notify on monitoring & reclassification; escalate every overrun & funding change",
    risks: "Finance team aligns on overruns; Sector Heads agree remediation; transfers need approved memo", nextAction: "",
    subAgents: [{ name: "Reviews new PRs weekly available", desc: "Reviews new PRs weekly against available approved budget per organisation/category", complexity: "Low", type: "Task", deps: "Oracle (read)", status: "Ready" }, { name: "Reclassifies PR→PO conversions", desc: "reclassifies PR→PO conversions from commitments to obligations", complexity: "Low", type: "Task", deps: "Oracle (read)", status: "Ready" }, { name: "Incorporates petty-cash, TPR (travel)", desc: "incorporates petty-cash, TPR (travel) and validated budget-transfer/MEMO funding lines", complexity: "Low", type: "Validation", deps: "Oracle (read)", status: "Ready" }]
  },
  {
    id: "fi-a30", name: "Approval Concierge (shared platform service)", kind: "core", tier: "Tier 4 — Monitoring & Governance",
    purpose: "Deliver every approval as a push-based, decision-ready package and write the decision back to Oracle — the common approval experience for all agents. Give every vendor and customer one place to ask anything and receive proactive status, in Arabic or English, across registration, RFQ, PO, work confirmation, invoice, payment, BG and AR collection. Turn each person's scattered queues (Oracle notifications, emails, pending WCs, holds, reconciliations) into one ranked worklist with recommended next actions. Continuously capture how the work is actually done into a searchable, living knowledge base, and onboard new joiners and cover handovers. Keep the team's workload humane during peaks by surfacing imbalance and prompting healthy pacing — opt-in and aggregate by design. Continuously gather and analyse feedback and sentiment from both sides of every service and convert it into prioritised improvements. Give leadership a synthesised, decision-ready picture of the whole department, on demand and on a schedule, drawing on every other agent. Move assurance from periodic to continuous — monitoring controls and audit-readiness across every process, all the time. Run a continuous operational risk register for the department — identify, assess, assign, track mitigation, and give early warning — so risk is managed proactively rather than discovered late. Independently review completed work — human and agent — for correctness and completeness, and flag anything that needs fixing before it is relied on. Be the department's authoritative “what must be done and by when” radar, surfacing obligations proactively to the right people before they fall due. Bring structured, data-driven negotiation to sourcing and travel — benchmark, strategise, counter-offer and close routine commercial gaps — while every binding commitment stays a human decision. Provide a natural bilingual voice and chat channel so the department can call and be called — to answer, to follow up, and to negotiate routine terms — in real time, with seamless human handoff for anything sensitive or binding.",
    responsibilities: "For any approval an agent prepares, assembles the summary + attachments + recommendation, delivers it to the right approver by their channel (Oracle notification/email/Teams), answers follow-up questions in-thread from the source systems, captures approve/reject/more-info, and writes the outcome back to Oracle with a full audit entry; respects the delegation-of-authority matrix and SoD. Answers status and “what do I do next” questions on demand; pushes proactive updates (payment scheduled, invoice on hold and why, BG expiring, registration approved); routes genuine issues to the right team with full context; operates in Arabic and English. Consolidates each user's open items across systems; ranks by deadline, SLA risk and impact; recommends and pre-fills the next action; learns the person's patterns; delivers a morning brief. Records process know-how, exception resolutions and decisions as they happen; answers “how do we do X here?”; builds onboarding paths; flags single-points-of-knowledge; keeps procedures current as practice evolves. Monitors task volumes and deadlines across the team; flags overload and uneven distribution to leads; suggests rebalancing and realistic sequencing through the close; prompts breaks during crunch; never tracks individuals punitively. Collects lightweight feedback after key moments (onboarding, payment, approval); analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse; closes the loop with respondents. Assembles periodic and on-demand executive briefings across all entities; highlights what changed, what's at risk and what needs a decision; explains cycle-time bottlenecks and slow approval points; answers leadership's ad-hoc questions in plain language. Continuously tests controls and SoD; flags policy drift and missing evidence; verifies five-year retention completeness; pre-assembles audit packs and FTA sample responses; tracks remediation. Scans signals from across the ecosystem (overruns, aged items, expiries, exceptions, SoD findings, single-points-of-knowledge, slow approvals); identifies and assesses risks by likelihood and impact; assigns owners and tracks mitigating controls; maintains the risk register and a heat map; escalates emerging or rising risks early. Re-checks journals (balanced, valid combinations), invoice coding, reconciliation tie-outs, registrations and documents, and report-to-source consistency; compares against the rules and the authoritative source; flags errors, omissions and inconsistencies together with the fix; samples and reviews agent actions as part of governance. Maintains a consolidated obligations & compliance calendar (statutory, regulatory, close, contractual, SLA, recurring); tracks status and ownership; surfaces what's due, due soon and overdue; feeds the Next-Best-Action Coach and warns leads and management; never lets a required action go unflagged. Benchmarks quotes against prior POs, contracts and awarded prices and the SOW cost estimate (A32); identifies negotiation levers (price, payment terms, delivery, scope); drafts counter-offers and talking points using negotiation playbooks; conducts routine clarification and price exchanges with suppliers and travel agents — in writing or, through the Contact-Centre agent (V12), by phone in Arabic or English — within delegated limits; handles the surrogate-quote and one-bid context; recommends accept / push / re-tender; never commits beyond its authority. Handles inbound voice/chat and places outbound calls in Arabic or English: invoice follow-up (status, missing/incorrect data, request a revised copy, payment timing) with A3; proposal and quote follow-up, clarification and surrogate-quote gathering with A8; AR collection reminders with A11; vendor-evaluation, work-confirmation and SOA follow-ups. Voices the Negotiation agent's (V11) benchmarked position and counter-offers, captures the vendor's reply, and closes routine gaps within delegated limits. Authenticates the caller; answers from the source systems via the concierge (V1); logs outcomes and call feedback; warm-transfers binding terms or anything sensitive to a human with full context; never commits beyond authority or shares restricted data.",
    process: "All approval chains across P2P, Travel, AR, VAT, Budgeting, R2R, Payroll",
    inputs: ["Agent-prepared package", "approval matrix", "approver directory", "source-system data Vendor/customer identity", "their transactions across Oracle", "payment & approval status"],
    systems: ["Oracle workflow", "Email/Teams", "audit log Oracle (read)", "iSupplier/customer channels", "Email/portal", "chat Oracle (read)"],
    outputs: ["Decision-ready packages", "in-thread Q&A", "captured decisions written back", "audit trail Answered queries", "proactive status notifications", "well-routed issues"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "Ready", priority: "Quick Win", autonomy: "Act-and-notify on delivery, Q&A and write-back; the human decision is never automated Act-and-notify on answering & proactive updates; escalate genuine issues — never alters records Act-and-notify on prioritisation & pre-fill; the person decides each action Act-and-notify on capture & answering; team leads validate sensitive procedures Act-and-notify on signals & suggestions; leads decide; strictly aggregate & opt-in Act-and-notify on collection & analysis; humans own the improvement decisions Act-and-notify on briefing & analysis; recommendations only Act-and-notify on monitoring & pack assembly; humans own remediation & sign-off Act-and-notify on identification, assessment & tracking; humans own risk decisions & acceptance Act-and-notify on review & flagging; humans correct and approve Act-and-notify on surfacing & tracking; the owner performs the action Act-and-notify on benchmarking, strategy & routine counter-offers within limits; escalate binding terms, award and one-bid Act-and-notify on answering, outbound follow-up & routine voice negotiation within limits; warm-transfer binding terms or anything sensitive to a human",
    risks: "The named approver decides; the agent never approves on their behalf AP/AR/vendor-relations handle escalated issues; the concierge never changes financial data The person chooses what to action; the coach advises and pre-fills Team leads validate captured knowledge; staff contribute and consume Team leads decide on rebalancing; participation is opt-in Process owners act on the backlog; management reviews the pulse Leadership decides; the agent informs and recommends Governance/financial control and auditors act on findings; the sentinel never overrides Risk owners and management decide responses; the agent identifies, assesses and tracks Reviewers/approvers decide on flagged items; the agent reviews and recommends, never overrides Owners action the items; the radar surfaces and tracks — it does not perform the task Buyer / PM / travel team approve final terms; award and binding commitments stay human Staff take warm transfers; sensitive or binding matters are human; the agent assists, negotiates within limits, and logs", nextAction: "",
    subAgents: [{ name: "Any approval agent prepares, assembles", desc: "For any approval an agent prepares, assembles the summary + attachments + recommendation, delivers it to the right approver by t", complexity: "Medium", type: "Drafting", deps: "Oracle workflow", status: "Ready" }, { name: "Respects delegation-of-authority matrix", desc: "respects the delegation-of-authority matrix and SoD. Answers status and “what do I do next” questions on demand", complexity: "Medium", type: "Drafting", deps: "Oracle workflow", status: "Ready" }, { name: "Pushes proactive updates (payment", desc: "pushes proactive updates (payment scheduled, invoice on hold and why, BG expiring, registration approved)", complexity: "Medium", type: "Monitoring", deps: "Oracle workflow", status: "Ready" }]
  },
  {
    id: "fi-v2", name: "Staff Next-Best-Action Coach", kind: "value-add", tier: "Value-add",
    purpose: "Turn each person's scattered queues (Oracle notifications, emails, pending WCs, holds, reconciliations) into one ranked worklist with recommended next actions.",
    responsibilities: "Consolidates each user's open items across systems; ranks by deadline, SLA risk and impact; recommends and pre-fills the next action; learns the person's patterns; delivers a morning brief.",
    process: "",
    inputs: ["The user's queues", "SLAs", "deadlines", "workload", "and agent worklists"],
    systems: ["Oracle (read)", "Email", "the agent ecosystem"],
    outputs: ["A ranked daily worklist", "next-best-action prompts", "SLA-risk alerts"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on prioritisation & pre-fill; the person decides each action",
    risks: "The person chooses what to action; the coach advises and pre-fills", nextAction: "",
    subAgents: [{ name: "Consolidates each user's open items", desc: "Consolidates each user's open items across systems", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Ranks deadline, SLA risk impact", desc: "ranks by deadline, SLA risk and impact", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Recommends pre-fills next action", desc: "recommends and pre-fills the next action", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "fi-v3", name: "Knowledge Capture & Continuity Agent", kind: "value-add", tier: "Value-add",
    purpose: "Continuously capture how the work is actually done into a searchable, living knowledge base, and onboard new joiners and cover handovers.",
    responsibilities: "Records process know-how, exception resolutions and decisions as they happen; answers “how do we do X here?”; builds onboarding paths; flags single-points-of-knowledge; keeps procedures current as practice evolves.",
    process: "",
    inputs: ["Process documentation", "agent decision logs", "resolved exceptions", "SOPs"],
    systems: ["SharePoint/knowledge base", "the agent ecosystem", "Email"],
    outputs: ["A living knowledge base", "onboarding guides", "key-person-risk flags", "answered how-to queries"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on capture & answering; team leads validate sensitive procedures",
    risks: "Team leads validate captured knowledge; staff contribute and consume", nextAction: "",
    subAgents: [{ name: "Records process know-how, exception", desc: "Records process know-how, exception resolutions and decisions as they happen", complexity: "Medium", type: "Task", deps: "SharePoint/knowledge base", status: "In Progress" }, { name: "Answers “how do we do", desc: "answers “how do we do X here?”", complexity: "Medium", type: "Conversational", deps: "SharePoint/knowledge base", status: "In Progress" }, { name: "Builds onboarding paths", desc: "builds onboarding paths", complexity: "Medium", type: "Task", deps: "SharePoint/knowledge base", status: "In Progress" }]
  },
  {
    id: "fi-v4", name: "Wellbeing & Workload-Balance Agent", kind: "value-add", tier: "Value-add",
    purpose: "Keep the team's workload humane during peaks by surfacing imbalance and prompting healthy pacing — opt-in and aggregate by design.",
    responsibilities: "Monitors task volumes and deadlines across the team; flags overload and uneven distribution to leads; suggests rebalancing and realistic sequencing through the close; prompts breaks during crunch; never tracks individuals punitively.",
    process: "",
    inputs: ["Task volumes", "deadlines", "the close calendar", "agent worklists (aggregate)"],
    systems: ["The agent ecosystem (worklists)", "calendar", "Email"],
    outputs: ["Workload-balance signals", "rebalancing suggestions", "healthier close cycles"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on signals & suggestions; leads decide; strictly aggregate & opt-in",
    risks: "Team leads decide on rebalancing; participation is opt-in", nextAction: "",
    subAgents: [{ name: "Monitors task volumes deadlines team", desc: "Monitors task volumes and deadlines across the team", complexity: "Medium", type: "Monitoring", deps: "The agent ecosystem (worklists)", status: "In Progress" }, { name: "Flags overload uneven distribution leads", desc: "flags overload and uneven distribution to leads", complexity: "Medium", type: "Task", deps: "The agent ecosystem (worklists)", status: "In Progress" }, { name: "Suggests rebalancing realistic sequencing", desc: "suggests rebalancing and realistic sequencing through the close", complexity: "Medium", type: "Task", deps: "The agent ecosystem (worklists)", status: "In Progress" }]
  },
  {
    id: "fi-v6", name: "Executive Insight & Briefing Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give leadership a synthesised, decision-ready picture of the whole department, on demand and on a schedule, drawing on every other agent.",
    responsibilities: "Assembles periodic and on-demand executive briefings across all entities; highlights what changed, what's at risk and what needs a decision; explains cycle-time bottlenecks and slow approval points; answers leadership's ad-hoc questions in plain language.",
    process: "",
    inputs: ["Agent outputs", "GL/budget/cash/vendor data", "cycle-time metrics", "the risk register"],
    systems: ["Oracle (read)", "the agent ecosystem", "dashboards/Email"],
    outputs: ["Executive briefings", "bottleneck & risk highlights", "answered leadership questions"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on briefing & analysis; recommendations only",
    risks: "Leadership decides; the agent informs and recommends", nextAction: "",
    subAgents: [{ name: "Assembles periodic on-demand executive", desc: "Assembles periodic and on-demand executive briefings across all entities", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }, { name: "Highlights what changed, what's risk", desc: "highlights what changed, what's at risk and what needs a decision", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Explains cycle-time bottlenecks slow", desc: "explains cycle-time bottlenecks and slow approval points", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "fi-v7", name: "Continuous Audit & Compliance Sentinel", kind: "value-add", tier: "Value-add",
    purpose: "Move assurance from periodic to continuous — monitoring controls and audit-readiness across every process, all the time.",
    responsibilities: "Continuously tests controls and SoD; flags policy drift and missing evidence; verifies five-year retention completeness; pre-assembles audit packs and FTA sample responses; tracks remediation.",
    process: "",
    inputs: ["Agent logs", "transactions", "approval trails", "retention records", "policy rules"],
    systems: ["Oracle (read)", "the audit spine", "SharePoint", "Email"],
    outputs: ["Continuous control findings", "audit-ready packs", "remediation tracking"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on monitoring & pack assembly; humans own remediation & sign-off",
    risks: "Governance/financial control and auditors act on findings; the sentinel never overrides", nextAction: "",
    subAgents: [{ name: "Continuously tests controls SoD", desc: "Continuously tests controls and SoD", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags policy drift missing evidence", desc: "flags policy drift and missing evidence", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Verifies five-year retention completeness", desc: "verifies five-year retention completeness", complexity: "Medium", type: "Validation", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "fi-v8", name: "Operational Risk Management Agent", kind: "value-add", tier: "Value-add",
    purpose: "Run a continuous operational risk register for the department — identify, assess, assign, track mitigation, and give early warning — so risk is managed proactively rather than discovered late.",
    responsibilities: "Scans signals from across the ecosystem (overruns, aged items, expiries, exceptions, SoD findings, single-points-of-knowledge, slow approvals); identifies and assesses risks by likelihood and impact; assigns owners and tracks mitigating controls; maintains the risk register and a heat map; escalates emerging or rising risks early.",
    process: "",
    inputs: ["Signals from all agents", "the control model", "deadlines", "vendor & budget data", "incident history"],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine", "dashboards"],
    outputs: ["A living risk register & heat map", "early-warning alerts", "mitigation tracking"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on identification, assessment & tracking; humans own risk decisions & acceptance",
    risks: "Risk owners and management decide responses; the agent identifies, assesses and tracks", nextAction: "",
    subAgents: [{ name: "Scans signals ecosystem (overruns, aged", desc: "Scans signals from across the ecosystem (overruns, aged items, expiries, exceptions, SoD findings, single-points-of-knowledge, s", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Identifies assesses risks likelihood", desc: "identifies and assesses risks by likelihood and impact", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Assigns owners tracks mitigating controls", desc: "assigns owners and tracks mitigating controls", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }]
  }
];

const KNOWLEDGE_AGENTS = [
  {
    id: "kn-k1", name: "Translation & Interpretation Agent", kind: "core", tier: "Core",
    purpose: "Speed bilingual (Arabic/English) translation and interpretation while keeping terminology consistent — drafting first, humans refining.",
    responsibilities: "Pre-translates editorial content against a bilingual term base; flags terminology and tone choices; prepares interpretation briefs and glossaries; routes to internal/external translators for review.",
    process: "Knowledge & Content — Editorial Translation, Interpretation",
    inputs: ["Source content", "the bilingual term base", "prior translations", "style guide"],
    systems: ["MS Word", "SharePoint", "Email", "MOCA Smart"],
    outputs: ["Draft translations", "glossaries", "interpretation briefs"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on drafting & terminology; humans finalise",
    risks: "Translators & proofreaders review and finalise", nextAction: "",
    subAgents: [{ name: "Pre-translates editorial content", desc: "Pre-translates editorial content against a bilingual term base", complexity: "Medium", type: "Drafting", deps: "MS Word", status: "In Progress" }, { name: "Flags terminology tone choices", desc: "flags terminology and tone choices", complexity: "Medium", type: "Task", deps: "MS Word", status: "In Progress" }, { name: "Prepares interpretation briefs glossaries", desc: "prepares interpretation briefs and glossaries", complexity: "Medium", type: "Drafting", deps: "MS Word", status: "In Progress" }]
  },
  {
    id: "kn-k2", name: "Content Authoring & Proofreading Agent", kind: "core", tier: "Core",
    purpose: "Draft and proof content to a publishable standard — so the content team edits rather than writes from scratch.",
    responsibilities: "Drafts content from briefs; checks grammar, style and bilingual terminology; runs review and proofreading passes; tracks versions and approvals.",
    process: "Knowledge & Content — Content Writing, Content Review & Proofreading",
    inputs: ["Content brief", "style guide", "term base", "prior content"],
    systems: ["MS Word", "SharePoint", "Email"],
    outputs: ["Drafted", "proofed", "version-tracked content"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on drafting & proofing; humans approve",
    risks: "Content Team Lead and proofreaders approve", nextAction: "",
    subAgents: [{ name: "Drafts content briefs", desc: "Drafts content from briefs", complexity: "Medium", type: "Drafting", deps: "MS Word", status: "In Progress" }, { name: "Checks grammar, style bilingual", desc: "checks grammar, style and bilingual terminology", complexity: "Medium", type: "Validation", deps: "MS Word", status: "In Progress" }, { name: "Runs review proofreading passes", desc: "runs review and proofreading passes", complexity: "Medium", type: "Drafting", deps: "MS Word", status: "In Progress" }]
  },
  {
    id: "kn-k3", name: "Publishing & Documentation Agent", kind: "core", tier: "Core",
    purpose: "Get approved content out through the right official channels and keep the record — circulars, media, MOCA forms, publications and coverage.",
    responsibilities: "Schedules and publishes media and circulars through official channels; documents MOCA forms and publications; checks event venues; coordinates big-event media coverage; manages newspaper subscriptions; archives everything.",
    process: "Knowledge & Content — Publishing Media, Circulars, Documentation, Coverage, Subscriptions, Venue Check",
    inputs: ["Approved content", "channel list", "publication calendar", "coverage plan"],
    systems: ["Events Now", "MOCA Smart", "MOCAverse", "Website", "Social Media", "SharePoint"],
    outputs: ["Published content", "documented forms/publications", "coverage archive"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on scheduling, publishing & archiving; escalate publication approval",
    risks: "Director of Events & Creative Content approves publication", nextAction: "",
    subAgents: [{ name: "Schedules publishes media circulars", desc: "Schedules and publishes media and circulars through official channels", complexity: "Medium", type: "Orchestration", deps: "Events Now", status: "In Progress" }, { name: "Documents MOCA forms publications", desc: "documents MOCA forms and publications", complexity: "Medium", type: "Task", deps: "Events Now", status: "In Progress" }, { name: "Checks event venues", desc: "checks event venues", complexity: "Medium", type: "Validation", deps: "Events Now", status: "In Progress" }]
  },
  {
    id: "kn-g1", name: "Approval Concierge", kind: "core", tier: "Core",
    purpose: "Deliver every approval as a decision-ready package pushed to the right person — applying the approval matrices so approvers decide in seconds, never hunting in a system. Capture tacit knowledge and simplify policy across CSS into a living, searchable, bilingual resource. Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS. Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure. Continuously gather and analyse feedback across CSS and convert it into prioritised improvement. Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system. Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule. Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Assembles the decision package for any workflow; applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs); pushes it via the person's channel; takes Q&A in-thread; captures approve/reject/more-info and writes it back to the system of record. Records process know-how and exception resolutions; answers 'how do we do X here?'; simplifies policies/circulars into plain Arabic/English guidance; builds onboarding paths; flags single-points-of-knowledge. Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance. Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time. Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents. Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback. Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language. Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "Cross-CSS — every approval chain (HR, Procurement, Travel, Finance, Legal, IT, Events, Protocol)",
    inputs: ["The pending decision", "the approval matrix", "supporting documents", "approver channel"],
    systems: ["Oracle", "MOCA Smart", "MOCA APP", "Teams", "Email SharePoint", "MOCAverse"],
    outputs: ["Pushed decision packages", "captured decisions written back", "full audit trail"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on assembly, delivery & write-back; the human decision is never automated Act-and-notify on capture, simplification & answering; leads validate Act-and-notify on risk tracking & review; humans own decisions & corrections Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human Act-and-notify on collection & analysis; humans own improvements Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions Act-and-notify on briefing & analysis; recommendations only Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "The matrix-defined approver always decides Team leads validate captured knowledge and simplified policy Risk owners and reviewers decide; the agent reviews and recommends Managers decide on staffing and cover; the agent surfaces and recommends Process owners act on the backlog; management reviews the pulse Staff handle exceptions; the recipient confirms key submissions Leadership decides; the agent informs and recommends Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Assembles decision package any workflow", desc: "Assembles the decision package for any workflow", complexity: "Medium", type: "Orchestration", deps: "Oracle", status: "In Progress" }, { name: "Applies relevant matrix (the Leave", desc: "applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs)", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }, { name: "Pushes person's channel", desc: "pushes it via the person's channel", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }]
  },
  {
    id: "kn-v4", name: "Knowledge-Capture & Policy-Simplifier", kind: "value-add", tier: "Value-add",
    purpose: "Capture tacit knowledge and simplify policy across CSS into a living, searchable, bilingual resource.",
    responsibilities: "Records process know-how and exception resolutions; answers 'how do we do X here?'; simplifies policies/circulars into plain Arabic/English guidance; builds onboarding paths; flags single-points-of-knowledge.",
    process: "",
    inputs: [],
    systems: ["SharePoint", "MOCAverse", "the agent ecosystem"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on capture, simplification & answering; leads validate",
    risks: "Team leads validate captured knowledge and simplified policy", nextAction: "",
    subAgents: [{ name: "Records process know-how exception", desc: "Records process know-how and exception resolutions", complexity: "Medium", type: "Task", deps: "SharePoint", status: "In Progress" }, { name: "Answers 'how do we do", desc: "answers 'how do we do X here?'", complexity: "Medium", type: "Conversational", deps: "SharePoint", status: "In Progress" }, { name: "Simplifies policies/circulars plain", desc: "simplifies policies/circulars into plain Arabic/English guidance", complexity: "Medium", type: "Task", deps: "SharePoint", status: "In Progress" }]
  },
  {
    id: "kn-v9", name: "Continuous Risk & Quality Assurance", kind: "value-add", tier: "Value-add",
    purpose: "Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS.",
    responsibilities: "Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on risk tracking & review; humans own decisions & corrections",
    risks: "Risk owners and reviewers decide; the agent reviews and recommends", nextAction: "",
    subAgents: [{ name: "Maintains operational risk register heat", desc: "Maintains the operational risk register and heat map", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Independently reviews human agent outputs", desc: "independently reviews human and agent outputs against the rules and source", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags errors, omissions rising risks", desc: "flags errors, omissions and rising risks with the fix", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "kn-v11", name: "Wellbeing & Workload-Balance Agent", kind: "value-add", tier: "Value-add",
    purpose: "Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure.",
    responsibilities: "Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time.",
    process: "",
    inputs: [],
    systems: ["The agent ecosystem", "MOCA Smart", "calendars"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human",
    risks: "Managers decide on staffing and cover; the agent surfaces and recommends", nextAction: "",
    subAgents: [{ name: "Monitors task volumes, queue depth", desc: "Monitors task volumes, queue depth and turnaround per person across the agents", complexity: "Medium", type: "Monitoring", deps: "The agent ecosystem", status: "In Progress" }, { name: "Detects overload uneven distribution", desc: "detects overload and uneven distribution", complexity: "Medium", type: "Task", deps: "The agent ecosystem", status: "In Progress" }, { name: "Recommends rebalancing routing routine", desc: "recommends rebalancing and routing routine spikes to automation", complexity: "Medium", type: "Orchestration", deps: "The agent ecosystem", status: "In Progress" }]
  },
  {
    id: "kn-v10", name: "Feedback & Sentiment Agent", kind: "value-add", tier: "Value-add",
    purpose: "Continuously gather and analyse feedback across CSS and convert it into prioritised improvement.",
    responsibilities: "Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents.",
    process: "",
    inputs: [],
    systems: ["MOCA Smart", "survey/chat", "the agent ecosystem", "dashboards"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on collection & analysis; humans own improvements",
    risks: "Process owners act on the backlog; management reviews the pulse", nextAction: "",
    subAgents: [{ name: "Collects lightweight feedback after key", desc: "Collects lightweight feedback after key moments", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }, { name: "Analyses sentiment themes", desc: "analyses sentiment and themes", complexity: "Medium", type: "Reporting", deps: "MOCA Smart", status: "In Progress" }, { name: "Ranks improvement backlog", desc: "ranks an improvement backlog", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }]
  },
  {
    id: "kn-v12", name: "Service-Recipient Experience Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system.",
    responsibilities: "Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback.",
    process: "",
    inputs: [],
    systems: ["The department's systems (on the recipient's behalf)", "MOCA Smart", "voice/chat"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions",
    risks: "Staff handle exceptions; the recipient confirms key submissions", nextAction: "",
    subAgents: [{ name: "Acts recipient's point contact", desc: "Acts as the recipient's point of contact across the department's services", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Provides information exact requirements", desc: "provides information and the exact requirements", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Collects what's needed handles system", desc: "collects what's needed and handles the system work on their behalf where possible", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }]
  },
  {
    id: "kn-v3", name: "Leadership Briefing & Decision-Support Agent", kind: "value-add", tier: "Value-add",
    purpose: "Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule.",
    responsibilities: "Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "dashboards/MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on briefing & analysis; recommendations only",
    risks: "Leadership decides; the agent informs and recommends", nextAction: "",
    subAgents: [{ name: "Assembles cross-function briefings per", desc: "Assembles cross-function briefings per entity", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }, { name: "Highlights what changed, what's risk", desc: "highlights what changed, what's at risk and what needs a decision", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Explains bottlenecks", desc: "explains bottlenecks", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "kn-v5", name: "Proactive Nudge & Deadline Radar", kind: "value-add", tier: "Value-add",
    purpose: "Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "MOCA Smart", "calendar"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Maintains consolidated obligations &", desc: "Maintains a consolidated obligations & compliance calendar across functions", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Tracks status ownership", desc: "tracks status and ownership", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Nudges before due dates", desc: "nudges before due dates", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }]
  }
];

const IT_AGENTS = [
  {
    id: "it-i1", name: "IT Service Desk Agent", kind: "core", tier: "Core",
    purpose: "Resolve the high-volume IT service catalogue — devices, software, email, peripherals, printers, password resets and general support — fast, in the portal.",
    responsibilities: "Creates and validates service records; auto-resolves common requests (password reset, software install, access to standard apps); guides the user; routes complex tickets with full context; suggests knowledge-base answers; tracks SLA.",
    process: "IT — Device/Software/Email/Peripheral/Printer requests, Password Reset, General Support",
    inputs: ["Service request", "asset & user context", "knowledge base", "SLA"],
    systems: ["MOCA Digital Portal", "Ivanti", "Teams", "Email"],
    outputs: ["Resolved tickets", "provisioned software/access", "KB deflection", "SLA adherence"],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on standard fulfilment & resolution; escalate non-standard or approval cases",
    risks: "IT support handles complex/again-approval cases; Department Head approves where required", nextAction: "",
    subAgents: [{ name: "Creates validates service records", desc: "Creates and validates service records", complexity: "Medium", type: "Validation", deps: "MOCA Digital Portal", status: "In Progress" }, { name: "Auto-resolves common requests (password", desc: "auto-resolves common requests (password reset, software install, access to standard apps)", complexity: "Medium", type: "Task", deps: "MOCA Digital Portal", status: "In Progress" }, { name: "Guides user", desc: "guides the user", complexity: "Medium", type: "Conversational", deps: "MOCA Digital Portal", status: "In Progress" }]
  },
  {
    id: "it-i2", name: "IT Access & Identity Agent", kind: "core", tier: "Core",
    purpose: "Get access right across the joiner-mover-leaver lifecycle — provisioning from role, revoking on exit, and keeping identity clean.",
    responsibilities: "Provisions network/system/app and VPN access from role templates; runs IT onboarding, offboarding and transfer/role-change; manages MDM enrolment and digital certificates; flags orphaned or excessive access.",
    process: "IT — Access/VPN requests, Onboarding/Offboarding/Transfer, MDM, Certificates",
    inputs: ["Role", "joiner/mover/leaver event", "access policy", "certificate inventory"],
    systems: ["Active Directory", "MOCA Digital Portal", "Ivanti", "MDM"],
    outputs: ["Provisioned/revoked access", "MDM enrolment", "certificate management"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on standard provisioning/revocation; escalate elevated access",
    risks: "Department Head/Security approve elevated access; offboarding confirmed", nextAction: "",
    subAgents: [{ name: "Provisions network/system/app VPN access", desc: "Provisions network/system/app and VPN access from role templates", complexity: "Medium", type: "Task", deps: "Active Directory", status: "In Progress" }, { name: "Runs onboarding, offboarding", desc: "runs IT onboarding, offboarding and transfer/role-change", complexity: "Medium", type: "Task", deps: "Active Directory", status: "In Progress" }, { name: "Manages MDM enrolment digital certificates", desc: "manages MDM enrolment and digital certificates", complexity: "Medium", type: "Task", deps: "Active Directory", status: "In Progress" }]
  },
  {
    id: "it-i3", name: "IT Operations & Change Agent", kind: "core", tier: "Core",
    purpose: "Keep the estate healthy and changes safe — monitoring, backup/restore, change & enhancement requests, and the asset lifecycle.",
    responsibilities: "Watches system and uptime monitoring and raises alerts; coordinates backup and restoration; prepares change/enhancement/new-system requests for the CAB; manages IT asset inventory, warranty and disposal.",
    process: "IT — Monitoring/Alerts, Backup/Restore, Change/Enhancement/New-System, Asset Inventory/Warranty/Disposal",
    inputs: ["Monitoring data", "backup logs", "change requests", "asset inventory"],
    systems: ["Monitoring Tool", "MOCA Digital Portal", "Ivanti"],
    outputs: ["Health alerts", "restored services", "prepared change packages", "asset lifecycle records"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on monitoring, backup checks & change prep; escalate change approval",
    risks: "CAB approves changes; CIO/Director approve major changes", nextAction: "",
    subAgents: [{ name: "Watches system uptime monitoring raises", desc: "Watches system and uptime monitoring and raises alerts", complexity: "Medium", type: "Monitoring", deps: "Monitoring Tool", status: "In Progress" }, { name: "Coordinates backup restoration", desc: "coordinates backup and restoration", complexity: "Medium", type: "Orchestration", deps: "Monitoring Tool", status: "In Progress" }, { name: "Prepares change/enhancement/new-system", desc: "prepares change/enhancement/new-system requests for the CAB", complexity: "Medium", type: "Drafting", deps: "Monitoring Tool", status: "In Progress" }]
  },
  {
    id: "it-g1", name: "Approval Concierge", kind: "core", tier: "Core",
    purpose: "Deliver every approval as a decision-ready package pushed to the right person — applying the approval matrices so approvers decide in seconds, never hunting in a system. Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS. Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure. Give every employee a single, proactive assistant that spans the CSS self-service catalogue and brings things to them before they ask. Give CSS a natural bilingual voice and chat channel so people can simply talk to it and get answers or action. Continuously gather and analyse feedback across CSS and convert it into prioritised improvement. Make the manager/requester side of every CSS service effortless and proactive. Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Assembles the decision package for any workflow; applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs); pushes it via the person's channel; takes Q&A in-thread; captures approve/reject/more-info and writes it back to the system of record. Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance. Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time. Answers and acts across HR/IT/Admin/Finance self-service via the specialist agents; pushes proactive reminders (visa, insurance, contract, payslip, leave balance); tracks each request to done; gathers feedback. Handles inbound and outbound voice/chat in AR/EN; answers from the specialist agents; runs vendor and AR follow-up/collection calls and protocol confirmations; authenticates callers; logs outcomes and sentiment; warm-transfers sensitive or binding matters. Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents. Surfaces pending approvals with context; gives a team view (leave, performance, requests); raises and pre-fills requests; suggests next-best actions and objectives. Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "Cross-CSS — every approval chain (HR, Procurement, Travel, Finance, Legal, IT, Events, Protocol)",
    inputs: ["The pending decision", "the approval matrix", "supporting documents", "approver channel"],
    systems: ["Oracle", "MOCA Smart", "MOCA APP", "Teams", "Email Oracle (read)", "the agent ecosystem"],
    outputs: ["Pushed decision packages", "captured decisions written back", "full audit trail"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on assembly, delivery & write-back; the human decision is never automated Act-and-notify on risk tracking & review; humans own decisions & corrections Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human Act-and-notify on answering, routing & reminders; escalate exceptions Act-and-notify on answering, routine outbound calls & logging; warm-transfer sensitive matters Act-and-notify on collection & analysis; humans own improvements Act-and-notify on assembly, team view & pre-fill; decisions stay human Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "The matrix-defined approver always decides Risk owners and reviewers decide; the agent reviews and recommends Managers decide on staffing and cover; the agent surfaces and recommends Specialist teams handle exceptions; the employee confirms actions Staff take warm transfers; sensitive/binding matters are human Process owners act on the backlog; management reviews the pulse The manager decides; the companion prepares Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Assembles decision package any workflow", desc: "Assembles the decision package for any workflow", complexity: "Medium", type: "Orchestration", deps: "Oracle", status: "In Progress" }, { name: "Applies relevant matrix (the Leave", desc: "applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs)", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }, { name: "Pushes person's channel", desc: "pushes it via the person's channel", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }]
  },
  {
    id: "it-v9", name: "Continuous Risk & Quality Assurance", kind: "value-add", tier: "Value-add",
    purpose: "Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS.",
    responsibilities: "Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on risk tracking & review; humans own decisions & corrections",
    risks: "Risk owners and reviewers decide; the agent reviews and recommends", nextAction: "",
    subAgents: [{ name: "Maintains operational risk register heat", desc: "Maintains the operational risk register and heat map", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Independently reviews human agent outputs", desc: "independently reviews human and agent outputs against the rules and source", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags errors, omissions rising risks", desc: "flags errors, omissions and rising risks with the fix", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "it-v11", name: "Wellbeing & Workload-Balance Agent", kind: "value-add", tier: "Value-add",
    purpose: "Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure.",
    responsibilities: "Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time.",
    process: "",
    inputs: [],
    systems: ["The agent ecosystem", "MOCA Smart", "calendars"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human",
    risks: "Managers decide on staffing and cover; the agent surfaces and recommends", nextAction: "",
    subAgents: [{ name: "Monitors task volumes, queue depth", desc: "Monitors task volumes, queue depth and turnaround per person across the agents", complexity: "Medium", type: "Monitoring", deps: "The agent ecosystem", status: "In Progress" }, { name: "Detects overload uneven distribution", desc: "detects overload and uneven distribution", complexity: "Medium", type: "Task", deps: "The agent ecosystem", status: "In Progress" }, { name: "Recommends rebalancing routing routine", desc: "recommends rebalancing and routing routine spikes to automation", complexity: "Medium", type: "Orchestration", deps: "The agent ecosystem", status: "In Progress" }]
  },
  {
    id: "it-v1", name: "Employee Experience Concierge", kind: "value-add", tier: "Value-add",
    purpose: "Give every employee a single, proactive assistant that spans the CSS self-service catalogue and brings things to them before they ask.",
    responsibilities: "Answers and acts across HR/IT/Admin/Finance self-service via the specialist agents; pushes proactive reminders (visa, insurance, contract, payslip, leave balance); tracks each request to done; gathers feedback.",
    process: "",
    inputs: [],
    systems: ["MOCA APP", "MOCA Smart", "the specialist agents"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on answering, routing & reminders; escalate exceptions",
    risks: "Specialist teams handle exceptions; the employee confirms actions", nextAction: "",
    subAgents: [{ name: "Answers acts HR/IT/Admin/Finance", desc: "Answers and acts across HR/IT/Admin/Finance self-service via the specialist agents", complexity: "Medium", type: "Conversational", deps: "MOCA APP", status: "In Progress" }, { name: "Pushes proactive reminders (visa,", desc: "pushes proactive reminders (visa, insurance, contract, payslip, leave balance)", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }, { name: "Tracks each request done", desc: "tracks each request to done", complexity: "Medium", type: "Monitoring", deps: "MOCA APP", status: "In Progress" }]
  },
  {
    id: "it-v8", name: "Bilingual Call-Centre Voice Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give CSS a natural bilingual voice and chat channel so people can simply talk to it and get answers or action.",
    responsibilities: "Handles inbound and outbound voice/chat in AR/EN; answers from the specialist agents; runs vendor and AR follow-up/collection calls and protocol confirmations; authenticates callers; logs outcomes and sentiment; warm-transfers sensitive or binding matters.",
    process: "",
    inputs: [],
    systems: ["Telephony/chat platform", "the agent ecosystem", "MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on answering, routine outbound calls & logging; warm-transfer sensitive matters",
    risks: "Staff take warm transfers; sensitive/binding matters are human", nextAction: "",
    subAgents: [{ name: "Handles inbound outbound voice/chat AR/EN", desc: "Handles inbound and outbound voice/chat in AR/EN", complexity: "Medium", type: "Task", deps: "Telephony/chat platform", status: "In Progress" }, { name: "Answers specialist agents", desc: "answers from the specialist agents", complexity: "Medium", type: "Conversational", deps: "Telephony/chat platform", status: "In Progress" }, { name: "Runs vendor AR follow-up/collection calls", desc: "runs vendor and AR follow-up/collection calls and protocol confirmations", complexity: "Medium", type: "Task", deps: "Telephony/chat platform", status: "In Progress" }]
  },
  {
    id: "it-v10", name: "Feedback & Sentiment Agent", kind: "value-add", tier: "Value-add",
    purpose: "Continuously gather and analyse feedback across CSS and convert it into prioritised improvement.",
    responsibilities: "Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents.",
    process: "",
    inputs: [],
    systems: ["MOCA Smart", "survey/chat", "the agent ecosystem", "dashboards"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on collection & analysis; humans own improvements",
    risks: "Process owners act on the backlog; management reviews the pulse", nextAction: "",
    subAgents: [{ name: "Collects lightweight feedback after key", desc: "Collects lightweight feedback after key moments", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }, { name: "Analyses sentiment themes", desc: "analyses sentiment and themes", complexity: "Medium", type: "Reporting", deps: "MOCA Smart", status: "In Progress" }, { name: "Ranks improvement backlog", desc: "ranks an improvement backlog", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }]
  },
  {
    id: "it-v2", name: "Manager & Requester Companion", kind: "value-add", tier: "Value-add",
    purpose: "Make the manager/requester side of every CSS service effortless and proactive.",
    responsibilities: "Surfaces pending approvals with context; gives a team view (leave, performance, requests); raises and pre-fills requests; suggests next-best actions and objectives.",
    process: "",
    inputs: [],
    systems: ["MOCA APP", "Teams", "the specialist agents"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on assembly, team view & pre-fill; decisions stay human",
    risks: "The manager decides; the companion prepares", nextAction: "",
    subAgents: [{ name: "Surfaces pending approvals context", desc: "Surfaces pending approvals with context", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }, { name: "Gives team view (leave, performance", desc: "gives a team view (leave, performance, requests)", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }, { name: "Raises pre-fills requests", desc: "raises and pre-fills requests", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }]
  },
  {
    id: "it-v5", name: "Proactive Nudge & Deadline Radar", kind: "value-add", tier: "Value-add",
    purpose: "Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "MOCA Smart", "calendar"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Maintains consolidated obligations &", desc: "Maintains a consolidated obligations & compliance calendar across functions", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Tracks status ownership", desc: "tracks status and ownership", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Nudges before due dates", desc: "nudges before due dates", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }]
  }
];

const CYBER_AGENTS = [
  {
    id: "cy-c1", name: "Security Operations (SOC) Agent", kind: "core", tier: "Core",
    purpose: "Take an alert from intake to closure faster — enriching, triaging and recommending containment — so analysts spend time on judgement, not log-pulling.",
    responsibilities: "Intakes QRadar offenses and JIRA/end-user reports; enriches and triages; classifies severity; collects evidence; recommends and (within policy) executes short-term containment; tracks eradication, recovery and closure; drafts the post-incident review.",
    process: "Cyber — Incident lifecycle (intake, triage, classification, evidence, containment, eradication, recovery, closure, post-incident review)",
    inputs: ["QRadar offenses", "tickets", "threat intel", "asset & identity context"],
    systems: ["IBM QRadar SIEM", "JIRA", "CrowdStrike", "Active Directory", "Credential Vault"],
    outputs: ["Triaged incidents", "evidence", "containment actions", "post-incident review"],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on enrichment, triage & low-risk containment; escalate business-impacting actions",
    risks: "SOC Lead/Manager approve containment that impacts business; CISO owns major incidents", nextAction: "",
    subAgents: [{ name: "Intakes QRadar offenses JIRA/end-user", desc: "Intakes QRadar offenses and JIRA/end-user reports", complexity: "Medium", type: "Reporting", deps: "IBM QRadar SIEM", status: "In Progress" }, { name: "Enriches triages", desc: "enriches and triages", complexity: "Medium", type: "Conversational", deps: "IBM QRadar SIEM", status: "In Progress" }, { name: "Classifies severity", desc: "classifies severity", complexity: "Medium", type: "Task", deps: "IBM QRadar SIEM", status: "In Progress" }]
  },
  {
    id: "cy-c2", name: "Security Clearance & GRC Agent", kind: "core", tier: "Core",
    purpose: "Run project security clearance and GRC — checklist, risk assessment, workshop and technical/GRC sign-off — so projects clear faster without lowering the bar.",
    responsibilities: "Initiates the clearance; issues and pre-populates the security checklist; performs the risk assessment; facilitates the workshop; tracks requirement remediation; prepares technical and GRC clearance and conditional approval.",
    process: "Cyber — Project Security Clearance (feasibility, checklist, risk assessment, workshop, technical/GRC clearance)",
    inputs: ["Project details", "security checklist", "risk register", "requirements"],
    systems: ["GRC Dashboard", "Confluence", "Email", "Asset Inventory"],
    outputs: ["Completed checklist", "risk assessment", "clearance recommendation"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on checklist, assessment & tracking; escalate clearance decisions",
    risks: "CISO/GRC grant clearance and conditional approval", nextAction: "",
    subAgents: [{ name: "Initiates clearance", desc: "Initiates the clearance", complexity: "Medium", type: "Task", deps: "GRC Dashboard", status: "In Progress" }, { name: "Issues pre-populates security checklist", desc: "issues and pre-populates the security checklist", complexity: "Medium", type: "Validation", deps: "GRC Dashboard", status: "In Progress" }, { name: "Performs risk assessment", desc: "performs the risk assessment", complexity: "Medium", type: "Task", deps: "GRC Dashboard", status: "In Progress" }]
  },
  {
    id: "cy-g1", name: "Approval Concierge", kind: "core", tier: "Core",
    purpose: "Deliver every approval as a decision-ready package pushed to the right person — applying the approval matrices so approvers decide in seconds, never hunting in a system. Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS. Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure. Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system. Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule. Be the authoritative 'what's due and by when' radar for the whole sector. Move assurance from periodic to continuous and remediate proactively across CSS.",
    responsibilities: "Assembles the decision package for any workflow; applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs); pushes it via the person's channel; takes Q&A in-thread; captures approve/reject/more-info and writes it back to the system of record. Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance. Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time. Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback. Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language. Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge. Tests controls and evidence completeness across finance, cyber and legal; remediates or routes remediation for gaps before the audit; verifies retention; pre-assembles audit and sample packs; tracks findings to closure.",
    process: "Cross-CSS — every approval chain (HR, Procurement, Travel, Finance, Legal, IT, Events, Protocol)",
    inputs: ["The pending decision", "the approval matrix", "supporting documents", "approver channel"],
    systems: ["Oracle", "MOCA Smart", "MOCA APP", "Teams", "Email Oracle (read)", "the agent ecosystem"],
    outputs: ["Pushed decision packages", "captured decisions written back", "full audit trail"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on assembly, delivery & write-back; the human decision is never automated Act-and-notify on risk tracking & review; humans own decisions & corrections Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions Act-and-notify on briefing & analysis; recommendations only Act-and-notify on surfacing, nudging & tracking; the owner acts Act-and-notify on testing, remediation prep & pack assembly; humans approve fixes & sign-off",
    risks: "The matrix-defined approver always decides Risk owners and reviewers decide; the agent reviews and recommends Managers decide on staffing and cover; the agent surfaces and recommends Staff handle exceptions; the recipient confirms key submissions Leadership decides; the agent informs and recommends Owners action the items; the radar surfaces and tracks Governance, CISO/GRC and auditors own findings & sign-off", nextAction: "",
    subAgents: [{ name: "Assembles decision package any workflow", desc: "Assembles the decision package for any workflow", complexity: "Medium", type: "Orchestration", deps: "Oracle", status: "In Progress" }, { name: "Applies relevant matrix (the Leave", desc: "applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs)", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }, { name: "Pushes person's channel", desc: "pushes it via the person's channel", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }]
  },
  {
    id: "cy-v9", name: "Continuous Risk & Quality Assurance", kind: "value-add", tier: "Value-add",
    purpose: "Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS.",
    responsibilities: "Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on risk tracking & review; humans own decisions & corrections",
    risks: "Risk owners and reviewers decide; the agent reviews and recommends", nextAction: "",
    subAgents: [{ name: "Maintains operational risk register heat", desc: "Maintains the operational risk register and heat map", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Independently reviews human agent outputs", desc: "independently reviews human and agent outputs against the rules and source", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags errors, omissions rising risks", desc: "flags errors, omissions and rising risks with the fix", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "cy-v11", name: "Wellbeing & Workload-Balance Agent", kind: "value-add", tier: "Value-add",
    purpose: "Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure.",
    responsibilities: "Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time.",
    process: "",
    inputs: [],
    systems: ["The agent ecosystem", "MOCA Smart", "calendars"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human",
    risks: "Managers decide on staffing and cover; the agent surfaces and recommends", nextAction: "",
    subAgents: [{ name: "Monitors task volumes, queue depth", desc: "Monitors task volumes, queue depth and turnaround per person across the agents", complexity: "Medium", type: "Monitoring", deps: "The agent ecosystem", status: "In Progress" }, { name: "Detects overload uneven distribution", desc: "detects overload and uneven distribution", complexity: "Medium", type: "Task", deps: "The agent ecosystem", status: "In Progress" }, { name: "Recommends rebalancing routing routine", desc: "recommends rebalancing and routing routine spikes to automation", complexity: "Medium", type: "Orchestration", deps: "The agent ecosystem", status: "In Progress" }]
  },
  {
    id: "cy-v12", name: "Service-Recipient Experience Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system.",
    responsibilities: "Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback.",
    process: "",
    inputs: [],
    systems: ["The department's systems (on the recipient's behalf)", "MOCA Smart", "voice/chat"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions",
    risks: "Staff handle exceptions; the recipient confirms key submissions", nextAction: "",
    subAgents: [{ name: "Acts recipient's point contact", desc: "Acts as the recipient's point of contact across the department's services", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Provides information exact requirements", desc: "provides information and the exact requirements", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Collects what's needed handles system", desc: "collects what's needed and handles the system work on their behalf where possible", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }]
  },
  {
    id: "cy-v3", name: "Leadership Briefing & Decision-Support Agent", kind: "value-add", tier: "Value-add",
    purpose: "Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule.",
    responsibilities: "Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "dashboards/MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on briefing & analysis; recommendations only",
    risks: "Leadership decides; the agent informs and recommends", nextAction: "",
    subAgents: [{ name: "Assembles cross-function briefings per", desc: "Assembles cross-function briefings per entity", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }, { name: "Highlights what changed, what's risk", desc: "highlights what changed, what's at risk and what needs a decision", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Explains bottlenecks", desc: "explains bottlenecks", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "cy-v5", name: "Proactive Nudge & Deadline Radar", kind: "value-add", tier: "Value-add",
    purpose: "Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "MOCA Smart", "calendar"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Maintains consolidated obligations &", desc: "Maintains a consolidated obligations & compliance calendar across functions", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Tracks status ownership", desc: "tracks status and ownership", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Nudges before due dates", desc: "nudges before due dates", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "cy-v6", name: "Audit-Readiness & Remediation Agent", kind: "value-add", tier: "Value-add",
    purpose: "Move assurance from periodic to continuous and remediate proactively across CSS.",
    responsibilities: "Tests controls and evidence completeness across finance, cyber and legal; remediates or routes remediation for gaps before the audit; verifies retention; pre-assembles audit and sample packs; tracks findings to closure.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "GRC Dashboard", "the audit spine", "SharePoint"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on testing, remediation prep & pack assembly; humans approve fixes & sign-off",
    risks: "Governance, CISO/GRC and auditors own findings & sign-off", nextAction: "",
    subAgents: [{ name: "Tests controls evidence completeness", desc: "Tests controls and evidence completeness across finance, cyber and legal", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Remediates routes remediation gaps before", desc: "remediates or routes remediation for gaps before the audit", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }, { name: "Verifies retention", desc: "verifies retention", complexity: "Medium", type: "Validation", deps: "Oracle (read)", status: "In Progress" }]
  }
];

const COMMS_AGENTS = [
  {
    id: "co-e1", name: "Event Coordination Agent", kind: "core", tier: "Core",
    purpose: "Run events end-to-end in Events Now — from request and provider confirmation through day-of execution to closure — so PMs coordinate, not chase.",
    responsibilities: "Creates the event request and matches venues/providers; drives verification & approval; confirms providers; runs pre-event coordination, the day-of run-sheet and post-event closure; handles security clearance; maintains the annual event plan and department reports.",
    process: "Events & Communication — Event Organisation (request→closure), Security Clearance, Annual Plan, Reports",
    inputs: ["Event concept & date", "venue catalogue", "provider list", "run-sheet", "attendee data"],
    systems: ["Events Now", "Email", "Outlook calendar", "Oracle"],
    outputs: ["Booked event", "confirmed providers", "run-sheet", "closure report", "annual plan"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on matching, coordination & closure; escalate approvals",
    risks: "Director (Event & Communication) and Chief approve; leadership confirms attendance", nextAction: "",
    subAgents: [{ name: "Creates event request matches", desc: "Creates the event request and matches venues/providers", complexity: "Medium", type: "Validation", deps: "Events Now", status: "In Progress" }, { name: "Drives verification & approval", desc: "drives verification & approval", complexity: "Medium", type: "Validation", deps: "Events Now", status: "In Progress" }, { name: "Confirms providers", desc: "confirms providers", complexity: "Medium", type: "Task", deps: "Events Now", status: "In Progress" }]
  },
  {
    id: "co-e2", name: "Creative & Production Agent", kind: "core", tier: "Core",
    purpose: "Coordinate design, motion graphics, video and photography production — briefs in, assets out — keeping the creative team on deadline.",
    responsibilities: "Intakes and triages creative briefs; assigns to designers/producers; tracks production through review and approval; manages versions and delivery; archives assets; coordinates external production companies when required.",
    process: "Events & Communication — Design, Motion Graphics, Video/Photography Production, Social Media",
    inputs: ["Creative brief", "brand assets", "production schedule", "review feedback"],
    systems: ["Adobe Suite", "Figma", "Canva", "Dropbox", "Email"],
    outputs: ["Produced", "reviewed and delivered creative assets", "archive"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on intake, assignment & tracking; humans create and approve",
    risks: "Creative leads review and approve; leadership approves key assets", nextAction: "",
    subAgents: [{ name: "Intakes triages creative briefs", desc: "Intakes and triages creative briefs", complexity: "Medium", type: "Reporting", deps: "Adobe Suite", status: "In Progress" }, { name: "Assigns designers/producers", desc: "assigns to designers/producers", complexity: "Medium", type: "Reporting", deps: "Adobe Suite", status: "In Progress" }, { name: "Tracks production through review approval", desc: "tracks production through review and approval", complexity: "Medium", type: "Monitoring", deps: "Adobe Suite", status: "In Progress" }]
  },
  {
    id: "co-e3", name: "Media & Communications Agent", kind: "core", tier: "Core",
    purpose: "Draft and place communications and watch the coverage — press, circulars, monitoring and speaker support.",
    responsibilities: "Drafts press releases and circulars for review; coordinates publication; monitors media and compiles coverage reports; supports speaker & MC training; archives coverage.",
    process: "Events & Communication — Circulars/Press, Media Monitoring, Coverage Report, Speaker/MC Training",
    inputs: ["Announcement inputs", "media wires", "coverage data", "speaker briefs"],
    systems: ["Email", "Media wires", "Social Media", "SharePoint"],
    outputs: ["Drafted releases/circulars", "coverage reports & sentiment", "speaker support"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on drafting, monitoring & reporting; escalate release approval",
    risks: "Head of News & Coverage and leadership approve releases", nextAction: "",
    subAgents: [{ name: "Drafts press releases circulars review", desc: "Drafts press releases and circulars for review", complexity: "Medium", type: "Drafting", deps: "Email", status: "In Progress" }, { name: "Coordinates publication", desc: "coordinates publication", complexity: "Medium", type: "Orchestration", deps: "Email", status: "In Progress" }, { name: "Monitors media compiles coverage reports", desc: "monitors media and compiles coverage reports", complexity: "Medium", type: "Monitoring", deps: "Email", status: "In Progress" }]
  },
  {
    id: "co-g1", name: "Approval Concierge", kind: "core", tier: "Core",
    purpose: "Deliver every approval as a decision-ready package pushed to the right person — applying the approval matrices so approvers decide in seconds, never hunting in a system. Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS. Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure. Give CSS a natural bilingual voice and chat channel so people can simply talk to it and get answers or action. Continuously gather and analyse feedback across CSS and convert it into prioritised improvement. Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system. Make the manager/requester side of every CSS service effortless and proactive. Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule.",
    responsibilities: "Assembles the decision package for any workflow; applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs); pushes it via the person's channel; takes Q&A in-thread; captures approve/reject/more-info and writes it back to the system of record. Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance. Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time. Handles inbound and outbound voice/chat in AR/EN; answers from the specialist agents; runs vendor and AR follow-up/collection calls and protocol confirmations; authenticates callers; logs outcomes and sentiment; warm-transfers sensitive or binding matters. Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents. Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback. Surfaces pending approvals with context; gives a team view (leave, performance, requests); raises and pre-fills requests; suggests next-best actions and objectives. Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language.",
    process: "Cross-CSS — every approval chain (HR, Procurement, Travel, Finance, Legal, IT, Events, Protocol)",
    inputs: ["The pending decision", "the approval matrix", "supporting documents", "approver channel"],
    systems: ["Oracle", "MOCA Smart", "MOCA APP", "Teams", "Email Oracle (read)", "the agent ecosystem"],
    outputs: ["Pushed decision packages", "captured decisions written back", "full audit trail"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on assembly, delivery & write-back; the human decision is never automated Act-and-notify on risk tracking & review; humans own decisions & corrections Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human Act-and-notify on answering, routine outbound calls & logging; warm-transfer sensitive matters Act-and-notify on collection & analysis; humans own improvements Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions Act-and-notify on assembly, team view & pre-fill; decisions stay human Act-and-notify on briefing & analysis; recommendations only",
    risks: "The matrix-defined approver always decides Risk owners and reviewers decide; the agent reviews and recommends Managers decide on staffing and cover; the agent surfaces and recommends Staff take warm transfers; sensitive/binding matters are human Process owners act on the backlog; management reviews the pulse Staff handle exceptions; the recipient confirms key submissions The manager decides; the companion prepares Leadership decides; the agent informs and recommends", nextAction: "",
    subAgents: [{ name: "Assembles decision package any workflow", desc: "Assembles the decision package for any workflow", complexity: "Medium", type: "Orchestration", deps: "Oracle", status: "In Progress" }, { name: "Applies relevant matrix (the Leave", desc: "applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs)", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }, { name: "Pushes person's channel", desc: "pushes it via the person's channel", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }]
  },
  {
    id: "co-v9", name: "Continuous Risk & Quality Assurance", kind: "value-add", tier: "Value-add",
    purpose: "Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS.",
    responsibilities: "Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on risk tracking & review; humans own decisions & corrections",
    risks: "Risk owners and reviewers decide; the agent reviews and recommends", nextAction: "",
    subAgents: [{ name: "Maintains operational risk register heat", desc: "Maintains the operational risk register and heat map", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Independently reviews human agent outputs", desc: "independently reviews human and agent outputs against the rules and source", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags errors, omissions rising risks", desc: "flags errors, omissions and rising risks with the fix", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "co-v11", name: "Wellbeing & Workload-Balance Agent", kind: "value-add", tier: "Value-add",
    purpose: "Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure.",
    responsibilities: "Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time.",
    process: "",
    inputs: [],
    systems: ["The agent ecosystem", "MOCA Smart", "calendars"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human",
    risks: "Managers decide on staffing and cover; the agent surfaces and recommends", nextAction: "",
    subAgents: [{ name: "Monitors task volumes, queue depth", desc: "Monitors task volumes, queue depth and turnaround per person across the agents", complexity: "Medium", type: "Monitoring", deps: "The agent ecosystem", status: "In Progress" }, { name: "Detects overload uneven distribution", desc: "detects overload and uneven distribution", complexity: "Medium", type: "Task", deps: "The agent ecosystem", status: "In Progress" }, { name: "Recommends rebalancing routing routine", desc: "recommends rebalancing and routing routine spikes to automation", complexity: "Medium", type: "Orchestration", deps: "The agent ecosystem", status: "In Progress" }]
  },
  {
    id: "co-v8", name: "Bilingual Call-Centre Voice Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give CSS a natural bilingual voice and chat channel so people can simply talk to it and get answers or action.",
    responsibilities: "Handles inbound and outbound voice/chat in AR/EN; answers from the specialist agents; runs vendor and AR follow-up/collection calls and protocol confirmations; authenticates callers; logs outcomes and sentiment; warm-transfers sensitive or binding matters.",
    process: "",
    inputs: [],
    systems: ["Telephony/chat platform", "the agent ecosystem", "MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on answering, routine outbound calls & logging; warm-transfer sensitive matters",
    risks: "Staff take warm transfers; sensitive/binding matters are human", nextAction: "",
    subAgents: [{ name: "Handles inbound outbound voice/chat AR/EN", desc: "Handles inbound and outbound voice/chat in AR/EN", complexity: "Medium", type: "Task", deps: "Telephony/chat platform", status: "In Progress" }, { name: "Answers specialist agents", desc: "answers from the specialist agents", complexity: "Medium", type: "Conversational", deps: "Telephony/chat platform", status: "In Progress" }, { name: "Runs vendor AR follow-up/collection calls", desc: "runs vendor and AR follow-up/collection calls and protocol confirmations", complexity: "Medium", type: "Task", deps: "Telephony/chat platform", status: "In Progress" }]
  },
  {
    id: "co-v10", name: "Feedback & Sentiment Agent", kind: "value-add", tier: "Value-add",
    purpose: "Continuously gather and analyse feedback across CSS and convert it into prioritised improvement.",
    responsibilities: "Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents.",
    process: "",
    inputs: [],
    systems: ["MOCA Smart", "survey/chat", "the agent ecosystem", "dashboards"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on collection & analysis; humans own improvements",
    risks: "Process owners act on the backlog; management reviews the pulse", nextAction: "",
    subAgents: [{ name: "Collects lightweight feedback after key", desc: "Collects lightweight feedback after key moments", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }, { name: "Analyses sentiment themes", desc: "analyses sentiment and themes", complexity: "Medium", type: "Reporting", deps: "MOCA Smart", status: "In Progress" }, { name: "Ranks improvement backlog", desc: "ranks an improvement backlog", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }]
  },
  {
    id: "co-v12", name: "Service-Recipient Experience Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system.",
    responsibilities: "Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback.",
    process: "",
    inputs: [],
    systems: ["The department's systems (on the recipient's behalf)", "MOCA Smart", "voice/chat"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions",
    risks: "Staff handle exceptions; the recipient confirms key submissions", nextAction: "",
    subAgents: [{ name: "Acts recipient's point contact", desc: "Acts as the recipient's point of contact across the department's services", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Provides information exact requirements", desc: "provides information and the exact requirements", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Collects what's needed handles system", desc: "collects what's needed and handles the system work on their behalf where possible", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }]
  },
  {
    id: "co-v2", name: "Manager & Requester Companion", kind: "value-add", tier: "Value-add",
    purpose: "Make the manager/requester side of every CSS service effortless and proactive.",
    responsibilities: "Surfaces pending approvals with context; gives a team view (leave, performance, requests); raises and pre-fills requests; suggests next-best actions and objectives.",
    process: "",
    inputs: [],
    systems: ["MOCA APP", "Teams", "the specialist agents"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on assembly, team view & pre-fill; decisions stay human",
    risks: "The manager decides; the companion prepares", nextAction: "",
    subAgents: [{ name: "Surfaces pending approvals context", desc: "Surfaces pending approvals with context", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }, { name: "Gives team view (leave, performance", desc: "gives a team view (leave, performance, requests)", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }, { name: "Raises pre-fills requests", desc: "raises and pre-fills requests", complexity: "Medium", type: "Task", deps: "MOCA APP", status: "In Progress" }]
  },
  {
    id: "co-v3", name: "Leadership Briefing & Decision-Support Agent", kind: "value-add", tier: "Value-add",
    purpose: "Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule.",
    responsibilities: "Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "dashboards/MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on briefing & analysis; recommendations only",
    risks: "Leadership decides; the agent informs and recommends", nextAction: "",
    subAgents: [{ name: "Assembles cross-function briefings per", desc: "Assembles cross-function briefings per entity", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }, { name: "Highlights what changed, what's risk", desc: "highlights what changed, what's at risk and what needs a decision", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Explains bottlenecks", desc: "explains bottlenecks", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "In Progress" }]
  }
];

const PROTOCOL_AGENTS = [
  {
    id: "pt-pr1", name: "Protocol & VIP Coordination Agent", kind: "core", tier: "Core",
    purpose: "Coordinate a flawless VIP visit — from request and pre-visit logistics through reception, escort and farewell to the closure report.",
    responsibilities: "Validates and registers the request; assigns dates in the calendar; coordinates pre-visit logistics (access, parking, seating, site inspection); prepares the visit brief; tracks arrival readiness; supports reception, escort and farewell; produces the closure report and satisfaction request.",
    process: "Protocol — Receiving VIPs & Escort (request→closure→satisfaction)",
    inputs: ["Visit request", "guest list", "calendar", "seating & venue plan", "briefs"],
    systems: ["E-manasa", "Department Calendar", "Email", "Briefing templates"],
    outputs: ["Coordinated visit", "visit brief", "readiness", "closure report", "satisfaction data"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on coordination, briefs & readiness; escalate seating & approvals",
    risks: "Protocol Team Lead approves seating & readiness; Minister's office confirms", nextAction: "",
    subAgents: [{ name: "Validates registers request", desc: "Validates and registers the request", complexity: "Medium", type: "Validation", deps: "E-manasa", status: "In Progress" }, { name: "Assigns dates calendar", desc: "assigns dates in the calendar", complexity: "Medium", type: "Task", deps: "E-manasa", status: "In Progress" }, { name: "Coordinates pre-visit logistics (access,", desc: "coordinates pre-visit logistics (access, parking, seating, site inspection)", complexity: "Medium", type: "Orchestration", deps: "E-manasa", status: "In Progress" }]
  },
  {
    id: "pt-pr2", name: "Airport & Movement Protocol Agent", kind: "core", tier: "Core",
    purpose: "Arrange airport services and secure movements — bookings, permits, escorts and live flight tracking — so VIP arrivals run to the minute.",
    responsibilities: "Validates the airport-service request; selects and books the airport service (Al Majlis/fast-track); coordinates security and vehicle permits; issues movement instructions; monitors flights and adjusts in real time.",
    process: "Protocol — Airport Services (request, booking, security coordination, permits, movement, flight monitoring)",
    inputs: ["Guest & flight details", "airport-service options", "security & vehicle requirements"],
    systems: ["E-manasa", "Airport Service Portal", "Airline website", "Email"],
    outputs: ["Booked airport service", "permits", "movement plan", "live flight tracking"],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on booking, permits & monitoring; escalate security approvals",
    risks: "Protocol Team Lead and Security approve arrangements", nextAction: "",
    subAgents: [{ name: "Validates airport-service request", desc: "Validates the airport-service request", complexity: "Medium", type: "Validation", deps: "E-manasa", status: "In Progress" }, { name: "Selects books airport service (Al", desc: "selects and books the airport service (Al Majlis/fast-track)", complexity: "Medium", type: "Monitoring", deps: "E-manasa", status: "In Progress" }, { name: "Coordinates security vehicle permits", desc: "coordinates security and vehicle permits", complexity: "Medium", type: "Orchestration", deps: "E-manasa", status: "In Progress" }]
  },
  {
    id: "pt-g1", name: "Approval Concierge", kind: "core", tier: "Core",
    purpose: "Deliver every approval as a decision-ready package pushed to the right person — applying the approval matrices so approvers decide in seconds, never hunting in a system. Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS. Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure. Give CSS a natural bilingual voice and chat channel so people can simply talk to it and get answers or action. Continuously gather and analyse feedback across CSS and convert it into prioritised improvement. Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system. Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule. Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Assembles the decision package for any workflow; applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs); pushes it via the person's channel; takes Q&A in-thread; captures approve/reject/more-info and writes it back to the system of record. Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance. Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time. Handles inbound and outbound voice/chat in AR/EN; answers from the specialist agents; runs vendor and AR follow-up/collection calls and protocol confirmations; authenticates callers; logs outcomes and sentiment; warm-transfers sensitive or binding matters. Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents. Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback. Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language. Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "Cross-CSS — every approval chain (HR, Procurement, Travel, Finance, Legal, IT, Events, Protocol)",
    inputs: ["The pending decision", "the approval matrix", "supporting documents", "approver channel"],
    systems: ["Oracle", "MOCA Smart", "MOCA APP", "Teams", "Email Oracle (read)", "the agent ecosystem"],
    outputs: ["Pushed decision packages", "captured decisions written back", "full audit trail"],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Strategic", autonomy: "Act-and-notify on assembly, delivery & write-back; the human decision is never automated Act-and-notify on risk tracking & review; humans own decisions & corrections Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human Act-and-notify on answering, routine outbound calls & logging; warm-transfer sensitive matters Act-and-notify on collection & analysis; humans own improvements Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions Act-and-notify on briefing & analysis; recommendations only Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "The matrix-defined approver always decides Risk owners and reviewers decide; the agent reviews and recommends Managers decide on staffing and cover; the agent surfaces and recommends Staff take warm transfers; sensitive/binding matters are human Process owners act on the backlog; management reviews the pulse Staff handle exceptions; the recipient confirms key submissions Leadership decides; the agent informs and recommends Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Assembles decision package any workflow", desc: "Assembles the decision package for any workflow", complexity: "Medium", type: "Orchestration", deps: "Oracle", status: "In Progress" }, { name: "Applies relevant matrix (the Leave", desc: "applies the relevant matrix (the 25-type Leave Matrix, procurement delegation, the travel chain, finance sign-offs)", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }, { name: "Pushes person's channel", desc: "pushes it via the person's channel", complexity: "Medium", type: "Task", deps: "Oracle", status: "In Progress" }]
  },
  {
    id: "pt-v9", name: "Continuous Risk & Quality Assurance", kind: "value-add", tier: "Value-add",
    purpose: "Match the ecosystem's autonomy with continuous risk management and quality assurance across CSS.",
    responsibilities: "Maintains the operational risk register and heat map; independently reviews human and agent outputs against the rules and source; flags errors, omissions and rising risks with the fix; samples agent actions for governance.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "the audit spine"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on risk tracking & review; humans own decisions & corrections",
    risks: "Risk owners and reviewers decide; the agent reviews and recommends", nextAction: "",
    subAgents: [{ name: "Maintains operational risk register heat", desc: "Maintains the operational risk register and heat map", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Independently reviews human agent outputs", desc: "independently reviews human and agent outputs against the rules and source", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Flags errors, omissions rising risks", desc: "flags errors, omissions and rising risks with the fix", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "pt-v11", name: "Wellbeing & Workload-Balance Agent", kind: "value-add", tier: "Value-add",
    purpose: "Keep the team's workload balanced and sustainable so both service quality and staff wellbeing hold up under pressure.",
    responsibilities: "Monitors task volumes, queue depth and turnaround per person across the agents; detects overload and uneven distribution; recommends rebalancing and routing routine spikes to automation; flags sustained pressure and leave/cover gaps to managers; protects focus time.",
    process: "",
    inputs: [],
    systems: ["The agent ecosystem", "MOCA Smart", "calendars"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on monitoring & rebalancing suggestions; staffing decisions stay human",
    risks: "Managers decide on staffing and cover; the agent surfaces and recommends", nextAction: "",
    subAgents: [{ name: "Monitors task volumes, queue depth", desc: "Monitors task volumes, queue depth and turnaround per person across the agents", complexity: "Medium", type: "Monitoring", deps: "The agent ecosystem", status: "In Progress" }, { name: "Detects overload uneven distribution", desc: "detects overload and uneven distribution", complexity: "Medium", type: "Task", deps: "The agent ecosystem", status: "In Progress" }, { name: "Recommends rebalancing routing routine", desc: "recommends rebalancing and routing routine spikes to automation", complexity: "Medium", type: "Orchestration", deps: "The agent ecosystem", status: "In Progress" }]
  },
  {
    id: "pt-v8", name: "Bilingual Call-Centre Voice Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give CSS a natural bilingual voice and chat channel so people can simply talk to it and get answers or action.",
    responsibilities: "Handles inbound and outbound voice/chat in AR/EN; answers from the specialist agents; runs vendor and AR follow-up/collection calls and protocol confirmations; authenticates callers; logs outcomes and sentiment; warm-transfers sensitive or binding matters.",
    process: "",
    inputs: [],
    systems: ["Telephony/chat platform", "the agent ecosystem", "MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on answering, routine outbound calls & logging; warm-transfer sensitive matters",
    risks: "Staff take warm transfers; sensitive/binding matters are human", nextAction: "",
    subAgents: [{ name: "Handles inbound outbound voice/chat AR/EN", desc: "Handles inbound and outbound voice/chat in AR/EN", complexity: "Medium", type: "Task", deps: "Telephony/chat platform", status: "In Progress" }, { name: "Answers specialist agents", desc: "answers from the specialist agents", complexity: "Medium", type: "Conversational", deps: "Telephony/chat platform", status: "In Progress" }, { name: "Runs vendor AR follow-up/collection calls", desc: "runs vendor and AR follow-up/collection calls and protocol confirmations", complexity: "Medium", type: "Task", deps: "Telephony/chat platform", status: "In Progress" }]
  },
  {
    id: "pt-v10", name: "Feedback & Sentiment Agent", kind: "value-add", tier: "Value-add",
    purpose: "Continuously gather and analyse feedback across CSS and convert it into prioritised improvement.",
    responsibilities: "Collects lightweight feedback after key moments; analyses sentiment and themes; ranks an improvement backlog; reports a satisfaction pulse by function; closes the loop with respondents.",
    process: "",
    inputs: [],
    systems: ["MOCA Smart", "survey/chat", "the agent ecosystem", "dashboards"],
    outputs: [],
    complexity: "Medium", impact: "Medium", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on collection & analysis; humans own improvements",
    risks: "Process owners act on the backlog; management reviews the pulse", nextAction: "",
    subAgents: [{ name: "Collects lightweight feedback after key", desc: "Collects lightweight feedback after key moments", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }, { name: "Analyses sentiment themes", desc: "analyses sentiment and themes", complexity: "Medium", type: "Reporting", deps: "MOCA Smart", status: "In Progress" }, { name: "Ranks improvement backlog", desc: "ranks an improvement backlog", complexity: "Medium", type: "Task", deps: "MOCA Smart", status: "In Progress" }]
  },
  {
    id: "pt-v12", name: "Service-Recipient Experience Agent", kind: "value-add", tier: "Value-add",
    purpose: "Give the department's service recipients a single, proactive point of contact so they never have to chase or learn a system.",
    responsibilities: "Acts as the recipient's point of contact across the department's services; provides information and the exact requirements; collects what's needed and handles the system work on their behalf where possible; pushes status updates at each step; answers questions (with the voice agent); gathers feedback.",
    process: "",
    inputs: [],
    systems: ["The department's systems (on the recipient's behalf)", "MOCA Smart", "voice/chat"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on information, requirements, status & on-behalf handling; escalate exceptions",
    risks: "Staff handle exceptions; the recipient confirms key submissions", nextAction: "",
    subAgents: [{ name: "Acts recipient's point contact", desc: "Acts as the recipient's point of contact across the department's services", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Provides information exact requirements", desc: "provides information and the exact requirements", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }, { name: "Collects what's needed handles system", desc: "collects what's needed and handles the system work on their behalf where possible", complexity: "Medium", type: "Task", deps: "The department's systems (on the recipient's behalf)", status: "In Progress" }]
  },
  {
    id: "pt-v3", name: "Leadership Briefing & Decision-Support Agent", kind: "value-add", tier: "Value-add",
    purpose: "Synthesise the whole of CSS into decision-ready briefings, on demand and on a schedule.",
    responsibilities: "Assembles cross-function briefings per entity; highlights what changed, what's at risk and what needs a decision; explains bottlenecks; answers ad-hoc leadership questions in plain language.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "dashboards/MOCA Smart"],
    outputs: [],
    complexity: "High", impact: "High", feasibility: "Medium",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on briefing & analysis; recommendations only",
    risks: "Leadership decides; the agent informs and recommends", nextAction: "",
    subAgents: [{ name: "Assembles cross-function briefings per", desc: "Assembles cross-function briefings per entity", complexity: "Medium", type: "Orchestration", deps: "Oracle (read)", status: "In Progress" }, { name: "Highlights what changed, what's risk", desc: "highlights what changed, what's at risk and what needs a decision", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Explains bottlenecks", desc: "explains bottlenecks", complexity: "Medium", type: "Conversational", deps: "Oracle (read)", status: "In Progress" }]
  },
  {
    id: "pt-v5", name: "Proactive Nudge & Deadline Radar", kind: "value-add", tier: "Value-add",
    purpose: "Be the authoritative 'what's due and by when' radar for the whole sector.",
    responsibilities: "Maintains a consolidated obligations & compliance calendar across functions; tracks status and ownership; nudges before due dates; feeds the leadership view and the experience concierge.",
    process: "",
    inputs: [],
    systems: ["Oracle (read)", "the agent ecosystem", "MOCA Smart", "calendar"],
    outputs: [],
    complexity: "Medium", impact: "High", feasibility: "High",
    status: "In Progress", priority: "Future Phase", autonomy: "Act-and-notify on surfacing, nudging & tracking; the owner acts",
    risks: "Owners action the items; the radar surfaces and tracks", nextAction: "",
    subAgents: [{ name: "Maintains consolidated obligations &", desc: "Maintains a consolidated obligations & compliance calendar across functions", complexity: "Medium", type: "Task", deps: "Oracle (read)", status: "In Progress" }, { name: "Tracks status ownership", desc: "tracks status and ownership", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }, { name: "Nudges before due dates", desc: "nudges before due dates", complexity: "Medium", type: "Monitoring", deps: "Oracle (read)", status: "In Progress" }]
  }
];

/* -- Departments awaiting their blueprints -------------------------------- */
const LEGAL_AGENTS = [];
const ADMIN_AGENTS = [];
const STRATEGY_AGENTS = [];

const DEPARTMENTS = [
  {
    id: "hr", name: "Human Resources", short: "HR", nameAr: "الموارد البشرية",
    description: "Agentifying the full HR landscape — 7 operating domains and 84 sub-processes across a 9-entity government operating model, now including Performance Management, Contract Renewal and Staff Mobility. 18 core agents (nine tiers) plus 8 recommended value-add agents wrap the human-judgment layer on top of Oracle HCM.",
    owner: "Total Experience Team — Corporate Support Services",
    focal: "Aisha Al Mansoori · Director, HR Transformation",
    lastUpdated: "2026-06-24", agents: HR_AGENTS
  },
  {
    id: "procurement", name: "Procurement", short: "Procurement", nameAr: "المشتريات",
    description: "Procure-to-pay and vendor-management agents — vendor registration, sourcing, bid evaluation, contract drafting, budget-gate approvals and supplier experience — wrapping the human-judgment layer over Oracle, NER and ICP.",
    owner: "Corporate Support Services — Procurement",
    focal: "Mohammed Al Hashimi · Head of Procurement",
    lastUpdated: "2026-06-24", agents: PROCUREMENT_AGENTS
  },
  {
    id: "finance", name: "Finance", short: "Finance", nameAr: "المالية",
    description: "Finance agents — AP/AR, payments, payroll, reconciliations, VAT, budgeting, period-close, IPSAS reporting and finance intelligence — with every payment and close kept human-approved.",
    owner: "Corporate Support Services — Finance",
    focal: "Fatima Al Zaabi · Director of Finance",
    lastUpdated: "2026-06-24", agents: FINANCE_AGENTS
  },
  {
    id: "knowledge", name: "Knowledge & Content", short: "Knowledge", nameAr: "المعرفة والمحتوى",
    description: "One orchestrator coordinating translation & interpretation, content authoring & proofreading, and publishing & documentation — plus the shared Approval Concierge — over Email, Events Now and SharePoint.",
    owner: "Government Communication & Knowledge",
    focal: "Layla Al Hammadi · Head of Knowledge & Content",
    lastUpdated: "2026-06-24", agents: KNOWLEDGE_AGENTS
  },
  {
    id: "it", name: "IT Operations", short: "IT Ops", nameAr: "العمليات التقنية",
    description: "IT service desk, access & identity, and operations & change agents — plus the shared Approval Concierge — keeping IT responsive and controlled, with privileged access human-approved.",
    owner: "Digital & Technology",
    focal: "Khalid Al Suwaidi · Chief Information Officer",
    lastUpdated: "2026-06-24", agents: IT_AGENTS
  },
  {
    id: "cyber", name: "Cyber Security", short: "Cyber", nameAr: "الأمن السيبراني",
    description: "Security Operations (SOC) and Security Clearance & GRC agents — plus the shared Approval Concierge — triaging threats and governance with incident response kept human-decided.",
    owner: "Digital & Technology — Cyber Security",
    focal: "Rashid Al Balushi · Chief Information Security Officer",
    lastUpdated: "2026-06-24", agents: CYBER_AGENTS
  },
  {
    id: "comms", name: "Events & Communication", short: "Events", nameAr: "الفعاليات والاتصال",
    description: "Event coordination, creative & production, and media & communications agents — plus the shared Approval Concierge — with publishing and external messaging human-approved.",
    owner: "Government Communication",
    focal: "Omar Al Marri · Director of Communications",
    lastUpdated: "2026-06-24", agents: COMMS_AGENTS
  },
  {
    id: "protocol", name: "Protocol", short: "Protocol", nameAr: "المراسم",
    description: "Protocol & VIP coordination and airport & movement protocol agents — plus the shared Approval Concierge — orchestrating visits and delegations with judgment kept human.",
    owner: "Office of the Minister — Protocol",
    focal: "Mariam Al Shamsi · Head of Protocol",
    lastUpdated: "2026-06-24", agents: PROTOCOL_AGENTS
  },
  {
    id: "legal", name: "Legal", short: "Legal", nameAr: "الشؤون القانونية",
    description: "Awaiting blueprint — agents will be added once the Legal details are provided.",
    owner: "Legal Affairs", focal: "To be assigned",
    lastUpdated: "2026-06-24", agents: LEGAL_AGENTS
  },
  {
    id: "admin", name: "Admin Services", short: "Admin", nameAr: "الخدمات الإدارية",
    description: "Awaiting blueprint — agents will be added once the Admin Services details are provided.",
    owner: "Corporate Support Services — Administration", focal: "To be assigned",
    lastUpdated: "2026-06-24", agents: ADMIN_AGENTS
  },
  {
    id: "strategy", name: "Strategy", short: "Strategy", nameAr: "الاستراتيجية",
    description: "Awaiting blueprint — agents will be added once the Strategy details are provided.",
    owner: "Strategy & Performance Management", focal: "To be assigned",
    lastUpdated: "2026-06-24", agents: STRATEGY_AGENTS
  }
];

window.DASHBOARD_DATA = { departments: DEPARTMENTS, complexityScore: COMPLEXITY_SCORE };
