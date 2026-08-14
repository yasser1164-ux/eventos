// ---- PLACE SUBMISSION (stub) ----------------------------------------------
// Users never type coordinates: they enter a name/address, we geocode it via
// the free OpenStreetMap Nominatim API and show a draggable pin so they can
// nudge the exact spot. "Generate SQL" produces the INSERT to paste into the
// Supabase SQL editor — writes require an admin, the public key is read-only.
// (When real user submissions are wanted, swap the SQL step for a Supabase
// insert into a moderated "suggestions" table.)

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
// Eastern Province bounding box (left,top,right,bottom) keeps matches local.
const VIEWBOX = '49.3,27.2,50.8,25.5';

const statusEl = document.getElementById('geo-status');
const mapEl = document.getElementById('preview-map');
const coordsEl = document.getElementById('coords');
const sqlBtn = document.getElementById('sql-btn');
const sqlOut = document.getElementById('sql-out');

let previewMap = null;
let pin = null;
let picked = null; // { lat, lng }

function showPin(lat, lng) {
  mapEl.style.display = 'block';
  if (!previewMap) {
    previewMap = L.map('preview-map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(previewMap);
    pin = L.marker([lat, lng], { draggable: true }).addTo(previewMap);
    pin.on('dragend', () => {
      const p = pin.getLatLng();
      setPicked(p.lat, p.lng, 'Pin moved — using your adjusted spot.');
    });
  } else {
    previewMap.invalidateSize();
    previewMap.setView([lat, lng], 15);
    pin.setLatLng([lat, lng]);
  }
  setPicked(lat, lng, '');
}

function setPicked(lat, lng, note) {
  picked = { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
  coordsEl.textContent = `Pin: ${picked.lat}, ${picked.lng}` + (note ? ` — ${note}` : ' (drag the pin to fine-tune)');
  sqlBtn.style.display = 'inline-block';
}

document.getElementById('geocode-btn').addEventListener('click', async () => {
  const title = document.getElementById('f-title').value.trim();
  const venue = document.getElementById('f-venue').value.trim();
  if (!title && !venue) {
    statusEl.textContent = 'Enter a place name or address first.';
    statusEl.className = 'geo-status err';
    return;
  }
  statusEl.textContent = 'Searching…';
  statusEl.className = 'geo-status';
  const query = [title, venue, 'Saudi Arabia'].filter(Boolean).join(', ');
  try {
    let hit = await geocode(query);
    if (!hit && venue) hit = await geocode(`${title}, Saudi Arabia`); // simpler fallback
    if (!hit) {
      statusEl.textContent = 'Not found — try a simpler name, or a nearby street/landmark.';
      statusEl.className = 'geo-status err';
      return;
    }
    statusEl.textContent = `Found: ${hit.display_name}`;
    statusEl.className = 'geo-status ok';
    showPin(Number(hit.lat), Number(hit.lon));
  } catch (err) {
    statusEl.textContent = 'Geocoding failed — check your connection and try again.';
    statusEl.className = 'geo-status err';
  }
});

async function geocode(q) {
  const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=sa&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url); // the browser's Referer header identifies the app
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const results = await res.json();
  return results[0] || null;
}

sqlBtn.addEventListener('click', () => {
  if (!picked) return;
  const esc = s => String(s).replace(/'/g, "''");
  const title = document.getElementById('f-title').value.trim() || 'New place';
  const venue = document.getElementById('f-venue').value.trim() || 'Eastern Province';
  const category = document.getElementById('f-category').value.trim() || 'Place';
  const emoji = document.getElementById('f-emoji').value.trim() || '📍';
  const url = document.getElementById('f-url').value.trim() || 'https://webook.com';
  sqlOut.value =
`insert into public.items
  (id, title, type, category, emoji, venue, time_label, status, lat, lng, heat, ticket_url, poster_ref)
values
  ((select coalesce(max(id), 0) + 1 from public.items),
   '${esc(title)}', 'place', '${esc(category)}', '${esc(emoji)}', '${esc(venue)}',
   'Open daily', 'open', ${picked.lat}, ${picked.lng}, 50, '${esc(url)}', 'template:place');`;
  sqlOut.style.display = 'block';
  sqlOut.focus();
  sqlOut.select();
});
