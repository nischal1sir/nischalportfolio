# Nischal Rai — Developer Portfolio

A modern, responsive, production-quality personal portfolio website built with **React + TypeScript + Vite + Tailwind CSS v4**, backed by an **Express + Supabase** API for projects and the contact form.

> Core message: **Learn. Build. Adapt. Improve.**

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, lucide-react / react-icons, react-router-dom (hash router)
- **Backend:** Node.js + Express (TypeScript, run via `tsx`)
- **Database:** Supabase (Postgres) — projects, gallery and contact messages
- **Design:** Minimal, modern, developer-focused. Mobile-first, fully responsive, accessible (reduced-motion support), subtle animations.

## Features

- **Pages:** Home, About, Skills, Projects, Experience, Let's Talk (Contact), Resume
- **Home flow:** Hero → intro → skills preview → featured projects → services → currently learning → exploring → freelance experience → internship CTA → Learn·Build·Adapt·Improve CTA
- **Projects:** component-based `ProjectCard`, fetched from API with **mock-data fallback**, loading/error/empty states
- **Contact form:** client-side validation, loading/success/error states, posts to `POST /api/contact`, stored in `contact_messages`
- **SEO:** per-page titles/descriptions, Open Graph + Twitter meta, favicon
- **Data-driven content:** skills, projects, services, education, experience, socials all live in `src/data/*` — easy to update without touching components

## Getting started

### 1. Install dependencies

```bash
npm install
cd backend && npm install
```

### 2. Environment variables

Copy the examples and fill in real values:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Frontend (`.env`):

```
VITE_API_URL=http://localhost:5000/api
```

Backend (`backend/.env`):

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
```

### 3. Database

Run `backend/schema.sql` in the Supabase SQL editor to create the `contact_messages` (and reference `projects`/`gallery`) tables.

### 4. Run

Frontend (dev):

```bash
npm run dev
```

Backend (dev, uses `tsx` watch):

```bash
cd backend && npm run dev
```

The frontend works without the backend — it falls back to local data in `src/data`.

## Project structure

```
src/
  components/      # reusable UI + layout (Navbar, Sidebar, footer, Button, Icon, Section, ServiceCard, …)
  pages/           # Home, About, Skills, Projects, Experience, Contact, Resume
  data/            # projects, skills, services, education, experience, socials, profile, nav
  services/        # api.ts (projects) + contact.ts (contact form)
  hooks/           # useReveal, usePageMeta
  types/           # shared types
  const/           # routes
backend/
  routes/          # projects, gallery, contact
  config/          # supabase client
  schema.sql        # database schema
```

## Content updates

All editable content lives in `src/data/`:

- `profile.ts` — name, taglines, headline, intro, resume link, email
- `projects.ts` — project list (also used as API fallback)
- `skills.ts` — skill categories, currently learning, exploring
- `services.ts` — what I can build
- `education.ts`, `experience.ts` — background (no fabricated companies/clients)
- `socials.ts` — social profile links
- `nav.ts` — navigation links

Replace placeholders (GitHub/LinkedIn URLs, `resume.pdf`) with your real values.

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # typecheck + production build
npm run preview   # preview the build
```

© 2026 Nischal Rai. All rights reserved.
