# Eventos

A map of what's happening in the Eastern Province (Khobar · Dammam · Dhahran):
events with poster pins, plus good places to visit. Built with plain
HTML/CSS/JS and [Leaflet](https://leafletjs.com) — no build step, no
frameworks.

**Live site:** https://eventos-khobar.netlify.app
(auto-deploys from `main` via Netlify — merge to `main` and it's live in ~1 minute)

## Files

```
index.html    The page skeleton: top bar, sidebar, filter chips, map container.
styles.css    All styling, including mobile layout (breakpoint at 720px).
app.js        All behavior: Leaflet map, pins, popups, sidebar cards, filters.
events.js     ONLY the data — one object per event/place. Edit this to add content.
img/          One SVG poster per item, named after it (e.g. comedy-night.svg).
```

`index.html` loads `events.js` **before** `app.js` (the logic reads the
`EVENTS` array), so keep that script order.

## How to add an event or place

1. Open `events.js`, copy an existing block, and change the values:
   - `id` — any unused number.
   - `type` — `"event"` (something happening) or `"place"` (somewhere to visit).
   - `category` — free text; a filter chip is created automatically for
     each distinct category.
   - `emoji` — shown on the sidebar card, and on the map pin if the poster
     image fails to load.
   - `lat` / `lng` — position on the map.
   - `heat` — 0–100 popularity; drives the red glow size on the map.
   - `start` / `end` — ISO dates (`YYYY-MM-DD`, inclusive) the event runs.
     Used by the Today / This weekend / Next weekend filter. **Places omit
     these** — they're treated as always open and match every date filter.
   - `image` — path to the poster, e.g. `img/my-event.svg`.
   - `ticketUrl` — where the CTA button goes (events say "Get tickets",
     places say "Explore").
2. Add a poster in `img/` (see below).
3. Open `index.html` locally to check, then commit and merge to `main`.

## Posters

All posters are hand-coded SVGs, 600×800 (3:4 portrait). Two templates:

- **Event poster** (see `comedy-night.svg`): two-tone condensed uppercase
  title → date line between two thin rules → letter-spaced venue line →
  hero artwork in the vertical center → thin divider → bottom info strip
  with three icon segments (calendar+date | pin+venue | themed icon+tagline).
- **Place card** (see `ithra.svg`): calmer — letter-spaced name, small
  subtitle, hero artwork, thin divider, tagline and pin+city. No date.

Keep the hero artwork centered vertically: the map pin shows a round
center-crop of the poster, so the middle of the image is what reads at 44px.
Dark backgrounds, one accent color per poster, subtle grain
(`feTurbulence` filter) — match the existing files for consistency.

## Filters (app.js)

Three chip rows combine with AND logic:

- **Type**: All / Events / Places.
- **When**: Any time / Today / This weekend / Next weekend. The weekend is
  **Friday–Saturday** (Saudi weekend). An event matches if its
  `start`–`end` range overlaps the window; places always match.
- **Category**: built automatically from the data; horizontally scrollable.

Sidebar cards of events running today get a "Today" badge.

## Local development

Any static server works:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

(Directly opening `index.html` as a file also works.)
