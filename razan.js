// ---- RAZAN'S BIRTHDAY SHOW 🎂 ----------------------------------------------
// A gift: a drone show anchored in the sky over Al Makhwah, a short walk from
// home — far enough away to watch like a real show. ~80 glowing drones morph
// between three formations on a shared clock (everyone nearby with the link
// sees the same moment): a beating heart → RAZAN written in lights → a
// fireworks starburst. Colours shift with each formation. Only people within
// ~45 km ever see it (or its finder cue) — it belongs to her sky.
// To move it: edit lat/lng below (long-press in Google Maps shows numbers).

const RAZAN_SHOW = {
  lat: 19.7830, lng: 41.4330,  // Al Makhwah (An-Nahdah / Bani Asim area)
  offsetKmE: 0.45, offsetKmN: 0.20, // hung this far from home, over open ground
  altM: 130,      // height of the show centre
  sizeM: 160,     // physical width of the formations
  minAngDeg: 0.5, // beyond ~18 km it is honestly invisible
  boost: 3.2, minPx: 90, maxPx: 460,
  cueMaxKm: 45,   // outside this radius the show doesn't exist for you at all
  count: 80,
  phaseS: 9,      // seconds per formation
  morph: 0.075    // how quickly drones fly to their next position
};

const RAZAN = { el: null, cue: null, label: null, dots: [], anchor: null, phase: -1 };

// ---- formations (normalised coords, x right, y up, ~[-0.5, 0.5]) -----------

function razanHeart(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / n * Math.PI * 2;
    pts.push({
      x: 16 * Math.sin(t) ** 3 / 32,
      y: (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 32
    });
  }
  return pts;
}

// letters as polyline strokes on a 0..0.7 x 0..1 grid
const RAZAN_STROKES = {
  R: [[[0, 0], [0, 1]], [[0, 1], [0.55, 1], [0.7, 0.85], [0.7, 0.62], [0.55, 0.5], [0, 0.5]], [[0.3, 0.5], [0.7, 0]]],
  A: [[[0, 0], [0.35, 1], [0.7, 0]], [[0.16, 0.42], [0.54, 0.42]]],
  Z: [[[0, 1], [0.7, 1], [0, 0], [0.7, 0]]],
  N: [[[0, 0], [0, 1], [0.7, 0], [0.7, 1]]]
};

function razanName(n) {
  const word = 'RAZAN';
  const segs = [];
  let x0 = 0;
  for (const ch of word) {
    for (const stroke of RAZAN_STROKES[ch]) {
      for (let i = 1; i < stroke.length; i++) {
        const a = [stroke[i - 1][0] + x0, stroke[i - 1][1]];
        const b = [stroke[i][0] + x0, stroke[i][1]];
        segs.push({ a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) });
      }
    }
    x0 += 0.95;
  }
  const total = segs.reduce((s, g) => s + g.len, 0);
  const width = x0 - 0.25;
  const pts = [];
  for (let i = 0; i < n; i++) {
    let d = (i + 0.5) / n * total;
    const seg = segs.find(g => (d -= g.len) <= 0) || segs[segs.length - 1];
    const f = 1 + d / seg.len; // d is negative remainder within this segment
    pts.push({
      x: (seg.a[0] + (seg.b[0] - seg.a[0]) * f) / width - 0.5,
      y: ((seg.a[1] + (seg.b[1] - seg.a[1]) * f) - 0.5) * 0.34
    });
  }
  return pts;
}

function razanBurst(n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ray = i % 10, ring = Math.floor(i / 10) % 4;
    const ang = ray / 10 * Math.PI * 2 + ring * 0.16;
    const r = 0.10 + ring * 0.13;
    pts.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
  }
  return pts;
}

const RAZAN_PHASES = [
  { pts: null, make: razanHeart, colors: ['#ff6b9d', '#ff9ecd', '#ffd1e8'] },
  { pts: null, make: razanName, colors: ['#ffd166', '#fff3c4', '#ffb347'] },
  { pts: null, make: razanBurst, colors: ['#5ff2ff', '#ff5ad2', '#ffd166', '#7dffa8'] }
];

