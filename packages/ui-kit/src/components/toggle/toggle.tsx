import { cn } from '~/lib/classnames'
import * as RadixToggle from '@radix-ui/react-toggle'
import { type VariantProps, cva } from 'class-variance-authority'
import { type ComponentProps, forwardRef } from 'react'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium text-sm ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ToggleProps = ComponentProps<'button'> &
  VariantProps<typeof toggleVariants> & {
    onToggle?: (pressed: boolean) => void
    asChild?: boolean
  }

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({ className, variant, size, onToggle, ...props }, ref) => (
  <RadixToggle.Root
    {...props}
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    onPressedChange={onToggle}
  />
))

Toggle.displayName = 'Toggle'

export { Toggle, toggleVariants, type ToggleProps }
