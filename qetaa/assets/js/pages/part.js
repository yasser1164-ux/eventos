/* PART — one listing: gallery, compatibility, seller, and the contact
   buttons that are the platform's real conversion event. */
(function () {
  "use strict";

  var L = null, shot = 0;

  function gallery() {
    var n = QART.count(L);
    UI.$("#g-main").innerHTML = '<img src="' + QART.photo(L, shot) + '" alt="' + UI.esc(L.part_name) + '">';
    var thumbs = "", i;
    for (i = 0; i < n; i++)
      thumbs += '<button type="button" class="' + (i === shot ? "is-on" : "") + '" data-i="' + i + '">' +
        '<img src="' + QART.photo(L, i) + '" alt=""></button>';
    UI.$("#g-thumbs").innerHTML = thumbs;
    UI.$$("#g-thumbs button").forEach(function (b) {
      b.onclick = function () { shot = +b.dataset.i; gallery(); };
    });
  }

  function specs() {
    var lang = UI.lang(), rows = [
      [UI.t("رقم الإعلان", "Listing ref"), L.ref],
      [UI.t("القطعة", "Part"), L.part_name],
      [UI.t("القسم", "Category"), TAX.label(TAX.categories, L.category, lang)],
      [UI.t("تناسب", "Fits"), L.fits],
      [UI.t("الحالة", "Condition"), (lang === "en" ? L.condition_obj.en : L.condition_obj.ar) +
        " — " + (lang === "en" ? L.condition_obj.note.en : L.condition_obj.note.ar)],
      [UI.t("المصدر", "Origin"), L.origin_label],
      [UI.t("رقم القطعة (OEM)", "OEM number"), L.oem || UI.t("غير مذكور", "not provided")],
      [UI.t("الكمية المتوفرة", "Quantity"), L.qty],
      [UI.t("الضمان", "Warranty"), L.warranty_days > 0
        ? UI.t(L.warranty_days + " يوم استبدال", L.warranty_days + " days replacement")
        : UI.t("بدون ضمان", "Sold as seen")],
      [UI.t("التوصيل", "Delivery"), (L.delivery || []).map(function (d) {
        return TAX.label(TAX.delivery, d, lang); }).join("، ") || "—"],
      [UI.t("المدينة", "City"), L.city_label],
      [UI.t("نُشر", "Listed"), UI.since(L.created_at)]
    ];
    UI.$("#specs").innerHTML = rows.map(function (r) {
      return "<tr><th>" + UI.esc(r[0]) + "</th><td>" + UI.esc(r[1]) + "</td></tr>";
    }).join("");
  }

  function seller() {
    var s = L.seller, lang = UI.lang();
    UI.$("#seller-box").innerHTML =
      '<div style="display:flex;gap:12px;align-items:center">' +
        '<span class="avatar">' + UI.esc(UI.initial(s)) + "</span>" +
        "<div><b>" + UI.esc(UI.sellerName(s)) + "</b>" +
          (s.verified ? ' <span class="badge b-blue">' + UI.t("موثّق", "Verified") + "</span>" : "") +
          '<div class="muted" style="font-size:.85rem">' +
            UI.esc(TAX.label(TAX.sellerTypes, s.type, lang)) + " · " +
            UI.esc(TAX.label(TAX.cities, s.city, lang)) + "</div>" +
          '<div style="margin-top:4px">' + UI.stars(s.rating, s.reviews_count) + "</div>" +
        "</div>" +
      "</div>" +
      (s.district ? '<p class="muted" style="margin:10px 0 0;font-size:.86rem">' + UI.esc(s.district) +
        (s.hours ? " · " + UI.esc(s.hours) : "") + "</p>" : "") +
      '<a class="btn btn-ghost btn-sm btn-block" style="margin-top:10px" href="seller.html?id=' +
        encodeURIComponent(s.slug || s.id) + '">' + UI.t("كل قطع هذا البائع", "All parts from this seller") + "</a>";
  }

  function actions() {
    var wa = UI.$("#cta-wa"), call = UI.$("#cta-call"), s = L.seller;
    wa.href = UI.waLink(s.whatsapp || QETAA.whatsapp, UI.listingWaText(L));
    call.href = "tel:" + (s.phone || QETAA.phone);
    wa.onclick = function () { DB.lead("whatsapp", L); };
    call.onclick = function () { DB.lead("call", L); };
    UI.$("#cta-fav").onclick = function () {
      var on = DB.toggleFav(L.id);
      UI.$("#cta-fav").classList.toggle("is-on", on);
      UI.$("#cta-fav-label").textContent = on ? UI.t("محفوظة", "Saved") : UI.t("حفظ", "Save");
      UI.toast(on ? UI.t("حُفظت في المفضلة", "Saved to favourites") : UI.t("أُزيلت", "Removed"));
    };
    UI.$("#cta-share").onclick = function () {
      var url = location.href;
      if (navigator.share) navigator.share({ title: L.part_name, url: url }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () {
        UI.toast(UI.t("نُسخ الرابط", "Link copied"));
      });
    };
    var rq = UI.$("#cta-request");
    if (rq) rq.href = "request.html?make=" + L.make + "&model=" + L.model +
      "&year=" + (L.year_from || "") + "&part=" + encodeURIComponent(L.part_name) + "&category=" + L.category;
  }

  function similar() {
    DB.similar(L, 4).then(function (items) {
      UI.$("#similar-wrap").hidden = !items.length;
      UI.listingGrid(UI.$("#similar"), items, "");
    });
  }

  function render() {
    document.title = L.part_name + " — " + L.fits + " | Qetaa";
    UI.$("#p-title").textContent = L.part_name;
    UI.$("#p-fits").textContent = L.fits;
    UI.$("#p-price").innerHTML = UI.money(L.price) +
      (L.price_old ? ' <span class="price-old num">' + L.price_old + "</span>" : "");
    UI.$("#p-badges").innerHTML =
      (L.featured ? '<span class="badge b-amber">' + UI.t("مميّز", "Featured") + "</span>" : "") +
      '<span class="badge b-grey">' + UI.esc(L.origin_label) + "</span>" +
      (L.warranty_days > 0 ? '<span class="badge b-green">' +
        UI.t("ضمان " + L.warranty_days + " يوم", L.warranty_days + "-day warranty") + "</span>" : "") +
      (L.qty > 1 ? '<span class="badge b-blue">' + UI.t(L.qty + " قطع متوفرة", L.qty + " in stock") + "</span>" : "");
    UI.$("#p-cond").innerHTML = UI.condBars(L.condition);
    UI.$("#p-notes").textContent = L.notes || "";
    UI.$("#p-views").textContent = UI.t((L.views || 0) + " مشاهدة", (L.views || 0) + " views");
    gallery(); specs(); seller(); actions(); similar();
  }

  UI.ready(function () {
    var id = UI.params().id;
    DB.listing(id).then(function (found) {
      if (!found) {
        UI.$("#detail").innerHTML = UI.emptyState(
          UI.t("هذا الإعلان غير موجود", "Listing not found"),
          UI.t("قد يكون البائع أزاله بعد البيع. جرّب البحث عن نفس القطعة.",
               "The seller may have removed it after selling. Try searching for the same part."));
        return;
      }
      L = found;
      DB.lead("view", L);
      render();
      /* re-fetch on a language switch so the row's labels are rebuilt too */
      document.addEventListener("langchange", function () {
        DB.listing(id).then(function (again) { if (again) { L = again; render(); } });
      });
    });
  });
})();
