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
      if (Array.isArray(rows) && rows.length > 0) return rows.map(rowToItem);
      console.warn('Supabase returned no items; using bundled seed data.');
    } catch (err) {
      console.warn('Could not reach Supabase; using bundled seed data.', err);
    }
  }
  return SEED_ITEMS;
}
