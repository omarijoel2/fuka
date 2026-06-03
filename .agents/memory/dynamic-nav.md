---
name: Dynamic navigation architecture
description: How CMS-managed navigation works — storage, API, frontend merge logic, and what stays hardcoded.
---

## Rule
Navigation submenu links are stored in `site_config` (group: `navigation`, key: `primary_nav`) as flat `{label, url, children: [{label, url, external?}]}` arrays. The public endpoint `GET /api/navigation` serves them. The navbar `mergeWithCms()` function overlays CMS children onto the hardcoded `navItems` — if an item has CMS children, those replace its mega-menu; if empty, the hardcoded mega-menu is used.

**Why:** Enables CMS admins to add/remove/edit submenu links without a code deploy. Departments mega-menu (`megaType: "departments"`) is always kept hardcoded because it pulls from the `departments` DB table via a structured grouped layout, not manageable as a flat link list.

**How to apply:**
- Seeder: `SiteConfigSeeder.php` → `staff_documents` group seeds policy documents; `navigation` group seeds all primary nav items with full flat children.
- CMS: `navigation-manager.tsx` Primary Navigation tab shows each item with an expandable children editor (`PrimaryNavItemRow`). Utility and footer nav tabs use the simpler `NavItemRow`.
- Frontend: `useNavConfig()` in `api-hooks.ts` fetches `/api/navigation` with 5-min staleTime. `mergeWithCms(navItems, navConfig?.primary_nav)` in `Navbar` component.
- DropdownPanel: multi-column (2-col `w-96`) when `children.length > 6`, single-col (`w-56`) otherwise.
- `SiteConfigController::ALLOWED` includes `staff_documents` group.
- Staff portal `GET /api/staff/policy-documents` reads `site_config staff_documents` group (auth:sanctum required).
