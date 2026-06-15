# PlatformX — Legacy Standalone Console · *Agentic AI RF Engineer*

> **📌 Status note (post Jun-11 pivot):** This is the original v0.1 MVP — a single use-case built deep. After the TridentX kickoff (Jun 11), the MVP scope changed to **the marketplace itself** (see `docs/PlatformX_PRD_Neurogent_v0.2.md`). This RF console is **preserved here, runnable standalone**, and is also **folded into the new marketplace MVP** (`../mvp/`) as the *RF Engineer Agent* use-case. Kept for reference and as a deep demo of one use-case.

> **Phase 0 / MVP (v0.1)** from the PlatformX PRD (`docs/PlatformX_PRD_Neurogent_v0.1.md`, §6).
> One use-case built deep: a conversational **RF Engineer Agent** + a unified **KPI / alarm / GIS** network-operations console, running entirely on **synthetic telecom data**. Built to be a credible, live, demo-grade product to show Tier-1 operators.

Vanilla **HTML / CSS / JS** — no build step, no framework, no backend. Theme: **Network Blue**, light mode.

---

## Run it

The map basemap and chart/font libraries load from CDNs, so a network connection is recommended. Because the app fetches nothing locally (all data is generated in-browser), you can simply open the file **or** serve it.

**Option A — open directly**
```
open index.html          # macOS
```

**Option B — serve (recommended; cleanest map tiles)**
```
cd mvp
python3 -m http.server 8000
# visit http://localhost:8000
```

No install. No API keys. Everything is deterministic — the same synthetic network appears every reload.

---

## What's inside (the demo)

| Screen | What it shows | PRD link |
|---|---|---|
| **Network Overview** | "One view": network-avg KPI cards (sparkline + 24h delta), live trend chart, site-health donut, **GIS map** color-coded by health, active-alarms feed | §6.3 |
| **Sites** | Filterable/searchable table of all 124 sites (underperforming / critical / by tech) → drill into any site | §6.1 |
| **Site detail** | Composite health, sectors, **agent root-cause correlation banner**, KPI sparkline tiles, KPI trend charts, location map, alarms & tickets | §6.2–6.3 |
| **Alarms** | All active alarms by severity, linked to sites | §6.1 |
| **GIS Map** | Full-screen health-coded site map (Seattle metro) | §6.3 |
| **RF Engineer Agent** | Full conversational agent — streaming answers, visible reasoning trace, rich grounded answers (charts, site/alarm/ticket cards, inline maps), **source citations**, follow-ups | §6.2 |
| **Copilot (docked)** | The same agent docked beside any dashboard — "ask about what you see"; highlights sites on the live map | §6.3 |

### The hero demo script (ask these in the agent)
1. **"Which sites are underperforming today?"** → ranked worst sites + map highlight.
2. **"Why is throughput low on the worst 5G site?"** → the diagnostic *wow*: detects the ~85% throughput collapse on **SEA-0009**, correlates it with a coincident **VSWR** alarm and an open **P1** ticket, and concludes *antenna/feeder-line fault — not congestion*, with a recommended field action.
3. **"Summarize the open alarms on the critical sites"**, **"Show me the worst retainability sites"**, **"What changed in the last 24 hours?"**

You can also type a site (e.g. `SEA-0009`) in the top search to jump straight to it, or press `/` to focus search.

---

## How it maps to the PRD

- **Analytics maturity:** reactive + early-diagnostic only (§9). No prediction/prescription — that's honest to the phase.
- **Synthetic data (§6.1):** 124 sites across Greater Seattle, 1–3 sectors each, LTE/5G, full KPI set (SINR, RSRP, throughput, latency; accessibility & retainability success rates; DCR, AFR) as 72h time-series with **injected degradations**, alarms, and trouble tickets — so underperforming sites genuinely exist to find.
- **The agent** is grounded in that dataset and cites its sources on every answer. In production this reasoning runs on the latest **Claude** model (§6.2); here it's a deterministic engine so the live demo is identical every time.

---

## Source layout

```
mvp/
├── index.html                 # app shell + script/style wiring
└── assets/
    ├── css/
    │   ├── design-system.css  # Network Blue tokens + components
    │   └── app.css            # agent chat / copilot / map / view styles
    └── js/
        ├── data.js            # deterministic synthetic data generator
        ├── components.js      # icons + DOM/format helpers
        ├── charts.js          # SVG sparklines + Chart.js wrappers
        ├── map.js             # Leaflet GIS map
        ├── agent.js           # RF Agent reasoning engine (grounded intents)
        ├── chat.js            # streaming + trace + citation render engine
        ├── router.js          # hash router (works from file://)
        └── app.js             # views + wiring
```

Third-party (CDN, no install): Chart.js, Leaflet + CARTO Positron tiles, Google Fonts (Inter / IBM Plex Mono).
