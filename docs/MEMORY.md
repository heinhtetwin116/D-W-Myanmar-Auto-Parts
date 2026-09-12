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
3. **`PRD.md` referenced but not created.** `AGENTS.md` instructs reading
   `docs/PRD.md` before implementation; the file does not exist yet.
4. **ORM decision undecided.** `.env.example` reserves `DATABASE_URL` "for
   ORM," but no ORM is installed and `ARCHITECTURE.md` currently directs
   new tables to be plain Supabase SQL migrations until this is decided.
5. **No automated tests.** No test runner is configured (see
   `CODING_GUIDELINES.md` → Testing contracts).
6. **No pre-push type-check.** Only CI catches TypeScript errors; the
   pre-commit hook runs lint-staged only (lint + format), not `tsc`.
7. **ERPNext field mapping not confirmed.** Custom field names for bilingual content (`custom_name_my`, etc.) and stock source (warehouse/quantity field) must be verified against target ERPNext instance.
8. **Sync endpoint lacks authentication.** `/api/catalog/sync` has TODO: require admin role or bearer token before accepting manual trigger.
9. **No scheduled sync or alert delivery.** Manual trigger only; deferred to next milestone.

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

**Current session (2026-09-12, interview + product detail page):**

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
- Left open: Product detail page, Contact form backend, Admin CRUD, Supabase schema/migration (Phase C)
