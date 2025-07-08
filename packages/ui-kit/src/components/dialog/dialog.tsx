import * as RadixDialog from '@radix-ui/react-dialog'
import type { Overlay } from '@repo/common/typing'
import type { FC, ReactNode } from 'react'
import { Button } from '#components/button'
import { Heading } from '#components/heading'
import { XIcon } from '#icons'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { DialogContent } from './dialog-content'

export type RootProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  closable?: boolean
  onOpenChange?: (opened: boolean) => void
}

export type TriggerProps = { children: ReactNode }

export type TitleProps = Overlay<Heading.TitleProps, { children: ReactNode }>

export type DescriptionProps = Overlay<Heading.DescriptionProps, { children: ReactNode }>

export type ContentProps = { children: ReactNode }

export type ActionProps = Overlay<
  Pick<Button.RootProps, 'variant' | 'onClick'>,
  {
    children: string | string[]
    close?: boolean
  }
>

export const Trigger = createSlot({ name: 'Trigger' }).component<TriggerProps>()
export const Title = createSlot({ name: 'Title', required: true }).component<TitleProps>()
export const Description = createSlot({ name: 'Description', required: true }).component<DescriptionProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()
export const Action = createSlot({ name: 'Action', repeatable: true }).component<ActionProps>()

export const Root: FC<RootProps> = props => {
  const { children, closable = false, ...rootProps } = props

  const { trigger, title, description, content, actions } = useSlots(children, {
    trigger: Trigger,
    title: Title,
    description: Description,
    content: Content,
    actions: Action,
  })

  const actionButtons = actions.map(({ key, children, props: { close, ...buttonProps } }, index) => {
    const button = (
      <Button.Root variant="primary" {...buttonProps} key={key ?? index}>
        <Button.Text>{children as string}</Button.Text>
      </Button.Root>
    )

    return close ? (
      <RadixDialog.Close key={key ?? index} asChild>
        {button}
      </RadixDialog.Close>
    ) : (
      button
    )
  })

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
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 animate-in bg-black/80 data-[state=closed]:animate-out',
          )}
        />
        {(content || actionButtons.length > 0) && (
          <DialogContent
            overlayClosable={closable}
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-50% data-[state=closed]:slide-out-to-top-50% data-[state=open]:slide-in-from-left-50% data-[state=open]:slide-in-from-top-50% -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 grid w-full max-w-md rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in"
          >
            <Heading.Root>
              <Heading.Title {...title.props} ref={title.ref}>
                <RadixDialog.Title>{title.children}</RadixDialog.Title>
              </Heading.Title>
              <Heading.Description {...description.props} ref={description.ref}>
                <RadixDialog.Description>{description.children}</RadixDialog.Description>
              </Heading.Description>
            </Heading.Root>
            {content && <div className="mt-2">{content.children}</div>}
            {actionButtons.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 max-sm:*:w-full sm:flex-row sm:justify-end">{actionButtons}</div>
            )}
            {closable ? (
              <RadixDialog.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </RadixDialog.Close>
            ) : null}
          </DialogContent>
        )}
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

Root.displayName = 'Dialog'
