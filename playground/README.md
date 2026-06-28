# maily playground

A throwaway **Vite + React + Tailwind v4 + shadcn** app used to dev-test the
Maily editor the way a real consumer would: by installing it from the local
shadcn registry with `shadcn add`, instead of importing the workspace packages.

It was scaffolded with the shadcn CLI:

```bash
bunx --bun shadcn@latest init -t vite
```

## How it's wired

The repo root is a shadcn **registry** (`registry.json`, generated from
`packages/*` — see the top-level `AGENTS.md`). This playground consumes it
through a local namespace declared in `components.json`:

```jsonc
// playground/components.json
"registries": {
  "@maily": "http://localhost:5173/r/{name}.json"
}
```

The served JSON lives in `playground/public/r/` (`maily.json` + a `registry.json`
index). Vite serves `public/` at the web root, so the registry is reachable at
`http://localhost:5173/r/...` while the dev server is running. The port is
pinned (`strictPort`) in `vite.config.ts` so that URL stays valid.

## Usage

From the repo root, regenerate the registry and refresh what the playground
serves (run after any change under `packages/*`):

```bash
pnpm playground:sync
```

Then, in this directory:

```bash
bun install          # first time only
bun run dev          # start the dev server (http://localhost:5173)
```

With the dev server running, list / inspect / install the registry from the
local namespace:

```bash
bunx --bun shadcn@latest list @maily                     # list registry items
bunx --bun shadcn@latest view @maily/maily               # inspect the maily block
bunx --bun shadcn@latest add  @maily/maily --overwrite   # (re)install the editor source
```

`add` writes the editor into `src/components/maily/**` and the renderer into
`src/lib/maily-render/**` (the targets declared in `registry.json`), and installs
the editor's npm dependencies. `src/App.tsx` renders `<Editor />` from
`@/components/maily` as a smoke test.

## Known issue — `verbatimModuleSyntax`

`shadcn init -t vite` enables `verbatimModuleSyntax: true` in `tsconfig.app.json`.
The current editor source value-imports type-only symbols, e.g.:

```ts
import { Command } from '@tiptap/core'   // Command is a *type*
```

With `verbatimModuleSyntax` on, Vite/esbuild keeps that as a runtime import and
the browser throws:

```
The requested module '@tiptap_core.js' does not provide an export named 'Command'
```

This playground works around it by setting `verbatimModuleSyntax: false` in
`tsconfig.app.json`. **The proper fix is in the source** (`packages/core`): change
these to `import type { ... }`. Until then, any consumer whose project has
`verbatimModuleSyntax` enabled (the modern shadcn/Vite default) will hit this.
