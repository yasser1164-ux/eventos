/* =========================================================================
   ITEM ART — a drawn "product shot" for every catalogue entry, on a light
   plate so the catalogue reads like a catalogue. Same swap rule as scenes:
   a photo at assets/img/photos/<id>.jpg replaces the drawing.
   ========================================================================= */
(function (w) {
  "use strict";

  var INK = "#243040", INK2 = "#3C4B5E", RED = "#C8102E", RED2 = "#8E0B1B",
      GOLD = "#F2B705", GOLD2 = "#C08A05", STEEL = "#7C8B9C", STEEL2 = "#5A6A7B",
      LIGHT = "#E8ECF1";

  var PLATE = {
    building:   ["#FFF6F7", "#F6DFE3"],
    industrial: ["#F4F7FA", "#DCE4EC"],
    electrical: ["#FFFBEF", "#F5E7C2"],
    safety:     ["#FFF4F5", "#F7DCDF"],
    logistics:  ["#F6F8F7", "#DFE7E4"]
  };

  function base(plate, body) {
    var p = PLATE[plate] || PLATE.industrial;
    return '<defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#p)"/>' +
      '<circle cx="330" cy="58" r="54" fill="#fff" opacity=".5"/>' +
      '<ellipse cx="200" cy="252" rx="128" ry="16" fill="#0F1A26" opacity=".10"/>' +
      body;
  }

  /* ---- the drawings ---------------------------------------------------- */
  var ART = {
    rebar: function () {
      var s = '<g>', i, j, x, y;
      for (i = 0; i < 3; i++) for (j = 0; j < 6 - i; j++) {
        x = 110 + j * 30 + i * 15; y = 238 - i * 27;
        s += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="' + (j % 2 ? STEEL : STEEL2) + '"/>' +
             '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#0F1A26" opacity=".28"/>';
      }
      return s + '<rect x="96" y="150" width="212" height="9" rx="4" fill="' + RED + '"/>' +
             '<rect x="96" y="206" width="212" height="9" rx="4" fill="' + RED + '"/></g>';
    },
    cement: function () {
      function bag(x, y, r) {
        return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')">' +
          '<path d="M-62-40h124a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H-62a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8z" fill="' + LIGHT + '"/>' +
          '<path d="M-70-12h140v22H-70z" fill="' + RED + '" opacity=".9"/>' +
          '<rect x="-46" y="-32" width="60" height="7" rx="3" fill="' + INK + '" opacity=".35"/>' +
          '<rect x="-46" y="18" width="40" height="6" rx="3" fill="' + INK + '" opacity=".22"/></g>';
      }
      return bag(198, 200, 0) + bag(178, 138, -6) + bag(214, 82, 4);
    },
    board: function () {
      var s = '', i;
      for (i = 0; i < 4; i++) {
        var y = 232 - i * 26;
        s += '<g><path d="M104 ' + y + 'l70-34h122l-70 34z" fill="' + (i % 2 ? "#FFFFFF" : LIGHT) + '"/>' +
             '<path d="M104 ' + y + 'v-14l70-34v14z" fill="' + STEEL + '" opacity=".55"/>' +
             '<path d="M296 ' + (y - 34) + 'v-14l-70 34v14z" fill="' + STEEL2 + '" opacity=".4"/></g>';
      }
      return s + '<rect x="150" y="96" width="86" height="10" rx="5" fill="' + GOLD + '"/>';
    },
    pipe: function () {
      function tube(x, y, len, col) {
        return '<g><rect x="' + x + '" y="' + y + '" width="' + len + '" height="44" rx="6" fill="' + col + '"/>' +
          '<rect x="' + x + '" y="' + (y + 6) + '" width="' + len + '" height="9" rx="4" fill="#fff" opacity=".25"/>' +
          '<ellipse cx="' + (x + len) + '" cy="' + (y + 22) + '" rx="9" ry="22" fill="#0F1A26" opacity=".25"/></g>';
      }
      return tube(92, 190, 216, INK2) + tube(120, 140, 180, STEEL) +
        '<path d="M300 108h34a20 20 0 0 1 20 20v34" stroke="' + RED + '" stroke-width="26" fill="none" stroke-linecap="round" opacity=".9"/>';
    },
    valve: function () {
      return '<g>' +
        '<rect x="96" y="166" width="208" height="40" rx="8" fill="' + STEEL2 + '"/>' +
        '<rect x="150" y="120" width="100" height="94" rx="12" fill="' + INK2 + '"/>' +
        '<rect x="192" y="74" width="16" height="56" fill="' + STEEL + '"/>' +
        '<circle cx="200" cy="70" r="34" fill="none" stroke="' + RED + '" stroke-width="13"/>' +
        '<path d="M170 70h60M200 40v60" stroke="' + RED + '" stroke-width="9"/>' +
        '<rect x="86" y="156" width="16" height="60" rx="4" fill="' + INK + '"/>' +
        '<rect x="298" y="156" width="16" height="60" rx="4" fill="' + INK + '"/></g>';
    },
    pump: function () {
      return '<g>' +
        '<rect x="92" y="206" width="220" height="26" rx="6" fill="' + INK + '"/>' +
        '<circle cx="168" cy="164" r="56" fill="' + STEEL2 + '"/><circle cx="168" cy="164" r="30" fill="' + LIGHT + '"/>' +
        '<circle cx="168" cy="164" r="12" fill="' + RED + '"/>' +
        '<rect x="216" y="128" width="96" height="74" rx="10" fill="' + INK2 + '"/>' +
        '<g stroke="' + GOLD + '" stroke-width="5" opacity=".75"><path d="M228 148h72M228 164h72M228 180h48"/></g>' +
        '<rect x="150" y="86" width="36" height="30" rx="6" fill="' + RED + '"/></g>';
    },
    tools: function () {
      return '<g>' +
        '<g transform="rotate(-24 200 180)"><rect x="120" y="168" width="160" height="20" rx="8" fill="' + INK2 + '"/>' +
        '<path d="M120 158h34v40h-34z" fill="' + STEEL + '"/><rect x="252" y="160" width="42" height="36" rx="6" fill="' + RED + '"/></g>' +
        '<g transform="rotate(18 210 200)"><rect x="130" y="196" width="150" height="16" rx="8" fill="' + STEEL2 + '"/>' +
        '<path d="M126 188l-24 16 24 16z" fill="' + STEEL + '"/><rect x="248" y="192" width="46" height="24" rx="6" fill="' + GOLD + '"/></g>' +
        '<circle cx="300" cy="112" r="30" fill="none" stroke="' + INK + '" stroke-width="14" stroke-dasharray="12 9"/></g>';
    },
    bearing: function () {
      var s = '<g><circle cx="200" cy="160" r="82" fill="' + STEEL2 + '"/><circle cx="200" cy="160" r="62" fill="' + LIGHT + '"/>' +
              '<circle cx="200" cy="160" r="34" fill="' + STEEL + '"/><circle cx="200" cy="160" r="22" fill="' + INK2 + '"/>', i;
      for (i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        s += '<circle cx="' + (200 + Math.cos(a) * 48) + '" cy="' + (160 + Math.sin(a) * 48) + '" r="12" fill="' + INK + '" opacity=".85"/>';
      }
      return s + '<path d="M118 160a82 82 0 0 1 82-82" stroke="' + RED + '" stroke-width="8" fill="none"/></g>';
    },
    cable: function () {
      return '<g>' +
        '<circle cx="196" cy="158" r="86" fill="' + INK2 + '"/><circle cx="196" cy="158" r="62" fill="' + GOLD2 + '"/>' +
        '<circle cx="196" cy="158" r="46" fill="' + GOLD + '"/><circle cx="196" cy="158" r="18" fill="' + INK + '"/>' +
        '<g stroke="' + INK + '" stroke-width="3" opacity=".3"><circle cx="196" cy="158" r="30" fill="none"/><circle cx="196" cy="158" r="38" fill="none"/></g>' +
        '<path d="M282 158q46 10 34 54t-72 26" stroke="' + RED + '" stroke-width="14" fill="none" stroke-linecap="round"/>' +
        '<rect x="112" y="238" width="170" height="12" rx="6" fill="' + INK + '" opacity=".5"/></g>';
    },
    panel: function () {
      return '<g><rect x="126" y="66" width="148" height="180" rx="10" fill="' + INK2 + '"/>' +
        '<rect x="140" y="80" width="120" height="52" rx="6" fill="' + GOLD + '" opacity=".85"/>' +
        '<g fill="' + LIGHT + '">' +
        '<rect x="142" y="146" width="32" height="16" rx="3"/><rect x="184" y="146" width="32" height="16" rx="3"/><rect x="226" y="146" width="32" height="16" rx="3"/>' +
        '<rect x="142" y="172" width="32" height="16" rx="3"/><rect x="184" y="172" width="32" height="16" rx="3"/></g>' +
        '<circle cx="242" cy="180" r="9" fill="' + RED + '"/>' +
        '<rect x="140" y="206" width="118" height="8" rx="4" fill="#fff" opacity=".3"/>' +
        '<rect x="112" y="246" width="176" height="10" rx="5" fill="' + INK + '" opacity=".5"/></g>';
    },
    genset: function () {
      return '<g><rect x="86" y="120" width="228" height="112" rx="14" fill="' + INK2 + '"/>' +
        '<rect x="86" y="216" width="228" height="20" rx="6" fill="' + INK + '"/>' +
        '<g stroke="' + LIGHT + '" stroke-width="6" opacity=".55"><path d="M108 146v58M126 146v58M144 146v58"/></g>' +
        '<rect x="176" y="140" width="72" height="52" rx="6" fill="' + GOLD + '" opacity=".85"/>' +
        '<circle cx="284" cy="150" r="12" fill="' + RED + '"/>' +
        '<rect x="252" y="90" width="20" height="32" rx="5" fill="' + STEEL2 + '"/>' +
        '<path d="M262 90c0-16 18-16 18-32" stroke="' + STEEL + '" stroke-width="7" fill="none" opacity=".6"/></g>';
    },
    light: function () {
      return '<g><path d="M132 96h136l18 66H114z" fill="' + INK2 + '"/>' +
        '<rect x="120" y="160" width="160" height="18" rx="6" fill="' + GOLD + '"/>' +
        '<path d="M126 178l-22 74h192l-22-74z" fill="' + GOLD + '" opacity=".22"/>' +
        '<rect x="188" y="60" width="24" height="40" rx="5" fill="' + STEEL2 + '"/>' +
        '<g stroke="' + GOLD + '" stroke-width="5" opacity=".5"><path d="M96 128H72M304 128h24M104 92L86 76M296 92l18-16"/></g></g>';
    },
    helmet: function () {
      return '<g><path d="M104 196a96 96 0 0 1 192 0z" fill="' + GOLD + '"/>' +
        '<path d="M104 196a96 96 0 0 1 96-96v96z" fill="' + GOLD2 + '" opacity=".45"/>' +
        '<rect x="86" y="192" width="228" height="26" rx="12" fill="' + GOLD2 + '"/>' +
        '<path d="M176 104h48v92h-48z" fill="#fff" opacity=".35"/>' +
        '<rect x="120" y="218" width="160" height="12" rx="6" fill="' + INK + '" opacity=".25"/></g>';
    },
    boot: function () {
      return '<g><path d="M124 92h56v92l86 34a26 26 0 0 1 16 24v10H124z" fill="' + INK2 + '"/>' +
        '<path d="M124 216h158v14a8 8 0 0 1-8 8H132a8 8 0 0 1-8-8z" fill="' + GOLD + '"/>' +
        '<path d="M180 130l58 26" stroke="' + RED + '" stroke-width="8"/>' +
        '<g stroke="' + LIGHT + '" stroke-width="5" opacity=".6"><path d="M134 108h36M134 128h36M134 148h36"/></g></g>';
    },
    vest: function () {
      return '<g><path d="M150 84h100l40 30-22 34-18-12v122H150V136l-18 12-22-34z" fill="' + GOLD + '"/>' +
        '<path d="M200 84v174" stroke="' + GOLD2 + '" stroke-width="5"/>' +
        '<g fill="' + LIGHT + '" opacity=".9"><rect x="150" y="168" width="100" height="16"/><rect x="150" y="200" width="100" height="16"/></g>' +
        '<path d="M168 84l32 34 32-34" fill="' + GOLD2 + '" opacity=".5"/></g>';
    },
    extinguisher: function () {
      return '<g><rect x="158" y="104" width="84" height="146" rx="26" fill="' + RED + '"/>' +
        '<rect x="158" y="150" width="84" height="30" fill="#fff" opacity=".85"/>' +
        '<rect x="184" y="72" width="32" height="34" rx="8" fill="' + INK2 + '"/>' +
        '<path d="M216 82h34a12 12 0 0 1 12 12v16" stroke="' + INK + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<path d="M262 118l22 26" stroke="' + INK2 + '" stroke-width="12" stroke-linecap="round"/>' +
        '<circle cx="200" cy="70" r="10" fill="' + GOLD + '"/></g>';
    },
    film: function () {
      return '<g><rect x="132" y="96" width="136" height="150" rx="14" fill="' + STEEL + '" opacity=".55"/>' +
        '<rect x="132" y="96" width="136" height="150" rx="14" fill="none" stroke="' + INK2 + '" stroke-width="4"/>' +
        '<ellipse cx="200" cy="96" rx="68" ry="20" fill="' + LIGHT + '"/>' +
        '<ellipse cx="200" cy="96" rx="26" ry="9" fill="' + INK2 + '"/>' +
        '<path d="M268 150q46 20 30 62" stroke="' + GOLD + '" stroke-width="12" fill="none" stroke-linecap="round" opacity=".85"/>' +
        '<ellipse cx="200" cy="246" rx="68" ry="18" fill="' + STEEL2 + '" opacity=".5"/></g>';
    },
    pallet: function () {
      return '<g><g fill="' + GOLD2 + '" opacity=".85">' +
        '<rect x="96" y="214" width="208" height="14" rx="3"/><rect x="96" y="238" width="208" height="14" rx="3"/>' +
        '<rect x="104" y="214" width="20" height="38"/><rect x="190" y="214" width="20" height="38"/><rect x="276" y="214" width="20" height="38"/></g>' +
        '<rect x="118" y="126" width="76" height="88" fill="' + INK2 + '"/><rect x="118" y="126" width="76" height="14" fill="' + RED + '"/>' +
        '<rect x="206" y="152" width="86" height="62" fill="' + STEEL2 + '"/><rect x="206" y="152" width="86" height="12" fill="' + GOLD + '"/>' +
        '<rect x="152" y="86" width="90" height="40" fill="' + LIGHT + '"/><rect x="152" y="86" width="90" height="8" fill="' + RED + '" opacity=".7"/></g>';
    }
  };

  /* catalogue id → drawing */
  var MAP = {
    "P-1001": ["rebar", "building"], "P-1002": ["cement", "building"],
    "P-1003": ["board", "building"],  "P-1004": ["pipe", "building"],
    "P-2001": ["valve", "industrial"], "P-2002": ["pump", "industrial"],
    "P-2003": ["tools", "industrial"], "P-2004": ["bearing", "industrial"],
    "P-3001": ["cable", "electrical"], "P-3002": ["panel", "electrical"],
    "P-3003": ["genset", "electrical"], "P-3004": ["light", "electrical"],
    "P-4001": ["helmet", "safety"], "P-4002": ["boot", "safety"],
    "P-4003": ["vest", "safety"], "P-4004": ["extinguisher", "safety"],
    "P-5001": ["film", "logistics"], "P-5002": ["pallet", "logistics"]
  };

  function render(id, opts) {
    var o = opts || {},
        m = MAP[id] || ["pallet", "industrial"],
        name = o.art || m[0],
        plate = o.plate || m[1],
        uid = "i" + Math.random().toString(36).slice(2, 8),
        draw = ART[name] || ART.pallet;

    return ('<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" ' +
      (o.label ? 'role="img" aria-label="' + String(o.label).replace(/"/g, "&quot;") + '"' : 'aria-hidden="true"') + '>' +
      base(plate, draw()) + '</svg>')
      .replace(/"p"/g, '"' + uid + '"').replace(/#p\)/g, "#" + uid + ")");
  }

  w.ITEMS = { render: render, map: MAP, list: Object.keys(ART) };
})(window);
