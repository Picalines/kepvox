import { cn } from '@/lib/classnames'
import { createSlot, useSlots } from '@/lib/slots'
import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentProps, FC } from 'react'

type RootProps = ComponentProps<typeof RadixPopover.Root>
type TriggerProps = ComponentProps<typeof RadixPopover.Trigger>
type ContentProps = ComponentProps<typeof RadixPopover.Content>

const TriggerSlot = createSlot<TriggerProps>('Trigger')
const ContentSlot = createSlot<ContentProps, HTMLDivElement>('Content')

const Root: FC<RootProps> = ({ children, ...props }) => {
  const slots = useSlots({ children })

  const trigger = slots.get(TriggerSlot)
  const content = slots.get(ContentSlot)

  if (!trigger || !content) {
    return null
  }

  return (
    <RadixPopover.Root {...props}>
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
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
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
