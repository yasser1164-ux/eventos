# قطع · Qetaa — used car parts marketplace (Saudi Arabia)

A bilingual (Arabic-first, RTL) marketplace where buyers find **used car parts
by their exact car**, and scrapyards / parts shops list inventory and answer
part requests.

**Live:** https://yasser1164-ux.github.io/eventos/qetaa/
Plain HTML/CSS/JS — no build step, no framework, no server. It runs fully on
bundled demo data out of the box, and switches to a real multi-user backend
(Supabase) by filling two keys in one file.

---

## 1. Why this shape

The used-parts trade here is big, profitable and completely **unwritten**. It
runs on phone calls and WhatsApp groups:

| Today | The cost |
|---|---|
| Buyer calls 5–10 yards asking "عندك صدام كامري ٢٠١٦؟" | hours per part, no price transparency |
| Yard answers 50 calls a day for parts it doesn't have | wasted staff time |
| "نظيفة" is the only condition description | disputes, returns, distrust |
| Price is discovered only after you drive there | buyers overpay or give up and buy new |

Nobody needs to be convinced to change behaviour — they need the same trade
**written down and searchable**. So the product is deliberately narrow:

1. **Search by car** (make → model → year), not by keyword. A part either fits
   your car or it doesn't.
2. **Condition grades A–D** — one vocabulary both sides use.
3. **The request board (RFQ)** — the real wedge. Most searches on day one will
   fail, because inventory is thin. Instead of an empty results page, the buyer
   posts the request once and every seller in the city can quote it. That
   converts the platform's weakness (no inventory yet) into its main feature,
   and it's exactly how the WhatsApp groups already work — just organised.
4. **WhatsApp as the closing channel**, with the listing reference pre-written
   into the message. Don't fight how the market actually closes deals.

What is deliberately **not** in v1: payments, escrow, shipping, chat. Every one
of them adds operational load before there is liquidity to justify it.

---

## 2. The business model

**Revenue lines (in the order they should be switched on):**

| # | Line | Price | Why it works |
|---|---|---|---|
| 1 | Seller subscription | 199 / 499 / 999 SAR per month | The yard pays for *leads and space*, not for a sale it already made. Predictable, no enforcement problem. |
| 2 | Featured listing ("boost") | 29 SAR / 7 days | Impulse spend on a slow-moving expensive part. Needs no sales conversation. |
| 3 | Verification badge | bundled with paid plans | Buyers filter for it; sellers buy the plan to get it. |
| 4 | *Later:* delivery + protected payment | 5–8% of order | Only once there is enough volume and trust to run operations. |
| 5 | *Later:* B2B for workshops | monthly seats | Workshops buy parts daily; they're the highest-frequency buyer. |

**No commission on sales in v1.** This is a decision, not an oversight: the
platform cannot see or enforce an off-platform sale, so a commission would
just push both sides to hide the transaction and would poison the trust you
need early. Charge for the *lead*, not for the *sale*.

Plans are defined in one place — `assets/js/config.js` → `plans` — and
`pricing.html` renders itself from that, so the page and the app can never
disagree.

### Unit economics (the whole business on one line)

```
Monthly revenue = paying sellers × average plan price
Break-even      = monthly cost ÷ average plan price
```

Running cost of this stack, realistically:

| Item | Monthly |
|---|---|
| Hosting (GitHub Pages) | 0 SAR |
| Supabase (free tier → Pro at ~95 SAR when you outgrow it) | 0–95 SAR |
| Domain (.sa or .com) | ~10 SAR amortised |
| SMS OTP (only if you add phone login) | ~0.1 SAR per message |
| **Total to operate** | **under 150 SAR / month** |

So **one Basic seller (199 SAR) covers the whole infrastructure.** Everything
past that pays for your time and for acquisition. A realistic first-year
target: 40 paying sellers across 3 cities ≈ 12,000–16,000 SAR MRR. That is a
small business, not a unicorn — and it is reachable by one person.

### The numbers to watch (in priority order)

1. **Requests answered within 2 hours** — the single best predictor of whether
   buyers come back. Below ~60%, nothing else matters.
2. **Quotes per request** (target: 3+). One quote is not a market.
3. **Contact taps per listing** — logged as leads (`qetaa_leads`); this is what
   you show a yard when you ask them to pay.
4. Active listings per city (liquidity), and repeat buyers.

Vanity metrics to ignore: page views, registered users, total listings ever.

