// ---- APP (UI logic) ------------------------------------------------------
// Data comes from the data layer (data.js → Supabase, or bundled seed);
// posters come from the template engine (posters.js). This file only wires
// the map, sidebar and filters together.

loadItems().then(initApp);

function initApp(ITEMS) {
  // ---- MAP ---------------------------------------------------------------
  const map = L.map('map', { zoomControl: true, closePopupOnClick: false }).setView([26.2854, 50.2083], 12);

  // iOS Safari fires a delayed duplicate of the tap that opened a popup.
  // After the popup's autoPan has shifted the map, that duplicate can land on
  // the map, the pin itself, or a cluster badge — each of which would close
  // the popup mid-pan. All three paths are grace-guarded below: for the
  // first POPUP_GRACE_MS after a popup opens, nothing can dismiss it except
  // its ✕ button, and any unexpected close in that window is undone.
  const POPUP_GRACE_MS = 900;
  let popupOpenedAt = 0;
  let manualCloseAt = 0;

  const inGrace = () => Date.now() - popupOpenedAt < POPUP_GRACE_MS;

  map.on('popupopen', () => { popupOpenedAt = Date.now(); });

  // ✕ button = always a deliberate close (capture phase so we see it first)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.leaflet-popup-close-button')) manualCloseAt = Date.now();
  }, true);

  // Map tap closes the popup only after the grace period
  // (closePopupOnClick is off above; this replaces it).
  map.on('click', () => {
    if (!inGrace()) map.closePopup();
  });

  // Safety net: a popup closed within the grace window by anything other
  // than its ✕ button (ghost tap, cluster churn during autoPan) is reopened.
  map.on('popupclose', (e) => {
    const source = e.popup && e.popup._source;
    if (!source || !inGrace() || Date.now() - manualCloseAt < 1000) return;
    setTimeout(() => {
      if (!map._popup && source._map) source.openPopup();
    }, 150);
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  // Attribution links must never hijack the session: a tap meant for a pin
  // near the bottom edge can land on them — open in a new tab instead.
  document.querySelectorAll('.leaflet-control-attribution a').forEach(a => {
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Nearby pins collapse into a count badge; tapping it zooms in/fans out.
  const clusterGroup = L.markerClusterGroup({
    // keep markers on the map when they pan out of view: the tall detail
    // popup can auto-pan its own pin off-screen, and removing that pin
    // would close the popup the user just opened
    removeOutsideVisibleBounds: false,
    maxClusterRadius: 46,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    zoomToBoundsOnClick: false, // done manually below, grace-guarded
    iconCreateFunction: cluster => L.divIcon({
      className: '',
      html: `<div class="cluster-badge">${cluster.getChildCount()}</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    })
  });
  map.addLayer(clusterGroup);

  // A ghost tap on a cluster badge right after a popup opened would zoom the
  // map and re-absorb the open marker — ignore cluster taps during the grace.
  clusterGroup.on('clusterclick', (e) => {
    if (!inGrace()) e.layer.zoomToBounds({ padding: [24, 24] });
  });

  // Density heat layer (Snapchat-style): nearby venues merge into one warm
  // hub that fades outward. Fed with the currently visible items, weighted
  // by their heat value; refreshed whenever the filters change.
  const heatLayer = L.heatLayer([], {
    radius: 42,
    blur: 32,
    minOpacity: 0.18,
    maxZoom: 15,
    gradient: { 0.25: '#3b2c7a', 0.45: '#6c5ce7', 0.65: '#ff5a5f', 0.85: '#ffb347', 1: '#ffe9b0' }
  }).addTo(map);

  function refreshHeat() {
    heatLayer.setLatLngs(
      entries
        .filter(en => en.shown)
        .map(en => [en.ev.lat, en.ev.lng, 0.35 + (en.ev.heat / 100) * 0.65])
    );
  }

  // Leaflet.heat only repaints on moveend, so during a pinch-zoom or flyTo
  // the canvas looked frozen on screen until the gesture ended. Repaint it
  // on every frame of the gesture instead — drawing a few dozen points is
  // cheap. Skip CSS-animated zooms (map._animatingZoom): the plugin's own
  // zoomanim transform already carries the canvas through those.
  let heatFrame = null;
  map.on('zoom move', () => {
    if (map._animatingZoom || heatFrame) return;
    heatFrame = requestAnimationFrame(() => {
      heatFrame = null;
      heatLayer._reset();
    });
  });

  // Zoom-dependent markers (Google Maps behaviour): small dots when zoomed
  // out, growing into the full poster pins as the user zooms in. Sizing is
  // done with a centred CSS scale, so marker anchors stay correct.
  function updateZoomClass() {
    const z = map.getZoom();
    const el = map.getContainer();
    el.classList.toggle('zoom-low', z < 11);
    el.classList.toggle('zoom-mid', z >= 11 && z < 13);
    el.classList.toggle('zoom-high', z >= 13);
  }
  map.on('zoomend', updateZoomClass);
  updateZoomClass();

  // User position (if allowed): powers popup distance/drive time and the
  // Tonight list's nearest-first sorting. The map works fine without it.
  let MAP_POS = null;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      MAP_POS = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }, () => {}, { timeout: 8000, maximumAge: 300000 });
  }

  const markers = {};
  const entries = []; // { ev, marker, card, shown } — one per item, for filtering

  ITEMS.forEach(ev => {
    const poster = posterSrc(ev);

    // Round poster thumbnail; if the image fails, it's removed and the
    // emoji (layered underneath on the gradient) shows instead.
    const icon = L.divIcon({
      className: '',
      html: `<div class="pin-thumb" data-id="${ev.id}"><span class="pin-emoji">${itemIcon(ev)}</span><img src="${poster}" alt="" onerror="this.remove()"></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -26]
    });

    const marker = L.marker([ev.lat, ev.lng], { icon });
    clusterGroup.addLayer(marker);
    // Content is a function so each open rebuilds it — the status line and
    // distance/drive-time stay current as time passes and MAP_POS arrives.
    marker.bindPopup(() => `<div class="popup">${detailCardHtml(ev, MAP_POS)}</div>`, {
      autoPanPadding: [24, 24],
      maxWidth: 230,
      // Cap popup height to the map area so it never overflows off-screen;
      // Leaflet makes the content scrollable when it exceeds this.
      maxHeight: Math.max(240, Math.round(map.getSize().y * 0.82))
    });

    // Replace bindPopup's default click-toggle: a ghost tap landing back on
    // the pin right after its popup opened must not toggle it closed.
    marker.off('click');
    marker.on('click', () => {
      if (marker.isPopupOpen()) {
        if (!inGrace()) marker.closePopup();
      } else {
        marker.openPopup();
      }
    });

    markers[ev.id] = marker;
    entries.push({ ev, marker, card: null, shown: true });
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
      <h3>${itemIcon(ev)} ${ev.title}</h3>
      <div class="meta">${ev.venue}<br>${ev.time}</div>
      <a class="buy" href="${trackedUrl(ev.ticketUrl)}" data-item="${ev.id}" target="_blank" rel="noopener">${ev.type === 'place' ? 'Explore' : 'Get tickets'}</a>
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
    entries.forEach(entry => {
      const { ev, marker, card } = entry;
      const show = (activeFilter === 'all' || ev.type === activeFilter) &&
                   (activeCat === 'all' || ev.category === activeCat) &&
                   matchesWhen(ev);
      entry.shown = show;
      card.style.display = show ? '' : 'none';
      if (show) {
        if (!clusterGroup.hasLayer(marker)) clusterGroup.addLayer(marker);
        if (ev.type === 'place') nPlaces++; else nEvents++;
      } else {
        clusterGroup.removeLayer(marker);
      }
    });
    refreshHeat();
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

  // ---- TONIGHT -------------------------------------------------------------
  // A prominent toggle that answers "what can I do right now?": places open
  // now plus events running today, nearest first, as swipeable cards over the
  // map. "Surprise me" picks one good option nearby and flies to it.
  const tonightBtn = document.getElementById('tonight-btn');
  const tonightPanel = document.getElementById('tonight-panel');
  const tonightScroll = document.getElementById('tonight-scroll');

  function tonightList() {
    const list = ITEMS.filter(ev => {
      const k = itemStatus(ev).kind;
      return k === 'open' || k === 'live';
    });
    if (MAP_POS) {
      list.sort((a, b) => itemDistKm(MAP_POS, a) - itemDistKm(MAP_POS, b));
    } else {
      list.sort((a, b) => (b.heat || 0) - (a.heat || 0));
    }
    return list;
  }

  function flyToItem(ev) {
    clusterGroup.zoomToShowLayer(markers[ev.id], () => markers[ev.id].openPopup());
  }

  function renderTonight() {
    tonightScroll.textContent = '';
    tonightList().forEach(ev => {
      const st = itemStatus(ev);
      const card = document.createElement('button');
      card.className = 'tn-card';
      const dist = MAP_POS ? `<span class="tn-dist">${itemDistKm(MAP_POS, ev).toFixed(1)} km</span>` : '';
      card.innerHTML = `
        <img src="${posterSrc(ev)}" alt="" onerror="this.style.visibility='hidden'">
        <span class="tn-name">${itemIcon(ev)} ${ev.title}</span>
        <span class="tn-status status-${st.kind}">${st.short}</span>${dist}`;
      card.addEventListener('click', () => flyToItem(ev));
      tonightScroll.appendChild(card);
    });
  }

  tonightBtn.addEventListener('click', () => {
    const showing = !tonightPanel.hidden;
    tonightPanel.hidden = showing;
    tonightBtn.classList.toggle('active', !showing);
    if (!showing) renderTonight();
  });

  document.getElementById('surprise-btn').addEventListener('click', () => {
    // a good option: open/live now, hot, and (when we know) under 20 km away
    let cands = tonightList().filter(ev => !MAP_POS || itemDistKm(MAP_POS, ev) <= 20);
    if (!cands.length) cands = tonightList();
    if (!cands.length) return;
    cands.sort((a, b) => (b.heat || 0) - (a.heat || 0));
    const pick = cands[Math.floor(Math.random() * Math.min(cands.length, 5))];
    flyToItem(pick);
  });

  // Log every CTA tap (sidebar cards and map popups) for referral stats
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-item]');
    if (link) logClick(Number(link.dataset.item));
  });
}
