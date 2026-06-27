# Agentic Blueprints — Source Spec for 3 Departments
**For:** preparing full department blueprints (to match the existing 01–10 + Master format)
**Covers:** (1) Total Experience Center, (2) Project Management Office, (3) Sector Head Office *(new)*

> **How to use this:** Give this to Claude and ask it to expand each into a full
> *Agentic Blueprint* in the **same structure and depth as the existing department
> blueprints** (Executive Summary → Landscape → Agent-by-agent detail → Scoring
> matrix → Roadmap), and to add each agent to the **Unified Master** (catalogue,
> hand-offs/seams, the Human-in-the-Loop & Accountability map, and the "one owner
> per capability — no duplicates" boundaries vs existing agents). Keep the same
> per-agent fields: **Purpose · Responsibilities · Process covered · Inputs ·
> Systems · Human in the loop · Expected outputs · Autonomy level**, plus the
> **Complexity / Impact / Feasibility / Effort / ROI / Risk / Phase** matrix and
> **sub-agents**. Every agent follows the standard loop (Sense → validate → reason
> → act-or-ask → notify & log) and the decision gate, and earns autonomy on the
> Ask → Suggest → Act-and-notify ladder.

---

## 1) TOTAL EXPERIENCE CENTER (TX)

**Mandate:** The experience engine of the organisation — owning user & app
experience, service and process experience, employee and vendor experience, the
work environment and overall wellbeing, and following up with every department to
lift satisfaction and continuously enhance their services.
**Owner:** Total Experience Office  **Focal:** Head of Total Experience
**Note for Claude:** the Master already lists 3 governed *care* agents (TX1 Workload
Overload Radar, TX2 Wellbeing & Work-Environment Insights, TX3 Proactive Risk &
Deadline Sentinel) and value-add V10/V11/V12. State the boundaries vs those so a
capability is owned once (e.g., operational wellbeing vs governed care).

### TX-1 · Zero Bureaucracy Agent  — *Complexity High · Impact High · Feasibility Medium · Wave 2 Strategic*
- **Purpose:** Drive the Zero Government Bureaucracy mandate across every department — continuously hunt down redundant steps, approvals, documents and waiting time, and turn each service into the fewest possible steps.
- **Responsibilities:** Maps every service journey across the departments; flags duplicate data requests, unnecessary approvals, redundant documents and dead waiting time; proposes eliminations and merges with an impact estimate; routes each proposal to the owning department and the Zero-Bureaucracy committee; tracks procedures removed, steps cut and time saved.
- **Process covered:** Zero Government Bureaucracy — step elimination, approval reduction, document removal, requirement simplification, time-to-service.
- **Inputs:** Service-journey maps, approval matrices, required-document lists, processing times, customer feedback, every department process.
- **Systems:** MOCA Smart, Oracle, SharePoint, Email.
- **Human in the loop:** Departments and the Zero-Bureaucracy committee approve each removal; nothing is eliminated without sign-off.
- **Expected outputs:** Elimination proposals, simplified service journeys, procedures/steps/approvals removed, time saved, a live bureaucracy-reduction scorecard.
- **Autonomy:** Act-and-notify on detection, analysis and proposals; every elimination decision stays with the owning department and the committee.
- **Sub-agents:** Process X-Ray (decompose each journey into steps/approvals/docs) · Redundancy Detector (flag duplicate data, approvals, documents) · Elimination Proposer (draft removals with effort & time-saved estimate) · Reduction Scorecard (track procedures removed, steps cut, time saved).

### TX-2 · Digital & App Experience Agent  — *Medium · High · Medium · Wave 2*
- **Purpose:** Watch over the experience of every app and digital service we build — catch usability friction, drop-offs, errors and accessibility gaps, and turn them into concrete design fixes before users feel the pain.
- **Responsibilities:** Monitors digital journeys across apps and portals; detects friction, broken flows, slow screens, high drop-off steps; runs accessibility checks against the design system; drafts prioritised UX improvement tickets for product/IT; tracks task-success and ease-of-use over time.
- **Process covered:** Digital & app experience — usability, accessibility, journey analytics, design-system compliance.
- **Inputs:** App & portal analytics, user-session data, accessibility scans, design-system guidelines, support tickets.
- **Systems:** MOCA APP, MOCA Smart, SharePoint, Power BI.
- **Human in the loop:** Product owners and IT decide what ships; the agent recommends, it does not deploy.
- **Expected outputs:** Prioritised UX fixes, accessibility findings, journey-friction reports, task-success metrics.
- **Autonomy:** Act-and-notify on detection, analysis and UX tickets; design/release decisions stay with product and IT.
- **Sub-agents:** Journey Analytics · Accessibility Checker · UX Fix Drafter.

### TX-3 · Service & Process Experience Agent  — *High · High · Medium · Wave 2*
- **Purpose:** Make every service feel effortless — map each service journey end to end, measure how it feels to the people using it, and surface the moments that frustrate so they can be fixed.
- **Responsibilities:** Maps internal/external service journeys; measures CSAT and effort at each touchpoint; flags slow, confusing or repetitive steps; correlates complaints with journey stages; recommends process-experience improvements and routes them to the owning department; tracks the experience score over time.
- **Process covered:** Service & process experience — journey mapping, CSAT/CES, touchpoint analysis, improvement follow-up.
- **Inputs:** Service catalogues, journey maps, satisfaction surveys, complaints, processing times.
- **Systems:** MOCA Smart, Oracle, SharePoint, Power BI.
- **Human in the loop:** Each department owns its service; the agent measures and recommends.
- **Expected outputs:** Service-experience scores, journey pain-point maps, improvement recommendations, trend reports.
- **Autonomy:** Act-and-notify on measurement, analysis and recommendations; service redesign stays with the owning department.
- **Sub-agents:** Journey Mapper · Satisfaction Pulse · Pain-Point Detector.

### TX-4 · Employee Experience & Wellbeing Agent (governed)  — *Medium · High · Medium · Wave 2*
- **Purpose:** Keep a finger on how it feels to work here — read engagement, wellbeing and workload signals at the team level and turn them into supportive, timely actions for managers and HR.
- **Responsibilities:** Aggregates team-level engagement, wellbeing, workload and recognition signals; tracks eNPS and sentiment trends; surfaces supportive nudges to managers; reports themes to HR and leadership; never scores or ranks individuals.
- **Process covered:** Employee experience & wellbeing — engagement, eNPS, wellbeing signals (governed, team-level only).
- **Inputs:** Team-level engagement & pulse surveys, workload signals, recognition data, mobility-interest signals (expectation-passing only).
- **Systems:** Oracle HR, MOCA Smart, Email, Power BI.
- **Human in the loop:** Strictly team-level and governed; HR and managers own every action; individuals are never scored.
- **Expected outputs:** eNPS & sentiment trends, supportive manager nudges, aggregate experience themes.
- **Autonomy:** Act-and-notify on team-level signals and nudges only; never an individual decision; strict governance.
- **Sub-agents:** Engagement Pulse · Wellbeing Signal Reader · Recognition Nudge.

### TX-5 · Vendor Experience & Relations Agent  — *Medium · Medium · Medium · Wave 2*
- **Purpose:** Treat vendors as partners — keep the relationship healthy, the onboarding smooth and the issues resolved, so the people who serve us want to keep doing it well.
- **Responsibilities:** Tracks vendor relationship health and satisfaction; smooths onboarding and the payments experience; monitors SLAs and issue-resolution time; flags at-risk relationships; runs vendor pulse surveys; coordinates with Procurement and Finance to close issues.
- **Process covered:** Vendor experience & relations — vendor satisfaction, onboarding experience, SLA & issue follow-up.
- **Inputs:** Vendor records, onboarding status, SLA & payment data, vendor feedback, issue logs.
- **Systems:** Oracle, NER, ICP, Email.
- **Human in the loop:** Procurement and Finance own the relationship commercially; the agent manages the experience.
- **Expected outputs:** Vendor-satisfaction scores, at-risk-relationship alerts, onboarding-experience reports, resolved issues.
- **Autonomy:** Act-and-notify on monitoring, surveys and follow-up; commercial decisions stay with Procurement and Finance.
- **Sub-agents:** Vendor Pulse · SLA & Issue Tracker · Onboarding Smoother.

### TX-6 · Workplace Environment Agent  — *Low · Medium · High · Wave 1 Quick Win*
- **Purpose:** Make the workplace somewhere people are glad to be — listen to how the environment feels, from facilities to ambiance to space, and turn the feedback into fixes.
- **Responsibilities:** Gathers feedback on the physical/hybrid work environment (facilities, comfort, meeting spaces, amenities); monitors space-utilisation and comfort signals; flags recurring environment issues; routes fixes to Admin Services; tracks workplace satisfaction over time.
- **Process covered:** Workplace environment — facilities feedback, space & comfort, amenities satisfaction.
- **Inputs:** Facilities feedback, space-utilisation data, amenity requests, environment surveys.
- **Systems:** MOCA Smart, SharePoint, Email.
- **Human in the loop:** Admin Services owns the workplace; the agent listens and routes.
- **Expected outputs:** Workplace-satisfaction scores, environment issue lists, improvement requests to Admin.
- **Autonomy:** Act-and-notify on feedback gathering and routing; facilities changes stay with Admin Services.
- **Sub-agents:** Environment Pulse · Space Comfort Monitor · Fix Router.

### TX-7 · Voice-of-Customer & Sentiment Agent  — *High · High · Medium · Wave 2*
- **Purpose:** Hear everyone, everywhere — pull feedback from every channel into one voice, read the sentiment, and surface the rising theme before it becomes a complaint.
- **Responsibilities:** Aggregates feedback across surveys, complaints, support tickets, app reviews and channels; runs sentiment and theme analysis; surfaces the top rising issues per service; alerts the owning department; feeds insights to the other experience agents.
- **Process covered:** Voice of customer — multi-channel feedback aggregation, sentiment & theme analysis, alerting.
- **Inputs:** Surveys, complaints, support tickets, app reviews, channel feedback.
- **Systems:** MOCA Smart, MOCA APP, Power BI, Email.
- **Human in the loop:** Departments own the response; the agent surfaces the signal.
- **Expected outputs:** Unified VoC dashboard, sentiment & theme analysis, rising-issue alerts, insight feeds.
- **Autonomy:** Act-and-notify on aggregation, analysis and alerts; responses stay with the owning department.
- **Sub-agents:** Channel Aggregator · Sentiment & Theme Analyzer · Rising-Issue Alerter.

### TX-8 · Satisfaction & Continuous-Improvement Agent  — *Medium · High · Medium · Wave 2*
- **Purpose:** Close the loop — once an experience issue is found, stay on it: follow up with the owning department, track the improvement to done, and prove satisfaction actually went up.
- **Responsibilities:** Turns experience findings into owned, dated improvement actions; follows up with departments until each action is closed; measures the before/after satisfaction impact; maintains a live experience-improvement scorecard for leadership.
- **Process covered:** Continuous improvement — action tracking, department follow-up, satisfaction impact, scorecard.
- **Inputs:** Experience findings, improvement actions, department owners, before/after satisfaction data.
- **Systems:** MOCA Smart, SharePoint, Email, Power BI.
- **Human in the loop:** Departments deliver the improvement; the agent drives follow-through and measurement.
- **Expected outputs:** Tracked improvement actions, department follow-ups, satisfaction-impact evidence, a live experience scorecard.
- **Autonomy:** Act-and-notify on tracking and follow-up; the improvement itself is delivered by the owning department.
- **Sub-agents:** Action Tracker · Department Follow-up · Impact Scorecard.

---

## 2) PROJECT MANAGEMENT OFFICE (PMO)

**Mandate:** The delivery backbone — planning, prioritising, resourcing and
governing projects across the organisation, with live risk, status and budget
tracking so initiatives land on time, on value and on budget.
**Owner:** Project Management Office (PMO)  **Focal:** Head of PMO
**Note for Claude:** state boundaries vs the Master's value-add **V13 PMO & Outcomes**
(sector-wide initiative/outcome tracking) — the PMO department *runs* delivery;
V13 gives the sector-wide outcomes picture.

### PM-1 · Project Planning & Scheduling Agent  — *High · High · Medium · Wave 2*
- **Purpose:** Turn every initiative into a real plan — build the schedule, the milestones and the dependencies, find the critical path, and keep the timeline honest as things change.
- **Responsibilities:** Drafts plans, WBS, schedules and milestones; maps dependencies and the critical path; detects slippage and re-baselines; keeps each plan current; produces the timeline view for the team and leadership.
- **Process covered:** Planning & scheduling — WBS, milestones, dependencies, critical path, baselining.
- **Inputs:** Project scope, deliverables, team availability, dependencies, milestone dates.
- **Systems:** MS Project, SharePoint, Power BI, Email.
- **Human in the loop:** The project manager owns the plan and commitments; the agent drafts and maintains it.
- **Expected outputs:** Project plans & schedules, milestone & dependency maps, critical-path view, slippage alerts.
- **Autonomy:** Act-and-notify on drafting, scheduling and alerts; scope/date commitments stay with the PM.
- **Sub-agents:** Schedule Builder · Dependency & Critical-Path Mapper · Slippage Watch.

### PM-2 · Portfolio & Prioritisation Agent  — *High · High · Medium · Wave 2*
- **Purpose:** See all projects at once — keep one prioritised portfolio view so leadership funds the right work and nothing important is starved.
- **Responsibilities:** Maintains the portfolio; scores and ranks by value, risk, effort and strategic fit; balances the pipeline; flags conflicts and over-commitment; prepares portfolio reviews for leadership.
- **Process covered:** Portfolio & prioritisation — scoring, ranking, pipeline balance, portfolio reviews.
- **Inputs:** Project list, value & effort estimates, strategic priorities, resource load.
- **Systems:** Power BI, SharePoint, Oracle, Email.
- **Human in the loop:** Leadership decides what to fund; the agent scores and recommends.
- **Expected outputs:** Prioritised portfolio, scoring & ranking, pipeline-balance view, portfolio-review packs.
- **Autonomy:** Act-and-notify on scoring and analysis; funding/prioritisation decisions stay with leadership.
- **Sub-agents:** Project Scorer · Pipeline Balancer · Review Pack Builder.

### PM-3 · Risk & Issue Management Agent  — *Medium · High · High · Wave 1 Quick Win*
- **Purpose:** Stay ahead of trouble — keep a live risk and issue register for every project, push owners to act, and escalate the things that actually threaten delivery.
- **Responsibilities:** Maintains the register per project; assesses likelihood and impact; tracks mitigations and owners; chases overdue actions; escalates high-exposure risks with a decision-ready package.
- **Process covered:** Risk & issue management — register, assessment, mitigation tracking, escalation.
- **Inputs:** Risk & issue logs, mitigation plans, owners, project status.
- **Systems:** SharePoint, Power BI, Email.
- **Human in the loop:** The project board accepts or mitigates risk; the agent tracks and escalates.
- **Expected outputs:** Live risk & issue register, mitigation tracking, escalation packages, risk-trend view.
- **Autonomy:** Act-and-notify on tracking, chasing and escalation; risk-acceptance decisions stay with the board.
- **Sub-agents:** Risk Register · Mitigation Chaser · Escalation Packager.

### PM-4 · Status Reporting & Insights Agent  — *Medium · High · High · Wave 1 Quick Win*
- **Purpose:** Kill the manual status report — assemble RAG status, progress and highlights automatically, so every project tells leadership the truth without a scramble.
- **Responsibilities:** Auto-generates status reports and dashboards; rolls up RAG status, progress, milestones, risks and spend; writes the executive highlight; distributes on schedule; spots projects drifting before the report says so.
- **Process covered:** Status reporting — RAG roll-up, dashboards, executive highlights, distribution.
- **Inputs:** Project plans, actuals, risks, spend, milestone status.
- **Systems:** Power BI, SharePoint, Email.
- **Human in the loop:** The PM validates the status; the agent assembles it.
- **Expected outputs:** Status reports & dashboards, RAG roll-up, executive highlights, drift alerts.
- **Autonomy:** Act-and-notify on report assembly and distribution; the PM owns the narrative.
- **Sub-agents:** RAG Roll-up · Highlight Writer · Drift Detector.

### PM-5 · Resource & Capacity Agent  — *Medium · Medium · Medium · Wave 2*
- **Purpose:** Match people to projects — keep a clear view of who is available, who is overloaded, and where the next capacity crunch is, so plans are staffed realistically.
- **Responsibilities:** Tracks allocation and utilisation across projects; forecasts capacity crunches; flags over/under-allocation; supports resource levelling; coordinates with departments on assignments.
- **Process covered:** Resource & capacity — allocation, utilisation, capacity forecast, levelling.
- **Inputs:** Resource assignments, skills & availability, project demand, utilisation data.
- **Systems:** MS Project, Oracle HR, Power BI.
- **Human in the loop:** Managers assign people; the agent forecasts and recommends.
- **Expected outputs:** Capacity forecast, allocation & utilisation view, over/under-allocation flags, levelling options.
- **Autonomy:** Act-and-notify on analysis and options; assignment decisions stay with managers.
- **Sub-agents:** Capacity Forecaster · Allocation Monitor · Levelling Helper.

### PM-6 · Stakeholder & Governance Agent  — *Medium · Medium · Medium · Wave 2*
- **Purpose:** Keep everyone aligned — prepare steering meetings, manage stakeholder communications and shepherd projects through governance gates so approvals never stall delivery.
- **Responsibilities:** Maps stakeholders and their interests; drafts steering packs and minutes; manages gate reviews and approvals; tracks decisions and actions; keeps stakeholder communications timely and consistent.
- **Process covered:** Stakeholder & governance — steering packs, gate reviews, approvals, decisions & actions.
- **Inputs:** Stakeholder map, governance gates, project status, decision logs.
- **Systems:** SharePoint, GovSign, Email, Power BI.
- **Human in the loop:** The project board decides at each gate; the agent prepares and tracks.
- **Expected outputs:** Steering packs & minutes, gate-review status, tracked decisions & actions, stakeholder updates.
- **Autonomy:** Act-and-notify on preparation, scheduling and tracking; gate/approval decisions stay with the board.
- **Sub-agents:** Steering Pack Builder · Gate Tracker · Decision & Action Log.

### PM-7 · Budget & Benefits Realisation Agent  — *High · High · Medium · Wave 2*
- **Purpose:** Prove the money was worth it — track each project's budget against spend and follow the promised benefits all the way to realised, not just delivered.
- **Responsibilities:** Tracks budgets, commitments and actual spend; forecasts cost at completion; flags overruns early; defines and monitors benefit measures; confirms benefits are realised after go-live; coordinates with Finance.
- **Process covered:** Budget & benefits — budget vs spend, EAC, benefit definition & realisation.
- **Inputs:** Project budgets, commitments & actuals, benefit measures, post-go-live data.
- **Systems:** Oracle, Power BI, SharePoint.
- **Human in the loop:** Finance and the board own the budget; the agent tracks and forecasts.
- **Expected outputs:** Budget vs spend, forecast at completion, overrun alerts, benefits-realisation tracking.
- **Autonomy:** Act-and-notify on tracking, forecasting and alerts; budget decisions stay with Finance and the board.
- **Sub-agents:** Spend Tracker · EAC Forecaster · Benefits Monitor.

### PM-8 · Project Overlap & Synergy Agent  — *High · High · Medium · Wave 2*
- **Purpose:** Stop the organisation paying twice — continuously scan every project and scope of work as it is created, spot the ones that overlap or duplicate, and flag to leadership where teams should join forces, consolidate or reuse instead of rebuilding.
- **Responsibilities:** Reads every new project request and SOW; compares objectives, deliverables, systems, vendors and beneficiaries against the live portfolio; scores similarity and overlap; flags duplicate/near-duplicate efforts; recommends consolidation, shared delivery or reuse and names the teams that should collaborate; estimates the avoided spend; surfaces a decision-ready package to leadership.
- **Process covered:** Overlap & duplication detection — scope comparison, similarity scoring, consolidation & reuse recommendations, avoided-spend estimate.
- **Inputs:** New project requests, scopes of work, the live portfolio, objectives & deliverables, vendors & budgets, beneficiary departments.
- **Systems:** Power BI, SharePoint, Oracle, Email.
- **Human in the loop:** Leadership and the PMO decide whether to consolidate or stop a project; the agent surfaces the overlap and the case.
- **Expected outputs:** Overlap & duplication alerts, similarity scores, consolidation & collaboration recommendations, avoided-spend estimate, leadership decision packages.
- **Autonomy:** Act-and-notify on scanning, matching and recommendations; the merge/stop/fund decision stays with leadership and the PMO.
- **Sub-agents:** Scope Comparator · Similarity Scorer · Consolidation Recommender · Avoided-Spend Estimator.

---

## 3) SECTOR HEAD OFFICE  *(new — please author in full)*

**Mandate:** The office that runs the sector head's leadership rhythm — convening
and preparing the sector leadership meetings, holding the live picture of every
department's milestones, projects and commitments, driving the sector head's
decisions and directives through to closure, and making sure nothing the head
asked for, promised, or needs to know is dropped. It is the *coordination and
follow-through* layer above the departments; it does not run their work, it makes
the sector head effective and keeps the whole sector moving in step.
**Owner:** Office of the Sector Head — Corporate Support Services
**Focal:** Chief of Staff / Director, Sector Head Office
**Boundaries (state these vs existing agents):**
- vs **PMO**: PMO plans and delivers projects; Sector Head Office tracks *the head's* milestones/commitments and the leadership decisions across departments.
- vs **Approval Concierge (G1)**: G1 routes approvals against the matrix; this office tracks the head's *directives and decisions* to done.
- vs **Leadership Briefing (V3)**: V3 is the sector-wide decision-support picture; the Sector Performance agent here is scoped to *the head's meeting and follow-up rhythm* and feeds from V3.

### SH-1 · Sector Meetings & Agenda Agent  — *Medium · High · High · Wave 1 Quick Win*
- **Purpose:** Run a flawless leadership rhythm — convene the sector head's meetings, build the agenda from what's actually open, put a decision-ready pack in front of every attendee, and make sure every decision and action that comes out is captured and chased to done.
- **Responsibilities:** Schedules the recurring and ad-hoc sector leadership/head meetings; assembles the agenda from open actions, department inputs and items needing a decision; collects and packages pre-reads from each department; captures minutes, decisions and owners live; converts every action into a tracked item with an owner and due date; circulates outcomes.
- **Process covered:** Leadership meeting cycle — scheduling, agenda build, pre-read assembly, minutes & decisions, action capture & circulation.
- **Inputs:** Leadership calendar, open-action register, department inputs/pre-reads, prior minutes, decision items.
- **Systems:** Outlook/Calendar, SharePoint, Power BI, Email, GovSign.
- **Human in the loop:** The sector head sets the agenda priorities and chairs; decisions and their wording are the head's; the office prepares and records.
- **Expected outputs:** Confirmed meetings, agendas, pre-read packs, minutes, a live decisions-&-actions log.
- **Autonomy:** Act-and-notify on scheduling, agenda drafting, pack assembly and minute capture; agenda priorities and decisions stay with the head.
- **Sub-agents:** Agenda Builder (assemble agenda from open items + inputs) · Pre-Read Assembler (collect & package department pre-reads) · Minutes & Action Capturer (record decisions, owners, due dates) · Outcome Circulator (distribute minutes and confirm receipt).

### SH-2 · Cross-Department Milestone & Follow-up Agent  — *High · High · Medium · Wave 2 Strategic*
- **Purpose:** Hold the one true picture of where every department is against its milestones and commitments to the sector head — chase the owners, flag slippage early, and escalate what's genuinely at risk before it surprises the head.
- **Responsibilities:** Maintains the master milestone & commitment register across all departments and projects; pulls status from each department and the PMO; compares actual vs committed dates; chases owners for updates; flags slippage and dependency risks; prepares a decision-ready escalation when a milestone is at risk; keeps the head's "what's on track / what's slipping" view current.
- **Process covered:** Cross-department milestone tracking — register, status pull, slippage detection, owner follow-up, escalation.
- **Inputs:** Department milestones & commitments, PMO project status, committed vs actual dates, dependency map, owner list.
- **Systems:** Power BI, SharePoint, MS Project (read from PMO), Email.
- **Human in the loop:** Department heads own their milestones and the recovery plan; the sector head decides on escalations; the agent tracks, chases and surfaces.
- **Expected outputs:** Master milestone register, on-track/slipping view, slippage & dependency alerts, escalation packages.
- **Autonomy:** Act-and-notify on tracking, chasing and flagging; recovery and escalation decisions stay with department heads and the sector head.
- **Sub-agents:** Milestone Register (keep the master list live) · Status Puller (gather status from departments & PMO) · Slippage Flagger (compare actual vs committed, alert) · Escalation Packager (decision-ready package for at-risk items).

### SH-3 · Decisions & Directives Tracker  — *Medium · High · High · Wave 1 Quick Win*
- **Purpose:** Make sure nothing the sector head decides or directs is ever dropped — log every decision and directive, hand it to the right owner with a due date, and follow it through every department until it is genuinely done.
- **Responsibilities:** Captures every decision and directive from meetings, correspondence and ad-hoc instructions; assigns each to an owning department with a clear ask and due date; tracks progress; chases overdue items; reports closure (or the reason it stalled) back to the head; keeps an auditable record of what was asked and what happened.
- **Process covered:** Decision & directive lifecycle — capture, assignment, tracking, chasing, closure, audit trail.
- **Inputs:** Meeting decisions, the head's directives & correspondence, owner assignments, progress updates.
- **Systems:** SharePoint, Power BI, Email, GovSign.
- **Human in the loop:** The sector head issues the decision/directive and accepts closure; owners deliver; the agent records, routes and follows up.
- **Expected outputs:** Live decisions-&-directives register, owner/due-date assignment, overdue chasing, closure reports, audit trail.
- **Autonomy:** Act-and-notify on logging, routing and chasing; the decision itself and sign-off on closure stay with the head and owners.
- **Sub-agents:** Decision Logger (capture & structure each item) · Owner Router (assign to department + due date) · Follow-up Chaser (chase overdue, report status) · Closure Verifier (confirm done, keep the audit trail).

### SH-4 · Executive Correspondence & Briefing Agent  — *Medium · High · Medium · Wave 2 Strategic*
- **Purpose:** Give the sector head a smart draft, never a blank page — prepare correspondence, decision memos, talking points and briefings from the underlying facts, ready for review and signature, with nothing important missed.
- **Responsibilities:** Drafts the head's letters, decision memos, talking points and meeting/engagement briefings; pulls the relevant facts, history and positions from departments and records; tailors tone for the audience; routes for review and e-signature; keeps a clean, searchable record of correspondence and the briefing pack for each engagement.
- **Process covered:** Executive correspondence & briefing — drafting, fact assembly, review routing, signature, record-keeping.
- **Inputs:** Correspondence requests, relevant facts/history, department positions, engagement context, templates.
- **Systems:** SharePoint, GovSign, Email, MOCA Smart.
- **Human in the loop:** The sector head approves and signs every outbound communication and the briefing line; the agent drafts and assembles.
- **Expected outputs:** Drafted correspondence & memos, talking points, engagement briefing packs, signed-and-archived records.
- **Autonomy:** Act-and-notify on drafting, fact assembly and routing; wording, approval and signature stay with the head.
- **Sub-agents:** Fact Assembler (pull facts, history, positions) · Draft Writer (correspondence, memos, talking points) · Briefing Packager (engagement pre-reads) · Signature & Archive Router.

### SH-5 · Sector Performance & Insight Agent  — *High · High · Medium · Wave 2 Strategic*
- **Purpose:** Give the sector head one live, plain-language picture of the whole sector — status, risks, wins and where to put attention this week — pulled together from every department, the PMO and the experience signals.
- **Responsibilities:** Assembles the sector head's live dashboard and weekly one-pager; consolidates KPIs, project status, risks, milestones and experience/satisfaction signals across departments; highlights what needs the head's attention; spots cross-department patterns and emerging risks; prepares the leadership-review narrative.
- **Process covered:** Sector performance & insight — KPI consolidation, weekly one-pager, attention-flagging, leadership-review narrative.
- **Inputs:** Department KPIs & status, PMO portfolio, milestone register, risk register, experience/satisfaction signals.
- **Systems:** Power BI, SharePoint, Email, MOCA Smart.
- **Human in the loop:** The sector head sets the priorities and interprets; the agent assembles the picture and flags, it does not decide.
- **Expected outputs:** Live sector dashboard, weekly one-pager, attention list, emerging-risk flags, review narrative.
- **Autonomy:** Act-and-notify on consolidation, analysis and flagging; interpretation and priorities stay with the head.
- **Sub-agents:** KPI Consolidator (pull & roll up across departments) · One-Pager Composer (weekly leadership summary) · Attention Flagger (what needs the head this week) · Pattern & Risk Spotter (cross-department emerging risks).

### SH-6 · Stakeholder & Engagement Coordination Agent  — *Medium · Medium · Medium · Wave 2 Strategic*
- **Purpose:** Make every engagement the sector head has — with other sectors, leadership and external partners — prepared, well-timed and followed through, so commitments made in the room are never forgotten.
- **Responsibilities:** Maps the head's key stakeholders and engagement cadence; schedules and sequences engagements; ensures each has a briefing pack (from SH-4) and a clear objective; captures commitments made and routes them as tracked actions (to SH-3); follows up on what others committed; keeps the relationship history.
- **Process covered:** Stakeholder & engagement coordination — stakeholder map, scheduling, objective-setting, commitment capture, follow-up.
- **Inputs:** Stakeholder map, engagement calendar, objectives, briefing packs, commitments log.
- **Systems:** Outlook/Calendar, SharePoint, Email, MOCA Smart.
- **Human in the loop:** The sector head sets the relationships and objectives and makes the commitments; the agent prepares, captures and follows up.
- **Expected outputs:** Engagement schedule with objectives, prepared engagements, captured commitments (in & out), follow-up tracking, relationship history.
- **Autonomy:** Act-and-notify on scheduling, preparation and follow-up; relationship and commitment decisions stay with the head.
- **Sub-agents:** Engagement Scheduler · Objective & Brief Setter · Commitment Capturer (route to the decisions tracker) · Reciprocal Follow-up (chase what others committed).

---

### Cross-cutting notes for Claude
- **Hand-offs / seams to add to the Master:** Sector Head Office ↔ every department (milestone status), ↔ PMO (project status & escalations), ↔ Approval Concierge (directives that need approvals), ↔ Leadership Briefing V3 (feeds the sector picture). Show the package handed off at each seam.
- **Human-in-the-Loop map rows to add:** Total Experience → *individual wellbeing concerns* (confidential contact); PMO → *funding, stop/merge, budget* (leadership/Finance/board); Sector Head Office → *every decision, directive and outbound communication* (the sector head).
- **Wave-0 dependencies:** these reuse the shared foundations (master data, least-privilege connectors, approval/delegation matrices, audit spine) — call that out so nothing is rebuilt.
