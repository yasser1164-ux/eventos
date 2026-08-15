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

let items = [];
let userPos = null;      // { lat, lng }
let heading = null;      // degrees clockwise from true north
let headingSmooth = null;
let markers = [];        // { ev, el, bearing, distKm } — bearing/dist vs userPos
let rafId = null;

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

function onOrientation(e) {
  if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
    heading = e.webkitCompassHeading;                 // iOS: already from north
  } else if (e.alpha !== null && (e.absolute || e.type === 'deviceorientationabsolute')) {
    heading = (360 - e.alpha) % 360;                  // Android absolute
  }
}

async function start() {
  startOverlay.hidden = true;
  failOverlay.hidden = true;

  // 1. Camera
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

  // 2. Compass — on iOS this must be requested inside the same tap
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const state = await DeviceOrientationEvent.requestPermission();
      if (state !== 'granted') throw new Error('denied');
    }
  } catch {
    fail('Compass not available',
      'AR needs the compass to know which way you are facing. Allow motion & orientation access and try again.');
    return;
  }
  window.addEventListener('deviceorientationabsolute', onOrientation);
  window.addEventListener('deviceorientation', onOrientation);

  // 3. Location
  navigator.geolocation.getCurrentPosition(
    pos => {
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
      // If no compass reading arrives, say so rather than showing a blank view
      setTimeout(() => {
        if (heading === null) {
          fail('No compass signal',
            'Your device did not report a compass heading. AR needs a phone with a magnetometer — the map view has everything too.');
        }
      }, 4000);
    },
    () => fail('Location not available',
      'AR needs your location to know where things are around you. Allow location access for this site and try again.'),
    { enableHighAccuracy: true, timeout: 15000 }
  );
}

document.getElementById('ar-start-btn').addEventListener('click', start);
document.getElementById('ar-retry-btn').addEventListener('click', start);

loadItems().then(list => { items = list; });
