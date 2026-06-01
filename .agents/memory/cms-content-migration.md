---
name: CMS content migration pattern
description: How to migrate hardcoded page data to cms_content DB table with FALLBACK_ pattern and useQuery, including icon-merge strategy.
---

## The Pattern

When migrating hardcoded page data arrays to `cms_content` (via `/api/pages/{slug}`):

1. **Rename module-level arrays** to `FALLBACK_*` (e.g., `STANDARDS` → `FALLBACK_STANDARDS`).
2. **Add useQuery inside component** — fetch from `/api/pages/{slug}`, extract `structured_data`.
3. **Shadow with component-level const** using the original name:
   ```tsx
   const STANDARDS = (sd.standards as typeof FALLBACK_STANDARDS) ?? FALLBACK_STANDARDS;
   ```
4. **Render JSX is unchanged** — it still references `STANDARDS`, which now resolves to the component-level derived const.

## Icon-heavy pages (Lucide components or JSX icons in data)

Use an IIFE merge — DB data overrides text, local FALLBACK provides icons by index:
```tsx
const SERVICES = (() => {
  const dbSvcs = sd.services as Array<Omit<(typeof FALLBACK_SERVICES)[0], "icon">> | undefined;
  if (!dbSvcs?.length) return FALLBACK_SERVICES;
  return dbSvcs.map((s, i) => ({ ...FALLBACK_SERVICES[i], ...s }));
})();
```

**Why:** JSX elements and Lucide component references can't be stored in the DB. The merge keeps icons from FALLBACK (by index) while allowing DB to override text content.

## Derived module-level arrays (e.g., CATEGORIES from POLICIES)

Move them inside the component, computing from the dynamic (DB-overridable) array:
```tsx
const POLICIES = (sd.policies as typeof FALLBACK_POLICIES) ?? FALLBACK_POLICIES;
const CATEGORIES = ["All", ...Array.from(new Set(POLICIES.map((p: any) => p.category))).sort()];
```

Remove the old module-level derived const entirely.

## API routes added

- `GET /api/pages/{slug}` — queries `cms_content` where `type=page`, returns `structured_data` JSON
- `GET /api/press-releases` — type=press_release
- `GET /api/publications` — type=publication
- `GET /api/videos` — type=video
- `GET /api/downloads` — type=download
- `GET /api/archives` — type=archive

## Seeders

- `ContentMediaSeeder` — 69 records (12 PR, 12 pub, 9 video, 16 download, 20 archive)
- `ContentPagesSeeder` — 14 structural pages

Both seeders have a `count() > 0` guard to prevent re-seeding.

## Pages updated (all use FALLBACK_ + useQuery)

**Media list pages:** media-press-releases, media-publications, media-videos, media-downloads, archives

**Structural pages (simple):** about-service-charter, about-complaints, about-legal, research-ethics, admissions-funding, admissions-timetables

**Structural pages (icon-merge IIFE):** students-council (MANDATE_AREAS), about-csr (CSR_PILLARS), about-strategic-plan (PILLARS), student-affairs (SERVICES), admissions-joining-instructions (PHASES.steps), international-study (WHY_KAFU)

**Structural pages (derived arrays):** about-policies (CATEGORIES derived from POLICIES)

**Other:** international-visa (simple, VISA_CATEGORIES)
