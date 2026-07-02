/* ============================================================================
   PlatformX (full product) — omni agent
   Routes a query to the right grounded sub-agent:
     • RF questions  -> window.AGENT (reused from the RF use-case)
     • Business-plan questions -> Business Planning Agent (defined here)
   Both return the same { steps, segments, citations, followups } shape, so the
   shared ChatUI renders them identically.
   Exposes window.PLATFORM_AGENT and window.BIZ_AGENT
   ========================================================================== */
(function () {
  "use strict";
  const icon = (n, c) => window.UI.icon(n, c);
  const esc = (s) => window.UI.esc(s);
  const P = () => window.PX_PLATFORM;
  const money = (n) => n >= 1e6 ? "$" + (n / 1e6).toFixed(1) + "M" : "$" + Math.round(n / 1e3) + "k";

  const BIZ_SUGGEST = [
    { icon: "compass", text: "Where should we densify next quarter?" },
    { icon: "users", text: "Which markets are at churn risk?" },
    { icon: "dollar", text: "Rank candidate sites by ROI" },
    { icon: "store", text: "How is our market share trending?" },
  ];

  function cite(label, ic) { return { label, icon: ic || "db" }; }

  function marketRows(items, fmt, color) {
    return items.map((m, i) => `<div class="mini-row" onclick="location.hash='#/workspace/biz'">
      <span class="rank">${i + 1}</span>
      <span class="nm">${esc(m.name)}<span class="cell-sub"> · ${(m.pop / 1000).toFixed(0)}k pop · ${m.density}</span></span>
      <span class="val" style="color:${color || 'var(--text)'}">${fmt(m)}</span></div>`).join("");
  }

  function densify() {
    const b = P().biz; const ranked = [...b.markets].sort((a, c) => c.candidateScore - a.candidateScore).slice(0, 6);
    const top = ranked[0];
    return {
      steps: [
        { label: "Parsing request", detail: "intent: densification ranking" },
        { label: "Joining datasets", detail: "demand · coverage · churn · ARPU" },
        { label: "Scoring candidate markets", detail: b.markets.length + " markets" },
        { label: "Estimating revenue uplift & payback" },
        { label: "Ranking opportunities" },
      ],
      segments: [
        { type: "text", text: `I blended **coverage**, **demand**, **churn** and **ARPU** across ${b.markets.length} markets to score densification opportunities. The strongest case is **${top.name}** — coverage ${top.coverage}%, churn ${top.churn}%, est. **${money(top.revUplift * 12)}/yr** uplift at a **${top.paybackYears}-yr payback**.\n` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("compass")}Top densification candidates</div>${marketRows(ranked, m => m.candidateScore + " score", "var(--brand-700)")}</div>` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("revenue")}Business case · ${top.name}</div>
          <table class="mini"><tbody>
          <tr><td>Annual revenue uplift</td><td class="mono" style="color:#16A34A;font-weight:600">${money(top.revUplift * 12)}</td></tr>
          <tr><td>Est. capex</td><td class="mono">${money(top.capex)}</td></tr>
          <tr><td>Payback</td><td class="mono">${top.paybackYears} yrs</td></tr>
          <tr><td>Current coverage</td><td class="mono">${top.coverage}%</td></tr>
          <tr><td>Households</td><td class="mono">${(top.households / 1000).toFixed(0)}k</td></tr>
          </tbody></table></div>` },
        { type: "text", text: `\n**Recommendation:** prioritise **${top.name}** and **${ranked[1].name}** this quarter — both combine a coverage gap with above-median demand and churn. I can generate a one-page investment brief for the board.` },
      ],
      citations: [cite("Marketing · share & churn", "store"), cite("Census · demographics", "building"), cite("GIS · coverage", "map")],
      followups: ["Which markets are at churn risk?", "Rank candidate sites by ROI", "Generate the investment brief"],
    };
  }

  function churnRisk() {
    const b = P().biz; const ranked = [...b.markets].sort((a, c) => c.churn - a.churn).slice(0, 6);
    const hot = ranked[0];
    return {
      steps: [{ label: "Parsing request", detail: "intent: churn risk" }, { label: "Reading churn & ARPU", detail: b.markets.length + " markets" }, { label: "Correlating with experience KPIs" }, { label: "Ranking risk" }],
      segments: [
        { type: "text", text: `Ranking markets by **churn**. **${hot.name}** is the hotspot at **${hot.churn}%** (network avg ${b.rollup.avgChurn}%), with ARPU $${hot.arpu} — so the revenue at risk is material.\n` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("users")}Churn risk by market</div>${marketRows(ranked, m => m.churn + "%", "var(--crit)")}</div>` },
        { type: "text", text: `\nChurn in **${hot.name}** correlates with weaker network experience there — a good candidate to pair a **retention offer** with a **coverage fix**. Want me to cross-reference the RF Engineer Agent for the underperforming sites in ${hot.name}?` },
      ],
      citations: [cite("Marketing · churn", "store"), cite("Customer feedback · VoC", "users"), cite("Engineering · experience", "network")],
      followups: ["Where should we densify next quarter?", "How is our market share trending?"],
    };
  }

  function siteRoi() {
    const b = P().biz; const ranked = [...b.markets].sort((a, c) => a.paybackYears - c.paybackYears).slice(0, 6);
    return {
      steps: [{ label: "Parsing request", detail: "intent: ROI ranking" }, { label: "Modelling capex & uplift" }, { label: "Computing payback", detail: b.markets.length + " candidates" }, { label: "Ranking by payback" }],
      segments: [
        { type: "text", text: `Ranking candidate investments by **payback period** (fastest first). Top of the list is **${ranked[0].name}** at **${ranked[0].paybackYears} yrs** with **${money(ranked[0].revUplift * 12)}/yr** uplift.\n` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("revenue")}Candidate sites by payback</div>
          <table class="mini"><thead><tr><th>Market</th><th>Payback</th><th>Uplift/yr</th><th>Capex</th></tr></thead><tbody>
          ${ranked.map(m => `<tr onclick="location.hash='#/workspace/biz'" style="cursor:pointer"><td class="fw-6">${esc(m.name)}</td><td class="mono">${m.paybackYears}y</td><td class="mono" style="color:#16A34A">${money(m.revUplift * 12)}</td><td class="mono">${money(m.capex)}</td></tr>`).join("")}
          </tbody></table></div>` },
        { type: "text", text: `\nThese assume current ARPU and a coverage-driven demand capture — I can sensitivity-test against ±10% ARPU if useful.` },
      ],
      citations: [cite("Marketing · ARPU", "store"), cite("Planning · candidate sites", "sliders"), cite("Finance model v0", "revenue")],
      followups: ["Where should we densify next quarter?", "Which markets are at churn risk?"],
    };
  }

  function shareOverview() {
    const b = P().biz;
    return {
      steps: [{ label: "Parsing request", detail: "intent: market share" }, { label: "Aggregating share & subs" }, { label: "Summarizing" }],
      segments: [
        { type: "text", text: `Across the footprint you hold an average **${b.rollup.avgShare}% share** with **${(b.rollup.subscribers / 1e6).toFixed(2)}M** estimated subscribers and **$${b.rollup.arpu} ARPU**. Strongest markets:\n` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("store")}Market share (top markets)</div>${marketRows([...b.markets].sort((a, c) => c.share - a.share).slice(0, 5), m => m.share + "%", "var(--brand-700)")}</div>` },
        { type: "text", text: `\nThe biggest commercial risk is churn in **${b.rollup.churnHotspot.name}** (${b.rollup.churnHotspot.churn}%). The biggest growth opportunity is densifying **${b.rollup.topCandidate.name}**.` },
      ],
      citations: [cite("Marketing · share", "store"), cite("Census · population", "building")],
      followups: ["Which markets are at churn risk?", "Where should we densify next quarter?"],
    };
  }

  function bizHelp() {
    return {
      steps: [{ label: "Loading capabilities", detail: "business planning" }],
      segments: [
        { type: "text", text: `I'm the **Business Planning Agent**. I blend marketing, customer, demographic and GIS data to help operator leadership decide **where to invest**. I can:` },
        { type: "embed", html: `<div class="embed"><div class="embed-head">${icon("dollar")}What I can do</div>${["Recommend where to densify next quarter (ROI-ranked)", "Find churn-risk markets and the revenue at stake", "Rank candidate sites by payback period", "Summarize market share & ARPU across the footprint"].map(t => `<div class="mini-row"><span class="hdot ok"></span><span class="nm" style="font-weight:500">${t}</span></div>`).join("")}</div>` },
      ],
      citations: [cite("Grounded on synthetic market data", "flask")],
      followups: BIZ_SUGGEST.slice(0, 3).map(s => s.text),
    };
  }

  function bizRespond(q) {
    const ql = (q || "").toLowerCase();
    if (/(densif|where.*invest|where.*build|expand|new site|grow)/.test(ql)) return densify();
    if (/(churn|retention|leaving|at risk)/.test(ql)) return churnRisk();
    if (/(roi|payback|return|capex|business case)/.test(ql)) return siteRoi();
    if (/(market share|share|subscriber|arpu|commercial|revenue)/.test(ql)) return shareOverview();
    if (/(hi|hello|help|what can you|who are you)/.test(ql)) return bizHelp();
    return shareOverview();
  }

  const BIZ_RE = /(densif|invest|churn|retention|market|share|roi|payback|revenue|subscriber|arpu|business|capex|demograph|grow|expand)/i;
  // RF/network intents that must NOT fall through to the business agent even
  // though they contain a BIZ_RE substring (e.g. "INVESTigate the drop-call rate").
  const RF_OVERRIDE_RE = /(drop[ -]?call|dcr|guided rca|rca|alarm|handover|throughput|underperform|site|sector|sinr|rsrp|coverage)/i;

  window.BIZ_AGENT = { respond: bizRespond, SUGGESTIONS: BIZ_SUGGEST };
  window.PLATFORM_AGENT = {
    respond: function (q) { return (BIZ_RE.test(q || "") && !RF_OVERRIDE_RE.test(q || "")) ? bizRespond(q) : window.AGENT.respond(q); },
    SUGGESTIONS: [
      { icon: "tower", text: "Which sites are underperforming today?" },
      { icon: "compass", text: "Where should we densify next quarter?" },
      { icon: "spark", text: "Why is throughput low on the worst 5G site?" },
      { icon: "users", text: "Which markets are at churn risk?" },
    ],
  };
})();
