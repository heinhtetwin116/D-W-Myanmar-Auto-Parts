# Agent Instructions

You are working on **D&W Myanmar Auto Parts**, a corporate business website.

Read these documents before changing code:

1. `docs/PROJECT_MAP.md` — product purpose, principles, terminology, and version roadmap.

2. `docs/PRD.md` — requirements and acceptance gates for each version.

3. `docs/MEMORY.md` — factual current status, known gaps, and last-session handoff.

4. `docs/ARCHITECTURE.md` — module boundaries, data flow, persistence, and extension seams.

5. `docs/DESIGN_SYSTEM.md` — visual tokens, layout, typography, motion, and Hex Bloom.

6. `docs/CODING_GUIDELINES.md` — implementation patterns and testing contracts.

7. `docs/WORKFLOW.md` — session, validation, documentation, and release process.

If a task touches only one area, read the supporting documents for that area,but always read `MEMORY.md` before implementation.

## Non-negotiable architecture rules

- Use semantic design tokens from `global.css`, not generic Tailwind colors or one-off styles.

## Definition of done

## Commands

```bash
make install
make lint
make format
```

Run `git diff --check` before committing. For a schema change, commit the schema and generated migration together.

## Documentation maintenance

Keep each document within its ownership boundary. Do not copy current status into product, architecture, or design documents; update `docs/MEMORY.md` for implementation progress. When a durable rule changes, update its owning document and record the reason in `MEMORY.md`.

Before ending a session, update `docs/MEMORY.md` with verified work, open gaps,decisions, and exact validation evidence. Keep commits focused and use:

```
<area>: <what changed>
```
