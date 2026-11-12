-- ============================================================
-- One Piece RSVP App — Supabase Postgres Schema
-- Paste this into Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  epithet     text not null,
  bounty      bigint not null default 30000000,
  avatar      text not null default 'luffy',
  attending   text not null check (attending in ('yes', 'no')),
  plus_ones   integer not null default 0 check (plus_ones >= 0 and plus_ones <= 2),
  message     text,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (RLS) with no public policies.
-- All reads & writes go through Next.js Server Actions using SUPABASE_SERVICE_ROLE_KEY,
-- so guests cannot scrape the guest list from the browser.
alter table public.rsvps enable row level security;

-- Helpful index for sorting by newest first on the Captain dashboard
create index if not exists idx_rsvps_created_at on public.rsvps (created_at desc);

