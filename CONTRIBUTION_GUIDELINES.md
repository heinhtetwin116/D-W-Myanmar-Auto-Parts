# Contributing Guide

This document defines the conventions for branching, committing, and submitting changes to this project.

<!-- ## Table of Contents

- [Contributing Guide](#contributing-guide)
  - [Table of Contents](#table-of-contents)
  - [Branch Naming Convention](#branch-naming-convention)
    - [Type](#type)
    - [Short Description](#short-description)
    - [Examples](#examples)
  - [Commit Message Convention](#commit-message-convention)
    - [Type](#type-1)
    - [Scope](#scope-1)
    - [Summary](#summary)
    - [Body (optional)](#body-optional)
    - [Footer (optional)](#footer-optional)
    - [Examples](#examples-1)
    - [Commit Hygiene](#commit-hygiene)
  - [Pull Request Workflow](#pull-request-workflow)
  - [Code Style](#code-style)

--- -->

## 1. Branch Naming Convention

Branches follow the pattern:

```
<type>/<short-description>
```

### Type

| Type       | Use for                                                        |
| ---------- | -------------------------------------------------------------- |
| `ui`       | UI-only work (components, styling, layout) — no backend wiring |
| `feature`  | New functionality (UI + logic + API integration)               |
| `fix`      | Bug fixes                                                      |
| `refactor` | Code restructuring with no behavior change                     |
| `chore`    | Tooling, dependencies, config, build scripts                   |
| `docs`     | Documentation only                                             |
| `test`     | Adding or updating tests                                       |

### Short Description

- Lowercase, kebab-case
- Concise (3–5 words max)
- No issue numbers required, but may be appended if useful

### Examples

```
ui/students-screen
ui/header-avatar-size
feature/teacher-attendance-api
fix/grid-item-aspect-ratio
feature/students-crud-endpoints
fix/jwt-refresh-token-expiry
chore/upgrade-nestjs-v11
docs/contributing-guide
```

## 2. Commit Message Convention

This project follows **[Conventional Commits](https://www.conventionalcommits.org/)**.

```
<type>: <short summary>

[optional body]

[optional footer(s)]
```

### Type

Must be one of:

| Type       | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `feat`     | A new feature                                                |
| `fix`      | A bug fix                                                    |
| `refactor` | Code change that neither fixes a bug nor adds a feature      |
| `style`    | Formatting, whitespace, missing semicolons (no logic change) |
| `docs`     | Documentation only changes                                   |
| `test`     | Adding or correcting tests                                   |
| `chore`    | Build process, dependency updates, tooling                   |
| `perf`     | Performance improvements                                     |
| `revert`   | Reverts a previous commit                                    |

### Examples

```
feat: add fixed-height header with larger avatar

fix: correct grid item aspect ratio using onLayout measurement

The previous aspect-square approach broke when label text wrapped
to two lines, stretching the card taller than its width.

refactor: align Students screen with NativeWind/RNR conventions

chore: upgrade @nestjs/core and @nestjs/common to v11

docs: add CONTRIBUTING.md with branch and commit conventions

feat1: add students CRUD endpoints

Closes #42
```

### Commit Hygiene

- One logical change per commit — avoid bundling unrelated changes
- Do not commit commented-out code or `console.log` / debug statements
- Squash WIP commits before opening a PR (interactive rebase is fine)

## Pull Request Workflow

1. Branch off `main` using the naming convention above.
2. Keep PRs scoped to a single concern (one screen, one endpoint, one fix).
3. PR title should follow the same format as a commit message:
   ```
   feat: add subjects screen
   ```
4. PR description should include:
   - **What** changed and **why**
   - Screenshots/recordings for UI changes
   - `// TODO: wire to backend API` markers called out explicitly if mock data is still in use
5. Ensure the following pass before requesting review:
   - `npm run lint`
6. Request review — at least one approval required before merge.
7. Squash-merge into `main` once approved.
