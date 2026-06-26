/* =============================================================================
   Agentic Transformation Dashboard — Agent Assistant (chat tester)
   -----------------------------------------------------------------------------
   A grounded conversational assistant that answers from the live agent dataset.
   It knows about everything in the dashboard: agents and their full profiles
   (purpose, responsibilities, process, inputs, systems, outputs, autonomy,
   risks, next action, sub-agents and who they collaborate with), departments,
   Process vs Extras classification, complexity / impact / feasibility / status /
   priority, system dependencies, rankings, focal points and the dashboard's own
   pages. Runs fully client-side — no API key, works on the published link.

   API-READY SEAM
   --------------
   Assistant.config.mode = "local"  -> answers from the dataset (default)
   Assistant.config.mode = "api"    -> POSTs to Assistant.config.endpoint,
                                       expecting { answer: "<html or text>" }.
   ========================================================================== */
(function () {
  "use strict";

  const Assistant = {
    config: { mode: "local", endpoint: "/api/chat", model: "" }
  };

  /* live data (reflects in-session edits if the app exposes it) */
  function D() { return (window.getDashboardData && window.getDashboardData()) || window.DASHBOARD_DATA; }
  const CSCORE = { "Low": 1, "Medium": 2, "High": 3, "Very High": 4 };

  /* ---- formatting helpers (mirror dashboard CSS classes) ---------------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const COLOR = {
    status: { "Ready": "green", "Needs Review": "amber", "In Progress": "blue" },
    complexity: { "Low": "green", "Medium": "blue", "High": "amber", "Very High": "red" },
    level: { "High": "green", "Medium": "amber", "Low": "slate" },
    priority: { "Quick Win": "green", "Strategic": "blue", "Complex": "amber", "Future Phase": "slate" }
  };
  const chip = (label, color, dot) =>
    '<span class="chip chip--' + color + '">' + (dot ? '<span class="chip-dot"></span>' : "") + esc(label) + "</span>";
  const sChip = (s) => chip(s, COLOR.status[s] || "slate", true);
  const cChip = (c) => chip(c, COLOR.complexity[c] || "slate");
  const pChip = (p) => chip(p, COLOR.priority[p] || "slate");
  const oChip = (x) => '<span class="chip chip--outline">' + esc(x) + "</span>";
  const catOf = (a) => (a.kind === "value-add" || /beyond the documented/i.test(a.process || "")) ? "extras" : "process";
  const catChip = (a) => catOf(a) === "extras" ? '<span class="chip chip--gold">Extras</span>' : '<span class="chip chip--brand">Process</span>';
  const aLink = (a) => '<button class="chat-link" data-agent="' + a.id + '">' + esc(a.name) + "</button>";
  const navBtn = (view, label) => '<button class="btn btn--sm" data-nav="' + view + '" style="margin-top:8px">' + esc(label) + "</button>";

  /* ---- dataset helpers -------------------------------------------------- */
  function allAgents() {
    return D().departments.flatMap((d) => d.agents.map((a) => Object.assign({ deptId: d.id, deptName: d.name }, a)));
  }
  function agentById(id) { return allAgents().find((a) => a.id === id) || null; }
  function subsOf(a) { return a.subAgents || []; }
  function totalSubs() { return allAgents().reduce((n, a) => n + subsOf(a).length, 0); }
  function avgComplexity(agents) {
    if (!agents.length) return 0;
    return agents.reduce((s, a) => s + (CSCORE[a.complexity] || 0), 0) / agents.length;
  }
  function readiness(agents) {
    if (!agents.length) return 0;
    const r = agents.filter((a) => a.status === "Ready").length;
    const p = agents.filter((a) => a.status === "In Progress").length;
    const v = agents.filter((a) => a.status === "Needs Review").length;
    return Math.round((r * 100 + p * 55 + v * 35) / agents.length);
  }
  function systemUsage() {
    const map = {};
    allAgents().forEach((a) => (a.systems || []).forEach((s) => {
      const k = s.trim(); if (!k) return; map[k] = (map[k] || 0) + 1;
    }));
    return Object.keys(map).map((k) => ({ label: k, value: map[k] })).sort((a, b) => b.value - a.value);
  }

  const DEPT_SYNONYMS = {
    hr: ["human resources", "people", "hr", "employee", "onboarding", "payroll", "leave"],
    procurement: ["procurement", "purchasing", "sourcing", "vendor", "travel", "tender"],
    finance: ["finance", "financial", "treasury", "accounting", "accounts", "vat", "budget", "payment"],
    knowledge: ["knowledge", "content", "documentation", "translation", "publishing", "authoring"],
    legal: ["legal", "law", "counsel", "contract", "compliance", "regulatory"],
    comms: ["events", "event", "communication", "communications", "comms", "media", "creative", "production"],
    cyber: ["cyber", "cyber security", "cybersecurity", "security", "soc", "grc", "threat"],
    it: ["it operations", "it ops", "information technology", "i.t.", "service desk", "helpdesk", "infrastructure"],
    protocol: ["protocol", "vip", "delegation", "delegations", "visit", "visits", "ceremony"],
    admin: ["admin services", "administration", "admin", "facilities", "workplace", "hospitality", "assets"]
  };
  function findDept(q) {
    const ql = " " + q.toLowerCase() + " ";
    let best = null, bestLen = 0;
    D().departments.forEach((d) => {
      const syns = (DEPT_SYNONYMS[d.id] || []).concat([d.name.toLowerCase(), d.short.toLowerCase()]);
      syns.forEach((s) => {
        if (!s) return;
        const needle = s.length <= 3 ? " " + s + " " : s; // short tokens need word boundary
        if (ql.indexOf(needle) > -1 && s.length > bestLen) { best = d; bestLen = s.length; }
      });
    });
    return best;
  }

  const STOP = ["agent", "agents", "and", "the", "of", "a", "an", "services", "service", "&", "for", "to", "in", "on",
    "hr", "it", "do", "does", "what", "which", "is", "are", "me", "tell", "about", "show", "list", "how", "many"];
  function findAgent(q) {
    const ql = q.toLowerCase();
    let best = null, bestScore = 0;
    allAgents().forEach((a) => {
      const full = a.name.toLowerCase();
      if (ql.indexOf(full) > -1) { best = a; bestScore = 1.01; return; }
      const nameNoSuffix = full.replace(/\s+agent$/, "").replace(/\s+companion$/, "");
      if (nameNoSuffix.length > 6 && ql.indexOf(nameNoSuffix) > -1 && bestScore < 1) { best = a; bestScore = 1.0; return; }
      const toks = full.split(/\W+/).filter((t) => t && STOP.indexOf(t) === -1);
      if (!toks.length) return;
      const hit = toks.filter((t) => t.length > 2 && new RegExp("\\b" + t + "\\b").test(ql));
      const score = hit.length / toks.length;
      if (score >= 0.5 && score > bestScore) { best = a; bestScore = score; }
    });
    return best ? { agent: best, strong: bestScore >= 1 } : null;
  }

  /* ---- answer renderers ------------------------------------------------- */
  function agentLineList(agents, limit) {
    const list = agents.slice(0, limit || 12);
    const more = agents.length - list.length;
    return '<div class="chat-list">' + list.map((a) =>
      '<div class="chat-li"><div class="chat-li__main">' + aLink(a) +
      '<span class="chat-li__dept">' + esc(a.deptName) + "</span></div>" +
      '<div class="chat-li__chips">' + catChip(a) + cChip(a.complexity) + sChip(a.status) + "</div></div>").join("") +
      (more > 0 ? '<div class="chat-more">+ ' + more + " more — refine your question or open the Agents page.</div>" : "") +
      "</div>";
  }
  function rankBars(rows) {
    const max = Math.max.apply(null, rows.map((r) => r.value).concat([1]));
    return '<div class="chat-bars">' + rows.map((r) =>
      '<div class="chat-bar"><span class="chat-bar__l">' + esc(r.label) + "</span>" +
      '<span class="chat-bar__t"><i style="width:' + ((r.value / max) * 100).toFixed(0) + '%"></i></span>' +
      '<b>' + r.value + "</b></div>").join("") + "</div>";
  }
  function chipRow(label, arr) {
    if (!arr || !arr.length) return '<div class="chat-kv"><b>' + esc(label) + ":</b> —</div>";
    return '<div class="chat-kv" style="margin-top:6px"><b>' + esc(label) + ":</b></div>" +
      '<div class="chat-li__chips" style="margin-top:5px">' + arr.map(oChip).join("") + "</div>";
  }
  function agentProfile(a) {
    const talks = (a.talksTo || []).map(agentById).filter(Boolean);
    return '<div class="chat-profile">' +
      '<div class="chat-profile__head">' + aLink(a) + catChip(a) + "</div>" +
      '<div class="chat-profile__meta">' + esc(a.deptName) + " · " + (catOf(a) === "extras" ? "Extras (enhancement)" : "Process — from " + esc(procTag(a))) + "</div>" +
      "<p>" + esc(a.purpose) + "</p>" +
      '<div class="chat-li__chips" style="margin:8px 0">' + cChip(a.complexity) +
        chip("Impact: " + a.impact, COLOR.level[a.impact] || "slate") +
        chip("Feasibility: " + a.feasibility, COLOR.level[a.feasibility] || "slate") +
        sChip(a.status) + pChip(a.priority) + "</div>" +
      (a.systems && a.systems.length ? chipRow("Systems", a.systems) : "") +
      '<div class="chat-kv" style="margin-top:6px"><b>Sub-agents:</b> ' + subsOf(a).length +
        (subsOf(a).length ? " — " + subsOf(a).map((s) => esc(s.name)).join(", ") : "") + "</div>" +
      (talks.length ? '<div class="chat-kv"><b>Speaks to:</b> ' + talks.map(aLink).join(" ") + "</div>" : "") +
      '<div class="chat-kv"><b>Recommended next action:</b> ' + esc(a.nextAction || "—") + "</div>" +
      '<button class="btn btn--sm" data-agent="' + a.id + '" style="margin-top:10px">Open full detail</button>' +
      "</div>";
  }
  // short process tag (mirrors the dashboard card tag)
  function procTag(a) {
    var p = a.process || ""; var i = p.indexOf("—"); if (i >= 0) p = p.slice(i + 1);
    p = p.split(/[(:;]/)[0].trim(); if (p.indexOf(",") >= 0) p = p.split(",")[0].trim();
    if (!p || p.indexOf("/") >= 0 || p.length > 24) return "the documented process";
    return p.charAt(0).toUpperCase() + p.slice(1);
  }
  function subTable(a) {
    const subs = subsOf(a);
    if (!subs.length) return "<p>" + esc(a.name) + " has no sub-agents defined yet.</p>";
    return "<p><b>" + esc(a.name) + "</b> has <b>" + subs.length + "</b> sub-agents:</p>" +
      '<div class="table-wrap" style="margin-top:6px"><table class="subtbl"><thead><tr>' +
      "<th>Sub-Agent</th><th>Type</th><th>Complexity</th><th>Status</th></tr></thead><tbody>" +
      subs.map((s) => "<tr><td><div class=\"sa-name\">" + esc(s.name) + "</div>" +
        '<div class="cell-sub">' + esc(s.desc) + "</div></td>" +
        "<td>" + oChip(s.type) + "</td>" +
        "<td>" + cChip(s.complexity) + "</td><td>" + sChip(s.status) + "</td></tr>").join("") +
      "</tbody></table></div>";
  }
  function agentField(a, field) {
    const head = "<p>" + catChip(a) + " <b>" + esc(a.name) + "</b> · " + esc(a.deptName) + "</p>";
    if (field === "talksTo") {
      const named = (a.talksTo || []).map(agentById).filter(Boolean);
      if (!named.length) return head + "<p>This agent works largely on its own — no direct agent-to-agent links are recorded. You can see all collaboration links on the <b>Agent team</b> view.</p>" + navBtn("mindmap", "Open Agent team");
      return head + "<p>It speaks directly to <b>" + named.length + "</b> other agent" + (named.length > 1 ? "s" : "") + ":</p>" + agentLineList(named) + navBtn("mindmap", "See it on the Agent team map");
    }
    if (field === "systems") return head + chipRow("Systems it relies on", a.systems);
    if (field === "inputs") return head + chipRow("Inputs it needs", a.inputs);
    if (field === "outputs") return head + chipRow("What it produces", a.outputs);
    if (field === "responsibilities") return head + "<p>" + esc(a.responsibilities || a.purpose) + "</p>";
    if (field === "process") return head + "<p><b>Process covered:</b> " + esc(a.process || "—") + "</p>";
    if (field === "autonomy") return head + "<p><b>Autonomy / human-in-the-loop:</b> " + esc(a.autonomy || "—") + "</p>";
    if (field === "risks") return head + "<p><b>Human involvement &amp; dependencies:</b> " + esc(a.risks || "—") + "</p>";
    if (field === "nextAction") return head + "<p><b>Recommended next action:</b> " + esc(a.nextAction || "—") + "</p>";
    if (field === "scores")
      return head + '<div class="chat-li__chips" style="margin-top:6px">' + cChip(a.complexity) +
        chip("Impact: " + a.impact, COLOR.level[a.impact] || "slate") +
        chip("Feasibility: " + a.feasibility, COLOR.level[a.feasibility] || "slate") +
        sChip(a.status) + pChip(a.priority) + "</div>";
    return agentProfile(a);
  }
  function detectField(ql) {
    if (/talk|speak|collaborat|work with|coordinat|connect to|connect with|interact|relationship|depend on each/.test(ql)) return "talksTo";
    if (/system|integrat|platform|software|oracle|sharepoint|govsign|which tools|what tools/.test(ql)) return "systems";
    if (/input|need|require|feed|data in|what goes in/.test(ql)) return "inputs";
    if (/output|produce|deliver|result|generate|create|what comes out/.test(ql)) return "outputs";
    if (/responsib|tasks?|handle|cover\b|in charge/.test(ql)) return "responsibilities";
    if (/process/.test(ql)) return "process";
    if (/autonom|human in the loop|human-in|decision|approve|escalat|oversight|act on its own/.test(ql)) return "autonomy";
    if (/risk|governance|human involve|dependenc/.test(ql)) return "risks";
    if (/next|recommend|action/.test(ql)) return "nextAction";
    if (/impact|feasib|complexity|priority|status|rating|score/.test(ql)) return "scores";
    return null;
  }

  /* ---- intent engine ---------------------------------------------------- */
  function answerLocal(qRaw) {
    const q = (qRaw || "").trim();
    const ql = q.toLowerCase();
    if (!q) return capabilities();

    const has = (re) => re.test(ql);
    const dept = findDept(q);
    const am = findAgent(q);
    const agent = am ? am.agent : null;
    const agentStrong = am ? am.strong : false;
    const agents = allAgents();
    const isCount = has(/how many|number of|count\b|how much|total number/);

    /* greeting / help / capabilities */
    if (has(/^(hi|hello|hey|salam|yo|good (morning|afternoon|evening))\b/) || has(/^help\b/) ||
      has(/what can you (do|answer)|who are you|how do you work|what do you know/) || ql === "?")
      return capabilities();

    /* about the dashboard / how to navigate */
    if (has(/(what|tell me).*(this|the).*(dashboard|website|site|tool|app|platform)/) ||
      has(/what (is|does) this/) || has(/what can i (see|do|find)/) || has(/how (do i|to) (use|navigate|read)/) ||
      has(/what (pages|sections|views|tabs)/) || has(/explain the (dashboard|site|tool)/))
      return dashboardAbout();

    /* Process vs Extras — explain the classification */
    if ((has(/process/) && has(/extra/)) && has(/differ|versus|\bvs\b|between|mean|what.?s the/))
      return explainCats();

    /* AGENT-SPECIFIC answers (only when an agent is clearly the subject) */
    if (agent && (agentStrong || has(/sub.?agent/) || detectField(ql) ||
      has(/about|describe|explain|what does|what is|tell me|purpose|profile|^details|\bdo\b|how does/))) {
      if (has(/sub.?agent/)) return subTable(agent);
      const field = detectField(ql);
      if (field) return agentField(agent, field);
      return agentProfile(agent);
    }

    /* sub-agents (no specific agent) */
    if (has(/sub.?agents?\b/)) {
      if (dept) {
        const d = byDept(dept.id);
        const n = d.agents.reduce((s, a) => s + subsOf(a).length, 0);
        return "<p><b>" + esc(d.name) + "</b> has <b>" + n + "</b> sub-agents across its <b>" + d.agents.length + "</b> main agents.</p>";
      }
      if (has(/type|kind|category/)) {
        const t = {}; allAgents().forEach((a) => subsOf(a).forEach((s) => t[s.type] = (t[s.type] || 0) + 1));
        const rows = Object.keys(t).map((k) => ({ label: k, value: t[k] })).sort((a, b) => b.value - a.value);
        return "<p>The <b>" + totalSubs() + "</b> sub-agents by task type:</p>" + rankBars(rows);
      }
      return "<p>There are <b>" + totalSubs() + "</b> sub-agents in total, nested under <b>" + agents.length +
        "</b> main agents across <b>" + D().departments.length + "</b> departments. Open any agent to see its sub-agents.</p>";
    }

    /* needs review */
    if (has(/needs? review|pending|to review|refine|attention|needs work|awaiting/) ||
      (has(/review/) && !has(/overview/))) {
      let list = agents.filter((a) => a.status === "Needs Review");
      if (dept) list = list.filter((a) => a.deptId === dept.id);
      list.sort((a, b) => CSCORE[b.complexity] - CSCORE[a.complexity]);
      if (!list.length) return "<p>Good news — no agents are currently flagged <b>Needs Review</b>" + (dept ? " in " + esc(dept.name) : "") + ".</p>";
      return "<p><b>" + list.length + "</b> agent" + (list.length > 1 ? "s" : "") + (dept ? " in " + esc(dept.name) : "") +
        " need" + (list.length > 1 ? "" : "s") + " review" + (dept ? "" : ", highest complexity first") + ":</p>" + agentLineList(list);
    }

    /* status: ready / in progress */
    if (has(/\bready\b|live|completed|finished/) && (has(/depart/) || has(/which (department|team)/))) return readinessBars();
    if (has(/\bready\b|completed|finished/)) return statusList("Ready", agents, dept);
    if (has(/in.?progress|ongoing|being built|in development|wip|underway/)) return statusList("In Progress", agents, dept);
    if (has(/which (departments?|teams?) (are )?(ready|complete|furthest)/) || (has(/readiness|how ready/))) return readinessBars();

    /* average complexity */
    if (has(/aver|avg|mean/) && has(/complex/)) {
      if (dept) { const d = byDept(dept.id); return "<p><b>" + esc(d.name) + "</b> has an average complexity of <b>" + avgComplexity(d.agents).toFixed(1) + " / 4</b>.</p>"; }
      return "<p>The average complexity across all <b>" + agents.length + "</b> agents is <b>" + avgComplexity(agents).toFixed(1) + " / 4</b> (1 = Low, 4 = Very High).</p>";
    }

    /* complexity — high / distribution / easiest */
    if (has(/simplest|easiest|low.?complex|least complex/)) {
      let list = agents.filter((a) => a.complexity === "Low"); if (dept) list = list.filter((a) => a.deptId === dept.id);
      return "<p><b>" + list.length + "</b> low-complexity (quick) agents" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
    }
    if (has(/complex|complicated|hardest|difficult|toughest/)) {
      if (dept) {
        const d = byDept(dept.id); const dist = { "Low": 0, "Medium": 0, "High": 0, "Very High": 0 };
        d.agents.forEach((a) => dist[a.complexity]++);
        return "<p><b>" + esc(d.name) + "</b> complexity: " +
          Object.keys(dist).filter((k) => dist[k]).map((k) => cChip(k) + " " + dist[k]).join(" &nbsp; ") +
          " · average <b>" + avgComplexity(d.agents).toFixed(1) + "</b>.</p>";
      }
      const list = agents.filter((a) => a.complexity === "High" || a.complexity === "Very High")
        .sort((a, b) => CSCORE[b.complexity] - CSCORE[a.complexity]);
      return "<p><b>" + list.length + "</b> agents are High or Very-High complexity:</p>" + agentLineList(list);
    }

    /* impact / feasibility */
    if (has(/high.?impact|biggest impact|most impact|high value/)) {
      let list = agents.filter((a) => a.impact === "High"); if (dept) list = list.filter((a) => a.deptId === dept.id);
      return "<p><b>" + list.length + "</b> high-impact agents" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
    }
    if (has(/feasib|easiest to build|quick to deliver|low effort/)) {
      let list = agents.filter((a) => a.feasibility === "High"); if (dept) list = list.filter((a) => a.deptId === dept.id);
      return "<p><b>" + list.length + "</b> highly feasible agents (easiest to deliver)" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
    }

    /* priority buckets */
    if (has(/quick.?win/)) return prioList("Quick Win", agents, dept);
    if (has(/strateg/) && has(/agent|priorit|which/)) return prioList("Strategic", agents, dept);
    if (has(/future|later phase|phase ?[45]|long.?term/)) return prioList("Future Phase", agents, dept);

    /* Process vs Extras lists */
    if (has(/value.?add|extra/) && !has(/differ|versus|between|mean/)) {
      let list = agents.filter((a) => catOf(a) === "extras"); if (dept) list = list.filter((a) => a.deptId === dept.id);
      return "<p><b>" + list.length + "</b> Extras (enhancement) agents" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
    }
    if (has(/process agents?|from the process|documented/) && (has(/list|which|show|how many|process agents?/))) {
      let list = agents.filter((a) => catOf(a) === "process"); if (dept) list = list.filter((a) => a.deptId === dept.id);
      return "<p><b>" + list.length + "</b> Process agents (grounded in the documented processes)" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
    }

    /* systems / integrations */
    const sysTerm = ql.match(/oracle(?:\s*hr)?|oracle ebs|hcm|icp|gpssa|moca smart|moca app|moca|sharepoint|govsign|nextcare|fahr|siem|cmdb|itsm|email|excel|ner|span|epms|events now/);
    if (sysTerm && !agent) {
      const term = sysTerm[0];
      const list = agents.filter((a) => (a.systems || []).join(" ").toLowerCase().indexOf(term) > -1);
      return "<p><b>" + list.length + "</b> agents rely on <b>" + esc(term.replace(/\b\w/g, (c) => c.toUpperCase())) + "</b>:</p>" + agentLineList(list);
    }
    if ((has(/system|integrat|platform|tool/) && has(/list|what|which|all|most|common|used|top|how many|are there/)) && !agent) {
      const rows = systemUsage();
      return "<p>The agents run on <b>" + rows.length + "</b> distinct systems — most-connected first:</p>" + rankBars(rows.slice(0, 12)) +
        (dept ? "" : "<p style=\"margin-top:6px\" class=\"muted\">Ask “which agents use Oracle?” to drill into one.</p>");
    }

    /* collaboration / relationships (general) */
    if (has(/collaborat|talk to each|speak to each|relationship|work together|connected|network|who works with|links between/) && !agent) {
      const links = agents.reduce((n, a) => n + (a.talksTo || []).length, 0) / 2;
      return "<p>Agents that need each other speak directly. There are roughly <b>" + Math.round(links) +
        "</b> agent-to-agent links across the programme. The clearest way to see them is the <b>Agent team</b> map — hover any agent to light up who it works with.</p>" + navBtn("mindmap", "Open Agent team");
    }

    /* focal point / owner / leadership */
    if (has(/focal point|who (owns|leads|runs|heads|is responsible|is in charge|manages)|owner|head of|in charge of|leadership|sponsor/)) {
      if (dept) { const d = byDept(dept.id); return "<p><b>" + esc(d.name) + "</b> — focal point <b>" + esc(d.focal) + "</b>; sits under " + esc(d.owner) + ".</p>"; }
      return "<p>Focal points by department:</p><div class=\"chat-list\">" + D().departments.map((d) =>
        '<div class="chat-li"><div class="chat-li__main"><b>' + esc(d.short) + "</b><span class=\"chat-li__dept\">" + esc(d.focal) + "</span></div></div>").join("") + "</div>";
    }

    /* most agents / ranking / compare */
    if (has(/most sub.?agents|which depart.*sub/)) {
      const rows = D().departments.map((d) => ({ label: d.short, value: d.agents.reduce((s, a) => s + subsOf(a).length, 0) })).sort((a, b) => b.value - a.value);
      return "<p>Sub-agents per department — <b>" + rows[0].label + "</b> leads:</p>" + rankBars(rows);
    }
    if (has(/most|rank|which depart|compare|biggest|largest|fewest|least|smallest|breakdown|distribution|per depart|each depart/) && !has(/sub/)) {
      const rows = D().departments.map((d) => ({ label: d.short, value: d.agents.length })).sort((a, b) => b.value - a.value);
      const asc = has(/fewest|least|smallest/);
      const lead = asc ? rows[rows.length - 1] : rows[0];
      return "<p>Agents per department — <b>" + lead.label + "</b> has the " + (asc ? "fewest" : "most") + " with <b>" + lead.value + "</b>:</p>" + rankBars(rows);
    }

    /* counts / totals */
    if (isCount || (dept && has(/agent/)) || has(/list all|all agents|every agent/)) {
      if (dept) {
        const d = byDept(dept.id); const subs = d.agents.reduce((s, a) => s + subsOf(a).length, 0);
        const proc = d.agents.filter((a) => catOf(a) === "process").length;
        return "<p><b>" + esc(d.name) + "</b> has <b>" + d.agents.length + "</b> main agents (" + proc + " Process · " + (d.agents.length - proc) +
          " Extras) and <b>" + subs + "</b> sub-agents.</p>" + agentLineList(d.agents.map((a) => Object.assign({ deptName: d.name }, a)), 8);
      }
      if (has(/depart/)) return "<p>There are <b>" + D().departments.length + "</b> departments covered: " + D().departments.map((d) => esc(d.short)).join(", ") + ".</p>" + navBtn("departments", "Open Departments");
      if (has(/sub/)) return "<p>There are <b>" + totalSubs() + "</b> sub-agents in total.</p>";
      if (has(/process|extra/)) {
        const proc = agents.filter((a) => catOf(a) === "process").length;
        return "<p>Of <b>" + agents.length + "</b> agents, <b>" + proc + "</b> are <b>Process</b> (from the documented processes) and <b>" + (agents.length - proc) + "</b> are <b>Extras</b> (enhancements).</p>";
      }
      const high = agents.filter((a) => a.complexity === "High" || a.complexity === "Very High").length;
      const rev = agents.filter((a) => a.status === "Needs Review").length;
      const proc = agents.filter((a) => catOf(a) === "process").length;
      return "<p>There are <b>" + agents.length + "</b> main agents across <b>" + D().departments.length +
        "</b> departments, with <b>" + totalSubs() + "</b> sub-agents.</p>" +
        "<p style=\"margin-top:6px\">" + proc + " are Process · " + (agents.length - proc) + " are Extras · " + high +
        " are high-complexity · " + rev + " need review.</p>" + navBtn("agents", "Open Agents");
    }

    /* department overview */
    if (dept) {
      const d = byDept(dept.id); const subs = d.agents.reduce((s, a) => s + subsOf(a).length, 0);
      return "<p><b>" + esc(d.name) + "</b> — " + esc(d.description) + "</p>" +
        "<p style=\"margin-top:8px\"><b>" + d.agents.length + "</b> agents · <b>" + subs + "</b> sub-agents · avg complexity <b>" +
        avgComplexity(d.agents).toFixed(1) + "</b> · readiness <b>" + readiness(d.agents) + "%</b> · focal point " + esc(d.focal) + ".</p>" +
        '<button class="btn btn--sm" data-goto-dept="' + d.id + '" style="margin-top:8px">Open ' + esc(d.name) + "</button>";
    }

    /* fallback: free-text search across everything */
    const ql2 = ql.replace(/[?.!,]/g, "").trim();
    const hits = agents.filter((a) =>
      (a.name + " " + a.purpose + " " + (a.responsibilities || "") + " " + (a.process || "") + " " +
        (a.systems || []).join(" ") + " " + subsOf(a).map((s) => s.name + " " + s.desc).join(" ")).toLowerCase().indexOf(ql2) > -1);
    if (hits.length) return "<p>I found <b>" + hits.length + "</b> agent" + (hits.length > 1 ? "s" : "") + " related to “" + esc(q) + "”:</p>" + agentLineList(hits);
    return "<p>I couldn't find a direct match for “" + esc(q) + "”. I answer from the live dataset — try a department, an agent name, a system (e.g. Oracle), complexity, status, or ask “what can you answer?”.</p>" + suggestionsHTML();
  }

  function byDept(id) { return D().departments.find((x) => x.id === id); }
  function statusList(status, agents, dept) {
    let list = agents.filter((a) => a.status === status); if (dept) list = list.filter((a) => a.deptId === dept.id);
    if (!list.length) return "<p>No agents are currently <b>" + esc(status) + "</b>" + (dept ? " in " + esc(dept.name) : "") + ".</p>";
    return "<p><b>" + list.length + "</b> agent" + (list.length > 1 ? "s are" : " is") + " <b>" + esc(status) + "</b>" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
  }
  function prioList(prio, agents, dept) {
    let list = agents.filter((a) => a.priority === prio); if (dept) list = list.filter((a) => a.deptId === dept.id);
    if (!list.length) return "<p>No <b>" + esc(prio) + "</b> agents" + (dept ? " in " + esc(dept.name) : "") + ".</p>";
    return "<p><b>" + list.length + "</b> " + prio + " agent" + (list.length > 1 ? "s" : "") + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
  }
  function readinessBars() {
    const rows = D().departments.map((d) => ({ label: d.short, value: readiness(d.agents) })).sort((a, b) => b.value - a.value);
    return "<p>Department readiness (Ready = 100%, In Progress = 55%, Needs Review = 35%):</p>" + rankBars(rows);
  }

  function explainCats() {
    const agents = allAgents();
    const proc = agents.filter((a) => catOf(a) === "process").length;
    return "<p><b>Process</b> vs <b>Extras</b> — how every agent is classified:</p>" +
      '<div class="chat-kv"><b>' + catChip({ kind: "core" }) + " Process</b> — grounded in the department's documented processes. Its tag is taken from the process it covers (Onboarding, VAT, Payroll, …). <b>" + proc + "</b> agents.</div>" +
      '<div class="chat-kv" style="margin-top:6px"><b>' + catChip({ kind: "value-add" }) + " Extras</b> — added to enhance the experience, beyond the documented processes (companions, assurance, analytics, …). <b>" + (agents.length - proc) + "</b> agents.</div>";
  }
  function dashboardAbout() {
    const g = { a: allAgents().length, d: D().departments.length, s: totalSubs() };
    return "<p>This is the <b>Agentic Transformation Dashboard</b> for Corporate Support Services — a single place to review the <b>" +
      g.a + "</b> AI agents (and <b>" + g.s + "</b> sub-agents) designed across <b>" + g.d + "</b> departments. The main areas:</p>" +
      '<div class="chat-list">' +
        aboutRow("Overview", "Headline KPIs and a department-by-department summary table.", "overview") +
        aboutRow("Departments", "Each department as a card — agents, sub-agents and readiness.", "departments") +
        aboutRow("Agents", "Every agent in one searchable, filterable table.", "agents") +
        aboutRow("Agent team", "An org-chart / map of the agents — hover one to see who it works with.", "mindmap") +
        aboutRow("Agent assistant", "This chat — ask anything about the agents in plain language.", "assistant") +
      "</div>" +
      "<p style=\"margin-top:8px\">Open any agent for its full profile: purpose, responsibilities, the process it covers, inputs, systems, outputs, autonomy, sub-agents and recommended next action. Agents are tagged <b>Process</b> (from the documented processes) or <b>Extras</b> (enhancements).</p>";
  }
  function aboutRow(title, desc, view) {
    return '<div class="chat-li"><div class="chat-li__main"><button class="chat-link" data-nav="' + view + '">' + esc(title) +
      "</button><span class=\"chat-li__dept\">" + esc(desc) + "</span></div></div>";
  }

  function capabilities() {
    return "<p>I'm the <b>Agent Assistant</b>. I know the whole agent inventory — every agent's purpose, process, systems, inputs/outputs, sub-agents, who they collaborate with, plus complexity, status and priority. Ask me things like:</p>" + suggestionsHTML() +
      "<p style=\"margin-top:8px\" class=\"muted\">Tip: name a department (e.g. Finance), an agent, a system (Oracle), or a quality (high-impact, needs review, quick win) and I'll pull it up.</p>";
  }

  Assistant.suggestions = function () {
    let name = "the Onboarding & Joining Agent";
    try {
      const ag = allAgents();
      const s = ag.find((a) => /onboard/i.test(a.name)) || ag.find((a) => catOf(a) === "process") || ag[0];
      if (s) name = "the " + s.name;
    } catch (e) { /* ignore */ }
    return [
      "How many agents are there in total?",
      "Give me an overview of Finance",
      "What does " + name + " do?",
      "Which agents need review?",
      "Show the high-impact agents",
      "Which agents use Oracle?",
      "What's the difference between Process and Extras?",
      "Who is the focal point for Legal?"
    ];
  };
  function suggestionsHTML() {
    return '<div class="chat-suggest">' + Assistant.suggestions().map((s) =>
      '<button class="chat-chip" data-suggest="' + esc(s) + '">' + esc(s) + "</button>").join("") + "</div>";
  }

  /* ---- public ask (API-ready) ------------------------------------------ */
  Assistant.ask = function (question) {
    if (Assistant.config.mode === "api" && Assistant.config.endpoint) {
      return fetch(Assistant.config.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, model: Assistant.config.model })
      }).then((r) => r.json()).then((j) => ({ html: j.answer || "" }))
        .catch(() => ({ html: answerLocal(question) /* graceful offline fallback */ }));
    }
    return new Promise((resolve) => setTimeout(() => resolve({ html: answerLocal(question) }), 200));
  };

  window.Assistant = Assistant;
})();
