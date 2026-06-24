import { IconPlaceholder } from "@/components/icon-placeholder"
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';


export function RepeatView(props: NodeViewProps) {
  const { editor, getPos } = props;

  return (
    <NodeViewWrapper
      data-type="repeat"
      draggable={editor.isEditable}
      data-drag-handle={editor.isEditable}
      className="mly:relative"
    >
      <NodeViewContent className="is-editable" />

      <div
        role="button"
        data-repeat-indicator=""
        className="mly:absolute mly:inset-y-0 mly:right-0 mly:flex mly:translate-x-full mly:cursor-pointer mly:flex-col mly:items-center mly:gap-1 mly:opacity-60"
        contentEditable={false}
        onClick={() => {
          editor.commands.setNodeSelection(getPos());
        }}
      >
        <IconPlaceholder
  lucide="Repeat2"
  tabler="IconRepeat"
  hugeicons="RepeatIcon"
  phosphor="Repeat"
  remixicon="RiRepeatLine"
  className="mly:size-3 mly:stroke-[2.5] mly:text-midnight-gray"
/>
        <div className="mly:w-[1.5px] mly:grow mly:rounded-full mly:bg-rose-300" />
      </div>
    </NodeViewWrapper>
  );
}
