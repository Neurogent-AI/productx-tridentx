# PlatformX — Prototypes

Clickable, demo-grade prototypes for **PlatformX**, the telecom **data + agentic use-case marketplace** (Neurogent.ai for TridentX). The current scope follows **PRD v0.2** (`docs/PlatformX_PRD_Neurogent_v0.2.md`), which records the **Jun-11 pivot: the MVP is now the marketplace itself**, not a single use-case. (v0.1 is kept for history.)

| | What it is | Folder |
|---|---|---|
| **① MVP — the Marketplace** | All data categories in one place + the analytics journey (**reactive → proactive → diagnostic RCA**) + a **build-your-own wizard** + the **Operator Business Plan** flagship use-case + **RF Engineer Agent** as a secondary example. Synthetic data; predictive/prescriptive locked. | [`mvp/`](./mvp) |
| **② Full product — the Mature Marketplace** | Everything in the MVP **plus** unlocked **predictive & prescriptive** (forecasts + closed-loop actions), **services / co-build**, and a **multi-vertical** switch (telecom · data center · fiber · satellite). | [`platform/`](./platform) |
| **③ Legacy RF console** | The original v0.1 MVP — the **RF Engineer Agent** built deep (KPI/alarm/GIS + agent). Preserved, runnable, and folded into the marketplace as the RF use-case. | [`mvp-rf-legacy/`](./mvp-rf-legacy) |

All are **vanilla HTML/CSS/JS** — no build, no backend, no install. Same **Network Blue** design system (light mode), modeled on scaled AI products (streaming answers, reasoning traces, source citations) and enterprise observability tools.

---

## Run

Each app is self-contained. Open its `index.html`, or serve the folder (recommended so the GIS basemap loads cleanly):

```bash
cd mvp           && python3 -m http.server 8000   # ① Marketplace MVP    → :8000
cd platform      && python3 -m http.server 8001   # ② Full product       → :8001
cd mvp-rf-legacy && python3 -m http.server 8002   # ③ Legacy RF console  → :8002
```

> Map tiles (CARTO), charts (Chart.js) and fonts (Inter / IBM Plex Mono) load from CDNs, so a connection is recommended. Everything else — all data and the agent/RCA reasoning — runs in the browser and is **deterministic**, so live demos are repeatable.

Each folder has its own `README.md` with a screen-by-screen guide.

---

## What to try first

**① MVP →** open **Data Layer → Correlate · RCA engine →** "Try: market share ✕ drop-call". It correlates two *different* data categories (**r ≈ −0.93**) and explains, grounded: *the market-share decline tracks the rise in drop-call rate → churn is network-driven, not pricing.* That single-pane, cross-silo root-cause is the marketplace's core pitch. Then open the **Operator Business Plan** flagship and ask *"Where should we densify next quarter?"*.

**② Full product →** open **Predictive & Prescriptive** to see ML forecasts and **Apply (simulate)** a prescriptive action into closed-loop tracking; flip the **vertical** switcher on the Command Center.

**③ Legacy →** the deep RF Engineer Agent — ask *"Why is throughput low on the worst 5G site?"* for the root-cause diagnosis (VSWR alarm + P1 ticket correlation).

---

## The pivot (PRD v0.1 → v0.2)

| v0.1 (original) | v0.2 (after Jun-11 with TridentX) |
|---|---|
| Build **one use-case deep** (RF Agent); phase the marketplace. | Build the **marketplace itself** as the MVP — "the marketplace is the secret sauce." |
| RF Agent is the flagship. | **Operator Business Plan** is the flagship (spans engineering + marketing + customer + demographics); RF Agent is a secondary example. |
| Predictive/prescriptive in Phase 2. | Still deferred — **locked in the MVP**, **unlocked in the full product**. |

Sources: `meeting_transcription/transcription_2_june.docx.md`, `transcription_11_june.docx.md`.

---

## Layout
```
tridentx_product/
├── README.md            ← you are here
├── docs/                ← PRD v0.2 (current), v0.1 (history), source docs
├── mvp/                 ← ① Marketplace MVP
├── platform/            ← ② Full product
└── mvp-rf-legacy/       ← ③ Legacy standalone RF console
```
