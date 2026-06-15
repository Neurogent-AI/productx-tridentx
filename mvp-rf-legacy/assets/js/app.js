/* ============================================================================
   PlatformX MVP — application shell, views and wiring
   ========================================================================== */
(function () {
  "use strict";
  const D = window.PX_DATA, U = D.util, icon = window.UI.icon, esc = window.UI.esc;
  const view = document.getElementById("view");
  const app = document.getElementById("app");

  const state = { trendKpi: "thrpt", trendRange: 24, sitesFilter: { q: "", scope: "all", tech: "all" }, alarmFilter: "all", liveMapId: null };

  /* ---------------- navigation ---------------- */
  const NAV = [
    { sect: "Operations" },
    { id: "overview", label: "Network Overview", icon: "overview", hash: "#/overview" },
    { id: "sites", label: "Sites", icon: "tower", hash: "#/sites" },
    { id: "alarms", label: "Alarms", icon: "alarm", hash: "#/alarms", badge: () => D.network.alarms.crit },
    { id: "map", label: "GIS Map", icon: "map", hash: "#/map" },
    { sect: "Intelligence" },
    { id: "agent", label: "RF Engineer Agent", icon: "agent", hash: "#/agent" },
  ];

  function buildNav() {
    const sb = document.getElementById("sidebar");
    let html = "";
    NAV.forEach(n => {
      if (n.sect) { html += `<div class="nav-section"><div class="nav-label">${n.sect}</div></div>`; return; }
      const badge = n.badge && n.badge() ? `<span class="badge-count">${n.badge()}</span>` : "";
      html += `<a class="nav-item" data-id="${n.id}" href="${n.hash}">${icon(n.icon)}<span>${n.label}</span>${badge}</a>`;
    });
    html += `<div class="grow"></div>
      <div class="side-card">
        <h4>${icon("sparkle")} Try the demo</h4>
        <p>Ask the agent why a site is underperforming and watch it correlate KPIs, alarms & tickets.</p>
        <button id="navAsk">Open RF Agent</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;padding:12px 8px 2px;color:var(--muted-2);font-size:11px">
        ${icon("flask")} <span>Phase 0 · MVP · v0.1</span>
      </div>`;
    sb.innerHTML = html;
    sb.querySelector("#navAsk").addEventListener("click", () => window.Router.go("/agent"));
  }
  function setActive(id) { document.querySelectorAll(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.id === id)); }
  function crumb(parts) {
    document.getElementById("crumb").innerHTML = `<span class="crumb">${parts.map((p, i) => i < parts.length - 1 ? `<a href="${p.hash}" style="color:var(--muted)">${esc(p.label)}</a><span class="sep">/</span>` : esc(p.label)).join("")}</span>`;
  }

  /* ---------------- shared builders ---------------- */
  function statCard(h) {
    const k = D.KPI_BY_ID[h.id];
    const color = window.CHARTS.COL[k.dir === "down" ? "warn" : "brand"];
    const statusColor = (() => {
      const st = U.kpiStatus(k, h.value);
      return st === "crit" ? "var(--crit)" : st === "warn" ? "var(--warn)" : "var(--brand-600)";
    })();
    return `<div class="stat">
      <div class="accent-bar" style="background:${statusColor}"></div>
      <div class="label">${esc(h.label)} <span class="hint">· network avg</span></div>
      <div class="value tnum">${h.value}<small>${h.unit === "%" ? "%" : " " + h.unit}</small></div>
      <div class="foot">${window.UI.deltaTag(h.delta, h.dir)}<span class="cell-sub">vs 24h ago</span></div>
      ${window.CHARTS.sparkline(h.series, { color })}
    </div>`;
  }

  function autoGrow(ta) { ta.style.height = "auto"; ta.style.height = Math.min(140, ta.scrollHeight) + "px"; }
  function buildComposer(container, onSend, placeholder) {
    container.innerHTML = `<div class="composer-inner">
      <div class="composer-box">
        <textarea rows="1" placeholder="${esc(placeholder || "Ask about KPIs, alarms, sites…")}"></textarea>
        <button class="composer-send" disabled>${icon("sendup")}</button>
      </div>
      <div class="composer-foot"><span class="grounded">${icon("checkcircle")} Grounded in your network data</span><span>·</span><span>Press Enter to send</span></div>
    </div>`;
    const ta = container.querySelector("textarea");
    const send = container.querySelector(".composer-send");
    function sync() { send.disabled = !ta.value.trim(); autoGrow(ta); }
    ta.addEventListener("input", sync);
    function fire() { const v = ta.value.trim(); if (!v) return; onSend(v); ta.value = ""; sync(); }
    ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); fire(); } });
    send.addEventListener("click", fire);
    return { focus: () => ta.focus(), setValue: (v) => { ta.value = v; sync(); ta.focus(); } };
  }

  /* ============================================================ COPILOT */
  let copilotChat, copilotComposer;
  const copilot = document.getElementById("copilot");
  function initCopilot() {
    copilotChat = window.ChatUI.create({
      scrollEl: document.getElementById("copilotScroll"),
      onMapSegment: (ids) => { if (state.liveMapId) window.PXMAP.highlight(state.liveMapId, ids); },
    });
    copilotComposer = buildComposer(document.getElementById("copilotComposer"), q => copilotChat.ask(q), "Ask the RF Agent…");
    renderCopilotWelcome();
    document.getElementById("copilotFab").addEventListener("click", () => openCopilot());
    document.getElementById("copilotClose").addEventListener("click", () => app.classList.remove("copilot-open"));
    document.getElementById("copilotExpand").addEventListener("click", () => { app.classList.remove("copilot-open"); window.Router.go("/agent"); });
  }
  function renderCopilotWelcome() {
    const scroll = document.getElementById("copilotScroll");
    scroll.innerHTML = `<div class="agent-hero" style="padding-top:14px">
      <div class="orb" style="width:48px;height:48px;border-radius:14px">${icon("agent")}</div>
      <h2 style="font-size:17px">RF Engineer Agent</h2>
      <p style="font-size:12.5px">I monitor ${D.sites.length} sites in ${D.meta.metro}. Ask me anything about KPIs, alarms or underperforming sites.</p>
    </div>
    <div class="suggests" id="copilotSug"></div>`;
    const sug = scroll.querySelector("#copilotSug");
    window.AGENT.SUGGESTIONS.forEach(s => {
      const b = window.UI.el("button", { class: "suggest-chip", html: `${icon(s.icon)}<span>${esc(s.text)}</span>` });
      b.addEventListener("click", () => copilotChat.ask(s.text));
      sug.appendChild(b);
    });
  }
  function openCopilot(prefill) {
    app.classList.add("copilot-open");
    if (prefill) setTimeout(() => copilotChat.ask(prefill), 250);
    else copilotComposer.focus();
  }
  window.__openCopilot = openCopilot;

  /* ============================================================ OVERVIEW */
  function renderOverview() {
    setActive("overview"); crumb([{ label: "Network Overview" }]); state.liveMapId = "mapOverview";
    const n = D.network;
    view.className = "view fade-in";
    view.innerHTML = `
      <div class="page-head">
        <div class="titles"><h1>Network Overview</h1><p>${D.meta.operator} · ${D.meta.metro} · ${n.sites} sites · ${n.sectors} sectors</p></div>
        <div class="actions">
          <div class="segmented" id="rangeSeg">
            <button data-r="24" class="active">24h</button><button data-r="48">48h</button><button data-r="72">72h</button>
          </div>
          <button class="btn" id="ovRefresh">${icon("refresh")} Refresh</button>
          <button class="btn primary" id="ovAsk">${icon("sparkle")} Ask the Agent</button>
        </div>
      </div>

      <div class="grid cols-4" style="margin-bottom:16px">
        ${n.headline.slice(0, 4).map(statCard).join("")}
      </div>

      <div class="grid" style="grid-template-columns:1.7fr 1fr;margin-bottom:16px">
        <div class="card">
          <div class="card-head">
            <h3>Network trend</h3>
            <div class="spacer"></div>
            <div class="segmented" id="trendSeg">
              <button data-k="thrpt" class="active">Throughput</button>
              <button data-k="dcr">Drop Call</button>
              <button data-k="rrc">RRC Success</button>
              <button data-k="sinr">SINR</button>
            </div>
          </div>
          <div class="card-body"><div class="chart-box"><canvas id="trendChart"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Site health</h3><span class="sub">${n.sites} sites</span></div>
          <div class="card-body">
            <div class="donut-wrap" style="height:150px">
              <canvas id="healthDonut"></canvas>
              <div class="donut-center"><b>${Math.round(n.counts.ok / n.sites * 100)}%</b><span>healthy</span></div>
            </div>
            <div class="legend mt-16">
              <div class="li"><span class="sw" style="background:var(--ok)"></span><span class="nm">Healthy</span><span class="ct">${n.counts.ok}</span></div>
              <div class="li"><span class="sw" style="background:var(--warn)"></span><span class="nm">Degraded</span><span class="ct">${n.counts.warn}</span></div>
              <div class="li"><span class="sw" style="background:var(--crit)"></span><span class="nm">Critical</span><span class="ct">${n.counts.crit}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid" style="grid-template-columns:1.7fr 1fr">
        <div class="card">
          <div class="card-head"><h3>GIS network map</h3><span class="sub">health-coded</span><div class="spacer"></div><a class="btn sm ghost" href="#/map">Expand ${icon("chevron")}</a></div>
          <div class="card-body" style="padding:0">
            <div class="map-panel" style="border:0;border-radius:0 0 12px 12px">
              <div id="mapOverview" style="height:340px"></div>
              <div class="map-legend"><h5>Site health</h5>
                <div class="lr"><span class="sw" style="background:var(--ok)"></span>Healthy · ${n.counts.ok}</div>
                <div class="lr"><span class="sw" style="background:var(--warn)"></span>Degraded · ${n.counts.warn}</div>
                <div class="lr"><span class="sw" style="background:var(--crit)"></span>Critical · ${n.counts.crit}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card" style="display:flex;flex-direction:column">
          <div class="card-head"><h3>Active alarms</h3><span class="pill crit" style="height:20px"><span class="dot"></span>${n.alarms.crit} critical</span><div class="spacer"></div><a class="btn sm ghost" href="#/alarms">All</a></div>
          <div class="feed" style="overflow:auto;flex:1">${D.alarms.slice(0, 8).map(alarmRow).join("")}</div>
        </div>
      </div>`;

    // charts
    renderTrend();
    window.CHARTS.donut(document.getElementById("healthDonut"), [n.counts.ok, n.counts.warn, n.counts.crit], [window.CHARTS.COL.ok, window.CHARTS.COL.warn, window.CHARTS.COL.crit]);
    window.PXMAP.render("mapOverview", D.sites, { center: D.CENTER, zoom: 10, scroll: false, onClick: null });

    document.getElementById("ovAsk").addEventListener("click", () => openCopilot());
    document.getElementById("ovRefresh").addEventListener("click", () => window.UI.toast("Network data refreshed · " + new Date().toLocaleTimeString()));
    view.querySelectorAll("#trendSeg button").forEach(b => b.addEventListener("click", () => {
      view.querySelectorAll("#trendSeg button").forEach(x => x.classList.remove("active")); b.classList.add("active");
      state.trendKpi = b.dataset.k; renderTrend();
    }));
    view.querySelectorAll("#rangeSeg button").forEach(b => b.addEventListener("click", () => {
      view.querySelectorAll("#rangeSeg button").forEach(x => x.classList.remove("active")); b.classList.add("active");
      state.trendRange = +b.dataset.r; renderTrend();
    }));
    view.querySelectorAll(".feed-row").forEach((r, i) => r.addEventListener("click", () => window.Router.go("/sites/" + D.alarms[i].site)));
  }
  function renderTrend() {
    const k = D.KPI_BY_ID[state.trendKpi];
    const ser = D.network.series[state.trendKpi].slice(-state.trendRange);
    const labels = window.CHARTS.timeLabels(D.timeline.slice(-state.trendRange));
    window.CHARTS.line(document.getElementById("trendChart"), labels,
      [{ label: k.label + " (" + k.unit + ")", data: ser, color: window.CHARTS.COL[k.dir === "down" ? "warn" : "brand"] }]);
  }
  function alarmRow(a) {
    return `<div class="feed-row"><div class="sev ${a.sev === 'crit' ? 'crit' : a.sev === 'warn' ? 'warn' : 'info'}"></div>
      <div class="body"><div class="t">${esc(a.type)} ${window.UI.sevPill(a.sev)}</div>
      <div class="m">${a.site} · ${a.sector} · ${esc(a.hint)}</div></div>
      <div class="ts">${window.UI.timeAgo(a.ts)}</div></div>`;
  }

  /* ============================================================ SITES */
  function renderSites() {
    setActive("sites"); crumb([{ label: "Sites" }]); state.liveMapId = null;
    view.className = "view fade-in";
    view.innerHTML = `
      <div class="page-head">
        <div class="titles"><h1>Sites</h1><p>${D.sites.length} sites · click any row for the full KPI / alarm / ticket view</p></div>
        <div class="actions"><button class="btn" id="sitesExport">${icon("download")} Export</button></div>
      </div>
      <div class="card" style="margin-bottom:16px"><div class="card-body" style="padding:12px 14px">
        <div class="row wrap" style="gap:12px">
          <label class="gsearch" style="max-width:300px;flex:1;min-width:220px"><span style="color:var(--muted-2)">${icon("search")}</span><input id="siteSearch" placeholder="Search site ID or area…"></label>
          <div class="segmented" id="scopeSeg"><button data-s="all" class="active">All</button><button data-s="under">Underperforming</button><button data-s="crit">Critical</button></div>
          <div class="segmented" id="techSeg"><button data-t="all" class="active">All tech</button><button data-t="5G">5G</button><button data-t="LTE">LTE</button></div>
          <div class="spacer" style="flex:1"></div>
          <span class="cell-sub" id="siteCount"></span>
        </div>
      </div></div>
      <div class="card"><div class="table-wrap"><table class="data" id="sitesTable">
        <thead><tr>
          <th>Health</th><th>Site</th><th>Tech</th><th>Sectors</th>
          <th class="t-right">Throughput</th><th class="t-right">DCR</th><th class="t-right">RRC</th>
          <th class="t-right">Alarms</th><th class="t-right">Tickets</th><th></th>
        </tr></thead>
        <tbody id="sitesBody"></tbody>
      </table></div></div>`;

    const sb = view.querySelector("#siteSearch");
    sb.addEventListener("input", () => { state.sitesFilter.q = sb.value.toLowerCase(); paintSites(); });
    view.querySelectorAll("#scopeSeg button").forEach(b => b.addEventListener("click", () => { view.querySelectorAll("#scopeSeg button").forEach(x => x.classList.remove("active")); b.classList.add("active"); state.sitesFilter.scope = b.dataset.s; paintSites(); }));
    view.querySelectorAll("#techSeg button").forEach(b => b.addEventListener("click", () => { view.querySelectorAll("#techSeg button").forEach(x => x.classList.remove("active")); b.classList.add("active"); state.sitesFilter.tech = b.dataset.t; paintSites(); }));
    view.querySelector("#sitesExport").addEventListener("click", () => window.UI.toast("Exported site list (CSV) — demo"));
    paintSites();
  }
  function paintSites() {
    const f = state.sitesFilter;
    let list = D.sites.filter(s => {
      if (f.tech !== "all" && s.tech !== f.tech) return false;
      if (f.scope === "under" && s.status === "ok") return false;
      if (f.scope === "crit" && s.status !== "crit") return false;
      if (f.q && !(s.id.toLowerCase().includes(f.q) || s.area.toLowerCase().includes(f.q))) return false;
      return true;
    }).sort((a, b) => a.health - b.health);
    const body = document.getElementById("sitesBody");
    document.getElementById("siteCount").textContent = list.length + " of " + D.sites.length + " sites";
    if (!list.length) { body.innerHTML = `<tr><td colspan="10"><div class="empty">${icon("search")}<h4>No sites match</h4><div>Adjust your filters.</div></div></td></tr>`; return; }
    body.innerHTML = list.map(s => {
      const thr = U.latest(s.kpis.thrpt), dcr = U.latest(s.kpis.dcr), rrc = U.latest(s.kpis.rrc);
      const dcrCrit = U.kpiStatus(D.KPI_BY_ID.dcr, dcr) !== "ok";
      return `<tr data-id="${s.id}">
        <td><span class="row" style="gap:8px"><span class="hdot ${s.status}"></span><span class="cell-sub">${s.health}</span></span></td>
        <td><div class="cell-id">${s.id}</div><div class="cell-sub">${esc(s.area)} · ${s.vendor}</div></td>
        <td>${window.UI.techPill(s.tech)}</td>
        <td class="mono">${s.sectors.length}</td>
        <td class="t-right mono">${U.round(thr, 0)}<span class="cell-sub"> Mbps</span></td>
        <td class="t-right mono" style="color:${dcrCrit ? 'var(--crit)' : 'inherit'}">${dcr}%</td>
        <td class="t-right mono">${rrc}%</td>
        <td class="t-right">${s.alarms.length ? `<span class="pill ${s.alarms.some(a => a.sev === 'crit') ? 'crit' : 'warn'}" style="height:20px">${s.alarms.length}</span>` : '<span class="cell-sub">—</span>'}</td>
        <td class="t-right">${s.tickets.length ? `<span class="pill neutral" style="height:20px">${s.tickets.length}</span>` : '<span class="cell-sub">—</span>'}</td>
        <td class="t-right">${icon("chevron", "muted")}</td>
      </tr>`;
    }).join("");
    body.querySelectorAll("tr[data-id]").forEach(tr => tr.addEventListener("click", () => window.Router.go("/sites/" + tr.dataset.id)));
  }

  /* ============================================================ SITE DETAIL */
  function renderSiteDetail(id) {
    const s = D.SITES_BY_ID[id];
    if (!s) { view.innerHTML = `<div class="empty">${icon("warn")}<h4>Site not found</h4></div>`; return; }
    setActive("sites"); crumb([{ label: "Sites", hash: "#/sites" }, { label: s.id }]); state.liveMapId = "miniMap";
    view.className = "view fade-in";
    const hero = (s._heroAlarm || s.alarms[0]); const heroT = (s._heroTicket || s.tickets[0]);
    const isHero = s._profile !== "normal" && s.status !== "ok";
    view.innerHTML = `
      <div class="page-head">
        <div class="detail-hero">
          <div class="id-block">
            <div class="row" style="gap:12px"><h1>${s.id}</h1>${window.UI.statusPill(s.status)}</div>
            <p class="muted mt-8">${esc(s.area)} · ${s.vendor} ${window.UI.techPill(s.tech)} · ${s.sectors.length} sector(s) · <span class="mono">${s.lat}, ${s.lng}</span></p>
          </div>
        </div>
        <div class="actions">
          <button class="btn" id="sdMap">${icon("location")} Show on map</button>
          <button class="btn primary" id="sdAsk">${icon("sparkle")} Ask the Agent about this site</button>
        </div>
      </div>

      <div class="row" style="gap:18px;align-items:stretch;margin-bottom:16px;flex-wrap:wrap">
        <div class="card pad" style="flex:1;min-width:240px">
          <div class="label muted fw-6">Composite health</div>
          <div class="row" style="gap:14px;margin-top:8px;align-items:baseline"><div class="value mono" style="font-size:32px;font-weight:600">${s.health}<small class="muted" style="font-size:15px">/100</small></div></div>
          <div class="meter ${s.status} mt-12"><i style="width:${s.health}%"></i></div>
          <div class="row mt-12" style="gap:8px"><span class="pill crit" style="height:20px">${s._critKpis} critical KPI</span><span class="pill warn" style="height:20px">${s._warnKpis} warning</span></div>
        </div>
        <div class="card pad" style="flex:1;min-width:240px">
          <div class="label muted fw-6">Sectors</div>
          <div class="row wrap mt-8" style="gap:8px">${s.sectors.map(sec => `<div class="sector-chip"><span class="mono">${sec.id.split("-").pop()}</span> · ${sec.band} · az ${sec.azimuth}°</div>`).join("")}</div>
        </div>
        <div class="card pad" style="flex:1;min-width:200px">
          <div class="label muted fw-6">Open items</div>
          <div class="row" style="gap:22px;margin-top:10px">
            <div><div class="value mono" style="font-size:26px;color:${s.alarms.length ? 'var(--crit)' : 'inherit'}">${s.alarms.length}</div><div class="cell-sub">alarms</div></div>
            <div><div class="value mono" style="font-size:26px">${s.tickets.length}</div><div class="cell-sub">tickets</div></div>
          </div>
        </div>
      </div>

      ${isHero && hero ? `<div class="corr-banner mb-16">
        <div class="ttl">${icon("bolt")} Likely root cause (agent correlation)</div>
        <p class="mt-8" style="color:var(--text-2)">KPI degradation here correlates with <strong>${esc(hero.type)}</strong> (<span class="mono">${hero.id}</span>) raised ${window.UI.timeAgo(hero.ts)} on ${hero.sector}${heroT ? `, and an open <strong>${heroT.priority}</strong> ticket <span class="mono">${heroT.id}</span>` : ""}. Probable cause: <strong>${/VSWR/.test(hero.type) ? "antenna / feeder-line fault" : /Transport/.test(hero.type) ? "backhaul / transport degradation" : /Sleeping|Power/.test(hero.type) ? "site outage (power / cell sleeping)" : "RF path degradation"}</strong>.</p>
        <button class="btn sm primary mt-12" id="sdDiagnose">${icon("agent")} See full diagnosis</button>
      </div>` : ""}

      <div class="grid cols-4" style="margin-bottom:16px">
        ${["thrpt", "sinr", "dcr", "hosr", "rrc", "latency", "afr", "reg5g"].map(kid => {
          const k = D.KPI_BY_ID[kid]; const v = U.latest(s.kpis[kid]); const st = U.kpiStatus(k, v);
          const c = st === "crit" ? "var(--crit)" : st === "warn" ? "var(--warn)" : "var(--text)";
          return `<div class="kpi-tile"><div class="k">${esc(k.label)}</div><div class="v" style="color:${c}">${U.fmt(kid, v).replace(/ /, '<small> ')}</small></div>${window.CHARTS.sparkline(s.kpis[kid].slice(-24), { color: st === "ok" ? window.CHARTS.COL.brand : window.CHARTS.COL[st === "crit" ? "crit" : "warn"], w: 80, h: 22 })}</div>`;
        }).join("")}
      </div>

      <div class="grid" style="grid-template-columns:1.5fr 1fr;margin-bottom:16px">
        <div class="card">
          <div class="card-head"><h3>KPI trends</h3><div class="spacer"></div>
            <div class="segmented" id="sdTrendSeg"><button data-k="thrpt" class="active">Throughput</button><button data-k="dcr">DCR</button><button data-k="sinr">SINR</button><button data-k="hosr">Handover</button></div>
          </div>
          <div class="card-body"><div class="chart-box"><canvas id="sdChart"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Location</h3><span class="sub">${esc(s.area)}</span></div>
          <div class="card-body" style="padding:0"><div id="miniMap"></div></div>
        </div>
      </div>

      <div class="grid cols-2">
        <div class="card">
          <div class="card-head"><h3>Alarms</h3><span class="sub">${s.alarms.length} open</span></div>
          ${s.alarms.length ? `<div class="feed">${s.alarms.map(alarmRow).join("")}</div>` : `<div class="empty">${icon("checkcircle")}<h4>No active alarms</h4></div>`}
        </div>
        <div class="card">
          <div class="card-head"><h3>Trouble tickets</h3><span class="sub">${s.tickets.length} open</span></div>
          ${s.tickets.length ? `<div class="feed">${s.tickets.map(ticketRow).join("")}</div>` : `<div class="empty">${icon("checkcircle")}<h4>No open tickets</h4></div>`}
        </div>
      </div>`;

    renderSdTrend(s, "thrpt");
    window.PXMAP.render("miniMap", [s], { center: [s.lat, s.lng], zoom: 13, scroll: false, zoomControl: false, fit: false });
    view.querySelectorAll("#sdTrendSeg button").forEach(b => b.addEventListener("click", () => { view.querySelectorAll("#sdTrendSeg button").forEach(x => x.classList.remove("active")); b.classList.add("active"); renderSdTrend(s, b.dataset.k); }));
    view.querySelector("#sdAsk").addEventListener("click", () => openCopilot("Why is " + s.id + " degraded?"));
    view.querySelector("#sdMap").addEventListener("click", () => window.Router.go("/map?focus=" + s.id));
    const dg = view.querySelector("#sdDiagnose"); if (dg) dg.addEventListener("click", () => openCopilot("Why is " + s.id + " degraded?"));
  }
  function renderSdTrend(s, kid) {
    const k = D.KPI_BY_ID[kid];
    window.CHARTS.line(document.getElementById("sdChart"), window.CHARTS.timeLabels(D.timeline),
      [{ label: k.label, data: s.kpis[kid], color: window.CHARTS.COL[k.dir === "down" ? "warn" : "brand"] }]);
  }
  function ticketRow(t) {
    return `<div class="feed-row"><div class="sev ${t.priority === 'P1' ? 'crit' : t.priority === 'P2' ? 'warn' : 'info'}"></div>
      <div class="body"><div class="t">${esc(t.title)} <span class="pill ${t.priority === 'P1' ? 'crit' : 'neutral'}" style="height:18px">${t.priority}</span></div>
      <div class="m">${t.id} · ${t.sector} · ${esc(t.status)}</div></div><div class="ts">${window.UI.timeAgo(t.ts)}</div></div>`;
  }

  /* ============================================================ ALARMS */
  function renderAlarms() {
    setActive("alarms"); crumb([{ label: "Alarms" }]); state.liveMapId = null;
    view.className = "view fade-in";
    const n = D.network;
    view.innerHTML = `
      <div class="page-head"><div class="titles"><h1>Alarms</h1><p>${n.alarms.total} active alarms across the network</p></div></div>
      <div class="grid cols-4" style="margin-bottom:16px">
        <div class="stat"><div class="accent-bar" style="background:var(--crit)"></div><div class="label">Critical</div><div class="value" style="color:var(--crit)">${n.alarms.crit}</div></div>
        <div class="stat"><div class="accent-bar" style="background:var(--warn)"></div><div class="label">Major</div><div class="value" style="color:var(--warn)">${n.alarms.warn}</div></div>
        <div class="stat"><div class="accent-bar" style="background:var(--info)"></div><div class="label">Info</div><div class="value" style="color:var(--info)">${n.alarms.info}</div></div>
        <div class="stat"><div class="accent-bar" style="background:var(--brand-600)"></div><div class="label">Alarm volume (24h)</div><div class="value">${n.alarmVolume.reduce((a, b) => a + b, 0)}</div>${window.CHARTS.sparkline(n.alarmVolume, { color: window.CHARTS.COL.crit })}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Active alarms</h3><div class="spacer"></div>
          <div class="segmented" id="almSeg"><button data-s="all" class="active">All</button><button data-s="crit">Critical</button><button data-s="warn">Major</button><button data-s="info">Info</button></div>
        </div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Severity</th><th>Alarm</th><th>Site</th><th>Sector</th><th>Raised</th><th>State</th></tr></thead><tbody id="almBody"></tbody></table></div>
      </div>`;
    view.querySelectorAll("#almSeg button").forEach(b => b.addEventListener("click", () => { view.querySelectorAll("#almSeg button").forEach(x => x.classList.remove("active")); b.classList.add("active"); state.alarmFilter = b.dataset.s; paintAlarms(); }));
    paintAlarms();
  }
  function paintAlarms() {
    let list = D.alarms.filter(a => state.alarmFilter === "all" || a.sev === state.alarmFilter);
    document.getElementById("almBody").innerHTML = list.map(a => `
      <tr data-site="${a.site}">
        <td>${window.UI.sevPill(a.sev)}</td>
        <td><div class="fw-6">${esc(a.type)}</div><div class="cell-sub">${esc(a.hint)}</div></td>
        <td class="cell-id">${a.site}</td><td class="mono cell-sub">${a.sector}</td>
        <td class="cell-sub">${window.UI.timeAgo(a.ts)}</td>
        <td>${a.ack ? '<span class="pill neutral" style="height:20px">Acknowledged</span>' : '<span class="pill warn" style="height:20px"><span class="dot"></span>New</span>'}</td>
      </tr>`).join("");
    document.querySelectorAll("#almBody tr").forEach(tr => tr.addEventListener("click", () => window.Router.go("/sites/" + tr.dataset.site)));
  }

  /* ============================================================ MAP */
  function renderMap(query) {
    setActive("map"); crumb([{ label: "GIS Map" }]); state.liveMapId = "mapFull";
    view.className = "view flush fade-in";
    const n = D.network;
    view.innerHTML = `<div class="map-panel" style="border:0;border-radius:0">
      <div id="mapFull"></div>
      <div class="map-float-card">
        <div class="card-head" style="padding:11px 13px"><h3 style="font-size:13px">${D.meta.metro}</h3></div>
        <div style="padding:11px 13px">
          <div class="row between fs-13"><span class="muted">Total sites</span><b class="mono">${n.sites}</b></div>
          <div class="row between fs-13 mt-8"><span class="muted">Critical</span><b class="mono" style="color:var(--crit)">${n.counts.crit}</b></div>
          <div class="row between fs-13 mt-8"><span class="muted">Degraded</span><b class="mono" style="color:var(--warn)">${n.counts.warn}</b></div>
          <button class="btn sm primary" style="width:100%;margin-top:12px" id="mapAsk">${icon("sparkle")} Ask the Agent</button>
        </div>
      </div>
      <div class="map-legend"><h5>Site health</h5>
        <div class="lr"><span class="sw" style="background:var(--ok)"></span>Healthy</div>
        <div class="lr"><span class="sw" style="background:var(--warn)"></span>Degraded</div>
        <div class="lr"><span class="sw" style="background:var(--crit)"></span>Critical</div>
      </div>
    </div>`;
    window.PXMAP.render("mapFull", D.sites, { center: D.CENTER, zoom: 10, scroll: true });
    view.querySelector("#mapAsk").addEventListener("click", () => openCopilot());
    if (query && query.focus) setTimeout(() => window.PXMAP.highlight("mapFull", query.focus.split(",")), 400);
  }

  /* ============================================================ AGENT */
  let agentChat;
  function renderAgent() {
    setActive("agent"); crumb([{ label: "RF Engineer Agent" }]); state.liveMapId = null;
    view.className = "view flush fade-in";
    view.style.cssText = "";
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

    agentChat = window.ChatUI.create({ scrollEl: scroll, wide: true, onMapSegment: null });
    const comp = buildComposer(document.getElementById("agentComposer"), q => agentChat.ask(q), "Ask about KPIs, alarms, underperforming sites…");
    comp.focus();
    if (window.__pendingAsk) { const q = window.__pendingAsk; window.__pendingAsk = null; setTimeout(() => agentChat.ask(q), 200); }
  }

  /* ============================================================ boot */
  function boot() {
    buildNav(); initCopilot();
    window.Router.add("/overview", renderOverview);
    window.Router.add("/sites", renderSites);
    window.Router.add("/sites/:id", (p) => renderSiteDetail(p.id));
    window.Router.add("/alarms", renderAlarms);
    window.Router.add("/map", (p, q) => renderMap(q));
    window.Router.add("/agent", renderAgent);
    window.Router.start();

    // nav collapse
    document.getElementById("navToggle").addEventListener("click", () => app.classList.toggle("nav-collapsed"));
    // global search → agent
    const gi = document.getElementById("gsearchInput");
    document.addEventListener("keydown", e => { if (e.key === "/" && document.activeElement !== gi && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); gi.focus(); } });
    gi.addEventListener("keydown", e => {
      if (e.key === "Enter" && gi.value.trim()) {
        const q = gi.value.trim(); gi.value = "";
        const siteMatch = q.match(/sea[-\s]?\d{1,4}/i);
        if (siteMatch) { const id = "SEA-" + siteMatch[0].replace(/\D/g, "").padStart(4, "0"); if (D.SITES_BY_ID[id]) { window.Router.go("/sites/" + id); return; } }
        window.__pendingAsk = q; window.Router.go("/agent");
      }
    });
    // close copilot on Escape
    document.addEventListener("keydown", e => { if (e.key === "Escape") app.classList.remove("copilot-open"); });
    window.addEventListener("resize", () => window.PXMAP.invalidate());
  }
  boot();
})();
