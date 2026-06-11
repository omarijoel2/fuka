---
name: Staff profile public URL vs API endpoint
description: Why the public staff-profile URL path differs from the API detail endpoint, and the department-column gotcha.
---

# Staff profile: public URL is /images/uploads/:slug, API detail is /staff/{slug}

In kafu-foundation the public staff-profile page is served at the wouter route **`/images/uploads/:slug`** (a legacy WordPress URL preserved for SEO/bookmarks). But the Laravel API detail endpoint is **`GET /api/staff/{slug}`** — there is **no** `/api/images/uploads/{slug}` route.

**Rule:** the staff-detail data fetch must target the API path `/staff/{slug}`, NOT the public URL path. Fetching the public path (`/images/uploads/{slug}`) 404s, and every staff *detail* page then renders the loading skeleton forever while the directory list keeps working — so it can look like "only some profiles are broken."

**Why:** the public URL path and the API path are intentionally different; conflating them (e.g. a global find-replace) silently breaks all profile detail pages while the directory keeps working.

**How to apply:** when a single staff profile won't load but the directory does, verify the detail fetch hits `/staff/{slug}`. Also: staff `department` must live in the `cms_content.department` column (the API mapper reads the column), not only inside `structured_data` — department-only-in-structured_data renders blank.
