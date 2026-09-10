#!/usr/bin/env node
/**
 * Fetch candidate photographs for the Najd site from Pexels.
 *
 *   PEXELS_API_KEY=xxxx node najd/scripts/fetch-photos.js
 *
 * Downloads the top 3 landscape results per slot into
 * najd/assets/img/candidates/<slot>-1.jpg … -3.jpg and writes a contact
 * sheet (index.html) plus credits.json alongside them. It touches nothing
 * the site actually serves — picking a winner is a separate step:
 *
 *   node najd/scripts/fetch-photos.js --promote site=2 plant=1
 *
 * which copies the chosen candidates into assets/img/photos/ and records
 * them in manifest.json, where the site picks them up.
 *
 * Slot names match assets/img/photos/README.md. A slot with no entry in
 * manifest.json keeps its drawn illustration, so nothing breaks mid-way.
 */

const fs = require('fs');
const path = require('path');

const SLOTS = {
  site:      'construction site building',
  warehouse: 'warehouse racking interior',
  logistics: 'warehouse forklift loading',
  port:      'shipping containers port',
  plant:     'industrial valves pipes',
  power:     'electrical panel cables',
  safety:    'worker safety helmet',
  office:    'modern office building',
  trade:     'cargo freight shipping trade',
};

const PER_SLOT = 3;
const ROOT = path.resolve(__dirname, '..');
const CANDIDATES = path.join(ROOT, 'assets', 'img', 'candidates');
const PHOTOS = path.join(ROOT, 'assets', 'img', 'photos');
const MANIFEST = path.join(PHOTOS, 'manifest.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query, key) {
  const url = 'https://api.pexels.com/v1/search'
    + `?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels search "${query}" failed: ${res.status} ${res.statusText}`);
  const body = await res.json();
  return body.photos || [];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return fs.statSync(dest).size;
}

function contactSheet(credits) {
  const bySlot = {};
  for (const c of credits) (bySlot[c.slot] ||= []).push(c);

  const groups = Object.entries(bySlot).map(([slot, items]) => `
    <section>
      <h2>${slot} <span class="q">${SLOTS[slot] || ''}</span></h2>
      <div class="row">
        ${items.map((c) => `
        <figure>
          <img src="${c.file}" alt="${slot} candidate" loading="lazy">
          <figcaption>
            <code>${c.file}</code>
            <span>${c.photographer} · ${(c.bytes / 1024).toFixed(0)} KB · ${c.width}×${c.height}</span>
            <a href="${c.source}" target="_blank" rel="noopener">view on Pexels</a>
          </figcaption>
        </figure>`).join('')}
      </div>
    </section>`).join('');

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Photo candidates — Najd</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body { background:#0f1115; color:#e7e5e1; padding:40px 28px 80px;
         font:15px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; }
  header { max-width:1240px; margin:0 auto 40px; }
  h1 { font-size:1.6rem; font-weight:600; margin-bottom:8px; }
  .lede { color:#9aa0aa; max-width:62ch; }
  .lede code { background:#1b1f27; padding:2px 6px; border-radius:3px; font-size:.85em; }
  section { max-width:1240px; margin:0 auto 44px; }
  h2 { font-size:1rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
       color:#e7e5e1; padding-bottom:10px; border-bottom:1px solid #262b34; margin-bottom:18px; }
  h2 .q { text-transform:none; letter-spacing:0; font-weight:400; color:#6e7581; margin-left:10px; }
  .row { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:18px; }
  figure { background:#161a21; border:1px solid #262b34; border-radius:8px; overflow:hidden; }
  figure img { width:100%; aspect-ratio:3/2; object-fit:cover; display:block; background:#0b0d11; }
  figcaption { padding:12px 14px; display:flex; flex-direction:column; gap:4px; font-size:.82rem; }
  figcaption code { color:#7fd1b9; font-size:.86em; }
  figcaption span { color:#9aa0aa; }
  figcaption a { color:#6e7581; font-size:.86em; }
</style></head>
<body>
<header>
  <h1>Photo candidates</h1>
  <p class="lede">Three landscape options per slot, straight from Pexels — nothing on the site
  has changed. To use one, run
  <code>node najd/scripts/fetch-photos.js --promote &lt;slot&gt;=&lt;number&gt;</code>,
  which copies it into <code>assets/img/photos/</code> and lists it in
  <code>manifest.json</code>. Slots left out keep their drawn illustration.</p>
</header>
${groups}
<footer style="max-width:1240px;margin:0 auto;color:#6e7581;font-size:.8rem;">
  Photos via Pexels — free for commercial use, no attribution required.
  Credits recorded in <code>credits.json</code>. Generated ${new Date().toISOString().slice(0, 10)}.
</footer>
</body></html>
`;
}

async function fetchAll() {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    console.error('PEXELS_API_KEY is not set.\n'
      + 'Get a free key at https://www.pexels.com/api/ then:\n'
      + '  PEXELS_API_KEY=xxxx node najd/scripts/fetch-photos.js');
    process.exit(1);
  }

  fs.mkdirSync(CANDIDATES, { recursive: true });
  const credits = [];

  for (const [slot, query] of Object.entries(SLOTS)) {
    process.stdout.write(`${slot.padEnd(10)} "${query}" … `);
    let photos;
    try {
      photos = await search(query, key);
    } catch (err) {
      console.log(`FAILED (${err.message})`);
      continue;
    }
    if (!photos.length) { console.log('no results'); continue; }

    const picks = photos.slice(0, PER_SLOT);
    for (let i = 0; i < picks.length; i++) {
      const p = picks[i];
      const file = `${slot}-${i + 1}.jpg`;
      const bytes = await download(p.src.large, path.join(CANDIDATES, file));
      credits.push({
        slot, file, bytes,
        width: p.width, height: p.height,
        photographer: p.photographer,
        photographer_url: p.photographer_url,
        source: p.url,
      });
    }
    console.log(`${picks.length} downloaded`);
    await sleep(250); // stay well inside the free tier's rate limit
  }

  fs.writeFileSync(path.join(CANDIDATES, 'credits.json'), JSON.stringify(credits, null, 2));
  fs.writeFileSync(path.join(CANDIDATES, 'index.html'), contactSheet(credits));
  console.log(`\n${credits.length} images -> najd/assets/img/candidates/`);
  console.log('Open assets/img/candidates/index.html to compare.');
}

function promote(args) {
  const picks = args.filter((a) => a.includes('='));
  if (!picks.length) {
    console.error('Usage: node najd/scripts/fetch-photos.js --promote site=2 plant=1');
    process.exit(1);
  }
  fs.mkdirSync(PHOTOS, { recursive: true });
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};

  for (const pick of picks) {
    const [slot, n] = pick.split('=');
    const from = path.join(CANDIDATES, `${slot}-${n}.jpg`);
    if (!fs.existsSync(from)) { console.error(`missing: ${from}`); continue; }
    const name = `${slot}.jpg`;
    fs.copyFileSync(from, path.join(PHOTOS, name));
    manifest[slot] = name;
    console.log(`${slot} <- ${slot}-${n}.jpg`);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nmanifest.json updated — commit assets/img/photos/ to publish.`);
}

const args = process.argv.slice(2);
if (args.includes('--promote')) promote(args);
else fetchAll().catch((err) => { console.error(err); process.exit(1); });