---

## 3. Go to market — the first 90 days

The classic marketplace trap is chasing both sides at once. Don't. **Supply
first, one city, on foot.**

**Days 1–30 — one city, 30 yards (Riyadh: حي السلي / الخرج road).**
Walk in. Don't sell a subscription; offer to list 10 parts for them for free,
photographed on your phone, with their WhatsApp on it. Your pitch is one
sentence: *"مكالمات أقل، وطلبات جاهزة توصلك."* Your goal is 300–500 real
listings and 20 yards with a page.

**Days 31–60 — demand, cheaply.**
Buyers are already searching. Post the request board into the existing
Facebook/WhatsApp/X car groups for that city ("اكتب طلبك مرة وحدة"). Answer
every request yourself by phoning yards if you have to — manual matchmaking
looks like magic and teaches you the real taxonomy. Target: 20 requests/week
with a median first quote under 2 hours.

**Days 61–90 — charge.**
Go back to the yards with their own numbers: *"وصلك ٤٧ طلب و١١٢ ضغطة تواصل
هذا الشهر."* Convert the top 10 to Basic. Keep everyone else free — free
sellers are inventory, and inventory is the product.

Then repeat the exact same 90 days in Dammam/Khobar, then Jeddah. One city at a
time; a marketplace that is thin everywhere is dead everywhere.

### Cold-start tricks already built into the product

- Generated SVG artwork so a listing without photos still looks like a
  catalogue entry (`assets/js/art.js`).
- The request board fills the "0 results" page with an action instead of a
  dead end (`search.html` → RFQ hint).
- Seller pages exist whether or not the seller ever logs in — they are a
  directory you can build *for* them, and a reason to call them.

---

## 4. Running it

### It already runs

Open `index.html` — that's it. With no configuration the site uses the bundled
catalogue in `assets/js/seed.js` plus this browser's local storage, and every
flow works end to end: list a part → it appears in search → post a request →
quote it → see it in your account. That is the demo you show a yard owner on
your phone, offline, in his shop.

```bash
# local preview with correct paths
npx http-server -p 8080 .          # then open http://127.0.0.1:8080/qetaa/
```

### Going live with a real database (about 10 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste `supabase/schema.sql` → Run. (Tables, row-level
   security, the photo bucket, the quote-counter trigger.)
3. **SQL Editor** → paste `supabase/seed.sql` → Run, if you want the demo
   catalogue in the database too. Skip it when you have real listings.
4. **Project Settings → API** → copy the **Project URL** and the **anon /
   public** key.
5. Paste both into `assets/js/config.js` → `data.supabaseUrl` /
   `data.supabaseAnonKey`. Commit.

