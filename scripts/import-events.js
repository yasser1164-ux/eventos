#!/usr/bin/env node
// Imports Eastern Province events (Dammam · Khobar · Dhahran) from public
// listing pages into the Supabase items table.
//
// How it finds events: listing pages on ticketing sites (Platinumlist, and
// most others) embed schema.org Event data as JSON-LD for search engines.
// That's far more stable than scraping HTML markup, so this script extracts
// every <script type="application/ld+json"> block and collects the Event
// objects inside (including ItemList/@graph wrappers).
//
// For each new event it maps the fields to the items schema, geocodes the
// venue via the shared Nominatim helper (never hardcoded coordinates;
// 1 request/second with an identifying User-Agent), and inserts the row.
//
// Safe to re-run: events whose title or ticket URL already exist in the
// table are skipped. Past events, events outside the Eastern Province, and
// events whose venue can't be geocoded are skipped with a log line.
// items.id has no default, so ids are assigned as max(id)+1 onwards.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=<service key>  node scripts/import-events.js
//   node scripts/import-events.js --dry-run       # no key needed, no writes
//
// Env overrides (used by tests): SUPABASE_URL, NOMINATIM_URL, SOURCES
// (comma-separated listing URLs).

const { USER_AGENT, RATE_LIMIT_MS, sleep, fromConfig, nominatimTop } = require('./lib');

// Public listing pages to scan. Add/remove freely.
const SOURCES = (process.env.SOURCES && process.env.SOURCES.split(',')) || [
  'https://dammam.platinumlist.net/',
  'https://dammam.platinumlist.net/concerts',
  'https://dammam.platinumlist.net/things-to-do'
];

const REGION = /dammam|khobar|dhahran|qatif|thuqbah|aziziyah|eastern province|الدمام|الخبر|الظهران|القطيف/i;

const CATEGORY_RULES = [
  [/football|soccer|match|league|cup final/i, ['Football', '⚽', 'template:football']],
  [/concert|music|orchestra|dj|band|sings|live in/i, ['Concert', '🎤', 'template:concert']],
  [/comedy|stand[ -]?up/i, ['Comedy', '😂', 'template:exhibition']],
  [/kids|family|circus|bounce|magic|disney|cartoon/i, ['Family', '🎈', 'template:family']],
  [/food|dining|culinary|taste|iftar/i, ['Festival', '🍜', 'template:candlelight']],
  [/theatre|theater|ballet|opera|musical|play\b|show/i, ['Show', '🎭', 'template:exhibition']],
  [/esport|gaming/i, ['Esports', '🎮', 'template:exhibition']],
  [/expo|exhibition|art|museum/i, ['Exhibition', '🖼️', 'template:exhibition']],
  [/padel|tennis|run|marathon|fitness|sports?/i, ['Sports', '🎾', 'template:football']]
];

const DRY_RUN = process.argv.includes('--dry-run');
const SUPABASE_URL = process.env.SUPABASE_URL || fromConfig('SUPABASE_URL');
const ANON_KEY = process.env.SUPABASE_ANON_KEY || fromConfig('SUPABASE_ANON_KEY');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ---------------------------------------------------------------------------
// Source parsing
// ---------------------------------------------------------------------------

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.text();
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try { blocks.push(JSON.parse(m[1].trim())); } catch { /* malformed block — skip */ }
  }
  return blocks;
}

function collectEvents(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(n => collectEvents(n, out)); return; }
  const type = [].concat(node['@type'] || []).join(',');
  if (/Event/.test(type) && node.name && node.startDate) out.push(node);
  collectEvents(node['@graph'], out);
  collectEvents(node.itemListElement, out);
  collectEvents(node.item, out);
}

// ---------------------------------------------------------------------------
// Field mapping
// ---------------------------------------------------------------------------

function classify(title) {
  for (const [re, meta] of CATEGORY_RULES) if (re.test(title)) return meta;
  return ['Event', '🎟️', 'template:exhibition'];
}

