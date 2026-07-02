/* ============================================================
   SYNTHETIC DATA
   ============================================================ */
const DATA = {
  kpis: [
    { id:'dcr',  label:'Drop Call Rate',       val:'2.4',  unit:'%',  delta:'+0.3', dir:'bad',  color:'#EF4444' },
    { id:'thpt', label:'Avg Throughput',        val:'187',  unit:'Mbps', delta:'+12', dir:'good', color:'#22C55E' },
    { id:'sinr', label:'Avg SINR',             val:'14.2', unit:'dB',  delta:'-0.8', dir:'bad',  color:'#F97316' },
    { id:'ms',   label:'Market Share',          val:'38.4', unit:'%',  delta:'-1.2', dir:'bad',  color:'#EF4444' },
    { id:'churn',label:'Churn Rate',            val:'4.1',  unit:'%',  delta:'+0.4', dir:'bad',  color:'#EF4444' },
    { id:'arpu', label:'ARPU',                  val:'$84',  unit:'',   delta:'+$2',  dir:'good', color:'#22C55E' },
    { id:'csat', label:'CSAT Score',            val:'3.6',  unit:'/5', delta:'-0.2', dir:'bad',  color:'#F97316' },
    { id:'tkt',  label:'Open Tickets',          val:'142',  unit:'',   delta:'+18',  dir:'bad',  color:'#EF4444' },
  ],
  alarms: [
    { sev:'crit', type:'EN-DC Desync',        site:'SEA-BELL-047', sector:'Sector 2', ts:'2m ago',  id:'A001' },
    { sev:'crit', type:'High DCR (>3.5%)',    site:'SEA-RENT-012', sector:'Sector 1', ts:'5m ago',  id:'A002' },
    { sev:'warn', type:'Capacity Threshold',  site:'SEA-BOTH-031', sector:'Sector 3', ts:'11m ago', id:'A003' },
    { sev:'warn', type:'IMS Core Timeout',    site:'SEA-Kirk-008', sector:'Sector 1', ts:'18m ago', id:'A004' },
    { sev:'info', type:'Parameter Drift',     site:'SEA-ISS-021',  sector:'Sector 2', ts:'34m ago', id:'A005' },
  ],
  zones: [
    { id:'z1', name:'Bellevue Downtown',     lat:47.6101, lng:-122.2015, cat:'grow',
      ms:28, net:87, churn:4.2, arpu:85, sites:12,
      insight:'Low market share despite excellent network performance (87/100). Prime opportunity for targeted marketing campaign. Competitor has 41% share here — deploy premium campaign focused on 5G speeds.',
      action:'Launch Growth Campaign' },
    { id:'z2', name:'Sammamish (98074)',     lat:47.6165, lng:-122.0355, cat:'invest',
      ms:31, net:52, churn:7.8, arpu:72, sites:8,
      insight:'Dual failure: low market share AND poor network performance. Root cause: 3 sites with EN-DC desync issues. Recommend urgent network investment — new cell site build at Sahalee Dr + parameter optimization.',
      action:'Create Investment Plan' },
    { id:'z3', name:'Redmond Tech Corridor', lat:47.6740, lng:-122.1215, cat:'defend',
      ms:68, net:91, churn:2.1, arpu:98, sites:19,
      insight:'Strong market position + excellent network quality. Focus on enterprise retention programs. Monitor for capacity strain as Microsoft campus expansion continues in Q3.',
      action:'Set Retention Alert' },
    { id:'z4', name:'Kirkland Waterfront',   lat:47.6769, lng:-122.2060, cat:'fix',
      ms:61, net:44, churn:6.3, arpu:79, sites:11,
      insight:'Good market position at serious risk. Network score 44/100 — 2 sites have DCR >3.5%, IMS Core timeout detected. Churn accelerating. Immediate network fix required before market share erodes.',
      action:'Dispatch Fix Workflow' },
    { id:'z5', name:'Issaquah',             lat:47.5301, lng:-122.0326, cat:'grow',
      ms:33, net:82, churn:3.9, arpu:81, sites:9,
      insight:'Underperforming market position in growing residential area. Network quality strong. Demographic profile matches premium segment. Recommend retail store + digital expansion in this zip.',
      action:'Launch Growth Campaign' },
    { id:'z6', name:'Mercer Island',        lat:47.5707, lng:-122.2221, cat:'defend',
      ms:72, net:88, churn:1.8, arpu:112, sites:7,
      insight:'Premium segment — highest ARPU in cluster ($112). Strong defensive position. VIP loyalty programs recommended. Any network degradation here would disproportionately impact revenue.',
      action:'Set Premium Alert' },
    { id:'z7', name:'Renton',              lat:47.4829, lng:-122.2171, cat:'invest',
      ms:29, net:48, churn:8.2, arpu:65, sites:14,
      insight:'Critical zone: 4 sites offline, 2 with capacity overflow. Highest churn rate in cluster (8.2%). Network and market share both critical. Capital investment required — new site build + marketing reset.',
      action:'Create Investment Plan' },
    { id:'z8', name:'Bothell',             lat:47.7601, lng:-122.2054, cat:'fix',
      ms:58, net:41, churn:5.7, arpu:77, sites:10,
      insight:'Market position at risk — DCR spike traced to IMS Core misconfiguration following software update. Network score dropped 22pts in 2 weeks. Config rollback recommended immediately.',
      action:'Rollback Config' },
  ],
  rfWorkflow: [
    { id:1, title:'KPI Anomaly Detected', status:'done',
      body:'Engineering Agent detected Drop Call Rate spike on site <span class="mono">SEA-BELL-047</span>: DCR = <span class="mono">3.8%</span> (threshold: 2.0%). Spike persisted for 3 consecutive 5-min windows. Triggering RCA pipeline.' },
    { id:2, title:'Root Cause Analysis', status:'done',
      body:'Correlating RAN telemetry, IMS logs, and alarm data...<br><br>Finding: <span class="mono">EN-DC Desync</span> on Sector 2. LTE Anchor Drop Rate elevated. 5G RSRP degraded due to beam tracking failure on mmWave cell. X2 Interface link degraded between SEA-BELL-047 and adjacent gNodeB.<br><br>Confidence: <strong>94%</strong>' },
    { id:3, title:'Recommended Action Computed', status:'active',
      body:'Orchestrator Agent has computed remediation:<br><br>1. Adjust beam tilt on SEA-BELL-047 Sector 2 (down-tilt -2°)<br>2. Reduce X2 handover trigger threshold from -110dBm to -105dBm<br>3. Monitor DCR for 30 min post-change<br><br><em>Awaiting Operations Manager approval (Open-Loop mode)</em>' },
    { id:4, title:'Ticket Created & Routed', status:'pending',
      body:'TT-2847 will be created and routed to Ops Team with full RCA documentation. Estimated resolution: 45 min vs. 4-6 hours manual process.' },
    { id:5, title:'KPI Validation', status:'pending',
      body:'Post-fix: Engineering Agent will monitor DCR for 30 min. If DCR returns to baseline (<2.0%), ticket auto-closed. Otherwise, escalate to Level 2.' },
  ],
  agents: [
    { id:'eng', name:'Engineering Agent',      role:'RF & Network Performance',      icon:'📡', color:'#06B6D4',
      status:'busy',
      tools:['check_system_status()','get_deployment_log()','query_issue_tracker()','fetch_telemetry_metrics()'],
      activity:['> Monitoring 1,247 cell sites', '> DCR anomaly detected: SEA-BELL-047', '> Running EN-DC correlation analysis…', '> Confidence score: 94%'] },
    { id:'mkt', name:'Marketing Agent',        role:'Market Share & Revenue',         icon:'📊', color:'#8B5CF6',
      status:'active',
      tools:['get_campaign_performance()','query_ad_spend()','fetch_funnel_metrics()','pause_regional_campaign()'],
      activity:['> Scanning 8 market zones', '> Grow opportunity: Bellevue (+$2.1M potential)', '> Invest alert: Renton churn rate 8.2%', '> Campaign model ready'] },
    { id:'cx',  name:'Customer Service Agent', role:'VoC & Ticket Analysis',          icon:'💬', color:'#F97316',
      status:'active',
      tools:['query_ticket_history()','get_csat_score()','analyse_call_transcripts()','flag_ticket_spike()'],
      activity:['> 142 open tickets analyzed', '> Sentiment: -12% WoW in Renton', '> 23 tickets correlated to SEA-BELL-047', '> Auto-response templates updated'] },
    { id:'orc', name:'Orchestrator Agent',     role:'Cross-Domain Decision Engine',   icon:'🧠', color:'#3B82F6',
      status:'active',
      tools:['compile_executive_summary()','stage_remediation_blueprint()','route_to_agent()','synthesize_business_plan()'],
      activity:['> Synthesizing cross-agent data', '> Business plan: 8 zones analyzed', '> RF fix routed for approval (TT-2847)', '> Executive briefing ready'] },
  ]
};

const USE_CASES = [
  // ── Revenue Growth ───────────────────────────────────────────
  { id:'bizplan',   cat:'Revenue Growth',        name:'Operator Business Plan',      icon:'🗺️', color:'#8B5CF6', status:'live',
    tagline:'Where to invest next — market share, churn & network ROI across all zones.',
    data:['Marketing','GIS','Engineering','Customer'], maturity:'Prescriptive', view:'bizplan' },
  { id:'mktgagent', cat:'Revenue Growth',        name:'Marketing Agent',              icon:'📊', color:'#A78BFA', status:'live',
    tagline:'AI-driven market intelligence — campaigns, churn radar, revenue opportunity by zone.',
    data:['Marketing','Customer','GIS','Sales'], maturity:'Proactive', view:'mktgagent' },
  { id:'arpu',      cat:'Revenue Growth',        name:'ARPU Uplift Radar',            icon:'💰', color:'#22C55E', status:'beta',
    tagline:'Identify under-monetised subscribers and trigger personalised upsell at the right moment.',
    data:['Marketing','Customer','Sales'], maturity:'Prescriptive', view:'builder' },

  // ── Network Operations ───────────────────────────────────────
  { id:'rfagent',   cat:'Network Operations',    name:'RF Engineer Agent',            icon:'📡', color:'#06B6D4', status:'live',
    tagline:'Agentic RF engineer — detect, diagnose and fix underperforming sites in 2 min.',
    data:['Engineering KPIs','Alarms','Tickets','GIS'], maturity:'Diagnostic', view:'rfagent' },
  { id:'dcrrca',    cat:'Network Operations',    name:'Drop Call RCA',                icon:'📉', color:'#EF4444', status:'live',
    tagline:'Root-cause drop call spikes across 5 domains — handover, alarms, capacity, radio, coverage.',
    data:['Engineering','GIS','Alarms'], maturity:'Diagnostic', view:'dcrrca' },
  { id:'paramaudit',cat:'Network Operations',    name:'Parameter Compliance Audit',   icon:'⚙️', color:'#F97316', status:'beta',
    tagline:'Detect golden-set deviations across all sites before they cause performance degradation.',
    data:['Engineering','Planning & Field'], maturity:'Diagnostic', view:'builder' },

  // ── Planning ─────────────────────────────────────────────────
  { id:'capacity',  cat:'Planning',              name:'Capacity Planning',            icon:'📈', color:'#EA580C', status:'soon',
    tagline:'Forecast PRB exhaustion before it impacts customers — quarter-ahead precision.',
    data:['Engineering','Planning'], maturity:'Predictive', view:'builder' },
  { id:'coverage',  cat:'Planning',              name:'Coverage Gap Finder',          icon:'🌐', color:'#16A34A', status:'soon',
    tagline:'Crowdsource vs. your network — surface real-world indoor and outdoor coverage holes.',
    data:['3rd Party','GIS','Engineering'], maturity:'Diagnostic', view:'builder' },
  { id:'deploy5g',  cat:'Planning',              name:'5G Deployment Planner',        icon:'🏗️', color:'#3B82F6', status:'soon',
    tagline:'AI-ranked site prioritisation for small cells and macro upgrades with ROI per site.',
    data:['GIS','Planning & Field','Engineering'], maturity:'Prescriptive', view:'builder' },

  // ── Customer Experience ───────────────────────────────────────
  { id:'churn',     cat:'Customer Experience',   name:'Churn & Retention Radar',      icon:'🔄', color:'#0891B2', status:'beta',
    tagline:'Spot churn-risk clusters before they leave using cross-domain signals.',
    data:['Customer','Marketing','Engineering'], maturity:'Predictive', view:'builder' },
  { id:'voc',       cat:'Customer Experience',   name:'VOC Complaint Intelligence',   icon:'💬', color:'#F97316', status:'beta',
    tagline:'Correlate complaint transcripts with network events — find the systemic fix, not just the ticket.',
    data:['Customer Care','Engineering','GIS'], maturity:'Diagnostic', view:'builder' },
  { id:'nps',       cat:'Customer Experience',   name:'NPS Recovery Playbook',        icon:'⭐', color:'#EAB308', status:'soon',
    tagline:'Automatically generate zone-level recovery plans for NPS detractors mapped to network root causes.',
    data:['Customer','Marketing','Engineering'], maturity:'Prescriptive', view:'builder' },

  // ── Autonomous Operations ─────────────────────────────────────
  { id:'closedloop',cat:'Autonomous Operations', name:'Closed-Loop Network Optimisation', icon:'⚡', color:'#22C55E', status:'beta',
    tagline:'Detect → diagnose → remediate network faults autonomously. Human approval gate configurable.',
    data:['Engineering','Alarms','GIS'], maturity:'Autonomous', view:'builder' },
  { id:'beam',      cat:'Autonomous Operations', name:'Autonomous Beam Management',   icon:'📶', color:'#6366F1', status:'soon',
    tagline:'AI continuously optimises antenna tilt and beam direction across the fleet with no manual input.',
    data:['Engineering','Planning & Field'], maturity:'Autonomous', view:'builder' },
  { id:'selfheal',  cat:'Autonomous Operations', name:'Self-Healing Network',         icon:'🛡️', color:'#8B5CF6', status:'soon',
    tagline:'Predict and prevent site outages before they occur — from alarm correlation to pre-emptive action.',
    data:['Engineering','Alarms','GIS','Planning'], maturity:'Autonomous', view:'builder' },
];

let PUBLISHED = [];

/* ============================================================
   PARAMETER AUDIT DATA  (Engineering · config vs golden set)
   ============================================================ */
const PARAM_AUDIT = [
  { param:'RACH Root Sequence Index',         golden:'204',    actual:'204',    scope:'cluster',       impact:'Access' },
  { param:'p0NominalPUSCH (dBm)',             golden:'-90',    actual:'-84',    scope:'SEA-0042 · S2', impact:'Coverage / uplink',  reason:'Uplink power offset above golden → cell-edge access failures & drops' },
  { param:'Time-To-Trigger (ms)',             golden:'320',    actual:'160',    scope:'SEA-0071 · S1', impact:'Handover',            reason:'TTT below golden → ping-pong handovers → drop-call risk' },
  { param:'Cell Individual Offset (dB)',      golden:'0',      actual:'3',      scope:'SEA-0071 · S1', impact:'Handover',            reason:'CIO bias delays handover → radio-link failure at boundary' },
  { param:'QCI 1 Scheduling Priority',        golden:'2',      actual:'2',      scope:'network',       impact:'Voice QoS' },
  { param:'Max TX Power (dBm)',               golden:'46',     actual:'43',     scope:'SEA-0042 · S2', impact:'Coverage',            reason:'Power 3 dB below golden → coverage hole / poor RSRP' },
  { param:'Software / Baseband Version',      golden:'R23.Q2', actual:'R22.Q4', scope:'SEA-0103',      impact:'Stability',           reason:'Element not on latest version → known retainability defect' },
  { param:'Inter-freq Handover A5 Threshold', golden:'-110',   actual:'-110',   scope:'network',       impact:'Mobility' },
];
PARAM_AUDIT.forEach(p => { p.compliant = p.golden === p.actual; });
const PARAM_AUDIT_SUMMARY = { total: PARAM_AUDIT.length, nonCompliant: PARAM_AUDIT.filter(p => !p.compliant).length };

/* ============================================================
   ROUTER / NAVIGATION
   ============================================================ */
let currentView = 'home';
let bizMap = null;
const _extraMaps = [];

function _destroyExtraMaps() {
  _extraMaps.forEach(m => { try { m.remove(); } catch(e) {} });
  _extraMaps.length = 0;
}

function navigate(view) {
  currentView = view;
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
  const wrap = document.getElementById('viewWrap');
  wrap.innerHTML = '';
  if (bizMap) { bizMap.remove(); bizMap = null; }
  _destroyExtraMaps();
  const renders = {
    home: renderHome,
    gallery: renderGallery,
    bizplan: renderBizPlan,
    rfagent: renderRFAgent,
    rfchat: renderRFChat,
    mktgagent: renderMarketingAgent,
    datalayer: renderDataLayer,
    dcrrca: renderDCRRca,
    governance: renderGovernance,
    analytics: renderAnalytics,
    agents: renderAgents,
    builder: renderBuilder
  };
  if (renders[view]) renders[view](wrap);
}

/* ============================================================
   SVG ICONS
   ============================================================ */
