/* ============================================================================
   PlatformX MVP — GIS map (Leaflet + CartoDB Positron light tiles)
   Exposes window.PXMAP
   ========================================================================== */
(function () {
  "use strict";
  const HCOLOR = { ok: "#16A34A", warn: "#E0900B", crit: "#DC2626" };
  const hasLeaflet = () => typeof window.L !== "undefined";

  function tileLayer() {
    return L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: "abcd", maxZoom: 19,
    });
  }

  function markerFor(site, onClick, sizeBoost) {
    const size = (site.status === "crit" ? 15 : site.status === "warn" ? 12 : 9) + (sizeBoost || 0);
    const m = L.circleMarker([site.lat, site.lng], {
      radius: size / 2 + 2, fillColor: HCOLOR[site.status], color: "#fff",
      weight: 2, fillOpacity: .92, className: "site-marker",
    });
    const D = window.PX_DATA, U = D.util;
    const thr = U.latest(site.kpis.thrpt), dcr = U.latest(site.kpis.dcr), sinr = U.latest(site.kpis.sinr);
    m.bindPopup(
      `<div style="min-width:190px">
         <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
           <b class="mono" style="color:#1E40AF">${site.id}</b>
           <span class="pill ${site.status}" style="height:18px"><span class="dot"></span>${site.status === "ok" ? "Healthy" : site.status === "warn" ? "Degraded" : "Critical"}</span>
         </div>
         <div style="font-size:12px;color:#64748B;margin-bottom:7px">${site.area} · ${site.tech} · ${site.sectors.length} sector(s)</div>
         <div class="pop-kpi"><span>Throughput</span><b>${D.util.round(thr, 0)} Mbps</b></div>
         <div class="pop-kpi"><span>DCR</span><b>${dcr}%</b></div>
         <div class="pop-kpi"><span>SINR</span><b>${sinr} dB</b></div>
         <div class="pop-kpi"><span>Open alarms</span><b>${site.alarms.length}</b></div>
         <a href="#/sites/${site.id}" style="display:block;margin-top:8px;text-align:center;background:#2563EB;color:#fff;padding:6px;border-radius:7px;font-weight:600;font-size:12px">Open site detail →</a>
       </div>`,
      { closeButton: false }
    );
    if (onClick) m.on("click", () => onClick(site));
    return m;
  }

  let mapInstances = {};

  function render(containerId, sites, opts) {
    opts = opts || {};
    const c = document.getElementById(containerId);
    if (!c) return null;
    if (!hasLeaflet()) {
      c.innerHTML = '<div class="empty center" style="height:100%"><div><div class="muted">Map library offline.</div><div class="fs-12 muted">Connect to the internet to load the GIS basemap.</div></div></div>';
      return null;
    }
    if (mapInstances[containerId]) { mapInstances[containerId].remove(); }
    const D = window.PX_DATA;
    const map = L.map(c, { zoomControl: opts.zoomControl !== false, attributionControl: false, scrollWheelZoom: opts.scroll !== false })
      .setView(opts.center || D.CENTER, opts.zoom || 10);
    tileLayer().addTo(map);
    const group = [];
    sites.forEach(s => { const m = markerFor(s, opts.onClick, opts.boost); m.addTo(map); group.push(m); s._marker = m; });
    if (opts.fit && group.length) {
      const fg = L.featureGroup(group); map.fitBounds(fg.getBounds().pad(0.12));
    }
    mapInstances[containerId] = map;
    setTimeout(() => map.invalidateSize(), 120);
    return map;
  }

  function highlight(containerId, siteIds) {
    const map = mapInstances[containerId];
    if (!map) return;
    const D = window.PX_DATA;
    const targets = siteIds.map(id => D.SITES_BY_ID[id]).filter(Boolean);
    targets.forEach(s => {
      if (s._marker) {
        s._marker.setStyle({ weight: 3, radius: 11 });
        s._marker.setRadius(11);
      }
    });
    if (targets.length) {
      const fg = L.featureGroup(targets.map(s => s._marker).filter(Boolean));
      try { map.fitBounds(fg.getBounds().pad(0.4)); } catch (e) {}
      if (targets[0]._marker) setTimeout(() => targets[0]._marker.openPopup(), 350);
    }
  }

  function invalidate() { Object.values(mapInstances).forEach(m => { try { m.invalidateSize(); } catch (e) {} }); }

  window.PXMAP = { render, highlight, invalidate, HCOLOR };
})();
