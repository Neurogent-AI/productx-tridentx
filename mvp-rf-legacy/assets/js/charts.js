/* ============================================================================
   PlatformX MVP — chart helpers
   SVG sparklines (zero-dep) + Chart.js wrappers (line / donut) with fallback.
   Exposes window.CHARTS
   ========================================================================== */
(function () {
  "use strict";
  const COL = {
    brand: "#2563EB", brand7: "#1E40AF", cyan: "#06B6D4",
    ok: "#16A34A", warn: "#E0900B", crit: "#DC2626", info: "#0EA5E9",
    grid: "#EDF1F6", text: "#64748B", violet: "#7C3AED",
  };
  const hasChart = () => typeof window.Chart !== "undefined";

  /* ---- inline SVG sparkline (used in KPI stat cards) ---- */
  function sparkline(values, opts) {
    opts = opts || {};
    const w = opts.w || 92, h = opts.h || 34, pad = 2;
    const min = Math.min(...values), max = Math.max(...values);
    const rng = (max - min) || 1;
    const stroke = opts.color || COL.brand;
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / rng) * (h - pad * 2);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = line + ` L${(w - pad).toFixed(1)} ${h - pad} L${pad} ${h - pad} Z`;
    const gid = "sg" + Math.random().toString(36).slice(2, 8);
    const last = pts[pts.length - 1];
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${stroke}" stop-opacity=".22"/>
        <stop offset="1" stop-color="${stroke}" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${area}" fill="url(#${gid})"/>
      <path d="${line}" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.2" fill="${stroke}"/>
    </svg>`;
  }

  const registry = [];
  function destroyAll() { registry.forEach(c => { try { c.destroy(); } catch (e) {} }); registry.length = 0; }

  function baseOpts(extra) {
    return Object.assign({
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0F172A", padding: 10, cornerRadius: 8, titleFont: { family: "Inter", size: 11 },
          bodyFont: { family: "IBM Plex Mono", size: 12 }, displayColors: true, boxPadding: 4,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: COL.text, font: { family: "Inter", size: 10 }, maxRotation: 0, autoSkipPadding: 16 }, border: { display: false } },
        y: { grid: { color: COL.grid }, ticks: { color: COL.text, font: { family: "IBM Plex Mono", size: 10 }, padding: 6 }, border: { display: false } },
      },
    }, extra || {});
  }

  function timeLabels(timeline) {
    return timeline.map(t => new Date(t).toLocaleTimeString([], { hour: "2-digit", hour12: false }) + ":00");
  }

  /* ---- line chart ---- */
  function line(canvas, labels, datasets, opts) {
    if (!hasChart()) { fallback(canvas); return null; }
    const ds = datasets.map(d => ({
      label: d.label, data: d.data, borderColor: d.color || COL.brand,
      backgroundColor: (ctx) => {
        const { ctx: c, chartArea } = ctx.chart; if (!chartArea) return "transparent";
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, (d.color || COL.brand) + "33"); g.addColorStop(1, (d.color || COL.brand) + "00"); return g;
      },
      borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: .35, fill: d.fill !== false,
      borderDash: d.dash || [],
    }));
    const c = new Chart(canvas.getContext("2d"), { type: "line", data: { labels, datasets: ds }, options: baseOpts(opts) });
    registry.push(c); return c;
  }

  /* ---- bar chart ---- */
  function bar(canvas, labels, data, opts) {
    if (!hasChart()) { fallback(canvas); return null; }
    opts = opts || {};
    const c = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: opts.colors || COL.brand, borderRadius: 4, maxBarThickness: opts.thick || 16 }] },
      options: baseOpts(opts.options),
    });
    registry.push(c); return c;
  }

  /* ---- donut ---- */
  function donut(canvas, data, colors) {
    if (!hasChart()) { fallback(canvas); return null; }
    const c = new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: { datasets: [{ data, backgroundColor: colors, borderWidth: 0, cutout: "72%", borderRadius: 4, spacing: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true, backgroundColor: "#0F172A", padding: 9, cornerRadius: 8 } } },
    });
    registry.push(c); return c;
  }

  function fallback(canvas) {
    const p = canvas.parentElement;
    if (p) p.innerHTML = '<div class="empty" style="padding:28px"><div class="muted">Chart library offline — connect to the internet to render trend charts.</div></div>';
  }

  window.CHARTS = { sparkline, line, bar, donut, destroyAll, timeLabels, COL };
})();