const ICONS = {
  trend: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  brain: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><path d="M7 9a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10"/></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  map:   `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
};

/* ============================================================
   SPARKLINE HELPER
   ============================================================ */
function sparkline(data, color) {
  const id = 'sp' + Math.random().toString(36).slice(2);
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;
    new Chart(el, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{ data, borderColor: color, borderWidth: 1.5, pointRadius: 0, fill: true, backgroundColor: color + '22', tension: .4 }]
      },
      options: { animation: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
  }, 50);
  return `<canvas id="${id}" style="width:80px;height:32px"></canvas>`;
}

function genSeries(base, len = 20, noise = 5) {
  return Array.from({ length: len }, (_, i) => +(base + (Math.random() - .5) * noise + Math.sin(i / 3) * noise * .3).toFixed(1));
}

/* ============================================================
   VIEW: HOME / COMMAND CENTER
   ============================================================ */
function renderHome(wrap) {
  wrap.innerHTML = `
    <div class="home-hero">
      <div class="hero-sectors">
        <span class="sector-pill">📡 Telecom</span>
        <span class="sector-pill">🌐 Fibre</span>
        <span class="sector-pill">🛰️ Satellite</span>
        <span class="sector-pill">🏢 Digital Infrastructure</span>
        <span class="sector-pill">⚙️ OEMs</span>
        <span class="sector-pill">🏭 Data Centers</span>
      </div>
      <h1>The <span>AI-First</span> Agentic Marketplace for Telecom, Fibre, Satellite &amp; Digital Infrastructure</h1>
      <p>Unify operational, customer, business, sales and geospatial data across your enterprise. Build autonomous agents that <b>Discover · Predict · Execute</b> across Engineering, Marketing, Customer, Sales, 3rd-Party and GIS — without writing a single line of code.</p>
      <div class="hero-actions">
        <button class="btn-primary" onclick="navigate('bizplan')">View Business Plan →</button>
        <button class="btn-secondary" onclick="navigate('rfagent')">RF Engineer Agent</button>
        <button class="btn-secondary" onclick="navigate('agents')">Agent Fleet</button>
        <button class="btn-secondary" onclick="navigate('builder')">Build Use-Case</button>
      </div>
    </div>

    <div class="grid-3" style="margin-bottom:16px">
      <div class="vp-card vp-save" style="background:var(--surface)">
        <div style="font-size:11px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:.5px">Save Cost</div>
        <div class="vp-num" style="color:var(--green)">~75%</div>
        <div class="vp-label">reduction in manual RF engineer hours</div>
        <div class="vp-desc">100 RF engineers → 25 reviewers. Agent handles monitoring, RCA, ticket creation. Engineers approve only.</div>
      </div>
      <div class="vp-card vp-revenue" style="background:var(--surface)">
        <div style="font-size:11px;font-weight:600;color:var(--blue);text-transform:uppercase;letter-spacing:.5px">Grow Revenue</div>
        <div class="vp-num" style="color:var(--blue)">3 Zones</div>
        <div class="vp-label">identified for immediate marketing opportunity</div>
        <div class="vp-desc">Bellevue + Issaquah + Bothell show low market share with strong network — prime campaign targets worth $4.2M incremental ARR.</div>
      </div>
      <div class="vp-card vp-quality" style="background:var(--surface)">
        <div style="font-size:11px;font-weight:600;color:var(--orange);text-transform:uppercase;letter-spacing:.5px">Improve Quality</div>
        <div class="vp-num" style="color:var(--orange)">2 min</div>
        <div class="vp-label">vs 4–6 hours to detect + diagnose a site fault</div>
        <div class="vp-desc">Agent detects DCR anomaly, correlates RAN + IMS logs, computes fix, routes ticket — all before an engineer's coffee is cold.</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div>
        <div class="section-head">
          <div><div class="section-title">Network Health</div><div class="section-sub">Across 1,247 sites · Greater Seattle cluster</div></div>
        </div>
        <div class="grid-4" style="margin-bottom:12px">
          ${DATA.kpis.slice(0, 4).map(k => `
            <div class="kpi-tile">
              <div class="accent" style="background:${k.color}"></div>
              <div class="lbl">${k.label}</div>
              <div class="val" style="color:${k.color}">${k.val}<small style="font-size:12px;color:var(--muted)">${k.unit}</small></div>
              <div class="delta ${k.dir === 'bad' ? 'delta-up' : 'delta-down'}">${k.delta} <span style="color:var(--muted)">vs 24h</span></div>
            </div>`).join('')}
        </div>
        <div class="grid-4">
          ${DATA.kpis.slice(4).map(k => `
            <div class="kpi-tile">
              <div class="accent" style="background:${k.color}"></div>
              <div class="lbl">${k.label}</div>
              <div class="val" style="color:${k.color}">${k.val}<small style="font-size:12px;color:var(--muted)">${k.unit}</small></div>
              <div class="delta ${k.dir === 'bad' ? 'delta-up' : 'delta-down'}">${k.delta} <span style="color:var(--muted)">vs 24h</span></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-title">${ICONS.brain} Platform Architecture — 6 Layers</div>
        <div class="arch-layers">
          <div class="arch-layer l6"><span class="layer-num">L6</span><span class="layer-name">Marketplace Interface</span><span class="layer-items">Web Console · Northbound APIs · ServiceNow/Jira</span></div>
          <div class="arch-layer l5"><span class="layer-num">L5</span><span class="layer-name">Decision Horizons</span><span class="layer-items">Reactive → Proactive → RCA → Predictive → Prescriptive</span></div>
          <div class="arch-layer l4"><span class="layer-num">L4</span><span class="layer-name">Agentic Fleet</span><span class="layer-items">Engineering · Marketing · Customer · Orchestrator</span></div>
          <div class="arch-layer l3"><span class="layer-num">L3</span><span class="layer-name">Cognitive Orchestration</span><span class="layer-items">LangGraph · MCP Gateways · Private SLM Endpoints</span></div>
          <div class="arch-layer l2"><span class="layer-num">L2</span><span class="layer-name">Geospatial (GIS) Layer</span><span class="layer-items">PostGIS · H3 Hex Indexing · Network Coordinate Mapping</span></div>
          <div class="arch-layer l1"><span class="layer-num">L1</span><span class="layer-name">Unified Data Fabric</span><span class="layer-items">Kafka Streams · Delta Lake · CRM Vector Stores</span></div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-title">Agent Fleet Status</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${DATA.agents.map(a => `
            <div class="agent-card" style="border-color:${a.color}22">
              <div class="agent-head-row">
                <div class="agent-icon" style="background:${a.color}22">${a.icon}</div>
                <div><div class="agent-name">${a.name}</div><div class="agent-role">${a.role}</div></div>
                <div class="agent-status">
                  <div class="status-dot ${a.status === 'busy' ? 'status-busy' : a.status === 'active' ? 'status-active' : 'status-idle'}"></div>
                  ${a.status}
                </div>
              </div>
            </div>`).join('')}
        </div>
        <div style="margin-top:10px;text-align:center">
          <button class="btn-secondary" style="font-size:11px;padding:5px 12px" onclick="navigate('agents')">View Full Agent Fleet →</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">${ICONS.alert} Live Alarm Feed</div>
        ${DATA.alarms.map(a => `
          <div class="alarm-row">
            <div class="alarm-sev" style="background:${a.sev === 'crit' ? '#EF4444' : a.sev === 'warn' ? '#F97316' : '#6B7FA3'}"></div>
            <div class="alarm-body">
              <div class="alarm-type">${a.type} <span class="pill ${a.sev === 'crit' ? 'pill-red' : a.sev === 'warn' ? 'pill-orange' : 'pill-brand'}" style="font-size:10px">${a.sev}</span></div>
              <div class="alarm-site">${a.site} · ${a.sector}</div>
            </div>
            <div class="alarm-ts">${a.ts}</div>
          </div>`).join('')}
        <div style="margin-top:10px;text-align:center">
          <button class="btn-secondary" style="font-size:11px;padding:5px 12px" onclick="navigate('rfagent')">View RF Agent Workflow →</button>
        </div>
      </div>
    </div>

    <!-- Insights Feed — Cross-Agent Insight Cards -->
    <div style="margin-bottom:16px">
      <div class="section-head" style="margin-bottom:10px">
        <div>
          <div class="section-title" style="font-size:15px">Cross-Agent Insights Feed</div>
          <div class="section-sub">Live intelligence synthesised by the Orchestrator across all domain agents</div>
        </div>
        <span class="pill pill-green">● 6 new insights</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[
          { agent:'Engineering Agent',          icon:'📡', col:'#06B6D4', sev:'critical', ts:'2 min ago',
            title:'DCR spike on SEA-BELL-047 (+1.8% above threshold)',
            body:'EN-DC desync detected on Sector 2. RCA confidence: 94%. Beam tilt fix staged — awaiting Ops approval (TT-2847).',
            cta:'Review Fix', view:'rfagent' },
          { agent:'Marketing Agent',            icon:'📊', col:'#8B5CF6', sev:'opportunity', ts:'14 min ago',
            title:'$2.1M campaign opportunity in Bellevue — network now ready',
            body:'Network quality score improved to 91/100 in Bellevue Downtown. Market share 28% — well below metro avg. 5G Speed Campaign ready to launch.',
            cta:'Open Campaign', view:'mktgagent' },
          { agent:'Forecast Agent',             icon:'🔮', col:'#8B5CF6', sev:'warning', ts:'1 hr ago',
            title:'Churn risk elevated in Sammamish 98074 (8.2%)',
            body:'14-day ML model projects further churn increase if network fix (PRB exhaustion) not resolved within 48h. 1,240 subscribers at risk.',
            cta:'View Churn Radar', view:'builder' },
          { agent:'Customer Service Agent',     icon:'💬', col:'#F97316', sev:'warning', ts:'2 hr ago',
            title:'23 IMS timeout complaints correlated to SEA-BELL-047',
            body:'Complaint spike (23 tickets in 4h) matches spatial footprint of EN-DC desync. Auto-linked to TT-2847. CSAT at risk.',
            cta:'View Tickets', view:'agents' },
          { agent:'Analytics & Exec Agent',     icon:'📋', col:'#6366F1', sev:'info', ts:'3 hr ago',
            title:'Executive briefing ready: 3 critical issues, 2 revenue opportunities',
            body:'Actionability Score 87%. Business Impact: −$114K/month ARR at risk. Revenue unlock: +$3.0M ARR if Bellevue + Issaquah campaigns launch this week.',
            cta:'View Actionability Score', view:'rfagent' },
          { agent:'GIS Agent',                  icon:'🗺️', col:'#3B82F6', sev:'info', ts:'6 hr ago',
            title:'H3 hex analysis: 3 new coverage gap clusters identified in Pierce County',
            body:'Indoor coverage below threshold (Ecolocate <6.0/10) in 3 ZIP clusters. Small cell deployment would serve ~4,200 homes. ROI estimate: 18 months.',
            cta:'View Coverage Map', view:'bizplan' },
        ].map(ins => `
          <div style="display:flex;gap:12px;background:var(--surface);border:1px solid ${
            ins.sev === 'critical' ? 'rgba(239,68,68,.3)' : ins.sev === 'opportunity' ? 'rgba(34,197,94,.3)' : ins.sev === 'warning' ? 'rgba(249,115,22,.3)' : 'var(--border)'
          };border-left:3px solid ${
            ins.sev === 'critical' ? '#EF4444' : ins.sev === 'opportunity' ? '#22C55E' : ins.sev === 'warning' ? '#F97316' : '#6366F1'
          };border-radius:var(--radius);padding:12px 14px;cursor:pointer" onclick="navigate('${ins.view}')">
            <div style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:${ins.col}18;display:flex;align-items:center;justify-content:center;font-size:16px;margin-top:2px">${ins.icon}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
                <div style="font-size:10px;color:${ins.col};font-weight:600">${ins.agent}</div>
                <div style="font-size:10px;color:var(--muted)">${ins.ts}</div>
                <span style="font-size:10px;padding:1px 6px;border-radius:100px;background:${
                  ins.sev === 'critical' ? 'rgba(239,68,68,.15)' : ins.sev === 'opportunity' ? 'rgba(34,197,94,.15)' : ins.sev === 'warning' ? 'rgba(249,115,22,.15)' : 'rgba(99,102,241,.15)'
                };color:${
                  ins.sev === 'critical' ? '#EF4444' : ins.sev === 'opportunity' ? '#22C55E' : ins.sev === 'warning' ? '#F97316' : '#6366F1'
                };font-weight:600;text-transform:uppercase;letter-spacing:.3px">${ins.sev}</span>
              </div>
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${ins.title}</div>
              <div style="font-size:11px;color:var(--muted2);line-height:1.5">${ins.body}</div>
            </div>
            <div style="flex-shrink:0;align-self:center">
              <button class="btn-secondary" style="font-size:10px;padding:4px 10px;white-space:nowrap" onclick="event.stopPropagation();navigate('${ins.view}')">${ins.cta} →</button>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

/* ============================================================
   VIEW: OPERATOR BUSINESS PLAN (FLAGSHIP)
   ============================================================ */
let activeZone = null;

function renderBizPlan(wrap) {
  const cats = { invest: 0, grow: 0, defend: 0, fix: 0 };
  DATA.zones.forEach(z => cats[z.cat]++);

  wrap.style.padding = '14px';
  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Operator Business Plan</div>
        <div class="section-sub">Multi-agent market analysis across 8 zones · Greater Seattle · GIS Canvas</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="pill pill-brand">Orchestrator Active</span>
        <button class="btn-primary" style="font-size:11px;padding:5px 12px">Export Report</button>
      </div>
    </div>

    <div class="geo-level-bar">
      <span style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.4px;text-transform:uppercase;margin-right:4px">Geography:</span>
      <button class="geo-btn" onclick="bizGeoLevel(this,'country')">🌎 Country (USA)</button>
      <button class="geo-btn" onclick="bizGeoLevel(this,'state')">State (WA)</button>
      <button class="geo-btn" onclick="bizGeoLevel(this,'city')">City (Seattle)</button>
      <button class="geo-btn active" onclick="bizGeoLevel(this,'zone')">Zone (Zip Code)</button>
      <span style="margin-left:auto;font-size:11px;color:var(--muted2)" id="geoLevelLabel">→ Viewing: <b style="color:var(--text)">Zone level · 8 zones</b></span>
    </div>

    <div class="summary-cards">
      <div class="sum-card sum-invest"><div class="sum-n">${cats.invest}</div><div class="sum-l">INVEST</div></div>
      <div class="sum-card sum-grow"><div class="sum-n">${cats.grow}</div><div class="sum-l">GROW</div></div>
      <div class="sum-card sum-defend"><div class="sum-n">${cats.defend}</div><div class="sum-l">DEFEND</div></div>
      <div class="sum-card sum-fix"><div class="sum-n">${cats.fix}</div><div class="sum-l">FIX</div></div>
    </div>

    <div class="biz-layout">
      <div class="map-panel">
        <div id="bizMap"></div>
        <div class="map-legend">
          <div style="font-size:10px;font-weight:600;color:var(--muted);margin-bottom:6px;letter-spacing:.5px">MARKET STRATEGY</div>
          <div class="legend-row"><div class="legend-dot" style="background:#EF4444"></div>INVEST — Low Share, Poor Network</div>
          <div class="legend-row"><div class="legend-dot" style="background:#22C55E"></div>GROW — Low Share, Good Network</div>
          <div class="legend-row"><div class="legend-dot" style="background:#3B82F6"></div>DEFEND — High Share, Good Network</div>
          <div class="legend-row"><div class="legend-dot" style="background:#F97316"></div>FIX — High Share, Poor Network</div>
        </div>
        <div class="map-controls">
          <button class="map-ctrl-btn active" id="layerAll">All Zones</button>
          <button class="map-ctrl-btn" id="layerInvest">Invest</button>
          <button class="map-ctrl-btn" id="layerGrow">Grow</button>
          <button class="map-ctrl-btn" id="layerFix">Fix</button>
        </div>
      </div>

      <div class="insight-panel" id="insightPanel">
        <div class="card" style="text-align:center;padding:24px">
          <div style="font-size:24px;margin-bottom:8px">🗺️</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:6px">Click a zone on the map</div>
          <div style="font-size:12px;color:var(--muted)">The Orchestrator Agent will analyze market share, network performance, and churn to provide strategic recommendations.</div>
        </div>
        <div class="card">
          <div class="card-title">Zone Summary</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${DATA.zones.map(z => `
              <div onclick="selectZone('${z.id}')" id="zoneRow_${z.id}"
                style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background .15s"
                onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">
                <div style="width:8px;height:8px;border-radius:50%;background:${z.cat === 'invest' ? '#EF4444' : z.cat === 'grow' ? '#22C55E' : z.cat === 'defend' ? '#3B82F6' : '#F97316'};flex-shrink:0"></div>
                <div style="flex:1;font-size:12px">${z.name}</div>
                <span class="pill cat-${z.cat}" style="font-size:10px;padding:1px 6px">${z.cat.toUpperCase()}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  initBizMap();
}

function initBizMap() {
  const catColors = { invest: '#EF4444', grow: '#22C55E', defend: '#3B82F6', fix: '#F97316' };
  bizMap = L.map('bizMap', { center: [47.58, -122.17], zoom: 11, zoomControl: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB', maxZoom: 19
  }).addTo(bizMap);

  const circles = {};
  DATA.zones.forEach(z => {
    const c = L.circle([z.lat, z.lng], {
      radius: 2200, color: catColors[z.cat], fillColor: catColors[z.cat],
      fillOpacity: 0.25, weight: 2, opacity: 0.8
    }).addTo(bizMap);
    c.bindPopup(`<b>${z.name}</b><br><span style="color:${catColors[z.cat]};font-weight:600">${z.cat.toUpperCase()}</span><br>Market Share: ${z.ms}% &nbsp; Net Score: ${z.net}/100`);
    c.on('click', () => selectZone(z.id));
    circles[z.id] = c;
  });

  window._bizCircles = circles;

  ['All', 'Invest', 'Grow', 'Fix'].forEach(cat => {
    const btn = document.getElementById('layer' + cat);
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-ctrl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = cat === 'All' ? null : cat.toLowerCase();
      DATA.zones.forEach(z => {
        const c = circles[z.id];
        if (!filter || z.cat === filter) { c.addTo(bizMap); } else { bizMap.removeLayer(c); }
      });
    });
  });
}

window.selectZone = function (zid) {
  const z = DATA.zones.find(x => x.id === zid);
  if (!z) return;
  activeZone = z;
  const catColors = { invest: '#EF4444', grow: '#22C55E', defend: '#3B82F6', fix: '#F97316' };
  const col = catColors[z.cat];

  document.querySelectorAll('[id^="zoneRow_"]').forEach(el => el.style.background = '');
  const row = document.getElementById('zoneRow_' + zid);
  if (row) row.style.background = 'var(--surface3)';

  if (bizMap) bizMap.flyTo([z.lat, z.lng], 13, { duration: 1 });

  const panel = document.getElementById('insightPanel');
  panel.innerHTML = `
    <div class="zone-detail" style="border-color:${col}33">
      <div class="zone-detail-header">
        <div>
          <div style="font-size:14px;font-weight:700">${z.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${z.sites} active sites</div>
        </div>
        <span class="pill cat-${z.cat}" style="font-size:12px">${z.cat.toUpperCase()}</span>
      </div>
      <div class="zone-kpis">
        <div class="zone-kpi">
          <div class="zk-val" style="color:${z.ms < 40 ? '#EF4444' : '#22C55E'}">${z.ms}%</div>
          <div class="zk-lbl">Market Share</div>
        </div>
        <div class="zone-kpi">
          <div class="zk-val" style="color:${z.net < 60 ? '#EF4444' : z.net < 80 ? '#F97316' : '#22C55E'}">${z.net}/100</div>
          <div class="zk-lbl">Network Score</div>
        </div>
        <div class="zone-kpi">
          <div class="zk-val" style="color:${z.churn > 5 ? '#EF4444' : '#22C55E'}">${z.churn}%</div>
          <div class="zk-lbl">Churn Rate</div>
        </div>
        <div class="zone-kpi">
          <div class="zk-val" style="color:var(--text)">$${z.arpu}</div>
          <div class="zk-lbl">ARPU</div>
        </div>
      </div>
      <div class="agent-insight">
        <div class="agent-insight-head">🧠 Orchestrator Agent Insight</div>
        <p>${z.insight}</p>
      </div>
      <button class="action-btn" style="margin-top:10px">${z.action} →</button>
      <button class="action-btn secondary" style="margin-top:6px">Set Alert on this Zone</button>
    </div>
    <div class="card">
      <div class="card-title">Zone Summary</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${DATA.zones.map(zz => `
          <div onclick="selectZone('${zz.id}')" id="zoneRow_${zz.id}"
            style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background .15s;${zz.id === zid ? 'background:var(--surface3)' : ''}"
            onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='${zz.id === zid ? 'var(--surface3)' : ''}'">
            <div style="width:8px;height:8px;border-radius:50%;background:${catColors[zz.cat]};flex-shrink:0"></div>
            <div style="flex:1;font-size:12px">${zz.name}</div>
            <span class="pill cat-${zz.cat}" style="font-size:10px;padding:1px 6px">${zz.cat.toUpperCase()}</span>
          </div>`).join('')}
      </div>
    </div>
  `;
};

/* ============================================================
   VIEW: RF ENGINEER AGENT
   ============================================================ */
const RF_ISSUES = [
  {
    id: 'bell047', site: 'SEA-BELL-047', zone: 'Bellevue Downtown', sev: 'critical',
    type: 'EN-DC Desync', detected: '14 min ago', ticket: 'TT-2847', status: 'awaiting-approval',
    summary: 'EN-DC desync on Sector 2 driving DCR spike. Beam path obstructed by new CBD high-rise.',
    kpis: [
      { l:'Drop Call Rate',   v:'3.8%',     thr:'2.0%',    bad:true  },
      { l:'5G RSRP',          v:'-108 dBm', thr:'-105 dBm',bad:true  },
      { l:'LTE Anchor Drop',  v:'4.2%',     thr:'1.5%',    bad:true  },
      { l:'Beam Fail Rate',   v:'8.1%',     thr:'3.0%',    bad:true  },
      { l:'Avg Throughput',   v:'142 Mbps', thr:'200 Mbps',bad:true  },
      { l:'SINR',             v:'9.2 dB',   thr:'12 dB',   bad:true  },
    ],
    rca: { cause:'EN-DC Desync (Primary)', detail:'5G RSRP ↓ + LTE Anchor Drop ↑ = X2 link failure\n→ Beam tracking failure on mmWave\n→ Cell edge scenario (Bellevue CBD building)', conf:'94%', time:'T-12min', spatial:'Sector 2, 180° beam' },
    fix: 'Adjust beam tilt on Sector 2 from 3° to 6° electrical. Re-enable EN-DC once RSRP > −100 dBm.',
    impact: { conf:'94%', biz:'$114K', subs:'1,240', recovery:'15 min' },
    lat: 47.6101, lng: -122.2015,
    actionability: 87,
    wfStatus: ['done','done','done','active','pending'],
  },
  {
    id: 'red021', site: 'SEA-RED-021', zone: 'Redmond Tech Corridor', sev: 'warning',
    type: 'PRB Exhaustion', detected: '38 min ago', ticket: 'TT-2851', status: 'diagnosing',
    summary: 'PRB utilisation at 97% during peak hours causing DL throughput collapse and latency spikes.',
    kpis: [
      { l:'DL Throughput',    v:'89 Mbps',  thr:'180 Mbps',bad:true  },
      { l:'PRB Utilisation',  v:'97%',      thr:'80%',     bad:true  },
      { l:'Latency (avg)',    v:'48 ms',    thr:'25 ms',   bad:true  },
      { l:'Drop Call Rate',   v:'1.4%',     thr:'2.0%',    bad:false },
      { l:'SINR',             v:'13.1 dB',  thr:'12 dB',   bad:false },
      { l:'RSRP',             v:'-98 dBm',  thr:'-105 dBm',bad:false },
    ],
    rca: { cause:'PRB Exhaustion — Capacity Overload', detail:'Peak-hour traffic surge (B2B campus devices)\n→ No admission control policy active\n→ QCI 1 voice bearers starved', conf:'89%', time:'T-28min', spatial:'All sectors, peak 08:00–10:00' },
    fix: 'Enable dynamic PRB splitting. Set admission control policy. Schedule capacity upgrade for Q3.',
    impact: { conf:'89%', biz:'$87K', subs:'3,400', recovery:'30 min' },
    lat: 47.6740, lng: -122.1215,
    actionability: 82,
    wfStatus: ['done','done','active','pending','pending'],
  },
  {
    id: 'sam033', site: 'SEA-SAM-033', zone: 'Sammamish 98074', sev: 'warning',
    type: 'Coverage Hole', detected: '2 hr ago', ticket: 'TT-2839', status: 'staged',
    summary: 'RSRP below −110 dBm in eastern Sammamish residential cluster. 420 homes affected.',
    kpis: [
      { l:'RSRP (avg)',       v:'-112 dBm', thr:'-105 dBm',bad:true  },
      { l:'Coverage Score',   v:'61/100',   thr:'80/100',  bad:true  },
      { l:'Access Fail Rate', v:'3.2%',     thr:'1.5%',    bad:true  },
      { l:'Drop Call Rate',   v:'1.9%',     thr:'2.0%',    bad:false },
      { l:'DL Throughput',    v:'156 Mbps', thr:'180 Mbps',bad:true  },
      { l:'Complaint Tickets',v:'18/day',   thr:'5/day',   bad:true  },
    ],
    rca: { cause:'Coverage Hole — Terrain Obstruction', detail:'New residential construction (3-storey)\n→ Blocks LOS from SEA-SAM-033 Sector 1\n→ No neighbouring cell covers the gap', conf:'91%', time:'T-6days', spatial:'Sector 1, eastern 600m radius' },
    fix: 'Deploy small cell at community centre rooftop. Temporary fix: increase tx power on SEA-SAM-033 Sector 1 by 2 dBm.',
    impact: { conf:'91%', biz:'$43K', subs:'420', recovery:'48 hr' },
    lat: 47.6162, lng: -122.0355,
    actionability: 74,
    wfStatus: ['done','done','done','done','active'],
  },
  {
    id: 'ren018', site: 'SEA-REN-018', zone: 'Renton', sev: 'critical',
    type: 'Handover Failure', detected: '55 min ago', ticket: 'TT-2848', status: 'awaiting-approval',
    summary: 'Inter-frequency handover failure rate at 11.2%. CIO misconfiguration causing ping-pong drops.',
    kpis: [
      { l:'HO Success Rate',  v:'88.8%',    thr:'96%',     bad:true  },
      { l:'HO Failure Rate',  v:'11.2%',    thr:'4%',      bad:true  },
      { l:'Drop Call Rate',   v:'3.1%',     thr:'2.0%',    bad:true  },
      { l:'RLF Rate',         v:'2.4%',     thr:'1.0%',    bad:true  },
      { l:'SINR',             v:'10.8 dB',  thr:'12 dB',   bad:true  },
      { l:'TTT (ms)',         v:'160 ms',   thr:'320 ms',  bad:true  },
    ],
    rca: { cause:'CIO Misconfiguration (Primary)', detail:'Cell Individual Offset set to +3 dB (golden: 0 dB)\n→ TTT reduced to 160 ms (golden: 320 ms)\n→ Ping-pong HO at cell boundary → RLF', conf:'96%', time:'T-3hr', spatial:'Sector 2 ↔ SEA-REN-019 boundary' },
    fix: 'Reset CIO to 0 dB on SEA-REN-018 Sector 2. Restore TTT to 320 ms. Monitor HO rate for 30 min post-fix.',
    impact: { conf:'96%', biz:'$98K', subs:'2,100', recovery:'10 min' },
    lat: 47.4799, lng: -122.2171,
    actionability: 91,
    wfStatus: ['done','done','done','active','pending'],
  },
];

function renderRFAgent(wrap) {
  const sevColor = s => s === 'critical' ? '#EF4444' : '#F97316';
  const statusLabel = s => ({ 'awaiting-approval':'Awaiting Approval', diagnosing:'Diagnosing', staged:'Fix Staged', done:'Resolved' })[s] || s;
  const statusCol   = s => ({ 'awaiting-approval':'#F97316', diagnosing:'#06B6D4', staged:'#8B5CF6', done:'#22C55E' })[s] || 'var(--muted)';

  const critCount = RF_ISSUES.filter(i => i.sev === 'critical').length;
  const warnCount = RF_ISSUES.filter(i => i.sev === 'warning').length;

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">RF Engineer Agent</div>
        <div class="section-sub">Agent-detected anomalies across Greater Seattle cluster · Auto detect → diagnose → fix</div>
      </div>
      <div style="display:flex;gap:6px">
        <span class="pill pill-red">${critCount} Critical</span>
        <span class="pill" style="background:rgba(249,115,22,.15);color:#F97316;border:1px solid rgba(249,115,22,.3)">${warnCount} Warning</span>
        <span class="pill pill-brand">Agent Active</span>
      </div>
    </div>

    <!-- Summary bar -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
      ${[
        { label:'Issues Detected',   val: RF_ISSUES.length,  col:'#06B6D4', sub:'Last 2 hours' },
        { label:'Critical',          val: critCount,          col:'#EF4444', sub:'Immediate action' },
        { label:'Avg Agent Time',    val:'2 min',             col:'#22C55E', sub:'vs 4–6 hr manual' },
        { label:'Tickets Staged',    val: RF_ISSUES.length,  col:'#8B5CF6', sub:'Auto-created' },
      ].map(s => `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
          <div style="font-size:20px;font-weight:700;color:${s.col}">${s.val}</div>
          <div style="font-size:12px;font-weight:600;margin:3px 0">${s.label}</div>
          <div style="font-size:10px;color:var(--muted)">${s.sub}</div>
        </div>`).join('')}
    </div>

    <!-- Issue cards -->
    <div style="display:flex;flex-direction:column;gap:10px">
      ${RF_ISSUES.map(issue => `
        <div onclick="rfOpenIssue('${issue.id}')" style="background:var(--surface);border:1px solid var(--border);border-left:3px solid ${sevColor(issue.sev)};border-radius:var(--radius);padding:16px;cursor:pointer;transition:all .15s"
          onmouseover="this.style.borderColor='${sevColor(issue.sev)}';this.style.boxShadow='0 4px 16px rgba(0,0,0,.1)'"
          onmouseout="this.style.borderColor='var(--border)';this.style.borderLeftColor='${sevColor(issue.sev)}';this.style.boxShadow='none'">
          <div style="display:flex;align-items:flex-start;gap:14px">
            <div style="flex-shrink:0;width:40px;height:40px;border-radius:10px;background:${sevColor(issue.sev)}18;display:flex;align-items:center;justify-content:center;font-size:20px">
              ${issue.sev === 'critical' ? '🚨' : '⚠️'}
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
                <div style="font-size:13px;font-weight:700">${issue.site}</div>
                <span style="font-size:10px;padding:2px 8px;border-radius:100px;background:${sevColor(issue.sev)}18;color:${sevColor(issue.sev)};font-weight:700;text-transform:uppercase">${issue.sev}</span>
                <span style="font-size:10px;padding:2px 8px;border-radius:100px;background:${statusCol(issue.status)}18;color:${statusCol(issue.status)};font-weight:600">${statusLabel(issue.status)}</span>
                <span style="font-size:10px;color:var(--muted);margin-left:auto">${issue.detected} · ${issue.ticket}</span>
              </div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:6px">${issue.zone} · <b style="color:${sevColor(issue.sev)}">${issue.type}</b></div>
              <div style="font-size:12px;color:var(--muted2);margin-bottom:10px">${issue.summary}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${issue.kpis.filter(k => k.bad).slice(0,4).map(k => `
                  <span style="font-size:10px;padding:2px 8px;background:rgba(239,68,68,.1);color:#EF4444;border:1px solid rgba(239,68,68,.2);border-radius:4px">
                    ${k.l}: ${k.v}
                  </span>`).join('')}
              </div>
            </div>
            <div style="flex-shrink:0;text-align:right">
              <div style="font-size:18px;font-weight:700;color:${issue.actionability >= 85 ? '#22C55E' : issue.actionability >= 75 ? '#F97316' : '#EF4444'}">${issue.actionability}%</div>
              <div style="font-size:10px;color:var(--muted)">Actionability</div>
              <div style="margin-top:8px">
                <span style="font-size:11px;color:var(--brand);font-weight:600">View Details →</span>
              </div>
            </div>
          </div>
        </div>`).join('')}
    </div>
  `;
}

window.rfOpenIssue = function(id) {
  const issue = RF_ISSUES.find(i => i.id === id);
  if (!issue) return;
  const wrap = document.getElementById('viewWrap');
  wrap.innerHTML = '';
  _destroyExtraMaps();
  _renderRFAgentDetail(wrap, issue);
};

function _renderRFAgentDetail(wrap, issue) {
  const sevColor = issue.sev === 'critical' ? '#EF4444' : '#F97316';
  const wfLabels = [
    { title:'Anomaly Detection',    body:'Agent detected KPI deviation above threshold. Cross-referenced with alarm feed and historical baselines.' },
    { title:'Data Enrichment',      body:'Pulled site config, neighbouring cell data, alarm history and customer complaint tickets for correlation.' },
    { title:'Root Cause Analysis',  body:`RCA engine identified <b>${issue.rca.cause}</b> as primary driver. Confidence: ${issue.rca.conf}.` },
    { title:'Recommendation Staged',body:`Fix ready: ${issue.fix} Ticket ${issue.ticket} created.` },
    { title:'Execute & Monitor',    body:'Automation Agent ready to push parameter change via NETCONF/YANG. Awaiting Ops Manager approval.' },
  ];

  wrap.innerHTML = `
    <!-- Back nav -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <button class="btn-secondary" style="font-size:11px;padding:5px 12px" onclick="navigate('rfagent')">← All Issues</button>
      <div style="font-size:12px;color:var(--muted)">RF Engineer Agent <span style="color:var(--muted2)">›</span> ${issue.site}</div>
    </div>

    <div class="section-head">
      <div>
        <div class="section-title">${issue.site} — ${issue.type}</div>
        <div class="section-sub">${issue.zone} · Detected ${issue.detected} · ${issue.ticket}</div>
      </div>
      <div style="display:flex;gap:6px">
        <span class="pill" style="background:${sevColor}18;color:${sevColor};border:1px solid ${sevColor}40;font-weight:700">${issue.sev.toUpperCase()}</span>
        <span class="pill pill-brand">Agent Active</span>
      </div>
    </div>

    <div style="background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(6,182,212,.1));border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px 16px;margin-bottom:14px;display:flex;gap:24px">
      <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--green)">2 min</div><div style="font-size:10px;color:var(--muted)">Agent time</div></div>
      <div style="width:1px;background:var(--border)"></div>
      <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--red)">4–6 hrs</div><div style="font-size:10px;color:var(--muted)">Manual time</div></div>
      <div style="width:1px;background:var(--border)"></div>
      <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--blue)">${issue.rca.conf}</div><div style="font-size:10px;color:var(--muted)">RCA Confidence</div></div>
      <div style="width:1px;background:var(--border)"></div>
      <div style="flex:1;display:flex;align-items:center;font-size:12px;color:var(--muted2)">Deploying agents replaces 75% of manual monitoring load. Engineers review and approve — they don't hunt for problems.</div>
    </div>

    <div class="rf-layout">
      <div>
        <div class="card">
          <div class="card-title">Automated Workflow · Open-Loop Mode (Human Approval Required)</div>
          <div class="workflow-steps" style="margin-top:8px">
            ${wfLabels.map((s, i) => {
              const st = issue.wfStatus[i];
              return `
              <div class="wf-step">
                <div class="wf-num ${st}">${st === 'done' ? '✓' : st === 'active' ? '●' : i+1}</div>
                <div class="wf-content">
                  <div class="wf-title">
                    ${s.title}
                    ${st === 'done' ? '<span class="pill pill-green" style="font-size:10px">Complete</span>' : st === 'active' ? '<span class="pill pill-brand" style="font-size:10px">In Progress</span>' : '<span class="pill" style="font-size:10px;background:var(--surface3);color:var(--muted)">Pending</span>'}
                  </div>
                  <div class="wf-body">${s.body}
                    ${st === 'active' ? `<div style="margin-top:10px;display:flex;gap:8px">
                      <button class="btn-primary" style="font-size:11px;padding:5px 12px" onclick="approveAction(event)">Approve &amp; Execute</button>
                      <button class="btn-secondary" style="font-size:11px;padding:5px 12px">Modify Parameters</button>
                    </div>` : ''}
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
            <div class="card-title" style="margin-bottom:0">📍 Site Location</div>
            <span class="pill pill-red" style="font-size:10px">${issue.site} · ${issue.sev.charAt(0).toUpperCase()+issue.sev.slice(1)}</span>
          </div>
          <div id="rfMap" style="height:180px"></div>
        </div>

        <div class="card">
          <div class="card-title">Affected Site KPIs</div>
          <div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px">${issue.site} · ${issue.zone}</div>
          ${issue.kpis.map(k => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
              <div style="width:8px;height:8px;border-radius:50%;background:${k.bad ? '#EF4444' : '#22C55E'};flex-shrink:0"></div>
              <div style="flex:1;font-size:12px">${k.l}</div>
              <div style="font-size:12px;font-weight:600;color:${k.bad ? '#EF4444' : '#22C55E'}">${k.v}</div>
              <div style="font-size:10px;color:var(--muted)">${k.bad ? '<' : '>'} ${k.thr}</div>
            </div>`).join('')}
        </div>

        <div class="card">
          <div class="card-title">${ICONS.alert} Related Alarms</div>
          ${DATA.alarms.slice(0, 3).map(a => `
            <div class="alarm-row">
              <div class="alarm-sev" style="background:${a.sev === 'crit' ? '#EF4444' : '#F97316'}"></div>
              <div class="alarm-body">
                <div class="alarm-type">${a.type}</div>
                <div class="alarm-site">${issue.site} · Sector 2</div>
              </div>
              <div class="alarm-ts">${a.ts}</div>
            </div>`).join('')}
        </div>

        <div class="card">
          <div class="card-title">RCA Correlation Engine</div>
          <div style="font-size:12px;color:var(--muted2);line-height:1.8">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <div style="width:6px;height:6px;border-radius:50%;background:var(--red)"></div>
              <b style="color:var(--text)">${issue.rca.cause}</b>
            </div>
            <div style="padding-left:14px;font-size:11px">${issue.rca.detail.replace(/\n/g,'<br>')}</div>
            <div style="margin-top:8px;padding:8px;background:var(--surface2);border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--brand)">
              Confidence: ${issue.rca.conf}<br>
              Temporal match: ${issue.rca.time}<br>
              Spatial match: ${issue.rca.spatial}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actionability Score -->
    <div class="card" style="margin-top:14px;border-color:rgba(8,145,178,.3);background:linear-gradient(135deg,rgba(8,145,178,.06),rgba(37,99,235,.04))">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div class="card-title" style="margin-bottom:2px">Actionability Score — Executive Output</div>
          <div style="font-size:11px;color:var(--muted)">Analytics &amp; Executive Report Agent · ${issue.site}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:28px;font-weight:700;color:#22C55E;line-height:1">${issue.actionability}%</div>
          <div style="font-size:10px;color:var(--muted)">Actionability Score</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        ${[
          { q:'What happened?', icon:'🔴', col:'#EF4444', a:`${issue.type} detected on ${issue.site} (${issue.zone}). ${issue.summary}` },
          { q:'Why?',           icon:'🔍', col:'#F97316', a:`${issue.rca.cause}: ${issue.rca.detail.replace(/\n/g,' ')}` },
          { q:'What will happen?', icon:'🔮', col:'#8B5CF6', a:`Forecast Agent: If unresolved, issue will worsen over next 24–72h. ${issue.impact.subs} subscribers at risk. Revenue impact: −${issue.impact.biz} ARR/month.` },
          { q:'What to do?',    icon:'💡', col:'#EAB308', a:`Recommendation Agent (${issue.impact.conf} confidence): ${issue.fix}` },
          { q:'Can you do it?', icon:'⚡', col:'#22C55E', a:`Yes — Automation Agent ready to execute via NETCONF/YANG. Pending Ops Manager approval. ${issue.ticket} staged.` },
        ].map(item => `
          <div style="display:flex;gap:12px;background:var(--surface2);border-radius:8px;padding:10px 12px">
            <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:${item.col}20;display:flex;align-items:center;justify-content:center;font-size:13px;margin-top:1px">${item.icon}</div>
            <div style="flex:1">
              <div style="font-size:11px;font-weight:700;color:${item.col};margin-bottom:3px">${item.q}</div>
              <div style="font-size:11px;color:var(--muted2);line-height:1.6">${item.a}</div>
            </div>
          </div>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:14px">
        ${[
          { label:'Confidence',           val:issue.impact.conf,     sub:'RCA engine certainty',    col:'#22C55E' },
          { label:'Business Impact',      val:issue.impact.biz,      sub:'ARR at risk / month',     col:'#EF4444' },
          { label:'Affected Subscribers', val:issue.impact.subs,     sub:issue.zone,                col:'#F97316' },
          { label:'Recovery Est.',        val:issue.impact.recovery, sub:'Post-approval execution', col:'#3B82F6' },
        ].map(k => `
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:18px;font-weight:700;color:${k.col}">${k.val}</div>
            <div style="font-size:10px;font-weight:600;margin:3px 0">${k.label}</div>
            <div style="font-size:10px;color:var(--muted)">${k.sub}</div>
          </div>`).join('')}
      </div>

      <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:8px">
        <div style="flex:1;font-size:12px;color:var(--muted2)">
          <b style="color:var(--text)">Ready to execute:</b> ${issue.fix} Governance Agent has logged the action for audit trail.
        </div>
        <button class="btn-primary" style="flex-shrink:0;background:#22C55E;border-color:#22C55E" onclick="approveAction(event)">Execute Recommendation →</button>
      </div>
    </div>
  `;
  _initRFDetailMap(issue.lat, issue.lng, issue.site, issue.type, issue.sev);
}

function _initRFDetailMap(lat, lng, site, type, sev) {
  const col = sev === 'critical' ? '#EF4444' : '#F97316';
  const rfMap = L.map('rfMap', { center: [lat, lng], zoom: 13, zoomControl: false, attributionControl: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(rfMap);
  _extraMaps.push(rfMap);
  L.circle([lat, lng], { radius: 350, color: col, fillColor: col, fillOpacity: 0.6, weight: 3 })
    .addTo(rfMap).bindPopup('<b>' + site + '</b><br>' + type + '<br><span style="color:' + col + ';font-weight:600">' + sev.toUpperCase() + '</span>');
  [[lat+0.013, lng+0.006], [lat-0.011, lng-0.016], [lat+0.005, lng-0.013]].forEach((ll, i) => {
    L.circle(ll, { radius: 220, color: '#6B7FA3', fillColor: '#6B7FA3', fillOpacity: 0.4, weight: 2 })
      .addTo(rfMap).bindPopup('Neighbouring site ' + (i+1) + ' · Healthy');
  });
  setTimeout(() => rfMap.invalidateSize(), 80);
}

window.approveAction = function (event) {
  const btn = event.target;
  btn.textContent = '✓ Approved — Executing…';
  btn.disabled = true;
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.closest('.wf-body').insertAdjacentHTML('beforeend', `
      <div style="margin-top:8px;background:var(--green-dim);border:1px solid rgba(34,197,94,.3);border-radius:6px;padding:8px;font-size:11px;color:var(--green)">
        ✓ Parameters pushed to SEA-BELL-047 Sector 2. Monitoring DCR… Ticket TT-2847 created and routed to Ops Team.
      </div>`);
  }, 1500);
};

/* ============================================================
   RF ENGINEER CHATBOT — grounded reasoning engine + chat UI
   Mirrors the docs/ (V1) RF Engineer Chatbot (agent.js + chat.js):
   intent-matching "agent" that streams a step trace, then text +
   rich embeds (issue lists, alarms, KPI tables, map) + citations
   + follow-ups — grounded entirely in RF_ISSUES / DATA above.
   ============================================================ */
const RF_CHAT_SUGGESTIONS = [
  { icon: '🚨', text: 'Which sites are underperforming right now?' },
  { icon: '🔍', text: 'Why is SEA-BELL-047 degraded?' },
  { icon: '📶', text: 'Summarize the open alarms on the network' },
  { icon: '📊', text: 'What changed in the network in the last 24 hours?' },
  { icon: '💰', text: 'Which fix has the highest business impact?' },
];

function rfEsc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

function rfFindIssue(q) {
  const ql = (q || '').toLowerCase();
  return RF_ISSUES.find(i => ql.includes(i.site.toLowerCase()))
    || RF_ISSUES.find(i => ql.includes(i.id.toLowerCase()))
    || RF_ISSUES.find(i => ql.includes(i.zone.toLowerCase().split(' ')[0]))
    || RF_ISSUES.find(i => ql.includes(i.type.toLowerCase().split(' ')[0]))
    || null;
}

function rfCite(label, icon) { return { label, icon: icon || '🗄️' }; }

function rfIssueListEmbed(issues, title) {
  const rows = issues.map(i => {
    const col = i.sev === 'critical' ? '#EF4444' : '#F97316';
    return `<div class="rfchat-row" onclick="navigate('rfagent');rfOpenIssue('${i.id}')">
      <span class="rfchat-dot" style="background:${col}"></span>
      <span class="rfchat-nm">${i.site}<span class="rfchat-sub"> · ${i.zone} · ${i.type}</span></span>
      <span class="rfchat-val" style="color:${col}">${i.actionability}%</span>
    </div>`;
  }).join('');
  return `<div class="rfchat-embed"><div class="rfchat-embed-head">📡 ${rfEsc(title)}</div>${rows}</div>`;
}

function rfAlarmListEmbed(alarms, title) {
  const rows = alarms.map(a => `<div class="rfchat-row">
    <span class="rfchat-dot" style="background:${a.sev === 'crit' ? '#EF4444' : a.sev === 'warn' ? '#F97316' : '#6B7FA3'}"></span>
    <span class="rfchat-nm">${rfEsc(a.type)}<span class="rfchat-sub"> · ${a.site} · ${a.sector}</span></span>
    <span class="rfchat-val rfchat-sub">${a.ts}</span>
  </div>`).join('');
  return `<div class="rfchat-embed"><div class="rfchat-embed-head">${ICONS.alert} ${rfEsc(title)}</div>${rows}</div>`;
}

function rfKpiTableEmbed(issue) {
  const rows = issue.kpis.map(k => `<tr><td>${rfEsc(k.l)}</td><td style="font-family:'IBM Plex Mono',monospace;color:${k.bad ? '#EF4444' : '#22C55E'};font-weight:600">${k.v}</td><td class="rfchat-sub">${k.bad ? '<' : '>'} ${k.thr}</td></tr>`).join('');
  return `<div class="rfchat-embed"><div class="rfchat-embed-head">📊 Key KPIs · ${issue.site}</div>
    <table class="rfchat-table"><thead><tr><th>KPI</th><th>Now</th><th>Threshold</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ---------- intent handlers ---------- */
function rfHandleHelp() {
  return {
    steps: [{ label: 'Loading capabilities', detail: 'reactive + diagnostic' }],
    segments: [
      { type: 'text', text: `I'm the **RF Engineer Agent** — I monitor your LTE/5G network across Greater Seattle so you spend less time diagnosing and more time fixing. I'm grounded in **${RF_ISSUES.length} open issues**, **${DATA.alarms.length} alarms**, and live KPI telemetry.\n\nI can:` },
      { type: 'embed', html: `<div class="rfchat-embed"><div class="rfchat-embed-head">🧠 What I can do</div>${[
        'Find & rank underperforming sites by actionability',
        'Diagnose a KPI dip by correlating alarms + root cause',
        'Summarize open alarms for any site or the whole cluster',
        'Tell you what changed in the network in the last 24 hours',
        'Rank open issues by business impact so you approve the right fix first',
      ].map(t => `<div class="rfchat-row" style="cursor:default"><span class="rfchat-dot" style="background:#22C55E"></span><span class="rfchat-nm">${t}</span></div>`).join('')}</div>` },
      { type: 'text', text: `Try one of the suggestions below, or name a site like \`SEA-BELL-047\`.` },
    ],
    citations: [rfCite('Grounded on synthetic dataset', '🧪')],
    followups: RF_CHAT_SUGGESTIONS.slice(0, 3).map(s => s.text),
  };
}

function rfHandleUnderperforming() {
  const ranked = RF_ISSUES.slice().sort((a, b) => a.actionability - b.actionability);
  const crit = ranked.filter(i => i.sev === 'critical');
  const worst = ranked[0];
  return {
    steps: [
      { label: 'Parsing request', detail: 'intent: rank underperforming sites' },
      { label: 'Querying issue tracker', detail: `${RF_ISSUES.length} open issues` },
      { label: 'Scoring actionability', detail: 'confidence × business impact × urgency' },
      { label: 'Ranking results', detail: `${crit.length} critical` },
    ],
    segments: [
      { type: 'text', text: `I scanned all open issues across Greater Seattle. **${RF_ISSUES.length}** sites need attention — **${crit.length} critical** and **${ranked.length - crit.length} warning**. Ranked by actionability score:\n` },
      { type: 'embed', html: rfIssueListEmbed(ranked, 'Open issues — ranked by actionability') },
      { type: 'text', text: `\nMost urgent is **${worst.site}** (${worst.zone}) — **${worst.type}**, actionability **${worst.actionability}%**, **${worst.impact.subs}** subscribers affected. Want the root-cause breakdown?` },
    ],
    citations: [rfCite(RF_ISSUES.length + ' open issues', '📡'), rfCite(DATA.alarms.length + ' active alarms', '🚨')],
    followups: [`Why is ${worst.site} degraded?`, `Summarize alarms on ${worst.site}`, 'What changed in the last 24 hours?'],
  };
}

function rfHandleDiagnose(site) {
  const target = site || RF_ISSUES.find(i => i.sev === 'critical') || RF_ISSUES[0];
  return {
    steps: [
      { label: 'Parsing request', detail: `intent: diagnose · ${target.site}` },
      { label: 'Pulling KPI snapshot', detail: target.kpis.slice(0, 3).map(k => k.l).join(' · ') },
      { label: 'Correlating alarms & config', detail: target.type },
      { label: 'Forming diagnosis', detail: target.rca.cause },
    ],
    segments: [
      { type: 'text', text: `**${target.site}** (${target.zone}) — ${target.summary}\n` },
      { type: 'embed', html: rfKpiTableEmbed(target) },
      { type: 'text', text: `\n**Root cause (${target.rca.conf} confidence):** ${target.rca.cause}. ${target.rca.detail.replace(/\n/g, ' → ')}\n\n**Recommended fix:** ${target.fix}` },
      { type: 'map', issue: target },
      { type: 'text', text: `\nBusiness impact: **${target.impact.biz}** ARR/month at risk across **${target.impact.subs}** subscribers, est. recovery **${target.impact.recovery}** after approval. **${target.ticket}** is staged and awaiting Ops approval.` },
    ],
    citations: [rfCite('KPI store · ' + target.site, '📊'), rfCite('RCA engine · ' + target.rca.conf, '🧠'), rfCite('Ticketing · ' + target.ticket, '🎫')],
    followups: [`Open the fix workflow for ${target.site}`, `Summarize alarms on ${target.site}`, 'Which other sites are underperforming?'],
  };
}

function rfHandleAlarms() {
  const crit = DATA.alarms.filter(a => a.sev === 'crit');
  return {
    steps: [
      { label: 'Parsing request', detail: 'summarize active alarms' },
      { label: 'Querying fault management', detail: `${DATA.alarms.length} active` },
      { label: 'Filtering critical', detail: `${crit.length} critical` },
    ],
    segments: [
      { type: 'text', text: `There are **${DATA.alarms.length} active alarms** network-wide — **${crit.length} critical**. Here they are, newest first:\n` },
      { type: 'embed', html: rfAlarmListEmbed(DATA.alarms, 'Active alarms') },
      { type: 'text', text: `\nMost critical alarms are **EN-DC desync** and **high DCR** — RF/mobility issues that already have fixes staged. Want the ranked issue list instead?` },
    ],
    citations: [rfCite('Fault mgmt · ' + DATA.alarms.length + ' alarms', '🚨')],
    followups: ['Which sites are underperforming right now?', `Why is ${DATA.alarms[0].site} degraded?`],
  };
}

function rfHandleChanged() {
  const thrpt = DATA.kpis.find(k => k.id === 'thpt');
  const dcr = DATA.kpis.find(k => k.id === 'dcr');
  const top = RF_ISSUES[0];
  return {
    steps: [
      { label: 'Parsing request', detail: 'intent: 24h delta' },
      { label: 'Diffing KPIs vs 24h ago', detail: 'network rollups' },
      { label: 'Summarizing', detail: `${RF_ISSUES.length} open issues` },
    ],
    segments: [
      { type: 'text', text: `In the **last 24 hours** across the cluster:` },
      { type: 'embed', html: `<div class="rfchat-embed"><div class="rfchat-embed-head">🕐 24-hour change summary</div>
        <table class="rfchat-table"><tbody>
        <tr><td>Avg throughput</td><td style="font-family:'IBM Plex Mono',monospace;font-weight:600;color:${thrpt.dir === 'bad' ? '#EF4444' : '#22C55E'}">${thrpt.delta} ${thrpt.unit}</td></tr>
        <tr><td>Drop call rate</td><td style="font-family:'IBM Plex Mono',monospace;font-weight:600;color:${dcr.dir === 'bad' ? '#EF4444' : '#22C55E'}">${dcr.delta}${dcr.unit}</td></tr>
        <tr><td>Open issues</td><td style="font-family:'IBM Plex Mono',monospace;font-weight:600">${RF_ISSUES.length}</td></tr>
        <tr><td>Critical issues</td><td style="font-family:'IBM Plex Mono',monospace;font-weight:600">${RF_ISSUES.filter(i => i.sev === 'critical').length}</td></tr>
        </tbody></table></div>` },
      { type: 'text', text: `\nThe biggest mover is **${top.site}** — ${top.type}, detected ${top.detected}. I'd prioritise that one first.` },
    ],
    citations: [rfCite('KPI store · 24h diff', '📊'), rfCite('Fault mgmt', '🚨')],
    followups: [`Why is ${top.site} degraded?`, 'Which sites are underperforming right now?'],
  };
}

function rfHandleImpact() {
  const ranked = RF_ISSUES.slice().sort((a, b) => parseFloat(b.impact.biz.replace(/[^0-9.]/g, '')) - parseFloat(a.impact.biz.replace(/[^0-9.]/g, '')));
  const top = ranked[0];
  const rows = ranked.map(i => `<div class="rfchat-row" onclick="navigate('rfagent');rfOpenIssue('${i.id}')">
    <span class="rfchat-dot" style="background:${i.sev === 'critical' ? '#EF4444' : '#F97316'}"></span>
    <span class="rfchat-nm">${i.site}<span class="rfchat-sub"> · ${i.type}</span></span>
    <span class="rfchat-val" style="color:#EF4444">${i.impact.biz}/mo</span>
  </div>`).join('');
  return {
    steps: [
      { label: 'Parsing request', detail: 'intent: rank by business impact' },
      { label: 'Reading impact model', detail: 'ARR at risk × subscribers × recovery time' },
    ],
    segments: [
      { type: 'text', text: `Ranking the ${RF_ISSUES.length} open issues by **ARR at risk**:\n` },
      { type: 'embed', html: `<div class="rfchat-embed"><div class="rfchat-embed-head">💰 Business impact — ranked</div>${rows}</div>` },
      { type: 'text', text: `\n**${top.site}** has the highest exposure — **${top.impact.biz}/month** ARR at risk across ${top.impact.subs} subscribers, and the fix is already staged (${top.ticket}). Approving it has the best ROI right now.` },
    ],
    citations: [rfCite('Impact model', '💰'), rfCite('Ticketing', '🎫')],
    followups: [`Why is ${top.site} degraded?`, 'Which sites are underperforming right now?'],
  };
}

function rfHandleSite(issue) {
  return {
    steps: [{ label: 'Parsing request', detail: `status · ${issue.site}` }, { label: 'Loading issue profile' }],
    segments: [
      { type: 'text', text: `**${issue.site}** — ${issue.zone}. Status: **${issue.status.replace('-', ' ')}**, severity **${issue.sev}**, actionability **${issue.actionability}%**.\n` },
      { type: 'embed', html: rfKpiTableEmbed(issue) },
      { type: 'text', text: `\n${issue.summary} Ask me *"why is ${issue.site} degraded?"* for the full root-cause correlation.` },
    ],
    citations: [rfCite('Issue tracker · ' + issue.site, '📡')],
    followups: [`Why is ${issue.site} degraded?`, 'Which sites are underperforming right now?'],
  };
}

function rfHandleFallback(q) {
  const issue = rfFindIssue(q);
  if (issue) return rfHandleSite(issue);
  return {
    steps: [{ label: 'Parsing request', detail: 'no exact intent match' }, { label: 'Searching grounded data', detail: `${RF_ISSUES.length} issues` }],
    segments: [
      { type: 'text', text: `I want to keep every answer grounded in your network data, and I couldn't map that to a specific issue or KPI with confidence. Here's what I can help with right now — pick one and I'll dig in:` },
      { type: 'embed', html: `<div class="rfchat-embed"><div class="rfchat-embed-head">✨ Suggested questions</div>${RF_CHAT_SUGGESTIONS.map(s => `<div class="rfchat-row" onclick="window.__rfChatAsk && window.__rfChatAsk('${s.text.replace(/'/g, "\\'")}')"><span class="rfchat-dot" style="background:#0891B2"></span><span class="rfchat-nm">${rfEsc(s.text)}</span></div>`).join('')}</div>` },
    ],
    citations: [rfCite('Scope: reactive + diagnostic', 'ℹ️')],
    followups: [],
  };
}

/* ---------- router ---------- */
function rfAgentRespond(query) {
  const q = (query || '').trim();
  const ql = q.toLowerCase();
  const issue = rfFindIssue(q);
  if (/^(hi|hello|hey|help|what can you|who are you|capabilities)/.test(ql) || ql === 'help') return rfHandleHelp();
  if (/(underperform|worst sites|bad sites|problem sites|critical sites|need attention|degrad)/.test(ql) && !issue) return rfHandleUnderperforming();
  if (/(business impact|revenue|arr|highest impact|roi|prioritis|prioritiz)/.test(ql)) return rfHandleImpact();
  if (/(alarm|fault)/.test(ql) && !issue) return rfHandleAlarms();
  if (/(what changed|last 24|past 24|recently|today.*change|trend)/.test(ql)) return rfHandleChanged();
  if (/(why|degrad|wrong|issue|problem|diagnos|root cause|rca)/.test(ql)) return rfHandleDiagnose(issue);
  if (issue) return rfHandleSite(issue);
  return rfHandleFallback(q);
}

/* ---------- chat rendering engine ---------- */
let rfChatBusy = false;
let rfChatMapSeq = 0;

function rfChatScrollDown(el) { el.scrollTop = el.scrollHeight; }

function rfFmtMd(s) {
  let h = rfEsc(s);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/`(.+?)`/g, '<code>$1</code>');
  h = h.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  return h;
}

function rfChatWait(ms) { return new Promise(r => setTimeout(r, ms)); }

function rfChatAddUser(scrollEl, text) {
  const div = document.createElement('div');
  div.className = 'rfchat-msg user';
  div.innerHTML = `<div class="rfchat-avatar rfchat-avatar-user">ME</div><div class="rfchat-body"><div class="rfchat-bubble">${rfEsc(text)}</div></div>`;
  scrollEl.appendChild(div); rfChatScrollDown(scrollEl);
}

function rfChatAgentShell(scrollEl) {
  const div = document.createElement('div');
  div.className = 'rfchat-msg agent';
  div.innerHTML = `<div class="rfchat-avatar rfchat-avatar-agent">📡</div><div class="rfchat-body"></div>`;
  scrollEl.appendChild(div);
  return div.querySelector('.rfchat-body');
}

function rfChatRunTrace(body, steps) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'rfchat-trace';
    wrap.innerHTML = `<div class="rfchat-trace-head"><span class="rfchat-spin"></span><span class="rfchat-trace-ttl">Working…</span></div><div class="rfchat-trace-steps"></div>`;
    body.appendChild(wrap);
    const stepsEl = wrap.querySelector('.rfchat-trace-steps');
    wrap.querySelector('.rfchat-trace-head').addEventListener('click', () => wrap.classList.toggle('collapsed'));
    let i = 0;
    function next() {
      if (i > 0) { const prev = stepsEl.children[i - 1]; if (prev) prev.classList.add('complete'); }
      if (i >= steps.length) {
        wrap.querySelector('.rfchat-spin').outerHTML = `<span class="rfchat-done">✓</span>`;
        wrap.querySelector('.rfchat-trace-ttl').textContent = 'Reasoning complete';
        setTimeout(() => { wrap.classList.add('collapsed'); resolve(); }, 220);
        return;
      }
      const s = steps[i];
      const row = document.createElement('div');
      row.className = 'rfchat-trace-step';
      row.innerHTML = `<span>${rfEsc(s.label)}</span>${s.detail ? `<span class="rfchat-trace-meta">${rfEsc(s.detail)}</span>` : ''}`;
      stepsEl.appendChild(row);
      i++;
      setTimeout(next, 220 + Math.random() * 180);
    }
    setTimeout(next, 150);
  });
}

function rfChatStreamText(container, text, scrollEl) {
  return new Promise(resolve => {
    const span = document.createElement('span');
    container.appendChild(span);
    const words = text.split(/(\s+)/);
    let i = 0, raw = '';
    function tick() {
      const n = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < n && i < words.length; k++) raw += words[i++];
      span.textContent = raw;
      rfChatScrollDown(scrollEl);
      if (i < words.length) setTimeout(tick, 12 + Math.random() * 22);
      else { span.innerHTML = rfFmtMd(raw); resolve(); }
    }
    tick();
  });
}

async function rfChatRenderSegments(bubble, segments, scrollEl) {
  for (const seg of segments) {
    if (!seg) continue;
    if (seg.type === 'text') { if (seg.text) await rfChatStreamText(bubble, seg.text, scrollEl); }
    else if (seg.type === 'embed') {
      const div = document.createElement('div'); div.innerHTML = seg.html;
      bubble.appendChild(div.firstElementChild); rfChatScrollDown(scrollEl);
      await rfChatWait(100);
    } else if (seg.type === 'map') {
      const issue = seg.issue;
      const mapId = 'rfchatmap_' + (++rfChatMapSeq) + '_' + Date.now();
      const div = document.createElement('div');
      div.innerHTML = `<div class="rfchat-embed"><div class="rfchat-embed-head">📍 ${issue.site} on the network map</div><div id="${mapId}" style="height:170px"></div></div>`;
      bubble.appendChild(div.firstElementChild); rfChatScrollDown(scrollEl);
      await rfChatWait(60);
      const col = issue.sev === 'critical' ? '#EF4444' : '#F97316';
      const m = L.map(mapId, { center: [issue.lat, issue.lng], zoom: 13, zoomControl: false, attributionControl: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(m);
      _extraMaps.push(m);
      L.circle([issue.lat, issue.lng], { radius: 350, color: col, fillColor: col, fillOpacity: 0.6, weight: 3 })
        .addTo(m).bindPopup(`<b>${issue.site}</b><br>${issue.type}`);
      setTimeout(() => m.invalidateSize(), 80);
      await rfChatWait(100);
    }
  }
}

function rfChatRenderCites(body, citations) {
  if (!citations || !citations.length) return;
  const c = document.createElement('div');
  c.className = 'rfchat-cites';
  c.innerHTML = `<span class="rfchat-sub" style="align-self:center">Sources</span>` +
    citations.map((ct, i) => `<span class="rfchat-cite">${i + 1}. ${ct.icon} ${rfEsc(ct.label)}</span>`).join('');
  body.appendChild(c);
}

function rfChatRenderFollowups(body, followups) {
  if (!followups || !followups.length) return;
  const f = document.createElement('div');
  f.className = 'rfchat-suggests';
  f.style.marginTop = '12px';
  f.innerHTML = followups.map(t => `<button class="rfchat-chip">✨ <span>${rfEsc(t)}</span></button>`).join('');
  f.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => window.__rfChatAsk(followups[i])));
  body.appendChild(f);
}

async function rfChatAsk(scrollEl, query) {
  if (rfChatBusy || !query) return;
  rfChatBusy = true;
  rfChatAddUser(scrollEl, query);
  const body = rfChatAgentShell(scrollEl);
  const ans = rfAgentRespond(query);
  await rfChatRunTrace(body, ans.steps);
  const bubble = document.createElement('div'); bubble.className = 'rfchat-bubble';
  body.appendChild(bubble);
  await rfChatRenderSegments(bubble, ans.segments, scrollEl);
  rfChatRenderCites(body, ans.citations);
  rfChatRenderFollowups(body, ans.followups);
  rfChatScrollDown(scrollEl);
  rfChatBusy = false;
}

function renderRFChat(wrap) {
  wrap.innerHTML = `
    <div class="rfchat-shell">
      <div class="rfchat-head">
        <div class="rfchat-avatar rfchat-avatar-agent" style="width:36px;height:36px;font-size:17px">📡<span class="rfchat-live"></span></div>
        <div>
          <div style="font-weight:700;font-size:14px">RF Engineer Agent</div>
          <div style="font-size:11px;color:var(--muted)">Grounded on ${RF_ISSUES.length} open issues · ${DATA.alarms.length} alarms · reactive + diagnostic</div>
        </div>
        <div style="flex:1"></div>
        <span class="pill pill-brand">● Live</span>
      </div>
      <div class="rfchat-scroll" id="rfChatScroll"></div>
      <div class="rfchat-composer">
        <input id="rfChatInput" placeholder="Ask about KPIs, alarms, underperforming sites…" autocomplete="off"/>
        <button class="btn-primary" id="rfChatSend">Send</button>
      </div>
    </div>`;

  const scroll = document.getElementById('rfChatScroll');
  scroll.innerHTML = `
    <div class="rfchat-hero">
      <div class="rfchat-orb">📡</div>
      <h2>How can I help with the network today?</h2>
      <p>I'm your Agentic AI RF Engineer. I monitor LTE/5G KPIs, alarms and tickets across Greater Seattle so you spend less time diagnosing and more time fixing.</p>
    </div>
    <div style="max-width:680px;margin:8px auto 0">
      <div class="rfchat-sub" style="padding-left:4px;margin-bottom:6px;display:block">Suggested</div>
      <div class="rfchat-suggests" id="rfChatSug"></div>
    </div>`;

  const sug = document.getElementById('rfChatSug');
  RF_CHAT_SUGGESTIONS.forEach(s => {
    const b = document.createElement('button');
    b.className = 'rfchat-chip';
    b.innerHTML = `${s.icon} <span>${rfEsc(s.text)}</span>`;
    b.addEventListener('click', () => rfChatAsk(scroll, s.text));
    sug.appendChild(b);
  });

  window.__rfChatAsk = (q) => rfChatAsk(scroll, q);

  const input = document.getElementById('rfChatInput');
  const send = document.getElementById('rfChatSend');
  function submit() {
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    rfChatAsk(scroll, v);
  }
  send.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  input.focus();
}

/* ============================================================
   VIEW: DATA LAYER  — interactive explorer (category → KPI → chart + map)
   ============================================================ */
const DL_CATS = [
  { id:'engineering', name:'Engineering', icon:'📡', color:'#06B6D4', kpis:[
    { id:'dcr',    name:'Drop Call Rate',          unit:'%',    dir:'down', base:2.4,  noise:0.8,  mapScore: z => 100-z.net,              fmt: v => v.toFixed(1)+'%'    },
    { id:'thrpt',  name:'DL Throughput',           unit:'Mbps', dir:'up',   base:187,  noise:20,   mapScore: z => z.net,                  fmt: v => Math.round(v)+' Mbps'},
    { id:'sinr',   name:'SINR',                    unit:'dB',   dir:'up',   base:14.2, noise:2,    mapScore: z => z.net,                  fmt: v => v.toFixed(1)+' dB'  },
    { id:'rsrp',   name:'RSRP',                    unit:'dBm',  dir:'up',   base:-95,  noise:5,    mapScore: z => z.net,                  fmt: v => v.toFixed(0)+' dBm' },
    { id:'latency',name:'Latency',                 unit:'ms',   dir:'down', base:22,   noise:4,    mapScore: z => 100-z.net,              fmt: v => v.toFixed(0)+' ms'  },
    { id:'rrc',    name:'RRC Setup Success',        unit:'%',    dir:'up',   base:98.2, noise:0.5,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'%'    },
    { id:'rach',   name:'RACH Success Rate',        unit:'%',    dir:'up',   base:98.6, noise:0.4,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'%'    },
    { id:'erab',   name:'E-RAB Setup Success',      unit:'%',    dir:'up',   base:99.1, noise:0.3,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'%'    },
    { id:'callsr', name:'Call Setup Success',        unit:'%',    dir:'up',   base:98.8, noise:0.4,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'%'    },
    { id:'reg5g',  name:'5G Registration Success',  unit:'%',    dir:'up',   base:98.4, noise:0.5,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'%'    },
    { id:'hosr',   name:'Handover Success',          unit:'%',    dir:'up',   base:96.5, noise:1,    mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'%'    },
    { id:'rlf',    name:'Radio Link Failure Rate',   unit:'%',    dir:'down', base:0.8,  noise:0.3,  mapScore: z => 100-z.net,              fmt: v => v.toFixed(2)+'%'    },
    { id:'afr',    name:'Access Failure Rate',       unit:'%',    dir:'down', base:1.2,  noise:0.4,  mapScore: z => 100-z.net,              fmt: v => v.toFixed(1)+'%'    },
    { id:'alarms', name:'Active Alarms',             unit:'',     dir:'down', base:18,   noise:5,    mapScore: z => 100-z.net,              fmt: v => Math.round(v)+''    },
    { id:'tickets',name:'Open Trouble Tickets',      unit:'/day', dir:'down', base:142,  noise:15,   mapScore: z => (z.churn/10)*100,       fmt: v => Math.round(v)+'/d'  },
  ]},
  { id:'marketing', name:'Marketing', icon:'📊', color:'#8B5CF6', kpis:[
    { id:'ms',     name:'Market Share',           unit:'%',    dir:'up',   base:38.4, noise:1.5,  mapScore: z => (z.ms/75)*100,          fmt: v => v.toFixed(1)+'%'    },
    { id:'churn',  name:'Churn Rate',             unit:'%',    dir:'down', base:4.1,  noise:0.4,  mapScore: z => 100-(z.churn/10)*100,   fmt: v => v.toFixed(1)+'%'    },
    { id:'arpu',   name:'ARPU',                   unit:'$',    dir:'up',   base:84,   noise:4,    mapScore: z => (z.arpu/115)*100,       fmt: v => '$'+v.toFixed(0)    },
    { id:'nps',      name:'NPS',                       unit:'',     dir:'up',   base:34,   noise:3,    mapScore: z => (z.ms/75)*100,          fmt: v => ''+Math.round(v)       },
    { id:'netadd',   name:'Net Adds',                  unit:'k',    dir:'up',   base:12,   noise:2,    mapScore: z => (z.ms/75)*100,          fmt: v => v.toFixed(1)+'k'       },
    { id:'ret_store',name:'Retail Store Performance',  unit:'/100', dir:'up',   base:71,   noise:8,    mapScore: z => (z.ms/75)*100,          fmt: v => Math.round(v)+'/100'   },
  ]},
  { id:'customer', name:'Customer Care', icon:'💬', color:'#F97316', kpis:[
    { id:'csat',   name:'CSAT Score',             unit:'/5',   dir:'up',   base:3.6,  noise:0.2,  mapScore: z => 100-(z.churn/10)*100,   fmt: v => v.toFixed(1)+'/5'   },
    { id:'tktvol', name:'Ticket Volume',          unit:'/day', dir:'down', base:142,  noise:15,   mapScore: z => (z.churn/10)*100,       fmt: v => Math.round(v)+'/d'  },
    { id:'fcr',    name:'First Call Resolution',  unit:'%',    dir:'up',   base:71,   noise:3,    mapScore: z => 100-(z.churn/10)*80,    fmt: v => v.toFixed(0)+'%'    },
    { id:'sent',   name:'Sentiment Score',        unit:'%',    dir:'up',   base:62,   noise:5,    mapScore: z => 100-(z.churn/10)*90,    fmt: v => v.toFixed(0)+'%'    },
    { id:'complaints',name:'Complaints',          unit:'/day', dir:'down', base:110,  noise:12,   mapScore: z => (z.churn/10)*100,       fmt: v => Math.round(v)+'/d'  },
  ]},
  { id:'thirdparty', name:'3rd Party', icon:'🌐', color:'#22C55E', kpis:[
    { id:'ookla',  name:'Ookla DL Speed',         unit:'Mbps', dir:'up',   base:182,  noise:18,   mapScore: z => z.net,                  fmt: v => Math.round(v)+' Mbps'},
    { id:'osig',   name:'OpenSignal Score',        unit:'/10',  dir:'up',   base:6.8,  noise:0.5,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'/10'  },
    { id:'rmtrc',  name:'RootMetrics Score',       unit:'/5',   dir:'up',   base:3.8,  noise:0.3,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'/5'   },
    { id:'crowd',     name:'Crowdsource Coverage',        unit:'%',    dir:'up',   base:88,   noise:3,    mapScore: z => z.net,                  fmt: v => v.toFixed(0)+'%'     },
    { id:'starlink',  name:'Starlink (Inhouse)',           unit:'%',    dir:'up',   base:79,   noise:5,    mapScore: z => z.net,                  fmt: v => v.toFixed(0)+'%'     },
    { id:'ecolocate', name:'Ecolocate Indoor Quality',     unit:'/10',  dir:'up',   base:6.2,  noise:0.7,  mapScore: z => z.net,                  fmt: v => v.toFixed(1)+'/10'   },
  ]},
  { id:'gis', name:'GIS / Geospatial', icon:'🗺️', color:'#3B82F6', kpis:[
    { id:'2d',     name:'2D Site Coverage',        unit:'%',    dir:'up',   base:91,   noise:2,    mapScore: z => z.net,                  fmt: v => v.toFixed(0)+'%'    },
    { id:'popdns', name:'Population Density',      unit:'k/mi²',dir:'up',  base:4.2,  noise:1,    mapScore: z => (z.ms/75)*100,          fmt: v => v.toFixed(1)+'k'    },
    { id:'fibercov',name:'Fiber Route Coverage',   unit:'%',    dir:'up',   base:64,   noise:5,    mapScore: z => z.net,                  fmt: v => v.toFixed(0)+'%'    },
  ]},
  { id:'planning', name:'Planning & Field', icon:'🏗️', color:'#EAB308', kpis:[
    { id:'paramcomp',  name:'Parameter Compliance',    unit:'%',    dir:'up',  base:74,  noise:4,  mapScore: z => z.net,                  fmt: v => v.toFixed(0)+'%'     },
    { id:'coveragesim',name:'Coverage Sim Score',      unit:'/100', dir:'up',  base:82,  noise:5,  mapScore: z => z.net,                  fmt: v => Math.round(v)+'/100' },
    { id:'siteutl',    name:'Site Utilisation',        unit:'%',    dir:'up',  base:68,  noise:6,  mapScore: z => z.net,                  fmt: v => v.toFixed(0)+'%'     },
    { id:'drivetest',  name:'Drive Test Score',        unit:'/100', dir:'up',  base:76,  noise:8,  mapScore: z => z.net,                  fmt: v => Math.round(v)+'/100' },
    { id:'walktest',   name:'Walk Test (Indoor)',       unit:'/100', dir:'up',  base:68,  noise:9,  mapScore: z => z.net,                  fmt: v => Math.round(v)+'/100' },
    { id:'benchmark',  name:'Benchmark vs Competitor', unit:'pts',  dir:'up',  base:4,   noise:6,  mapScore: z => (z.ms/75)*100,          fmt: v => (v>=0?'+':'')+Math.round(v)+' pts'},
  ]},
  { id:'sales', name:'Sales', icon:'💼', color:'#F59E0B', kpis:[
    { id:'store_rev',  name:'Retail Store Revenue',    unit:'$k/mo', dir:'up', base:182, noise:22, mapScore: z => (z.ms/75)*100,          fmt: v => '$'+Math.round(v)+'k'  },
    { id:'b2b_pipe',   name:'B2B Pipeline',            unit:'$M',    dir:'up', base:2.4, noise:0.4,mapScore: z => (z.ms/75)*100,          fmt: v => '$'+v.toFixed(1)+'M'   },
    { id:'ret_conv',   name:'Retail Conversion Rate',  unit:'%',     dir:'up', base:18,  noise:3,  mapScore: z => (z.ms/75)*100,          fmt: v => v.toFixed(0)+'%'       },
    { id:'b2b_win',    name:'B2B Win Rate',            unit:'%',     dir:'up', base:31,  noise:4,  mapScore: z => (z.ms/75)*100,          fmt: v => v.toFixed(0)+'%'       },
    { id:'store_foot', name:'Store Footfall',          unit:'k/mo',  dir:'up', base:14,  noise:3,  mapScore: z => (z.ms/75)*100,          fmt: v => v.toFixed(1)+'k'       },
  ]},
];

let dlViewState = { cat: 'engineering', kpiId: 'dcr', chart: null };
let dlViewMode = 'explore';

function renderParamAuditCard() {
  const nc = PARAM_AUDIT_SUMMARY.nonCompliant;
  return `
    <div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border)">
        <span style="font-size:10px;font-weight:600;letter-spacing:.5px;color:var(--muted);text-transform:uppercase">⊙ Parameter audit vs golden set</span>
        <div style="margin-left:auto">
          <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;background:${nc ? 'var(--red-dim)' : 'var(--green-dim)'};color:${nc ? 'var(--red)' : 'var(--green)'}">
            <span style="width:5px;height:5px;border-radius:50%;background:${nc ? 'var(--red)' : 'var(--green)'}"></span>
            ${nc}/${PARAM_AUDIT_SUMMARY.total} non-compliant
          </span>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:var(--surface2)">
              <th style="padding:7px 14px;text-align:left;font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.4px;text-transform:uppercase;border-bottom:1px solid var(--border)">Parameter</th>
              <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.4px;text-transform:uppercase;border-bottom:1px solid var(--border)">Golden</th>
              <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.4px;text-transform:uppercase;border-bottom:1px solid var(--border)">Actual</th>
              <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.4px;text-transform:uppercase;border-bottom:1px solid var(--border)">Scope</th>
              <th style="padding:7px 14px;text-align:center;font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.4px;text-transform:uppercase;border-bottom:1px solid var(--border)">Status</th>
            </tr>
          </thead>
          <tbody>
            ${PARAM_AUDIT.map(p => `
              <tr style="border-top:1px solid var(--border);${!p.compliant ? 'background:rgba(220,38,38,0.04)' : ''}">
                <td style="padding:8px 14px">
                  <div style="font-size:12px;font-weight:600;color:var(--text)">${p.param}</div>
                  <div style="font-size:11px;color:var(--muted);margin-top:2px">${p.impact}${p.reason ? ' · ' + p.reason : ''}</div>
                </td>
                <td style="padding:8px 10px;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--muted2)">${p.golden}</td>
                <td style="padding:8px 10px;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:12px;${!p.compliant ? 'color:var(--red);font-weight:700' : 'color:var(--text)'}">${p.actual}</td>
                <td style="padding:8px 10px;font-size:11px;color:var(--muted)">${p.scope}</td>
                <td style="padding:8px 14px;text-align:center">
                  ${p.compliant
                    ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;background:var(--green-dim);color:var(--green)"><span style="width:5px;height:5px;border-radius:50%;background:var(--green)"></span>OK</span>`
                    : `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;background:var(--red-dim);color:var(--red)"><span style="width:5px;height:5px;border-radius:50%;background:var(--red)"></span>Flag</span>`}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="padding:10px 14px;border-top:1px solid var(--border);background:var(--surface2)">
        <span style="font-size:11px;color:var(--muted2)">Non-compliant parameters are checked against the operator's standard/"golden" set and tied to the KPI impact they cause (e.g. handover or coverage → drop calls). <a href="#" onclick="return false" style="color:var(--brand);font-weight:600">Feeds the drop-call RCA →</a></span>
      </div>
    </div>`;
}

function _dlAllKpis() {
  const flat = {}; DL_CATS.forEach(c => c.kpis.forEach(k => { flat[k.id] = k; })); return flat;
}

function renderDataLayer(wrap) {
  if (dlViewState.chart) { try { dlViewState.chart.destroy(); } catch(e) {} dlViewState.chart = null; }
  _destroyExtraMaps();

  const cat = DL_CATS.find(c => c.id === dlViewState.cat) || DL_CATS[0];
  const kpi = cat.kpis.find(k => k.id === dlViewState.kpiId) || cat.kpis[0];
  dlViewState.cat = cat.id; dlViewState.kpiId = kpi.id;

  // After rendering the full template, replace right panel for correlate mode
  const series = genSeries(kpi.base, 24, kpi.noise);
  const cur = series[series.length - 1];
  const prev = series[0];
  const rawDelta = ((cur - prev) / (Math.abs(prev) || 1) * 100);
  const deltaAbs = Math.abs(rawDelta).toFixed(1);
  const deltaGood = kpi.dir === 'up' ? rawDelta > 0 : rawDelta < 0;
  const deltaArrow = rawDelta >= 0 ? '↑' : '↓';
  const deltaColor = deltaGood ? 'var(--green)' : 'var(--red)';

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00');

  wrap.innerHTML = `
    <!-- Header matching V1 style -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="display:flex;align-items:center;gap:10px">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2" style="width:22px;height:22px;flex-shrink:0"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          <span style="font-size:20px;font-weight:700">Data Layer</span>
          <span class="pill pill-brand" style="font-size:10px">● Synthetic</span>
        </div>
        <div style="font-size:12px;color:var(--muted2);margin-top:4px;margin-left:32px">Single pane of glass across every telecom data category — explore, threshold, and correlate.</div>
      </div>
      <div style="display:flex;gap:4px">
        <button class="map-ctrl-btn dl-tab-btn ${dlViewMode === 'explore' ? 'active' : ''}" data-mode="explore" style="font-size:12px;padding:6px 14px" onclick="dlSwitchMode('explore')">Explore &amp; alert</button>
        <button class="map-ctrl-btn dl-tab-btn ${dlViewMode === 'correlate' ? 'active' : ''}" data-mode="correlate" style="font-size:12px;padding:6px 14px" onclick="dlSwitchMode('correlate')">Correlate · RCA engine</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:200px 1fr;gap:14px;align-items:start">

      <!-- LEFT: category list only (with count badges) -->
      <div class="card" style="padding:8px">
        <div class="card-title" style="margin-bottom:8px;padding-left:4px">Categories</div>
        ${DL_CATS.map(c => `
          <button onclick="dlPickCat('${c.id}')"
            style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:6px;border:none;background:${c.id === cat.id ? 'rgba(0,198,224,0.1)' : 'transparent'};color:${c.id === cat.id ? 'var(--brand)' : 'var(--text)'};font-size:12.5px;font-weight:${c.id === cat.id ? '600' : '400'};cursor:pointer;margin-bottom:2px;text-align:left;transition:all .15s">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:15px;line-height:1">${c.icon}</span>
              <span>${c.name}</span>
            </div>
            <span style="font-size:10px;background:var(--surface2);color:var(--muted);border-radius:4px;padding:2px 6px">${c.kpis.length}</span>
          </button>`).join('')}
      </div>

      <!-- RIGHT: KPI chips + chart card + map card -->
      <div id="dlRightPanel" style="display:flex;flex-direction:column;gap:14px">

        <!-- KPI chip bar -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          ${cat.kpis.map(k => `
            <button onclick="dlPickKpi('${k.id}')"
              style="padding:5px 13px;border-radius:100px;border:1px solid ${k.id === kpi.id ? 'var(--brand)' : 'var(--border2)'};background:${k.id === kpi.id ? 'rgba(0,198,224,0.12)' : 'transparent'};color:${k.id === kpi.id ? 'var(--brand)' : 'var(--text)'};font-size:12px;font-weight:${k.id === kpi.id ? '600' : '400'};cursor:pointer;transition:all .15s;white-space:nowrap">
              ${k.name}
            </button>`).join('')}
        </div>

        <!-- Trend chart card -->
        <div class="card">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="background:rgba(0,198,224,0.15);color:var(--brand);font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px">${cat.name}</span>
              <span style="font-size:14px;font-weight:600;color:var(--text)">${kpi.name}</span>
            </div>
            <div style="text-align:right;line-height:1">
              <div style="font-size:28px;font-weight:700">${kpi.fmt(cur)}</div>
              <div style="font-size:12px;font-weight:500;color:${deltaColor};margin-top:3px">${deltaArrow} ${deltaAbs}% <span style="color:var(--muted)">24h</span></div>
            </div>
          </div>
          <div style="position:relative;height:160px;width:100%"><canvas id="dlTrendChart"></canvas></div>
          <!-- Threshold row -->
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:11px;color:var(--muted);white-space:nowrap">🔔 Threshold alert</span>
            <input type="range" id="dlThreshSlider" style="flex:1;min-width:80px;accent-color:#3B82F6;cursor:pointer"/>
            <span class="mono" id="dlThreshVal" style="font-size:12px;font-weight:600;color:var(--text);min-width:64px;text-align:right"></span>
            <span id="dlBreachBadge"></span>
            <button id="dlRouteBtn" onclick="dlShowRouting()"
              style="display:none;background:transparent;border:none;color:var(--brand);font-size:12px;cursor:pointer;white-space:nowrap;padding:0 4px">→ Route alert</button>
          </div>
        </div>

        <!-- GIS Map card -->
        <div class="card" style="padding:0;overflow:hidden">
          <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border);flex-wrap:wrap">
            <span style="font-size:15px">🗺️</span>
            <span style="font-size:13px;font-weight:600">GIS — ${kpi.name}</span>
            <span style="font-size:11px;color:var(--muted)">sites ranked by this KPI · severity-coded</span>
            <div style="margin-left:auto;display:flex;gap:12px;font-size:11px;color:var(--muted)">
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22C55E;margin-right:3px;vertical-align:middle"></span>Good</span>
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#F97316;margin-right:3px;vertical-align:middle"></span>Degraded</span>
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#EF4444;margin-right:3px;vertical-align:middle"></span>Critical</span>
            </div>
          </div>
          <div id="dlKpiMap" style="height:300px"></div>
        </div>

        <!-- Alert routing panel -->
        <div id="dlRoutingPanel" style="display:none"></div>

        ${cat.id === 'engineering' ? renderParamAuditCard() : ''}

        <div style="background:rgba(8,145,178,0.06);border:1px solid rgba(8,145,178,0.2);border-radius:var(--radius);padding:12px 14px">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span class="pill pill-brand" style="font-size:10px">● Diagnostic</span>
            <span style="font-size:12px;color:var(--muted2)">Want the <b style="color:var(--text)">why</b>? Correlate this with another category in the <a href="#" onclick="return false" style="color:var(--brand);font-weight:600">RCA engine →</a>${cat.id === 'engineering' ? ` or open the <a href="#" onclick="navigate('rfagent'); return false" style="color:var(--brand);font-weight:600">guided drop-call RCA →</a>` : ''}</span>
          </div>
        </div>

      </div>
    </div>
  `;

  // Correlate mode: replace right panel and skip chart/map init entirely
  if (dlViewMode === 'correlate') {
    const rp = document.getElementById('dlRightPanel');
    if (rp) rp.innerHTML = _renderDLCorrelateHTML();
    return;
  }

  // Draw trend chart with threshold line as second dataset
  const vals = series;
  const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.2 || Math.abs(kpi.base) * 0.05 || 1;
  let thresh = kpi.dir === 'down'
    ? lo + (hi - lo) * 0.65
    : lo + (hi - lo) * 0.35;

  const threshData = series.map(() => thresh);

  dlViewState.chart = new Chart(document.getElementById('dlTrendChart'), {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          data: series,
          borderColor: cat.color,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          backgroundColor: cat.color + '15',
          tension: 0.4,
          order: 2
        },
        {
          data: threshData,
          borderColor: '#EF4444',
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false,
          tension: 0,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: {
          label: ctx => ctx.datasetIndex === 0 ? kpi.fmt(ctx.parsed.y) : 'Threshold: ' + kpi.fmt(ctx.parsed.y)
        }
      }},
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#64748B', font: { size: 9 }, maxTicksLimit: 8 } },
        y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#64748B', font: { size: 9 } } }
      }
    }
  });

  // Threshold slider wiring
  const slider = document.getElementById('dlThreshSlider');
  slider.min = (lo - pad).toFixed(4); slider.max = (hi + pad).toFixed(4);
  slider.step = ((hi - lo) / 200 || 0.001).toFixed(6);
  slider.value = thresh;

  function paintThresh() {
    thresh = +slider.value;
    // Update the threshold line dataset in-place
    dlViewState.chart.data.datasets[1].data = series.map(() => thresh);
    dlViewState.chart.update('none');
    document.getElementById('dlThreshVal').textContent = kpi.fmt(+thresh.toFixed(4));
    const breaches = vals.filter(v => kpi.dir === 'down' ? v >= thresh : v <= thresh).length;
    const routeBtn = document.getElementById('dlRouteBtn');
    const badge = document.getElementById('dlBreachBadge');
    if (breaches) {
      badge.innerHTML = `<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.15);color:#EF4444;border-radius:100px;padding:3px 9px;font-size:11px;font-weight:600"><span style="width:6px;height:6px;border-radius:50%;background:#EF4444;display:inline-block"></span>${breaches} breach${breaches > 1 ? 'es' : ''} → alert</span>`;
      routeBtn.style.display = '';
    } else {
      badge.innerHTML = `<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(34,197,94,0.12);color:var(--green);border-radius:100px;padding:3px 9px;font-size:11px;font-weight:600">✓ Within threshold</span>`;
      routeBtn.style.display = 'none';
    }
  }
  slider.addEventListener('input', paintThresh);
  paintThresh();

  // GIS map
  _initDLKpiMap(kpi);
}

