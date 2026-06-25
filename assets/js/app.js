/* =============================================================================
   Agentic Transformation Dashboard — Application layer
   Vanilla JS (no build step). Hash-routed views, computed KPIs, inline-SVG
   charts, agent detail drawer, edit modal, filtering, search and export.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Working state (in-memory; edits persist for the session) --------- */
  const DATA = JSON.parse(JSON.stringify(window.DASHBOARD_DATA));
  const CSCORE = DATA.complexityScore;
  const STATE = {
    view: "overview",
    deptId: null,
    search: "",
    filters: { complexity: [], status: [], priority: [], kind: [] },
    filterOpen: false,
    chat: [],
    mindDept: "hr",
    mindSubs: true,
    mindLinks: false,
    mindZoom: 1,
    mindFull: false
  };
  let MM_COLLAB = {};   // agentId -> [path strings] for hover highlighting
  let MM_ADJ = {};      // agentId -> { connectedId: true }
  /* expose live (edit-aware) data to the assistant engine */
  window.getDashboardData = function () { return DATA; };

  /* ---- Icon set (inline SVG, 24x24 stroke) ------------------------------ */
  const I = {
    overview:  'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    dept:      'M3 21h18M5 21V7l7-4 7 4v14M9 9h0M9 13h0M9 17h0M15 9h0M15 13h0M15 17h0',
    agents:    'M12 2a5 5 0 015 5v1a5 5 0 01-10 0V7a5 5 0 015-5zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1',
    sub:       'M4 6h16M7 12h13M10 18h10M4 12v6',
    review:    'M12 9v4m0 4h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z',
    settings:  'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z',
    search:    'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.3-4.3',
    filter:    'M3 4h18l-7 8v6l-4 2v-8L3 4z',
    export:    'M12 3v12m0-12l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
    plus:      'M12 5v14M5 12h14',
    chevR:     'M9 6l6 6-6 6',
    chevL:     'M15 6l-6 6 6 6',
    edit:      'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    close:     'M18 6L6 18M6 6l12 12',
    check:     'M20 6L9 17l-5-5',
    calendar:  'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
    layers:    'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5',
    target:    'M12 22a10 10 0 100-20 10 10 0 000 20zm0-4a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 100-4 2 2 0 000 4z',
    pulse:     'M3 12h4l3 8 4-16 3 8h4',
    user:      'M12 12a4 4 0 100-8 4 4 0 000 8zM6 21v-1a6 6 0 0112 0v1',
    bolt:      'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
    doc:       'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6',
    cpu:       'M9 9h6v6H9zM4 9H2m2 6H2m20-6h-2m2 6h-2M9 4V2m6 2V2M9 22v-2m6 2v-2M6 6h12a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1z',
    link:      'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
    input:     'M4 7h16M4 12h10M4 17h7',
    output:    'M14 3h7v7m0-7l-9 9M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5',
    flag:      'M4 21V4m0 0h11l-1.5 4L15 12H4',
    shield:    'M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-4z',
    gauge:     'M12 14a2 2 0 100-4 2 2 0 000 4zm0-10a10 10 0 00-9 14h18A10 10 0 0012 4zm0 0v2m6.5 4.5l-1.4 1.4',
    list:      'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    menu:      'M3 6h18M3 12h18M3 18h18',
    chat:      'M21 11.5a8.4 8.4 0 01-8.5 8.5 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8A8.5 8.5 0 0112.5 3a8.4 8.4 0 018.5 8.5z',
    send:      'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
    spark:     'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17l-1.9-5.1L4.5 10l5.6-1.4L12 3z',
    mindmap:   'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
    db:        'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    mail:      'M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zM2 7l10 6 10-6',
    app:       'M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM10 18h4',
    idcard:    'M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zM7 10a2 2 0 100 4 2 2 0 000-4zM13 10h5M13 14h5M4.5 17a3 3 0 015 0',
    folder:    'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    expand:    'M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m13-5v3a2 2 0 01-2 2h-3',
    shrink:    'M9 3v3a2 2 0 01-2 2H4m16 0h-3a2 2 0 01-2-2V3M4 16h3a2 2 0 012 2v3m6 0v-3a2 2 0 012-2h3'
  };
  function icon(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round"' + (cls ? ' class="' + cls + '"' : '') + '>' +
      '<path d="' + I[name] + '"/></svg>';
  }
  function deptIconName(id) {
    return ({ hr: "user", procurement: "doc", finance: "pulse", knowledge: "folder",
      legal: "idcard", comms: "chat", cyber: "shield", it: "cpu", protocol: "flag",
      admin: "layers", strategy: "target" })[id] || "dept";
  }

  /* ---- Helpers ---------------------------------------------------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const allAgents = () => DATA.departments.flatMap((d) =>
    d.agents.map((a) => Object.assign({ deptId: d.id, deptName: d.name }, a)));
  const findAgent = (id) => allAgents().find((a) => a.id === id);
  const findDept = (id) => DATA.departments.find((d) => d.id === id);
  const subCount = (d) => d.agents.reduce((n, a) => n + (a.subAgents ? a.subAgents.length : 0), 0);

  function fmtDate(s) {
    const d = new Date(s + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ---- Chip renderers --------------------------------------------------- */
  const COLOR = {
    status:     { "Ready": "green", "Needs Review": "amber", "In Progress": "blue" },
    complexity: { "Low": "green", "Medium": "blue", "High": "amber", "Very High": "red" },
    level:      { "High": "green", "Medium": "amber", "Low": "slate" },
    priority:   { "Quick Win": "green", "Strategic": "blue", "Complex": "amber", "Future Phase": "slate" }
  };
  const chip = (label, color, dot) =>
    '<span class="chip chip--' + color + '">' + (dot ? '<span class="chip-dot"></span>' : "") + esc(label) + "</span>";
  const statusChip = (s) => chip(s, COLOR.status[s] || "slate", true);
  const cplxChip = (c) => chip(c, COLOR.complexity[c] || "slate");
  const prioChip = (p) => chip(p, COLOR.priority[p] || "slate");
  const kindChip = (k) => k === "value-add"
    ? '<span class="chip chip--gold">Value-Add</span>'
    : '<span class="chip chip--brand">Core</span>';

  /* ---- Aggregations ----------------------------------------------------- */
  function deptStats(d) {
    const agents = d.agents;
    const subs = subCount(d);
    const cdist = { "Low": 0, "Medium": 0, "High": 0, "Very High": 0 };
    let scoreSum = 0;
    let ready = 0, review = 0, prog = 0;
    agents.forEach((a) => {
      cdist[a.complexity] = (cdist[a.complexity] || 0) + 1;
      scoreSum += CSCORE[a.complexity] || 0;
      if (a.status === "Ready") ready++;
      else if (a.status === "Needs Review") review++;
      else prog++;
    });
    const avg = agents.length ? scoreSum / agents.length : 0;
    // readiness: Ready=100%, In Progress=55%, Needs Review=35%
    const readiness = agents.length
      ? Math.round((ready * 100 + prog * 55 + review * 35) / agents.length) : 0;
    let deptStatus = "In Progress";
    if (!agents.length) deptStatus = "Awaiting";
    else if (review / Math.max(agents.length, 1) >= 0.4) deptStatus = "Needs Review";
    else if (ready / Math.max(agents.length, 1) >= 0.6) deptStatus = "Ready";
    return { count: agents.length, subs, cdist, avg, readiness, ready, review, prog, deptStatus };
  }
  function globalStats() {
    const agents = allAgents();
    const subs = DATA.departments.reduce((n, d) => n + subCount(d), 0);
    const high = agents.filter((a) => a.complexity === "High" || a.complexity === "Very High").length;
    const review = agents.filter((a) => a.status === "Needs Review").length;
    const ready = agents.filter((a) => a.status === "Ready").length;
    const prog = agents.filter((a) => a.status === "In Progress").length;
    const avg = agents.reduce((s, a) => s + (CSCORE[a.complexity] || 0), 0) / Math.max(agents.length, 1);
    return { total: agents.length, depts: DATA.departments.length, subs, high, review, ready, prog, avg };
  }

  /* ---- Charts (inline SVG) --------------------------------------------- */
  function barChart(rows) {
    const max = Math.max.apply(null, rows.map((r) => r.value).concat([1]));
    return '<div class="bchart">' + rows.map((r, i) => {
      const empty = !r.value;
      const w = empty ? 0 : Math.max(5, (r.value / max) * 100);
      return '<button class="brow' + (empty ? " is-empty" : "") + (i === 0 && !empty ? " is-top" : "") +
        '" data-goto-dept="' + r.id + '" tabindex="0">' +
        '<span class="brow__name" title="' + esc(r.label) + '">' + esc(r.label) + "</span>" +
        '<span class="brow__bar"><i style="width:' + w.toFixed(1) + '%"></i></span>' +
        (empty ? '<span class="brow__await">Awaiting</span>' : '<span class="brow__val">' + r.value + "</span>") +
        "</button>";
    }).join("") + "</div>";
  }
  function donut(segments, centerVal, centerLabel) {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const r = 58, c = 2 * Math.PI * r, gap = segments.length > 1 ? 7 : 0;
    let offset = 0;
    const circles = segments.map((s) => {
      const frac = (s.value / total) * c;
      const len = Math.max(0.01, frac - gap);
      const el = '<circle class="donut-seg" cx="80" cy="80" r="' + r + '" fill="none" stroke="' + s.color +
        '" stroke-width="17" stroke-linecap="round" stroke-dasharray="' + len.toFixed(2) + " " + (c - len).toFixed(2) +
        '" stroke-dashoffset="' + (-offset - gap / 2).toFixed(2) + '"></circle>';
      offset += frac;
      return el;
    }).join("");
    return '<div class="donut-wrap"><div class="donut">' +
      '<svg width="158" height="158" viewBox="0 0 160 160">' +
        '<circle cx="80" cy="80" r="' + r + '" fill="none" stroke="var(--line-2)" stroke-width="17"></circle>' +
        circles + "</svg>" +
      '<div class="donut__center"><b>' + centerVal + "</b><span>" + esc(centerLabel) + "</span></div></div>" +
      '<div class="legend">' + segments.map((s) =>
        '<div class="legend__item"><span class="legend__sw" style="background:' + s.color + '"></span>' +
        '<span class="lt">' + esc(s.label) + '</span><span class="lv">' + s.value +
        ' <em>' + Math.round((s.value / total) * 100) + "%</em></span></div>").join("") +
      "</div></div>";
  }
  function stackedStatus(g) {
    const total = g.total || 1;
    const seg = [
      { v: g.ready, c: "var(--green)", l: "Ready" },
      { v: g.prog, c: "var(--blue)", l: "In Progress" },
      { v: g.review, c: "var(--amber)", l: "Needs Review" }
    ];
    return '<div class="statwrap"><div class="stack">' + seg.map((s) =>
      '<span title="' + s.l + ": " + s.v + '" style="width:' + ((s.v / total) * 100).toFixed(1) +
      "%;background:" + s.c + '"></span>').join("") + "</div>" +
      '<div class="statlist">' + seg.map((s) =>
        '<div class="statrow"><span class="statrow__dot" style="background:' + s.c + '"></span>' +
        '<span class="statrow__l">' + s.l + "</span>" +
        '<b class="statrow__v">' + s.v + "</b>" +
        '<span class="statrow__p">' + Math.round((s.v / total) * 100) + "%</span></div>").join("") +
      "</div></div>";
  }
  const CPLX_COLORS = { "Low": "var(--green)", "Medium": "var(--blue)", "High": "var(--amber)", "Very High": "var(--red)" };
  function cdistBar(cdist) {
    const total = Object.values(cdist).reduce((a, b) => a + b, 0) || 1;
    const order = ["Low", "Medium", "High", "Very High"];
    return '<div class="cdist">' + order.map((k) => cdist[k]
      ? '<span title="' + k + ": " + cdist[k] + '" style="width:' + ((cdist[k] / total) * 100) +
        "%;background:" + CPLX_COLORS[k] + '"></span>' : "").join("") + "</div>";
  }

  /* ---- Sidebar / nav ---------------------------------------------------- */
  function renderNav() {
    const g = globalStats();
    const items = [
      { id: "overview", label: "Overview", icon: "overview" },
      { id: "departments", label: "Departments", icon: "dept", count: g.depts },
      { id: "agents", label: "Agents", icon: "agents", count: g.total },
      { id: "subagents", label: "Sub-agents", icon: "sub", count: g.subs },
      { id: "mindmap", label: "Agent team", icon: "mindmap" },
      { id: "review", label: "Pending review", icon: "review", count: g.review },
      { id: "assistant", label: "Agent assistant", icon: "chat" },
      { id: "settings", label: "Settings", icon: "settings" }
    ];
    const active = (STATE.view === "department" ? "departments" : STATE.view);
    $("#nav").innerHTML =
      '<div class="nav__label">Workspace</div>' +
      items.map((it) =>
        '<button class="nav__item' + (active === it.id ? " is-active" : "") + '" data-nav="' + it.id + '">' +
        icon(it.icon) + "<span>" + it.label + "</span>" +
        (it.count != null ? '<span class="nav__count">' + it.count + "</span>" : "") + "</button>").join("");
  }

  /* ---- Header (slim top bar) -------------------------------------------- */
  function breadcrumb() {
    const v = STATE.view;
    const names = { overview: "Overview", departments: "Departments", agents: "Agents",
      subagents: "Sub-agents", mindmap: "Agent team", review: "Pending review", assistant: "Agent assistant", settings: "Settings" };
    if (v === "department") {
      const d = findDept(STATE.deptId);
      return '<button data-nav="departments">Departments</button><span class="sep">·</span>' +
        '<span class="current">' + esc(d ? d.short : "") + "</span>";
    }
    return '<span class="current">' + esc(names[v] || "Overview") + "</span>";
  }
  function renderHeader() {
    const f = STATE.filters;
    const activeFilters = f.complexity.length + f.status.length + f.priority.length + f.kind.length;
    $("#header").innerHTML =
      '<div class="topbar">' +
        '<button class="btn btn--icon btn--ghost menu-toggle" data-menu>' + icon("menu") + "</button>" +
        '<div class="topbar__crumb">' + icon("overview") + breadcrumb() + "</div>" +
        '<div class="search">' + icon("search") +
          '<input id="searchInput" type="search" placeholder="Search departments, agents or sub-agents" value="' +
          esc(STATE.search) + '" autocomplete="off" />' +
        "</div>" +
        '<div class="topbar__actions">' +
          '<div class="has-pop">' +
            '<button class="btn" data-filter-toggle>' + icon("filter") + "Filter" +
              (activeFilters ? '<span class="badge-dot"></span>' : "") + "</button>" +
            filterPopover() +
          "</div>" +
          '<button class="btn" data-export>' + icon("export") + "Export</button>" +
          '<button class="btn btn--primary" data-add>' + icon("plus") + "Add / update agent</button>" +
        "</div>" +
      "</div>";
  }
  function filterPopover() {
    const groups = [
      { key: "kind", title: "Type", opts: ["core", "value-add"], labels: { "core": "Core", "value-add": "Value-Add" } },
      { key: "complexity", title: "Complexity", opts: ["Low", "Medium", "High", "Very High"] },
      { key: "status", title: "Status", opts: ["Ready", "In Progress", "Needs Review"] },
      { key: "priority", title: "Priority", opts: ["Quick Win", "Strategic", "Complex", "Future Phase"] }
    ];
    return '<div class="popover' + (STATE.filterOpen ? " is-open" : "") + '" id="filterPop">' +
      groups.map((g) =>
        '<div class="popover__group"><b>' + g.title + "</b><div class=\"chipset\">" +
        g.opts.map((o) =>
          '<button class="chiptog' + (STATE.filters[g.key].includes(o) ? " is-on" : "") +
          '" data-filter="' + g.key + '" data-val="' + esc(o) + '">' +
          esc(g.labels ? g.labels[o] : o) + "</button>").join("") + "</div></div>").join("") +
      '<div class="popover__foot"><button class="btn btn--sm btn--ghost" data-clear-filters>Reset</button>' +
      '<button class="btn btn--sm btn--primary" data-apply-filters>Done</button></div></div>';
  }

  /* ---- Filtering logic -------------------------------------------------- */
  function agentMatches(a) {
    const f = STATE.filters;
    if (f.kind.length && !f.kind.includes(a.kind)) return false;
    if (f.complexity.length && !f.complexity.includes(a.complexity)) return false;
    if (f.status.length && !f.status.includes(a.status)) return false;
    if (f.priority.length && !f.priority.includes(a.priority)) return false;
    if (STATE.search) {
      const q = STATE.search.toLowerCase();
      const hay = [a.name, a.purpose, a.deptName, a.process,
        (a.subAgents || []).map((s) => s.name + " " + s.desc).join(" ")].join(" ").toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }
  const hasFilters = () => {
    const f = STATE.filters;
    return STATE.search || f.complexity.length || f.status.length || f.priority.length || f.kind.length;
  };

  /* ====================================================================== */
  /*  VIEWS                                                                   */
  /* ====================================================================== */

  function viewOverview() {
    const g = globalStats();
    const kpis = [
      { v: g.total, l: "Total Agents", icon: "agents", cls: "is-violet", sub: g.ready + " ready · " + g.prog + " in progress" },
      { v: g.depts, l: "Departments Covered", icon: "dept", cls: "is-green", sub: "Across corporate & support functions" },
      { v: g.subs, l: "Total Sub-Agents", icon: "sub", cls: "is-blue", sub: "Specialised task agents" },
      { v: g.high, l: "High-Complexity Agents", icon: "bolt", cls: "is-amber", sub: "High & very-high complexity" },
      { v: g.review, l: "Agents Pending Review", icon: "review", cls: "is-rose", sub: "Awaiting leadership decision" },
      { v: g.avg.toFixed(1), l: "Avg. Complexity Score", icon: "gauge", cls: "is-gold", sub: "Scale 1 (Low) – 4 (Very High)" }
    ];
    const kpiHTML = '<div class="kpi-grid">' + kpis.map((k) =>
      '<div class="kpi"><div class="kpi__icon ' + k.cls + '">' + icon(k.icon) + "</div>" +
      '<div class="kpi__value">' + k.v + "</div><div class=\"kpi__label\">" + k.l + "</div>" +
      '<div class="kpi__sub">' + esc(k.sub) + "</div></div>").join("") + "</div>";

    // charts
    const barRows = DATA.departments.map((d) => ({ id: d.id, label: d.short, value: d.agents.length }))
      .sort((a, b) => b.value - a.value);
    const cdistAll = { "Low": 0, "Medium": 0, "High": 0, "Very High": 0 };
    allAgents().forEach((a) => cdistAll[a.complexity]++);
    const donutSeg = [
      { label: "Low", value: cdistAll["Low"], color: CPLX_COLORS["Low"] },
      { label: "Medium", value: cdistAll["Medium"], color: CPLX_COLORS["Medium"] },
      { label: "High", value: cdistAll["High"], color: CPLX_COLORS["High"] },
      { label: "Very High", value: cdistAll["Very High"], color: CPLX_COLORS["Very High"] }
    ].filter((s) => s.value > 0);

    const charts =
      '<div class="charts-grid">' +
        '<div class="card"><div class="card__head"><h3>Agents per Department</h3>' +
          '<span class="hint">Click a bar to drill in</span></div>' +
          '<div class="card__body">' + barChart(barRows) + "</div></div>" +
        '<div class="card"><div class="card__head"><h3>Complexity Distribution</h3></div>' +
          '<div class="card__body">' + donut(donutSeg, g.total, "agents") + "</div></div>" +
        '<div class="card"><div class="card__head"><h3>Status Distribution</h3></div>' +
          '<div class="card__body">' + stackedStatus(g) + "</div></div>" +
      "</div>";

    // department table
    const rows = DATA.departments.map((d) => {
      const s = deptStats(d);
      return '<tr class="clickable" data-goto-dept="' + d.id + '">' +
        '<td><div class="flex items-center gap-3">' +
          '<span class="dept-icon" style="width:34px;height:34px">' + icon(deptIconName(d.id)) + "</span>" +
          '<div><div class="cell-strong">' + esc(d.name) + "</div>" +
          '<div class="cell-sub">' + esc(d.focal) + "</div></div></div></td>" +
        '<td class="td-num cell-strong">' + s.count + "</td>" +
        '<td class="td-num">' + s.subs + "</td>" +
        "<td style=\"min-width:160px\">" + cdistBar(s.cdist) +
          '<div class="cdist-legend">' +
            '<span><i style="background:var(--green)"></i>L ' + s.cdist["Low"] + "</span>" +
            '<span><i style="background:var(--blue)"></i>M ' + s.cdist["Medium"] + "</span>" +
            '<span><i style="background:var(--amber)"></i>H ' + s.cdist["High"] + "</span>" +
            (s.cdist["Very High"] ? '<span><i style="background:var(--red)"></i>VH ' + s.cdist["Very High"] + "</span>" : "") +
          "</div></td>" +
        "<td>" + statusChip(s.deptStatus) + "</td>" +
        "<td><div class=\"readiness\"><div class=\"readiness__bar\"><div class=\"readiness__fill\" style=\"width:" +
          s.readiness + "%\"></div></div>" + s.readiness + "%</div></td>" +
        '<td class="cell-sub nowrap">' + fmtDate(d.lastUpdated) + "</td>" +
        '<td class="right"><button class="btn btn--sm" data-goto-dept="' + d.id + '">View ' + icon("chevR") + "</button></td>" +
      "</tr>";
    }).join("");

    const table =
      '<div class="section"><div class="section__head"><h3>Department Summary</h3>' +
        '<span class="hint">' + DATA.departments.length + " departments · " + g.total + " agents · " + g.subs + " sub-agents</span></div>" +
        '<div class="card"><div class="table-wrap"><table class="tbl"><thead><tr>' +
          "<th>Department</th><th class=\"th-num\">Main Agents</th><th class=\"th-num\">Sub-Agents</th>" +
          "<th>Complexity Distribution</th><th>Status</th><th>Readiness</th><th>Last Updated</th><th></th>" +
        "</tr></thead><tbody>" + rows + "</tbody></table></div></div></div>";

    const head =
      '<div class="page__head page__head--hero">' +
        '<div class="eyebrow">UAE Government · Agentic Transformation Programme</div>' +
        '<h2>Agentic Transformation Dashboard <span class="ar" dir="rtl">لوحة التحوّل الذكي</span></h2>' +
        '<p>Overview of AI agents designed across departments · <span class="muted">Last updated ' +
          fmtDate("2026-06-22") + "</span></p></div>";

    return '<div class="page">' + head + kpiHTML + table + "</div>";
  }

  function viewDepartments() {
    const cards = DATA.departments.map((d) => {
      const s = deptStats(d);
      return '<div class="dept-card" data-goto-dept="' + d.id + '">' +
        '<div class="dept-card__top">' +
          '<span class="dept-icon">' + icon(deptIconName(d.id)) + "</span>" +
          "<div><div class=\"dept-card__name\">" + esc(d.name) +
            '<span class="ar" dir="rtl">' + esc(d.nameAr) + "</span></div>" +
          '<div class="dept-card__owner">' + esc(d.focal) + "</div></div>" +
          '<div class="spacer"></div>' + statusChip(s.deptStatus) +
        "</div>" +
        '<div class="dept-card__stats">' +
          '<div class="mini-stat"><b>' + s.count + "</b><span>Agents</span></div>" +
          '<div class="mini-stat"><b>' + s.subs + "</b><span>Sub-Agents</span></div>" +
          '<div class="mini-stat"><b>' + s.avg.toFixed(1) + "</b><span>Avg. Cplx</span></div>" +
        "</div>" +
        cdistBar(s.cdist) +
        '<div class="cdist-legend">' +
          '<span><i style="background:var(--green)"></i>Low</span>' +
          '<span><i style="background:var(--blue)"></i>Med</span>' +
          '<span><i style="background:var(--amber)"></i>High</span>' +
          (s.cdist["Very High"] ? '<span><i style="background:var(--red)"></i>Very High</span>' : "") +
        "</div>" +
        '<div class="dept-card__foot">' +
          '<div class="readiness"><div class="readiness__bar"><div class="readiness__fill" style="width:' +
            s.readiness + '%"></div></div>' + s.readiness + "% ready</div>" +
          '<button class="btn btn--sm">View details ' + icon("chevR") + "</button>" +
        "</div>" +
      "</div>";
    }).join("");
    return '<div class="page"><div class="page__head"><h2>Departments</h2>' +
      "<p>AI agent coverage across " + DATA.departments.length + " government functions. Select a department to explore its agents.</p></div>" +
      '<div class="dept-grid">' + cards + "</div></div>";
  }

  function viewDepartmentDetail() {
    const d = findDept(STATE.deptId);
    if (!d) return viewDepartments();
    const s = deptStats(d);
    const back = '<button class="backlink" data-nav="overview">' + icon("chevL") + "Back to overview</button>";

    const hero =
      '<div class="card"><div class="card__body">' +
        '<div class="dept-hero">' +
          '<div class="dept-hero__main">' +
            '<div class="dept-hero__head">' +
              '<span class="dept-icon dept-icon--lg">' + icon(deptIconName(d.id)) + "</span>" +
              "<div>" +
                '<div class="flex items-center gap-3" style="flex-wrap:wrap">' +
                  "<h2>" + esc(d.name) + ' <span class="ar" dir="rtl">' + esc(d.nameAr) + "</span></h2>" +
                  statusChip(s.deptStatus) +
                "</div>" +
                '<p class="dept-hero__desc">' + esc(d.description) + "</p>" +
                '<div class="dept-hero__meta">' +
                  '<span class="metaitem">' + icon("user") + esc(d.focal) + "</span>" +
                  '<span class="metaitem">' + icon("calendar") + "<b>Updated</b> " + fmtDate(d.lastUpdated) + "</span>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<div class="dept-hero__stats">' +
            '<div class="mini-stat"><b>' + s.count + "</b><span>Main agents</span></div>" +
            '<div class="mini-stat"><b>' + s.subs + "</b><span>Sub-agents</span></div>" +
            '<div class="mini-stat"><b>' + s.avg.toFixed(1) + "</b><span>Avg complexity</span></div>" +
            '<div class="mini-stat"><b>' + s.review + "</b><span>Needs review</span></div>" +
          "</div>" +
        "</div>" +
        '<div class="dept-readiness">' +
          '<div class="dept-readiness__top"><span>Department readiness</span><b>' + s.readiness + "%</b></div>" +
          '<div class="readiness-track"><i style="width:' + s.readiness + '%"></i></div>' +
        "</div>" +
      "</div></div>";

    const filtered = d.agents.filter((a) => agentMatches(Object.assign({ deptName: d.name }, a)));
    const agentCards = filtered.length ? filtered.map((a) => agentRow(a, d)).join("")
      : (d.agents.length === 0 ? emptyState("Awaiting this department's blueprint", "Agents will appear here once " + esc(d.name) + "'s details are provided.") : emptyState());

    return '<div class="page">' + back + hero +
      '<div class="section"><div class="section__head"><h3>Main agents</h3>' +
        '<span class="hint">' + filtered.length + (hasFilters() && filtered.length !== d.agents.length ? " of " + d.agents.length : "") +
        " agent" + (filtered.length !== 1 ? "s" : "") + " · " + s.subs + " sub-agents</span></div>" +
        '<div class="agent-grid">' + agentCards + "</div></div></div>";
  }

  function agentRow(a, d) {
    const tint = STATUS_TINT[a.status] || ["var(--slate)", "var(--slate-bg)"];
    const sub = d ? d.short : ((findDept(a.deptId) || {}).short || a.deptName || "");
    const proc = ((a.process || a.purpose || "").split(";")[0].split("—")[0].trim()).slice(0, 72);
    const sys = systemsFor(a);
    const shown = sys.slice(0, 4), more = sys.length - shown.length;
    const nSub = a.subAgents ? a.subAgents.length : 0;
    return '<div class="acard" data-agent="' + a.id + '">' +
      '<div class="acard__head">' +
        '<span class="acard__logo" style="color:' + tint[0] + ";background:" + tint[1] + '">' + icon("cpu") + "</span>" +
        '<div class="acard__ttl"><h4>' + esc(a.name) + "</h4>" +
          '<span class="acard__sub">' + esc(sub) + "</span></div>" +
        '<span class="acard__time"><i style="background:' + tint[0] + '"></i>' + esc(a.status) + "</span>" +
      "</div>" +
      '<div class="acard__tags">' +
        '<span class="acard__tag">' + esc(a.priority) + "</span>" +
        '<span class="acard__tag is-kind">' + (a.kind === "value-add" ? "Value-Add" : "Core") + "</span>" +
      "</div>" +
      '<div class="acard__panel">' +
        '<div class="acard__info">' +
          (proc ? '<div class="acard__inforow">' + icon("layers") + "<span>" + esc(proc) + "</span></div>" : "") +
          '<div class="acard__inforow">' + icon("gauge") + "<span>" + esc(a.complexity) + " complexity · " + esc(a.impact) + " impact · " + esc(a.feasibility) + " feasibility</span></div>" +
        "</div>" +
        '<div class="acard__skills">' +
          shown.map((x) => '<span class="acard__skill">' + esc(x.label) + "</span>").join("") +
          (more > 0 ? '<span class="acard__skill is-more">+' + more + "</span>" : "") +
          '<span class="acard__skill is-sub">' + icon("sub") + " " + nSub + " sub-agents</span>" +
        "</div>" +
      "</div>" +
      '<div class="acard__cta">' +
        '<button class="acard__apply" data-agent="' + a.id + '">View details ' + icon("chevR") + "</button>" +
        '<button class="acard__save" data-edit="' + a.id + '" title="Edit">' + icon("edit") + "</button>" +
      "</div>" +
    "</div>";
  }

  function viewAgents() {
    const list = allAgents().filter(agentMatches)
      .sort((a, b) => (CSCORE[b.complexity] - CSCORE[a.complexity]) || a.name.localeCompare(b.name));
    const rows = list.length ? list.map((a) =>
      '<tr class="clickable" data-agent="' + a.id + '">' +
        '<td><div class="cell-strong">' + esc(a.name) + "</div>" +
          '<div class="cell-sub">' + esc(a.purpose.slice(0, 78)) + (a.purpose.length > 78 ? "…" : "") + "</div></td>" +
        "<td>" + esc(a.deptName) + "</td>" +
        "<td>" + kindChip(a.kind) + "</td>" +
        "<td>" + cplxChip(a.complexity) + "</td>" +
        '<td class="cell-sub">' + esc(a.impact) + "</td>" +
        '<td class="cell-sub">' + esc(a.feasibility) + "</td>" +
        "<td>" + prioChip(a.priority) + "</td>" +
        "<td>" + statusChip(a.status) + "</td>" +
        '<td class="td-num">' + (a.subAgents ? a.subAgents.length : 0) + "</td>" +
        '<td class="right"><button class="btn btn--sm btn--icon" data-edit="' + a.id + '">' + icon("edit") + "</button></td>" +
      "</tr>").join("") : '<tr><td colspan="10">' + emptyState() + "</td></tr>";
    return '<div class="page"><div class="page__head"><h2>All Agents</h2>' +
      "<p>" + list.length + " agent" + (list.length !== 1 ? "s" : "") +
      (hasFilters() ? " matching your search and filters" : " across all departments") + ". Sorted by complexity.</p></div>" +
      '<div class="card"><div class="table-wrap"><table class="tbl"><thead><tr>' +
        "<th>Agent</th><th>Department</th><th>Type</th><th>Complexity</th><th>Impact</th><th>Feasibility</th>" +
        "<th>Priority</th><th>Status</th><th class=\"th-num\">Subs</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div></div></div>";
  }

  function viewSubAgents() {
    let subs = [];
    DATA.departments.forEach((d) => d.agents.forEach((a) =>
      (a.subAgents || []).forEach((s) => subs.push(Object.assign({}, s, {
        parent: a.name, parentId: a.id, deptName: d.name
      })))));
    if (STATE.search) {
      const q = STATE.search.toLowerCase();
      subs = subs.filter((s) => (s.name + " " + s.desc + " " + s.parent + " " + s.deptName + " " + s.type).toLowerCase().indexOf(q) > -1);
    }
    if (STATE.filters.complexity.length) subs = subs.filter((s) => STATE.filters.complexity.includes(s.complexity));
    if (STATE.filters.status.length) subs = subs.filter((s) => STATE.filters.status.includes(s.status));
    const rows = subs.length ? subs.map((s) =>
      '<tr class="clickable" data-agent="' + s.parentId + '">' +
        '<td class="cell-strong">' + esc(s.name) + "</td>" +
        '<td class="cell-sub" style="max-width:280px">' + esc(s.desc) + "</td>" +
        "<td>" + esc(s.parent) + "</td>" +
        "<td>" + esc(s.deptName) + "</td>" +
        '<td><span class="chip chip--outline">' + esc(s.type) + "</span></td>" +
        "<td>" + cplxChip(s.complexity) + "</td>" +
        '<td class="cell-sub">' + esc(s.deps) + "</td>" +
        "<td>" + statusChip(s.status) + "</td>" +
      "</tr>").join("") : '<tr><td colspan="8">' + emptyState() + "</td></tr>";
    return '<div class="page"><div class="page__head"><h2>Sub-Agents</h2>' +
      "<p>" + subs.length + " specialised task agent" + (subs.length !== 1 ? "s" : "") +
      " nested under main agents. Select a row to open its parent agent.</p></div>" +
      '<div class="card"><div class="table-wrap"><table class="tbl"><thead><tr>' +
        "<th>Sub-Agent</th><th>Description</th><th>Parent Agent</th><th>Department</th>" +
        "<th>Task Type</th><th>Complexity</th><th>Dependencies</th><th>Status</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div></div></div>";
  }

  function viewReview() {
    const list = allAgents().filter((a) => a.status === "Needs Review")
      .filter((a) => !STATE.search || agentMatches(a))
      .sort((a, b) => CSCORE[b.complexity] - CSCORE[a.complexity]);
    const byDept = {};
    list.forEach((a) => { (byDept[a.deptName] = byDept[a.deptName] || []).push(a); });
    const body = list.length ? Object.keys(byDept).map((dn) =>
      '<div class="section"><div class="section__head"><h3>' + esc(dn) +
      '</h3><span class="hint">' + byDept[dn].length + " agent" + (byDept[dn].length > 1 ? "s" : "") + " to review</span></div>" +
      '<div class="agent-grid">' + byDept[dn].map((a) => agentRow(a)).join("") + "</div></div>"
    ).join("") : '<div class="card"><div class="card__body">' + emptyState("Nothing pending review", "All agents have been reviewed or are in progress.") + "</div></div>";
    return '<div class="page"><div class="page__head"><h2>Pending Review</h2>' +
      "<p>Agents flagged for leadership review, update or refinement — highest complexity first.</p></div>" + body + "</div>";
  }

  /* ---- Mind map / team structure --------------------------------------- */
  const MM = { col: [24, 320, 648, 952], width: [226, 268, 250, 214], rowH: 56, pad: 26 };
  const statusVar = { "Ready": "var(--green)", "In Progress": "var(--blue)", "Needs Review": "var(--amber)" };
  const STATUS_TINT = {
    "Ready": ["var(--green)", "var(--green-bg)"],
    "In Progress": ["var(--blue)", "var(--blue-bg)"],
    "Needs Review": ["var(--amber)", "var(--amber-bg)"]
  };
  // canonical external systems an agent may depend on (order = match priority)
  const SYSREG = [
    { key: "oracle", label: "Oracle", icon: "db", re: /oracle/i },
    { key: "email", label: "Email", icon: "mail", re: /email|emanasa/i },
    { key: "moca", label: "MOCA App", icon: "app", re: /moca/i },
    { key: "icp", label: "ICP", icon: "idcard", re: /\bicp\b/i },
    { key: "sharepoint", label: "SharePoint", icon: "folder", re: /sharepoint|archive/i },
    { key: "gpssa", label: "GPSSA", icon: "shield", re: /gpssa/i },
    { key: "nextcare", label: "Nextcare", icon: "shield", re: /nextcare/i },
    { key: "fahr", label: "FAHR", icon: "doc", re: /fahr|iloe/i },
    { key: "whatsapp", label: "WhatsApp", icon: "chat", re: /whatsapp|hotline|telephony/i },
    { key: "bi", label: "BI / Analytics", icon: "pulse", re: /\bbi\b|analytics layer|performance system/i },
    { key: "itad", label: "IT / Directory", icon: "cpu", re: /it\/ad|directory|identity/i }
  ];
  function systemsFor(a) {
    const out = [], seen = {};
    (a.systems || []).forEach((s) => {
      const m = SYSREG.find((x) => x.re.test(s));
      const e = m || { key: "other", label: s, icon: "link" };
      if (!seen[e.key]) { seen[e.key] = 1; out.push(e); }
    });
    return out;
  }
  function roleFromTier(t) { if (!t) return "Agent"; const p = t.split("·"); return (p[p.length - 1] || t).trim(); }
  function initials(name) {
    const skip = { "hr": 1, "and": 1, "agent": 1, "&": 1, "the": 1, "of": 1 };
    const w = name.split(/[^A-Za-z0-9]+/).filter((x) => x && !skip[x.toLowerCase()]);
    return ((w[0] || name).charAt(0) + (w[1] ? w[1].charAt(0) : (w[0] || "").charAt(1) || "")).toUpperCase();
  }

  function viewMindmap() {
    const g = globalStats();
    const isAll = STATE.mindDept === "all";
    let root;
    if (isAll) {
      const subs = STATE.mindSubs;
      root = { type: "root", label: "Agentic Transformation", meta: g.depts + " departments · " + g.total + " agents",
        children: DATA.departments.filter((d) => d.agents.length).map((d) => ({
          type: "dept", id: d.id, label: d.name, meta: d.agents.length + " agents",
          children: d.agents.map((a) => ({
            type: "agent", id: a.id, label: a.name, status: a.status, complexity: a.complexity, kind: a.kind, tier: a.tier,
            systems: a.systems, talksTo: a.talksTo,
            children: subs ? (a.subAgents || []).map((s) => ({ type: "sub", parentId: a.id, label: s.name, status: s.status, complexity: s.complexity })) : []
          }))
        })) };
    } else {
      const d = findDept(STATE.mindDept) || DATA.departments[0];
      const subs = STATE.mindSubs;
      root = { type: "root", deptId: d.id, label: d.name,
        meta: d.agents.length + " agents" + (subs ? " · " + subCount(d) + " sub-agents" : "") + " · 1 orchestrator",
        children: d.agents.map((a) => ({
          type: "agent", id: a.id, label: a.name, status: a.status, complexity: a.complexity, kind: a.kind, tier: a.tier,
          systems: a.systems, talksTo: a.talksTo,
          children: subs ? (a.subAgents || []).map((s) => ({ type: "sub", parentId: a.id, label: s.name, status: s.status, complexity: s.complexity })) : []
        })) };
    }

    // vertical (top-down) layout: depth = row (y), siblings spread horizontally (x)
    const links = [], nodes = [], byId = {};
    const rowY = [44, 250, 524, 790];
    const widthFor = (n) => n.type === "root" ? 244 : n.type === "dept" ? 216 : n.type === "agent" ? (isAll ? 196 : 222) : 178;
    const slotW = (n) => n.type === "sub" ? 196 : n.type === "agent" ? (isAll ? 210 : 240) : n.type === "dept" ? 234 : 220;
    let cursor = MM.pad;
    (function layout(node, depth) {
      node.depth = depth; node.w = widthFor(node); node.y = rowY[depth];
      if (node.id) byId[node.id] = node;
      if (!node.children || !node.children.length) {
        const w = slotW(node); node.x = cursor + w / 2; cursor += w;
      } else {
        node.children.forEach((c) => layout(c, depth + 1));
        node.x = (node.children[0].x + node.children[node.children.length - 1].x) / 2;
        node.children.forEach((c) => links.push([node, c]));
      }
      nodes.push(node);
    })(root, 0);

    const maxRight = cursor + MM.pad;
    const totalH = Math.max.apply(null, nodes.map((n) => n.y)) + 160;
    const halfH = (n) => n.type === "root" ? 42 : n.type === "dept" ? 34 : n.type === "agent" ? (isAll ? 34 : 60) : 24;

    // clean elbow (org-chart) connectors: parent drop -> shared horizontal bus -> child drop
    const paths = links.map(([p, c]) => {
      const py = p.y + halfH(p), cy = c.y - halfH(c);
      const bus = py + Math.round((cy - py) * 0.5), r = 9;
      const dir = c.x === p.x ? 0 : (c.x > p.x ? 1 : -1);
      if (!dir) return '<path class="mm-link mm-link--d' + p.depth + '" d="M' + p.x + ',' + py + ' L' + p.x + ',' + cy + '"/>';
      return '<path class="mm-link mm-link--d' + p.depth + '" d="' +
        "M" + p.x + "," + py + " L" + p.x + "," + (bus - r) +
        " Q" + p.x + "," + bus + " " + (p.x + dir * r) + "," + bus +
        " L" + (c.x - dir * r) + "," + bus +
        " Q" + c.x + "," + bus + " " + c.x + "," + (bus + r) +
        " L" + c.x + "," + cy + '"/>';
    }).join("");

    // agent-to-agent "speaks to" links: built per-agent for hover; shown all only if toggled
    MM_COLLAB = {}; MM_ADJ = {}; let allCollab = "", collabCount = 0;
    if (!isAll) {
      nodes.forEach((n) => {
        if (n.type !== "agent" || !n.talksTo) return;
        n.talksTo.forEach((tid) => {
          const t = byId[tid]; if (!t) return;
          collabCount++;
          const sy = n.y - halfH(n), ty = t.y - halfH(t);
          const top = Math.min(sy, ty) - (38 + Math.min(80, Math.abs(n.x - t.x) / 5));
          const path = '<path class="mm-clink" marker-end="url(#mm-arrow)" d="M' + n.x + ',' + sy +
            ' C' + n.x + ',' + top + ' ' + t.x + ',' + top + ' ' + t.x + ',' + ty + '"/>';
          allCollab += path;
          (MM_COLLAB[n.id] = MM_COLLAB[n.id] || []).push(path);
          (MM_COLLAB[t.id] = MM_COLLAB[t.id] || []).push(path);
          (MM_ADJ[n.id] = MM_ADJ[n.id] || {})[t.id] = 1;
          (MM_ADJ[t.id] = MM_ADJ[t.id] || {})[n.id] = 1;
        });
      });
    }
    const collabPaths = STATE.mindLinks ? allCollab : "";

    const nodeHtml = nodes.map((n) => {
      const pos = 'left:' + (n.x - n.w / 2) + 'px;top:' + n.y + 'px;width:' + n.w + 'px';
      if (n.type === "root") {
        return '<div class="mm-node mm-lead"' + (n.deptId ? ' data-goto-dept="' + n.deptId + '"' : "") +
          ' style="' + pos + '">' +
          '<span class="mm-av mm-av--lead">' + icon("spark") + "</span>" +
          '<div class="mm-tx"><b>' + esc(n.label) + (n.deptId ? " Orchestrator" : "") + "</b>" +
          '<span class="mm-role">' + (n.deptId ? "Conducts the team" : "Programme") + " · " + esc(n.meta) + "</span></div></div>";
      }
      if (n.type === "dept") {
        return '<div class="mm-node mm-team" data-goto-dept="' + n.id + '" style="' + pos + '">' +
          '<span class="mm-av mm-av--team">' + icon(deptIconName(n.id)) + "</span>" +
          '<div class="mm-tx"><b>' + esc(n.label) + "</b><span class=\"mm-role\">" + esc(n.meta) + "</span></div></div>";
      }
      if (n.type === "agent") {
        const tint = STATUS_TINT[n.status] || ["var(--slate)", "var(--slate-bg)"];
        const sys = isAll ? [] : systemsFor(n);
        const sysRow = sys.length ? '<div class="mm-sys">' + sys.map((x) =>
          '<span class="mm-syschip mm-sys--' + x.key + '" title="Connects to ' + esc(x.label) + '">' +
          icon(x.icon) + "<span>" + esc(x.label) + "</span></span>").join("") + "</div>" : "";
        return '<div class="mm-node mm-member" data-agent="' + n.id + '" title="' + esc(n.label) +
          '" style="' + pos + ";border-left-color:" + tint[0] + '">' +
          '<div class="mm-member__top">' +
            '<span class="mm-av" style="color:' + tint[0] + ";background:" + tint[1] + '">' + icon("cpu") + "</span>" +
            '<div class="mm-tx"><b>' + esc(n.label) + "</b>" +
            '<span class="mm-role"><i class="mm-dot" style="background:' + tint[0] + '"></i>' +
            esc(roleFromTier(n.tier)) + " · " + esc(n.complexity) + "</span></div>" +
          "</div>" + sysRow + "</div>";
      }
      // sub-agent = junior member chip
      return '<div class="mm-node mm-rep" data-agent="' + n.parentId + '" title="' + esc(n.label) +
        '" style="' + pos + '"><span class="mm-av mm-av--rep">' + esc(initials(n.label)) + "</span>" +
        '<b>' + esc(n.label) + "</b></div>";
    }).join("");

    const pills = ['<button class="mm-pill' + (isAll ? " is-on" : "") + '" data-mind="all">All departments</button>']
      .concat(DATA.departments.map((d) =>
        '<button class="mm-pill' + (STATE.mindDept === d.id ? " is-on" : "") + '" data-mind="' + d.id + '">' + esc(d.short) + "</button>")).join("");

    const controls =
      '<div class="mm-controls"><div class="mm-pills">' + pills + "</div>" +
      '<div class="flex gap-2">' +
      (isAll ? "" :
        '<button class="btn btn--sm' + (STATE.mindLinks ? " btn--primary" : "") + '" data-mindlinks>' +
          icon("mindmap") + (STATE.mindLinks ? "Hide agent links" : "Show agent links") + "</button>") +
        '<button class="btn btn--sm' + (STATE.mindSubs ? " btn--primary" : "") + '" data-mindsubs>' +
          icon("sub") + (STATE.mindSubs ? "Hide sub-agents" : "Show sub-agents") + "</button>" +
        '<button class="btn btn--sm" data-mindfull>' + icon(STATE.mindFull ? "shrink" : "expand") +
          (STATE.mindFull ? "Exit full screen" : "Full screen") + "</button>" +
      "</div></div>";

    const legend =
      '<div class="mm-legend">' +
        '<span><i style="background:var(--green)"></i>Ready</span>' +
        '<span><i style="background:var(--blue)"></i>In progress</span>' +
        '<span><i style="background:var(--amber)"></i>Needs review</span>' +
        (isAll ? "" : '<span class="mm-leg-arrow">' + icon("mindmap") + "Speaks to another agent</span>" +
          '<span class="mm-leg-sys">' + icon("db") + "Needs a system (e.g. Oracle, Email)</span>") +
        '<span class="muted">Click any member to open its agent</span>' +
      "</div>";

    const desc = isAll ? "Showing every department and its agents."
      : "Showing the " + esc((findDept(STATE.mindDept) || {}).name || "") + " team — agents that need each other speak directly" +
        (STATE.mindLinks && collabCount ? " (" + collabCount + " links)" : "") +
        ", and each card shows the systems it relies on.";

    const z = STATE.mindZoom;
    const innerW = Math.round(maxRight * z), innerH = Math.round(totalH * z);
    const stage =
      '<div class="mm-stage" style="width:' + maxRight + "px;height:" + totalH + "px;transform:scale(" + z + ')">' +
        '<svg class="mm-svg" width="' + maxRight + '" height="' + totalH + '">' +
          '<defs><marker id="mm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
            '<path d="M0,0 L10,5 L0,10 z" fill="var(--gold-ink)"/></marker></defs>' +
          paths + '<g id="mmCollab">' + collabPaths + "</g></svg>" + nodeHtml +
      "</div>";
    const stageWrap =
      '<div class="mm-stagewrap">' +
        '<div class="mm-canvas"><div class="mm-inner" style="width:' + innerW + "px;height:" + innerH + 'px">' + stage + "</div></div>" +
        '<div class="mm-zoom">' +
          '<button class="mm-zbtn" data-zoom="out" title="Zoom out" aria-label="Zoom out">−</button>' +
          '<button class="mm-zbtn mm-zlevel" data-zoom="reset" title="Reset zoom">' + Math.round(z * 100) + "%</button>" +
          '<button class="mm-zbtn" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>' +
        "</div>" +
        '<div class="mm-pan-hint">' + icon("mindmap") + "Drag to move · use ± to zoom</div>" +
      "</div>";

    return '<div class="mm-wrap' + (STATE.mindFull ? " is-full" : "") + '">' +
      '<div class="page__head"><h2>Agent team</h2>' +
      "<p>The agents as a team — the orchestrator leads, agents collaborate, and each card shows what it connects to. " + desc + "</p></div>" +
      controls + legend + stageWrap +
      "</div>";
  }

  function viewSettings() {
    const g = globalStats();
    return '<div class="page"><div class="page__head"><h2>Settings</h2>' +
      "<p>Dashboard configuration and data overview. This prototype uses realistic mock data structured for real data later.</p></div>" +
      '<div class="set-grid">' +
        '<div class="card"><div class="card__head"><h3>Programme</h3></div><div class="card__body">' +
          '<div class="set-row"><div><b>Programme name</b><span>Display title</span></div><span class="muted">Agentic Transformation</span></div>' +
          '<div class="set-row"><div><b>Audience</b><span>Primary readership</span></div><span class="muted">H.E. & Senior Leadership</span></div>' +
          '<div class="set-row"><div><b>Data source</b><span>Current dataset</span></div>' + kindChip("core") + '</div>' +
          '<div class="set-row"><div><b>Last updated</b><span>Dataset date</span></div><span class="muted">' + fmtDate("2026-06-22") + "</span></div>" +
        "</div></div>" +
        '<div class="card"><div class="card__head"><h3>Dataset Overview</h3></div><div class="card__body">' +
          '<div class="set-row"><div><b>Departments</b></div><span class="muted">' + g.depts + "</span></div>" +
          '<div class="set-row"><div><b>Main agents</b></div><span class="muted">' + g.total + "</span></div>" +
          '<div class="set-row"><div><b>Sub-agents</b></div><span class="muted">' + g.subs + "</span></div>" +
          '<div class="set-row"><div><b>Average complexity</b></div><span class="muted">' + g.avg.toFixed(2) + " / 4</span></div>" +
        "</div></div>" +
        '<div class="card"><div class="card__head"><h3>Display</h3></div><div class="card__body">' +
          '<div class="set-row"><div><b>Theme</b><span>Interface appearance</span></div><span class="muted">Light · Government</span></div>' +
          '<div class="set-row"><div><b>Language</b><span>Primary language</span></div><span class="muted">English (AR labels shown)</span></div>' +
          '<div class="set-row"><div><b>Accent</b><span>Brand colour</span></div><span class="muted">Official Brown &amp; Gold</span></div>' +
        "</div></div>" +
        '<div class="card"><div class="card__head"><h3>Data Actions</h3></div><div class="card__body">' +
          '<p class="muted" style="margin-bottom:12px">Export the full dataset or reset any in-session edits.</p>' +
          '<div class="flex gap-2"><button class="btn" data-export>' + icon("export") + "Export dataset</button>" +
          '<button class="btn btn--danger" data-reset>Reset edits</button></div>' +
        "</div></div>" +
      "</div></div>";
  }

  function emptyState(title, sub) {
    return '<div class="empty">' + icon("search") +
      "<b>" + esc(title || "No matching results") + "</b>" +
      "<div>" + esc(sub || "Try adjusting your search or filters.") + "</div></div>";
  }

  /* ---- Agent Assistant (chat tester) ----------------------------------- */
  function viewAssistant() {
    const g = globalStats();
    const apiMode = window.Assistant && window.Assistant.config.mode === "api";
    return '<div class="page"><div class="page__head"><h2>Agent Assistant</h2>' +
      "<p>Test the agent inventory in plain language. Grounded in the live dataset — " +
      g.total + " agents, " + g.subs + " sub-agents across " + g.depts + " departments." +
      (apiMode ? " · <b>API mode</b>" : " · Built-in mode") + "</p></div>" +
      '<div class="card chat-wrap">' +
        '<div class="chat-bar-top">' +
          '<span class="chat-bot-id">' + icon("spark") + " Agent Assistant</span>" +
          '<span class="muted" style="font-size:var(--fs-xs)">Answers reflect your current (incl. edited) data</span>' +
          '<button class="btn btn--sm btn--ghost" data-chat-clear style="margin-left:auto">Clear</button>' +
        "</div>" +
        '<div class="chat-scroll" id="chatScroll">' + chatMessagesHTML() + "</div>" +
        '<div class="chat-foot">' +
          (STATE.chat.length <= 1 ? suggestChipsHTML() : "") +
          '<form class="chat-input-row" id="chatForm" autocomplete="off">' +
            '<input class="chat-input" id="chatInput" placeholder="Ask about agents, departments, complexity, what needs review…" />' +
            '<button class="btn btn--primary chat-send" type="submit" aria-label="Send">' + icon("send") + "</button>" +
          "</form>" +
        "</div>" +
      "</div></div>";
  }
  function suggestChipsHTML() {
    const s = (window.Assistant && window.Assistant.suggestions()) || [];
    return '<div class="chat-suggest">' + s.map((x) =>
      '<button class="chat-chip" data-suggest="' + esc(x) + '">' + esc(x) + "</button>").join("") + "</div>";
  }
  function chatMessagesHTML() {
    if (!STATE.chat.length) {
      return '<div class="msg msg--bot"><div class="msg__avatar">' + icon("spark") + "</div>" +
        '<div class="msg__bubble"><p>I’m the <b>Agent Assistant</b>. Ask me anything about the agent inventory ' +
        "— counts, a department, a specific agent, complexity, or what needs review.</p></div></div>";
    }
    return STATE.chat.map((m) => {
      if (m.role === "user")
        return '<div class="msg msg--user"><div class="msg__bubble">' + esc(m.text) + "</div></div>";
      if (m.typing)
        return '<div class="msg msg--bot"><div class="msg__avatar">' + icon("spark") + "</div>" +
          '<div class="msg__bubble"><span class="typing"><i></i><i></i><i></i></span></div></div>';
      return '<div class="msg msg--bot"><div class="msg__avatar">' + icon("spark") + "</div>" +
        '<div class="msg__bubble">' + m.html + "</div></div>";
    }).join("");
  }
  function renderChat() {
    const sc = $("#chatScroll");
    if (!sc) return;
    sc.innerHTML = chatMessagesHTML();
    sc.scrollTop = sc.scrollHeight;
    // hide suggestions once a conversation starts
    const foot = sc.parentElement.querySelector(".chat-suggest");
    if (foot && STATE.chat.length > 1) foot.classList.add("hide");
  }
  function sendChat(text) {
    text = (text || "").trim();
    if (!text) return;
    STATE.chat.push({ role: "user", text: text });
    STATE.chat.push({ role: "bot", typing: true });
    renderChat();
    const inp = $("#chatInput"); if (inp) inp.value = "";
    window.Assistant.ask(text).then((ans) => {
      // replace the trailing typing placeholder
      for (let i = STATE.chat.length - 1; i >= 0; i--) {
        if (STATE.chat[i].typing) { STATE.chat[i] = { role: "bot", html: ans.html }; break; }
      }
      renderChat();
    });
  }

  /* ---- Drawer (agent detail) ------------------------------------------- */
  function openAgent(id) {
    const a = findAgent(id);
    if (!a) return;
    const score = [
      { b: "Complexity", el: cplxChip(a.complexity) },
      { b: "Impact", el: chip(a.impact, COLOR.level[a.impact] || "slate") },
      { b: "Feasibility", el: chip(a.feasibility, COLOR.level[a.feasibility] || "slate") }
    ].map((x) => '<div class="score"><b>' + x.b + "</b>" + x.el + "</div>").join("");

    const field = (label, ic, value, strong) =>
      '<div class="field"><div class="field__label">' + (ic ? icon(ic) : "") + esc(label) + "</div>" +
      '<div class="field__value' + (strong ? " is-strong" : "") + '">' + value + "</div></div>";
    const tags = (arr) => '<div class="taglist">' + (arr || []).map((t) => '<span class="tag">' + esc(t) + "</span>").join("") + "</div>";

    const subRows = (a.subAgents || []).map((s) =>
      "<tr><td><div class=\"sa-name\">" + esc(s.name) + "</div><div class=\"cell-sub\">" + esc(s.desc) + "</div></td>" +
      '<td><span class="chip chip--outline">' + esc(s.type) + "</span></td>" +
      "<td>" + cplxChip(s.complexity) + "</td>" +
      '<td class="cell-sub">' + esc(s.deps) + "</td>" +
      "<td>" + statusChip(s.status) + "</td></tr>").join("");

    const html =
      '<div class="drawer__head">' +
        '<div class="drawer__eyebrow"><span class="drawer__dept">' + esc(a.deptName) + " · " + esc(a.tier) + "</span>" +
          '<button class="close-x" data-close-drawer>' + icon("close") + "</button></div>" +
        "<h2>" + esc(a.name) + "</h2>" +
        '<div class="drawer__chips">' + kindChip(a.kind) + statusChip(a.status) + prioChip(a.priority) + "</div>" +
      "</div>" +
      '<div class="drawer__body">' +
        '<div class="scorebox">' + score + "</div>" +
        field("Purpose", "target", esc(a.purpose), true) +
        field("Main Responsibilities", "list", esc(a.responsibilities)) +
        field("Process Covered", "layers", esc(a.process)) +
        '<div class="divider"></div>' +
        field("Inputs Needed", "input", tags(a.inputs)) +
        field("Systems It Connects To", "link", tags(a.systems)) +
        field("Outputs Produced", "output", tags(a.outputs)) +
        field("Autonomy", "pulse", esc(a.autonomy)) +
        '<div class="divider"></div>' +
        '<div class="callout callout--risk">' + icon("review") +
          "<div><b>Risks / Dependencies</b><p>" + esc(a.risks) + "</p></div></div>" +
        '<div style="height:12px"></div>' +
        '<div class="callout callout--action">' + icon("flag") +
          "<div><b>Recommended Next Action</b><p>" + esc(a.nextAction) + "</p></div></div>" +
        '<div class="divider"></div>' +
        '<div class="field__label">' + icon("sub") + "Sub-Agents (" + (a.subAgents ? a.subAgents.length : 0) + ")</div>" +
        '<div class="table-wrap" style="margin-top:8px"><table class="subtbl"><thead><tr>' +
          "<th>Sub-Agent</th><th>Task Type</th><th>Complexity</th><th>Dependencies</th><th>Status</th>" +
        "</tr></thead><tbody>" + (subRows || '<tr><td colspan="5" class="muted">No sub-agents defined.</td></tr>') + "</tbody></table></div>" +
      "</div>" +
      '<div class="drawer__foot">' +
        '<button class="btn" data-close-drawer>Close</button>' +
        '<button class="btn btn--primary" data-edit="' + a.id + '">' + icon("edit") + "Edit / Update</button>" +
      "</div>";

    const drawer = $("#drawer");
    drawer.innerHTML = html;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    $("#scrim").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    $("#drawer").classList.remove("is-open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#scrim").classList.remove("is-open");
    if (!$("#modalScrim").classList.contains("is-open")) document.body.style.overflow = "";
  }

  /* ---- Edit modal ------------------------------------------------------- */
  function openEdit(id) {
    const a = findAgent(id);
    if (!a) return;
    const sel = (name, label, opts, val, col2) =>
      '<div class="form-field' + (col2 ? " col-2" : "") + '"><label>' + label + "</label><select class=\"select\" name=\"" + name + "\">" +
      opts.map((o) => '<option value="' + esc(o) + '"' + (o === val ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select></div>";
    const deptOpts = DATA.departments.map((d) =>
      '<option value="' + d.id + '"' + (d.id === a.deptId ? " selected" : "") + ">" + esc(d.name) + "</option>").join("");
    const subText = (a.subAgents || []).map((s) => s.name).join("\n");

    const body =
      '<form id="editForm"><div class="form-grid">' +
        '<div class="form-field col-2"><label>Agent Name</label><input class="input" name="name" value="' + esc(a.name) + '" required /></div>' +
        '<div class="form-field col-2"><label>Purpose / Description</label><textarea class="textarea" name="purpose">' + esc(a.purpose) + "</textarea></div>" +
        '<div class="form-field"><label>Department</label><select class="select" name="deptId">' + deptOpts + "</select></div>" +
        sel("kind", "Type", ["core", "value-add"], a.kind) +
        sel("complexity", "Complexity", ["Low", "Medium", "High", "Very High"], a.complexity) +
        sel("impact", "Impact", ["Low", "Medium", "High"], a.impact) +
        sel("feasibility", "Feasibility", ["Low", "Medium", "High"], a.feasibility) +
        sel("priority", "Priority", ["Quick Win", "Strategic", "Complex", "Future Phase"], a.priority) +
        sel("status", "Status", ["Ready", "In Progress", "Needs Review"], a.status, true) +
        '<div class="form-field col-2"><label>Sub-Agents (one per line)</label><textarea class="textarea" name="subs">' + esc(subText) + "</textarea></div>" +
        '<div class="form-field col-2"><label>Recommended Next Action</label><textarea class="textarea" name="nextAction">' + esc(a.nextAction) + "</textarea></div>" +
        '<div class="form-field col-2"><label>Notes / Risks &amp; Dependencies</label><textarea class="textarea" name="risks">' + esc(a.risks) + "</textarea></div>" +
      "</div></form>";

    $("#modalScrim").innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<div class="modal__head"><div><h3>Edit Agent</h3><p>' + esc(a.deptName) + " · " + esc(a.id) + "</p></div>" +
          '<button class="close-x" data-close-modal>' + icon("close") + "</button></div>" +
        '<div class="modal__body">' + body + "</div>" +
        '<div class="modal__foot"><span class="muted" style="font-size:var(--fs-xs)">Changes are saved for this session only.</span>' +
          "<div class=\"flex gap-2\"><button class=\"btn\" data-close-modal>Cancel</button>" +
          '<button class="btn btn--primary" data-save="' + a.id + '">' + icon("check") + "Save changes</button></div></div>" +
      "</div>";
    $("#modalScrim").classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => { const n = $('input[name="name"]'); if (n) n.focus(); }, 60);
  }
  function closeModal() {
    $("#modalScrim").classList.remove("is-open");
    $("#modalScrim").innerHTML = "";
    if (!$("#drawer").classList.contains("is-open")) document.body.style.overflow = "";
  }
  function saveEdit(id) {
    const a = findAgent(id);
    const form = $("#editForm");
    if (!a || !form) return;
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || "").toString().trim();
    const newDept = get("deptId");
    a.name = get("name") || a.name;
    a.purpose = get("purpose");
    a.kind = get("kind");
    a.complexity = get("complexity");
    a.impact = get("impact");
    a.feasibility = get("feasibility");
    a.priority = get("priority");
    a.status = get("status");
    a.nextAction = get("nextAction");
    a.risks = get("risks");
    // sub-agents: keep existing where names match, add new, drop removed
    const lines = get("subs").split("\n").map((s) => s.trim()).filter(Boolean);
    const existing = a.subAgents || [];
    a.subAgents = lines.map((nm) => {
      const prev = existing.find((s) => s.name.toLowerCase() === nm.toLowerCase());
      return prev || { name: nm, desc: "Newly added sub-agent — pending definition.", complexity: "Medium", type: "Task", deps: "—", status: "In Progress" };
    });
    // move department if changed
    if (newDept && newDept !== a.deptId) {
      const from = findDept(a.deptId), to = findDept(newDept);
      const idx = from.agents.findIndex((x) => x.id === id);
      if (idx > -1) { const [moved] = from.agents.splice(idx, 1); to.agents.push(moved); }
    }
    closeModal();
    closeDrawer();
    render();
    toast("“" + a.name + "” updated");
  }

  /* ---- Export / share --------------------------------------------------- */
  function exportData() {
    // CSV of all agents
    const head = ["Department", "Agent", "Type", "Tier", "Complexity", "Impact", "Feasibility", "Priority", "Status", "Sub-Agents", "Purpose"];
    const rows = allAgents().map((a) => [a.deptName, a.name, a.kind, a.tier, a.complexity, a.impact,
      a.feasibility, a.priority, a.status, (a.subAgents || []).length, a.purpose]
      .map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(","));
    const csv = head.join(",") + "\n" + rows.join("\n");
    download("agentic-transformation-agents.csv", csv, "text/csv");
    toast("Exported " + rows.length + " agents to CSV");
  }
  function download(name, content, type) {
    const blob = new Blob([content], { type: type || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    a.remove(); setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  function share() {
    const url = location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => toast("Dashboard link copied to clipboard"))
        .catch(() => toast("Copy this link: " + url));
    } else { toast("Share link: " + url); }
  }

  /* ---- Toast ------------------------------------------------------------ */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = icon("check") + "<span>" + esc(msg) + "</span>";
    $("#toasts").appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 320); }, 2600);
  }

  /* ---- Router / render -------------------------------------------------- */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const parts = h.split("/");
    if (parts[0] === "department" && parts[1]) { STATE.view = "department"; STATE.deptId = parts[1]; return; }
    const valid = ["overview", "departments", "agents", "subagents", "mindmap", "review", "assistant", "settings"];
    STATE.view = valid.includes(parts[0]) ? parts[0] : "overview";
  }
  function go(view, deptId) {
    if (view === "department" && deptId) location.hash = "#/department/" + deptId;
    else location.hash = "#/" + view;
  }
  function render() {
    if ($("#drawer").classList.contains("is-open")) closeDrawer();
    if (STATE.view !== "mindmap" && STATE.mindFull) { STATE.mindFull = false; document.body.style.overflow = ""; }
    renderNav();
    renderHeader();
    const v = STATE.view;
    const map = {
      overview: viewOverview, departments: viewDepartments, department: viewDepartmentDetail,
      agents: viewAgents, subagents: viewSubAgents, mindmap: viewMindmap, review: viewReview, assistant: viewAssistant, settings: viewSettings
    };
    $("#view").innerHTML = (map[v] || viewOverview)();
    window.scrollTo({ top: 0 });
    if (v === "assistant") { const sc = $("#chatScroll"); if (sc) sc.scrollTop = sc.scrollHeight; setTimeout(focusChat, 40); }
    if (v === "mindmap") centerMindmap();
  }
  function centerMindmap() {
    const c = $(".mm-canvas"); if (!c) return;
    c.scrollLeft = Math.max(0, (c.scrollWidth - c.clientWidth) / 2);
  }

  /* ---- Events (delegated) ---------------------------------------------- */
  document.addEventListener("click", function (e) {
    const t = e.target.closest("[data-nav],[data-goto-dept],[data-agent],[data-edit],[data-save]," +
      "[data-close-drawer],[data-close-modal],[data-add],[data-export],[data-share],[data-reset]," +
      "[data-filter-toggle],[data-filter],[data-apply-filters],[data-clear-filters],[data-menu]," +
      "[data-suggest],[data-chat-clear],[data-mind],[data-mindsubs],[data-mindlinks],[data-zoom],[data-mindfull]");
    if (!t) {
      // close filter popover on outside click
      if (STATE.filterOpen && !e.target.closest(".has-pop")) { STATE.filterOpen = false; renderHeader(); }
      return;
    }
    if (t.dataset.nav) { STATE.filterOpen = false; closeSidebarMobile(); go(t.dataset.nav); }
    else if (t.dataset.mind) { STATE.mindDept = t.dataset.mind; renderBody(); }
    else if (t.hasAttribute("data-mindsubs")) { STATE.mindSubs = !STATE.mindSubs; renderBody(); }
    else if (t.hasAttribute("data-mindlinks")) { STATE.mindLinks = !STATE.mindLinks; renderBody(); }
    else if (t.dataset.zoom) { zoomMap(t.dataset.zoom); }
    else if (t.hasAttribute("data-mindfull")) { setMindFull(!STATE.mindFull); }
    else if (t.dataset.suggest) { sendChat(t.dataset.suggest); }
    else if (t.hasAttribute("data-chat-clear")) { STATE.chat = []; renderBody(); setTimeout(focusChat, 30); }
    else if (t.dataset.gotoDept) { go("department", t.dataset.gotoDept); }
    else if (t.dataset.agent) { openAgent(t.dataset.agent); }
    else if (t.dataset.edit) { e.stopPropagation(); openEdit(t.dataset.edit); }
    else if (t.dataset.save) { saveEdit(t.dataset.save); }
    else if (t.hasAttribute("data-close-drawer")) { closeDrawer(); }
    else if (t.hasAttribute("data-close-modal")) { closeModal(); }
    else if (t.hasAttribute("data-add")) { addAgentFlow(); }
    else if (t.hasAttribute("data-export")) { exportData(); }
    else if (t.hasAttribute("data-share")) { share(); }
    else if (t.hasAttribute("data-reset")) { resetEdits(); }
    else if (t.hasAttribute("data-menu")) { toggleSidebarMobile(); }
    else if (t.hasAttribute("data-filter-toggle")) { STATE.filterOpen = !STATE.filterOpen; renderHeader(); }
    else if (t.dataset.filter) { toggleFilter(t.dataset.filter, t.dataset.val); }
    else if (t.hasAttribute("data-apply-filters")) { STATE.filterOpen = false; renderHeader(); render(); }
    else if (t.hasAttribute("data-clear-filters")) { clearFilters(); }
  });

  // keyboard: bars/rows accessible, Escape closes overlays
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if ($("#modalScrim").classList.contains("is-open")) return closeModal();
      if ($("#drawer").classList.contains("is-open")) return closeDrawer();
      if (STATE.mindFull) return setMindFull(false);
      if (STATE.filterOpen) { STATE.filterOpen = false; renderHeader(); }
    }
    if (e.key === "Enter" || e.key === " ") {
      const el = e.target.closest("[data-goto-dept].barrow");
      if (el) { e.preventDefault(); go("department", el.dataset.gotoDept); }
    }
  });

  $("#scrim").addEventListener("click", closeDrawer);
  document.addEventListener("click", function (e) {
    if (e.target.id === "modalScrim") closeModal();
  });

  // chat submit
  document.addEventListener("submit", function (e) {
    if (e.target.id === "chatForm") {
      e.preventDefault();
      const inp = $("#chatInput");
      if (inp) sendChat(inp.value);
    }
  });
  function focusChat() { const i = $("#chatInput"); if (i) i.focus(); }

  // search (debounced-ish)
  let searchTimer;
  document.addEventListener("input", function (e) {
    if (e.target.id === "searchInput") {
      STATE.search = e.target.value;
      clearTimeout(searchTimer);
      const pos = e.target.selectionStart;
      searchTimer = setTimeout(() => {
        renderBody();
        const inp = $("#searchInput");
        if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (x) {} }
      }, 160);
    }
  });
  function renderBody() {
    // re-render only the view body + nav counts, keep header/search focus
    renderNav();
    const map = {
      overview: viewOverview, departments: viewDepartments, department: viewDepartmentDetail,
      agents: viewAgents, subagents: viewSubAgents, mindmap: viewMindmap, review: viewReview, assistant: viewAssistant, settings: viewSettings
    };
    $("#view").innerHTML = (map[STATE.view] || viewOverview)();
    if (STATE.view === "mindmap") centerMindmap();
  }

  function toggleFilter(key, val) {
    const arr = STATE.filters[key];
    const i = arr.indexOf(val);
    if (i > -1) arr.splice(i, 1); else arr.push(val);
    renderHeader(); render();
  }
  function clearFilters() {
    STATE.filters = { complexity: [], status: [], priority: [], kind: [] };
    STATE.search = ""; STATE.filterOpen = false;
    renderHeader(); render();
  }
  function resetEdits() {
    const fresh = JSON.parse(JSON.stringify(window.DASHBOARD_DATA));
    DATA.departments = fresh.departments;
    render(); toast("Session edits reset to original data");
  }
  function addAgentFlow() {
    // open edit modal pre-seeded with a new agent in the current (or first) department
    const dId = STATE.deptId || DATA.departments[0].id;
    const dept = findDept(dId);
    const newAgent = {
      id: "new-" + Date.now(), name: "New Agent", kind: "core", tier: "New · To be classified",
      purpose: "", responsibilities: "", process: "", inputs: [], systems: [], outputs: [],
      complexity: "Medium", impact: "Medium", feasibility: "Medium",
      status: "In Progress", priority: "Strategic", autonomy: "To be defined",
      risks: "", nextAction: "", subAgents: []
    };
    dept.agents.push(newAgent);
    render();
    openEdit(newAgent.id);
    toast("New agent added to " + dept.name + " — fill in the details");
  }

  // mobile sidebar
  function toggleSidebarMobile() { $("#sidebar").classList.toggle("is-open"); }
  function closeSidebarMobile() { $("#sidebar").classList.remove("is-open"); }

  /* ---- Mind map zoom / full screen / pan -------------------------------- */
  function zoomMap(dir) {
    const z = STATE.mindZoom;
    STATE.mindZoom = dir === "in" ? Math.min(2, +(z + 0.15).toFixed(2))
      : dir === "out" ? Math.max(0.4, +(z - 0.15).toFixed(2)) : 1;
    renderBody();
  }
  function setMindFull(on) {
    STATE.mindFull = on;
    document.body.style.overflow = on ? "hidden" : "";
    renderBody();
  }
  // drag-to-pan inside the mind-map canvas (works across re-renders)
  let mmPan = null;
  document.addEventListener("pointerdown", function (e) {
    const canvas = e.target.closest(".mm-canvas");
    if (!canvas || e.target.closest(".mm-node, button, a, input")) return;
    mmPan = { c: canvas, x: e.clientX, y: e.clientY, sl: canvas.scrollLeft, st: canvas.scrollTop };
    canvas.classList.add("is-grabbing");
  });
  document.addEventListener("pointermove", function (e) {
    if (!mmPan) return;
    mmPan.c.scrollLeft = mmPan.sl - (e.clientX - mmPan.x);
    mmPan.c.scrollTop = mmPan.st - (e.clientY - mmPan.y);
  });
  function endPan() { if (mmPan) { mmPan.c.classList.remove("is-grabbing"); mmPan = null; } }
  document.addEventListener("pointerup", endPan);
  document.addEventListener("pointerleave", endPan);

  // hover an agent to reveal only its "speaks to" links (keeps the canvas clean)
  let mmHover = null;
  document.addEventListener("mouseover", function (e) {
    if (STATE.view !== "mindmap" || STATE.mindLinks) return;
    const m = e.target.closest(".mm-member"); if (!m) return;
    const id = m.getAttribute("data-agent"); if (id === mmHover) return;
    mmHover = id;
    const g = document.getElementById("mmCollab");
    if (g) g.innerHTML = (MM_COLLAB[id] || []).join("");
    const adj = MM_ADJ[id] || {};
    const hasLinks = !!(MM_COLLAB[id] && MM_COLLAB[id].length);
    document.querySelectorAll(".mm-member").forEach((el) => {
      const aid = el.getAttribute("data-agent");
      el.classList.toggle("is-dim", hasLinks && aid !== id && !adj[aid]);
    });
    m.classList.add("is-focus");
  });
  document.addEventListener("mouseout", function (e) {
    if (STATE.view !== "mindmap" || STATE.mindLinks) return;
    const m = e.target.closest(".mm-member"); if (!m) return;
    if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".mm-member") === m) return;
    mmHover = null;
    const g = document.getElementById("mmCollab"); if (g) g.innerHTML = "";
    document.querySelectorAll(".mm-member").forEach((el) => el.classList.remove("is-dim", "is-focus"));
  });

  window.addEventListener("hashchange", function () { parseHash(); render(); });

  /* ---- Boot ------------------------------------------------------------- */
  parseHash();
  render();
})();
