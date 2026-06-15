/* ============================================================================
   PlatformX (full product) — application shell, views and wiring
   Surfaces: Data Layer · Use-Case Gallery · Data Marketplace ·
   Use-Case Builder · RF Workspace · RF Engineer Chatbot · Operator Business Plan · Governance
   ========================================================================== */
(function () {
  "use strict";
  const D = window.PX_DATA, U = D.util, PF = window.PX_PLATFORM;
  const icon = window.UI.icon, esc = window.UI.esc;
  const view = document.getElementById("view");
  const app = document.getElementById("app");
  const money = (n) => n >= 1e6 ? "$" + (n / 1e6).toFixed(1) + "M" : "$" + Math.round(n / 1e3) + "k";

  // in-session state
  const connected = new Set();
  PF.CATALOG.forEach(c => c.datasets.forEach(d => { if (d.status === "connected") connected.add(c.cat + "/" + d.name); }));
  const PUBLISHED = [];
  let builder = null;
  // flagship first: Operator Business Plan leads the marketplace (Jun-11 pivot)
  PF.USE_CASES.sort((a, b) => (a.id === "biz-plan" ? -1 : b.id === "biz-plan" ? 1 : 0));
  let vertical = "Telecom";

  /* ---------------- navigation ---------------- */
  const NAV = [
    { sect: "Platform" },
    { id: "datalayer", label: "Data Layer", icon: "layers", hash: "#/datalayer" },
    { id: "marketplace", label: "Data Marketplace", icon: "store", hash: "#/marketplace" },
    { id: "builder", label: "Use-Case Builder", icon: "wand", hash: "#/builder" },
    { id: "gallery", label: "Use-Case Gallery", icon: "grid", hash: "#/gallery" },
    { sect: "Workspaces" },
    { id: "ws-biz", label: "Operator Business Plan", icon: "dollar", hash: "#/workspace/biz" },
    { id: "ws-rf", label: "RF Engineer Agent", icon: "tower", hash: "#/workspace/rf" },
    { id: "agent", label: "RF Engineer Chatbot", icon: "agent", hash: "#/agent" },
    { sect: "Advanced · full product" },
    { id: "advanced", label: "Predictive & Prescriptive", icon: "rocket", hash: "#/advanced" },
    { sect: "Admin" },
    { id: "gov", label: "Governance & Security", icon: "shield", hash: "#/governance" },
  ];
  function buildNav() {
    const sb = document.getElementById("sidebar");
    let html = "";
    NAV.forEach(n => {
      if (n.sect) { html += `<div class="nav-section"><div class="nav-label">${n.sect}</div></div>`; return; }
      html += `<a class="nav-item" data-id="${n.id}" href="${n.hash}">${icon(n.icon)}<span>${n.label}</span></a>`;
    });
    html += `<div class="grow"></div>
      <div class="side-card">
        <h4>${icon("rocket")} Build your own</h4>
        <p>Pick data, choose a maturity level, compose views & ship an agentic use-case.</p>
        <button id="navBuild">Open Builder</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;padding:12px 8px 2px;color:var(--muted-2);font-size:11px">${icon("flask")}<span>Full product · v0.2</span></div>`;
    sb.innerHTML = html;
    sb.querySelector("#navBuild").addEventListener("click", () => window.Router.go("/builder"));
  }
  function setActive(id) { document.querySelectorAll(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.id === id)); }
  function crumb(parts) {
    document.getElementById("crumb").innerHTML = `<span class="crumb">${parts.map((p, i) => i < parts.length - 1 ? `<a href="${p.hash}" style="color:var(--muted)">${esc(p.label)}</a><span class="sep">/</span>` : esc(p.label)).join("")}</span>`;
  }

  /* ---------------- shared bits ---------------- */
  function statCard(h) {
    const k = D.KPI_BY_ID[h.id];
    const st = U.kpiStatus(k, h.value);
    const c = st === "crit" ? "var(--crit)" : st === "warn" ? "var(--warn)" : "var(--brand-600)";
    return `<div class="stat"><div class="accent-bar" style="background:${c}"></div>
      <div class="label">${esc(h.label)} <span class="hint">· network avg</span></div>
      <div class="value tnum">${h.value}<small>${h.unit === "%" ? "%" : " " + h.unit}</small></div>
      <div class="foot">${window.UI.deltaTag(h.delta, h.dir)}<span class="cell-sub">vs 24h</span></div>
      ${window.CHARTS.sparkline(h.series, { color: window.CHARTS.COL[k.dir === "down" ? "warn" : "brand"] })}</div>`;
  }
  function alarmRow(a) {
    return `<div class="feed-row"><div class="sev ${a.sev === 'crit' ? 'crit' : a.sev === 'warn' ? 'warn' : 'info'}"></div>
      <div class="body"><div class="t">${esc(a.type)} ${window.UI.sevPill(a.sev)}</div><div class="m">${a.site} · ${a.sector}</div></div>
      <div class="ts">${window.UI.timeAgo(a.ts)}</div></div>`;
  }
  function statusPill(status) { const m = PF.statusMeta[status]; return `<span class="pill ${m.pill}"><span class="dot"></span>${m.label}</span>`; }

  function autoGrow(ta) { ta.style.height = "auto"; ta.style.height = Math.min(140, ta.scrollHeight) + "px"; }
  function buildComposer(container, onSend, placeholder) {
    container.innerHTML = `<div class="composer-inner"><div class="composer-box">
      <textarea rows="1" placeholder="${esc(placeholder || "Ask…")}"></textarea>
      <button class="composer-send" disabled>${icon("sendup")}</button></div>
      <div class="composer-foot"><span class="grounded">${icon("checkcircle")} Grounded in your data</span><span>·</span><span>Enter to send</span></div></div>`;
    const ta = container.querySelector("textarea"), send = container.querySelector(".composer-send");
    function sync() { send.disabled = !ta.value.trim(); autoGrow(ta); }
    ta.addEventListener("input", sync);
    function fire() { const v = ta.value.trim(); if (!v) return; onSend(v); ta.value = ""; sync(); }
    ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); fire(); } });
    send.addEventListener("click", fire);
    return { focus: () => ta.focus() };
  }

  /* ============================================================ COPILOT (omni) */
  let copilotChat, copilotComposer;
  function initCopilot() {
    copilotChat = window.ChatUI.create({
      scrollEl: document.getElementById("copilotScroll"),
      agent: window.PLATFORM_AGENT,
      onMapSegment: (ids) => { if (state.liveMapId) window.PXMAP.highlight(state.liveMapId, ids); },
    });
    copilotComposer = buildComposer(document.getElementById("copilotComposer"), q => copilotChat.ask(q), "Ask across RF, business & all data…");
    renderCopilotWelcome();
    document.getElementById("copilotClose").addEventListener("click", () => app.classList.remove("copilot-open"));
  }
  function renderCopilotWelcome() {
    const scroll = document.getElementById("copilotScroll");
    scroll.innerHTML = `<div class="agent-hero" style="padding-top:14px"><div class="orb" style="width:48px;height:48px;border-radius:14px">${icon("agent")}</div>
      <h2 style="font-size:17px">PlatformX Agent</h2><p style="font-size:12.5px">One agent across every connected dataset — RF engineering and operator business planning.</p></div>
      <div class="suggests" id="copSug"></div>`;
    const sug = scroll.querySelector("#copSug");
    window.PLATFORM_AGENT.SUGGESTIONS.forEach(s => { const b = window.UI.el("button", { class: "suggest-chip", html: `${icon(s.icon)}<span>${esc(s.text)}</span>` }); b.addEventListener("click", () => copilotChat.ask(s.text)); sug.appendChild(b); });
  }
  function openCopilot(prefill) { app.classList.add("copilot-open"); if (prefill) setTimeout(() => copilotChat.ask(prefill), 250); else copilotComposer.focus(); }
  window.__openCopilot = openCopilot;

  const state = { liveMapId: null };

  function connTile(c) {
    return `<div class="conn-tile"><div class="conn-logo" style="background:${c.color}">${c.letter}</div>
      <div style="min-width:0"><div class="cn">${esc(c.name)}</div><div class="ck">${esc(c.kind)}</div></div>
      <div style="margin-left:auto">${statusPill(c.status)}</div></div>`;
  }
  /* ============================================================ GALLERY */
  function ucCard(u) {
    const flag = { live: '<span class="pill ok status-flag"><span class="dot"></span>Live</span>', beta: '<span class="pill brand status-flag">Beta</span>', soon: '<span class="pill neutral status-flag">Coming soon</span>' }[u.status];
    const el = window.UI.el("div", { class: "uc-card" });
    el.innerHTML = `${flag}
      <div class="uc-ic" style="background:${u.color}">${icon(u.icon)}</div>
      <h3>${esc(u.name)}</h3>
      <div class="tagline">${esc(u.desc)}</div>
      <div class="uc-meta">${u.data.map(d => `<span class="tag">${esc(d)}</span>`).join("")}</div>
      <div class="uc-foot">${icon("gauge")} ${esc(u.maturity)} <span class="go">${u.status === 'live' ? 'Open' : 'Build'} ${icon("arrowright")}</span></div>`;
    el.addEventListener("click", () => window.Router.go(u.hash.replace('#', '')));
    return el;
  }
  function renderGallery() {
    setActive("gallery"); crumb([{ label: "Use-Case Gallery" }]); state.liveMapId = null;
    view.className = "view fade-in";
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>Use-Case Gallery</h1><p>Production journeys and templates. Each reuses the shared data layer — open one, or build your own.</p></div>
      <div class="actions"><a class="btn primary" href="#/builder">${icon("plus")} Build your own</a></div></div>
      <div class="uc-grid" id="ucGrid"></div>`;
    const grid = document.getElementById("ucGrid");
    PUBLISHED.concat(PF.USE_CASES).forEach(u => grid.appendChild(ucCard(u)));
    // build-your-own tile
    const b = window.UI.el("div", { class: "uc-card", style: "border-style:dashed;align-items:flex-start;justify-content:center" });
    b.innerHTML = `<div class="uc-ic" style="background:var(--brand-50);color:var(--brand-700)">${icon("plus")}</div>
      <h3>Build your own use-case</h3><div class="tagline">Compose data sources, analytics maturity, views and an agent persona into a new journey.</div>
      <div class="uc-foot"><span class="go" style="margin-left:0">Open builder ${icon("arrowright")}</span></div>`;
    b.addEventListener("click", () => window.Router.go("/builder"));
    grid.appendChild(b);
  }

  /* ============================================================ MARKETPLACE */
  function renderMarketplace() {
    setActive("marketplace"); crumb([{ label: "Data Marketplace" }]); state.liveMapId = null;
    view.className = "view fade-in";
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>Data Marketplace</h1><p>Every telecom data category in one catalog. Synthetic sources are live in this demo; real connectors are gated on operator access (Phase 1+).</p></div></div>
      <div class="card mb-24"><div class="card-head"><h3>Connectors</h3><span class="sub">source systems</span></div>
        <div class="card-body"><div class="conn-grid">${PF.CONNECTORS.map(connTile).join("")}</div></div></div>
      <div class="nav-label" style="padding-left:2px;margin-bottom:8px">Catalog</div>
      <div class="grid cols-2" id="catGrid"></div>`;
    paintCatalog();
  }
  function paintCatalog() {
    const grid = document.getElementById("catGrid");
    grid.innerHTML = PF.CATALOG.map(c => {
      const conn = c.datasets.filter(d => connected.has(c.cat + "/" + d.name)).length;
      return `<div class="cat-card"><div class="cat-head"><div class="ci" style="background:${c.color}">${icon(c.icon)}</div>
        <div><h3>${esc(c.cat)}</h3><p>${esc(c.blurb)}</p></div><div class="cc">${conn}/${c.datasets.length} on</div></div>
        ${c.datasets.map(d => {
          const key = c.cat + "/" + d.name; const on = connected.has(key);
          return `<div class="ds-row"><div class="ds-main"><div class="n">${esc(d.name)} <span class="tag" style="margin-left:4px">${d.phase}</span></div><div class="i">${esc(d.items)}</div></div>
            <div class="ds-src">${esc(d.source)}</div>
            ${on ? `<button class="ds-toggle" data-key="${esc(key)}" style="color:var(--ok);border-color:var(--ok-br);background:var(--ok-bg)">${icon("check")} Connected</button>`
                 : `<button class="ds-toggle" data-key="${esc(key)}">${d.status === 'request' ? 'Request access' : 'Connect'}</button>`}</div>`;
        }).join("")}</div>`;
    }).join("");
    grid.querySelectorAll(".ds-toggle").forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (connected.has(key)) { connected.delete(key); window.UI.toast("Disconnected " + key.split("/")[1]); }
      else { connected.add(key); window.UI.toast("Connected " + key.split("/")[1] + " (synthetic)"); }
      paintCatalog();
    }));
  }

  /* ============================================================ BUILDER */
  const BUILD_STEPS = [
    { t: "Define use-case", d: "Name & problem" },
    { t: "Select data", d: "From the catalog" },
    { t: "Analytics maturity", d: "Reactive → prescriptive" },
    { t: "Compose views", d: "Dashboard · map · agent" },
    { t: "Configure agent", d: "Persona & scope" },
    { t: "Review & publish", d: "Ship it" },
  ];
  const VIEW_OPTS = [
    { id: "dash", name: "Dashboard", icon: "overview", d: "Unified KPI cards & trends" },
    { id: "map", name: "GIS Map", icon: "map", d: "Geospatial, health-coded" },
    { id: "agent", name: "AI Agent", icon: "agent", d: "Conversational, grounded" },
    { id: "reports", name: "Reports", icon: "book", d: "Scheduled summaries" },
  ];
  const MATURITY = [
    { id: "reactive", name: "Reactive", d: "Dashboards & trends", locked: false },
    { id: "proactive", name: "Proactive", d: "Thresholds & anomalies", locked: false },
    { id: "diagnostic", name: "Diagnostic", d: "Correlate root cause", locked: false },
    { id: "predictive", name: "Predictive", d: "ML forecast", locked: false },
    { id: "prescriptive", name: "Prescriptive", d: "Closed-loop action", locked: false },
  ];
  function renderBuilder() {
    setActive("builder"); crumb([{ label: "Use-Case Builder" }]); state.liveMapId = null;
    view.className = "view fade-in";
    if (!builder) builder = { step: 0, name: "", problem: "", data: new Set(["Engineering/Network Performance KPIs", "Engineering/Network Alarms", "GIS/2D Geospatial"]), maturity: "diagnostic", views: new Set(["dash", "map", "agent"]), agentName: "RF Ops Copilot", persona: "rf" };
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>Use-Case Builder</h1><p>Compose a new agentic journey on the shared data layer — guided, in six steps.</p></div></div>
      <div class="builder">
        <div class="steps-rail" id="rail"></div>
        <div class="builder-panel"><div class="builder-body" id="bbody"></div>
          <div class="builder-foot"><button class="btn" id="bBack">${icon("chevron")} Back</button><div style="flex:1"></div><span class="cell-sub" id="bHint"></span><button class="btn primary" id="bNext">Continue ${icon("arrowright")}</button></div></div>
      </div>`;
    paintBuilder();
    document.getElementById("bBack").addEventListener("click", () => { if (builder.step > 0) { builder.step--; paintBuilder(); } });
    document.getElementById("bNext").addEventListener("click", () => {
      if (builder.step < BUILD_STEPS.length - 1) { builder.step++; paintBuilder(); }
      else publishUseCase();
    });
  }
  function paintBuilder() {
    document.getElementById("rail").innerHTML = BUILD_STEPS.map((s, i) =>
      `<div class="step-item ${i === builder.step ? "active" : ""} ${i < builder.step ? "done" : ""}" data-i="${i}">
        <div class="sn">${i < builder.step ? icon("check") : (i + 1)}</div><div><div class="st">${s.t}</div><div class="sd">${s.d}</div></div></div>`).join("");
    document.querySelectorAll(".step-item").forEach(it => it.addEventListener("click", () => { builder.step = +it.dataset.i; paintBuilder(); }));
    const body = document.getElementById("bbody");
    const next = document.getElementById("bNext");
    next.innerHTML = builder.step === BUILD_STEPS.length - 1 ? `${icon("rocket")} Publish use-case` : `Continue ${icon("arrowright")}`;
    next.className = "btn " + (builder.step === BUILD_STEPS.length - 1 ? "cyan" : "primary");

    if (builder.step === 0) {
      body.innerHTML = `<h3 class="mb-12">Define your use-case</h3>
        <div class="field mb-16"><label>Use-case name</label><input class="input" id="bName" placeholder="e.g. RF Engineer Agent" value="${esc(builder.name)}"></div>
        <div class="field mb-16"><label>Problem statement</label><textarea class="input" id="bProblem" rows="3" placeholder="What decision or task should this automate?">${esc(builder.problem)}</textarea></div>
        <div class="nav-label" style="padding-left:0">Start from a template</div>
        <div class="opt-grid c3 mt-8">${[["RF Engineer Agent", "Diagnose underperforming sites", "tower"], ["Business Plan", "Where to invest next", "dollar"], ["Churn Radar", "Spot churn-risk clusters", "users"]].map(t =>
          `<div class="opt" data-tpl="${esc(t[0])}"><div class="opt-ic">${icon(t[2])}</div><h4>${t[0]}</h4><p>${t[1]}</p></div>`).join("")}</div>`;
      body.querySelector("#bName").addEventListener("input", e => builder.name = e.target.value);
      body.querySelector("#bProblem").addEventListener("input", e => builder.problem = e.target.value);
      body.querySelectorAll("[data-tpl]").forEach(o => o.addEventListener("click", () => {
        builder.name = o.dataset.tpl; builder.problem = o.querySelector("p").textContent + " on the connected telecom data."; paintBuilder();
      }));
    } else if (builder.step === 1) {
      body.innerHTML = `<h3 class="mb-8">Select data sources</h3><p class="muted mb-16">Choose which connected datasets this use-case reasons over.</p>
        ${PF.CATALOG.map(c => `<div class="nav-label" style="padding-left:0">${esc(c.cat)}</div>
          <div class="opt-grid c2 mb-16">${c.datasets.map(d => { const key = c.cat + "/" + d.name; const sel = builder.data.has(key); const avail = connected.has(key);
            return `<div class="opt ${sel ? "sel" : ""} ${avail ? "" : ""}" data-key="${esc(key)}"><div class="opt-check">${icon("check")}</div><h4>${esc(d.name)}</h4><p>${esc(d.items)} ${avail ? "" : "· <span style='color:var(--warn)'>not connected</span>"}</p></div>`; }).join("")}</div>`).join("")}`;
      body.querySelectorAll(".opt[data-key]").forEach(o => o.addEventListener("click", () => { const k = o.dataset.key; if (builder.data.has(k)) builder.data.delete(k); else builder.data.add(k); o.classList.toggle("sel"); document.getElementById("bHint").textContent = builder.data.size + " datasets selected"; }));
      document.getElementById("bHint").textContent = builder.data.size + " datasets selected";
    } else if (builder.step === 2) {
      body.innerHTML = `<h3 class="mb-8">Analytics maturity</h3><p class="muted mb-16">The full product unlocks the complete journey — including predictive forecasts and prescriptive closed-loop actions.</p>
        <div class="ladder">${MATURITY.map(m => `<div class="rung ${builder.maturity === m.id ? "sel" : ""}" data-m="${m.id}" data-locked="false">${m.name}<small>${m.d}</small>${(m.id === 'predictive' || m.id === 'prescriptive') ? '<div class="mt-8"><span class="pill violet" style="height:18px">Advanced</span></div>' : ""}</div>`).join("")}</div>
        <div class="teaser mt-24" style="border-color:var(--ok-br);background:linear-gradient(180deg,var(--ok-bg),#fff)"><div class="lock" style="color:#15803d;background:var(--ok-bg)">${icon("checkcircle")} Predictive & Prescriptive — unlocked</div><p class="mt-8 muted" style="font-size:12.5px">In production these run on real historical data + ML. Preview them in <a href="#/advanced" style="color:var(--brand-700);font-weight:600">Predictive & Prescriptive →</a></p></div>`;
      body.querySelectorAll(".rung").forEach(r => r.addEventListener("click", () => { if (r.dataset.locked === "true") { window.UI.toast("Predictive/prescriptive unlock in Phase 2"); return; } builder.maturity = r.dataset.m; paintBuilder(); }));
    } else if (builder.step === 3) {
      body.innerHTML = `<h3 class="mb-8">Compose views</h3><p class="muted mb-16">Pick the surfaces users get in this use-case.</p>
        <div class="opt-grid c2">${VIEW_OPTS.map(v => `<div class="opt ${builder.views.has(v.id) ? "sel" : ""}" data-v="${v.id}"><div class="opt-check">${icon("check")}</div><div class="opt-ic">${icon(v.icon)}</div><h4>${v.name}</h4><p>${v.d}</p></div>`).join("")}</div>`;
      body.querySelectorAll(".opt[data-v]").forEach(o => o.addEventListener("click", () => { const v = o.dataset.v; if (builder.views.has(v)) builder.views.delete(v); else builder.views.add(v); o.classList.toggle("sel"); }));
    } else if (builder.step === 4) {
      body.innerHTML = `<h3 class="mb-12">Configure the agent</h3>
        <div class="field mb-16"><label>Agent name</label><input class="input" id="bAgent" value="${esc(builder.agentName)}"></div>
        <div class="nav-label" style="padding-left:0">Persona</div>
        <div class="opt-grid c3 mt-8">${[["rf", "RF Engineer", "Diagnose KPIs, alarms, tickets", "tower"], ["biz", "Business Planner", "Markets, churn, ROI", "dollar"], ["custom", "Custom", "Define your own scope", "sliders"]].map(p =>
          `<div class="opt ${builder.persona === p[0] ? "sel" : ""}" data-p="${p[0]}"><div class="opt-check">${icon("check")}</div><div class="opt-ic">${icon(p[3])}</div><h4>${p[1]}</h4><p>${p[2]}</p></div>`).join("")}</div>
        <div class="card pad mt-24" style="background:var(--brand-50);border-color:var(--brand-100)"><div class="row" style="gap:10px"><span class="pill brand"><span class="dot"></span>Powered by Claude</span><span class="cell-sub">Every answer is grounded in the selected datasets and cites its sources.</span></div></div>`;
      body.querySelector("#bAgent").addEventListener("input", e => builder.agentName = e.target.value);
      body.querySelectorAll(".opt[data-p]").forEach(o => o.addEventListener("click", () => { builder.persona = o.dataset.p; paintBuilder(); }));
    } else {
      const matName = MATURITY.find(m => m.id === builder.maturity).name;
      body.innerHTML = `<h3 class="mb-12">Review & publish</h3>
        <div class="card" style="box-shadow:none"><table class="mini" style="width:100%">
          <tr><td style="width:140px;color:var(--muted)">Name</td><td class="fw-6">${esc(builder.name || "Untitled use-case")}</td></tr>
          <tr><td style="color:var(--muted)">Problem</td><td>${esc(builder.problem || "—")}</td></tr>
          <tr><td style="color:var(--muted)">Data sources</td><td>${[...builder.data].map(d => `<span class="tag" style="margin:2px">${esc(d.split("/")[1])}</span>`).join("") || "—"}</td></tr>
          <tr><td style="color:var(--muted)">Maturity</td><td><span class="pill brand">${matName}</span></td></tr>
          <tr><td style="color:var(--muted)">Views</td><td>${[...builder.views].map(v => `<span class="tag" style="margin:2px">${VIEW_OPTS.find(o => o.id === v).name}</span>`).join("")}</td></tr>
          <tr><td style="color:var(--muted)">Agent</td><td class="fw-6">${esc(builder.agentName)}</td></tr>
        </table></div>
        <div class="teaser mt-16"><div class="row" style="gap:9px"><span class="pill ok"><span class="dot"></span>Ready</span><span class="cell-sub">Publishing adds this journey to the Use-Case Gallery for your team.</span></div></div>`;
    }
  }
  function publishUseCase() {
    const u = {
      id: "uc-" + Date.now(), name: builder.name || "Untitled use-case", icon: builder.persona === "biz" ? "dollar" : "puzzle",
      color: builder.persona === "biz" ? "#7C3AED" : "#0891B2", status: "live",
      desc: builder.problem || "Custom agentic use-case composed in the builder.",
      data: [...builder.data].map(d => d.split("/")[0]).filter((v, i, a) => a.indexOf(v) === i),
      maturity: MATURITY.find(m => m.id === builder.maturity).name, phase: "Custom",
      hash: builder.persona === "biz" ? "#/workspace/biz" : "#/workspace/rf",
    };
    PUBLISHED.unshift(u); builder = null;
    window.UI.toast("Use-case published to the gallery 🎉");
    window.Router.go("/gallery");
  }

  /* ============================================================ RF WORKSPACE */
  function renderRfWorkspace() {
    setActive("ws-rf"); crumb([{ label: "Workspaces", hash: "#/gallery" }, { label: "RF Engineer Agent" }]); state.liveMapId = "wsMap";
    view.className = "view fade-in";
    const n = D.network;
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>${icon("tower")} RF Engineer Agent</h1><p>Use-Case 1 · Engineering data · diagnostic maturity · ${n.sites} sites</p></div>
      <div class="actions"><a class="btn" href="../mvp/index.html" target="_blank" title="Open the standalone MVP console">${icon("eye")} Standalone console ↗</a><button class="btn primary" id="rfAsk">${icon("sparkle")} Ask the RF Agent</button></div></div>
      <div class="grid cols-4 mb-16">${n.headline.slice(0, 4).map(statCard).join("")}</div>
      <div class="grid" style="grid-template-columns:1.6fr 1fr">
        <div class="card"><div class="card-head"><h3>GIS network map</h3><span class="sub">health-coded</span></div>
          <div class="card-body" style="padding:0"><div class="map-panel" style="border:0;border-radius:0 0 12px 12px"><div id="wsMap" style="height:360px"></div>
            <div class="map-legend"><h5>Site health</h5><div class="lr"><span class="sw" style="background:var(--ok)"></span>Healthy · ${n.counts.ok}</div><div class="lr"><span class="sw" style="background:var(--warn)"></span>Degraded · ${n.counts.warn}</div><div class="lr"><span class="sw" style="background:var(--crit)"></span>Critical · ${n.counts.crit}</div></div></div></div></div>
        <div class="card" style="display:flex;flex-direction:column">
          <div class="card-head"><h3>Active alarms</h3><span class="pill crit" style="height:20px"><span class="dot"></span>${n.alarms.crit}</span></div>
          <div class="feed" style="overflow:auto;flex:1;max-height:360px">${D.alarms.slice(0, 9).map(alarmRow).join("")}</div></div>
      </div>`;
    window.PXMAP.render("wsMap", D.sites, { center: D.CENTER, zoom: 10, scroll: false });
    document.getElementById("rfAsk").addEventListener("click", () => openCopilot("Which sites are underperforming today?"));
  }

  /* ============================================================ BUSINESS WORKSPACE */
  let bizMap;
  function renderBizWorkspace() {
    setActive("ws-biz"); crumb([{ label: "Workspaces", hash: "#/gallery" }, { label: "Operator Business Plan" }]); state.liveMapId = null;
    view.className = "view fade-in";
    const b = PF.biz, r = b.rollup;
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>${icon("dollar")} Operator Business Plan</h1><p>Use-Case 2 · Marketing · customer · demographics · GIS · prescriptive (preview)</p></div>
      <div class="actions"><button class="btn primary" id="bizAsk">${icon("sparkle")} Ask the Business Agent</button></div></div>
      <div class="grid cols-4 mb-16">
        <div class="bigstat"><div class="l">${icon("users")} Subscribers</div><div class="v">${(r.subscribers/1e6).toFixed(2)}M</div></div>
        <div class="bigstat"><div class="l">${icon("store")} Avg market share</div><div class="v">${r.avgShare}%</div></div>
        <div class="bigstat"><div class="l">${icon("dollar")} ARPU</div><div class="v">$${r.arpu}</div></div>
        <div class="bigstat"><div class="l">${icon("users")} Avg churn</div><div class="v" style="color:var(--crit)">${r.avgChurn}%</div></div>
      </div>
      <div class="grid" style="grid-template-columns:1.5fr 1fr;margin-bottom:16px">
        <div class="card"><div class="card-head"><h3>Markets</h3><span class="sub">${b.markets.length} markets · click to inspect</span></div>
          <div class="table-wrap"><table class="data"><thead><tr><th>Market</th><th class="t-right">Pop</th><th class="t-right">Share</th><th class="t-right">Churn</th><th class="t-right">Coverage</th><th class="t-right">Candidate</th></tr></thead>
          <tbody>${[...b.markets].sort((x, y) => y.candidateScore - x.candidateScore).map(m => `<tr>
            <td><div class="fw-6">${esc(m.name)}</div><div class="cell-sub">${esc(m.density)}</div></td>
            <td class="t-right mono">${(m.pop/1000).toFixed(0)}k</td>
            <td class="t-right mono">${m.share}%</td>
            <td class="t-right mono" style="color:${m.churnRisk==='high'?'var(--crit)':m.churnRisk==='med'?'var(--warn)':'inherit'}">${m.churn}%</td>
            <td class="t-right mono">${m.coverage}%</td>
            <td class="t-right"><span class="pill ${m.candidateScore>=70?'crit':m.candidateScore>=55?'warn':'neutral'}" style="height:20px">${m.candidateScore}</span></td></tr>`).join("")}</tbody></table></div></div>
        <div class="card"><div class="card-head"><h3>Densification map</h3><span class="sub">bubble = population · color = churn</span></div>
          <div class="card-body" style="padding:0"><div id="bizMap" style="height:380px;border-radius:0 0 12px 12px"></div></div></div>
      </div>
      <div class="grid cols-2">
        <div class="card pad"><div class="row" style="gap:10px;margin-bottom:6px">${icon("compass")}<h3 style="font-size:14px">Top densification candidate</h3></div>
          <div class="value mono" style="font-size:24px">${esc(r.topCandidate.name)}</div>
          <p class="muted mt-8">Score ${r.topCandidate.candidateScore} · coverage ${r.topCandidate.coverage}% · est. ${money(r.topCandidate.revUplift*12)}/yr uplift · ${r.topCandidate.paybackYears}-yr payback.</p>
          <button class="btn sm primary mt-12" id="bizDensify">${icon("agent")} Ask: where to densify?</button></div>
        <div class="teaser" style="border-color:var(--ok-br);background:linear-gradient(180deg,var(--ok-bg),#fff)"><div class="lock" style="color:#15803d;background:var(--ok-bg)">${icon("checkcircle")} Prescriptive — unlocked</div>
          <h3 style="font-size:14px;margin-top:10px">Closed-loop investment optimizer</h3>
          <p class="muted mt-8" style="font-size:12.5px">The full product simulates capex scenarios and tracks action→result. Open it in <a href="#/advanced" style="color:var(--brand-700);font-weight:600">Predictive & Prescriptive →</a></p></div>
      </div>`;
    renderBizMap();
    document.getElementById("bizAsk").addEventListener("click", () => openCopilot("How is our market share trending?"));
    document.getElementById("bizDensify").addEventListener("click", () => openCopilot("Where should we densify next quarter?"));
  }
  function renderBizMap() {
    const c = document.getElementById("bizMap"); if (!c || typeof window.L === "undefined") { if (c) c.innerHTML = '<div class="empty center" style="height:100%"><div class="muted">Map offline</div></div>'; return; }
    if (bizMap) bizMap.remove();
    bizMap = L.map(c, { attributionControl: false, scrollWheelZoom: false }).setView(D.CENTER, 9);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { subdomains: "abcd" }).addTo(bizMap);
    const col = { high: "#DC2626", med: "#E0900B", low: "#16A34A" };
    PF.biz.markets.forEach(m => {
      L.circleMarker([m.lat, m.lng], { radius: 8 + (m.pop / 1000) / 14, fillColor: col[m.churnRisk], color: "#fff", weight: 2, fillOpacity: .7 })
        .bindPopup(`<b>${esc(m.name)}</b><br>${(m.pop/1000).toFixed(0)}k pop · ${m.share}% share<br>Churn ${m.churn}% · Candidate ${m.candidateScore}`, { closeButton: false })
        .addTo(bizMap);
    });
    setTimeout(() => bizMap.invalidateSize(), 150);
  }

  /* ============================================================ GOVERNANCE */
  function renderGovernance() {
    setActive("gov"); crumb([{ label: "Governance & Security" }]); state.liveMapId = null;
    view.className = "view fade-in";
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>${icon("shield")} Governance & Security</h1><p>Connectors, access, residency & audit — owned with TridentX security (PRD §13.9).</p></div></div>
      <div class="grid cols-4 mb-16">
        <div class="bigstat"><div class="l">${icon("db")} Connected sources</div><div class="v">${connected.size}</div></div>
        <div class="bigstat"><div class="l">${icon("lock")} Data residency</div><div class="v" style="font-size:18px">US-West</div></div>
        <div class="bigstat"><div class="l">${icon("shield")} PII exposure</div><div class="v" style="font-size:18px;color:var(--ok)">None</div></div>
        <div class="bigstat"><div class="l">${icon("users")} Roles</div><div class="v">4</div></div>
      </div>
      <div class="grid cols-2 mb-16">
        <div class="card"><div class="card-head"><h3>Connectors & access</h3></div>
          <div>${PF.CONNECTORS.map((c, i) => `<div class="gov-row"><div class="conn-logo" style="background:${c.color};width:30px;height:30px;font-size:13px">${c.letter}</div>
            <div style="flex:1"><div class="fw-6 fs-13">${esc(c.name)}</div><div class="cell-sub">${esc(c.kind)}</div></div>
            ${statusPill(c.status)}<div class="switch ${c.status === 'connected' ? '' : 'off'}"></div></div>`).join("")}</div></div>
        <div class="card"><div class="card-head"><h3>Access roles</h3></div>
          <div>${[["RF Engineer", "Read · network data, agent", "users"], ["Network Ops Lead", "Read/write · all use-cases", "shield"], ["BD / Exec", "Read · business plan", "dollar"], ["Security (Karanvir)", "Admin · connectors & audit", "lock"]].map(r =>
            `<div class="gov-row">${icon(r[2])}<div style="flex:1"><div class="fw-6 fs-13">${r[0]}</div><div class="cell-sub">${r[1]}</div></div></div>`).join("")}</div></div>
      </div>
      <div class="card"><div class="card-head"><h3>Audit log</h3><span class="sub">recent</span></div>
        <div class="feed">${[
          ["UNMS connector enabled (synthetic)", "Karanvir Channi", "2h ago", "info"],
          ["Data residency set to US-West", "Karanvir Channi", "1d ago", "ok"],
          ["RF Engineer Agent published", "Mitali Lakhere", "1d ago", "ok"],
          ["Ookla connector added", "Mitali Lakhere", "1d ago", "info"],
          ["Access role 'BD / Exec' created", "Karanvir Channi", "2d ago", "info"],
        ].map(a => `<div class="feed-row"><div class="sev ${a[3] === 'ok' ? 'info' : a[3]}"></div><div class="body"><div class="t" style="font-weight:500">${esc(a[0])}</div><div class="m">${esc(a[1])}</div></div><div class="ts">${a[2]}</div></div>`).join("")}</div></div>`;
  }

  /* ============================================================ DATA LAYER */
  function renderDataLayer() {
    setActive("datalayer"); crumb([{ label: "Data Layer" }]); state.liveMapId = null;
    window.PX_EXPLORE.mountView(view, { onAsk: (q) => openCopilot(q) });
  }

  /* ============================================================ PREDICTIVE & PRESCRIPTIVE (full product) */
  let advCharts = [];
  const advActions = [
    { title: "Down-tilt 3 sectors in Tacoma cluster", impact: "+0.4pp share · −0.6% churn", detail: "RF optimization on the worst retainability cluster.", applied: false, result: "share +0.3pp, churn −0.5% (14d)" },
    { title: "Targeted retention offer — Tacoma & Kent", impact: "−0.9% churn", detail: "Pair the coverage fix with a save offer to churn-risk cohort.", applied: false, result: "churn −0.7% (21d)" },
    { title: "Add 2 small cells — SeaTac corridor", impact: "+12 Mbps · +0.5pp share", detail: "Capacity for the densification candidate (positive ROI).", applied: false, result: "throughput +14 Mbps (30d)" },
  ];
  function forecast(series, H) {
    const n = series.length, xs = series.map((_, i) => i);
    const mx = (n - 1) / 2, my = series.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0; for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (series[i] - my); den += (xs[i] - mx) ** 2; }
    const slope = num / (den || 1), intercept = my - slope * mx;
    const resid = Math.sqrt(series.reduce((a, v, i) => a + (v - (intercept + slope * i)) ** 2, 0) / n) || 1;
    const hist = series.concat(Array(H).fill(null));
    const mean = Array(n).fill(null), up = Array(n).fill(null), lo = Array(n).fill(null);
    mean[n - 1] = series[n - 1]; up[n - 1] = series[n - 1]; lo[n - 1] = series[n - 1];
    for (let h = 1; h <= H; h++) { const yv = intercept + slope * (n - 1 + h), band = resid * (1 + h * 0.25); mean.push(window.PX_PLATFORM.round(yv, 2)); up.push(window.PX_PLATFORM.round(yv + band, 2)); lo.push(window.PX_PLATFORM.round(yv - band, 2)); }
    const labels = window.CHARTS.timeLabels(D.timeline.slice(-n)).concat(Array.from({ length: H }, (_, i) => "+" + (i + 1) + "h"));
    return { labels, hist, mean, up, lo, end: mean[mean.length - 1], slope };
  }
  function fcastCard(sigId, title) {
    const s = window.PX_EXPLORE.signalsById[sigId];
    const f = forecast(s.series, 8);
    const dirTxt = f.slope < 0 ? "declining" : "rising";
    return { html: `<div class="card"><div class="card-head"><span class="pill violet" style="height:20px">Predictive</span><h3>${esc(title)}</h3><div class="spacer"></div><span class="cell-sub">8h ML forecast</span></div>
      <div class="card-body"><div class="chart-box"><canvas id="fc_${sigId}"></canvas></div>
      <p class="muted mt-12" style="font-size:12.5px">Projected <b style="color:${f.slope < 0 ? 'var(--crit)' : 'var(--ok)'}">${dirTxt}</b> to <b class="mono">${s.fmt(f.end)}</b> in 8h (±band widens with horizon). Forecast on real historical data in production.</p></div></div>`, sigId, f };
  }
  function renderAdvanced() {
    setActive("advanced"); crumb([{ label: "Predictive & Prescriptive" }]); state.liveMapId = null;
    try { advCharts.forEach(c => c.destroy()); } catch (e) {} advCharts = [];
    view.className = "view fade-in";
    const cards = [fcastCard("mkt_share", "Market Share forecast"), fcastCard("mkt_churn", "Churn Rate forecast")];
    view.innerHTML = `<div class="page-head"><div class="titles"><h1>${icon("rocket")} Predictive & Prescriptive <span class="pill violet" style="height:20px;vertical-align:middle">Full product</span></h1><p>The top of the analytics journey — ML forecasts and closed-loop recommended actions (locked in the MVP).</p></div></div>
      <div class="grid cols-2 mb-24">${cards.map(c => c.html).join("")}</div>
      <div class="page-head"><div class="titles"><h1 style="font-size:18px">${icon("compass")} Prescriptive actions</h1><p>Recommended actions with predicted impact — apply to simulate closed-loop action → result.</p></div></div>
      <div class="card" id="advActions"></div>`;
    cards.forEach(c => { const ch = window.CHARTS.line(document.getElementById("fc_" + c.sigId), c.f.labels, [
      { label: "History", data: c.f.hist, color: window.CHARTS.COL.brand },
      { label: "Forecast", data: c.f.mean, color: window.CHARTS.COL.violet, fill: false, dash: [5, 4] },
      { label: "Upper", data: c.f.up, color: "#CBD5E1", fill: false, dash: [2, 3] },
      { label: "Lower", data: c.f.lo, color: "#CBD5E1", fill: false, dash: [2, 3] },
    ]); if (ch) advCharts.push(ch); });
    paintAdvActions();
  }
  function paintAdvActions() {
    const box = document.getElementById("advActions"); if (!box) return;
    box.innerHTML = advActions.map((a, i) => `<div class="gov-row">
      <span class="agent-avatar" style="width:30px;height:30px;border-radius:9px">${icon("bolt")}</span>
      <div style="flex:1"><div class="fw-6 fs-13">${esc(a.title)}</div><div class="cell-sub">${esc(a.detail)}</div></div>
      <span class="pill ${a.applied ? 'ok' : 'brand'}" style="height:22px">${a.applied ? icon("checkcircle") + " " + esc(a.result) : "Est. " + esc(a.impact)}</span>
      ${a.applied ? '<span class="pill ok" style="height:22px"><span class="dot"></span>Tracking</span>' : `<button class="btn sm primary" data-i="${i}">${icon("play")} Apply (simulate)</button>`}
    </div>`).join("");
    box.querySelectorAll("button[data-i]").forEach(b => b.addEventListener("click", () => { advActions[+b.dataset.i].applied = true; window.UI.toast("Action applied — tracking action → result"); paintAdvActions(); }));
  }

  /* ============================================================ RF ENGINEER CHATBOT */
  let agentChat;
  function renderAgent() {
    setActive("agent"); crumb([{ label: "RF Engineer Chatbot" }]); state.liveMapId = null;
    view.className = "view flush fade-in";
    view.innerHTML = `<div style="display:flex;flex-direction:column;height:calc(100vh - var(--topbar-h))">
      <div class="agent-head" style="padding:14px 22px;border-bottom:1px solid var(--border)">
        <div class="agent-avatar">${icon("agent")}<span class="live"></span></div>
        <div class="who"><b>RF Engineer Agent</b><span>Grounded on ${D.sites.length} sites · ${D.alarms.length} alarms · ${D.tickets.length} tickets · reactive + diagnostic</span></div>
        <div style="flex:1"></div>
        <span class="pill brand"><span class="dot"></span>Powered by Claude</span>
      </div>
      <div class="chat-scroll wide" id="agentScroll"></div>
      <div class="composer" id="agentComposer"></div>
    </div>`;
    const scroll = document.getElementById("agentScroll");
    scroll.innerHTML = `<div class="agent-hero">
      <div class="orb">${icon("agent")}</div>
      <h2>How can I help with the network today?</h2>
      <p>I'm your Agentic AI RF Engineer. I monitor LTE/5G KPIs, alarms and tickets across ${D.meta.metro} so you spend less time diagnosing and more time fixing.</p>
    </div>
    <div style="max-width:680px;margin:8px auto 0"><div class="nav-label" style="padding-left:4px">Suggested</div><div class="suggests" id="agentSug"></div></div>`;
    const sug = document.getElementById("agentSug");
    window.AGENT.SUGGESTIONS.forEach(s => { const b = window.UI.el("button", { class: "suggest-chip", html: `${icon(s.icon)}<span>${esc(s.text)}</span>` }); b.addEventListener("click", () => agentChat.ask(s.text)); sug.appendChild(b); });

    agentChat = window.ChatUI.create({ scrollEl: scroll, agent: window.AGENT, wide: true, onMapSegment: null });
    window.__agentAsk = (q) => agentChat.ask(q);
    const comp = buildComposer(document.getElementById("agentComposer"), q => agentChat.ask(q), "Ask about KPIs, alarms, underperforming sites…");
    comp.focus();
    if (window.__pendingAsk) { const q = window.__pendingAsk; window.__pendingAsk = null; setTimeout(() => agentChat.ask(q), 200); }
  }

  /* ============================================================ boot */
  function boot() {
    buildNav(); initCopilot();
    window.Router.add("/datalayer", renderDataLayer);
    window.Router.add("/gallery", renderGallery);
    window.Router.add("/marketplace", renderMarketplace);
    window.Router.add("/builder", renderBuilder);
    window.Router.add("/workspace/rf", renderRfWorkspace);
    window.Router.add("/agent", renderAgent);
    window.Router.add("/workspace/biz", renderBizWorkspace);
    window.Router.add("/advanced", renderAdvanced);
    window.Router.add("/governance", renderGovernance);
    window.Router.start();

    document.getElementById("navToggle").addEventListener("click", () => app.classList.toggle("nav-collapsed"));
    const gi = document.getElementById("gsearchInput");
    document.addEventListener("keydown", e => { if (e.key === "/" && document.activeElement !== gi && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); gi.focus(); } });
    gi.addEventListener("keydown", e => { if (e.key === "Enter" && gi.value.trim()) { const q = gi.value.trim(); gi.value = ""; openCopilot(q); } });
    document.addEventListener("keydown", e => { if (e.key === "Escape") app.classList.remove("copilot-open"); });
    window.addEventListener("resize", () => { window.PXMAP.invalidate(); if (bizMap) try { bizMap.invalidateSize(); } catch (e) {} });
  }
  boot();
})();
