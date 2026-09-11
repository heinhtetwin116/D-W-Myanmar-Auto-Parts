# Agent Instructions

You are working on **D&W Myanmar Auto Parts**, a corporate business website
built with Next.js (frontend + backend), Tailwind CSS, Ant Design, and
Supabase (Postgres + Auth), with Amazon S3 planned for media storage.

Read these documents before changing code:

1. `docs/PROJECT_MAP.md` — product purpose, principles, terminology, and
   version roadmap.
2. `docs/PRD.md` — requirements and acceptance gates for each version.
   _(Not yet created — see `docs/MEMORY.md` → Known gaps. If it doesn't
   exist, don't block on it, but note the gap.)_
3. `docs/MEMORY.md` — factual current status, known gaps, and
   last-session handoff. **Always read this one, regardless of task
   scope.**
4. `docs/ARCHITECTURE.md` — module boundaries, data flow, persistence, and
   extension seams.
5. `docs/DESIGN_SYSTEM.md` — visual tokens, layout, typography, motion,
   and Hex Bloom.
6. `docs/CODING_GUIDELINES.md` — implementation patterns and testing
   contracts.
7. `docs/WORKFLOW.md` — session, validation, documentation, and release
   process.

If a task touches only one area, read the supporting documents for that
area, but **always** read `MEMORY.md` before implementation.

## Non-negotiable architecture rules

- Use semantic design tokens from `app/globals.css` /
  `tailwind.config.ts`, not generic Tailwind colors or one-off styles.
- Never create a module-level/global Supabase client; always call
  `createClient()` fresh per request (see `docs/CODING_GUIDELINES.md`).
- Don't reorder or skip the `updateSession()` cookie handling in
  `proxy.ts` / `lib/supabase/proxy.ts` — doing so can randomly invalidate
  user sessions.
- Don't silently "clean up" `lib/supabase/middleware.ts` (the legacy
  duplicate of `lib/supabase/proxy.ts`) without confirming nothing still
  imports it — see `docs/MEMORY.md`.

## Definition of done

- `make check` (lint + typecheck + format check) passes.
- `make build` succeeds if the change touches routing, data fetching, or
  config.
- The affected flow was manually exercised (no automated test suite
  exists yet — see `docs/CODING_GUIDELINES.md` → Testing contracts).
- Only semantic design tokens were used for color/spacing/typography.
- If a mock/hardcoded value or handler was left in place (e.g. an
  unwired form submit handler), it's marked with `// TODO: wire to API`
  and called out in the PR description.

## Commands

```bash
make install
make dev
make build
make lint
make typecheck
make format
make check
```

Run `git diff --check` before committing. For a schema change, commit the
schema and generated migration together.

## Documentation maintenance

Keep each document within its ownership boundary. Do not copy current
status into product, architecture, or design documents; update
`docs/MEMORY.md` for implementation progress. When a durable rule changes,
update its owning document and record the reason in `MEMORY.md`.

Before ending a session, update `docs/MEMORY.md` with verified work, open
gaps, decisions, and exact validation evidence. Keep commits focused and
use:

```
<area>: <what changed>
```
