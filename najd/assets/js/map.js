/* =========================================================================
   COVERAGE MAP — a real (simplified) outline of the Kingdom, drawn from
   boundary coordinates, with the cities we deliver to. Used on the home page.
   ========================================================================= */
(function (w) {
  "use strict";

  var OUTLINE = "M34.0 129.6 L76.0 121.2 L107.6 107.7 L128.6 84.1 L146.1 67.2 L170.6 43.6 L184.6 35.2 L226.6 43.6 L258.2 67.2 L286.2 90.8 L335.2 111.1 L377.2 134.7 L440.3 138.1 L473.5 141.8 L482.3 158.3 L506.8 156.6 L522.6 185.3 L547.1 202.2 L566.4 222.4 L569.9 239.3 L590.9 256.1 L597.9 279.8 L618.9 306.7 L653.9 337.1 L745.0 354.0 L761.1 377.6 L745.0 445.1 L632.9 478.8 L527.8 492.3 L475.3 542.9 L433.3 537.8 L352.7 532.8 L324.7 534.5 L310.7 566.5 L303.7 551.3 L275.7 515.9 L247.6 461.9 L212.6 431.6 L184.3 404.6 L163.6 357.3 L144.7 307.1 L114.6 279.8 L90.0 256.1 L58.5 222.4 L44.5 198.8 L34.0 165.1 L34.0 129.6 Z";

  var CITIES = [
    { ar:"الرياض", en:"Riyadh", x:448.0, y:286.8, hub:1 },
    { ar:"الدمام", en:"Dammam", x:566.4, y:228.1, hub:1 },
    { ar:"جدة", en:"Jeddah", x:184.3, y:394.8, hub:1 },
    { ar:"المدينة المنورة", en:"Madinah", x:199.0, y:294.3, hub:0 },
    { ar:"ينبع", en:"Yanbu", x:144.7, y:307.1, hub:0 },
    { ar:"تبوك", en:"Tabuk", x:91.8, y:162.4, hub:0 },
    { ar:"حائل", en:"Hail", x:271.8, y:191.4, hub:0 },
    { ar:"بريدة", en:"Buraidah", x:351.7, y:230.5, hub:0 },
    { ar:"أبها", en:"Abha", x:300.5, y:505.1, hub:0 },
    { ar:"نجران", en:"Najran", x:357.3, y:527.7, hub:0 }
  ];

  function render(opts) {
    var o = opts || {}, lang = (w.I18N && w.I18N.lang) || "ar";

    var dots = CITIES.map(function (c, i) {
      var r = c.hub ? 9 : 5.5;
      return '<g class="mp-city' + (c.hub ? " is-hub" : "") + '" style="--d:' + (i * .12) + 's">' +
        (c.hub ? '<circle cx="' + c.x + '" cy="' + c.y + '" r="20" class="mp-pulse"/>' : "") +
        '<circle cx="' + c.x + '" cy="' + c.y + '" r="' + r + '" class="mp-dot"/>' +
        /* hubs get their name above the dot so nothing sits on the marker */
        (c.hub
          ? '<text x="' + c.x + '" y="' + (c.y - 20) + '" text-anchor="middle" class="mp-label">'
          : '<text x="' + (c.x + (c.x > 420 ? 24 : -24)) + '" y="' + (c.y + 5) + '" ' +
            'text-anchor="' + (c.x > 420 ? "start" : "end") + '" class="mp-label">') +
          (lang === "en" ? c.en : c.ar) + "</text></g>";
    }).join("");

    /* supply lines from the Riyadh hub outward */
    var hub = CITIES[0], lines = CITIES.slice(1).map(function (c, i) {
      var mx = (hub.x + c.x) / 2, my = (hub.y + c.y) / 2 - 38;
      return '<path class="mp-line" style="--d:' + (i * .1) + 's" d="M' + hub.x + ' ' + hub.y +
             'Q' + mx + ' ' + my + ' ' + c.x + ' ' + c.y + '"/>';
    }).join("");

    return '<svg viewBox="0 0 800 600" class="mp" role="img" aria-label="' +
      (lang === "en" ? "Delivery coverage across Saudi Arabia" : "تغطية التوريد داخل المملكة") + '">' +
      '<path class="mp-land" d="' + OUTLINE + '"/>' +
      '<path class="mp-edge" d="' + OUTLINE + '"/>' +
      lines + dots + "</svg>";
  }

  w.KSAMAP = { render: render, cities: CITIES };
})(window);
