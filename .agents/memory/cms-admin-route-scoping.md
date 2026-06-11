---
name: CMS admin route role scoping
description: Any new /api/admin route that reads cms_content must apply CmsContent::forRole($user) or an explicit role gate, or it leaks cross-scope content.
---

# CMS admin route role scoping

Any new route under `/api/admin/*` (artifacts/kafu-api/routes/admin.php) that queries
`CmsContent` and returns its rows MUST scope the query with
`CmsContent::forRole($request->user())` — or apply an explicit `isCentralAdmin()` /
`canReview()` gate — before returning data.

**Why:** `forRole` returns everything for central admins (super_admin, ict_admin,
communications_admin), but restricts reviewers to their own/department content and other
roles to their own authored content. Admin routes are reachable by non-central roles
(e.g. the Media Library is open to all admin-area users), so an unscoped `CmsContent`
query is a broken-access-control leak of titles/slugs/status across departments.
A code review caught exactly this on the `GET /media/{id}/usage` endpoint.

**How to apply:** When adding any admin endpoint that lists or aggregates content, start
the Eloquent query from `CmsContent::forRole($request->user())` rather than a bare
`CmsContent::where(...)`. For reports that are intentionally org-wide (e.g.
content-ownership), gate the whole route with `if (!$user->isCentralAdmin()) return 403;`
and mirror that with the matching `RequireRole roles={ADMIN_ROLES}` guard on the CMS
route — ADMIN_ROLES in the CMS exactly equals the role set in `isCentralAdmin()`.

Note: unauthenticated requests to these auth-protected admin routes return HTTP 500
"Route [login] not defined" (Laravel trying to redirect to a non-existent login route in
this API-only app) — this is pre-existing framework behavior, not a bug. Route existence
is confirmed by 500 (vs 404).
