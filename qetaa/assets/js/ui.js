/* =========================================================================
   UI — the shell (theme, drawer, tabs, toasts) plus the shared render
   helpers every page uses: listing cards, seller cards, money, stars,
   car pickers and WhatsApp links.
   ========================================================================= */
window.UI = (function (w, d) {
  "use strict";

  var CFG = w.QETAA;

  /* ---- tiny helpers ----------------------------------------------------- */
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function lang() { return I18N.lang(); }
  function t(ar, en) { return I18N.t(ar, en); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function params() {
    var out = {}, q = w.location.search.replace(/^\?/, "");
    if (!q) return out;
    q.split("&").forEach(function (pair) {
      var kv = pair.split("=");
      if (kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });
    return out;
  }
  function money(n) {
    var v = Number(n || 0).toLocaleString(lang() === "en" ? "en-US" : "en-US");
    return '<span class="price"><span class="num">' + v + '</span><small>' +
           t(CFG.currency.ar, CFG.currency.en) + '</small></span>';
  }
  function since(dateStr) {
    if (!dateStr) return "";
    var days = Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (isNaN(days)) return "";
    if (days <= 0) return t("اليوم", "today");
    if (days === 1) return t("أمس", "yesterday");
    if (days < 7) return t("قبل " + days + " أيام", days + " days ago");
    if (days < 30) return t("قبل " + Math.round(days / 7) + " أسابيع", Math.round(days / 7) + " weeks ago");
    return t("قبل " + Math.round(days / 30) + " أشهر", Math.round(days / 30) + " months ago");
  }
  function toast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(el.__t);
    el.__t = setTimeout(function () { el.hidden = true; }, 3200);
  }

  /* ---- shell ------------------------------------------------------------ */
  function shell() {
    /* theme */
    var tb = $("#theme-btn");
    if (tb) tb.addEventListener("click", function () {
      var dark = d.documentElement.getAttribute("data-theme") === "dark";
      d.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
      try { localStorage.setItem("qetaa.theme", dark ? "light" : "dark"); } catch (e) {}
    });

    /* drawer */
    var drawer = $("#drawer"), open = $("#menu-btn"), close = $("#drawer-close");
    function setDrawer(on) {
      if (!drawer) return;
      drawer.hidden = !on;
      if (open) open.setAttribute("aria-expanded", on ? "true" : "false");
      d.body.style.overflow = on ? "hidden" : "";
    }
    if (open) open.addEventListener("click", function () { setDrawer(true); });
    if (close) close.addEventListener("click", function () { setDrawer(false); });
    if (drawer) drawer.addEventListener("click", function (e) { if (e.target === drawer) setDrawer(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

    /* bottom tab bar highlight */
    var page = (d.body.className.match(/page-([a-z0-9]+)/) || [])[1];
    $$(".tabbar a").forEach(function (a) {
      if (a.dataset.tab === page) a.classList.add("is-active");
    });

    /* contact links from config */
    $$("[data-site-href]").forEach(function (a) {
      var kind = a.dataset.siteHref;
      if (kind === "tel") a.href = "tel:" + CFG.phone;
      else if (kind === "mail") a.href = "mailto:" + CFG.email;
      else if (kind === "whatsapp") a.href = "https://wa.me/" + CFG.whatsapp;
      else if (CFG.social[kind]) a.href = CFG.social[kind];
    });
    $$("[data-site]").forEach(function (el) {
      var v = CFG[el.dataset.site];
      if (typeof v === "string") el.textContent = v;
    });

    /* favourite hearts, wherever they are */
    d.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".fav") : null;
      if (!btn) return;
      e.preventDefault();
      var on = DB.toggleFav(btn.dataset.id);
      btn.classList.toggle("is-on", on);
      toast(on ? t("أُضيفت إلى المفضلة", "Saved") : t("أُزيلت من المفضلة", "Removed"));
    });
  }

  /* ---- car pickers ------------------------------------------------------ */
  function fillMakes(sel, value, anyLabel) {
    if (!sel) return;
    var html = '<option value="">' + esc(anyLabel || t("كل الماركات", "All makes")) + "</option>";
    VEHICLES.makes.forEach(function (m) {
      html += '<option value="' + m.id + '">' + esc(lang() === "en" ? m.en : m.ar) + "</option>";
    });
    sel.innerHTML = html;
    if (value) sel.value = value;
  }
  function fillModels(makeId, sel, value, anyLabel) {
    if (!sel) return;
    var mk = VEHICLES.make(makeId),
        html = '<option value="">' + esc(anyLabel || t("كل الموديلات", "All models")) + "</option>";
    (mk ? mk.models : []).forEach(function (m) {
      html += '<option value="' + m.id + '">' + esc(lang() === "en" ? m.en : m.ar) + "</option>";
    });
    sel.innerHTML = html;
    sel.disabled = !mk;
    if (value) sel.value = value;
  }
  function fillYears(makeId, modelId, sel, value, anyLabel) {
    if (!sel) return;
    var years = VEHICLES.years(makeId, modelId),
        html = '<option value="">' + esc(anyLabel || t("كل السنوات", "Any year")) + "</option>";
    years.forEach(function (y) { html += '<option value="' + y + '">' + y + "</option>"; });
    sel.innerHTML = html;
    if (value) sel.value = value;
  }
  function fillCities(sel, value, anyLabel) {
    if (!sel) return;
    var html = '<option value="">' + esc(anyLabel || t("كل المدن", "All cities")) + "</option>";
    TAX.cities.forEach(function (c) {
      html += '<option value="' + c.id + '">' + esc(lang() === "en" ? c.en : c.ar) + "</option>";
    });
    sel.innerHTML = html;
    if (value) sel.value = value;
  }
  function fillCategories(sel, value, anyLabel) {
    if (!sel) return;
    var html = '<option value="">' + esc(anyLabel || t("كل الأقسام", "All categories")) + "</option>";
    TAX.categories.forEach(function (c) {
      html += '<option value="' + c.id + '">' + esc(lang() === "en" ? c.en : c.ar) + "</option>";
    });
    sel.innerHTML = html;
    if (value) sel.value = value;
  }
  /* wire a make → model → year chain that keeps itself consistent */
  function carChain(makeSel, modelSel, yearSel, preset) {
    preset = preset || {};
    fillMakes(makeSel, preset.make);
    fillModels(preset.make, modelSel, preset.model);
    fillYears(preset.make, preset.model, yearSel, preset.year);
    if (makeSel) makeSel.addEventListener("change", function () {
      fillModels(makeSel.value, modelSel);
      fillYears(makeSel.value, "", yearSel);
    });
    if (modelSel) modelSel.addEventListener("change", function () {
      fillYears(makeSel ? makeSel.value : "", modelSel.value, yearSel);
    });
  }

  /* ---- render bits ------------------------------------------------------ */
  /* a seller's display name in the active language, and its avatar letter */
  function sellerName(s) {
    if (!s) return "";
    return (lang() === "en" && s.name_en) ? s.name_en : (s.name || "");
  }
  function initial(s) {
    return (sellerName(s) || "?").trim().charAt(0) || "?";
  }

  function stars(rating, count) {
    var full = Math.round(rating || 0), out = '<span class="stars">', i;
    for (i = 0; i < 5; i++)
      out += '<svg viewBox="0 0 24 24" style="opacity:' + (i < full ? 1 : .25) +
             '"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
    out += '<span class="num">' + (rating || 0).toFixed(1) + "</span>";
    if (count != null) out += "<span>(" + count + ")</span>";
    return out + "</span>";
  }

  function condBars(cond) {
    var c = typeof cond === "string" ? (TAX.find(TAX.conditions, cond) || TAX.conditions[1]) : cond,
        out = '<span class="cond"><span class="cond-bars' + (c.bars <= 2 ? " warn" : "") + '">', i;
    for (i = 0; i < 4; i++) out += "<i" + (i < c.bars ? ' class="on"' : "") + "></i>";
    return out + "</span>" + esc(lang() === "en" ? c.en : c.ar) + "</span>";
  }

  /* the compact one-word version, for a results grid where four cards'
     worth of bar-meters would just be noise */
  function condDot(cond) {
    var c = typeof cond === "string" ? (TAX.find(TAX.conditions, cond) || TAX.conditions[1]) : cond;
    return '<span class="cond-dot' + (c.bars <= 2 ? " warn" : "") + '"></span>' +
      esc(lang() === "en" ? c.en : c.ar);
  }

  /* A results card answers three questions at a glance — what, does it fit,
     how much — and nothing else competes with them. Everything a buyer
     needs beyond that (warranty, OEM number, seller trust) lives one tap
     away on the part page, not stacked as badges on every tile. */
  function listingCard(l) {
    var fav = DB.isFav(l.id),
        badge = l.featured ? '<span class="badge b-amber">' + t("مميّز", "Featured") + "</span>"
              : l.warranty_days > 0 ? '<span class="badge b-green">' +
                  t("بضمان", "Warranty") + "</span>" : "";
    return '<a class="pcard" href="part.html?id=' + encodeURIComponent(l.id) + '">' +
      '<div class="pcard-media">' +
        '<img loading="lazy" src="' + QART.photo(l, 0) + '" alt="' + esc(l.part_name) + '">' +
        (badge ? '<div class="media-badges">' + badge + "</div>" : "") +
        '<button class="fav' + (fav ? " is-on" : "") + '" data-id="' + l.id +
          '" type="button" aria-label="' + t("حفظ", "Save") + '">' +
          '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/></svg>' +
        "</button>" +
      "</div>" +
      '<div class="pcard-body">' +
        '<div class="pcard-title">' + esc(l.part_name) + "</div>" +
        '<div class="pcard-fit">' + esc(l.fits) + "</div>" +
        '<div class="pcard-foot">' +
          "<span>" + money(l.price) +
            (l.price_old ? ' <span class="price-old num">' + l.price_old + "</span>" : "") + "</span>" +
          '<span class="pcard-meta">' + condDot(l.condition) + " · " + esc(l.city_label) + "</span>" +
        "</div>" +
      "</div>" +
    "</a>";
  }

  function listingGrid(el, items, emptyHtml) {
    if (!el) return;
    if (!items.length) { el.innerHTML = emptyHtml || emptyState(); return; }
    el.innerHTML = items.map(listingCard).join("");
  }

  function emptyState(title, body, cta) {
    return '<div class="empty">' +
      '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 5 5"/></svg>' +
      "<h3>" + esc(title || t("ما لقينا نتائج", "Nothing found")) + "</h3>" +
      "<p>" + esc(body || t("جرّب تغيير الفلاتر، أو اطلب القطعة ونوصلها للتشاليح.",
                            "Try changing the filters, or post a request and let the yards come to you.")) + "</p>" +
      (cta === false ? "" : '<a class="btn btn-primary" href="request.html">' +
        t("اطلب القطعة", "Post a request") + "</a>") +
    "</div>";
  }

  function sellerCard(s) {
    return '<a class="seller-card" href="seller.html?id=' + encodeURIComponent(s.slug || s.id) + '">' +
      '<span class="avatar">' + esc(initial(s)) + "</span>" +
      "<div>" +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          "<b>" + esc(sellerName(s)) + "</b>" +
          (s.verified ? '<span class="badge b-blue">' + t("موثّق", "Verified") + "</span>" : "") +
        "</div>" +
        '<div class="muted" style="font-size:.86rem">' + esc(s.type_label || "") + " · " +
          esc(s.city_label || "") + (s.district ? " · " + esc(s.district) : "") + "</div>" +
        '<div style="margin-top:6px">' + stars(s.rating, s.reviews_count) + "</div>" +
      "</div>" +
    "</a>";
  }

  /* WhatsApp deep link with a ready-written message — the way this trade
     actually closes deals in Saudi */
  function waLink(phoneDigits, text) {
    return "https://wa.me/" + String(phoneDigits || CFG.whatsapp).replace(/\D/g, "") +
           "?text=" + encodeURIComponent(text || "");
  }
  function listingWaText(l) {
    return t(
      "السلام عليكم، شفت إعلانك في موقع قطع:\n" + l.part_name + " — " + l.fits +
      "\nرقم الإعلان: " + l.ref + "\nالسعر المعروض: " + l.price + " ريال\nهل ما زالت متوفرة؟",
      "Hello, I saw your listing on Qetaa:\n" + l.part_name + " — " + l.fits +
      "\nRef: " + l.ref + "\nListed price: " + l.price + " SAR\nIs it still available?"
    );
  }

  /* ---- boot ------------------------------------------------------------- */
  function ready(fn) {
    if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(shell);

  return {
    $: $, $$: $$, esc: esc, params: params, money: money, since: since, toast: toast,
    lang: lang, t: t, ready: ready,
    fillMakes: fillMakes, fillModels: fillModels, fillYears: fillYears,
    fillCities: fillCities, fillCategories: fillCategories, carChain: carChain,
    stars: stars, condBars: condBars, sellerName: sellerName, initial: initial, listingCard: listingCard, listingGrid: listingGrid,
    sellerCard: sellerCard, emptyState: emptyState, waLink: waLink, listingWaText: listingWaText
  };
})(window, document);
