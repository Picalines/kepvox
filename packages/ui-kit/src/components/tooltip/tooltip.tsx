import { cn } from '@/lib/classnames'
import { createSlot, useSlots } from '@/lib/slots'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ComponentProps, FC } from 'react'

type RootProps = ComponentProps<typeof RadixTooltip.Root>
type ProviderProps = ComponentProps<typeof RadixTooltip.Provider>
type TriggerProps = ComponentProps<typeof RadixTooltip.Trigger>
type ContentProps = ComponentProps<typeof RadixTooltip.Content>
type ArrowProps = ComponentProps<typeof RadixTooltip.Arrow>

const Provider = RadixTooltip.Provider
Provider.displayName = 'Tooltip.Provider'

const TriggerSlot = createSlot<TriggerProps>('Trigger')
const ContentSlot = createSlot<ContentProps, HTMLDivElement>('Content')
const ArrowSlot = createSlot<ArrowProps>('Arrow')

const Root: FC<RootProps> = ({ children, ...props }) => {
  const slots = useSlots({ children })

  const trigger = slots.get(TriggerSlot)
  const content = slots.get(ContentSlot)
  const arrow = slots.get(ArrowSlot)

  return (
    <RadixTooltip.Root {...props}>
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
            'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 animate-in rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out',
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

export const Tooltip = Object.assign(Root, {
  Provider,
  Trigger: TriggerSlot,
  Content: ContentSlot,
  Arrow: ArrowSlot,
})

export type {
  RootProps as TooltipProps,
  ProviderProps as TooltipProviderProps,
  TriggerProps as TooltipTriggerProps,
  ContentProps as TooltipContentProps,
  ArrowProps as TooltipArrowProps,
}
