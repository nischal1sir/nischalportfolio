-- Nischal Rai Portfolio — Database schema (Supabase / Postgres)
-- Run this in the Supabase SQL editor (or psql) to create the required tables.
--
-- Tables:
--   1. projects          (existing — created by earlier setup)
--   2. gallery           (existing — created by earlier setup)
--   3. contact_messages  (NEW — required for the Let's Talk contact form)

-- =============================================================================
-- contact_messages
-- =============================================================================
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  subject     text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

-- Helpful indexes for browsing submissions later.
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_email_idx
  on public.contact_messages (email);

-- Row Level Security. By default the API uses the service role key (bypasses RLS),
-- so this is a baseline policy. Adjust to your deployment model as needed.
alter table public.contact_messages enable row level security;

-- Anyone may insert a contact message via the public anon role (if you choose
-- to expose the backend anonymously). Select is restricted to authenticated/admin.
drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read contact messages" on public.contact_messages;
create policy "Authenticated can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (true);

-- =============================================================================
-- projects (reference — create if it does not already exist)
-- =============================================================================
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  short_description text,
  image_url       text,
  github_url      text,
  live_url        text,
  technologies     text[] default '{}',
  category        text,
  featured        boolean default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =============================================================================
-- gallery (reference — create if it does not already exist)
-- =============================================================================
create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text not null,
  category    text,
  order_index integer default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
