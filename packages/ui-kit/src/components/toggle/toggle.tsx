import * as RadixToggle from '@radix-ui/react-toggle'
import type { Overlay } from '@repo/common/typing'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { cn } from '#lib/classnames'

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md border-input font-medium text-sm ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        ghost: 'bg-transparent',
        outline: 'border bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 px-2.5',
        md: 'h-10 px-3',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

export type ToggleProps = Overlay<
  ComponentProps<'button'>,
  VariantProps<typeof toggleVariants>,
  {
    onToggle?: (pressed: boolean) => void
  }
>

export const Toggle: FC<ToggleProps> = ({ className, variant, size, onToggle, ...props }) => (
  <RadixToggle.Root
    {...props}
    asChild={false}
    className={cn(toggleVariants({ variant, size, className }))}
    onPressedChange={onToggle}
  />
)
