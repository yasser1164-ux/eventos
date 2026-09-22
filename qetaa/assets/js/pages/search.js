/* SEARCH — filters, sorting, URL state. The URL is the source of truth so a
   filtered view can be shared or bookmarked (and indexed). */
(function () {
  "use strict";

  var state = {}, PAGE = QETAA.pageSize, shown = PAGE;

  function readUrl() {
    var p = UI.params();
    state = {
      q: p.q || "", make: p.make || "", model: p.model || "", year: p.year || "",
      category: p.category || "", city: p.city || "", sort: p.sort || "newest",
      priceMin: p.priceMin || "", priceMax: p.priceMax || "",
      condition: p.condition ? p.condition.split(",") : [],
      origin: p.origin ? p.origin.split(",") : [],
      sellerType: p.sellerType ? p.sellerType.split(",") : [],
      delivery: p.delivery ? p.delivery.split(",") : [],
      warranty: p.warranty === "1", verified: p.verified === "1"
    };
  }
  function writeUrl() {
    var q = [], k, v;
    for (k in state) {
      v = state[k];
      if (v === "" || v === false || v == null) continue;
      if (Array.isArray(v)) { if (!v.length) continue; v = v.join(","); }
      if (v === true) v = "1";
      if (k === "sort" && v === "newest") continue;
      q.push(k + "=" + encodeURIComponent(v));
    }
    history.replaceState(null, "", "search.html" + (q.length ? "?" + q.join("&") : ""));
  }

  /* ---- filter panel ----------------------------------------------------- */
  function checkGroup(list, key, labelKey) {
    return list.map(function (o) {
      return '<label class="check"><input type="checkbox" data-group="' + key + '" value="' + o.id + '"' +
        (state[key].indexOf(o.id) > -1 ? " checked" : "") + "> " +
        UI.esc(UI.lang() === "en" ? o.en : o.ar) + "</label>";
    }).join("");
  }

  function buildFilters() {
    var el = UI.$("#filters");
    el.innerHTML =
      '<h3>' + UI.t("تصفية النتائج", "Filters") +
        '<button class="chip" id="clear-all" type="button">' + UI.t("مسح", "Clear") + "</button></h3>" +
      '<div class="field"><label>' + UI.t("الماركة", "Make") + '</label><select id="f-make"></select></div>' +
      '<div class="field"><label>' + UI.t("الموديل", "Model") + '</label><select id="f-model"></select></div>' +
      '<div class="field"><label>' + UI.t("سنة الصنع", "Year") + '</label><select id="f-year"></select></div>' +
      '<div class="field"><label>' + UI.t("القسم", "Category") + '</label><select id="f-cat"></select></div>' +
      '<div class="field"><label>' + UI.t("المدينة", "City") + '</label><select id="f-city"></select></div>' +
      '<div class="fgroup"><b>' + UI.t("السعر (ريال)", "Price (SAR)") + "</b>" +
        '<div style="display:flex;gap:8px">' +
          '<input id="f-min" type="number" min="0" placeholder="' + UI.t("من", "min") + '" value="' + state.priceMin + '">' +
          '<input id="f-max" type="number" min="0" placeholder="' + UI.t("إلى", "max") + '" value="' + state.priceMax + '">' +
        "</div></div>" +
      '<div class="fgroup"><b>' + UI.t("الحالة", "Condition") + "</b>" + checkGroup(TAX.conditions, "condition") + "</div>" +
      '<div class="fgroup"><b>' + UI.t("المصدر", "Origin") + "</b>" + checkGroup(TAX.origins, "origin") + "</div>" +
      '<div class="fgroup"><b>' + UI.t("نوع البائع", "Seller type") + "</b>" + checkGroup(TAX.sellerTypes, "sellerType") + "</div>" +
      '<div class="fgroup"><b>' + UI.t("التوصيل", "Delivery") + "</b>" + checkGroup(TAX.delivery, "delivery") + "</div>" +
      '<div class="fgroup">' +
        '<label class="check"><input type="checkbox" id="f-warranty"' + (state.warranty ? " checked" : "") + "> " +
          UI.t("بضمان فقط", "With warranty only") + "</label>" +
        '<label class="check"><input type="checkbox" id="f-verified"' + (state.verified ? " checked" : "") + "> " +
          UI.t("بائع موثّق فقط", "Verified sellers only") + "</label>" +
      "</div>" +
      '<button class="btn btn-primary btn-block" id="apply-mobile" style="margin-top:14px">' +
        UI.t("عرض النتائج", "Show results") + "</button>";

    UI.carChain(UI.$("#f-make"), UI.$("#f-model"), UI.$("#f-year"), state);
    UI.fillCategories(UI.$("#f-cat"), state.category);
    UI.fillCities(UI.$("#f-city"), state.city);

    el.addEventListener("change", function (e) {
      var id = e.target.id, g = e.target.dataset.group;
      if (g) {
        var arr = state[g], i = arr.indexOf(e.target.value);
        if (e.target.checked && i === -1) arr.push(e.target.value);
        if (!e.target.checked && i > -1) arr.splice(i, 1);
      }
      else if (id === "f-make")  { state.make = e.target.value; state.model = ""; state.year = ""; }
      else if (id === "f-model") { state.model = e.target.value; state.year = ""; }
      else if (id === "f-year")  { state.year = e.target.value; }
      else if (id === "f-cat")   { state.category = e.target.value; }
      else if (id === "f-city")  { state.city = e.target.value; }
      else if (id === "f-warranty") { state.warranty = e.target.checked; }
      else if (id === "f-verified") { state.verified = e.target.checked; }
      shown = PAGE; run();
    });
    el.addEventListener("input", function (e) {
      if (e.target.id === "f-min") state.priceMin = e.target.value;
      if (e.target.id === "f-max") state.priceMax = e.target.value;
      clearTimeout(el.__t); el.__t = setTimeout(function () { shown = PAGE; run(); }, 400);
    });
    UI.$("#clear-all").addEventListener("click", function () {
      history.replaceState(null, "", "search.html");
      readUrl(); buildFilters(); shown = PAGE; run();
    });
    UI.$("#apply-mobile").addEventListener("click", function () {
      UI.$("#filters").classList.remove("is-open"); document.body.style.overflow = "";
    });
  }

  /* ---- active filter pills ---------------------------------------------- */
  function pills() {
    var out = [], L = UI.lang();
    function add(key, label, value) {
      out.push('<span class="pill">' + UI.esc(label) +
        '<button type="button" data-key="' + key + '" data-val="' + UI.esc(value || "") + '">✕</button></span>');
    }
    if (state.q) add("q", '"' + state.q + '"');
    if (state.make) add("make", VEHICLES.makeLabel(state.make, L));
    if (state.model) add("model", VEHICLES.modelLabel(state.make, state.model, L));
    if (state.year) add("year", state.year);
    if (state.category) add("category", TAX.label(TAX.categories, state.category, L));
    if (state.city) add("city", TAX.label(TAX.cities, state.city, L));
    if (state.warranty) add("warranty", UI.t("بضمان", "With warranty"));
    if (state.verified) add("verified", UI.t("موثّق", "Verified"));
    ["condition", "origin", "sellerType", "delivery"].forEach(function (g) {
      state[g].forEach(function (v) {
        add(g, TAX.label(TAX[g === "sellerType" ? "sellerTypes" : g === "condition" ? "conditions" : g], v, L), v);
      });
    });
    var el = UI.$("#pills");
    el.innerHTML = out.join("");
    el.hidden = !out.length;
    el.onclick = function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var k = b.dataset.key;
      if (Array.isArray(state[k])) state[k] = state[k].filter(function (v) { return v !== b.dataset.val; });
      else if (typeof state[k] === "boolean") state[k] = false;
      else state[k] = "";
      buildFilters(); shown = PAGE; run();
    };
  }

  /* ---- run -------------------------------------------------------------- */
  function run() {
    writeUrl(); pills();
    var grid = UI.$("#results-grid");
    grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    DB.listings(state).then(function (r) {
      UI.$("#count").textContent = UI.t(r.total + " قطعة متوفرة", r.total + " parts available");
      UI.listingGrid(grid, r.items.slice(0, shown), UI.emptyState());
      var more = UI.$("#more");
      more.hidden = r.total <= shown;
      more.onclick = function () { shown += PAGE; run(); };
      var hint = UI.$("#rfq-hint");
      if (hint) hint.hidden = r.total > 6;
    });
  }

  UI.ready(function () {
    readUrl();
    buildFilters();
    var qi = UI.$("#q");
    qi.value = state.q;
    qi.addEventListener("input", function () {
      state.q = qi.value; clearTimeout(qi.__t);
      qi.__t = setTimeout(function () { shown = PAGE; run(); }, 300);
    });
    var sort = UI.$("#sort");
    sort.value = state.sort;
    sort.addEventListener("change", function () { state.sort = sort.value; run(); });
    UI.$("#filter-toggle").addEventListener("click", function () {
      UI.$("#filters").classList.add("is-open"); document.body.style.overflow = "hidden";
    });
    run();
    document.addEventListener("langchange", function () { buildFilters(); run(); });
  });
})();
