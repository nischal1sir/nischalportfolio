-- Nischal Rai Portfolio - Complete Database Schema (Supabase / Postgres)
-- Run this in the Supabase SQL editor to create all required tables.
-- This file contains DDL only (no seed data). Run seed.sql separately for initial data.

-- =============================================================================
-- OPTIONAL RESET (uncomment to drop all tables before re-running)
-- =============================================================================
-- DROP TABLE IF EXISTS public.contact_messages CASCADE;
-- DROP TABLE IF EXISTS public.nav_links CASCADE;
-- DROP TABLE IF EXISTS public.faqs CASCADE;
-- DROP TABLE IF EXISTS public.gallery CASCADE;
-- DROP TABLE IF EXISTS public.social_links CASCADE;
-- DROP TABLE IF EXISTS public.services CASCADE;
-- DROP TABLE IF EXISTS public.education CASCADE;
-- DROP TABLE IF EXISTS public.experiences CASCADE;
-- DROP TABLE IF EXISTS public.projects CASCADE;
-- DROP TABLE IF EXISTS public.soft_skills CASCADE;
-- DROP TABLE IF EXISTS public.skills CASCADE;
-- DROP TABLE IF EXISTS public.progression_items CASCADE;
-- DROP TABLE IF EXISTS public.philosophy_items CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- =============================================================================
-- extensions
-- =============================================================================
create extension if not exists "uuid-ossp";

