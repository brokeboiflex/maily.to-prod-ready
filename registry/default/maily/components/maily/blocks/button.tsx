import { IconPlaceholder } from "@/components/icon-placeholder"
import type { BlockItem } from './types';

export const button: BlockItem = {
  title: 'Button',
  description: 'Add a call to action button to email.',
  searchTerms: ['link', 'button', 'cta'],
  icon: <IconPlaceholder
  lucide="MousePointer"
  tabler="IconPointer"
  hugeicons="Cursor01Icon"
  phosphor="Cursor"
  remixicon="RiCursorLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setButton().run();
  },
};

export const linkCard: BlockItem = {
  title: 'Link Card',
  description: 'Add a link card to email.',
  searchTerms: ['link', 'button', 'image'],
  icon: <IconPlaceholder
  lucide="ArrowUpRightSquare"
  tabler="IconExternalLink"
  hugeicons="ArrowUpRight01Icon"
  phosphor="ArrowUpRight"
  remixicon="RiArrowRightUpLine"
  className="h-4 w-4"
/>,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setLinkCard().run();
  },
  render: (editor) => {
    return editor.extensionManager.extensions.findIndex(
      (ext) => ext.name === 'linkCard'
    ) === -1
      ? null
      : true;
  },
};
