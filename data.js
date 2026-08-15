// ---- DATA LAYER -----------------------------------------------------------
// Loads items from Supabase when config.js is filled in; otherwise (or if the
// request fails) falls back to the bundled seed data so the site never breaks.
// The UI (app.js) only ever sees the camelCase item shape returned here.

function rowToItem(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    category: row.category,
    emoji: row.emoji,
    venue: row.venue,
    time: row.time_label,
    start: row.start_date,
    end: row.end_date,
    status: row.status,
    lat: row.lat,
    lng: row.lng,
    heat: row.heat,
    ticketUrl: row.ticket_url,
    posterRef: row.poster_ref
  };
}

// ---- STATUS & EXPIRY --------------------------------------------------------
// One source of truth for "is this on right now?" — used by the home screen,
// the map popup/Tonight list, and the AR labels, so every surface agrees.

function itemDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function fmtItemDay(d) {
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${WD[d.getDay()]} ${MO[d.getMonth()]} ${d.getDate()}`;
}

// -> { kind: 'open'|'live'|'upcoming'|'ended', head, sub, short }
// head+sub feed the detail card ("ON TODAY · Tonight · 9:00 PM"),
// short feeds the AR label ("Open now" / "Starts Fri Sep 4" / "Ends Sep 1").
function itemStatus(ev) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (ev.type === 'place') {
    return { kind: 'open', head: 'OPEN NOW', sub: ev.time || '', short: 'Open now' };
  }
  const start = ev.start ? itemDay(ev.start) : null;
  const end = ev.end ? itemDay(ev.end) : start;
  if (start && start > today) {
    return { kind: 'upcoming', head: `STARTS ${fmtItemDay(start).toUpperCase()}`, sub: ev.time || '', short: `Starts ${fmtItemDay(start)}` };
  }
  if (end && end < today) {
    return { kind: 'ended', head: 'ENDED', sub: '', short: 'Ended' };
  }
  const short = end && end > today ? `Ends ${fmtItemDay(end)}` : 'On today';
  return { kind: 'live', head: 'ON TODAY', sub: ev.time || '', short };
}

function isExpired(ev) {
  return itemStatus(ev).kind === 'ended';
}

// ---- SHARED DETAIL CARD -----------------------------------------------------
// The one card every surface opens: status line first, then venue + distance
// with a rough drive time (~40 km/h city average), then Directions / Tickets /
// Share. Tickets hides when the link is just a homepage (an info link, not a
// ticket page).

function itemDistKm(a, b) {
  const toRad = d => d * Math.PI / 180, R = 6371;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function hasTicketPage(ev) {
  if (ev.type !== 'event') return false;
  try {
    const u = new URL(ev.ticketUrl);
    return u.pathname && u.pathname !== '/';
  } catch { return false; }
}

function detailCardHtml(ev, pos) {
  const st = itemStatus(ev);
  const statusLine = st.sub ? `${st.head} · ${posterEsc(st.sub)}` : st.head;
  let distLine = '';
  if (pos && ev.lat && ev.lng) {
    const km = itemDistKm(pos, ev);
    const mins = Math.max(2, Math.round(km / 40 * 60));
    distLine = `<br>${km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`} · ~${mins} min drive`;
  }
  const tickets = hasTicketPage(ev)
    ? `<a class="act-btn" href="${trackedUrl(ev.ticketUrl)}" data-item="${ev.id}" target="_blank" rel="noopener">🎟 Tickets</a>`
    : '';
  return `
    <img class="poster" src="${posterSrc(ev)}" alt="${posterEsc(ev.title)}" onerror="this.remove()">
    <h3>${itemIcon(ev)} ${posterEsc(ev.title)}</h3>
    <div class="status-line status-${st.kind}">${statusLine}</div>
    <div class="meta">${posterEsc(ev.venue)}${distLine}</div>
    <div class="detail-actions">
      <a class="act-btn" href="https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lng}" target="_blank" rel="noopener">🧭 Directions</a>
      ${tickets}
      <button class="act-btn" data-share-title="${posterEsc(ev.title)}"
        data-share-text="${posterEsc(`${ev.title} — ${ev.venue} · ${st.short}`)}"
        data-share-url="${posterEsc(trackedUrl(ev.ticketUrl))}">↗ Share</button>
    </div>`;
}

// native share (falls back to copying the link)
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-share-title]');
  if (!btn) return;
  const payload = { title: btn.dataset.shareTitle, text: btn.dataset.shareText, url: btn.dataset.shareUrl };
  if (navigator.share) {
    navigator.share(payload).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${payload.text} ${payload.url}`).catch(() => {});
    const old = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(() => { btn.textContent = old; }, 1500);
  }
});

// Append referral tags to an outbound link so the destination site can see
// the visit came from eventos — the first step toward affiliate/partner deals.
function trackedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('utm_source', 'eventos-khobar');
    url.searchParams.set('utm_medium', 'referral');
    return url.toString();
  } catch {
    return rawUrl;
  }
}

// Fire-and-forget click log (needs the clicks table from supabase/clicks.sql;
// silently does nothing if Supabase isn't configured or the table is missing).
function logClick(itemId) {
  if (typeof SUPABASE_URL !== 'string' || !SUPABASE_URL.startsWith('http')) return;
  try {
    fetch(`${SUPABASE_URL}/rest/v1/clicks`, {
      method: 'POST',
      keepalive: true,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ item_id: itemId })
    }).catch(() => {});
  } catch { /* never block the user's navigation */ }
}

async function loadItems() {
  const configured =
    typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http') &&
    typeof SUPABASE_ANON_KEY === 'string' && !SUPABASE_ANON_KEY.startsWith('YOUR_');

  if (configured) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/items?select=*&order=id.asc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
      const rows = await res.json();
      // automatic expiry: events whose end_date has passed vanish everywhere
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map(rowToItem).filter(ev => !isExpired(ev));
      }
      console.warn('Supabase returned no items; using bundled seed data.');
    } catch (err) {
      console.warn('Could not reach Supabase; using bundled seed data.', err);
    }
  }
  return SEED_ITEMS.filter(ev => !isExpired(ev));
}