The anon key is meant to be public — row level security decides what it can do
(read published listings, insert a pending listing, post a request or a quote,
never read anyone's phone book). If Supabase is unreachable the site silently
falls back to the bundled data, so it never shows a broken page.

New listings arrive as `status = 'pending'`. Publishing them is your
moderation step: Supabase → Table Editor → `qetaa_listings` → set
`status = 'published'`. Ten seconds per listing, and it is the difference
between a marketplace and a spam board.

### Deploying

Merging to `main` publishes the whole repository to GitHub Pages (see
`.github/workflows/pages.yml`); the site is live at
`/eventos/qetaa/` about a minute later. Moving to a custom domain later means
copying this folder to its own repo and changing `BASE` in `tools/build.js`.

---

## 5. How the code is organised

Pages are static HTML, generated from a shared shell so the header, footer and
tab bar can never drift apart:

```
tools/shell.html       the frame (head, header, nav, footer, tab bar, scripts)
tools/pages/*.html     one file per page: a <!--META--> block + the page body
tools/build.js         shell + page → the .html files at qetaa/ + sitemap.xml
tools/seed-sql.js      assets/js/seed.js → supabase/seed.sql (never hand-edit)
```

After editing anything in `tools/`, run:

```bash
node qetaa/tools/build.js      # rebuild the 16 pages and the sitemap
node qetaa/tools/seed-sql.js   # rebuild the SQL seed from the JS seed
```

The JavaScript is layered, loaded in this order on every page:

| File | Job |
|---|---|
| `config.js` | brand, contact details, plans, backend keys — the only file you normally edit |
| `taxonomy.js` | part categories, condition grades, origins, seller types, delivery, cities |
| `vehicles.js` | makes → models → year ranges (what drives the car pickers) |
| `art.js` | generates a listing's artwork as SVG when there is no photo |
| `seed.js` | the bundled demo catalogue (also the source of `supabase/seed.sql`) |
| `data.js` | **the only thing that talks to a backend.** Supabase when configured, local storage otherwise. Pages call `DB.*` and never care which |
| `lang-en.js` | every English string, keyed to the Arabic in the HTML |
| `i18n.js` | the bilingual engine: captures the Arabic in the page, swaps it, flips `dir` |
| `ui.js` | the shell (theme, drawer, toasts) + shared renderers (cards, stars, car pickers, WhatsApp links) |
| `pages/*.js` | one file per page, the only place with page-specific logic |

**Arabic is the source of truth.** The Arabic copy lives in the HTML, so the
page reads correctly with JavaScript off and for search engines; English comes
from `lang-en.js`. Add a `data-i18n="key"` to any element and the key to
`lang-en.js`. Seller-written content (part names, descriptions) is never
machine-translated — it stays as the seller typed it.

### Changing the catalogue

- **A new part category** → add it to `TAX.categories` in `taxonomy.js` *and* a
  silhouette with the same id to `SHAPES`/`TONES` in `art.js`.
- **A new make or model** → `vehicles.js`. Year ranges come from `from:`.
- **A new city** → `TAX.cities`. Filters, forms and the directory pick it up
  everywhere automatically.
- **Prices / plan limits** → `config.js`.

---

## 6. Operations you cannot skip

| Risk | The control that's already in the product |
|---|---|
| Spam and fake listings | listings insert as `pending`; you publish |
| Stolen parts | terms ban them; verification ties a seller to a CR number; keep the lead log |
| "Bait" pricing | listed price is binding (terms §2); repeat offenders lose the badge |
| Buyers pressured to transfer money | the safety guide is linked from every listing page |
| Dead listings after a sale | quantity + "sold" status; nudge sellers monthly |

Verification is manual and should stay manual for the first hundred sellers:
CR number, a photo of the shop, a phone call. It's the cheapest trust you can
buy.

---

## 7. Legal / compliance notes (Saudi Arabia)

Not legal advice — but the checklist you'll be asked about:

- **Register the activity** (commercial registration) before charging
  subscriptions, and comply with the **E-Commerce Law** (clear provider
  identity, clear pricing, records of transactions).
- **VAT** applies to your subscription revenue once you pass the registration
  threshold; issue compliant invoices.
- **PDPL (personal data)**: you hold names and mobile numbers. The privacy page
  states what is collected and why — keep it accurate, don't sell data, and be
  able to delete an account on request.
- The content rules in `terms.html` (no stolen parts, no deployed airbags, no
  counterfeit-as-genuine) exist for real liability reasons. Keep them.

Replace the placeholder contact details and the CR/VAT numbers in
`assets/js/config.js` before launch.

---

## 8. Roadmap

**v1 (this build)** — search by car, listings, seller pages, the request board
and quotes, favourites, account, bilingual, dark mode, mobile-first.

**v1.1 — the first things to add once real sellers are on it**
- Phone OTP login (Supabase Auth) instead of the device-local account.
- Seller dashboard on real data: which of my parts get views but no contacts.
- WhatsApp alerts to sellers when a matching request is posted (this is the
  feature people will pay for; a Supabase Edge Function + WhatsApp Business API).
- Photo upload straight to the `qetaa-parts` bucket instead of local storage.

**v2 — when liquidity exists**
- Delivery integration and protected payment (the 5–8% line).
- Workshop accounts with saved vehicles and repeat ordering.
- Price history per part: "كامري ٢٠١٦ صدام أمامي — متوسط ٤٥٠ ريال" is a
  genuinely defensible data asset once you have volume.
- Bulk inventory import for large yards (Excel → `qetaa_listings`).

---

## 9. Honest limitations of this build

- Without Supabase configured, everything a visitor adds lives **in their own
  browser only** — perfect for demos, useless as a real marketplace. Step 4 in
  §4 is what makes it multi-user.
- Listing photos are generated artwork until sellers upload real ones.
- The account is name + mobile stored locally; it is not authentication.
  Phone OTP is the v1.1 item above.
- Demo data (sellers, listings, requests) is illustrative and clearly labelled
  as such in the footer. Replace `seed.js` with real inventory before launch,
  or set `demoBanner: false` once the database is live.
