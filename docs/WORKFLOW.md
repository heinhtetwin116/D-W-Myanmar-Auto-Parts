# Workflow

Session, validation, documentation, and release process for D&W Myanmar
Auto Parts.

## SDLC

**Agile** — short, iterative cycles (lightweight Scrum or Kanban, 1–2 week
sprints) rather than Waterfall. Requirements are expected to evolve as the
catalog/ERD and public site take shape; don't treat any doc here (except
this process description) as fixed for the project's lifetime — update
`PROJECT_MAP.md`'s roadmap and `MEMORY.md`'s status as reality changes.

## Local development

```bash
make install     # npm ci — installs from package-lock.json exactly
make dev         # next dev
make build       # next build (includes TS type-check via Next.js)
make start       # next start (requires a prior build)
make check       # lint + typecheck + format-check, all three
make clean       # remove node_modules and .next/out
make reset       # clean + install
```

Setup:

1. `cp .env.example .env` (or `.env.local`) and fill in
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from
   the Supabase project's API settings.
2. `make install` — this also runs Husky's `prepare` script, installing git
   hooks automatically.
3. `make dev`.

All routes are under locale prefix: `http://localhost:3000/my/...` or `http://localhost:3000/en/...`

## Git hooks (local)

`.husky/pre-commit` runs `lint-staged` only:

| Files                           | Tool               |
| ------------------------------- | ------------------ |
| `*.{ts,tsx,js,mjs}`             | `eslint --fix`     |
| `*.{ts,tsx,js,mjs,json,css,md}` | `prettier --write` |

This only touches **staged** files, and only fixes lint/format issues —
**it does not type-check.** TypeScript errors can slip into a commit
locally and will only be caught in CI. If you want earlier feedback, run
`make typecheck` yourself before committing/pushing.

There is no pre-push hook.

## CI pipeline (GitHub Actions)

Triggered on push/PR to `main` and `development`.

**`ci.yml`**

1. `quality` job: `npm ci` → `npm run lint` (ESLint) → `npx tsc --noEmit`
   (TypeScript) → `npm run format:check` (Prettier, read-only).
2. `build` job (runs only if `quality` passes): `npm ci` →
   `next build`, with `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` injected from repo secrets.

Workflows use Node `20.x`.

## Branching & commits

Full rules live in `CONTRIBUTION_GUIDELINES.md`; summary:

- Branches: `<type>/<short-kebab-description>` where `type` is one of
  `ui`, `feature`, `fix`, `refactor`, `chore`, `docs`, `test`.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) —
  `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `test:`, `chore:`,
  `perf:`, `revert:`.
- Run `git diff --check` before committing. **For a schema change, commit
  the schema and the generated migration together** — never split them
  across commits.
- One logical change per commit; squash WIP commits before opening a PR.

## Pull requests

1. Branch off `main`, scoped to a single concern (one feature/fix/screen).
2. PR title = a commit-message-shaped summary (`feat: add product enquiry
form`).
3. PR description includes: what changed and why, screenshots/recordings
   for UI changes, and a `// TODO: wire to API` comment (plus a callout in
   the description) for any mock/hardcoded data still in use.
4. `make check` must pass locally before requesting review.
5. At least one approval required.
6. Squash-merge into `main`.

## Validation gates (definition of "done enough to open a PR")

- `make check` (lint + typecheck + format) passes.
- `make build` succeeds locally when the change touches routing, data
  fetching, or config.
- Manually exercised the affected flow (see `CODING_GUIDELINES.md` →
  Testing contracts — there's no automated suite yet, so this step is not
  optional).
- Design tokens used, not raw Tailwind colors or inline hex (spot-check
  against `DESIGN_SYSTEM.md`).
- If a Supabase table/policy changed: schema + migration committed
  together, RLS considered explicitly (not left "off by omission").
- Test both locales (`/my/...` and `/en/...`) for i18n changes.

### ERPNext catalog sync validation

Before implementing the ERPNext sync, record the target `Item` and `Item
Group` field mapping, including bilingual fields, enabled status, image URL,
and the source used for actual stock. The first milestone must be manually
triggerable and tested against a safe ERPNext environment.

A sync change is not complete until it verifies:

- enabled Items and categories are imported with stable ERPNext source IDs;
- repeated runs are idempotent;
- bilingual fields, numeric MMK prices, actual stock, and image URLs map as
  expected;
- successful sync counts and failed sync errors are recorded;
- a failed run leaves the last successful Supabase catalog available; and
- ERPNext credentials are never present in browser bundles or `NEXT_PUBLIC_`
  environment variables.

## Session process (for anyone — human or agent — working in this repo)

Mirrors `AGENTS.md`:

1. **Start of session**: read `MEMORY.md` first (current status/gaps),
   then whichever of `PROJECT_MAP.md`, `PRD.md`, `ARCHITECTURE.md`,
   `DESIGN_SYSTEM.md`, `CODING_GUIDELINES.md` are relevant to the task.
2. **During the session**: keep changes scoped; if a durable rule needs to
   change (e.g. a new design token, a new architectural boundary), edit the
   _owning_ document, not `MEMORY.md`.
3. **End of session**: update `MEMORY.md` with what was verified, what's
   still open, decisions made and why, and the exact commands/output used
   to validate the work (e.g. "`make check` — pass; manually logged in
   against local Supabase").

## Release process

Not yet formalized — there is currently no separate deploy/release
workflow beyond CI building on `main`/`development`. When a deployment
target (e.g. Vercel) and release cadence are decided, record them here:
trigger, environment promotion path (if any), rollback approach, and how
Supabase migrations are applied in each environment.
