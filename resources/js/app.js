/* FQE Resources: router, navigation, search, appearance, tools, and embed mode.
   No build step and no dependencies. Behaviour follows Apple's HIG (see .agents/skills/apple-design):
   modal views have an obvious way out and return focus (modality.md, sheets.md), everything works
   from the keyboard (accessibility.md › Speech, keyboards.md), motion respects Reduce Motion
   (accessibility.md › Cognitive, motion.md), and the appearance follows the system unless the
   reader picks one (dark-mode.md). Markup contract: see README.md. */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var SITE = "FQE Resources";

  /* ---------------------------------------------------------------- Utilities */
  var store = (function () {
    var ok = false;
    try { var k = "__fqe_probe__"; localStorage.setItem(k, k); localStorage.removeItem(k); ok = true; } catch (e) { ok = false; }
    return {
      available: ok,
      get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
      set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
      remove: function (k) { try { localStorage.removeItem(k); return true; } catch (e) { return false; } }
    };
  })();
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function mq(q) { return window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {} }; }
  function onChange(m, fn) { if (m.addEventListener) m.addEventListener("change", fn); else if (m.addListener) m.addListener(fn); }
  var reduceMotion = mq("(prefers-reduced-motion: reduce)");
  function scrollBehavior() { return reduceMotion.matches ? "auto" : "smooth"; }
  /* Screen-reader-only element; inline styles so it works whatever the stylesheets call it. */
  function srOnly(el) {
    el.classList.add("visually-hidden");
    el.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap";
    return el;
  }
  function focusEl(el) {
    if (!el) return;
    if (!el.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName)) el.setAttribute("tabindex", "-1");
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }
  function visible(el) { return !!(el && el.isConnected !== false && document.contains(el) && el.getClientRects().length); }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  function focusables(container) { return Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), visible); }

  /* Platform: show the shortcut people actually press (keyboards.md › Custom keyboard shortcuts). */
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "";
  var isApple = /mac|iphone|ipad|ipod/i.test(platform);
  root.setAttribute("data-platform", isApple ? "apple" : "other");

  /* ---------------------------------------------------------------- Embed mode */
  var params = (function () { try { return new URLSearchParams(location.search); } catch (e) { return { get: function () { return null; } }; } })();
  var embedFlag = params.get("embed"), framed;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  var embedded = embedFlag === "1" || embedFlag === "true" || (framed && embedFlag !== "0" && embedFlag !== "false");
  root.classList.toggle("is-embedded", embedded);
  function postToHost(msg) {
    if (!embedded || !framed) return;
    try { window.parent.postMessage(msg, "*"); } catch (e) { /* host gone */ }
  }

  /* ---------------------------------------------------------------- Pages and navigation */
  var pages = Array.prototype.slice.call(document.querySelectorAll("section.page"));
  var bySlug = {}, groupOrder = [], groups = {};
  pages.forEach(function (p) {
    bySlug[p.dataset.slug] = p;
    var g = p.dataset.group;
    if (!groups[g]) { groups[g] = []; groupOrder.push(g); }
    groups[g].push(p);
    var h1 = p.querySelector("h1");
    if (h1) h1.setAttribute("tabindex", "-1"); /* route changes move focus here */
  });

  /* Masthead section links */
  var secNav = $("sections");
  if (secNav) groupOrder.forEach(function (g) {
    var a = document.createElement("a");
    a.href = "#/" + groups[g][0].dataset.slug; a.textContent = g; a.dataset.group = g;
    secNav.appendChild(a);
  });

  /* Menu sheet body: every page, grouped */
  var sheet = $("sheet"), sheetBody = $("sheetBody"), menuBtn = $("menuBtn"), sheetClose = $("sheetClose");
  if (sheetBody) groupOrder.forEach(function (g) {
    var h = document.createElement("h2"); h.textContent = g; sheetBody.appendChild(h);
    var ul = document.createElement("ul");
    groups[g].forEach(function (p) {
      var li = document.createElement("li");
      li.innerHTML = '<a href="#/' + esc(p.dataset.slug) + '" data-slug="' + esc(p.dataset.slug) + '">' + esc(p.dataset.title) + "</a>";
      ul.appendChild(li);
    });
    sheetBody.appendChild(ul);
  });

  /* Per-page decoration: sub-navigation, on-this-page rail, next and previous */
  var slugify = function (t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
  pages.forEach(function (p, i) {
    var g = p.dataset.group, head = p.querySelector(".page-head"), inner = p.querySelector(".page-head-inner");
    if (groups[g].length > 1 && inner) {
      var sub = document.createElement("ul"); sub.className = "subnav"; sub.setAttribute("aria-label", g + " pages");
      sub.innerHTML = groups[g].map(function (q) {
        return '<li><a href="#/' + esc(q.dataset.slug) + '"' + (q === p ? ' aria-current="page"' : "") + ">" + esc(q.dataset.title) + "</a></li>";
      }).join("");
      inner.insertBefore(sub, inner.firstChild);
    }
    var body = p.querySelector(".page-body");
    if (!body) return;
    var grid = document.createElement("div"); grid.className = "page-grid";
    body.parentNode.insertBefore(grid, body); grid.appendChild(body);
    var h2s = Array.prototype.slice.call(body.querySelectorAll(":scope > h2"));
    if (h2s.length >= 3 && !p.hasAttribute("data-norail")) {
      grid.classList.add("has-rail"); if (head) head.classList.add("has-rail");
      var aside = document.createElement("aside"); aside.className = "onpage";
      aside.innerHTML = '<nav aria-label="On this page"><p>On this page</p><ul>' + h2s.map(function (h) {
        h.id = p.dataset.slug + "--" + slugify(h.textContent);
        return '<li><a href="#/' + esc(p.dataset.slug) + "/" + h.id + '" data-target="' + h.id + '">' + esc(h.textContent) + "</a></li>";
      }).join("") + "</ul></nav>";
      grid.appendChild(aside);
    }
    var nav = document.createElement("nav"); nav.className = "nextprev"; nav.setAttribute("aria-label", "Previous and next page");
    var prev = pages[i - 1], next = pages[i + 1];
    nav.innerHTML = (prev ? '<a class="prev" rel="prev" href="#/' + esc(prev.dataset.slug) + '"><small>Previous</small>' + esc(prev.dataset.title) + "</a>" : "<span></span>") +
      (next ? '<a class="next" rel="next" href="#/' + esc(next.dataset.slug) + '"><small>Next</small>' + esc(next.dataset.title) + "</a>" : "<span></span>");
    body.appendChild(nav);
  });

  /* Embedded: links that leave the site replace the host page, not the frame. */
  if (embedded) each(document.querySelectorAll("a[href]"), function (a) {
    if (/^https?:$/.test(a.protocol) && a.origin !== location.origin) a.setAttribute("target", "_top");
  });

  /* Scroll spy for the on-this-page rail */
  var spy = null;
  function watch(p) {
    if (spy) spy.disconnect();
    var links = p.querySelectorAll(".onpage a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        each(links, function (l) {
          var on = l.dataset.target === e.target.id;
          l.classList.toggle("active", on);
          if (on) l.setAttribute("aria-current", "location"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    each(p.querySelectorAll(".page-body > h2[id]"), function (h) { spy.observe(h); });
  }

  /* ---------------------------------------------------------------- Modal views (search, menu sheet)
     One at a time (sheets.md › Best practices: "Display only one sheet at a time"); the background
     is inert and scroll-locked, Tab wraps inside, Esc closes, focus returns to what opened it
     (modality.md › Best practices: "Always give people an obvious way to dismiss a modal view"). */
  var modal = null, inerted = [];
  var supportsInert = "inert" in HTMLElement.prototype;
  function setInert(el, on) {
    if (on) { el.inert = true; el.setAttribute("inert", ""); if (!supportsInert) el.setAttribute("aria-hidden", "true"); }
    else { el.inert = false; el.removeAttribute("inert"); if (!supportsInert) el.removeAttribute("aria-hidden"); }
  }
  function inertBackground(dialog) {
    for (var node = dialog; node && node.parentElement && node !== document.body; node = node.parentElement) {
      each(node.parentElement.children, function (sib) {
        if (sib === node || sib.tagName === "SCRIPT" || sib.hasAttribute("inert")) return;
        setInert(sib, true); inerted.push(sib);
      });
    }
  }
  function lockScroll(on) {
    if (embedded) return; /* the host page scrolls, not the frame */
    if (on) {
      var hasBar = window.innerWidth > root.clientWidth;
      root.style.overflow = "hidden";
      if (hasBar) root.style.scrollbarGutter = "stable";
    } else { root.style.overflow = ""; root.style.scrollbarGutter = ""; }
  }
  function openModal(el, opts) {
    if (modal) closeModal(false);
    modal = { el: el, opener: opts.opener || document.activeElement, onClose: opts.onClose };
    el.hidden = false;
    inertBackground(el);
    lockScroll(true);
    focusEl(opts.initialFocus && visible(opts.initialFocus) ? opts.initialFocus : (focusables(el)[0] || el));
    postToHost({ type: "fqe-resources:scroll", top: 0, reason: "dialog" }); /* dialogs sit at the top of the frame */
  }
  function closeModal(restoreFocus) {
    if (!modal) return;
    var m = modal; modal = null;
    m.el.hidden = true;
    inerted.forEach(function (s) { setInert(s, false); }); inerted = [];
    lockScroll(false);
    if (m.onClose) m.onClose();
    if (restoreFocus !== false) {
      var back = visible(m.opener) && m.opener !== document.body ? m.opener : m.fallback;
      if (back) focusEl(back);
    }
  }
  document.addEventListener("keydown", function (e) {
    if (!modal || e.key !== "Tab") return;
    var f = focusables(modal.el); if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || !modal.el.contains(a))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (a === last || !modal.el.contains(a))) { e.preventDefault(); first.focus(); }
  });

  /* Menu sheet */
  if (sheet) { sheet.setAttribute("aria-modal", "true"); if (!sheet.hasAttribute("aria-label") && !sheet.hasAttribute("aria-labelledby")) sheet.setAttribute("aria-label", "All pages"); }
  function openSheet() {
    if (!sheet) return;
    openModal(sheet, {
      opener: menuBtn,
      initialFocus: sheetBody && sheetBody.querySelector('a[aria-current="page"]') || sheetClose,
      onClose: function () { if (menuBtn) menuBtn.setAttribute("aria-expanded", "false"); }
    });
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    var cur = sheetBody && sheetBody.querySelector('a[aria-current="page"]');
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
  }
  function sheetOpen() { return modal && modal.el === sheet; }
  if (menuBtn) {
    menuBtn.setAttribute("aria-haspopup", "dialog");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", function () { if (sheetOpen()) closeModal(); else openSheet(); });
  }
  if (sheetClose) sheetClose.addEventListener("click", function () { if (sheetOpen()) closeModal(); });

  /* ---------------------------------------------------------------- MathJax: visible page only */
  var math = { state: "pending", queue: [] };
  function typeset(p) {
    if (!p || p.dataset.typeset || !/\\\(|\\\[/.test(p.innerHTML)) return;
    if (math.state === "failed") return;
    if (math.state !== "ready") { if (math.queue.indexOf(p) < 0) math.queue.push(p); return; }
    p.dataset.typeset = "1";
    window.MathJax.typesetPromise([p]).then(scheduleHeight, function () { delete p.dataset.typeset; });
  }
  function mathReady() {
    math.state = "ready";
    var q = math.queue; math.queue = [];
    q.forEach(function (p) { if (!p.hidden) typeset(p); });
    if (current && !current.dataset.typeset) typeset(current);
  }
  function watchMathJax(allowFallback) {
    var mj = window.MathJax;
    if (mj && mj.version && mj.startup && mj.startup.promise) {
      mj.startup.promise.then(mathReady, function () { math.state = "failed"; root.classList.add("no-math"); });
      return;
    }
    if (!allowFallback) { math.state = "failed"; root.classList.add("no-math"); return; }
    /* The primary CDN failed or was blocked: try one mirror, then show the TeX source as text. */
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js";
    s.async = true;
    s.onload = function () { watchMathJax(false); };
    s.onerror = function () { math.state = "failed"; root.classList.add("no-math"); };
    document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { watchMathJax(true); });
  else watchMathJax(true);

  /* ---------------------------------------------------------------- Router: #/slug or #/slug/heading-id */
  var current = null, firstRoute = true;
  function setCurrent(links, test) {
    each(links, function (a) { var v = test(a); if (v) a.setAttribute("aria-current", v); else a.removeAttribute("aria-current"); });
  }
  function offsetTop(el) { return Math.max(0, Math.round(el.getBoundingClientRect().top + window.pageYOffset)); }
  function route() {
    var hash = location.hash;
    /* A plain in-page anchor such as a skip link (#main): keep the page, move focus there. */
    if (hash && hash.indexOf("#/") !== 0 && current) {
      var plain = null;
      try { plain = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { plain = null; }
      if (plain) {
        focusEl(plain.id === "main" ? current.querySelector("h1") || plain : plain);
        if (history.replaceState) history.replaceState(null, "", "#/" + current.dataset.slug);
        return;
      }
    }
    var m = hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/) || [];
    var slug = bySlug[m[1]] ? m[1] : (bySlug.home ? "home" : pages[0].dataset.slug), anchor = m[2];
    var cur = bySlug[slug], changed = cur !== current;
    if (modal) closeModal(false);
    if (changed) {
      pages.forEach(function (p) { p.hidden = p !== cur; });
      document.title = cur.dataset.title + " · " + SITE;
      if (secNav) setCurrent(secNav.querySelectorAll("a"), function (a) {
        if (a.dataset.group !== cur.dataset.group) return null;
        return a.getAttribute("href") === "#/" + slug ? "page" : "true";
      });
      if (sheetBody) setCurrent(sheetBody.querySelectorAll("a"), function (a) { return a.dataset.slug === slug ? "page" : null; });
      current = cur; typeset(cur); watch(cur);
    }
    var target = anchor ? document.getElementById(anchor) : null;
    if (target && cur.contains(target)) {
      for (var d = target.closest("details"); d; d = d.parentElement && d.parentElement.closest("details")) d.open = true;
      target.scrollIntoView({ behavior: changed || firstRoute ? "auto" : scrollBehavior(), block: "start" });
      if (!firstRoute) focusEl(target);
      if (!firstRoute) postToHost({ type: "fqe-resources:scroll", top: offsetTop(target), reason: "anchor", slug: slug, title: cur.dataset.title });
    } else if (changed || !firstRoute) { /* also #/home after an empty hash, or leaving an anchor */
      window.scrollTo(0, 0);
      if (!firstRoute) focusEl(cur.querySelector("h1"));
      if (!firstRoute) postToHost({ type: "fqe-resources:scroll", top: 0, reason: "navigate", slug: slug, title: cur.dataset.title });
    }
    firstRoute = false;
    scheduleHeight();
  }
  window.addEventListener("hashchange", route);
  /* A link to the page already showing fires no hashchange; still close any dialog and move focus. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.getAttribute("href") === location.hash) {
      e.preventDefault();
      if (modal) closeModal(false);
      firstRoute = false;
      var anchor = (a.getAttribute("href").split("/")[2]) || "";
      var t = anchor ? document.getElementById(anchor) : null;
      if (t) { t.scrollIntoView({ behavior: scrollBehavior(), block: "start" }); focusEl(t); }
      else { window.scrollTo({ top: 0, behavior: scrollBehavior() }); focusEl(current && current.querySelector("h1")); }
    }
  });

  /* ---------------------------------------------------------------- Search (modal, combobox + listbox) */
  var dlg = $("searchDlg"), box = $("searchBox"), results = $("searchResults"), searchBtn = $("searchBtn");
  var SHORTCUT_LABEL = isApple ? "⌘K" : "Ctrl K";
  if (searchBtn) {
    var kbd = searchBtn.querySelector("kbd");
    if (kbd) { kbd.textContent = SHORTCUT_LABEL; kbd.setAttribute("aria-hidden", "true"); }
    searchBtn.setAttribute("aria-keyshortcuts", isApple ? "Meta+K" : "Control+K");
    searchBtn.setAttribute("aria-haspopup", "dialog");
    if (!searchBtn.title) searchBtn.title = "Search every page (" + (isApple ? "⌘K" : "Ctrl+K") + ")";
  }
  each(document.querySelectorAll("kbd[data-shortcut], .kbd-shortcut"), function (k) { k.textContent = SHORTCUT_LABEL; });

  /* Page text for the index: a space between blocks (so "databases" and "Volatility" in adjacent
     cells don't fuse in snippets), skipping the generated next/previous links. */
  var BLOCK = /^(P|LI|TD|TH|TR|H[1-6]|DIV|DT|DD|UL|OL|DL|TABLE|BLOCKQUOTE|PRE|SUMMARY|DETAILS|BR|FIGCAPTION|SECTION|HEADER|ASIDE|NAV)$/;
  function textOf(node) {
    if (!node) return "";
    var out = [];
    (function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) out.push(c.nodeValue);
        else if (c.nodeType === 1 && !c.classList.contains("nextprev") && c.tagName !== "SCRIPT") {
          var block = BLOCK.test(c.tagName);
          if (block) out.push(" ");
          walk(c);
          if (block) out.push(" ");
        }
      }
    })(node);
    return out.join("");
  }
  var index = pages.map(function (p) {
    var h1 = p.querySelector("h1"), lede = p.querySelector(".lede"), body = p.querySelector(".page-body");
    var text = ((h1 ? h1.textContent : "") + " " + (lede ? lede.textContent : "") + " " + textOf(body))
      .replace(/\\\(.*?\\\)|\\\[.*?\\\]/g, " ").replace(/\s+/g, " ").trim();
    return { slug: p.dataset.slug, title: p.dataset.title, group: p.dataset.group, text: text, lower: text.toLowerCase() };
  });

  if (dlg && box && results) {
    var searchStatus = srOnly(document.createElement("p"));
    searchStatus.id = "searchStatus"; searchStatus.setAttribute("role", "status");
    (dlg.querySelector(".search-panel") || dlg).appendChild(searchStatus);
    results.removeAttribute("aria-live"); /* the count is announced instead of every result */
    results.setAttribute("aria-label", "Results");
    box.setAttribute("role", "combobox");
    box.setAttribute("aria-autocomplete", "list");
    box.setAttribute("aria-controls", "searchResults");
    box.setAttribute("aria-expanded", "false");
    box.setAttribute("enterkeyhint", "go");
    dlg.setAttribute("aria-modal", "true");
    var searchClose = $("searchClose"); /* optional visible Cancel button in the markup */

    var activeIdx = -1, statusTimer = null;
    var options = function () { return Array.prototype.slice.call(results.querySelectorAll('[role="option"]')); };
    var setActive = function (i, scroll) {
      var opts = options();
      opts.forEach(function (o, k) { var on = k === i; o.classList.toggle("active", on); o.setAttribute("aria-selected", on ? "true" : "false"); });
      activeIdx = i;
      if (i > -1 && opts[i]) { box.setAttribute("aria-activedescendant", opts[i].id); if (scroll) opts[i].scrollIntoView({ block: "nearest" }); }
      else box.removeAttribute("aria-activedescendant");
    };
    var announce = function (msg) {
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { searchStatus.textContent = msg; }, 450); /* wait for a typing pause */
    };
    var showEmpty = function (msg) {
      results.removeAttribute("role");
      box.setAttribute("aria-expanded", "false");
      setActive(-1);
      results.innerHTML = '<li class="search-empty">' + esc(msg) + "</li>";
    };
    var HINT = "Type at least two letters to search every page.";
    var runSearch = function () {
      var raw = box.value.trim(), q = raw.toLowerCase();
      if (q.length < 2) { showEmpty(HINT); announce(""); return; }
      var terms = q.split(/\s+/);
      var hits = index.map(function (d) {
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          var n = d.lower.split(terms[i]).length - 1;
          if (!n) return null;
          score += n + (d.title.toLowerCase().indexOf(terms[i]) > -1 ? 20 : 0);
        }
        return { d: d, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 12);
      if (!hits.length) { var none = 'No pages mention "' + raw + '". Try a shorter term.'; showEmpty(none); announce(none); return; }
      results.setAttribute("role", "listbox");
      results.innerHTML = hits.map(function (h, k) {
        var pos = h.d.lower.indexOf(terms[0]), start = Math.max(0, pos - 45);
        var snip = (start > 0 ? "…" : "") + h.d.text.slice(start, pos + 75) + "…";
        return '<li role="presentation"><a id="searchOpt' + k + '" role="option" aria-selected="false" tabindex="-1" href="#/' + esc(h.d.slug) + '">' +
          "<strong>" + esc(h.d.title) + "<em>" + esc(h.d.group) + "</em></strong><span>" + esc(snip) + "</span></a></li>";
      }).join("");
      box.setAttribute("aria-expanded", "true");
      setActive(0, false);
      announce(hits.length === 1 ? "1 page found." : hits.length + " pages found." + (hits.length === 12 ? " Showing the top 12." : ""));
    };
    var openSearch = function () {
      openModal(dlg, { opener: document.activeElement && document.activeElement !== document.body ? document.activeElement : searchBtn, initialFocus: box });
      modal.fallback = searchBtn;
      box.value = ""; searchStatus.textContent = ""; showEmpty(HINT);
      if (searchBtn) searchBtn.setAttribute("aria-expanded", "true");
      modal.onClose = function () { if (searchBtn) searchBtn.setAttribute("aria-expanded", "false"); clearTimeout(statusTimer); };
    };
    var searchOpen = function () { return modal && modal.el === dlg; };
    if (searchBtn) { searchBtn.setAttribute("aria-expanded", "false"); searchBtn.addEventListener("click", function () { if (searchOpen()) closeModal(); else openSearch(); }); }
    if (searchClose) searchClose.addEventListener("click", function () { closeModal(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeModal(); });
    box.addEventListener("input", runSearch);
    box.addEventListener("keydown", function (e) {
      var opts = options();
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && opts.length) {
        e.preventDefault();
        var i = activeIdx < 0 ? (e.key === "ArrowDown" ? 0 : opts.length - 1)
          : (activeIdx + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
        setActive(i, true);
      } else if (e.key === "Enter") {
        e.preventDefault();
        var pick = opts[activeIdx] || opts[0];
        if (pick) pick.click();
      }
    });
    results.addEventListener("mousemove", function (e) {
      var o = e.target.closest && e.target.closest('[role="option"]');
      if (o) { var i = options().indexOf(o); if (i !== activeIdx) setActive(i, false); }
    });
    results.addEventListener("click", function (e) {
      var o = e.target.closest && e.target.closest("a[href]");
      if (o && o.getAttribute("href") !== location.hash) closeModal(false); /* route() then focuses the new page */
    });

    /* Global keys: Cmd-K on Apple platforms, Ctrl-K elsewhere; Esc cancels (keyboards.md › Standard keyboard shortcuts). */
    document.addEventListener("keydown", function (e) {
      var mod = isApple ? (e.metaKey && !e.ctrlKey) : (e.ctrlKey && !e.metaKey);
      if (mod && !e.altKey && !e.shiftKey && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (searchOpen()) closeModal(); else openSearch();
      } else if (e.key === "Escape" && modal) {
        e.preventDefault();
        closeModal();
      }
    });
  }
  /* Esc for the sheet when search markup is missing */
  if (!dlg) document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal) closeModal(); });

  /* ---------------------------------------------------------------- Appearance
     Follows the system until the reader chooses; choosing the system's own value goes back to
     following it (dark-mode.md › Best practices: people "expect all apps and games to respect
     their preference"). */
  var themeBtn = $("themeBtn");
  var darkQuery = mq("(prefers-color-scheme: dark)");
  var THEME_COLOR = { dark: "#05140a", light: "#f4f8f5" };
  var themeParam = params.get("theme");
  function systemTheme() { return darkQuery.matches ? "dark" : "light"; }
  function chosenTheme() { var t = root.getAttribute("data-theme"); return t === "dark" || t === "light" ? t : null; }
  function effectiveTheme() { return chosenTheme() || systemTheme(); }
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  if (!themeMetas.length) {
    var meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta);
    themeMetas = [meta];
  }
  function paintTheme() {
    var eff = effectiveTheme(), other = eff === "dark" ? "light" : "dark";
    root.style.colorScheme = eff; /* native controls and scrollbars match a manual choice */
    each(themeMetas, function (m) { m.setAttribute("content", THEME_COLOR[eff]); });
    if (!themeBtn) return;
    var label = "Switch to " + other + " appearance";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.title = label;
    themeBtn.setAttribute("data-appearance", eff);
    var text = themeBtn.querySelector(".theme-label");
    var word = other.charAt(0).toUpperCase() + other.slice(1);
    if (text) text.textContent = word; else if (!themeBtn.children.length) themeBtn.textContent = word;
  }
  function applyTheme(t) { if (t === "dark" || t === "light") root.setAttribute("data-theme", t); else root.removeAttribute("data-theme"); paintTheme(); }
  if (themeParam === "dark" || themeParam === "light") applyTheme(themeParam);
  else applyTheme(store.get("fqe-theme", null));
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    if (next === systemTheme()) { store.remove("fqe-theme"); applyTheme(null); }
    else { store.set("fqe-theme", next); applyTheme(next); }
  });
  onChange(darkQuery, paintTheme); /* repaint label and theme-color; CSS already follows the system */
  window.addEventListener("storage", function (e) { if (e.key === "fqe-theme" && !themeParam) applyTheme(store.get("fqe-theme", null)); });

  /* ---------------------------------------------------------------- Practice problems and FAQ
     Native <details>/<summary> already expose a button with an expanded state to assistive
     technology (disclosure-controls.md). Typeset any math the reader just revealed. */
  document.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d || d.tagName !== "DETAILS" || !d.open) return;
    if (math.state === "ready" && /\\\(|\\\[/.test(d.innerHTML) && window.MathJax.typesetPromise) window.MathJax.typesetPromise([d]).then(scheduleHeight, function () {});
    scheduleHeight();
  }, true);

  /* ---------------------------------------------------------------- Project checklist */
  var checkItems = [
    "The README states the question, data source, method, result, and limitations in plain language",
    "Results reproduce from a clean environment: pinned requirements, fixed random seeds, a data download script",
    "Backtests exclude look-ahead bias, survivorship bias, and data leakage, and include transaction costs",
    "Out-of-sample results are reported separately from in-sample results",
    "Every closed-form result is checked against a simulation, or the reverse",
    "The README says which parts an AI tool produced and how you validated them",
    "You can explain every line of code and defend every number for twenty minutes",
    "Your desk lead has reviewed the project before the Tuesday presentation"
  ];
  var cl = $("checklist");
  if (cl) {
    var checks = store.get("fqe-checklist-v1", {});
    if (!checks || typeof checks !== "object") checks = {};
    checkItems.forEach(function (txt, i) {
      var li = document.createElement("li");
      li.innerHTML = '<input type="checkbox" id="ck' + i + '"' + (checks[i] ? " checked" : "") + '><label for="ck' + i + '">' + esc(txt) + "</label>";
      li.querySelector("input").addEventListener("change", function (e) { checks[i] = e.target.checked; store.set("fqe-checklist-v1", checks); });
      cl.appendChild(li);
    });
    var checkReset = $("checkReset");
    if (checkReset) checkReset.addEventListener("click", function () {
      checks = {}; store.set("fqe-checklist-v1", checks);
      each(cl.querySelectorAll("input"), function (c) { c.checked = false; });
    });
  }

  /* ---------------------------------------------------------------- Application tracker
     Removing one entry is common and undoable, so it happens at once with an Undo; deleting
     everything is rare and irreversible, so it asks first with a Cancel (alerts.md › Best
     practices; feedback.md). The confirmation is inline rather than window.confirm(), which
     sandboxed or cross-origin frames can suppress. */
  var tBody = $("tBody"), tMsg = $("tMsg");
  if (tBody && tMsg) (function () {
    var STATUSES = ["Researching", "Applied", "Online assessment", "Interviewing", "Final round", "Offer", "Rejected", "Withdrawn"];
    var KEY = "fqe-tracker-v1";
    var apps = store.get(KEY, []);
    if (!Array.isArray(apps)) apps = [];
    apps = apps.filter(function (a) { return a && typeof a === "object" && a.firm; });
    var tStatus = $("tStatus"), tFilter = $("tFilter"), tFirm = $("tFirm"), tClear = $("tClear");
    if (!tMsg.hasAttribute("role")) tMsg.setAttribute("role", "status");
    tStatus.innerHTML = STATUSES.map(function (s) { return "<option>" + s + "</option>"; }).join("");
    tStatus.value = "Applied";
    tFilter.innerHTML = '<option value="">All</option><option value="open">Open only</option>' + STATUSES.map(function (s) { return "<option>" + s + "</option>"; }).join("");
    if (!tFilter.getAttribute("aria-label") && !tFilter.closest("label")) tFilter.setAttribute("aria-label", "Show applications");
    try { $("tDate").valueAsDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000); } catch (e) { /* unsupported */ }
    tFirm.setAttribute("required", ""); tFirm.setAttribute("autocomplete", "organization");

    /* Status line and its Undo, outside the live region so the button is not re-announced. */
    var undoBtn = document.createElement("button");
    undoBtn.type = "button"; undoBtn.className = "btn ghost"; undoBtn.id = "tUndo"; undoBtn.textContent = "Undo"; undoBtn.hidden = true;
    tMsg.parentNode.insertBefore(undoBtn, tMsg.nextSibling);
    var lastRemoved = null;

    var confirmBox = document.createElement("div");
    confirmBox.id = "tConfirm"; confirmBox.className = "tool-confirm"; confirmBox.hidden = true;
    confirmBox.setAttribute("role", "group"); confirmBox.setAttribute("aria-labelledby", "tConfirmText"); confirmBox.tabIndex = -1;
    confirmBox.innerHTML = '<p id="tConfirmText"></p><div class="btn-row"><button type="button" class="btn ghost" id="tConfirmCancel">Cancel</button><button type="button" class="btn danger" id="tConfirmDelete">Delete All</button></div>';
    tMsg.parentNode.insertBefore(confirmBox, tMsg);

    var say = function (msg, withUndo) {
      tMsg.textContent = ""; /* re-announce identical messages */
      setTimeout(function () { tMsg.textContent = msg; }, 30);
      undoBtn.hidden = !withUndo;
      if (!withUndo) lastRemoved = null;
    };
    var save = function (msg, withUndo) {
      var ok = store.set(KEY, apps);
      say(ok ? (msg || "") : (msg ? msg + " " : "") + "This browser is not saving entries (private browsing or blocked storage). Copy them as CSV before you leave.", withUndo);
      return ok;
    };
    var render = function () {
      var f = tFilter.value;
      var rows = apps.map(function (a, i) { return { a: a, i: i }; }).filter(function (r) {
        if (!f) return true;
        if (f === "open") return ["Offer", "Rejected", "Withdrawn"].indexOf(r.a.status) === -1;
        return r.a.status === f;
      }).sort(function (x, y) { return (y.a.date || "").localeCompare(x.a.date || ""); });
      if (!rows.length) { tBody.innerHTML = '<tr><td colspan="7" class="empty">' + (apps.length ? "No applications match this filter." : "No applications yet. Add your first one above.") + "</td></tr>"; return; }
      tBody.innerHTML = rows.map(function (r) {
        var a = r.a, name = esc(a.firm) + (a.role ? ", " + esc(a.role) : "");
        return "<tr><td>" + esc(a.firm) + "</td><td>" + esc(a.role) + "</td><td>" + esc(a.track) + "</td><td>" + esc(a.date) + "</td><td><select data-i=\"" + r.i + "\" aria-label=\"Status for " + name + "\">" +
          STATUSES.map(function (s) { return "<option" + (s === a.status ? " selected" : "") + ">" + s + "</option>"; }).join("") +
          "</select></td><td>" + esc(a.next) + "</td><td><button type=\"button\" class=\"btn danger\" data-del=\"" + r.i + "\" aria-label=\"Remove " + name + "\">Remove</button></td></tr>";
      }).join("");
    };
    tBody.addEventListener("change", function (e) {
      if (e.target.matches("select[data-i]")) { var a = apps[+e.target.dataset.i]; a.status = e.target.value; save(a.firm + " is now " + a.status + "."); }
    });
    tBody.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-del]"); if (!b) return;
      var i = +b.dataset.del, a = apps[i];
      apps.splice(i, 1);
      lastRemoved = { app: a, index: i };
      render();
      save("Removed " + a.firm + ".", true);
      undoBtn.focus();
    });
    undoBtn.addEventListener("click", function () {
      if (!lastRemoved) return;
      var r = lastRemoved;
      apps.splice(Math.min(r.index, apps.length), 0, r.app);
      render();
      save("Restored " + r.app.firm + ".");
      var restored = tBody.querySelector('button[data-del="' + Math.min(r.index, apps.length - 1) + '"]');
      focusEl(restored || tFirm);
    });
    $("tAdd").addEventListener("click", function () {
      var firm = tFirm.value.trim();
      if (!firm) {
        tFirm.setAttribute("aria-invalid", "true"); tFirm.setAttribute("aria-describedby", "tMsg");
        say("Enter a firm name to add an application."); tFirm.focus(); return;
      }
      tFirm.removeAttribute("aria-invalid"); tFirm.removeAttribute("aria-describedby");
      apps.push({ firm: firm, role: $("tRole").value.trim(), track: $("tTrack").value,
        date: $("tDate").value, status: tStatus.value, next: $("tNext").value.trim() });
      render();
      save("Added " + firm + ".");
      ["tFirm", "tRole", "tNext"].forEach(function (id) { $(id).value = ""; });
      tFirm.focus(); /* ready for the next entry */
    });
    tFirm.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); $("tAdd").click(); } });
    tFirm.addEventListener("input", function () { if (tFirm.value.trim()) tFirm.removeAttribute("aria-invalid"); });
    tFilter.addEventListener("change", render);
    $("tCopy").addEventListener("click", function () {
      if (!apps.length) { say("Add an application before copying."); return; }
      var q = function (s) { return '"' + String(s || "").replace(/"/g, '""') + '"'; };
      var csv = ["Firm,Role,Track,Applied,Status,Next step"].concat(apps.map(function (a) { return [a.firm, a.role, a.track, a.date, a.status, a.next].map(q).join(","); })).join("\n");
      var done = function () { say("Copied " + apps.length + (apps.length === 1 ? " application" : " applications") + " as CSV."); };
      var fallback = function () {
        var ta = document.createElement("textarea"); ta.value = csv; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        if (ok) done(); else say("Copying is blocked here. Select the table and copy it manually.");
        $("tCopy").focus();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(csv).then(done, fallback); else fallback();
    });
    var hideConfirm = function (focusBack) { confirmBox.hidden = true; if (focusBack) tClear.focus(); scheduleHeight(); };
    tClear.setAttribute("aria-controls", "tConfirm");
    tClear.addEventListener("click", function () {
      if (!apps.length) { say("There are no applications to delete."); return; }
      $("tConfirmText").textContent = "Delete all " + apps.length + (apps.length === 1 ? " application" : " applications") + "? This can’t be undone.";
      confirmBox.hidden = false; undoBtn.hidden = true; lastRemoved = null;
      confirmBox.focus();
      scheduleHeight();
    });
    $("tConfirmCancel").addEventListener("click", function () { hideConfirm(true); });
    confirmBox.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); hideConfirm(true); } });
    $("tConfirmDelete").addEventListener("click", function () {
      var n = apps.length;
      apps = []; render(); hideConfirm(false);
      save("Deleted " + n + (n === 1 ? " application." : " applications."));
      tFirm.focus();
    });
    render();
    if (!store.available) say("This browser is not saving entries (private browsing or blocked storage). Copy them as CSV before you leave.");
  })();

  /* ---------------------------------------------------------------- Embed: report height to the host */
  var lastHeight = 0, heightQueued = false;
  function postHeight() {
    heightQueued = false;
    var h = Math.ceil(Math.max(root.getBoundingClientRect().height, document.body ? document.body.getBoundingClientRect().height : 0));
    if (h && h !== lastHeight) { lastHeight = h; postToHost({ type: "fqe-resources:height", height: h }); }
  }
  function scheduleHeight() {
    if (!embedded || heightQueued) return;
    heightQueued = true;
    (window.requestAnimationFrame || setTimeout)(postHeight);
  }
  if (embedded) {
    if ("ResizeObserver" in window) { var ro = new ResizeObserver(scheduleHeight); ro.observe(document.body); ro.observe(root); }
    window.addEventListener("resize", scheduleHeight);
    window.addEventListener("load", function () { lastHeight = 0; scheduleHeight(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleHeight);
  }

  route();
})();
