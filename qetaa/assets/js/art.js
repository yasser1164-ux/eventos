/* =========================================================================
   ART — every listing gets artwork even before anyone uploads a photo.
   Images are drawn in the browser as SVG from the listing's own data
   (part category, car, condition), so the grid never shows a broken box and
   the demo looks like a real catalogue. A real uploaded photo always wins.
   ========================================================================= */
window.QART = (function () {
  "use strict";

  /* One silhouette per part category — keyed by the category ids in
     taxonomy.js, so adding a category there means adding a shape here. */
  var SHAPES = {
    engine:   "M18 34h10l4-8h20l4 8h10v22H18zM32 26V18h20v8M26 56v8M56 56v8M24 40h8M52 40h8",
    gearbox:     "M40 24a16 16 0 1 0 0 32 16 16 0 0 0 0-32zm0 10a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM40 14v6M40 60v6M20 40h-6M66 40h-6M26 26l-4-4M58 58l4 4M26 54l-4 4M58 22l4-4",
    body:     "M14 46l6-14a8 8 0 0 1 7-5h26a8 8 0 0 1 7 5l6 14v10H14zM22 56v6M58 56v6M24 33h32l3 8H21z",
    lighting:    "M20 30h22a18 12 0 0 1 0 20H20a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4zM50 34l14-6M50 40h16M50 46l14 6",
    suspension:   "M40 16v8M30 26h20M32 34h16M30 42h20M32 50h16M30 58h20M40 60v8",
    brakes:    "M40 18a22 22 0 1 0 0 44 22 22 0 0 0 0-44zm0 12a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM58 26l8-6v22l-8 4",
    electric:     "M44 14L24 44h14l-4 24 22-32H42z",
    ac:     "M40 14v52M18 27l44 26M62 27L18 53M34 20l6 6 6-6M34 60l6-6 6 6",
    interior:     "M26 20h20a6 6 0 0 1 6 6v20H20V26a6 6 0 0 1 6-6zM18 48h36v10a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6zM56 30v22",
    wheels:    "M40 14a26 26 0 1 0 0 52 26 26 0 0 0 0-52zm0 16a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM40 14v16M62 30l-14 10M53 62l-8-16M27 62l8-16M18 30l14 10",
    exhaust:     "M14 46h18a8 8 0 0 0 8-8V30a8 8 0 0 1 8-8h18M58 22a8 8 0 0 1 0 16h-6M14 40v12M62 30h4",
    glass:    "M16 48l8-20a6 6 0 0 1 6-4h20a6 6 0 0 1 6 4l8 20zM40 24v24M16 48h48"
  };

  var TONES = {
    engine:["#0f172a","#1e3a5f"], gearbox:["#14261f","#0e5f45"], body:["#1b2434","#334b6e"],
    lighting:["#2a2411","#6b5312"], suspension:["#231a2e","#4b2d63"], brakes:["#2b1618","#6b2226"],
    electric:["#0e2430","#16617a"], ac:["#102a33","#1b6a7a"], interior:["#231d18","#5b452f"],
    wheels:["#181c22","#3b444f"], exhaust:["#1c2226","#455055"], glass:["#122029","#2a5c73"]
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function hash(str) {
    var h = 0, i; str = String(str || "");
    for (i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  /* the SVG markup for one listing photo --------------------------------- */
  function svg(listing, variant) {
    var cat  = (listing && listing.category) || "engine",
        tone = TONES[cat] || TONES.engine,
        path = SHAPES[cat] || SHAPES.engine,
        seed = hash((listing && listing.id) + "|" + (variant || 0)),
        rot  = (seed % 9) - 4,
        car  = esc(listing && listing.car_label ? listing.car_label : ""),
        tag  = esc(listing && listing.part_name ? listing.part_name : "");

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" role="img" aria-label="' + tag + '">' +
      '<defs>' +
        '<linearGradient id="g' + seed + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + tone[1] + '"/><stop offset="1" stop-color="' + tone[0] + '"/>' +
        '</linearGradient>' +
        '<pattern id="p' + seed + '" width="24" height="24" patternUnits="userSpaceOnUse">' +
          '<path d="M24 0H0v24" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/>' +
        '</pattern>' +
      '</defs>' +
      '<rect width="320" height="240" fill="url(#g' + seed + ')"/>' +
      '<rect width="320" height="240" fill="url(#p' + seed + ')"/>' +
      '<circle cx="' + (60 + (seed % 200)) + '" cy="' + (40 + (seed % 60)) + '" r="90" fill="rgba(255,255,255,.05)"/>' +
      '<g transform="translate(160 112) rotate(' + rot + ') scale(1.5) translate(-40 -40)" ' +
        'fill="none" stroke="rgba(255,255,255,.88)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="' + path + '"/>' +
      '</g>' +
      (car ? '<text x="160" y="214" text-anchor="middle" font-family="Tajawal,Inter,sans-serif" font-size="14" ' +
             'font-weight="700" fill="rgba(255,255,255,.82)">' + car + '</text>' : '') +
      '</svg>';
  }

  function dataUri(markup) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
  }

  return {
    /* <img src> for a listing photo: the uploaded photo if there is one,
       otherwise generated artwork */
    photo: function (listing, variant) {
      var p = listing && listing.photos;
      if (p && p.length) {
        var idx = Math.min(variant || 0, p.length - 1);
        if (p[idx]) return p[idx];
      }
      return dataUri(svg(listing, variant));
    },
    /* how many images a listing can show (real photos, or 3 generated) */
    count: function (listing) {
      var p = listing && listing.photos;
      return p && p.length ? p.length : 3;
    },
    shapes: SHAPES,
    /* inline <svg> for the category tiles */
    icon: function (cat) {
      var path = SHAPES[cat] || SHAPES.engine;
      return '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="' + path + '"/></svg>';
    }
  };
})();
