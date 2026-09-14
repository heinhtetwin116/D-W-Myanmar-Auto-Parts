# Project Memory

Factual current status, known gaps, and session handoff for D&W Myanmar
Auto Parts. This is the **only** doc that should change frequently — every
other doc in `/docs` should stay stable unless a durable rule actually
changes (see `AGENTS.md` → Documentation maintenance).

## Current status (verified against the repository as of this entry)

**Foundation / tooling**

- Next.js (App Router, `next: "latest"`, currently resolving to a 16.x
  canary build), TypeScript strict, Tailwind CSS 3.4, Ant Design 6.
- Supabase auth wired via `@supabase/ssr`: `lib/supabase/{client,server,proxy}.ts`.
- `proxy.ts` (root) is the active Next.js middleware entry, calling
  `updateSession()` from `lib/supabase/proxy.ts` with locale-aware auth redirects.
- Husky + lint-staged installed; ESLint (`next/core-web-vitals` +
  `next/typescript`) + Prettier configured.
- CI: `ci.yml` (lint, typecheck, format check, build) and `codeql.yml`
  (security scan) both present and correctly gated (build depends on
  quality).
- Design tokens for the brand palette (Obsidian / Cool Soft Gray / Crimson
  Red) are implemented as hex CSS variables in `app/globals.css` and
  exposed directly via `tailwind.config.ts`. They line up with the hex values
  in `DESIGN_SYSTEM.md`.
- Status color tokens (success, warning, critical) added to globals.css and tailwind.config.ts.
- Hex Bloom hover/focus glow effect implemented on primary interactive elements.
- Manrope font configured via Google Fonts in `app/[locale]/layout.tsx`.
- `next-intl` configured for i18n with Myanmar (my) as default locale and English (en).
- Duplicate `lib/supabase/middleware.ts` removed (was legacy duplicate of `proxy.ts`).

**Auth flows implemented** (all wired to Supabase with i18n)

- Sign up (`app/[locale]/auth/sign-up/page.tsx` → `SignUpForm`)
- Login (`app/[locale]/auth/login/page.tsx` → `LoginForm`)
- Forgot password (`app/[locale]/auth/forgot-password/page.tsx` →
  `ForgotPasswordForm`, wired to Supabase, functional)
- Update password (`app/[locale]/auth/update-password/page.tsx` →
  `UpdatePasswordForm`, wired to Supabase, functional)
- Email confirmation route (`app/api/auth/confirm/route.ts`, uses
  `verifyOtp`, functional, locale-aware redirects)
- Auth error page (`app/[locale]/auth/error/page.tsx`, functional)
- Sign-out (`components/logout-button.tsx`, functional)

**Public pages implemented**

- Home page (`app/[locale]/page.tsx`) — Hero, Features bar, Value Props, Featured Products (from Supabase), Latest Products, Trust Indicators, CTA
- About page (`app/[locale]/about/page.tsx`) — Hero, Company story, Mission/Vision/Values, Team, Locations
- Products catalog (`app/[locale]/products/page.tsx` + `components/product-catalog.tsx`) — Server Component fetches Supabase via typed queries; client island for search/category/stock filters + pagination (12/page); antd-first, i18n-ready
- Product detail (`app/[locale]/products/[slug]/page.tsx`, slug = product id) — image, category tag, stock badge, MMK price, specs table, related products, `notFound()` on missing/disabled
- Shared layout components: `Header`, `Footer` (`components/layout/`, default exports, no locale prop yet)

**Domain data & ERPNext integration (Phase C milestone: schema + manual sync)**

- ERPNext client (`lib/erpnext/client.ts`) — typed REST API wrapper with token auth, pagination, field selection
- Catalog schema (`supabase/migrations/20260912_000000_create_catalog_schema.sql`) — categories, products, sync_runs tables with RLS (public read-enabled, server-write)
- Catalog types (`lib/erpnext/types.ts`) — `Category`, `Product`, `SyncRun`, ERPNext DocType refs
- Typed queries (`lib/erpnext/queries.ts`) — getCategories, getProducts, getProductById, getProductCount (never raw `.from(...).select(...)`)
- Manual sync (`lib/erpnext/sync.ts`) — idempotent upsert by erpnext_id, records sync_runs, preserves last successful snapshot on failure
- Sync endpoint (`app/api/catalog/sync/route.ts`) — POST to trigger manual sync; TODO: add auth check (require admin role or bearer token)
- Products page (`app/[locale]/products/page.tsx`) — reads from Supabase catalog; pagination, filter support, i18n-ready

