# KAFU Website — Kaimosi Friends University

## Overview

Official website for Kaimosi Friends University (KAFU), a Quaker-founded public university in Kaimosi, Western Kenya. Built as a pnpm monorepo with TypeScript/React (Vite) frontend and Laravel 11 (PHP 8.2) backend API.

## Architecture

| Layer | Tech | Location | Port |
|---|---|---|---|
| Frontend | React 18 + Vite + TypeScript | `artifacts/kafu-foundation/` | dynamic ($PORT) |
| Backend API | Laravel 11 (PHP 8.2) | `artifacts/kafu-api/` | 8080 |
| Monorepo | pnpm workspaces | `/` | — |

## Frontend (`artifacts/kafu-foundation/`)

- **Routing**: wouter
- **State**: @tanstack/react-query
- **Styling**: Tailwind CSS + shadcn/ui components
- **Fonts**: Playfair Display (serif headings), Inter (body)
- **Branding**: Deep Navy `#1B3A6B`, Gold `#D4A017`
- **Logo**: `https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png`

### Pages (11 total)
| Page | Path |
|---|---|
| Home | `/` |
| About | `/about` |
| Schools | `/schools` |
| School Detail | `/schools/:code` |
| Programmes | `/programmes` |
| Admissions | `/admissions` |
| Student Services | `/student-services` |
| News | `/news` |
| Events | `/events` |
| Opportunities | `/opportunities` |
| Contact | `/contact` |

### Key Source Files
- `src/lib/api-types.ts` — all TypeScript interfaces matching Laravel API shapes
- `src/lib/api-hooks.ts` — all useQuery hooks (useStats, useNews, useSchools, useProgrammes, useEvents, useOpportunities, useContactInfo)
- `src/components/navbar.tsx` — sticky navbar with utility bar + dropdown menus
- `src/components/footer.tsx` — 4-column footer
- `src/pages/home.tsx` — full MP02 homepage (10+ sections)

### Homepage Sections (Master Prompt 02)
1. Hero — tagline, description, dual CTAs, stats overlay
2. Programme Discovery — search + level/school filters + live programme cards from API
3. Admissions Pathways — 4 cards: Undergraduate (KUCCPS), Postgraduate, International, Self-Sponsored
4. Schools & Faculties — 5 school cards from API
5. Why KAFU — 4 differentiators (Accredited, Quaker Values, Community Impact, Unique Programmes)
6. News + Events — side-by-side from API (latest 4 news, 4 upcoming events)
7. Opportunities — tenders/vacancies/scholarships from API
8. Digital Services Hub — 6 service tiles (Portal, E-Learning, Library, Email, Staff Portal, Documents)
9. CTA — final application call-to-action

## Backend API (`artifacts/kafu-api/`)

Laravel 11 with PHP 8.2. All routes in `routes/api.php`.

### Endpoints
| Method | Endpoint | Response |
|---|---|---|
| GET | `/api/stats` | `{data: [{label, value}]}` |
| GET | `/api/news` | `{data: [{id, slug, title, excerpt, category, date, image, featured}]}` |
| GET | `/api/schools` | `{data: [{code, name, dean, description, programmes_count, colour}]}` |
| GET | `/api/schools/:code` | `{data: {code, name, dean, description, ...programmes[]}}` |
| GET | `/api/programmes` | flat array `[{school, level, name, code, duration}]` |
| GET | `/api/events` | `{data: [{id, title, date, time, location, category}]}` |
| GET | `/api/opportunities` | `{data: [{id, type, title, reference, deadline, status}]}` |
| GET | `/api/contact` | `{data: {institution, address, phone, emails[], portals[], social_media[]}}` |

The `fetchApi()` helper in `api-types.ts` auto-unwraps the `data` wrapper when present.

## KAFU Real Data

- **Address**: P.O BOX 385 – 50309, Kaimosi, Kenya
- **Phone**: +254 777 373 633
- **Email**: info@kafu.ac.ke | vc@kafu.ac.ke
- **Student Portal**: portal.kafu.ac.ke
- **E-Learning**: elearning.kafu.ac.ke
- **Schools**: SESS (Education), SBE (Business), SCIT (Computing), SOS (Science), SHS (Health Sciences)

## Conventions

- No emojis anywhere in UI
- `data-testid` on all interactive elements (buttons, links, cards, inputs)
- No local image asset imports — use CSS gradients or external URLs
- API responses with `{data: ...}` are auto-unwrapped by `fetchApi()`
- Programmes API returns a flat array (no `data` wrapper)
