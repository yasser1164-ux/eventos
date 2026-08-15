// Shared helpers for the scripts/ tools: Supabase config access and the
// Nominatim geocoder (usage policy: max 1 request/second, identifying
// User-Agent — https://operations.osmfoundation.org/policies/nominatim/).

const fs = require('fs');
const path = require('path');

const USER_AGENT = 'eventos-khobar/1.0 (https://eventos-khobar.netlify.app)';
const NOMINATIM = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
// Bounding box around the Eastern Province (left,top,right,bottom) so a name
// that also exists elsewhere can't yank a pin to another city.
const VIEWBOX = '49.3,27.2,50.8,25.5';
const RATE_LIMIT_MS = 1100;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function fromConfig(name) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'config.js'), 'utf8');
  const m = src.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`));
  if (!m) throw new Error(`Could not read ${name} from config.js`);
  return m[1];
}

async function nominatimTop(query) {
  const url = `${NOMINATIM}?format=json&limit=1&countrycodes=sa&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
  const results = await res.json();
  return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

module.exports = { USER_AGENT, RATE_LIMIT_MS, sleep, fromConfig, nominatimTop };
