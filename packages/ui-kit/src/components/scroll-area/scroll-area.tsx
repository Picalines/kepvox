import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import type { FC, ReactNode } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  className?: string
  children: ReactNode
}

export type ContentProps = {
  children: ReactNode
}

export type BarProps = {
  orientation: 'vertical' | 'horizontal'
}

export const Content = createSlot({ name: 'Content', required: true }).component<ContentProps>()

export const Bar = createSlot({ name: 'Bar', repeatable: true }).component<BarProps>()

export const Root: FC<RootProps> = props => {
  const { className, children } = props

  const { content, bars } = useSlots(children, { content: Content, bars: Bar })

  return (
    <RadixScrollArea.Root className={cn('relative size-full overflow-hidden', className)}>
      <RadixScrollArea.Viewport className="size-full rounded-[inherit]">{content.children}</RadixScrollArea.Viewport>
      {bars.map((bar, index) => (
        <RadixScrollArea.ScrollAreaScrollbar
          key={String(index)}
          orientation={bar.props.orientation}
          className={cn(
            'flex touch-none select-none transition-colors',
            bar.props.orientation === 'vertical' && 'h-full w-3 border-l border-l-transparent p-px',
            bar.props.orientation === 'horizontal' && 'h-3 flex-col border-t border-t-transparent p-px',
            className,
          )}
        >
          <RadixScrollArea.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
        </RadixScrollArea.ScrollAreaScrollbar>
      ))}
    </RadixScrollArea.Root>
  )
}
