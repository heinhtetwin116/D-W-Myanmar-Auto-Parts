# Project Map

## What this is

**D&W Myanmar Auto Parts** is a corporate business website for an auto-parts
business in Myanmar. It is built with Next.js (frontend and backend in one
app), Supabase (Postgres + Auth), and is intended to grow from a marketing
site with authenticated areas into a site with a browsable product catalog.

This document is the **stable reference** for what the product is and why it
exists. It should change rarely. Day-to-day status belongs in
[`MEMORY.md`](./MEMORY.md), not here.

## Purpose

- Give D&W Myanmar Auto Parts a professional, fast, mobile-friendly web
  presence.
- Provide secure account access (login / sign-up / password reset) as the
  foundation for future customer- and staff-facing features.
- Present the company's product range (auto parts) in a structured catalog,
  backed by a proper data model (see ERD note below), rather than static
  marketing pages.
- Stay easy for a small team to extend: clear module boundaries, a single
  design-token source of truth, and predictable conventions (see
  [`ARCHITECTURE.md`](./ARCHITECTURE.md) and
  [`CODING_GUIDELINES.md`](./CODING_GUIDELINES.md)).

## Guiding principles

1. **Agile delivery.** The team works in short, iterative cycles rather than
   a fixed up-front spec (see [`WORKFLOW.md`](./WORKFLOW.md)). Requirements
   are expected to evolve.
2. **Semantic tokens, not raw utilities.** All color, spacing, and type
   decisions flow from the design system (see
   [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)), not one-off Tailwind classes
   or inline styles.
3. **Next.js owns both ends.** Next.js (App Router) is used for the frontend
   _and_ the backend (Route Handlers / Server Actions / Server Components
   talking to Supabase) — there is no separate backend service today.
4. **Supabase is the system of record.** Postgres (via Supabase) is the
   single source of truth for auth and, going forward, product/catalog data.
   Row Level Security is the default access-control mechanism.
5. **Security by default.** Session refresh happens centrally in `proxy.ts`
   (Next.js middleware); protected routes assume no user until proven
   otherwise.
6. **Small team, low ceremony.** Prefer conventions that a small team can
   hold in their heads: one way to build a form, one way to talk to
   Supabase, one place for design tokens.

## Terminology

| Term                                              | Meaning                                                                                                                                                                                                                                                   |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User / Account**                                | A Supabase Auth identity (email + password today). No roles beyond "authenticated" exist yet.                                                                                                                                                             |
| **Product**                                       | An auto part offered by D&W. Not yet modeled in the database — see Roadmap.                                                                                                                                                                               |
| **Category**                                      | A grouping of Products (e.g. brakes, filters, lighting). Not yet modeled — see Roadmap.                                                                                                                                                                   |
| **Protected area**                                | Any route that requires an authenticated session (currently `/protected`).                                                                                                                                                                                |
| **Design tokens**                                 | The named color/spacing/typography values defined once in `app/globals.css` and `tailwind.config.ts`, described in `DESIGN_SYSTEM.md`.                                                                                                                    |
| **Starter scaffold / legacy tutorial components** | The original Next.js + Supabase starter-kit components (`components/tutorial/*`, `hero.tsx`, `deploy-button.tsx`, etc.) that shipped with the template. These are being replaced by D&W-specific, Tailwind-first components (see `MEMORY.md` for status). |

## Entity relationships (planned)

The product needs an **Entity Relationship Diagram (ERD)** because it must
track products, categories, and their relationships — this is described as
the backbone of the app. As of this writing, no product/category tables or
migrations exist yet in the codebase; the ERD itself and the corresponding
Supabase schema are open work (see `MEMORY.md` → Known gaps).

## Version roadmap

This is a rough sequencing, not a committed schedule — update it as
priorities shift, and log the actual state of each item in `MEMORY.md`.

### v0 — Foundation (in progress)

- Next.js + Supabase project scaffolding
- Auth flows: sign up, login, forgot/update password, email confirmation,
  one protected page
- Design tokens (color, spacing, radius, shadow) wired into Tailwind
- CI quality gates (lint, typecheck, format) + CodeQL scanning
- Git hooks (Husky + lint-staged)

### v1 — Public site

- Marketing/home pages using the D&W design system (retire the starter
  scaffold pages) ✅
- Product & Category data model + ERD finalized in Supabase
- Public, read-only product catalog (browse/search/filter) ✅ (local JSON, Supabase migration pending)
- Manrope typography and full color/status token set applied consistently ✅
- Multi-language support (Myanmar/English) ✅

### v2 — Operational features

- Product images/media via Amazon S3
- Staff/admin area for managing products & categories (roles/permissions)
- Contact / enquiry flow tied to specific products

### Later / not yet scoped

- Ordering, quoting, or checkout flows
- Analytics and reporting

## Related documents

- [`PRD.md`](./PRD.md) — requirements and acceptance gates per version (create when the first PRD is written; not yet present).
- [`MEMORY.md`](./MEMORY.md) — current status, known gaps, session handoff.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — module boundaries and data flow.
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — tokens, typography, spacing.
- [`CODING_GUIDELINES.md`](./CODING_GUIDELINES.md) — implementation patterns.
- [`WORKFLOW.md`](./WORKFLOW.md) — process, validation, release.
