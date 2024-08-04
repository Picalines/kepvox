import { cn } from '@/lib/classnames'
import * as RadixSeparator from '@radix-ui/react-separator'
import { type ComponentProps, type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react'

const Separator = forwardRef<
  ElementRef<typeof RadixSeparator.Root>,
  ComponentPropsWithoutRef<typeof RadixSeparator.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <RadixSeparator.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
    {...props}
  />
))

Separator.displayName = 'Separator'

type SeparatorProps = ComponentProps<typeof Separator>

export { Separator, type SeparatorProps }