## Known gaps (open, not yet fixed)

1. **Contact page** (`app/[locale]/contact/page.tsx`) — scaffold only, form submit not wired.
2. **Admin area** (`app/[locale]/admin/*`) not yet scaffolded (Phase C).
3. **ORM decision undecided.** `.env.example` reserves `DATABASE_URL` "for
   ORM," but no ORM is installed and `ARCHITECTURE.md` currently directs
   new tables to be plain Supabase SQL migrations until this is decided.
4. **No automated tests.** No test runner is configured (see
   `CODING_GUIDELINES.md` → Testing contracts).
5. **No pre-push type-check.** Only CI catches TypeScript errors; the
   pre-commit hook runs lint-staged only (lint + format), not `tsc`.
6. **ERPNext field mapping not confirmed.** Custom field names for bilingual content (`custom_name_my`, etc.) and stock source (warehouse/quantity field) must be verified against target ERPNext instance.
7. **Sync endpoint lacks authentication.** `/api/catalog/sync` has TODO: require admin role or bearer token before accepting manual trigger.
8. **No scheduled sync or alert delivery.** Manual trigger only; deferred to next milestone.

## Decisions recorded

- Design-token values are treated as already-correct and already
  implemented for the brand palette (see Current status); no rework needed
  there, only the additions listed in Known gaps.
- New domain tables go through plain Supabase SQL migrations, not an ORM,
  until an ORM decision is explicitly recorded here.
- The AntD-first UI path (ARCHITECTURE.md → "UI layering") is the decided
  direction for D&W screens: build on antd primitives, Tailwind for layout
  support. Decided in interview 2026-09-12, superseding the earlier
  Tailwind-first note.
- i18n with `next-intl`: Myanmar (my) default, English (en) supported. All UI strings in `messages/my.json` and `messages/en.json`.
- Catalog reads Supabase (`categories`/`products`) via `lib/erpnext/queries.ts`;
  no local JSON source exists (no `data/` directory). Prior "local JSON" notes
  were stale.
- Header/Footer live in `components/layout/` as default exports without locale
  props; their links are locale-agnostic and need an i18n follow-up.
- PRs target the `development` branch only (not `main` as WORKFLOW.md previously
  stated). Decided in interview 2026-09-12.
- ERPNext integration decisions: server-only credentials, enabled Items only,
  actual stock, `Item.image`, numeric MMK prices, ERPNext source IDs, last
  successful Supabase snapshot on failure, persisted sync logs, and no
  scheduling or alert delivery until manual sync is verified.
- ERPNext source mapping decisions: use `Item` and `Item Group`; store
  normalized bilingual catalog metadata plus source IDs in Supabase; use
  numeric MMK prices; keep enquiry actions visual-only for the first sync
  milestone; and defer scheduled execution and alert delivery until the
  manual sync is verified.
- Naming convention decision: all new page and component filenames use
  kebab-case; Next.js reserved filenames remain `page.tsx`, `layout.tsx`, and
  `route.ts`; exported React component symbols remain PascalCase. Existing
  PascalCase component files are legacy exceptions until intentionally renamed
  with their imports.

## Session handoff

**Current session (2026-09-14, catalog reverted to original design):**

- What changed (per interview: f1692b8 visuals + antd, plumbing untouched):
  - Rebuilt `components/product-catalog.tsx` render as the original layout:
    masthead (title + subtitle + `{total} products found` count), sticky
    sidebar rail (category Menu + stock-status Menu), toolbar (full-width
    search, Popular `CheckableTag` pills, sort Select), 1/2/4 grid, antd
    Pagination + Empty — all antd primitives, zero custom buttons
  - Kept react-query fetching, `/api/products`, `searchProducts`, dummy
    fallback, URL searchParams, and i18n plumbing exactly as-is; added
    `filter_by_categories`/`popular`/`products_found` keys to `en`+`my`
    messages; dropped the now-unused `showing`/`of`/`results` labels
- Verified: `/my` + `/en` products → 200 with masthead/sidebar/pills
  markers in HTML; grid hydrates client-side as before; `eslint` 0 errors;
  `format:check` passes; `git diff --check` clean; `tsc` shows only the 5
  pre-existing ERPNext errors
- Left open: Contact form backend, Admin CRUD, sync endpoint auth, scheduled sync,
  ERPNext type errors

**Previous session (2026-09-14, products 500 root-cause fix):**

