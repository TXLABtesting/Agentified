# Agentic Transformation Dashboard

An executive dashboard for H.E. and senior leadership to review the AI agents
designed across government departments. The interface follows the
[UAE Government Design System](https://designsystem.gov.ae/guidelines) —
restrained colour, strong spacing, clear hierarchy, accessible contrast,
rounded cards and soft elevation — so it reads as an official UAE government
internal transformation tool rather than a generic SaaS dashboard.

## Run it

It is a static prototype — no build step, no backend.

```bash
# from the project root
python3 -m http.server 8099
# then open http://localhost:8099
```

Or simply open `index.html` in a browser.

## What it answers in under two minutes

- How many agents do we have overall, and across how many departments?
- Which departments have the most agents?
- Which agents are complex, and what is the average complexity?
- Which agents need review, update or refinement?
- Which departments are ready?
- What does each agent do, and which sub-agents sit under it?
- What should leadership update or approve next?

## Structure

| Page | What it shows |
|------|---------------|
| **Overview** | Six KPI cards, *agents per department* bar chart, *complexity* donut, *status* distribution, and a sortable department summary table. |
| **Departments** | Department cards with agent/sub-agent counts, complexity distribution and a readiness score. |
| **Department detail** | Department description, headline stats, owner/focal point, and every main agent as a rich card (complexity, impact, feasibility, status, priority, sub-agent count). |
| **Agent detail drawer** | Right-side drawer: purpose, responsibilities, process, inputs, systems, outputs, autonomy, risks/dependencies, recommended next action, and the full sub-agent table. |
| **Agents** | Every agent across departments in one filterable, complexity-sorted table. |
| **Sub-Agents** | Every sub-agent with parent, task type, complexity, dependencies and status. |
| **Pending Review** | Agents flagged *Needs Review*, grouped by department, highest complexity first. |
| **Settings** | Dataset overview and data actions (export, reset edits). |

## Interactions

- **Search** across agents, sub-agents and departments (live).
- **Filter** by type, complexity, status and priority (combinable).
- **Drill down** from KPI charts and the department table into a department, then into an agent.
- **Edit / Update Agent** — an in-session modal to update name, department, complexity,
  impact, feasibility, status, priority, sub-agents, notes and recommended action.
- **Export** the full agent inventory to CSV; **Share** copies the dashboard link.
- Fully **responsive** (desktop → tablet → mobile) with a collapsible sidebar.

## Data

- **Human Resources** is authored from the live *Agentifying HR — Strategic
  Blueprint*: 13 core agents (across six tiers) plus 10 recommended value-add
  agents, with their real complexity / impact / feasibility / phase ratings,
  purpose, responsibilities, systems, autonomy and recommended actions.
- **Procurement, Finance, IT, Legal, Admin Services, Strategy and
  Communications** use realistic mock data, structured identically.
- Totals (53 main agents · 128 sub-agents · 8 departments) are computed at
  runtime, so dropping in real data later requires no UI changes.

All data lives in [`assets/js/data.js`](assets/js/data.js); the UI layer is in
[`assets/js/app.js`](assets/js/app.js) and styling tokens in
[`assets/css/styles.css`](assets/css/styles.css).

> Prototype: edits are held in memory for the session only and are not persisted.
