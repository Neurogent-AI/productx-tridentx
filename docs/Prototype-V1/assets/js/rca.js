/* ============================================================================
   PLATFORMX — Guided Drop-Call RCA engine  (Jun-18 feedback #1)
   Realizes the client's two-step agentic RCA for drop-call rate:
     Step 1 — locate : filter sites by city/county/zip → rank worst DCR sites →
                       plot on the GIS map.
     Step 2 — diagnose: per-site Root Cause Analysis across the 5 reason
                       categories the client listed — handover failures, site
                       alarms, high utilization/capacity, radio-access failures,
                       coverage holes — each backed by the synthetic KPIs/alarms/
                       params already generated, with a plain-language verdict.
   Advanced VoLTE/VoNR/IMS-core failure modes from the client's RCA doc (SIP
   timeouts, RTP starvation, EN-DC/SRVCC, QCI/5QI) are surfaced as a "deeper
   diagnostic layer — requires core/IMS data (Phase 1)" note, not synthesised.

   Pure logic + a self-contained mountView(). Reused by the Data Layer
   (data-explore.js) and mirrored by the chat agent (agent.js).
   Exposes window.PX_RCA.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.PX_DATA, U = D.util, icon = window.UI.icon, esc = window.UI.esc;
  const PF = () => window.PX_PLATFORM;
  const latest = U.latest, round = U.round;

  /* ---- geography: derive synthetic county + zip from the metro areas ----
     (Greater Seattle → King / Pierce / Snohomish counties; a stable zip per area) */
  const COUNTY_OF = {
    "Downtown Seattle": "King", "Bellevue": "King", "Capitol Hill": "King",
    "Ballard": "King", "Redmond": "King", "Renton": "King", "Kent": "King",
    "SeaTac Airport": "King", "Sammamish": "King", "Issaquah": "King",
    "Tacoma": "Pierce", "Everett": "Snohomish",
  };
  const ZIP_OF = {
    "Downtown Seattle": "98101", "Bellevue": "98004", "Capitol Hill": "98102",
    "Ballard": "98107", "Redmond": "98052", "Renton": "98057", "Kent": "98032",
    "SeaTac Airport": "98158", "Sammamish": "98074", "Issaquah": "98027",
    "Tacoma": "98402", "Everett": "98201",
  };
  D.sites.forEach(s => { s._county = COUNTY_OF[s.area] || "King"; s._zip = ZIP_OF[s.area] || "98101"; });

  function geoOptions() {
    const cities = D.AREAS.map(a => a.name);
    const counties = [...new Set(Object.values(COUNTY_OF))];
    const zips = D.AREAS.map(a => ({ zip: ZIP_OF[a.name], area: a.name }));
    return { cities, counties, zips };
  }

  /* ---- Step 1: filter + rank by drop-call rate ---- */
  function filterSites(scope) {
    // scope: {kind:'all'|'city'|'county'|'zip', value}
    let list = D.sites.slice();
    if (scope && scope.kind === "city") list = list.filter(s => s.area === scope.value);
    else if (scope && scope.kind === "county") list = list.filter(s => s._county === scope.value);
    else if (scope && scope.kind === "zip") list = list.filter(s => s._zip === scope.value);
    return list;
  }
  function rankByDcr(scope, limit) {
    const list = filterSites(scope)
      .map(s => ({ site: s, dcr: latest(s.kpis.dcr) }))
      .sort((a, b) => b.dcr - a.dcr);
    return list.slice(0, limit || 10);
  }

  /* ---- Step 2: per-site RCA across the 5 reason categories ----
     Each reason returns {key, label, icon, hit (bool), severity, evidence[], note} */
  const NET_MED = { dcr: 0.4, hosr: 99.0, rlf: 0.6, afr: 0.7, rsrp: -88, sinr: 13, rrc: 99.3, rach: 99.1 };

  function reasonsFor(site) {
    const k = site.kpis;
    const cur = (id) => latest(k[id]);
    const reasons = [];

    // 1) Handover failures
    {
      const hosr = cur("hosr"), rlf = cur("rlf");
      const params = (PF() && PF().PARAM_AUDIT || []).filter(p => !p.compliant && p.impact === "Handover" && (p.scope || "").startsWith(site.id));
      const hit = hosr < NET_MED.hosr - 0.8 || rlf > NET_MED.rlf + 0.6 || site._profile === "retainability_drop" || params.length > 0;
      const ev = [];
      if (hosr < NET_MED.hosr) ev.push(`Handover Success ${hosr}% (median ~${NET_MED.hosr}%)`);
      if (rlf > NET_MED.rlf) ev.push(`Radio Link Failure ${rlf}% elevated`);
      params.forEach(p => ev.push(`Param: ${p.param} = ${p.actual} vs golden ${p.golden} — ${p.reason}`));
      reasons.push({ key: "handover", label: "Handover failures", icon: "refresh", hit, severity: hit ? (hosr < NET_MED.hosr - 2 ? "crit" : "warn") : "ok",
        evidence: ev.length ? ev : ["Handover KPIs within norms"],
        note: "Deeper layer: ping-pong handovers, SRVCC execution failures (needs mobility-trace / core data)." });
    }

    // 2) Site alarms
    {
      const al = site.alarms.slice().sort((a, b) => b.ts - a.ts);
      const crit = al.filter(a => a.sev === "crit");
      const hit = al.length > 0;
      reasons.push({ key: "alarms", label: "Site alarms", icon: "alarm", hit, severity: crit.length ? "crit" : al.length ? "warn" : "ok",
        evidence: al.length ? al.slice(0, 3).map(a => `${a.type} (${a.sev}) — ${a.hint}`) : ["No open alarms on this site"],
        note: "Fault-management alarms correlated by time/space to the drop window." });
    }

    // 3) High utilization / capacity
    {
      const thrpt = cur("thrpt"), lat = cur("latency");
      const congAlarm = site.alarms.find(a => /CPU|PRB|Utilization|Capacity/i.test(a.type));
      const hit = site._profile === "congestion" || !!congAlarm || lat > 40;
      const ev = [];
      if (site._profile === "congestion") ev.push("Congestion profile: throughput suppressed, latency elevated at busy hour");
      if (congAlarm) ev.push(`${congAlarm.type} — ${congAlarm.hint}`);
      ev.push(`DL throughput ${round(thrpt, 0)} Mbps · latency ${round(lat, 0)} ms`);
      reasons.push({ key: "capacity", label: "High utilization / capacity", icon: "gauge", hit, severity: hit ? "warn" : "ok",
        evidence: ev, note: "PRB/CPU load starves the voice scheduler → RLF under strain." });
    }

    // 4) Radio-access failures
    {
      const rrc = cur("rrc"), rach = cur("rach"), afr = cur("afr");
      const hit = rrc < NET_MED.rrc - 1 || rach < NET_MED.rach - 1 || afr > NET_MED.afr + 1 || site._profile === "outage";
      const ev = [];
      if (rrc < NET_MED.rrc) ev.push(`RRC Setup Success ${rrc}%`);
      if (rach < NET_MED.rach) ev.push(`RACH Success ${rach}%`);
      if (afr > NET_MED.afr) ev.push(`Access Failure Rate ${afr}% elevated`);
      reasons.push({ key: "radio", label: "Radio-access failures", icon: "network", hit, severity: hit ? (site._profile === "outage" ? "crit" : "warn") : "ok",
        evidence: ev.length ? ev : ["Accessibility KPIs healthy"],
        note: "Deeper layer: IMS registration / P-CSCF SIP 408/504 timeouts (needs core/IMS data)." });
    }

    // 5) Coverage holes
    {
      const rsrp = cur("rsrp"), sinr = cur("sinr");
      const hit = site._profile === "coverage" || rsrp < NET_MED.rsrp - 10 || sinr < NET_MED.sinr - 5;
      const ev = [];
      if (rsrp < NET_MED.rsrp) ev.push(`RSRP ${rsrp} dBm (weak)`);
      if (sinr < NET_MED.sinr) ev.push(`SINR ${sinr} dB (poor quality)`);
      if (site.density === "rural") ev.push("Rural morphology — wider inter-site distance");
      reasons.push({ key: "coverage", label: "Coverage holes", icon: "globe", hit, severity: hit ? "warn" : "ok",
        evidence: ev.length ? ev : ["Coverage within target"],
        note: "Deeper layer: mid-band propagation / cell-edge uplink budget, in-building penetration." });
    }
    return reasons;
  }

  function topReason(site) {
    const order = { crit: 0, warn: 1, ok: 2 };
    const hits = reasonsFor(site).filter(r => r.hit).sort((a, b) => order[a.severity] - order[b.severity]);
    return hits[0] || null;
  }

  function verdict(site) {
    const t = topReason(site);
    if (!t) return "Drop-call rate is within norms here; no single dominant root cause.";
    const map = {
      handover: "mobility / handover mis-tuning",
      alarms: "a hardware/transport fault flagged by alarms",
      capacity: "congestion / capacity strain",
      radio: "radio-access (accessibility) failures",
      coverage: "a coverage / RF-propagation hole",
    };
    return `Most likely root cause: **${map[t.key]}**. ${t.evidence[0]}.`;
  }

  /* ============================================================ VIEW */
  const st = { scope: { kind: "city", value: "Downtown Seattle" }, openSite: null };
  let resultMapDrawn = false;

  function destroy() { resultMapDrawn = false; }

  function mountView(viewEl, opts) {
    opts = opts || {};
    viewEl.className = "view fade-in";
    const g = geoOptions();
    viewEl.innerHTML = `
      <div class="page-head">
        <div class="titles"><h1>${icon("agent")} Drop-Call RCA</h1>
          <p>Guided root-cause analysis for drop-call rate — locate the worst sites, then diagnose each across the five failure domains.
          <span class="pill warn" style="height:20px;vertical-align:middle"><span class="dot"></span>Synthetic</span></p></div>
        <div class="actions"><a class="btn ghost sm" id="rcaBackCorr" href="#/datalayer">${icon("link")} Back to correlation</a></div>
      </div>

      <div class="card mb-16"><div class="card-body">
        <div class="row" style="gap:10px;margin-bottom:10px"><span class="pill brand"><span class="dot"></span>Step 1</span><b class="fs-13">Locate — filter drop-call sites & map them</b></div>
        <div class="row wrap" style="gap:14px;align-items:flex-end">
          <div class="field"><label>Filter by</label>
            <select class="input" id="rcaScopeKind" style="max-width:160px">
              <option value="city">City</option><option value="county">County</option><option value="zip">Zip code</option><option value="all">Whole metro</option>
            </select></div>
          <div class="field" id="rcaScopeValWrap"><label>Value</label>
            <select class="input" id="rcaScopeVal" style="max-width:220px"></select></div>
          <button class="btn primary" id="rcaRun" style="margin-bottom:0">${icon("bolt")} Find drop-call sites</button>
        </div>
      </div></div>

      <div id="rcaResult"></div>`;

    const kindSel = viewEl.querySelector("#rcaScopeKind");
    const valSel = viewEl.querySelector("#rcaScopeVal");
    const valWrap = viewEl.querySelector("#rcaScopeValWrap");
    function fillVals() {
      const kind = kindSel.value;
      if (kind === "all") { valWrap.style.display = "none"; return; }
      valWrap.style.display = "";
      if (kind === "city") valSel.innerHTML = g.cities.map(c => `<option>${esc(c)}</option>`).join("");
      else if (kind === "county") valSel.innerHTML = g.counties.map(c => `<option>${esc(c)} County</option>`).join("");
      else valSel.innerHTML = g.zips.map(z => `<option value="${z.zip}">${z.zip} · ${esc(z.area)}</option>`).join("");
    }
    fillVals();
    kindSel.value = st.scope.kind;
    fillVals();
    kindSel.addEventListener("change", fillVals);
    viewEl.querySelector("#rcaRun").addEventListener("click", () => {
      const kind = kindSel.value;
      let value = valSel.value;
      if (kind === "county") value = value.replace(/ County$/, "");
      st.scope = { kind, value };
      st.openSite = null;
      paintResult(viewEl.querySelector("#rcaResult"), opts);
    });

    paintResult(viewEl.querySelector("#rcaResult"), opts);
  }

  function scopeLabel(scope) {
    if (!scope || scope.kind === "all") return "the whole metro";
    if (scope.kind === "city") return scope.value;
    if (scope.kind === "county") return scope.value + " County";
    return "zip " + scope.value;
  }

  function paintResult(box, opts) {
    const ranked = rankByDcr(st.scope, 10);
    if (!ranked.length) { box.innerHTML = `<div class="empty">${icon("info")}<h4>No sites in ${esc(scopeLabel(st.scope))}</h4></div>`; return; }
    const worst = ranked[0];

    box.innerHTML = `
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:16px;align-items:start">
        <div class="card">
          <div class="card-head"><h3>Drop-call sites · ${esc(scopeLabel(st.scope))}</h3><span class="sub">ranked by DCR · top ${ranked.length}</span></div>
          <div id="rcaList"></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>${icon("map")} Map</h3><span class="sub">severity-coded</span></div>
          <div class="card-body" style="padding:0"><div id="rcaMap" style="height:340px;border-radius:0 0 12px 12px"></div></div>
        </div>
      </div>
      <div id="rcaDiag" class="mt-16"></div>`;

    // list
    const listEl = box.querySelector("#rcaList");
    listEl.innerHTML = ranked.map((r, i) => {
      const s = r.site;
      return `<div class="mini-row" data-site="${s.id}">
        <span class="rank">${i + 1}</span>
        <span class="nm">${s.id}<span class="cell-sub"> · ${esc(s.area)} · ${s.tech}</span></span>
        <span class="val" style="color:var(--crit)">${r.dcr}%</span>
        <span class="pill ${s.status}" style="height:18px;margin-left:8px"><span class="dot"></span>${s.status === "ok" ? "OK" : s.status === "warn" ? "Degraded" : "Critical"}</span></div>`;
    }).join("");
    listEl.querySelectorAll("[data-site]").forEach(el => el.addEventListener("click", () => {
      st.openSite = el.dataset.site;
      paintDiag(box.querySelector("#rcaDiag"), opts);
      try { window.PXMAP.highlight("rcaMap", [el.dataset.site]); } catch (e) {}
      box.querySelector("#rcaDiag").scrollIntoView({ behavior: "smooth", block: "start" });
    }));

    // map
    setTimeout(() => {
      try {
        window.PXMAP.render("rcaMap", ranked.map(r => r.site), {
          fit: true, scroll: false,
          onClick: (s) => { st.openSite = s.id; paintDiag(box.querySelector("#rcaDiag"), opts); },
        });
      } catch (e) {}
    }, 60);

    // auto-open the worst site's diagnosis
    st.openSite = st.openSite || worst.site.id;
    paintDiag(box.querySelector("#rcaDiag"), opts);
  }

  function paintDiag(box, opts) {
    const site = D.SITES_BY_ID[st.openSite];
    if (!site) { box.innerHTML = ""; return; }
    const reasons = reasonsFor(site);
    const hits = reasons.filter(r => r.hit);
    box.innerHTML = `
      <div class="card">
        <div class="card-head">
          <span class="pill brand" style="height:20px">Step 2</span>
          <h3>RCA · ${site.id}</h3>
          <span class="sub">${esc(site.area)} · ${site.tech} · DCR ${latest(site.kpis.dcr)}%</span>
          <div class="spacer"></div>
          <a class="btn ghost sm" href="#/workspace/rf">${icon("arrowright")} Open in RF workspace</a>
        </div>
        <div class="card-body">
          <div class="card pad mb-16" style="background:var(--brand-50);border-color:var(--brand-100)">
            <div class="row" style="gap:9px"><span class="agent-avatar" style="width:26px;height:26px;border-radius:8px">${icon("agent")}</span>
            <div class="fs-13" id="rcaVerdict" style="line-height:1.6"></div></div>
          </div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px" id="rcaReasons"></div>
          <div class="card pad mt-16" style="border-style:dashed">
            <div class="row" style="gap:8px"><span class="pill neutral" style="height:20px">${icon("lock")} Deeper layer · Phase 1</span>
            <span class="fs-13 muted">Voice-core failure modes — IMS registration / P-CSCF SIP 408·504 timeouts, RTP packet starvation, EN-DC desync, SRVCC, QCI/5QI mismatch — require core/IMS telemetry from the operator and unlock with real-data access.</span></div>
          </div>
          <div class="row mt-16" style="gap:10px">
            <button class="btn primary sm" id="rcaAskAgent">${icon("sparkle")} Ask the agent to investigate ${site.id}</button>
            <button class="btn ghost sm" id="rcaDispatch">${icon("ticket")} Open ticket for top cause</button>
          </div>
        </div>
      </div>`;

    box.querySelector("#rcaVerdict").innerHTML = verdict(site).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    box.querySelector("#rcaReasons").innerHTML = reasons.map(r => {
      const sevPill = r.hit ? `<span class="pill ${r.severity === "crit" ? "crit" : "warn"}" style="height:19px"><span class="dot"></span>Contributing</span>`
                            : `<span class="pill ok" style="height:19px"><span class="dot"></span>Clear</span>`;
      return `<div class="card pad" style="${r.hit ? "" : "opacity:.72"}">
        <div class="row" style="gap:8px;margin-bottom:8px"><span class="hdot ${r.severity}"></span><b class="fs-13">${icon(r.icon)} ${esc(r.label)}</b><div class="spacer"></div>${sevPill}</div>
        <ul style="margin:0;padding-left:16px" class="fs-13">${r.evidence.map(e => `<li style="margin:3px 0;color:var(--text-2)">${esc(e)}</li>`).join("")}</ul>
        <div class="cell-sub mt-8" style="font-style:italic">${esc(r.note)}</div>
      </div>`;
    }).join("");

    box.querySelector("#rcaAskAgent").addEventListener("click", () => {
      const q = `Investigate the drop-call rate on ${site.id}`;
      if (opts.onAsk) opts.onAsk(q); else if (window.__openCopilot) window.__openCopilot(q);
    });
    box.querySelector("#rcaDispatch").addEventListener("click", () => {
      const t = topReason(site);
      window.UI.toast(`Ticket drafted → ${t ? t.label : "RCA"} on ${site.id} (simulated)`);
    });
  }

  window.PX_RCA = {
    geoOptions, filterSites, rankByDcr, reasonsFor, topReason, verdict, scopeLabel,
    mountView, destroy,
  };
})();