- Root cause found (was NOT react-query): `@ant-design/icons@6.3.4` ships no
  `"use client"` directive in either build, so importing it in a Server
  Component makes Turbopack evaluate the CJS `lib/` build in RSC scope where
  `react` resolves to the vendored RSC stub without `createContext` → 500 on
  `/my/products`. Reproduced on the clean tree, ruling out react-query.
  Additionally, destructured/member-access antd subcomponents
  (`const { Title } = Typography`, `<Typography.Title>`) resolve to
  `undefined` when rendered from a Server Component here.
- What changed:
  - New `components/products-breadcrumb.tsx` (client island, was inline in
    both product pages) and `components/product-detail.tsx` (full detail UI
    as client island receiving serializable props)
  - Both product pages are now antd-free Server Components (plain HTML +
    tokens for shells and Suspense fallbacks); rule recorded in
    `docs/CODING_GUIDELINES.md`
  - Restarted the dev server to clear corrupt Turbopack HMR state from the
    bisect churn
- Verified: `/my/products` → 200, `/en/products` → 200 (was 500);
  user confirmed the product grid renders with dummy data in the browser;
  `eslint` 0 errors; `format:check` passes; `git diff --check` clean;
  `tsc` shows only the 5 pre-existing ERPNext errors
- Left open: Contact form backend, Admin CRUD, sync endpoint auth, scheduled sync,
  ERPNext type errors (detail-page dummy fallback noted earlier still applies)

**Previous session (2026-09-14, unified searchProducts + sort):**

- What changed:
  - Added `ProductSort` (`name`/`price_asc`/`price_desc`/`newest`) to
    `lib/erpnext/queries.ts` with `applyProductSort` helper; `getProducts`
    accepts `sort` (default `name`, preserving old behavior)
  - Added `lib/catalog/dummy-catalog.ts` (dummy filtering/sorting/pagination
    over `data/*.json`) and unified `lib/catalog/search-products.ts` exposing
    `searchProducts(supabase, params)` with two independently commentable
    source blocks (SOURCE 1: Supabase try-block, SOURCE 2: dummy return)
  - Slimmed `app/api/products/route.ts` to param parsing + `searchProducts`
    delegation (still exports `CatalogResponse` for the client)
  - Added sort Select to `components/product-catalog.tsx` (merge-semantics
    `pushParams` refactor) + `sort_by`/`sort_name`/`sort_price_asc`/
    `sort_price_desc`/`sort_newest` keys in `messages/en.json` + `messages/my.json`
- Verified: `eslint` 0 errors; `format:check` passes; `git diff --check`
  clean; `tsc` shows only the 5 pre-existing ERPNext errors; live smoke
  tests: `sort=price_desc` → 320000 first, `sort=price_asc` → 15000 first,
  `category=cat-filters` → 2 items + 8 categories, all `source:dummy`
- Left open: detail page still queries Supabase directly (dummy ids 404
  there); the `/my/products` 500 (`createContext`, pre-existing on clean
  tree — `@ant-design/icons` CJS evaluated in RSC scope) is under
  investigation; Contact form backend, Admin CRUD, sync endpoint auth,
  scheduled sync, ERPNext type errors

**Previous session (2026-09-14, react-query catalog + dummy fallback):**

- What changed:
  - Created `data/categories.json` (8) + `data/products.json` (16) dummy
    catalog matching Supabase `Category`/`Product` types (the `data/` dir
    existed but was empty)
  - Added `components/query-provider.tsx` (`QueryClientProvider`, 30s
    staleTime, no window-focus refetch) and wired it into
    `app/[locale]/layout.tsx`
  - Added `GET app/api/products/route.ts`: tries Supabase first; serves
    `data/*.json` with identical filtering/pagination when the DB is empty
    or errors; response includes `source: "db" | "dummy"`
  - Reworked `components/product-catalog.tsx` to fetch via
    `useSuspenseQuery` keyed on URL searchParams (shareable URLs kept);
    slimmed `app/[locale]/products/page.tsx` to server shell
    (breadcrumb/title/labels + Suspense)
- Verified: `eslint` 0 errors; `format:check` passes; `git diff --check`
  clean; `tsc` shows only the 5 pre-existing ERPNext errors (cleared a stale
  `.next` cache that added 2 phantom `app/protected` errors); live smoke
  test via dev server: `/api/products` → `source:dummy`, out-of-stock
  filter → exactly the 2 zero-stock items
