import { cn } from '../../utils/classname';
import { BubbleMenu } from '@tiptap/react';

import { useCallback } from 'react';
import { sticky } from 'tippy.js';
import { getRenderContainer } from '../../utils/get-render-container';
import { ShowPopover } from '../show-popover';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useHtmlState } from './use-html-state';
import { CodeXmlIcon, ViewIcon } from "lucide-react";

export function HTMLBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const state = useHtmlState(editor);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'htmlCodeBlock');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      return editor.isActive('htmlCodeBlock');
    },
    tippyOptions: {
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      appendTo: () => appendTo?.current,
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: 'auto',
    },
    pluginKey: 'htmlCodeBlockBubbleMenu',
  };

  const { activeTab = 'code' } = state;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly:flex mly:items-stretch mly:rounded-lg mly:border mly:border-border mly:bg-popover mly:text-popover-foreground mly:p-0.5 mly:shadow-md"
    >
      <TooltipProvider>
        <div className="mly:flex mly:items-center mly:h-7 mly:rounded-md mly:bg-accent mly:px-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'mly:flex mly:size-6 mly:shrink-0 mly:items-center mly:justify-center mly:rounded mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-ring mly:focus-visible:ring-offset-2',
                  activeTab === 'code' && 'mly:bg-popover mly:text-popover-foreground'
                )}
                disabled={activeTab === 'code'}
                onClick={() => {
                  editor?.commands?.updateHtmlCodeBlock({
                    activeTab: 'code',
                  });
                }}
              >
                <CodeXmlIcon className="mly:size-3 mly:shrink-0 mly:stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>HTML Code</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'mly:flex mly:size-6 mly:shrink-0 mly:items-center mly:justify-center mly:rounded mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-ring mly:focus-visible:ring-offset-2',
                  activeTab === 'preview' && 'mly:bg-popover mly:text-popover-foreground'
                )}
                disabled={activeTab === 'preview'}
                onClick={() => {
                  editor?.commands?.updateHtmlCodeBlock({
                    activeTab: 'preview',
                  });
                }}
              >
                <ViewIcon className="mly:size-3 mly:shrink-0 mly:stroke-[2.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Preview</TooltipContent>
          </Tooltip>
        </div>
        <Divider />
        <ShowPopover
          showIfKey={state.currentShowIfKey}
          onShowIfKeyValueChange={(value) => {
            editor.commands.updateHtmlCodeBlock({
              showIfKey: value,
            });
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
