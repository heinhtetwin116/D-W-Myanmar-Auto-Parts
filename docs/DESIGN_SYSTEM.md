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

Status colors are implemented as CSS variables in `app/globals.css` and
surfaced via `tailwind.config.ts` as `success`, `warning`, `critical`
(with `-foreground` pairs) for both light and dark modes.

### Implementation: semantic tokens

Brand colors are implemented as **hex CSS variables** in `app/globals.css`
and surfaced to Tailwind via `tailwind.config.ts` (`theme.extend.colors`),
following the shadcn/ui convention. The existing tokens already map to the
brand palette above:

| Token                        | Light value (hex) | Corresponds to                           |
| ---------------------------- | ----------------- | ---------------------------------------- |
| `--background`               | `#F4F6F8`         | Cool Soft Gray base                      |
| `--foreground` / `--primary` | `#0F172A`         | Obsidian                                 |
| `--accent` / `--ring`        | `#A81C24`         | Crimson Red                              |
| `--destructive`              | `#EF4444`         | Error state (distinct from brand accent) |
| `--success`                  | `#10B981`         | Soft Green                               |
| `--warning`                  | `#F59E0B`         | Warm Amber                               |
| `--critical`                 | `#A81C24`         | Accent Crimson                           |

A `.dark` variant of every token is defined in the same file. **Always
reference tokens** (`bg-background`, `text-primary`, `border-border`,
`bg-accent text-accent-foreground`, etc.) — never `bg-[#A81C24]` or
`bg-red-600`.

### Elevation & sizing tokens

| Token                            | Value                                 | Usage                            |
| -------------------------------- | ------------------------------------- | -------------------------------- |
| `--shadow-default`               | `0px 2px 4px rgba(15, 23, 42, 0.06)`  | Default card/component elevation |
| `--shadow-hover`                 | `0px 8px 16px rgba(15, 23, 42, 0.10)` | Hover elevation                  |
| `--card-padding`                 | `20px`                                | Internal card padding            |
| `--button-height-primary`        | `40px`                                | Primary CTA height               |
| `--button-height-inline`         | `32px`                                | Inline button height             |
| `--table-row-height`             | `48px`                                | Standard table row height        |
| `--table-row-height-comfortable` | `56px`                                | Comfortable table row height     |

Shadows are registered in `tailwind.config.ts` as `shadow-default` /
`shadow-hover`. Use these instead of `shadow-sm` / `shadow-md` / ad-hoc
`box-shadow` values.

## Typography

- **Font:** Manrope.
- **Implementation:** `app/layout.tsx` loads `Manrope` via a Google Fonts
  `<link>`, applied through Tailwind `font-sans` → `--font-manrope` on
  `<body>`; antd `ConfigProvider` in `app/[locale]/layout.tsx` passes a
  matching `fontFamily` theme token so antd components render Manrope too.
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
  (see `header.tsx`, `footer.tsx`, `product-card.tsx`, `login-form.tsx`,
  `sign-up-form.tsx` for the current direction, and `ARCHITECTURE.md` →
  "UI layering" for status).
- Do not mix: a given component should be either antd-driven or
  Tailwind-driven, not both fighting for the same layout.
- Icons: `lucide-react` (Tailwind path) and `@ant-design/icons` (antd path)
  are both present; pick the one matching the component's UI layer.

## Related documents

- `ARCHITECTURE.md` — where tokens live and how the two UI layers coexist.
- `CODING_GUIDELINES.md` — the "use semantic tokens" rule as an
  implementation-time contract.
- `MEMORY.md` — session handoff and remaining gaps.
