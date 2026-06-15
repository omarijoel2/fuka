---
name: JSON column double-encoding trap (cms_content)
description: Routes that write Eloquent attributes cast as 'array' must pass arrays, never json_encode() strings, or MySQL json columns get double-encoded.
---

`CmsContent` casts `structured_data`, `seo_meta`, `tags`, `related_ids` as `array`.
The cast serializes on save. If a route assigns a `json_encode([...])` STRING to one
of these, the value is encoded twice and stored as a JSON string scalar (`"{...}"`)
in the MySQL `json` column instead of a JSON object.

**Why:** dev (SQLite) tolerates it because reads do `is_string($x) ? json_decode($x) : $x`
with a single decode; double-encoding survives one decode. But every read path that
then does `$sd['key']` can fatal if the value stays a string after one decode (legacy
multi-encoded rows), and the data is silently malformed. SQLite hid this; MySQL is
where it bites.

**How to apply:** When writing any array-cast attribute, pass a PHP array and let the
cast encode once. Never `json_encode()` first. When READING legacy values that may be
multi-encoded, unwrap in a loop (`while (is_string($x)) $x = json_decode($x, true)`)
and coerce to `[]` before offset access. Applies to all cms_content CRUD routes.
