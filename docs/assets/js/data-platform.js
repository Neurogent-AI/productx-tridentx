/* ============================================================================
   PlatformX (full product) — platform-level data
   • Data marketplace catalog & connectors (PRD §10)
   • Use-case gallery templates (PRD §2, §7, §8)
   • Operator Business Plan synthetic data (Use-Case 2)
   Exposes window.PX_PLATFORM
   ========================================================================== */
(function () {
  "use strict";
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const R = rng(424242);
  const rand = (a, b) => a + R() * (b - a);
  const round = (v, d = 1) => { const p = Math.pow(10, d); return Math.round(v * p) / p; };

  /* ---------------- Data marketplace catalog (PRD §10) ----------------
     status: connected (synthetic, live in demo) | available (connect now) | request (needs operator access) */
  const CATALOG = [
    {
      cat: "Engineering", icon: "network", color: "#2563EB",
      blurb: "Radio-access performance, faults, config & coverage.",
      datasets: [
        { name: "Network Performance KPIs", items: "SINR · RSRP · Throughput · Latency", source: "Perf dashboards · T-PIM · IMNOS", status: "connected", phase: "MVP" },
        { name: "Accessibility KPIs", items: "RRC · RACH · E-RAB · Call Setup · 5G Reg", source: "Operator perf tools", status: "connected", phase: "MVP" },
        { name: "Retainability KPIs", items: "Handover · DCR · RLF · AFR", source: "Operator perf tools", status: "connected", phase: "MVP" },
        { name: "Network Alarms", items: "Cell-site fault management", source: "UNMS / vendor OSS", status: "connected", phase: "MVP" },
        { name: "Network Tickets", items: "Trouble tickets (user/site)", source: "Operator ticketing tool", status: "connected", phase: "MVP" },
        { name: "Network Parameters", items: "Config audit vs golden set", source: "Nokia / Ericsson OSS", status: "available", phase: "Phase 1" },
        { name: "Coverage Simulation", items: "Predicted coverage import", source: "ATOLL · PLANET · ASSET", status: "request", phase: "Phase 1" },
        { name: "Field Data", items: "Drive / walk test · benchmarking", source: "TEMS · Wireless Metrics", status: "request", phase: "Phase 1" },
      ],
    },
    {
      cat: "Marketing", icon: "store", color: "#7C3AED",
      blurb: "Commercial performance & customer base.",
      datasets: [
        { name: "Market Share & Churn", items: "Share · churn · ARPU", source: "Operator marketing tool", status: "available", phase: "Phase 1" },
        { name: "Customer Demographics", items: "Age · income · segment", source: "Operator marketing tool", status: "available", phase: "Phase 1" },
        { name: "Retail Store Performance", items: "Footfall · sales by store", source: "Operator marketing tool", status: "request", phase: "Phase 1" },
      ],
    },
    {
      cat: "Customer Feedback", icon: "users", color: "#0891B2",
      blurb: "Voice of customer & complaints.",
      datasets: [
        { name: "Voice of Customer", items: "Sentiment · CSAT", source: "Operator care tool", status: "available", phase: "Phase 1" },
        { name: "Complaints / Trouble Tickets", items: "Care + exec complaints", source: "Operator care tool", status: "request", phase: "Phase 1" },
        { name: "Friendly User Trial", items: "Pre-launch trial feedback", source: "Operator care tool", status: "request", phase: "Phase 2" },
      ],
    },
    {
      cat: "Third Party", icon: "globe", color: "#16A34A",
      blurb: "Crowdsourced & competitive benchmarks.",
      datasets: [
        { name: "Ookla Speedtest", items: "Crowdsourced speed/coverage", source: "Ookla (licensed API)", status: "available", phase: "Phase 1" },
        { name: "OpenSignal", items: "Experience benchmarks", source: "OpenSignal (licensed)", status: "available", phase: "Phase 1" },
        { name: "RootMetrics", items: "RootScore drive testing", source: "RootMetrics (licensed)", status: "request", phase: "Phase 1" },
      ],
    },
    {
      cat: "GIS", icon: "map", color: "#0EA5E9",
      blurb: "Geospatial layers across every module.",
      datasets: [
        { name: "2D Geospatial", items: "Sites · sectors · coverage", source: "GIS provider", status: "connected", phase: "MVP" },
        { name: "2.5D Surface", items: "Terrain / clutter", source: "GIS provider", status: "available", phase: "Phase 1" },
        { name: "3D City Model", items: "Buildings / urban canyon", source: "GIS provider", status: "request", phase: "Phase 2" },
      ],
    },
    {
      cat: "Planning", icon: "sliders", color: "#E0900B",
      blurb: "Site & antenna design parameters.",
      datasets: [
        { name: "Site Location DB", items: "Site inventory & geometry", source: "ATOLL · PLANET · ASSET", status: "request", phase: "Phase 2" },
        { name: "Antenna Parameters", items: "Height · azimuth · tilt · power", source: "RF planning tools", status: "request", phase: "Phase 2" },
      ],
    },
    {
      cat: "Misc", icon: "building", color: "#64748B",
      blurb: "External & demographic reference data.",
      datasets: [
        { name: "Census Demographics", items: "Population · income · housing", source: "census.gov", status: "available", phase: "Phase 1" },
      ],
    },
  ];

  /* connector tiles (the source systems) */
  const CONNECTORS = [
    { name: "Snowflake", kind: "Data warehouse", status: "connected", letter: "S", color: "#29B5E8" },
    { name: "Operator Ticketing", kind: "ITSM", status: "connected", letter: "T", color: "#2563EB" },
    { name: "UNMS", kind: "Fault management", status: "connected", letter: "U", color: "#16A34A" },
    { name: "T-PIM", kind: "T-Mobile perf tool", status: "request", letter: "P", color: "#E20074" },
    { name: "IMNOS", kind: "T-Mobile viz tool", status: "request", letter: "I", color: "#E20074" },
    { name: "Nokia OSS", kind: "Vendor OSS", status: "available", letter: "N", color: "#124191" },
    { name: "Ericsson OSS", kind: "Vendor OSS", status: "available", letter: "E", color: "#0082F0" },
    { name: "ATOLL", kind: "RF planning", status: "request", letter: "A", color: "#6D28D9" },
    { name: "Ookla", kind: "Crowdsource", status: "available", letter: "O", color: "#141927" },
    { name: "OpenSignal", kind: "Crowdsource", status: "available", letter: "O", color: "#FF5A5F" },
    { name: "RootMetrics", kind: "Crowdsource", status: "request", letter: "R", color: "#00A6A0" },
    { name: "census.gov", kind: "Demographics", status: "available", letter: "C", color: "#1F6FEB" },
  ];

  /* ---------------- Use-case gallery (PRD §2, §7, §8) ---------------- */
  const USE_CASES = [
    {
      id: "rf-agent", name: "RF Engineer Agent", icon: "tower", color: "#2563EB", status: "live",
      tagline: "Agentic AI RF Engineer — find & diagnose underperforming sites.",
      desc: "Monitors LTE/5G KPIs, alarms & tickets, ranks underperforming sites and correlates a KPI dip to its root cause.",
      data: ["Engineering KPIs", "Alarms", "Tickets", "GIS"], maturity: "Diagnostic", phase: "Phase 0 · MVP",
      hash: "#/workspace/rf",
    },
    {
      id: "biz-plan", name: "Operator Business Plan", icon: "dollar", color: "#7C3AED", status: "live",
      tagline: "Where to invest next — markets, churn & densification ROI.",
      desc: "Blends market share, churn, demographics & coverage to recommend where to densify and which markets are at risk.",
      data: ["Marketing", "Customer", "Demographics", "GIS"], maturity: "Prescriptive (preview)", phase: "Phase 1",
      hash: "#/workspace/biz",
    },
    {
      id: "churn", name: "Churn & Retention Radar", icon: "users", color: "#0891B2", status: "beta",
      tagline: "Spot churn-risk clusters before they leave.",
      desc: "Joins network experience with customer feedback to flag churn-risk cohorts by location.",
      data: ["Customer", "Marketing", "Engineering"], maturity: "Predictive", phase: "Phase 2",
      hash: "#/builder",
    },
    {
      id: "coverage", name: "Coverage Gap Finder", icon: "globe", color: "#16A34A", status: "soon",
      tagline: "Crowdsource vs. your network — find the gaps.",
      desc: "Overlays Ookla / OpenSignal crowdsource against predicted coverage to surface real-world holes.",
      data: ["Third Party", "Coverage Sim", "GIS"], maturity: "Diagnostic", phase: "Phase 1",
      hash: "#/builder",
    },
    {
      id: "capacity", name: "Capacity Planning", icon: "gauge", color: "#E0900B", status: "soon",
      tagline: "Forecast PRB exhaustion before it bites.",
      desc: "Trends utilisation & demand to forecast where capacity runs out next quarter.",
      data: ["Engineering", "Planning"], maturity: "Predictive", phase: "Phase 2",
      hash: "#/builder",
    },
    {
      id: "siteroi", name: "Site ROI & Densification", icon: "revenue", color: "#DC2626", status: "soon",
      tagline: "Rank candidate sites by payback.",
      desc: "Scores candidate new sites by demand, demographics and revenue uplift.",
      data: ["Marketing", "Planning", "Demographics", "GIS"], maturity: "Prescriptive", phase: "Phase 2",
      hash: "#/builder",
    },
  ];

  /* ---------------- Operator Business Plan synthetic data ---------------- */
  // reuse the RF metro areas as "markets"
  const AREAS = (window.PX_DATA && window.PX_DATA.AREAS) || [];
  const markets = AREAS.map((a, i) => {
    const pop = Math.round(rand(45, 620)) * 1000;
    const share = round(rand(22, 41), 1);
    const churn = round(rand(1.1, 3.4), 2);
    const arpu = round(rand(38, 58), 0);
    const compShare = round(rand(20, 38), 1);
    const coverage = round(rand(72, 98), 0);
    const demandIndex = round(rand(45, 99), 0);
    // densification candidate score: high demand + lower coverage + decent share headroom
    const gap = 100 - coverage;
    const score = round(Math.min(99, demandIndex * 0.5 + gap * 1.6 + (churn) * 6 + (40 - share) * 0.6), 0);
    const revUplift = Math.round((pop / 1000) * (gap / 100) * arpu * rand(0.18, 0.32));
    const capex = Math.round(rand(0.9, 2.6) * 1e6);
    const payback = round(capex / (revUplift * 12 || 1), 1);
    return {
      id: a.name, name: a.name, lat: a.lat, lng: a.lng, density: a.density,
      pop, households: Math.round(pop / 2.4), share, compShare, churn, arpu, coverage, demandIndex,
      candidateScore: score, revUplift, capex, paybackYears: payback,
      churnRisk: churn > 2.6 ? "high" : churn > 1.9 ? "med" : "low",
    };
  });
  const marketsById = Object.fromEntries(markets.map(m => [m.id, m]));

  const bizRollup = {
    subscribers: markets.reduce((a, m) => a + Math.round(m.pop * m.share / 100), 0),
    avgShare: round(markets.reduce((a, m) => a + m.share, 0) / markets.length, 1),
    avgChurn: round(markets.reduce((a, m) => a + m.churn, 0) / markets.length, 2),
    arpu: round(markets.reduce((a, m) => a + m.arpu, 0) / markets.length, 0),
    candidates: markets.filter(m => m.candidateScore >= 60).length,
    topCandidate: [...markets].sort((a, b) => b.candidateScore - a.candidateScore)[0],
    churnHotspot: [...markets].sort((a, b) => b.churn - a.churn)[0],
  };

  window.PX_PLATFORM = {
    CATALOG, CONNECTORS, USE_CASES,
    biz: { markets, marketsById, rollup: bizRollup },
    statusMeta: {
      connected: { pill: "ok", label: "Connected" },
      available: { pill: "info", label: "Available" },
      request: { pill: "warn", label: "Request access" },
    },
    round,
  };
})();
