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
    products/route.ts       Catalog API: searchProducts() direct from ERPNext
                            (60s revalidate, 503 JSON on failure)
  layout.tsx              Root layout: redirects to /my
  globals.css             Design tokens (CSS variables) + Tailwind layers

components/               Presentational + client-interactive components
  auth/                   Auth UI: login/sign-up/forgot/update forms, auth buttons
  catalog/                Catalog UI: product-card, product-catalog, product-detail,
                          products-breadcrumb (all wired via lib/catalog queries)
  layout/                 Header, Footer, theme-switcher
  marketing/              Placeholder marketing UI: hero, faq, testimonials
                          (content from data/dummy/*, not wired to Supabase)
  providers/              Client providers (react-query QueryClient)
  scaffold/               Legacy starter-kit scaffold (tutorial/*, logos, etc.)

data/
  dummy/                  Placeholder marketing content (home-products, faq,
                          testimonials, about) as typed TS modules

lib/
  catalog/
    search-products.ts    Unified searchProducts()/getProductDetail() reading
                            ERPNext directly (no Supabase mirror)
    product-card-item.ts    ProductCardItem display DTO + toProductCardItem adapter
    stock.ts                Shared stock buckets/thresholds/badge tones
    client.ts               Client-side fetch layer (fetchCatalog, query keys)
  constants.ts            Shared app constants (LOW_STOCK_THRESHOLD, page sizes, …)
  supabase/
    client.ts              Browser Supabase client (Client Components)
    server.ts               Server Supabase client (Server Components/Route Handlers), per-request
    proxy.ts                 Current session-refresh helper, used by proxy.ts middleware
  i18n.ts                   next-intl config (locales, defaultLocale, getRequestConfig)
  utils.ts                  `cn()` class-merge helper

types/
  index.type.ts           Central shared types (domain, catalog, props, dummy
                          content). Type-only module, safe to import anywhere.
                          Runtime helpers stay in their feature modules.

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
  confirmation via `app/api/auth/confirm/route.ts` using `verifyOtp`).
- **Domain data**: user data lives in Supabase (`enquiries` table + auth).
  Product/catalog data is read live from ERPNext (see above) — the old
  `categories`/`products`/`sync_runs` mirror tables in
  `supabase/migrations/20260912_000000_create_catalog_schema.sql` are
  deprecated; a cleanup migration dropping them is pending verification of
  whether that migration was ever applied anywhere. Until an ORM decision is
  recorded in `MEMORY.md`, **new domain tables should be created as plain
  Supabase SQL migrations** with RLS policies, not assumed to go through
  an ORM.
- **Storage**: none yet. When Amazon S3 is integrated, it should sit behind
  a small `lib/storage/` wrapper (mirroring `lib/supabase/`) so callers
  never touch the AWS SDK directly.

## ERPNext catalog integration

ERPNext is the upstream source for catalog data **and** the direct read
source — there is no Supabase mirror. The integration uses the standard
`Item` and `Item Group` DocTypes, read through the ERPNext REST API with
token authentication. The exact custom field names for Myanmar/English
content and actual stock must be confirmed against the target ERPNext
instance before this returns real data.

The data flow is:

```text
Browser → product-catalog.tsx (react-query)
        |
        v
GET /api/products (revalidate 60s)
        |
        v
lib/catalog/search-products.ts
        |
        v
ERPNext Item / Item Group / Bin (internal Docker network)
```

- ERPNext URL and token are server-only environment variables.
- The catalog API caches responses for 60 seconds per URL; browser code
  talks only to `/api/*` and never calls ERPNext directly.
- ERPNext rows are normalized in `search-products.ts` to the shared
  `Category` / `Product` shapes (bilingual names with English fallback,
  numeric MMK prices, Bin-summed stock, enabled state, image URL).
- Stock is the sum of `Bin.actual_qty` across warehouses until a warehouse
  scope is decided (see `MEMORY.md`); missing Bin rows mean zero stock.
- Sort maps to ERPNext `order_by`; search maps to `or_filters` across item
  name/code/Myanmar name; id-list queries are capped (`MAX_LIST_IDS`).
- A failed ERPNext request throws: the API route returns 503 JSON and the
  products error boundary (`app/[locale]/products/error.tsx`) renders with
  retry. Detail lookups return `null` only on genuine 404 (→ not-found page).
- The old Supabase mirror (`categories`/`products`/`sync_runs` tables, sync
  endpoint, `lib/erpnext/sync.ts`) was removed; `enquiries` + auth remain in
  Supabase. If the old catalog migration was ever applied anywhere, a cleanup
  migration dropping those tables is still pending verification.

## Deployment topology

Self-hosted single-Droplet topology (DigitalOcean). One Droplet runs Docker
with two sibling containers on a shared custom Docker network:

```text
                    DigitalOcean Droplet (Docker)
                    ┌─────────────────────────────────┐
                    │      shared Docker network      │
                    │                                 │
                    │  erpnext              website   │
                    │  (Frappe stack +      (Next.js  │
                    │   MariaDB + Redis)     app)     │
                    │       ^                    │    │
                    │       │ internal API       │    │ outbound
                    │       │ (not public)       │    │ to Supabase
                    └───────┼────────────────────┼────┘
                            │                    │
                            v                    v
                   ERPNext API            Supabase Postgres
                   (MariaDB/Redis)        (external, website only)
```

- The Website container talks to ERPNext over the **internal Docker network**
  using ERPNext's container hostname (e.g. `http://erpnext-backend:8000`),
  never a public URL. `ERPNEXT_BASE_URL` on the server is this internal
  hostname. ERPNext's API port is not exposed publicly.
- ERPNext's dockerized database (MariaDB + Redis) is entirely separate from
  and unrelated to Supabase Postgres. ERPNext never talks to Supabase
  directly — only the Website container's server-side sync code
  (`lib/erpnext/sync.ts` via `app/api/catalog/sync/route.ts`) reads from
  ERPNext and writes to Supabase. This is a one-way mirror, matching the
  read-only ERPNext integration decision.
- Only the Website container needs outbound internet access (to reach
  Supabase). ERPNext needs no outbound internet access for this integration.
- Single-Droplet hosting is a deliberate simplicity tradeoff for current
  scale: ERPNext and the website share fate (one Droplet down = both down).
  Recorded as an accepted tradeoff, not an oversight.

Explicitly unresolved (see `MEMORY.md` → Known gaps, do not invent answers):
reverse-proxy/TLS termination, ERPNext database volume backups, and any
multi-host or HA evolution.

## Extension seams

- **New route group**: add under `app/[locale]/`, following the existing
  `layout.tsx` + `page.tsx` pattern; wrap client-only islands in
  `<Suspense>` as done throughout `app/[locale]/products/page.tsx`.
- **New Supabase-backed feature**: add a SQL migration + RLS policy, then a
  typed query function colocated with the feature (do not scatter raw
  `.from(...)` calls through components — wrap them).
- **New design tokens**: add to `app/globals.css` (`:root` / `.dark`) and,
  if it's a new semantic color, extend `tailwind.config.ts` `theme.extend.colors`
  — never introduce a new raw hex value inline in a component.
- **File storage**: introduce `lib/storage/s3.ts` with a narrow interface
  (`uploadProductImage`, `getPublicUrl`, etc.) before any component talks to
  S3 directly.
