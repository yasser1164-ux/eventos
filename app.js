// ---- MAP -----------------------------------------------------------------
const map = L.map('map', { zoomControl: true }).setView([26.2854, 50.2083], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  maxZoom: 19
}).addTo(map);

const markers = {};
const allMarkers = [];
const entries = []; // { ev, marker, circle, card } — one per event, for filtering

EVENTS.forEach(ev => {
  // Heat glow — bigger + brighter for hotter events
  const circle = L.circle([ev.lat, ev.lng], {
    radius: 150 + ev.heat * 6,
    color: 'transparent',
    fillColor: '#ff5a5f',
    fillOpacity: 0.06 + (ev.heat / 100) * 0.22
  }).addTo(map);

  // Round photo thumbnail; if the image fails, it's removed and the
  // emoji (layered underneath on the gradient) shows instead.
  const icon = L.divIcon({
    className: '',
    html: `<div class="pin-thumb"><span class="pin-emoji">${ev.emoji}</span><img src="${ev.image}" alt="" onerror="this.remove()"></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26]
  });

  const marker = L.marker([ev.lat, ev.lng], { icon }).addTo(map);
  const cta = ev.type === 'place' ? 'Explore' : 'Get tickets';
  marker.bindPopup(`
    <div class="popup">
      <img class="poster" src="${ev.image}" alt="${ev.title}" onerror="this.remove()">
      <h3>${ev.title}</h3>
      <div class="meta">${ev.venue} &middot; ${ev.time}</div>
      <a href="${ev.ticketUrl}" target="_blank" rel="noopener">${cta}</a>
    </div>
  `, { autoPanPadding: [24, 24] });

  markers[ev.id] = marker;
  allMarkers.push(marker);
  entries.push({ ev, marker, circle, card: null });
});

// Zoom so every event (Khobar + Dammam) is visible at once
map.fitBounds(L.featureGroup(allMarkers).getBounds().pad(0.25));

// ---- SIDEBAR -------------------------------------------------------------
const listEl = document.getElementById('event-list');
const countEl = document.getElementById('event-count');

entries.forEach(entry => {
  const ev = entry.ev;
  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML = `
    <span class="cat">${ev.category}</span>
    <h3>${ev.emoji} ${ev.title}</h3>
    <div class="meta">${ev.venue}<br>${ev.time}</div>
    <a class="buy" href="${ev.ticketUrl}" target="_blank" rel="noopener">${ev.type === 'place' ? 'Explore' : 'Get tickets'}</a>
  `;
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy')) return;
    map.flyTo([ev.lat, ev.lng], 15, { duration: 0.6 });
    map.once('moveend', () => markers[ev.id].openPopup());
    document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
  listEl.appendChild(card);
  entry.card = card;
});

// ---- FILTERS -------------------------------------------------------------
const chips = document.querySelectorAll('#filters .chip');
let activeFilter = 'all';

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter;
    chips.forEach(c => c.classList.toggle('active', c === chip));
    applyFilter();
  });
});

// Category chips (scrollable row), built from whatever categories exist
const catWrap = document.getElementById('cat-filters');
let activeCat = 'all';

['all', ...new Set(EVENTS.map(ev => ev.category))].forEach(cat => {
  const chip = document.createElement('button');
  chip.className = 'chip' + (cat === 'all' ? ' active' : '');
  chip.textContent = cat === 'all' ? 'Everything' : cat;
  chip.addEventListener('click', () => {
    activeCat = cat;
    catWrap.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
    applyFilter();
  });
  catWrap.appendChild(chip);
});

function applyFilter() {
  let nEvents = 0, nPlaces = 0;
  entries.forEach(({ ev, marker, circle, card }) => {
    const show = (activeFilter === 'all' || ev.type === activeFilter) &&
                 (activeCat === 'all' || ev.category === activeCat);
    card.style.display = show ? '' : 'none';
    if (show) {
      marker.addTo(map);
      circle.addTo(map);
      if (ev.type === 'place') nPlaces++; else nEvents++;
    } else {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }
  });
  if (activeFilter === 'event') {
    countEl.textContent = `${nEvents} events happening`;
  } else if (activeFilter === 'place') {
    countEl.textContent = `${nPlaces} place${nPlaces === 1 ? '' : 's'} to explore`;
  } else {
    countEl.textContent = `${nEvents} events · ${nPlaces} place${nPlaces === 1 ? '' : 's'}`;
  }
}

applyFilter();
