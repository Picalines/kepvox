import { cn } from '@/lib/classnames'
import * as RadixSeparator from '@radix-ui/react-separator'
import { type ComponentProps, forwardRef } from 'react'

type SeparatorProps = ComponentProps<'div'> & {
  asChild?: boolean
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, asChild = false, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <RadixSeparator.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    />
  ),
)

Separator.displayName = 'Separator'

export { Separator, type SeparatorProps }
