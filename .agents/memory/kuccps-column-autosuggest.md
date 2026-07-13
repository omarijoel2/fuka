---
name: KUCCPS column auto-suggest matching
description: Header-to-field auto-mapping must use scored, one-field-per-header assignment — naive contains-matching steals columns.
---

Auto-mapping spreadsheet headers to system fields must never use first-match
substring rules in a fixed field order.

**Why:** Real KUCCPS placement lists have headers like PROGRAMME NAME and
SECONDARY SCHOOL NAME. A generic alias like "name" checked first captures them
all as full_name, the programme column is stolen, and one field silently maps to
multiple columns (last column wins on import) — producing students named after
their programme. This was the reported "mapping / mandatory fields" bug.

**How to apply:** Score every header/field pair (exact alias > whole-word match
weighted by alias specificity > similarity fallback), then greedily assign so
each field is suggested for at most one header. Enforce the same invariants
server-side on mapping save (required fields present, no duplicate field
assignments, only known field keys) and mirror the dedupe in the wizard UI.
