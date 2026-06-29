import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../utils/classname';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const baseClass =
      'mly:inline-flex mly:items-center mly:justify-center mly:rounded-md mly:text-sm mly:font-medium mly:ring-offset-background mly:transition-colors mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-ring mly:focus-visible:ring-offset-2 mly:focus-visible:relative mly:focus-visible:z-10 mly:disabled:opacity-50 ';
    const variantClasses = {
      default:
        'mly:bg-primary mly:text-primary-foreground mly:hover:bg-primary/90',
      destructive:
        'mly:bg-destructive mly:text-white mly:hover:bg-destructive/90',
      outline:
        'mly:border mly:border-input mly:bg-background mly:hover:bg-accent mly:hover:text-accent-foreground',
      secondary:
        'mly:bg-secondary mly:text-secondary-foreground mly:hover:bg-secondary/80',
      ghost:
        'mly:bg-transparent mly:hover:bg-accent mly:hover:text-accent-foreground mly:data-[state=true]:bg-accent mly:data-[state=true]:text-accent-foreground',
      link: 'mly:text-foreground mly:underline-offset-4 mly:hover:underline',
    };
    const sizeClasses = {
      default: 'mly:h-10 mly:px-4 mly:py-2',
      sm: 'mly:h-9 mly:rounded-md mly:px-3',
      lg: 'mly:h-11 mly:rounded-md mly:px-8',
      icon: 'mly:h-10 mly:w-10',
    };

    const classes = cn(
      'mly-editor',
      baseClass,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    return <Comp className={classes} ref={ref} {...props} />;
  }
);

BaseButton.displayName = 'BaseButton';

export { BaseButton };
