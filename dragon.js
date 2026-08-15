// ---- SEA DRAGON (experimental AR scene) -----------------------------------
// An original, code-drawn dragon that patrols the sky over the sea off the
// Khobar corniche. Its position on the loop comes from the wall clock, so
// everyone who opens the site sees the SAME dragon at the same point of its
// flight — each viewer from their own angle and distance. Perspective is
// real: it grows as it sweeps toward the shore and shrinks to a speck as it
// heads out to sea; beyond ~9 km it can't be seen at all.
// Uses the geometry helpers and sensor state defined in ar.js (loaded after
// this file; everything here only runs at render time).

const DRAGON = {
  home: { lat: 26.296, lng: 50.230 }, // centre of the patrol, over the water
  loopEwKm: 1.2,   // east-west half-width of the loop
  loopNsKm: 3.0,   // north-south half-length (runs along the shore)
  periodS: 240,    // seconds for a full lap
  altM: 110,       // cruising height
  bobM: 35,        // climb/dive amplitude over the lap
  wingspanM: 60,   // fantasy-sized — drives the perspective maths
  minAngDeg: 0.28, // apparent size below this = too far to see (~9 km)
  boost: 6.5,      // exaggerate apparent size so phones can enjoy it
  minPx: 32,
  maxPx: 420,
  el: null, svg: null, label: null, cue: null, wingFar: null, wingNear: null,
  lastX: null, face: 1
};

function dragonBuild() {
  const wrap = document.createElement('div');
  wrap.className = 'dragon-wrap';
  wrap.style.display = 'none';
  wrap.innerHTML = `
  <svg viewBox="0 0 220 140" aria-hidden="true">
    <defs>
      <linearGradient id="drg-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2b2233"/>
        <stop offset="1" stop-color="#17121d"/>
      </linearGradient>
      <linearGradient id="drg-wing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#261c2e"/>
        <stop offset="1" stop-color="#1a1420"/>
      </linearGradient>
    </defs>
    <!-- far wing (behind the body, slightly darker) -->
    <g id="drg-wing-far">
      <path d="M136,64 C128,44 120,26 104,12 L60,8
               Q 86,16 86,42
               Q 98,44 104,56
               Q 120,60 136,66 Z"
            fill="#150f1b" opacity="0.9"/>
    </g>
    <!-- body, tail, neck and head as one silhouette -->
    <path d="M6,86
             C40,94 72,90 100,82
             C120,77 134,72 146,65
             C158,58 167,50 173,41
             C176,36 181,33 189,32
             L206,35 L194,40 L200,47
             C191,48 183,46 177,50
             C169,58 158,67 146,73
             C128,82 108,88 96,90
             C68,96 38,96 6,86 Z" fill="url(#drg-body)"/>
    <!-- tail fin -->
    <path d="M8,86 L-2,74 L4,86 L-2,96 Z" fill="url(#drg-body)"/>
    <!-- horns -->
    <path d="M186,32 L177,20 L182,32 Z" fill="#17121d"/>
    <path d="M181,33 L174,25 L178,34 Z" fill="#17121d"/>
    <!-- tucked hind leg -->
    <path d="M104,87 C107,97 117,97 119,88 L112,85 Z" fill="#17121d"/>
    <!-- near wing (in front, catches more light) -->
    <g id="drg-wing-near">
      <path d="M142,68 C134,46 124,22 110,7 L68,1
               Q 92,15 94,39
               Q 106,38 114,57
               Q 128,54 142,70 Z"
            fill="url(#drg-wing)"/>
      <path d="M110,7 L94,39 M110,7 L114,57" stroke="#141019" stroke-width="1.5" fill="none" opacity="0.85"/>
    </g>
    <!-- ember eye -->
    <circle cx="188" cy="36" r="1.8" fill="#ff8c3a"/>
  </svg>
  <span class="sky-label"></span>`;
  DRAGON.el = wrap;
  DRAGON.svg = wrap.querySelector('svg');
  DRAGON.label = wrap.querySelector('.sky-label');
  DRAGON.wingFar = wrap.querySelector('#drg-wing-far');
  DRAGON.wingNear = wrap.querySelector('#drg-wing-near');
  DRAGON.cue = document.createElement('div');
  DRAGON.cue.className = 'sky-cue';
  DRAGON.cue.hidden = true;
  document.body.appendChild(DRAGON.cue);
}
dragonBuild();

