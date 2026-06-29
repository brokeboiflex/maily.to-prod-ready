import { IconPlaceholder } from "@/components/icon-placeholder"
import { cn } from '../../utils/classname';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Variable } from './variable';

export type VariableSuggestionsPopoverProps = {
  items: Variable[];
  onSelectItem: (item: Variable) => void;
};

export type VariableSuggestionsPopoverRef = {
  moveUp: () => void;
  moveDown: () => void;
  select: () => void;
};

export type VariableSuggestionsPopoverType = React.ForwardRefExoticComponent<
  VariableSuggestionsPopoverProps &
    React.RefAttributes<VariableSuggestionsPopoverRef>
>;

export const VariableSuggestionsPopover: VariableSuggestionsPopoverType =
  forwardRef((props, ref) => {
    const { items, onSelectItem } = props;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const scrollSelectedIntoView = (index: number) => {
      const container = scrollContainerRef.current;
      const selectedItem = itemRefs.current[index];

      if (!container || !selectedItem) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();

      const padding = 4;
      if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += itemRect.bottom - containerRect.bottom + padding;
      } else if (itemRect.top < containerRect.top) {
        container.scrollTop += itemRect.top - containerRect.top - padding;
      }
    };

    useEffect(() => {
      setSelectedIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      itemRefs.current = items.map(() => null);
    }, [items]);

    useEffect(() => {
      scrollSelectedIntoView(selectedIndex);
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
      moveUp: () => {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
      },
      moveDown: () => {
        setSelectedIndex((selectedIndex + 1) % items.length);
      },
      select: () => {
        const item = items[selectedIndex];
        if (!item) {
          return;
        }

        onSelectItem(item);
      },
    }));

    return (
      <div className="mly:z-50 mly:w-64 mly:rounded-lg mly:border mly:border-border mly:bg-popover mly:text-popover-foreground mly:shadow-md mly:transition-all">
        <div className="mly:flex mly:items-center mly:justify-between mly:gap-2 mly:border-b mly:border-border mly:bg-muted/40 mly:px-1 mly:py-1.5 mly:text-muted-foreground">
          <span className="mly:text-xs mly:uppercase">Variables</span>
          <VariableIcon>
            <IconPlaceholder
  lucide="Braces"
  tabler="IconBraces"
  hugeicons="BracesIcon"
  phosphor="BracketsCurly"
  remixicon="RiBracesLine"
  className="mly:size-3 mly:stroke-[2.5]"
/>
          </VariableIcon>
        </div>

        <div
          ref={scrollContainerRef}
          className="mly:max-h-52 mly:overflow-y-auto mly:scrollbar-thin mly:scrollbar-track-transparent mly:scrollbar-thumb-gray-200"
        >
          <div className="mly:flex mly:w-fit mly:min-w-full mly:flex-col mly:gap-0.5 mly:p-1">
            {items?.length ? (
              items?.map((item, index: number) => (
                <button
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => onSelectItem(item)}
                  className={cn(
                    'mly:flex mly:w-fit mly:min-w-full mly:items-center mly:gap-2 mly:rounded-md mly:px-2 mly:py-1 mly:text-left mly:font-mono mly:text-sm mly:text-foreground mly:hover:bg-accent mly:hover:text-accent-foreground',
                    index === selectedIndex
                      ? 'mly:bg-accent'
                      : 'mly:bg-popover mly:text-popover-foreground'
                  )}
                >
                  <IconPlaceholder
  lucide="Braces"
  tabler="IconBraces"
  hugeicons="BracesIcon"
  phosphor="BracketsCurly"
  remixicon="RiBracesLine"
  className="mly:size-3 mly:stroke-[2.5] mly:text-rose-600"
/>
                  {item?.label || item.name}
                </button>
              ))
            ) : (
              <div className="mly:flex mly:h-7 mly:w-full mly:items-center mly:gap-2 mly:rounded-md mly:px-2 mly:py-1 mly:text-left mly:font-mono mly:text-[13px] mly:text-foreground mly:hover:bg-accent mly:hover:text-accent-foreground">
                No result
              </div>
            )}
          </div>
        </div>

        <div className="mly:flex mly:items-center mly:justify-between mly:gap-2 mly:border-t mly:border-border mly:px-1 mly:py-1.5 mly:text-muted-foreground">
          <div className="mly:flex mly:items-center mly:gap-1">
            <VariableIcon>
              <IconPlaceholder
  lucide="ArrowDownIcon"
  tabler="IconArrowDown"
  hugeicons="ArrowDown01Icon"
  phosphor="ArrowDown"
  remixicon="RiArrowDownLine"
  className="mly:size-3 mly:stroke-[2.5]"
/>
            </VariableIcon>
            <VariableIcon>
              <IconPlaceholder
  lucide="ArrowUpIcon"
  tabler="IconArrowUp"
  hugeicons="ArrowUp01Icon"
  phosphor="ArrowUp"
  remixicon="RiArrowUpLine"
  className="mly:size-3 mly:stroke-[2.5]"
/>
            </VariableIcon>
            <span className="mly:text-xs mly:text-muted-foreground">Navigate</span>
          </div>
          <VariableIcon>
            <IconPlaceholder
  lucide="CornerDownLeftIcon"
  tabler="IconCornerDownLeft"
  hugeicons="CornerDownLeftIcon"
  phosphor="ArrowBendDownLeft"
  remixicon="RiCornerDownLeftLine"
  className="mly:size-3 mly:stroke-[2.5]"
/>
          </VariableIcon>
        </div>
      </div>
    );
  });

type VariableIconProps = {
  className?: string;
  children: React.ReactNode;
};

function VariableIcon(props: VariableIconProps) {
  const { className, children } = props;

  return (
    <div
      className={cn(
        'mly:flex mly:size-5 mly:items-center mly:justify-center mly:rounded-md mly:border mly:border-border',
        className
      )}
    >
      {children}
    </div>
  );
}
