/* ============================================================================
   PlatformX MVP — RF Engineer Agent engine
   A grounded, intent-matching reasoning engine that *feels* like a live LLM
   agent. In production this is the latest Claude model (PRD §6.2); here it is
   deterministic + fully grounded in the synthetic dataset so demos are crisp.
   Returns a structured answer: { steps, segments, citations, followups }.
   Exposes window.AGENT
   ========================================================================== */
(function () {
  "use strict";
  const D = () => window.PX_DATA;
  const U = () => window.PX_DATA.util;
  const esc = (s) => window.UI.esc(s);
  const icon = (n, c) => window.UI.icon(n, c);

  /* ---------- starter prompts (PRD §4 demo question set) ---------- */
  const SUGGESTIONS = [
    { icon: "warn", text: "Which sites are underperforming today?" },
    { icon: "spark", text: "Why is throughput low on the worst 5G site?" },
    { icon: "alarm", text: "Summarize the open alarms on the critical sites" },
    { icon: "gauge", text: "Show me the worst retainability sites" },
    { icon: "clock", text: "What changed in the network in the last 24 hours?" },
  ];

  /* ---------- helpers ---------- */
  function findSiteInQuery(q) {
    const d = D();
    let m = q.match(/sea[-\s]?(\d{1,4})/i);
    if (m) { const id = "SEA-" + String(m[1]).padStart(4, "0"); if (d.SITES_BY_ID[id]) return d.SITES_BY_ID[id]; }
    m = q.match(/\b(\d{3,4})\b/);
    if (m) { const id = "SEA-" + String(m[1]).padStart(4, "0"); if (d.SITES_BY_ID[id]) return d.SITES_BY_ID[id]; }
    // area name
    const area = d.AREAS.find(a => q.toLowerCase().includes(a.name.toLowerCase().split(" ")[0]));
    if (area) { const inArea = d.sites.filter(s => s.area === area.name); if (inArea.length) return inArea.sort((a, b) => a.health - b.health)[0]; }
    return null;
  }
  function kpiInQuery(q) {
    const map = { throughput: "thrpt", "thru": "thrpt", speed: "thrpt", data: "thrpt", latency: "latency", sinr: "sinr", rsrp: "rsrp", drop: "dcr", dcr: "dcr", retain: "hosr", handover: "hosr", rrc: "rrc", rach: "rach", access: "afr", afr: "afr", "5g registration": "reg5g" };
    const ql = q.toLowerCase();
    for (const k in map) if (ql.includes(k)) return map[k];
    return null;
  }

  function sparkEmbed(siteOrSeries, kpiId, label) {
    const d = D();
    const series = Array.isArray(siteOrSeries) ? siteOrSeries : siteOrSeries.kpis[kpiId];
    const k = d.KPI_BY_ID[kpiId];
    const color = window.CHARTS.COL[k.dir === "down" ? "warn" : "brand"];
    return window.CHARTS.sparkline(series.slice(-24), { w: 220, h: 56, color });
  }

  function siteListEmbed(items, kpiId, title) {
    const d = D();
    const rows = items.map((it, i) => {
      const s = it.site || it;
      const val = it.value != null ? it.value : (kpiId ? U().latest(s.kpis[kpiId]) : s.health);
      const vtxt = kpiId ? d.util.fmt(kpiId, val) : s.health + " / 100";
      return `<div class="mini-row" onclick="location.hash='#/sites/${s.id}'">
        <span class="rank">${i + 1}</span>
        <span class="hdot ${s.status}"></span>
        <span class="nm">${s.id}<span class="cell-sub"> · ${esc(s.area)} · ${s.tech}</span></span>
        <span class="val" style="color:${s.status === 'crit' ? '#DC2626' : s.status === 'warn' ? '#E0900B' : '#0F172A'}">${vtxt}</span>
      </div>`;
    }).join("");
    return `<div class="embed"><div class="embed-head">${icon("sites")}${esc(title)}</div>${rows}</div>`;
  }

  function alarmEmbed(alarms, title) {
    const rows = alarms.slice(0, 6).map(a => `
      <div class="mini-row" onclick="location.hash='#/sites/${a.site}'">
        <span class="hdot ${a.sev === 'crit' ? 'crit' : a.sev === 'warn' ? 'warn' : 'ok'}"></span>
        <span class="nm">${esc(a.type)}<span class="cell-sub"> · ${a.site} · ${a.sector}</span></span>
        <span class="val cell-sub" style="font-weight:600">${window.UI.timeAgo(a.ts)}</span>
      </div>`).join("");
    return `<div class="embed"><div class="embed-head">${icon("alarm")}${esc(title)}</div>${rows}</div>`;
  }

  function ticketEmbed(t) {
    return `<div class="embed"><div class="embed-head">${icon("ticket")}Linked trouble ticket</div>
      <div class="mini-row" onclick="location.hash='#/sites/${t.site}'">
        <span class="pill crit" style="height:18px">${t.priority}</span>
        <span class="nm">${esc(t.title)}<span class="cell-sub"> · ${t.id} · ${t.status}</span></span>
        <span class="val cell-sub" style="font-weight:600">${window.UI.timeAgo(t.ts)}</span>
      </div></div>`;
  }

  function kpiTableEmbed(site) {
    const d = D();
    const ids = ["thrpt", "sinr", "dcr", "hosr", "rrc", "latency"];
    const rows = ids.map(id => {
      const k = d.KPI_BY_ID[id]; const v = U().latest(site.kpis[id]); const st = d.util.kpiStatus(k, v);
      return `<tr><td>${esc(k.label)}</td><td class="mono">${d.util.fmt(id, v)}</td><td>${window.UI.statusPill(st, st === 'ok' ? 'Normal' : st === 'warn' ? 'Warn' : 'Critical')}</td></tr>`;
    }).join("");
    return `<div class="embed"><div class="embed-head">${icon("gauge")}Key KPIs · ${site.id}</div>
      <table class="mini"><thead><tr><th>KPI</th><th>Now</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function cite(label, ic) { return { label, icon: ic || "db" }; }

  /* ---------- intent handlers ---------- */
  function handleUnderperforming() {
    const d = D();
    const list = d.util.underperforming(8);
    const crit = list.filter(s => s.status === "crit");
    const worst = list[0];
    return {
      steps: [
        { label: "Parsing request", detail: "intent: rank underperforming sites" },
        { label: "Querying KPI store", detail: `${d.sites.length} sites · last 24h` },
        { label: "Scoring site health", detail: "accessibility · retainability · throughput" },
        { label: "Cross-checking alarms & tickets", detail: `${d.alarms.length} active alarms` },
        { label: "Ranking results", detail: `${list.length} sites below threshold` },
      ],
      segments: [
        { type: "text", text: `I scanned all **${d.sites.length} sites** across ${d.meta.metro}. **${list.length}** are currently underperforming — **${crit.length} critical** and **${list.length - crit.length} degraded**. Here are the worst offenders by composite health score:\n` },
        { type: "embed", html: siteListEmbed(list, null, "Underperforming sites — ranked by health") },
        { type: "map", siteIds: list.map(s => s.id) },
        { type: "text", text: `\nThe most urgent is **${worst.id}** (${worst.area}) at **${worst.health}/100** with **${worst._critKpis} critical KPI(s)** and **${worst.alarms.length} open alarm(s)**. Want me to diagnose the likely root cause on ${worst.id}?` },
      ],
      citations: [cite("KPI store · " + d.sites.length + " sites"), cite("Fault mgmt · alarms", "alarm"), cite("Health model v0", "gauge")],
      followups: [`Why is ${worst.id} degraded?`, `Summarize alarms on ${worst.id}`, "Show these on the map"],
    };
  }

  function handleThroughput(site) {
    const d = D();
    const target = site || d.HERO.throughput;
    const ser = target.kpis.thrpt;
    const cur = U().latest(ser);
    const before = ser[ser.length - 28] || ser[0];
    const dropPct = Math.round((1 - cur / before) * 100);
    const alarm = target._heroAlarm || target.alarms.find(a => a.sev === "crit") || target.alarms[0];
    const ticket = target._heroTicket || target.tickets[0];
    const sinr = U().latest(target.kpis.sinr);
    const sector = (alarm && alarm.sector) || target.sectors[0].id;
    const segs = [
      { type: "text", text: `**${target.id}** (${target.area}, ${target.tech}) shows a clear throughput regression. DL throughput fell from **~${d.util.round(before, 0)} Mbps** to **${d.util.round(cur, 0)} Mbps** — about a **${dropPct}% drop** — over the degradation window, concentrated on sector **${sector}**.\n` },
      { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("trend")}DL Throughput (Mbps) · last 24h</div><div class="embed-chart">${sparkEmbed(target, "thrpt")}</div></div>` },
    ];
    if (alarm) {
      segs.push({ type: "text", text: `\n**Correlated signal:** at almost the same time, a **${alarm.sev === "crit" ? "critical" : "major"}** alarm — \`${esc(alarm.type)}\` (${alarm.id}) — was raised on the same sector ${window.UI.timeAgo(alarm.ts)}. SINR also dropped to **${sinr} dB**, consistent with an RF path problem rather than congestion.` });
      segs.push({ type: "embed", html: alarmEmbed([alarm], "Coincident alarm") });
    }
    if (ticket) segs.push({ type: "embed", html: ticketEmbed(ticket) });
    segs.push({ type: "map", siteIds: [target.id] });
    segs.push({ type: "text", text: `\n**Likely root cause:** ${alarm && /VSWR/.test(alarm.type) ? "antenna / feeder-line fault (high VSWR → reflected power → reduced effective radiated power)" : "RF path degradation on the serving sector"}. This is **not** congestion — PRB load is normal. \n\n**Recommended action:** dispatch a field tech to inspect the ${sector} antenna line and connectors; verify RET tilt against the golden config. I can draft the dispatch note or open a correlation report.` });
    return {
      steps: [
        { label: "Parsing request", detail: `intent: diagnose throughput · ${target.id}` },
        { label: "Pulling KPI time-series", detail: "throughput · SINR · latency · PRB" },
        { label: "Detecting change-point", detail: `−${dropPct}% throughput` },
        { label: "Correlating with alarms", detail: alarm ? alarm.type : "none" },
        { label: "Correlating with tickets", detail: ticket ? ticket.id : "none" },
        { label: "Forming diagnosis", detail: "RF path / antenna line" },
      ],
      segments: segs,
      citations: [cite(`KPI store · ${target.id}`), cite("Fault mgmt · " + (alarm ? alarm.id : "alarms"), "alarm"), ticket ? cite("Ticketing · " + ticket.id, "ticket") : cite("Config audit", "chip")],
      followups: [`Draft a field-dispatch note for ${target.id}`, `Show all alarms on ${target.id}`, "Which other sites have VSWR alarms?"],
    };
  }

  function handleRetainability() {
    const d = D();
    const worst = d.util.topWorstByKpi("dcr", 6);
    const hero = d.HERO.retain;
    return {
      steps: [
        { label: "Parsing request", detail: "intent: rank retainability" },
        { label: "Querying retainability KPIs", detail: "DCR · HOSR · RLF" },
        { label: "Ranking by drop call rate", detail: `${d.sites.length} sites` },
        { label: "Cross-checking alarms", detail: "transport · sync" },
      ],
      segments: [
        { type: "text", text: `Ranking sites by **retainability** (drop-call rate, handover success, radio-link failure). The tail is led by **${worst[0].site.id}** at **DCR ${worst[0].value}%** vs a network median near 0.4%.\n` },
        { type: "embed", html: siteListEmbed(worst, "dcr", "Worst retainability — by Drop Call Rate") },
        { type: "text", text: `\n**${hero.id}** stands out: handover success fell to **${U().latest(hero.kpis.hosr)}%** and RLF rose to **${U().latest(hero.kpis.rlf)}%**, coinciding with a **Transport / S1 Link Degraded** alarm — a classic backhaul-induced retainability hit along the corridor. There is an open **P1** ticket on it too.` },
        { type: "map", siteIds: worst.map(w => w.site.id) },
      ],
      citations: [cite("KPI store · retainability"), cite("Fault mgmt · transport", "alarm"), cite("Ticketing · P1", "ticket")],
      followups: [`Diagnose ${hero.id}`, "Summarize the open alarms on the critical sites", "What changed in the last 24 hours?"],
    };
  }

  function handleAlarms(site) {
    const d = D();
    if (site) {
      const al = site.alarms.slice().sort((a, b) => b.ts - a.ts);
      return {
        steps: [{ label: "Parsing request", detail: `alarms · ${site.id}` }, { label: "Querying fault management", detail: `${al.length} alarm(s)` }, { label: "Grouping by severity", detail: "crit · major · info" }],
        segments: [
          { type: "text", text: `**${site.id}** (${site.area}) has **${al.length} open alarm(s)**: ${al.filter(a => a.sev === "crit").length} critical, ${al.filter(a => a.sev === "warn").length} major.\n` },
          { type: "embed", html: alarmEmbed(al, "Open alarms · " + site.id) },
          al[0] ? { type: "text", text: `\nThe top alarm \`${esc(al[0].type)}\` (${al[0].id}) — ${esc(al[0].hint)} — is the most likely driver of the KPI impact here.` } : { type: "text", text: "" },
        ],
        citations: [cite("Fault mgmt · " + site.id, "alarm")],
        followups: [`Why is ${site.id} degraded?`, `Open ${site.id} detail`],
      };
    }
    const crit = d.alarms.filter(a => a.sev === "crit").slice(0, 8);
    const bySite = {};
    crit.forEach(a => (bySite[a.site] = bySite[a.site] || []).push(a));
    return {
      steps: [{ label: "Parsing request", detail: "summarize critical alarms" }, { label: "Querying fault management", detail: `${d.alarms.length} active` }, { label: "Filtering critical", detail: `${d.network.alarms.crit} critical` }, { label: "Grouping by site", detail: Object.keys(bySite).length + " sites" }],
      segments: [
        { type: "text", text: `There are **${d.network.alarms.total} active alarms** network-wide — **${d.network.alarms.crit} critical**, ${d.network.alarms.warn} major, ${d.network.alarms.info} info. The critical ones cluster on these sites:\n` },
        { type: "embed", html: alarmEmbed(crit, "Critical alarms — newest first") },
        { type: "map", siteIds: Object.keys(bySite) },
        { type: "text", text: `\nMost critical alarms are **VSWR**, **cell-sleeping**, and **power** faults — all hardware/RF issues warranting field dispatch. Want a per-site triage list?` },
      ],
      citations: [cite("Fault mgmt · " + d.alarms.length + " alarms", "alarm"), cite("Site inventory", "sites")],
      followups: ["Which sites are underperforming today?", "Diagnose the worst 5G site"],
    };
  }

  function handleChanged() {
    const d = D();
    const newCrit = d.alarms.filter(a => a.sev === "crit" && (Date.now() - a.ts) < 24 * 3600e3);
    const thrptDelta = d.network.headline.find(h => h.id === "thrpt").delta;
    const dcrDelta = d.network.headline.find(h => h.id === "dcr").delta;
    return {
      steps: [{ label: "Parsing request", detail: "intent: 24h delta" }, { label: "Diffing KPIs vs 24h ago", detail: "network rollups" }, { label: "Listing new alarms", detail: newCrit.length + " new critical" }, { label: "Summarizing" }],
      segments: [
        { type: "text", text: `In the **last 24 hours** across ${d.meta.metro}:` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("clock")}24-hour change summary</div>
          <table class="mini"><tbody>
          <tr><td>New critical alarms</td><td class="mono" style="color:#DC2626;font-weight:600">+${newCrit.length}</td></tr>
          <tr><td>Network avg throughput</td><td class="mono" style="color:${thrptDelta < 0 ? '#DC2626' : '#16A34A'};font-weight:600">${thrptDelta > 0 ? '+' : ''}${thrptDelta}%</td></tr>
          <tr><td>Network drop-call rate</td><td class="mono" style="color:${dcrDelta > 0 ? '#DC2626' : '#16A34A'};font-weight:600">${dcrDelta > 0 ? '+' : ''}${dcrDelta}%</td></tr>
          <tr><td>Sites now critical</td><td class="mono" style="font-weight:600">${d.network.counts.crit}</td></tr>
          <tr><td>Open P1 tickets</td><td class="mono" style="font-weight:600">${d.network.tickets.p1}</td></tr>
          </tbody></table></div>` },
        { type: "text", text: `\nThe biggest movers are **${d.HERO.throughput.id}** (throughput collapse) and **${d.HERO.retain.id}** (retainability). ${d.HERO.outage.id} also went into a cell-sleeping state. I'd prioritise those three.` },
        { type: "map", siteIds: [d.HERO.throughput.id, d.HERO.retain.id, d.HERO.outage.id] },
      ],
      citations: [cite("KPI store · 24h diff"), cite("Fault mgmt", "alarm"), cite("Ticketing", "ticket")],
      followups: [`Diagnose ${d.HERO.throughput.id}`, `Diagnose ${d.HERO.retain.id}`, "Which sites are underperforming today?"],
    };
  }

  function handleSite(site) {
    const d = D();
    return {
      steps: [{ label: "Parsing request", detail: `status · ${site.id}` }, { label: "Loading site profile", detail: `${site.tech} · ${site.sectors.length} sectors` }, { label: "Reading latest KPIs" }],
      segments: [
        { type: "text", text: `**${site.id}** — ${site.area}, ${site.vendor} ${site.tech}, ${site.sectors.length} sector(s). Composite health **${site.health}/100** (${site.status === "ok" ? "healthy" : site.status === "warn" ? "degraded" : "critical"}), with **${site.alarms.length} open alarm(s)** and **${site.tickets.length} ticket(s)**.\n` },
        { type: "embed", html: kpiTableEmbed(site) },
        site.status !== "ok" ? { type: "text", text: `\nThis site is **${site.status === "crit" ? "critical" : "degraded"}** — ${site._critKpis} KPI(s) below the critical threshold. Ask me *“why is ${site.id} degraded?”* for a root-cause correlation.` } : { type: "text", text: `\nThis site is operating within normal thresholds.` },
      ],
      citations: [cite("Site inventory · " + site.id, "sites"), cite("KPI store", "gauge")],
      followups: [`Why is ${site.id} degraded?`, `Summarize alarms on ${site.id}`, "Open site detail"],
    };
  }

  function handleHelp() {
    const d = D();
    return {
      steps: [{ label: "Loading capabilities", detail: "reactive + diagnostic" }],
      segments: [
        { type: "text", text: `I'm the **RF Engineer Agent** — I monitor your LTE/5G network so you spend less time diagnosing and more time fixing. I'm grounded in live data across **${d.sites.length} sites**, **${d.alarms.length} alarms**, and **${d.tickets.length} tickets** in ${d.meta.metro}.\n\nI can:` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("agent")}What I can do</div>
          ${["Find & rank underperforming sites / sectors", "Summarize open alarms & tickets for any site", "Diagnose a KPI dip by correlating alarms + tickets (root cause)", "Compare accessibility & retainability KPIs across the network", "Tell you what changed in the last 24 hours"].map(t => `<div class="mini-row"><span class="hdot ok"></span><span class="nm" style="font-weight:500">${t}</span></div>`).join("")}
        </div>` },
        { type: "text", text: `Try one of the suggestions below, or name a site like \`${d.HERO.throughput.id}\`.` },
      ],
      citations: [cite("Grounded on synthetic dataset", "flask")],
      followups: SUGGESTIONS.slice(0, 3).map(s => s.text),
    };
  }

  function handleFallback(q) {
    const d = D();
    const site = findSiteInQuery(q);
    if (site) return handleSite(site);
    return {
      steps: [{ label: "Parsing request", detail: "no exact intent match" }, { label: "Searching grounded data", detail: `${d.sites.length} sites` }],
      segments: [
        { type: "text", text: `I want to keep every answer grounded in your data, and I couldn't map that to a specific KPI or site with confidence. Here's what I can help with right now — pick one and I'll dig in:` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("sparkle")}Suggested questions</div>${SUGGESTIONS.map(s => `<div class="mini-row" onclick="window.__agentAsk && window.__agentAsk('${esc(s.text)}')">${icon(s.icon)}<span class="nm" style="font-weight:500;margin-left:4px">${esc(s.text)}</span></div>`).join("")}</div>` },
      ],
      citations: [cite("Scope: reactive + diagnostic", "info")],
      followups: [],
    };
  }

  /* ---------- router ---------- */
  function respond(query) {
    const q = (query || "").trim();
    const ql = q.toLowerCase();
    const site = findSiteInQuery(q);
    const kpi = kpiInQuery(q);

    if (/^(hi|hello|hey|help|what can you|who are you|capabilities)/.test(ql) || ql === "help")
      return handleHelp();
    if (/(underperform|worst sites|bad sites|problem sites|degrad|unhealthy|need attention|critical sites)/.test(ql) && !/retain|throughput/.test(ql))
      return handleUnderperforming();
    if (/(throughput|speed|slow data|data rate)/.test(ql) || (kpi === "thrpt"))
      return handleThroughput(site);
    if (/(retain|drop call|dropped call|handover|rlf|radio link)/.test(ql) || kpi === "dcr" || kpi === "hosr")
      return handleRetainability();
    if (/(alarm|fault|vswr|sleeping)/.test(ql))
      return handleAlarms(site);
    if (/(what changed|last 24|past 24|recently|today.*change|trend)/.test(ql))
      return handleChanged();
    if (site && /(why|degrad|wrong|issue|problem|diagnos|root cause)/.test(ql))
      return handleThroughput(site); // diagnose defaults to correlation flow
    if (site) return handleSite(site);
    return handleFallback(q);
  }

  window.AGENT = { respond, SUGGESTIONS };
})();
