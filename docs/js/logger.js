/* frontend/js/logger.js (for GitHub Pages) */
(function () {
  const enabled =
    new URLSearchParams(location.search).get("debug") === "1" ||
    localStorage.getItem("debug") === "1";

  function ensurePanel() {
    let panel = document.getElementById("logPanel");
    if (panel) return panel;

    panel = document.createElement("pre");
    panel.id = "logPanel";
    panel.style.cssText = [
      "position:fixed","left:10px","right:10px","bottom:10px",
      "max-height:35vh","overflow:auto","z-index:999999",
      "background:#111","color:#0f0","padding:10px","border-radius:10px",
      "font:12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace",
      "white-space:pre-wrap"
    ].join(";");
    panel.textContent = "LOG PANEL READY\n";
    if (document.body) document.body.appendChild(panel);
    else document.addEventListener("DOMContentLoaded", () => document.body.appendChild(panel), { once: true });
    return panel;
  }

  function now() { return new Date().toISOString(); }

  function log(...args) {
    if (!enabled) return;
    console.log("[LOG]", ...args);
    const panel = ensurePanel();
    panel.textContent += `[${now()}] ` + args.map(a => (typeof a === "string" ? a : JSON.stringify(a))).join(" ") + "\n";
    panel.scrollTop = panel.scrollHeight;
  }

  async function apiFetch(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    log("FETCH", method, url);
    let res;
    try {
      res = await fetch(url, options);
    } catch (e) {
      log("NETWORK ERROR", e?.message || String(e));
      throw e;
    }
    log("RESPONSE", res.status, res.statusText, url);
    return res;
  }

  window.addEventListener("error", (e) => log("JS ERROR", e.message));
  window.addEventListener("unhandledrejection", (e) => log("PROMISE ERROR", e.reason?.message || String(e.reason)));

  window.Logger = { enabled, log, apiFetch };
  log("logger.js LOADED ✅", "URL=", location.href);
})();
