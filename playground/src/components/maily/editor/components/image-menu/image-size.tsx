import { AUTOCOMPLETE_PASSWORD_MANAGERS_OFF } from '../../utils/constants';

type ImageSizeProps = {
  value: string;
  onValueChange: (value: string) => void;
  dimension: 'width' | 'height';
};

export function ImageSize(props: ImageSizeProps) {
  const { value, onValueChange, dimension } = props;

  return (
    <label className="relative flex items-center">
      <span className="text-muted-foreground absolute inset-y-0 left-2 flex items-center text-xs leading-none">
        {dimension === 'width' ? 'W' : 'H'}
      </span>
      <input
        {...AUTOCOMPLETE_PASSWORD_MANAGERS_OFF}
        className="h-auto max-w-20 [appearance:textfield] appearance-none border-0 border-none p-1 px-[26px] text-sm uppercase tabular-nums outline-hidden focus-visible:outline-hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
      <span className="text-muted-foreground absolute inset-y-0 right-1 flex items-center text-xs leading-none">
        PX
      </span>
    </label>
  );
}
