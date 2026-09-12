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
- Products catalog (`app/[locale]/products/page.tsx`) — Client-side filtering (category, stock status, search, price range), pagination, responsive grid from local JSON (15 products, 8 categories)
- Shared layout components: `Header` (logo, nav, locale switcher, auth buttons), `Footer` (company info, links, contact, social)

**Domain data & ERPNext integration (Phase C milestone: schema + manual sync)**

- ERPNext client (`lib/erpnext/client.ts`) — typed REST API wrapper with token auth, pagination, field selection
- Catalog schema (`supabase/migrations/20260912_000000_create_catalog_schema.sql`) — categories, products, sync_runs tables with RLS (public read-enabled, server-write)
- Catalog types (`lib/erpnext/types.ts`) — `Category`, `Product`, `SyncRun`, ERPNext DocType refs
- Typed queries (`lib/erpnext/queries.ts`) — getCategories, getProducts, getProductById, getProductCount (never raw `.from(...).select(...)`)
- Manual sync (`lib/erpnext/sync.ts`) — idempotent upsert by erpnext_id, records sync_runs, preserves last successful snapshot on failure
- Sync endpoint (`app/api/catalog/sync/route.ts`) — POST to trigger manual sync; TODO: add auth check (require admin role or bearer token)
- Products page (`app/[locale]/products/page.tsx`) — reads from Supabase catalog; pagination, filter support, i18n-ready

## Known gaps (open, not yet fixed)

1. **Product detail page** (`app/[locale]/products/[slug]/page.tsx`) not yet created.
2. **Contact page** (`app/[locale]/contact/page.tsx`) — scaffold only, form submit not wired.
3. **Admin area** (`app/[locale]/admin/*`) not yet scaffolded (Phase C).
4. **Product catalog component** (`components/product-catalog.tsx`) — not yet implemented; referenced by `app/[locale]/products/page.tsx`.
5. **`PRD.md` referenced but not created.** `AGENTS.md` instructs reading
   `docs/PRD.md` before implementation; the file does not exist yet.
6. **ORM decision undecided.** `.env.example` reserves `DATABASE_URL` "for
   ORM," but no ORM is installed and `ARCHITECTURE.md` currently directs
   new tables to be plain Supabase SQL migrations until this is decided.
7. **No automated tests.** No test runner is configured (see
   `CODING_GUIDELINES.md` → Testing contracts).
8. **No pre-push type-check.** Only CI catches TypeScript errors; the
   pre-commit hook runs lint-staged only (lint + format), not `tsc`.
9. **ERPNext field mapping not confirmed.** Custom field names for bilingual content (`custom_name_my`, etc.) and stock source (warehouse/quantity field) must be verified against target ERPNext instance.
10. **Sync endpoint lacks authentication.** `/api/catalog/sync` has TODO: require admin role or bearer token before accepting manual trigger.
11. **No scheduled sync or alert delivery.** Manual trigger only; deferred to next milestone.

## Decisions recorded

- Design-token values are treated as already-correct and already
  implemented for the brand palette (see Current status); no rework needed
  there, only the additions listed in Known gaps.
- New domain tables go through plain Supabase SQL migrations, not an ORM,
  until an ORM decision is explicitly recorded here.
- The Tailwind + semantic-token UI path (not Ant Design) is the intended
  long-term direction for D&W-branded screens; antd remains acceptable for
  data-dense internal UI (tables, complex forms).
- i18n with `next-intl`: Myanmar (my) default, English (en) supported. All UI strings in `messages/my.json` and `messages/en.json`.
- Products catalog currently reads from local `data/products.json` (Phase B). Will migrate to Supabase in Phase C.
- Header/Footer components moved to `components/` root with full i18n support (language switcher, locale-aware links).
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

**Current session (2026-09-12):**

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
