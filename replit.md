# KAFU Website — Kaimosi Friends University

## Overview

Official website for Kaimosi Friends University (KAFU), a Quaker-founded public university in Kaimosi, Western Kenya. Built as a pnpm monorepo with TypeScript/React (Vite) frontend and Laravel 11 (PHP 8.2) backend API.

## Architecture

| Layer | Tech | Location | Port |
|---|---|---|---|
| Frontend | React 18 + Vite + TypeScript | `artifacts/kafu-foundation/` | dynamic ($PORT) |
| Backend API | Laravel 11 (PHP 8.2) | `artifacts/kafu-api/` | 8080 |
| CMS Admin | React 18 + Vite + TypeScript | `artifacts/kafu-cms/` | 24962 |
| Monorepo | pnpm workspaces | `/` | — |

## Frontend (`artifacts/kafu-foundation/`)

- **Routing**: wouter
- **State**: @tanstack/react-query
- **Styling**: Tailwind CSS + shadcn/ui components
- **Fonts**: Playfair Display (serif headings), Inter (body)
- **Branding**: Forest Green `#1A5C38` (hsl 143 55% 23%), Gold `#C9A227` (hsl 43 68% 47%), White background
- **Logo**: `https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png`

### Pages (20 total — MP02–MP07 complete)
| Page | Path | Module |
|---|---|---|
| Home | `/` | MP02 |
| About | `/about` | MP02 |
| Schools | `/schools` | MP02 |
| School Detail | `/schools/:code` | MP02 |
| Programmes | `/programmes` | MP02 |
| Programme Detail | `/programmes/:school/:code` | MP04 |
| Staff Directory | `/staff` | MP05 |
| Staff Profile | `/staff/:slug` | MP05 |
| Admissions | `/admissions` | MP03 |
| Student Services | `/student-services` | — |
| News (listing) | `/news` | MP07 |
| News Detail | `/news/:slug` | MP07 |
| Events (listing) | `/events` | MP07 |
| Event Detail | `/events/:slug` | MP07 |
| Announcements (listing) | `/announcements` | MP07 |
| Announcement Detail | `/announcements/:slug` | MP07 |
| Opportunities | `/opportunities` | MP06 |
| Opportunity Detail | `/opportunities/:slug` | MP06 |
| Contact | `/contact` | — |
| Not Found | `*` | — |

### Key Source Files
- `src/lib/api-types.ts` — all TypeScript interfaces matching Laravel API shapes
- `src/lib/api-hooks.ts` — all useQuery hooks
- `src/components/navbar.tsx` — sticky navbar with utility bar + dropdown menus (News dropdown: Latest News, Events Calendar, Announcements)
- `src/components/footer.tsx` — 4-column footer
- `src/pages/home.tsx` — full MP02 homepage (10+ sections including campus photo strip)

### Homepage Sections (MP02 + image upgrades)
1. Hero — real campus photo background (IMG_6424-scaled.jpg), tagline, dual CTAs, stats overlay
2. Programme Discovery — search + level/school filters + live programme cards from API
3. Admissions Pathways — 4 cards: Undergraduate (KUCCPS), Postgraduate, International, Self-Sponsored
4. Schools & Faculties — 5 school cards from API
5. Campus Life Photo Strip — 4-image grid (undergraduate, postgrad, arts & culture, sports)
6. Why KAFU — 4 differentiators (Accredited, Quaker Values, Community Impact, Unique Programmes)
7. News + Events — side-by-side from API (latest news, upcoming events)
8. Opportunities — tenders/vacancies/scholarships from API
9. Digital Services Hub — 6 service tiles (Portal, E-Learning, Library, Email, Staff Portal, Documents)
10. CTA — apply-now.jpg background with application call-to-action

### MP07 — News, Events & Announcements Module
- **News**: listing with search + category tabs, featured article, 10 articles with author/tags/imageUrl; detail page with full content, related articles sidebar
- **Events**: listing with upcoming/past toggle, search + category tabs, 10 events with slugs/descriptions/registration links; detail page with date sidebar, registration CTA
- **Announcements**: listing with urgent/normal priority filter, search; 10 announcements; detail page with urgent styling (red), full content, issuing department sidebar
- **Navbar**: News item now has dropdown with Latest News / Events Calendar / Announcements

## Backend API (`artifacts/kafu-api/`)

Laravel 12 with PHP 8.2. Public routes in `routes/api.php`; admin routes in `routes/admin.php` (713 lines).

