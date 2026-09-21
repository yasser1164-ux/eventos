/* SELL — list a used part. Photos are resized in the browser before they are
   stored, so a phone photo never blows past the storage budget. */
(function () {
  "use strict";

  var photos = [];

  function partList(catId) {
    var c = TAX.find(TAX.categories, catId), dl = UI.$("#part-options");
    dl.innerHTML = (c ? c.parts : TAX.allParts().map(function (p) { return p.name; }))
      .map(function (p) { return '<option value="' + UI.esc(p) + '">'; }).join("");
  }

  function checkList(el, list, name) {
    el.innerHTML = list.map(function (o) {
      return '<label><input type="checkbox" name="' + name + '" value="' + o.id + '"> ' +
        UI.esc(UI.lang() === "en" ? o.en : o.ar) + "</label>";
    }).join("");
  }

  function radioList(el, list, name, checked) {
    el.innerHTML = list.map(function (o, i) {
      return '<label><input type="radio" name="' + name + '" value="' + o.id + '"' +
        ((checked ? o.id === checked : i === 1) ? " checked" : "") + "> " +
        UI.esc(UI.lang() === "en" ? o.en : o.ar) + "</label>";
    }).join("");
  }

  /* shrink to max 1000px on the long edge — good enough for a parts photo */
  function readPhoto(file) {
    return new Promise(function (resolve) {
      var fr = new FileReader();
      fr.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 1000, w = img.width, h = img.height, c, ctx;
          if (w > max || h > max) { var s = max / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
          c = document.createElement("canvas"); c.width = w; c.height = h;
          ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL("image/jpeg", 0.72));
        };
        img.onerror = function () { resolve(null); };
        img.src = fr.result;
      };
      fr.onerror = function () { resolve(null); };
      fr.readAsDataURL(file);
    });
  }

  function drawThumbs() {
    UI.$("#thumbs").innerHTML = photos.map(function (src, i) {
      return '<figure><img src="' + src + '" alt=""><button type="button" data-i="' + i + '">✕</button></figure>';
    }).join("");
    UI.$$("#thumbs button").forEach(function (b) {
      b.onclick = function () { photos.splice(+b.dataset.i, 1); drawThumbs(); };
    });
  }

  function err(field, msg) {
    var f = UI.$('[name="' + field + '"]'),
        box = f && (f.closest(".field") || f.closest("fieldset"));
    if (!box) return;
    box.classList.add("field-err");
    if (!box.querySelector(".err-msg")) {
      var s = document.createElement("span");
      s.className = "err-msg"; s.textContent = msg; box.appendChild(s);
    }
  }

  function submit(e) {
    e.preventDefault();
    var f = e.target, d = {}, i;
    UI.$$(".field-err").forEach(function (b) {
      b.classList.remove("field-err");
      var m = b.querySelector(".err-msg"); if (m) m.remove();
    });

    ["make","model","part_name","category","condition","origin","city","price","qty",
     "year_from","year_to","oem","notes","warranty_days","seller_name","seller_phone","seller_type"]
      .forEach(function (k) { var el = f.elements[k]; if (el) d[k] = el.value.trim ? el.value.trim() : el.value; });
    d.delivery = UI.$$('input[name="delivery"]:checked').map(function (c) { return c.value; });
    d.condition = (UI.$('input[name="condition"]:checked') || {}).value || "b";
    d.origin = (UI.$('input[name="origin"]:checked') || {}).value || "used_sa";
    d.seller_type = (UI.$('input[name="seller_type"]:checked') || {}).value || "person";

    var bad = false;
    if (!d.make)      { err("make", UI.t("اختر الماركة", "Pick a make")); bad = true; }
    if (!d.model)     { err("model", UI.t("اختر الموديل", "Pick a model")); bad = true; }
    if (!d.part_name) { err("part_name", UI.t("اكتب اسم القطعة", "Name the part")); bad = true; }
    if (!d.price || +d.price <= 0) { err("price", UI.t("اكتب سعراً صحيحاً", "Enter a valid price")); bad = true; }
    if (!d.city)      { err("city", UI.t("اختر المدينة", "Pick a city")); bad = true; }
    if (!d.seller_phone || !/^0?5\d{8}$|^\+9665\d{8}$/.test(d.seller_phone.replace(/[\s-]/g, ""))) {
      err("seller_phone", UI.t("رقم جوال سعودي: 05xxxxxxxx", "Saudi mobile: 05xxxxxxxx")); bad = true;
    }
    if (!f.elements.terms.checked) { UI.toast(UI.t("لازم توافق على شروط النشر", "Please accept the listing terms")); bad = true; }
    if (bad) { UI.$(".field-err") && UI.$(".field-err").scrollIntoView({ block: "center" }); return; }

    var phone = d.seller_phone.replace(/[\s-]/g, "").replace(/^0/, "966").replace(/^\+/, ""),
        me = DB.me(),
        seller = {
          id: (me && me.seller_id) || ("own-" + phone),
          name: d.seller_name || UI.t("بائع", "Seller"),
          type: d.seller_type, city: d.city, rating: 0, reviews_count: 0,
          phone: "+" + phone, whatsapp: phone, verified: false, plan: "free"
        };

    DB.addListing({
      part_name: d.part_name, category: d.category || "engine",
      make: d.make, model: d.model,
      year_from: +d.year_from || null, year_to: +d.year_to || +d.year_from || null,
      condition: d.condition, origin: d.origin,
      price: +d.price, price_old: 0, qty: +d.qty || 1, oem: d.oem,
      warranty_days: +d.warranty_days || 0, delivery: d.delivery.length ? d.delivery : ["pickup"],
      city: d.city, notes: d.notes, photos: photos.slice(),
      seller_id: seller.id, seller_inline: seller,
      owner: me ? me.id : null
    }).then(function (row) {
      /* remember the seller so the listing renders with a real name */
      DB.addSeller(seller);
      if (!DB.me()) DB.signIn({ name: seller.name, phone: seller.phone, role: "seller", seller_id: seller.id, city: d.city });
      UI.$("#sell-form").hidden = true;
      UI.$("#done").hidden = false;
      UI.$("#done-link").href = "part.html?id=" + encodeURIComponent(row.id);
      UI.$("#done-ref").textContent = row.ref;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  UI.ready(function () {
    var p = UI.params(),
        make = UI.$('[name="make"]'), model = UI.$('[name="model"]'),
        yf = UI.$('[name="year_from"]'), yt = UI.$('[name="year_to"]');

    UI.carChain(make, model, yf, p);
    UI.fillYears(p.make, p.model, yt, p.year);
    make.addEventListener("change", function () { UI.fillYears(make.value, "", yt); });
    model.addEventListener("change", function () { UI.fillYears(make.value, model.value, yt); });

    UI.fillCategories(UI.$('[name="category"]'), p.category, UI.t("اختر القسم", "Pick a category"));
    UI.fillCities(UI.$('[name="city"]'), p.city || QETAA.defaultCity, UI.t("اختر المدينة", "Pick a city"));
    radioList(UI.$("#cond-list"), TAX.conditions, "condition");
    radioList(UI.$("#origin-list"), TAX.origins, "origin", "used_sa");
    radioList(UI.$("#stype-list"), TAX.sellerTypes, "seller_type", "yard");
    checkList(UI.$("#delivery-list"), TAX.delivery, "delivery");
    partList(p.category);
    if (p.part) UI.$('[name="part_name"]').value = p.part;

    UI.$('[name="category"]').addEventListener("change", function (e) { partList(e.target.value); });

    var me = DB.me();
    if (me) {
      UI.$('[name="seller_name"]').value = me.name || "";
      UI.$('[name="seller_phone"]').value = me.phone || "";
    }

    var input = UI.$("#photo-input");
    UI.$("#photo-drop").addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () {
      var files = Array.prototype.slice.call(input.files).slice(0, 6 - photos.length);
      Promise.all(files.map(readPhoto)).then(function (out) {
        out.forEach(function (src) { if (src) photos.push(src); });
        drawThumbs();
        input.value = "";
      });
    });

    UI.$("#sell-form").addEventListener("submit", submit);
  });
})();
