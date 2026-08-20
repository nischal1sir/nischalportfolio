-- Nischal Rai Portfolio — Complete Database Schema (Supabase / Postgres)
-- Run this in the Supabase SQL editor (or psql) to create the required tables.
-- Matches frontend types in src/types/index.ts and backend/types.ts

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

-- =============================================================================
-- projects (existing - enhanced)
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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

-- =============================================================================
-- gallery (existing - enhanced)
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
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

-- =============================================================================
-- nav_links
-- =============================================================================
create table if not exists public.nav_links (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,
  to              text not null,
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
  using (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'))
  with check (auth.uid() in (select id from auth.users where email = 'nischalrai@example.com'));

-- =============================================================================
-- contact_messages (existing)
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

-- Apply updated_at trigger to all tables with updated_at column
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_philosophy_items_updated_at before update on public.philosophy_items
  for each row execute function public.update_updated_at_column();

create trigger update_progression_items_updated_at before update on public.progression_items
  for each row execute function public.update_updated_at_column();

create trigger update_skills_updated_at before update on public.skills
  for each row execute function public.update_updated_at_column();

create trigger update_soft_skills_updated_at before update on public.soft_skills
  for each row execute function public.update_updated_at_column();

create trigger update_projects_updated_at before update on public.projects
  for each row execute function public.update_updated_at_column();

create trigger update_experiences_updated_at before update on public.experiences
  for each row execute function public.update_updated_at_column();

create trigger update_education_updated_at before update on public.education
  for each row execute function public.update_updated_at_column();

create trigger update_services_updated_at before update on public.services
  for each row execute function public.update_updated_at_column();

create trigger update_social_links_updated_at before update on public.social_links
  for each row execute function public.update_updated_at_column();

create trigger update_gallery_updated_at before update on public.gallery
  for each row execute function public.update_updated_at_column();

create trigger update_faqs_updated_at before update on public.faqs
  for each row execute function public.update_updated_at_column();

create trigger update_nav_links_updated_at before update on public.nav_links
  for each row execute function public.update_updated_at_column();

-- =============================================================================
-- Seed initial data
-- =============================================================================
-- Insert default profile (only if empty)
insert into public.profiles (id, name, role, taglines, headline, intro, about, resume_url, location, email)
select '00000000-0000-0000-0000-000000000001'::uuid, 'Nischal Rai', 'Developer',
  array['Passionate Developer', 'Curious Learner', 'Problem Solver'],
  'I build modern, responsive & user-focused websites.',
  'I am a passionate developer who enjoys turning ideas into clean, responsive and meaningful digital experiences. I love learning new technologies, adapting to new challenges and building projects that solve real problems.',
  'I am a hardworking and passionate developer who enjoys learning, experimenting and adapting to new technologies. I believe every project is an opportunity to learn something new and improve the way I build software.',
  '/resume.pdf', 'Nepal', 'nischalrai@example.com'
where not exists (select 1 from public.profiles);

-- Insert philosophy items
insert into public.philosophy_items (profile_id, title, description, icon, order_index)
select id, 'Always Learning', 'Technology changes constantly, so I enjoy continuously learning new tools and approaches.', 'book-open', 0 from public.profiles
where not exists (select 1 from public.philosophy_items);

insert into public.philosophy_items (profile_id, title, description, icon, order_index)
select id, 'Adaptability', 'I am comfortable entering an unfamiliar project and learning the existing structure, technologies and workflow.', 'shuffle', 1 from public.profiles
where not exists (select 1 from public.philosophy_items where order_index = 1);

insert into public.philosophy_items (profile_id, title, description, icon, order_index)
select id, 'Building Through Practice', 'Instead of only learning theory, I believe in learning by building real projects.', 'hammer', 2 from public.profiles
where not exists (select 1 from public.philosophy_items where order_index = 2);

insert into public.philosophy_items (profile_id, title, description, icon, order_index)
select id, 'Problem Solving', 'When something does not work, I enjoy understanding why and finding a practical solution.', 'wrench', 3 from public.profiles
where not exists (select 1 from public.philosophy_items where order_index = 3);

-- Insert progression items
insert into public.progression_items (profile_id, step, order_index)
select id, 'Learn', 0 from public.profiles
where not exists (select 1 from public.progression_items where order_index = 0);

insert into public.progression_items (profile_id, step, order_index)
select id, 'Experiment', 1 from public.profiles
where not exists (select 1 from public.progression_items where order_index = 1);

insert into public.progression_items (profile_id, step, order_index)
select id, 'Build', 2 from public.profiles
where not exists (select 1 from public.progression_items where order_index = 2);

insert into public.progression_items (profile_id, step, order_index)
select id, 'Improve', 3 from public.profiles
where not exists (select 1 from public.progression_items where order_index = 3);

insert into public.progression_items (profile_id, step, order_index)
select id, 'Adapt', 4 from public.profiles
where not exists (select 1 from public.progression_items where order_index = 4);

-- Insert skills
insert into public.skills (name, category, order_index) values
  ('JavaScript', 'language', 0), ('Python', 'language', 1), ('Java', 'language', 2),
  ('React', 'frontend', 0), ('Tailwind CSS', 'frontend', 1), ('HTML / CSS', 'frontend', 2), ('TypeScript', 'frontend', 3),
  ('Node.js', 'backend', 0), ('Express', 'backend', 1),
  ('MongoDB', 'database', 0), ('MySQL', 'database', 1), ('Supabase', 'database', 2),
  ('Git / GitHub', 'tools', 0), ('Linux / CLI', 'tools', 1), ('Figma', 'tools', 2), ('VS Code', 'tools', 3)
on conflict do nothing;

-- Insert soft skills
insert into public.soft_skills (name, description, order_index) values
  ('Team collaboration', 'Comfortable working within a team, sharing progress and reviewing code.', 0),
  ('Time management', 'Plan work in small chunks and keep momentum without losing focus.', 1),
  ('Problem solving', 'Break down problems, research what I do not know and ship a fix.', 2),
  ('Adaptability', 'Pick up unfamiliar tools and codebases quickly, and adapt to new requirements.', 3)
on conflict do nothing;

-- Insert projects (using text IDs matching existing data)
insert into public.projects (id, title, description, short_description, image_url, github_url, live_url, technologies, category, featured, order_index) values
  ('p-1', 'E-Commerce Storefront', 'A full-stack e-commerce solution with product browsing, cart, checkout flow and an admin dashboard. Built with the MERN stack and styled with Tailwind CSS.', 'Full-stack MERN e-commerce platform with cart, checkout and an admin dashboard.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 'https://github.com/nischalrai', '', array['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'], 'Full-Stack', true, 0),
  ('p-2', 'Task Manager App', 'A collaborative task manager with boards, drag-and-drop reordering, workspaces and real-time status updates. Focused on a clean, responsive UI.', 'Collaborative task manager with Kanban boards, drag-and-drop and workspaces.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80', 'https://github.com/nischalrai', '', array['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'], 'Web App', true, 1),
  ('p-3', 'Weather Dashboard', 'A clean weather dashboard with location search, animated forecasts and historical data. Great practice working with external APIs and data visualisation.', 'Weather dashboard with location search, animated forecasts and historical data.', 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80', 'https://github.com/nischalrai', '', array['React', 'OpenWeather API', 'Tailwind CSS'], 'Frontend', false, 2),
  ('p-4', 'Developer Blog', 'A content-focused blog platform with MDX support, syntax highlighting, RSS feed and basic SEO. Built to explore content modelling and rendering.', 'Developer-focused blog platform with MDX, syntax highlighting and RSS.', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', 'https://github.com/nischalrai', '', array['Next.js', 'MDX', 'TypeScript', 'Tailwind CSS'], 'Web App', true, 3),
  ('p-5', 'Real-Time Chat', 'A messaging app with rooms, direct messages, file sharing and message reactions. Helped me understand real-time data flow and optimistic UI updates.', 'Real-time chat with rooms, DMs, file sharing and emoji reactions.', 'https://images.unsplash.com/photo-1577563908411-5077b6dc7600?w=800&q=80', 'https://github.com/nischalrai', '', array['React', 'Express', 'Socket.io', 'Tailwind CSS'], 'Full-Stack', false, 4),
  ('p-6', 'Portfolio Website', 'This very portfolio. A component-based, responsive site with TypeScript, Tailwind CSS, a backend-ready contact form and a clean, maintainable structure.', 'This portfolio: component-based, responsive, backend-ready contact form.', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80', 'https://github.com/nischalrai', '', array['React', 'TypeScript', 'Tailwind CSS', 'Vite'], 'Template', false, 5)
on conflict (id) do nothing;

-- Insert experiences
insert into public.experiences (id, type, role, company, company_url, period, location, description, highlights, technologies, order_index) values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'internship', 'Frontend Developer Intern', 'Youth IT', 'https://hamroyouthit.com/', 'Jul 2025 — Sep 2025', 'Itahari, Nepal', 'Completed a frontend development internship at Youth IT, working on real client-facing interfaces and learning professional development workflows.', array['Built and maintained responsive frontend components', 'Collaborated with the team using Git and code reviews', 'Translated designs into clean, accessible interfaces', 'Improved UI performance and cross-browser compatibility', 'Adapted to an existing codebase and team workflow'], array['React', 'TypeScript', 'Tailwind CSS', 'Git / GitHub'], 0),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'freelance', 'Freelance Developer', 'Project-Based', null, '2023 — Present', 'Remote', 'Worked on freelance and project-based web development, building responsive websites and adapting solutions to different project requirements.', array['Built responsive interfaces for a variety of small projects', 'Worked with frontend technologies to create modern interfaces', 'Understood client requirements and translated them into functional solutions', 'Made UI and responsive improvements on existing projects', 'Worked within existing codebases and adapted to different requirements', 'Debugged and fixed issues across browsers and devices'], array['React', 'JavaScript', 'HTML / CSS', 'Tailwind CSS', 'Git'], 1)
on conflict (id) do nothing;

-- Insert education
insert into public.education (id, institution, degree, period, location, faculty, status, highlights, subjects, icon, order_index) values
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Itahari International College', 'BIT (Hons) — BSc IT (Hons)', '2024 — Present', 'Itahari, Nepal', null, 'Pursuing', array['Bachelor of Information Technology (Hons)', 'Currently pursuing — ongoing', 'Strengthening fundamentals in software engineering and programming'], array['Software Engineering', 'Database Systems', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'Web Technologies'], 'GraduationCap', 0),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Goldengate International College', 'High School — Computer Science', '2021 — 2023', 'Kathmandu, Nepal', 'Management', 'Completed 2023', array['Completed high school with a focus on Computer Science', 'Built a foundational understanding of programming and logic', 'Faculty: Management'], null, 'School', 1)
on conflict (id) do nothing;

-- Insert services
insert into public.services (title, description, icon, order_index) values
  ('Responsive Websites', 'Modern websites that work seamlessly across mobile, tablet and desktop.', 'layout', 0),
  ('Business Websites', 'Professional websites for businesses, organizations and personal brands.', 'briefcase', 1),
  ('Portfolio Websites', 'Personal portfolios for developers, students, designers and professionals.', 'user', 2),
  ('Frontend Development', 'Modern interfaces using React, TypeScript, Tailwind CSS and other frontend technologies.', 'code', 3),
  ('Full-Stack Projects', 'Flexible projects involving frontend, backend and database integration.', 'database', 4),
  ('Website Improvements', 'Responsive improvements, UI upgrades, animations and modern redesigns.', 'refresh-cw', 5)
on conflict do nothing;

-- Insert social links
insert into public.social_links (label, href, icon, order_index) values
  ('GitHub', 'https://github.com/nischalrai', 'github', 0),
  ('LinkedIn', 'https://linkedin.com/in/nischalrai', 'linkedin', 1),
  ('X', 'https://x.com/nischalrai', 'x', 2),
  ('Instagram', 'https://instagram.com/nischalrai', 'instagram', 3)
on conflict do nothing;

-- Insert gallery images
insert into public.gallery (id, title, description, image_url, category, tags, featured, order_index) values
  ('g-1', 'Workspace setup', 'A clean developer desk with dual monitors and warm lighting.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 'Setup', array['workspace', 'desk', 'monitors'], true, 0),
  ('g-2', 'Late-night coding', 'Dark IDE theme at 2am — when the best ideas land.', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', 'Code', array['coding', 'night', 'ide'], false, 1),
  ('g-3', 'Whiteboard session', 'Planning architecture before writing the first line.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 'Planning', array['planning', 'architecture', 'whiteboard'], true, 2)
on conflict (id) do nothing;

-- Insert FAQs
insert into public.faqs (question, answer, order_index) values
  ('What can I deliver for you?', 'Modern, fully responsive websites — including business websites, portfolio sites, frontend work and full-stack projects. I build flexible solutions according to your requirements and budget, covering design, responsiveness, animations and modern redesigns.', 0),
  ('What technologies do you use?', 'My primary stack is React, TypeScript, Tailwind CSS, Node.js and Express. I also work with MongoDB, MySQL and Supabase for databases, and tools like Git/GitHub, Figma and Linux/CLI for my workflow.', 1),
  ('How do you make sure websites work on all devices?', 'I build mobile-first using responsive grids, flexible typography and Tailwind breakpoints. Every site I deliver is tested across small phones, tablets, laptops and large desktop screens to avoid horizontal scrolling.', 2),
  ('Are you open to internships?', 'Yes. I am currently open to internship opportunities where I can learn from experienced developers, contribute to real projects and grow as a software developer. Reach out through the Let''s Talk page.', 3),
  ('What was your experience at Youth IT?', 'I completed a frontend development internship at Youth IT in Itahari, where I worked on real client-facing interfaces, collaborated with the team using Git and code reviews, and improved UI performance and cross-browser compatibility.', 4),
  ('How can we contact you for a project?', 'Use the Let''s Talk page to send me a message with your project idea, timeline or budget. The form posts to my backend and stores your message. I usually reply within a couple of days through your preferred channel.', 5)
on conflict do nothing;

-- Insert nav links
insert into public.nav_links (label, to, icon, is_contact, order_index) values
  ('Home', '/', 'home', false, 0),
  ('About', '/about', 'user', false, 1),
  ('Skills', '/skills', 'code', false, 2),
  ('Projects', '/projects', 'folder', false, 3),
  ('Experience', '/experience', 'briefcase', false, 4),
  ('Let''s Talk', '/contact', 'mail', true, 5)
on conflict do nothing;