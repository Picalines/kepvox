import * as RadixPopover from '@radix-ui/react-popover'
import type { FC, ReactNode, RefObject } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (opened: boolean) => void
}

export type TriggerProps = {
  children: ReactNode
}

export type ContentProps = {
  children: ReactNode
  ref?: RefObject<HTMLDivElement>
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
}

export const Trigger = createSlot({ name: 'Trigger' }).component<TriggerProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()

export const Root: FC<RootProps> = props => {
  const { children, ...rootProps } = props

  const { trigger, content } = useSlots(children, { trigger: Trigger, content: Content })

  if (!trigger || !content) {
    return null
  }

  return (
    <RadixPopover.Root {...rootProps}>
      <RadixPopover.Trigger {...trigger.props} asChild>
        {trigger.children}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="center"
          sideOffset={4}
          {...content.props}
          ref={content.ref}
          asChild={false}
          className={cn(
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-sm outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
            content.props.className,
          )}
        >
          {content.children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
