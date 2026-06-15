/* ============================================================================
   PlatformX MVP — Chat rendering engine
   Animates an AGENT answer object into a container: step-trace → streamed
   text + rich embeds (incl. inline GIS maps) → citations → follow-ups.
   Reused by the full Agent view and the docked copilot.
   Exposes window.ChatUI.create({ scrollEl, wide, onMapSegment })
   ========================================================================== */
(function () {
  "use strict";
  const icon = (n, c) => window.UI.icon(n, c);
  const esc = (s) => window.UI.esc(s);

  function fmtMd(s) {
    let h = esc(s);
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/`(.+?)`/g, '<code>$1</code>');
    h = h.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
    return h;
  }

  function create(opts) {
    const scrollEl = opts.scrollEl;
    let mapSeq = 0, busy = false;
    const inst = {};

    function scrollDown() { scrollEl.scrollTop = scrollEl.scrollHeight; }

    function addUser(text) {
      const m = window.UI.el("div", { class: "msg user" });
      m.innerHTML = `<div class="m-avatar">ME</div><div class="m-body"><div class="bubble">${esc(text)}</div></div>`;
      scrollEl.appendChild(m); scrollDown();
    }

    function agentShell() {
      const m = window.UI.el("div", { class: "msg agent" });
      m.innerHTML = `<div class="m-avatar">${icon("agent")}</div><div class="m-body"></div>`;
      scrollEl.appendChild(m);
      return m.querySelector(".m-body");
    }

    /* animate the reasoning trace, then resolve */
    function runTrace(body, steps) {
      return new Promise((resolve) => {
        const wrap = window.UI.el("div", { class: "trace" });
        wrap.innerHTML = `<div class="trace-head"><span class="spin"></span><span class="ttl">Working…</span><span class="chev">${icon("chevdown")}</span></div><div class="trace-steps"></div>`;
        body.appendChild(wrap);
        const stepsEl = wrap.querySelector(".trace-steps");
        const head = wrap.querySelector(".trace-head");
        head.addEventListener("click", () => wrap.classList.toggle("collapsed"));
        let i = 0;
        function next() {
          if (i > 0) { const prev = stepsEl.children[i - 1]; if (prev) { prev.classList.remove("active"); prev.classList.add("complete"); } }
          if (i >= steps.length) {
            wrap.querySelector(".spin").outerHTML = `<span class="done">${icon("checkcircle")}</span>`;
            wrap.querySelector(".ttl").textContent = "Reasoning complete";
            setTimeout(() => { wrap.classList.add("collapsed"); resolve(); }, 260);
            return;
          }
          const s = steps[i];
          const row = window.UI.el("div", { class: "trace-step active" });
          row.innerHTML = `<span>${esc(s.label)}</span>${s.detail ? `<span class="meta">${esc(s.detail)}</span>` : ""}`;
          stepsEl.appendChild(row); scrollDown();
          i++;
          setTimeout(next, 260 + Math.random() * 220);
        }
        setTimeout(next, 180);
      });
    }

    /* stream one text segment word-by-word into a span; resolve when done */
    function streamText(container, text) {
      return new Promise((resolve) => {
        const span = window.UI.el("span", { class: "stream cursor-blink" });
        container.appendChild(span);
        const words = text.split(/(\s+)/);
        let i = 0, raw = "";
        function tick() {
          const n = 1 + Math.floor(Math.random() * 2);
          for (let k = 0; k < n && i < words.length; k++) { raw += words[i++]; }
          span.textContent = raw;
          scrollDown();
          if (i < words.length) setTimeout(tick, 16 + Math.random() * 26);
          else { span.classList.remove("cursor-blink"); span.innerHTML = fmtMd(raw); resolve(); }
        }
        tick();
      });
    }

    async function renderSegments(bubble, segments) {
      for (const seg of segments) {
        if (!seg) continue;
        if (seg.type === "text") { if (seg.text) await streamText(bubble, seg.text); }
        else if (seg.type === "embed") {
          const div = window.UI.el("div"); div.innerHTML = seg.html;
          bubble.appendChild(div.firstElementChild); scrollDown();
          await wait(120);
        } else if (seg.type === "map") {
          if (opts.onMapSegment) opts.onMapSegment(seg.siteIds);
          const id = "agentmap_" + (++mapSeq) + "_" + Date.now();
          const wrap = window.UI.el("div", { class: "embed" });
          wrap.innerHTML = `<div class="embed-head">${icon("map")}${seg.siteIds.length} site(s) on the network map</div><div id="${id}" style="height:190px"></div>`;
          bubble.appendChild(wrap); scrollDown();
          const sites = seg.siteIds.map(s => window.PX_DATA.SITES_BY_ID[s]).filter(Boolean);
          await wait(60);
          window.PXMAP.render(id, sites, { fit: true, scroll: false, zoomControl: false, boost: 2 });
          await wait(120);
        }
      }
    }

    function renderCites(body, citations) {
      if (!citations || !citations.length) return;
      const c = window.UI.el("div", { class: "cites" });
      c.innerHTML = `<span class="cell-sub" style="align-self:center;margin-right:2px">Sources</span>` +
        citations.map((ct, i) => `<span class="cite"><span class="num">${i + 1}</span>${icon(ct.icon)}${esc(ct.label)}</span>`).join("");
      body.appendChild(c);
    }
    function renderFollowups(body, followups) {
      if (!followups || !followups.length) return;
      const f = window.UI.el("div", { class: "suggests", style: "margin-top:12px" });
      f.innerHTML = followups.map(t => `<button class="suggest-chip">${icon("sparkle")}<span>${esc(t)}</span></button>`).join("");
      f.querySelectorAll(".suggest-chip").forEach((b, i) => b.addEventListener("click", () => inst.ask(followups[i])));
      body.appendChild(f);
    }
    function renderActions(body) {
      const a = window.UI.el("div", { class: "m-actions" });
      a.innerHTML = `<button title="Copy">${icon("copy")}</button><button title="Regenerate">${icon("refresh")}</button>`;
      a.querySelectorAll("button")[0].addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(body.innerText); window.UI.toast("Answer copied"); });
      body.appendChild(a);
    }

    inst.ask = async function (query) {
      if (busy) return;
      busy = true;
      addUser(query);
      const body = agentShell();
      const ans = window.AGENT.respond(query);
      await runTrace(body, ans.steps);
      const bubble = window.UI.el("div", { class: "bubble" });
      body.appendChild(bubble);
      await renderSegments(bubble, ans.segments);
      renderCites(body, ans.citations);
      renderFollowups(body, ans.followups);
      renderActions(body);
      scrollDown();
      busy = false;
      window.__agentAsk = inst.ask;
    };
    inst.isBusy = () => busy;
    inst.addUser = addUser;

    window.__agentAsk = inst.ask;
    return inst;
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  window.ChatUI = { create };
})();
