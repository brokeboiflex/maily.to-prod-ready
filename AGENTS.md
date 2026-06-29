# maily.to-prod-ready

## What this project is

This is a **fork of [maily.to](https://github.com/arikchakma/maily.to)** that we are turning into a **production-ready, shadcn-installable component**.

Maily is a TipTap-based WYSIWYG editor for composing beautiful, mobile-ready emails from pre-designed blocks (buttons, logos, images, columns, sections, variables, footers, repeat/conditional blocks, etc.) plus a renderer that turns the editor's JSON content into email-safe HTML.

The upstream project ships Maily as published npm packages. **Our goal is different:** instead of (or in addition to) installing from npm, a consumer should be able to run a shadcn `add` command and have the editor's source dropped directly into their own codebase — owned, themeable, and modifiable like any other shadcn component.

## North-star goals

1. **shadcn-installable** — distribute the editor as a shadcn registry block so users `shadcn add` the source into their project rather than depending on an opaque npm package.
2. **i18n via generic label replacement** — the component must be translatable by letting consumers pass their own translated labels/strings in. This is **framework-agnostic**: no built-in dependency on `next-intl`, `react-i18next`, etc. — just a generic mechanism to override every user-facing string with a caller-provided value (with sensible English defaults).
3. **Image upload, not just URL** — the image block currently accepts a URL. We are extending it so users can **upload** image files (via a caller-provided upload handler), in addition to pasting a URL.
4. **Production-ready** — clean, documented, type-safe, and reliable enough to ship.

## Repository layout

This is a **pnpm + Turborepo monorepo**.

```
packages/
  core/      @maily-to/core   — the TipTap editor: blocks, extensions, nodes, UI. Main package.
  render/    @maily-to/render — renders editor JSON content to email-safe HTML.
  shared/    @maily-to/shared — shared types/utilities used by core and render.
  tsconfig/                   — shared TS config.

registry/                     — generated shadcn registry output (the installable block).
  default/maily/
    components/maily/  ← mirrors packages/core/src (the editor)
    lib/maily-render/  ← mirrors packages/render/src + shared

registry.json                 — shadcn registry manifest (single `maily` block).
scripts/
  build-shadcn-registry.mjs   — builds registry/** and registry.json from packages/*/src.
  icon-map.mjs                — lucide → IconPlaceholder mapping used during the build.

playground/                   — local dev harness: a Vite + shadcn app that installs the
                                editor from the local registry via `shadcn add @maily/maily`.
                                Not part of the pnpm workspace. See playground/README.md.
```

### Key relationship: packages are the source of truth

`packages/core`, `packages/render`, and `packages/shared` hold the canonical source. The `registry/` tree and `registry.json` are **generated** from those packages by `scripts/build-shadcn-registry.mjs` (`pnpm registry:build`). When editing editor/renderer behavior, change the **package source** and regenerate the registry — do not hand-edit `registry/**`.

The build step also rewrites hardcoded `lucide-react` icon JSX into a shadcn-friendly `<IconPlaceholder>` so installers can swap in their preferred icon library. See `.sisyphus/plans/` and `.sisyphus/evidence/` for the icon-conversion design notes.

## Tech stack

- **React 18/19**, **TypeScript**
- **TipTap / ProseMirror** for the editor
- **Tailwind CSS v4** (prefixed `mly:` utilities to avoid clashing with host styles)
- **Radix UI** primitives, **lucide-react** icons
- **tsup / tsdown** for package builds, **Turborepo** for orchestration, **Vitest** for tests
- **shadcn registry** schema for distribution

## Common commands

```bash
pnpm install            # install workspace deps
pnpm dev                # turbo dev across packages
pnpm build              # build all packages
pnpm test               # run vitest across packages
pnpm registry:build     # regenerate registry/** and registry.json from packages/*/src
pnpm playground:sync    # registry:build + serve the built JSON into playground/public/r
pnpm format:write       # prettier
pnpm lint               # eslint
```

## Local dev playground

`playground/` is a standalone Vite + React + Tailwind v4 + shadcn app (scaffolded
with `bunx --bun shadcn@latest init -t vite`) that consumes this repo's registry the
way an end user would. Its `components.json` declares a local namespace
`@maily → http://localhost:5173/r/{name}.json`, served from `playground/public/r`.

Loop: edit `packages/*` → `pnpm playground:sync` (rebuild + reserve) → in `playground/`,
run `bun run dev` and `shadcn add @maily/maily --overwrite`. Full details, commands,
and the `verbatimModuleSyntax` caveat are in `playground/README.md`.

> **Known portability bug surfaced by the playground:** the editor source
> value-imports type-only symbols (e.g. `import { Command } from '@tiptap/core'`).
> Consumers with `verbatimModuleSyntax: true` (the modern shadcn/Vite default) get a
> runtime "does not provide an export named 'Command'" error. Fix in `packages/core`
> by switching these to `import type`.

## Working conventions

- **Read before you edit.** The editor is large and the block/extension/node wiring is intricate; trace how a block is registered and rendered before changing it.
- **Edit packages, regenerate the registry.** Never hand-edit `registry/**` — it is build output.
- **Keep i18n generic.** Any new user-facing string must be overridable via the label-replacement mechanism, with an English default. Don't couple to a specific i18n framework.
- **Keep image upload caller-driven.** The component should not assume a storage backend; it calls a handler the consumer provides and uses the returned URL.
- **Tailwind classes are `mly:`-prefixed** inside the editor to stay isolated from host app styles.
- **Theme the chrome with shadcn tokens, not hardcoded colors.** The editor's UI chrome (toolbar, bubble menus, popovers, dropdowns, slash/suggestion menus, inputs, selects, buttons, tooltips) is painted with semantic shadcn tokens exposed as `mly:`-prefixed utilities — `mly:bg-popover`, `mly:text-popover-foreground`, `mly:bg-background`, `mly:text-foreground`, `mly:text-muted-foreground`, `mly:bg-accent`/`mly:text-accent-foreground`, `mly:border-border`, `mly:border-input`, `mly:ring-ring`, `mly:bg-primary`/`mly:text-primary-foreground`, `mly:text-destructive`. These are registered in `packages/core/src/styles/index.css` via an `@theme inline` block that maps each to the host's `var(--background)` / `var(--foreground)` / … so the chrome follows the consumer's light/dark theme. Any shadcn consumer already defines these CSS variables; non-shadcn consumers must define them for theming to apply. When adding chrome, use these tokens — do not reintroduce `mly:bg-white` / `mly:text-gray-*` / `mly:bg-soft-gray`.
- **The email canvas stays a light preview.** The white "paper" the user types on (and the rendered email-content nodes — buttons, link cards, footer text, variable pills, HTML/code blocks) is an intentional WYSIWYG preview of a light email document and is **not** theme-driven. Its text colors are literal-dark so they stay readable on white in both host themes. Don't convert email-content node colors to tokens. The brand rose accent used for variables and the destructive red for delete are deliberate semantic colors.
