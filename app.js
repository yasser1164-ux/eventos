// ---- MAP -----------------------------------------------------------------
const map = L.map('map', { zoomControl: true }).setView([26.2854, 50.2083], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  maxZoom: 19
}).addTo(map);

const markers = {};
const allMarkers = [];

EVENTS.forEach(ev => {
  // Heat glow — bigger + brighter for hotter events
  L.circle([ev.lat, ev.lng], {
    radius: 150 + ev.heat * 6,
    color: 'transparent',
    fillColor: '#ff5a5f',
    fillOpacity: 0.06 + (ev.heat / 100) * 0.22
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: `<div class="pin"><span>${ev.emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });

  const marker = L.marker([ev.lat, ev.lng], { icon }).addTo(map);
  marker.bindPopup(`
    <div class="popup">
      <h3>${ev.title}</h3>
      <div class="meta">${ev.venue} &middot; ${ev.time}</div>
      <a href="${ev.ticketUrl}" target="_blank" rel="noopener">Get tickets</a>
    </div>
  `);

  markers[ev.id] = marker;
  allMarkers.push(marker);
});

// Zoom so every event (Khobar + Dammam) is visible at once
map.fitBounds(L.featureGroup(allMarkers).getBounds().pad(0.25));

// ---- SIDEBAR -------------------------------------------------------------
const listEl = document.getElementById('event-list');
document.getElementById('event-count').textContent = `${EVENTS.length} events happening`;

EVENTS.forEach(ev => {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML = `
    <span class="cat">${ev.category}</span>
    <h3>${ev.emoji} ${ev.title}</h3>
    <div class="meta">${ev.venue}<br>${ev.time}</div>
    <a class="buy" href="${ev.ticketUrl}" target="_blank" rel="noopener">Get tickets</a>
  `;
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy')) return;
    map.flyTo([ev.lat, ev.lng], 15, { duration: 0.6 });
    markers[ev.id].openPopup();
    document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
  listEl.appendChild(card);
});
