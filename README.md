# Eventos

A map of what's happening in the Eastern Province (Khobar · Dammam · Dhahran):
events with poster pins, plus good places to visit. Plain HTML/CSS/JS +
[Leaflet](https://leafletjs.com) — no build step — with
[Supabase](https://supabase.com) as the data backend.

**Live site:** https://yasser1164-ux.github.io/eventos/
(auto-deploys from `main` via GitHub Pages — the `Deploy to GitHub Pages`
action runs on every merge to `main`; live in ~1 minute)

## Architecture

Data, logic and UI are separated:

```
index.html          Page skeleton: top bar, sidebar, filter chips, map container.
styles.css          All styling, including mobile layout (breakpoint at 720px).
config.js           Supabase URL + anon key (paste yours here — see Setup).
data.js             DATA layer: fetches items from Supabase; falls back to seed.js.
seed.js             Bundled copy of the data — used until Supabase is configured,
                    and whenever the database is unreachable. Keep in sync with
                    supabase/schema.sql.
posters.js          POSTER templates: renders each item's poster as SVG at runtime
                    from its title/date/venue/emoji, by category style.
app.js              UI layer: map, pins, popups, sidebar cards, filters.
supabase/schema.sql The database: table, security policy, storage bucket, seed rows.
```

Script order in `index.html` matters: `config → seed → posters → data → app`.

## Setup (one time, ~5 minutes)

1. Create a free account at https://supabase.com and click **New project**
   (any name, e.g. `eventos`; pick a region near you; the free tier is fine).
2. In the project, open **SQL Editor**, paste the whole contents of
   `supabase/schema.sql`, and click **Run**. This creates the `items` table,
   a read-only security policy, the public `posters` storage bucket, and
   inserts the 18 current items.
3. Open **Project Settings → API** and copy two values:
   - **Project URL** (like `https://abcdefgh.supabase.co`)
   - **anon / public** key (the long string)
4. Paste both into `config.js`, commit, and merge to `main`.

Until step 4 is done — and any time Supabase is unreachable — the app
automatically uses the bundled data in `seed.js`, so the site never breaks.

The anon key is safe to publish: row level security only permits `SELECT`,
so visitors can read events but nothing can be changed with that key.

## Managing content

Add/edit rows in **Supabase → Table Editor → items**. Changes appear on the
site on the next page load — no deploy needed. Fields:

| column     | meaning                                                        |
|------------|----------------------------------------------------------------|
| type       | `event` or `place`                                             |
| category   | free text; a filter chip appears automatically per category    |
| emoji      | shown on cards, used as poster centerpiece and pin fallback    |
| time_label | human text shown in the UI, e.g. `Tonight · 9:00 PM`           |
| start_date / end_date | inclusive range for the date filters; null for places |
| status     | `live` (running), `soon` (upcoming — gets a badge), `open` (places) |
| heat       | 0–100 popularity; drives the red glow size on the map          |
| ticket_url | where the button goes (events: "Get tickets", places: "Explore") |
| poster_ref | `template:<name>` or a full image URL (see Posters)            |

## Posters

Posters are **reusable templates**, rendered in the browser from each item's
data — a repeat event reuses its category's artwork with just a new date.
Available templates (`poster_ref` values):

- `template:football` — pitch green + gold (football, padel, sports)
- `template:concert` — purple/teal stage light
- `template:candlelight` — warm amber lanterns (food, heritage)
- `template:family` — playful pink/blue
- `template:exhibition` — dark neon (esports, comedy, cinema, expos)
- `template:place` — calm blue/silver explore card (no date)

Each renders the item's title, date line, venue, and its emoji as the hero,
in that category's style. To design a new template, add a theme to
`POSTER_THEMES` in `posters.js`.

**Real poster images** (photos, official artwork) go in **Supabase Storage**,
not the repo: Dashboard → Storage → `posters` bucket → Upload, then copy the
file's public URL into the item's `poster_ref`. If an image URL fails to
load, the pin falls back to the emoji badge and the popup hides the image.

## Referral tracking (the money foundation)

Every "Get tickets" / "Explore" tap:

- goes out with `utm_source=eventos-khobar&utm_medium=referral` appended, so
  the destination platform can see the visit came from this site — the basis
  for affiliate/partner conversations;
- is logged to the `clicks` table (see `supabase/clicks.sql` — paste it in
  the SQL editor once). Visitors can only insert, never read. Check your
  numbers anytime with:

  ```sql
  select i.title, count(c.id) as clicks
  from public.clicks c join public.items i on i.id = c.item_id
  group by i.title order by clicks desc;
  ```

To earn per ticket: Platinumlist runs an affiliate program (~10% per referred
sale) — put your personalised tracking links in `ticket_url` for events
listed there. webook has no public affiliate program; use your click numbers
to pitch a partnership. Deep-link `ticket_url` to the specific event page,
never a homepage.

## Geocoding (free — OpenStreetMap Nominatim)

Coordinates are never typed by hand:

- **Fixing existing places**: `scripts/geocode-places.js` reads every
  `type='place'` row, queries the free
  [Nominatim](https://nominatim.org) geocoder (no API key) with
  "title, venue, Saudi Arabia" — falling back to just the title — and writes
  the top result's lat/lon back, logging every change as `Old → New`. Rows
  with no match are left unchanged and listed as warnings for manual fixing.
  Event rows are never touched. It respects Nominatim's usage policy: max
  1 request/second and an identifying `User-Agent`. Results are bounded to
  an Eastern-Province box so a same-named place elsewhere can't be matched.

  ```
  SUPABASE_SERVICE_ROLE_KEY=<service key> node scripts/geocode-places.js
  node scripts/geocode-places.js --dry-run   # preview only, no key needed
  ```

  The service role key (Project Settings → API) is needed to write, because
  the public anon key is read-only. Never commit it. Tip: names in
  OpenStreetMap are often Arabic — if a place won't match, try its Arabic
  name in the Supabase Table Editor search, or fix lat/lng by hand there.

- **Importing events from listing sites**: `scripts/import-events.js` scans
  public Eastern-Province listing pages (Platinumlist Dammam by default —
  edit `SOURCES` at the top) for schema.org **JSON-LD Event data**, which
  ticketing sites embed for search engines and which is far more stable than
  scraping HTML. Each new event is mapped to the items schema (category/
  emoji/poster template inferred from the title; the listing's poster image
  is used as `poster_ref` when present), its venue is **geocoded via
  Nominatim** (never hardcoded), and it's inserted with `id = max + 1`.
  Safe to re-run: events already in the table (same title or ticket URL),
  past events, events outside Dammam/Khobar/Dhahran, and venues Nominatim
  can't find are skipped, each with a log line.

  ```
  SUPABASE_SERVICE_ROLE_KEY=<service key> node scripts/import-events.js
  node scripts/import-events.js --dry-run   # preview only, no key needed
  ```

- **Submitting new places**: `submit.html` is the submission flow (currently
  an admin stub). The user types a name/address — never coordinates — the
  page geocodes it via Nominatim, drops a draggable pin on a map preview so
  the spot can be nudged, then generates the SQL `insert` to paste into the
  Supabase SQL editor. To open it to real users later, replace the SQL step
  with an insert into a moderated `suggestions` table.

## AR view (experimental — ar.html)

A standalone screen (the AR button on the map opens it; the map code is
untouched). It uses the phone camera as a live background, the device
compass + GPS to work out the user's position and facing, and draws a
**vertical beam of light** rising into the sky from every item within
~45 km at its real-world bearing (Midnight Club style). Beam width, glow
and brightness scale with the item's heat and proximity; places are cool
teal→violet, events hot red→gold. The horizon follows the phone's tilt
(beta) so beam bases stay pinned to the skyline, and each base fades in
from nothing so foreground buildings appear to swallow it — only the
upper glow shows over the skyline. Labels appear on the three nearest
beams only; tapping a beam's chip opens the same detail card as the map
popup. True per-building occlusion (hiding a beam an obstacle really
blocks) would need 3D building data — a possible later step is
OpenStreetMap building footprints + heights with a line-of-sight check.

**Sea dragon (experimental scene — dragon.js)**: an original, code-drawn
dragon silhouette (SVG — sinuous body, horned head, ember eye, scalloped
bat wings that beat) endlessly patrols an elliptical loop over the sea
off the Khobar corniche, ~110 m up, one lap every 4 minutes. Its position
on the loop comes from the wall clock, so everyone who opens the link
sees the SAME dragon at the same point of its flight, each from their own
angle. Perspective is real: it sweeps close to the shore (big), heads out
to sea (small), and beyond ~9 km can't be seen at all; apparent size is
`boost`-exaggerated with a `minPx` floor so phones can enjoy it. It faces
its direction of travel, climbs and dives along the lap, and rides the
tilt-tracked horizon. When it's in range but out of frame, an edge chip
("🐉 Dragon 2.1 km →", or "tilt up ↑") points the way. All artwork is
original — styled after fantasy dragon silhouettes generally, copied from
nothing. Tune everything in the `DRAGON` config block. It sits over the sea so buildings rarely block the
sight line; per-building occlusion and indoor detection aren't possible
in a mobile browser (no depth sensing) — a native ARKit app would be
needed for that. Edit the `SKY_ART` constants to move or resize it.

Permissions: camera, motion/compass and location are all requested on
"Start AR". On iOS the motion prompt only appears while the tap that
triggered it is still "live", so `ar.js` fires
`DeviceOrientationEvent.requestPermission()` synchronously in the tap
handler — before awaiting the camera — and reads the answer afterwards.
If Safari never shows the prompt (the global **Settings → Safari →
Motion & Orientation Access** toggle is off) that is detected and named
specifically. Camera refusals show a friendly message.

Location is fetched patiently: a recent cached fix is accepted (AR works
at km scale), and a high-accuracy timeout triggers one coarse, patient
retry — with a "still getting a GPS fix" hint — before giving up. A real
refusal (permission denied) fails immediately with the exact iOS settings
path; a device that simply can't get a fix (indoors, in a car) gets its
own "No GPS fix — try again" message instead.

No compass is not fatal: whether the permission was refused, the prompt
was blocked, or the device simply has no magnetometer, AR switches to a
**drag-to-look** mode — the view starts aimed at the nearest item and the
user drags the screen to pan (one screen width ≈ one field of view), with
a dismissible hint explaining what happened.

Browser differences are handled (`IS_IOS` / `IS_CRIOS` / `IS_ANDROID` in
`ar.js`): every stuck-permission message names the settings path for
*that* browser — Safari iOS ("aA" menu / Settings → Safari), Chrome on
iPhone (Settings app → Chrome: Camera, Location, **Motion & Fitness** —
Chrome iOS gates motion at the app level), Android Chrome (lock icon →
Permissions; Motion sensors under Site settings). Android Chrome's
compass often reports rotation without a true north reference — in that
case AR uses the sensor **relatively**: the view turns with the phone,
starts aimed at the nearest item, and one drag rotates the world to line
it up with reality (the sensor keeps steering from the corrected offset).

## Filters (app.js)

Three chip rows combine with AND logic:

- **Type**: All / Events / Places.
- **When**: Any time / Today / This weekend / Next weekend. The weekend is
  **Friday–Saturday** (Saudi weekend). An event matches if its
  `start_date`–`end_date` range overlaps the window; places always match.
- **Category**: built automatically from the data; horizontally scrollable.

Event cards running today get a "Today" badge; upcoming ones (`status =
soon`) get a "Soon" badge.

## Local development

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Without Supabase keys in `config.js` you'll see the seed data — which is the
same content, so everything is testable offline.
