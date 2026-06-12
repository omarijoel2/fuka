---
name: CMS page structured_data full-replace
description: How admin PUT /api/admin/pages/{slug} overwrites structured_data and how to avoid wiping sibling keys.
---

# CMS page `structured_data` is fully replaced on save

The admin endpoint `PUT /api/admin/pages/{slug}` writes whatever `structured_data`
object the client sends — it does NOT merge. Sending a partial object silently
drops every key you omit.

**Why:** the controller assigns the incoming `structured_data` wholesale. A page
editor that only sends `{ standards }` will erase `media`, and vice versa. This bit
the Service Charter page (standards + media live in the same `structured_data`).

**How to apply:** in any CMS page editor, retain the full loaded `structured_data`
(e.g. in a ref) on `load()`, then spread it on every save:
`{ ...loadedSd, <thekeysIedited> }`. Always send the complete object, not a slice.
Better long-term fix would be server-side merge/PATCH, but the client-spread guard
is the current convention.

Related: public read is `GET /api/pages/{slug}` (returns `data.structured_data`);
media shape is `media = { video:[{url,title}], audio:[{url,title}], images:[{url,caption}] }`.
Uploads go to `POST /api/admin/media` (field `file`) which returns `{ data: { url } }`,
whereas `apiUploadFile` is typed `{ url }` — read `result.data?.url ?? result.url`.
