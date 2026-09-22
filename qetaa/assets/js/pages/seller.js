/* SELLER — one yard: who they are, what they have, what buyers said. */
(function () {
  "use strict";
  var S = null;

  function head() {
    var lang = UI.lang();
    UI.$("#s-head").innerHTML =
      '<span class="avatar avatar-lg">' + UI.esc(UI.initial(S)) + "</span>" +
      '<div style="flex:1;min-width:220px">' +
        "<h1 style='margin:0 0 4px'>" + UI.esc(UI.sellerName(S)) +
          (S.verified ? ' <span class="badge b-blue">' + UI.t("موثّق", "Verified") + "</span>" : "") + "</h1>" +
        '<div class="muted">' + UI.esc(TAX.label(TAX.sellerTypes, S.type, lang)) + " · " +
          UI.esc(TAX.label(TAX.cities, S.city, lang)) + (S.district ? " · " + UI.esc(S.district) : "") + "</div>" +
        '<div style="margin:8px 0">' + UI.stars(S.rating, S.reviews_count) +
          (S.since ? ' <span class="muted" style="font-size:.85rem">· ' +
            UI.t("في السوق منذ " + S.since, "trading since " + S.since) + "</span>" : "") + "</div>" +
        (S.about ? "<p style='max-width:62ch;margin:8px 0 0'>" + UI.esc(S.about) + "</p>" : "") +
        (S.hours ? '<p class="muted" style="margin:6px 0 0;font-size:.88rem">' + UI.esc(S.hours) + "</p>" : "") +
        '<div class="badge-row" style="margin-top:10px">' +
          (S.makes || []).map(function (m) {
            return '<span class="badge b-grey">' + UI.esc(VEHICLES.makeLabel(m, lang)) + "</span>";
          }).join("") + "</div>" +
      "</div>" +
      '<div style="display:flex;flex-direction:column;gap:8px;min-width:190px">' +
        '<a class="btn btn-wa" target="_blank" rel="noopener" id="s-wa">' + UI.t("واتساب", "WhatsApp") + "</a>" +
        '<a class="btn btn-ghost" id="s-call">' + UI.t("اتصال", "Call") + "</a>" +
        '<a class="btn btn-ghost" href="request.html?city=' + S.city + '">' +
          UI.t("اطلب قطعة من هذا البائع", "Ask this seller for a part") + "</a>" +
      "</div>";
    UI.$("#s-wa").href = UI.waLink(S.whatsapp,
      UI.t("السلام عليكم، وصلتكم من موقع قطع", "Hello, I found you on Qetaa"));
    UI.$("#s-call").href = "tel:" + (S.phone || QETAA.phone);
    UI.$("#s-wa").onclick = function () { DB.lead("whatsapp", { id: null, seller_id: S.id }); };
  }

  function body() {
    DB.sellerListings(S.id).then(function (items) {
      UI.$("#s-parts-count").textContent = UI.t(items.length + " قطعة معروضة", items.length + " parts listed");
      UI.listingGrid(UI.$("#s-parts"), items,
        UI.emptyState(UI.t("ما عنده قطع معروضة حالياً", "No parts listed right now"), "", false));
    });
    DB.reviews(S.id).then(function (rows) {
      UI.$("#s-reviews").innerHTML = rows.length ? rows.map(function (v) {
        return '<div class="card pad"><div style="display:flex;justify-content:space-between;gap:10px">' +
          "<b>" + UI.esc(v.name) + "</b>" + UI.stars(v.stars) + "</div>" +
          '<p style="margin:8px 0 0">' + UI.esc(v.text) + "</p>" +
          '<small class="muted">' + UI.since(v.date) + "</small></div>";
      }).join("") : '<p class="muted">' + UI.t("ما فيه تقييمات بعد.", "No reviews yet.") + "</p>";
    });
  }

  function render() { head(); body(); }

  UI.ready(function () {
    DB.seller(UI.params().id).then(function (found) {
      if (!found) {
        UI.$("#s-wrap").innerHTML = UI.emptyState(UI.t("البائع غير موجود", "Seller not found"), "", false);
        return;
      }
      S = found;
      document.title = S.name + " | Qetaa";
      render();
      document.addEventListener("langchange", function () {
        DB.seller(UI.params().id).then(function (again) { if (again) { S = again; render(); } });
      });
    });
  });
})();