- Left open: detail page still queries Supabase directly (dummy ids 404
  there); Contact form backend, Admin CRUD, sync endpoint auth, scheduled
  sync, ERPNext type errors

**Previous session (2026-09-14, local Manrope fonts):**

- What changed:
  - Switched Manrope loading from Google Fonts `<link>` to `next/font/local`
    in `app/layout.tsx`, using the 7 TTF weights in `public/fonts/manrope/`
    (200–800), exposed as `--font-manrope` on `<html>`; removed the
    `fonts.googleapis.com`/`gstatic.com` links (no external font requests)
  - Updated `AGENTS.md` + `docs/DESIGN_SYSTEM.md` font implementation notes
    (prior Google-Fonts-link mentions in older handoff entries are historical)
- Verified: `make lint` 0 errors; `format:check` passes; `git diff --check`
  clean; `make build` compiles successfully (local font paths resolve, routes
  OK) but still fails typecheck on the same 5 pre-existing ERPNext errors
- Left open: Contact form backend, Admin CRUD, sync endpoint auth, scheduled sync,
  ERPNext type errors

**Previous session (2026-09-12, kebab-case enforcement):**

- What changed:
  - Installed `eslint-plugin-check-file` (dev dep) and added
    `check-file/filename-naming-convention` (KEBAB_CASE, error) scoped to
    `app/`+`components/`+`lib/`, plus `check-file/folder-naming-convention`
    scoped to `components/`+`lib/` only (leaves Next.js `[locale]`/`[slug]`
    segments alone; reserved names like `page.tsx` already pass as kebab)
  - Renamed via `git mv` (exports unchanged, still PascalCase symbols):
    `ProductCard.tsx`→`product-card.tsx`, `FAQ.tsx`→`faq.tsx`,
    `layout/Header.tsx`→`layout/header.tsx`, `layout/Footer.tsx`→`layout/footer.tsx`
  - Updated imports in `app/[locale]/layout.tsx` + `app/[locale]/page.tsx`;
    fixed stale PascalCase filename refs in AGENTS.md, MEMORY.md, DESIGN_SYSTEM.md
  - Documented enforcement in `docs/CODING_GUIDELINES.md` (build gate, not style tip)
  - Left untouched: `components/tutorial/*` (starter-kit scaffold, out of scope);
    `supabase-logo.tsx` brand SVG; ERPNext type errors (other workstream)
- Verified: negative test (`components/BadName.tsx` fails lint, then removed);
  `make lint` 0 errors; `format:check` passes; `git diff --check` clean;
  `make build` compiles successfully (renames/imports resolve, routes OK) but
  still fails typecheck on the same 5 pre-existing ERPNext errors
- Left open: Contact form backend, Admin CRUD, sync endpoint auth, scheduled sync,
  ERPNext type errors

**Previous session (2026-09-12, interview + product detail page):**

- Interview answers recorded: AntD-first UI (ARCHITECTURE wins), product
  detail page next, Supabase catalog is source of truth, PRs to `development`
  only.
- What changed:
  - Built `components/product-catalog.tsx` (client island: antd Search,
    category/stock Selects, grid Cards, Pagination; router-driven searchParams)
    and `app/[locale]/products/page.tsx` (Server Component: typed Supabase
    queries, Suspense, load-error Empty state) — closes old gap #4
  - Built `app/[locale]/products/[slug]/page.tsx` (slug = product id):
    antd Breadcrumb/Card/Descriptions, stock Badge, MMK price, specs table,
    related products, `notFound()` on missing/disabled
  - Extended `lib/erpnext/queries.ts` with additive `StockFilter` (+ thresholds
    mirroring catalog badges) for `getProducts`/`getProductCount`; no existing
    callers affected
  - Added `showing`/`of`/`results` i18n keys to `messages/en.json` + `messages/my.json`
  - Reconciled stale docs: AGENTS (hex vars, font link, actual component paths),
    MEMORY (Supabase catalog truth, gaps renumbered, AntD-first + development-PR
    decisions), WORKFLOW (PR flow → development), CODING_GUIDELINES (locale
    paths, AntD-first UI section, wired-forms claim), ARCHITECTURE (migration
    exists, confirm-route path, locale route seam), DESIGN_SYSTEM (hex token
    table, font implementation)
- Verified: `make lint` 0 errors (only pre-existing `app/layout.tsx`
  custom-font warning); `make format:check` passes; `git diff --check` clean;
  `npx tsc --noEmit` reports only the 5 pre-existing ERPNext errors
  (`lib/erpnext/index.ts` + `lib/erpnext/sync.ts`, verified identical on the
  clean tree — no regressions; none in new catalog/detail files). `make build`
  remains blocked by those same pre-existing errors.
