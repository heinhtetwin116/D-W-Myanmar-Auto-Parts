# Coding Guidelines

Implementation patterns and testing contracts for D&W Myanmar Auto Parts.
Pairs with `ARCHITECTURE.md` (where things live) and `DESIGN_SYSTEM.md`
(how things look).

## Language & framework rules

- **TypeScript strict mode is on** (`tsconfig.json`). No `any`. If a type is
  genuinely unknown, use `unknown` and narrow it.
- **Server Components are the default.** Only add `"use client"` when the
  component needs event handlers, browser APIs, `useState`/`useEffect`, or
  other React hooks. Every current client component declares this
  explicitly at the top of the file — keep doing so.
- Wrap any component that reads dynamic data (`searchParams`, cookies via a
  child, Supabase calls) in `<Suspense>` at the call site, matching the
  existing pattern in `app/auth/*/page.tsx` and `app/page.tsx`.
- Prefer `async function` Server Components over `useEffect` data fetching
  wherever the data doesn't need client-side interactivity.

## Supabase usage pattern

- **Never** create a module-level/global Supabase client. Every server-side
  usage must call `createClient()` fresh (see `lib/supabase/server.ts`) —
  this is required for correctness under Fluid compute and is called out
  explicitly in the source comments. Do not "optimize" this away.
- Client Components use `createClient()` from `lib/supabase/client.ts`.
- Auth mutations (sign in, sign up, sign out, reset password) live in
  Client Components and call the Supabase client directly, following
  `forgot-password-form.tsx`:
  1. `"use client"` component owns local `error` / `isLoading` state.
  2. `const supabase = createClient()` inside the handler.
  3. `try { ... } catch (error: unknown) { const errorMessage = error instanceof Error ? error.message : "An error occurred" }`.
  4. Surface errors via inline UI state _and_ a toast
     (`message.error(errorMessage)` from antd) — do both, not one or the
     other.
- Route Handlers that need auth (`app/auth/confirm/route.ts`) use
  `createClient()` from `lib/supabase/server.ts` and redirect via
  `next/navigation`'s `redirect()`, never a manual `Response.redirect`.
- Any new table access should go through a small typed function colocated
  with the feature area, not inline `.from("table").select()` calls
  scattered through components (see `ARCHITECTURE.md` → Extension seams).

## Design token discipline

- Use semantic tokens from `app/globals.css` / `tailwind.config.ts`
  (`bg-background`, `text-foreground`, `bg-accent`, `border-border`, etc.).
  Raw Tailwind palette classes (`bg-blue-500`, `text-gray-700`) and inline
  hex values are not allowed outside of `globals.css` itself. This is a
  non-negotiable architecture rule inherited from `AGENTS.md`.
- If a needed token doesn't exist yet (e.g. status colors — see
  `DESIGN_SYSTEM.md`), add it to `globals.css` + `tailwind.config.ts`
  first, then use it. Don't hardcode "just this once."

## UI layer choice

Per `ARCHITECTURE.md` → "UI layering," the project is mid-migration from
an Ant Design/starter-kit UI to a Tailwind + design-token UI:

- **New auth/account UI**: follow the Tailwind pattern
  (`login-form.tsx`/`sign-up-form.tsx`), and make sure it's actually wired
  to Supabase (those two files currently are **not** — don't copy their
  mocked `handleSubmit` as-is; wire it per the Supabase usage pattern
  above).
- **New data-dense UI** (tables, forms with many fields, dropdowns): antd
  is acceptable and often preferable — just style through the same design
  tokens where antd exposes theme customization, rather than antd defaults.
- Don't introduce a third UI approach. If neither antd nor the Tailwind
  pattern fits, raise it before adding a new dependency.

## File & folder conventions

- Routes under `app/`; one `page.tsx` (+ optional `layout.tsx`) per route.
- Shared UI in `components/`, flat unless a feature grows enough to warrant
  a subfolder (see `components/tutorial/` as the existing precedent).
- Supabase access in `lib/supabase/`; any future external service gets its
  own `lib/<service>/` folder with the same client-factory shape
  (`createClient()`), not a grab-bag `lib/api.ts`.
- Co-locate a component's styles as Tailwind classes in the component
  itself; no separate CSS-module files unless a case genuinely needs them.

## Error handling

- User-facing errors: catch, extract `error.message` when `error instanceof
Error`, otherwise fall back to a generic message ("An error occurred").
  Never surface raw thrown values or stack traces to the UI.
- Server-side/system errors (e.g. `checkDatabase()` in
  `lib/supabase/server.ts`): `console.error` with context, return a
  boolean/typed result — don't throw across a Server Component boundary
  without a reason.

## Environment variables

- Guard optional-Supabase-setup UI with `hasEnvVars` (`lib/utils.ts`) —
  see `EnvVarWarning` usage in `app/page.tsx` — rather than letting
  `createClient()` throw when env vars are missing.
- New required env vars must be added to `.env.example` with no value, and
  to the CI `build` job's `env:` block in `.github/workflows/ci.yml` if the
  build needs them.

## Linting, formatting, types

- ESLint config: `next/core-web-vitals` + `next/typescript`
  (`eslint.config.mjs`). Don't disable rules inline without a comment
  explaining why.
- Prettier is the formatting authority — don't hand-format against it.
- `tsc --noEmit` must pass. Note the local **gap**: the Husky pre-commit
  hook only runs `lint-staged` (ESLint + Prettier on staged files); it does
  **not** type-check. Run `make typecheck` yourself before pushing, since
  CI is currently the only place TypeScript errors are guaranteed to be
  caught (see `note.txt` / `WORKFLOW.md`).

## Testing contracts

**Gap:** no test runner is configured yet (no Vitest/Jest/Playwright in
`package.json`). Until one is added:

- Do not claim a change is "tested" without stating what was manually
  verified (e.g. "ran `make dev`, exercised the login form against a local
  Supabase project").
- When a test framework is introduced, record the decision and the command
  to run tests in this section and in the `Makefile`/CI, and update
  `MEMORY.md`.

## Commit & PR hygiene

Covered in full in `CONTRIBUTION_GUIDELINES.md` and `WORKFLOW.md`; the
headline rules:

- One logical change per commit.
- No `console.log` or commented-out code left in.
- Conventional Commit messages (`feat:`, `fix:`, `chore:`, …).
- `make check` (lint + typecheck + format check) passes locally before
  requesting review.