function buildRazan() {
  const km = 111.32;
  RAZAN.anchor = {
    lat: RAZAN_SHOW.lat + RAZAN_SHOW.offsetKmN / km,
    lng: RAZAN_SHOW.lng + RAZAN_SHOW.offsetKmE / (km * Math.cos(RAZAN_SHOW.lat * Math.PI / 180))
  };
  RAZAN_PHASES.forEach(p => { p.pts = p.make(RAZAN_SHOW.count); });
  RAZAN.el = document.createElement('div');
  RAZAN.el.className = 'razan-show';
  RAZAN.el.style.display = 'none';
  for (let i = 0; i < RAZAN_SHOW.count; i++) {
    const d = document.createElement('span');
    d.className = 'razan-drone';
    d.style.animationDelay = `${(i * 0.19) % 1.7}s`;
    RAZAN.el.appendChild(d);
    RAZAN.dots.push({ el: d, x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2 });
  }
  const lbl = document.createElement('span');
  lbl.className = 'sky-label razan-label';
  lbl.textContent = '🎉 Happy Birthday Razan 🎂';
  RAZAN.el.appendChild(lbl);
  RAZAN.cue = document.createElement('div');
  RAZAN.cue.className = 'sky-cue';
  RAZAN.cue.hidden = true;
  document.body.appendChild(RAZAN.cue);
}
buildRazan();

function renderRazan(W, H, horizonY) {
  if (!userPos) return;
  const distKm = haversineKm(userPos, RAZAN.anchor);
  const cue = RAZAN.cue;
  // her sky only: far viewers get nothing, not even a cue
  if (distKm > RAZAN_SHOW.cueMaxKm) { RAZAN.el.style.display = 'none'; cue.hidden = true; return; }
  const angDeg = 2 * toDeg(Math.atan2(RAZAN_SHOW.sizeM / 2, distKm * 1000));
  const name = `🎁 Razan's show ${distKm.toFixed(1)} km`;
  if (angDeg < RAZAN_SHOW.minAngDeg) {
    RAZAN.el.style.display = 'none';
    cue.textContent = `${name} — too far to see`;
    cue.style.left = '50%'; cue.style.right = 'auto'; cue.style.transform = 'translateX(-50%)';
    cue.hidden = false;
    return;
  }
  const rel = angleDiff(headingSmooth, bearingDeg(userPos, RAZAN.anchor));
  if (Math.abs(rel) > AR_FOV / 2 + 12) {
    RAZAN.el.style.display = 'none';
    const right = rel > 0;
    cue.textContent = right ? `${name} →` : `← ${name}`;
    cue.style.left = right ? 'auto' : '10px';
    cue.style.right = right ? '10px' : 'auto';
    cue.style.transform = '';
    cue.hidden = false;
    return;
  }
  const pxPerDeg = W / AR_FOV;
  const S = Math.max(RAZAN_SHOW.minPx, Math.min(RAZAN_SHOW.maxPx, angDeg * pxPerDeg * RAZAN_SHOW.boost));
  const x = W * (0.5 + rel / AR_FOV);
  const y = horizonY - toDeg(Math.atan2(RAZAN_SHOW.altM, distKm * 1000)) * (H / AR_VFOV);
  if (y < -S * 0.6 || y > H + S * 0.6) {
    RAZAN.el.style.display = 'none';
    cue.textContent = y < 0 ? `${name} — tilt up ↑` : `${name} — tilt down ↓`;
    cue.style.left = '50%'; cue.style.right = 'auto'; cue.style.transform = 'translateX(-50%)';
    cue.hidden = false;
    return;
  }
  cue.hidden = true;
  RAZAN.el.style.display = '';

  const t = Date.now() / 1000; // wall clock — the same show for everyone
  const phase = Math.floor(t / RAZAN_SHOW.phaseS) % RAZAN_PHASES.length;
  const P = RAZAN_PHASES[phase];
  if (phase !== RAZAN.phase) {
    RAZAN.phase = phase;
    RAZAN.dots.forEach((d, i) => {
      const c = P.colors[i % P.colors.length];
      d.el.style.background = c;
      d.el.style.boxShadow = `0 0 9px 3px ${c}`;
    });
  }
  // the burst breathes; other formations hold steady with a gentle sway
  const pulse = phase === 2 ? 1 + 0.18 * Math.sin(t * 2.4) : 1;
  const sway = Math.sin(t * 0.5) * 0.05;
  const dotPx = Math.max(3, Math.min(9, S * 0.028));
  RAZAN.dots.forEach((d, i) => {
    const tgt = P.pts[i];
    d.x += (tgt.x * pulse + sway * tgt.y - d.x) * RAZAN_SHOW.morph;
    d.y += (tgt.y * pulse - d.y) * RAZAN_SHOW.morph;
    d.el.style.width = d.el.style.height = `${dotPx.toFixed(1)}px`;
    d.el.style.transform = `translate(${((0.5 + d.x) * S).toFixed(1)}px, ${((0.5 - d.y) * S).toFixed(1)}px)`;
  });
  const bob = Math.sin(t * 0.9) * S * 0.015;
  RAZAN.el.style.width = RAZAN.el.style.height = `${Math.round(S)}px`;
  RAZAN.el.style.transform = `translate(${Math.round(x - S / 2)}px, ${Math.round(y - S / 2 + bob)}px)`;
}
