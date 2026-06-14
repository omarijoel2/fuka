---
name: opportunities auto-archiving
description: How expired opportunities are handled — auto-archive, not evergreen date-shifting.
---

# Opportunity expiry handling

Expired opportunities must be **auto-archived (closed)**, never artificially kept open.

**Why:** When all sample opportunities had past deadlines the homepage section looked
empty. A first attempt made the seeder "evergreen" by shifting past-due deadlines into
the future (deterministic slug offset). The user explicitly rejected that — fake-open
opportunities are dishonest. They want expired ones to genuinely close/archive.

**How it works:**
- Read-time safety net: `mapCmsOpportunity()` in `routes/api.php` treats any opportunity
  whose `structured_data.deadline` is past as `closed` (does not persist).
- Persistent archiving: `content:archive-expired` command
  (`app/Console/Commands/ArchiveExpiredContent.php`, scheduled daily in
  `routes/console.php`) closes expired opportunities by persisting
  `structured_data.opportunity_status = 'closed'` + an AuditLog `auto_archived` entry.
  Same command also archives expired news/announcements (status -> archived).
- Closed opportunities stay **visible** in the listing (marked "Closed"); they are NOT
  set to content `status = archived` (that would hide them). Only news/announcements get
  the hidden `archived` status.
- Deadline lives in the JSON `structured_data` column, so the command filters in PHP
  (load + Collection::filter) for DB portability (SQLite dev / MySQL prod), not SQL.

**Consequence:** sample seed data with old dates will show as closed; the homepage
opportunities section is only as full as the genuinely-current opportunities in the DB.
Populate via CMS or refresh seed deadlines to real future dates — do NOT re-introduce
runtime date-shifting.
