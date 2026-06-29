# i18n via full label-override dictionary — design

**Date:** 2026-06-30
**Status:** Approved (design), pending implementation plan
**Scope:** `packages/core` (editor chrome + default-block menu strings)

## 1. Problem & goal

Maily must be **translatable without coupling to any i18n framework** (no `next-intl`,
`react-i18next`, etc.). Today every user-facing string in the editor is hardcoded in
component files, the placeholder extension, and the block definitions — there is no
override path for chrome strings at all.

We deliver a **translation-support mechanism**, not translations: ship English defaults
for every user-facing string, and let a consumer supply their own complete language as
plain data. The component stays framework-agnostic — data in, string out.

## 2. Core decisions (locked)

1. **Full language, no partial overrides.** When a consumer provides `labels`, it is a
   *complete* language — every key required. The mechanism never merges a partial object
   against defaults. Missing a key is a **compile error naming the key**, so the consumer
   always knows exactly what they must declare.
2. **English by default.** If `labels` is omitted, the editor uses the shipped
   `defaultLabels` (English) verbatim. No behavior change for existing consumers.
3. **One translation entry point.** The dictionary covers editor **chrome** *and* the
   **default-block menu metadata** (each default block's `title`/`description` and the
   slash-command group/submenu titles). A consumer can localize the stock editor by
   passing `labels` alone — without re-declaring the `blocks` array.
4. **`blocks` prop unchanged.** Passing a custom `blocks` array still structurally
   adds/replaces blocks; those strings are the consumer's responsibility (as today).
5. **Lightweight & merge-free.** Resolution is a single reference swap
   (`props.labels ?? defaultLabels`) plus an O(1) keyed lookup. `t` and the context value
   are memoized on the stable `labels` reference → zero extra re-renders.

## 3. Scope

**In scope (covered by the dictionary):**
- Tooltips and labels across all bubble menus (text, section, image, inline-image,
  column, repeat), content menu, alignment / direction / vertical-alignment switches,
  show-conditionally popover, HTML menu, "turn into" menu.
- Placeholder strings (default, `Heading {level}`, HTML code block).
- Slash-command group titles ("Blocks", "Components"), submenu titles/descriptions
  ("Headers", "Footers"), and navigation hints ("to navigate", "to select").
- Each **default block's** `title` and `description`.
- Spacing / radius / border-width option labels ("None", "Thin", "Sharp", …).
- Unit/dimension micro-labels surfaced in the UI ("W", "H", "PX").

**Out of scope (explicit non-goals):**
- **Block `searchTerms`** stay English. They are fuzzy-match keys, not displayed; keeping
  them out preserves `t` as a clean, fully-typed `string → string` map. A consumer who
  needs localized search keywords overrides them via the `blocks` prop.
- **Seed content** a block *inserts* into the document (e.g. footer "UNSUBSCRIBE",
  header "Weekly Newsletter"). That is email *content*, not chrome — the consumer edits
  it after insertion, or supplies custom blocks. May be revisited later; not now.
- `packages/render` (produces the sent email; unaffected by editor labels).

## 4. Public API

```ts
// packages/core/src/editor/i18n/default-labels.ts

export const defaultLabels = {
  'toolbar.bold': 'Bold',
  'toolbar.italic': 'Italic',
  'sectionMenu.borderRadius': 'Border Radius',
  'placeholder.default': 'Write something or / to see commands',
  'placeholder.heading': 'Heading {level}',
  'slashCommand.navigate': 'to navigate',
  'block.text.title': 'Text',
  'block.text.description': 'Just start typing with plain text.',
  // …every user-facing string (~80 keys)
} as const;

export type LabelKey = keyof typeof defaultLabels;

/** A COMPLETE language. Every key required — no Partial. */
export type MailyLabels = Record<LabelKey, string>;
```

```tsx
// Consumer usage
import { Editor, defaultLabels, type MailyLabels } from '@maily-to/core';

const frenchLabels: MailyLabels = {
  ...,                       // must declare ALL keys; TS errors on any omission
};

<Editor labels={frenchLabels} />   // full French
<Editor />                          // English (defaultLabels)
```

- `defaultLabels` is **both** the runtime default **and** the authoring template:
  copy → translate → pass.
- `MailyLabels` is the contract consumers type their object against.

## 5. Key namespace

Flat, dot-namespaced keys grouped by surface. Flat (vs nested) keeps the type a simple
fully-required `Record`, makes the complete key list a single readable manifest, and keeps
lookup a single property access.

| Namespace | Examples |
|---|---|
| `block.<id>.{title,description}` | `block.text.title`, `block.heading1.description`, `block.headers.title` |
| `slashCommand.*` | `slashCommand.group.blocks`, `slashCommand.navigate`, `slashCommand.select` |
| `placeholder.*` | `placeholder.default`, `placeholder.heading` (`{level}`), `placeholder.html` |
| `toolbar.*` | `toolbar.bold`, `toolbar.link`, `toolbar.textColor` |
| `alignment.*` / `direction.*` / `verticalAlignment.*` | `alignment.center`, `direction.rtl`, `verticalAlignment.top` |
| `contentMenu.*` | `contentMenu.duplicate`, `contentMenu.delete`, `contentMenu.addNode` |
| `sectionMenu.*` | `sectionMenu.margin`, `sectionMenu.radius.sharp`, `sectionMenu.borderWidth.thin` |
| `imageMenu.*` / `inlineImageMenu.*` | `imageMenu.size`, `imageMenu.lockAspectRatio`, `inlineImageMenu.sourceUrl` |
| `columnMenu.*` | `columnMenu.gap`, `columnMenu.delete` |
| `repeatMenu.*` / `showPopover.*` / `htmlMenu.*` | `repeatMenu.placeholder`, `showPopover.showIf`, `htmlMenu.preview` |
| `turnInto.*` | `turnInto.label`, `turnInto.heading1`, `turnInto.bulletList` |
| `spacing.*` | `spacing.none`, … |

