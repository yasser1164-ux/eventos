/* =========================================================================
   CATALOGUE — search, filter, sort, and "add to quote".
   State lives in the URL query string, so a filtered view can be shared.
   ========================================================================= */
(function (w, d) {
  "use strict";

  var $ = w.UI.$, $$ = w.UI.$$, esc = w.UI.esc, pick = w.UI.pick, t = w.UI.t;

  var state = { q: "", cats: [], avs: [], sort: "default" };

  function fromUrl() {
    var p = new URLSearchParams(location.search);
    state.q = p.get("q") || "";
    state.cats = (p.get("cat") || "").split(",").filter(Boolean);
    state.avs = (p.get("av") || "").split(",").filter(Boolean);
    state.sort = p.get("sort") || "default";
  }
  function toUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cats.length) p.set("cat", state.cats.join(","));
    if (state.avs.length) p.set("av", state.avs.join(","));
    if (state.sort !== "default") p.set("sort", state.sort);
    var qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  function matches(p) {
    if (state.cats.length && state.cats.indexOf(p.cat) === -1) return false;
    if (state.avs.length && state.avs.indexOf(p.av) === -1) return false;
    if (state.q) {
      var hay = [p.id, p.t.ar, p.t.en, p.d.ar, p.d.en].join(" ").toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(function (term) { return hay.indexOf(term) !== -1; })) return false;
    }
    return true;
  }

  function sorted(list) {
    var l = list.slice();
    if (state.sort === "az") l.sort(function (a, b) { return pick(a.t).localeCompare(pick(b.t), "ar"); });
    if (state.sort === "za") l.sort(function (a, b) { return pick(b.t).localeCompare(pick(a.t), "ar"); });
    if (state.sort === "stock") l.sort(function (a, b) { return (a.av === "stock" ? -1 : 1) - (b.av === "stock" ? -1 : 1); });
    return l;
  }

  function avName(id) {
    var a = w.DATA.availability.filter(function (x) { return x.id === id; })[0];
    return a ? pick(a.t) : id;
  }

  function card(p) {
    var inList = w.CART.has(p.id);
    return '<article class="prod" id="' + p.id + '">' +
      '<div class="prod-art">' +
        w.MEDIA.art({ seed: p.id, palette: p.palette, glyph: w.MEDIA.icon(p.icon), w: 600, h: 450, label: pick(p.t) }) +
        '<span class="tag' + (p.av === "stock" ? "" : " tag-red") + '">' + esc(avName(p.av)) + "</span>" +
      "</div>" +
      '<div class="prod-body">' +
        '<span class="prod-cat">' + esc(w.UI.catName(p.cat)) + "</span>" +
        "<h3>" + esc(pick(p.t)) + "</h3>" +
        "<p>" + esc(pick(p.d)) + "</p>" +
        '<div class="prod-meta">' + pick(p.specs).map(function (s) {
          return "<span>• " + esc(s) + "</span>"; }).join("") + "</div>" +
        '<div class="prod-meta" style="opacity:.8"><span dir="ltr">' + esc(p.id) + "</span>" +
        "<span>" + esc(t("catalog.unit", "الوحدة")) + ": " + esc(pick(p.unit)) + "</span></div>" +
        '<div class="prod-foot">' +
          '<button class="btn btn-sm ' + (inList ? "btn-ghost" : "btn-primary") + '" data-add="' + esc(p.id) + '">' +
            (inList ? esc(t("catalog.added", "أُضيف للطلب")) : esc(t("catalog.add", "أضف لطلب التسعير"))) +
          "</button>" +
        "</div>" +
      "</div></article>";
  }

  function render() {
    var grid = $("#prod-grid");
    if (!grid) return;
    var list = sorted(w.DATA.products.filter(matches));

    grid.innerHTML = list.length ? list.map(card).join("") :
      '<div class="empty-state" style="grid-column:1/-1">' +
        '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
        "<p><strong>" + esc(t("catalog.emptyTitle", "لا توجد نتائج مطابقة")) + "</strong></p>" +
        "<p>" + esc(t("catalog.emptyBody", "جرّب كلمة بحث أخرى أو أزل بعض عوامل التصفية.")) + "</p>" +
        '<button class="btn btn-ghost btn-sm" data-reset>' + esc(t("catalog.reset", "إعادة ضبط")) + "</button>" +
      "</div>";

    var cnt = $("#result-count");
    if (cnt) cnt.textContent = list.length;

    $$("[data-add]", grid).forEach(function (b) {
      b.addEventListener("click", function () {
        w.CART.add(b.dataset.add, 1);
        b.className = "btn btn-sm btn-ghost";
        b.textContent = t("catalog.added", "أُضيف للطلب");
      });
    });
    var reset = $("[data-reset]", grid);
    if (reset) reset.addEventListener("click", clearAll);
  }

  function buildFilters() {
    var host = $("#filters");
    if (!host) return;
    var count = function (fn) { return w.DATA.products.filter(fn).length; };

    host.innerHTML =
      '<div class="filter-group"><h3>' + esc(t("catalog.byCat", "الفئة")) + "</h3>" +
        w.DATA.categories.map(function (c) {
          return '<label class="f-opt"><input type="checkbox" data-cat="' + c.id + '"' +
            (state.cats.indexOf(c.id) > -1 ? " checked" : "") + "><span>" + esc(pick(c.t)) + "</span>" +
            '<span class="cnt">' + count(function (p) { return p.cat === c.id; }) + "</span></label>";
        }).join("") + "</div>" +
      '<div class="filter-group"><h3>' + esc(t("catalog.byAv", "التوفر")) + "</h3>" +
        w.DATA.availability.map(function (a) {
          return '<label class="f-opt"><input type="checkbox" data-av="' + a.id + '"' +
            (state.avs.indexOf(a.id) > -1 ? " checked" : "") + "><span>" + esc(pick(a.t)) + "</span>" +
            '<span class="cnt">' + count(function (p) { return p.av === a.id; }) + "</span></label>";
        }).join("") + "</div>" +
      '<button class="btn btn-ghost btn-sm btn-block" data-clear>' + esc(t("catalog.reset", "إعادة ضبط")) + "</button>";

    $$("[data-cat]", host).forEach(function (i) {
      i.addEventListener("change", function () {
        state.cats = $$("[data-cat]:checked", host).map(function (x) { return x.dataset.cat; });
        toUrl(); render();
      });
    });
    $$("[data-av]", host).forEach(function (i) {
      i.addEventListener("change", function () {
        state.avs = $$("[data-av]:checked", host).map(function (x) { return x.dataset.av; });
        toUrl(); render();
      });
    });
    $("[data-clear]", host).addEventListener("click", clearAll);
  }

  function clearAll() {
    state = { q: "", cats: [], avs: [], sort: "default" };
    var s = $("#catalog-search"); if (s) s.value = "";
    var so = $("#catalog-sort"); if (so) so.value = "default";
    toUrl(); buildFilters(); render();
  }

  function boot() {
    if (!$("#prod-grid")) return;
    fromUrl();
    var s = $("#catalog-search");
    if (s) {
      s.value = state.q;
      var timer;
      s.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () { state.q = s.value.trim(); toUrl(); render(); }, 180);
      });
    }
    var so = $("#catalog-sort");
    if (so) {
      so.value = state.sort;
      so.addEventListener("change", function () { state.sort = so.value; toUrl(); render(); });
    }
    buildFilters();
    render();
    /* deep link: /products.html#P-1001 */
    if (location.hash) {
      var el = d.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () { el.scrollIntoView({ block: "center", behavior: "smooth" }); }, 120);
    }
  }

  w.CATALOG = { render: function () { buildFilters(); render(); } };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})(window, document);
