/* Loaded synchronously in <head>, before the stylesheets paint.
   1. Early boot: sets html.is-embedded and the saved appearance before first paint, so an
      embedded page never flashes the full chrome and a saved dark/light choice never flashes
      the other theme. js/app.js repeats both steps idempotently and owns the behaviour.
   2. MathJax configuration (the CDN script that reads it is loaded with `defer` after this file). */
(function () {
  "use strict";
  var root = document.documentElement, params = null;
  try { params = new URLSearchParams(window.location.search); } catch (e) { /* very old browser */ }

  /* Embed mode: ?embed=1, or running inside any iframe. ?embed=0 forces it off. */
  var flag = params && params.get("embed"), framed;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (flag === "1" || flag === "true" || (framed && flag !== "0" && flag !== "false")) root.classList.add("is-embedded");

  /* Appearance: ?theme=light|dark (for hosts that embed the site) wins for this load only;
     otherwise a choice saved by the toggle; otherwise nothing, so CSS follows the system. */
  var theme = params && params.get("theme");
  if (theme !== "light" && theme !== "dark") {
    try { theme = JSON.parse(window.localStorage.getItem("fqe-theme")); } catch (e) { theme = null; }
  }
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
})();

window.MathJax = {
  tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] },
  svg: { fontCache: "global" },
  /* js/app.js typesets only the page that is showing, after MathJax is ready. */
  startup: { typeset: false }
};
