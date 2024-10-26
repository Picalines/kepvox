'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import { type ComponentPropsWithoutRef, type FC, type ReactNode, type RefAttributes, useCallback } from 'react'
import { cn } from '~/lib/classnames'
import { createSlot, useSlots } from '~/lib/slots'

type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

type TriggerProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode
  asChild?: boolean
}

type ContentProps = RefAttributes<HTMLDivElement> & {
  children: ReactNode
  asChild?: boolean
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
}

const TriggerSlot = createSlot<TriggerProps>('Trigger')
const ContentSlot = createSlot<ContentProps>('Content')

const Root: FC<RootProps> = props => {
  const { children, onOpen, onClose, ...rootProps } = props

  const slots = useSlots({ children })

  const trigger = slots.get(TriggerSlot)
  const content = slots.get(ContentSlot)

  const onOpenChange = useCallback(
    (opened: boolean) => {
      const handler = opened ? onOpen : onClose
      handler?.()
    },
    [onOpen, onClose],
  )

  if (!trigger || !content) {
    return null
  }

  return (
    <RadixPopover.Root {...rootProps} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger {...trigger.props} ref={trigger.ref}>
        {trigger.children}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="center"
          sideOffset={4}
          {...content.props}
          ref={content.ref}
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

const Popover = Object.assign(Root, {
  Trigger: TriggerSlot,
  Content: ContentSlot,
})

Popover.displayName = 'Popover'

export {
  Popover,
  type RootProps as PopoverProps,
  type TriggerProps as PopoverTriggerProps,
  type ContentProps as PopoverContentProps,
}
