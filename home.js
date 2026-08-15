// ---- HOME SCREEN ------------------------------------------------------------
// The app's landing view: curated horizontal rows built from the same
// Supabase-backed data layer the map uses (loadItems in data.js — nothing is
// hardcoded here). Rows with no items stay hidden. Tapping a card opens the
// same detail card as the map popup; the map and AR view are one tap away.

let HOME_ITEMS = [];
let homePos = null; // { lat, lng } once (and if) the user allows location

const HOME_CITIES = [
  { name: 'Al Khobar', lat: 26.2870, lng: 50.1997 },
  { name: 'Dammam', lat: 26.4207, lng: 50.0888 },
  { name: 'Dhahran', lat: 26.2361, lng: 50.1573 }
];

// ---- small local helpers (map/AR code stays untouched) ---------------------

function homeDistKm(a, b) {
  const toRad = d => d * Math.PI / 180, R = 6371;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Same date rules as the map: Saudi weekend is Friday & Saturday, and an
// event matches a window when its start–end range overlaps it.
function homeParseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
const HOME_TODAY = new Date();
HOME_TODAY.setHours(0, 0, 0, 0);
const homeDow = HOME_TODAY.getDay(); // Fri = 5, Sat = 6
const HOME_FRI = new Date(HOME_TODAY);
HOME_FRI.setDate(HOME_TODAY.getDate() + (homeDow === 6 ? -1 : (5 - homeDow + 7) % 7));
const HOME_SAT = new Date(HOME_FRI);
HOME_SAT.setDate(HOME_FRI.getDate() + 1);

function homeRuns(ev, from, to) {
  if (!ev.start) return false;
  return homeParseDay(ev.start) <= to && homeParseDay(ev.end || ev.start) >= from;
}

// ---- cards ------------------------------------------------------------------

function homeCard(ev) {
  const el = document.createElement('button');
  el.className = 'home-card';
  const when = ev.type === 'place' ? 'Open anytime' : (ev.time || '');
  el.innerHTML = `
    <img class="home-card-poster" src="${posterSrc(ev)}" alt="" loading="lazy"
         onerror="this.style.visibility='hidden'">
    <span class="home-card-name">${itemIcon(ev)} ${ev.title}</span>
    <span class="home-card-when">${when}</span>
    <span class="home-card-dist" data-lat="${ev.lat}" data-lng="${ev.lng}"></span>`;
  el.addEventListener('click', () => openHomeCard(ev));
  return el;
}

function fillRow(rowId, scrollId, list) {
  const row = document.getElementById(rowId);
  const scroll = document.getElementById(scrollId);
  scroll.textContent = '';
  list.forEach(ev => scroll.appendChild(homeCard(ev)));
  row.hidden = list.length === 0; // no empty states — the row just isn't there
}

function refreshDistances() {
  if (!homePos) return;
  document.querySelectorAll('.home-card-dist').forEach(el => {
    const km = homeDistKm(homePos, { lat: Number(el.dataset.lat), lng: Number(el.dataset.lng) });
    el.textContent = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  });
}

// ---- detail card (same content as the map popup) ---------------------------

const homeCardEl = document.getElementById('home-card');
const homeCardBody = document.getElementById('home-card-body');

function openHomeCard(ev) {
  const cta = ev.type === 'place' ? 'Explore' : 'Get tickets';
  homeCardBody.innerHTML = `
    <img class="poster" src="${posterSrc(ev)}" alt="${ev.title}" onerror="this.remove()">
    <h3>${itemIcon(ev)} ${ev.title}</h3>
    <div class="meta">${ev.venue} &middot; ${ev.time}</div>
    <a class="buy" href="${trackedUrl(ev.ticketUrl)}" data-item="${ev.id}" target="_blank" rel="noopener">${cta}</a>`;
  homeCardEl.hidden = false;
}
document.getElementById('home-card-close').addEventListener('click', () => { homeCardEl.hidden = true; });
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-item]');
  if (link) logClick(Number(link.dataset.item));
});

// ---- search -----------------------------------------------------------------

const searchEl = document.getElementById('home-search');
const curatedRows = ['row-tonight', 'row-weekend', 'row-places'];

function renderRows() {
  const tonight = HOME_ITEMS.filter(ev => ev.type === 'event' && homeRuns(ev, HOME_TODAY, HOME_TODAY));
  const weekend = HOME_ITEMS.filter(ev => ev.type === 'event' &&
    homeRuns(ev, HOME_FRI, HOME_SAT) && !tonight.includes(ev));
  const places = HOME_ITEMS.filter(ev => ev.type === 'place');
  fillRow('row-tonight', 'scroll-tonight', tonight);
  fillRow('row-weekend', 'scroll-weekend', weekend);
  fillRow('row-places', 'scroll-places', places);
  refreshDistances();
}

searchEl.addEventListener('input', () => {
  const q = searchEl.value.trim().toLowerCase();
  const resultsRow = document.getElementById('row-results');
  const emptyNote = document.getElementById('results-empty');
  if (!q) {
    resultsRow.hidden = true;
    curatedRows.forEach(id => {
      const row = document.getElementById(id);
      row.hidden = row.querySelector('.home-scroll').children.length === 0;
    });
    return;
  }
  const hits = HOME_ITEMS.filter(ev =>
    `${ev.title} ${ev.venue} ${ev.category}`.toLowerCase().includes(q));
  const scroll = document.getElementById('scroll-results');
  scroll.textContent = '';
  hits.forEach(ev => scroll.appendChild(homeCard(ev)));
  emptyNote.hidden = hits.length > 0;
  resultsRow.hidden = false;
  curatedRows.forEach(id => { document.getElementById(id).hidden = true; });
  refreshDistances();
});

// ---- city label + distances (only if the user allows location) -------------

navigator.geolocation && navigator.geolocation.getCurrentPosition(pos => {
  homePos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  let best = null, bestKm = Infinity;
  for (const c of HOME_CITIES) {
    const km = homeDistKm(homePos, c);
    if (km < bestKm) { bestKm = km; best = c; }
  }
  document.getElementById('home-city').textContent =
    bestKm <= 40 ? `📍 ${best.name}` : '📍 Eastern Province';
  refreshDistances();
}, () => {}, { timeout: 8000, maximumAge: 300000 });

// ---- boot -------------------------------------------------------------------

loadItems().then(list => {
  HOME_ITEMS = list;
  renderRows();
});
