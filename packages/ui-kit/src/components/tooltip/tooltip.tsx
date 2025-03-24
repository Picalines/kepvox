import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { OmitExisting, Overlay } from '@repo/common/typing'
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

export type TriggerProps = {
  children: ReactNode
}

export type ContentProps = Overlay<
  ComponentProps<'div'>,
  {
    children: ReactNode
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
    align?: 'start' | 'center' | 'end'
    alignOffset?: number
  }
>

export type ArrowProps = Overlay<
  OmitExisting<ComponentProps<'svg'>, 'children'>,
  {
    width?: number
    height?: number
  }
>

export const Trigger = createSlot({ name: 'Trigger' }).component<TriggerProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()
export const Arrow = createSlot({ name: 'Arrow' }).component<ArrowProps>()

export const Root: FC<RootProps> = props => {
  const { children, ...rootProps } = props

  const { trigger, content, arrow } = useSlots(children, { trigger: Trigger, content: Content, arrow: Arrow })

  return (
    <RadixTooltip.Root {...rootProps}>
      {trigger && (
        <RadixTooltip.Trigger {...trigger.props} asChild>
          {trigger.children}
        </RadixTooltip.Trigger>
      )}

      {content && (
        <RadixTooltip.Content
          sideOffset={4}
          {...content.props}
          ref={content.ref}
          asChild={false}
          className={cn(
            'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 animate-in rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-xs data-[state=closed]:animate-out',
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

Root.displayName = 'Tooltip'
