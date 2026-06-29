import { IconPlaceholder } from "@/components/icon-placeholder"
import { button, linkCard } from '../../../blocks/button';
import { htmlCodeBlock } from '../../../blocks/code';
import { image, inlineImage, logo } from '../../../blocks/image';
import { columns, divider, repeat, section, spacer } from '../../../blocks/layout';
import { bulletList, orderedList } from '../../../blocks/list';
import { BlockGroupItem } from '../../../blocks/types';
import {
  blockquote,
  clearLine,
  footer,
  hardBreak,
  heading1,
  heading2,
  heading3,
  text,
} from '../../../blocks/typography';
import {
  headerLogoWithCoverImage,
  headerLogoWithTextHorizontal,
  headerLogoWithTextVertical,
} from '../../../blocks/headers';
import {
  footerCopyrightText,
  footerCommunityFeedbackCta,
  footerCompanySignature,
} from '../../../blocks/footers';

export const DEFAULT_SLASH_COMMANDS: BlockGroupItem[] = [
  {
    title: 'Blocks',
    commands: [
      text,
      heading1,
      heading2,
      heading3,
      bulletList,
      orderedList,
      image,
      logo,
      inlineImage,
      columns,
      section,
      repeat,
      divider,
      spacer,
      button,
      linkCard,
      hardBreak,
      blockquote,
      footer,
      clearLine,
    ],
  },
  {
    title: 'Components',
    commands: [
      {
        id: 'headers',
        title: 'Headers',
        description: 'Add pre-designed headers block',
        searchTerms: ['header', 'headers'],
        icon: <IconPlaceholder
  lucide="Heading1"
  tabler="IconH1"
  hugeicons="Heading01Icon"
  phosphor="TextHOne"
  remixicon="RiHeading"
  className="h-4 w-4"
/>,
        preview: 'https://cdn.usemaily.com/previews/header-preview-xyz.png',
        commands: [
          headerLogoWithTextVertical,
          headerLogoWithTextHorizontal,
          headerLogoWithCoverImage,
        ],
      },
      {
        id: 'footers',
        title: 'Footers',
        description: 'Add pre-designed footers block',
        searchTerms: ['footers'],
        icon: <IconPlaceholder
  lucide="FootprintsIcon"
  tabler="IconWalk"
  hugeicons="FootprintsIcon"
  phosphor="Footprints"
  remixicon="RiFootprintLine"
  className="h-4 w-4"
/>,
        commands: [
          footerCopyrightText,
          footerCommunityFeedbackCta,
          footerCompanySignature,
        ],
      },
      htmlCodeBlock,
    ],
  },
];
