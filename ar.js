// ---- AR VIEW (experimental) -----------------------------------------------
// Camera passthrough + compass: each nearby item is projected onto the screen
// at its real-world bearing relative to where the phone is pointing. Marker
// size and glow reflect the item's heat and its distance. Tapping a marker
// opens the same detail card as the map popup. Standalone screen — the map
// code is untouched.

const AR_FOV = 70;      // assumed horizontal camera field of view, degrees
const AR_VFOV = 110;    // assumed vertical field of view (portrait), degrees
const AR_MAX_KM = 25;   // items beyond this never render in AR (map shows all)

// Browser flavour — behaviour is the same everywhere, but the settings path
// the user must visit when a permission is stuck differs per browser.
const UA = navigator.userAgent;
const IS_CRIOS = /CriOS/.test(UA);                      // Chrome on iPhone/iPad
const IS_IOS = /iPhone|iPad|iPod/.test(UA) && !IS_CRIOS; // Safari-ish on iOS
const IS_ANDROID = /Android/.test(UA);

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
let pitch = null;        // device tilt (beta), degrees — 90 = held upright
let pitchSmooth = null;

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
// Midnight-Club style: each item is a vertical beam of light rising from its
// real-world position on the skyline into the sky. Near/hot items get wide,
// vivid beams; far ones are thin and hazy. The beam base fades out so
// foreground buildings appear to swallow it, and only the upper glow shows
// over the skyline — like the game.

