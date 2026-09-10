/* =========================================================================
   SCENES — illustrated artwork for the site.
   These are proper drawn scenes (a site with a crane, a warehouse with
   racking, a port, a plant…), composed from reusable parts so every picture
   on the site shares one visual language.

   Any scene can be replaced by a real photograph without touching code:
   drop a file into assets/img/photos/ with the scene's name (e.g.
   warehouse.jpg) and it is used instead — see README.
   ========================================================================= */
(function (w) {
  "use strict";

  /* ---- palettes: [sky top, sky bottom, far, mid, near, accent] --------- */
  var P = {
    /* [sky top, sky bottom, far shapes, mid shapes, near/ground, accent] —
       the sky is the light end and shapes get darker toward the viewer, so
       everything reads as a silhouette against it. */
    red:   ["#D8203C", "#7A0918", "#54060F", "#37040A", "#240206", "#FFC931"],
    gold:  ["#F5B913", "#A86505", "#6E3F03", "#472802", "#2C1800", "#FFF0BE"],
    ink:   ["#41505F", "#18202A", "#101720", "#0A1017", "#06090D", "#F2B705"],
    steel: ["#4C7396", "#17293A", "#101F2D", "#0A1620", "#050C13", "#FFC931"],
    mix:   ["#E0682A", "#8A1220", "#5C0C16", "#3A070E", "#230409", "#FFD97A"],
    dusk:  ["#7C3B7A", "#5A1030", "#3A0A20", "#250514", "#16030C", "#FFC931"]
  };

  function pal(n) { return P[n] || P.red; }

  /* ---- reusable parts -------------------------------------------------- */
  /* every part draws in a 0..800 × 0..600 space and returns an SVG string  */

  function sky(c) {
    return '<rect width="800" height="600" fill="url(#sky)"/>' +
           '<circle cx="620" cy="150" r="86" fill="' + c[5] + '" opacity=".16"/>' +
           '<circle cx="620" cy="150" r="52" fill="' + c[5] + '" opacity=".22"/>';
  }

  /* soft contact shadow, so an object sits on the ground instead of floating */
  function shade(c, x, y, w) {
    return '<ellipse cx="' + x + '" cy="' + (y + 3) + '" rx="' + w + '" ry="' + Math.max(5, w * 0.13) + '" fill="#000" opacity=".22"/>';
  }

  function ground(c, y) {
    y = y || 505;
    return '<rect x="0" y="' + y + '" width="800" height="' + (600 - y) + '" fill="' + c[4] + '"/>' +
           '<rect x="0" y="' + y + '" width="800" height="3" fill="' + c[5] + '" opacity=".35"/>';
  }

  function skyline(c, y) {
    y = y || 505;
    var s = '', x = -20, i = 0, hs = [120, 70, 160, 95, 135, 60, 110, 150, 80];
    while (x < 820) {
      var h = hs[i % hs.length], wdt = 46 + (i % 3) * 22;
      s += '<rect x="' + x + '" y="' + (y - h) + '" width="' + wdt + '" height="' + h + '" fill="' + c[2] + '" opacity=".55"/>';
      /* window grid */
      for (var r = y - h + 12; r < y - 14; r += 22) {
        for (var cx = x + 10; cx < x + wdt - 8; cx += 18) {
          s += '<rect x="' + cx + '" y="' + r + '" width="7" height="9" fill="' + c[5] + '" opacity="' + ((cx + r) % 3 === 0 ? ".26" : ".08") + '"/>';
        }
      }
      x += wdt + 12; i++;
    }
    return s;
  }

  /* building under construction: frame, slabs, scaffold */
  function buildingFrame(c, x, y, cols, rows) {
    var s = '', cw = 46, ch = 40, wdt = cols * cw, hgt = rows * ch, i, j;
    s += '<rect x="' + x + '" y="' + (y - hgt) + '" width="' + wdt + '" height="' + hgt + '" fill="' + c[3] + '" opacity=".92"/>';
    for (i = 0; i <= rows; i++)
      s += '<rect x="' + (x - 6) + '" y="' + (y - i * ch) + '" width="' + (wdt + 12) + '" height="7" fill="' + c[2] + '"/>';
    for (j = 0; j <= cols; j++)
      s += '<rect x="' + (x + j * cw - 4) + '" y="' + (y - hgt) + '" width="8" height="' + hgt + '" fill="' + c[2] + '" opacity=".9"/>';
    /* a couple of lit floors */
    s += '<rect x="' + (x + 8) + '" y="' + (y - 2 * ch + 10) + '" width="' + (cw - 16) + '" height="' + (ch - 18) + '" fill="' + c[5] + '" opacity=".22"/>';
    s += '<rect x="' + (x + cw + 8) + '" y="' + (y - 4 * ch + 10) + '" width="' + (cw - 16) + '" height="' + (ch - 18) + '" fill="' + c[5] + '" opacity=".13"/>';
    return s;
  }

  function crane(c, x, y, h) {
    var top = y - h;
    return '<g stroke="' + c[5] + '" stroke-width="4" fill="none" opacity=".95">' +
      '<path d="M' + x + ' ' + y + 'V' + top + '"/>' +
      '<path d="M' + (x - 150) + ' ' + top + 'H' + (x + 250) + '"/>' +
      '<path d="M' + x + ' ' + (top - 46) + 'L' + (x - 140) + ' ' + top + 'M' + x + ' ' + (top - 46) + 'L' + (x + 240) + ' ' + top + '"/>' +
      '<path d="M' + x + ' ' + top + 'v-46"/>' +
      '<path d="M' + (x + 150) + ' ' + top + 'v58"/>' +
      '</g>' +
      '<rect x="' + (x + 132) + '" y="' + (top + 58) + '" width="36" height="26" fill="' + c[5] + '" opacity=".8"/>' +
      '<g stroke="' + c[5] + '" stroke-width="2" opacity=".5">' +
      '<path d="M' + (x - 14) + ' ' + y + 'L' + x + ' ' + (y - 40) + 'L' + (x + 14) + ' ' + y + '" fill="none"/></g>';
  }

  function truck(c, x, y, s) {
    s = s || 1;
    return shade(c, x - 55 * s, y, 105 * s) + '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="-150" y="-86" width="150" height="86" rx="5" fill="' + c[2] + '"/>' +
      '<rect x="-142" y="-78" width="134" height="70" rx="3" fill="' + c[5] + '" opacity=".18"/>' +
      '<path d="M0-64h34l30 34v30H0z" fill="' + c[3] + '"/>' +
      '<rect x="6" y="-58" width="30" height="24" rx="3" fill="' + c[5] + '" opacity=".45"/>' +
      '<circle cx="-108" cy="4" r="16" fill="' + c[4] + '"/><circle cx="-108" cy="4" r="7" fill="' + c[5] + '" opacity=".6"/>' +
      '<circle cx="42" cy="4" r="16" fill="' + c[4] + '"/><circle cx="42" cy="4" r="7" fill="' + c[5] + '" opacity=".6"/>' +
      '<rect x="-150" y="-92" width="150" height="6" fill="' + c[5] + '" opacity=".5"/>' +
      '</g>';
  }

  function racking(c, x, y, bays, levels) {
    var s = '', bw = 118, lh = 62, i, j;
    for (i = 0; i < bays; i++) {
      var bx = x + i * (bw + 14);
      for (j = 0; j < levels; j++) {
        var by = y - (j + 1) * lh;
        s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="7" fill="' + c[2] + '"/>';
        /* pallets with boxes */
        s += '<rect x="' + (bx + 10) + '" y="' + (by - 34) + '" width="44" height="34" fill="' + c[3] + '"/>' +
             '<rect x="' + (bx + 10) + '" y="' + (by - 34) + '" width="44" height="6" fill="' + c[5] + '" opacity=".45"/>' +
             '<rect x="' + (bx + 62) + '" y="' + (by - 26) + '" width="44" height="26" fill="' + c[3] + '" opacity=".8"/>';
      }
      s += '<rect x="' + (bx - 5) + '" y="' + (y - levels * lh) + '" width="9" height="' + (levels * lh) + '" fill="' + c[2] + '"/>' +
           '<rect x="' + (bx + bw - 4) + '" y="' + (y - levels * lh) + '" width="9" height="' + (levels * lh) + '" fill="' + c[2] + '"/>';
    }
    return s;
  }

  function forklift(c, x, y) {
    return shade(c, x - 24, y, 46) + '<g transform="translate(' + x + ' ' + y + ')">' +
      '<rect x="-56" y="-52" width="56" height="38" rx="4" fill="' + c[5] + '" opacity=".85"/>' +
      '<rect x="-46" y="-84" width="8" height="34" fill="' + c[2] + '"/>' +
      '<rect x="-4" y="-96" width="7" height="96" fill="' + c[2] + '"/>' +
      '<path d="M3-16h40" stroke="' + c[2] + '" stroke-width="7"/>' +
      '<rect x="8" y="-58" width="42" height="42" fill="' + c[3] + '"/>' +
      '<circle cx="-44" cy="-6" r="12" fill="' + c[4] + '"/><circle cx="-10" cy="-6" r="9" fill="' + c[4] + '"/>' +
      '</g>';
  }

  function containers(c, x, y) {
    var s = '', rows = [[0, 3], [1, 2], [2, 1]], i, j;
    for (i = 0; i < rows.length; i++) {
      for (j = 0; j < rows[i][1]; j++) {
        var cx = x + j * 128, cy = y - (i + 1) * 46;
        var fill = (i + j) % 3 === 0 ? c[5] : c[2];
        s += '<rect x="' + cx + '" y="' + cy + '" width="120" height="42" rx="3" fill="' + fill + '" opacity="' + ((i + j) % 3 === 0 ? ".78" : ".95") + '"/>';
        for (var k = 6; k < 114; k += 12)
          s += '<rect x="' + (cx + k) + '" y="' + (cy + 5) + '" width="4" height="32" fill="#000" opacity=".13"/>';
      }
    }
    return s;
  }

  function gantry(c, x, y) {
    return '<g stroke="' + c[2] + '" stroke-width="9" fill="none">' +
      '<path d="M' + x + ' ' + y + 'V' + (y - 210) + 'H' + (x + 260) + 'V' + y + '"/>' +
      '</g>' +
      '<rect x="' + (x - 30) + '" y="' + (y - 232) + '" width="330" height="16" fill="' + c[5] + '" opacity=".75"/>' +
      '<rect x="' + (x + 96) + '" y="' + (y - 216) + '" width="46" height="30" fill="' + c[2] + '"/>' +
      '<path d="M' + (x + 119) + ' ' + (y - 186) + 'v54" stroke="' + c[5] + '" stroke-width="3" opacity=".7"/>' +
      '<rect x="' + (x + 92) + '" y="' + (y - 132) + '" width="54" height="34" fill="' + c[3] + '"/>';
  }

  function tanks(c, x, y) {
    return '<g>' +
      '<rect x="' + x + '" y="' + (y - 150) + '" width="96" height="150" rx="10" fill="' + c[2] + '"/>' +
      '<rect x="' + x + '" y="' + (y - 150) + '" width="96" height="12" rx="6" fill="' + c[5] + '" opacity=".5"/>' +
      '<rect x="' + (x + 118) + '" y="' + (y - 112) + '" width="74" height="112" rx="8" fill="' + c[3] + '"/>' +
      '<path d="M' + (x + 22) + ' ' + (y - 168) + 'h52v18h-52z" fill="' + c[2] + '" opacity=".8"/>' +
      '<g stroke="' + c[5] + '" stroke-width="6" fill="none" opacity=".55">' +
      '<path d="M' + (x + 96) + ' ' + (y - 60) + 'h22v-40h74"/>' +
      '<path d="M' + (x - 40) + ' ' + (y - 40) + 'h40"/></g>' +
      '<circle cx="' + (x + 118) + '" cy="' + (y - 100) + '" r="9" fill="' + c[5] + '" opacity=".8"/>';
  }

  function pylon(c, x, y, h) {
    var t = y - h;
    return '<g stroke="' + c[2] + '" stroke-width="5" fill="none">' +
      '<path d="M' + (x - 34) + ' ' + y + 'L' + (x - 10) + ' ' + t + 'h20L' + (x + 34) + ' ' + y + '"/>' +
      '<path d="M' + (x - 26) + ' ' + (y - h * .3) + 'h52M' + (x - 20) + ' ' + (y - h * .6) + 'h40"/>' +
      '<path d="M' + (x - 52) + ' ' + (y - h * .72) + 'h104M' + (x - 40) + ' ' + (y - h * .9) + 'h80"/>' +
      '<path d="M' + (x - 30) + ' ' + y + 'L' + (x + 30) + ' ' + (y - h * .55) + 'M' + (x + 30) + ' ' + y + 'L' + (x - 30) + ' ' + (y - h * .55) + '"/>' +
      '</g>';
  }

  function drums(c, x, y) {
    return '<g>' +
      '<circle cx="' + x + '" cy="' + (y - 46) + '" r="46" fill="' + c[2] + '"/>' +
      '<circle cx="' + x + '" cy="' + (y - 46) + '" r="30" fill="' + c[3] + '"/>' +
      '<circle cx="' + x + '" cy="' + (y - 46) + '" r="12" fill="' + c[5] + '" opacity=".6"/>' +
      '<circle cx="' + (x + 104) + '" cy="' + (y - 34) + '" r="34" fill="' + c[2] + '" opacity=".9"/>' +
      '<circle cx="' + (x + 104) + '" cy="' + (y - 34) + '" r="21" fill="' + c[3] + '"/>' +
      '<circle cx="' + (x + 104) + '" cy="' + (y - 34) + '" r="8" fill="' + c[5] + '" opacity=".5"/>' +
      '</g>';
  }

  function panelBoard(c, x, y) {
    return '<g>' +
      '<rect x="' + x + '" y="' + (y - 168) + '" width="120" height="168" rx="6" fill="' + c[2] + '"/>' +
      '<rect x="' + (x + 12) + '" y="' + (y - 152) + '" width="96" height="60" rx="3" fill="' + c[5] + '" opacity=".28"/>' +
      '<g fill="' + c[5] + '" opacity=".7">' +
      '<rect x="' + (x + 16) + '" y="' + (y - 82) + '" width="24" height="12" rx="2"/>' +
      '<rect x="' + (x + 48) + '" y="' + (y - 82) + '" width="24" height="12" rx="2"/>' +
      '<rect x="' + (x + 80) + '" y="' + (y - 82) + '" width="24" height="12" rx="2"/>' +
      '<rect x="' + (x + 16) + '" y="' + (y - 60) + '" width="24" height="12" rx="2"/>' +
      '<rect x="' + (x + 48) + '" y="' + (y - 60) + '" width="24" height="12" rx="2"/>' +
      '</g>' +
      '<circle cx="' + (x + 96) + '" cy="' + (y - 54) + '" r="7" fill="' + c[5] + '"/>' +
      '</g>';
  }

  function worker(c, x, y, s, flip) {
    s = s || 1;
    return shade(c, x, y, 17 * s) +
      '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')" fill="' + c[4] + '">' +
      '<path d="M-9-52a9 9 0 0 1 18 0v4h-18z"/>' +          /* helmet */
      '<rect x="-11" y="-48" width="22" height="4" rx="2"/>' +
      '<circle cx="0" cy="-38" r="7"/>' +                    /* head */
      '<path d="M-11-30h22l4 30h-30z"/>' +                    /* torso */
      '<rect x="-9" y="0" width="7" height="26" rx="2"/><rect x="2" y="0" width="7" height="26" rx="2"/>' +
      '<path d="M-11-28l-9 20 5 3 10-17zM11-28l9 20-5 3-10-17z"/>' +
      '</g>' +
      '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')">' +
      '<path d="M-11-30h22l1 8h-24z" fill="' + c[5] + '" opacity=".85"/></g>';   /* hi-vis band */
  }

  function pallets(c, x, y, n) {
    var s = '', i;
    for (i = 0; i < n; i++) {
      var px = x + i * 76;
      s += '<rect x="' + px + '" y="' + (y - 12) + '" width="66" height="12" fill="' + c[2] + '"/>' +
           '<rect x="' + (px + 6) + '" y="' + (y - 52) + '" width="54" height="40" fill="' + c[3] + '"/>' +
           '<rect x="' + (px + 6) + '" y="' + (y - 52) + '" width="54" height="7" fill="' + c[5] + '" opacity=".4"/>';
    }
    return s;
  }

  function rebarStack(c, x, y) {
    var s = '<g>', i, j;
    for (i = 0; i < 3; i++)
      for (j = 0; j < 7 - i; j++)
        s += '<circle cx="' + (x + j * 17 + i * 9) + '" cy="' + (y - 9 - i * 16) + '" r="8" fill="' + (j % 2 ? c[2] : c[3]) + '"/>';
    return s + '</g>';
  }

  function pipesRow(c, x, y) {
    return '<g stroke="' + c[2] + '" stroke-width="12" fill="none" stroke-linecap="round">' +
      '<path d="M' + x + ' ' + y + 'h150"/><path d="M' + x + ' ' + (y - 22) + 'h150"/>' +
      '</g><g stroke="' + c[5] + '" stroke-width="3" opacity=".5" fill="none">' +
      '<path d="M' + (x + 40) + ' ' + (y - 34) + 'v24M' + (x + 110) + ' ' + (y - 34) + 'v24"/></g>';
  }

  /* roof trusses for the warehouse interior */
  function truss(c) {
    var s = '<g fill="' + c[3] + '">', i;
    for (i = 0; i < 4; i++) {
      var x = 40 + i * 210;
      s += '<rect x="' + x + '" y="34" width="170" height="10"/>' +
           '<rect x="' + x + '" y="86" width="170" height="8" opacity=".8"/>' +
           '<path d="M' + x + ' 44l42 42M' + (x + 85) + ' 44l-42 42M' + (x + 85) + ' 44l42 42M' + (x + 170) + ' 44l-42 42" ' +
           'stroke="' + c[3] + '" stroke-width="6" fill="none"/>';
    }
    s += '<rect x="0" y="0" width="800" height="26" fill="' + c[3] + '"/></g>';
    /* two hanging lamps */
    s += '<g opacity=".85"><path d="M240 94v26M560 94v26" stroke="' + c[3] + '" stroke-width="3"/>' +
         '<path d="M216 148l24-28 24 28z" fill="' + c[2] + '"/><path d="M536 148l24-28 24 28z" fill="' + c[2] + '"/>' +
         '<ellipse cx="240" cy="150" rx="20" ry="5" fill="' + c[5] + '" opacity=".55"/>' +
         '<ellipse cx="560" cy="150" rx="20" ry="5" fill="' + c[5] + '" opacity=".55"/></g>';
    return s;
  }

  function cone(c, x, y, s) {
    s = s || 1;
    return shade(c, x, y, 20 * s) +
      '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M0-52l19 52h-38z" fill="' + c[5] + '"/>' +
      '<path d="M-8-30h16M-12-16h24" stroke="' + c[4] + '" stroke-width="5" opacity=".55"/>' +
      '<rect x="-24" y="-4" width="48" height="8" rx="3" fill="' + c[5] + '" opacity=".8"/></g>';
  }

  function haze(c) {
    return '<rect width="800" height="600" fill="url(#haze)"/>';
  }

  /* ---- the scenes ------------------------------------------------------ */
  var SCENES = {
    site: function (c) {          /* construction site */
      return sky(c) + skyline(c, 505) +
        buildingFrame(c, 120, 505, 3, 5) +
        crane(c, 300, 505, 320) +
        ground(c) +
        rebarStack(c, 505, 505) +
        truck(c, 760, 505, .8) +
        worker(c, 400, 505, 1) + worker(c, 436, 505, .92, true);
    },
    warehouse: function (c) {
      return '<rect width="800" height="600" fill="url(#sky)"/>' +
        truss(c) +
        racking(c, 70, 505, 3, 4) +
        ground(c) +
        pallets(c, 505, 505, 3) +
        forklift(c, 300, 505) +
        worker(c, 700, 505, 1);
    },
    logistics: function (c) {     /* trucks at the gate */
      return sky(c) + skyline(c, 505) +
        '<rect x="80" y="300" width="640" height="170" fill="' + c[3] + '" opacity=".85"/>' +
        '<rect x="80" y="292" width="640" height="14" fill="' + c[2] + '"/>' +
        '<g fill="' + c[4] + '" opacity=".8">' +
        '<rect x="120" y="330" width="120" height="140" rx="4"/><rect x="290" y="330" width="120" height="140" rx="4"/>' +
        '<rect x="460" y="330" width="120" height="140" rx="4"/></g>' +
        ground(c) + truck(c, 300, 505, 1) + truck(c, 700, 505, .78) +
        worker(c, 505, 505, .9);
    },
    port: function (c) {
      return sky(c) +
        '<rect x="0" y="380" width="800" height="90" fill="' + c[2] + '" opacity=".45"/>' +
        gantry(c, 430, 505) + containers(c, 90, 505) +
        ground(c) + truck(c, 760, 505, .7) + worker(c, 380, 505, .85);
    },
    plant: function (c) {         /* industry / factory */
      return sky(c) +
        '<g opacity=".5">' + skyline(c, 505) + '</g>' +
        tanks(c, 120, 505) + pipesRow(c, 330, 440) +
        '<rect x="520" y="290" width="150" height="180" fill="' + c[3] + '"/>' +
        '<path d="M520 290l75-56 75 56z" fill="' + c[2] + '"/>' +
        '<g fill="' + c[5] + '" opacity=".35">' +
        '<rect x="546" y="330" width="30" height="34"/><rect x="592" y="330" width="30" height="34"/><rect x="638" y="330" width="30" height="34"/>' +
        '</g>' + ground(c) + worker(c, 460, 505, .9);
    },
    power: function (c) {
      return sky(c) + '<g opacity=".45">' + skyline(c, 505) + '</g>' +
        pylon(c, 610, 505, 300) + pylon(c, 760, 505, 230) +
        '<g stroke="' + c[5] + '" stroke-width="2" fill="none" opacity=".45">' +
        '<path d="M558 254q76 40 152 40M662 254q50 26 98 42"/></g>' +
        panelBoard(c, 120, 505) + drums(c, 320, 505) +
        ground(c) + worker(c, 490, 505, .9);
    },
    safety: function (c) {        /* site safety: barrier, cones, signage, crew */
      return sky(c) + '<g opacity=".4">' + skyline(c, 505) + '</g>' +
        /* barrier fence */
        '<g opacity=".9"><rect x="60" y="392" width="330" height="16" fill="' + c[5] + '" opacity=".8"/>' +
        '<rect x="60" y="424" width="330" height="16" fill="' + c[5] + '" opacity=".55"/>' +
        '<rect x="66" y="392" width="14" height="113" fill="' + c[2] + '"/>' +
        '<rect x="216" y="392" width="14" height="113" fill="' + c[2] + '"/>' +
        '<rect x="370" y="392" width="14" height="113" fill="' + c[2] + '"/></g>' +
        /* warning sign on a post */
        '<g transform="translate(600 330)">' +
        '<rect x="-5" y="0" width="10" height="175" fill="' + c[2] + '"/>' +
        '<path d="M0-86l76 130H-76z" fill="' + c[5] + '"/>' +
        '<path d="M0-52l58 100H-58z" fill="' + c[4] + '" opacity=".25"/>' +
        '<path d="M0-34v40M0 16v8" stroke="' + c[4] + '" stroke-width="9" stroke-linecap="round"/></g>' +
        ground(c) +
        /* cones */
        cone(c, 452, 505) + cone(c, 508, 505, .8) + cone(c, 700, 505, .9) +
        worker(c, 150, 505, 1.35) + worker(c, 250, 505, 1.15, true);
    },
    office: function (c) {        /* team / desk work */
      return '<rect width="800" height="600" fill="url(#sky)"/>' +
        '<rect x="60" y="90" width="300" height="200" rx="8" fill="' + c[2] + '" opacity=".6"/>' +
        '<g stroke="' + c[5] + '" stroke-width="3" fill="none" opacity=".55">' +
        '<path d="M96 240l60-70 46 40 62-84"/><path d="M96 262h230"/></g>' +
        '<rect x="430" y="120" width="300" height="170" rx="8" fill="' + c[3] + '" opacity=".7"/>' +
        '<g fill="' + c[5] + '" opacity=".45">' +
        '<rect x="460" y="150" width="180" height="12" rx="6"/><rect x="460" y="178" width="240" height="10" rx="5"/>' +
        '<rect x="460" y="202" width="200" height="10" rx="5"/><rect x="460" y="226" width="150" height="10" rx="5"/></g>' +
        '<rect x="0" y="430" width="800" height="18" fill="' + c[2] + '"/>' +
        '<rect x="120" y="448" width="16" height="60" fill="' + c[2] + '"/><rect x="664" y="448" width="16" height="60" fill="' + c[2] + '"/>' +
        ground(c, 508) +
        worker(c, 250, 430, 1.1) + worker(c, 560, 430, 1.05, true);
    },
    trade: function (c) {         /* import / documents / globe */
      return sky(c) +
        '<circle cx="400" cy="300" r="150" fill="none" stroke="' + c[5] + '" stroke-width="3" opacity=".5"/>' +
        '<ellipse cx="400" cy="300" rx="150" ry="58" fill="none" stroke="' + c[5] + '" stroke-width="2" opacity=".35"/>' +
        '<ellipse cx="400" cy="300" rx="62" ry="150" fill="none" stroke="' + c[5] + '" stroke-width="2" opacity=".35"/>' +
        '<path d="M400 150v300M250 300h300" stroke="' + c[5] + '" stroke-width="2" opacity=".2"/>' +
        '<g opacity=".9">' + containers(c, 480, 505) + '</g>' +
        '<g opacity=".85">' + truck(c, 250, 505, .8) + '</g>' +
        ground(c) + worker(c, 380, 505, .9);
    }
  };

  /* ---- render ---------------------------------------------------------- */
  function render(name, opts) {
    var o = opts || {},
        c = pal(o.palette),
        fn = SCENES[name] || SCENES.site,
        uid = "s" + Math.random().toString(36).slice(2, 8);

    var svg = '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" ' +
      (o.label ? 'role="img" aria-label="' + String(o.label).replace(/"/g, "&quot;") + '"' : 'aria-hidden="true"') + '>' +
      '<defs>' +
        '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>' +
        '<linearGradient id="haze" x1="0" y1="1" x2="0" y2="0">' +
          '<stop offset="0" stop-color="' + c[4] + '" stop-opacity=".38"/>' +
          '<stop offset=".42" stop-color="' + c[4] + '" stop-opacity="0"/></linearGradient>' +
      '</defs>' + fn(c) + haze(c) + '</svg>';

    /* the gradient ids must be unique per instance on the page */
    return svg.replace(/"sky"/g, '"' + uid + 's"').replace(/#sky\)/g, "#" + uid + "s)")
              .replace(/"haze"/g, '"' + uid + 'h"').replace(/#haze\)/g, "#" + uid + "h)");
  }

  w.SCENES = { render: render, list: Object.keys(SCENES) };
})(window);
