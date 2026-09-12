# Agent Instructions

**D&W Myanmar Auto Parts** — Next.js 15 (App Router) + Supabase (Auth + Postgres) + Ant Design v6 + Tailwind CSS + next-intl (i18n: Myanmar `my` default, English `en`).

## Key Commands

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `make dev`          | Start dev server (`npm run dev`)               |
| `make build`        | Production build (includes TS type-check)      |
| `make lint`         | ESLint (ignores `.next/**`)                    |
| `make typecheck`    | `tsc --noEmit`                                 |
| `make format`       | Prettier write                                 |
| `make format:check` | Prettier check only                            |
| `make check`        | **All gates**: lint → typecheck → format-check |
| `make install`      | `npm ci` (lockfile install)                    |
| `make reset`        | Clean + reinstall                              |

**Pre-commit**: Husky + lint-staged runs ESLint --fix + Prettier on staged files.

## Architecture Notes (Non-obvious)

### Routing

- **Locale prefix required**: All routes under `app/[locale]/` — `my` (default) or `en`
- Root `app/layout.tsx` redirects to `/my`
- Middleware (`proxy.ts`) handles locale detection + Supabase session refresh
- i18n config: `lib/i18n.ts` + `messages/my.json` + `messages/en.json`

### Supabase Client Pattern

- **Never create module-level clients** — causes session issues on Fluid compute
- **Server Components / Route Handlers**: `lib/supabase/server.ts` → `createClient()` per request
- **Client Components**: `lib/supabase/client.ts` → `createBrowserClient()`
- **Middleware**: `proxy.ts` → `updateSession()` from `lib/supabase/proxy.ts` (handles cookie refresh + auth redirects)

### Auth

- All auth routes under `app/[locale]/auth/*` (login, signup, forgot-password, update-password, error)
- Email confirmation: `app/api/auth/confirm/route.ts` (locale-aware redirect)
- Protected routes: middleware redirects unauthed users to `/${locale}/auth/login`

### Design System

- Semantic tokens in `app/globals.css` (hex CSS variables) → exposed via `tailwind.config.ts`
- Use `bg-background`, `text-foreground`, `bg-accent`, etc. — **never raw hex or `bg-blue-500`**
- Status tokens: `--success`, `--warning`, `--critical` (light + dark)
- Elevation tokens: `shadow-default` / `shadow-hover` (use instead of `shadow-sm`/`shadow-md`)
- Font: Manrope via Google Fonts `<link>` in `app/layout.tsx`, applied through `font-sans` → `--font-manrope`; antd `ConfigProvider` themed with matching `fontFamily`, `colorPrimary #A81C24`, `borderRadius 8`

### Component Structure

- `components/layout/`: `Header`, `Footer` (default exports, no locale prop — links are locale-agnostic and need i18n follow-up)
- `components/` root: `product-card.tsx`, `product-catalog.tsx`, auth forms (Ant Design + Tailwind, i18n-ready where wired)
- `app/[locale]/` — all locale-scoped pages (`products/`, `products/[slug]/`, `about/`, `auth/*`)
- Catalog reads Supabase (`categories`/`products` tables) via typed queries in `lib/erpnext/queries.ts` — never raw `.from(...).select(...)` in components

### Naming Convention

- Use kebab-case for all new page and component filenames, including route
  files where Next.js does not require a reserved name.
- Keep Next.js reserved filenames such as `page.tsx`, `layout.tsx`, and
  `route.ts` unchanged.
- Use PascalCase for the exported React component symbol; only the filename
  is kebab-case.

## Documentation

- **Always read `docs/MEMORY.md` first** — current status, gaps, handoff
- Other docs in `docs/` are stable references; update `MEMORY.md` for progress
- `docs/PRD.md` does not exist (see `MEMORY.md` Known gaps)

## Definition of Done

1. `make check` passes
2. `make build` succeeds (for routing/data/config changes)
3. Manually verified affected flow
4. Only semantic design tokens used
5. Unwired handlers marked `// TODO: wire to API` + called out in PR

## Git / Commit

- `git diff --check` before commit
- Schema + migration together in one commit
- Conventional Commits: `<area>: <what changed>`
