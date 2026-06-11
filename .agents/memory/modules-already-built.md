---
name: Admissions/Academics upgrade & MP17 are largely already built
description: Audit conclusion — before building these "new" KAFU specs, check what already exists; most of it does.
---

# Don't rebuild Admissions/Academics or MP17 — they're already implemented

When handed the "Admissions & Academics Global Benchmark (Cambridge/Yale)" upgrade spec or the MP17 "CMS Admin Back Office" spec, do NOT treat them as greenfield. An audit found both are ~85–100% already implemented.

**Why:** these spec docs read like net-new modules, but the codebase already covers nearly all of it. Building from the spec verbatim duplicates existing work.

**How to apply:** map each spec requirement to existing code first (use the explore subagent), then implement only the true gaps.

## Already built (Admissions & Academics)
Guided application wizard, eligibility pre-check with KCSE grade mapping, fees & funding page, admissions calendar, programmes listing + detail (learning outcomes, career pathways, course structure, accreditation, employability_data, linked faculty), schools, 3-way programme comparison tool, and **Course JSON-LD schema** (built inline in programme-detail.tsx via SeoHead's `jsonLd` prop — NOT in seo-head.tsx, so a naive grep of seo-head misses it).

## Already built (MP17 CMS)
Dashboard/work-queues, content libraries per domain, workflow console with revisions + version restore, media library (folders, alt-text, versions), taxonomy, RBAC + permissions matrix, audit logging with before/after snapshots, content-health + webmaster-governance + content-freshness reports, site controls, SEO/redirects, campus/office spatial admin.

## Genuine gaps identified (small)
- Admissions: interactive cost/affordability calculator (was static) — now added as `components/fee-calculator.tsx`; mobile sticky Apply bar on programme-detail.
- MP17: media "where-is-asset-used" usage tracking; explicit relationship-integrity (warn-before-delete / orphan report); dedicated content-ownership report.
