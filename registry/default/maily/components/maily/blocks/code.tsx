import { IconPlaceholder } from "@/components/icon-placeholder"

import { BlockItem } from './types';

export const htmlCodeBlock: BlockItem = {
  title: 'Custom HTML',
  description: 'Insert a custom HTML block',
  searchTerms: ['html', 'code', 'custom'],
  icon: <IconPlaceholder
  lucide="CodeXmlIcon"
  tabler="IconCode"
  hugeicons="SourceCodeIcon"
  phosphor="Code"
  remixicon="RiCodeLine"
  className="mly:h-4 mly:w-4"
/>,
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
