---
name: Programme name matching across data sources
description: Why cross-referencing alumni/stories/outcomes to a programme needs degree-prefix normalization, not exact or substring match.
---

# Programme name inconsistency across KAFU data sources

The `programme` string is stored inconsistently across seeds/tables. A programme
detail page exposes the full catalog name (e.g. "Bachelor of Science in Computer
Science"), while alumni records and alumni-stories use abbreviated forms (e.g.
"BSc Computer Science", "Bachelor of Commerce", "BSc Biology").

**Consequence:** exact match fails, and even the backend alumni filter
(`where('programme','like','%'.$name.'%')`) returns 0 when given the full catalog
name — the substrings don't overlap.

**How to apply:** when matching any programme-linked content (stories, alumni,
outcomes) to a programme page, normalize BOTH sides first — strip degree prefixes
("Bachelor/Master/Doctor of Science/Arts/... in", "BSc/MSc/BA/MA/BCom/PhD/…"),
collapse non-alphanumerics, then compare with equality OR mutual `includes`. This
reduces both forms to the core subject ("computer science") so they match.
See `normalizeProgramme()` in `programme-detail.tsx` for the reference implementation.

**Why:** the underlying seed data is the source of the mismatch; fixing display
matching is more robust than trying to keep every seed perfectly aligned.
