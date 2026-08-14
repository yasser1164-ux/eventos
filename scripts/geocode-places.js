#!/usr/bin/env node
// One-off geocoder for place rows, using the free OpenStreetMap Nominatim API
// (no API key needed — https://nominatim.org/release-docs/latest/api/Search/).
//
// For every type='place' row in Supabase it queries Nominatim and writes the
// top result's lat/lon back to the row, logging each change as "Old → New".
// Rows Nominatim can't find are left unchanged and listed as warnings so they
// can be fixed by hand. type='event' rows are never touched.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=<service key>  node scripts/geocode-places.js
//   node scripts/geocode-places.js --dry-run          # no key needed, no writes
//
// The service role key (Supabase → Project Settings → API) is required to
// WRITE, because the public anon key is read-only by design. Never commit it.
// Optional env overrides: SUPABASE_URL, NOMINATIM_URL (used by tests).
//
// Nominatim usage policy: absolute maximum of 1 request/second and a
// User-Agent that identifies the application — both respected below.

const fs = require('fs');
const path = require('path');

const USER_AGENT = 'eventos-khobar/1.0 (https://eventos-khobar.netlify.app)';
const NOMINATIM = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
// Bounding box around the Eastern Province (left,top,right,bottom) so a name
// that also exists elsewhere can't yank a pin to another city.
const VIEWBOX = '49.3,27.2,50.8,25.5';
const RATE_LIMIT_MS = 1100;
const DRY_RUN = process.argv.includes('--dry-run');

function fromConfig(name) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'config.js'), 'utf8');
  const m = src.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`));
  if (!m) throw new Error(`Could not read ${name} from config.js`);
  return m[1];
}

const SUPABASE_URL = process.env.SUPABASE_URL || fromConfig('SUPABASE_URL');
const ANON_KEY = process.env.SUPABASE_ANON_KEY || fromConfig('SUPABASE_ANON_KEY');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function nominatimTop(query) {
  const url = `${NOMINATIM}?format=json&limit=1&countrycodes=sa&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
  const results = await res.json();
  return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

async function fetchPlaces() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/items?type=eq.place&select=id,title,venue,lat,lng&order=id.asc`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  });
  if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
  return res.json();
}

async function updateCoords(id, lat, lng) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/items?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ lat, lng })
  });
  if (!res.ok) throw new Error(`Supabase update for id ${id} failed: ${res.status}`);
}

async function main() {
  if (!DRY_RUN && !SERVICE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required to write (or pass --dry-run).');
    process.exit(1);
  }

  const places = await fetchPlaces();
  console.log(`Geocoding ${places.length} places via Nominatim (1 req/sec)${DRY_RUN ? ' — DRY RUN, no writes' : ''}\n`);

  const failed = [];
  for (const place of places) {
    // Pass 1: title + venue + country. Pass 2 (fallback): title only — long
    // queries often miss in Nominatim, shorter ones match landmark names.
    const queries = [
      `${place.title}, ${place.venue}, Saudi Arabia`,
      `${place.title.split('—')[0].trim()}, Saudi Arabia`
    ];
    let hit = null;
    for (const q of queries) {
      hit = await nominatimTop(q);
      await sleep(RATE_LIMIT_MS);
      if (hit) break;
    }
    if (hit) {
      const lat = Number(hit.lat), lng = Number(hit.lon);
      console.log(`✓ ${place.title}: ${place.lat},${place.lng} → ${lat},${lng}`);
      console.log(`    matched: ${hit.display_name}`);
      if (!DRY_RUN) await updateCoords(place.id, lat, lng);
    } else {
      failed.push(place);
      console.warn(`⚠ ${place.title} (id ${place.id}): no Nominatim result — left unchanged`);
    }
  }

  console.log(`\nDone. ${places.length - failed.length} updated, ${failed.length} need manual fixes.`);
  if (failed.length) {
    console.log('Fix these by hand (Supabase Table Editor → items → lat/lng):');
    for (const p of failed) console.log(`  - id ${p.id}: ${p.title} (${p.venue})`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