function isoDay(s) {
  const m = String(s || '').match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function timeLabel(startIso, endIso, rawStart) {
  const day = s => {
    const [y, mo, d] = s.split('-').map(Number);
    return `${MONTHS[mo - 1]} ${d}`;
  };
  if (endIso && endIso !== startIso) return `${day(startIso)} – ${day(endIso)}`;
  const t = String(rawStart || '').match(/T(\d{2}):(\d{2})/);
  if (t) {
    const h = Number(t[1]);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${day(startIso)} · ${((h + 11) % 12) + 1}:${t[2]} ${ampm}`;
  }
  return day(startIso);
}

function venueString(location) {
  const loc = Array.isArray(location) ? location[0] : location;
  if (!loc) return null;
  const name = typeof loc === 'string' ? loc : loc.name;
  const addr = loc && typeof loc.address === 'object'
    ? (loc.address.addressLocality || loc.address.streetAddress || '')
    : (typeof loc?.address === 'string' ? loc.address : '');
  return [name, addr].filter(Boolean).join(', ') || null;
}

function normalizeTitle(t) {
  return String(t).toLowerCase().replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------

async function fetchExisting() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/items?select=id,title,ticket_url`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  });
  if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
  return res.json();
}

async function insertRow(row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(row)
  });
  if (!res.ok) throw new Error(`Insert of "${row.title}" failed: ${res.status} ${await res.text()}`);
}

// ---------------------------------------------------------------------------

async function main() {
  if (!DRY_RUN && !SERVICE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required to write (or pass --dry-run).');
    process.exit(1);
  }

  const existing = await fetchExisting();
  const knownTitles = new Set(existing.map(r => normalizeTitle(r.title)));
  const knownUrls = new Set(existing.map(r => r.ticket_url));
  let nextId = existing.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  const today = new Date().toISOString().slice(0, 10);

  // 1. Gather candidate events from all sources
  const candidates = [];
  for (const source of SOURCES) {
    try {
      const html = await fetchPage(source);
      const found = [];
      extractJsonLd(html).forEach(b => collectEvents(b, found));
      console.log(`${source} → ${found.length} event(s) in JSON-LD`);
      for (const ev of found) candidates.push({ ev, source });
      await sleep(500); // be polite between page fetches
    } catch (err) {
      console.warn(`⚠ Could not read ${source}: ${err.message}`);
    }
  }

  // 2. Map, filter, geocode, insert
  let added = 0, skipped = 0;
  const seenThisRun = new Set();
  for (const { ev, source } of candidates) {
    const title = String(ev.name).replace(/\s+/g, ' ').trim();
    const key = normalizeTitle(title);
    const url = ev.url ? new URL(ev.url, source).toString() : source;

    if (seenThisRun.has(key)) continue; // same event listed on two pages
    seenThisRun.add(key);

    if (knownTitles.has(key) || knownUrls.has(url)) {
      console.log(`· already in table, skipping: ${title}`);
      skipped++;
      continue;
    }
    const start = isoDay(ev.startDate);
    const end = isoDay(ev.endDate) || start;
    if (!start || end < today) {
      console.log(`· past event, skipping: ${title}`);
      skipped++;
      continue;
    }
    const venue = venueString(ev.location);
    if (!venue || !REGION.test(`${venue} ${JSON.stringify(ev.location || '')}`)) {
      console.log(`· outside Dammam/Khobar/Dhahran region, skipping: ${title} (${venue || 'no venue'})`);
      skipped++;
      continue;
    }

    // Geocode the venue — never hardcode coordinates.
    let hit = await nominatimTop(`${venue}, Saudi Arabia`);
    await sleep(RATE_LIMIT_MS);
    if (!hit) {
      hit = await nominatimTop(`${venue.split(',')[0]}, Saudi Arabia`);
      await sleep(RATE_LIMIT_MS);
    }
    if (!hit) {
      console.warn(`⚠ venue not geocodable, skipping: ${title} @ "${venue}" — add it by hand if wanted`);
      skipped++;
      continue;
    }

    const [category, emoji, template] = classify(`${title} ${ev.description || ''}`);
    const image = [].concat(ev.image || [])[0];
    const row = {
      id: nextId++,
      title,
      type: 'event',
      category,
      emoji,
      venue,
      time_label: timeLabel(start, end, ev.startDate),
      start_date: start,
      end_date: end,
      status: start <= today ? 'live' : 'soon',
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      heat: 60,
      ticket_url: url,
      poster_ref: typeof image === 'string' && image.startsWith('http') ? image : template
    };

    if (!DRY_RUN) await insertRow(row);
    console.log(`✓ added id ${row.id}: ${title}`);
    console.log(`    ${row.category} · ${row.time_label} · ${venue} @ ${row.lat},${row.lng}`);
    added++;
  }

  console.log(`\nDone${DRY_RUN ? ' (dry run — nothing written)' : ''}: ${added} added, ${skipped} skipped.`);
}

main().catch(err => { console.error(err); process.exit(1); });
