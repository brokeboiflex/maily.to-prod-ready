# maily.to-prod-ready

A **shadcn-installable** build of [maily.to](https://github.com/arikchakma/maily.to) — the
TipTap-based WYSIWYG editor for composing beautiful, mobile-ready emails from pre-designed
blocks (buttons, logos, images, columns, sections, variables, footers, repeat/conditional
blocks, …), plus a renderer that turns the editor's JSON into email-safe HTML.

The upstream project ships Maily as npm packages. **This fork distributes the source instead:**
run one `shadcn add` and the editor and renderer land in your codebase as plain files you
own, theme, and edit — like any other shadcn component. No opaque dependency, no shipped
stylesheet; the UI renders entirely from **your** shadcn theme tokens.

> This is a fork. Credit for Maily itself goes to [Arik Chakma](https://github.com/arikchakma)
> and the upstream contributors. See [Credits](#credits).

## What you get

A single registry block named **`maily`** that installs two things:

| Part         | Installs to            | Import from           | Purpose                                  |
| ------------ | ---------------------- | --------------------- | ---------------------------------------- |
| **Editor**   | `components/maily/**`  | `@/components/maily`  | The `<Editor />` WYSIWYG email composer. |
| **Renderer** | `lib/maily-render/**`  | `@/lib/maily-render`  | `render()` — editor JSON → email HTML.   |

## Requirements

- **React 18 or 19**
- **Tailwind CSS v4** with the standard **shadcn theme tokens** defined
  (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, …). Maily ships no CSS
  of its own — its chrome **and** writing surface read these tokens, so it follows your
  light/dark theme automatically.
- **`@tailwindcss/typography`** — the content area uses `prose`. The block wires this in for
  you on install (via its `css` key, which appends `@plugin "@tailwindcss/typography";`).
- A project already initialised with the **shadcn CLI** (`components.json` present).

## Install

The block is consumed from a shadcn **registry namespace**. Point your `components.json` at
wherever this repo's `maily.json` is served, then `add` it:

```jsonc
// components.json
"registries": {
  "@maily": "https://your-host/r/{name}.json"
}
```

```bash
npx shadcn@latest add @maily/maily
```

This writes the editor and renderer source into your project and installs their npm
dependencies (TipTap, lowlight, tippy.js, the renderer's `@react-email/*`, etc.).

> **Local / from this repo:** the included `playground/` serves the registry on
> `http://localhost:5173/r/` for exactly this flow. See [`playground/README.md`](playground/README.md).

## Usage

### Editor

```tsx
import { Editor } from '@/components/maily';

export function ComposeEmail() {
  return (
    <Editor
      contentJson={{ type: 'doc', content: [] }}
      onUpdate={(editor) => {
        // persist editor.getJSON() — feed it to the renderer when you send
        console.log(editor.getJSON());
      }}
    />
  );
}
```

`<Editor />` is self-contained: the toolbar, slash-command menu, and all bubble menus are
included. It renders nothing of its own theme — it inherits yours.

#### Key props

All props are optional. The editor accepts content as JSON or HTML and reports changes
through callbacks.

| Prop            | Type                          | Description                                                       |
| --------------- | ----------------------------- | ---------------------------------------------------------------- |
| `contentJson`   | `JSONContent`                 | Initial content as TipTap JSON (a `doc` node, or an array of nodes). |
| `contentHtml`   | `string`                      | Initial content as HTML (used when `contentJson` is absent).     |
| `onCreate`      | `(editor) => void`            | Called once the editor instance is ready.                        |
| `onUpdate`      | `(editor) => void`            | Called on every change. Read `editor.getJSON()` here.            |
| `editable`      | `boolean`                     | Toggle read-only mode. Defaults to `true`.                       |
| `extensions`    | `AnyExtension[]`              | Extra TipTap extensions, merged with the defaults.               |
| `blocks`        | `BlockGroupItem[]`            | Override the slash-command block list.                           |
| `config`        | `object`                      | Chrome toggles & class hooks — see below.                        |

`config` fields: `hasMenuBar` (show the top toolbar, default `true`), `hideContextMenu`,
`spellCheck`, `autofocus`, `immediatelyRender`, and the class hooks `wrapClassName`,
`toolbarClassName`, `bodyClassName`, `contentClassName`.

### Renderer

```ts
import { render } from '@/lib/maily-render';

const html = await render(editorJson, {
  preview: 'Inbox preview text',
  theme: {
    /* optional theme overrides for the rendered email */
  },
});
```

`render()` is independent of the editor's on-screen theming — it produces the final,
email-client-safe HTML from the saved JSON.

## Theming & customisation

- **Tokens, not CSS.** Restyle by editing your shadcn theme variables; the editor follows.
- **Toolbar position/layout** is a per-instance concern — pass utilities via
  `config.toolbarClassName` (e.g. `sticky top-0`, `justify-center`, `mb-6`). These are merged
  with `tailwind-merge`, so conflicting utilities you pass win over the defaults.
- **Deeper restyling** is just editing the source you now own — e.g. the toolbar lives in
  `components/maily/editor/components/editor-menu-bar.tsx`. That's the whole point of
  distributing source rather than a package: customise by editing, not by prop sprawl.

## Known issue — `verbatimModuleSyntax`

If your project has `verbatimModuleSyntax: true` (the modern shadcn/Vite default), the editor
source currently value-imports some type-only symbols (e.g. `import { Command } from
'@tiptap/core'`) and the browser throws *"does not provide an export named 'Command'"*. Until
this is fixed at the source, set `verbatimModuleSyntax: false` in your `tsconfig`. Details in
[`playground/README.md`](playground/README.md).

## Status & roadmap

This fork is being hardened toward production. In progress:

- **Generic i18n** — override every user-facing string with a caller-provided value
  (framework-agnostic, English defaults).
- **Image upload** — accept uploaded files via a caller-provided handler, in addition to URLs.

See [`AGENTS.md`](AGENTS.md) for the north-star goals and current architecture.

## Contributing & local development

This is a **pnpm + Turborepo monorepo**. `packages/core`, `packages/render`, and
`packages/shared` are the source of truth; `registry/**` and `registry.json` are **generated**
— never hand-edit them. Edit the packages, then regenerate:

```bash
pnpm install         # install workspace deps
pnpm dev             # turbo dev across packages
pnpm test            # vitest
pnpm registry:build  # regenerate registry/** and registry.json from packages/*/src
pnpm playground:sync # registry:build + serve the JSON for the playground
```

Full architecture, conventions, and the registry build mechanics are documented in
[`AGENTS.md`](AGENTS.md). The local consumer harness is [`playground/README.md`](playground/README.md).

## Credits

Built on [maily.to](https://github.com/arikchakma/maily.to) by
[Arik Chakma](https://twitter.com/imarikchakma) and contributors.

## License

MIT
