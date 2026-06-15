/* ============================================================================
   PlatformX MVP — tiny hash router (works from file://)
   Exposes window.Router
   ========================================================================== */
(function () {
  "use strict";
  const routes = [];
  function add(pattern, handler) {
    // pattern like "/sites/:id" -> regex
    const keys = [];
    const rx = new RegExp("^" + pattern.replace(/:[^/]+/g, (m) => { keys.push(m.slice(1)); return "([^/?]+)"; }) + "/?(?:\\?(.*))?$");
    routes.push({ rx, keys, handler });
  }
  function parseQuery(qs) {
    const o = {}; if (!qs) return o;
    qs.split("&").forEach(p => { const [k, v] = p.split("="); o[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
    return o;
  }
  function resolve() {
    let hash = location.hash.replace(/^#/, "") || "/overview";
    if (!hash.startsWith("/")) hash = "/" + hash;
    for (const r of routes) {
      const m = hash.match(r.rx);
      if (m) {
        const params = {}; r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
        const query = parseQuery(m[r.keys.length + 1]);
        r.handler(params, query); return;
      }
    }
    if (routes.length) routes[0].handler({}, {});
  }
  function start() { window.addEventListener("hashchange", resolve); resolve(); }
  function go(path) { location.hash = path; }
  window.Router = { add, start, go };
})();
