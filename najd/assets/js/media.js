/* =========================================================================
   MEDIA — every image on the site is drawn as an SVG at runtime, so the
   repository stays text-only and nothing depends on a stock-photo licence.
   Swap any of these for real photography by replacing the element's HTML.
   ========================================================================= */
(function (w) {
  "use strict";

  var PALETTE = {
    red:   ["#8E0B1B", "#C8102E"],
    gold:  ["#B8860B", "#F2B705"],
    ink:   ["#171B21", "#333C47"],
    mix:   ["#7C0A1C", "#D19A00"],
    steel: ["#23303C", "#4A6076"]
  };

  /* deterministic small hash so the same id always draws the same art */
  function hash(str) {
    var h = 0, i;
    for (i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0;
    return h;
  }

  /* Islamic-geometry style tile used behind dark sections */
  function pattern() {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">' +
      '<g fill="none" stroke="%23F2B705" stroke-width="1">' +
      '<path d="M90 8 122 40 90 72 58 40Z"/><path d="M90 108 122 140 90 172 58 140Z"/>' +
      '<path d="M8 90 40 58 72 90 40 122Z"/><path d="M108 90 140 58 172 90 140 122Z"/>' +
      '<circle cx="90" cy="90" r="26"/><circle cx="90" cy="90" r="13"/>' +
      '<path d="M0 0 180 180M180 0 0 180"/>' +
      '</g></svg>';
    return "url(\"data:image/svg+xml," + svg + "\")";
  }

  /* generic abstract art block: gradient + geometry + optional glyph/label */
  function art(opts) {
    var o = opts || {},
        seed = hash(o.seed || "najd"),
        pal = PALETTE[o.palette] || PALETTE.red,
        w1 = o.w || 800, h1 = o.h || 600,
        id = "g" + seed.toString(36),
        rot = seed % 40 - 20,
        r1 = 80 + (seed % 60),
        cx = 120 + (seed % 400), cy = 90 + (seed % 220);

    return '' +
      '<svg viewBox="0 0 ' + w1 + ' ' + h1 + '" preserveAspectRatio="xMidYMid slice" role="img"' +
      (o.label ? ' aria-label="' + esc(o.label) + '"' : ' aria-hidden="true"') + '>' +
      '<defs>' +
        '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + pal[0] + '"/><stop offset="1" stop-color="' + pal[1] + '"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + id + 'f" x1="0" y1="1" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#ffffff" stop-opacity=".16"/>' +
          '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="' + w1 + '" height="' + h1 + '" fill="url(#' + id + ')"/>' +
      '<g opacity=".22" stroke="#fff" fill="none" stroke-width="1.5">' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1 + '"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r1 * 1.6) + '"/>' +
        '<rect x="' + (w1 - 260) + '" y="' + (h1 - 240) + '" width="220" height="220" rx="18" transform="rotate(' + rot + ' ' + (w1 - 150) + ' ' + (h1 - 130) + ')"/>' +
      '</g>' +
      '<path d="M0 ' + h1 + ' L' + w1 + ' ' + (h1 * 0.45) + ' L' + w1 + ' ' + h1 + 'Z" fill="url(#' + id + 'f)"/>' +
      (o.glyph ? '<g transform="translate(' + (w1 / 2) + ' ' + (h1 / 2 - 10) + ') scale(' + (w1 / 105) + ')" ' +
        'fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">' +
        '<g transform="translate(-12 -12)">' + o.glyph + '</g></g>' : '') +
      (o.code ? '<text x="' + (w1 - 24) + '" y="' + (h1 - 22) + '" text-anchor="end" fill="#fff" fill-opacity=".65" ' +
        'font-family="monospace" font-size="' + (w1 / 28) + '">' + esc(o.code) + '</text>' : '') +
      '</svg>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* 24×24 line glyphs reused across cards, sectors and product art */
  var ICONS = {
    building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h2M13 9h2M9 13h2M13 13h2M9 17h6"/>',
    gear:     '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
    bolt:     '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
    helmet:   '<path d="M3 15a9 9 0 0 1 18 0"/><path d="M2 15h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/><path d="M9 6.2A9 9 0 0 1 12 6a9 9 0 0 1 3 .2"/>',
    ship:     '<path d="M3 17.5 4.5 12h15L21 17.5"/><path d="M12 12V5H8"/><path d="M2 20.5c1.6 0 1.6-1.2 3.2-1.2S6.8 20.5 8.4 20.5 10 19.3 11.6 19.3s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2"/>',
    truck:    '<path d="M2 7h11v10H2zM13 10h4l3 3v4h-7z"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
    oil:      '<path d="M7 21V6l6-3v18"/><path d="M13 10h5v11"/><path d="M4 21h17"/><path d="M9.5 6.5v2M9.5 11v2"/>',
    factory:  '<path d="M3 21V10l6 4V10l6 4V6l6 4v11z"/><path d="M7 17h2M13 17h2M18 17h1"/>',
    grid:     '<path d="M12 2v6M8 8h8l3 6H5z"/><path d="M7 14v8M17 14v8M7 18h10"/>',
    shop:     '<path d="M3 9 4.5 4h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
    gov:      '<path d="M3 21h18M4 21V10M20 21V10M2 10 12 4l10 6"/><path d="M8 21v-7h3v7M13 21v-7h3v7"/>',
    box:      '<path d="M12 2.7 21 7v10l-9 4.3L3 17V7z"/><path d="M3 7l9 4.3L21 7M12 11.3V21"/>',
    pipe:     '<path d="M2 8h9a4 4 0 0 1 4 4v8"/><rect x="1.5" y="5.5" width="3" height="5" rx="1"/><rect x="13.5" y="19.5" width="3" height="3" rx="1"/><path d="M18 4h4M20 2v4"/>',
    cable:    '<path d="M4 4v7a5 5 0 0 0 5 5h6a4 4 0 0 1 4 4v2"/><rect x="2" y="2" width="4" height="3" rx="1"/><circle cx="19" cy="8" r="3"/>',
    tools:    '<path d="M14.5 5.5a3.8 3.8 0 0 0 5 5L21 21l-2 2-9-9"/><path d="M6 3 3 6l4 4 3-3z"/><path d="M7 10 3 14l3 3 4-4"/>',
    valve:    '<circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/><path d="M8 4h8M8 20h8"/>',
    doc:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    chart:    '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    shield:   '<path d="M12 2.5 20 6v6c0 5-3.4 8.4-8 9.5-4.6-1.1-8-4.5-8-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
    globe:    '<circle cx="12" cy="12" r="9.2"/><path d="M3 12h18M12 2.8a15 15 0 0 1 0 18.4A15 15 0 0 1 12 2.8"/>',
    clock:    '<circle cx="12" cy="12" r="9.2"/><path d="M12 6.5V12l4 2.4"/>',
    users:    '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 5.6M17.5 14.4A6.5 6.5 0 0 1 21.5 20"/>'
  };

  w.MEDIA = { art: art, pattern: pattern, icon: function (n) { return ICONS[n] || ICONS.box; }, icons: ICONS };
})(window);
