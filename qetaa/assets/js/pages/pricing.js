/* PRICING — the plans come from config.js so the page and the app can never
   disagree about what a plan includes. */
(function () {
  "use strict";

  var COPY = {
    free:  { ar:["مجاني","للأفراد والتشاليح الصغيرة اللي تبي تجرب"],  en:["Free","For individuals and yards testing the water"] },
    basic: { ar:["أساسي","لمحل قطع غيار واحد يبي طلبات ثابتة"],        en:["Basic","One parts shop that wants steady leads"] },
    pro:   { ar:["احترافي","للتشاليح النشطة اللي تبيع يومياً"],        en:["Pro","Busy yards selling every day"] },
    yard:  { ar:["تشليح+","للمخزون الكبير والفروع المتعددة"],          en:["Yard+","Large inventory, multiple branches"] }
  };

  function yes(txt) {
    return "<li><svg viewBox='0 0 24 24'><path d='m4.5 12.5 5 5 10-11'/></svg><span>" + txt + "</span></li>";
  }
  function no(txt) {
    return "<li class='off'><svg viewBox='0 0 24 24'><path d='M6 6l12 12M18 6 6 18'/></svg><span>" + txt + "</span></li>";
  }
  function nOr(v, unlimited) { return v < 0 ? unlimited : v; }

  function render() {
    var lang = UI.lang();
    UI.$("#plans").innerHTML = QETAA.plans.map(function (p) {
      var c = COPY[p.id][lang === "en" ? "en" : "ar"], pop = p.id === "pro";
      return '<div class="plan' + (pop ? " is-pop" : "") + '">' +
        (pop ? '<span class="plan-tag">' + UI.t("الأكثر طلباً", "Most popular") + "</span>" : "") +
        "<h3>" + UI.esc(c[0]) + "</h3>" +
        '<div class="plan-price">' + (p.price === 0 ? UI.t("0", "0") : p.price) +
          " <span>" + UI.t("ريال / شهر", "SAR / month") + "</span></div>" +
        '<p class="muted" style="margin:0;font-size:.9rem">' + UI.esc(c[1]) + "</p>" +
        "<ul>" +
          yes(UI.t(nOr(p.listings, "غير محدود") + " قطعة معروضة",
                   nOr(p.listings, "Unlimited") + " active listings")) +
          yes(UI.t(nOr(p.quotes, "غير محدود") + " عرض سعر على الطلبات شهرياً",
                   nOr(p.quotes, "Unlimited") + " quotes on requests / month")) +
          (p.featured ? yes(UI.t(p.featured + " قطعة مميّزة في نتائج البحث",
                                 p.featured + " featured listings in search"))
                      : no(UI.t("بدون قطع مميّزة", "No featured listings"))) +
          (p.badge ? yes(UI.t("شارة بائع موثّق بعد التحقق من السجل التجاري",
                              "Verified badge after CR check"))
                   : no(UI.t("بدون شارة توثيق", "No verified badge"))) +
          (p.id === "free" ? no(UI.t("بدون تنبيه فوري للطلبات", "No instant request alerts"))
                           : yes(UI.t("تنبيه فوري بالطلبات الجديدة في مدينتك",
                                      "Instant alerts for new requests in your city"))) +
          (p.id === "pro" || p.id === "yard"
            ? yes(UI.t("لوحة تحليلات: مشاهدات، محادثات، أكثر القطع طلباً",
                       "Analytics: views, chats, most-wanted parts"))
            : no(UI.t("بدون لوحة تحليلات", "No analytics panel"))) +
          (p.id === "yard" ? yes(UI.t("رفع المخزون دفعة واحدة (ملف إكسل) ومدير حساب",
                                      "Bulk inventory upload (Excel) + account manager")) : "") +
        "</ul>" +
        '<a class="btn ' + (pop ? "btn-primary" : "btn-ghost") + ' btn-block" href="sell.html">' +
          (p.price === 0 ? UI.t("ابدأ مجاناً", "Start free") : UI.t("اشترك", "Choose plan")) + "</a>" +
      "</div>";
    }).join("");

    UI.$("#boost-price").textContent = QETAA.boostPrice;
  }

  /* what a plan has to return to pay for itself */
  function calculator() {
    function run() {
      var margin = +UI.$("#c-margin").value || 0,
          plan = +UI.$("#c-plan").value || 0,
          parts = margin > 0 ? Math.ceil(plan / margin) : 0;
      UI.$("#c-out").innerHTML = margin > 0
        ? UI.t("تحتاج تبيع <b>" + parts + "</b> قطعة إضافية بالشهر عشان الباقة تسدد نفسها — والباقي ربح.",
               "You need <b>" + parts + "</b> extra parts a month for the plan to pay for itself — the rest is profit.")
        : UI.t("اكتب متوسط ربحك في القطعة.", "Enter your average margin per part.");
    }
    UI.$("#c-plan").innerHTML = QETAA.plans.filter(function (p) { return p.price > 0; })
      .map(function (p) {
        return '<option value="' + p.price + '">' + UI.esc(COPY[p.id][UI.lang() === "en" ? "en" : "ar"][0]) +
          " — " + p.price + " " + UI.t("ريال", "SAR") + "</option>";
      }).join("");
    UI.$("#c-margin").addEventListener("input", run);
    UI.$("#c-plan").addEventListener("change", run);
    run();
  }

  UI.ready(function () {
    render(); calculator();
    document.addEventListener("langchange", function () { render(); calculator(); });
  });
})();
