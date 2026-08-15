// ---- POSTER TEMPLATES -----------------------------------------------------
// Every item's posterRef is either "template:<name>" or a full image URL
// (e.g. a Supabase Storage public URL). Templates draw the poster as an SVG
// data URI at runtime from the item's title, time, venue and emoji — so a
// repeat event automatically reuses its category's artwork with new text.
//
// Event templates: two-tone condensed title, date line between thin rules,
// venue line, themed hero scene with the item's emoji as the centerpiece,
// divider, three-segment info strip. Place template: calmer explore card.

const POSTER_W = 600, POSTER_H = 800;
const TITLE_FONT = "'Arial Narrow','Oswald',Impact,'Helvetica Neue',sans-serif";
const BODY_FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

const POSTER_THEMES = {
  football: {
    kind: 'event',
    bg: ['#03180b', '#0a3b1c', '#041f0f'],
    accent: '#f5c542', bright: '#eef7ee', muted: '#cfe3d4',
    tagline: ['LIVE THE PASSION', 'FEEL THE ROAR'],
    scene: t => `
      <polygon points="40,0 120,0 360,560 240,560" fill="#fff8dd" opacity=".05"/>
      <polygon points="480,0 560,0 360,560 240,560" fill="#fff8dd" opacity=".05"/>
      <g stroke="${t.muted}" stroke-opacity=".5" fill="none" stroke-width="3">
        <ellipse cx="300" cy="520" rx="215" ry="66"/>
        <line x1="85" y1="520" x2="515" y2="520"/>
        <ellipse cx="300" cy="520" rx="70" ry="22"/>
      </g>`
  },
  concert: {
    kind: 'event',
    bg: ['#0d0618', '#1c0b33', '#0a0512'],
    accent: '#4be3d0', bright: '#f4f0ff', muted: '#cfc7ec',
    tagline: ['LIVE', 'ON STAGE'],
    scene: t => `
      <polygon points="120,0 190,0 420,610 280,610" fill="${t.accent}" opacity=".10"/>
      <polygon points="410,0 480,0 320,610 180,610" fill="#a78bfa" opacity=".12"/>
      <g opacity=".9">
        <rect x="168" y="470" width="24" height="90" rx="12" fill="#a78bfa"/>
        <rect x="208" y="430" width="24" height="130" rx="12" fill="${t.accent}"/>
        <rect x="368" y="430" width="24" height="130" rx="12" fill="#a78bfa"/>
        <rect x="408" y="470" width="24" height="90" rx="12" fill="${t.accent}"/>
      </g>`
  },
  candlelight: {
    kind: 'event',
    bg: ['#150900', '#2b1305', '#120701'],
    accent: '#ffb347', bright: '#ffe8c8', muted: '#ecd9bd',
    tagline: ['WARM', 'NIGHTS'],
    scene: t => `
      <g stroke="#7a4a1c" stroke-width="2">
        <line x1="64" y1="0" x2="64" y2="34"/><line x1="536" y1="0" x2="536" y2="52"/>
      </g>
      <g fill="#e2591f">
        <ellipse cx="64" cy="60" rx="20" ry="24"/><ellipse cx="536" cy="78" rx="20" ry="24"/>
      </g>
      <g fill="#ffd9a0">
        <rect x="56" y="32" width="16" height="6" rx="3"/><rect x="528" y="50" width="16" height="6" rx="3"/>
      </g>
      <g stroke="#ffd9a0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8">
        <path d="M258 372c-14-22 14-34 0-56"/><path d="M300 360c-14-22 14-34 0-56"/><path d="M342 372c-14-22 14-34 0-56"/>
      </g>`
  },
  family: {
    kind: 'event',
    bg: ['#1a0a2a', '#2e1250', '#140820'],
    accent: '#ff5ea8', bright: '#ffe9f4', muted: '#e3c9ec',
    tagline: ['PURE FUN', 'FOR EVERYONE'],
    scene: t => `
      <circle cx="120" cy="360" r="14" fill="#ffd166"/>
      <path d="M96 396a44 44 0 0 1 10-44" stroke="#ffd166" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
      <circle cx="488" cy="346" r="11" fill="#6fd6ff"/>
      <path d="M508 382a40 40 0 0 0-6-44" stroke="#6fd6ff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
      <g fill="${t.bright}">
        <polygon points="90,470 95,481 106,484 95,487 90,498 85,487 74,484 85,481"/>
        <polygon points="512,452 516,461 525,464 516,467 512,476 508,467 499,464 508,461"/>
      </g>`
  },
  exhibition: {
    kind: 'event',
    bg: ['#08080f', '#151530', '#07070d'],
    accent: '#35d6ff', bright: '#f2f4ff', muted: '#c3c9e8',
    tagline: ["DON'T", 'MISS IT'],
    scene: t => `
      <g stroke="${t.accent}" stroke-opacity=".08" fill="none" stroke-width="2">
        <path d="M60 340l30-18 30 18v36l-30 18-30-18z"/>
        <path d="M480 320l30-18 30 18v36l-30 18-30-18z"/>
        <path d="M90 540l30-18 30 18v36l-30 18-30-18z"/>
      </g>
      <polygon points="250,0 350,0 430,600 170,600" fill="${t.accent}" opacity=".05"/>
      <g stroke="#ff2d55" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7">
        <path d="M158 386a190 190 0 0 1 60-40"/>
        <path d="M442 386a190 190 0 0 0-60-40"/>
      </g>`
  },
  place: {
    kind: 'place',
    bg: ['#080e1c', '#132441', '#070d19'],
    accent: '#9db2cf', bright: '#eef4fc', muted: '#9db2cf',
    tagline: 'Worth the visit',
    scene: t => `
      <path d="M60 610h480" stroke="${t.accent}" stroke-width="2" opacity=".45"/>
      <path d="M110 645c60-24 130-36 190-36s130 12 190 36" stroke="${t.accent}" stroke-width="2" fill="none" opacity=".3"/>
      <g fill="${t.bright}" opacity=".7">
        <circle cx="110" cy="140" r="2.5"/><circle cx="490" cy="120" r="2"/><circle cx="440" cy="210" r="2"/><circle cx="140" cy="230" r="2"/>
      </g>`
  }
};

