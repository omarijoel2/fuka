---
name: Staff portal -> CMS profile sync
description: Durable constraints for syncing approved staff portal submissions into the public CMS staff profile.
---

# Staff portal submission -> CMS staff_profile sync

On reviewer approval, an approved staff portal submission is pushed into the public
CMS staff profile.

- **The linking point is EMAIL, and it must be case-insensitive.** Match/store the
  email lowercased; otherwise case differences silently create duplicate profiles.
  **Why:** account email vs. submitted contact email can differ in case.
- **The canonical staff type is `staff_profile`, never `staff`.** The public site,
  mappers, dean resolver, and portal lookup all use `staff_profile`; `staff` has zero
  rows. A stale `findCmsProfile` was querying `staff` and never matched.
- **Existing profile is updated in place with its status preserved** (a published
  profile goes live on approval — reviewer approval is the governance gate); a missing
  profile is created as `draft` for comms to publish.
- **Round-trip is lossy and the renderer's field contract is the trap.** The staff
  portal stores section fields as newline TEXT (textareas), but `staff-profile.tsx`
  expects specific structured shapes. Re-parse text into exactly what the renderer
  consumes, verified against `api-types.ts`:
  - publications -> `{citation, url?}` (NOT `{title,year}` — renders blank if wrong)
  - qualifications -> `{qualification, institution, year}`
  - research_interests / teaching_areas / awards / memberships -> string arrays
  **How to apply:** before changing any synced field shape, check how
  `staff-profile.tsx` renders it and the matching interface in `api-types.ts`.
- The sync must be isolated (try/catch + log) so a failure never blocks approval.
