import { IconPlaceholder } from "@/components/icon-placeholder"
import { LockOpenIcon } from "lucide-react"

import { BaseButton } from '../base-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type LockAspectRatioButtonProps = {
  onClick: () => void;
  isLocked: boolean;
};

export function LockAspectRatioButton(props: LockAspectRatioButtonProps) {
  const { onClick, isLocked } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BaseButton
          variant="ghost"
          size="sm"
          type="button"
          className="mly:size-7"
          data-state={isLocked}
          onClick={onClick}
        >
          {isLocked ? (
            <IconPlaceholder
  lucide="LockIcon"
  tabler="IconLock"
  hugeicons="LockIcon"
  phosphor="Lock"
  remixicon="RiLockLine"
  className="mly:h-3 mly:w-3 mly:shrink-0 mly:stroke-[2.5] mly:text-foreground"
/>
          ) : (
            <LockOpenIcon className="mly:h-3 mly:w-3 mly:shrink-0 mly:stroke-[2.5] mly:text-foreground" />
          )}
        </BaseButton>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>
        {isLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
      </TooltipContent>
    </Tooltip>
  );
}
