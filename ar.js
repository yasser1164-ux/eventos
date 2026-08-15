// ---- AR VIEW (experimental) -----------------------------------------------
// Camera passthrough + compass: each nearby item is projected onto the screen
// at its real-world bearing relative to where the phone is pointing. Marker
// size and glow reflect the item's heat and its distance. Tapping a marker
// opens the same detail card as the map popup. Standalone screen — the map
// code is untouched.

const AR_FOV = 70;      // assumed horizontal camera field of view, degrees
const AR_MAX_KM = 45;   // how far away items may be and still appear

const video = document.getElementById('ar-video');
const layer = document.getElementById('ar-layer');
const compassEl = document.getElementById('ar-compass');
const startOverlay = document.getElementById('ar-start');
const failOverlay = document.getElementById('ar-fail');
const failTitle = document.getElementById('ar-fail-title');
const failText = document.getElementById('ar-fail-text');
const card = document.getElementById('ar-card');
const cardBody = document.getElementById('ar-card-body');
const hintEl = document.getElementById('ar-hint');

let items = [];
let userPos = null;      // { lat, lng }
let heading = null;      // degrees clockwise from true north
let headingSmooth = null;
let markers = [];        // { ev, el, bearing, distKm } — bearing/dist vs userPos
let rafId = null;
let manualMode = false;  // no compass: the user drags to look around
let userDragged = false;

// ---- geometry -------------------------------------------------------------