// where the dragon is right now — same answer on every phone
function dragonPos() {
  const th = (Date.now() / 1000 % DRAGON.periodS) / DRAGON.periodS * Math.PI * 2;
  return {
    lat: DRAGON.home.lat + (DRAGON.loopNsKm * Math.cos(th)) / 111.32,
    lng: DRAGON.home.lng + (DRAGON.loopEwKm * Math.sin(th)) /
         (111.32 * Math.cos(DRAGON.home.lat * Math.PI / 180)),
    alt: DRAGON.altM + Math.sin(th * 2) * DRAGON.bobM
  };
}

function renderDragon(W, H, horizonY) {
  if (!userPos) return;
  const pos = dragonPos();
  const distKm = haversineKm(userPos, pos);
  const angDeg = 2 * toDeg(Math.atan2(DRAGON.wingspanM / 2, distKm * 1000));
  const cue = DRAGON.cue;
  if (angDeg < DRAGON.minAngDeg) {
    // honestly too far for anyone to see — but say so instead of silently
    // showing nothing, which reads as "broken"
    DRAGON.el.style.display = 'none';
    if (distKm <= AR_MAX_KM) {
      cue.textContent = `🐉 Dragon ${distKm.toFixed(1)} km away — too far to see`;
      cue.style.left = '50%';
      cue.style.right = 'auto';
      cue.style.transform = 'translateX(-50%)';
      cue.hidden = false;
    } else {
      cue.hidden = true;
    }
    return;
  }
  const rel = angleDiff(headingSmooth, bearingDeg(userPos, pos));
  const name = `🐉 Dragon ${distKm.toFixed(1)} km`;
  if (Math.abs(rel) > AR_FOV / 2 + 12) { // in range but out of frame → point the way
    DRAGON.el.style.display = 'none';
    const right = rel > 0;
    cue.textContent = right ? `${name} →` : `← ${name}`;
    cue.style.left = right ? 'auto' : '10px';
    cue.style.right = right ? '10px' : 'auto';
    cue.style.transform = '';
    cue.hidden = false;
    return;
  }
  const pxPerDeg = W / AR_FOV;
  const S = Math.max(DRAGON.minPx, Math.min(DRAGON.maxPx, angDeg * pxPerDeg * DRAGON.boost));
  const x = W * (0.5 + rel / AR_FOV);
  const y = horizonY - toDeg(Math.atan2(pos.alt, distKm * 1000)) * (H / AR_VFOV);
  if (y < -S || y > H + S) { // vertically off frame → say which way to tilt
    DRAGON.el.style.display = 'none';
    cue.textContent = y < 0 ? `${name} — tilt up ↑` : `${name} — tilt down ↓`;
    cue.style.left = '50%';
    cue.style.right = 'auto';
    cue.style.transform = 'translateX(-50%)';
    cue.hidden = false;
    return;
  }
  cue.hidden = true;
  DRAGON.el.style.display = '';
  // face the direction it is moving across the screen
  if (DRAGON.lastX !== null) {
    const dx = x - DRAGON.lastX;
    if (Math.abs(dx) > 0.25) DRAGON.face = dx > 0 ? 1 : -1;
  }
  DRAGON.lastX = x;
  // wing beat + a light glide bob
  const t = performance.now() / 1000;
  const flap = Math.sin(t * Math.PI * 2 * 1.5) * 22;
  DRAGON.wingNear.style.transform = `rotate(${flap}deg)`;
  DRAGON.wingFar.style.transform = `rotate(${flap * 0.75}deg)`;
  const bob = Math.sin(t * 2.1) * S * 0.02;
  DRAGON.el.style.width = `${Math.round(S)}px`;
  DRAGON.svg.style.transform = `scaleX(${DRAGON.face})`;
  DRAGON.el.style.transform = `translate(${Math.round(x - S / 2)}px, ${Math.round(y - S / 2 + bob)}px)`;
  DRAGON.label.textContent = name;
}
