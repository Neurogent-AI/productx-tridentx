/* ============================================================================
   PlatformX MVP — UI helpers + inline icon set (no icon-font dependency)
   Exposes window.UI
   ========================================================================== */
(function () {
  "use strict";

  /* ---- icon library (Lucide-style 24x24 stroke paths) ---- */
  const P = {
    overview: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    sites: '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/>',
    tower: '<path d="M12 3v18"/><path d="M7.5 7a6 6 0 0 1 9 0"/><path d="M5 4.5a9 9 0 0 1 14 0"/><path d="M9.5 10.5 12 13l2.5-2.5"/><path d="m9 21 3-8 3 8"/>',
    alarm: '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    agent: '<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    spark: '<path d="m13 2-3 8h6l-3 8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>',
    send: '<path d="M14.5 4 21 12l-6.5 8M21 12H4"/>',
    sendup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    checkcircle: '<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    chevdown: '<path d="m6 9 6 6 6-6"/>',
    arrowup: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowdown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    location: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    gauge: '<path d="M12 13 16 9"/><path d="M3.5 18a9 9 0 1 1 17 0"/>',
    ticket: '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    star: '<path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 18l-6.6 3.1L6.7 14l-5-4.8 7-.8z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    play: '<path d="m6 4 14 8-14 8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    dollar: '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
    puzzle: '<path d="M9 3a2 2 0 0 1 4 0v1h3a1 1 0 0 1 1 1v3h1a2 2 0 0 1 0 4h-1v3a1 1 0 0 1-1 1h-3v1a2 2 0 0 1-4 0v-1H6a1 1 0 0 1-1-1v-3H4a2 2 0 0 1 0-4h1V5a1 1 0 0 1 1-1h3z"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4-5.6"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    rocket: '<path d="M5 13c-1.5 1.3-2 5-2 5s3.7-.5 5-2M14 7l3 3M9 15l-3-3a11 11 0 0 1 9-9 11 11 0 0 1 0 4 11 11 0 0 1-9 9z"/><circle cx="15" cy="9" r="1"/>',
    wand: '<path d="m15 4 5 5L9 20l-5 1 1-5z"/><path d="M14 5 3 16"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5 6.5 17M12 7.5 17.5 17M7.5 19h9"/>',
    store: '<path d="M4 9h16l-1-5H5z"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M9 20v-6h6v6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    arrowright: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };
  function icon(name, cls) {
    const d = P[name] || P.info;
    // class "ic" -> default 1em size (see .ic in design-system.css). Any higher-
    // specificity rule like ".btn svg{width:16px}" still overrides it. Without
    // this, an unstyled icon would render at the SVG default 300x150 (giant).
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ic${cls ? " " + cls : ""}">${d}</svg>`;
  }

  /* ---- DOM helpers ---- */
  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---- formatting ---- */
  function timeAgo(ts) {
    const d = (Date.now() - ts) / 1000;
    if (d < 60) return "just now";
    if (d < 3600) return Math.floor(d / 60) + "m ago";
    if (d < 86400) return Math.floor(d / 3600) + "h ago";
    return Math.floor(d / 86400) + "d ago";
  }
  function clock(ts) { return new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }

  function statusPill(status, label) {
    const map = { ok: "ok", warn: "warn", crit: "crit" };
    const txt = label || ({ ok: "Healthy", warn: "Degraded", crit: "Critical" }[status]);
    return `<span class="pill ${map[status] || "neutral"}"><span class="dot"></span>${txt}</span>`;
  }
  function sevPill(sev) {
    const map = { crit: ["crit", "Critical"], warn: ["warn", "Major"], info: ["info", "Info"] };
    const [c, t] = map[sev] || ["neutral", sev];
    return `<span class="pill ${c}"><span class="dot"></span>${t}</span>`;
  }
  function techPill(tech) { return `<span class="pill ${tech === "5G" ? "violet" : "info"}">${tech}</span>`; }

  function deltaTag(delta, dir) {
    // dir: 'up' good when value increases; for 'down' KPIs invert color
    const goodWhenUp = dir !== "down";
    const positive = delta >= 0;
    const good = goodWhenUp ? positive : !positive;
    if (Math.abs(delta) < 0.05) return `<span class="delta flat">${icon("trend")}0.0%</span>`;
    const cls = good ? "up" : "down";
    const ic = positive ? "arrowup" : "arrowdown";
    return `<span class="delta ${cls}">${icon(ic)}${Math.abs(delta).toFixed(1)}%</span>`;
  }

  /* ---- toast ---- */
  let toastWrap;
  function toast(msg, ms) {
    if (!toastWrap) { toastWrap = el("div", { class: "toast-wrap" }); document.body.appendChild(toastWrap); }
    const t = el("div", { class: "toast", html: `${icon("checkcircle")}<span>${esc(msg)}</span>` });
    toastWrap.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = ".3s"; setTimeout(() => t.remove(), 300); }, ms || 2400);
  }

  /* ---- modal ---- */
  function modal(contentHTML, opts) {
    opts = opts || {};
    const scrim = el("div", { class: "scrim" });
    const m = el("div", { class: "modal", html: contentHTML });
    function close() { scrim.remove(); m.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.append(scrim, m);
    m.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", close));
    return { close, root: m };
  }

  window.UI = { icon, el, esc, timeAgo, clock, statusPill, sevPill, techPill, deltaTag, toast, modal };
})();
