---
name: Foundation dev API target (local vs remote)
description: How the kafu-foundation dev preview reaches the backend, and why fetchApi vs raw fetch can hit different backends.
---

# `VITE_API_URL` is PRODUCTION-scoped only — dev preview uses the LOCAL API

In `.replit` the var lives under `[userenv.production]` (managed via the env store, NOT a directly-editable `.replit` line — use the environment-secrets skill's `setEnvVars({environment:"production"})`). There is **no development-scoped** `VITE_API_URL`.

**Consequence:** in the dev preview `import.meta.env.VITE_API_URL` is empty, so `fetchApi` becomes **relative** and is served by the vite dev proxy. A `/api` proxy → `http://localhost:${API_PORT||8080}` exists in `vite.config.ts` server.proxy (mirrors the production Apache ProxyPass). So the dev preview reads the **local Laravel API on 8080** — locally-built modules DO render in the preview. No hacks needed.

The production value is `https://kafu.ac.ke` (same domain the prod frontend is served from; functionally same-origin). Note: `replit.md`'s deployment checklist says prod can also leave it empty (same-domain Apache proxy) — both work; the explicit value is the user's choice.

## Two fetch paths — keep them consistent per module
- `fetchApi()` (`src/lib/api-types.ts`) prefixes `import.meta.env.VITE_API_URL`. Empty in dev → relative → proxy → local. It also **unwraps `.data`**, so it is NOT usable for paginated endpoints.
- Raw `fetch("/api/...")` (research/international/repository/alumni-directory hooks) is relative and returns the full pagination envelope. This is why paginated lists use raw fetch — intentional, not a bug.

If a production `VITE_API_URL` is ever set, fetchApi hooks would go remote while raw-fetch hooks stay relative — keep this divergence in mind.

## Hero h1 invisibility gotcha
`index.css` forces all headings to `text-primary` (green). On a `bg-primary` / photo-overlay hero this is green-on-green and invisible. Add explicit `text-primary-foreground` to hero `<h1>` (done for institutional-data.tsx and alumni.tsx).