-- =============================================================================
-- profiles
-- =============================================================================
create table if not exists public.profiles (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  role            text not null,
  taglines        text[] not null default '{}',
  headline        text not null,
  intro           text not null,
  about           text not null,
  resume_url      text,
  location        text not null,
  email           text not null,
  interests       text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Public read profile" on public.profiles;
create policy "Public read profile"
  on public.profiles for select
  using (true);

drop policy if exists "Admin write profile" on public.profiles;
create policy "Admin write profile"
  on public.profiles for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- philosophy_items
-- =============================================================================
create table if not exists public.philosophy_items (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  description     text not null,
  icon            text not null,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists philosophy_items_profile_id_idx on public.philosophy_items (profile_id);
create index if not exists philosophy_items_order_idx on public.philosophy_items (order_index);

alter table public.philosophy_items enable row level security;

drop policy if exists "Public read philosophy" on public.philosophy_items;
create policy "Public read philosophy"
  on public.philosophy_items for select
  using (true);

drop policy if exists "Admin write philosophy" on public.philosophy_items;
create policy "Admin write philosophy"
  on public.philosophy_items for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- progression_items
-- =============================================================================
create table if not exists public.progression_items (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  step            text not null,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists progression_items_profile_id_idx on public.progression_items (profile_id);
create index if not exists progression_items_order_idx on public.progression_items (order_index);

alter table public.progression_items enable row level security;

drop policy if exists "Public read progression" on public.progression_items;
create policy "Public read progression"
  on public.progression_items for select
  using (true);

drop policy if exists "Admin write progression" on public.progression_items;
create policy "Admin write progression"
  on public.progression_items for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- skills
-- =============================================================================
create table if not exists public.skills (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  category        text not null check (category in ('language', 'frontend', 'backend', 'database', 'tools', 'learning', 'exploring')),
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists skills_category_idx on public.skills (category);
create index if not exists skills_order_idx on public.skills (order_index);

alter table public.skills enable row level security;

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills"
  on public.skills for select
  using (true);

drop policy if exists "Admin write skills" on public.skills;
create policy "Admin write skills"
  on public.skills for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- soft_skills
-- =============================================================================
create table if not exists public.soft_skills (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text not null,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists soft_skills_order_idx on public.soft_skills (order_index);

alter table public.soft_skills enable row level security;

drop policy if exists "Public read soft_skills" on public.soft_skills;
create policy "Public read soft_skills"
  on public.soft_skills for select
  using (true);

drop policy if exists "Admin write soft_skills" on public.soft_skills;
create policy "Admin write soft_skills"
  on public.soft_skills for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- projects
-- =============================================================================
create table if not exists public.projects (
  id              text primary key,
  title           text not null,
  description     text not null,
  short_description text not null,
  image_url       text not null,
  github_url      text,
  live_url        text,
  technologies    text[] not null default '{}',
  category        text not null,
  featured        boolean not null default false,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_order_idx on public.projects (order_index);

alter table public.projects enable row level security;

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
  on public.projects for select
  using (true);

drop policy if exists "Admin write projects" on public.projects;
create policy "Admin write projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- experiences
-- =============================================================================
create table if not exists public.experiences (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in ('freelance', 'internship', 'role')),
  role            text not null,
  company         text not null,
  company_url     text,
  period          text not null,
  location        text not null,
  description     text not null,
  highlights      text[] not null default '{}',
  technologies    text[] not null default '{}',
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists experiences_order_idx on public.experiences (order_index);

alter table public.experiences enable row level security;

drop policy if exists "Public read experiences" on public.experiences;
create policy "Public read experiences"
  on public.experiences for select
  using (true);

drop policy if exists "Admin write experiences" on public.experiences;
create policy "Admin write experiences"
  on public.experiences for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- education
-- =============================================================================
create table if not exists public.education (
  id              uuid primary key default gen_random_uuid(),
  institution     text not null,
  degree          text not null,
  period          text not null,
  location        text not null,
  faculty         text,
  status          text,
  highlights      text[] not null default '{}',
  subjects        text[],
  icon            text not null default 'GraduationCap',
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists education_order_idx on public.education (order_index);

alter table public.education enable row level security;

drop policy if exists "Public read education" on public.education;
create policy "Public read education"
  on public.education for select
  using (true);

drop policy if exists "Admin write education" on public.education;
create policy "Admin write education"
  on public.education for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- services
-- =============================================================================
create table if not exists public.services (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  icon            text not null,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists services_order_idx on public.services (order_index);

alter table public.services enable row level security;

drop policy if exists "Public read services" on public.services;
create policy "Public read services"
  on public.services for select
  using (true);

drop policy if exists "Admin write services" on public.services;
create policy "Admin write services"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- social_links
-- =============================================================================
create table if not exists public.social_links (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,
  href            text not null,
  icon            text not null,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists social_links_order_idx on public.social_links (order_index);

alter table public.social_links enable row level security;

drop policy if exists "Public read social_links" on public.social_links;
create policy "Public read social_links"
  on public.social_links for select
  using (true);

drop policy if exists "Admin write social_links" on public.social_links;
create policy "Admin write social_links"
  on public.social_links for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- gallery
-- =============================================================================
create table if not exists public.gallery (
  id              text primary key,
  title           text not null,
  description     text,
  image_url       text not null,
  category        text not null,
  tags            text[] not null default '{}',
  featured        boolean not null default false,
  order_index     integer not null default 0,
  shape           text not null default 'medium_square',
  width           integer not null default 4,
  height          integer not null default 3,
  position_x      integer default null,
  position_y      integer default null,
  z_index         integer not null default 1,
  object_fit      text not null default 'cover',
  object_position text not null default 'center',
  is_visible      boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Alter table columns for existing database tables
alter table public.gallery add column if not exists shape text not null default 'medium_square';
alter table public.gallery add column if not exists width integer not null default 4;
alter table public.gallery add column if not exists height integer not null default 3;
alter table public.gallery add column if not exists position_x integer default null;
alter table public.gallery add column if not exists position_y integer default null;
alter table public.gallery add column if not exists z_index integer not null default 1;
alter table public.gallery add column if not exists object_fit text not null default 'cover';
alter table public.gallery add column if not exists object_position text not null default 'center';
alter table public.gallery add column if not exists is_visible boolean not null default true;

create index if not exists gallery_category_idx on public.gallery (category);
create index if not exists gallery_order_idx on public.gallery (order_index);

alter table public.gallery enable row level security;

drop policy if exists "Public read gallery" on public.gallery;
create policy "Public read gallery"
  on public.gallery for select
  using (true);

drop policy if exists "Admin write gallery" on public.gallery;
create policy "Admin write gallery"
  on public.gallery for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- about_gallery_preview
-- =============================================================================
create table if not exists public.about_gallery_preview (
  id              uuid primary key default gen_random_uuid(),
  gallery_item_id text not null references public.gallery(id) on delete cascade,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists about_gallery_preview_order_idx on public.about_gallery_preview (display_order);

alter table public.about_gallery_preview enable row level security;

drop policy if exists "Public read about_gallery_preview" on public.about_gallery_preview;
create policy "Public read about_gallery_preview"
  on public.about_gallery_preview for select
  using (true);

drop policy if exists "Admin write about_gallery_preview" on public.about_gallery_preview;
create policy "Admin write about_gallery_preview"
  on public.about_gallery_preview for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- faqs
-- =============================================================================
create table if not exists public.faqs (
  id              uuid primary key default gen_random_uuid(),
  question        text not null,
  answer          text not null,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists faqs_order_idx on public.faqs (order_index);

alter table public.faqs enable row level security;

drop policy if exists "Public read faqs" on public.faqs;
create policy "Public read faqs"
  on public.faqs for select
  using (true);

drop policy if exists "Admin write faqs" on public.faqs;
create policy "Admin write faqs"
  on public.faqs for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- nav_links
-- =============================================================================
create table if not exists public.nav_links (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,
  "to"            text not null,
  icon            text not null,
  is_contact      boolean not null default false,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists nav_links_order_idx on public.nav_links (order_index);

alter table public.nav_links enable row level security;

drop policy if exists "Public read nav_links" on public.nav_links;
create policy "Public read nav_links"
  on public.nav_links for select
  using (true);

drop policy if exists "Admin write nav_links" on public.nav_links;
create policy "Admin write nav_links"
  on public.nav_links for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- contact_messages
-- =============================================================================
create table if not exists public.contact_messages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  subject         text not null,
  message         text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_email_idx on public.contact_messages (email);
create index if not exists contact_messages_read_idx on public.contact_messages (read);

alter table public.contact_messages enable row level security;

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
-- updated_at trigger function
-- =============================================================================
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_philosophy_items_updated_at on public.philosophy_items;
create trigger update_philosophy_items_updated_at
  before update on public.philosophy_items
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_progression_items_updated_at on public.progression_items;
create trigger update_progression_items_updated_at
  before update on public.progression_items
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_skills_updated_at on public.skills;
create trigger update_skills_updated_at
  before update on public.skills
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_soft_skills_updated_at on public.soft_skills;
create trigger update_soft_skills_updated_at
  before update on public.soft_skills
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_experiences_updated_at on public.experiences;
create trigger update_experiences_updated_at
  before update on public.experiences
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_education_updated_at on public.education;
create trigger update_education_updated_at
  before update on public.education
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_services_updated_at on public.services;
create trigger update_services_updated_at
  before update on public.services
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_social_links_updated_at on public.social_links;
create trigger update_social_links_updated_at
  before update on public.social_links
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_gallery_updated_at on public.gallery;
create trigger update_gallery_updated_at
  before update on public.gallery
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_faqs_updated_at on public.faqs;
create trigger update_faqs_updated_at
  before update on public.faqs
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_nav_links_updated_at on public.nav_links;
create trigger update_nav_links_updated_at
  before update on public.nav_links
  for each row execute function public.update_updated_at_column();