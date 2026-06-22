/* =============================================================================
   Agentic Transformation Dashboard — Agent Assistant (chat tester)
   -----------------------------------------------------------------------------
   A grounded conversational assistant that answers from the live agent dataset
   (counts, breakdowns, complexity/status, agent profiles, sub-agents, systems).
   Runs fully client-side — no API key, works on the published link.

   API-READY SEAM
   --------------
   Assistant.config.mode = "local"  -> answers from the dataset (default)
   Assistant.config.mode = "api"    -> POSTs to Assistant.config.endpoint,
                                       expecting { answer: "<html or text>" }.
   To enable a real LLM later, stand up a small serverless function that calls
   the Claude API (keep the key server-side), point `endpoint` at it, and set
   `mode = "api"`. The grounded path stays as an offline fallback.
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
  const kChip = (k) => k === "value-add" ? '<span class="chip chip--gold">Value-Add</span>' : '<span class="chip chip--brand">Core</span>';
  const aLink = (a) => '<button class="chat-link" data-agent="' + a.id + '">' + esc(a.name) + "</button>";

  /* ---- dataset helpers -------------------------------------------------- */
  function allAgents() {
    return D().departments.flatMap((d) => d.agents.map((a) => Object.assign({ deptId: d.id, deptName: d.name }, a)));
  }
  function subsOf(a) { return a.subAgents || []; }
  function totalSubs() { return allAgents().reduce((n, a) => n + subsOf(a).length, 0); }
  function avgComplexity(agents) {
    if (!agents.length) return 0;
    return agents.reduce((s, a) => s + (CSCORE[a.complexity] || 0), 0) / agents.length;
  }

  const DEPT_SYNONYMS = {
    hr: ["human resources", "hr", "people"],
    procurement: ["procurement", "purchasing", "sourcing", "vendor"],
    finance: ["finance", "financial", "treasury", "accounting"],
    it: ["information technology", "i.t.", "technology", "cyber"],
    legal: ["legal", "law", "counsel"],
    admin: ["admin services", "administration", "admin", "facilities"],
    strategy: ["strategy", "performance management", "portfolio"],
    comms: ["communications", "communication", "comms", "media"]
  };
  function findDept(q) {
    const ql = " " + q.toLowerCase() + " ";
    let best = null, bestLen = 0;
    D().departments.forEach((d) => {
      const syns = (DEPT_SYNONYMS[d.id] || []).concat([d.name.toLowerCase(), (d.nameAr || "")]);
      syns.forEach((s) => {
        if (!s) return;
        const needle = s.length <= 3 ? " " + s + " " : s; // short tokens need word boundary
        if (ql.indexOf(needle) > -1 && s.length > bestLen) { best = d; bestLen = s.length; }
      });
    });
    return best;
  }

  const STOP = ["agent", "and", "the", "of", "a", "an", "services", "service", "&", "for", "to", "hr", "it"];
  function findAgent(q) {
    const ql = q.toLowerCase();
    let best = null, bestScore = 0;
    allAgents().forEach((a) => {
      const full = a.name.toLowerCase();
      if (ql.indexOf(full) > -1) { best = a; bestScore = 1.01; return; }
      const toks = full.split(/\W+/).filter((t) => t && STOP.indexOf(t) === -1);
      if (!toks.length) return;
      const hit = toks.filter((t) => ql.indexOf(t) > -1);
      const score = hit.length / toks.length;
      if (score >= 0.5 && score > bestScore) { best = a; bestScore = score; }
    });
    return best;
  }

  /* ---- answer renderers ------------------------------------------------- */
  function agentLineList(agents, limit) {
    const list = agents.slice(0, limit || 12);
    const more = agents.length - list.length;
    return '<div class="chat-list">' + list.map((a) =>
      '<div class="chat-li"><div class="chat-li__main">' + aLink(a) +
      '<span class="chat-li__dept">' + esc(a.deptName) + "</span></div>" +
      '<div class="chat-li__chips">' + cChip(a.complexity) + sChip(a.status) + "</div></div>").join("") +
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
  function agentProfile(a) {
    return '<div class="chat-profile">' +
      '<div class="chat-profile__head">' + aLink(a) + kChip(a.kind) + "</div>" +
      '<div class="chat-profile__meta">' + esc(a.deptName) + " · " + esc(a.tier) + "</div>" +
      "<p>" + esc(a.purpose) + "</p>" +
      '<div class="chat-li__chips" style="margin:8px 0">' + cChip(a.complexity) +
        chip("Impact: " + a.impact, COLOR.level[a.impact] || "slate") +
        chip("Feasibility: " + a.feasibility, COLOR.level[a.feasibility] || "slate") +
        sChip(a.status) + pChip(a.priority) + "</div>" +
      '<div class="chat-kv"><b>Sub-agents:</b> ' + subsOf(a).length +
        (subsOf(a).length ? " — " + subsOf(a).map((s) => esc(s.name)).join(", ") : "") + "</div>" +
      '<div class="chat-kv"><b>Recommended next action:</b> ' + esc(a.nextAction || "—") + "</div>" +
      '<button class="btn btn--sm" data-agent="' + a.id + '" style="margin-top:10px">Open full detail</button>' +
      "</div>";
  }
  function subTable(a) {
    const subs = subsOf(a);
    if (!subs.length) return "<p>" + esc(a.name) + " has no sub-agents defined yet.</p>";
    return "<p><b>" + esc(a.name) + "</b> has <b>" + subs.length + "</b> sub-agents:</p>" +
      '<div class="table-wrap" style="margin-top:6px"><table class="subtbl"><thead><tr>' +
      "<th>Sub-Agent</th><th>Type</th><th>Complexity</th><th>Status</th></tr></thead><tbody>" +
      subs.map((s) => "<tr><td><div class=\"sa-name\">" + esc(s.name) + "</div>" +
        '<div class="cell-sub">' + esc(s.desc) + "</div></td>" +
        '<td><span class="chip chip--outline">' + esc(s.type) + "</span></td>" +
        "<td>" + cChip(s.complexity) + "</td><td>" + sChip(s.status) + "</td></tr>").join("") +
      "</tbody></table></div>";
  }

  /* ---- intent engine ---------------------------------------------------- */
  function answerLocal(qRaw) {
    const q = (qRaw || "").trim();
    const ql = q.toLowerCase();
    if (!q) return capabilities();

    const has = (re) => re.test(ql);
    const dept = findDept(q);
    const agent = findAgent(q);
    const agents = allAgents();

    /* help / greeting */
    if (has(/^(hi|hello|hey|salam|help|what can you|who are you|how do you work)\b/) || ql === "?")
      return capabilities();

    /* sub-agents */
    if (has(/sub.?agents?\b/)) {
      if (agent) return subTable(agent);
      if (dept) {
        const d = D().departments.find((x) => x.id === dept.id);
        const n = d.agents.reduce((s, a) => s + subsOf(a).length, 0);
        return "<p><b>" + esc(d.name) + "</b> has <b>" + n + "</b> sub-agents across its <b>" + d.agents.length + "</b> main agents.</p>";
      }
      return "<p>There are <b>" + totalSubs() + "</b> sub-agents in total, nested under <b>" + agents.length + "</b> main agents across <b>" + D().departments.length + "</b> departments.</p>";
    }

    /* agent profile — describe / what does X do / explain / about */
    if (agent && (has(/about|describe|explain|what does|what is|tell me|purpose|details?|do\b/) || has(new RegExp("^" + agent.name.toLowerCase().slice(0, 12)))))
      return agentProfile(agent);

    /* needs review */
    if (has(/review|pending|refine|attention|approv|update|needs work/)) {
      let list = agents.filter((a) => a.status === "Needs Review");
      if (dept) list = list.filter((a) => a.deptId === dept.id);
      list.sort((a, b) => CSCORE[b.complexity] - CSCORE[a.complexity]);
      if (!list.length) return "<p>No agents are currently flagged <b>Needs Review</b>" + (dept ? " in " + esc(dept.name) : "") + ".</p>";
      return "<p><b>" + list.length + "</b> agent" + (list.length > 1 ? "s" : "") + (dept ? " in " + esc(dept.name) : "") +
        " need" + (list.length > 1 ? "" : "s") + " review" + (dept ? "" : ", highest complexity first") + ":</p>" + agentLineList(list);
    }

    /* ready departments / readiness */
    if (has(/ready|complete|done/) && has(/depart|which|most/)) {
      const rows = D().departments.map((d) => {
        const ready = d.agents.filter((a) => a.status === "Ready").length;
        const prog = d.agents.filter((a) => a.status === "In Progress").length;
        const rev = d.agents.filter((a) => a.status === "Needs Review").length;
        const r = d.agents.length ? Math.round((ready * 100 + prog * 55 + rev * 35) / d.agents.length) : 0;
        return { label: d.short, value: r };
      }).sort((a, b) => b.value - a.value);
      return "<p>Department readiness (Ready = 100%, In Progress = 55%, Needs Review = 35%):</p>" + rankBars(rows);
    }

    /* average complexity */
    if (has(/aver|avg|mean/) && has(/complex/)) {
      if (dept) {
        const d = D().departments.find((x) => x.id === dept.id);
        return "<p><b>" + esc(d.name) + "</b> has an average complexity of <b>" + avgComplexity(d.agents).toFixed(1) + " / 4</b>.</p>";
      }
      return "<p>The average complexity across all <b>" + agents.length + "</b> agents is <b>" + avgComplexity(agents).toFixed(1) + " / 4</b> (1 = Low, 4 = Very High).</p>";
    }

    /* high complexity / complex agents */
    if (has(/complex|complicated|hardest|difficult|high.?complex/)) {
      if (dept) {
        const d = D().departments.find((x) => x.id === dept.id);
        const dist = { "Low": 0, "Medium": 0, "High": 0, "Very High": 0 };
        d.agents.forEach((a) => dist[a.complexity]++);
        return "<p><b>" + esc(d.name) + "</b> complexity: " +
          Object.keys(dist).filter((k) => dist[k]).map((k) => cChip(k) + " " + dist[k]).join(" &nbsp; ") +
          " · average <b>" + avgComplexity(d.agents).toFixed(1) + "</b>.</p>";
      }
      const list = agents.filter((a) => a.complexity === "High" || a.complexity === "Very High")
        .sort((a, b) => CSCORE[b.complexity] - CSCORE[a.complexity]);
      return "<p><b>" + list.length + "</b> agents are High or Very-High complexity:</p>" + agentLineList(list);
    }

    /* priority buckets */
    if (has(/quick.?win/)) return prioList("Quick Win", agents, dept);
    if (has(/strateg/) && has(/agent|priorit/)) return prioList("Strategic", agents, dept);
    if (has(/future|enhance|later phase/)) return prioList("Future Phase", agents, dept);

    /* value-add */
    if (has(/value.?add|enhanc/)) {
      let list = agents.filter((a) => a.kind === "value-add");
      if (dept) list = list.filter((a) => a.deptId === dept.id);
      return "<p>There are <b>" + list.length + "</b> value-add (enhancement) agents" + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
    }

    /* systems / integrations */
    const sysMatch = ql.match(/oracle|icp|gpssa|moca|sharepoint|nextcare|fahr|erp|siem|cmdb|itsm/);
    if (sysMatch || (has(/system|integrat|connect/) && !dept && !agent)) {
      if (sysMatch) {
        const term = sysMatch[0];
        const list = agents.filter((a) => (a.systems || []).join(" ").toLowerCase().indexOf(term) > -1);
        return "<p><b>" + list.length + "</b> agents connect to <b>" + term.toUpperCase() + "</b>:</p>" + agentLineList(list);
      }
    }

    /* most agents / ranking */
    if (has(/most|rank|which depart|compare|biggest|largest|fewest|least/) && !has(/sub/)) {
      const rows = D().departments.map((d) => ({ label: d.short, value: d.agents.length }))
        .sort((a, b) => b.value - a.value);
      return "<p>Agents per department — <b>" + rows[0].label + "</b> leads with <b>" + rows[0].value + "</b>:</p>" + rankBars(rows);
    }

    /* counts */
    if (has(/how many|number of|count|total/) || (dept && has(/agent/))) {
      if (dept && has(/agent/)) {
        const d = D().departments.find((x) => x.id === dept.id);
        const subs = d.agents.reduce((s, a) => s + subsOf(a).length, 0);
        return "<p><b>" + esc(d.name) + "</b> has <b>" + d.agents.length + "</b> main agents and <b>" + subs + "</b> sub-agents.</p>" + agentLineList(d.agents.map((a) => Object.assign({ deptName: d.name }, a)), 6);
      }
      if (has(/depart/)) return "<p>There are <b>" + D().departments.length + "</b> departments covered: " + D().departments.map((d) => esc(d.short)).join(", ") + ".</p>";
      if (has(/sub/)) return "<p>There are <b>" + totalSubs() + "</b> sub-agents in total.</p>";
      const high = agents.filter((a) => a.complexity === "High" || a.complexity === "Very High").length;
      const rev = agents.filter((a) => a.status === "Needs Review").length;
      return "<p>There are <b>" + agents.length + "</b> main agents across <b>" + D().departments.length +
        "</b> departments, with <b>" + totalSubs() + "</b> sub-agents. <b>" + high + "</b> are high-complexity and <b>" + rev + "</b> need review.</p>";
    }

    /* department overview */
    if (dept) {
      const d = D().departments.find((x) => x.id === dept.id);
      const subs = d.agents.reduce((s, a) => s + subsOf(a).length, 0);
      return "<p><b>" + esc(d.name) + "</b> — " + esc(d.description) + "</p>" +
        "<p style=\"margin-top:8px\"><b>" + d.agents.length + "</b> agents · <b>" + subs + "</b> sub-agents · avg complexity <b>" + avgComplexity(d.agents).toFixed(1) + "</b> · focal point " + esc(d.focal) + ".</p>" +
        '<button class="btn btn--sm" data-goto-dept="' + d.id + '" style="margin-top:8px">Open ' + esc(d.name) + "</button>";
    }

    /* fallback: free-text search */
    const ql2 = ql.replace(/[?.!,]/g, "");
    const hits = agents.filter((a) =>
      (a.name + " " + a.purpose + " " + a.process + " " + subsOf(a).map((s) => s.name + " " + s.desc).join(" ")).toLowerCase().indexOf(ql2) > -1);
    if (hits.length) return "<p>I found <b>" + hits.length + "</b> agent" + (hits.length > 1 ? "s" : "") + " matching “" + esc(q) + "”:</p>" + agentLineList(hits);
    return "<p>I couldn't find a direct match for “" + esc(q) + "”. I answer from the live agent dataset — try asking about counts, a department, a specific agent, complexity, or what needs review.</p>" + suggestionsHTML();
  }

  function prioList(prio, agents, dept) {
    let list = agents.filter((a) => a.priority === prio);
    if (dept) list = list.filter((a) => a.deptId === dept.id);
    return "<p><b>" + list.length + "</b> " + prio + " agent" + (list.length > 1 ? "s" : "") + (dept ? " in " + esc(dept.name) : "") + ":</p>" + agentLineList(list);
  }

  function capabilities() {
    return "<p>I'm the <b>Agent Assistant</b>. I answer from the live agentic-transformation dataset, so you can quickly test the agent list. Ask me things like:</p>" + suggestionsHTML();
  }

  Assistant.suggestions = function () {
    return [
      "How many agents do we have?",
      "Which department has the most agents?",
      "Which agents need review?",
      "Show high-complexity agents",
      "Tell me about the Payroll Validation agent",
      "What sub-agents are under Onboarding Orchestration?",
      "Which departments are ready?",
      "List the value-add agents"
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
    // local grounded engine (slight delay for natural feel)
    return new Promise((resolve) => setTimeout(() => resolve({ html: answerLocal(question) }), 220));
  };

  window.Assistant = Assistant;
})();
