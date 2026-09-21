/* =========================================================================
   BILINGUAL ENGINE
   Arabic is the source of truth: the Arabic copy lives in the HTML, so the
   page reads correctly with JavaScript off. This module remembers that
   original text and swaps it for the English in lang-en.js on request.

   Markup contract:
     data-i18n="key"         → textContent
     data-i18n-html="key"    → innerHTML
     data-i18n-ph="key"      → placeholder
     data-i18n-aria="key"    → aria-label
     data-i18n-title="key"   → title
     data-i18n-content="key" → content (meta tags)
   ========================================================================= */
window.I18N = (function (w, d) {
  "use strict";

  var STORE = "qetaa.lang",
      EN = w.I18N_EN || {},
      current = "ar";

  var ATTRS = [
    { k:"i18n",        set:function(e,v){e.textContent=v;},                get:function(e){return e.textContent;} },
    { k:"i18nHtml",    set:function(e,v){e.innerHTML=v;},                  get:function(e){return e.innerHTML;} },
    { k:"i18nPh",      set:function(e,v){e.setAttribute("placeholder",v);},get:function(e){return e.getAttribute("placeholder")||"";} },
    { k:"i18nAria",    set:function(e,v){e.setAttribute("aria-label",v);}, get:function(e){return e.getAttribute("aria-label")||"";} },
    { k:"i18nTitle",   set:function(e,v){e.setAttribute("title",v);},      get:function(e){return e.getAttribute("title")||"";} },
    { k:"i18nContent", set:function(e,v){e.setAttribute("content",v);},    get:function(e){return e.getAttribute("content")||"";} }
  ];

  var SEL = "[data-i18n],[data-i18n-html],[data-i18n-ph],[data-i18n-aria],[data-i18n-title],[data-i18n-content]";

  function capture(root) {
    var nodes = (root || d).querySelectorAll(SEL);
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.__ar) return;
      el.__ar = {};
      ATTRS.forEach(function (a) { if (el.dataset[a.k]) el.__ar[a.k] = a.get(el); });
    });
  }

  function paint(root) {
    var nodes = (root || d).querySelectorAll(SEL);
    Array.prototype.forEach.call(nodes, function (el) {
      ATTRS.forEach(function (a) {
        var key = el.dataset[a.k], val;
        if (!key) return;
        if (current === "en") { val = EN[key]; if (val == null) return; }
        else { val = el.__ar ? el.__ar[a.k] : null; if (val == null) return; }
        a.set(el, val);
      });
    });
  }

  function apply(lang, announce) {
    current = (lang === "en") ? "en" : "ar";
    d.documentElement.lang = current;
    d.documentElement.dir = current === "en" ? "ltr" : "rtl";
    paint();
    var btn = d.getElementById("lang-btn");
    if (btn) btn.textContent = current === "en" ? "عربي" : "EN";
    try { localStorage.setItem(STORE, current); } catch (e) {}
    if (announce !== false) d.dispatchEvent(new CustomEvent("langchange", { detail: current }));
  }

  function init() {
    capture();
    var saved;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    apply(saved === "en" ? "en" : (w.QETAA ? w.QETAA.defaultLang : "ar"), false);
    var btn = d.getElementById("lang-btn");
    if (btn) btn.addEventListener("click", function () { apply(current === "en" ? "ar" : "en"); });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    lang: function () { return current; },
    set: apply,
    /* translate freshly injected markup (cards, rows, lists…) */
    refresh: function (root) { capture(root); paint(root); },
    /* inline pair for strings built in JavaScript */
    t: function (ar, en) { return current === "en" ? (en == null ? ar : en) : ar; }
  };
})(window, document);
