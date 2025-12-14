/* frontend/debug.js (no modules) */
console.log("debug.js loaded OK");

(function () {
  const params = new URLSearchParams(location.search);
  const enabled = params.get("debug") === "1" || localStorage.getItem("debug") === "1";

  function time() {
    return new Date().toISOString();
  }

  function ensureOverlay() {
    if (!enabled) return null;
    let el = document.getElementById("debugOverlay");
    if (el) return el;

    el = document.createElement("div");
    el.id = "debugOverlay";
    el.style.cssText = [
      "position:fixed",
      "left:12px",
      "bottom:12px",
      "z-index:99999",
      "max-width:min(720px,92vw)",
      "max-height:45vh",
      "overflow:auto",
      "background:rgba(0,0,0,.85)",
      "color:#fff",
      "padding:10px 12px",
      "border-radius:10px",
      "font:12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace",
      "white-space:pre-wrap"
    ].join(";");

    el.textContent = "DEBUG ON\n";
    const add = () => {
      if (!document.getElementById("debugOverlay") && document.body) {
        document.body.appendChild(el);
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", add, { once: true });
    } else {
      add();
    }
    return el;
  }

  function overlay(line) {
    if (!enabled) return;
    const el = ensureOverlay();
    if (!el) return;
    el.textContent += line + "\n";
    el.scrollTop = el.scrollHeight;
  }

  function log(...a) {
    if (!enabled) return;
    console.log(`[${time()}]`, ...a);
  }
  function warn(...a) {
    if (!enabled) return;
    console.warn(`[${time()}]`, ...a);
  }
  function error(...a) {
    if (!enabled) return;
    console.error(`[${time()}]`, ...a);
  }

  async function apiFetch(url, options) {
    const opts = options || {};
    const method = String(opts.method || "GET").toUpperCase();
    log("FETCH", method, url, opts);
    overlay(`FETCH ${method} ${url}`);

    let res;
    try {
      res = await fetch(url, opts);
    } catch (err) {
      error("NETWORK ERROR:", err);
      overlay(`NETWORK ERROR: ${err && err.message ? err.message : err}`);
      throw err;
    }

    const ct = res.headers.get("content-type") || "";
    let payload = null;

    try {
      payload = ct.includes("application/json") ? await res.clone().json() : await res.clone().text();
    } catch (_) {}

    log("RESPONSE", res.status, res.statusText, payload);
    overlay(`RESPONSE ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const msg = (payload && (payload.error || payload.message)) || payload || `HTTP ${res.status}`;
      const e = new Error(msg);
      e.status = res.status;
      e.payload = payload;
      throw e;
    }

    return res;
  }

  window.Debug = { enabled, log, warn, error, overlay, apiFetch };

  window.addEventListener("error", (e) => {
    error("window.error:", e.message, e.error);
    overlay(`JS ERROR: ${e.message}`);
  });

  window.addEventListener("unhandledrejection", (e) => {
    error("unhandledrejection:", e.reason);
    overlay(`PROMISE ERROR: ${(e.reason && e.reason.message) ? e.reason.message : e.reason}`);
  });

  // force create overlay when enabled
  ensureOverlay();
})();
