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
