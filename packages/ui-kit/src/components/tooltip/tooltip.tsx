import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ComponentProps, FC, ReactNode } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type ProviderProps = {
  children: ReactNode
  delayDuration?: number
}

export const Provider: FC<ProviderProps> = props => <RadixTooltip.Provider {...props} />

Provider.displayName = 'Tooltip.Provider'

export type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  delayDuration?: number
  onOpenChange?: (opened: boolean) => void
}

export type TriggerProps = ComponentProps<'button'> & {
  children: ReactNode
  asChild?: boolean
}

export type ContentProps = ComponentProps<'div'> & {
  children: ReactNode
  asChild?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
}

export type ArrowProps = ComponentProps<'svg'> & {
  asChild?: boolean
  width?: number
  height?: number
}

export const Trigger = createSlot<TriggerProps>('Trigger')
export const Content = createSlot<ContentProps>('Content')
export const Arrow = createSlot<ArrowProps>('Arrow')

export const Root: FC<RootProps> = props => {
  const { children, ...rootProps } = props

  const slots = useSlots({ children })

  const trigger = slots.get(Trigger)
  const content = slots.get(Content)
  const arrow = slots.get(Arrow)

  return (
    <RadixTooltip.Root {...rootProps}>
      {trigger && (
        <RadixTooltip.Trigger {...trigger.props} ref={trigger.ref}>
          {trigger.children}
        </RadixTooltip.Trigger>
      )}

      {content && (
        <RadixTooltip.Content
          sideOffset={4}
          {...content.props}
          ref={content.ref}
          className={cn(
            'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 animate-in rounded-md border border-border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-sm data-[state=closed]:animate-out',
            content.props.className,
          )}
        >
          {content.children}

          {arrow && (
            <RadixTooltip.Arrow {...arrow.props} ref={arrow.ref} className={cn('fill-border', arrow.props.className)} />
          )}
        </RadixTooltip.Content>
      )}
    </RadixTooltip.Root>
  )
}
