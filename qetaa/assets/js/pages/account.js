/* ACCOUNT — one screen for both sides of the market: what I saved, what I
   asked for, what I listed, and what it produced. */
(function () {
  "use strict";

  var tab = "saved";

  function signedOut() {
    UI.$("#signin").hidden = false;
    UI.$("#panel").hidden = true;
  }

  function signedIn(me) {
    UI.$("#signin").hidden = true;
    UI.$("#panel").hidden = false;
    UI.$("#who").innerHTML =
      '<span class="avatar">' + UI.esc((me.name || "?").charAt(0)) + "</span>" +
      "<div><b>" + UI.esc(me.name || UI.t("مستخدم", "User")) + "</b>" +
      '<div class="muted" style="font-size:.86rem" dir="ltr">' + UI.esc(me.phone || "") + "</div>" +
      '<span class="badge b-grey">' + UI.t(me.role === "seller" ? "حساب بائع" : "حساب مشتري",
                                           me.role === "seller" ? "Seller account" : "Buyer account") + "</span></div>";
    paint();
  }

  function paint() {
    UI.$$("#tabs button").forEach(function (b) { b.classList.toggle("is-active", b.dataset.tab === tab); });
    var el = UI.$("#tab-body");
    el.innerHTML = '<div class="skeleton" style="height:120px"></div>';

    if (tab === "saved") {
      DB.favListings().then(function (items) {
        el.innerHTML = '<div class="plist" id="fav-grid"></div>';
        UI.listingGrid(UI.$("#fav-grid"), items,
          UI.emptyState(UI.t("ما حفظت قطع بعد", "Nothing saved yet"),
            UI.t("اضغط على القلب في أي قطعة وتلقاها هنا.", "Tap the heart on any part and it lands here.")));
      });
    }

    else if (tab === "requests") {
      DB.requests({}).then(function (rows) {
        var me = DB.me(),
            mine = rows.filter(function (r) { return r.owner === me.id || r.phone === me.phone; });
        if (!mine.length) {
          el.innerHTML = UI.emptyState(UI.t("ما عندك طلبات", "No requests yet"),
            UI.t("اطلب القطعة اللي تدور عليها وخلي البائعين يجونك.",
                 "Post the part you need and let the sellers come to you."));
          return;
        }
        Promise.all(mine.map(function (r) { return DB.quotes(r.id); })).then(function (all) {
          el.innerHTML = mine.map(function (r, i) {
            var qs = all[i], best = qs[0];
            return '<div class="card pad" style="margin-bottom:12px">' +
              '<div class="req-top"><div><b>' + UI.esc(r.part_name) + "</b>" +
                '<div class="muted">' + UI.esc(r.car_label) + " · " + UI.esc(r.ref) + "</div></div>" +
                '<span class="badge b-green">' + qs.length + " " + UI.t("عرض", "quotes") + "</span></div>" +
              (best ? '<p style="margin:10px 0 0">' + UI.t("أفضل سعر وصلك", "Best quote so far") + ": " +
                UI.money(best.price) + " — " + UI.esc((best.seller && best.seller.name) || best.seller_name || "") + "</p>" : "") +
              '<a class="btn btn-ghost btn-sm" style="margin-top:10px" href="requests.html?id=' +
                encodeURIComponent(r.id) + '">' + UI.t("عرض التفاصيل", "Open") + "</a></div>";
          }).join("");
        });
      });
    }

    else if (tab === "listings") {
      DB.myListings().then(function (items) {
        if (!items.length) {
          el.innerHTML = UI.emptyState(UI.t("ما نشرت قطع", "No listings yet"),
            UI.t("انشر أول قطعة — النشر مجاني.", "Post your first part — listing is free."));
          var cta = el.querySelector(".btn"); if (cta) { cta.href = "sell.html"; cta.textContent = UI.t("أضف قطعة", "Add a part"); }
          return;
        }
        var views = items.reduce(function (s, l) { return s + (l.views || 0); }, 0),
            value = items.reduce(function (s, l) { return s + (l.price || 0) * (l.qty || 1); }, 0);
        el.innerHTML =
          '<div class="kpi" style="margin-bottom:16px">' +
            "<div><b>" + items.length + "</b><span>" + UI.t("قطعة معروضة", "listed parts") + "</span></div>" +
            "<div><b>" + views + "</b><span>" + UI.t("مشاهدة", "views") + "</span></div>" +
            "<div><b>" + value.toLocaleString("en-US") + "</b><span>" + UI.t("قيمة المخزون (ريال)", "inventory value (SAR)") + "</span></div>" +
          "</div><div class='plist' id='my-grid'></div>";
        UI.listingGrid(UI.$("#my-grid"), items, "");
      });
    }

    else {
      var leads = DB.leads(), by = {};
      leads.forEach(function (l) { by[l.kind] = (by[l.kind] || 0) + 1; });
      el.innerHTML =
        '<div class="kpi">' +
          "<div><b>" + (by.view || 0) + "</b><span>" + UI.t("قطع شُفتها", "parts viewed") + "</span></div>" +
          "<div><b>" + (by.whatsapp || 0) + "</b><span>" + UI.t("محادثات واتساب", "WhatsApp taps") + "</span></div>" +
          "<div><b>" + (by.call || 0) + "</b><span>" + UI.t("اتصالات", "calls") + "</span></div>" +
          "<div><b>" + DB.favs().length + "</b><span>" + UI.t("محفوظات", "saved") + "</span></div>" +
        "</div>" +
        '<p class="muted" style="margin-top:14px;font-size:.9rem">' +
          UI.t("هذه الأرقام محفوظة في متصفحك فقط. عند تشغيل قاعدة البيانات تصير لوحة تحليلات كاملة لكل بائع.",
               "These numbers live in your browser only. With the database switched on they become a full per-seller analytics panel.") +
        "</p>" +
        '<button class="btn btn-ghost btn-sm" id="reset" style="margin-top:12px">' +
          UI.t("مسح بيانات التجربة من هذا الجهاز", "Clear demo data from this device") + "</button>";
      UI.$("#reset").onclick = function () {
        DB.reset(); UI.toast(UI.t("تم المسح", "Cleared")); location.reload();
      };
    }
  }

  UI.ready(function () {
    UI.fillCities(UI.$("#in-city"), "", UI.t("مدينتك", "Your city"));

    UI.$("#signin-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, phone = f.phone.value.replace(/[\s-]/g, "");
      if (!/^0?5\d{8}$|^\+9665\d{8}$/.test(phone)) {
        UI.toast(UI.t("رقم جوال سعودي: 05xxxxxxxx", "Saudi mobile: 05xxxxxxxx")); return;
      }
      var me = DB.signIn({
        name: f.name.value.trim(),
        phone: "+" + phone.replace(/^0/, "966").replace(/^\+/, ""),
        role: (UI.$('input[name="role"]:checked') || {}).value || "buyer",
        city: f.city.value
      });
      UI.toast(UI.t("أهلاً " + (me.name || ""), "Welcome " + (me.name || "")));
      signedIn(me);
    });

    UI.$("#signout").addEventListener("click", function () {
      DB.signOut(); UI.toast(UI.t("خرجت من الحساب", "Signed out")); signedOut();
    });

    UI.$$("#tabs button").forEach(function (b) {
      b.addEventListener("click", function () { tab = b.dataset.tab; paint(); });
    });

    var me = DB.me();
    if (me) signedIn(me); else signedOut();
    document.addEventListener("langchange", function () { if (DB.me()) paint(); });
  });
})();
