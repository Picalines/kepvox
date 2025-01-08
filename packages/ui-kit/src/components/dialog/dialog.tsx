import * as RadixDialog from '@radix-ui/react-dialog'
import type { Overlay } from '@repo/common/typing'
import type { FC, ReactNode } from 'react'
import { Heading } from '#components/heading'
import { XIcon } from '#icons'
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

export type TitleProps = Overlay<
  Heading.TitleProps,
  {
    children: ReactNode
  }
>

export type DescriptionProps = Overlay<
  Heading.DescriptionProps,
  {
    children: ReactNode
  }
>

export type ContentProps = {
  children: ReactNode
  className?: string
  closable?: boolean
  trapFocus?: boolean
}

export const Trigger = createSlot({ name: 'Trigger' }).component<TriggerProps>()
export const Title = createSlot({ name: 'Title' }).component<TitleProps>()
export const Description = createSlot({ name: 'Description' }).component<DescriptionProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()

type OnInteractOutside = NonNullable<RadixDialog.DialogContentProps['onInteractOutside']>

const preventClosing: OnInteractOutside = event => event.preventDefault()

export const Root: FC<RootProps> = props => {
  const { children, ...rootProps } = props

  const { trigger, title, description, content } = useSlots(children, {
    trigger: Trigger,
    title: Title,
    description: Description,
    content: Content,
  })

  const { closable = true, ...contentProps } = content?.props ?? {}

  // TODO: move content to client component, so closable=false
  // would be available in SSR
  const onInteractOutside = closable ? undefined : preventClosing

  return (
    <RadixDialog.Root {...rootProps}>
      {trigger && (
        <RadixDialog.Trigger {...trigger.props} asChild>
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
            className={cn(
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in',
              content.props.className,
            )}
            onInteractOutside={onInteractOutside}
          >
            {(title || description) && (
              <Heading.Root className="mb-2">
                {title && (
                  <Heading.Title {...title.props} ref={title.ref}>
                    <RadixDialog.Title>{title.children}</RadixDialog.Title>
                  </Heading.Title>
                )}
                {description && (
                  <Heading.Description {...description.props} ref={description.ref}>
                    <RadixDialog.Description>{description.children}</RadixDialog.Description>
                  </Heading.Description>
                )}
              </Heading.Root>
            )}
            {content.children}
            {closable ? (
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
