/* =========================================================================
   UI — shared behaviour for every page:
   header, mobile drawer, theme, language button, scroll reveal, counters,
   testimonial slider, and the renderers that turn DATA into markup.
   ========================================================================= */
(function (w, d) {
  "use strict";

  var $  = function (s, r) { return (r || d).querySelector(s); },
      $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); },
      S  = w.SITE || {};

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
  }
  function pick(o) { return w.I18N ? w.I18N.pick(o) : (o && (o.ar || o)); }
  function t(k, ar) { return w.I18N ? w.I18N.t(k, ar) : ar; }
  function ico(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           w.MEDIA.icon(name) + "</svg>";
  }
  var ARROW = '<svg class="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
              'stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

  /* ---- company details written into the page ------------------------- */
  function initSite() {
    $$("[data-site]").forEach(function (el) {
      var key = el.dataset.site, val = S[key];
      if (val === undefined) return;
      el.textContent = (val && typeof val === "object") ? pick(val) : val;
    });
    $$("[data-site-href]").forEach(function (el) {
      var kind = el.dataset.siteHref, href = "";
      if (kind === "tel")   href = "tel:" + (S.phone || "");
      if (kind === "mail")  href = "mailto:" + (S.email || "");
      if (kind === "sales") href = "mailto:" + (S.salesEmail || S.email || "");
      if (kind === "hr")    href = "mailto:" + (S.hrEmail || S.email || "");
      if (kind === "wa")    href = "https://wa.me/" + (S.whatsapp || "");
      if (kind === "map")   href = S.mapLink || "#";
      if (href) el.setAttribute("href", href);
    });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    var pat = $$(".hero-pattern");
    pat.forEach(function (el) { el.style.backgroundImage = w.MEDIA.pattern(); });

    /* decorative frames: <div class="frame" data-art="story"> */
    var ART = {
      intro:    { p: "red",   g: "building" },
      process:  { p: "mix",   g: "box" },
      story:    { p: "ink",   g: "globe" },
      timeline: { p: "gold",  g: "chart" },
      projects: { p: "steel", g: "truck" }
    };
    $$("[data-art]").forEach(function (el) {
      if (el.querySelector("svg[data-generated]")) return;
      var k = el.dataset.art, cfg = ART[k] || { p: "red", g: "box" };
      var html = w.MEDIA.art({ seed: k, palette: cfg.p, glyph: w.MEDIA.icon(cfg.g), w: 900, h: 900 })
                  .replace("<svg ", "<svg data-generated ");
      el.insertAdjacentHTML("afterbegin", html);
    });
    var mapEl = $("[data-map-embed]");
    if (mapEl && S.mapEmbed) mapEl.setAttribute("src", S.mapEmbed);
  }

  /* ---- header, drawer, theme, language ------------------------------- */
  function initHeader() {
    var header = $(".header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-stuck", w.scrollY > 8); };
      onScroll(); w.addEventListener("scroll", onScroll, { passive: true });
    }
    /* mark the current page in the navigation */
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav a, .d-link").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0].split("/").pop();
      if (href && href === here) a.classList.add("is-active");
    });
  }

  function initDrawer() {
    var drawer = $(".drawer"), burger = $(".burger");
    if (!drawer || !burger) return;
    var open = function () {
      drawer.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      d.body.style.overflow = "hidden";
      var first = drawer.querySelector("a,button");
      if (first) first.focus();
    };
    var close = function () {
      drawer.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      d.body.style.overflow = "";
    };
    burger.addEventListener("click", open);
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-drawer-close]") || e.target.classList.contains("drawer-veil")) close();
      if (e.target.closest("a.d-link")) close();
    });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  function initTheme() {
    var btn = $("[data-theme-btn]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var now = d.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      d.documentElement.setAttribute("data-theme", now);
      try { localStorage.setItem("najd.theme", now); } catch (e) {}
    });
  }

  function initLang() {
    $$("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () { w.I18N.toggle(); });
    });
  }

  /* ---- motion --------------------------------------------------------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in w)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, i = +(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add("is-in"); }, i);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length || !("IntersectionObserver" in w)) {
      els.forEach(function (el) { el.textContent = el.dataset.count; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count), dur = 1100, t0 = null;
        io.unobserve(el);
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: .4 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initTop() {
    var btn = $(".to-top");
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle("is-on", w.scrollY > 600); };
    onScroll(); w.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () { w.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---- renderers ------------------------------------------------------ */
  var R = {};

  R.services = function (el) {
    var limit = +(el.dataset.limit || 0), list = w.DATA.services.slice(0, limit || undefined);
    el.innerHTML = list.map(function (s, i) {
      return '<article class="card reveal" data-delay="' + (i * 70) + '">' +
        '<div class="card-icon">' + ico(s.icon) + "</div>" +
        "<h3>" + esc(pick(s.t)) + "</h3>" +
        "<p>" + esc(pick(s.d)) + "</p>" +
        '<ul class="card-list">' + pick(s.items).slice(0, 4).map(function (x) {
          return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<a class="link-arrow" href="services.html#' + s.id + '">' +
          esc(t("ui.more", "تفاصيل الخدمة")) + ARROW + "</a>" +
        "</article>";
    }).join("");
  };

  R.servicesDetail = function (el) {
    el.innerHTML = w.DATA.services.map(function (s, i) {
      var art = w.MEDIA.art({ seed: s.id, palette: s.palette, glyph: w.MEDIA.icon(s.icon), w: 800, h: 620, label: pick(s.t) });
      var flip = i % 2 === 1;
      return '<section class="section' + (flip ? " section--tint" : "") + '" id="' + s.id + '">' +
        '<div class="wrap"><div class="split">' +
          '<div class="reveal"' + (flip ? ' style="order:2"' : "") + ">" +
            '<span class="eyebrow">' + esc(t("ui.division", "قسم")) + " 0" + (i + 1) + "</span>" +
            '<h2 class="sec-title">' + esc(pick(s.t)) + "</h2>" +
            '<p class="sec-lead">' + esc(pick(s.d)) + "</p>" +
            '<ul class="check-list" style="margin:26px 0">' + pick(s.items).map(function (x) {
              return '<li><span class="ck">' + CHECK + "</span><span>" + esc(x) + "</span></li>"; }).join("") + "</ul>" +
            '<a class="btn btn-primary" href="quote.html?service=' + s.id + '">' +
              esc(t("ui.askQuote", "اطلب عرض سعر")) + ARROW + "</a>" +
          "</div>" +
          '<div class="frame reveal" style="aspect-ratio:4/3' + (flip ? ";order:1" : "") + '">' + art + "</div>" +
        "</div></div></section>";
    }).join("");
  };

  R.sectors = function (el) {
    el.innerHTML = w.DATA.sectors.map(function (s, i) {
      var art = w.MEDIA.art({ seed: s.id, palette: s.palette, w: 600, h: 420 });
      return '<article class="sector reveal" data-delay="' + (i * 60) + '">' +
        '<div class="sector-art">' + art + "</div>" +
        '<span class="s-ico">' + ico(s.icon) + "</span>" +
        "<h3>" + esc(pick(s.t)) + "</h3><p>" + esc(pick(s.d)) + "</p></article>";
    }).join("");
  };

  R.projects = function (el) {
    var limit = +(el.dataset.limit || 0);
    el.innerHTML = w.DATA.projects.slice(0, limit || undefined).map(function (p, i) {
      var art = w.MEDIA.art({ seed: p.id, palette: p.palette, glyph: w.MEDIA.icon(p.icon), w: 800, h: 500, label: pick(p.t) });
      return '<article class="proj reveal" data-delay="' + (i * 70) + '">' +
        '<div class="proj-art">' + art + "</div>" +
        '<div class="proj-body">' +
          '<div class="proj-meta">' +
            "<span>" + ico("clock") + esc(p.year) + "</span>" +
            "<span>" + ico("box") + esc(pick(p.sector)) + "</span>" +
            "<span>" + ico("users") + esc(pick(p.client)) + "</span>" +
          "</div>" +
          "<h3>" + esc(pick(p.t)) + "</h3>" +
          '<p class="muted">' + esc(pick(p.d)) + "</p>" +
          '<div class="proj-kpis">' + p.kpis.map(function (k) {
            return '<div class="proj-kpi"><b>' + esc(k.n) + "</b><span>" + esc(pick(k.l)) + "</span></div>"; }).join("") +
          "</div>" +
        "</div></article>";
    }).join("");
  };

  R.quotes = function (el) {
    el.innerHTML =
      '<div class="quote-track">' + w.DATA.quotes.map(function (q) {
        return '<div class="quote-item"><div class="quote-body">' +
          '<p class="quote-text">' + esc(pick(q.text)) + "</p>" +
          '<div class="quote-who"><span class="quote-av" aria-hidden="true">' + esc(q.initials) + "</span>" +
          '<div><div class="quote-name">' + esc(pick(q.name)) + "</div>" +
          '<div class="quote-role">' + esc(pick(q.role)) + "</div></div></div>" +
          "</div></div>"; }).join("") + "</div>" +
      '<div class="quote-nav">' + w.DATA.quotes.map(function (q, i) {
        return '<button class="quote-dot' + (i ? "" : " is-on") + '" data-go="' + i + '" ' +
               'aria-label="' + (i + 1) + '"></button>'; }).join("") + "</div>";
    startSlider(el);
  };

  function startSlider(el) {
    var track = $(".quote-track", el), dots = $$(".quote-dot", el), i = 0, timer;
    if (!track) return;
    var go = function (n) {
      i = (n + dots.length) % dots.length;
      var dir = (w.I18N && w.I18N.isRTL()) ? 1 : -1;
      track.style.transform = "translateX(" + (dir * i * 100) + "%)";
      dots.forEach(function (b, k) { b.classList.toggle("is-on", k === i); });
    };
    dots.forEach(function (b) { b.addEventListener("click", function () { go(+b.dataset.go); restart(); }); });
    function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 7000); }
    go(0); restart();
    el.addEventListener("mouseenter", function () { clearInterval(timer); });
    el.addEventListener("mouseleave", restart);
  }

  R.faq = function (el) {
    var limit = +(el.dataset.limit || 0);
    el.innerHTML = w.DATA.faq.slice(0, limit || undefined).map(function (f) {
      return "<details class=\"acc-item reveal\"><summary class=\"acc-head\">" +
        "<span>" + esc(pick(f.q)) + "</span>" +
        '<span class="ai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span></summary>' +
        '<div class="acc-body">' + esc(pick(f.a)) + "</div></details>";
    }).join("");
  };

  R.jobs = function (el) {
    el.innerHTML = w.DATA.jobs.map(function (j, i) {
      return '<article class="job reveal" data-delay="' + (i * 60) + '">' +
        "<div><h3>" + esc(pick(j.t)) + "</h3>" +
        '<div class="job-meta"><span>' + ico("users") + " " + esc(pick(j.dept)) + "</span>" +
        "<span>" + ico("globe") + " " + esc(pick(j.loc)) + "</span>" +
        "<span>" + ico("clock") + " " + esc(pick(j.type)) + "</span></div>" +
        '<p class="muted" style="margin:10px 0 0;max-width:60ch">' + esc(pick(j.d)) + "</p></div>" +
        '<a class="btn btn-ghost btn-sm" href="careers.html#apply" data-apply="' + esc(pick(j.t)) + '">' +
        esc(t("ui.apply", "التقديم")) + ARROW + "</a></article>";
    }).join("");
    $$("[data-apply]", el).forEach(function (a) {
      a.addEventListener("click", function () {
        var sel = $("#job-role");
        if (sel) sel.value = a.dataset.apply;
      });
    });
  };

  R.featured = function (el) {
    var list = w.DATA.products.filter(function (p) { return p.featured; });
    el.innerHTML = list.map(function (p, i) {
      return '<article class="prod reveal" data-delay="' + (i * 60) + '">' +
        '<div class="prod-art">' + w.MEDIA.art({ seed: p.id, palette: p.palette, glyph: w.MEDIA.icon(p.icon), w: 600, h: 450, label: pick(p.t) }) + "</div>" +
        '<div class="prod-body"><span class="prod-cat">' + esc(catName(p.cat)) + "</span>" +
        "<h3>" + esc(pick(p.t)) + "</h3><p>" + esc(pick(p.d)) + "</p>" +
        '<div class="prod-foot"><a class="link-arrow" href="products.html#' + p.id + '">' +
        esc(t("ui.details", "التفاصيل")) + ARROW + "</a></div></div></article>";
    }).join("");
  };

  function catName(id) {
    var c = w.DATA.categories.filter(function (x) { return x.id === id; })[0];
    return c ? pick(c.t) : id;
  }

  function runRenderers() {
    $$("[data-render]").forEach(function (el) {
      var fn = R[el.dataset.render];
      if (fn) fn(el);
    });
    if (w.I18N) w.I18N.refresh();
    initReveal();
    initCounters();
  }

  /* ---- boot ----------------------------------------------------------- */
  function boot() {
    initSite();
    initHeader();
    initDrawer();
    initTheme();
    initLang();
    initTop();
    runRenderers();
    d.addEventListener("langchange", function () {
      initSite();
      runRenderers();
      $$(".reveal").forEach(function (e) { e.classList.add("is-in"); });
      if (w.CATALOG && w.CATALOG.render) w.CATALOG.render();
      if (w.RFQ && w.RFQ.render) w.RFQ.render();
    });
  }

  w.UI = { esc: esc, pick: pick, t: t, icon: ico, arrow: ARROW, check: CHECK, catName: catName, render: R, boot: boot, $: $, $$: $$ };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})(window, document);
