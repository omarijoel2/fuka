---
name: CMS page-builder HTML sanitization
description: Any surface that stores or renders CMS-authored page HTML must sanitize both server- and client-side.
---

# CMS page-builder HTML sanitization

Editor-authored `type=page` content has a raw HTML `body` (and `summary`) that is
rendered on the public site via `dangerouslySetInnerHTML`. This is a stored-XSS
sink.

**Rule:** Any new code path that stores or renders CMS page HTML must sanitize on
BOTH sides:
- Server (authoritative): sanitize `body`/`summary` for `type==='page'` on
  create AND update using `kafuSanitizeHtml()` (HTMLPurifier allowlist) before
  persisting. So the public API only ever serves clean HTML.
- Client (defense-in-depth): run `DOMPurify.sanitize()` before
  `dangerouslySetInnerHTML`.

**Why:** A code review flagged unsanitized `body` rendering as a serious stored-XSS
risk affecting all public visitors. Server-side is the source-of-truth fix;
client-side guards against any unsanitized data slipping in another way.

**How to apply:** HTMLPurifier (`ezyang/htmlpurifier`) is already a dependency. Its
default doctype is XHTML 1.0, so HTML5-only tags like `figure`/`figcaption` are
unsupported and emit warnings + get stripped — keep them out of the allowlist
unless you set an HTML5 doctype. The allowlist deliberately excludes `script`,
event handlers, and non-http(s)/mailto/tel URI schemes.
