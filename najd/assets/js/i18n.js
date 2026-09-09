/* =========================================================================
   BILINGUAL ENGINE
   Arabic is the source of truth: the Arabic copy lives in the HTML, so the
   page reads correctly with JavaScript switched off. This module captures
   that original text on load and swaps it for the English strings in
   lang-en.js when the visitor picks English (and back again).

   Markup contract:
     data-i18n="key"        → textContent
     data-i18n-html="key"   → innerHTML (for copy with inline markup)
     data-i18n-ph="key"     → placeholder
     data-i18n-aria="key"   → aria-label
     data-i18n-title="key"  → title
     data-i18n-content="key"→ content attribute (meta tags)
   ========================================================================= */
(function (w, d) {
  "use strict";

  var STORE_KEY = "najd.lang",
      EN = w.I18N_EN || {},
      current = "ar",
      captured = false;

  var ATTRS = [
    { data: "i18n",         apply: function (el, v) { el.textContent = v; },              read: function (el) { return el.textContent; } },
    { data: "i18nHtml",     apply: function (el, v) { el.innerHTML = v; },                read: function (el) { return el.innerHTML; } },
    { data: "i18nPh",       apply: function (el, v) { el.setAttribute("placeholder", v); },read: function (el) { return el.getAttribute("placeholder") || ""; } },
    { data: "i18nAria",     apply: function (el, v) { el.setAttribute("aria-label", v); }, read: function (el) { return el.getAttribute("aria-label") || ""; } },
    { data: "i18nTitle",    apply: function (el, v) { el.setAttribute("title", v); },      read: function (el) { return el.getAttribute("title") || ""; } },
    { data: "i18nContent",  apply: function (el, v) { el.setAttribute("content", v); },    read: function (el) { return el.getAttribute("content") || ""; } }
  ];

  function selector() {
    return "[data-i18n],[data-i18n-html],[data-i18n-ph],[data-i18n-aria],[data-i18n-title],[data-i18n-content]";
  }

  /* remember the Arabic that shipped in the HTML */
  function capture(root) {
    var nodes = (root || d).querySelectorAll(selector());
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.__ar) return;
      el.__ar = {};
      ATTRS.forEach(function (a) {
        var key = el.dataset[a.data];
        if (key) el.__ar[a.data] = a.read(el);
      });
    });
  }

  function translate(root) {
    var nodes = (root || d).querySelectorAll(selector());
    Array.prototype.forEach.call(nodes, function (el) {
      ATTRS.forEach(function (a) {
        var key = el.dataset[a.data];
        if (!key) return;
        var val = current === "en" ? EN[key] : (el.__ar ? el.__ar[a.data] : null);
        if (val === undefined || val === null) return;   // untranslated → keep Arabic
        a.apply(el, val);
      });
    });
  }

  function setLang(lang, persist) {
    current = lang === "en" ? "en" : "ar";
    d.documentElement.setAttribute("lang", current);
    d.documentElement.setAttribute("dir", current === "en" ? "ltr" : "rtl");
    if (persist !== false) { try { localStorage.setItem(STORE_KEY, current); } catch (e) {} }
    translate();
    /* label on the toggle always offers the *other* language */
    Array.prototype.forEach.call(d.querySelectorAll("[data-lang-label]"), function (el) {
      el.textContent = current === "ar" ? "EN" : "عربي";
    });
    Array.prototype.forEach.call(d.querySelectorAll("[data-lang-btn]"), function (el) {
      el.setAttribute("aria-label", current === "ar" ? "Switch to English" : "التبديل إلى العربية");
    });
    d.dispatchEvent(new CustomEvent("langchange", { detail: { lang: current } }));
  }

  var I18N = {
    get lang() { return current; },
    /** value for the active language out of a {ar,en} object */
    pick: function (obj) {
      if (obj === null || obj === undefined) return "";
      if (typeof obj === "string") return obj;
      return obj[current] !== undefined ? obj[current] : (obj.ar || "");
    },
    /** a UI string that has no Arabic source in the HTML */
    t: function (key, fallbackAr) {
      if (current === "en" && EN[key] !== undefined) return EN[key];
      return fallbackAr !== undefined ? fallbackAr : (EN[key] || key);
    },
    set: setLang,
    toggle: function () { setLang(current === "ar" ? "en" : "ar"); },
    /** call after injecting new markup so it picks up the active language */
    refresh: function (root) { capture(root); translate(root); },
    isRTL: function () { return current === "ar"; }
  };

  function boot() {
    if (captured) return;
    capture();
    captured = true;
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    var initial = saved || (w.SITE && w.SITE.defaultLang) || "ar";
    /* honour ?lang=en so links can open a specific language */
    var q = (location.search.match(/[?&]lang=(ar|en)/) || [])[1];
    setLang(q || initial, !!q || !!saved);
  }

  w.I18N = I18N;
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})(window, document);
