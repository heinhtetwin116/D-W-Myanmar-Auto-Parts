# Contributing Guide

This document defines the conventions for setting up, branching, committing, and submitting changes to **D&W Myanmar Auto Parts**.

## 1. Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/D-W-Myanmar-Auto-Parts.git
cd D-W-Myanmar-Auto-Parts

# 2. Install dependencies (uses package-lock.json exactly)
make install

# 3. Set up environment variables
cp .env.example .env
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
# ERPNext URL and token credentials are server-only; never use NEXT_PUBLIC_ names.

# 4. Start the development server
make dev
```

> Husky git hooks are installed automatically as part of `npm ci` via the `prepare` script.

## 2. Branch Naming

Branches follow the pattern:

```
<type>/<short-description>
```

### Types

| Type       | Use for                                                        |
| ---------- | -------------------------------------------------------------- |
| `ui`       | UI-only work — components, styling, layout (no backend wiring) |
| `feature`  | New functionality — UI + logic + Supabase integration          |
| `fix`      | Bug fixes                                                      |
| `refactor` | Code restructuring with no behaviour change                    |
| `chore`    | Tooling, dependencies, config, build scripts                   |
| `docs`     | Documentation only                                             |
| `test`     | Adding or updating tests                                       |

### Rules

- Lowercase, kebab-case
- 3–5 words max
- Branch off `main`

### Examples

```
ui/product-listing-card
ui/mobile-nav-drawer
feature/enquiry-form-supabase
fix/hero-image-overflow
chore/upgrade-next-15
docs/contributing-guide
```

## 3. Commit Message Convention

This project follows **[Conventional Commits](https://www.conventionalcommits.org/)**.

```
<type>: <short summary>

[optional body — explain the why, not the what]

[optional footer — e.g. Closes #42]
```

### Types

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style`    | Formatting or whitespace only (no logic change)         |
| `docs`     | Documentation only                                      |
| `test`     | Adding or correcting tests                              |
| `chore`    | Build process, dependency updates, tooling              |
| `perf`     | Performance improvements                                |
| `revert`   | Reverts a previous commit                               |

### Good examples

```
feat: add product enquiry form with Supabase insert

fix: correct mobile nav z-index overlap with hero section

refactor: extract ProductCard into shared components directory

chore: upgrade eslint-config-next to 15.3.1

docs: update environment variable names in README
```

### Commit hygiene

- One logical change per commit — do not bundle unrelated changes
- No commented-out code, `console.log`, or debug statements
- Squash WIP commits before opening a PR (`git rebase -i`)

## 5. Pull Request Workflow

1. Branch off `main` using the naming convention above.
2. Keep PRs **scoped to a single concern** — one feature, one fix, one screen.
3. PR title follows the same format as a commit message:
   ```
   feat: add product enquiry form
   ```
4. PR description must include:
   - **What** changed and **why**
   - Screenshots or screen recordings for any UI change
   - Call out any mock/hardcoded data still in use with a `// TODO: wire to API` comment
5. Before requesting review, ensure all quality gates pass locally:
   ```bash
   make check   # runs lint + typecheck + format check
   ```
6. At least **one approval** is required before merge.
7. **Squash-merge** into `main` once approved — keep the commit history clean.

## 6. Code Style

| Tool         | Config file          | What it enforces                |
| ------------ | -------------------- | ------------------------------- |
| ESLint       | `eslint.config.mjs`  | Code correctness, Next.js rules |
| Prettier     | _(default config)_   | Consistent formatting           |
| TypeScript   | `tsconfig.json`      | Strict type safety              |
| Tailwind CSS | `tailwind.config.ts` | Design token–based styling      |

### Key rules

- Use **semantic design tokens** from `app/global.css` — do not use raw Tailwind colour classes like `bg-blue-500` or one-off inline styles.
- No `any` types — use proper TypeScript types or generics.
- Server Components are the default in the App Router; only opt into `"use client"` when strictly necessary (event handlers, browser APIs, React hooks).
- Keep components small and single-purpose. Extract shared UI into `components/`.
- Use kebab-case for all new page and component filenames, such as
  `product-card.tsx` and `login-form.tsx`. Keep Next.js reserved filenames
  such as `page.tsx`, `layout.tsx`, and `route.ts` unchanged.
- Use PascalCase for exported React component names even when their filenames
  are kebab-case.

### ERPNext catalog integration

- Confirm the target ERPNext custom field names for bilingual content and
  actual stock before implementing schema or sync code.
- The first integration milestone is a manually triggered sync. Do not add
  scheduled execution until the manual path is verified.
- Sync enabled Items only, preserve ERPNext source IDs, and record every sync
  attempt and result.
- Use a typed server-only ERPNext client with explicit field selection and
  pagination. Never scatter raw ERPNext requests through pages or components.
- A failed sync must leave the last successful Supabase catalog available.
- Any remaining visual-only enquiry or mock catalog action must be marked
  `// TODO: wire to API` and called out in the pull request.
