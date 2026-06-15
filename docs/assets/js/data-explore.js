/* ============================================================================
   PlatformX — Data Layer + Correlation/RCA engine  (the marketplace "journey")
   Realizes Gurtaj's flow: browse any category → KPI trend (reactive) → set a
   threshold/alert (proactive) → correlate signals across categories to find a
   root cause (diagnostic), e.g. "market share ↓ correlates with drop-call ↑".
   Deterministic synthetic series (marketing/customer/3rd-party derived from the
   engineering series so the correlations are real and tell a story).
   Exposes window.PX_EXPLORE  (data + a self-contained mountView()).
   ========================================================================== */
(function () {
  "use strict";
  const D = window.PX_DATA, U = D.util, icon = window.UI.icon, esc = window.UI.esc;
  const round = (v, d = 2) => { const p = Math.pow(10, d); return Math.round(v * p) / p; };

  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const R = rng(99173);
  const noise = (s) => (R() - 0.5) * 2 * s;

  const N = 24;
  const labels = window.CHARTS.timeLabels(D.timeline.slice(-N));
  const last = (arr) => arr[arr.length - 1];
  function zscore(arr) {
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    const sd = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1;
    return arr.map(v => (v - m) / sd);
  }

  // engineering base series (network rollups, last 24h)
  const eng = {
    dcr: D.network.series.dcr.slice(-N),
    thrpt: D.network.series.thrpt.slice(-N),
    rrc: D.network.series.rrc.slice(-N),
    sinr: D.network.series.sinr.slice(-N),
    hosr: D.network.series.hosr.slice(-N),
    afr: D.network.series.afr.slice(-N),
  };
  const drv = zscore(eng.dcr);    // ↑ = network getting worse
  const zthr = zscore(eng.thrpt); // ↑ = faster

  // derived business / customer / 3rd-party series (correlated to the network)
  const der = {
    share: drv.map(d => round(33 - 2.0 * d + noise(1.5), 2)),
    churn: drv.map(d => round(2.0 + 0.45 * d + noise(0.18), 2)),
    arpu: drv.map(d => round(52 - 0.6 * d + noise(0.8), 1)),
    netadds: drv.map(d => round(12 - 1.6 * d + noise(1.0), 1)),
    csat: drv.map(d => round(79 - 3.4 * d + noise(1.6), 1)),
    complaints: drv.map(d => Math.max(0, Math.round(110 + 26 * d + noise(9)))),
    nps: drv.map(d => Math.round(34 - 4 * d + noise(2))),
    ookla: zthr.map(z => round(180 + 34 * z + noise(8), 0)),
    osrank: zthr.map(z => Math.max(1, Math.round(3 - 1.4 * z + noise(0.5)))),
  };

  function sig(id, cat, name, unit, series, dir, fmt) {
    const cur = last(series), prev = series[0];
    const delta = round(((cur - prev) / (Math.abs(prev) || 1)) * 100, 1);
    return { id, cat, name, unit, series: series.slice(), dir, latest: cur, delta, fmt: fmt || ((v) => v + (unit === "%" ? "%" : unit ? " " + unit : "")) };
  }

  const CATS = [
    {
      id: "engineering", name: "Engineering", icon: "network", color: "#2563EB",
      blurb: "Radio-access network KPIs",
      signals: [
        sig("eng_dcr", "Engineering", "Drop Call Rate", "%", eng.dcr, "down"),
        sig("eng_thrpt", "Engineering", "DL Throughput", "Mbps", eng.thrpt, "up", v => Math.round(v) + " Mbps"),
        sig("eng_rrc", "Engineering", "RRC Setup Success", "%", eng.rrc, "up"),
        sig("eng_sinr", "Engineering", "SINR", "dB", eng.sinr, "up"),
        sig("eng_hosr", "Engineering", "Handover Success", "%", eng.hosr, "up"),
        sig("eng_afr", "Engineering", "Access Failure Rate", "%", eng.afr, "down"),
      ],
    },
    {
      id: "marketing", name: "Marketing", icon: "store", color: "#7C3AED",
      blurb: "Commercial performance",
      signals: [
        sig("mkt_share", "Marketing", "Market Share", "%", der.share, "up"),
        sig("mkt_churn", "Marketing", "Churn Rate", "%", der.churn, "down"),
        sig("mkt_arpu", "Marketing", "ARPU", "$", der.arpu, "up", v => "$" + v),
        sig("mkt_netadds", "Marketing", "Net Adds", "k", der.netadds, "up", v => v + "k"),
      ],
    },
    {
      id: "customer", name: "Customer Feedback", icon: "users", color: "#0891B2",
      blurb: "Voice of customer",
      signals: [
        sig("cx_csat", "Customer", "CSAT", "%", der.csat, "up"),
        sig("cx_complaints", "Customer", "Complaints", "/day", der.complaints, "down", v => v + "/day"),
        sig("cx_nps", "Customer", "NPS", "", der.nps, "up", v => "" + v),
      ],
    },
    {
      id: "thirdparty", name: "Third-Party", icon: "globe", color: "#16A34A",
      blurb: "Crowdsourced benchmarks",
      signals: [
        sig("tp_ookla", "Third-Party", "Ookla DL Speed", "Mbps", der.ookla, "up", v => Math.round(v) + " Mbps"),
        sig("tp_osrank", "Third-Party", "OpenSignal Rank", "", der.osrank, "down", v => "#" + v),
      ],
    },
  ];
  const signalsById = {};
  CATS.forEach(c => c.signals.forEach(s => { signalsById[s.id] = s; }));

  /* ---------- correlation ---------- */
  function pearson(a, b) {
    const n = a.length, ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n;
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
    return num / (Math.sqrt(da * db) || 1);
  }
  function strength(r) { const a = Math.abs(r); return a >= 0.8 ? "strong" : a >= 0.5 ? "moderate" : a >= 0.3 ? "weak" : "negligible"; }

  function correlate(aId, bId) {
    const a = signalsById[aId], b = signalsById[bId];
    const r = round(pearson(a.series, b.series), 2);
    return { a, b, r, strength: strength(r), sign: r < 0 ? "inverse" : "direct" };
  }

  function explanation(c) {
    const { a, b, r } = c;
    const dirWord = r < 0 ? "moves opposite to" : "moves together with";
    let conclusion = `This is a **${c.strength} ${c.sign}** correlation (r = ${r}). ${a.name} ${dirWord} ${b.name} over the last 24h.`;
    // telecom-flavoured root-cause hints for the marquee pairs
    const ids = [a.id, b.id].sort().join("|");
    if (ids === "eng_dcr|mkt_share") conclusion += ` The market-share decline tracks the rise in drop-call rate — a strong signal that the churn is **network-driven**, not pricing or sales. Recommend prioritising the worst RF clusters before a retention spend.`;
    else if (ids === "eng_dcr|mkt_churn") conclusion += ` Churn rises as drop-call rate rises — the experience problem is **converting into lost customers**. Pair a coverage fix with a targeted retention offer.`;
    else if (ids === "cx_complaints|eng_dcr") conclusion += ` Complaint volume rises with drop calls — customers are **feeling** the network degradation. A diagnostic dispatch will reduce inbound care load.`;
    else if (ids === "eng_thrpt|tp_ookla") conclusion += ` Internal throughput and crowdsourced Ookla speeds agree — the network view is **externally validated**.`;
    else if (a.cat !== b.cat) conclusion += ` Because these come from **different data categories**, this is exactly the kind of cross-silo insight a single-pane marketplace surfaces that siloed tools miss.`;
    return conclusion;
  }

  /* ============================================================ VIEW */
  let trendChart = null, corrChart = null;
  const st = { cat: "marketing", sigId: "mkt_share", threshold: null, a: "mkt_share", b: "eng_dcr", tab: "explore" };

  function destroy() { try { trendChart && trendChart.destroy(); } catch (e) {} try { corrChart && corrChart.destroy(); } catch (e) {} trendChart = corrChart = null; }

  function mountView(viewEl, opts) {
    opts = opts || {};
    destroy();
    viewEl.className = "view fade-in";
    viewEl.innerHTML = `
      <div class="page-head">
        <div class="titles"><h1>${icon("layers")} Data Layer</h1><p>Single pane of glass across every telecom data category — explore, threshold, and correlate. <span class="pill warn" style="height:20px;vertical-align:middle"><span class="dot"></span>Synthetic</span></p></div>
        <div class="actions"><div class="segmented" id="dlTab">
          <button data-t="explore" class="${st.tab === "explore" ? "active" : ""}">Explore & alert</button>
          <button data-t="rca" class="${st.tab === "rca" ? "active" : ""}">Correlate · RCA engine</button>
        </div></div>
      </div>
      <div id="dlBody"></div>`;
    viewEl.querySelectorAll("#dlTab button").forEach(b => b.addEventListener("click", () => { st.tab = b.dataset.t; mountView(viewEl, opts); }));
    if (st.tab === "explore") renderExplore(viewEl.querySelector("#dlBody"), opts);
    else renderRCA(viewEl.querySelector("#dlBody"), opts);
  }

  /* ---- Explore & alert (reactive + proactive) ---- */
  function renderExplore(body, opts) {
    body.innerHTML = `<div class="grid" style="grid-template-columns:230px 1fr;gap:16px;align-items:start">
      <div class="card" style="overflow:hidden"><div class="card-head"><h3 style="font-size:13px">Categories</h3></div><div id="dlCats"></div></div>
      <div id="dlMain"></div></div>`;
    const catsEl = body.querySelector("#dlCats");
    catsEl.innerHTML = CATS.map(c => `<div class="nav-item ${st.cat === c.id ? "active" : ""}" data-c="${c.id}" style="margin:2px 8px;border-radius:8px">${icon(c.icon)}<span>${esc(c.name)}</span><span class="badge-count" style="background:var(--bg-2);color:var(--muted)">${c.signals.length}</span></div>`).join("");
    catsEl.querySelectorAll("[data-c]").forEach(el => el.addEventListener("click", () => { st.cat = el.dataset.c; const c = CATS.find(x => x.id === st.cat); st.sigId = c.signals[0].id; st.threshold = null; renderExplore(body, opts); }));
    paintExploreMain(body.querySelector("#dlMain"), opts);
  }

  function paintExploreMain(main, opts) {
    const cat = CATS.find(c => c.id === st.cat);
    const s = signalsById[st.sigId] || cat.signals[0];
    st.sigId = s.id;
    main.innerHTML = `
      <div class="card" style="margin-bottom:16px"><div class="card-body" style="padding:12px 14px">
        <div class="row wrap" style="gap:8px">${cat.signals.map(x => `<button class="sector-chip ${x.id === s.id ? "active" : ""}" data-s="${x.id}">${esc(x.name)}</button>`).join("")}</div>
      </div></div>
      <div class="card">
        <div class="card-head"><span class="pill brand" style="height:20px">${esc(cat.name)}</span><h3>${esc(s.name)}</h3><div class="spacer"></div>
          <div class="stat" style="border:0;box-shadow:none;padding:0;text-align:right">
            <div class="value mono" style="font-size:22px">${s.fmt(s.latest)}</div>
            <div style="display:flex;gap:6px;justify-content:flex-end">${window.UI.deltaTag(s.delta, s.dir)}<span class="cell-sub">24h</span></div>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-box"><canvas id="dlTrend"></canvas></div>
          <div class="row between mt-16" style="flex-wrap:wrap;gap:12px">
            <div class="row" style="gap:12px;flex:1;min-width:260px">
              <span class="tag">${icon("bell")} Threshold alert</span>
              <input type="range" id="dlThresh" style="flex:1;accent-color:var(--brand-600)" />
              <span class="mono fw-6" id="dlThreshVal" style="min-width:64px;text-align:right"></span>
            </div>
            <div id="dlAlert"></div>
          </div>
        </div>
      </div>
      <div class="card pad mt-16" style="background:var(--brand-50);border-color:var(--brand-100)">
        <div class="row" style="gap:10px"><span class="pill brand"><span class="dot"></span>Diagnostic</span>
        <span class="fs-13">Want the <b>why</b>? Correlate this with another category in the <a href="#" id="dlToRca" style="color:var(--brand-700);font-weight:600">RCA engine →</a></span></div>
      </div>`;
    main.querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => { st.sigId = b.dataset.s; st.threshold = null; paintExploreMain(main, opts); }));
    main.querySelector("#dlToRca").addEventListener("click", (e) => { e.preventDefault(); st.tab = "rca"; st.a = s.id; mountView(document.getElementById("view"), opts); });

    // threshold slider bounds
    const vals = s.series, lo = Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * 0.15 || 1;
    const slider = main.querySelector("#dlThresh");
    slider.min = round(lo - pad, 2); slider.max = round(hi + pad, 2); slider.step = ((hi - lo) / 100) || 0.01;
    if (st.threshold == null) st.threshold = round(s.dir === "down" ? hi - pad * 0.5 : lo + pad * 0.5, 2);
    slider.value = st.threshold;
    function paintThresh() {
      st.threshold = +slider.value;
      main.querySelector("#dlThreshVal").textContent = s.fmt(round(st.threshold, 2));
      const breaches = vals.filter(v => s.dir === "down" ? v >= st.threshold : v <= st.threshold).length;
      const alertEl = main.querySelector("#dlAlert");
      alertEl.innerHTML = breaches
        ? `<span class="pill crit"><span class="dot"></span>${breaches} breach${breaches > 1 ? "es" : ""} → alert</span>`
        : `<span class="pill ok"><span class="dot"></span>Within threshold</span>`;
      drawTrend(s);
    }
    slider.addEventListener("input", paintThresh);
    paintThresh();
  }

  function drawTrend(s) {
    try { trendChart && trendChart.destroy(); } catch (e) {}
    const canvas = document.getElementById("dlTrend"); if (!canvas) return;
    const color = window.CHARTS.COL[s.dir === "down" ? "warn" : "brand"];
    const thrLine = labels.map(() => st.threshold);
    trendChart = window.CHARTS.line(canvas, labels, [
      { label: s.name, data: s.series, color },
      { label: "Threshold", data: thrLine, color: window.CHARTS.COL.crit, fill: false, dash: [5, 4] },
    ]);
  }

  /* ---- Correlate / RCA (diagnostic) ---- */
  function renderRCA(body, opts) {
    const sel = (id, val) => `<select class="input" id="${id}" style="max-width:280px">${CATS.map(c => `<optgroup label="${esc(c.name)}">${c.signals.map(s => `<option value="${s.id}" ${s.id === val ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</optgroup>`).join("")}</select>`;
    body.innerHTML = `
      <div class="card mb-16"><div class="card-body">
        <div class="row wrap" style="gap:16px;align-items:flex-end">
          <div class="field"><label>Signal A</label>${sel("rcaA", st.a)}</div>
          <div class="center" style="padding-bottom:8px;color:var(--muted)">${icon("link")}</div>
          <div class="field"><label>Signal B</label>${sel("rcaB", st.b)}</div>
          <button class="btn primary" id="rcaRun" style="margin-bottom:0">${icon("bolt")} Run correlation</button>
          <div class="spacer" style="flex:1"></div>
          <button class="btn ghost sm" id="rcaHero">${icon("sparkle")} Try: market share ✕ drop-call</button>
        </div>
      </div></div>
      <div id="rcaResult"></div>`;
    body.querySelector("#rcaA").addEventListener("change", e => st.a = e.target.value);
    body.querySelector("#rcaB").addEventListener("change", e => st.b = e.target.value);
    body.querySelector("#rcaRun").addEventListener("click", () => { st.a = body.querySelector("#rcaA").value; st.b = body.querySelector("#rcaB").value; paintRCA(body.querySelector("#rcaResult"), opts); });
    body.querySelector("#rcaHero").addEventListener("click", () => { st.a = "mkt_share"; st.b = "eng_dcr"; body.querySelector("#rcaA").value = st.a; body.querySelector("#rcaB").value = st.b; paintRCA(body.querySelector("#rcaResult"), opts); });
    paintRCA(body.querySelector("#rcaResult"), opts);
  }

  function paintRCA(box, opts) {
    if (st.a === st.b) { box.innerHTML = `<div class="empty">${icon("info")}<h4>Pick two different signals</h4></div>`; return; }
    const c = correlate(st.a, st.b);
    const rColor = Math.abs(c.r) >= 0.5 ? (c.r < 0 ? "var(--crit)" : "var(--ok)") : "var(--muted)";
    // normalize both to 0..100 index for an overlay that shows the relationship
    const norm = (arr) => { const lo = Math.min(...arr), hi = Math.max(...arr), rng = (hi - lo) || 1; return arr.map(v => round(((v - lo) / rng) * 100, 1)); };
    box.innerHTML = `
      <div class="grid" style="grid-template-columns:1fr 320px;gap:16px;align-items:start">
        <div class="card"><div class="card-head"><h3>Correlation overlay</h3><span class="sub">indexed 0–100 · last 24h</span></div>
          <div class="card-body"><div class="chart-box"><canvas id="rcaChart"></canvas></div>
          <div class="row" style="gap:18px;margin-top:10px">
            <span class="row" style="gap:6px"><span class="sw" style="width:11px;height:11px;border-radius:3px;background:${window.CHARTS.COL.brand};display:inline-block"></span>${esc(c.a.name)} <b class="mono">${c.a.fmt(c.a.latest)}</b></span>
            <span class="row" style="gap:6px"><span class="sw" style="width:11px;height:11px;border-radius:3px;background:${window.CHARTS.COL.warn};display:inline-block"></span>${esc(c.b.name)} <b class="mono">${c.b.fmt(c.b.latest)}</b></span>
          </div></div>
        </div>
        <div class="card pad">
          <div class="label muted fw-6">Correlation coefficient</div>
          <div class="mono" style="font-size:40px;font-weight:600;color:${rColor};line-height:1.1">${c.r > 0 ? "+" : ""}${c.r}</div>
          <div class="row" style="gap:6px;margin-top:4px"><span class="pill ${Math.abs(c.r) >= 0.5 ? (c.r < 0 ? "crit" : "ok") : "neutral"}">${c.strength} ${c.sign}</span></div>
          <hr class="hr">
          <div class="row" style="gap:9px;margin-bottom:8px"><span class="agent-avatar" style="width:26px;height:26px;border-radius:8px">${icon("agent")}</span><b class="fs-13">RCA insight</b></div>
          <div class="fs-13" style="color:var(--text-2);line-height:1.6" id="rcaText"></div>
          <button class="btn primary sm" style="width:100%;margin-top:12px" id="rcaAsk">${icon("sparkle")} Ask the agent to investigate</button>
        </div>
      </div>`;
    // render overlay chart
    try { corrChart && corrChart.destroy(); } catch (e) {}
    corrChart = window.CHARTS.line(document.getElementById("rcaChart"), labels, [
      { label: c.a.name + " (idx)", data: norm(c.a.series), color: window.CHARTS.COL.brand, fill: false },
      { label: c.b.name + " (idx)", data: norm(c.b.series), color: window.CHARTS.COL.warn, fill: false },
    ]);
    // markdown-lite for the insight (bold)
    box.querySelector("#rcaText").innerHTML = explanation(c).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    box.querySelector("#rcaAsk").addEventListener("click", () => {
      const q = `Investigate the correlation between ${c.a.name} and ${c.b.name}`;
      if (opts.onAsk) opts.onAsk(q); else if (window.__openCopilot) window.__openCopilot(q);
    });
  }

  window.PX_EXPLORE = { CATS, signalsById, correlate, explanation, mountView, heroPair: { a: "mkt_share", b: "eng_dcr" }, destroy };
})();
