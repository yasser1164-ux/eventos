/* HOME — search box, category tiles, featured parts, live request board. */
(function () {
  "use strict";
  var P = UI.params();

  function searchBox() {
    var make = UI.$("#h-make"), model = UI.$("#h-model"), year = UI.$("#h-year"),
        cat = UI.$("#h-cat"), city = UI.$("#h-city"), form = UI.$("#h-form");
    UI.carChain(make, model, year, P);
    UI.fillCategories(cat, P.category);
    UI.fillCities(city, P.city || QETAA.defaultCity);
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = [];
      if (make.value)  q.push("make=" + make.value);
      if (model.value) q.push("model=" + model.value);
      if (year.value)  q.push("year=" + year.value);
      if (cat.value)   q.push("category=" + cat.value);
      if (city.value)  q.push("city=" + city.value);
      var text = UI.$("#h-q").value.trim();
      if (text) q.push("q=" + encodeURIComponent(text));
      location.href = "search.html" + (q.length ? "?" + q.join("&") : "");
    });
  }

  function categories() {
    var el = UI.$("#cats");
    if (!el) return;
    DB.listings({}).then(function (r) {
      var counts = {};
      r.items.forEach(function (l) { counts[l.category] = (counts[l.category] || 0) + 1; });
      el.innerHTML = TAX.categories.map(function (c) {
        return '<a class="cat" href="search.html?category=' + c.id + '">' +
          '<span class="cat-ico">' + QART.icon(c.id) + "</span>" +
          "<b>" + UI.esc(UI.lang() === "en" ? c.en : c.ar) + "</b>" +
          "<span>" + (counts[c.id] || 0) + " " + UI.t("قطعة", "parts") + "</span>" +
        "</a>";
      }).join("");
    });
  }

  function rows() {
    DB.listings({ sort: "popular", limit: 8 }).then(function (r) {
      UI.listingGrid(UI.$("#featured"), r.items);
    });
    DB.listings({ sort: "newest", limit: 8 }).then(function (r) {
      UI.listingGrid(UI.$("#latest"), r.items);
    });
  }

  function requests() {
    var el = UI.$("#reqs");
    if (!el) return;
    DB.requests({}).then(function (rows) {
      el.innerHTML = rows.slice(0, 4).map(function (r) {
        return '<article class="req-card">' +
          '<div class="req-top"><div>' +
            '<div class="req-car">' + UI.esc(r.car_label) + "</div>" +
            '<div class="req-part">' + UI.esc(r.part_name) + "</div>" +
          "</div>" +
          '<span class="badge ' + (r.urgency === "today" ? "b-red" : "b-grey") + '">' +
            UI.esc(UI.lang() === "en" ? r.urgency_obj.en : r.urgency_obj.ar) + "</span>" +
          "</div>" +
          '<p class="muted" style="margin:0;font-size:.9rem">' + UI.esc((r.notes || "").slice(0, 110)) + "</p>" +
          '<div class="req-meta">' +
            "<span>" + UI.esc(r.city_label) + "</span>" +
            "<span>" + UI.since(r.created_at) + "</span>" +
            "<span>" + r.quotes_count + " " + UI.t("عرض سعر", "quotes") + "</span>" +
          "</div>" +
          '<a class="btn btn-ghost btn-sm" href="requests.html?id=' + r.id + '">' +
            UI.t("قدّم عرضك", "Send a quote") + "</a>" +
        "</article>";
      }).join("");
    });
  }

  function sellers() {
    var el = UI.$("#sellers");
    if (!el) return;
    DB.sellers({}).then(function (rows) {
      el.innerHTML = rows.slice(0, 4).map(UI.sellerCard).join("");
    });
  }

  function stats() {
    Promise.all([DB.listings({}), DB.sellers({}), DB.requests({})]).then(function (r) {
      var set = function (id, v) { var e = UI.$(id); if (e) e.textContent = v; };
      set("#stat-parts", r[0].total);
      set("#stat-sellers", r[1].length);
      set("#stat-requests", r[2].length);
      var cities = {};
      r[1].forEach(function (s) { cities[s.city] = 1; });
      set("#stat-cities", Object.keys(cities).length);
    });
  }

  function render() { categories(); rows(); requests(); sellers(); stats(); }

  UI.ready(function () {
    searchBox();
    render();
    document.addEventListener("langchange", function () {
      var make = UI.$("#h-make"), model = UI.$("#h-model"), year = UI.$("#h-year");
      UI.fillMakes(make, make.value); UI.fillModels(make.value, model, model.value);
      UI.fillYears(make.value, model.value, year, year.value);
      UI.fillCategories(UI.$("#h-cat"), UI.$("#h-cat").value);
      UI.fillCities(UI.$("#h-city"), UI.$("#h-city").value);
      render();
    });
  });
})();
