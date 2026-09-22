/* REQUESTS — the open board. Buyers watch their own request fill with
   quotes; sellers work it like a lead list. */
(function () {
  "use strict";

  var filters = { city: "", make: "", category: "", q: "" };

  function card(r) {
    return '<article class="req-card">' +
      '<div class="req-top"><div>' +
        '<div class="req-car">' + UI.esc(r.car_label) + "</div>" +
        '<div class="req-part">' + UI.esc(r.part_name) + "</div>" +
      "</div>" +
      '<span class="badge ' + (r.urgency === "today" ? "b-red" : r.urgency === "week" ? "b-amber" : "b-grey") + '">' +
        UI.esc(UI.lang() === "en" ? r.urgency_obj.en : r.urgency_obj.ar) + "</span></div>" +
      (r.notes ? '<p class="muted" style="margin:0;font-size:.9rem">' + UI.esc(r.notes) + "</p>" : "") +
      '<div class="req-meta">' +
        "<span>" + UI.esc(r.ref) + "</span><span>" + UI.esc(r.city_label) + "</span>" +
        "<span>" + UI.since(r.created_at) + "</span>" +
        "<span>" + (r.quotes_count || 0) + " " + UI.t("عرض", "quotes") + "</span>" +
      "</div>" +
      '<a class="btn btn-primary btn-sm" href="requests.html?id=' + encodeURIComponent(r.id) + '">' +
        UI.t("افتح وقدّم عرض", "Open & quote") + "</a>" +
    "</article>";
  }

  function board() {
    UI.$("#board").hidden = false;
    UI.$("#detail").hidden = true;
    DB.requests(filters).then(function (rows) {
      UI.$("#board-count").textContent = UI.t(rows.length + " طلب مفتوح", rows.length + " open requests");
      var el = UI.$("#req-list");
      if (!rows.length) {
        el.innerHTML = UI.emptyState(UI.t("لا توجد طلبات بهذه الفلاتر", "No requests match"),
          UI.t("جرّب مدينة أو قسم ثاني.", "Try another city or category."), false);
        return;
      }
      el.innerHTML = rows.map(card).join("");
    });
  }

  function quoteForm(r) {
    return '<form class="card pad" id="quote-form" style="margin-top:18px">' +
      "<h3>" + UI.t("قدّم عرض سعر", "Send a quote") + "</h3>" +
      '<p class="muted" style="font-size:.9rem">' +
        UI.t("العروض الواضحة تكسب: اذكر الحالة والضمان ومتى تقدر تسلّم.",
             "Clear quotes win: state the condition, the warranty and when you can hand it over.") + "</p>" +
      '<div class="form-grid">' +
        '<div class="field"><label>' + UI.t("السعر (ريال)", "Price (SAR)") + "</label>" +
          '<input name="price" type="number" min="1" required></div>' +
        '<div class="field"><label>' + UI.t("حالة القطعة", "Condition") + '</label><select name="condition">' +
          TAX.conditions.map(function (c) {
            return '<option value="' + c.id + '">' + UI.esc(UI.lang() === "en" ? c.en : c.ar) + "</option>";
          }).join("") + "</select></div>" +
        '<div class="field"><label>' + UI.t("الضمان (أيام)", "Warranty (days)") + "</label>" +
          '<input name="warranty_days" type="number" min="0" value="7"></div>' +
        '<div class="field"><label>' + UI.t("التسليم", "Delivery") + '</label><select name="delivery">' +
          TAX.delivery.map(function (dv) {
            return '<option value="' + dv.id + '">' + UI.esc(UI.lang() === "en" ? dv.en : dv.ar) + "</option>";
          }).join("") + "</select></div>" +
        '<div class="field span2"><label>' + UI.t("ملاحظة للمشتري", "Note to the buyer") + "</label>" +
          '<textarea name="note" rows="3" placeholder="' +
          UI.t("مثال: القطعة أصلية مفكوكة من ٢٠١٧، جاهزة اليوم.",
               "e.g. Original part off a 2017, ready today.") + '"></textarea></div>' +
        '<div class="field"><label>' + UI.t("اسم المحل / اسمك", "Shop or your name") + "</label>" +
          '<input name="seller_name" required></div>' +
        '<div class="field"><label>' + UI.t("جوال للتواصل", "Mobile") + "</label>" +
          '<input name="seller_phone" placeholder="05xxxxxxxx" required></div>' +
      "</div>" +
      '<button class="btn btn-primary" type="submit">' + UI.t("إرسال العرض", "Send quote") + "</button>" +
    "</form>";
  }

  function quoteRow(q, best) {
    var s = q.seller || {};
    return '<div class="quote' + (best ? " is-best" : "") + '">' +
      '<span class="avatar">' + UI.esc(UI.initial(s) !== "?" ? UI.initial(s) : (q.seller_name || "?").charAt(0)) + "</span>" +
      '<div style="flex:1">' +
        '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">' +
          "<b>" + UI.esc(UI.sellerName(s) || q.seller_name || UI.t("بائع", "Seller")) + "</b>" + UI.money(q.price) +
        "</div>" +
        '<div class="badge-row" style="margin:6px 0">' +
          '<span class="badge b-grey">' + UI.esc(TAX.label(TAX.conditions, q.condition, UI.lang())) + "</span>" +
          (q.warranty_days > 0 ? '<span class="badge b-green">' +
            UI.t("ضمان " + q.warranty_days + " يوم", q.warranty_days + "-day warranty") + "</span>" : "") +
          '<span class="badge b-blue">' + UI.esc(TAX.label(TAX.delivery, q.delivery, UI.lang())) + "</span>" +
          (best ? '<span class="badge b-amber">' + UI.t("أفضل سعر", "Best price") + "</span>" : "") +
        "</div>" +
        (q.note ? '<p class="muted" style="margin:0;font-size:.88rem">' + UI.esc(q.note) + "</p>" : "") +
        '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">' +
          '<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="' +
            UI.waLink(s.whatsapp || q.seller_phone || QETAA.whatsapp,
              UI.t("السلام عليكم، بخصوص عرضك على طلبي في قطع", "Hello, about your quote on my Qetaa request")) +
            '">' + UI.t("واتساب", "WhatsApp") + "</a>" +
          (s.slug ? '<a class="btn btn-ghost btn-sm" href="seller.html?id=' + s.slug + '">' +
            UI.t("ملف البائع", "Seller profile") + "</a>" : "") +
        "</div>" +
      "</div>" +
    "</div>";
  }

  function detail(id) {
    DB.request(id).then(function (r) {
      UI.$("#board").hidden = true;
      UI.$("#detail").hidden = false;
      if (!r) {
        UI.$("#detail").innerHTML = UI.emptyState(UI.t("الطلب غير موجود", "Request not found"), "", false);
        return;
      }
      DB.quotes(r.id).then(function (qs) {
        UI.$("#detail").innerHTML =
          '<a class="link-more" href="requests.html">← ' + UI.t("كل الطلبات", "All requests") + "</a>" +
          '<div class="card pad" style="margin-top:12px">' +
            '<div class="req-top"><div><h1 style="margin:0">' + UI.esc(r.part_name) + "</h1>" +
              '<div class="req-car">' + UI.esc(r.car_label) + "</div></div>" +
              '<span class="badge ' + (r.urgency === "today" ? "b-red" : "b-grey") + '">' +
                UI.esc(UI.lang() === "en" ? r.urgency_obj.en : r.urgency_obj.ar) + "</span>" +
            "</div>" +
            '<div class="req-meta" style="margin-top:10px">' +
              "<span>" + UI.esc(r.ref) + "</span><span>" + UI.esc(r.city_label) + "</span>" +
              "<span>" + UI.since(r.created_at) + "</span>" +
              "<span>" + UI.t("الحالة المطلوبة", "Wanted condition") + ": " +
                UI.esc(TAX.label(TAX.conditions, r.condition_pref, UI.lang())) + "</span>" +
            "</div>" +
            (r.notes ? "<p style='margin-top:12px'>" + UI.esc(r.notes) + "</p>" : "") +
          "</div>" +
          '<h2 style="margin-top:26px">' + UI.t("العروض المستلمة", "Quotes received") +
            ' <span class="muted num">(' + qs.length + ")</span></h2>" +
          '<div style="display:flex;flex-direction:column;gap:10px">' +
            (qs.length ? qs.map(function (q, i) { return quoteRow(q, i === 0 && qs.length > 1); }).join("")
                       : '<p class="muted">' + UI.t("ما وصل عرض بعد — كن أول بائع.",
                                                    "No quotes yet — be the first seller.") + "</p>") +
          "</div>" + quoteForm(r);

        UI.$("#quote-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var f = e.target,
              phone = f.seller_phone.value.replace(/[\s-]/g, "").replace(/^0/, "966").replace(/^\+/, "");
          DB.addQuote({
            request_id: r.id, seller_id: "own-" + phone, seller_name: f.seller_name.value.trim(),
            seller_phone: "+" + phone, price: +f.price.value,
            condition: f.condition.value, warranty_days: +f.warranty_days.value || 0,
            delivery: f.delivery.value, note: f.note.value.trim()
          }).then(function () {
            UI.toast(UI.t("وصل عرضك للمشتري ✅", "Your quote reached the buyer ✅"));
            detail(id);
          });
        });
      });
    });
  }

  UI.ready(function () {
    var p = UI.params();
    UI.fillCities(UI.$("#b-city"), p.city);
    UI.fillMakes(UI.$("#b-make"), p.make);
    UI.fillCategories(UI.$("#b-cat"), p.category);
    ["b-city", "b-make", "b-cat"].forEach(function (id) {
      UI.$("#" + id).addEventListener("change", function (e) {
        filters[id === "b-city" ? "city" : id === "b-make" ? "make" : "category"] = e.target.value;
        board();
      });
    });
    var q = UI.$("#b-q");
    q.addEventListener("input", function () {
      clearTimeout(q.__t);
      q.__t = setTimeout(function () { filters.q = q.value.trim(); board(); }, 300);
    });
    if (p.id) detail(p.id); else board();
    document.addEventListener("langchange", function () { if (p.id) detail(p.id); else board(); });
  });
})();