### Endpoints
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/stats` | University stats (schools, programmes, years, counties) |
| GET | `/api/news` | 10 articles; `?category=&search=` filters |
| GET | `/api/news/:slug` | Full article with content, author, tags, related IDs |
| GET | `/api/events` | 10 events; `?filter=upcoming|past&category=&search=` |
| GET | `/api/events/:slug` | Full event detail |
| GET | `/api/announcements` | 10 notices; `?priority=urgent|normal&search=` |
| GET | `/api/announcements/:slug` | Full announcement with content, department, tags |
| GET | `/api/schools` | 5 schools with programme counts |
| GET | `/api/schools/:code` | School detail with programmes array |
| GET | `/api/programmes` | Flat array; `?school=&level=` filters |
| GET | `/api/opportunities` | 17 items; `?category=&status=&search=` |
| GET | `/api/opportunities/:slug` | Full opportunity with requirements/documents |
| GET | `/api/staff` | Staff list; `?school=&search=&designation=` |
| GET | `/api/staff/:slug` | Full staff profile |
| GET | `/api/admissions` | Pathways, deadlines, documents, contact |
| GET | `/api/contact` | Institution contact info |

## KAFU Real Data

- **Address**: P.O BOX 385 – 50309, Kaimosi, Kenya
- **Phone**: +254 777 373 633
- **Email**: info@kafu.ac.ke | vc@kafu.ac.ke
- **VC**: Prof. Peter Nyamuhanga Mwita (appointed 14 May 2025) | vc@kafu.ac.ke | slug: `prof-peter-n-mwita`
- **Student Portal**: portal.kafu.ac.ke
- **E-Learning**: elearning.kafu.ac.ke
- **Schools**: SESS (Education), SBE (Business), SCIT (Computing), SOS (Science), SHS (Health Sciences)

## MP08 — CMS & Governance Engine (COMPLETE)

### Backend (artifacts/kafu-api)
- **Migrations**: users role fields, cms_content, cms_revisions, media_files, audit_logs, taxonomy_terms, content_taxonomy
- **Models**: CmsContent (forRole scope, allowedTransitions), CmsRevision, MediaFile, AuditLog, TaxonomyTerm, User (HasApiTokens, roles)
- **Admin API**: `routes/admin.php` — full CRUD, workflow transitions, revisions, review queue, media, users, taxonomy, audit logs, reports
- **Seeder**: 8 users, 36 taxonomy terms, 5 sample content items
- **Auth**: Sanctum tokens, 8-hour expiry, rate limiting on login

### CMS Admin Frontend (artifacts/kafu-cms)
- **URL**: /kafu-cms/ (port 24962)
- **Auth**: Token stored in localStorage (kafu_cms_token, kafu_cms_user)
- **Pages built**:
  - Login — full sign-in with KAFU branding
  - Dashboard — stats, content by type, review queue preview, recent activity feed
  - Content Library — filterable table (type, status, search) with pagination
  - Content Editor — full form with slug auto-gen, body, SEO, featured image, workflow transitions, revision history
  - Review Queue — grouped by status, direct links to editor
  - Media Library — grid with folder sidebar (logos/campus/marketing/news/general), type filter (image/document), search, upload (multipart POST), delete, copy URL, URL preview in detail panel; paginated (24/page); storage symlinked at public/storage
  - **11 assets migrated**: logos (×2), campus photos (×6 incl. hero), marketing CTA background, news/event photos (×3) — all registered via MediaMigrationSeeder
  - User Management — table + add/edit modal with role assignment
  - Taxonomy Manager — vocabulary sidebar + hierarchical term tree with add/edit/delete
  - Audit Log — searchable/filterable log with action badges
  - Settings — account info + change password
- **Workflow states**: draft → submitted → under_review → approved → scheduled → published → unpublished → archived
- **Role-based nav**: super_admin/ict_admin/communications_admin see Users, Taxonomy, Audit, Settings; reviewer sees Review Queue
- **API proxy**: Vite dev server proxies /api → localhost:8080

### Admin Credentials
- Email: admin@kafu.ac.ke | Password: KafuAdmin@2026 | Role: super_admin

## Conventions

- No emojis anywhere in UI
- `data-testid` on all interactive elements (buttons, links, cards, inputs)
- No local image asset imports — use CSS gradients or external kafu.ac.ke URLs
- Apply buttons → `/admissions`; only final CTAs link to `portal.kafu.ac.ke`
- API responses with `{data: ...}` are auto-unwrapped by `fetchApi()`
- Programmes API returns a flat array (no `data` wrapper)
- All photo backgrounds use `filter: brightness()` + semi-transparent primary overlay for readability
