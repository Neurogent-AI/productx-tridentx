/* ============================================================================
   PlatformX MVP — Synthetic telecom data generator
   Deterministic (seeded) so the live demo is identical every reload.
   Models PRD §6.1 / §10: sites, sectors, KPIs (time-series w/ injected
   degradations), alarms, tickets, derived health, and a hero correlation story.
   Exposes window.PX_DATA.
   ========================================================================== */
(function () {
  "use strict";

  /* -------- seeded RNG (mulberry32) -------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const R = rng(73519);
  const rand = (a, b) => a + R() * (b - a);
  const randint = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(R() * arr.length)];
  const round = (v, d = 1) => { const p = Math.pow(10, d); return Math.round(v * p) / p; };

  /* -------- geography: Greater Seattle (matches RootMetrics example) -------- */
  const CENTER = [47.6062, -122.3321];
  const AREAS = [
    { name: "Downtown Seattle", lat: 47.6062, lng: -122.3321, r: 0.03, density: "urban" },
    { name: "Bellevue", lat: 47.6101, lng: -122.2015, r: 0.035, density: "urban" },
    { name: "Capitol Hill", lat: 47.6253, lng: -122.3222, r: 0.02, density: "urban" },
    { name: "Ballard", lat: 47.6685, lng: -122.3830, r: 0.025, density: "suburban" },
    { name: "Redmond", lat: 47.6740, lng: -122.1215, r: 0.04, density: "suburban" },
    { name: "Renton", lat: 47.4829, lng: -122.2171, r: 0.045, density: "suburban" },
    { name: "Tacoma", lat: 47.2529, lng: -122.4443, r: 0.05, density: "suburban" },
    { name: "Everett", lat: 47.9790, lng: -122.2021, r: 0.05, density: "suburban" },
    { name: "Kent", lat: 47.3809, lng: -122.2348, r: 0.04, density: "suburban" },
    { name: "SeaTac Airport", lat: 47.4502, lng: -122.3088, r: 0.02, density: "urban" },
    { name: "Sammamish", lat: 47.6163, lng: -122.0356, r: 0.05, density: "rural" },
    { name: "Issaquah", lat: 47.5301, lng: -122.0326, r: 0.04, density: "rural" },
  ];

  const BANDS = {
    LTE: ["B2 (1900)", "B4 (1700)", "B12 (700)", "B66 (1700)", "B71 (600)"],
    "5G": ["n71 (600)", "n41 (2.5G)", "n261 (mmW 28G)", "n77 (3.7G)"],
  };

  /* KPI catalogue: id, label, unit, group, good direction, healthy baseline range, warn/crit thresholds */
  const KPIS = [
    { id: "sinr", label: "SINR", unit: "dB", group: "Signal", dir: "up", base: [11, 19], warn: 7, crit: 3 },
    { id: "rsrp", label: "RSRP", unit: "dBm", group: "Signal", dir: "up", base: [-95, -78], warn: -105, crit: -113 },
    { id: "thrpt", label: "DL Throughput", unit: "Mbps", group: "Throughput", dir: "up", base: [85, 240], warn: 35, crit: 12 },
    { id: "latency", label: "Latency", unit: "ms", group: "Throughput", dir: "down", base: [14, 28], warn: 45, crit: 75 },
    // Accessibility
    { id: "rrc", label: "RRC Setup Success", unit: "%", group: "Accessibility", dir: "up", base: [99.1, 99.8], warn: 98, crit: 96 },
    { id: "rach", label: "RACH Success", unit: "%", group: "Accessibility", dir: "up", base: [98.6, 99.7], warn: 97, crit: 95 },
    { id: "erab", label: "E-RAB Setup Success", unit: "%", group: "Accessibility", dir: "up", base: [99.0, 99.9], warn: 98, crit: 96.5 },
    { id: "css", label: "Call Setup Success", unit: "%", group: "Accessibility", dir: "up", base: [99.0, 99.8], warn: 98, crit: 96 },
    { id: "reg5g", label: "5G Registration Success", unit: "%", group: "Accessibility", dir: "up", base: [98.8, 99.7], warn: 97.5, crit: 95.5 },
    // Retainability
    { id: "hosr", label: "Handover Success", unit: "%", group: "Retainability", dir: "up", base: [98.4, 99.6], warn: 97, crit: 94.5 },
    { id: "dcr", label: "Drop Call Rate (DCR)", unit: "%", group: "Retainability", dir: "down", base: [0.18, 0.62], warn: 1.4, crit: 2.6 },
    { id: "rlf", label: "Radio Link Failure", unit: "%", group: "Retainability", dir: "down", base: [0.25, 0.85], warn: 1.8, crit: 3.2 },
    { id: "afr", label: "Access Failure Rate (AFR)", unit: "%", group: "Accessibility", dir: "down", base: [0.3, 0.9], warn: 2.0, crit: 3.8 },
  ];
  const KPI_BY_ID = Object.fromEntries(KPIS.map(k => [k.id, k]));

  const ALARM_TYPES = [
    { type: "VSWR Over Threshold", sev: "crit", hint: "antenna/feeder line — high reflected power" },
    { type: "Cell Sleeping / Out of Service", sev: "crit", hint: "carrier not transmitting" },
    { type: "Baseband Board Fault", sev: "crit", hint: "RAN hardware fault" },
    { type: "External Power Failure", sev: "crit", hint: "site on battery / mains down" },
    { type: "RET Antenna Tilt Mismatch", sev: "warn", hint: "remote electrical tilt vs golden config" },
    { type: "High CPU / PRB Utilization", sev: "warn", hint: "congestion / overload" },
    { type: "Transport / S1 Link Degraded", sev: "warn", hint: "backhaul packet loss" },
    { type: "GPS / Sync Loss", sev: "warn", hint: "timing reference lost" },
    { type: "Temperature High", sev: "warn", hint: "cabinet HVAC issue" },
    { type: "License Capacity Warning", sev: "info", hint: "approaching licensed limit" },
    { type: "Software Mismatch", sev: "info", hint: "patch level drift" },
  ];

  const TICKET_TYPES = [
    "Customer reports slow data in area",
    "Dropped calls reported (VIP)",
    "No service / coverage hole complaint",
    "Field tech dispatch — antenna inspection",
    "Throughput SLA breach — enterprise account",
    "Voice quality complaint cluster",
    "Handover failures along corridor",
  ];

  const now = Date.now();
  const HOURS = 72;
  const STEP = 60 * 60 * 1000; // 1h
  const timeline = Array.from({ length: HOURS }, (_, i) => now - (HOURS - 1 - i) * STEP);

  /* ---------- generate sites ---------- */
  const NUM_SITES = 124;
  const sites = [];
  let siteIdx = 0;

  // Pre-pick a few "hero" degraded sites with a clean story
  const HERO = {
    throughput: null,  // throughput collapse correlated to VSWR + ticket
    retain: null,      // retainability / drops correlated to transport link
    outage: null,      // hard outage (cell sleeping)
  };

  for (let a = 0; a < AREAS.length; a++) {
    const area = AREAS[a];
    const count = Math.round(NUM_SITES / AREAS.length) + randint(-2, 2);
    for (let s = 0; s < count && sites.length < NUM_SITES; s++) {
      siteIdx++;
      const tech = R() < 0.62 ? "5G" : "LTE";
      const ang = R() * Math.PI * 2, rr = Math.sqrt(R()) * area.r;
      const lat = area.lat + Math.cos(ang) * rr;
      const lng = area.lng + Math.sin(ang) * rr * 1.4;
      const id = "SEA-" + String(siteIdx).padStart(4, "0");
      const nSectors = randint(1, 3);
      const vendor = pick(["Nokia", "Ericsson", "Samsung"]);
      sites.push({
        id, name: area.name + " " + (s + 1), area: area.name, density: area.density,
        tech, vendor, lat: round(lat, 5), lng: round(lng, 5),
        sectors: Array.from({ length: nSectors }, (_, i) => ({
          id: id + "-S" + (i + 1),
          azimuth: [0, 120, 240][i] ?? randint(0, 359),
          band: pick(BANDS[tech]),
          pci: randint(1, 503),
        })),
        kpis: {}, alarms: [], tickets: [], health: 100, status: "ok", _profile: "normal",
      });
    }
  }
  const SITES_BY_ID = Object.fromEntries(sites.map(s => [s.id, s]));

  // choose heroes (stable: by index) — pick urban 5G sites for a good story
  const urban5g = sites.filter(s => s.tech === "5G" && s.density === "urban");
  HERO.throughput = urban5g[3] || sites[3];
  HERO.retain = urban5g[7] || sites[7];
  HERO.outage = sites.find(s => s.density === "suburban") || sites[10];
  HERO.throughput._profile = "throughput_collapse";
  HERO.retain._profile = "retainability_drop";
  HERO.outage._profile = "outage";

  // scatter more degradations so the "underperforming" list is realistic
  const degradedExtra = [];
  for (let i = 0; i < 24; i++) {
    let cand;
    do { cand = pick(sites); } while (cand._profile !== "normal");
    cand._profile = pick(["congestion", "congestion", "coverage", "coverage", "minor", "minor", "minor"]);
    degradedExtra.push(cand);
  }

  /* ---------- KPI time-series per site ---------- */
  function seriesFor(site) {
    const out = {};
    // degradation window: roughly last ~10–26h depending on profile
    const degStart = HOURS - randint(10, 26);
    KPIS.forEach(k => {
      let lo = k.base[0], hi = k.base[1];
      // density tweaks
      if (k.id === "thrpt") { if (site.density === "rural") { lo *= 0.5; hi *= 0.55; } if (site.tech === "LTE") { lo *= 0.45; hi *= 0.42; } }
      if (k.id === "sinr" && site.density === "rural") { lo -= 3; hi -= 2; }
      let baseVal = rand(lo, hi);
      const noise = (k.unit === "%" ? 0.15 : Math.abs(hi - lo) * 0.06);
      const arr = timeline.map((t, idx) => {
        let v = baseVal + (R() - 0.5) * 2 * noise + Math.sin(idx / 4 + site.id.length) * noise * 0.5;
        // diurnal load affects throughput/latency/util-driven KPIs
        const hr = new Date(t).getHours();
        const busy = Math.max(0, Math.sin((hr - 6) / 24 * Math.PI * 2));
        if (k.id === "thrpt") v *= 1 - busy * 0.18;
        if (k.id === "latency") v *= 1 + busy * 0.22;

        // inject profile degradation in window
        const inWin = idx >= degStart;
        const ramp = inWin ? Math.min(1, (idx - degStart) / 4) : 0;
        if (inWin) {
          switch (site._profile) {
            case "throughput_collapse":
              if (k.id === "thrpt") v *= (1 - 0.86 * ramp);
              if (k.id === "sinr") v -= 11 * ramp;
              if (k.id === "latency") v *= (1 + 2.0 * ramp);
              if (k.id === "dcr") v += 2.9 * ramp;
              if (k.id === "rrc" || k.id === "css") v -= 3.6 * ramp;
              if (k.id === "erab") v -= 3.0 * ramp;
              if (k.id === "afr") v += 3.0 * ramp;
              break;
            case "retainability_drop":
              if (k.id === "hosr") v -= 4.5 * ramp;
              if (k.id === "dcr") v += 2.6 * ramp;
              if (k.id === "rlf") v += 2.8 * ramp;
              if (k.id === "afr") v += 2.2 * ramp;
              if (k.id === "latency") v *= (1 + 0.5 * ramp);
              break;
            case "outage":
              if (k.id === "thrpt") v *= (1 - 0.97 * ramp);
              if (k.id === "rrc" || k.id === "rach" || k.id === "erab" || k.id === "css" || k.id === "reg5g") v -= 8 * ramp;
              if (k.id === "afr") v += 6 * ramp;
              if (k.id === "dcr") v += 5 * ramp;
              break;
            case "congestion":
              if (k.id === "thrpt") v *= (1 - 0.5 * ramp);
              if (k.id === "latency") v *= (1 + 1.3 * ramp);
              if (k.id === "rrc") v -= 2.6 * ramp;
              if (k.id === "dcr") v += 1.0 * ramp;
              break;
            case "coverage":
              if (k.id === "rsrp") v -= 19 * ramp;
              if (k.id === "sinr") v -= 7.5 * ramp;
              if (k.id === "rach") v -= 2.8 * ramp;
              if (k.id === "rrc") v -= 1.8 * ramp;
              break;
            case "minor":
              if (k.id === "dcr") v += 1.6 * ramp;
              if (k.id === "hosr") v -= 2.6 * ramp;
              if (k.id === "rlf") v += 1.3 * ramp;
              break;
          }
        }
        // clamp %
        if (k.unit === "%") v = Math.min(k.dir === "up" ? 100 : 100, Math.max(0, v));
        if (k.id === "thrpt") v = Math.max(0.4, v);
        if (k.id === "latency") v = Math.max(6, v);
        return round(v, k.unit === "%" ? 2 : (k.id === "rsrp" ? 0 : 1));
      });
      out[k.id] = arr;
    });
    return out;
  }

  /* ---------- health scoring ---------- */
  function kpiStatus(k, val) {
    if (k.dir === "up") {
      if (val <= k.crit) return "crit"; if (val <= k.warn) return "warn"; return "ok";
    } else {
      if (val >= k.crit) return "crit"; if (val >= k.warn) return "warn"; return "ok";
    }
  }
  function latest(arr) { return arr[arr.length - 1]; }

  sites.forEach(site => {
    site.kpis = seriesFor(site);
    // health: penalise crit/warn KPIs
    let score = 100, crit = 0, warn = 0;
    KPIS.forEach(k => {
      const st = kpiStatus(k, latest(site.kpis[k.id]));
      if (st === "crit") { score -= 17; crit++; }
      else if (st === "warn") { score -= 8; warn++; }
    });
    site._critKpis = crit; site._warnKpis = warn;
    site.health = Math.max(2, Math.round(score));
    site.status = site.health >= 85 ? "ok" : site.health >= 56 ? "warn" : "crit";
  });

  /* ---------- alarms ---------- */
  let alarmId = 1000;
  const alarms = [];
  function addAlarm(site, def, hoursAgo) {
    const al = {
      id: "ALM-" + (alarmId++),
      site: site.id, area: site.area,
      type: def.type, sev: def.sev, hint: def.hint,
      ts: now - hoursAgo * STEP,
      sector: pick(site.sectors).id,
      ack: R() < 0.25,
    };
    alarms.push(al); site.alarms.push(al); return al;
  }
  // hero alarms (the correlated root causes)
  HERO.throughput._heroAlarm = addAlarm(HERO.throughput, ALARM_TYPES[0], randint(11, 20)); // VSWR
  addAlarm(HERO.throughput, ALARM_TYPES[5], randint(3, 9)); // high util secondary
  HERO.retain._heroAlarm = addAlarm(HERO.retain, ALARM_TYPES[6], randint(12, 22)); // transport degraded
  addAlarm(HERO.retain, ALARM_TYPES[7], randint(2, 8)); // GPS sync
  HERO.outage._heroAlarm = addAlarm(HERO.outage, ALARM_TYPES[1], randint(8, 16)); // cell sleeping
  addAlarm(HERO.outage, ALARM_TYPES[3], randint(8, 16)); // external power
  // scatter alarms on other degraded + a few random
  degradedExtra.forEach(s => { addAlarm(s, pick(ALARM_TYPES), randint(1, 26)); if (R() < 0.5) addAlarm(s, pick(ALARM_TYPES.slice(4)), randint(1, 30)); });
  sites.forEach(s => { if (s._profile === "normal" && R() < 0.16) addAlarm(s, pick(ALARM_TYPES.slice(4)), randint(1, 48)); });
  alarms.sort((a, b) => b.ts - a.ts);

  /* ---------- tickets ---------- */
  let ticketId = 5000;
  const tickets = [];
  function addTicket(site, title, hoursAgo, priority) {
    const tk = {
      id: "TT-" + (ticketId++), site: site.id, area: site.area,
      title, priority: priority || pick(["P1", "P2", "P2", "P3"]),
      status: pick(["Open", "Open", "In Progress", "Investigating"]),
      ts: now - hoursAgo * STEP, sector: pick(site.sectors).id,
    };
    tickets.push(tk); site.tickets.push(tk); return tk;
  }
  HERO.throughput._heroTicket = addTicket(HERO.throughput, "Throughput SLA breach — enterprise account", randint(8, 16), "P1");
  HERO.retain._heroTicket = addTicket(HERO.retain, "Dropped calls reported (VIP corridor)", randint(6, 14), "P1");
  addTicket(HERO.outage, "No service / coverage hole complaint", randint(5, 12), "P1");
  degradedExtra.forEach(s => { if (R() < 0.7) addTicket(s, pick(TICKET_TYPES), randint(1, 30)); });
  sites.forEach(s => { if (s._profile === "normal" && R() < 0.10) addTicket(s, pick(TICKET_TYPES), randint(1, 60)); });
  tickets.sort((a, b) => b.ts - a.ts);

  /* ---------- network-wide rollups ---------- */
  function networkSeries(kpiId, agg) {
    return timeline.map((_, idx) => {
      let sum = 0, n = 0;
      sites.forEach(s => { sum += s.kpis[kpiId][idx]; n++; });
      return round(agg === "sum" ? sum : sum / n, 2);
    });
  }
  const network = {
    sites: sites.length,
    sectors: sites.reduce((a, s) => a + s.sectors.length, 0),
    series: {
      thrpt: networkSeries("thrpt"), latency: networkSeries("latency"),
      rrc: networkSeries("rrc"), dcr: networkSeries("dcr"),
      sinr: networkSeries("sinr"), hosr: networkSeries("hosr"),
      afr: networkSeries("afr"), css: networkSeries("css"), reg5g: networkSeries("reg5g"),
    },
    counts: {
      ok: sites.filter(s => s.status === "ok").length,
      warn: sites.filter(s => s.status === "warn").length,
      crit: sites.filter(s => s.status === "crit").length,
    },
    alarms: { crit: alarms.filter(a => a.sev === "crit").length, warn: alarms.filter(a => a.sev === "warn").length, info: alarms.filter(a => a.sev === "info").length, total: alarms.length },
    tickets: { open: tickets.length, p1: tickets.filter(t => t.priority === "P1").length },
  };

  // alarm volume per hour (last 24)
  network.alarmVolume = timeline.slice(-24).map(t => {
    const lo = t - STEP / 2, hi = t + STEP / 2;
    return alarms.filter(a => a.ts >= lo && a.ts < hi).length + randint(0, 2);
  });

  /* ---------- headline KPI cards (network avg + delta vs 24h ago) ---------- */
  function headline(kpiId, decimals) {
    const k = KPI_BY_ID[kpiId];
    const ser = network.series[kpiId];
    const cur = ser[ser.length - 1];
    const prev = ser[ser.length - 25] ?? ser[0];
    const delta = round(((cur - prev) / Math.abs(prev || 1)) * 100, 1);
    return { id: kpiId, label: k.label, unit: k.unit, value: round(cur, decimals ?? 1), delta, dir: k.dir, series: ser.slice(-24) };
  }
  network.headline = [
    headline("thrpt", 0), headline("rrc", 2), headline("dcr", 2), headline("hosr", 2),
    headline("latency", 0), headline("sinr", 1), headline("afr", 2), headline("reg5g", 2),
  ];

  /* ---------- helpers for agent / views ---------- */
  function underperforming(limit) {
    return sites.filter(s => s.status !== "ok")
      .sort((a, b) => a.health - b.health)
      .slice(0, limit || 999);
  }
  function topWorstByKpi(kpiId, limit) {
    const k = KPI_BY_ID[kpiId];
    return [...sites].sort((a, b) => {
      const av = latest(a.kpis[kpiId]), bv = latest(b.kpis[kpiId]);
      return k.dir === "up" ? av - bv : bv - av;
    }).slice(0, limit || 5).map(s => ({ site: s, value: latest(s.kpis[kpiId]) }));
  }
  function fmt(kpiId, val) {
    const k = KPI_BY_ID[kpiId];
    return round(val, k.unit === "%" ? 2 : (k.id === "rsrp" ? 0 : 1)) + (k.unit === "%" ? "%" : " " + k.unit);
  }

  window.PX_DATA = {
    meta: { generatedAt: now, hours: HOURS, metro: "Greater Seattle", operator: "Demo MNO (synthetic)" },
    CENTER, timeline, KPIS, KPI_BY_ID, ALARM_TYPES, AREAS,
    sites, SITES_BY_ID, alarms, tickets, network, HERO,
    util: { kpiStatus, latest, underperforming, topWorstByKpi, fmt, round },
  };
})();
