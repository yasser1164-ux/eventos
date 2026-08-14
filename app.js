// ---- APP (UI logic) ------------------------------------------------------
// Data comes from the data layer (data.js → Supabase, or bundled seed);
// posters come from the template engine (posters.js). This file only wires
// the map, sidebar and filters together.

loadItems().then(initApp);

function initApp(ITEMS) {
  // ---- MAP ---------------------------------------------------------------
  const map = L.map('map', { zoomControl: true }).setView([26.2854, 50.2083], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  // Nearby pins collapse into a count badge; tapping it zooms in/fans out.
  const clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 46,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: cluster => L.divIcon({
      className: '',
      html: `<div class="cluster-badge">${cluster.getChildCount()}</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    })
  });
  map.addLayer(clusterGroup);

  const markers = {};
  const entries = []; // { ev, marker, circle, card } — one per item, for filtering

  ITEMS.forEach(ev => {
    const poster = posterSrc(ev);

    // Heat glow — events only (it marks how busy an event is); places
    // stay clean so dense areas don't turn into red blobs.
    const circle = ev.type === 'event'
      ? L.circle([ev.lat, ev.lng], {
          radius: 150 + ev.heat * 6,
          color: 'transparent',
          fillColor: '#ff5a5f',
          fillOpacity: 0.05 + (ev.heat / 100) * 0.16
        }).addTo(map)
      : null;

    // Round poster thumbnail; if the image fails, it's removed and the
    // emoji (layered underneath on the gradient) shows instead.
    const icon = L.divIcon({
      className: '',
      html: `<div class="pin-thumb"><span class="pin-emoji">${ev.emoji}</span><img src="${poster}" alt="" onerror="this.remove()"></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -26]
    });

    const marker = L.marker([ev.lat, ev.lng], { icon });
    clusterGroup.addLayer(marker);
    const cta = ev.type === 'place' ? 'Explore' : 'Get tickets';
    marker.bindPopup(`
      <div class="popup">
        <img class="poster" src="${poster}" alt="${ev.title}" onerror="this.remove()">
        <h3>${ev.title}</h3>
        <div class="meta">${ev.venue} &middot; ${ev.time}</div>
        <a href="${ev.ticketUrl}" target="_blank" rel="noopener">${cta}</a>
      </div>
    `, {
      autoPanPadding: [24, 24],
      maxWidth: 230,
      // Cap popup height to the map area so it never overflows off-screen;
      // Leaflet makes the content scrollable when it exceeds this.
      maxHeight: Math.max(240, Math.round(map.getSize().y * 0.82))
    });

    markers[ev.id] = marker;
    entries.push({ ev, marker, circle, card: null });
  });

  // Zoom so every item (Khobar + Dammam + Dhahran) is visible at once
  map.fitBounds(clusterGroup.getBounds().pad(0.25));

  // ---- DATES -------------------------------------------------------------
  // The Saudi weekend is Friday & Saturday. Places have no start/end, so
  // they match every date filter (they're always open).
  function parseDay(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);
  const dow = TODAY.getDay(); // Fri = 5, Sat = 6
  const FRI = new Date(TODAY);
  FRI.setDate(TODAY.getDate() + (dow === 6 ? -1 : (5 - dow + 7) % 7));
  const SAT = new Date(FRI);
  SAT.setDate(FRI.getDate() + 1);
  const NEXT_FRI = new Date(FRI);
  NEXT_FRI.setDate(FRI.getDate() + 7);
  const NEXT_SAT = new Date(SAT);
  NEXT_SAT.setDate(SAT.getDate() + 7);

  function runsBetween(ev, from, to) {
    if (!ev.start) return true;
    return parseDay(ev.start) <= to && parseDay(ev.end || ev.start) >= from;
  }

  // ---- SIDEBAR -----------------------------------------------------------
  const listEl = document.getElementById('event-list');
  const countEl = document.getElementById('event-count');

  entries.forEach(entry => {
    const ev = entry.ev;
    const card = document.createElement('div');
    card.className = 'event-card';
    const badge = ev.type === 'event' && ev.start && runsBetween(ev, TODAY, TODAY)
      ? '<span class="today-badge">Today</span>'
      : ev.status === 'soon' ? '<span class="soon-badge">Soon</span>' : '';
    card.innerHTML = `
      <span class="cat">${ev.category}</span>${badge}
      <h3>${ev.emoji} ${ev.title}</h3>
      <div class="meta">${ev.venue}<br>${ev.time}</div>
      <a class="buy" href="${ev.ticketUrl}" target="_blank" rel="noopener">${ev.type === 'place' ? 'Explore' : 'Get tickets'}</a>
    `;
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('buy')) return;
      // Zoom until the marker leaves its cluster, then open its popup
      clusterGroup.zoomToShowLayer(markers[ev.id], () => markers[ev.id].openPopup());
      document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    listEl.appendChild(card);
    entry.card = card;
  });

  // ---- FILTERS -----------------------------------------------------------
  const chips = document.querySelectorAll('#filters .chip');
  let activeFilter = 'all';

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      chips.forEach(c => c.classList.toggle('active', c === chip));
      applyFilter();
    });
  });

  const whenChips = document.querySelectorAll('#when-filters .chip');
  let activeWhen = 'any';

  whenChips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeWhen = chip.dataset.when;
      whenChips.forEach(c => c.classList.toggle('active', c === chip));
      applyFilter();
    });
  });

  function matchesWhen(ev) {
    if (activeWhen === 'today') return runsBetween(ev, TODAY, TODAY);
    if (activeWhen === 'weekend') return runsBetween(ev, FRI, SAT);
    if (activeWhen === 'nextweekend') return runsBetween(ev, NEXT_FRI, NEXT_SAT);
    return true;
  }

  // Category chips (scrollable row), built from whatever categories exist
  const catWrap = document.getElementById('cat-filters');
  let activeCat = 'all';

  ['all', ...new Set(ITEMS.map(ev => ev.category))].forEach(cat => {
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
                   (activeCat === 'all' || ev.category === activeCat) &&
                   matchesWhen(ev);
      card.style.display = show ? '' : 'none';
      if (show) {
        if (!clusterGroup.hasLayer(marker)) clusterGroup.addLayer(marker);
        if (circle) circle.addTo(map);
        if (ev.type === 'place') nPlaces++; else nEvents++;
      } else {
        clusterGroup.removeLayer(marker);
        if (circle) map.removeLayer(circle);
      }
    });
    const evLabel = `${nEvents} event${nEvents === 1 ? '' : 's'}`;
    const plLabel = `${nPlaces} place${nPlaces === 1 ? '' : 's'}`;
    if (activeFilter === 'event') {
      countEl.textContent = `${evLabel} happening`;
    } else if (activeFilter === 'place') {
      countEl.textContent = `${plLabel} to explore`;
    } else {
      countEl.textContent = `${evLabel} · ${plLabel}`;
    }
  }

  applyFilter();
}
