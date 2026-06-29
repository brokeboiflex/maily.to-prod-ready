import { IconPlaceholder } from "@/components/icon-placeholder"
import type { BlockItem } from './types';

export const columns: BlockItem = {
  title: 'Columns',
  description: 'Add columns to email.',
  searchTerms: ['layout', 'columns'],
  icon: <IconPlaceholder
  lucide="ColumnsIcon"
  tabler="IconColumns"
  hugeicons="LayoutTwoColumnIcon"
  phosphor="Columns"
  remixicon="RiLayoutColumnLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor
      .chain()
      .focus()
      .deleteRange(range)
      // @ts-ignore
      .setColumns()
      .focus(editor.state.selection.head - 2)
      .run();
  },
};

export const section: BlockItem = {
  title: 'Section',
  description: 'Add a section to email.',
  searchTerms: ['layout', 'section'],
  icon: <IconPlaceholder
  lucide="RectangleHorizontal"
  tabler="IconRectangle"
  hugeicons="Square01Icon"
  phosphor="Rectangle"
  remixicon="RiRectangleLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setSection().run();
  },
};

export const repeat: BlockItem = {
  title: 'Repeat',
  description: 'Loop over an array of items.',
  searchTerms: ['repeat', 'for', 'loop'],
  icon: <IconPlaceholder
  lucide="Repeat2"
  tabler="IconRepeat"
  hugeicons="RepeatIcon"
  phosphor="Repeat"
  remixicon="RiRepeatLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setRepeat().run();
  },
};

export const spacer: BlockItem = {
  title: 'Spacer',
  description: 'Add space between blocks.',
  searchTerms: ['space', 'gap', 'divider'],
  icon: <IconPlaceholder
  lucide="MoveVertical"
  tabler="IconArrowsVertical"
  hugeicons="MoveIcon"
  phosphor="ArrowsVertical"
  remixicon="RiExpandUpDownLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setSpacer({ height: 'sm' }).run();
  },
};

export const divider: BlockItem = {
  title: 'Divider',
  description: 'Add a horizontal divider.',
  searchTerms: ['divider', 'line'],
  icon: <IconPlaceholder
  lucide="Minus"
  tabler="IconMinus"
  hugeicons="MinusSignIcon"
  phosphor="Minus"
  remixicon="RiSubtractLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};
