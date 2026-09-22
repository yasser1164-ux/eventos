/* REQUEST — the wedge: the buyer describes the part once, and every yard in
   the city sees it. No phone calls, no WhatsApp groups. */
(function () {
  "use strict";

  function partList(catId) {
    var c = TAX.find(TAX.categories, catId), dl = UI.$("#part-options");
    dl.innerHTML = (c ? c.parts : TAX.allParts().map(function (p) { return p.name; }))
      .map(function (p) { return '<option value="' + UI.esc(p) + '">'; }).join("");
  }
  function radioList(el, list, name, checked) {
    el.innerHTML = list.map(function (o, i) {
      return '<label><input type="radio" name="' + name + '" value="' + o.id + '"' +
        ((checked ? o.id === checked : i === 0) ? " checked" : "") + "> " +
        UI.esc(UI.lang() === "en" ? o.en : o.ar) + "</label>";
    }).join("");
  }
  function err(field, msg) {
    var f = UI.$('[name="' + field + '"]'), box = f && (f.closest(".field") || f.closest("fieldset"));
    if (!box) return;
    box.classList.add("field-err");
    if (!box.querySelector(".err-msg")) {
      var s = document.createElement("span"); s.className = "err-msg"; s.textContent = msg; box.appendChild(s);
    }
  }

  function submit(e) {
    e.preventDefault();
    var f = e.target, d = {};
    UI.$$(".field-err").forEach(function (b) {
      b.classList.remove("field-err");
      var m = b.querySelector(".err-msg"); if (m) m.remove();
    });
    ["make","model","year","part_name","category","city","notes","name","phone","vin"]
      .forEach(function (k) { var el = f.elements[k]; if (el) d[k] = (el.value || "").trim(); });
    d.urgency = (UI.$('input[name="urgency"]:checked') || {}).value || "week";
    d.condition_pref = (UI.$('input[name="condition_pref"]:checked') || {}).value || "b";

    var bad = false;
    if (!d.make)      { err("make", UI.t("اختر الماركة", "Pick a make")); bad = true; }
    if (!d.model)     { err("model", UI.t("اختر الموديل", "Pick a model")); bad = true; }
    if (!d.year)      { err("year", UI.t("اختر سنة الصنع", "Pick a year")); bad = true; }
    if (!d.part_name) { err("part_name", UI.t("اكتب القطعة المطلوبة", "Name the part you need")); bad = true; }
    if (!d.city)      { err("city", UI.t("اختر المدينة", "Pick a city")); bad = true; }
    if (!d.phone || !/^0?5\d{8}$|^\+9665\d{8}$/.test(d.phone.replace(/[\s-]/g, ""))) {
      err("phone", UI.t("رقم جوال سعودي: 05xxxxxxxx", "Saudi mobile: 05xxxxxxxx")); bad = true;
    }
    if (bad) { var first = UI.$(".field-err"); if (first) first.scrollIntoView({ block: "center" }); return; }

    var phone = d.phone.replace(/[\s-]/g, "").replace(/^0/, "966").replace(/^\+/, "");
    if (!DB.me()) DB.signIn({ name: d.name, phone: "+" + phone, role: "buyer", city: d.city });

    DB.addRequest({
      make: d.make, model: d.model, year: +d.year,
      part_name: d.part_name, category: d.category || "engine",
      city: d.city, urgency: d.urgency, condition_pref: d.condition_pref,
      notes: d.notes, vin: d.vin, name: d.name || UI.t("مشتري", "Buyer"),
      phone: "+" + phone
    }).then(function (row) {
      UI.$("#req-form").hidden = true;
      UI.$("#done").hidden = false;
      UI.$("#done-ref").textContent = row.ref;
      UI.$("#done-link").href = "requests.html?id=" + encodeURIComponent(row.id);
      UI.$("#done-count").textContent = UI.t("سنرسل طلبك لكل البائعين في " +
        TAX.label(TAX.cities, d.city, "ar") + " والمدن المجاورة.",
        "Your request goes out to every seller in " + TAX.label(TAX.cities, d.city, "en") + " and nearby cities.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  UI.ready(function () {
    var p = UI.params();
    UI.carChain(UI.$('[name="make"]'), UI.$('[name="model"]'), UI.$('[name="year"]'), p);
    UI.fillCategories(UI.$('[name="category"]'), p.category, UI.t("اختر القسم", "Pick a category"));
    UI.fillCities(UI.$('[name="city"]'), p.city || QETAA.defaultCity, UI.t("اختر المدينة", "Pick a city"));
    radioList(UI.$("#urgency-list"), TAX.urgency, "urgency", "week");
    radioList(UI.$("#cond-list"), TAX.conditions, "condition_pref", "b");
    partList(p.category);
    if (p.part) UI.$('[name="part_name"]').value = p.part;
    UI.$('[name="category"]').addEventListener("change", function (e) { partList(e.target.value); });

    var me = DB.me();
    if (me) { UI.$('[name="name"]').value = me.name || ""; UI.$('[name="phone"]').value = me.phone || ""; }

    UI.$("#req-form").addEventListener("submit", submit);
  });
})();