/* Seeded RNG + stable per-site positions (same as V1 map.js approach) */
function _seededRng(seed) {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let _dlSitesCache = null;
function _getDLSites() {
  if (_dlSitesCache) return _dlSitesCache;
  const R = _seededRng(42173);
  _dlSitesCache = [];
  DATA.zones.forEach(z => {
    for (let i = 0; i < z.sites; i++) {
      const ang = R() * Math.PI * 2;
      const rr = Math.sqrt(R()) * 0.038;
      _dlSitesCache.push({
        zoneId: z.id,
        lat: z.lat + Math.cos(ang) * rr,
        lng: z.lng + Math.sin(ang) * rr * 1.4,
        tech: R() < 0.62 ? '5G' : 'LTE',
        noise: R(),
      });
    }
  });
  return _dlSitesCache;
}

function _initDLKpiMap(kpi) {
  const HCOLOR = { ok: '#16A34A', warn: '#E0900B', crit: '#DC2626' };
  const map = L.map('dlKpiMap', { center: [47.60, -122.17], zoom: 10, zoomControl: true, attributionControl: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
  _extraMaps.push(map);

  _getDLSites().forEach(s => {
    const zone = DATA.zones.find(zn => zn.id === s.zoneId);
    if (!zone) return;
    // Normalise to a health score (0–100, higher = healthier) regardless of KPI direction.
    // "down" KPIs (DCR, AFR): low raw score = good network → invert so high health = green.
    const rawScore = kpi.mapScore(zone);
    const zoneHealth = kpi.dir === 'down' ? 100 - rawScore : rawScore;
    const siteHealth = Math.max(0, Math.min(100, zoneHealth + (s.noise - 0.5) * 30));
    const status = siteHealth >= 65 ? 'ok' : siteHealth >= 38 ? 'warn' : 'crit';
    const col = HCOLOR[status];
    const zoneVal = _zoneKpiValue(kpi, zone);
    const siteVal = zoneVal * (0.85 + s.noise * 0.3);
    const radius = status === 'crit' ? 9.5 : status === 'warn' ? 8 : 6.5;

    L.circleMarker([s.lat, s.lng], {
      radius, fillColor: col, color: '#fff', weight: 1.5, fillOpacity: 0.88,
    })
    .bindPopup(
      `<div style="min-width:170px">
         <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
           <b style="font-family:'IBM Plex Mono',monospace;color:#1E40AF;font-size:11px">${zone.name}</b>
           <span style="display:inline-flex;align-items:center;gap:3px;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:600;background:${col}22;color:${col}">${status === 'ok' ? 'Healthy' : status === 'warn' ? 'Degraded' : 'Critical'}</span>
         </div>
         <div style="font-size:12px;color:#64748B">${s.tech} · ${kpi.name}: <b style="color:${col}">${kpi.fmt(siteVal)}</b></div>
       </div>`,
      { closeButton: false }
    )
    .addTo(map);
  });

  setTimeout(() => map.invalidateSize(), 80);
}

function _zoneKpiValue(kpi, z) {
  const m = { dcr: 100-z.net, thrpt: z.net*2, sinr: z.net*0.2-4, rsrp: -70-(100-z.net)*0.5,
              latency: 14+(100-z.net)*0.18,
              rrc: 100-(100-z.net)*0.15, rach: 100-(100-z.net)*0.12, erab: 100-(100-z.net)*0.08,
              callsr: 100-(100-z.net)*0.11, reg5g: 100-(100-z.net)*0.13,
              hosr: 100-(100-z.net)*0.2, rlf: (100-z.net)*0.02, afr: (100-z.net)*0.05,
              alarms: Math.round((100-z.net)*0.4), tickets: Math.round(z.churn*25),
              ms: z.ms, churn: z.churn, arpu: z.arpu, nps: Math.round(z.ms*0.6-2), netadd: +(z.ms*0.3-4).toFixed(1),
              ret_store: Math.round(z.ms*0.9),
              csat: +(5 - z.churn*0.3).toFixed(1), tktvol: Math.round(z.churn*25), fcr: Math.round(100-z.churn*5),
              sent: Math.round(100-z.churn*8), complaints: Math.round(z.churn*20),
              ookla: Math.round(z.net*2.2), osig: +(z.net/20).toFixed(1), rmtrc: +(z.net/25).toFixed(1), crowd: Math.round(z.net*0.9),
              starlink: Math.round(z.net*0.85), ecolocate: +(z.net/16).toFixed(1),
              '2d': Math.round(z.net*0.95), popdns: +(z.net*0.06).toFixed(1), fibercov: Math.round(z.net*0.7),
              paramcomp: Math.round(z.net*0.85), coveragesim: Math.round(z.net*0.9), siteutl: Math.round(z.net*0.75),
              drivetest: Math.round(z.net*0.85), walktest: Math.round(z.net*0.78), benchmark: Math.round((z.ms-38)*0.3),
              store_rev: Math.round(z.ms*2.8), b2b_pipe: +(z.ms*0.04).toFixed(1), ret_conv: Math.round(z.ms*0.25),
              b2b_win: Math.round(z.ms*0.45), store_foot: +(z.ms*0.2).toFixed(1) };
  return m[kpi.id] !== undefined ? m[kpi.id] : kpi.base;
}

window.dlPickCat = function(catId) {
  const cat = DL_CATS.find(c => c.id === catId);
  dlViewState.cat = catId;
  dlViewState.kpiId = cat.kpis[0].id;
  if (dlViewState.chart) { try { dlViewState.chart.destroy(); } catch(e) {} dlViewState.chart = null; }
  renderDataLayer(document.getElementById('viewWrap'));
};

window.dlPickKpi = function(kpiId) {
  dlViewState.kpiId = kpiId;
  if (dlViewState.chart) { try { dlViewState.chart.destroy(); } catch(e) {} dlViewState.chart = null; }
  renderDataLayer(document.getElementById('viewWrap'));
};

window.dlShowRouting = function() {
  const panel = document.getElementById('dlRoutingPanel');
  if (!panel) return;
  panel.style.display = '';
  panel.innerHTML = `
    <div class="card">
      <div class="card-title">🔔 Route Threshold Alert</div>
      <div style="font-size:12px;color:var(--muted2);margin-bottom:12px">Choose where this alert routes when the threshold is breached:</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        ${[
          { id:'jira',  label:'JIRA',        kind:'Create ticket',       on:true  },
          { id:'email', label:'Email',        kind:'Notify on-call DL',  on:true  },
          { id:'sms',   label:'SMS',          kind:'Page duty engineer',  on:false },
          { id:'snow',  label:'ServiceNow',    kind:'Open incident',        on:false },
          { id:'slack', label:'Slack',          kind:'#noc-alerts channel',  on:false },
          { id:'sfdc',  label:'Salesforce',     kind:'Log case in CRM',      on:false },
        ].map(t => `
          <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--surface2);border-radius:6px;cursor:pointer">
            <input type="checkbox" ${t.on ? 'checked' : ''} style="accent-color:var(--brand);width:14px;height:14px"/>
            <span style="font-size:12px;font-weight:600">${t.label}</span>
            <span style="font-size:11px;color:var(--muted)">· ${t.kind}</span>
          </label>`).join('')}
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-primary" style="font-size:11px" onclick="dlSendAlert(this)">Send Alert (simulated)</button>
        <button class="btn-secondary" style="font-size:11px" onclick="document.getElementById('dlRoutingPanel').style.display='none'">Cancel</button>
      </div>
    </div>`;
};

window.dlSendAlert = function(btn) {
  btn.textContent = '✓ Alert Sent';
  btn.disabled = true;
  btn.style.background = 'var(--green)';
  setTimeout(() => { document.getElementById('dlRoutingPanel').style.display = 'none'; }, 1500);
};

/* ============================================================
   VIEW: ANALYTICS JOURNEY
   ============================================================ */
function renderAnalytics(wrap) {
  const stages = [
    { num: 1, title: 'Reactive',       icon: '📈', color: '#06B6D4', active: true,
      desc: 'Pick any KPI → trend visualization (line, bar, pie). Historical view of current state.',
      example: 'Drop Call Rate over 30 days across 8 zones' },
    { num: 2, title: 'Proactive',      icon: '🔔', color: '#3B82F6', active: true,
      desc: 'Set thresholds → alert preview. SMS, Email, or JIRA ticket integration.',
      example: 'Alert when DCR > 2.0% for 3 consecutive windows' },
    { num: 3, title: 'RCA / Diagnostic', icon: '🔍', color: '#F97316', active: true,
      desc: 'Select 2+ signals across categories → correlation result + AI explanation.',
      example: 'Market share ↓ correlates with Drop Call ↑ → network-driven churn' },
    { num: 4, title: 'Predictive',     icon: '🔮', color: '#8B5CF6', locked: false,
      desc: 'Historical data + ML to forecast churn risk, capacity strain over 14-day window.',
      example: 'Churn risk +18% in Renton if DCR not resolved' },
    { num: 5, title: 'Prescriptive',   icon: '⚡', color: '#6366F1', locked: false,
      desc: 'Open-loop (human approval) → Closed-loop (autonomous execution via NETCONF/YANG).',
      example: 'Auto-adjust beam tilt when EN-DC desync detected at confidence > 95%' },
  ];

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Analytics Journey</div>
        <div class="section-sub">Five maturity rungs — build any use-case at any level</div>
      </div>
    </div>

    <div style="display:flex;gap:10px;margin-bottom:20px;align-items:stretch">
      ${stages.map((s, i) => `
        <div style="flex:1;position:relative">
          ${i < stages.length - 1 ? `<div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:18px;z-index:1">→</div>` : ''}
          <div class="j-card ${s.active ? 'active' : ''} ${s.locked ? 'locked' : ''}" style="border-color:${s.active ? s.color + '60' : 'var(--border)'}">
            <div class="j-num" style="background:${s.active ? s.color + '22' : 'var(--surface2)'};color:${s.active ? s.color : 'var(--muted)'}">${s.icon}</div>
            <div class="j-title" style="color:${s.active ? s.color : 'var(--text)'}">${s.title}</div>
            <div class="j-desc">${s.desc}</div>
            ${!s.locked ? `<div style="font-size:10px;font-style:italic;color:var(--muted);padding:4px 6px;background:var(--surface2);border-radius:4px;margin-top:4px">"${s.example}"</div>` : ''}
            ${s.locked ? `<div style="height:20px"></div>` : ''}
          </div>
        </div>`).join('')}
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-title">🔍 RCA Correlation Engine — Live Example</div>
      <div class="grid-2" style="gap:20px">
        <div>
          <div style="font-size:12px;color:var(--muted2);margin-bottom:12px">The Orchestrator Agent correlates signals across all data categories to find root cause:</div>
          ${[
            { cat: 'Engineering', sig: 'Drop Call Rate',        val: '↑ 3.8%',     c: '#EF4444' },
            { cat: 'Engineering', sig: 'EN-DC Desync Events',   val: '↑ 47 events', c: '#EF4444' },
            { cat: 'Customer',    sig: 'IMS Timeout Complaints', val: '↑ 23 tickets', c: '#F97316' },
            { cat: 'Marketing',   sig: 'Churn Rate (Bellevue)', val: '↑ 5.2%',     c: '#F97316' },
          ].map((r, i) => `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
              <div style="width:6px;height:6px;border-radius:50%;background:${r.c}"></div>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:500">${r.sig}</div>
                <div style="font-size:10px;color:var(--muted)">${r.cat} Layer</div>
              </div>
              <div style="font-size:12px;font-weight:600;color:${r.c}">${r.val}</div>
              ${i > 0 ? `<div style="font-size:10px;color:var(--muted)">correlated</div>` : '<div style="font-size:10px;color:var(--brand)">trigger</div>'}
            </div>`).join('')}
        </div>
        <div>
          <div class="agent-insight">
            <div class="agent-insight-head">🧠 RCA Engine Output</div>
            <p><b style="color:var(--text)">Root Cause:</b> EN-DC Desync on SEA-BELL-047 Sector 2 causing VoLTE call drops.<br><br>
            <b style="color:var(--text)">Causal chain:</b> 5G mmWave beam tracking failure → LTE anchor drop spike → IMS session timeout → call drop → customer complaints → churn acceleration in Bellevue zip codes.<br><br>
            <b style="color:var(--text)">Recommended action:</b> Beam tilt optimization + X2 handover parameter adjustment. Estimated DCR recovery to &lt;2.0% within 30 min of fix.</p>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn-primary" style="flex:1;font-size:11px" onclick="navigate('rfagent')">View RF Fix Workflow →</button>
            <button class="btn-secondary" style="flex:1;font-size:11px">Set Proactive Alert</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🔔 Proactive Threshold Configuration</div>
      <div class="grid-3" style="gap:12px">
        ${[
          { kpi: 'Drop Call Rate',     thr: '> 2.0%',   action: 'JIRA + Email',      col: '#EF4444' },
          { kpi: 'Churn Rate',         thr: '> 5.0%',   action: 'SMS + Slack',       col: '#F97316' },
          { kpi: 'Market Share Drop',  thr: '> 2% MoM', action: 'Executive Report',  col: '#8B5CF6' },
        ].map(t => `
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <div style="font-size:12px;font-weight:600">${t.kpi}</div>
              <span class="pill pill-green" style="font-size:10px">Active</span>
            </div>
            <div style="font-size:13px;font-weight:700;color:${t.col};margin-bottom:4px">${t.thr}</div>
            <div style="font-size:11px;color:var(--muted)">Action: ${t.action}</div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

/* ============================================================
   VIEW: AGENT FLEET
   ============================================================ */
function renderAgents(wrap) {
  const execModes = [
    { mode:'Advisory Only',          icon:'💡', desc:'Agent surfaces insights and recommendations. No action taken. Human reads and decides.', col:'#3B82F6', locked:false },
    { mode:'Human Approval Required',icon:'✋', desc:'Agent stages a remediation blueprint and waits. Ops Manager reviews and clicks Approve to execute.', col:'#F97316', locked:false },
    { mode:'Autonomous Execution',   icon:'⚡', desc:'Agent executes approved closed-loop actions (NETCONF/YANG, gNMI) without human intervention. Vetted scenarios only.', col:'#16A34A', locked:false },
  ];

  const specialistAgents = [
    { icon:'🗄️', name:'Data Agent',           desc:'Fetches & normalises multi-vendor data from Nokia, Ericsson, Huawei OSS into canonical entity groups', col:'#06B6D4' },
    { icon:'🗺️', name:'GIS Agent',            desc:'Spatial reasoning, H3 hex indexing (R7/R8 ~0.7km²), map overlay generation, postal zone drill-down', col:'#3B82F6' },
    { icon:'🔍', name:'RCA Agent',             desc:'Root cause correlation across sensor telemetry, system logs and customer complaints', col:'#F97316' },
    { icon:'🔮', name:'Forecast Agent',        desc:'14-day ML predictive models for churn risk, capacity strain, market share trajectory', col:'#8B5CF6' },
    { icon:'💡', name:'Recommendation Agent',  desc:'Generates prioritised action plans ranked by confidence, business impact and subscriber count', col:'#EAB308' },
    { icon:'⚡', name:'Automation Agent',      desc:'Executes approved closed-loop actions via NETCONF/YANG, gNMI to physical network controllers', col:'#22C55E' },
    { icon:'🛡️', name:'Governance Agent',      desc:'Ensures human approval before execution; enforces RBAC per agent, per use-case, per geography', col:'#6366F1' },
  ];

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Agent Fleet</div>
        <div class="section-sub">4 domain agents + Orchestrator + 7 specialist core agents · Strict RBAC boundaries</div>
      </div>
      <span class="pill pill-green">All Systems Active</span>
    </div>

    <!-- Orchestrator -->
    <div class="card" style="margin-bottom:14px;border-color:rgba(59,130,246,.35);background:rgba(59,130,246,.06)">
      <div style="display:flex;align-items:flex-start;gap:16px">
        <div style="font-size:32px">🧠</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700">Orchestrator Agent</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Cross-domain decision engine · Routes tasks, synthesizes business intelligence, stages remediation blueprints</div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--brand);background:var(--surface2);border:1px solid rgba(0,198,224,.15);border-radius:6px;padding:10px;line-height:2">
            > Synthesizing cross-agent data from 8 zones…<br>
            > Business plan analysis: 2 INVEST, 2 GROW, 2 DEFEND, 2 FIX<br>
            > RF fix routed for Ops Manager approval (TT-2847)<br>
            > Revenue opportunity identified: $4.2M ARR in Grow zones<br>
            > Executive briefing ready — 3 min ago
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
          <div class="fleet-tool">compile_executive_summary()</div>
          <div class="fleet-tool">stage_remediation_blueprint()</div>
          <div class="fleet-tool">route_to_agent(agent_id, task)</div>
          <div class="fleet-tool">synthesize_business_plan()</div>
        </div>
      </div>
    </div>

    <!-- 4 Domain Agents + Inter-agent flow -->
    <div class="fleet-grid" style="margin-bottom:14px">
      ${DATA.agents.slice(0, 3).map(a => `
        <div class="fleet-card" style="border-color:${a.color}22">
          <div class="fleet-card-header">
            <div class="fleet-icon" style="background:${a.color}18">${a.icon}</div>
            <div class="fleet-info">
              <div class="name">${a.name}</div>
              <div class="role">${a.role}</div>
            </div>
            <div style="margin-left:auto;display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted2)">
              <div class="status-dot ${a.status === 'busy' ? 'status-busy' : 'status-active'}"></div>${a.status}
            </div>
          </div>
          <div class="fleet-activity">${a.activity.join('<br>')}</div>
          <div class="fleet-tools-list">${a.tools.map(t => `<div class="fleet-tool">${t}</div>`).join('')}</div>
        </div>`).join('')}

      <!-- Analytics & Executive Report Agent (AI-03) -->
      <div class="fleet-card" style="border-color:rgba(99,102,241,.3);background:rgba(99,102,241,.04)">
        <div class="fleet-card-header">
          <div class="fleet-icon" style="background:rgba(99,102,241,.15)">📋</div>
          <div class="fleet-info">
            <div class="name">Analytics &amp; Executive Report Agent</div>
            <div class="role">Cross-Agent Synthesis · Executive Output</div>
          </div>
          <div style="margin-left:auto;display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted2)">
            <div class="status-dot status-active"></div>active
          </div>
        </div>
        <div class="fleet-activity">
          > Executive prompt received: "What's our network risk this week?"<br>
          > Pulling data from Engineering + Marketing + CX agents…<br>
          > Cross-agent synthesis complete — 3 critical, 2 opportunities<br>
          > Actionability Score computed: 87% confidence
        </div>
        <div class="fleet-tools-list">
          <div class="fleet-tool">synthesise_executive_report()</div>
          <div class="fleet-tool">compute_actionability_score()</div>
          <div class="fleet-tool">cross_agent_query(agents[], prompt)</div>
          <div class="fleet-tool">generate_board_brief()</div>
        </div>
      </div>
    </div>

    <!-- Inter-agent flow -->
    <div class="card" style="margin-bottom:14px;background:linear-gradient(135deg,rgba(8,145,178,.06),rgba(37,99,235,.04))">
      <div class="card-title" style="margin-bottom:12px">Inter-Agent Orchestration Flow (AI-05)</div>
      <div style="display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap">
        ${[
          { label:'VOC Agent',          icon:'💬', msg:'Complaint spike: Bellevue', col:'#F97316' },
          { label:'RCA Agent',          icon:'🔍', msg:'Correlating IMS + DCR data', col:'#F97316' },
          { label:'Engineering Agent',  icon:'📡', msg:'EN-DC desync confirmed', col:'#06B6D4' },
          { label:'Recommendation Agent',icon:'💡',msg:'Beam tilt fix: 94% confidence', col:'#EAB308' },
          { label:'Governance Agent',   icon:'🛡️', msg:'Human approval required', col:'#6366F1' },
          { label:'Automation Agent',   icon:'⚡', msg:'Awaiting Ops Manager sign-off', col:'#22C55E' },
        ].map((f, i) => `
          <div style="display:flex;align-items:center;gap:4px">
            <div style="background:var(--surface2);border:1px solid ${f.col}40;border-radius:8px;padding:8px 10px;text-align:center;min-width:110px">
              <div style="font-size:16px">${f.icon}</div>
              <div style="font-size:10px;font-weight:600;color:${f.col};margin:3px 0">${f.label}</div>
              <div style="font-size:10px;color:var(--muted2)">${f.msg}</div>
            </div>
            ${i < 5 ? `<div style="color:var(--muted);font-size:16px">→</div>` : ''}
          </div>`).join('')}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn-primary" style="font-size:11px" onclick="navigate('rfagent')">View Full RF Workflow →</button>
        <button class="btn-secondary" style="font-size:11px" onclick="navigate('bizplan')">Executive Business Plan →</button>
      </div>
    </div>

    <!-- Three Execution Modes (AI-09) -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title" style="margin-bottom:4px">Three Execution Modes</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:12px">Configurable per agent · per use-case · per geography</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${execModes.map((m, i) => `
          <div style="border:2px solid ${m.locked ? 'var(--border)' : m.col+'40'};border-radius:var(--radius);padding:14px;${m.locked ? 'opacity:.65' : ''}">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:20px">${m.icon}</span>
              <div>
                <div style="font-size:12px;font-weight:700;color:${m.locked ? 'var(--muted)' : m.col}">Mode ${i+1}</div>
                <div style="font-size:11px;font-weight:600">${m.mode}${m.locked ? ' 🔒' : ''}</div>
              </div>
            </div>
            <div style="font-size:11px;color:var(--muted2);line-height:1.6">${m.desc}</div>
            ${!m.locked ? `<div style="margin-top:8px"><span style="font-size:10px;padding:2px 8px;border-radius:100px;background:${m.col}18;color:${m.col};font-weight:600">● Active</span></div>` : `<div style="margin-top:8px"><span style="font-size:10px;color:var(--muted)">Phase 2 — Vetted scenarios only</span></div>`}
          </div>`).join('')}
      </div>
    </div>

    <!-- 7 Specialist Core Agents (AI-04) -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-title" style="margin-bottom:4px">7 Specialist Core Agents — Always Running</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:12px">Infrastructure layer · Called by domain agents via Orchestrator · Never exposed directly to users</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        ${specialistAgents.map(a => `
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px">
            <div style="font-size:18px;margin-bottom:6px">${a.icon}</div>
            <div style="font-size:12px;font-weight:600;color:${a.col};margin-bottom:4px">${a.name}</div>
            <div style="font-size:10px;color:var(--muted2);line-height:1.5">${a.desc}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Architecture -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px">
      <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Production Architecture (Layer 3 — Cognitive Orchestration)</div>
      <div style="display:flex;gap:16px;font-size:12px;color:var(--muted2)">
        <div style="flex:1"><b style="color:var(--text)">Orchestration:</b> LangGraph state engine manages agent transitions deterministically. No chaotic infinite loops.</div>
        <div style="flex:1"><b style="color:var(--text)">Security:</b> Agents access data via MCP gateways (JSON-RPC) only — no direct DB credentials. RBAC enforced per agent, per use-case, and per geography.</div>
        <div style="flex:1"><b style="color:var(--text)">RAG Pipeline:</b> Proprietary operator docs (NOC runbooks, KPI definitions, vendor contracts) vectorised in operator-controlled vector DB. Agents query via RAG — data never leaves the operator environment. Supports Nokia, Ericsson, Huawei and custom documentation.</div>
        <div style="flex:1"><b style="color:var(--text)">Models:</b> Private SLM cluster (Llama-3-8B + Phi-4 on vLLM, private GPUs) + Claude for orchestration. Fully on-premise deployable. Sub-100ms response.</div>
      </div>
    </div>
  `;
}

/* ============================================================
   VIEW: USE-CASE GALLERY
   ============================================================ */
function renderGallery(wrap) {
  const statusPill = s => ({
    live: `<span class="pill pill-live" style="font-size:10px">● Live</span>`,
    beta: `<span class="pill pill-beta" style="font-size:10px">Beta</span>`,
    soon: `<span class="pill pill-soon" style="font-size:10px">Coming soon</span>`,
  })[s] || '';

  const ucCard = u => {
    const isLive = u.status === 'live';
    return `
      <div class="uc-card" onclick="navigate('${u.view}')">
        <div class="uc-status">${statusPill(u.status)}</div>
        <div class="uc-icon" style="background:${u.color}22">${u.icon}</div>
        <div class="uc-name">${u.name}</div>
        <div class="uc-tagline">${u.tagline}</div>
        <div class="uc-tags">${u.data.map(d => `<span class="uc-tag">${d}</span>`).join('')}</div>
        <div class="uc-foot">
          <span class="uc-maturity">${u.maturity}</span>
          <span class="uc-cta">${isLive ? 'Open →' : 'Build →'}</span>
        </div>
      </div>`;
  };

  const catIcons = {
    'Revenue Growth':       '💰',
    'Network Operations':   '📡',
    'Planning':             '🏗️',
    'Customer Experience':  '💬',
    'Autonomous Operations':'⚡',
  };

  const cats = [...new Set(USE_CASES.map(u => u.cat))];
  const groupedHTML = cats.map(cat => {
    const items = USE_CASES.filter(u => u.cat === cat);
    const pubItems = PUBLISHED.filter(u => u.cat === cat);
    const allItems = [...pubItems, ...items];
    return `
      <div style="margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:16px">${catIcons[cat] || '📋'}</span>
          <div style="font-size:13px;font-weight:700">${cat}</div>
          <div style="font-size:11px;color:var(--muted)">${allItems.filter(u => u.status === 'live').length} live · ${allItems.filter(u => u.status === 'beta').length} beta · ${allItems.filter(u => u.status === 'soon').length} coming</div>
        </div>
        <div class="uc-grid">
          ${allItems.map(u => ucCard(u)).join('')}
        </div>
      </div>`;
  }).join('');

  const publishedNoCat = PUBLISHED.filter(u => !u.cat);

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Use-Case Gallery</div>
        <div class="section-sub">15 templates across 5 categories — each runs on the shared data layer</div>
      </div>
      <button class="btn-primary" style="font-size:12px" onclick="navigate('builder')">+ Build Your Own</button>
    </div>

    ${publishedNoCat.length ? `
      <div style="margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:16px">⚡</span>
          <div style="font-size:13px;font-weight:700">Your Built Use-Cases</div>
          <div style="font-size:11px;color:var(--muted)">${publishedNoCat.length} deployed</div>
        </div>
        <div class="uc-grid">${publishedNoCat.map(u => ucCard(u)).join('')}</div>
      </div>` : ''}

    ${groupedHTML}

    <div class="uc-grid">
      <div class="uc-card uc-dashed" onclick="navigate('builder')">
        <div style="font-size:32px;margin-bottom:8px">＋</div>
        <div style="font-size:13px;font-weight:700;margin-bottom:6px">Build Your Own</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.5">Compose data sources, analytics type, output format and an agent — ship a new use-case to this gallery.</div>
      </div>
    </div>
  `;
}

/* ============================================================
   VIEW: MARKETING AGENT USE CASE
   ============================================================ */
function renderMarketingAgent(wrap) {
  const mktAgent = DATA.agents.find(a => a.id === 'mkt');
  const zoneData = [
    { name:'Bellevue Downtown',     ms:28, net:87, churn:4.2, opp:2100000, rec:'Launch 5G Premium Campaign',   col:'#22C55E' },
    { name:'Issaquah',              ms:33, net:82, churn:3.9, opp:900000,  rec:'Retail + Digital Expansion',   col:'#22C55E' },
    { name:'Redmond Tech Corridor', ms:68, net:91, churn:2.1, opp:1200000, rec:'Enterprise Retention Program', col:'#3B82F6' },
    { name:'Mercer Island',         ms:72, net:88, churn:1.8, opp:600000,  rec:'VIP Loyalty + ARPU Uplift',    col:'#3B82F6' },
    { name:'Bothell',               ms:58, net:41, churn:5.7, opp:200000,  rec:'Hold — await network fix',     col:'#F97316' },
    { name:'Kirkland Waterfront',   ms:61, net:44, churn:6.3, opp:0,       rec:'Pause ads — churn risk active',col:'#F97316' },
    { name:'Sammamish 98074',       ms:31, net:52, churn:7.8, opp:0,       rec:'Block — fix network first',    col:'#EF4444' },
    { name:'Renton',                ms:29, net:48, churn:8.2, opp:0,       rec:'Block — fix network first',    col:'#EF4444' },
  ];
  const totalOpp = zoneData.reduce((s, z) => s + z.opp, 0);

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Marketing Agent — Market Intelligence</div>
        <div class="section-sub">AI-driven market share analysis · Campaign prioritization · Cross-agent network intelligence</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="pill" style="background:rgba(139,92,246,.2);border:1px solid rgba(139,92,246,.4);color:#A78BFA">📊 Marketing Agent Active</span>
        <span class="pill pill-green">$${(totalOpp/1000000).toFixed(1)}M Total Opportunity</span>
      </div>
    </div>

    <div style="background:linear-gradient(135deg,rgba(139,92,246,.12),rgba(6,182,212,.1));border:1px solid rgba(139,92,246,.3);border-radius:8px;padding:14px 16px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:600;color:#A78BFA;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Cross-Agent Intelligence</div>
      <div style="font-size:12px;color:var(--muted2);line-height:1.7">
        Marketing Agent ingests network quality scores from the <b style="color:#06B6D4">Engineering Agent</b> and churn signals from the <b style="color:#F97316">Customer Service Agent</b>.
        Campaigns only fire in zones where the network can deliver — zero ad spend wasted on broken network areas.
      </div>
    </div>

    <div class="grid-3" style="margin-bottom:14px">
      <div class="kpi-tile"><div class="accent" style="background:#8B5CF6"></div><div class="lbl">Market Share</div><div class="val" style="color:var(--red)">38.4<small style="font-size:12px;color:var(--muted)">%</small></div><div class="delta delta-up">-1.2% vs 30d</div></div>
      <div class="kpi-tile"><div class="accent" style="background:var(--red)"></div><div class="lbl">Avg Churn Rate</div><div class="val" style="color:var(--red)">4.1<small style="font-size:12px;color:var(--muted)">%</small></div><div class="delta delta-up">+0.4% vs 24h</div></div>
      <div class="kpi-tile"><div class="accent" style="background:var(--green)"></div><div class="lbl">ARPU</div><div class="val" style="color:var(--green)">$84</div><div class="delta delta-down">+$2 vs 24h</div></div>
    </div>

    <div class="card" style="margin-bottom:14px;padding:0;overflow:hidden">
      <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div class="card-title" style="margin-bottom:0">🗺️ Market Opportunity Map — by Zone</div>
        <div style="display:flex;gap:10px;font-size:11px;color:var(--muted)">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22C55E;margin-right:4px"></span>Ready to Campaign</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#F97316;margin-right:4px"></span>Hold</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#EF4444;margin-right:4px"></span>Blocked</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3B82F6;margin-right:4px"></span>Defend</span>
        </div>
      </div>
      <div id="mktMap" style="height:240px"></div>
    </div>

    <div class="grid-2" style="margin-bottom:14px">
      <div class="card">
        <div class="card-title">📊 Zone Market Analysis · Agent Recommendations</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          ${zoneData.map(z => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface2);border-radius:8px;border-left:3px solid ${z.col}">
              <div style="min-width:160px">
                <div style="font-size:12px;font-weight:600">${z.name}</div>
                <div style="font-size:10px;color:var(--muted)">Market Share: ${z.ms}% · Churn: ${z.churn}%</div>
              </div>
              <div style="flex:1;font-size:11px;color:var(--muted2)">${z.rec}</div>
              ${z.opp > 0 ? `<div style="font-size:12px;font-weight:700;color:${z.col};flex-shrink:0">+$${(z.opp/1000).toFixed(0)}K</div>` : `<div style="font-size:11px;color:var(--muted);flex-shrink:0">Blocked</div>`}
            </div>`).join('')}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card" style="border-color:rgba(139,92,246,.25)">
          <div class="card-title" style="color:#A78BFA">Agent Activity Log</div>
          <div class="fleet-activity">${mktAgent.activity.join('<br>')}</div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:4px">
            ${mktAgent.tools.map(t => `<div class="fleet-tool">${t}</div>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-title">💡 Campaign Intelligence</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${[
              { zone:'Bellevue Downtown',     type:'5G Speed Campaign',    budget:'$45K', est:'$210K NRR/mo', color:'#22C55E' },
              { zone:'Issaquah',              type:'Family Plan Push',      budget:'$22K', est:'$90K NRR/mo',  color:'#22C55E' },
              { zone:'Redmond Tech Corridor', type:'Enterprise Contract',   budget:'$15K', est:'$100K NRR/mo', color:'#3B82F6' },
            ].map(c => `
              <div style="padding:8px 10px;background:var(--surface2);border-radius:6px;border-left:2px solid ${c.color}">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div style="font-size:12px;font-weight:600">${c.zone}</div>
                    <div style="font-size:11px;color:var(--muted)">${c.type} · Budget: ${c.budget}</div>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:${c.color}">${c.est}</div>
                </div>
              </div>`).join('')}
            <button class="btn-primary" style="font-size:11px;margin-top:4px">Launch Campaign →</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🔔 Proactive Churn Alerts — Marketing Layer</div>
      <div class="grid-3">
        ${[
          { kpi:'Churn Rate (Renton)',          thr:'> 5%',    action:'Retention SMS + Offer',      col:'#EF4444', on:true  },
          { kpi:'Market Share Slide (Bellevue)', thr:'> 2% MoM',action:'5G Awareness Campaign',     col:'#F97316', on:true  },
          { kpi:'NPS Drop',                      thr:'< 3.5/5', action:'Exec Escalation + VoC Alert',col:'#8B5CF6', on:false },
        ].map(t => `
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <div style="font-size:12px;font-weight:600">${t.kpi}</div>
              <span class="pill ${t.on ? 'pill-green' : ''}" style="${!t.on ? 'background:var(--surface3);color:var(--muted)' : ''}">${t.on ? 'Active' : 'Configure'}</span>
            </div>
            <div style="font-size:13px;font-weight:700;color:${t.col};margin-bottom:4px">${t.thr}</div>
            <div style="font-size:11px;color:var(--muted)">→ ${t.action}</div>
          </div>`).join('')}
      </div>
    </div>
  `;
  initMktMap();
}

function initMktMap() {
  const mktCol = { grow: '#22C55E', defend: '#3B82F6', fix: '#F97316', invest: '#EF4444' };
  const mktMap = L.map('mktMap', { center: [47.60, -122.17], zoom: 10, zoomControl: false, attributionControl: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mktMap);
  _extraMaps.push(mktMap);

  DATA.zones.forEach(z => {
    const col = mktCol[z.cat];
    L.circle([z.lat, z.lng], { radius: 1800, color: col, fillColor: col, fillOpacity: 0.35, weight: 2 })
      .addTo(mktMap)
      .bindPopup(`<b>${z.name}</b><br>Market Share: ${z.ms}%<br>Churn: ${z.churn}%<br><b style="color:${col}">${z.cat.toUpperCase()}</b>`);
  });
  setTimeout(() => mktMap.invalidateSize(), 80);
}

/* ============================================================
   VIEW: USE CASE BUILDER
   ============================================================ */
let builderState = { step: 1, objective: null, geography: [], data: [], analysis: null };

function renderBuilder(wrap) {
  builderState = { step: 1, objective: null, geography: [], data: [], analysis: null };
  _renderBuilderStep(wrap);
}

function _renderBuilderStep(wrap) {
  const { step } = builderState;

  const objectives = [
    { id:'revenue',   label:'Grow Revenue',          desc:'Market share expansion, ARPU uplift, campaign ROI', icon:'💰', color:'#22C55E' },
    { id:'network',   label:'Improve Network Quality', desc:'Fix underperforming sites, reduce drop calls, close coverage gaps', icon:'📡', color:'#06B6D4' },
    { id:'customer',  label:'Reduce Churn',           desc:'Retain at-risk subscribers using cross-domain signals', icon:'🔄', color:'#F97316' },
    { id:'planning',  label:'Strategic Planning',     desc:'Capacity forecasting, 5G deployment prioritisation, site ROI', icon:'🏗️', color:'#8B5CF6' },
    { id:'autonomous',label:'Autonomous Operations',  desc:'Closed-loop remediation, self-healing network, beam management', icon:'⚡', color:'#6366F1' },
  ];

  const geoLevels = [
    { id:'metro',   label:'Metro / City',     desc:'Whole city view (e.g. Seattle Metro)' },
    { id:'county',  label:'County / Region',  desc:'County-level drill-down' },
    { id:'zip',     label:'ZIP / Postal',     desc:'Specific ZIP code analysis' },
    { id:'site',    label:'Individual Site',  desc:'Single cell site or sector' },
  ];

  const dataSources = [
    { id:'eng',   label:'Engineering',      desc:'Network KPIs, Alarms, Performance Counters', icon:'📡', color:'#06B6D4' },
    { id:'mkt',   label:'Marketing',        desc:'Market Share, Churn, ARPU, Demographics',    icon:'📊', color:'#8B5CF6' },
    { id:'cx',    label:'Customer Care',    desc:'Tickets, CSAT, VoC, Sentiment',              icon:'💬', color:'#F97316' },
    { id:'3p',    label:'3rd Party',        desc:'Ookla, OpenSignal, RootMetrics',             icon:'🌐', color:'#22C55E' },
    { id:'gis',   label:'GIS / Geospatial', desc:'Map layers, ZIP, City, County, Coverage',   icon:'🗺️', color:'#3B82F6' },
    { id:'sales', label:'Sales',            desc:'Store performance, B2B pipeline, Retail',    icon:'💼', color:'#EAB308' },
    { id:'plan',  label:'Planning & Field', desc:'Site DB, Antenna tilt, Coverage sims',       icon:'🏗️', color:'#6366F1' },
  ];

  const analysisTypes = [
    { id:'reactive',    label:'Reactive / Visualisation', desc:'Trend charts, KPI tiles, current network state', icon:'📈', color:'#06B6D4', locked:false },
    { id:'proactive',   label:'Proactive Alerting',        desc:'Threshold alerts, SMS / Email / JIRA integration', icon:'🔔', color:'#3B82F6', locked:false },
    { id:'rca',         label:'RCA / Diagnostic',          desc:'Cross-signal correlation, 5-domain root cause engine', icon:'🔍', color:'#F97316', locked:false },
    { id:'predictive',  label:'Predictive (ML)',           desc:'14-day ML forecasts: churn, capacity, market share — Forecast Agent powered', icon:'🔮', color:'#8B5CF6', locked:false },
    { id:'prescriptive',label:'Prescriptive / Autonomous', desc:'Open / closed-loop remediation via NETCONF / gNMI — Automation Agent powered', icon:'⚡', color:'#6366F1', locked:false },
  ];

  const stepDefs = [
    { n:1, l:'Business Objective' },
    { n:2, l:'Geography' },
    { n:3, l:'Data Sources' },
    { n:4, l:'Analysis Type' },
    { n:5, l:'Deploy Agent' },
  ];

  const stepContent = () => {
    if (step === 1) return `
      <div class="card">
        <div class="card-title">Step 1 — Define Business Objective</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:12px">What business outcome should this use-case drive? The Orchestrator will select the optimal agent combination.</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${objectives.map(o => `
            <div onclick="builderPickObjective('${o.id}',this)" id="bobj_${o.id}"
              style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--surface2);
                border:2px solid ${builderState.objective === o.id ? o.color : 'var(--border)'};
                border-radius:8px;cursor:pointer;transition:all .15s">
              <div style="font-size:24px;flex-shrink:0">${o.icon}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;color:${builderState.objective === o.id ? o.color : 'var(--text)'}">${o.label}</div>
                <div style="font-size:11px;color:var(--muted2);margin-top:2px">${o.desc}</div>
              </div>
              ${builderState.objective === o.id ? `<div style="font-size:16px">✓</div>` : ''}
            </div>`).join('')}
        </div>
        <button class="btn-primary" style="margin-top:14px" onclick="builderNext(2)">Next: Geography →</button>
      </div>`;

    if (step === 2) return `
      <div class="card">
        <div class="card-title">Step 2 — Set Geography</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:12px">Choose the geographic scope for this use-case. Agents will fetch and rank data at this resolution.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          ${geoLevels.map(g => `
            <div onclick="builderToggleGeo('${g.id}',this)" id="bgeo_${g.id}"
              style="padding:14px;background:var(--surface2);
                border:2px solid ${builderState.geography.includes(g.id) ? 'var(--brand)' : 'var(--border)'};
                border-radius:8px;cursor:pointer;transition:all .15s">
              <div style="font-size:13px;font-weight:600;margin-bottom:4px">${g.label}</div>
              <div style="font-size:11px;color:var(--muted2)">${g.desc}</div>
            </div>`).join('')}
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:14px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Specific location (optional)</div>
          <input id="geoInput" placeholder="e.g. Seattle, WA — or leave blank for Metro-wide"
            style="width:100%;padding:9px 12px;background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-family:inherit;box-sizing:border-box;outline:none"/>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn-secondary" onclick="builderNext(1)">← Back</button>
          <button class="btn-primary" onclick="builderNext(3)">Next: Data Sources →</button>
        </div>
      </div>`;

    if (step === 3) return `
      <div class="card">
        <div class="card-title">Step 3 — Select Data Sources</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:12px">Choose which data categories your use-case draws from. Pick one or more.</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px" id="dsGrid">
          ${dataSources.map(d => `
            <div onclick="builderToggleData('${d.id}',this)" id="bds_${d.id}"
              style="display:flex;align-items:flex-start;gap:10px;padding:12px;background:${builderState.data.includes(d.id) ? 'var(--brand-glow)' : 'var(--surface2)'};
                border:2px solid ${builderState.data.includes(d.id) ? d.color : 'var(--border)'};border-radius:8px;cursor:pointer;transition:all .15s">
              <div style="font-size:20px;margin-top:2px">${d.icon}</div>
              <div>
                <div style="font-size:12px;font-weight:600">${d.label}</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">${d.desc}</div>
              </div>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn-secondary" onclick="builderNext(2)">← Back</button>
          <button class="btn-primary" onclick="builderNext(4)">Next: Analysis Type →</button>
        </div>
      </div>`;

    if (step === 4) return `
      <div class="card">
        <div class="card-title">Step 4 — Choose Analysis Type</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:12px">How intelligent should your use-case be? This determines which specialist agents are invoked.</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${analysisTypes.map(d => `
            <div onclick="${d.locked ? '' : `builderPickAnalysis('${d.id}',this)`}" id="bat_${d.id}"
              style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surface2);
                border:2px solid ${builderState.analysis === d.id ? d.color : 'var(--border)'};
                border-radius:8px;cursor:${d.locked ? 'not-allowed' : 'pointer'};opacity:${d.locked ? '.5' : '1'};transition:all .15s">
              <div style="font-size:20px">${d.icon}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;color:${d.locked ? 'var(--muted)' : d.color}">${d.label}${d.locked ? ' 🔒 Phase 2' : ''}</div>
                <div style="font-size:11px;color:var(--muted2);margin-top:2px">${d.desc}</div>
              </div>
              ${builderState.analysis === d.id ? `<div style="font-size:16px;color:${d.color}">✓</div>` : ''}
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn-secondary" onclick="builderNext(3)">← Back</button>
          <button class="btn-primary" onclick="builderNext(5)">Next: Deploy Agent →</button>
        </div>
      </div>`;

    // Step 5: Deploy Agent
    const selObj = objectives.find(o => o.id === builderState.objective);
    const selAnalysis = analysisTypes.find(a => a.id === builderState.analysis);
    const agentMap = { revenue:'Marketing Agent', network:'Engineering Agent', customer:'Customer Service Agent', planning:'Orchestrator Agent', autonomous:'Automation Agent' };
    const suggestedAgent = agentMap[builderState.objective] || 'Orchestrator Agent';
    return `
      <div class="card">
        <div class="card-title">Step 5 — Deploy Agent</div>
        <div class="grid-2" style="gap:20px">
          <div>
            <div style="font-size:12px;color:var(--muted2);margin-bottom:14px">Name your use-case. The Orchestrator will configure data connections, spawn the agent, and publish it to the gallery.</div>
            <div style="margin-bottom:12px">
              <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">Use Case Name</label>
              <input id="ucName" placeholder="e.g. Seattle Churn Prevention Agent"
                style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:inherit;box-sizing:border-box;outline:none"/>
            </div>
            <div style="margin-bottom:14px">
              <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">Assign to Agent</label>
              <select style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:inherit;box-sizing:border-box">
                <option>${suggestedAgent} (recommended)</option>
                <option>Orchestrator Agent</option>
                <option>Engineering Agent</option>
                <option>Marketing Agent</option>
                <option>Customer Service Agent</option>
                <option>Analytics & Executive Report Agent</option>
              </select>
            </div>
            <div style="margin-bottom:14px">
              <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">Execution Mode</label>
              <select style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;font-family:inherit;box-sizing:border-box">
                <option>Advisory Only — insights only, no action</option>
                <option>Human Approval Required — agent proposes, Ops approves</option>
                <option>Autonomous Execution — closed-loop via NETCONF/gNMI</option>
              </select>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn-secondary" onclick="builderNext(4)">← Back</button>
              <button class="btn-primary" style="flex:1" onclick="builderDeploy(this)">Deploy Agent →</button>
            </div>
          </div>
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px">
            <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Configuration Summary</div>
            <div style="display:flex;flex-direction:column;gap:10px;font-size:12px">
              ${[
                ['Business Objective', selObj ? selObj.label : '—'],
                ['Geography', builderState.geography.map(g => geoLevels.find(gl => gl.id === g)?.label).join(', ') || 'Metro-wide'],
                ['Data Sources', builderState.data.length > 0 ? builderState.data.join(', ') : '—'],
                ['Analysis Type', selAnalysis ? selAnalysis.label : '—'],
                ['Suggested Agent', suggestedAgent],
              ].map(([label, val]) => `
                <div>
                  <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
                    <span style="color:var(--muted)">${label}</span>
                    <span style="color:var(--text);font-weight:600;text-align:right;max-width:55%">${val}</span>
                  </div>
                </div>`).join('')}
            </div>
            <div style="margin-top:12px;padding:10px;background:var(--brand-glow);border:1px solid rgba(0,198,224,.2);border-radius:6px;font-size:11px;color:var(--muted2)">
              💡 Orchestrator will configure pipelines, spawn the specialist agents, and publish this use-case to your gallery. Est. ~2 min.
            </div>
          </div>
        </div>
      </div>`;
  };

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Use Case Builder</div>
        <div class="section-sub">5-step wizard — from business objective to live agentic use-case</div>
      </div>
      <span class="pill pill-brand">5-Step Wizard</span>
    </div>

    <div style="display:flex;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 20px;margin-bottom:20px;overflow-x:auto">
      ${stepDefs.map((s, i) => `
        <div style="display:flex;align-items:center;flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;white-space:nowrap">
            <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;
              background:${step > s.n ? 'var(--green)' : step === s.n ? 'var(--brand)' : 'var(--surface2)'};
              color:${step >= s.n ? '#fff' : 'var(--muted)'}">
              ${step > s.n ? '✓' : s.n}
            </div>
            <div style="font-size:11px;font-weight:${step === s.n ? 600 : 400};color:${step === s.n ? 'var(--text)' : 'var(--muted)'}">
              ${s.l}
            </div>
          </div>
          ${i < 4 ? `<div style="flex:1;min-width:12px;height:1px;background:${step > s.n ? 'var(--brand)' : 'var(--border)'};margin:0 8px"></div>` : ''}
        </div>`).join('')}
    </div>

    ${stepContent()}
  `;
}

window.builderPickObjective = function(id, el) {
  builderState.objective = id;
  document.querySelectorAll('[id^="bobj_"]').forEach(e => { e.style.borderColor = 'var(--border)'; });
  const objectives = [
    { id:'revenue', color:'#22C55E' }, { id:'network', color:'#06B6D4' }, { id:'customer', color:'#F97316' },
    { id:'planning', color:'#8B5CF6' }, { id:'autonomous', color:'#6366F1' },
  ];
  const obj = objectives.find(o => o.id === id);
  if (obj) el.style.borderColor = obj.color;
};

window.builderToggleGeo = function(id, el) {
  const idx = builderState.geography.indexOf(id);
  if (idx > -1) {
    builderState.geography.splice(idx, 1);
    el.style.borderColor = 'var(--border)';
  } else {
    builderState.geography.push(id);
    el.style.borderColor = 'var(--brand)';
  }
};

window.builderToggleData = function(id, el) {
  const idx = builderState.data.indexOf(id);
  if (idx > -1) {
    builderState.data.splice(idx, 1);
    el.style.borderColor = 'var(--border)';
    el.style.background = 'var(--surface2)';
  } else {
    builderState.data.push(id);
    el.style.borderColor = 'var(--brand)';
    el.style.background = 'var(--brand-glow)';
  }
};

window.builderPickAnalysis = function(id, el) {
  builderState.analysis = id;
  document.querySelectorAll('[id^="bat_"]').forEach(e => { e.style.borderColor = 'var(--border)'; });
  const colours = { reactive:'#06B6D4', proactive:'#3B82F6', rca:'#F97316', predictive:'#8B5CF6', prescriptive:'#6366F1' };
  el.style.borderColor = colours[id] || 'var(--brand)';
};

window.builderNext = function(step) {
  builderState.step = step;
  const wrap = document.getElementById('viewWrap');
  wrap.innerHTML = '';
  _renderBuilderStep(wrap);
};

window.builderDeploy = function(btn) {
  const name = document.getElementById('ucName').value || 'Custom Use Case';
  btn.textContent = 'Deploying…';
  btn.disabled = true;
  setTimeout(() => {
    PUBLISHED.unshift({
      id: 'custom-' + Date.now(),
      name,
      icon: '⚡',
      color: '#00C6E0',
      status: 'live',
      tagline: `Agentic use-case: ${builderState.objective || 'custom'} objective · ${builderState.data.join(', ') || 'selected data'} · ${builderState.analysis || 'reactive'} analysis.`,
      data: builderState.data.length ? builderState.data : ['Custom'],
      maturity: builderState.analysis ? builderState.analysis.charAt(0).toUpperCase() + builderState.analysis.slice(1) : 'Reactive',
      view: 'builder',
    });
    navigate('gallery');
  }, 1800);
};

/* ============================================================
   GOVERNANCE & SECURITY
   ============================================================ */
const GOV_CONNECTORS = [
  { name:'Snowflake',                   kind:'Data warehouse',       status:'connected', letter:'S', color:'#29B5E8' },
  { name:'Operator Ticketing (ITSM)',   kind:'ITSM / ServiceNow',    status:'connected', letter:'T', color:'#2563EB' },
  { name:'UNMS / Fault Management',     kind:'Fault management',     status:'connected', letter:'U', color:'#16A34A' },
  { name:'Generic Perf Counters',       kind:'Operator perf tool',   status:'pending',   letter:'P', color:'#8B5CF6' },
  { name:'Nokia OSS',                   kind:'Vendor OSS',           status:'available', letter:'N', color:'#124191' },
  { name:'Ericsson OSS',                kind:'Vendor OSS',           status:'available', letter:'E', color:'#0082F0' },
  { name:'Huawei iManager',             kind:'Vendor OSS',           status:'available', letter:'H', color:'#CF0A2C' },
  { name:'ATOLL / RF Planning',         kind:'RF planning',          status:'pending',   letter:'A', color:'#6D28D9' },
  { name:'Ookla Speedtest Intelligence',kind:'Crowdsource',          status:'available', letter:'O', color:'#141927' },
  { name:'Ecolocate (Indoor)',          kind:'Crowdsource / Indoor', status:'available', letter:'E', color:'#0891B2' },
  { name:'Starlink Inhouse',            kind:'Satellite crowdsource',status:'available', letter:'S', color:'#1D4ED8' },
  { name:'census.gov',                  kind:'Demographics',         status:'available', letter:'C', color:'#1F6FEB' },
];

const GOV_ROLES = [
  { role:'RF Engineer',        perms:'Read · network data & agent workflows',      icon:'📡' },
  { role:'Network Ops Lead',   perms:'Read / Write · all use-cases & agents',      icon:'🛠️' },
  { role:'Marketing Analyst',  perms:'Read · marketing & GIS data only',           icon:'📊' },
  { role:'BD / Executive',     perms:'Read · business plan & executive summary',   icon:'💼' },
  { role:'Security Admin',     perms:'Full admin · connectors, roles & audit log', icon:'🔒' },
];

const GOV_AUDIT = [
  { msg:'Snowflake connector enabled',              user:'Karanvir Channi',  ts:'2h ago',  type:'info'  },
  { msg:'Data residency confirmed: US-West-2',      user:'Karanvir Channi',  ts:'6h ago',  type:'ok'    },
  { msg:'RF Engineer Agent published to live',      user:'Mitali Lakhere',   ts:'1d ago',  type:'ok'    },
  { msg:'Ookla connector added',                    user:'Mitali Lakhere',   ts:'1d ago',  type:'info'  },
  { msg:'Access role "BD / Executive" created',     user:'Karanvir Channi',  ts:'2d ago',  type:'info'  },
  { msg:'Ecolocate Indoor connector added',         user:'Mitali Lakhere',   ts:'2d ago',  type:'info'  },
  { msg:'PII scan completed — no exposure found',   user:'System',           ts:'3d ago',  type:'ok'    },
  { msg:'Marketing Agent published to beta',        user:'Mitali Lakhere',   ts:'3d ago',  type:'ok'    },
  { msg:'Role "Marketing Analyst" scoped to GIS',   user:'Karanvir Channi',  ts:'4d ago',  type:'info'  },
  { msg:'RAG vector DB deployed (US-West-2)',        user:'System',           ts:'5d ago',  type:'ok'    },
];

let _govConnState = Object.fromEntries(GOV_CONNECTORS.map(c => [c.name, c.status]));

function renderGovernance(wrap) {
  const connected = GOV_CONNECTORS.filter(c => _govConnState[c.name] === 'connected').length;

  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Governance &amp; Security</div>
        <div class="section-sub">Connectors, access roles, data residency &amp; audit log — operator-controlled</div>
      </div>
      <span class="pill pill-brand">PRD §13.9</span>
    </div>

    <!-- Stats row -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px">
      ${[
        { icon:'🔌', label:'Connected sources', val: connected, color:'var(--brand)' },
        { icon:'🗄️', label:'Data residency',    val:'US-West-2', color:'var(--blue)' },
        { icon:'🛡️', label:'PII exposure',      val:'None', color:'var(--green)' },
        { icon:'👥', label:'Access roles',       val: GOV_ROLES.length, color:'var(--text)' },
      ].map(s => `
        <div class="card" style="padding:16px 18px">
          <div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:8px">${s.icon} ${s.label}</div>
          <div style="font-size:24px;font-weight:700;color:${s.color}">${s.val}</div>
        </div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">

      <!-- Connectors -->
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:13px;font-weight:600">Connectors &amp; Data Access</span>
          <span style="font-size:11px;color:var(--muted)">${connected} of ${GOV_CONNECTORS.length} connected</span>
        </div>
        <div id="govConnList">
          ${GOV_CONNECTORS.map(c => _govConnRow(c)).join('')}
        </div>
      </div>

      <!-- Roles + Residency -->
      <div style="display:flex;flex-direction:column;gap:14px">

        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600">Access Roles</div>
          ${GOV_ROLES.map(r => `
            <div style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--border)">
              <span style="font-size:16px">${r.icon}</span>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${r.role}</div>
                <div style="font-size:11px;color:var(--muted)">${r.perms}</div>
              </div>
            </div>`).join('')}
        </div>

        <div class="card">
          <div style="font-size:13px;font-weight:600;margin-bottom:12px">Data Residency &amp; Compliance</div>
          ${[
            { label:'Storage region',       val:'US-West-2 (AWS)',        ok:true  },
            { label:'Encryption at rest',   val:'AES-256',                ok:true  },
            { label:'Encryption in transit',val:'TLS 1.3',                ok:true  },
            { label:'PII exposure',         val:'None detected',          ok:true  },
            { label:'RAG vector DB',        val:'Operator-controlled',    ok:true  },
            { label:'Data leaves operator', val:'Never — on-prem RAG',   ok:true  },
          ].map(r => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:12px;color:${r.ok ? 'var(--green)' : 'var(--red)'}">${r.ok ? '✓' : '✗'}</span>
              <div style="flex:1;font-size:12px;color:var(--muted2)">${r.label}</div>
              <div style="font-size:12px;font-weight:600">${r.val}</div>
            </div>`).join('')}
        </div>

      </div>
    </div>

    <!-- Audit log -->
    <div class="card" style="padding:0;overflow:hidden">
      <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:13px;font-weight:600">Audit Log</span>
        <span style="font-size:11px;color:var(--muted)">Recent activity</span>
      </div>
      ${GOV_AUDIT.map(a => {
        const col = a.type === 'ok' ? 'var(--green)' : a.type === 'warn' ? '#F97316' : 'var(--brand)';
        return `<div style="display:flex;align-items:center;gap:12px;padding:9px 14px;border-bottom:1px solid var(--border)">
          <span style="width:7px;height:7px;border-radius:50%;background:${col};flex-shrink:0"></span>
          <div style="flex:1;font-size:12px;font-weight:500">${a.msg}</div>
          <div style="font-size:11px;color:var(--muted)">${a.user}</div>
          <div style="font-size:11px;color:var(--muted);min-width:48px;text-align:right">${a.ts}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function _govConnRow(c) {
  const st = _govConnState[c.name];
  const stConf = {
    connected: { label:'Connected', col:'var(--green)',  bg:'rgba(22,163,74,.1)'   },
    pending:   { label:'Pending',   col:'#F97316',       bg:'rgba(249,115,22,.1)'  },
    available: { label:'Available', col:'var(--muted)',  bg:'var(--surface2)'      },
  };
  const s = stConf[st] || stConf.available;
  return `<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--border)">
    <div style="width:30px;height:30px;border-radius:7px;background:${c.color};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">${c.letter}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
      <div style="font-size:11px;color:var(--muted)">${c.kind}</div>
    </div>
    <span style="font-size:10px;padding:2px 9px;border-radius:100px;background:${s.bg};color:${s.col};font-weight:600;white-space:nowrap">${s.label}</span>
    ${st === 'connected'
      ? `<button onclick="govToggle('${c.name}','available')" style="background:none;border:1px solid var(--border2);border-radius:6px;padding:3px 8px;font-size:10px;color:var(--muted);cursor:pointer">Disable</button>`
      : `<button onclick="govToggle('${c.name}','connected')" style="background:var(--brand);border:none;border-radius:6px;padding:3px 8px;font-size:10px;color:#fff;cursor:pointer;font-weight:600">Enable</button>`}
  </div>`;
}

window.govToggle = function(name, newStatus) {
  _govConnState[name] = newStatus;
  // Re-render just the connector list
  const listEl = document.getElementById('govConnList');
  if (listEl) {
    const c = GOV_CONNECTORS.find(c => c.name === name);
    if (c) {
      const rows = listEl.querySelectorAll('div[style*="border-bottom"]');
      rows.forEach(row => {
        if (row.querySelector('div')?.textContent?.trim().startsWith(c.letter)) {
          row.outerHTML = _govConnRow(c);
        }
      });
      listEl.innerHTML = GOV_CONNECTORS.map(c => _govConnRow(c)).join('');
    }
    // Update connected count in header
    const connected = GOV_CONNECTORS.filter(c => _govConnState[c.name] === 'connected').length;
    const hdr = listEl.closest('.card')?.querySelector('span:last-child');
    if (hdr) hdr.textContent = `${connected} of ${GOV_CONNECTORS.length} connected`;
  }
};

/* ============================================================
   DROP CALL RATE — Guided RCA (adapted from V1)
   ============================================================ */

// Geo lookup tables — city/county/zip → zone IDs (mirrors V1 rca.js approach)
const DCR_CITIES = [
  { label:'Bellevue Downtown',      zoneId:'z1' },
  { label:'Redmond Tech Corridor',  zoneId:'z3' },
  { label:'Kirkland Waterfront',    zoneId:'z4' },
  { label:'Issaquah',               zoneId:'z5' },
  { label:'Mercer Island',          zoneId:'z6' },
  { label:'Sammamish',              zoneId:'z2' },
  { label:'Renton',                 zoneId:'z7' },
  { label:'Bothell',                zoneId:'z8' },
  { label:'Downtown Seattle',       zoneId:'z1' },
  { label:'Capitol Hill',           zoneId:'z1' },
  { label:'Ballard',                zoneId:'z1' },
  { label:'Kent',                   zoneId:'z7' },
  { label:'SeaTac Airport',         zoneId:'z7' },
  { label:'Tacoma',                 zoneId:'z7' },
  { label:'Everett',                zoneId:'z8' },
];
const DCR_COUNTIES = [
  { label:'King County',        zoneIds:['z1','z2','z3','z4','z5','z6','z7'] },
  { label:'Snohomish County',   zoneIds:['z8'] },
  { label:'Pierce County',      zoneIds:['z7'] },
];
const DCR_ZIPS = [
  { label:'98004 · Bellevue',          zoneId:'z1' },
  { label:'98074 · Sammamish',         zoneId:'z2' },
  { label:'98052 · Redmond',           zoneId:'z3' },
  { label:'98033 · Kirkland',          zoneId:'z4' },
  { label:'98027 · Issaquah',          zoneId:'z5' },
  { label:'98040 · Mercer Island',     zoneId:'z6' },
  { label:'98057 · Renton',            zoneId:'z7' },
  { label:'98021 · Bothell',           zoneId:'z8' },
  { label:'98101 · Downtown Seattle',  zoneId:'z1' },
  { label:'98102 · Capitol Hill',      zoneId:'z1' },
  { label:'98107 · Ballard',           zoneId:'z1' },
  { label:'98032 · Kent',              zoneId:'z7' },
  { label:'98158 · SeaTac',            zoneId:'z7' },
  { label:'98402 · Tacoma',            zoneId:'z7' },
  { label:'98201 · Everett',           zoneId:'z8' },
];
const DCR_CATS = [
  { label:'Invest', value:'invest' },
  { label:'Fix',    value:'fix'    },
  { label:'Grow',   value:'grow'   },
  { label:'Defend', value:'defend' },
];

let dcrRcaState = { filter: 'all', filterVal: '', openZone: null };
let _dcrRcaMap = null;

function _dcrValOptions(kind) {
  if (kind === 'city')   return DCR_CITIES.map(c  => `<option value="${c.zoneId}|${c.label}">${c.label}</option>`).join('');
  if (kind === 'county') return DCR_COUNTIES.map(c => `<option value="${c.zoneIds.join(',')}|${c.label}">${c.label}</option>`).join('');
  if (kind === 'zip')    return DCR_ZIPS.map(z    => `<option value="${z.zoneId}|${z.label}">${z.label}</option>`).join('');
  if (kind === 'cat')    return DCR_CATS.map(c    => `<option value="${c.value}|${c.label}">${c.label}</option>`).join('');
  return '';
}

function renderDCRRca(wrap) {
  wrap.innerHTML = `
    <div class="section-head">
      <div>
        <div class="section-title">Drop Call Rate — Guided RCA</div>
        <div class="section-sub">Step 1: locate worst DCR zones · Step 2: diagnose across 5 failure domains</div>
      </div>
      <span class="pill pill-red">Network-wide DCR: 2.4%</span>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <span style="background:var(--brand);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">1</span>
        <b style="font-size:13px">Locate — filter drop-call zones &amp; map them</b>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);margin-bottom:4px">Filter by</div>
          <select id="dcrFilterKind" style="border:1px solid var(--border2);border-radius:var(--radius-sm);padding:6px 10px;font-size:12px;background:var(--surface);color:var(--text);font-family:inherit">
            <option value="all">Whole Metro</option>
            <option value="city">City</option>
            <option value="county">County</option>
            <option value="zip">Zip Code</option>
            <option value="cat">Category</option>
          </select>
        </div>
        <div id="dcrFilterValWrap" style="display:none">
          <div style="font-size:11px;font-weight:600;color:var(--muted);margin-bottom:4px">Value</div>
          <select id="dcrFilterVal" style="border:1px solid var(--border2);border-radius:var(--radius-sm);padding:6px 10px;font-size:12px;background:var(--surface);color:var(--text);font-family:inherit;min-width:220px"></select>
        </div>
        <button class="btn-primary" onclick="dcrRunStep1()" style="font-size:12px;padding:6px 16px">Find drop-call zones →</button>
      </div>
    </div>

    <div id="dcrResults"></div>
  `;

  const kindEl = document.getElementById('dcrFilterKind');
  const valWrap = document.getElementById('dcrFilterValWrap');
  const valEl  = document.getElementById('dcrFilterVal');

  function updateValDropdown() {
    const k = kindEl.value;
    if (k === 'all') { valWrap.style.display = 'none'; return; }
    valWrap.style.display = '';
    valEl.innerHTML = _dcrValOptions(k);
  }

  kindEl.value = dcrRcaState.filter || 'all';
  updateValDropdown();
  kindEl.addEventListener('change', updateValDropdown);

  dcrRunStep1();
}

window.dcrRunStep1 = function() {
  const kind = document.getElementById('dcrFilterKind').value;
  const valEl = document.getElementById('dcrFilterVal');
  const rawVal = valEl ? valEl.value : '';   // format: "zoneId(s)|label" or "catValue|label"
  const [filterKey, filterLabel] = rawVal.split('|');
  dcrRcaState.filter = kind;
  dcrRcaState.filterVal = rawVal;

  let zones = DATA.zones.slice();
  if (kind === 'city' || kind === 'zip') {
    zones = zones.filter(z => z.id === filterKey);
  } else if (kind === 'county') {
    const ids = filterKey.split(',');
    zones = zones.filter(z => ids.includes(z.id));
  } else if (kind === 'cat') {
    zones = zones.filter(z => z.cat === filterKey);
  }

  zones = zones.map(z => ({ zone: z, dcr: +((100 - z.net) / 40).toFixed(2) }))
               .sort((a, b) => b.dcr - a.dcr);

  const box = document.getElementById('dcrResults');
  if (!zones.length) {
    box.innerHTML = '<div class="card" style="text-align:center;padding:24px;color:var(--muted)">No zones match this filter.</div>';
    return;
  }

  const scopeLabel = kind === 'all' ? 'Whole Metro' : (filterLabel || filterKey);
  box.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start;margin-bottom:14px">
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:10px 14px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600">
          Drop-Call Zones · ${scopeLabel}
          <span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:6px">ranked by DCR</span>
        </div>
        <div id="dcrZoneList"></div>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:10px 14px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600">🗺️ Map <span style="font-size:11px;font-weight:400;color:var(--muted)">· severity-coded · click a zone</span></div>
        <div id="dcrZoneMap" style="height:280px"></div>
      </div>
    </div>
    <div id="dcrDiag"></div>
  `;

  // Ranked list
  document.getElementById('dcrZoneList').innerHTML = zones.map((r, i) => {
    const z = r.zone;
    const col = r.dcr > 2.0 ? '#EF4444' : r.dcr > 1.2 ? '#F97316' : '#16A34A';
    const status = r.dcr > 2.0 ? 'Critical' : r.dcr > 1.2 ? 'Degraded' : 'Healthy';
    return `<div onclick="dcrOpenZone('${z.id}')" id="dcrRow_${z.id}"
      style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .12s"
      onmouseenter="this.style.background='var(--surface2)'" onmouseleave="this.style.background=''">
      <span style="width:20px;height:20px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--muted);flex-shrink:0">${i+1}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${z.name}</div>
        <div style="font-size:10px;color:var(--muted)">${z.sites} sites</div>
      </div>
      <span style="font-size:13px;font-weight:700;color:${col}">${r.dcr}%</span>
      <span style="font-size:10px;padding:2px 8px;border-radius:100px;background:${col}18;color:${col};font-weight:600">${status}</span>
    </div>`;
  }).join('');

  // Leaflet map
  setTimeout(() => {
    if (_dcrRcaMap) { try { _dcrRcaMap.remove(); } catch(e) {} _dcrRcaMap = null; }
    _dcrRcaMap = L.map('dcrZoneMap', { center: [47.62, -122.17], zoom: 10, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(_dcrRcaMap);
    _extraMaps.push(_dcrRcaMap);
    zones.forEach(r => {
      const z = r.zone;
      const col = r.dcr > 2.0 ? '#EF4444' : r.dcr > 1.2 ? '#F97316' : '#16A34A';
      L.circleMarker([z.lat, z.lng], { radius: 14, fillColor: col, color: '#fff', weight: 2, fillOpacity: 0.82 })
        .bindPopup(`<b style="font-size:12px">${z.name}</b><br><span style="color:${col};font-weight:700">DCR: ${r.dcr}%</span>`, { closeButton: false })
        .on('click', () => dcrOpenZone(z.id))
        .addTo(_dcrRcaMap);
    });
  }, 60);

  // Auto-open worst zone
  if (!dcrRcaState.openZone || !zones.find(r => r.zone.id === dcrRcaState.openZone)) {
    dcrRcaState.openZone = zones[0].zone.id;
  }
  _dcrPaintDiag(zones);
};

window.dcrOpenZone = function(zid) {
  dcrRcaState.openZone = zid;
  // Re-derive the current filtered zone list to pass to _dcrPaintDiag
  const kind = dcrRcaState.filter;
  const [filterKey] = (dcrRcaState.filterVal || '').split('|');
  let zones = DATA.zones.slice();
  if (kind === 'city' || kind === 'zip')  zones = zones.filter(z => z.id === filterKey);
  else if (kind === 'county')             zones = zones.filter(z => filterKey.split(',').includes(z.id));
  else if (kind === 'cat')                zones = zones.filter(z => z.cat === filterKey);
  zones = zones.map(z => ({ zone: z, dcr: +((100 - z.net) / 40).toFixed(2) })).sort((a, b) => b.dcr - a.dcr);
  document.querySelectorAll('[id^="dcrRow_"]').forEach(el => el.style.background = '');
  const row = document.getElementById('dcrRow_' + zid);
  if (row) { row.style.background = 'rgba(8,145,178,.08)'; row.scrollIntoView({ block: 'nearest' }); }
  _dcrPaintDiag(zones);
};

function _dcrPaintDiag(zones) {
  const found = zones.find(r => r.zone.id === dcrRcaState.openZone);
  if (!found) return;
  const z = found.zone;
  const dcr = found.dcr;
  const net = z.net;

  const hosr  = 100 - (100 - net) * 0.2;
  const rlf   = (100 - net) * 0.03;
  const rrc   = 100 - (100 - net) * 0.15;
  const afr   = (100 - net) * 0.05;
  const rsrp  = -70 - (100 - net) * 0.5;
  const sinr  = net * 0.2 - 4;

  const reasons = [
    {
      key:'handover', label:'Handover Failures', icon:'🔄',
      hit: hosr < 98.5 || z.cat === 'fix',
      sev: hosr < 97 ? 'crit' : 'warn',
      evidence: [
        `Handover Success Rate: ${hosr.toFixed(1)}% (target ≥ 99.0%)`,
        `Radio Link Failure rate: ${rlf.toFixed(2)}%`,
        z.cat === 'fix' ? 'Zone flagged for network fix — handover mis-tuning likely' : 'Handover parameters within marginal range',
      ],
      note:'Deeper layer: SRVCC execution failures, ping-pong handovers (requires mobility-trace / core data).'
    },
    {
      key:'alarms', label:'Site Alarms', icon:'🚨',
      hit: net < 60,
      sev: net < 50 ? 'crit' : 'warn',
      evidence: net < 60
        ? DATA.alarms.slice(0, 2).map(a => `${a.type} · ${a.site} (${a.sev})`)
        : ['No critical alarms correlated to this zone'],
      note:'Fault-management alarms correlated by time/space to the drop window.'
    },
    {
      key:'capacity', label:'High Utilization / Capacity', icon:'📊',
      hit: z.cat === 'invest' || net < 55,
      sev:'warn',
      evidence: [
        z.cat === 'invest' ? 'Zone marked for capacity investment — PRB utilization elevated' : 'Throughput within capacity bounds',
        `Avg throughput: ${(net * 2).toFixed(0)} Mbps · ${z.sites} active sites`,
        net < 55 ? 'Congestion profile: scheduler strain during busy hour' : 'No capacity alarm detected',
      ],
      note:'PRB/CPU load starves the voice scheduler → RLF under strain.'
    },
    {
      key:'radio', label:'Radio-Access Failures', icon:'📡',
      hit: rrc < 98.5 || afr > 0.25,
      sev: rrc < 97 ? 'crit' : 'warn',
      evidence: [
        `RRC Setup Success: ${rrc.toFixed(1)}% (target ≥ 99.3%)`,
        `Access Failure Rate: ${afr.toFixed(2)}%`,
        rrc < 98.5 ? 'Accessibility KPIs below threshold' : 'Accessibility KPIs within norms',
      ],
      note:'Deeper layer: IMS registration / P-CSCF SIP 408/504 timeouts (requires core/IMS data).'
    },
    {
      key:'coverage', label:'Coverage Holes', icon:'🌐',
      hit: rsrp < -95 || sinr < 10,
      sev: rsrp < -100 ? 'crit' : 'warn',
      evidence: [
        `RSRP: ${rsrp.toFixed(0)} dBm (target ≥ -95 dBm)`,
        `SINR: ${sinr.toFixed(1)} dB (target ≥ 12 dB)`,
        rsrp < -95 ? 'Weak signal — cell edge or in-building penetration loss' : 'Coverage within target',
      ],
      note:'Deeper layer: mid-band propagation budget, in-building penetration losses.'
    },
  ];

  const hits = reasons.filter(r => r.hit).sort((a, b) => (a.sev === 'crit' ? 0 : 1) - (b.sev === 'crit' ? 0 : 1));
  const topHit = hits[0];
  const verdictMap = {
    handover:'mobility / handover mis-tuning',
    alarms:'a hardware or transport fault flagged by site alarms',
    capacity:'congestion / capacity strain on this zone',
    radio:'radio-access (accessibility) failures',
    coverage:'a coverage / RF-propagation hole',
  };
  const verdictText = topHit
    ? `Most likely root cause: <strong>${verdictMap[topHit.key]}</strong>. ${topHit.evidence[0]}.`
    : 'Drop-call rate is within norms — no single dominant root cause identified.';

  const diagEl = document.getElementById('dcrDiag');
  diagEl.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
        <span style="background:var(--brand);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">2</span>
        <b style="font-size:13px">RCA · ${z.name}</b>
        <span class="pill pill-red" style="font-size:10px">DCR ${dcr}%</span>
        <span style="font-size:11px;color:var(--muted)">${z.sites} sites · Net score: ${net}/100</span>
      </div>

      <div style="background:rgba(8,145,178,.07);border:1px solid rgba(8,145,178,.25);border-radius:var(--radius);padding:12px 14px;margin-bottom:14px;display:flex;gap:10px;align-items:flex-start">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--brand2));display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">🧠</div>
        <div style="font-size:13px;line-height:1.7">${verdictText}</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        ${reasons.map(r => {
          const col = !r.hit ? '#16A34A' : r.sev === 'crit' ? '#EF4444' : '#F97316';
          const badge = !r.hit ? 'Clear' : r.sev === 'crit' ? 'Critical' : 'Contributing';
          return `<div style="border:1px solid ${col}30;border-radius:var(--radius);padding:12px;${!r.hit ? 'opacity:.72' : ''}">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
              <span style="font-size:15px">${r.icon}</span>
              <b style="font-size:12px;flex:1">${r.label}</b>
              <span style="font-size:10px;padding:2px 8px;border-radius:100px;background:${col}18;color:${col};font-weight:600">${badge}</span>
            </div>
            <ul style="margin:0 0 8px 0;padding-left:14px">
              ${r.evidence.map(e => `<li style="font-size:11px;color:var(--muted2);margin:3px 0">${e}</li>`).join('')}
            </ul>
            <div style="font-size:10px;color:var(--muted);font-style:italic">${r.note}</div>
          </div>`;
        }).join('')}
      </div>

      <div style="border:1px dashed var(--border2);border-radius:var(--radius);padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
        <span style="font-size:11px;padding:2px 10px;background:var(--surface2);border-radius:100px;color:var(--muted);white-space:nowrap;flex-shrink:0">🔒 Deeper Layer · Phase 1</span>
        <span style="font-size:12px;color:var(--muted2)">Voice-core failure modes — IMS registration, P-CSCF SIP 408/504 timeouts, RTP starvation, EN-DC desync, SRVCC, QCI/5QI mismatch — require core/IMS telemetry from the operator.</span>
      </div>

      <div style="display:flex;gap:8px">
        <button class="btn-primary" style="font-size:12px" onclick="navigate('rfagent')">View RF Fix Workflow →</button>
        <button class="btn-secondary" style="font-size:12px" onclick="navigate('datalayer')">Open in Data Layer</button>
      </div>
    </div>
  `;

  diagEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   COPILOT — Orchestrator Agent search responses (FB-12)
   ============================================================ */
function showCopilot(query) {
  const q = (query || '').toLowerCase();
  const overlay = document.getElementById('copilotOverlay');
  const body = document.getElementById('copilotBody');
  if (!overlay || !body) return;

  overlay.style.display = '';
  body.innerHTML = `<div class="cp-typing"><span></span><span></span><span></span></div>`;

  const responses = [
    { match: ['dcr', 'drop call', 'drop rate'],
      html: `<p><b style="color:var(--text)">Drop Call Rate across the cluster is currently <span style="color:var(--red)">2.4%</span></b> — above the 2.0% threshold for 3 consecutive windows on site <code style="background:var(--surface2);padding:1px 5px;border-radius:4px">SEA-BELL-047</code>.</p>
             <p style="margin-top:8px"><b>Root Cause (94% confidence):</b> EN-DC Desync on Sector 2 — 5G mmWave beam tracking failure causing LTE anchor drops.</p>
             <p style="margin-top:8px"><b>Recommended action:</b> Beam tilt -2° on Sector 2 + X2 handover threshold adjustment. Estimated DCR recovery in 30 min.</p>
             <div style="margin-top:12px;display:flex;gap:8px"><button class="btn-primary" style="font-size:11px" onclick="navigate('rfagent');document.getElementById('copilotOverlay').style.display='none'">View RF Fix Workflow →</button><button class="btn-secondary" style="font-size:11px" onclick="navigate('datalayer');document.getElementById('copilotOverlay').style.display='none'">View in Data Layer</button></div>` },
    { match: ['churn', 'retention'],
      html: `<p><b style="color:var(--text)">Avg Churn Rate: <span style="color:var(--red)">4.1%</span></b> — up 0.4% in the last 24h. Highest-risk zones: <b>Renton (8.2%)</b> and <b>Sammamish (7.8%)</b>.</p>
             <p style="margin-top:8px"><b>Cross-agent finding:</b> Churn in Renton correlates 0.89 with DCR spike — network quality is the primary driver, not pricing or competitor activity.</p>
             <p style="margin-top:8px"><b>Recommendation:</b> Fix SEA-BELL-047 first. Then deploy targeted retention campaign in Renton — projected churn reduction: 2.1% within 30 days.</p>
             <div style="margin-top:12px;display:flex;gap:8px"><button class="btn-primary" style="font-size:11px" onclick="navigate('mktgagent');document.getElementById('copilotOverlay').style.display='none'">View Marketing Agent →</button></div>` },
    { match: ['market share', 'market', 'share'],
      html: `<p><b style="color:var(--text)">Market Share: <span style="color:var(--red)">38.4%</span></b> — down 1.2% in 30 days. Competitor gaining in Bellevue and Issaquah.</p>
             <p style="margin-top:8px"><b>Opportunity (3 zones):</b> Bellevue Downtown (net score 87, share only 28%) + Issaquah (net 82, share 33%) + Mercer Island (net 88, share 72%) — $4.2M ARR potential.</p>
             <p style="margin-top:8px"><b>Blocked zones:</b> Renton, Sammamish — network must be fixed before campaigns will convert.</p>
             <div style="margin-top:12px;display:flex;gap:8px"><button class="btn-primary" style="font-size:11px" onclick="navigate('bizplan');document.getElementById('copilotOverlay').style.display='none'">View Business Plan →</button></div>` },
    { match: ['renton', 'sammamish', 'bellevue', 'kirkland', 'redmond', 'issaquah', 'mercer', 'bothell'],
      html: `<p><b style="color:var(--text)">Zone intelligence:</b> The Orchestrator has analyzed all 8 zones using Engineering + Marketing + Customer data.</p>
             <p style="margin-top:8px"><b>Critical zones:</b> Renton (churn 8.2%, DCR elevated) and Sammamish (network score 52/100, 3 site alarms) need immediate network investment.</p>
             <p style="margin-top:8px"><b>Growth zones:</b> Bellevue and Issaquah have strong network but low market share — prime for 5G speed campaigns.</p>
             <div style="margin-top:12px;display:flex;gap:8px"><button class="btn-primary" style="font-size:11px" onclick="navigate('bizplan');document.getElementById('copilotOverlay').style.display='none'">Open Business Plan Map →</button></div>` },
    { match: ['rf', 'engineer', 'site', 'sector', 'antenna', 'alarm', 'cell'],
      html: `<p><b style="color:var(--text)">Engineering Agent Status:</b> Monitoring 1,247 cell sites. 1 critical alarm active.</p>
             <p style="margin-top:8px"><b>Active issue:</b> <code style="background:var(--surface2);padding:1px 5px;border-radius:4px">SEA-BELL-047</code> Sector 2 — EN-DC Desync. DCR = 3.8% (threshold: 2.0%). Remediation awaiting Ops Manager approval.</p>
             <p style="margin-top:8px"><b>Parameter audit:</b> 5/8 parameters non-compliant across cluster. Most critical: p0NominalPUSCH deviation causing uplink coverage failures.</p>
             <div style="margin-top:12px;display:flex;gap:8px"><button class="btn-primary" style="font-size:11px" onclick="navigate('rfagent');document.getElementById('copilotOverlay').style.display='none'">RF Agent Workflow →</button><button class="btn-secondary" style="font-size:11px" onclick="navigate('datalayer');document.getElementById('copilotOverlay').style.display='none'">Data Layer</button></div>` },
    { match: ['throughput', 'sinr', 'rsrp', 'kpi', 'network', 'performance'],
      html: `<p><b style="color:var(--text)">Network KPI Summary:</b></p>
             <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px;font-size:12px">
               <div style="display:flex;justify-content:space-between"><span>Avg Throughput</span><b style="color:var(--green)">187 Mbps ↑</b></div>
               <div style="display:flex;justify-content:space-between"><span>Avg SINR</span><b style="color:var(--orange)">14.2 dB ↓</b></div>
               <div style="display:flex;justify-content:space-between"><span>Drop Call Rate</span><b style="color:var(--red)">2.4% ↑</b></div>
               <div style="display:flex;justify-content:space-between"><span>RRC Setup Success</span><b style="color:var(--green)">98.2% ✓</b></div>
               <div style="display:flex;justify-content:space-between"><span>Handover Success</span><b style="color:var(--green)">96.5% ✓</b></div>
             </div>
             <div style="margin-top:12px"><button class="btn-primary" style="font-size:11px" onclick="navigate('datalayer');document.getElementById('copilotOverlay').style.display='none'">View All KPIs →</button></div>` },
    { match: ['sales', 'revenue', 'store', 'b2b', 'retail'],
      html: `<p><b style="color:var(--text)">Sales Intelligence:</b> Retail store performance and B2B pipeline data now available in the Sales data category.</p>
             <p style="margin-top:8px">Top performing stores are co-located with high market share zones (Redmond Tech Corridor, Mercer Island). B2B pipeline strongest in enterprise corridors.</p>
             <div style="margin-top:12px"><button class="btn-primary" style="font-size:11px" onclick="dlViewState.cat='sales';dlViewState.kpiId='store_rev';navigate('datalayer');document.getElementById('copilotOverlay').style.display='none'">View Sales Layer →</button></div>` },
  ];

  const matched = responses.find(r => r.match.some(m => q.includes(m)));
  const finalHtml = matched ? matched.html : `<p>I'm the <b>PLATFORMX Orchestrator Agent</b> — cross-domain intelligence across Engineering, Marketing, Customer, Sales and GIS data.</p>
    <p style="margin-top:8px">Try asking about: <b>DCR</b>, <b>churn</b>, <b>market share</b>, <b>Renton</b>, <b>RF alarms</b>, <b>throughput</b>, <b>sales</b>, or any zone name.</p>
    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
      ${['View Business Plan', 'RF Agent Workflow', 'Data Layer KPIs', 'Agent Fleet', 'Use-Case Gallery'].map((l,i) =>
        `<button class="btn-secondary" style="font-size:11px" onclick="navigate(['bizplan','rfagent','datalayer','agents','gallery'][${i}]);document.getElementById('copilotOverlay').style.display='none'">${l}</button>`
      ).join('')}
    </div>`;

  setTimeout(() => { body.innerHTML = finalHtml; }, 600);
}

/* ============================================================
   DATA LAYER — Correlate / RCA engine (FB-01)
   ============================================================ */
function _renderDLCorrelateHTML() {
  const corrPairs = [
    { a:'Drop Call Rate', b:'Churn Rate',      r: 0.89, col:'#EF4444', desc:'Network quality drives churn — every 1% DCR rise → 0.7% churn increase within 14 days.' },
    { a:'EN-DC Desync', b:'IMS Complaints',    r: 0.94, col:'#EF4444', desc:'5G anchor failure causes VoLTE drops → customer complaints spike within hours.' },
    { a:'Market Share', b:'ARPU',              r: 0.72, col:'#22C55E', desc:'Higher share zones attract premium subscribers with higher ARPU.' },
    { a:'Site Utilisation', b:'Drop Call Rate',r: 0.68, col:'#F97316', desc:'Overloaded PRBs cause admission failures → call drops during peak hours.' },
    { a:'Retail Store Perf.', b:'Net Adds',    r: 0.61, col:'#8B5CF6', desc:'Zones with strong store performance show higher subscriber net additions.' },
    { a:'Drive Test Score', b:'Ookla Speed',   r: 0.83, col:'#06B6D4', desc:'Drive test scores align strongly with crowdsourced speed measurements (Ookla).' },
  ];

  const allOptions = DL_CATS.flatMap(c => c.kpis.map(k => `<option value="${c.id}__${k.id}">${c.name} · ${k.name}</option>`)).join('');

  return `
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-title">🔍 Cross-Category Signal Correlation Engine</div>
        <div style="font-size:12px;color:var(--muted2);margin-bottom:14px">Select two signals from the shared data layer to discover causal relationships and root causes. Uses Pearson correlation across zone-level data.</div>
        <div class="grid-2" style="gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px;display:block;margin-bottom:6px">Signal A — Trigger / Cause</label>
            <select id="corrSigA" style="width:100%;padding:8px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-family:inherit;outline:none">${allOptions}</select>
          </div>
          <div>
            <label style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px;display:block;margin-bottom:6px">Signal B — Outcome / Effect</label>
            <select id="corrSigB" style="width:100%;padding:8px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-family:inherit;outline:none">${allOptions}</select>
          </div>
        </div>
        <button class="btn-primary" onclick="dlRunCorrelation()">Run Correlation Analysis →</button>
      </div>

      <div id="corrResult"></div>

      <div class="card" style="border-color:rgba(8,145,178,.2);background:rgba(8,145,178,.03)">
        <div class="card-title">📊 Pre-built Correlation Pairs — Engineering × Marketing × Customer</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${corrPairs.map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:8px 10px;background:var(--surface2);border-radius:6px;border-left:3px solid ${p.col}">
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${p.a} ↔ ${p.b}</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">${p.desc}</div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:16px;font-weight:700;color:${p.col}">r = ${p.r}</div>
                <div style="font-size:10px;color:var(--muted)">${p.r >= 0.8 ? 'Strong' : p.r >= 0.6 ? 'Moderate' : 'Weak'}</div>
              </div>
            </div>`).join('')}
        </div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn-primary" style="font-size:11px" onclick="navigate('rfagent')">View RF Fix Workflow →</button>
          <button class="btn-secondary" style="font-size:11px" onclick="dlSwitchMode('explore')">Back to Explore</button>
        </div>
      </div>
    </div>`;
}

window.dlRunCorrelation = function() {
  const sigA = (document.getElementById('corrSigA') || {}).value || '';
  const sigB = (document.getElementById('corrSigB') || {}).value || '';
  const [catAId, kpiAId] = sigA.split('__');
  const [catBId, kpiBId] = sigB.split('__');
  const catA = DL_CATS.find(c => c.id === catAId);
  const catB = DL_CATS.find(c => c.id === catBId);
  const kpiA = catA ? catA.kpis.find(k => k.id === kpiAId) : null;
  const kpiB = catB ? catB.kpis.find(k => k.id === kpiBId) : null;
  const nameA = kpiA ? `${catA.name} · ${kpiA.name}` : sigA;
  const nameB = kpiB ? `${catB.name} · ${kpiB.name}` : sigB;

  const lookup = {
    [`${kpiAId}_${kpiBId}`]: null, [`${kpiBId}_${kpiAId}`]: null,
    dcr_churn:   { r: 0.89, col:'#EF4444', label:'Strong Positive', insight:'Every 1% DCR increase correlates with a 0.7% churn rise within 14 days. Network quality is the #1 predictor of churn in this cluster. Fix SEA-BELL-047 to begin churn recovery in Bellevue.' },
    dcr_tktvol:  { r: 0.91, col:'#EF4444', label:'Strong Positive', insight:'Call drops are the primary driver of support ticket volume. Resolving the EN-DC desync will reduce ticket load by an estimated 35–40% in the Bellevue zone.' },
    dcr_ms:      { r:-0.76, col:'#3B82F6', label:'Strong Negative',  insight:'Poor call quality erodes market share over 30–60 days. Effect is strongest in enterprise segments. Network fix before campaign spend.' },
    sinr_thrpt:  { r: 0.84, col:'#22C55E', label:'Strong Positive', insight:'SINR is the primary throughput determinant. Each 1 dB SINR improvement yields ~8% DL throughput gain in this RAN configuration.' },
    churn_arpu:  { r:-0.67, col:'#F97316', label:'Moderate Negative',insight:'High-churn zones show lower ARPU — premium subscribers exit faster. Priority intervention in Renton and Sammamish to protect revenue.' },
    ms_arpu:     { r: 0.72, col:'#22C55E', label:'Strong Positive', insight:'Market share leadership co-locates with higher ARPU segments. Defending Redmond Tech Corridor protects $4.8M ARR.' },
    siteutl_dcr: { r: 0.68, col:'#8B5CF6', label:'Moderate Positive',insight:'High site utilisation precedes DCR spikes by ~2 hours. Capacity relief (load balancing or new site) will reduce drops by 30–40%.' },
    ret_store_netadd: { r:0.61, col:'#8B5CF6', label:'Moderate Positive', insight:'Zones with strong retail store performance show higher subscriber net additions. Correlates with 3–4 week lag suggesting store-driven acquisition.' },
    drivetest_ookla: { r:0.83, col:'#06B6D4', label:'Strong Positive', insight:'Drive test scores align strongly with crowdsourced Ookla measurements confirming network model accuracy.' },
  };

  const key = `${kpiAId}_${kpiBId}`;
  const rkey = `${kpiBId}_${kpiAId}`;
  const result = lookup[key] || lookup[rkey] || { r: +(0.28 + Math.random() * 0.22).toFixed(2), col:'#64748B', label:'Weak / Inconclusive', insight:`No strong causal relationship found between ${nameA} and ${nameB} in the current data window (8 zones, 24h). Try pairing Engineering signals with Marketing or Customer outcomes for stronger cross-domain insights.` };

  const rBar = Math.abs(result.r) * 100;
  const rSign = result.r >= 0 ? '+' : '';
  const el = document.getElementById('corrResult');
  if (!el) return;
  el.innerHTML = `
    <div class="card" style="border-color:${result.col}44">
      <div class="card-title" style="margin-bottom:14px">🧠 Correlation Result — Orchestrator RCA Output</div>
      <div class="grid-2" style="gap:20px">
        <div>
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
              <span style="color:var(--muted)">Signal A</span><b>${nameA}</b>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">
              <span style="color:var(--muted)">Signal B</span><b>${nameB}</b>
            </div>
          </div>
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:11px;color:var(--muted)">Pearson r</span>
              <span style="font-size:24px;font-weight:700;color:${result.col}">${rSign}${result.r}</span>
            </div>
            <div style="height:8px;background:var(--surface2);border-radius:100px;overflow:hidden">
              <div style="height:100%;width:${rBar}%;background:${result.col};border-radius:100px;transition:width .5s ease"></div>
            </div>
          </div>
          <span style="display:inline-block;padding:3px 12px;background:${result.col}22;color:${result.col};border-radius:100px;font-size:11px;font-weight:600;margin-top:4px">${result.label} Correlation</span>
        </div>
        <div class="agent-insight">
          <div class="agent-insight-head">🧠 Orchestrator Agent · RCA Insight</div>
          <p>${result.insight}</p>
          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn-primary" style="font-size:11px" onclick="navigate('rfagent')">View RF Fix →</button>
            <button class="btn-secondary" style="font-size:11px" onclick="dlSwitchMode('explore')">Back to Explore</button>
          </div>
        </div>
      </div>
    </div>`;
};

window.dlSwitchMode = function(mode) {
  dlViewMode = mode;
  if (mode === 'explore') {
    renderDataLayer(document.getElementById('viewWrap'));
  } else {
    // Just replace right panel content
    renderDataLayer(document.getElementById('viewWrap'));
  }
};

/* ============================================================
   GIS GEOGRAPHY HIERARCHY (FB-09)
   ============================================================ */
window.bizGeoLevel = function(btn, level) {
  document.querySelectorAll('.geo-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const labels = { country:'Country level · USA', state:'State level · Washington', city:'City level · Seattle Metro', zone:'Zone level · 8 zones' };
  const el = document.getElementById('geoLevelLabel');
  if (el) el.innerHTML = `→ Viewing: <b style="color:var(--text)">${labels[level] || level}</b>`;
  // Notify user that other levels would drill into live data
  if (level !== 'zone') {
    const msg = { country:'National view — drill down to a state to continue.', state:'State view — drill down to a city to continue.', city:'City view — select a city district to continue.' };
    const ip = document.getElementById('insightPanel');
    if (ip) {
      const note = ip.querySelector('.geo-drill-note');
      if (note) note.remove();
      const div = document.createElement('div');
      div.className = 'card geo-drill-note';
      div.style.cssText = 'border-color:rgba(8,145,178,.3);background:rgba(8,145,178,.05);margin-bottom:0;text-align:center;padding:18px';
      div.innerHTML = `<div style="font-size:20px;margin-bottom:6px">🗺️</div><div style="font-size:13px;font-weight:600;margin-bottom:4px">${msg[level]}</div><div style="font-size:11px;color:var(--muted)">In production, this would load live operator data at ${labels[level]}.</div>`;
      ip.insertBefore(div, ip.firstChild);
    }
  } else {
    const note = document.querySelector('.geo-drill-note');
    if (note) note.remove();
  }
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.view));
  });

  // Inject copilot overlay into DOM
  const cpEl = document.createElement('div');
  cpEl.className = 'copilot-overlay';
  cpEl.id = 'copilotOverlay';
  cpEl.style.display = 'none';
  cpEl.innerHTML = `
    <div class="copilot-card">
      <div class="cp-head">
        <div class="cp-avatar">🧠</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:var(--text)">PLATFORMX Orchestrator Agent</div>
          <div style="font-size:11px;color:var(--muted)">Cross-domain intelligence · Always on</div>
        </div>
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--green);margin-right:10px">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;animation:pulse 1.5s infinite"></span>Active
        </div>
        <button onclick="document.getElementById('copilotOverlay').style.display='none'"
          style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:16px;padding:4px 8px;line-height:1">✕</button>
      </div>
      <div id="copilotBody" class="cp-body"></div>
      <div class="cp-footer">
        <span>Ask about any KPI, zone, agent or workflow</span>
        <span style="color:var(--brand);font-size:10px;font-weight:600">Simulated · Synthetic data</span>
      </div>
    </div>`;
  document.body.appendChild(cpEl);

  const gsInput = document.getElementById('globalSearch');

  gsInput.addEventListener('focus', () => {
    if (gsInput.value.trim().length > 0) showCopilot(gsInput.value);
  });

  gsInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('copilotOverlay').style.display = 'none';
      gsInput.blur();
      return;
    }
    if (e.key !== 'Enter') return;
    const q = e.target.value.trim();
    if (q) showCopilot(q);
  });

  document.addEventListener('click', e => {
    const overlay = document.getElementById('copilotOverlay');
    if (overlay && overlay.style.display !== 'none' && !overlay.contains(e.target) && e.target !== gsInput) {
      overlay.style.display = 'none';
    }
  });

  navigate('home');
});
