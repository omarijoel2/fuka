---
name: cms_content has no excerpt column
description: The DB column is `summary`; the public API only *aliases* it to `excerpt` in responses — never query `excerpt` at the DB layer.
---

The `cms_content` table has a `summary` column and **no `excerpt` column**.

**Why:** Several public API responses map `'excerpt' => $item->summary`, so the JSON the
frontend sees uses the key `excerpt`. That naming tempts developers to write DB queries
against an `excerpt` column (where/select/orderBy). SQLite is lenient in some paths, but
MySQL throws `SQLSTATE[42S22] Unknown column 'excerpt'` and the request 500s — which only
shows up on the user's production server, masked by APP_ENV=production.

**How to apply:** When filtering/selecting summary text from `cms_content` (search,
listings), always use the `summary` column. Reserve `excerpt` strictly for the response
DTO key. Grep for `'excerpt'` used inside `where(`/`select(`/`orWhere(` — those are bugs.