// Landmark places get their own hero artwork instead of an emoji — original
// vector interpretations of the real buildings' shapes. Extra landmark themes
// build on the place theme; posterSrc also picks them by title so existing
// rows with poster_ref 'template:place' upgrade automatically.
POSTER_THEMES.ithra = {
  ...POSTER_THEMES.place,
  tagline: 'Culture, art & ideas',
  hero: () => `
    <defs>
      <linearGradient id="ith1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#dbe6f2"/><stop offset=".55" stop-color="#8fa3b8"/><stop offset="1" stop-color="#3f4f61"/>
      </linearGradient>
      <linearGradient id="ith2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b7c6d8"/><stop offset="1" stop-color="#2f3c4c"/>
      </linearGradient>
      <linearGradient id="ith3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#93a7bd"/><stop offset="1" stop-color="#26303e"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="430" rx="250" ry="165" fill="url(#glow)" opacity=".7"/>
    <ellipse cx="300" cy="580" rx="185" ry="13" fill="#000" opacity=".35"/>
    <g stroke="#0a121e" stroke-width="3">
      <rect x="268" y="240" width="76" height="290" rx="38" transform="rotate(3 306 385)" fill="url(#ith1)"/>
      <rect x="180" y="330" width="92" height="200" rx="46" transform="rotate(-20 226 430)" fill="url(#ith2)"/>
      <rect x="352" y="380" width="86" height="160" rx="43" transform="rotate(16 395 460)" fill="url(#ith2)"/>
      <rect x="160" y="470" width="290" height="98" rx="49" fill="url(#ith3)"/>
    </g>
    <g stroke="#eaf2fa" fill="none" stroke-linecap="round">
      <path d="M295 262 c22 60 24 168 8 256" stroke-width="4" opacity=".5"/>
      <path d="M212 356 c-15 38 -18 96 -5 144" stroke-width="3" opacity=".35"/>
      <path d="M200 506 h212" stroke-width="2.5" opacity=".3"/>
    </g>`
};
POSTER_THEMES.watertower = {
  ...POSTER_THEMES.place,
  tagline: 'The icon of Khobar',
  hero: () => `
    <defs>
      <linearGradient id="wts" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#5b6c80"/><stop offset=".5" stop-color="#e8f0f8"/><stop offset="1" stop-color="#5b6c80"/>
      </linearGradient>
      <linearGradient id="wtr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f2f7fc"/><stop offset="1" stop-color="#7e8fa3"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="420" rx="250" ry="165" fill="url(#glow)" opacity=".7"/>
    <ellipse cx="300" cy="567" rx="125" ry="11" fill="#000" opacity=".35"/>
    <g stroke="#0a121e" stroke-width="3">
      <path d="M186 350 C242 386 282 400 288 450 L288 562 L312 562 L312 450 C318 400 358 386 414 350 Z" fill="url(#wts)"/>
      <ellipse cx="300" cy="350" rx="118" ry="26" fill="url(#wtr)"/>
      <ellipse cx="300" cy="344" rx="96" ry="17" fill="#101b2c"/>
      <path d="M206 336 A 94 40 0 0 1 394 336 Z" fill="url(#wtr)"/>
      <line x1="300" y1="268" x2="300" y2="294" stroke="#e8f0f8" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g fill="#9fdcff" opacity=".9">
      <circle cx="230" cy="346" r="3.2"/><circle cx="248" cy="348" r="3.2"/><circle cx="266" cy="350" r="3.2"/>
      <circle cx="284" cy="351" r="3.2"/><circle cx="302" cy="351" r="3.2"/><circle cx="320" cy="350" r="3.2"/>
      <circle cx="338" cy="348" r="3.2"/><circle cx="356" cy="346" r="3.2"/>
    </g>`
};

function posterEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// textLength only when the line would overflow, so short titles aren't stretched
function posterFit(text, fontSize, maxWidth, letterSpacing = 0) {
  const approx = text.length * (fontSize * 0.52 + letterSpacing);
  return approx > maxWidth ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"` : '';
}

// Split a string into up to two visually balanced lines at a word boundary
function posterSplit(text, maxChars) {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  if (words.length === 1) return [text];
  let best = 1, bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    const diff = Math.abs(a - b);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

function posterDefs(theme, seed) {
  return `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${theme.bg[0]}"/><stop offset=".5" stop-color="${theme.bg[1]}"/><stop offset="1" stop-color="${theme.bg[2]}"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${theme.accent}" stop-opacity=".45"/><stop offset="1" stop-color="${theme.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" seed="${seed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>`;
}

function stripSegment(x, iconSvg, top, bottom, accent) {
  const t = posterEsc(top.toUpperCase().slice(0, 18));
  const b = posterEsc(bottom.toUpperCase().slice(0, 15));
  return `${iconSvg}
    <text x="${x}" y="684" font-family="${BODY_FONT}" font-weight="800" font-size="13" letter-spacing=".5" fill="${accent}">${t}</text>
    <text x="${x}" y="704" font-family="${BODY_FONT}" font-weight="800" font-size="16" fill="#ffffff">${b}</text>`;
}

function calendarIcon(x, accent) {
  return `<g fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="${x}" y="676" width="22" height="20" rx="3"/>
    <line x1="${x}" y1="683" x2="${x + 22}" y2="683"/>
    <line x1="${x + 6}" y1="672" x2="${x + 6}" y2="679"/>
    <line x1="${x + 16}" y1="672" x2="${x + 16}" y2="679"/>
  </g>`;
}

function pinIconSvg(cx, accent) {
  return `<g fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M${cx} 672c-8 0-14 6-14 14 0 10 14 24 14 24s14-14 14-24c0-8-6-14-14-14z"/>
    <circle cx="${cx}" cy="686" r="4"/>
  </g>`;
}

function heroEmoji(emoji, cy) {
  return `<ellipse cx="300" cy="${cy}" rx="250" ry="165" fill="url(#glow)" opacity=".8"/>
    <circle cx="300" cy="${cy}" r="112" fill="#000" opacity=".22"/>
    <circle cx="300" cy="${cy}" r="112" fill="none" stroke="#ffffff" stroke-opacity=".25" stroke-width="3"/>
    <text x="300" y="${cy + 52}" text-anchor="middle" font-size="150">${emoji}</text>`;
}

function eventPosterSvg(theme, item) {
  const lines = posterSplit(item.title.toUpperCase(), 14);
  const [dateTop, dateBottom = ''] = item.time.split('·').map(s => s.trim());
  const [venTop, venBottom = ''] = item.venue.includes(',')
    ? [item.venue.split(',')[0], item.venue.split(',').slice(1).join(',').trim()]
    : posterSplit(item.venue, 12).concat('').slice(0, 2);
  const [tagTop, tagBottom] = theme.tagline;
  const title = lines.length === 1
    ? `<text x="300" y="160" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="900" font-size="88" fill="${theme.accent}"${posterFit(lines[0], 88, 520)}>${posterEsc(lines[0])}</text>`
    : `<text x="300" y="122" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="900" font-size="76" fill="${theme.accent}"${posterFit(lines[0], 76, 520)}>${posterEsc(lines[0])}</text>
       <text x="300" y="186" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="900" font-size="54" fill="${theme.bright}"${posterFit(lines[1], 54, 480)}>${posterEsc(lines[1])}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${POSTER_W} ${POSTER_H}" width="${POSTER_W}" height="${POSTER_H}" role="img" aria-label="${posterEsc(item.title)} poster">
  ${posterDefs(theme, item.id * 7 + 3)}
  <rect width="600" height="800" fill="url(#bg)"/>
  ${theme.scene(theme)}
  <g filter="url(#rough)">${title}</g>
  <rect x="140" y="212" width="320" height="1.5" fill="${theme.accent}" opacity=".55"/>
  <text x="300" y="240" text-anchor="middle" font-family="${BODY_FONT}" font-weight="800" font-size="21" letter-spacing="7" fill="${theme.accent}"${posterFit(item.time, 21, 440, 7)}>${posterEsc(item.time.toUpperCase())}</text>
  <rect x="140" y="252" width="320" height="1.5" fill="${theme.accent}" opacity=".55"/>
  <text x="300" y="282" text-anchor="middle" font-family="${BODY_FONT}" font-weight="700" font-size="16" letter-spacing="4" fill="${theme.muted}"${posterFit(item.venue, 16, 500, 4)}>${posterEsc(item.venue.toUpperCase())}</text>
  ${heroEmoji(item.emoji, 460)}
  <rect x="40" y="650" width="520" height="2" fill="${theme.accent}" opacity=".5"/>
  ${stripSegment(74, calendarIcon(42, theme.accent), dateTop, dateBottom || ' ', theme.accent)}
  <rect x="203" y="668" width="1.5" height="42" fill="${theme.accent}" opacity=".35"/>
  ${stripSegment(258, pinIconSvg(232, theme.accent), venTop, venBottom || ' ', theme.accent)}
  <rect x="408" y="668" width="1.5" height="42" fill="${theme.accent}" opacity=".35"/>
  ${stripSegment(452, `<text x="428" y="694" font-size="24">${item.emoji}</text>`, tagTop, tagBottom, theme.accent)}
  <rect width="600" height="800" filter="url(#grain)" opacity=".07"/>
</svg>`;
}

function placePosterSvg(theme, item) {
  const name = item.title.length > 26 ? item.title.split('—')[0].trim() : item.title;
  const city = (item.venue.split(',').pop() || item.venue).trim();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${POSTER_W} ${POSTER_H}" width="${POSTER_W}" height="${POSTER_H}" role="img" aria-label="${posterEsc(item.title)} card">
  ${posterDefs(theme, item.id * 7 + 3)}
  <rect width="600" height="800" fill="url(#bg)"/>
  <ellipse cx="300" cy="130" rx="280" ry="160" fill="url(#glow)" opacity=".45"/>
  ${theme.scene(theme)}
  <text x="300" y="122" text-anchor="middle" font-family="${BODY_FONT}" font-weight="800" font-size="52" letter-spacing="6" fill="${theme.bright}"${posterFit(name, 52, 540, 6)}>${posterEsc(name.toUpperCase())}</text>
  <text x="300" y="164" text-anchor="middle" font-family="${BODY_FONT}" font-weight="600" font-size="17" letter-spacing="4" fill="${theme.muted}"${posterFit(item.venue, 17, 500, 4)}>${posterEsc(item.venue.toUpperCase())}</text>
  ${theme.hero ? theme.hero() : heroEmoji(item.emoji, 430)}
  <rect x="150" y="694" width="300" height="1.5" fill="${theme.muted}" opacity=".5"/>
  <text x="300" y="734" text-anchor="middle" font-family="${BODY_FONT}" font-weight="500" font-size="24" fill="${theme.bright}">${posterEsc(theme.tagline)}</text>
  <g fill="none" stroke="${theme.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(${Math.round(300 - (city.length * 14) / 2 - 24)} 742)">
    <path d="M12 12c-7 0-12 5-12 12 0 9 12 21 12 21s12-12 12-21c0-7-5-12-12-12z"/>
    <circle cx="12" cy="24" r="3.5"/>
  </g>
  <text x="${Math.round(312 + 0)}" y="774" text-anchor="middle" font-family="${BODY_FONT}" font-weight="600" font-size="18" letter-spacing="3" fill="${theme.muted}">${posterEsc(city.toUpperCase())}</text>
  <rect width="600" height="800" filter="url(#grain)" opacity=".06"/>
</svg>`;
}

// Which landmark (if any) an item is — drives both the poster artwork and
// the custom mini icon, with no database change needed.
function landmarkKey(item) {
  const t = (item.title || '').toLowerCase();
  if (t.includes('ithra')) return 'ithra';
  if (t.includes('water tower')) return 'watertower';
  if (t.includes('kingdom cent') || t.includes('kingdom tower')) return 'kingdom';
  if (t.includes('diriyah') || t.includes('turaif')) return 'diriyah';
  if (t.includes('edge of the world')) return 'edgeoftheworld';
  if (t.includes('qiddiya')) return 'qiddiya';
  if (t.includes('balad')) return 'balad';
  if (t.includes('fountain') && t.includes('fahd')) return 'fountain';
  if (t.includes('floating mosque') || t.includes('rahma mosque')) return 'floatingmosque';
  if (t.includes('qarah') || t.includes('qara mountain')) return 'qarah';
  return null;
}

// The 2026 expansion set — original geometric interpretations of famous Saudi
// landmarks, same style family as Ithra and the Water Tower.
POSTER_THEMES.kingdom = {
  ...POSTER_THEMES.place,
  tagline: 'The Riyadh skyline',
  hero: () => `
    <defs>
      <linearGradient id="kc1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d3e2f2"/><stop offset="1" stop-color="#33445c"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="430" rx="250" ry="165" fill="url(#glow)" opacity=".7"/>
    <ellipse cx="300" cy="580" rx="110" ry="10" fill="#000" opacity=".35"/>
    <g stroke="#0a121e" stroke-width="3">
      <path d="M258 575 C252 430 262 340 284 296 A34 30 0 0 1 316 296 C338 340 348 430 342 575 Z" fill="url(#kc1)"/>
      <path d="M283 322 C286 384 293 424 300 444 C307 424 314 384 317 322 Z" fill="#0a1322"/>
      <rect x="279" y="306" width="42" height="11" rx="4" fill="#9fb4cc"/>
    </g>
    <g stroke="#eef6ff" stroke-width="2.5" opacity=".4" stroke-linecap="round">
      <path d="M272 340 C268 420 268 490 271 560"/>
      <path d="M328 340 C332 420 332 490 329 560"/>
    </g>`
};
POSTER_THEMES.diriyah = {
  ...POSTER_THEMES.place,
  tagline: 'Where the story began',
  hero: () => `
    <defs>
      <linearGradient id="dir1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ecd2a6"/><stop offset="1" stop-color="#8a6a42"/>
      </linearGradient>
      <linearGradient id="dir2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e0c294"/><stop offset="1" stop-color="#77582f"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="430" rx="250" ry="165" fill="url(#glow)" opacity=".55"/>
    <ellipse cx="300" cy="578" rx="180" ry="11" fill="#000" opacity=".35"/>
    <g stroke="#241708" stroke-width="3">
      <path d="M168 570 L168 480 L182 480 L182 464 L198 464 L198 480 L216 480 L216 464 L232 464 L232 480 L250 480 L250 464 L266 464 L266 480 L284 480 L284 464 L300 464 L300 480 L316 480 L316 464 L332 464 L332 480 L348 480 L348 570 Z" fill="url(#dir1)"/>
      <path d="M366 570 C370 448 377 396 391 372 C405 396 412 448 416 570 Z" fill="url(#dir2)"/>
      <path d="M244 570 L244 524 C244 508 258 500 258 500 C258 500 272 508 272 524 L272 570 Z" fill="#2b1c0c"/>
    </g>
    <g fill="#3a2814">
      <path d="M204 505 l7 -12 7 12 Z"/><path d="M252 505 l7 -12 7 12 Z" transform="translate(46 0)"/>
      <path d="M204 530 l7 -12 7 12 Z" transform="translate(24 0)"/><path d="M316 505 l7 -12 7 12 Z"/>
      <path d="M384 470 l7 -12 7 12 Z"/><path d="M384 510 l7 -12 7 12 Z"/>
    </g>`
};
POSTER_THEMES.edgeoftheworld = {
  ...POSTER_THEMES.place,
  tagline: 'The great escarpment',
  hero: () => `
    <defs>
      <linearGradient id="eow1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e6cd9e"/><stop offset="1" stop-color="#6d5535"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="420" rx="250" ry="165" fill="url(#glow)" opacity=".5"/>
    <circle cx="430" cy="330" r="34" fill="#ffd9a0" opacity=".8"/>
    <path d="M120 520 h360" stroke="#c9b183" stroke-width="2.5" opacity=".4"/>
    <g stroke="#241a08" stroke-width="3">
      <path d="M140 575 L140 392 L330 392 L392 410 L344 428 L368 452 L316 470 L340 500 L296 522 L318 552 L282 575 Z" fill="url(#eow1)"/>
    </g>
    <g stroke="#3f2f16" stroke-width="2.5" opacity=".6">
      <path d="M150 424 h216"/><path d="M150 452 h196"/><path d="M150 482 h172"/><path d="M150 514 h156"/>
    </g>`
};
POSTER_THEMES.qiddiya = {
  ...POSTER_THEMES.place,
  tagline: 'Thrills at scale',
  hero: () => `
    <ellipse cx="300" cy="430" rx="250" ry="165" fill="url(#glow)" opacity=".7"/>
    <ellipse cx="300" cy="572" rx="200" ry="10" fill="#000" opacity=".35"/>
    <g fill="none" stroke-linecap="round">
      <path d="M120 565 C170 420 210 420 250 505 C268 545 282 552 300 540" stroke="#ff5a5f" stroke-width="9"/>
      <circle cx="336" cy="470" r="62" stroke="#ff5a5f" stroke-width="9"/>
      <path d="M372 520 C410 560 448 500 470 565" stroke="#ff5a5f" stroke-width="9"/>
      <g stroke="#8fa3b8" stroke-width="4" opacity=".8">
        <line x1="170" y1="470" x2="170" y2="565"/><line x1="216" y1="452" x2="216" y2="565"/>
        <line x1="336" y1="532" x2="336" y2="565"/><line x1="416" y1="528" x2="416" y2="565"/>
      </g>
    </g>
    <rect x="196" y="430" width="44" height="24" rx="9" fill="#ffb347" stroke="#241708" stroke-width="3" transform="rotate(-28 218 442)"/>`
};
POSTER_THEMES.balad = {
  ...POSTER_THEMES.place,
  tagline: 'Old Jeddah alive',
  hero: () => `
    <defs>
      <linearGradient id="bal1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#efe3cd"/><stop offset="1" stop-color="#9c8d72"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="430" rx="250" ry="165" fill="url(#glow)" opacity=".55"/>
    <ellipse cx="300" cy="578" rx="120" ry="10" fill="#000" opacity=".35"/>
    <g stroke="#2b1f10" stroke-width="3">
      <path d="M228 570 L228 312 L244 296 L356 296 L372 312 L372 570 Z" fill="url(#bal1)"/>
      <rect x="206" y="330" width="62" height="86" rx="4" fill="#7a4f2c"/>
      <rect x="332" y="430" width="62" height="86" rx="4" fill="#7a4f2c"/>
      <path d="M282 570 L282 522 C282 504 300 496 300 496 C300 496 318 504 318 522 L318 570 Z" fill="#241708"/>
    </g>
    <g stroke="#3a2a16" stroke-width="2">
      <path d="M206 352 h62 M206 373 h62 M206 394 h62"/>
      <path d="M332 452 h62 M332 473 h62 M332 494 h62"/>
      <path d="M221 330 v86 M237 330 v86 M253 330 v86"/>
      <path d="M347 430 v86 M363 430 v86 M379 430 v86"/>
    </g>`
};
POSTER_THEMES.fountain = {
  ...POSTER_THEMES.place,
  tagline: 'Highest jet on Earth',
  hero: () => `
    <defs>
      <linearGradient id="kff1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9fc4e8"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="400" rx="250" ry="175" fill="url(#glow)" opacity=".7"/>
    <path d="M110 545 C170 528 230 528 300 545 C370 562 430 562 490 545 L490 585 L110 585 Z" fill="#123a5c" stroke="#0a121e" stroke-width="3"/>
    <path d="M300 540 C295 440 294 370 299 300 L301 300 C306 370 305 440 300 540 Z" fill="url(#kff1)" stroke="#dceefc" stroke-width="2"/>
    <g stroke="#eaf6ff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85">
      <path d="M299 302 C282 330 270 366 266 402"/>
      <path d="M301 302 C318 330 330 366 334 402"/>
      <path d="M299 306 C292 336 288 366 287 394"/>
      <path d="M301 306 C308 336 312 366 313 394"/>
    </g>
    <g fill="#eaf6ff" opacity=".9">
      <circle cx="266" cy="416" r="4"/><circle cx="334" cy="416" r="4"/><circle cx="287" cy="408" r="3"/><circle cx="313" cy="408" r="3"/>
    </g>`
};
POSTER_THEMES.floatingmosque = {
  ...POSTER_THEMES.place,
  tagline: 'Peace over water',
  hero: () => `
    <defs>
      <linearGradient id="frm1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c9dd"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="420" rx="250" ry="165" fill="url(#glow)" opacity=".6"/>
    <g stroke="#8fb5d8" stroke-width="3" fill="none" opacity=".6">
      <path d="M140 566 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/>
      <path d="M170 582 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0"/>
    </g>
    <g stroke="#1d2735" stroke-width="3">
      <path d="M180 552 L420 552 L412 500 L188 500 Z" fill="url(#frm1)"/>
      <path d="M245 500 A62 58 0 0 1 369 500 Z" fill="url(#frm1)"/>
      <path d="M212 500 L212 372 C212 372 219 358 219 350 C219 358 226 372 226 372 L226 500 Z" fill="url(#frm1)"/>
    </g>
    <g fill="#1d2735">
      <path d="M240 552 a10 12 0 0 1 20 0 Z"/><path d="M290 552 a10 12 0 0 1 20 0 Z"/><path d="M340 552 a10 12 0 0 1 20 0 Z"/>
    </g>
    <line x1="307" y1="420" x2="307" y2="440" stroke="#1d2735" stroke-width="3"/>
    <circle cx="307" cy="416" r="5" fill="none" stroke="#1d2735" stroke-width="3"/>
    <rect x="206" y="404" width="26" height="8" rx="4" fill="#8fa8c4"/>`
};
POSTER_THEMES.qarah = {
  ...POSTER_THEMES.place,
  tagline: 'Caves in the cool rock',
  hero: () => `
    <defs>
      <linearGradient id="qar1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e9c9a8"/><stop offset="1" stop-color="#7d5b3d"/>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="430" rx="250" ry="165" fill="url(#glow)" opacity=".55"/>
    <ellipse cx="300" cy="578" rx="190" ry="11" fill="#000" opacity=".35"/>
    <g stroke="#241708" stroke-width="3">
      <path d="M150 570 L152 470 C144 430 160 408 178 404 C200 400 210 424 206 452 L212 570 Z" fill="url(#qar1)"/>
      <path d="M224 570 L226 420 C214 368 240 340 268 338 C298 336 314 368 306 416 L310 570 Z" fill="url(#qar1)"/>
      <path d="M348 570 L344 428 C336 372 366 348 392 350 C420 352 436 380 426 432 L430 570 Z" fill="url(#qar1)"/>
      <path d="M446 570 L448 474 C442 438 456 418 472 416 C490 414 500 436 494 462 L498 570 Z" fill="url(#qar1)"/>
    </g>
    <path d="M318 570 L322 470 C322 452 330 444 330 444 C330 444 338 452 338 470 L342 570 Z" fill="#1d1207"/>
    <g stroke="#3f2c16" stroke-width="2.5" opacity=".5">
      <path d="M234 380 c24 -10 48 -10 66 0"/><path d="M356 392 c22 -10 44 -10 62 0"/>
    </g>`
};

// Tiny inline-SVG versions of the landmark artwork, used wherever an emoji
// chip would normally appear (pins, AR dots, titles, home cards). They size
// with the surrounding font via CSS (.lm-icon is 1em).
const LANDMARK_MINI = {
  ithra: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <rect x="10.2" y="3" width="6" height="14" rx="3" transform="rotate(4 13.2 10)"/>
    <rect x="4.2" y="8.5" width="6.6" height="11" rx="3.3" transform="rotate(-16 7.5 14)"/>
    <rect x="16" y="11" width="5.6" height="8.5" rx="2.8" transform="rotate(12 18.8 15)"/>
    <rect x="4" y="16.4" width="16.5" height="6" rx="3"/>
  </g>`,
  watertower: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <path d="M5.6 9.6 C9 11.6 10.6 12.6 10.9 15 L10.9 21.5 L13.1 21.5 L13.1 15 C13.4 12.6 15 11.6 18.4 9.6 Z"/>
    <ellipse cx="12" cy="9.4" rx="7.4" ry="2.3"/>
    <path d="M6.4 8.9 A5.8 2.9 0 0 1 17.6 8.9 Z"/>
    <line x1="12" y1="4.2" x2="12" y2="6" stroke-linecap="round"/>
  </g>`,
  kingdom: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <path d="M8.6 21.5 C8 12.5 9 6.5 10.7 3.6 A1.8 1.6 0 0 1 13.3 3.6 C15 6.5 16 12.5 15.4 21.5 Z"/>
    <path d="M10.4 5.6 C10.6 9.6 11.2 12 12 13.4 C12.8 12 13.4 9.6 13.6 5.6 Z" fill="#232f42"/>
    <rect x="10" y="4.6" width="4" height="1.4" rx=".6" fill="#232f42" stroke="none"/>
  </g>`,
  diriyah: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <path d="M3 21.5 L3 12.5 L4.6 12.5 L4.6 10.8 L6.6 10.8 L6.6 12.5 L9 12.5 L9 10.8 L11 10.8 L11 12.5 L13 12.5 L13 21.5 Z"/>
    <path d="M15 21.5 C15.4 12.5 16.4 8.6 18 6.4 C19.6 8.6 20.6 12.5 21 21.5 Z"/>
  </g>`,
  edgeoftheworld: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <path d="M3 21.5 L3 6.5 L15 6.5 L20.5 8 L16.5 9.6 L18.5 12 L14.5 13.6 L16.5 16.4 L12.5 18.2 L14 21.5 Z"/>
  </g>`,
  qiddiya: `<g fill="none" stroke="#eef4fc" stroke-width="1.8" stroke-linecap="round">
    <path d="M2.5 20 C6 8.5 8.5 8.5 11 15.5"/>
    <circle cx="15" cy="13.5" r="4.4"/>
    <path d="M18 17.5 C20 19.5 21 18 21.8 20.2"/>
  </g>`,
  balad: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <path d="M7 21.5 L7 4.6 L8.6 3 L15.4 3 L17 4.6 L17 21.5 Z"/>
    <rect x="5.4" y="6" width="5" height="6" rx=".8" fill="#232f42"/>
    <rect x="13.6" y="12" width="5" height="6" rx=".8" fill="#232f42"/>
  </g>`,
  fountain: `<g stroke="#eef4fc" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M12 21 C11.6 14 11.6 8 12 3.5"/>
    <path d="M12 4.5 C10 7 9 10 8.8 13"/>
    <path d="M12 4.5 C14 7 15 10 15.2 13"/>
    <path d="M4 21.5 C9 20 15 20 20 21.5"/>
  </g>`,
  floatingmosque: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.1" stroke-linejoin="round">
    <path d="M4 19.5 L20 19.5 L19.4 16 L4.6 16 Z"/>
    <path d="M8.6 16 A4.4 4.2 0 0 1 17.4 16 Z"/>
    <path d="M5.4 16 L5.4 8 L6 6.2 L6.6 8 L6.6 16 Z"/>
    <path d="M4 21.5 q2 -1 4 0 t4 0 t4 0 t4 0" fill="none" stroke="#eef4fc" stroke-width="1.3"/>
  </g>`,
  qarah: `<g fill="#eef4fc" stroke="#232f42" stroke-width="1.2" stroke-linejoin="round">
    <path d="M3 21.5 L3.2 13 C2.8 10.4 4 9 5.4 9 C7 9 7.8 10.6 7.4 13 L7.8 21.5 Z"/>
    <path d="M9.4 21.5 L9.6 10.5 C9 7.4 10.8 5.6 12.6 5.6 C14.6 5.6 16 7.6 15.4 10.7 L15.6 21.5 Z"/>
    <path d="M17.2 21.5 L17.4 13.5 C17 11 18.2 9.6 19.6 9.6 C21 9.6 21.8 11.2 21.4 13.5 L21.6 21.5 Z"/>
  </g>`
};

// The item's small visual mark: a custom landmark icon when it has one,
// otherwise its emoji. Returns an HTML string — safe to drop into templates.
function itemIcon(item) {
  const key = landmarkKey(item);
  if (key && LANDMARK_MINI[key]) {
    return `<svg class="lm-icon" viewBox="0 0 24 24" aria-hidden="true">${LANDMARK_MINI[key]}</svg>`;
  }
  return item.emoji;
}

// Returns an image src for the item's poster: the URL as-is, or a rendered
// template as an SVG data URI.
function posterSrc(item) {
  const ref = item.posterRef || '';
  if (ref && !ref.startsWith('template:')) return ref;
  let key = ref.slice('template:'.length);
  if (!POSTER_THEMES[key]) key = item.type === 'place' ? 'place' : 'exhibition';
  // landmark upgrade: known places get their custom artwork even while their
  // database row still says template:place
  if (key === 'place') {
    key = landmarkKey(item) || key;
  }
  const theme = POSTER_THEMES[key];
  const svg = theme.kind === 'place' ? placePosterSvg(theme, item) : eventPosterSvg(theme, item);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
