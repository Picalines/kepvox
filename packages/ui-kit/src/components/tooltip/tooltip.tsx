import { cn } from '~/lib/classnames'
import { createSlot, useSlots } from '~/lib/slots'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { type ComponentProps, type FC, type ReactNode, useCallback } from 'react'

type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  delayDuration?: number
  onOpen?: () => void
  onClose?: () => void
}

type ProviderProps = {
  children: ReactNode
  delayDuration?: number
}

type TriggerProps = ComponentProps<'button'> & {
  children: ReactNode
  asChild?: boolean
}

type ContentProps = ComponentProps<'div'> & {
  children: ReactNode
  asChild?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
}

type ArrowProps = ComponentProps<'svg'> & {
  asChild?: boolean
  width?: number
  height?: number
}

const Provider: FC<ProviderProps> = RadixTooltip.Provider
Provider.displayName = 'Tooltip.Provider'

const TriggerSlot = createSlot<TriggerProps>('Trigger')
const ContentSlot = createSlot<ContentProps>('Content')
const ArrowSlot = createSlot<ArrowProps>('Arrow')

const Root: FC<RootProps> = props => {
  const { children, onOpen, onClose, ...rootProps } = props

  const slots = useSlots({ children })

  const trigger = slots.get(TriggerSlot)
  const content = slots.get(ContentSlot)
  const arrow = slots.get(ArrowSlot)

  const onOpenChange = useCallback(
    (opened: boolean) => {
      const handler = opened ? onOpen : onClose
      handler?.()
    },
    [onOpen, onClose],
  )

  return (
    <RadixTooltip.Root {...rootProps} onOpenChange={onOpenChange}>
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

const Tooltip = Object.assign(Root, {
  Provider,
  Trigger: TriggerSlot,
  Content: ContentSlot,
  Arrow: ArrowSlot,
})

export {
  Tooltip,
  type RootProps as TooltipProps,
  type ProviderProps as TooltipProviderProps,
  type TriggerProps as TooltipTriggerProps,
  type ContentProps as TooltipContentProps,
  type ArrowProps as TooltipArrowProps,
}
