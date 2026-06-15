# PlatformX — MVP Prototype · *The Marketplace*

> **Phase 0 / MVP (PRD v0.2)** — after the Jun-11 TridentX kickoff, **the MVP is the marketplace itself**, not one use-case built deep. See `docs/PlatformX_PRD_Neurogent_v0.2.md` (§0 records the pivot; v0.1 is retained for history).

A web **marketplace** that puts every telecom data category in one place (a single pane of glass), lets you move through the analytics journey — **reactive → proactive → diagnostic** — build your own use-case in a **wizard**, and opens one **flagship use-case end-to-end (Operator Business Plan)** plus the **RF Engineer Agent** as a secondary example. All on **synthetic data**. Vanilla **HTML/CSS/JS**, no build, Network Blue light theme.

---

## Run it
```
cd mvp
python3 -m http.server 8000      # → http://localhost:8000
```
or open `index.html`. (Map tiles, charts & fonts load from CDNs — a connection is recommended.) The RF workspace's "Standalone console ↗" opens the preserved RF app at `../mvp-rf-legacy/`.

---

## The surfaces

| Surface | What it is |
|---|---|
| **Command Center** | Single pane of glass across all data categories; omni-agent search; quick links; "Simulated data" badge. |
| **Data Layer** ⭐ | The heart of the MVP. Browse **all categories** (Engineering, Marketing, Customer Feedback, Third-Party) → open a KPI to a **trend** (reactive) → set a **threshold → alert** (proactive) → switch to the **Correlation / RCA engine** to correlate signals *across categories* (diagnostic). |
| **Data Marketplace** | The full data taxonomy + connectors; synthetic sources "Connected", real ones "Request access". |
| **Build a Use-Case** | Guided wizard: define → select data → analytics maturity → views → agent → publish to the gallery. **Predictive & prescriptive are locked** ("Full product / Phase 2"). |
| **Use-Case Gallery** | Cards for the flagship + examples + your published journeys. |
| **Operator Business Plan** (flagship) | Multi-data (marketing + customer + demographics + GIS) workspace: markets, share, churn, ARPU, a densification map, and a **Business-Planning agent**. |
| **RF Engineer Agent** (secondary example) | Compact RF workspace (KPI/alarm/GIS + agent); deep standalone version in `../mvp-rf-legacy/`. |

## The demo (what to try)
1. **Data Layer → Correlate · RCA engine →** "Try: market share ✕ drop-call" → see **r ≈ −0.93**, the overlay, and the grounded insight: *the market-share decline tracks the rise in drop-call rate → churn is network-driven*. This is Gurtaj's exact example, live.
2. **Data Layer → Explore & alert →** pick any KPI, drag the **threshold** → watch the **alert** fire.
3. **Build a Use-Case →** run the wizard; note predictive/prescriptive are **locked** (they live in the full product).
4. **Operator Business Plan →** ask the agent *"Where should we densify next quarter?"*; **RF Engineer Agent →** ask *"Why is throughput low on the worst 5G site?"*.

## How it maps to PRD v0.2
- MVP = **marketplace** (data layer + journey + wizard + flagship + RF example), all synthetic (§6).
- Analytics journey **reactive/proactive/diagnostic** is interactive; **predictive/prescriptive locked** to the full product (§9).
- Business Plan is the **flagship** (multi-data), RF Agent the **secondary** example (§0, §6.4–6.5).

## Source layout
```
mvp/
├── index.html
└── assets/
    ├── css/{design-system.css, app.css}
    └── js/
        ├── data.js · data-platform.js · data-explore.js   # synthetic data + Data Layer/RCA engine
        ├── agent.js · agent-platform.js · chat.js          # omni agent (RF + business) + chat UI
        ├── components.js · charts.js · map.js · router.js
        └── app.js                                          # marketplace views + wiring
```
Separate, self-contained source tree (shares no files with `platform/` or `mvp-rf-legacy/`).
