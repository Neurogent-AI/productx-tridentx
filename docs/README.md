# PLATFORMX by TRIDENTX — Full-Product Prototype · *The Mature Marketplace*

> The full vision behind the MVP (PRD v0.2/v0.3, §3, §7–§8): the marketplace at maturity. Everything in the Marketplace MVP **plus** the advanced tier — unlocked predictive & prescriptive analytics, the services/co-build motion, and multi-vertical reach.

Vanilla **HTML/CSS/JS**, no build, Network Blue light theme.

### Jun-18 client feedback — folded in (PRD v0.3 §0)
- **Guided Drop-Call RCA** (`#/rca`, `assets/js/rca.js`): two-step agentic RCA — filter sites by **city / county / zip** → ranked drop-call list + **GIS map** → per-site root-cause across the **five failure domains** (handover, alarms, capacity, radio-access, coverage), each backed by the synthetic KPIs/alarms/params. Reached from the Data Layer correlation ("Investigate drop calls") and from the chat agent. IMS/core/VoLTE modes shown as a **Phase-1 "deeper layer"**.
- **GIS on the Data Layer**: each raw-data signal now plots its sites on a map (feedback #2).
- **Parameter audit vs golden set** + **proactive alert → JIRA / ServiceNow / SMS / email** routing in the Data Layer (feedback #3).
- **T-PIM → Generic Performance Counters** in the Data Marketplace; **ALL-CAPS** branding (feedback #3, #4).

---

## Run it
```
cd platform
python3 -m http.server 8001      # → http://localhost:8001
```
or open `index.html`. (CDN map/charts/fonts — connection recommended.)

---

## What it adds over the MVP

| Surface | What's new vs. the MVP |
|---|---|
| **Data Layer** | Same single-pane data layer + RCA engine (shared module). |
| **Predictive & Prescriptive** ⭐ | **Unlocked.** ML **forecasts** (market share, churn) with confidence bands, and **prescriptive actions** with **closed-loop action → result** tracking ("Apply (simulate)"). Locked in the MVP. |
| **Use-Case Builder** | The maturity ladder's **predictive & prescriptive rungs are selectable** (not locked). |
| **Command Center** | A **multi-vertical switcher** — Telecom · Data Center · Fiber · Satellite (same fabric, vertical-tuned). |
| **Governance & Security** | Connectors, residency, roles, audit (deeper). |
| **Use-cases** | Operator Business Plan (flagship) + RF Engineer Agent + template gallery; omni-agent across all data. |

## What to try
1. **Predictive & Prescriptive →** see the forecast cones, then **Apply (simulate)** a prescriptive action and watch it move to **closed-loop tracking**.
2. **Command Center →** flip the **vertical** switcher (Telecom → Data Center → …).
3. **Use-Case Builder →** notice predictive/prescriptive are now **unlocked**.
4. **Data Layer →** the same reactive/proactive/diagnostic RCA engine as the MVP.

## How it maps to PRD v0.2
This prototype makes the **Phase 1–2** end-state tangible: predictive (Phase 1) and prescriptive/closed-loop + multi-vertical + services (Phase 2). On synthetic data the advanced tier is a **preview** — validated with real data via a design-partner POC.

## Source layout
```
platform/
├── index.html
└── assets/
    ├── css/{design-system.css, app.css}
    └── js/
        ├── data.js · data-platform.js · data-explore.js
        ├── agent.js · agent-platform.js · chat.js
        ├── components.js · charts.js · map.js · router.js
        └── app.js   # all surfaces incl. Predictive/Prescriptive, verticals
```
Separate, self-contained source tree.