function buildMarkers() {
  layer.textContent = '';
  layer.appendChild(DRAGON.el); // survives the wipe
  markers = items
    .map(ev => ({ ev, bearing: bearingDeg(userPos, ev), distKm: haversineKm(userPos, ev) }))
    .filter(m => m.distKm <= AR_MAX_KM)
    .sort((a, b) => b.distKm - a.distKm); // draw far ones first, near on top
  const H = window.innerHeight;
  // Depth: presence falls off like real perspective (~1/distance), and is
  // NORMALISED TO THE NEAREST ITEM — whatever is closest to the viewer
  // renders at full strength, everything else fades relative to it. As the
  // viewer moves (watchPosition rebuilds), the layering re-ranks around them.
  const D0 = 1.2; // km — how quickly presence decays with distance
  const weights = markers.map(m => 1 / (m.distKm + D0));
  const wMax = Math.max(...weights, 1e-9);
  markers.forEach((m, i) => {
    const el = document.createElement('button');
    el.className = 'ar-marker';
    const depth = Math.pow(weights[i] / wMax, 0.8); // 1 nearest … →0 far
    const heat = m.ev.heat || 0;
    const distLabel = m.distKm < 1 ? `${Math.round(m.distKm * 1000)} m` : `${m.distKm.toFixed(1)} km`;

    // beam colours: places = cool teal→violet, events = hot red→gold
    const [c0, c1] = m.ev.type === 'place'
      ? ['rgba(64,224,255,', 'rgba(108,92,231,']
      : ['rgba(255,90,95,', 'rgba(255,179,71,'];
    const alpha = 0.5 + heat / 100 * 0.35;

    const beam = document.createElement('span');
    beam.className = 'ar-beam';
    const beamW = Math.round(6 + depth * 18 + heat * 0.06);
    const beamH = Math.round(H * 0.9 * (0.25 + depth * 0.75));
    beam.style.width = `${beamW}px`;
    beam.style.height = `${beamH}px`;
    // base fades in from nothing (foreground cover), brightest low, thins out
    // into the sky
    beam.style.background = `linear-gradient(to top, ${c0}0) 0%, ${c0}${alpha.toFixed(2)}) 9%, ${c0}${(alpha * 0.85).toFixed(2)}) 32%, ${c1}${(alpha * 0.55).toFixed(2)}) 62%, rgba(0,0,0,0) 100%)`;
    beam.style.boxShadow = `0 0 ${Math.round(10 + heat * 0.2 + depth * 14)}px ${c0}${(0.28 + heat / 300).toFixed(2)})`;
    el.appendChild(beam);

    const dot = document.createElement('span');
    dot.className = 'ar-marker-dot';
    dot.innerHTML = `<span>${itemIcon(m.ev)}</span>`;
    const size = Math.round(16 + depth * 22);
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.fontSize = `${Math.round(size * 0.55)}px`;
    el.appendChild(dot);

    const label = document.createElement('span');
    label.className = 'ar-marker-label';
    label.innerHTML = `${m.ev.title.length > 22 ? m.ev.title.slice(0, 21) + '…' : m.ev.title}<br>${distLabel}`;
    el.appendChild(label);

    // atmospheric fade: far beams become faint ghosts, not slightly-dimmer twins
    el.style.opacity = (0.18 + depth * 0.82).toFixed(2);
    el.addEventListener('click', () => openCard(m.ev));
    layer.appendChild(el);
    m.el = el;
    // how far below the horizon the beam base sits: near items drop lower
    // (perspective), tiny per-item jitter avoids exact stacking. Kept small —
    // km-distant items really sit at the horizon, and a big drop would keep
    // them on screen when the phone points at the ground.
    m.dropFrac = 0.03 + Math.pow(depth, 1.2) * 0.10 + (((m.ev.id * 37) % 5) - 2) * 0.006;
  });
  // labels only on the three nearest beams — the rest stay clean columns
  markers.forEach((m, i) => {
    if (i < markers.length - 3) m.el.classList.add('ar-far');
  });
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
  // horizon follows the phone's tilt: pointing the camera up slides the
  // skyline down, pointing at the ground pushes it (and everything hung on
  // it) right off the top of the screen — deliberately NOT clamped to stay
  // visible, that's what makes it feel anchored to the world
  let horizonY = H * 0.42;
  if (pitch !== null) {
    pitchSmooth = pitchSmooth === null ? pitch : pitchSmooth + (pitch - pitchSmooth) * 0.15;
    horizonY = Math.min(H * 2.5, Math.max(-H * 1.5,
      H * 0.42 + (pitchSmooth - 90) * (H / AR_VFOV)));
  }
  for (const m of markers) {
    const rel = angleDiff(headingSmooth, m.bearing); // - left … + right
    if (Math.abs(rel) > AR_FOV / 2 + 8) {
      m.el.style.display = 'none';
      continue;
    }
    m.el.style.display = '';
    const x = W * (0.5 + rel / AR_FOV);
    const y = horizonY + m.dropFrac * H; // beam base (bottom of the element)
    m.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -100%)`;
  }
  renderDragon(W, H, horizonY);
}

// ---- detail card (same content as the map popup) --------------------------

function openCard(ev) {
  const poster = posterSrc(ev);
  const cta = ev.type === 'place' ? 'Explore' : 'Get tickets';
  cardBody.innerHTML = `
    <img class="poster" src="${poster}" alt="${ev.title}" onerror="this.remove()">
    <h3>${itemIcon(ev)} ${ev.title}</h3>
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

let relativeMode = false; // sensor turns with the phone but has no north
let relOffset = 0;        // user-dragged correction added to the relative sensor
let lastRelAlpha = null;

function onOrientation(e) {
  if (typeof e.beta === 'number' && !isNaN(e.beta)) pitch = e.beta;
  if (manualMode) return; // the user is steering by hand — don't fight them
  if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
    heading = e.webkitCompassHeading;                 // iOS: already from north
    relativeMode = false;
  } else if (e.alpha !== null && (e.absolute || e.type === 'deviceorientationabsolute')) {
    heading = (360 - e.alpha) % 360;                  // Android absolute
    relativeMode = false;
  } else if (e.alpha !== null) {
    // non-absolute reading (Chrome without a compass reference): remember it —
    // if nothing better arrives we'll use it relatively, aligned by hand
    lastRelAlpha = e.alpha;
    if (relativeMode) heading = (360 - e.alpha + relOffset) % 360;
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

let dragStartX = null, dragStartHeading = 0, dragStartOffset = 0, dragMovedPx = 0, suppressClickUntil = 0;
layer.addEventListener('pointerdown', e => {
  if (!manualMode && !relativeMode) return;
  dragStartX = e.clientX;
  dragStartHeading = heading ?? 0;
  dragStartOffset = relOffset;
  dragMovedPx = 0;
});
layer.addEventListener('pointermove', e => {
  if ((!manualMode && !relativeMode) || dragStartX === null) return;
  const dx = e.clientX - dragStartX;
  dragMovedPx = Math.max(dragMovedPx, Math.abs(dx));
  const dDeg = -dx * (AR_FOV / window.innerWidth);
  if (relativeMode) {
    // dragging re-aims north: the sensor keeps turning the view afterwards
    relOffset = (dragStartOffset + dDeg + 360) % 360;
    heading = lastRelAlpha !== null
      ? (360 - lastRelAlpha + relOffset) % 360
      : (dragStartHeading + dDeg + 360) % 360;
  } else {
    heading = (dragStartHeading + dDeg + 360) % 360;
  }
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
  relativeMode = false;
  lastRelAlpha = null;

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
    fail('Camera not available', 'AR needs the camera as its background. ' + (
      IS_CRIOS ? 'Open the iPhone Settings app → Chrome → allow Camera, then reload this page.'
      : IS_IOS ? 'Tap “aA” in the address bar → Website Settings → Camera → Allow, and check Settings → Safari → Camera.'
      : IS_ANDROID ? 'Tap the lock icon in the address bar → Permissions → Camera → Allow, then try again.'
      : 'Allow camera access for this site in your browser settings and try again.'));
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
      : IS_CRIOS
        ? 'Chrome never showed the motion prompt — open the iPhone Settings app → Chrome and turn on “Motion & Fitness”, then reload.'
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
    // Permission granted but no north-referenced reading ever arrives —
    // use the relative sensor if there is one, else switch to drag-to-look.
    setTimeout(() => {
      if (heading !== null || manualMode) return;
      if (lastRelAlpha !== null) {
        // Sensor works but has no compass reference (common in Chrome and
        // in-app browsers): drive the view with it relatively, starting
        // aimed at the nearest item; a drag rotates the world to true it up.
        relativeMode = true;
        const aim = markers.length ? markers[markers.length - 1].bearing : 0;
        relOffset = (aim - (360 - lastRelAlpha) + 720) % 360;
        heading = aim;
        headingSmooth = aim;
        showHint('This browser has no true compass — the view turns with your phone, but north is approximate. Drag the screen to line it up with what you see.');
      } else {
        enterManualMode('Your device is not reporting a compass heading.' +
          (IS_ANDROID ? ' In Chrome, check ⋮ → Settings → Site settings → Motion sensors.' : ''));
      }
    }, 4000);
  };
  const locFail = err => {
    if (locatingHint) { hintEl.hidden = true; locatingHint = false; }
    if (err && err.code === 1) {
      fail('Location access declined', 'AR needs your location to know where things are around you. ' + (
        IS_CRIOS ? 'Open the iPhone Settings app → Chrome → Location and choose “While Using the App”, then try again.'
        : IS_IOS ? 'Tap “aA” in the address bar → Website Settings → Location → Allow, and check Settings → Privacy & Security → Location Services → Safari Websites is “While Using”. Then try again.'
        : IS_ANDROID ? 'Tap the lock icon in the address bar → Permissions → Location → Allow, then try again.'
        : 'Allow location access for this site in your browser settings and try again.'));
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
