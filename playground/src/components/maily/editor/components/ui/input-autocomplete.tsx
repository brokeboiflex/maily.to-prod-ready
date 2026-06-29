import { VariableSuggestionsPopoverRef } from '../../nodes/variable/variable-suggestions-popover';
import { cn } from '../../utils/classname';
import { AUTOCOMPLETE_PASSWORD_MANAGERS_OFF } from '../../utils/constants';
import { useVariableOptions } from '../../utils/node-options';
import { useOutsideClick } from '../../utils/use-outside-click';
import { Editor } from '@tiptap/core';

import { forwardRef, HTMLAttributes, useRef } from 'react';
import { CornerDownLeft } from "lucide-react";

type InputAutocompleteProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  onValueChange: (value: string) => void;

  autoCompleteOptions?: string[];
  onSelectOption?: (option: string) => void;

  onOutsideClick?: () => void;
  triggerChar?: string;
  placeholder?: string;

  editor: Editor;
};

export const InputAutocomplete = forwardRef<
  HTMLInputElement,
  InputAutocompleteProps
>((props, ref) => {
  const {
    value = '',
    onValueChange,
    className,
    onOutsideClick,
    onSelectOption,
    autoCompleteOptions = [],
    triggerChar = '',
    editor,
    ...inputProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<VariableSuggestionsPopoverRef>(null);
  const VariableSuggestionPopoverComponent =
    useVariableOptions(editor)?.variableSuggestionsPopover;

  useOutsideClick(containerRef, () => {
    onOutsideClick?.();
  });

  const isTriggeringVariable = value.startsWith(triggerChar);

  return (
    <div className={cn('mly:relative')} ref={containerRef}>
      <label className="mly:relative">
        <input
          {...AUTOCOMPLETE_PASSWORD_MANAGERS_OFF}
          placeholder="e.g. items"
          type="text"
          {...inputProps}
          ref={ref}
          value={value}
          onChange={(e) => {
            onValueChange(e.target.value);
          }}
          className={cn(
            'mly:h-7 mly:w-40 mly:rounded-md mly:bg-transparent mly:px-2 mly:pr-6 mly:text-sm mly:text-foreground mly:hover:bg-accent mly:hover:text-accent-foreground mly:focus:bg-accent mly:focus:outline-hidden',
            className
          )}
          onKeyDown={(e) => {
            if (!popoverRef.current || !isTriggeringVariable) {
              return;
            }
            const { moveUp, moveDown, select } = popoverRef.current;

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              moveDown();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              moveUp();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              select();
            }
          }}
          spellCheck={false}
        />
        <div className="mly:absolute mly:inset-y-0 mly:right-1 mly:flex mly:items-center">
          <CornerDownLeft className="mly:h-3 mly:w-3 mly:stroke-[2.5] mly:text-muted-foreground" />
        </div>
      </label>

      {isTriggeringVariable && (
        <div className="mly:absolute mly:left-0 mly:top-8">
          <VariableSuggestionPopoverComponent
            items={autoCompleteOptions.map((option) => {
              return {
                name: option,
              };
            })}
            onSelectItem={(item) => {
              onSelectOption?.(item.name);
            }}
            ref={popoverRef}
          />
        </div>
      )}
    </div>
  );
});

InputAutocomplete.displayName = 'InputAutocomplete';
