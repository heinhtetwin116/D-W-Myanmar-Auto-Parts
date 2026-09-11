# Architecture

This document describes how the system is put together today: module
boundaries, data flow, persistence, and the seams intended for future
extension. For _why_ the system exists, see `PROJECT_MAP.md`. For current
implementation status and gaps, see `MEMORY.md`.

## Stack

| Layer                  | Choice                                                            | Notes                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Frontend + backend     | **Next.js** (App Router, canary/latest)                           | One app serves pages, Server Components, Route Handlers, and (future) Server Actions. No separate backend service.     |
| Styling                | **Tailwind CSS**                                                  | Utility classes driven by semantic CSS variables — see `DESIGN_SYSTEM.md`.                                             |
| UI component library   | **Ant Design (antd v6)**                                          | Used for form controls, cards, dropdowns, etc. Coexists with hand-built Tailwind components — see "UI layering" below. |
| Database + Auth        | **Supabase** (Postgres, `@supabase/ssr`, `@supabase/supabase-js`) | System of record for identity today; will hold product/category data.                                                  |
| File storage (planned) | **Amazon S3**                                                     | Not yet integrated. Intended for product images and other media.                                                       |
| CI                     | **GitHub Actions** (`ci.yml`, `codeql.yml`)                       | Lint/typecheck/format/build + security scanning.                                                                       |
| Git hooks              | **Husky + lint-staged**                                           | Pre-commit auto-fix/format on staged files only.                                                                       |

## Module boundaries

```
app/                      Routes (App Router). Pages + layouts + route handlers.
  auth/                   Login, sign-up, forgot/update password, email confirm, error page
  protected/              Authenticated-only area (layout + page)
  layout.tsx              Root layout: fonts, ThemeProvider, metadata
  page.tsx                Public home page (currently the starter-kit tutorial page)
  globals.css             Design tokens (CSS variables) + Tailwind layers

components/               Presentational + client-interactive components
  tutorial/                 Legacy starter-kit scaffold (see MEMORY.md re: retirement)
  login-form.tsx           D&W-specific auth UI (Tailwind, not yet wired to Supabase)
  sign-up-form.tsx         D&W-specific auth UI (Tailwind, not yet wired to Supabase)
  forgot-password-form.tsx  Starter-kit auth UI (antd, wired to Supabase)
  update-password-form.tsx  Starter-kit auth UI (antd, wired to Supabase)
  auth-button.tsx / logout-button.tsx  Session-aware nav controls
  theme-switcher.tsx        Light/dark/system toggle (next-themes)

lib/
  supabase/
    client.ts              Browser Supabase client (Client Components)
    server.ts               Server Supabase client (Server Components/Route Handlers), per-request
    middleware.ts            Legacy session-refresh helper (see "Known duplication" below)
    proxy.ts                 Current session-refresh helper, used by proxy.ts middleware
  utils.ts                  `cn()` class-merge helper, `hasEnvVars` guard

proxy.ts                   Next.js "proxy" (middleware) entry point — route matcher + updateSession
```

## Request / auth data flow

1. **Every non-static request** hits `proxy.ts`, whose `config.matcher`
   excludes static assets and images.
2. `proxy.ts` calls `updateSession()` (`lib/supabase/proxy.ts`), which:
   - Builds a request-scoped Supabase server client (cookie get/set wired to
     the Next.js request/response).
   - Calls `supabase.auth.getClaims()` to refresh/validate the session.
   - Redirects unauthenticated users to `/auth/login` for any path other
     than `/`, `/login*`, `/auth*`.
   - Returns the `NextResponse` with refreshed cookies attached — **this
     step must not be skipped or reordered**, or sessions can be randomly
     invalidated.
3. **Server Components / Route Handlers** call `createClient()` from
   `lib/supabase/server.ts`, which creates a _new_ Supabase client per
   invocation (never a module-level singleton — required for Fluid compute
   correctness) using `next/headers` cookies.
4. **Client Components** call `createClient()` from `lib/supabase/client.ts`
   (`createBrowserClient`) for interactive flows (login, sign-up, password
   reset, sign-out).
5. **Supabase Postgres** is the persistence layer for both. Row Level
   Security policies are expected to gate all table access once
   product/category tables exist.

## UI layering (current, transitional)

The codebase currently contains **two parallel UI approaches**:

- **Starter-kit / Ant Design path** — `forgot-password-form.tsx`,
  `update-password-form.tsx`, `auth-button.tsx`, and the `tutorial/*`
  components. These are wired to Supabase and functional, styled with antd
  primitives (`Card`, `Form`, `Button`, inline styles).
- **D&W-specific / Tailwind path** — `login-form.tsx`, `sign-up-form.tsx`.
  These follow the design system (semantic tokens, custom markup, D&W logo)
  but are **not yet wired to Supabase** — their submit handlers are mocked
  (`console.log` + `setTimeout`).

This is a deliberate, in-progress migration, not two competing standards.
New auth/account UI should follow the Tailwind path and be wired to the
`lib/supabase/client.ts` client per the pattern already used in
`forgot-password-form.tsx`. See `MEMORY.md` for the exact status and
`CODING_GUIDELINES.md` for the target pattern.

## Persistence

- **Auth**: fully owned by Supabase Auth (`auth.users`, sessions, email
  confirmation via `app/auth/confirm/route.ts` using `verifyOtp`).
- **Domain data (products/categories)**: not yet modeled. `.env.example`
  reserves a `DATABASE_URL` "for ORM," implying a typed-migration tool
  (e.g. Prisma or Drizzle) is anticipated but not yet chosen or wired up.
  Until a decision is recorded here, **new domain tables should be created
  as plain Supabase SQL migrations** with RLS policies, not assumed to go
  through an ORM.
- **Storage**: none yet. When Amazon S3 is integrated, it should sit behind
  a small `lib/storage/` wrapper (mirroring `lib/supabase/`) so callers
  never touch the AWS SDK directly.

## Known duplication (flag, do not silently "fix")

`lib/supabase/middleware.ts` and `lib/supabase/proxy.ts` implement nearly
identical `updateSession()` logic; only `proxy.ts` is currently wired into
`proxy.ts` (the middleware entry point). `middleware.ts` appears to be a
leftover from renaming Next.js "middleware" to "proxy" in newer Next.js
versions. Do not delete without confirming nothing still imports it — see
`MEMORY.md` for tracking.

## Extension seams

- **New route group**: add under `app/`, following the existing
  `layout.tsx` + `page.tsx` pattern; wrap client-only islands in
  `<Suspense>` as done throughout `app/auth/*`.
- **New Supabase-backed feature**: add a SQL migration + RLS policy, then a
  typed query function colocated with the feature (do not scatter raw
  `.from(...)` calls through components — wrap them).
- **New design tokens**: add to `app/globals.css` (`:root` / `.dark`) and,
  if it's a new semantic color, extend `tailwind.config.ts` `theme.extend.colors`
  — never introduce a new raw hex value inline in a component.
- **File storage**: introduce `lib/storage/s3.ts` with a narrow interface
  (`uploadProductImage`, `getPublicUrl`, etc.) before any component talks to
  S3 directly.