The implementation plan will enumerate the exhaustive key list (the string inventory is
already mapped across `packages/core/src`).

## 6. Lookup & interpolation

```ts
// packages/core/src/editor/i18n/translate.ts
export type TranslateFn = (key: LabelKey, vars?: Record<string, string | number>) => string;

export function createTranslator(labels: MailyLabels): TranslateFn {
  return (key, vars) => interpolate(labels[key], vars);
}

// ~3-line {token} replacer; used only by dynamic strings (`Heading {level}`, `© {year}`)
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
```

No `?? key` fallback is needed — completeness is guaranteed by the type.

## 7. Data flow

`labels` and `t` are computed **once** at the top of `Editor` and handed to the three
consumers. There are exactly three because strings are read from React components, from a
non-React TipTap extension, and from the default-blocks builder.

```
Editor(props)
  ├─ const labels = props.labels ?? defaultLabels      // reference swap, no merge
  ├─ const t = useMemo(() => createTranslator(labels), [labels])
  │
  ├─ blocks = props.blocks ?? getDefaultBlocks(t)       // (A) default-block builder
  ├─ defaultExtensions({ extensions, blocks, t })       // (B) Placeholder extension
  └─ <MailyProvider labels={labels} t={t} …>            // (C) components via context
```

- **(C) Components** read `const { t } = useMailyContext()`. Today `MailyProvider` carries
  only `placeholderUrl`; we add `labels` and `t` to `MailyContextType` and the provider
  value. The context value object is memoized so adding `t` causes no extra renders.
- **(B) Placeholder extension** is currently a module-level constant
  (`PlaceholderExtension`). It becomes a factory `createPlaceholderExtension(t)` returning
  the configured extension, called inside `defaultExtensions` with the threaded `t`.
- **(A) Default blocks**: `DEFAULT_SLASH_COMMANDS` (a static array of static `BlockItem`
  consts) becomes `getDefaultBlocks(t)`. Each block export converts from a `const` to a
  factory `(t: TranslateFn) => BlockItem` that pulls `title`/`description` from `t` while
  keeping `searchTerms`, `icon`, and `command` as-is. This is the largest mechanical
  surface (every file in `packages/core/src/blocks/`).

## 8. Required refactors (summary)

| Area | Change |
|---|---|
| `editor/i18n/default-labels.ts` | **New.** `defaultLabels`, `LabelKey`, `MailyLabels`. |
| `editor/i18n/translate.ts` | **New.** `TranslateFn`, `createTranslator`, `interpolate`. |
| `blocks/*.tsx` | Each `BlockItem` const → factory `(t) => BlockItem` (title/description via `t`). |
| `extensions/slash-command/default-slash-commands.tsx` | `DEFAULT_SLASH_COMMANDS` → `getDefaultBlocks(t)`; group/submenu titles via `t`. |
| `extensions/placeholder.ts` | Constant → `createPlaceholderExtension(t)`. |
| `editor/extensions.ts` (`defaultExtensions`) | Thread `t` through to the placeholder factory. |
| `editor/provider.tsx` | Add `labels` + `t` to `MailyContextType` and provider value (memoized). |
| `editor/index.tsx` | Compute `labels`/`t`; default `blocks` via `getDefaultBlocks(t)`; pass `t` to extensions + provider; add `labels` to `EditorProps`. |
| All chrome components (~bubble menus, switches, menus) | Replace hardcoded literals with `t('…')`. |

## 9. Type-level completeness guarantee

- `defaultLabels … as const` → `LabelKey` is the literal union of all keys.
- `MailyLabels = Record<LabelKey, string>` (not `Partial`) → a consumer-supplied object
  omitting any key fails to type-check, with the error naming the missing key(s).
- This is the "user knows about every key" guarantee, enforced at compile time with zero
  runtime cost.

## 10. Performance

- Resolution is a reference swap, not a merge.
- `t` is memoized on `labels`; lookups are O(1) property access.
- Provider value is memoized → adding `t` to context introduces no re-render churn.
- `interpolate` runs only for the handful of dynamic strings.

## 11. shadcn registry & docs

- New `i18n/` files and the converted blocks/extensions mirror into `registry/**` via
  `pnpm registry:build` (source of truth stays in `packages/*/src`; never hand-edit
  `registry/**`). `defaultLabels` is **shipped** (consumer-owned, editable in place) — it
  is *not* externalized like `cn`.
- Per the project documentation rule, update on completion: `AGENTS.md` (i18n section),
  `packages/core/README.md`, and `playground/README.md` with the `labels` API, the
  `defaultLabels` template, and the `MailyLabels` contract.

## 12. Testing

- **Type test:** an object missing a key is rejected; a complete object is accepted.
- **Default behavior:** with no `labels`, rendered chrome equals current English strings
  (snapshot of representative menus/placeholders).
- **Override:** with a full custom `labels`, chrome and default-block menu reflect the
  supplied strings; `placeholder.heading` interpolates `{level}` correctly.
- **Custom `blocks`:** passing `blocks` still overrides structure and its own strings.

## 13. Non-goals

- No bundled translations or locale files — English defaults only; consumers supply the
  rest.
- No partial/merge override semantics.
- No localization of `searchTerms` or inserted seed content (see §3).
- No changes to `packages/render`.
