---
name: Webmaster scan alert dedupe/escalation
description: How the webmaster:scan command must handle duplicate vs. worsening alerts.
---

# Scan alert dedupe must be escalation-aware

The `webmaster:scan` artisan command (kafu-api) raises `webmaster_alerts` for stale/expired/missing-SEO/review-overdue content. It keeps **one active alert per `(type, content_id)`**.

**Rule:** when the same alert `type` is reused across multiple severities (e.g. `stale_content` is `minor` at 180–365 days but `critical` at >365 days), the dedupe check must **escalate the existing unresolved alert's severity** when the condition worsens — not silently skip because a row already exists.

**Why:** a naive `exists()` dedupe on `(type, content_id, status != resolved)` permanently locks an item at the first severity it ever hit, so content that ages from stale→critical never surfaces as critical. Caught in code review.

**How to apply:** in the scan's `raise()` closure, look up the existing unresolved alert; if the new severity outranks it (rank: info<minor<major<critical), update severity/title/message; otherwise create new. Same applies to any future scan check that maps one alert type to several severity tiers.
