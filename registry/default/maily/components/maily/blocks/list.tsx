import { List, ListOrdered } from "lucide-react"
import type { BlockItem } from './types';

export const bulletList: BlockItem = {
  title: 'Bullet List',
  description: 'Create a simple bullet list.',
  searchTerms: ['unordered', 'point'],
  icon: <List className="h-4 w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).toggleBulletList().run();
  },
};

export const orderedList: BlockItem = {
  title: 'Numbered List',
  description: 'Create a list with numbering.',
  searchTerms: ['ordered'],
  icon: <ListOrdered className="h-4 w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};
