---
name: Foundation dev API target (difbac vs local)
description: Why newly-built foundation pages render empty in the dev preview, and how fetchApi vs raw fetch reach different backends.
---

# Foundation dev preview fetches from a REMOTE API by default

The kafu-foundation dev server is configured (via `.replit` env `VITE_API_URL`) to point at a **remote** deployed API (e.g. `https://kafu.difbac.com`), NOT the local Laravel API on port 8080.

**Consequence:** any module built locally (new tables/routes/seed data) renders EMPTY in the dev preview, because the remote API returns 404 for endpoints that only exist locally. The local backend can be 100% correct and still show nothing in the preview. Verify new backend work with `curl localhost:8080/api/...`, not just by looking at the preview.

## Two fetch paths reach DIFFERENT backends
- `fetchApi()` (in `src/lib/api-types.ts`) uses `import.meta.env.VITE_API_URL` as an **absolute** origin → goes to the remote difbac when that env is set, **bypassing** the vite dev proxy.
- Raw `fetch("/api/...")` (used by research/international/repository hooks) is **relative** → same-origin → hits the vite dev proxy.

So with `VITE_API_URL` set, `fetchApi` hooks and raw-`fetch` hooks can silently read from two different databases. Keep a module's hooks on ONE strategy.

## Making the whole foundation use the local API in dev
A `/api` proxy → `http://localhost:${API_PORT||8080}` exists in `vite.config.ts` server.proxy (mirrors the production Apache ProxyPass). It only takes effect for RELATIVE fetches. To route everything (including `fetchApi`) at the local API, set `VITE_API_URL=""` so `fetchApi` becomes relative too.

**Why:** difbac is the user's deliberate `.replit` setting (live/staging content). Switching the whole preview to local seed data is a user-visible change — confirm before flipping `VITE_API_URL`.

## Quick local visual verification trick
To screenshot a locally-built page without touching `.replit`: temporarily hardcode `const API_ORIGIN = ""` in `api-types.ts` (forces relative → proxy → local 8080), restart "Start application", screenshot, then revert.
