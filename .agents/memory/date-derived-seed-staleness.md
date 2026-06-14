---
name: Date-derived seed content goes stale
description: Opportunities (and similar) derive open/closed status from deadline vs. current date, so fixed seed dates silently expire.
---

# Date-derived seed content goes stale

`mapCmsOpportunity()` in `artifacts/kafu-api/routes/api.php` auto-closes any
opportunity whose `structured_data.deadline` is past the current date, regardless
of the stored `opportunity_status`. The homepage Opportunities tabs
(`artifacts/kafu-foundation/src/pages/home.tsx`) then filter out `closed` items.

**Why:** Seed deadlines are hardcoded absolute dates. As real time advances past
them, every seeded item flips to `closed` and the homepage section empties out,
making the feature look broken on a fresh install.

**How to apply:** When seeding (or reviewing) deadline-bearing content, set
deadlines comfortably in the future relative to the project's "today", and keep a
spread across categories with a couple of `closing-soon` items. The
`OpportunitiesSeeder` upsert skips existing slugs, so to refresh a dev DB you must
delete the `type = 'opportunity'` rows and re-run `db:seed --class=OpportunitiesSeeder`.
Watch for the same pattern in any other date-gated module (e.g. events).
