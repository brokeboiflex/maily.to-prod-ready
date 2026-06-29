import { BlockItem } from './types';
import { CodeXmlIcon } from "lucide-react";

export const htmlCodeBlock: BlockItem = {
  title: 'Custom HTML',
  description: 'Insert a custom HTML block',
  searchTerms: ['html', 'code', 'custom'],
  icon: <CodeXmlIcon className="h-4 w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor
      .chain()
      .focus()
      .deleteRange(range)
      // @ts-ignore
      .setHtmlCodeBlock({ language: 'html' })
      .run();
  },
};
