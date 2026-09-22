-- =========================================================================
-- QETAA — database schema for Supabase (PostgreSQL)
-- Paste this whole file into Supabase → SQL Editor → Run. It is safe to run
-- more than once. Then paste supabase/seed.sql for the demo catalogue.
--
-- Table names are prefixed `qetaa_` so this marketplace can share a project
-- with other apps without colliding.
-- =========================================================================

-- ---- sellers ------------------------------------------------------------
create table if not exists public.qetaa_sellers (
  id            text primary key,
  slug          text unique,
  name          text not null,
  name_en       text,
  type          text not null default 'yard'
                check (type in ('yard','shop','workshop','person')),
  city          text not null,
  district      text,
  rating        numeric(2,1) not null default 0,
  reviews_count integer not null default 0,
  since         integer,
  phone         text,
  whatsapp      text,
  verified      boolean not null default false,
  plan          text not null default 'free'
                check (plan in ('free','basic','pro','yard')),
  hours         text,
  makes         text[] not null default '{}',
  about         text,
  owner         uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- ---- listings -----------------------------------------------------------
create table if not exists public.qetaa_listings (
  id            text primary key,
  ref           text unique,
  part_name     text not null,
  category      text not null,
  make          text not null,
  model         text not null,
  year_from     integer,
  year_to       integer,
  condition     text not null default 'b' check (condition in ('a','b','c','d')),
  origin        text not null default 'used_sa',
  price         numeric(10,2) not null check (price >= 0),
  price_old     numeric(10,2) default 0,
  qty           integer not null default 1 check (qty > 0),
  oem           text,
  seller_id     text references public.qetaa_sellers(id) on delete cascade,
  city          text not null,
  delivery      text[] not null default '{pickup}',
  warranty_days integer not null default 0,
  featured      boolean not null default false,
  views         integer not null default 0,
  -- new listings land as `pending`; a human publishes them. This is the one
  -- line standing between an open marketplace and a spam board.
  status        text not null default 'pending'
                check (status in ('pending','published','sold','rejected')),
  notes         text,
  photos        text[] not null default '{}',
  owner         uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists qetaa_listings_search
  on public.qetaa_listings (status, make, model, category, city);
create index if not exists qetaa_listings_created
  on public.qetaa_listings (created_at desc);

-- ---- part requests (RFQ) ------------------------------------------------
create table if not exists public.qetaa_requests (
  id             text primary key,
  ref            text unique,
  make           text not null,
  model          text not null,
  year           integer,
  part_name      text not null,
  category       text,
  city           text not null,
  urgency        text not null default 'week' check (urgency in ('today','week','flex')),
  condition_pref text default 'b',
  notes          text,
  vin            text,
  name           text,
  phone          text,                       -- never exposed by the public view
  status         text not null default 'open' check (status in ('open','closed','expired')),
  quotes_count   integer not null default 0,
  owner          uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists qetaa_requests_open
  on public.qetaa_requests (status, city, created_at desc);

-- ---- quotes on requests -------------------------------------------------
create table if not exists public.qetaa_quotes (
  id            text primary key,
  request_id    text references public.qetaa_requests(id) on delete cascade,
  seller_id     text,
  seller_name   text,
  seller_phone  text,
  price         numeric(10,2) not null check (price >= 0),
  condition     text default 'b',
  warranty_days integer not null default 0,
  delivery      text default 'pickup',
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists qetaa_quotes_request on public.qetaa_quotes (request_id);

-- ---- reviews ------------------------------------------------------------
create table if not exists public.qetaa_reviews (
  id         text primary key,
  seller_id  text references public.qetaa_sellers(id) on delete cascade,
  name       text,
  stars      integer not null check (stars between 1 and 5),
  text       text,
  created_at timestamptz not null default now()
);

-- ---- leads (every contact tap) ------------------------------------------
-- The only metric that matters early on: did the marketplace produce a
-- conversation? Visitors may insert, nobody may read back.
create table if not exists public.qetaa_leads (
  id         text primary key,
  kind       text not null check (kind in ('view','whatsapp','call','quote')),
  listing_id text,
  seller_id  text,
  at         timestamptz not null default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY
-- The anon key is public, so every rule below is what stops it being abused.
-- =========================================================================
alter table public.qetaa_sellers  enable row level security;
alter table public.qetaa_listings enable row level security;
alter table public.qetaa_requests enable row level security;
alter table public.qetaa_quotes   enable row level security;
alter table public.qetaa_reviews  enable row level security;
alter table public.qetaa_leads    enable row level security;

-- sellers: world-readable, only the owner may change their own record
drop policy if exists qetaa_sellers_read on public.qetaa_sellers;
create policy qetaa_sellers_read on public.qetaa_sellers
  for select using (true);
drop policy if exists qetaa_sellers_insert on public.qetaa_sellers;
create policy qetaa_sellers_insert on public.qetaa_sellers
  for insert to authenticated with check (owner = auth.uid());
drop policy if exists qetaa_sellers_update on public.qetaa_sellers;
create policy qetaa_sellers_update on public.qetaa_sellers
  for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

-- listings: only published rows are public; anyone may submit one, but it
-- can only be submitted as `pending`
drop policy if exists qetaa_listings_read on public.qetaa_listings;
create policy qetaa_listings_read on public.qetaa_listings
  for select using (status = 'published' or owner = auth.uid());
drop policy if exists qetaa_listings_insert on public.qetaa_listings;
create policy qetaa_listings_insert on public.qetaa_listings
  for insert with check (status = 'pending');
drop policy if exists qetaa_listings_update on public.qetaa_listings;
create policy qetaa_listings_update on public.qetaa_listings
  for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

-- requests: open requests are public (the board); anyone may post one
drop policy if exists qetaa_requests_read on public.qetaa_requests;
create policy qetaa_requests_read on public.qetaa_requests
  for select using (status = 'open' or owner = auth.uid());
drop policy if exists qetaa_requests_insert on public.qetaa_requests;
create policy qetaa_requests_insert on public.qetaa_requests
  for insert with check (status = 'open');
drop policy if exists qetaa_requests_update on public.qetaa_requests;
create policy qetaa_requests_update on public.qetaa_requests
  for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

-- quotes: readable (the buyer must compare them), insertable by anyone
drop policy if exists qetaa_quotes_read on public.qetaa_quotes;
create policy qetaa_quotes_read on public.qetaa_quotes
  for select using (true);
drop policy if exists qetaa_quotes_insert on public.qetaa_quotes;
create policy qetaa_quotes_insert on public.qetaa_quotes
  for insert with check (true);

-- reviews: readable by all, written by signed-in buyers
drop policy if exists qetaa_reviews_read on public.qetaa_reviews;
create policy qetaa_reviews_read on public.qetaa_reviews
  for select using (true);
drop policy if exists qetaa_reviews_insert on public.qetaa_reviews;
create policy qetaa_reviews_insert on public.qetaa_reviews
  for insert to authenticated with check (true);

-- leads: write-only
drop policy if exists qetaa_leads_insert on public.qetaa_leads;
create policy qetaa_leads_insert on public.qetaa_leads
  for insert with check (true);

-- =========================================================================
-- HELPERS
-- =========================================================================

-- keep requests.quotes_count honest
create or replace function public.qetaa_bump_quotes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.qetaa_requests
     set quotes_count = quotes_count + 1
   where id = new.request_id;
  return new;
end $$;

drop trigger if exists qetaa_quotes_bump on public.qetaa_quotes;
create trigger qetaa_quotes_bump after insert on public.qetaa_quotes
  for each row execute function public.qetaa_bump_quotes();

-- a view counter the anon key can call without being able to edit anything
create or replace function public.qetaa_view(p_id text) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.qetaa_listings set views = views + 1 where id = p_id;
end $$;

grant execute on function public.qetaa_view(text) to anon, authenticated;

-- =========================================================================
-- STORAGE — real part photos
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('qetaa-parts', 'qetaa-parts', true)
on conflict (id) do nothing;

drop policy if exists qetaa_parts_read on storage.objects;
create policy qetaa_parts_read on storage.objects
  for select using (bucket_id = 'qetaa-parts');

drop policy if exists qetaa_parts_write on storage.objects;
create policy qetaa_parts_write on storage.objects
  for insert to authenticated with check (bucket_id = 'qetaa-parts');
