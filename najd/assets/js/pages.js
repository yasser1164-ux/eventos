/* =========================================================================
   PAGE WIRING — the request-for-quote list and every form on the site.
   ========================================================================= */
(function (w, d) {
  "use strict";

  var $ = w.UI.$, $$ = w.UI.$$, esc = w.UI.esc, pick = w.UI.pick, t = w.UI.t;

  /* ---- RFQ list on quote.html ---------------------------------------- */
  function productById(id) {
    return w.DATA.products.filter(function (p) { return p.id === id; })[0];
  }

  function renderRFQ() {
    var host = $("#rfq-list");
    if (!host) return;
    var items = w.CART.items(), empty = $("#rfq-empty");

    if (!items.length) {
      host.innerHTML = "";
      if (empty) empty.hidden = false;
      var cl = $("#rfq-clear"); if (cl) cl.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    var cl2 = $("#rfq-clear"); if (cl2) cl2.hidden = false;

    host.innerHTML = items.map(function (i) {
      var p = productById(i.id);
      if (!p) return "";
      return '<div class="rfq-row" data-row="' + esc(p.id) + '">' +
        '<div class="rr-art" data-photo="' + p.id + '">' + w.ITEMS.render(p.id) + "</div>" +
        '<div class="rr-main"><h4>' + esc(pick(p.t)) + "</h4>" +
          '<div class="rr-sub"><span dir="ltr">' + esc(p.id) + "</span> · " + esc(w.UI.catName(p.cat)) + "</div></div>" +
        '<div class="qty"><button type="button" data-dec aria-label="-">−</button>' +
          '<input type="number" min="1" value="' + (+i.qty || 1) + '" data-qty aria-label="' + esc(t("rfq.qty", "الكمية")) + '">' +
          "<button type=\"button\" data-inc aria-label=\"+\">+</button></div>" +
        '<span class="muted" style="font-size:13px;min-width:44px">' + esc(pick(p.unit)) + "</span>" +
        '<button type="button" class="rr-del" data-del aria-label="' + esc(t("rfq.remove", "إزالة")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>' +
        "</button></div>";
    }).join("");

    if (w.MEDIA.photos) w.MEDIA.photos(host);
    $$("[data-row]", host).forEach(function (row) {
      var id = row.dataset.row, input = $("[data-qty]", row);
      $("[data-inc]", row).addEventListener("click", function () {
        input.value = (+input.value || 1) + 1; w.CART.setQty(id, +input.value);
      });
      $("[data-dec]", row).addEventListener("click", function () {
        input.value = Math.max(1, (+input.value || 1) - 1); w.CART.setQty(id, +input.value);
      });
      input.addEventListener("change", function () { w.CART.setQty(id, +input.value || 1); });
      $("[data-del]", row).addEventListener("click", function () { w.CART.remove(id); renderRFQ(); });
    });
  }

  /* ---- forms ---------------------------------------------------------- */
  function wireForms() {
    /* hero "quick quote" — same handler, short payload */
    w.FORMS.handle($("#hero-form"), {
      kind: "quick-quote",
      subject: t("form.subject.quick", "طلب سريع من الصفحة الرئيسية")
    });

    /* full RFQ */
    var quoteForm = $("#quote-form");
    if (quoteForm) {
      var svc = new URLSearchParams(location.search).get("service");
      var sel = $("#quote-service");
      if (svc && sel) {
        var opt = Array.prototype.filter.call(sel.options, function (o) { return o.value === svc; })[0];
        if (opt) sel.value = svc;
      }
      w.FORMS.handle(quoteForm, {
        kind: "rfq",
        subject: t("form.subject.rfq", "طلب عرض سعر"),
        extra: function () {
          var lines = w.CART.asText();
          return { items: lines || t("rfq.noItems", "لم تُحدَّد أصناف من الكتالوج"),
                   items_count: String(w.CART.lines()) };
        },
        onDone: function () { w.CART.clear(); renderRFQ(); }
      });
    }

    w.FORMS.handle($("#contact-form"), { kind: "contact", subject: t("form.subject.contact", "رسالة من نموذج التواصل") });
    w.FORMS.handle($("#job-form"),     { kind: "job",     subject: t("form.subject.job", "طلب توظيف") });
    $$(".newsletter-form").forEach(function (f) {
      w.FORMS.handle(f, { kind: "newsletter", subject: t("form.subject.news", "اشتراك في النشرة") });
    });
  }

  function boot() {
    renderRFQ();
    var clr = $("#rfq-clear");
    if (clr) clr.addEventListener("click", function () { w.CART.clear(); renderRFQ(); });
    wireForms();
    w.CART.onChange(function () { w.CART.paintFab(); });
  }

  w.RFQ = { render: renderRFQ };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})(window, document);
