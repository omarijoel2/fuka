---
name: Staff profile re-edit after approval
description: How staff re-edit an already-approved/published profile in kafu-staff without breaking the review workflow.
---

# Staff profile re-edit after approval

An `approved` or `published` `ProfileSubmission` is a terminal, live record.
Editing it directly is forbidden (backend rejects updateSection/withdraw on
terminal states; frontend `canEdit` locks all fields).

To let staff update an already-approved profile, do NOT mutate the approved
record. Instead fork a fresh `draft` (`version_number + 1`) seeded from the
latest submission's `profile_data` / `section_completion` / `completeness_score`
via `getEditableDraft()` in `StaffProfileController`. The explicit entry point
is `POST /api/staff/profile/revise` (frontend "Update My Profile" button,
`data-testid="btn-revise"`, shown when status is approved/published).

**Why:** keeps the live approved profile intact while every change still flows
through submit -> reviewer queue -> approve. Both CMS (`staff-review-cms`) and
the staff reviewer portal (`review-queue`) consume `/api/reviewer`, so the
re-submitted draft is approvable from either surface.

**How to apply:** any edit/upload entry point that should be usable after
approval must route through `getEditableDraft()`, not `getOrCreateDraft()`.
Caveat: `getEditableDraft()` is not transactional — concurrent revise calls
could duplicate a version number; add a `(user_id, version_number)` unique
guard if this ever matters.
