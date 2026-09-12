# Design System

This is the single source of truth for visual decisions: color, typography,
spacing, shape, and motion. Components must use these **semantic tokens**,
never raw Tailwind color classes (`bg-blue-500`) or one-off inline hex
values — this is a non-negotiable rule (see `AGENTS.md` and
`CONTRIBUTION_GUIDELINES.md`).

## Color

### Brand palette (60-30-10 rule)

| Role                | Weight | Color name     | Hex       | Usage                                                                                                                      |
| ------------------- | ------ | -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| Dominant base       | 60%    | Cool Soft Gray | `#F4F6F8` | Backgrounds for inventory grids, product cards, forms                                                                      |
| Structure & content | 30%    | Obsidian       | `#0F172A` | Navigation panels, table header text, dark-mode toggles, primary typography                                                |
| Interactive accent  | 10%    | Crimson Red    | `#A81C24` | Primary action buttons ("Add Product", "Export Report", "Save Changes"), alerts, urgent flags, active-indicator highlights |

### Status colors

| Status                  | Color          | Hex                              |
| ----------------------- | -------------- | -------------------------------- |
| Success / In Stock      | Soft Green     | `#10B981`                        |
| Warning / Low Stock     | Warm Amber     | `#F59E0B`                        |
| Critical / Out of Stock | Accent Crimson | `#A81C24` (same as brand accent) |

> **Gap:** status colors are not yet wired into `app/globals.css` /
> `tailwind.config.ts` as named tokens. Until they are, do not hardcode
> these hex values in components — add them as `--success` / `--warning` /
> `--critical` CSS variables (light + dark) first. Tracked in `MEMORY.md`.

### Implementation: semantic tokens

Brand colors are implemented as **HSL CSS variables** in `app/globals.css`
and surfaced to Tailwind via `tailwind.config.ts` (`theme.extend.colors`),
following the shadcn/ui convention. The existing tokens already map to the
brand palette above:

| Token                        | Light value (HSL) | Corresponds to                           |
| ---------------------------- | ----------------- | ---------------------------------------- |
| `--background`               | `210 20% 96%`     | Cool Soft Gray base                      |
| `--foreground` / `--primary` | `222 47% 11%`     | Obsidian (`#0F172A`)                     |
| `--accent` / `--ring`        | `356 70% 38%`     | Crimson Red (`#A81C24`)                  |
| `--destructive`              | `0 84.2% 60.2%`   | Error state (distinct from brand accent) |

A `.dark` variant of every token is defined in the same file. **Always
reference tokens** (`bg-background`, `text-primary`, `border-border`,
`bg-accent text-accent-foreground`, etc.) — never `bg-[#A81C24]` or
`bg-red-600`.

When adding the status colors, follow the same pattern: define
`--success`, `--warning`, `--critical` (+ `-foreground` pairs) in both the
`:root` and `.dark` blocks, then register them under
`theme.extend.colors` before using them in components.

## Typography

- **Proposed font:** Manrope.
- **Current implementation:** `app/layout.tsx` loads `Geist` via
  `next/font/google`, **not** Manrope.
- **Action:** this is a known mismatch (see `MEMORY.md`). When resolved,
  load Manrope the same way Geist is loaded today (`next/font/google`,
  exposed as a CSS variable, applied on `<body>`), rather than a `<link>`
  tag or `@import`.
- Headings and primary typography use the Obsidian (`--primary` /
  `--foreground`) token; body copy should default to
  `text-foreground`/`text-muted-foreground` per context.

## Spacing & shape language

Built on an 8-point grid.

| Property         | Value                                | Rationale                                                     |
| ---------------- | ------------------------------------ | ------------------------------------------------------------- |
| Corner radius    | `8px` (`--radius: 0.5rem`)           | Cards, buttons, modals — slightly rounded, not pill-shaped    |
| Spacing scale    | `4px / 8px / 16px / 24px / 32px`     | 8-point grid                                                  |
| Card padding     | `20px` internal                      | Comfortable breathing room inside containers                  |
| Table row height | `48px` standard / `56px` comfortable | High-density inventory lists while keeping tap targets usable |
| Button height    | `40px` primary CTAs / `32px` inline  | Clear visual hierarchy                                        |
| Border           | `1px solid #E2E8F0` (≈ `--border`)   | Subtle hairline separators                                    |

Radius derivatives already exist in `tailwind.config.ts`:
`lg = var(--radius)`, `md = radius - 2px`, `sm = radius - 4px`. Use these
(`rounded-lg`, `rounded-md`, `rounded-sm`) rather than arbitrary values.

## Component conventions

- **Ant Design (antd v6)** provides base interactive primitives (forms,
  inputs, dropdowns, cards, tables). Prefer it over hand-rolling equivalent
  interactive widgets.
- **Tailwind + semantic tokens** own layout, spacing, and one-off
  composition — and are the target styling approach for new D&W-branded UI
  (see `login-form.tsx` / `sign-up-form.tsx` for the current direction, and
  `ARCHITECTURE.md` → "UI layering" for migration status).
- Do not mix: a given component should be either antd-driven or
  Tailwind-driven, not both fighting for the same layout.
- Icons: `lucide-react` (Tailwind path) and `@ant-design/icons` (antd path)
  are both present; pick the one matching the component's UI layer.

## Related documents

- `ARCHITECTURE.md` — where tokens live and how the two UI layers coexist.
- `CODING_GUIDELINES.md` — the "use semantic tokens" rule as an
  implementation-time contract.
- `MEMORY.md` — tracks the Manrope/Geist mismatch and missing status-color
  tokens as open gaps.
