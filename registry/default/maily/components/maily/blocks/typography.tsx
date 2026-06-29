import { IconPlaceholder } from "@/components/icon-placeholder"
import type { BlockItem } from './types';

export const text: BlockItem = {
  title: 'Text',
  description: 'Just start typing with plain text.',
  searchTerms: ['p', 'paragraph'],
  icon: <IconPlaceholder
  lucide="Text"
  tabler="IconTypography"
  hugeicons="TextFontIcon"
  phosphor="Text"
  remixicon="RiParagraph"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode('paragraph', 'paragraph')
      .run();
  },
};

export const heading1: BlockItem = {
  title: 'Heading 1',
  description: 'Big heading.',
  searchTerms: ['h1', 'title', 'big', 'large'],
  icon: <IconPlaceholder
  lucide="Heading1"
  tabler="IconH1"
  hugeicons="Heading01Icon"
  phosphor="TextHOne"
  remixicon="RiHeading"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 1 })
      .run();
  },
};

export const heading2: BlockItem = {
  title: 'Heading 2',
  description: 'Medium heading.',
  searchTerms: ['h2', 'subtitle', 'medium'],
  icon: <IconPlaceholder
  lucide="Heading2"
  tabler="IconH2"
  hugeicons="Heading02Icon"
  phosphor="TextHTwo"
  remixicon="RiHeading"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 2 })
      .run();
  },
};

export const heading3: BlockItem = {
  title: 'Heading 3',
  description: 'Small heading.',
  searchTerms: ['h3', 'subtitle', 'small'],
  icon: <IconPlaceholder
  lucide="Heading3"
  tabler="IconH3"
  hugeicons="Heading03Icon"
  phosphor="TextHThree"
  remixicon="RiHeading"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 3 })
      .run();
  },
};

export const hardBreak: BlockItem = {
  title: 'Hard Break',
  description: 'Add a break between lines.',
  searchTerms: ['break', 'line'],
  icon: <IconPlaceholder
  lucide="DivideIcon"
  tabler="IconDivide"
  hugeicons="DivideSignIcon"
  phosphor="Divide"
  remixicon="RiDivideLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setHardBreak().run();
  },
};

export const blockquote: BlockItem = {
  title: 'Blockquote',
  description: 'Add blockquote.',
  searchTerms: ['quote', 'blockquote'],
  icon: <IconPlaceholder
  lucide="TextQuote"
  tabler="IconQuote"
  hugeicons="QuoteUpIcon"
  phosphor="Quotes"
  remixicon="RiDoubleQuotesL"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
  },
};

export const footer: BlockItem = {
  title: 'Footer',
  description: 'Add a footer text to email.',
  searchTerms: ['footer', 'text'],
  icon: <IconPlaceholder
  lucide="FootprintsIcon"
  tabler="IconWalk"
  hugeicons="FootprintsIcon"
  phosphor="Footprints"
  remixicon="RiFootprintLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setFooter().run();
  },
};

export const clearLine: BlockItem = {
  title: 'Clear Line',
  description: 'Clear the current line.',
  searchTerms: ['clear', 'line'],
  icon: <IconPlaceholder
  lucide="EraserIcon"
  tabler="IconEraser"
  hugeicons="EraserIcon"
  phosphor="Eraser"
  remixicon="RiEraserLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().selectParentNode().deleteSelection().run();
  },
};
