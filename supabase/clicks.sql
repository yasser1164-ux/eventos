-- Click tracking: every "Get tickets" / "Explore" tap is logged so the site
-- owner can prove referral traffic to ticketing platforms and venues.
-- Paste this into the Supabase SQL Editor and Run (safe to re-run).
create table if not exists public.clicks (
  id bigint generated always as identity primary key,
  item_id bigint,
  clicked_at timestamptz not null default now()
);

alter table public.clicks enable row level security;

drop policy if exists "Anyone can log a click" on public.clicks;
create policy "Anyone can log a click"
  on public.clicks for insert
  to anon
  with check (true);

-- Handy view of clicks per item (run in the SQL editor to see your numbers):
--   select i.title, count(c.id) as clicks
--   from public.clicks c join public.items i on i.id = c.item_id
--   group by i.title order by clicks desc;
