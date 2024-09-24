import { XIcon } from '@/icons'
import { cn } from '@/lib/classnames'
import { createSlot, useSlots } from '@/lib/slots'
import * as RadixDialog from '@radix-ui/react-dialog'
import { type FC, type ReactNode, useCallback } from 'react'

type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

type TriggerProps = {
  children: ReactNode
  asChild?: boolean
}

type ContentProps = {
  children: ReactNode
  className?: string
  showClose?: boolean
  trapFocus?: boolean
  closeOnOutside?: boolean
}

const Trigger = createSlot<TriggerProps>('Trigger')
const Content = createSlot<ContentProps>('Content')

type OnInteractOutside = NonNullable<RadixDialog.DialogContentProps['onInteractOutside']>

const Root: FC<RootProps> = props => {
  const { children, onOpen, onClose, ...rootProps } = props

  const slots = useSlots({ children })

  const trigger = slots.get(Trigger)
  const content = slots.get(Content)

  const { showClose = true, closeOnOutside = true, ...contentProps } = content?.props ?? {}

  const onOpenChange = useCallback(
    (opened: boolean) => {
      const handler = opened ? onOpen : onClose
      handler?.()
    },
    [onOpen, onClose],
  )

  const onInteractOutside = useCallback<OnInteractOutside>(
    event => {
      if (!closeOnOutside) {
        event.preventDefault()
      }
    },
    [closeOnOutside],
  )

  return (
    <RadixDialog.Root {...rootProps} onOpenChange={onOpenChange}>
      {trigger && (
        <RadixDialog.Trigger {...trigger.props} ref={trigger.ref}>
          {trigger.children}
        </RadixDialog.Trigger>
      )}
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
          )}
        />
        {content && (
          <RadixDialog.Content
            {...contentProps}
            ref={content.ref}
            className={cn(
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in',
              content.props.className,
            )}
            onInteractOutside={onInteractOutside}
          >
            <div>{content.children}</div>
            {showClose ? (
              <RadixDialog.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </RadixDialog.Close>
            ) : null}
          </RadixDialog.Content>
        )}
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

const Dialog = Object.assign(Root, {
  Trigger,
  Content,
})

export {
  Dialog,
  type RootProps as DialogProps,
  type TriggerProps as DialogTriggerProps,
  type ContentProps as DialogContentProps,
}
