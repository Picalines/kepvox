import * as RadixPopover from '@radix-ui/react-popover'
import { type ComponentPropsWithoutRef, type FC, type ReactNode, type RefObject, useCallback } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export type TriggerProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode
  asChild?: boolean
}

export type ContentProps = {
  children: ReactNode
  ref?: RefObject<HTMLDivElement>
  asChild?: boolean
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
}

export const Trigger = createSlot<TriggerProps>('Trigger')
export const Content = createSlot<ContentProps>('Content')

export const Root: FC<RootProps> = props => {
  const { children, onOpen, onClose, ...rootProps } = props

  const slots = useSlots({ children })

  const trigger = slots.get(Trigger)
  const content = slots.get(Content)

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
      <RadixPopover.Trigger {...trigger.props}>{trigger.children}</RadixPopover.Trigger>
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
