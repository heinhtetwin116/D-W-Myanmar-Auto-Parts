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
| CI                     | **GitHub Actions** (`ci.yml`)                                     | Lint/typecheck/format/build + security scanning.                                                                       |
| Git hooks              | **Husky + lint-staged**                                           | Pre-commit auto-fix/format on staged files only.                                                                       |
| i18n                   | **next-intl**                                                     | Locale prefix required: `my` (default Myanmar) / `en` English. Middleware handles locale detection.                    |

## Module boundaries

```
app/                      Routes (App Router). Pages + layouts + route handlers.
  [locale]/               All locale-scoped routes (my/en)
    auth/                   Login, sign-up, forgot/update password, error page
    products/               Catalog + detail pages
    about/                  About page
    layout.tsx              Locale layout: providers, Header, Footer
    page.tsx                Home page
  api/
    auth/confirm/route.ts   Email confirmation (locale-aware redirect)
  layout.tsx              Root layout: redirects to /my
  globals.css             Design tokens (CSS variables) + Tailwind layers

components/               Presentational + client-interactive components
  header.tsx                i18n-ready header with locale switcher
  footer.tsx                i18n-ready footer
  product-card.tsx          Product display card
  login-form.tsx            D&W-specific auth UI (Tailwind, wired to Supabase)
  sign-up-form.tsx          D&W-specific auth UI (Tailwind, wired to Supabase)
  forgot-password-form.tsx  Auth UI (antd, wired to Supabase)
  update-password-form.tsx  Auth UI (antd, wired to Supabase)
  auth-button.tsx / logout-button.tsx  Session-aware nav controls
  theme-switcher.tsx        Light/dark/system toggle (next-themes)

lib/
  supabase/
    client.ts              Browser Supabase client (Client Components)
    server.ts               Server Supabase client (Server Components/Route Handlers), per-request
    proxy.ts                 Current session-refresh helper, used by proxy.ts middleware
  i18n.ts                   next-intl config (locales, defaultLocale, getRequestConfig)
  utils.ts                  `cn()` class-merge helper, `hasEnvVars` guard

proxy.ts                   Next.js middleware entry point — locale detection + session refresh
```

## Request / auth data flow

1. **Every non-static request** hits `proxy.ts`, whose `config.matcher`
   excludes static assets, images, and API routes.
2. `proxy.ts` calls `updateSession()` (`lib/supabase/proxy.ts`), which:
   - Builds a request-scoped Supabase server client (cookie get/set wired to
     the Next.js request/response).
   - Calls `supabase.auth.getClaims()` to refresh/validate the session.
   - **Locale detection**: extracts locale from URL prefix (`/my/...`, `/en/...`);
     if missing, redirects to `/my` (default).
   - Redirects unauthenticated users to `/{locale}/auth/login` for any path
     other than `/`, `/{locale}/login*`, `/{locale}/auth*`.
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

## UI layering

The UI follows a **D&W-specific Ant Design (`antd`) path**.

### UI foundation

**Ant Design (`antd v6`)** is the primary UI component library for the application. It provides the base components and interaction patterns used throughout the system, including:

- `Button`
- `Form`
- `Input`
- `Select`
- `Card`
- `Dropdown`
- `Modal`
- `Table`
- `Pagination`
- `Tag`
- Other standard controls as required

The goal is to use Ant Design primitives consistently rather than creating separate replacements for components that antd already provides.

### D&W-specific UI

D&W-specific components are built **on top of Ant Design** to match the application's design system, branding, and business requirements.

Examples include:

- `header.tsx`
- `footer.tsx`
- `product-card.tsx`
- Authentication forms
- Product management components
- Product/category-specific controls
- Other domain-specific UI components

These components may compose multiple antd components and add D&W-specific layout, content, behavior, and styling.

### Styling responsibility

**Tailwind CSS** is used for application-specific layout and styling where needed, while Ant Design remains the source of reusable UI primitives.

The layering is:

```text
D&W Pages / Features
        ↓
D&W-specific Components
        ↓
Ant Design Components
        ↓
Ant Design Design System
```

For example:

```text
Product Page
    ↓
D&W Product Details
    ↓
Card / Button / Tag / Table
    ↓
Ant Design
```

### Component ownership

Use the following rule when deciding where a UI component belongs:

1. **If Ant Design already provides the required component, use antd.**
2. **If the component represents D&W-specific business functionality, create a D&W-specific component using antd primitives.**
3. **Do not create a custom component solely to replace an existing antd component without a clear requirement.**
4. **Keep D&W branding, domain logic, and business-specific composition outside the underlying antd primitives.**

This keeps the UI consistent while allowing D&W-specific screens to have their own identity.

### Authentication UI

Authentication screens should follow the same D&W-specific Ant Design approach.

Auth forms should use Ant Design components such as `Form`, `Input`, `Button`, and related controls, while the surrounding layout, branding, validation behavior, and Supabase integration remain D&W-specific.

The target pattern is:

```text
D&W Auth Form
    ↓
Ant Design Form / Input / Button
    ↓
Supabase Client
```

### Design-system relationship

The D&W design system defines the application's visual language, while Ant Design provides the underlying UI primitives.

D&W-specific requirements such as:

- Brand colors
- Typography
- Spacing
- Border radius
- Product presentation
- Status indicators
- Layout
- Responsive behavior

should be applied through the D&W layer rather than modifying or replacing the overall Ant Design component architecture.

### Target architecture

The intended UI architecture is:

```text
┌─────────────────────────────────────┐
│          D&W Pages / Features       │
├─────────────────────────────────────┤
│       D&W-specific Components       │
├─────────────────────────────────────┤
│          Ant Design (antd)          │
├─────────────────────────────────────┤
│       Tailwind / CSS Utilities      │
└─────────────────────────────────────┘
```

**Ant Design is the UI foundation. D&W-specific components provide the product-specific experience on top of it. Tailwind CSS supports custom layout and styling rather than acting as a competing component system.**

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

## ERPNext catalog integration

ERPNext is the upstream source for catalog data. The first integration uses
the standard `Item` and `Item Group` DocTypes and reads them through the
ERPNext REST API with token authentication. The exact custom field names for
Myanmar/English content and actual stock must be confirmed against the target
ERPNext instance before implementation.

The intended data flow is:

```text
ERPNext Item / Item Group
        |
        v
Server-only manual sync
        |
        v
Supabase catalog mirror + sync_runs
        |
        v
Public products pages
```

- ERPNext URL and token are server-only environment variables.
- The public catalog reads the last successful Supabase snapshot; browser code
  must never call ERPNext directly.
- The mirror stores normalized bilingual product/category data, ERPNext source
  IDs, numeric MMK prices, actual stock, enabled/published state, image URL,
  and timestamps.
- Sync writes are privileged server-side operations. Public catalog tables are
  exposed only with explicit grants and RLS policies for published reads.
- A failed sync records an error in `sync_runs` and must not replace the last
  successful catalog snapshot.
- The first milestone is a manually triggered sync. Scheduling and operator
  alert delivery are follow-up work.

The repository currently has no `supabase/` migration directory. When schema
work begins, use the project's chosen Supabase migration workflow and keep
catalog tables, indexes, grants, and RLS policies together in the same schema
change.

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