- Left open: Contact form backend, Admin CRUD, sync endpoint auth, scheduled sync

**Previous session (2026-09-12, design-token reconciliation):**

- What changed:
  - Reconciled `app/globals.css` against the brand spec: fixed drifted
    values to exact spec hex (`--background` #F4F6F8, `--foreground`/`--primary`
    #0F172A, `--accent`/`--ring` #A81C24, `--success` #10B981, `--warning`
    #F59E0B, `--critical` #A81C24, `--border` #E2E8F0); previous values were
    close but inexact (`#f3f5f7`, `#a51d26`, `#16a249`, `#f59f0a`)
  - Added missing tokens to `:root` (+ shadows in `.dark`): `--shadow-default`,
    `--shadow-hover`, `--card-padding`, `--button-height-primary/inline`,
    `--table-row-height/comfortable`
  - Registered `shadow-default` / `shadow-hover` in `tailwind.config.ts`;
    removed dead `geist` fontFamily entry (Geist is not loaded anywhere)
  - Replaced hardcoded hex/raw-palette classes with semantic tokens in
    `product-card.tsx`, `layout/header.tsx`, `layout/footer.tsx`, `faq.tsx`,
    `testimonials.tsx`, `hero.tsx`, plus `login-form.tsx`/`sign-up-form.tsx`;
    left `supabase-logo.tsx` brand SVG untouched
  - Themed antd `ConfigProvider` in `app/[locale]/layout.tsx` with
    `colorPrimary: #A81C24`, `borderRadius: 8`, `fontFamily: Manrope`
  - Verified Manrope: loaded via Google Fonts link in `app/layout.tsx`,
    applied via `font-sans` → `--font-manrope` on `<body>`, plus antd theme token
  - Updated `docs/DESIGN_SYSTEM.md` (status/shadow/size tokens, Manrope,
    Hex Bloom as implemented) and removed stale gap notes
- Verified: `make lint` passes (0 errors; only the pre-existing
  `app/layout.tsx` custom-font warning); `make format:check` passes;
  `npx tsc --noEmit` reports **only** 5 pre-existing errors in
  `lib/erpnext/index.ts` + `lib/erpnext/sync.ts` — verified identical on
  the clean tree via `git stash`, so no regressions from this change.
  Fixed 2 lint errors in ERPNext files (unused `SyncRun` import, unused
  `request` param) to unblock the lint gate; left their type errors for
  that workstream.
- Left open: Product detail page, Contact form backend, Admin CRUD, Supabase
  schema/migration (Phase C); sync endpoint auth; scheduled sync

**Earlier session (2026-09-12):**

- What changed:
  - Updated `AGENTS.md`, `ARCHITECTURE.md`, `CODING_GUIDELINES.md`, and
    `WORKFLOW.md` with the ERPNext catalog integration boundary and validation
    contract before implementation
  - Redesigned the products catalog page to match the
    reference shopping-catalog layout: compact category rail, catalog
    masthead, four-column desktop grid, status badges, ratings, and add
    actions using semantic design tokens
  - Reset catalog pagination when search, category, stock, or sort filters
    change
  - Added i18n foundation with Myanmar/English locales (`lib/i18n.ts`, `messages/*.json`, `middleware.ts`/`proxy.ts`)
  - Switched font from Geist to Manrope
  - Added status color tokens (success/warning/critical) and Hex Bloom glow effect
  - Created Home and About pages with Ant Design components using design tokens
  - Created Products catalog page with client-side filtering (category, stock, search, price), pagination from local JSON
  - Created Auth pages (login, signup, forgot password, update password) wired to Supabase with i18n
  - Created shared Header/Footer components with locale switcher, mobile responsive
  - Updated `proxy.ts` for locale-aware auth redirects
  - Removed duplicate `lib/supabase/middleware.ts` and starter-kit scaffold pages
  - Moved i18n-enabled Header/Footer to `components/` root
- Verified: `make check` passes (lint + typecheck + format), `git diff --check` passes; lint reports only the existing `app/layout.tsx` custom-font warning
- Verified: `make check` passes (lint + typecheck + format), `git diff --check` passes; lint reports only the existing `app/layout.tsx` custom-font warning
- Left open: Product detail page, Contact form backend, Admin CRUD, Supabase schema/migration (Phase C)
