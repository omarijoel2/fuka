---
name: School code/slug coupling
description: How a school's "code" maps to its slug and why dean/programmes can disconnect when the code changes.
---

# School code ↔ slug ↔ linked records

The CMS "School Code" field and the public school URL are the same value, but
they live in several places that do NOT auto-sync:

- **Admin save** (`routes/admin.php` schools POST/PUT): `slug = strtolower(code)`.
  The code field drives the slug.
- **Public read** (`routes/api.php` `mapCmsSchool`, list + `/schools/{code}`):
  `code = strtoupper(slug)`, and detail lookup matches `UPPER(slug) = {code}`.
  So the slug is the single routing key.
- **Dean** is resolved from `structured_data.dean_staff_slug` → the staff
  profile (independent of code).
- **Programmes** link by a separate `school_code` column; **staff** by
  `school_code`; **navigation** by a hardcoded `/schools/{CODE}` URL in the
  `navigation` site_config group.

**Why it breaks:** Changing a school's code in the CMS changes only its own
slug. The dean's staff profile, the programmes' `school_code`, and the nav link
stay on the old code, so the dean/programmes silently disappear and the menu
link 404s. To rename a school code you must update all four together.

**Slug uniqueness trap:** `cms_content.slug` has a global UNIQUE constraint, and
the CMS delete is a soft delete (`is_deleted=true`) that KEEPS the slug. So a
previously-removed record still occupies its code and blocks any rename/create
that wants it — surfacing only as a generic "save failed". The schools
POST/PUT now auto-free a slug held by a soft-deleted row and return a clear 422
when a live row holds it.

**Standard codes in use:** SESS, SBE, SCIT, SOS, SHS (Health Sciences is SHS,
not SOHS, despite the "SoHS" abbreviation in its description text). These are
also baked into static fallbacks and validation enums in api.php/admin.php.
