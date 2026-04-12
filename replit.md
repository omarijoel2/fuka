# KAFU Website — Kaimosi Friends University

## Overview
The KAFU Website is the official online presence for Kaimosi Friends University, a public university in Kenya. The project aims to provide a comprehensive digital platform for prospective students, current students, staff, and the wider community. Key capabilities include showcasing academic programs, faculty profiles, news and events, research activities, and international partnerships. The platform also features an administrative CMS and a staff portal for profile management.

## User Preferences
I prefer clear and concise communication. For any proposed changes or new features, please provide a high-level overview of the impact before diving into technical details. I value iterative development and would like to be consulted on major architectural decisions. Ensure that all interactive elements in the UI have `data-testid` attributes. Avoid using emojis in the UI. When linking to external resources, prioritize `/admissions` for application-related CTAs and `portal.kafu.ac.ke` for final service access.

## System Architecture

The KAFU website is built as a pnpm monorepo consisting of a React-based frontend, a Laravel-based backend API, and a separate React CMS admin interface.

### UI/UX Decisions
- **Branding**: Forest Green (`#1A5C38`), Gold (`#C9A227`), and White.
- **Typography**: Playfair Display for headings and Inter for body text.
- **Styling**: Tailwind CSS and shadcn/ui components are used for a consistent and modern look.
- **Image Treatment**: Photo backgrounds utilize `filter: brightness()` and semi-transparent primary overlays to ensure text readability.
- **Website Navigation**: Features a sticky navbar with a utility bar and dropdown menus, and a 4-column footer.

### Technical Implementations
- **Monorepo**: Managed with pnpm workspaces.
- **Frontend (`kafu-foundation`)**:
    - **Framework**: React 18 with Vite and TypeScript.
    - **Routing**: `wouter`.
    - **State Management**: `@tanstack/react-query`.
    - **Core Pages**: Includes Home, About, Schools, Programmes, Admissions, Staff Directory, News, Events, Announcements, Opportunities, Contact, and dedicated sections for Research and International affairs.
    - **Homepage**: Features sections for Hero, Programme Discovery, Admissions Pathways, Schools & Faculties, Campus Life Photo Strip, Why KAFU, News + Events, Opportunities, and Digital Services Hub.
- **Backend API (`kafu-api`)**:
    - **Framework**: Laravel 11 with PHP 8.2.
    - **API Design**: Provides endpoints for university statistics, news, events, announcements, academic structures (schools, programs), opportunities, staff profiles, admissions, contact information, research data, and international initiatives.
    - **Authentication**: Utilizes Laravel Sanctum for API token authentication with rate limiting on login.
- **CMS Admin (`kafu-cms`)**:
    - **Framework**: React 18 with Vite and TypeScript.
    - **Features**: User authentication, Dashboard, Content Library (filterable with workflow states), Content Editor (with revision history and SEO fields), Media Library (with asset management), User Management (role-based), Taxonomy Manager, Audit Log, and Settings.
    - **Workflow States**: Implements a comprehensive content workflow: `draft` → `submitted` → `under_review` → `approved` → `scheduled` → `published` → `unpublished` → `archived`.
    - **Role-Based Access**: Navigation and features are tailored based on user roles (e.g., `super_admin`, `ict_admin`, `communications_admin`, `reviewer`).
- **Staff Account Updater Portal (`kafu-staff`)**:
    - **Framework**: React.
    - **Features**: Secure login, onboarding flow (password change, consent acceptance), profile editor with various sections (personal, bio, qualifications, teaching, research, contact, uploads), submission history, and a review queue for staff profile updates.
    - **Submission Workflow**: `draft` → `submitted` → `under_review` → `revision_requested` / `approved`. Requires minimum profile completeness and consent for submission.

### Feature Specifications
- **MP07 (News, Events & Announcements Module)**: Comprehensive listings with search, filtering, and detailed pages, integrated into the main navigation.
- **RIMS-lite (Research Information Management System - lite)**: Dedicated sections and API endpoints for managing research overview, projects, publications, partnerships, and grants. Includes full CRUD operations via the CMS.
- **International Module**: Sections and API endpoints for international overview, study programs, visa information, exchange programs, and international partnerships. Includes full CRUD operations via the CMS.
- **MP13 (Staff Profile Enhancements)**: Detailed staff profiles including academic identifiers (ORCID, Scholar, Scopus), grants, supervision, courses taught, and linked publications.
- **MP08 (CMS & Governance Engine)**: Provides a robust content management system with user roles, content workflows, media management, and audit logging.
- **MP16 (Staff Account Updater Portal)**: Allows staff to manage their academic profiles, with a submission and review process integrated into the CMS.

## External Dependencies

- **Database**: Implied relational database (likely MySQL/PostgreSQL) managed by Laravel's ORM.
- **Frontend Libraries**:
    - **React**: For UI development.
    - **Vite**: Build tool for frontend.
    - **TypeScript**: For type safety.
    - **wouter**: For client-side routing.
    - **@tanstack/react-query**: For data fetching and state management.
    - **Tailwind CSS**: For utility-first styling.
    - **shadcn/ui**: UI component library.
- **Backend Framework**:
    - **Laravel 11 (PHP 8.2)**: For API development.
    - **Laravel Sanctum**: For API authentication.
- **Monorepo Tool**:
    - **pnpm**: For package management.
- **Image Assets**: Utilizes external KAFU-hosted image URLs (e.g., `https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png`) for branding and content.

## MP17 — CMS Admin Back Office (COMPLETE)

### Backend (artifacts/kafu-api)
- **Tables**: `site_config` (group/key/value key-value store), `redirects`
- **Models**: SiteConfig (get/set/getGroup/setGroup), Redirect
- **Controllers**: SiteConfigController, RedirectController, ContentHealthController, WorkflowQueueController
- **Routes** (`/api/admin/`): `GET/PUT site-config/{group}` (groups: homepage, navigation, site, seo, contact), `CRUD /redirects`, `GET /content-health`, `GET/POST /workflow-queue`
- **Seeder**: SiteConfigSeeder with default homepage, navigation, site, seo, contact values

### CMS Pages (artifacts/kafu-cms)
- `/homepage` — hero section, admissions banner, stats, quick links
- `/navigation` — primary, utility, footer navigation editor (tabbed)
- `/site-controls` — emergency banner, announcement bar, maintenance mode, social links, footer
- `/redirects` — redirect rules CRUD (5 seeded: /admissions/apply, /faculty, /courses, /news/2025, /events/calendar)
- `/workflow` — centralized pipeline queue by status/type with age indicators
- `/content-health` — health score (0-100), issue cards, content breakdown, stale/expired/overdue lists
- **Sidebar groups**: Site Controls, SEO & Redirects, Reports
- **Dashboard enhancements**: Content Health widget (ring score + alerts), Workflow Pipeline widget (counts by status), Site Operations quick-action grid

### Key Conventions (staff portal + CMS)
- No emojis in UI
- `data-testid` on all interactive elements
- `wouter` for routing in kafu-foundation, kafu-cms, kafu-staff
- API base: `/api/admin` (CMS), `/api/staff` (staff portal), `/api/reviewer` (reviewer), `/api/admin/staff-accounts` (staff admin)
- Staff portal: `kafu_staff_token` in localStorage; 401 redirect only when token already exists
- cms_content uses `is_deleted` (not `deleted_at`) for soft deletes; `expiry_date` for deadline logic
- Apply buttons → `/admissions`; final CTAs → `portal.kafu.ac.ke`