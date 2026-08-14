-- Eventos — Supabase schema + seed data
-- Paste this whole file into the Supabase SQL Editor and click Run.
-- Safe to re-run: it drops and recreates the items table.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
drop table if exists public.items;

create table public.items (
  id          bigint primary key,
  title       text not null,
  type        text not null check (type in ('event', 'place')),
  category    text not null,
  emoji       text not null,
  venue       text not null,
  time_label  text not null,             -- human label shown in the UI, e.g. "Tonight · 9:00 PM"
  start_date  date,                      -- events only; places leave null (always open)
  end_date    date,                      -- inclusive
  status      text not null default 'open' check (status in ('live', 'soon', 'open')),
  lat         double precision not null,
  lng         double precision not null,
  heat        integer not null default 50 check (heat between 0 and 100),
  ticket_url  text not null,
  poster_ref  text not null,             -- "template:<name>" or a full image URL
  created_at  timestamptz not null default now()
);

-- Read-only for the public site: anonymous visitors can SELECT, nothing else.
alter table public.items enable row level security;

create policy "Public read access"
  on public.items for select
  to anon
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for real poster images (public read)
-- Upload files via Dashboard → Storage → posters, then set an item's
-- poster_ref to the file's public URL.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('posters', 'posters', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Seed data (the 18 current items)
-- ---------------------------------------------------------------------------
insert into public.items
  (id, title, type, category, emoji, venue, time_label, start_date, end_date, status, lat, lng, heat, ticket_url, poster_ref) values
  (1,  'Al-Ettifaq vs Al-Riyadh',                          'event', 'Football', '⚽',  'Prince Mohamed bin Fahd Stadium, Dammam', 'Tonight · Aug 14',     '2026-08-14', '2026-08-14', 'live', 26.3927, 49.9777, 90, 'https://webook.com', 'template:football'),
  (2,  'Live Music Night',                                 'event', 'Concert',  '🎸', 'Al Khobar Corniche',                      'Tonight · 9:00 PM',    '2026-08-14', '2026-08-14', 'live', 26.2870, 50.2130, 70, 'https://webook.com', 'template:concert'),
  (3,  'Food & Culture Festival',                          'event', 'Festival', '🍜', 'Al Rashid Mall Plaza',                    'This weekend',         '2026-08-14', '2026-08-15', 'live', 26.3050, 50.1980, 55, 'https://webook.com', 'template:candlelight'),
  (4,  'Padel Championship',                               'event', 'Sports',   '🎾', 'Khobar Sports Hub',                       'Tomorrow · 5:00 PM',   '2026-08-15', '2026-08-15', 'soon', 26.2680, 50.2200, 40, 'https://webook.com', 'template:football'),
  (5,  'Esports Showdown',                                 'event', 'Esports',  '🎮', 'Dhahran Expo',                            'Saturday · 7:00 PM',   '2026-08-15', '2026-08-15', 'soon', 26.3016, 50.1477, 75, 'https://webook.com', 'template:exhibition'),
  (6,  'Comedy Night',                                     'event', 'Comedy',   '🎤', 'Ajdan Walk, Al Khobar',                   'Fri Aug 21 · 9:00 PM', '2026-08-21', '2026-08-21', 'soon', 26.2986, 50.2211, 60, 'https://webook.com', 'template:exhibition'),
  (7,  'Heritage Nights',                                  'event', 'Heritage', '🏮', 'Heritage Village, Dammam',                'Daily · 6–11 PM',      '2026-08-14', '2026-09-30', 'live', 26.4344, 50.1032, 50, 'https://webook.com', 'template:candlelight'),
  (8,  'Open-Air Cinema',                                  'event', 'Cinema',   '🎬', 'Khobar Sea Front',                        'Thu–Sat · 8:00 PM',    '2026-08-13', '2026-09-26', 'live', 26.2570, 50.2090, 45, 'https://webook.com', 'template:exhibition'),
  (9,  'Global City Dammam',                               'event', 'Festival', '🌍', 'Global City, Dammam',                     'Daily · 4 PM–12 AM',   '2026-08-14', '2026-10-31', 'live', 26.4140, 50.0920, 80, 'https://webook.com/en/zones/global-city-dammam-2026', 'template:family'),
  (10, 'The Big Bounce Arabia',                            'event', 'Family',   '🎈', 'Al Khobar',                               'Aug 20–29',            '2026-08-20', '2026-08-29', 'soon', 26.2790, 50.2060, 65, 'https://webook.com/en/events/the-big-bounce-arabia-alkhobar-25', 'template:family'),
  (11, 'Ithra — King Abdulaziz Center for World Culture',  'place', 'Culture',  '🏛️', 'Gharb Al Dhahran, Dhahran',               'Open daily',           null, null, 'open', 26.3269, 50.1287, 65, 'https://www.ithra.com/en', 'template:place'),
  (12, 'Scitech',                                          'place', 'Science',  '🔭', 'Khobar Corniche',                         'Open daily',           null, null, 'open', 26.2934, 50.2145, 55, 'https://webook.com', 'template:place'),
  (13, 'Khobar Water Tower',                               'place', 'Landmark', '🗼', 'Al Khobar Corniche',                      'Best at sunset',       null, null, 'open', 26.2907, 50.2172, 50, 'https://webook.com', 'template:place'),
  (14, 'Half Moon Bay',                                    'place', 'Beach',    '🏖️', 'Dhahran Coast',                           'Open all day',         null, null, 'open', 26.1436, 50.0339, 60, 'https://webook.com', 'template:place'),
  (15, 'Marjan Island',                                    'place', 'Island',   '🏝️', 'Dammam Corniche',                         'Open all day',         null, null, 'open', 26.4893, 50.1155, 45, 'https://webook.com', 'template:place'),
  (16, 'Dolphin Village',                                  'place', 'Family',   '🐬', 'Aziziyah, Al Khobar',                     'Shows daily',          null, null, 'open', 26.1610, 50.1905, 55, 'https://webook.com', 'template:place'),
  (17, 'Tarout Island & Castle',                           'place', 'Heritage', '🏰', 'Tarout, Qatif',                           'Open all day',         null, null, 'open', 26.5700, 50.0620, 45, 'https://webook.com', 'template:place'),
  (18, 'King Fahd Park',                                   'place', 'Park',     '🌳', 'North Dammam',                            'Open till late',       null, null, 'open', 26.4046, 50.0779, 50, 'https://webook.com', 'template:place');
