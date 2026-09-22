/* SELLERS — the yard directory. Being findable here is the first thing a
   scrapyard gets for free. */
(function () {
  "use strict";
  var f = { city: "", type: "", make: "", q: "" };

  function render() {
    DB.sellers(f).then(function (rows) {
      UI.$("#s-count").textContent = UI.t(rows.length + " بائع", rows.length + " sellers");
      var el = UI.$("#s-list");
      if (!rows.length) {
        el.innerHTML = UI.emptyState(UI.t("ما فيه بائع بهذه الفلاتر", "No sellers match"),
          UI.t("جرّب مدينة ثانية.", "Try another city."), false);
        return;
      }
      el.innerHTML = rows.map(UI.sellerCard).join("");
    });
  }

  UI.ready(function () {
    var p = UI.params();
    f.city = p.city || ""; f.make = p.make || "";
    UI.fillCities(UI.$("#s-city"), f.city);
    UI.fillMakes(UI.$("#s-make"), f.make);
    UI.$("#s-type").innerHTML = '<option value="">' + UI.t("كل الأنواع", "All types") + "</option>" +
      TAX.sellerTypes.map(function (t) {
        return '<option value="' + t.id + '">' + UI.esc(UI.lang() === "en" ? t.en : t.ar) + "</option>";
      }).join("");
    ["s-city", "s-type", "s-make"].forEach(function (id) {
      UI.$("#" + id).addEventListener("change", function (e) {
        f[id === "s-city" ? "city" : id === "s-type" ? "type" : "make"] = e.target.value;
        render();
      });
    });
    var q = UI.$("#s-q");
    q.addEventListener("input", function () {
      clearTimeout(q.__t); q.__t = setTimeout(function () { f.q = q.value.trim(); render(); }, 300);
    });
    render();
    document.addEventListener("langchange", render);
  });
})();
