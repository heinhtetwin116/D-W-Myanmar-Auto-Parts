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
  `updateSession()` from `lib/supabase/proxy.ts`.
- Husky + lint-staged installed; ESLint (`next/core-web-vitals` +
  `next/typescript`) + Prettier configured.
- CI: `ci.yml` (lint, typecheck, format check, build) and `codeql.yml`
  (security scan) both present and correctly gated (build depends on
  quality).
- Design tokens for the brand palette (Obsidian / Cool Soft Gray / Crimson
  Red) are implemented as HSL CSS variables in `app/globals.css` and
  exposed via `tailwind.config.ts`. They line up with the hex values in
  `DESIGN_SYSTEM.md`.

**Auth flows implemented**

- Sign up (`app/auth/sign-up/page.tsx` → `SignUpForm`)
- Login (`app/auth/login/page.tsx` → `LoginForm`)
- Forgot password (`app/auth/forgot-password/page.tsx` →
  `ForgotPasswordForm`, wired to Supabase, functional)
- Update password (`app/auth/update-password/page.tsx` →
  `UpdatePasswordForm`, wired to Supabase, functional)
- Email confirmation route (`app/auth/confirm/route.ts`, uses
  `verifyOtp`, functional)
- Auth error page (`app/auth/error/page.tsx`, functional)
- One protected page (`app/protected/page.tsx` + layout), redirects
  unauthenticated users, functional
- Sign-out (`components/logout-button.tsx`, functional)

**Domain data**

- No product/category tables, migrations, or ERD exist in the repo yet.

## Known gaps (open, not yet fixed)

1. **`login-form.tsx` and `sign-up-form.tsx` are not wired to Supabase.**
   They are the D&W-branded (Tailwind, non-antd) forms and are the intended
   direction per `DESIGN_SYSTEM.md`/`ARCHITECTURE.md`, but their
   `handleSubmit` is currently mocked (`console.log` + `setTimeout`, no
   `createClient()` call, no redirect). The antd-based
   `forgot-password-form.tsx` shows the correct wiring pattern to copy.
2. **Duplicate session-refresh logic.** `lib/supabase/middleware.ts` and
   `lib/supabase/proxy.ts` both implement `updateSession()`. Only
   `proxy.ts`'s version is wired into the active `proxy.ts` middleware
   entry point. `middleware.ts` looks like a pre-rename leftover — confirm
   nothing imports it, then remove it in its own `chore:` commit.
3. **Typography mismatch.** `DESIGN_SYSTEM.md` calls for Manrope;
   `app/layout.tsx` currently loads Geist. Not yet reconciled.
4. **Status colors not tokenized.** Success/Warning/Critical hex values are
   specified in the design doc but have no corresponding CSS
   variables/Tailwind theme entries yet.
5. **No ERD / product schema.** The product's own stated backbone (an ERD
   for products, categories, and their relationships) has not been
   authored or migrated into Supabase.
6. **`PRD.md` referenced but not created.** `AGENTS.md` instructs reading
   `docs/PRD.md` before implementation; the file does not exist yet.
7. **ORM decision undecided.** `.env.example` reserves `DATABASE_URL` "for
   ORM," but no ORM is installed and `ARCHITECTURE.md` currently directs
   new tables to be plain Supabase SQL migrations until this is decided.
8. **No automated tests.** No test runner is configured (see
   `CODING_GUIDELINES.md` → Testing contracts).
9. **No pre-push type-check.** Only CI catches TypeScript errors; the
   pre-commit hook runs lint-staged only (lint + format), not `tsc`.
10. **"Hex Bloom" motion spec is a placeholder.** `DESIGN_SYSTEM.md`
    documents a best-guess interpretation pending an actual spec.

## Decisions recorded

- Design-token values are treated as already-correct and already
  implemented for the brand palette (see Current status); no rework needed
  there, only the additions listed in Known gaps.
- New domain tables go through plain Supabase SQL migrations, not an ORM,
  until an ORM decision is explicitly recorded here.
- The Tailwind + semantic-token UI path (not Ant Design) is the intended
  long-term direction for D&W-branded screens; antd remains acceptable for
  data-dense internal UI (tables, complex forms).

## Session handoff

_Use this section as a template — replace its contents at the end of every
session with what was actually done, verified, and left open. Keep it
short; anything durable belongs in the owning doc instead._

**Last entry:**

- What changed: authored the initial `docs/` set (`PROJECT_MAP.md`,
  `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CODING_GUIDELINES.md`,
  `WORKFLOW.md`, `MEMORY.md`) and reviewed `AGENTS.md`, based on the
  current repository state and the project's design-system source
  document.
- Verified: cross-checked the design-token hex values against
  `app/globals.css`/`tailwind.config.ts`; cross-checked auth flow files
  against `lib/supabase/*`; confirmed CI/Husky configuration by reading
  `ci.yml`, `codeql.yml`, `.husky/pre-commit`, `package.json`.
- Left open: everything under "Known gaps" above. No code was changed in
  this session — documentation only.
