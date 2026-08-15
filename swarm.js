// ---- PERSONAL DRONE SWARM ---------------------------------------------------
// A ring of glowing drones that circles the VIEWER's own position — wherever
// you are, it is around you, so there is always something to see in AR. The
// formation is alive: the ring slowly orbits, breathes in and out, and rolls
// a wave through its altitude. Unlike the dragon (a shared, geo-anchored
// scene), every viewer gets their own swarm. Uses the sensor state and
// geometry helpers defined in ar.js; everything here runs at render time.

const SWARM = {
  count: 26,     // drones in the ring
  orbitM: 240,   // mean orbit radius around the viewer, metres
  breatheM: 60,  // how far the ring breathes in/out
  altM: 85,      // mean altitude, metres
  waveM: 30,     // altitude wave amplitude
  el: null, drones: [], announced: false
};

function buildSwarm() {
  SWARM.el = document.createElement('div');
  SWARM.el.className = 'swarm-layer';
  for (let i = 0; i < SWARM.count; i++) {
    const d = document.createElement('span');
    d.className = 'swarm-drone';
    const c = i % 7 === 0 ? '#ff5ad2' : (i % 2 ? '#5ff2ff' : '#eafcff');
    d.style.background = c;
    d.style.boxShadow = `0 0 10px 3px ${c}`;
    d.style.animationDelay = `${(i * 0.23) % 1.8}s`;
    SWARM.el.appendChild(d);
    SWARM.drones.push(d);
  }
}
buildSwarm();

function renderSwarm(W, H, horizonY) {
  const t = performance.now() / 1000;
  for (let i = 0; i < SWARM.count; i++) {
    const el = SWARM.drones[i];
    const ph = i / SWARM.count * Math.PI * 2;
    const ang = ph + t * 0.14;                                  // slow orbit
    const distM = SWARM.orbitM + SWARM.breatheM * Math.sin(ph * 2 + t * 0.5);
    const altM = SWARM.altM + SWARM.waveM * Math.sin(ph * 3 + t * 0.9);
    const rel = angleDiff(headingSmooth, ((toDeg(ang) % 360) + 360) % 360);
    if (Math.abs(rel) > AR_FOV / 2 + 6) { el.style.display = 'none'; continue; }
    const y = horizonY - toDeg(Math.atan2(altM, distM)) * (H / AR_VFOV);
    if (y < -30 || y > H + 30) { el.style.display = 'none'; continue; }
    el.style.display = '';
    const size = Math.max(5, Math.min(16, 2600 / distM)); // nearer arc = bigger
    const x = W * (0.5 + rel / AR_FOV);
    el.style.width = el.style.height = `${size.toFixed(1)}px`;
    el.style.transform = `translate(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px)`;
  }
  // one-time nudge so nobody misses it (skipped if another hint is showing)
  if (!SWARM.announced) {
    SWARM.announced = true;
    if (hintEl.hidden) {
      showHint('🛸 A drone swarm is circling you — look around.');
      setTimeout(() => {
        if (hintEl.textContent.startsWith('🛸')) hintEl.hidden = true;
      }, 7000);
    }
  }
}
