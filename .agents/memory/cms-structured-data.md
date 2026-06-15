---
name: CMS structured_data save preservation
description: When a CMS editor rebuilds structured_data on save, it must spread the previously-loaded structured_data first or server-set keys are silently wiped.
---

When an editor's save payload rebuilds `structured_data` from local form state (e.g. articles-cms buildPayload), it must spread the originally-loaded `structured_data` before overriding keys: `{ ...loadedSd, blocks, external_url, ... }`.

**Why:** Some keys are set server-side, not in the form — notably `gallery_album_slug` and `gallery_album_id`, which the publish endpoint generates from image blocks. If the save sends only the form-known keys, a later edit/save drops those server-set keys (data loss; gallery linkage disappears).

**How to apply:** Any time you add new fields into a CMS editor's `structured_data` payload, keep a `loadedSd` snapshot of the article's structured_data (set in openEdit / cleared in openNew) and spread it first in the payload. Applies to news/article content stored in cms_content.structured_data.
