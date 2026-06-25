# Agentic Transformation Dashboard

An executive dashboard for H.E. and senior leadership to review the AI agents
designed across government departments. The interface follows the
[UAE Government Design System](https://designsystem.gov.ae/guidelines) —
restrained colour, strong spacing, clear hierarchy, accessible contrast,
rounded cards and soft elevation — so it reads as an official UAE government
internal transformation tool rather than a generic SaaS dashboard.

## View it online (GitHub Pages)

This is a static site, so GitHub Pages serves it directly. One-time setup
(needs repo admin): **Settings → Pages → Source: "Deploy from a branch" →
Branch: `claude/nice-allen-uqtnf6` → folder `/ (root)` → Save**. After ~1 minute
the dashboard is live at:

```
https://txlabtesting.github.io/agentified/
```

It re-deploys automatically on every push. (A `.nojekyll` file is included so
all assets are served as-is.)

## Run it locally

No build step, no backend.

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
| **Agent Assistant** | A chat tester to query the agent inventory in plain language. |
| **Settings** | Dataset overview and data actions (export, reset edits). |

## Agent Assistant (chat tester)

A conversational assistant (under **Tools → Agent Assistant**) to quickly test
and explore the agent list. It is **grounded in the live dataset** — including
any in-session edits — so it always reflects exactly what is loaded. Ask things
like:

- *How many agents do we have?* · *Which department has the most agents?*
- *Which agents need review?* · *Show high-complexity agents*
- *Tell me about the Payroll Validation agent* (opens a profile + drawer link)
- *What sub-agents are under Onboarding Orchestration?*
- *Which departments are ready?* · *List the value-add agents*

It runs entirely client-side — no API key — so it works on the published link.

**API-ready:** the engine lives in [`assets/js/assistant.js`](assets/js/assistant.js)
behind a clean seam. To swap in a real LLM later, stand up a small serverless
function that calls the Claude API (key stays server-side), then set:

```js
Assistant.config.mode = "api";
Assistant.config.endpoint = "/api/chat"; // returns { answer: "<html|text>" }
```

The grounded engine remains as an automatic offline fallback.

## Interactions

- **Search** across agents, sub-agents and departments (live).
- **Filter** by type, complexity, status and priority (combinable).
- **Drill down** from KPI charts and the department table into a department, then into an agent.
- **Edit / Update Agent** — an in-session modal to update name, department, complexity,
  impact, feasibility, status, priority, sub-agents, notes and recommended action.
- **Export** the full agent inventory to CSV; **Share** copies the dashboard link.
- Fully **responsive** (desktop → tablet → mobile) with a collapsible sidebar.

## Data

- Every department is authored from its live *Agentic Blueprint* (01–10):
  **Human Resources, Procurement/Travel/Vendor, Finance & Accounting,
  Knowledge & Content, Legal, Events & Communication, Cyber Security,
  IT Operations, Protocol and Admin Services** — each with its real
  complexity / impact / feasibility / phase ratings, purpose,
  responsibilities, systems, autonomy and recommended actions, plus
  derived sub-agents.
- Totals (143 main agents · 427 sub-agents · 10 departments) are computed at
  runtime, so refreshing the data later requires no UI changes.

All data lives in [`assets/js/data.js`](assets/js/data.js); the UI layer is in
[`assets/js/app.js`](assets/js/app.js) and styling tokens in
[`assets/css/styles.css`](assets/css/styles.css).

> Prototype: edits are held in memory for the session only and are not persisted.