const toRad = d => d * Math.PI / 180;
const toDeg = r => r * 180 / Math.PI;

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function bearingDeg(from, to) {
  const y = Math.sin(toRad(to.lng - from.lng)) * Math.cos(toRad(to.lat));
  const x = Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
            Math.sin(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.cos(toRad(to.lng - from.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// smallest signed angle a→b, in (-180, 180]
function angleDiff(a, b) {
  return ((b - a + 540) % 360) - 180;
}

// ---- markers --------------------------------------------------------------

function buildMarkers() {
  layer.textContent = '';
  markers = items
    .map(ev => ({ ev, bearing: bearingDeg(userPos, ev), distKm: haversineKm(userPos, ev) }))
    .filter(m => m.distKm <= AR_MAX_KM)
    .sort((a, b) => b.distKm - a.distKm); // draw far ones first, near on top
  for (const m of markers) {
    const el = document.createElement('button');
    el.className = 'ar-marker';
    const distLabel = m.distKm < 1 ? `${Math.round(m.distKm * 1000)} m` : `${m.distKm.toFixed(1)} km`;
    el.innerHTML = `<span class="ar-marker-dot"><span>${m.ev.emoji}</span></span>
      <span class="ar-marker-label">${m.ev.title.length > 22 ? m.ev.title.slice(0, 21) + '…' : m.ev.title}<br>${distLabel}</span>`;
    el.addEventListener('click', () => openCard(m.ev));
    layer.appendChild(el);
    m.el = el;

    // size & glow from heat + proximity
    const proximity = 1 - Math.min(m.distKm / AR_MAX_KM, 1); // 0 far … 1 near
    const size = Math.round(30 + m.ev.heat * 0.25 + proximity * 26);
    const glow = Math.round(8 + m.ev.heat * 0.3 + proximity * 14);
    const dot = el.querySelector('.ar-marker-dot');
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.fontSize = `${Math.round(size * 0.52)}px`;
    dot.style.boxShadow = `0 0 ${glow}px ${Math.round(glow / 2)}px rgba(255,90,95,${0.35 + m.ev.heat / 250})`;
    el.style.opacity = String(0.65 + proximity * 0.35);
    // stagger vertically: near items sit lower and bigger, tiny per-item
    // offset avoids exact stacking for same-direction items
    m.yFrac = 0.62 - 0.3 * (m.distKm / AR_MAX_KM) + (((m.ev.id * 37) % 5) - 2) * 0.015;
  }
  // without a compass, start the view aimed at the nearest item so the user
  // sees something immediately (unless they've already dragged elsewhere)
  if (manualMode && !userDragged && markers.length) {
    heading = markers[markers.length - 1].bearing;
    headingSmooth = heading;
  }
}

function renderFrame() {
  rafId = requestAnimationFrame(renderFrame);
  if (heading === null || !markers.length) return;
  // low-pass filter with wrap-around so the view doesn't jitter
  headingSmooth = headingSmooth === null
    ? heading
    : (headingSmooth + angleDiff(headingSmooth, heading) * 0.15 + 360) % 360;
  compassEl.textContent = `${Math.round(headingSmooth)}°`;

  const W = window.innerWidth, H = window.innerHeight;
  for (const m of markers) {
    const rel = angleDiff(headingSmooth, m.bearing); // - left … + right
    if (Math.abs(rel) > AR_FOV / 2 + 8) {
      m.el.style.display = 'none';
      continue;
    }
    m.el.style.display = '';
    const x = W * (0.5 + rel / AR_FOV);
    const y = H * m.yFrac;
    m.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -50%)`;
  }
}

// ---- detail card (same content as the map popup) --------------------------

function openCard(ev) {
  const poster = posterSrc(ev);
  const cta = ev.type === 'place' ? 'Explore' : 'Get tickets';
  cardBody.innerHTML = `
    <img class="poster" src="${poster}" alt="${ev.title}" onerror="this.remove()">
    <h3>${ev.emoji} ${ev.title}</h3>
    <div class="meta">${ev.venue} &middot; ${ev.time}</div>
    <a class="buy" href="${trackedUrl(ev.ticketUrl)}" data-item="${ev.id}" target="_blank" rel="noopener">${cta}</a>`;
  card.hidden = false;
}
document.getElementById('ar-card-close').addEventListener('click', () => { card.hidden = true; });
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-item]');
  if (link) logClick(Number(link.dataset.item));
});

// ---- permissions & startup ------------------------------------------------

function fail(title, text) {
  startOverlay.hidden = true;
  failTitle.textContent = title;
  failText.textContent = text;
  failOverlay.hidden = false;
}

function showHint(text) {
  hintEl.textContent = text;
  hintEl.hidden = false;
}
hintEl.addEventListener('click', () => { hintEl.hidden = true; });

function onOrientation(e) {
  if (manualMode) return; // the user is steering by hand — don't fight them
  if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
    heading = e.webkitCompassHeading;                 // iOS: already from north
  } else if (e.alpha !== null && (e.absolute || e.type === 'deviceorientationabsolute')) {
    heading = (360 - e.alpha) % 360;                  // Android absolute
  }
}

// ---- manual look-around: AR without a compass -----------------------------
// Grab-the-world drag: pulling left turns the view right, one screen width
// sweeps one field of view.

function enterManualMode(reason) {
  manualMode = true;
  if (markers.length && !userDragged) {
    heading = markers[markers.length - 1].bearing; // nearest item
  } else if (heading === null) {
    heading = 0;
  }
  headingSmooth = heading;
  showHint(`${reason} You can still use AR — drag the screen to look around.`);
}

let dragStartX = null, dragStartHeading = 0, dragMovedPx = 0, suppressClickUntil = 0;
layer.addEventListener('pointerdown', e => {
  if (!manualMode) return;
  dragStartX = e.clientX;
  dragStartHeading = heading ?? 0;
  dragMovedPx = 0;
});
layer.addEventListener('pointermove', e => {
  if (!manualMode || dragStartX === null) return;
  const dx = e.clientX - dragStartX;
  dragMovedPx = Math.max(dragMovedPx, Math.abs(dx));
  heading = (dragStartHeading - dx * (AR_FOV / window.innerWidth) + 360) % 360;
  headingSmooth = heading; // no smoothing lag while the finger steers directly
  if (dragMovedPx > 8) userDragged = true;
});
const endDrag = e => {
  // a real drag is followed (within ms) by a click on whatever is under the
  // finger — swallow that one so it doesn't open a marker card
  if (e.type === 'pointerup' && dragMovedPx > 8) suppressClickUntil = performance.now() + 300;
  dragStartX = null;
  dragMovedPx = 0;
};
layer.addEventListener('pointerup', endDrag);
layer.addEventListener('pointercancel', endDrag);
layer.addEventListener('click', e => {
  if (performance.now() < suppressClickUntil) {
    suppressClickUntil = 0;
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

async function start() {
  startOverlay.hidden = true;
  failOverlay.hidden = true;
  hintEl.hidden = true;
  manualMode = false;

  // 1. Motion/compass permission — iOS only shows this prompt while the tap's
  // "user activation" is alive, and awaiting the camera first consumes it. So
  // fire the request synchronously here, before ANY await, and read the
  // answer after the camera is up.
  let motionPromise = null;
  let motionAskedAt = 0;
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    motionAskedAt = performance.now();
    try {
      motionPromise = DeviceOrientationEvent.requestPermission();
    } catch (err) {
      motionPromise = Promise.reject(err);
    }
    motionPromise.catch(() => {}); // handled later — avoid an unhandled rejection
  }

  // 2. Camera
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, audio: false
    });
    video.srcObject = stream;
  } catch {
    fail('Camera not available',
      'AR needs the camera as its background. Allow camera access for this site in your browser settings and try again.');
    return;
  }

  // 3. Compass — read the motion answer; without it, fall back to drag-to-look
  let motionState = 'granted';
  let motionThrew = false;
  if (motionPromise) {
    try {
      motionState = await motionPromise;
    } catch {
      motionThrew = true;
    }
  }
  if (motionThrew || motionState !== 'granted') {
    // If the promise rejected, or settled too fast for a human to have seen a
    // prompt, Safari never asked — that's the global "Motion & Orientation
    // Access" toggle being off (Settings → Safari), not a tap on "Don't Allow".
    const promptWasShown = !motionThrew && (performance.now() - motionAskedAt) > 350;
    enterManualMode(promptWasShown
      ? 'Motion access was declined, so the compass is off.'
      : 'Safari never showed the motion prompt — "Motion & Orientation Access" is probably off in Settings → Safari.');
  } else {
    window.addEventListener('deviceorientationabsolute', onOrientation);
    window.addEventListener('deviceorientation', onOrientation);
  }

  // 4. Location — a fresh GPS fix can take ages indoors or in a car, so:
  // accept a recent cached position (AR works at km scale — a couple of
  // minutes of drift doesn't matter), and on timeout/no-fix retry once,
  // coarse and patient, before giving up. Only a real refusal fails fast.
  const onFix = pos => {
    if (locatingHint) { hintEl.hidden = true; locatingHint = false; }
    userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    buildMarkers();
    if (!markers.length) {
      fail('Nothing nearby', `No events or places within ${AR_MAX_KM} km of you. The AR view shines in the Khobar–Dammam–Dhahran area.`);
      return;
    }
    navigator.geolocation.watchPosition(p => {
      userPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      buildMarkers();
    }, () => {}, { enableHighAccuracy: true, maximumAge: 10000 });
    if (!rafId) renderFrame();
    // Permission granted but no reading ever arrives (no magnetometer,
    // desktop browser, …) — switch to drag-to-look instead of failing.
    setTimeout(() => {
      if (heading === null && !manualMode) {
        enterManualMode('Your device is not reporting a compass heading.');
      }
    }, 4000);
  };
  const locFail = err => {
    if (locatingHint) { hintEl.hidden = true; locatingHint = false; }
    if (err && err.code === 1) {
      fail('Location access declined',
        'AR needs your location to know where things are around you. Tap “aA” in the address bar → Website Settings → Location → Allow, and check Settings → Privacy & Security → Location Services → Safari Websites is “While Using”. Then try again.');
    } else {
      fail('No GPS fix',
        'Location access is fine, but your phone couldn’t get a position fix. Near a window, outdoors, or after a few seconds in the open it usually works — tap Try again.');
    }
  };
  let locatingHint = false;
  compassEl.textContent = 'GPS…';
  navigator.geolocation.getCurrentPosition(onFix, err => {
    if (err && err.code === 1) { locFail(err); return; }
    // no fix yet (timeout / unavailable) — one more try, coarse and patient
    if (hintEl.hidden) {
      showHint('Still getting a GPS fix — this can take a moment indoors or in a car.');
      locatingHint = true;
    }
    navigator.geolocation.getCurrentPosition(onFix, locFail,
      { enableHighAccuracy: false, timeout: 25000, maximumAge: 600000 });
  }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 });
}

document.getElementById('ar-start-btn').addEventListener('click', start);
document.getElementById('ar-retry-btn').addEventListener('click', start);

loadItems().then(list => { items = list; });
